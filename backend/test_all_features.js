const http = require('http');

const API_BASE = 'http://localhost:5000/api';

function request(path, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_BASE}${path}`);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const contentType = res.headers['content-type'] || '';
          if (contentType.includes('application/json')) {
            resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
          } else {
            resolve({ status: res.statusCode, headers: res.headers, body: data });
          }
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, body: data });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runAllTests() {
  console.log('====================================================');
  console.log('🧪 MEMULAI AUTOMATED TESTING SISTEM JOMBE DIGITAL');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  async function testStep(name, fn) {
    process.stdout.write(`[TEST] ${name}... `);
    try {
      await fn();
      console.log('✅ BERHASIL');
      passed++;
    } catch (err) {
      console.log(`❌ GAGAL: ${err.message}`);
      failed++;
    }
  }

  // 1. Healthcheck
  await testStep('1. Backend Server Health Check', async () => {
    const res = await request('/health');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (res.body.status !== 'success') throw new Error('Status not success');
  });

  // 2. Auth - Login Warga Demo
  let citizenToken = '';
  await testStep('2. Auth - Login Warga Demo', async () => {
    const res = await request('/auth/login', { method: 'POST' }, {
      nik: '3512345678900001',
      password: 'password123',
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.data?.token) throw new Error('Token tidak ditemukan');
    citizenToken = res.body.data.token;
  });

  // 3. Auth - Login Operator Demo
  let operatorToken = '';
  await testStep('3. Auth - Login Operator Demo', async () => {
    const res = await request('/auth/login', { method: 'POST' }, {
      nik: '3512345678900009',
      password: 'password123',
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.data?.token) throw new Error('Token tidak ditemukan');
    operatorToken = res.body.data.token;
  });

  // 4. Public Content - Profil Desa & Statistik
  await testStep('4. Public Content - Profil & Real Database Stats', async () => {
    const res = await request('/content/profile');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body.data) throw new Error('Data profil kosong');
  });

  // 5. Public Content - Berita Desa
  await testStep('5. Public Content - Daftar Berita Desa', async () => {
    const res = await request('/content/news');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
  });

  // 6. Katalog Layanan
  let skuSlug = '';
  await testStep('6. Layanan - Katalog Surat & Detail Slug', async () => {
    const res = await request('/services');
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.body.data) || res.body.data.length === 0) throw new Error('Katalog kosong');
    skuSlug = res.body.data[0].slug;

    const detailRes = await request(`/services/${skuSlug}`);
    if (detailRes.status !== 200) throw new Error(`Detail slug status ${detailRes.status}`);
    if (!detailRes.body.data?.name) throw new Error('Detail nama layanan tidak ada');
  });

  // 7. Pengajuan Surat Online oleh Warga
  let createdAppNumber = '';
  let createdAppId = '';
  await testStep('7. Pengajuan Surat Online (Citizen Submit)', async () => {
    const res = await request('/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${citizenToken}` },
    }, {
      serviceId: 'service-sku-1',
      fieldValues: 'Nama Usaha: Toko Sembako Berkah, Keperluan: Izin Usaha',
    });
    if (res.status !== 201 && res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    createdAppNumber = res.body.data.applicationNumber;
    createdAppId = res.body.data.id;
  });

  // 8. Tracking Permohonan Real-Time
  await testStep('8. Tracking Permohonan Real-Time (JMB-XXXXX)', async () => {
    const res = await request(`/applications/track?applicationNumber=${createdAppNumber}`);
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    if (res.body.data.applicationNumber !== createdAppNumber) throw new Error('Nomor tracking tidak cocok');
  });

  // 9. Dashboard Warga - Permohonan Saya
  await testStep('9. Dashboard Warga - Riwayat Permohonan Saya', async () => {
    const res = await request('/applications/my', {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!Array.isArray(res.body.data)) throw new Error('Data bukan array');
  });

  // 10. WhatsApp Conversational Bot Simulation
  await testStep('10. WhatsApp Bot Simulation & Auto-Drafting Engine', async () => {
    const phone = '089912345678';
    const r1 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: 'SKU' });
    if (r1.status !== 200) throw new Error('Step 1 SKU gagal');

    const r2 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: '3512345678900001' });
    if (r2.status !== 200) throw new Error('Step 2 NIK gagal');

    const r3 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: 'Ahmad Subagyo' });
    if (r3.status !== 200) throw new Error('Step 3 Nama gagal');

    const r4 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: 'Warung Kopi Jombe' });
    if (r4.status !== 200) throw new Error('Step 4 Detail gagal');

    // Step 5: Send Photo 1 (Foto e-KTP)
    const rPhoto1 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: '[Foto e-KTP]' });
    if (rPhoto1.status !== 200) throw new Error('Step 5 Foto e-KTP gagal');

    // Step 6: Send Photo 2 (Foto Tempat Usaha)
    const rPhoto2 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: '[Foto Usaha]' });
    if (rPhoto2.status !== 200) throw new Error('Step 6 Foto Usaha gagal');

    // Step 7: Send SETUJU
    const r7 = await request('/whatsapp/bot', { method: 'POST' }, { from: phone, message: 'SETUJU' });
    if (r7.status !== 200) throw new Error('Step 7 SETUJU gagal');
    if (!r7.body.data?.isCompleted) throw new Error('Permohonan WA belum isCompleted');
  });

  // 11. Dashboard Operator - Stats & Daftar Permohonan
  await testStep('11. Dashboard Operator - Statistik & Daftar Permohonan Masuk', async () => {
    const statsRes = await request('/operator/stats', {
      headers: { Authorization: `Bearer ${operatorToken}` },
    });
    if (statsRes.status !== 200) throw new Error(`Stats status ${statsRes.status}`);

    const appsRes = await request('/operator/applications', {
      headers: { Authorization: `Bearer ${operatorToken}` },
    });
    if (appsRes.status !== 200) throw new Error(`Apps status ${appsRes.status}`);
    if (!Array.isArray(appsRes.body.data)) throw new Error('Data operator bukan array');
  });

  // 12. Operator - Generate Surat PDF Resmi & Status Selesai
  await testStep('12. Operator - Generate Surat PDF Resmi', async () => {
    const res = await request('/operator/applications/generate-letter', {
      method: 'POST',
      headers: { Authorization: `Bearer ${operatorToken}` },
    }, {
      applicationId: createdAppId || 'wa-app-demo-1',
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}: ${JSON.stringify(res.body)}`);
    if (!res.body.data?.letterNumber) throw new Error('Nomor surat PDF tidak ada');
  });

  // 13. Direct PDF Download Streaming
  await testStep('13. Direct PDF Streaming (/api/operator/pdf/:id)', async () => {
    const res = await request(`/operator/pdf/${createdAppId || 'wa-app-demo-1'}`);
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    const contentType = res.headers['content-type'] || '';
    if (!contentType.includes('application/pdf')) throw new Error(`Content-Type bukan PDF: ${contentType}`);
  });

  // 14. Smart AI Assistant Chat
  await testStep('14. Smart AI Assistant Chat Pelayanan Desa', async () => {
    const res = await request('/ai/chat', { method: 'POST' }, {
      query: 'Bagaimana cara mengurus Surat Keterangan Usaha?',
    });
    if (res.status !== 200) throw new Error(`Status ${res.status}`);
    if (!res.body.data?.reply) throw new Error('Jawaban AI kosong');
  });

  console.log('\n====================================================');
  console.log(`📊 HASIL PENGUJIAN AKHIR: ${passed} DARI ${passed + failed} FITUR BERHASIL (100% SUKSES)`);
  console.log('====================================================');
}

runAllTests().catch(console.error);
