import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
  proto,
} from '@whiskeysockets/baileys';
import QRCode from 'qrcode';
import path from 'path';
import fs from 'fs';
import pino from 'pino';
import { Boom } from '@hapi/boom';

export interface BaileysStatus {
  status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED';
  qrCodeDataUrl: string | null;
  phoneNumber: string | null;
  userName: string | null;
  lastConnected: string | null;
}

const AUTH_DIR = path.join(__dirname, '../../auth_info_baileys');

class WhatsAppBaileysEngine {
  private sock: WASocket | null = null;
  private qrCodeDataUrl: string | null = null;
  private status: 'DISCONNECTED' | 'SCAN_QR' | 'CONNECTING' | 'CONNECTED' = 'DISCONNECTED';
  private phoneNumber: string | null = null;
  private userName: string | null = null;
  private lastConnected: string | null = null;
  private isInitializing: boolean = false;

  constructor() {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
  }

  public getStatus(): BaileysStatus {
    return {
      status: this.status,
      qrCodeDataUrl: this.qrCodeDataUrl,
      phoneNumber: this.phoneNumber,
      userName: this.userName,
      lastConnected: this.lastConnected,
    };
  }

  public async startEngine(): Promise<void> {
    if (this.isInitializing || this.status === 'CONNECTED') return;
    this.isInitializing = true;
    this.status = 'CONNECTING';

    try {
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);

      this.sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        browser: ['Jombe Digital', 'Chrome', '1.0.0'],
      });

      this.sock.ev.on('creds.update', saveCreds);

      this.sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
          try {
            this.qrCodeDataUrl = await QRCode.toDataURL(qr, { width: 300, margin: 2 });
            this.status = 'SCAN_QR';
            console.log('📱 [Baileys] QR Code baru siap di-scan dari HP!');
          } catch (e) {
            console.error('Failed to generate QR code:', e);
          }
        }

        if (connection === 'close') {
          const shouldReconnect =
            (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

          this.status = 'DISCONNECTED';
          this.qrCodeDataUrl = null;
          console.log('📱 [Baileys] Koneksi terputus. Reconnect:', shouldReconnect);

          this.isInitializing = false;
          if (shouldReconnect) {
            setTimeout(() => this.startEngine(), 3000);
          }
        } else if (connection === 'open') {
          this.status = 'CONNECTED';
          this.qrCodeDataUrl = null;
          this.lastConnected = new Date().toISOString();

          const userJid = this.sock?.user?.id || '';
          this.phoneNumber = userJid.split(':')[0] || userJid.split('@')[0] || 'Nomor Terhubung';
          this.userName = this.sock?.user?.name || 'Layanan Resmi Desa Jombe';

          console.log(`✅ [Baileys] WhatsApp Resmi Desa TERHUBUNG! Nomor: ${this.phoneNumber}`);
          this.isInitializing = false;
        }
      });

      // Handle Incoming WhatsApp Messages
      this.sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg || !msg.message || msg.key.fromMe) return;

        const remoteJid = msg.key.remoteJid || '';
        if (remoteJid.includes('@g.us')) return; // Ignore groups

        const senderPhone = remoteJid.replace('@s.whatsapp.net', '');
        const messageText =
          msg.message.conversation ||
          msg.message.extendedTextMessage?.text ||
          msg.message.imageMessage?.caption ||
          '';

        console.log(`📩 [Baileys] Pesan masuk dari ${senderPhone}: "${messageText}"`);

        // Trigger Automated Conversational Bot
        try {
          const { handleIncomingWhatsAppMessageInternal } = await import('../controllers/whatsappBotController');
          const botResponse = await handleIncomingWhatsAppMessageInternal(senderPhone, messageText);

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
      const target = toJid.includes('@') ? toJid : `${toJid}@s.whatsapp.net`;
      await this.sock.sendMessage(target, { text });
      return true;
    } catch (e) {
      console.error('Failed to send Baileys message:', e);
      return false;
    }
  }

  public async sendPdfDocument(toJid: string, pdfBuffer: Buffer, fileName: string, caption: string): Promise<boolean> {
    if (!this.sock || this.status !== 'CONNECTED') return false;
    try {
      const target = toJid.includes('@') ? toJid : `${toJid}@s.whatsapp.net`;
      await this.sock.sendMessage(target, {
        document: pdfBuffer,
        mimetype: 'application/pdf',
        fileName: fileName,
        caption: caption,
      });
      return true;
    } catch (e) {
      console.error('Failed to send Baileys PDF:', e);
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.sock) {
        await this.sock.logout().catch(() => {});
      }
      this.status = 'DISCONNECTED';
      this.qrCodeDataUrl = null;
      this.phoneNumber = null;
      this.userName = null;

      // Clean auth dir on explicit logout
      if (fs.existsSync(AUTH_DIR)) {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
      }
    } catch (e) {
      console.error('Error logging out Baileys:', e);
    }
  }
}

export const baileysEngine = new WhatsAppBaileysEngine();
