import { PrismaClient, Role, FieldType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding for JOMBE DIGITAL...');

  // 1. Password Hashing
  const hashedPassword = await bcrypt.hash('password123', 12);

  // 2. Create Users
  const adminUser = await prisma.user.upsert({
    where: { nik: '3512345678900000' },
    update: {},
    create: {
      nik: '3512345678900000',
      name: 'Kepala Desa & Admin Jombe',
      email: 'admin@jombe.desa.id',
      phone: '081234567890',
      password: hashedPassword,
      role: Role.ADMIN,
      address: 'Jl. Raya Desa Jombe No. 1',
      dusun: 'Jombe Krajan',
      rt: '001',
      rw: '001',
    },
  });

  const operatorUser = await prisma.user.upsert({
    where: { nik: '3512345678900009' },
    update: {},
    create: {
      nik: '3512345678900009',
      name: 'Budi Santoso (Operator Desa)',
      email: 'operator@jombe.desa.id',
      phone: '081234567891',
      password: hashedPassword,
      role: Role.OPERATOR,
      address: 'Jl. Pemuda No. 12',
      dusun: 'Jombe Krajan',
      rt: '002',
      rw: '001',
    },
  });

  const citizenUser = await prisma.user.upsert({
    where: { nik: '3512345678900001' },
    update: {},
    create: {
      nik: '3512345678900001',
      name: 'Siti Rahmawati',
      email: 'siti.rahma@gmail.com',
      phone: '085712345678',
      password: hashedPassword,
      role: Role.MASYARAKAT,
      address: 'Dusun Jombe Barat RT 03 RW 02',
      dusun: 'Jombe Barat',
      rt: '003',
      rw: '002',
    },
  });

  console.log('✅ Users seeded: Admin, Operator, Warga Demo.');

  // 3. Create Services & Dynamic Form Fields
  const skuService = await prisma.service.upsert({
    where: { slug: 'surat-keterangan-usaha' },
    update: {},
    create: {
      name: 'Surat Keterangan Usaha (SKU)',
      slug: 'surat-keterangan-usaha',
      description: 'Surat keterangan resmi dari Pemerintah Desa Jombe yang menerangkan bahwa pemohon memiliki usaha di wilayah Desa Jombe.',
      category: 'Surat Keterangan',
      requirements: '1. Fotokopi KTP Pemohon\n2. Fotokopi Kartu Keluarga\n3. Foto Lokasi Usaha',
      estimatedDays: 1,
      icon: 'store',
      fields: {
        create: [
          { label: 'Nama Usaha', fieldName: 'nama_usaha', fieldType: FieldType.TEXT, placeholder: 'Contoh: Toko Sembako Berkah', isRequired: true, order: 1 },
          { label: 'Jenis Usaha / Bidang', fieldName: 'jenis_usaha', fieldType: FieldType.SELECT, options: JSON.stringify(['Perdagangan', 'Pertanian', 'Kuliner', 'Jasa', 'Peternakan', 'Lainnya']), isRequired: true, order: 2 },
          { label: 'Alamat Usaha', fieldName: 'alamat_usaha', fieldType: FieldType.TEXTAREA, placeholder: 'Dusun/RT/RW tempat usaha berdiri', isRequired: true, order: 3 },
          { label: 'Lama Berdiri Usaha (Tahun)', fieldName: 'lama_usaha', fieldType: FieldType.NUMBER, placeholder: 'Contoh: 3', isRequired: true, order: 4 },
          { label: 'Keperluan Surat', fieldName: 'keperluan', fieldType: FieldType.TEXTAREA, placeholder: 'Contoh: Persyaratan Pengajuan KUR Bank', isRequired: true, order: 5 },
        ],
      },
    },
  });

  const domisiliService = await prisma.service.upsert({
    where: { slug: 'surat-keterangan-domisili' },
    update: {},
    create: {
      name: 'Surat Keterangan Domisili',
      slug: 'surat-keterangan-domisili',
      description: 'Surat keterangan tempat tinggal / domisili resmi warga di Desa Jombe.',
      category: 'Administrasi',
      requirements: '1. KTP Pemohon\n2. Kartu Keluarga\n3. Pengantar RT/RW',
      estimatedDays: 1,
      icon: 'home',
      fields: {
        create: [
          { label: 'Alamat Domisili Sekarang', fieldName: 'alamat_domisili', fieldType: FieldType.TEXTAREA, placeholder: 'Alamat lengkap tempat tinggal', isRequired: true, order: 1 },
          { label: 'Status Tempat Tinggal', fieldName: 'status_tinggal', fieldType: FieldType.SELECT, options: JSON.stringify(['Milik Sendiri', 'Sewa / Kontrak', 'Menumpang Keluarga']), isRequired: true, order: 2 },
          { label: 'Keperluan Surat', fieldName: 'keperluan', fieldType: FieldType.TEXTAREA, placeholder: 'Contoh: Pembukaan Rekening / Pekerjaan', isRequired: true, order: 3 },
        ],
      },
    },
  });

  const sktmService = await prisma.service.upsert({
    where: { slug: 'surat-keterangan-tidak-mampu' },
    update: {},
    create: {
      name: 'Surat Keterangan Tidak Mampu (SKTM)',
      slug: 'surat-keterangan-tidak-mampu',
      description: 'Surat keterangan bagi warga kurang mampu untuk keperluan beasiswa, keringanan biaya berobat/rumah sakit, atau bantuan sosial.',
      category: 'Bantuan Sosial',
      requirements: '1. KTP Pemohon & Orang Tua/Wali\n2. Kartu Keluarga\n3. Surat Pengantar RT/RW',
      estimatedDays: 1,
      icon: 'heart-handshake',
      fields: {
        create: [
          { label: 'Nama Anggota Keluarga yang Bersangkutan', fieldName: 'nama_anggota', fieldType: FieldType.TEXT, placeholder: 'Nama anak/anggota keluarga', isRequired: true, order: 1 },
          { label: 'Pekerjaan Orang Tua / Wali', fieldName: 'pekerjaan_ortu', fieldType: FieldType.TEXT, placeholder: 'Contoh: Buruh Tani', isRequired: true, order: 2 },
          { label: 'Penghasilan Rata-rata per Bulan', fieldName: 'penghasilan', fieldType: FieldType.SELECT, options: JSON.stringify(['< Rp 500.000', 'Rp 500.000 - Rp 1.000.000', 'Rp 1.000.000 - Rp 1.500.000']), isRequired: true, order: 3 },
          { label: 'Tujuan Penggunaan SKTM', fieldName: 'tujuan_sktm', fieldType: FieldType.SELECT, options: JSON.stringify(['Beasiswa Sekolah / Kuliah', 'Pengobatan / Rumah Sakit', 'Keringanan Listrik / Bansos', 'Lainnya']), isRequired: true, order: 4 },
        ],
      },
    },
  });

  console.log('✅ Services & Dynamic Fields seeded.');

  // 4. Create Letter Templates
  await prisma.letterTemplate.create({
    data: {
      serviceId: skuService.id,
      title: 'Template Resmi SKU',
      codePrefix: '510',
      headerText: 'PEMERINTAH KABUPATEN JOMBANG\nKECAMATAN JOMBANG\nPEMERINTAH DESA JOMBE',
      templateHtml: `
        <div style="font-family: Arial, sans-serif; padding: 20px; line-height: 1.6;">
          <h3 style="text-align: center; margin-bottom: 5px; text-decoration: underline;">SURAT KETERANGAN USAHA</h3>
          <p style="text-align: center; margin-top: 0;">Nomor: {{nomor_surat}}</p>
          <br/>
          <p>Yang bertanda tangan di bawah ini Kepala Desa Jombe, Kecamatan Jombang, Kabupaten Jombang, menerangkan dengan sebenarnya bahwa:</p>
          <table style="width: 100%; margin-left: 20px;">
            <tr><td style="width: 30%;">Nama</td><td>: {{nama}}</td></tr>
            <tr><td>NIK</td><td>: {{nik}}</td></tr>
            <tr><td>Alamat</td><td>: {{alamat}}</td></tr>
          </table>
          <br/>
          <p>Benar-benar yang bersangkutan memiliki usaha sebagai berikut:</p>
          <table style="width: 100%; margin-left: 20px;">
            <tr><td style="width: 30%;">Nama Usaha</td><td>: <strong>{{nama_usaha}}</strong></td></tr>
            <tr><td>Jenis Usaha</td><td>: {{jenis_usaha}}</td></tr>
            <tr><td>Alamat Usaha</td><td>: {{alamat_usaha}}</td></tr>
          </table>
          <br/>
          <p>Demikian Surat Keterangan Usaha ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
          <br/><br/>
          <div style="float: right; text-align: center; width: 200px;">
            <p>Jombe, {{tanggal_surat}}</p>
            <p>Kepala Desa Jombe</p>
            <br/><br/><br/>
            <p style="font-weight: bold; text-decoration: underline;">( KEPALA DESA JOMBE )</p>
          </div>
        </div>
      `,
    },
  });

  // 5. Create Village Profile & Statistics
  await prisma.villageProfile.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      name: 'Desa Jombe',
      district: 'Kecamatan Jombang',
      regency: 'Kabupaten Jombang',
      province: 'Jawa Timur',
      vision: 'Terwujudnya Desa Jombe yang Mandiri, Sejahtera, Transparan, dan Berkelanjutan berbasis Pelayanan Digital.',
      mission: '1. Meningkatkan kualitas pelayanan publik secara transparan & cepat.\n2. Mengembangkan sarana infrastruktur desa yang merata.\n3. Memajukan ekonomi masyarakat melalui UMKM digital desa.',
      history: 'Desa Jombe merupakan salah satu desa bersejarah di Kecamatan Jombang yang terkenal dengan kekeluargaan dan gotong royong warga yang tinggi.',
      address: 'Jl. Raya Desa Jombe No. 01, Jombang, Jawa Timur',
      phone: '0321-888999',
      email: 'pelayanan@jombe.desa.id',
      whatsapp: '6281234567890',
    },
  });

  await prisma.villageStatistic.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      totalPopulation: 3850,
      malePopulation: 1920,
      femalePopulation: 1930,
      totalDusun: 4,
      totalRt: 18,
      totalRw: 6,
      totalFamily: 1120,
    },
  });

  // 6. Create Initial News & Announcement
  await prisma.news.upsert({
    where: { slug: 'peluncuran-sistem-pelayanan-digital-desa-jombe' },
    update: {},
    create: {
      title: 'Peluncuran Sistem Pelayanan Digital Desa Jombe',
      slug: 'peluncuran-sistem-pelayanan-digital-desa-jombe',
      category: 'Pelayanan Publik',
      excerpt: 'Pemerintah Desa Jombe resmi meluncurkan platform pelayanan administrasi digital untuk mempermudah permohonan surat warga.',
      content: 'Masyarakat Desa Jombe kini dapat mengurus berbagai surat keterangan online tanpa antre di kantor desa via Website & App Android.',
      authorId: adminUser.id,
    },
  });

  await prisma.announcement.create({
    data: {
      title: 'Jam Operasional Pelayanan Kantor Desa',
      content: 'Kantor Desa Jombe melayani verifikasi fisik pada hari Senin - Jumat pukul 08.00 - 15.00 WIB. Pelayanan online 24 jam.',
      isImportant: true,
      authorId: adminUser.id,
    },
  });

  console.log('✅ Village profile, stats, news & announcements seeded.');
  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
