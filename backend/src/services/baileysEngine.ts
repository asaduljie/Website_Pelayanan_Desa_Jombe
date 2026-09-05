let makeWASocket: any = null;
let DisconnectReason: any = null;
let useMultiFileAuthState: any = null;
let fetchLatestBaileysVersion: any = null;
let downloadMediaMessage: any = null;
let Browsers: any = null;
let initAuthCreds: any = null;
let BufferJSON: any = null;
let proto: any = null;

// Dynamic safe loader for Baileys (to prevent cold-start crash on Vercel Serverless)
if (!process.env.VERCEL) {
  try {
    const baileysPkg = require('@whiskeysockets/baileys');
    makeWASocket = baileysPkg.default || baileysPkg.makeWASocket;
    DisconnectReason = baileysPkg.DisconnectReason;
    useMultiFileAuthState = baileysPkg.useMultiFileAuthState;
    fetchLatestBaileysVersion = baileysPkg.fetchLatestBaileysVersion;
    downloadMediaMessage = baileysPkg.downloadMediaMessage;
    Browsers = baileysPkg.Browsers;
    initAuthCreds = baileysPkg.initAuthCreds;
    BufferJSON = baileysPkg.BufferJSON;
    proto = baileysPkg.proto;
  } catch (e) {
    console.warn('Baileys package loaded in fallback mode');
  }
}

import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import { realtimeEvents } from './realtimeEvents';
import { clearPostgresAuthState, usePostgresAuthState } from './whatsappAuthStore';

export interface BaileysStatus {
  status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED';
  qrCodeDataUrl: string | null;
  pairingCode: string | null;
  phoneNumber: string | null;
  userName: string | null;
  lastConnected: string | null;
}

// Set WHATSAPP_AUTH_DIR to a mounted, persistent disk in production.  /tmp on
// serverless hosts is intentionally only a fallback and cannot preserve a WA
// login across cold starts.
const AUTH_DIR = process.env.WHATSAPP_AUTH_DIR || (process.env.VERCEL
  ? path.join('/tmp', 'auth_info_baileys')
  : path.join(__dirname, '../../auth_info_baileys'));

const STATUS_CACHE_FILE = path.join(AUTH_DIR, 'live_status.json');

class WhatsAppBaileysEngine {
  private sock: any = null;
  private qrCodeDataUrl: string | null = null;
  private pairingCode: string | null = null;
  private status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED' = 'DISCONNECTED';
  private phoneNumber: string | null = null;
  private userName: string | null = null;
  private lastConnected: string | null = null;
  private isInitializing: boolean = false;
  private manualDisconnect: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private lastEngineStartAttempt = 0;

  constructor() {
    try {
      if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
      }
    } catch (e) { }
  }

  private cleanupSocket(s: any): void {
    if (!s) return;
    try {
      s.ev?.removeAllListeners('connection.update');
      s.ev?.removeAllListeners('creds.update');
      s.ev?.removeAllListeners('messages.upsert');
      if (s.ws) {
        s.ws.removeAllListeners?.();
        if (typeof s.ws.terminate === 'function') {
          s.ws.terminate();
        } else if (typeof s.ws.close === 'function') {
          s.ws.close();
        }
      }
      s.end?.(undefined);
    } catch (e) { }
  }

  private saveStatusCache(): void {
    try {
      if (!fs.existsSync(AUTH_DIR)) fs.mkdirSync(AUTH_DIR, { recursive: true });
      fs.writeFileSync(STATUS_CACHE_FILE, JSON.stringify({
        status: this.status === 'DISCONNECTED' && this.qrCodeDataUrl ? 'SCAN_QR' : this.status,
        qrCodeDataUrl: this.qrCodeDataUrl,
        pairingCode: this.pairingCode,
        phoneNumber: this.phoneNumber,
        userName: this.userName,
        lastConnected: this.lastConnected,
        manualDisconnect: this.manualDisconnect,
      }));
    } catch (e) { }
  }

  public getStatus(): BaileysStatus {
    try {
      if (fs.existsSync(STATUS_CACHE_FILE)) {
        const cached = JSON.parse(fs.readFileSync(STATUS_CACHE_FILE, 'utf-8'));
        if (cached.qrCodeDataUrl && !this.qrCodeDataUrl) this.qrCodeDataUrl = cached.qrCodeDataUrl;
        if (cached.pairingCode && !this.pairingCode) this.pairingCode = cached.pairingCode;
        if (cached.status && this.status === 'DISCONNECTED') this.status = cached.status;
        if (typeof cached.manualDisconnect === 'boolean') this.manualDisconnect = cached.manualDisconnect;
      }
    } catch (e) { }

    return {
      status: this.status === 'DISCONNECTED' && this.qrCodeDataUrl ? 'SCAN_QR' : this.status,
      qrCodeDataUrl: this.qrCodeDataUrl,
      pairingCode: this.pairingCode,
      phoneNumber: this.status === 'CONNECTED' ? (this.phoneNumber || '087853617893') : null,
      userName: this.status === 'CONNECTED' ? (this.userName || 'Bot Resmi Desa Jombe') : null,
      lastConnected: this.lastConnected,
    };
  }

  public async getStatusAsync(): Promise<BaileysStatus> {
    const now = Date.now();
    if (
      !this.manualDisconnect &&
      !this.sock &&
      !this.isInitializing &&
      !this.reconnectTimer &&
      (this.status === 'DISCONNECTED' || !this.qrCodeDataUrl) &&
      now - this.lastEngineStartAttempt > 20000
    ) {
      this.lastEngineStartAttempt = now;
      this.startEngine().catch(() => { });
      // Tunggu hingga 4 detik agar QR code siap jika sedang digenerate
      for (let i = 0; i < 8; i++) {
        if (this.qrCodeDataUrl || this.pairingCode || this.status === 'CONNECTED') break;
        await new Promise((r) => setTimeout(r, 500));
      }
    }
    return this.getStatus();
  }

  public async requestPairingCode(customPhoneNumber: string): Promise<string | null> {
    const cleanPhone = customPhoneNumber.replace(/\D/g, '');
    const formatted = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
    console.log(`📱 [Baileys] Meminta Kode Pairing untuk nomor: ${formatted}`);

    await this.startEngine(formatted, true);

    for (let i = 0; i < 12; i++) {
      if (this.pairingCode) break;
      await new Promise((r) => setTimeout(r, 500));
    }

    return this.pairingCode;
  }

  public async startEngine(customPhoneNumber?: string, forceNew = false): Promise<void> {
    // A cached CONNECTED value only says that the previous process was online;
    // after a restart a fresh socket still must be opened with the saved creds.
    if (this.status === 'CONNECTED' && this.sock && !forceNew) return;
    if (this.isInitializing) {
      console.log('⏳ [Baileys] Socket sedang diinisialisasi, abaikan panggilan startEngine duplikat.');
      return;
    }
    this.manualDisconnect = false;
    this.lastEngineStartAttempt = Date.now();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.sock) {
      this.cleanupSocket(this.sock);
      this.sock = null;
    }

    if (forceNew) {
      console.log('🔄 [Baileys] Mereset sesi sebelumnya untuk membuat QR / Pairing Code baru...');
      await clearPostgresAuthState().catch(() => {});
      try {
        if (fs.existsSync(AUTH_DIR)) {
          const files = fs.readdirSync(AUTH_DIR);
          for (const f of files) {
            if (f !== 'live_status.json') {
              fs.rmSync(path.join(AUTH_DIR, f), { recursive: true, force: true });
            }
          }
        }
      } catch (e) { }
    }

    this.isInitializing = true;
    this.status = 'CONNECTING';
    this.saveStatusCache();

    try {
      if (!initAuthCreds || !BufferJSON || !proto) {
        throw new Error('Komponen autentikasi Baileys tidak tersedia.');
      }
      let authStateResult: any;
      try {
        authStateResult = await usePostgresAuthState({ initAuthCreds, BufferJSON, proto });
      } catch (authDbError: any) {
        console.warn('⚠️ [Baileys] PostgreSQL Auth State gagal dimuat, fallback ke Local File Auth:', authDbError?.message || authDbError);
        const sessionPath = AUTH_DIR;
        if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath, { recursive: true });
        authStateResult = await useMultiFileAuthState(sessionPath);
      }
      const { state, saveCreds } = authStateResult;
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] as [number, number, number] }));

      const sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: Browsers ? Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '22.04.4'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 30000, // 30s interval prevents frequent 408 request timeouts
        markOnlineOnConnect: true,
        syncFullHistory: false,
      });
      this.sock = sock;

      // PENTING: Wajib simpan credentials update saat handshake pairing / scan QR berlangsung
      sock.ev.on('creds.update', saveCreds);

      // If user requested pairing code with phone number
      if (customPhoneNumber && !state.creds.registered) {
        try {
          const cleanPhone = customPhoneNumber.replace(/\D/g, '');
          const formatted = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
          console.log(`📱 [Baileys] Meminta Kode Pairing untuk nomor: ${formatted}`);
          setTimeout(async () => {
            try {
              if (typeof sock?.requestPairingCode === 'function') {
                const code = await sock.requestPairingCode(formatted);
                if (code) {
                  this.pairingCode = code;
                  this.status = 'SCAN_QR';
                  this.saveStatusCache();
                  console.log(`📱 [Baileys] Pairing Code WhatsApp Berhasil Dibuat: ${code}`);
                  realtimeEvents.publish('whatsapp.status', { status: this.status, pairingCode: code });
                }
              }
            } catch (err: any) {
              console.warn('Notice requesting pairing code:', err.message);
            }
          }, 800);
        } catch (err) {
          console.error('Failed to request pairing code:', err);
        }
      }

      this.isInitializing = false;

      sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !this.pairingCode) {
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr, { width: 320, margin: 2 });
            this.status = 'SCAN_QR';
            this.saveStatusCache();
            console.log('📱 [Baileys] QR Code resmi baru siap di-scan dari HP!');
            realtimeEvents.publish('whatsapp.status', { status: this.status, qrCodeDataUrl: this.qrCodeDataUrl });
          } catch (e) {
            console.error('Failed to generate QR code:', e);
          }
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const isLoggedOut = statusCode === (DisconnectReason?.loggedOut || 401);
          const isReplaced = statusCode === (DisconnectReason?.connectionReplaced || 440);
          const shouldReconnect = !isLoggedOut && !isReplaced && !this.manualDisconnect;

          this.status = 'DISCONNECTED';
          this.isInitializing = false;

          // Bersihkan socket yang baru tertutup
          this.cleanupSocket(sock);
          if (this.sock === sock) {
            this.sock = null;
          }

          realtimeEvents.publish('whatsapp.status', {
            status: this.status,
            reason: isLoggedOut ? 'logged_out' : isReplaced ? 'replaced' : 'reconnecting'
          });

          if (isLoggedOut) {
            console.log(`📱 [Baileys] Sesi resmi logout. Membersihkan kredensial lama agar siap pairing/scan QR baru.`);
            this.qrCodeDataUrl = null;
            this.pairingCode = null;
            this.phoneNumber = null;
            this.userName = null;
            this.saveStatusCache();
            await clearPostgresAuthState().catch(() => {});
            try {
              if (fs.existsSync(AUTH_DIR)) {
                const files = fs.readdirSync(AUTH_DIR);
                for (const f of files) {
                  if (f !== 'live_status.json') {
                    fs.rmSync(path.join(AUTH_DIR, f), { recursive: true, force: true });
                  }
                }
              }
            } catch (e) { }
          } else if (isReplaced) {
            console.log(`⚠️ [Baileys] Sesi terputus karena digantikan oleh koneksi/perangkat lain (Status 440). Menjeda 20 detik agar tidak saling tabrakan.`);
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => {
              this.reconnectTimer = null;
              if (this.status !== 'CONNECTED' && !this.manualDisconnect) {
                this.startEngine().catch(() => {});
              }
            }, 20000);
          } else if (shouldReconnect) {
            console.log(`📱 [Baileys] Jaringan sementara terjeda (Status ${statusCode}). Menghubungkan ulang dalam 5 detik agar sesi selalu aktif 24/7...`);
            if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
            this.reconnectTimer = setTimeout(() => {
              this.reconnectTimer = null;
              this.startEngine().catch(() => {});
            }, 5000);
          }
        } else if (connection === 'open') {
          this.status = 'CONNECTED';
          this.qrCodeDataUrl = null;
          this.pairingCode = null;
          this.lastConnected = new Date().toISOString();

          const userJid = sock?.user?.id || '';
          this.phoneNumber = userJid.split(':')[0] || userJid.split('@')[0] || 'Nomor Terhubung';
          this.userName = sock?.user?.name || 'Layanan Resmi Desa Jombe';

          console.log(`✅ [Baileys] WhatsApp Resmi Desa TERHUBUNG 24/7! Nomor: ${this.phoneNumber}`);
          this.isInitializing = false;
          this.saveStatusCache();
          realtimeEvents.publish('whatsapp.status', { status: this.status, phoneNumber: this.phoneNumber });
        }
      });

      // Handle Incoming Messages
      sock.ev.on('messages.upsert', async (m: any) => {
        // Abaikan jika bukan socket aktif utama
        if (this.sock !== sock) return;
        const msg = m.messages?.[0];
        if (!msg || !msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid || '';
        if (remoteJid.includes('@g.us') || remoteJid === 'status@broadcast') return;

        const participant = msg.key.participant || (msg as any).participant || (msg.key as any).participantPn || '';
        if (remoteJid.endsWith('@lid') && participant) {
          this.lidToPhoneMap.set(remoteJid, participant);
          this.lidToPhoneMap.set(participant, remoteJid);
        }

        // Extract clean real phone number if available, fallback to remoteJid
        const senderPhone = remoteJid.endsWith('@lid')
          ? (participant ? participant.replace('@s.whatsapp.net', '').replace(/:\d+/, '') : remoteJid)
          : remoteJid.replace('@s.whatsapp.net', '').replace(/:\d+/, '');

        // Unwrap nested message types (Ephemeral, ViewOnce, etc.)
        const realMsg =
          msg.message.ephemeralMessage?.message ||
          msg.message.viewOnceMessage?.message ||
          msg.message.viewOnceMessageV2?.message ||
          msg.message.documentWithCaptionMessage?.message ||
          msg.message;

        let messageText =
          realMsg.conversation ||
          realMsg.extendedTextMessage?.text ||
          realMsg.imageMessage?.caption ||
          realMsg.buttonsResponseMessage?.selectedDisplayText ||
          realMsg.templateButtonReplyMessage?.selectedId ||
          '';

        let imageUrl: string | undefined = undefined;
        let imageCaption: string | undefined = undefined;

        // Process incoming image from real WhatsApp
        if (realMsg.imageMessage) {
          try {
            const buffer = await downloadMediaMessage(
              msg,
              'buffer',
              {},
              {
                logger: pino({ level: 'silent' }),
                reuploadRequest: this.sock!.updateMediaMessage,
              }
            );
            if (buffer) {
              const base64Str = (buffer as Buffer).toString('base64');
              const mimeType = realMsg.imageMessage.mimetype || 'image/jpeg';
              imageUrl = `data:${mimeType};base64,${base64Str}`;
              imageCaption = realMsg.imageMessage.caption || 'Foto Dikirim via WhatsApp';
              if (!messageText) {
                messageText = 'FOTO_TERKIRIM';
              }
            }
          } catch (imgErr) {
            console.error('Failed to download incoming WhatsApp image:', imgErr);
          }
        }

        if (!messageText && !imageUrl) return;

        console.log(`📩 [Baileys] Pesan masuk dari ${senderPhone}: "${messageText}" (Foto: ${!!imageUrl})`);

        try {
          try {
            await this.sock.readMessages([msg.key]);
          } catch (e) { }

          const { handleIncomingWhatsAppMessageInternal } = await import('../controllers/whatsappBotController');
          const botResponse = await handleIncomingWhatsAppMessageInternal(
            senderPhone,
            messageText,
            imageUrl,
            imageCaption
          );

          if (botResponse && botResponse.reply) {
            await this.sendMessage(remoteJid, botResponse.reply);
          }
        } catch (err) {
          console.error('Error processing Baileys message:', err);
        }
      });
    } catch (error) {
      console.error('Error starting Baileys engine:', error);
      this.status = 'DISCONNECTED';
      this.isInitializing = false;
    }
  }

  private lidToPhoneMap = new Map<string, string>();

  public async sendMessage(toJid: string, text: string): Promise<boolean> {
    if (!this.sock || this.status !== 'CONNECTED') return false;
    try {
      let target = toJid;
      if (!target.includes('@')) {
        const clean = target.replace(/\D/g, '');
        const formatted = clean.startsWith('0') ? `62${clean.slice(1)}` : clean;
        target = `${formatted}@s.whatsapp.net`;
      }
      
      await this.sock.sendMessage(target, { text });
      console.log(`✅ [Baileys] Pesan berhasil terkirim ke WhatsApp: ${target}`);

      // If target was LID, also try sending to mapped phone number if available
      if (target.endsWith('@lid')) {
        const mapped = this.lidToPhoneMap.get(target);
        if (mapped && mapped !== target) {
          const pTarget = mapped.includes('@') ? mapped : `${mapped.startsWith('0') ? '62' + mapped.slice(1) : mapped}@s.whatsapp.net`;
          await this.sock.sendMessage(pTarget, { text }).catch(() => {});
          console.log(`✅ [Baileys] Pesan berhasil di-dispatch juga ke nomor asli: ${pTarget}`);
        }
      }
      return true;
    } catch (e: any) {
      console.error('Failed to send Baileys message:', e.message);
      return false;
    }
  }

  public async sendPdfDocument(toJid: string, pdfBuffer: Buffer, fileName: string, caption: string): Promise<boolean> {
    if (!this.sock || this.status !== 'CONNECTED') return false;
    try {
      let target = toJid;
      if (!target.includes('@')) {
        const clean = target.replace(/\D/g, '');
        const formatted = clean.startsWith('0') ? `62${clean.slice(1)}` : clean;
        target = `${formatted}@s.whatsapp.net`;
      }
      await this.sock.sendMessage(target, {
        document: pdfBuffer,
        mimetype: 'application/pdf',
        fileName: fileName,
        caption: caption,
      });
      console.log(`✅ [Baileys] Dokumen PDF "${fileName}" berhasil terkirim ke WhatsApp: ${target}`);

      // If target was LID, also try sending PDF to mapped phone number if available
      if (target.endsWith('@lid')) {
        const mapped = this.lidToPhoneMap.get(target);
        if (mapped && mapped !== target) {
          const pTarget = mapped.includes('@') ? mapped : `${mapped.startsWith('0') ? '62' + mapped.slice(1) : mapped}@s.whatsapp.net`;
          await this.sock.sendMessage(pTarget, {
            document: pdfBuffer,
            mimetype: 'application/pdf',
            fileName: fileName,
            caption: caption,
          }).catch(() => {});
          console.log(`✅ [Baileys] Dokumen PDF "${fileName}" berhasil di-dispatch juga ke nomor asli: ${pTarget}`);
        }
      }
      return true;
    } catch (e: any) {
      console.error('Failed to send Baileys PDF:', e.message);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      this.manualDisconnect = true;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.sock) {
        await this.sock.logout().catch(() => { });
      }
      this.status = 'DISCONNECTED';
      this.qrCodeDataUrl = null;
      this.pairingCode = null;
      this.phoneNumber = null;
      this.userName = null;

      if (fs.existsSync(AUTH_DIR)) {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      }
      await clearPostgresAuthState();
      // Recreate only the explicit manual-disconnect marker.  This prevents a
      // status request or a restarted process from silently opening a session.
      fs.mkdirSync(AUTH_DIR, { recursive: true });
      this.saveStatusCache();
      realtimeEvents.publish('whatsapp.status', { status: 'DISCONNECTED', reason: 'manual_disconnect' });
    } catch (e) {
      console.error('Error logging out Baileys:', e);
    }
  }
}

export const baileysEngine = new WhatsAppBaileysEngine();
