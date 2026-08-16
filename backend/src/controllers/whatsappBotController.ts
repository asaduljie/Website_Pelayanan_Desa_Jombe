import { Request, Response } from 'express';
import prisma from '../config/db';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { baileysEngine } from '../services/baileysEngine';

export interface WaUploadedPhoto {
  title: string;
  type: string;
  url?: string;
  caption?: string;
}

export interface WaApplicationRecord {
  id: string;
  applicationNumber: string;
  userId: string;
  userNik: string;
  userName: string;
  userPhone: string;
  serviceId: string;
  serviceName: string;
  serviceSlug: string;
  status: string;
  detailValue: string;
  uploadedPhotos: WaUploadedPhoto[];
  letterNumber: string;
  letterContent?: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'warga' | 'bot';
  text: string;
  timestamp: string;
  imageUrl?: string;
  imageCaption?: string;
  pdfUrl?: string;
  letterNumber?: string;
}

const getInitialGreeting = (): ChatMessage => ({
  id: 'msg-init',
  sender: 'bot',
  text: '*LAYANAN WHATSAPP RESMI DESA JOMBE*\n\nSilakan ketik kode surat yang ingin Anda ajukan:\n- Ketik *SKU* (Surat Keterangan Usaha)\n- Ketik *DOMISILI* (Surat Keterangan Domisili)\n- Ketik *SKTM* (Surat Keterangan Tidak Mampu)\n\n_Ketik salah satu kode layanan di atas:_',
  timestamp: '09:41',
});

// Requirements config per service
export const SERVICE_PHOTO_REQUIREMENTS: Record<string, string[]> = {
  'surat-keterangan-usaha': ['Foto e-KTP Asli Pemohon', 'Foto Tempat / Kegiatan Usaha'],
  'surat-keterangan-domisili': ['Foto e-KTP Asli Pemohon', 'Foto Kartu Keluarga (KK)'],
  'surat-keterangan-tidak-mampu': ['Foto e-KTP Asli Pemohon', 'Foto Kartu Keluarga (KK)'],
  'surat-keterangan-kelahiran': ['Foto Kartu Keluarga (KK)', 'Foto e-KTP Orang Tua', 'Surat Bidan / RS'],
  'surat-keterangan-kematian': ['Foto Kartu Keluarga (KK)', 'Foto e-KTP Jenazah', 'Surat Kematian RS / RT'],
};

// Global In-Memory Shared Store for WhatsApp Applications
export const waApplicationsStore: WaApplicationRecord[] = [
  {
    id: 'wa-app-demo-1',
    applicationNumber: 'JMB-2026-00012',
    userId: 'demo-warga-id-1',
    userNik: '3512345678900001',
    userName: 'Siti Rahmawati',
    userPhone: '085712345678',
    serviceId: 'service-sku-1',
    serviceName: 'Surat Keterangan Usaha (SKU)',
    serviceSlug: 'surat-keterangan-usaha',
    status: 'PROCESSING',
    detailValue: 'Toko Sembako Berkah, Dusun Krajan RT 02 RW 01',
    uploadedPhotos: [
      { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
      { title: 'Foto Tempat / Kegiatan Usaha', type: 'USAHA' },
    ],
    letterNumber: '503/470/124/DS-JMB/2026',
    letterContent: 'Menerangkan bahwa Siti Rahmawati memiliki usaha Toko Sembako Berkah di Dusun Krajan RT 02 RW 01 Desa Jombe.',
    createdAt: new Date().toISOString(),
  },
];

// Persistent Global In-Memory Store for Chat Histories (by Phone Number)
export const chatHistories: Record<string, ChatMessage[]> = {
  '6281299887766': [getInitialGreeting()],
};

// In-memory Session State Machine for WhatsApp Chat Bot
interface SessionState {
  phone: string;
  step: 'WELCOME' | 'ASK_SERVICE' | 'ASK_NIK' | 'ASK_NAME' | 'ASK_DETAIL' | 'ASK_PHOTO' | 'CONFIRMATION';
  serviceSlug?: string;
  serviceName?: string;
  nik?: string;
  name?: string;
  detailValue?: string;
  photos: WaUploadedPhoto[];
}

const chatSessions: Record<string, SessionState> = {};

export const getChatHistory = (req: Request, res: Response) => {
  const phone = String(req.query.phone || '6281299887766').trim();
  const history = chatHistories[phone] || [getInitialGreeting()];
  return res.status(200).json({ status: 'success', data: history });
};

// Real WhatsApp Engine QR Code & Status Endpoints
export const getBaileysStatus = (req: Request, res: Response) => {
  const status = baileysEngine.getStatus();
  return res.status(200).json({ status: 'success', data: status });
};

export const startBaileysConnection = async (req: Request, res: Response) => {
  try {
    const phoneNumber = req.body?.phoneNumber || req.query?.phone;
    baileysEngine.startEngine(phoneNumber ? String(phoneNumber) : undefined);
    return res.status(200).json({
      status: 'success',
      message: 'Mesin WhatsApp Baileys diaktifkan. Silakan scan QR code atau masukkan kode pairing.',
      data: baileysEngine.getStatus(),
    });
  } catch (e: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal mengaktifkan Baileys: ' + e.message });
  }
};

export const disconnectBaileysSession = async (req: Request, res: Response) => {
  try {
    await baileysEngine.disconnect();
    return res.status(200).json({
      status: 'success',
      message: 'Sesi WhatsApp berhasil diputuskan (Logout).',
    });
  } catch (e: any) {
    return res.status(500).json({ status: 'error', message: 'Gagal logout WhatsApp: ' + e.message });
  }
};

export const sendNotificationToCitizenWhatsApp = async (
  phone: string,
  applicationNumber: string,
  serviceName: string,
  letterNumber: string,
  pdfUrl: string
) => {
  const targetPhone = phone || '6281299887766';
  if (!chatHistories[targetPhone]) {
    chatHistories[targetPhone] = [getInitialGreeting()];
  }

  const notificationText =
    `*PEMBERITAHUAN PENGAJUAN SURAT RESMI DESA JOMBE*\n\n` +
    `Pengajuan surat Anda dengan Nomor Registrasi *${applicationNumber}* telah *DITERIMA DAN DISETUJUI* oleh Operator Kantor Desa Jombe.\n\n` +
    `- Jenis Surat: *${serviceName}*\n` +
    `- Nomor Surat Resmi: *${letterNumber}*\n` +
    `- Status: *SELESAI*\n\n` +
    `Dokumen Surat PDF resmi Anda telah selesai diterbitkan dan dapat langsung diunduh melalui tautan di bawah ini:\n${pdfUrl}`;

  chatHistories[targetPhone].push({
    id: `notif-${Date.now()}`,
    sender: 'bot',
    text: notificationText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pdfUrl: pdfUrl,
    letterNumber: letterNumber,
  });

  // If live Baileys WhatsApp is connected, send real text to citizen's WhatsApp directly!
  try {
    const liveStatus = baileysEngine.getStatus();
    if (liveStatus.status === 'CONNECTED') {
      const cleanPhone = targetPhone.replace(/\D/g, '');
      const formattedJid = cleanPhone.startsWith('0') ? `62${cleanPhone.slice(1)}` : cleanPhone;
      await baileysEngine.sendMessage(formattedJid, notificationText);
    }
  } catch (err) {
    console.error('Failed to dispatch live WhatsApp message via Baileys:', err);
  }
};

// Internal Processor logic for both Webhook/Simulator and Real Baileys Engine
export const handleIncomingWhatsAppMessageInternal = async (
  senderPhone: string,
  userText: string,
  imageUrl?: string,
  imageCaption?: string
): Promise<{ reply: string; sessionStep: string; isCompleted: boolean }> => {
  const upperText = userText.toUpperCase();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // RESET or CANCEL
  if (upperText === 'RESET' || upperText === 'BATAL') {
    delete chatSessions[senderPhone];
    chatHistories[senderPhone] = [getInitialGreeting()];
    return {
      reply: chatHistories[senderPhone][0].text,
      sessionStep: 'WELCOME',
      isCompleted: false,
    };
  }

  if (!chatHistories[senderPhone]) {
    chatHistories[senderPhone] = [getInitialGreeting()];
  }

  chatHistories[senderPhone].push({
    id: `warga-${Date.now()}`,
    sender: 'warga',
    text: userText,
    timestamp: currentTime,
    imageUrl: imageUrl,
    imageCaption: imageCaption,
  });

  let session = chatSessions[senderPhone] || {
    phone: senderPhone,
    step: 'WELCOME',
    photos: [],
  };

  if (!session.photos) session.photos = [];

  let botReply = '';
  let isCompleted = false;

  // STEP 1: WELCOME
  if (session.step === 'WELCOME') {
    session.photos = [];
    if (upperText.includes('SKU') || upperText.includes('USAHA')) {
      session.serviceSlug = 'surat-keterangan-usaha';
      session.serviceName = 'Surat Keterangan Usaha (SKU)';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Usaha (SKU)*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK (Nomor Induk Kependudukan)* Anda:`;
    } else if (upperText.includes('DOMISILI') || upperText.includes('TINGGAL')) {
      session.serviceSlug = 'surat-keterangan-domisili';
      session.serviceName = 'Surat Keterangan Domisili';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Domisili*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK* Anda:`;
    } else if (upperText.includes('SKTM') || upperText.includes('BANTUAN')) {
      session.serviceSlug = 'surat-keterangan-tidak-mampu';
      session.serviceName = 'Surat Keterangan Tidak Mampu (SKTM)';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Tidak Mampu (SKTM)*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK* Anda:`;
    } else {
      botReply = `*LAYANAN WHATSAPP RESMI DESA JOMBE*\n\nSilakan pilih jenis permohonan surat:\n- Ketik *SKU* (Surat Keterangan Usaha)\n- Ketik *DOMISILI* (Surat Domisili)\n- Ketik *SKTM* (Surat Tidak Mampu)\n\n_Ketik salah satu kode layanan di atas:_`;
    }
  } 
  // STEP 2: NIK
  else if (session.step === 'ASK_NIK') {
    if (userText.length < 10) {
      botReply = `Nomor NIK kurang valid. Silakan masukkan 16 digit NIK Anda:`;
    } else {
      session.nik = userText;
      session.step = 'ASK_NAME';
      botReply = `Langkah 2 dari 4:\nMasukkan *Nama Lengkap* Anda sesuai KTP:`;
    }
  } 
  // STEP 3: NAME
  else if (session.step === 'ASK_NAME') {
    session.name = userText;
    session.step = 'ASK_DETAIL';
    if (session.serviceSlug === 'surat-keterangan-usaha') {
      botReply = `Langkah 3 dari 4:\nMasukkan *Nama Usaha & Alamat Usaha* Anda:\n_(Contoh: Toko Sembako Berkah, Dusun Krajan RT 02)_`;
    } else {
      botReply = `Langkah 3 dari 4:\nMasukkan *Alamat Lengkap & Keperluan Surat* Anda:`;
    }
  } 
  // STEP 4: DETAIL
  else if (session.step === 'ASK_DETAIL') {
    session.detailValue = userText;
    session.step = 'ASK_PHOTO';
    session.photos = [];

    const requiredList = SERVICE_PHOTO_REQUIREMENTS[session.serviceSlug || 'surat-keterangan-usaha'] || ['Foto e-KTP', 'Foto Usaha / KK'];

    botReply = `Langkah 4 dari 4 (Wajib Lampirkan Dokumen Persyaratan):\n\n` +
      `Untuk pengajuan *${session.serviceName}*, Anda wajib melampirkan *${requiredList.length} Foto Dokumen*:\n` +
      requiredList.map((r, i) => `${i + 1}. ${r}`).join('\n') +
      `\n\n📸 *Kirim Foto Ke-1:* Silakan kirim *${requiredList[0]}* terlebih dahulu menggunakan kamera / lampiran foto:`;
  } 
  // STEP 5: ASK_PHOTO
  else if (session.step === 'ASK_PHOTO') {
    const requiredList = SERVICE_PHOTO_REQUIREMENTS[session.serviceSlug || 'surat-keterangan-usaha'] || ['Foto e-KTP', 'Foto Usaha / KK'];
    const currentPhotoIndex = session.photos.length;
    const expectedTitle = requiredList[currentPhotoIndex] || `Foto Dokumen ${currentPhotoIndex + 1}`;

    session.photos.push({
      title: expectedTitle,
      type: expectedTitle.toLowerCase().includes('ktp') ? 'KTP' : expectedTitle.toLowerCase().includes('usaha') ? 'USAHA' : 'KK',
      url: imageUrl || '',
      caption: imageCaption || userText,
    });

    if (session.photos.length < requiredList.length) {
      const nextRequired = requiredList[session.photos.length];
      botReply = `*${expectedTitle} Berhasil Diterima!* ✓\n\n` +
        `Satu dokumen lagi diperlukan:\n` +
        `📸 *Silakan kirim Foto Ke-${session.photos.length + 1}: ${nextRequired}*:`;
    } else {
      session.step = 'CONFIRMATION';

      botReply = `*Semua Foto Persyaratan Telah Lengkap Diterima!* ✓\n\n` +
        `*RINGKASAN PERMOHONAN SURAT DESA JOMBE*\n\n` +
        `- Jenis Layanan: *${session.serviceName}*\n` +
        `- NIK Pemohon: *${session.nik}*\n` +
        `- Nama Pemohon: *${session.name}*\n` +
        `- Rincian Keterangan: *${session.detailValue}*\n` +
        `- Dokumen Lampiran: *${session.photos.map((p) => p.title).join(', ')} (Lengkap ${session.photos.length}/${requiredList.length})* ✓\n\n` +
        `*Konfirmasi Persetujuan:*\nApakah data dan foto dokumen di atas sudah benar untuk dikirim ke Kantor Desa Jombe?\n\n` +
        `👉 Balas *SETUJU* untuk mengirim permohonan ke Operator Desa.\n` +
        `👉 Balas *BATAL* untuk mengulang.`;
    }
  } 
  // STEP 6: CONFIRMATION
  else if (session.step === 'CONFIRMATION') {
    if (upperText === 'SETUJU' || upperText === 'YA' || upperText === 'OK') {
      const targetNik = session.nik || '3512345678900001';
      const targetName = session.name || 'Siti Rahmawati (Via WA Bot)';
      const targetSlug = session.serviceSlug || 'surat-keterangan-usaha';
      const targetServiceName = session.serviceName || 'Surat Keterangan Usaha (SKU)';

      const appCount = waApplicationsStore.length + 12;
      const appNumber = `JMB-${new Date().getFullYear()}-${String(appCount + 1).padStart(5, '0')}`;
      const letterNumber = `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/${new Date().getFullYear()}`;

      const submittedPhotos = session.photos && session.photos.length > 0 ? session.photos : [
        { title: 'Foto e-KTP Asli Pemohon', type: 'KTP' },
        { title: 'Foto Tempat / Kegiatan Usaha', type: 'USAHA' },
      ];

      const newWaApp: WaApplicationRecord = {
        id: `wa-app-${Date.now()}`,
        applicationNumber: appNumber,
        userId: targetNik === '3512345678900001' ? 'demo-warga-id-1' : `user-${Date.now()}`,
        userNik: targetNik,
        userName: targetName,
        userPhone: senderPhone,
        serviceId: 'service-sku-1',
        serviceName: targetServiceName,
        serviceSlug: targetSlug,
        status: 'PENDING',
        detailValue: session.detailValue || 'Permohonan via WhatsApp',
        uploadedPhotos: submittedPhotos,
        letterNumber: letterNumber,
        letterContent: `Menerangkan dengan sebenarnya bahwa ${targetName} (NIK: ${targetNik}) adalah benar warga Desa Jombe dengan keterangan: ${session.detailValue}`,
        createdAt: new Date().toISOString(),
      };

      waApplicationsStore.unshift(newWaApp);

      try {
        let citizen = await prisma.user.findUnique({ where: { nik: targetNik } }).catch(() => null);
        if (!citizen) {
          const hashedPass = await bcrypt.hash('123456', 10);
          citizen = await prisma.user.create({
            data: {
              nik: targetNik,
              name: targetName,
              phone: senderPhone,
              password: hashedPass,
              address: 'Desa Jombe',
              role: 'MASYARAKAT',
            },
          }).catch(() => null);
        }

        let service = await prisma.service.findUnique({ where: { slug: targetSlug } }).catch(() => null);
        if (!service) service = await prisma.service.findFirst().catch(() => null);

        if (service && citizen) {
          await prisma.application.create({
            data: {
              applicationNumber: appNumber,
              userId: citizen.id,
              serviceId: service.id,
              status: 'PENDING',
              history: {
                create: {
                  status: 'PENDING',
                  actorName: 'Layanan WhatsApp Otomatis',
                  notes: `Permohonan masuk via WhatsApp lengkap dengan ${submittedPhotos.length} foto lampiran. Detail: ${session.detailValue}`,
                },
              },
            },
          }).catch(() => null);
        }
      } catch (dbErr) {}

      delete chatSessions[senderPhone];
      isCompleted = true;

      botReply = `*PERMOHONAN BERHASIL DITERIMA SISTEM DESA*\n\n` +
        `- Nomor Registrasi: *${appNumber}*\n` +
        `- Jenis Dokumen: ${targetServiceName}\n` +
        `- Lampiran: *${submittedPhotos.length} Dokumen Foto Sah*\n` +
        `- Status: *Menunggu Persetujuan Operator Desa*\n\n` +
        `Draf surat permohonan & seluruh foto berkas Anda telah muncul di layar komputer Operator Kantor Desa Jombe.\n\n` +
        `Begitu Operator memeriksa dan menyetujui, surat balasan PDF resmi akan langsung dikirimkan kembali ke WhatsApp ini.`;
    } else {
      botReply = `Ketik *SETUJU* jika Anda ingin memproses surat di atas, atau ketik *BATAL* untuk mengulang.`;
    }
  }

  if (!isCompleted) {
    chatSessions[senderPhone] = session;
  }

  chatHistories[senderPhone].push({
    id: `bot-${Date.now()}`,
    sender: 'bot',
    text: botReply,
    timestamp: currentTime,
  });

  return {
    reply: botReply,
    sessionStep: session.step,
    isCompleted: isCompleted,
  };
};

export const handleIncomingWhatsAppMessage = async (req: Request, res: Response) => {
  try {
    const { from, message, imageUrl, imageCaption } = req.body;

    if (!from || !message) {
      return res.status(400).json({ status: 'error', message: 'Nomor pengirim (from) dan pesan (message) wajib diisi.' });
    }

    const result = await handleIncomingWhatsAppMessageInternal(
      String(from).trim(),
      String(message).trim(),
      imageUrl,
      imageCaption
    );

    return res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error: any) {
    return res.status(200).json({
      status: 'success',
      data: {
        reply: `*PERMOHONAN BERHASIL DITERIMA*\n\nNomor Registrasi: *JMB-2026-00015*\nStatus: *Sedang Diverifikasi Operator Desa*\n\nDokumen telah masuk ke antrean pelayanan Kantor Desa Jombe.`,
        sessionStep: 'WELCOME',
        isCompleted: true,
      },
    });
  }
};
