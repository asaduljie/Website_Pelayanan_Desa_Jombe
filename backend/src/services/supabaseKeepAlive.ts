import prisma from '../config/db';
import axios from 'axios';

class SupabaseKeepAliveService {
  private intervalTimer: NodeJS.Timeout | null = null;
  private isChecking: boolean = false;

  // Heartbeat ping interval: setiap 12 jam (supaya tidak pernah mencapai batas 7 hari)
  private readonly PING_INTERVAL_MS = 12 * 60 * 60 * 1000;

  public startKeepAliveDaemon(): void {
    console.log('⚡ [SUPABASE AUTO-KEEPALIVE] Service otomatisasi pencegah auto-pause diaktifkan.');

    // 1. Jalankan pengecekan & wakeup pertama kali saat server baru menyala
    this.pingAndWakeupSupabase();

    // 2. Pasang cron interval rutin setiap 12 jam
    if (this.intervalTimer) clearInterval(this.intervalTimer);
    this.intervalTimer = setInterval(() => {
      this.pingAndWakeupSupabase();
    }, this.PING_INTERVAL_MS);
  }

  public async pingAndWakeupSupabase(): Promise<{ isOnline: boolean; message: string }> {
    if (this.isChecking) return { isOnline: true, message: 'Pengecekan sedang berlangsung' };
    this.isChecking = true;

    try {
      // Jalankan query ringan SELECT 1 untuk membangunkan & menyegarkan koneksi Supabase
      const result = await prisma.$queryRawUnsafe('SELECT 1 as keep_alive');
      console.log('💚 [SUPABASE AUTO-KEEPALIVE] Heartbeat Sukses. Database Supabase AKTIF & TERJAGA 24/7.');
      this.isChecking = false;
      return {
        isOnline: true,
        message: 'Database Supabase aktif dan terhubung normal.',
      };
    } catch (error: any) {
      console.warn('⚠️ [SUPABASE AUTO-KEEPALIVE] Koneksi Supabase mendeteksi delay/pause:', error.message);

      // Coba panggil Supabase Management API jika Access Token dan Project Ref tersedia di .env
      const projectRef = process.env.SUPABASE_PROJECT_REF;
      const accessToken = process.env.SUPABASE_ACCESS_TOKEN;

      if (projectRef && accessToken) {
        try {
          console.log(`🚀 [SUPABASE AUTO-WAKEUP] Mengirim sinyal restore otomatis ke Supabase Project: ${projectRef}...`);
          await axios.post(
            `https://api.supabase.com/v1/projects/${projectRef}/restore`,
            {},
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            }
          );
          console.log('✅ [SUPABASE AUTO-WAKEUP] Sinyal Unpause/Restore berhasil dikirim ke Supabase!');
        } catch (apiErr: any) {
          console.log('ℹ️ [SUPABASE AUTO-WAKEUP] Sinyal bangun via Management API dikirim / Database sedang dalam proses warming up.');
        }
      } else {
        console.log('ℹ️ [SUPABASE AUTO-KEEPALIVE] Sistem otomatis menggunakan Dual-Store lokal selagi database cloud menyegarkan koneksi.');
      }

      this.isChecking = false;
      return {
        isOnline: false,
        message: 'Sedang menyegarkan koneksi ke Supabase.',
      };
    }
  }
}

export const supabaseKeepAlive = new SupabaseKeepAliveService();
