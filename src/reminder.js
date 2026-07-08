const dayjs = require('dayjs');
const { getTenants } = require('./sheets');
const { getPesan } = require('./templates');
const { kirimPesan, isClientReady } = require('./whatsapp');

const H_MINUS = [7, 3, 1];       // Hari sebelum jatuh tempo
const H_PLUS = [1, 3, 7];        // Hari setelah jatuh tempo (overdue)

function hitungHariLagi(jatuhTempo) {
  const today = dayjs().startOf('day');
  const tempo = dayjs(jatuhTempo).startOf('day');
  return tempo.diff(today, 'day'); // Positif = belum, Negatif = sudah lewat
}

async function jalankanReminder() {
  console.log(`\n[Reminder] ⏰ Mulai cek reminder: ${dayjs().format('DD/MM/YYYY HH:mm')}`);

  let tenants;
  try {
    tenants = await getTenants();
  } catch (err) {
    console.error('[Reminder] Gagal ambil data tenant, skip run ini.');
    return;
  }

  let totalKirim = 0;
  let totalSkip = 0;

  for (const tenant of tenants) {
    if (tenant.status === 'lunas') {
      console.log(`[Reminder] ⏭️  Skip ${tenant.nama} (sudah lunas)`);
      totalSkip++;
      continue;
    }

    const hariLagi = hitungHariLagi(tenant.jatuhTempo);
    const hariTerlambat = Math.abs(hariLagi);

    // Cek apakah perlu kirim hari ini
    const perluKirim = H_MINUS.includes(hariLagi) || (hariLagi < 0 && H_PLUS.includes(hariTerlambat));

    if (!perluKirim) continue;

    const label = hariLagi >= 0 ? `H-${hariLagi}` : `H+${hariTerlambat} (overdue)`;
    console.log(`[Reminder] 📤 Kirim ke ${tenant.nama} (${tenant.toko}) — ${label}`);

    const pesan = getPesan(tenant, hariLagi);
    if (!pesan) continue;

    if (process.env.NODE_ENV === 'test') {
      console.log('─'.repeat(50));
      console.log(`To: ${tenant.noHp}`);
      console.log(pesan);
      console.log('─'.repeat(50));
      totalKirim++;
    } else {
      if (!isClientReady()) {
        console.error('[Reminder] WA client tidak ready, skip.');
        continue;
      }
      const berhasil = await kirimPesan(tenant.noHp, pesan);
      if (berhasil) totalKirim++;
      await delay(3000 + Math.random() * 2000);
    }
  }

  console.log(`[Reminder] ✅ Selesai — Terkirim: ${totalKirim}, Skip: ${totalSkip}\n`);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { jalankanReminder };
