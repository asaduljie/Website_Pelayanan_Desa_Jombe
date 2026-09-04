import fs from 'fs';
import path from 'path';
import { WaApplicationRecord } from '../controllers/whatsappBotController';

const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', 'data')
  : path.join(__dirname, '../../data');
const DB_FILE = path.join(DATA_DIR, 'applications_db.json');
const NEWS_FILE = path.join(DATA_DIR, 'news_db.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements_db.json');
const COMPLAINTS_FILE = path.join(DATA_DIR, 'complaints_db.json');

// Ensure data directory exists
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) { }

export interface ComplaintRecord {
  id: string;
  ticketNumber: string;
  userId?: string;
  userNik: string;
  userName: string;
  userPhone: string;
  title: string;
  category: string;
  description: string;
  location?: string;
  photoUrl?: string;
  status: 'SUBMITTED' | 'PROCESSING' | 'RESOLVED' | 'REJECTED';
  adminResponse?: string;
  assignedOfficer?: string;
  officerPhone?: string;
  createdAt: string;
}

export interface NewsRecord {
  id: string;
  slug: string;
  title: string;
  category: string;
  content: string;
  excerpt: string;
  imageUrl?: string;
  views: number;
  createdAt: string;
  author: { name: string };
}

export interface AnnouncementRecord {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export class PersistentDatabase {
  // ================= APPLICATIONS =================
  public static loadApplications(): WaApplicationRecord[] {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initialData: WaApplicationRecord[] = [];
        this.saveApplications(initialData);
        return initialData;
      }
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  public static saveApplications(records: WaApplicationRecord[]): void {
    try {
      // Write then atomically replace: a power loss can at worst retain the
      // previous complete file, never leave a half-written JSON database.
      const tempFile = `${DB_FILE}.${process.pid}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (e) {
      console.error('Error saving persistent applications DB:', e);
    }
  }

  public static addApplication(record: WaApplicationRecord): void {
    const apps = this.loadApplications();
    const filtered = apps.filter((a) => a.id !== record.id && a.applicationNumber !== record.applicationNumber);
    filtered.unshift(record);
    this.saveApplications(filtered);
  }

  public static updateApplication(idOrNumber: string, updates: Partial<WaApplicationRecord>): WaApplicationRecord | null {
    const apps = this.loadApplications();
    const index = apps.findIndex((a) => a.id === idOrNumber || a.applicationNumber === idOrNumber);
    if (index !== -1) {
      apps[index] = { ...apps[index], ...updates };
      this.saveApplications(apps);
      return apps[index];
    }
    return null;
  }

  public static deleteApplication(idOrNumber: string): boolean {
    const apps = this.loadApplications();
    const filtered = apps.filter((a) => a.id !== idOrNumber && a.applicationNumber !== idOrNumber);
    this.saveApplications(filtered);
    return true;
  }

  public static clearApplications(): void {
    this.saveApplications([]);
  }

  // ================= NEWS =================
  public static loadNews(): NewsRecord[] {
    try {
      if (!fs.existsSync(NEWS_FILE)) {
        const initialNews: NewsRecord[] = [
          {
            id: 'news-1',
            slug: 'peluncuran-sistem-jombe-digital',
            title: 'Pemerintah Desa Jombe Resmi Luncurkan Sistem Pelayanan Digital Berbasis Web & WhatsApp',
            category: 'Pemerintahan',
            content: 'Pemerintah Desa Jombe resmi meluncurkan platform JOMBE DIGITAL untuk mempermudah warga dalam mengajukan surat keterangan secara mandiri dari rumah maupun melalui chat WhatsApp.',
            excerpt: 'Peluncuran platform pelayanan terpadu desa untuk mempermudah permohonan surat warga.',
            views: 124,
            createdAt: new Date().toISOString(),
            author: { name: 'Humas Desa Jombe' },
          },
          {
            id: 'news-2',
            slug: 'musrenbangdes-desa-jombe-2026',
            title: 'Musrenbangdes Tahun 2026: Fokus Peningkatan Fasilitas Pertanian & UMKM',
            category: 'Pembangunan',
            content: 'Musyawarah Perencanaan Pembangunan Desa (Musrenbangdes) Desa Jombe menyepakati alokasi prioritas pada pembangunan drainase sawah dan pembinaan UMKM lokal.',
            excerpt: 'Musyawarah desa menetapkan arah pembangunan pertanian dan ekonomi warga.',
            views: 89,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
            author: { name: 'Humas Desa Jombe' },
          },
        ];
        this.saveNews(initialNews);
        return initialNews;
      }
      const raw = fs.readFileSync(NEWS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  public static saveNews(records: NewsRecord[]): void {
    try {
      fs.writeFileSync(NEWS_FILE, JSON.stringify(records, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving news DB:', e);
    }
  }

  public static addNews(record: NewsRecord): void {
    const list = this.loadNews();
    const filtered = list.filter((n) => n.id !== record.id && n.slug !== record.slug);
    filtered.unshift(record);
    this.saveNews(filtered);
  }

  public static deleteNews(idOrSlug: string): boolean {
    const list = this.loadNews();
    const filtered = list.filter((n) => n.id !== idOrSlug && n.slug !== idOrSlug);
    this.saveNews(filtered);
    return true;
  }

  // ================= ANNOUNCEMENTS =================
  public static loadAnnouncements(): AnnouncementRecord[] {
    try {
      if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
        const initialAnn: AnnouncementRecord[] = [
          {
            id: 'ann-1',
            title: 'Pelayanan Pembuatan Surat Keterangan Usaha (SKU) & Domisili Online',
            content: 'Warga Desa Jombe kini dapat mengurus permohonan surat secara online 24 jam melalui portal web atau bot WhatsApp resmi.',
            createdAt: new Date().toISOString(),
          },
        ];
        this.saveAnnouncements(initialAnn);
        return initialAnn;
      }
      const raw = fs.readFileSync(ANNOUNCEMENTS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  public static saveAnnouncements(records: AnnouncementRecord[]): void {
    try {
      fs.writeFileSync(ANNOUNCEMENTS_FILE, JSON.stringify(records, null, 2), 'utf-8');
    } catch (e) {
      console.error('Error saving announcements DB:', e);
    }
  }

  public static addAnnouncement(record: AnnouncementRecord): void {
    const list = this.loadAnnouncements();
    const filtered = list.filter((n) => n.id !== record.id);
    filtered.unshift(record);
    this.saveAnnouncements(filtered);
  }

  public static deleteAnnouncement(id: string): boolean {
    const list = this.loadAnnouncements();
    const filtered = list.filter((n) => n.id !== id);
    this.saveAnnouncements(filtered);
    return true;
  }

  // ================= COMPLAINTS =================
  public static loadComplaints(): ComplaintRecord[] {
    try {
      if (!fs.existsSync(COMPLAINTS_FILE)) {
        const initial: ComplaintRecord[] = [];
        this.saveComplaints(initial);
        return initial;
      }
      const raw = fs.readFileSync(COMPLAINTS_FILE, 'utf-8');
      const data = JSON.parse(raw);
      return Array.isArray(data) ? data : [];
    } catch (e) {
      return [];
    }
  }

  public static saveComplaints(records: ComplaintRecord[]): void {
    try {
      const tempFile = `${COMPLAINTS_FILE}.${process.pid}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), 'utf-8');
      fs.renameSync(tempFile, COMPLAINTS_FILE);
    } catch (e) {
      console.error('Error saving complaints DB:', e);
    }
  }

  public static addComplaint(record: ComplaintRecord): void {
    const list = this.loadComplaints();
    const filtered = list.filter((c) => c.id !== record.id && c.ticketNumber !== record.ticketNumber);
    filtered.unshift(record);
    this.saveComplaints(filtered);
  }

  public static updateComplaint(idOrTicket: string, updates: Partial<ComplaintRecord>): ComplaintRecord | null {
    const list = this.loadComplaints();
    const index = list.findIndex((c) => c.id === idOrTicket || c.ticketNumber === idOrTicket);
    if (index !== -1) {
      list[index] = { ...list[index], ...updates };
      this.saveComplaints(list);
      return list[index];
    }
    return null;
  }

  public static deleteComplaint(idOrTicket: string): boolean {
    const list = this.loadComplaints();
    const filtered = list.filter((c) => c.id !== idOrTicket && c.ticketNumber !== idOrTicket);
    this.saveComplaints(filtered);
    return true;
  }
}
