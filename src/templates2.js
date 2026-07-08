const dayjs = require('dayjs');

function getPesan(tenant, hariLagi) {
  const { nama, noInvoice, nominal, jatuhTempo } = tenant;
  const tanggalFormatted = dayjs(jatuhTempo).format('DD MMMM YYYY');

  // Pesan overdue (sudah lewat jatuh tempo)
  if (hariLagi < 0) {
    return (
      `Selamat pagi Bapak/Ibu.\n\n` +
      `Kami ingin mengingatkan bahwa invoice berikut telah melewati tanggal jatuh tempo ${tanggalFormatted} dan hingga saat ini pembayaran masih belum kami terima.\n\n` +
      `Invoice: ${noInvoice}\n` +
      `Nominal: ${nominal}\n\n` +
      `Mohon kesediaannya untuk segera melakukan pembayaran. Apabila pembayaran sudah dilakukan, mohon abaikan pesan ini atau kirimkan bukti pembayarannya.\n\n` +
      `Terima kasih.`
    );
  }

  // Pesan H-7, H-3, H-1
  return (
    `Selamat pagi Bapak/Ibu *${nama}*.\n\n` +
    `Kami ingin mengingatkan bahwa invoice berikut akan jatuh tempo dalam *${hariLagi} hari lagi*, yaitu pada *${tanggalFormatted}*.\n\n` +
    `📋 Invoice: *${noInvoice}*\n` +
    `💰 Nominal: *${nominal}*\n\n` +
    `Mohon kesediaannya untuk segera melakukan pembayaran. Apabila pembayaran sudah dilakukan, mohon abaikan pesan ini atau kirimkan bukti pembayarannya.\n\n` +
    `Terima kasih.\n` +
    `_Management Palembang Icon Mall_`
  );
}

module.exports = { getPesan };
