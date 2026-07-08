require('dotenv').config();
const cron = require('node-cron');
const { initWhatsApp } = require('./whatsapp');
const { jalankanReminder } = require('./reminder');

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '0 8 * * *'; // Default jam 08:00
const IS_TEST = process.env.NODE_ENV === 'test';

async function main() {
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   WA Auto Reminder - Palembang Icon Mall  ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log(`Mode: ${IS_TEST ? '🧪 TEST (pesan tidak dikirim)' : '🚀 PRODUCTION'}`);
  console.log(`Schedule: ${CRON_SCHEDULE}`);
  console.log('');

  if (!IS_TEST) {
    // Mode production: init WA dulu, tunggu scan QR
    console.log('[Main] Inisialisasi WhatsApp...');
    try {
      await initWhatsApp();
    } catch (err) {
      console.error('[Main] Gagal init WhatsApp:', err.message);
      process.exit(1);
    }
  } else {
    console.log('[Main] Mode TEST — skip inisialisasi WhatsApp\n');
  }

  // Jalankan sekali saat startup (buat testing)
  console.log('[Main] Menjalankan cek awal...');
  await jalankanReminder();

  // Setup cron job
  cron.schedule(CRON_SCHEDULE, async () => {
    console.log('[Cron] Triggered!');
    await jalankanReminder();
  }, {
    timezone: 'Asia/Jakarta',
  });

  console.log(`[Main] Scheduler aktif — menunggu jadwal berikutnya (${CRON_SCHEDULE})`);
  console.log('[Main] Tekan Ctrl+C untuk berhenti\n');
}

main().catch(err => {
  console.error('[Main] Fatal error:', err);
  process.exit(1);
});
