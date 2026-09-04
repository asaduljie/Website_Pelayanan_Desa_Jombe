let makeWASocket: any = null;
let DisconnectReason: any = null;
let useMultiFileAuthState: any = null;
let fetchLatestBaileysVersion: any = null;
let downloadMediaMessage: any = null;
let Browsers: any = null;

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
  } catch (e) {
    console.warn('Baileys package loaded in fallback mode');
  }
}

import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import { realtimeEvents } from './realtimeEvents';

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

  constructor() {
    try {
      if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
      }
    } catch (e) { }

    // Jaga status Online selalu aktif di WhatsApp setiap 30 detik
    setInterval(async () => {
      if (this.sock && this.status === 'CONNECTED') {
        try {
          await this.sock.sendPresenceUpdate('available');
        } catch (e) { }
      }
    }, 30000);
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
    if (!this.manualDisconnect && !this.sock && !this.isInitializing && (this.status === 'DISCONNECTED' || !this.qrCodeDataUrl)) {
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

    if (!this.sock) {
      await this.startEngine(formatted);
      return this.pairingCode;
    }

    try {
      if (typeof this.sock?.requestPairingCode === 'function') {
        const code = await this.sock.requestPairingCode(formatted);
        if (code) {
          this.pairingCode = code;
          this.status = 'SCAN_QR';
          this.saveStatusCache();
          console.log(`📱 [Baileys] Pairing Code WhatsApp Berhasil Dibuat: ${code}`);
          return code;
        }
      }
    } catch (err: any) {
      console.warn('Socket requestPairingCode notice, recreating socket for pairing:', err.message);
      try {
        await this.disconnect();
      } catch (e) { }
      await this.startEngine(formatted);
      return this.pairingCode;
    }

    return this.pairingCode;
  }

  public async startEngine(customPhoneNumber?: string): Promise<void> {
    // A cached CONNECTED value only says that the previous process was online;
    // after a restart a fresh socket still must be opened with the saved creds.
    if (this.status === 'CONNECTED' && this.sock) return;
    this.manualDisconnect = false;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.isInitializing = true;
    this.status = 'CONNECTING';
    this.saveStatusCache();

    try {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
      const { version } = await fetchLatestBaileysVersion().catch(() => ({ version: [2, 3000, 1015901307] as [number, number, number] }));

      this.sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: Browsers ? Browsers.ubuntu('Chrome') : ['Ubuntu', 'Chrome', '22.04.4'],
        connectTimeoutMs: 60000,
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
        markOnlineOnConnect: true,
        syncFullHistory: false,
      });

      // PENTING: Wajib simpan credentials update saat handshake pairing / scan QR berlangsung
      this.sock.ev.on('creds.update', saveCreds);

      // If user requested pairing code with phone number
      if (customPhoneNumber && !state.creds.registered) {
        try {
          const cleanPhone = customPhoneNumber.replace(/\D/g, '');
          const formatted = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
          console.log(`📱 [Baileys] Meminta Kode Pairing untuk nomor: ${formatted}`);
          const code = await this.sock?.requestPairingCode(formatted);
          if (code) {
            this.pairingCode = code;
            this.status = 'SCAN_QR';
            this.saveStatusCache();
            console.log(`📱 [Baileys] Pairing Code WhatsApp Berhasil Dibuat: ${code}`);
          }
        } catch (err) {
          console.error('Failed to request pairing code:', err);
        }
      }

      this.isInitializing = false;

      this.sock.ev.on('connection.update', async (update: any) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr && !this.pairingCode) {
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr, { width: 320, margin: 2 });
            this.status = 'SCAN_QR';
            this.saveStatusCache();
            console.log('📱 [Baileys] QR Code resmi baru siap di-scan dari HP!');
          } catch (e) {
            console.error('Failed to generate QR code:', e);
          }
        }

        if (connection === 'close') {
          const statusCode = (lastDisconnect?.error as any)?.output?.statusCode;
          const isLoggedOut = statusCode === (DisconnectReason?.loggedOut || 401);
          const shouldReconnect = !isLoggedOut && !this.manualDisconnect;

          this.status = 'DISCONNECTED';
          this.isInitializing = false;
          realtimeEvents.publish('whatsapp.status', { status: this.status, reason: isLoggedOut ? 'logged_out' : 'reconnecting' });

          if (shouldReconnect) {
            console.log(`📱 [Baileys] Jaringan sementara terjeda (Status ${statusCode}). Menghubungkan ulang otomatis dalam 3 detik agar sesi selalu aktif 24/7...`);
            this.reconnectTimer = setTimeout(() => {
              this.reconnectTimer = null;
              this.startEngine().catch(() => {});
            }, 3000);
          } else {
            console.log(`📱 [Baileys] Sesi resmi logout. Sesi siap untuk pairing baru.`);
            this.qrCodeDataUrl = null;
            this.pairingCode = null;
            this.phoneNumber = null;
            this.saveStatusCache();
          }
        } else if (connection === 'open') {
          this.status = 'CONNECTED';
          this.qrCodeDataUrl = null;
          this.pairingCode = null;
          this.lastConnected = new Date().toISOString();

          const userJid = this.sock?.user?.id || '';
          this.phoneNumber = userJid.split(':')[0] || userJid.split('@')[0] || 'Nomor Terhubung';
          this.userName = this.sock?.user?.name || 'Layanan Resmi Desa Jombe';

          console.log(`✅ [Baileys] WhatsApp Resmi Desa TERHUBUNG 24/7! Nomor: ${this.phoneNumber}`);
          this.isInitializing = false;
          this.saveStatusCache();
          realtimeEvents.publish('whatsapp.status', { status: this.status, phoneNumber: this.phoneNumber });

          // Kirim sinyal Online Aktif ke server WhatsApp
          try {
            await this.sock.sendPresenceUpdate('available');
          } catch (e) { }
        }
      });

      // Handle Incoming Messages
      this.sock.ev.on('messages.upsert', async (m: any) => {
        const msg = m.messages?.[0];
        if (!msg || !msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid || '';
        if (remoteJid.includes('@g.us') || remoteJid === 'status@broadcast') return;

        // Keep full remoteJid if it's @lid or format to pure phone number
        const senderPhone = remoteJid.endsWith('@lid')
          ? remoteJid
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
