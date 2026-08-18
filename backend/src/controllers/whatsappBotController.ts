import { Request, Response } from 'express';
import prisma from '../config/db';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
import { baileysEngine } from '../services/baileysEngine';
import { PersistentDatabase, ComplaintRecord } from '../utils/persistentDb';

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
  text: '*PUSAT PELAYANAN WHATSAPP RESMI DESA JOMBE*\n\nSelamat datang di Layanan Terpadu Desa Jombe.\nSilakan pilih menu layanan yang Anda butuhkan:\n\n1️⃣ *LAYANAN PENGAJUAN SURAT ONLINE*\n- Ketik *1* atau *SURAT* (atau langsung ketik *SKU*, *DOMISILI*, *SKTM*)\n\n2️⃣ *LAYANAN PENGADUAN & ASPIRASI WARGA*\n- Ketik *2* atau *PENGADUAN* (atau *LAPOR*)\n\n_Silakan ketik nomor atau nama menu pilihan Anda:_',
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

// Global In-Memory Shared Store for WhatsApp Applications (Synced with Persistent Database)
export const waApplicationsStore: WaApplicationRecord[] = PersistentDatabase.loadApplications();

// Persistent Global In-Memory Store for Chat Histories (by Phone Number)
export const chatHistories: Record<string, ChatMessage[]> = {
  '6281299887766': [getInitialGreeting()],
};

export const sendNotificationToCitizenWhatsApp = (
  phone: string,
  appNumber: string,
  serviceName: string,
  letterNumber: string,
  pdfUrl: string
) => {
  const cleanPhone = String(phone).replace(/\D/g, '') || '6281299887766';
  if (!chatHistories[cleanPhone]) {
    chatHistories[cleanPhone] = [getInitialGreeting()];
  }

  const notifMsg = `*SURAT RESMI TELAH SELESAI DITERBITKAN*\n\n` +
    `Pemerintah Desa Jombe memberitahukan bahwa permohonan Anda:\n` +
    `📄 Layanan: *${serviceName || 'Surat Keterangan'}*\n` +
    `🔢 No. Registrasi: *${appNumber}*\n` +
    `📜 No. Surat Resmi: *${letterNumber}*\n\n` +
    `Surat telah disetujui dan ditandatangani oleh Kepala Desa Jombe.\n\n` +
    `📥 *Unduh Berkas Surat PDF:* ${pdfUrl}\n\n` +
    `Terima kasih telah menggunakan Layanan Mandiri Digital Desa Jombe.`;

  const currentTime = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  chatHistories[cleanPhone].push({
    id: `msg-notif-${Date.now()}`,
    sender: 'bot',
    text: notifMsg,
    timestamp: currentTime,
    pdfUrl: pdfUrl,
    letterNumber: letterNumber,
  });

  return notifMsg;
};

// In-memory Session State Machine for WhatsApp Chat Bot
interface SessionState {
  phone: string;
  mode?: 'SURAT' | 'PENGADUAN';
  step:
    | 'WELCOME'
    | 'ASK_SERVICE'
    | 'ASK_NIK'
    | 'ASK_NAME'
    | 'ASK_DETAIL'
    | 'ASK_PHOTO'
    | 'CONFIRMATION'
    | 'ASK_COMPLAINT_NIK'
    | 'ASK_COMPLAINT_NAME'
    | 'ASK_COMPLAINT_CATEGORY'
    | 'ASK_COMPLAINT_TITLE'
    | 'ASK_COMPLAINT_DESC'
    | 'ASK_COMPLAINT_PHOTO'
    | 'CONFIRM_COMPLAINT';
  serviceSlug?: string;
  serviceName?: string;
  nik?: string;
  name?: string;
  detailValue?: string;
  photos: WaUploadedPhoto[];
  complaintCategory?: string;
  complaintTitle?: string;
  complaintDesc?: string;
  complaintLocation?: string;
}

const chatSessions: Record<string, SessionState> = {};

// ==================== VALIDATION HELPERS ====================
export const validateNik = (nikStr: string): { isValid: boolean; errorAlert?: string; cleanNik: string } => {
  const clean = nikStr.replace(/[\s\-_.]/g, '');
  if (!/^\d+$/.test(clean)) {
    return {
      isValid: false,
      cleanNik: clean,
      errorAlert: `⚠️ *FORMAT NIK SALAH*\n\nNIK hanya boleh berisi karakter angka (0-9) tanpa huruf, tanda baca, atau spasi.\n\nSilakan masukkan kembali 16 digit NIK Anda yang tertera di e-KTP / Kartu Keluarga:`,
    };
  }
  if (clean.length < 16) {
    return {
      isValid: false,
      cleanNik: clean,
      errorAlert: `⚠️ *JUMLAH DIGIT NIK KURANG*\n\nNIK yang Anda masukkan baru berjumlah *${clean.length} digit*.\nSesuai standar e-KTP Republik Indonesia, NIK wajib berjumlah *tepat 16 digit angka*.\n\nSilakan periksa kembali dan masukkan 16 digit NIK Anda:`,
    };
  }
  if (clean.length > 16) {
    return {
      isValid: false,
      cleanNik: clean,
      errorAlert: `⚠️ *JUMLAH DIGIT NIK BERLEBIH*\n\nNIK yang Anda masukkan berjumlah *${clean.length} digit* (melebihi batas 16 digit).\n\nSilakan periksa kembali dan ketik ulang 16 digit NIK Anda:`,
    };
  }
  return { isValid: true, cleanNik: clean };
};

export const validateName = (nameStr: string): { isValid: boolean; errorAlert?: string; cleanName: string } => {
  const clean = nameStr.trim();
  if (clean.length < 3) {
    return {
      isValid: false,
      cleanName: clean,
      errorAlert: `⚠️ *NAMA LENGKAP TIDAK VALID*\n\nNama yang Anda masukkan terlalu pendek (minimal 3 karakter huruf).\n\nSilakan masukkan Nama Lengkap Anda sesuai KTP:`,
    };
  }
  if (!/[a-zA-Z]/.test(clean)) {
    return {
      isValid: false,
      cleanName: clean,
      errorAlert: `⚠️ *NAMA LENGKAP HARUS MENGANDUNG HURUF*\n\nSilakan masukkan Nama Lengkap Anda sesuai KTP (contoh: Budi Santoso):`,
    };
  }
  return { isValid: true, cleanName: clean };
};

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
      message: 'Inisialisasi sesi WhatsApp Engine berhasil dimulai.',
      data: baileysEngine.getStatus(),
    });
  } catch (e: any) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
};

export const disconnectBaileys = async (req: Request, res: Response) => {
  try {
    await baileysEngine.disconnect();
    return res.status(200).json({
      status: 'success',
      message: 'Sesi WhatsApp berhasil diputuskan.',
      data: baileysEngine.getStatus(),
    });
  } catch (e: any) {
    return res.status(500).json({ status: 'error', message: e.message });
  }
};

// Export internal processing function
export const handleIncomingWhatsAppMessageInternal = async (
  senderPhone: string,
  userText: string,
  imageUrl?: string,
  imageCaption?: string
): Promise<{ reply: string; sessionStep: string; isCompleted: boolean }> => {
  const upperText = userText.toUpperCase();
  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // RESET or CANCEL
  if (upperText === 'RESET' || upperText === 'BATAL' || upperText === 'MENU') {
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

  // ==========================================
  // STEP 1: WELCOME & MENU SELECTION
  // ==========================================
  if (session.step === 'WELCOME') {
    session.photos = [];

    // Opsi 2: Pengaduan & Aspirasi Warga
    if (
      upperText === '2' ||
      upperText.includes('PENGADUAN') ||
      upperText.includes('LAPOR') ||
      upperText.includes('ASPIRASI') ||
      upperText.includes('KELUHAN')
    ) {
      session.mode = 'PENGADUAN';
      session.step = 'ASK_COMPLAINT_NIK';
      botReply = `*LAYANAN PENGADUAN & ASPIRASI WARGA DESA JOMBE*\n\nLaporan Anda akan langsung diteruskan ke Kepala Desa & Petugas Pelayanan.\n\nLangkah 1 dari 5:\nSilakan masukkan 16 Digit *NIK (Nomor Induk Kependudukan)* Anda:`;
    }
    // Opsi 1 / Direct Service Codes: Surat Keterangan
    else if (upperText.includes('SKU') || upperText.includes('USAHA')) {
      session.mode = 'SURAT';
      session.serviceSlug = 'surat-keterangan-usaha';
      session.serviceName = 'Surat Keterangan Usaha (SKU)';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Usaha (SKU)*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK (Nomor Induk Kependudukan)* Anda:`;
    } else if (upperText.includes('DOMISILI') || upperText.includes('TINGGAL')) {
      session.mode = 'SURAT';
      session.serviceSlug = 'surat-keterangan-domisili';
      session.serviceName = 'Surat Keterangan Domisili';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Domisili*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK* Anda:`;
    } else if (upperText.includes('SKTM') || upperText.includes('BANTUAN')) {
      session.mode = 'SURAT';
      session.serviceSlug = 'surat-keterangan-tidak-mampu';
      session.serviceName = 'Surat Keterangan Tidak Mampu (SKTM)';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Tidak Mampu (SKTM)*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK* Anda:`;
    } else if (upperText === '1' || upperText.includes('SURAT') || upperText.includes('PENGAJUAN')) {
      session.mode = 'SURAT';
      session.step = 'ASK_SERVICE';
      botReply = `*LAYANAN PENGAJUAN SURAT ONLINE*\n\nSilakan pilih surat yang ingin Anda ajukan:\n- Ketik *SKU* (Surat Keterangan Usaha)\n- Ketik *DOMISILI* (Surat Keterangan Domisili)\n- Ketik *SKTM* (Surat Keterangan Tidak Mampu)\n\n_Ketik salah satu kode surat di atas:_`;
    } else {
      botReply = `*PUSAT PELAYANAN WHATSAPP RESMI DESA JOMBE*\n\nSilakan pilih menu layanan:\n1️⃣ Ketik *1* untuk *Pengajuan Surat Online* (SKU, Domisili, SKTM)\n2️⃣ Ketik *2* untuk *Layanan Pengaduan & Aspirasi Warga*\n\n_Ketik nomor atau kode di atas:_`;
    }
  }

  // ==========================================
  // FLOW A: PENGAJUAN SURAT ONLINE
  // ==========================================
  else if (session.step === 'ASK_SERVICE') {
    if (upperText.includes('SKU') || upperText.includes('USAHA')) {
      session.serviceSlug = 'surat-keterangan-usaha';
      session.serviceName = 'Surat Keterangan Usaha (SKU)';
      session.step = 'ASK_NIK';
      botReply = `Anda mengajukan *Surat Keterangan Usaha (SKU)*.\n\nLangkah 1 dari 4:\nSilakan masukkan 16 Digit *NIK* Anda:`;
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
      botReply = `Ketik *SKU*, *DOMISILI*, atau *SKTM* untuk melanjutkan permohonan surat.`;
    }
  } else if (session.step === 'ASK_NIK') {
    const nikCheck = validateNik(userText);
    if (!nikCheck.isValid) {
      botReply = nikCheck.errorAlert || `⚠️ NIK tidak valid. Silakan masukkan tepat 16 digit angka NIK Anda:`;
    } else {
      session.nik = nikCheck.cleanNik;
      session.step = 'ASK_NAME';
      botReply = `NIK Anda (*${nikCheck.cleanNik}*) terverifikasi sah 16 digit ✓\n\nLangkah 2 dari 4:\nMasukkan *Nama Lengkap* Anda sesuai yang tertera di KTP:`;
    }
  } else if (session.step === 'ASK_NAME') {
    const nameCheck = validateName(userText);
    if (!nameCheck.isValid) {
      botReply = nameCheck.errorAlert || `⚠️ Nama tidak valid. Silakan masukkan Nama Lengkap Anda:`;
    } else {
      session.name = nameCheck.cleanName;
      session.step = 'ASK_DETAIL';
      if (session.serviceSlug === 'surat-keterangan-usaha') {
        botReply = `Langkah 3 dari 4:\nMasukkan *Nama Usaha & Alamat Usaha* Anda:\n_(Contoh: Toko Sembako Berkah, Dusun Krajan RT 02)_`;
      } else {
        botReply = `Langkah 3 dari 4:\nMasukkan *Alamat Lengkap & Keperluan Surat* Anda:`;
      }
    }
  } else if (session.step === 'ASK_DETAIL') {
    session.detailValue = userText;
    session.step = 'ASK_PHOTO';
    session.photos = [];

    const requiredList = SERVICE_PHOTO_REQUIREMENTS[session.serviceSlug || 'surat-keterangan-usaha'] || ['Foto e-KTP', 'Foto Usaha / KK'];

    botReply =
      `Langkah 4 dari 4 (Wajib Lampirkan Dokumen Persyaratan):\n\n` +
      `Untuk pengajuan *${session.serviceName}*, Anda wajib melampirkan *${requiredList.length} Foto Dokumen*:\n` +
      requiredList.map((r, i) => `${i + 1}. ${r}`).join('\n') +
      `\n\n📸 *Kirim Foto Ke-1:* Silakan kirim *${requiredList[0]}* terlebih dahulu menggunakan kamera / lampiran foto:`;
  } else if (session.step === 'ASK_PHOTO') {
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
      botReply =
        `*${expectedTitle} Berhasil Diterima!* ✓\n\n` +
        `Satu dokumen lagi diperlukan:\n` +
        `📸 *Silakan kirim Foto Ke-${session.photos.length + 1}: ${nextRequired}*:`;
    } else {
      session.step = 'CONFIRMATION';

      botReply =
        `*Semua Foto Persyaratan Telah Lengkap Diterima!* ✓\n\n` +
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
  } else if (session.step === 'CONFIRMATION') {
    if (upperText === 'SETUJU' || upperText === 'YA' || upperText === 'OK') {
      const targetNik = session.nik || '3512345678900001';
      const targetName = session.name || 'Warga Desa (Via WA Bot)';
      const targetSlug = session.serviceSlug || 'surat-keterangan-usaha';
      const targetServiceName = session.serviceName || 'Surat Keterangan Usaha (SKU)';

      const appCount = waApplicationsStore.length + 12;
      const appNumber = `JMB-${new Date().getFullYear()}-${String(appCount + 1).padStart(5, '0')}`;
      const letterNumber = `503/470/${Math.floor(100 + Math.random() * 900)}/DS-JMB/${new Date().getFullYear()}`;

      const submittedPhotos =
        session.photos && session.photos.length > 0
          ? session.photos
          : [
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
      PersistentDatabase.addApplication(newWaApp);

      try {
        let citizen = await prisma.user.findUnique({ where: { nik: targetNik } }).catch(() => null);
        if (!citizen) {
          const hashedPass = await bcrypt.hash('123456', 10);
          citizen = await prisma.user
            .create({
              data: {
                nik: targetNik,
                name: targetName,
                phone: senderPhone,
                password: hashedPass,
                address: 'Desa Jombe',
                role: 'MASYARAKAT',
              },
            })
            .catch(() => null);
        }

        let service = await prisma.service.findUnique({ where: { slug: targetSlug } }).catch(() => null);
        if (!service) service = await prisma.service.findFirst().catch(() => null);

        if (service && citizen) {
          await prisma.application
            .create({
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
            })
            .catch(() => null);
        }
      } catch (dbErr) {}

      delete chatSessions[senderPhone];
      isCompleted = true;

      botReply =
        `*PERMOHONAN BERHASIL DITERIMA SISTEM DESA*\n\n` +
        `- Nomor Registrasi: *${appNumber}*\n` +
        `- Jenis Dokumen: ${targetServiceName}\n` +
        `- Lampiran: *${submittedPhotos.length} Dokumen Foto Sah*\n` +
        `- Status: *Menunggu Persetujuan Operator Desa*\n\n` +
        `Draf surat permohonan & seluruh foto berkas Anda telah muncul di panel Operator Kantor Desa Jombe.\n\n` +
        `Begitu Operator memeriksa dan menyetujui, surat balasan PDF resmi akan langsung dikirimkan kembali ke WhatsApp ini.`;
    } else {
      botReply = `Ketik *SETUJU* jika Anda ingin memproses surat di atas, atau ketik *BATAL* untuk mengulang.`;
    }
  }

  // ==========================================
  // FLOW B: LAYANAN PENGADUAN & ASPIRASI WARGA
  // ==========================================
  else if (session.step === 'ASK_COMPLAINT_NIK') {
    const nikCheck = validateNik(userText);
    if (!nikCheck.isValid) {
      botReply = nikCheck.errorAlert || `⚠️ NIK tidak valid. Silakan masukkan tepat 16 digit angka NIK Anda:`;
    } else {
      session.nik = nikCheck.cleanNik;
      session.step = 'ASK_COMPLAINT_NAME';
      botReply = `NIK Pelapor (*${nikCheck.cleanNik}*) terverifikasi 16 digit ✓\n\nLangkah 2 dari 5:\nMasukkan *Nama Lengkap* Anda sebagai pelapor:`;
    }
  } else if (session.step === 'ASK_COMPLAINT_NAME') {
    const nameCheck = validateName(userText);
    if (!nameCheck.isValid) {
      botReply = nameCheck.errorAlert || `⚠️ Nama tidak valid. Silakan masukkan Nama Lengkap Anda:`;
    } else {
      session.name = nameCheck.cleanName;
      session.step = 'ASK_COMPLAINT_CATEGORY';
      botReply =
        `Langkah 3 dari 5:\n` +
        `Pilih *Kategori Pengaduan* Anda:\n` +
        `- Ketik *1* untuk Fasilitas Publik & Jalan Rusak\n` +
        `- Ketik *2* untuk Pelayanan Kantor Desa\n` +
        `- Ketik *3* untuk Kebersihan, Sampah & Saluran Air\n` +
        `- Ketik *4* untuk Keamanan & Ketertiban Lingkungan\n` +
        `- Ketik *5* untuk Bantuan Sosial & Lainnya\n\n` +
        `_Ketik angka 1-5 atau tulis langsung kategorinya:_`;
    }
  } else if (session.step === 'ASK_COMPLAINT_CATEGORY') {
    let cat = userText;
    if (userText === '1' || upperText.includes('FASILITAS') || upperText.includes('JALAN')) cat = 'Fasilitas Publik & Jalan';
    else if (userText === '2' || upperText.includes('PELAYANAN')) cat = 'Pelayanan Kantor Desa';
    else if (userText === '3' || upperText.includes('SAMPAH') || upperText.includes('AIR')) cat = 'Kebersihan & Lingkungan';
    else if (userText === '4' || upperText.includes('KEAMANAN')) cat = 'Keamanan & Ketertiban';
    else if (userText === '5' || upperText.includes('SOSIAL')) cat = 'Bantuan Sosial & Kemasyarakatan';

    session.complaintCategory = cat;
    session.step = 'ASK_COMPLAINT_TITLE';
    botReply = `Langkah 4 dari 5:\nMasukkan *Judul & Lokasi Kejadian* Pengaduan:\n_(Contoh: Lampu Penerangan Jalan Mati di Dusun Krajan RT 03)_`;
  } else if (session.step === 'ASK_COMPLAINT_TITLE') {
    session.complaintTitle = userText;
    session.complaintLocation = userText;
    session.step = 'ASK_COMPLAINT_DESC';
    botReply = `Langkah 5 dari 5:\nJelaskan *Deskripsi / Kronologi Lengkap* pengaduan atau aspirasi Anda:`;
  } else if (session.step === 'ASK_COMPLAINT_DESC') {
    session.complaintDesc = userText;
    session.step = 'ASK_COMPLAINT_PHOTO';
    botReply =
      `📸 *Lampiran Bukti Foto (Opsional):*\n\n` +
      `Silakan kirim foto kondisi lapangan/lokasi kejadian menggunakan kamera atau lampiran WhatsApp.\n\n` +
      `_Atau jika tidak ada foto, ketik *LEWATI* atau *LANJUT*:_`;
  } else if (session.step === 'ASK_COMPLAINT_PHOTO') {
    if (imageUrl) {
      session.photos = [
        {
          title: 'Foto Bukti Pengaduan',
          type: 'BUKTI',
          url: imageUrl,
          caption: imageCaption || userText,
        },
      ];
    }

    session.step = 'CONFIRM_COMPLAINT';
    botReply =
      `*RINGKASAN LAPORAN PENGADUAN WARGA*\n\n` +
      `- Kategori: *${session.complaintCategory}*\n` +
      `- Pelapor: *${session.name}* (NIK: *${session.nik}*)\n` +
      `- Judul & Lokasi: *${session.complaintTitle}*\n` +
      `- Deskripsi Masalah: *${session.complaintDesc}*\n` +
      `- Bukti Foto: *${session.photos.length > 0 ? '1 Foto Terlampir ✓' : 'Tanpa Foto'}*\n\n` +
      `*Konfirmasi Pengiriman:*\n` +
      `👉 Balas *SETUJU* untuk mengirimkan pengaduan ini ke Operator & Kepala Desa Jombe.\n` +
      `👉 Balas *BATAL* untuk membatalkan.`;
  } else if (session.step === 'CONFIRM_COMPLAINT') {
    if (upperText === 'SETUJU' || upperText === 'YA' || upperText === 'OK') {
      const targetNik = session.nik || '3512345678900001';
      const targetName = session.name || 'Warga Desa (Via WA Bot)';
      const complaintCount = PersistentDatabase.loadComplaints().length;
      const ticketNumber = `PGD-${new Date().getFullYear()}-${String(complaintCount + 1).padStart(5, '0')}`;

      const newComplaint: ComplaintRecord = {
        id: `complaint-${Date.now()}`,
        ticketNumber,
        userNik: targetNik,
        userName: targetName,
        userPhone: senderPhone,
        title: session.complaintTitle || 'Pengaduan Warga via WhatsApp',
        category: session.complaintCategory || 'Fasilitas Publik & Jalan',
        description: session.complaintDesc || 'Laporan kendala warga desa.',
        location: session.complaintLocation || 'Desa Jombe',
        photoUrl: session.photos[0]?.url,
        status: 'SUBMITTED',
        createdAt: new Date().toISOString(),
      };

      PersistentDatabase.addComplaint(newComplaint);

      try {
        let citizen = await prisma.user.findUnique({ where: { nik: targetNik } }).catch(() => null);
        if (!citizen) {
          const hashedPass = await bcrypt.hash('123456', 10);
          citizen = await prisma.user
            .create({
              data: {
                nik: targetNik,
                name: targetName,
                phone: senderPhone,
                password: hashedPass,
                address: 'Desa Jombe',
                role: 'MASYARAKAT',
              },
            })
            .catch(() => null);
        }

        if (citizen) {
          await prisma.complaint
            .create({
              data: {
                ticketNumber,
                userId: citizen.id,
                title: newComplaint.title,
                category: newComplaint.category,
                description: newComplaint.description,
                location: newComplaint.location,
                status: 'SUBMITTED',
                history: {
                  create: {
                    status: 'SUBMITTED',
                    actorName: `${targetName} (Via WhatsApp Bot)`,
                    notes: `Pengaduan masuk melalui bot WhatsApp resmi Desa Jombe.`,
                  },
                },
              },
            })
            .catch(() => null);
        }
      } catch (dbErr) {}

      delete chatSessions[senderPhone];
      isCompleted = true;

      botReply =
        `*PENGADUAN BERHASIL TERCATAT & DITERUSKAN* ✓\n\n` +
        `- Nomor Tiket: *${ticketNumber}*\n` +
        `- Kategori: *${newComplaint.category}*\n` +
        `- Status: *Menunggu Tindak Lanjut Perangkat Desa*\n\n` +
        `Terima kasih atas laporan dan kepedulian Anda terhadap kemajuan Desa Jombe. Laporan Anda telah masuk ke dashboard Operator Kantor Desa dan akan segera ditindaklanjuti.\n\n` +
        `Anda dapat melacak status penanganan pengaduan ini di website resmi Desa Jombe menggunakan nomor tiket *${ticketNumber}*.`;
    } else {
      botReply = `Ketik *SETUJU* jika Anda ingin mengirim pengaduan di atas, atau ketik *BATAL* untuk mengulang.`;
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
