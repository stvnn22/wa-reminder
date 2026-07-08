/**
 * Script buat test kirim pesan ke satu nomor
 * Jalankan: npm run test-send
 */
require('dotenv').config();
const { initWhatsApp, kirimPesan } = require('./whatsapp');

const TEST_PHONE = '628123456789'; // Ganti dengan nomor HP lo sendiri buat test
const TEST_PESAN =
  'Halo! Ini test pesan dari WA Reminder Palembang Icon Mall 🎉\n\n' +
  'Kalau lo baca ini, berarti sistem berjalan dengan baik ✅';

async function main() {
  console.log('[Test] Inisialisasi WhatsApp...');
  await initWhatsApp();

  console.log(`[Test] Kirim pesan ke ${TEST_PHONE}...`);
  const ok = await kirimPesan(TEST_PHONE, TEST_PESAN);

  if (ok) {
    console.log('[Test] ✅ Berhasil!');
  } else {
    console.log('[Test] ❌ Gagal kirim pesan');
  }

  process.exit(0);
}

main().catch(err => {
  console.error('[Test] Error:', err);
  process.exit(1);
});
