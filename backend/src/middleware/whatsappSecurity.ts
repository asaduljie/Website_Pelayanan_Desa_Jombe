import fs from 'fs';
import path from 'path';

export interface SecurityCheckResult {
  allowed: boolean;
  blockReason?: string;
  sanitizedText: string;
  isSpamWarning?: boolean;
}

export interface SecurityIncident {
  id: string;
  timestamp: string;
  phone: string;
  incidentType: 'RATE_LIMIT_FLOOD' | 'INJECTION_ATTEMPT' | 'MALICIOUS_FILE' | 'INVALID_NIK_BURST';
  details: string;
  actionTaken: 'THROTTLED' | 'BLOCKED' | 'SANITIZED';
}

// In-Memory Rate Limiting Tracker per Phone Number
interface RateLimitTracker {
  timestamps: number[];
  infractions: number;
  blockedUntil?: number;
}

const rateLimitMap: Record<string, RateLimitTracker> = {};
const MAX_MESSAGES_PER_WINDOW = 8; // Max 8 pesan
const WINDOW_MS = 10 * 1000; // per 10 detik
const THROTTLE_PENALTY_MS = 25 * 1000; // Penalti jeda 25 detik

// File Security Log Path
const SECURITY_LOG_FILE = process.env.VERCEL
  ? path.join('/tmp', 'data', 'security_incidents.json')
  : path.join(__dirname, '../../data/security_incidents.json');

const logSecurityIncident = (incident: SecurityIncident) => {
  try {
    const dir = path.dirname(SECURITY_LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    let logs: SecurityIncident[] = [];
    if (fs.existsSync(SECURITY_LOG_FILE)) {
      logs = JSON.parse(fs.readFileSync(SECURITY_LOG_FILE, 'utf8'));
    }
    logs.unshift(incident);
    // Keep max 200 security logs
    if (logs.length > 200) logs = logs.slice(0, 200);
    fs.writeFileSync(SECURITY_LOG_FILE, JSON.stringify(logs, null, 2));
  } catch (e) {
    console.error('Failed to write security log:', e);
  }
};

/**
 * LAYER 1: Anti-Spam & Anti-Flood Rate Limiting per Phone Number
 */
export const checkWhatsAppRateLimit = (phone: string): { allowed: boolean; warningMsg?: string } => {
  const now = Date.now();
  const cleanPhone = phone.replace(/\D/g, '') || 'unknown';

  if (!rateLimitMap[cleanPhone]) {
    rateLimitMap[cleanPhone] = { timestamps: [], infractions: 0 };
  }

  const tracker = rateLimitMap[cleanPhone];

  // Check if currently throttled
  if (tracker.blockedUntil && now < tracker.blockedUntil) {
    const remainingSec = Math.ceil((tracker.blockedUntil - now) / 1000);
    return {
      allowed: false,
      warningMsg: `🛡️ *SISTEM KEAMANAN DESA JOMBE*\n\nAktivitas pengiriman pesan Anda terdeteksi terlalu cepat (indikasi spam/flood).\n\nSistem mengaktifkan perlindungan jeda sementara. Silakan tunggu *${remainingSec} detik* sebelum mengirim pesan berikutnya.`,
    };
  }

  // Filter out timestamps older than the window
  tracker.timestamps = tracker.timestamps.filter((t) => now - t < WINDOW_MS);
  tracker.timestamps.push(now);

  if (tracker.timestamps.length > MAX_MESSAGES_PER_WINDOW) {
    tracker.infractions += 1;
    tracker.blockedUntil = now + THROTTLE_PENALTY_MS;

    logSecurityIncident({
      id: `sec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      phone: cleanPhone,
      incidentType: 'RATE_LIMIT_FLOOD',
      details: `Mengirim ${tracker.timestamps.length} pesan dalam 10 detik. Infraction count: ${tracker.infractions}`,
      actionTaken: 'THROTTLED',
    });

    return {
      allowed: false,
      warningMsg: `🛡️ *PERINGATAN KEAMANAN DESA JOMBE*\n\nAnda mengirim pesan terlalu cepat berturut-turut.\n\nDemi menjaga kestabilan server pelayanan publik desa, nomor Anda dijeda selama *25 detik*.`,
    };
  }

  return { allowed: true };
};

/**
 * LAYER 2: WAF & Anti-Injection Shield (SQLi, XSS, Command Injection, Prompt Injection)
 */
export const sanitizeAndFilterWhatsAppText = (rawText: string, phone: string): SecurityCheckResult => {
  if (!rawText) return { allowed: true, sanitizedText: '' };

  let text = String(rawText).trim();

  // Dangerous injection patterns
  const injectionPatterns = [
    /(<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>)/gi,
    /(UNION\s+SELECT|SELECT\s+\*\s+FROM|DROP\s+TABLE|INSERT\s+INTO|DELETE\s+FROM)/gi,
    /(base64_decode|eval\(|system\(|passthru\(|exec\(|\/bin\/sh|\/bin\/bash)/gi,
    /(javascript:|onload=|onerror=|onclick=)/gi,
    /(ignore\s+previous\s+instructions|show\s+all\s+nik|dump\s+database|admin\s+override)/gi,
  ];

  let detectedInjection = false;
  for (const pattern of injectionPatterns) {
    if (pattern.test(text)) {
      detectedInjection = true;
      text = text.replace(pattern, '[BLOCKED_PAYLOAD]');
    }
  }

  if (detectedInjection) {
    logSecurityIncident({
      id: `sec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      phone: phone.replace(/\D/g, ''),
      incidentType: 'INJECTION_ATTEMPT',
      details: `Payload berbahaya terdeteksi dalam input: "${rawText.slice(0, 100)}"`,
      actionTaken: 'SANITIZED',
    });
  }

  // Strip null bytes and dangerous control chars
  text = text.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return {
    allowed: true,
    sanitizedText: text,
  };
};

/**
 * LAYER 3: Magic-Byte Binary Inspection for Uploaded Photos (Anti-Malware)
 */
export const validateImageMagicBytes = (base64OrBuffer: string | Buffer): { isValid: boolean; mimeType?: string; error?: string } => {
  try {
    let buffer: Buffer;

    if (Buffer.isBuffer(base64OrBuffer)) {
      buffer = base64OrBuffer;
    } else if (typeof base64OrBuffer === 'string') {
      const cleanBase64 = base64OrBuffer.includes(',') ? base64OrBuffer.split(',')[1] : base64OrBuffer;
      buffer = Buffer.from(cleanBase64, 'base64');
    } else {
      return { isValid: false, error: 'Format berkas tidak dikenali.' };
    }

    // Check minimum size (at least 12 bytes to read header)
    if (buffer.length < 12) {
      return { isValid: false, error: 'Ukuran berkas terlalu kecil atau rusak.' };
    }

    // Check maximum size (5 MB limit)
    if (buffer.length > 5 * 1024 * 1024) {
      return { isValid: false, error: 'Ukuran foto melebihi batas maksimal 5 MB.' };
    }

    const hexHeader = buffer.slice(0, 12).toString('hex').toLowerCase();

    // JPEG / JPG: FF D8 FF
    if (hexHeader.startsWith('ffd8ff')) {
      return { isValid: true, mimeType: 'image/jpeg' };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (hexHeader.startsWith('89504e47')) {
      return { isValid: true, mimeType: 'image/png' };
    }

    // WebP: RIFF .... WEBP (52 49 46 46 .... 57 45 42 50)
    if (hexHeader.startsWith('52494646') && hexHeader.includes('57454250')) {
      return { isValid: true, mimeType: 'image/webp' };
    }

    // PDF: %PDF- (25 50 44 46)
    if (hexHeader.startsWith('25504446')) {
      return { isValid: true, mimeType: 'application/pdf' };
    }

    return {
      isValid: false,
      error: 'Berkas yang dikirim bukan format gambar valid (Hanya diperbolehkan JPG, PNG, WebP, atau PDF).',
    };
  } catch (e: any) {
    return { isValid: false, error: 'Gagal memvalidasi integritas berkas.' };
  }
};

/**
 * LAYER 4: PII Data Masking Helper for Logs (UU Perlindungan Data Pribadi)
 */
export const maskPiiData = {
  nik: (nik: string) => {
    const clean = String(nik || '').replace(/\D/g, '');
    if (clean.length < 8) return '****';
    return `${clean.slice(0, 4)}********${clean.slice(-4)}`;
  },
  phone: (phone: string) => {
    const clean = String(phone || '').replace(/\D/g, '');
    if (clean.length < 6) return '****';
    return `${clean.slice(0, 4)}****${clean.slice(-4)}`;
  },
};
