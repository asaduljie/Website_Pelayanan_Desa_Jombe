import { Pool } from 'pg';
import { decryptData, encryptData } from '../utils/crypto';

type BaileysPrimitives = {
  BufferJSON: { replacer: (key: string, value: unknown) => unknown; reviver: (key: string, value: unknown) => unknown };
  initAuthCreds: () => any;
  proto: any;
};

const CREDS_KEY = 'baileys:creds';
const memStore: Record<string, string> = {};

let pool: Pool | null = null;
const getPool = (): Pool | null => {
  if (!pool && process.env.DATABASE_URL) {
    try {
      const connStr = process.env.DATABASE_URL;
      const isLocal = connStr.includes('localhost') || connStr.includes('127.0.0.1');
      pool = new Pool({
        connectionString: connStr,
        ssl: isLocal ? false : { rejectUnauthorized: false },
        max: 5,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
      });
      pool.on('error', (err) => {
        console.warn('⚠️ [WhatsAppAuthStore] PostgreSQL Pool notice:', err.message);
      });
    } catch (e) {
      pool = null;
    }
  }
  return pool;
};

let tableReady: Promise<void> | null = null;
const ensureTable = async (): Promise<void> => {
  if (!tableReady) {
    tableReady = (async () => {
      const p = getPool();
      if (!p) return;
      try {
        await p.query(
          'CREATE TABLE IF NOT EXISTS "WhatsAppSession" ("key" TEXT PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)'
        );
      } catch (e) { }
    })();
  }
  return tableReady;
};

const read = async (key: string, helpers: BaileysPrimitives): Promise<any | null> => {
  try {
    await ensureTable();
    const p = getPool();
    if (p) {
      const res = await p.query('SELECT "value" FROM "WhatsAppSession" WHERE "key" = $1 LIMIT 1', [key]);
      if (res.rows.length > 0 && res.rows[0].value) {
        return JSON.parse(decryptData(res.rows[0].value), helpers.BufferJSON.reviver);
      }
    }
  } catch (e) { }

  if (memStore[key]) {
    try {
      return JSON.parse(decryptData(memStore[key]), helpers.BufferJSON.reviver);
    } catch (err) { }
  }
  return null;
};

const write = async (key: string, value: unknown, helpers: BaileysPrimitives): Promise<void> => {
  try {
    const serialized = encryptData(JSON.stringify(value, helpers.BufferJSON.replacer));
    memStore[key] = serialized;

    await ensureTable();
    const p = getPool();
    if (p) {
      await p.query(
        'INSERT INTO "WhatsAppSession" ("key", "value", "updatedAt") VALUES ($1, $2, NOW()) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW()',
        [key, serialized]
      );
    }
  } catch (e) { }
};

const remove = async (key: string): Promise<void> => {
  delete memStore[key];
  try {
    await ensureTable();
    const p = getPool();
    if (p) {
      await p.query('DELETE FROM "WhatsAppSession" WHERE "key" = $1', [key]);
    }
  } catch (e) { }
};

/**
 * Baileys-compatible auth state backed by PostgreSQL (using native JS pg driver).
 * Completely immune to C++ native libssl/openssl binary mismatches.
 */
export const usePostgresAuthState = async (helpers: BaileysPrimitives) => {
  const creds = (await read(CREDS_KEY, helpers)) || helpers.initAuthCreds();

  return {
    state: {
      creds,
      keys: {
        get: async (type: string, ids: string[]) => {
          const data: Record<string, unknown> = {};
          await Promise.all(ids.map(async (id) => {
            let value = await read(`baileys:key:${type}:${id}`, helpers);
            if (type === 'app-state-sync-key' && value) {
              value = helpers.proto.Message.AppStateSyncKeyData.fromObject(value);
            }
            if (value) data[id] = value;
          }));
          return data;
        },
        set: async (data: Record<string, Record<string, unknown>>) => {
          const changes: Promise<void>[] = [];
          for (const type of Object.keys(data)) {
            for (const id of Object.keys(data[type])) {
              const key = `baileys:key:${type}:${id}`;
              const value = data[type][id];
              changes.push(value ? write(key, value, helpers) : remove(key));
            }
          }
          await Promise.all(changes);
        },
      },
    },
    saveCreds: () => write(CREDS_KEY, creds, helpers),
  };
};

export const clearPostgresAuthState = async (): Promise<void> => {
  for (const k in memStore) delete memStore[k];
  try {
    await ensureTable();
    const p = getPool();
    if (p) {
      await p.query('DELETE FROM "WhatsAppSession"');
    }
  } catch (e) { }
};
