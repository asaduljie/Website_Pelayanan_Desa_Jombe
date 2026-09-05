import prisma from '../config/db';
import { decryptData, encryptData } from '../utils/crypto';

type BaileysPrimitives = {
  BufferJSON: { replacer: (key: string, value: unknown) => unknown; reviver: (key: string, value: unknown) => unknown };
  initAuthCreds: () => any;
  proto: any;
};

const CREDS_KEY = 'baileys:creds';
let tableReady: Promise<void> | null = null;

const ensureTable = (): Promise<void> => {
  if (!tableReady) {
    tableReady = prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "WhatsAppSession" ("key" TEXT PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)'
    ).then(() => undefined);
  }
  return tableReady;
};

const read = async (key: string, helpers: BaileysPrimitives): Promise<any | null> => {
  await ensureTable();
  const rows = await prisma.$queryRawUnsafe<Array<{ value: string }>>(
    'SELECT "value" FROM "WhatsAppSession" WHERE "key" = $1 LIMIT 1', key
  );
  if (!rows[0]) return null;
  return JSON.parse(decryptData(rows[0].value), helpers.BufferJSON.reviver);
};

const write = async (key: string, value: unknown, helpers: BaileysPrimitives): Promise<void> => {
  await ensureTable();
  const serialized = encryptData(JSON.stringify(value, helpers.BufferJSON.replacer));
  await prisma.$executeRawUnsafe(
    'INSERT INTO "WhatsAppSession" ("key", "value", "updatedAt") VALUES ($1, $2, NOW()) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW()',
    key,
    serialized
  );
};

const remove = async (key: string): Promise<void> => {
  await ensureTable();
  await prisma.$executeRawUnsafe('DELETE FROM "WhatsAppSession" WHERE "key" = $1', key);
};

/**
 * Baileys-compatible auth state backed by PostgreSQL. Unlike
 * useMultiFileAuthState, it survives redeploys and ephemeral containers.
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
  await ensureTable();
  await prisma.$executeRawUnsafe('DELETE FROM "WhatsAppSession"');
};
