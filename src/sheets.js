const { google } = require('googleapis');
const path = require('path');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../config/credentials.json'),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || 'Tenant';

/**
 * Format kolom:
 * A: Nama PIC
 * B: Nama Tenant
 * C: No HP
 * D: Jatuh Tempo (YYYY-MM-DD)
 * E: Status (Lunas / Belum)
 * F: No. Invoice
 * G: Nominal
 */
async function getTenants() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A2:G`,
    });

    const rows = res.data.values || [];

    const tenants = rows
      .filter(row => row.length >= 4)
      .map(row => ({
        namaPIC: row[0]?.trim() || '',
        namaTenant: row[1]?.trim() || '',
        noHp: normalizePhone(row[2]?.trim() || ''),
        jatuhTempo: row[3]?.trim() || '',
        status: row[4]?.trim()?.toLowerCase() || 'belum',
        noInvoice: row[5]?.trim() || '-',
        nominal: formatNominal(row[6]?.trim() || '0'),
      }))
      .filter(t => t.namaPIC && t.noHp && t.jatuhTempo);

    console.log(`[Sheets] Berhasil baca ${tenants.length} data tenant`);
    return tenants;
  } catch (err) {
    console.error('[Sheets] Gagal baca data:', err.message);
    throw err;
  }
}

function normalizePhone(phone) {
  phone = phone.replace(/[\s\-().+]/g, '');
  if (phone.startsWith('08')) return '62' + phone.slice(1);
  if (phone.startsWith('8')) return '62' + phone;
  if (phone.startsWith('628')) return phone;
  return phone;
}

function formatNominal(nominal) {
  const angka = parseFloat(nominal) || 0;
  return 'Rp ' + angka.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

module.exports = { getTenants };
