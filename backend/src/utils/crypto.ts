import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.ENCRYPTION_KEY || '32_bytes_secret_key_for_aes_256_gcm_jombe';

// Ensure 32 bytes key
const getValidKey = (): Buffer => {
  return crypto.createHash('sha256').update(String(SECRET_KEY)).digest();
};

export const encryptData = (text: string): string => {
  if (!text) return text;
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, getValidKey(), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decryptData = (encryptedText: string): string => {
  if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) return encryptedText;
    const [ivHex, authTagHex, encrypted] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, getValidKey(), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    // If not encrypted or invalid key fallback
    return encryptedText;
  }
};
