import prisma from '../config/db';
import { decryptData, encryptData } from '../utils/crypto';

type BaileysPrimitives = {
  BufferJSON: { replacer: (key: string, value: unknown) => unknown; reviver: (key: string, value: unknown) => unknown };
  initAuthCreds: () => any;
  proto: any;
};

const CREDS_KEY = 'baileys:creds';
const memStore: Record<string, string> = {};

const ensureTable = async (): Promise<void> => {
  try {
    await prisma.$executeRawUnsafe(
      'CREATE TABLE IF NOT EXISTS "WhatsAppSession" ("key" TEXT PRIMARY KEY, "value" TEXT NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP)'
    );
  } catch (e: any) { }
};

const read = async (key: string, helpers: BaileysPrimitives): Promise<any | null> => {
  try {
    const row = await (prisma as any).whatsAppSession?.findUnique({ where: { key } }).catch(async () => {
      const rows = await prisma.$queryRawUnsafe<Array<{ value: string }>>(
        'SELECT "value" FROM "WhatsAppSession" WHERE "key" = $1 LIMIT 1', key
      );
      return rows[0] || null;
    });

    if (row && row.value) {
      return JSON.parse(decryptData(row.value), helpers.BufferJSON.reviver);
    }
  } catch (e) {
    if (memStore[key]) {
      try {
        return JSON.parse(decryptData(memStore[key]), helpers.BufferJSON.reviver);
      } catch (err) { }
    }
  }
  return null;
};

const write = async (key: string, value: unknown, helpers: BaileysPrimitives): Promise<void> => {
  try {
    const serialized = encryptData(JSON.stringify(value, helpers.BufferJSON.replacer));
    memStore[key] = serialized;

    await (prisma as any).whatsAppSession?.upsert({
      where: { key },
      create: { key, value: serialized },
      update: { value: serialized, updatedAt: new Date() },
    }).catch(async () => {
      await ensureTable();
      await prisma.$executeRawUnsafe(
        'INSERT INTO "WhatsAppSession" ("key", "value", "updatedAt") VALUES ($1, $2, NOW()) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value", "updatedAt" = NOW()',
        key,
        serialized
      );
    });
  } catch (e) { }
};

const remove = async (key: string): Promise<void> => {
  delete memStore[key];
  try {
    await (prisma as any).whatsAppSession?.delete({ where: { key } }).catch(async () => {
      await prisma.$executeRawUnsafe('DELETE FROM "WhatsAppSession" WHERE "key" = $1', key);
    });
  } catch (e) { }
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
  for (const k in memStore) delete memStore[k];
  try {
    await (prisma as any).whatsAppSession?.deleteMany().catch(async () => {
      await prisma.$executeRawUnsafe('DELETE FROM "WhatsAppSession"');
    });
  } catch (e) { }
};
