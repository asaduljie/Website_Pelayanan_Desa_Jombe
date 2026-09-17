const https = require('https');
const http = require('http');

const API_BASE = 'https://lentera-desa-backend.vercel.app/api';
const FRONTEND_BASE = 'https://www.lenteradesajombe.biz.id';

function request(fullUrl, options = {}, body = null) {
  return new Promise((resolve) => {
    try {
      const url = new URL(fullUrl);
      const isHttps = url.protocol === 'https:';
      const client = isHttps ? https : http;

      const reqOptions = {
        hostname: url.hostname,
        port: url.port || (isHttps ? 443 : 80),
        path: url.pathname + url.search,
        method: options.method || 'GET',
        headers: {
          'User-Agent': 'LenteraDesaTester/1.0',
          ...(body && !(body instanceof Buffer) ? { 'Content-Type': 'application/json' } : {}),
          ...(options.headers || {}),
        },
        timeout: 15000,
      };

      const req = client.request(reqOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          let parsed = data;
          try {
            const contentType = res.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
              parsed = JSON.parse(data);
            }
          } catch (e) {
            // Keep as string
          }
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            headers: res.headers,
            body: parsed,
            raw: data,
          });
        });
      });

      req.on('timeout', () => {
        req.destroy();
        resolve({ ok: false, status: 408, error: 'Request Timeout (15s)' });
      });

      req.on('error', (err) => {
        resolve({ ok: false, status: 0, error: err.message });
      });

      if (body) {
        if (typeof body === 'string' || body instanceof Buffer) {
          req.write(body);
        } else {
          req.write(JSON.stringify(body));
        }
      }
      req.end();
    } catch (err) {
      resolve({ ok: false, status: 0, error: err.message });
    }
  });
}

const testResults = [];

function recordTest(category, name, passed, details, isBug = false) {
  testResults.push({ category, name, passed, details, isBug });
  const icon = passed ? '✅ PASS' : (isBug ? '❌ BUG/ERROR' : '⚠️ WARNING');
  console.log(`[${icon}] [${category}] ${name}: ${typeof details === 'string' ? details : JSON.stringify(details).slice(0, 120)}`);
}

async function runFullTestingSuite() {
  console.log('================================================================');
  console.log('🚀 MEMULAI PENGUJIAN MENYELURUH FITUR SISTEM LENTERA DESA');
  console.log(`API Target: ${API_BASE}`);
  console.log(`Frontend Target: ${FRONTEND_BASE}`);
  console.log('================================================================\n');

  // ===========================================================================
  // 1. FRONTEND PAGES HTTP CHECK
  // ===========================================================================
  console.log('\n--- 1. PENGUJIAN HALAMAN FRONTEND (PUBLIC & PORTAL) ---');
  const frontendRoutes = [
    { path: '/', name: 'Homepage (Beranda Desa)' },
    { path: '/profil', name: 'Profil Desa & Statistik BPS' },
    { path: '/layanan', name: 'Katalog Layanan Surat' },
    { path: '/layanan/surat-keterangan-usaha', name: 'Detail Layanan SKU' },
    { path: '/lacak', name: 'Halaman Lacak Permohonan' },
    { path: '/berita', name: 'Halaman Berita & Artikel' },
    { path: '/pengaduan', name: 'Halaman Aspirasi / Pengaduan' },
    { path: '/login', name: 'Halaman Login' },
    { path: '/register', name: 'Halaman Registrasi Warga' },
    { path: '/dashboard', name: 'Halaman Dashboard Warga' },
    { path: '/operator', name: 'Halaman Dashboard Operator' },
    { path: '/verifikasi-ttd/test', name: 'Halaman Verifikasi TTE' },
  ];

  for (const route of frontendRoutes) {
    const res = await request(`${FRONTEND_BASE}${route.path}`);
    if (res.status === 200) {
      // check if html contains typical Next.js error
      const isHtml = typeof res.raw === 'string' && res.raw.includes('<!DOCTYPE html>');
      const hasError = res.raw.includes('Internal Server Error') || res.raw.includes('Application error');
      if (hasError) {
        recordTest('Frontend Pages', route.name, false, `Render error detected on ${route.path}`, true);
      } else {
        recordTest('Frontend Pages', route.name, true, `HTTP ${res.status} OK (HTML size: ${res.raw.length} bytes)`);
      }
    } else {
      recordTest('Frontend Pages', route.name, false, `HTTP ${res.status} on ${route.path}`, true);
    }
  }

  // ===========================================================================
  // 2. BACKEND HEALTH & PUBLIC DATA ENDPOINTS
  // ===========================================================================
  console.log('\n--- 2. PENGUJIAN BACKEND HEALTH & CONTENT API ---');
  
  // Health
  const healthRes = await request(`${API_BASE}/health`);
  recordTest('Backend Core', 'Health Check (/health)', healthRes.status === 200, `HTTP ${healthRes.status}: ${JSON.stringify(healthRes.body)}`, healthRes.status !== 200);

  // Village Profile
  const profileRes = await request(`${API_BASE}/content/profile`);
  const hasProfileData = profileRes.status === 200 && profileRes.body?.data?.name;
  recordTest('Content API', 'Profil Desa (/content/profile)', hasProfileData, `Name: ${profileRes.body?.data?.name || 'N/A'}, Penduduk: ${profileRes.body?.data?.stats?.penduduk || 'N/A'}`, !hasProfileData);

  // Services Catalog
  let services = [];
  const servicesRes = await request(`${API_BASE}/services`);
  if (servicesRes.status === 200 && Array.isArray(servicesRes.body?.data)) {
    services = servicesRes.body.data;
    recordTest('Services API', 'Daftar Layanan (/services)', true, `Ditemukan ${services.length} layanan aktif`);
  } else {
    recordTest('Services API', 'Daftar Layanan (/services)', false, `Gagal memuat layanan: HTTP ${servicesRes.status}`, true);
  }

  // Check detail for each service slug
  for (const s of services) {
    const sDetail = await request(`${API_BASE}/services/${s.slug}`);
    const ok = sDetail.status === 200 && sDetail.body?.data?.slug === s.slug;
    recordTest('Services API', `Detail Layanan: ${s.name} (/services/${s.slug})`, ok, ok ? 'Fields & Requirements valid' : `HTTP ${sDetail.status}`, !ok);
  }

  // News List
  const newsRes = await request(`${API_BASE}/content/news`);
  let sampleNewsSlug = '';
  if (newsRes.status === 200 && Array.isArray(newsRes.body?.data)) {
    recordTest('News API', 'Daftar Berita (/content/news)', true, `Ditemukan ${newsRes.body.data.length} berita`);
    if (newsRes.body.data.length > 0) {
      sampleNewsSlug = newsRes.body.data[0].slug;
    }
  } else {
    recordTest('News API', 'Daftar Berita (/content/news)', false, `HTTP ${newsRes.status}`, true);
  }

  // News Detail by Slug
  if (sampleNewsSlug) {
    const newsDetailRes = await request(`${API_BASE}/content/news/${sampleNewsSlug}`);
    const ok = newsDetailRes.status === 200 && newsDetailRes.body?.data?.slug === sampleNewsSlug;
    recordTest('News API', `Detail Berita (/content/news/${sampleNewsSlug})`, ok, ok ? newsDetailRes.body.data.title : `HTTP ${newsDetailRes.status}`, !ok);
  }

  // Announcements
  const annRes = await request(`${API_BASE}/content/announcements`);
  recordTest('Content API', 'Pengumuman Desa (/content/announcements)', annRes.status === 200, `Ditemukan ${annRes.body?.data?.length ?? 0} pengumuman`, annRes.status !== 200);

  // Agendas
  const agendaRes = await request(`${API_BASE}/content/agendas`);
  recordTest('Content API', 'Agenda Desa (/content/agendas)', agendaRes.status === 200, `Ditemukan ${agendaRes.body?.data?.length ?? 0} agenda`, agendaRes.status !== 200);

  // Captcha
  const captchaRes = await request(`${API_BASE}/captcha`);
  const hasCaptcha = captchaRes.status === 200 && captchaRes.body?.data?.key && captchaRes.body?.data?.image;
  recordTest('Security API', 'Anti-Bot Captcha (/captcha)', hasCaptcha, hasCaptcha ? `Key generated, image len: ${captchaRes.body.data.image.length}` : `HTTP ${captchaRes.status}`, !hasCaptcha);

  // AI Chat Assistant
  const aiRes = await request(`${API_BASE}/ai/chat`, { method: 'POST' }, { query: 'Bagaimana cara buat surat domisili di desa jombe?' });
  const hasAiReply = aiRes.status === 200 && aiRes.body?.data?.reply;
  recordTest('AI Assistant', 'Tanya AI Layanan Desa (/ai/chat)', hasAiReply, hasAiReply ? `Reply: "${aiRes.body.data.reply.slice(0, 60)}..."` : `HTTP ${aiRes.status}: ${JSON.stringify(aiRes.body)}`, !hasAiReply);

  // ===========================================================================
  // 3. AUTHENTICATION (LOGIN, REGISTER, PROFILE)
  // ===========================================================================
  console.log('\n--- 3. PENGUJIAN AUTHENTICATION & USER MANAGEMENT ---');
  
  // Login Citizen Demo
  let citizenToken = '';
  let citizenUser = null;
  const citizenLoginRes = await request(`${API_BASE}/auth/login`, { method: 'POST' }, {
    nik: '3512345678900001',
    password: 'password123',
  });
  if (citizenLoginRes.status === 200 && citizenLoginRes.body?.data?.token) {
    citizenToken = citizenLoginRes.body.data.token;
    citizenUser = citizenLoginRes.body.data.user;
    recordTest('Auth API', 'Login Warga (NIK 3512345678900001)', true, `Nama: ${citizenUser?.fullName}, Role: ${citizenUser?.role}`);
  } else {
    recordTest('Auth API', 'Login Warga (NIK 3512345678900001)', false, `HTTP ${citizenLoginRes.status}: ${JSON.stringify(citizenLoginRes.body)}`, true);
  }

  // Login Operator Demo
  let operatorToken = '';
  let operatorUser = null;
  const opLoginRes = await request(`${API_BASE}/auth/login`, { method: 'POST' }, {
    nik: '3512345678900009',
    password: 'password123',
  });
  if (opLoginRes.status === 200 && opLoginRes.body?.data?.token) {
    operatorToken = opLoginRes.body.data.token;
    operatorUser = opLoginRes.body.data.user;
    recordTest('Auth API', 'Login Operator (NIK 3512345678900009)', true, `Nama: ${operatorUser?.fullName}, Role: ${operatorUser?.role}`);
  } else {
    recordTest('Auth API', 'Login Operator (NIK 3512345678900009)', false, `HTTP ${opLoginRes.status}: ${JSON.stringify(opLoginRes.body)}`, true);
  }

  // Login with invalid password
  const badLoginRes = await request(`${API_BASE}/auth/login`, { method: 'POST' }, {
    nik: '3512345678900001',
    password: 'wrongpassword',
  });
  recordTest('Auth API', 'Login Password Salah (Negative Test)', badLoginRes.status === 401 || badLoginRes.status === 400, `Expected 401/400, got HTTP ${badLoginRes.status}`, badLoginRes.status === 200);

  // Profile Check
  if (citizenToken) {
    const profCheck = await request(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    recordTest('Auth API', 'Get Profile Citizen (/auth/profile)', profCheck.status === 200, profCheck.body?.data?.fullName || `HTTP ${profCheck.status}`, profCheck.status !== 200);

    // Update Profile
    const updateProf = await request(`${API_BASE}/auth/profile`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${citizenToken}` },
    }, {
      phoneNumber: '081234567899',
    });
    recordTest('Auth API', 'Update Profile Citizen (/auth/profile)', updateProf.status === 200, updateProf.body?.message || `HTTP ${updateProf.status}`, updateProf.status !== 200);
  }

  // ===========================================================================
  // 4. PERMOHONAN SURAT (CITIZEN APPLICATION SUBMISSION & TRACKING)
  // ===========================================================================
  console.log('\n--- 4. PENGUJIAN PERMOHONAN SURAT & TRACKING ---');
  
  let newAppNumber = '';
  let newAppId = '';

  if (citizenToken) {
    // Submit Application for SKU
    const appSubmitRes = await request(`${API_BASE}/applications`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
    }, {
      serviceId: services[0]?.id || 'service-sku-1',
      fieldValues: 'Nama Usaha: Toko Otomatisasi Uji Coba, Jenis: Perdagangan, Alamat: Dusun Jombe',
    });

    if (appSubmitRes.status === 200 || appSubmitRes.status === 201) {
      newAppNumber = appSubmitRes.body?.data?.applicationNumber;
      newAppId = appSubmitRes.body?.data?.id;
      recordTest('Application API', 'Pengajuan Surat Mandiri oleh Warga', true, `Nomor: ${newAppNumber}, ID: ${newAppId}`);
    } else {
      recordTest('Application API', 'Pengajuan Surat Mandiri oleh Warga', false, `HTTP ${appSubmitRes.status}: ${JSON.stringify(appSubmitRes.body)}`, true);
    }

    // Get My Applications
    const myAppsRes = await request(`${API_BASE}/applications/my`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    const hasMyApps = myAppsRes.status === 200 && Array.isArray(myAppsRes.body?.data);
    recordTest('Application API', 'Riwayat Permohonan Warga (/applications/my)', hasMyApps, `Total: ${myAppsRes.body?.data?.length || 0} permohonan`, !hasMyApps);
  }

  // Tracking Permohonan via applicationNumber
  if (newAppNumber) {
    const trackRes = await request(`${API_BASE}/applications/track?applicationNumber=${newAppNumber}`);
    const ok = trackRes.status === 200 && trackRes.body?.data?.applicationNumber === newAppNumber;
    recordTest('Tracking API', `Lacak dengan Nomor Permohonan (${newAppNumber})`, ok, ok ? `Status: ${trackRes.body.data.status}` : `HTTP ${trackRes.status}`, !ok);
  }

  // Tracking Permohonan via NIK
  const trackNikRes = await request(`${API_BASE}/applications/track?nik=3512345678900001`);
  recordTest('Tracking API', 'Lacak dengan NIK Warga (3512345678900001)', trackNikRes.status === 200, `Ditemukan: ${Array.isArray(trackNikRes.body?.data) ? trackNikRes.body.data.length : (trackNikRes.body?.data ? 1 : 0)} data`, trackNikRes.status !== 200);

  // Tracking Permohonan Invalid (Negative Test)
  const trackInvRes = await request(`${API_BASE}/applications/track?applicationNumber=JMB-99999999`);
  recordTest('Tracking API', 'Lacak Nomor Tidak Ada (Negative Test)', trackInvRes.status === 404 || (trackInvRes.status === 200 && !trackInvRes.body?.data), `HTTP ${trackInvRes.status}: ${JSON.stringify(trackInvRes.body?.message || trackInvRes.body)}`);

  // ===========================================================================
  // 5. OPERATOR DASHBOARD, STATUS UPDATE & PDF GENERATION
  // ===========================================================================
  console.log('\n--- 5. PENGUJIAN OPERATOR WORKFLOW & TTE/PDF ---');

  if (operatorToken) {
    // Operator Stats
    const opStats = await request(`${API_BASE}/operator/stats`, {
      headers: { Authorization: `Bearer ${operatorToken}` },
    });
    recordTest('Operator API', 'Statistik Operator (/operator/stats)', opStats.status === 200, opStats.body?.data ? JSON.stringify(opStats.body.data) : `HTTP ${opStats.status}`, opStats.status !== 200);

    // Operator Applications List
    const opApps = await request(`${API_BASE}/operator/applications`, {
      headers: { Authorization: `Bearer ${operatorToken}` },
    });
    recordTest('Operator API', 'Daftar Semua Permohonan Masuk (/operator/applications)', opApps.status === 200, `Total: ${opApps.body?.data?.length || 0} permohonan`, opApps.status !== 200);

    // If we have an application to process:
    const targetAppId = newAppId || opApps.body?.data?.[0]?.id;
    if (targetAppId) {
      // Step A: Update Status to VERIFIED / PROCESSING
      const updateStatRes = await request(`${API_BASE}/operator/applications/${targetAppId}/status`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${operatorToken}` },
      }, {
        status: 'PROCESSING',
        operatorNotes: 'Dokumen sedang diverifikasi oleh staf pelayanan',
      });
      recordTest('Operator API', `Update Status ke PROCESSING (${targetAppId})`, updateStatRes.status === 200, updateStatRes.body?.message || `HTTP ${updateStatRes.status}`, updateStatRes.status !== 200);

      // Step B: Generate PDF Letter with TTE
      const genPdfRes = await request(`${API_BASE}/operator/applications/generate-letter`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${operatorToken}` },
      }, {
        applicationId: targetAppId,
      });
      
      let letterNumber = '';
      if (genPdfRes.status === 200 && genPdfRes.body?.data?.letterNumber) {
        letterNumber = genPdfRes.body.data.letterNumber;
        recordTest('Operator API', `Generate Surat Resmi & TTE Barcode`, true, `Nomor Surat: ${letterNumber}`);
      } else {
        recordTest('Operator API', `Generate Surat Resmi & TTE Barcode`, false, `HTTP ${genPdfRes.status}: ${JSON.stringify(genPdfRes.body)}`, true);
      }

      // Step C: Direct PDF Stream / Download
      const streamPdfRes = await request(`${API_BASE}/operator/pdf/${targetAppId}`);
      const isPdf = streamPdfRes.status === 200 && (streamPdfRes.headers['content-type'] || '').includes('application/pdf');
      recordTest('PDF Engine', `Download / Stream PDF Surat (/operator/pdf/${targetAppId})`, isPdf, `Content-Type: ${streamPdfRes.headers['content-type']}, Size: ${streamPdfRes.raw.length} bytes`, !isPdf);

      // Step D: Public TTE Verification
      const verifyId = letterNumber || targetAppId;
      const verifyRes = await request(`${API_BASE}/public/verify-tte/${encodeURIComponent(verifyId)}`);
      const isVerified = verifyRes.status === 200 && verifyRes.body?.data?.isValid;
      recordTest('TTE Verification', `Verifikasi Keaslian TTE (/public/verify-tte/${verifyId})`, isVerified, isVerified ? `Status: Asli, Penandatangan: ${verifyRes.body.data.signedBy}` : `HTTP ${verifyRes.status}: ${JSON.stringify(verifyRes.body)}`, !isVerified);
    }
  }

  // ===========================================================================
  // 6. PENGADUAN / ASPIRASI WARGA
  // ===========================================================================
  console.log('\n--- 6. PENGUJIAN PENGADUAN & ASPIRASI WARGA ---');
  
  // Submit Complaint
  const complaintRes = await request(`${API_BASE}/complaints`, {
    method: 'POST',
  }, {
    title: 'Uji Coba Pengaduan Lampu Jalan Dusun Jombe',
    description: 'Lampu jalan di RT 01 Dusun Jombe mati sejak semalam, mohon perbaikan.',
    reporterName: 'Warga Tester',
    reporterPhone: '081234567890',
    dusun: 'Dusun Jombe',
    category: 'Infrastruktur',
  });

  let createdComplaintId = '';
  if (complaintRes.status === 200 || complaintRes.status === 201) {
    createdComplaintId = complaintRes.body?.data?.id;
    recordTest('Complaint API', 'Kirim Pengaduan Warga (/complaints)', true, `ID: ${createdComplaintId}`);
  } else {
    recordTest('Complaint API', 'Kirim Pengaduan Warga (/complaints)', false, `HTTP ${complaintRes.status}: ${JSON.stringify(complaintRes.body)}`, true);
  }

  // List Complaints
  const listCompRes = await request(`${API_BASE}/complaints`);
  const hasCompList = listCompRes.status === 200 && Array.isArray(listCompRes.body?.data);
  recordTest('Complaint API', 'Daftar Pengaduan Publik (/complaints)', hasCompList, `Total: ${listCompRes.body?.data?.length || 0} pengaduan`, !hasCompList);

  // Operator Update Complaint
  if (operatorToken && createdComplaintId) {
    const patchCompRes = await request(`${API_BASE}/operator/complaints/${createdComplaintId}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${operatorToken}` },
    }, {
      status: 'IN_PROGRESS',
      response: 'Laporan telah diteruskan ke tim teknis desa untuk pengecekan gardu.',
    });
    recordTest('Complaint API', 'Operator Tanggapi Pengaduan (/operator/complaints/:id)', patchCompRes.status === 200, patchCompRes.body?.message || `HTTP ${patchCompRes.status}`, patchCompRes.status !== 200);
  }

  // ===========================================================================
  // 7. SUMMARY & BUG AUDIT
  // ===========================================================================
  console.log('\n================================================================');
  console.log('📋 RINGKASAN HASIL PENGUJIAN KESELURUHAN');
  console.log('================================================================');
  const total = testResults.length;
  const passed = testResults.filter(t => t.passed).length;
  const bugs = testResults.filter(t => t.isBug);

  console.log(`Total Pengujian : ${total}`);
  console.log(`Berhasil        : ${passed}`);
  console.log(`Bugs / Errors   : ${bugs.length}`);

  if (bugs.length > 0) {
    console.log('\n❌ DAFTAR BUGS & MASALAH YANG DITEMUKAN (SEGERA DILAPORKAN):');
    bugs.forEach((b, idx) => {
      console.log(` ${idx + 1}. [${b.category}] ${b.name} -> ${b.details}`);
    });
  } else {
    console.log('\n🎉 SEMUA FITUR DIUJI BERJALAN LANCAR TANPA BUG/ERROR FATAL!');
  }

  return { total, passed, bugs, testResults };
}

runFullTestingSuite().catch(console.error);
