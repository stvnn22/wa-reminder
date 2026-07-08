# WA Auto Reminder — Palembang Icon Mall

Sistem WhatsApp auto reminder jatuh tempo pembayaran tenant (H-7, H-3, H-1).

## Stack
- Node.js
- whatsapp-web.js (kirim WA via WhatsApp Web)
- Google Sheets API (baca data tenant)
- node-cron (scheduler harian)
- Railway / Render (hosting gratis)

---

## Setup: Step by Step

### 1. Clone & Install

```bash
git clone <repo-url>
cd wa-reminder
npm install
```

### 2. Setup Google Sheets API

1. Buka [Google Cloud Console](https://console.cloud.google.com)
2. Buat project baru (atau pakai yang ada)
3. Aktifkan **Google Sheets API**
4. Buat **Service Account**:
   - IAM & Admin → Service Accounts → Create
   - Download file JSON credentials-nya
5. Rename file JSON itu jadi `credentials.json`, taruh di folder `config/`
6. Buka Google Sheets lo → Share ke email service account (yang ada di credentials.json)

### 3. Format Google Sheets

Buat sheet dengan nama `Tenant` (atau sesuaikan di .env), dengan kolom:

| A (Nama Tenant) | B (Nama Toko) | C (No HP) | D (Jatuh Tempo) | E (Status) |
|---|---|---|---|---|
| Budi Santoso | Toko ABC | 08123456789 | 2024-08-15 | Belum |
| Siti Rahayu | Warung XYZ | 628987654321 | 2024-08-17 | Lunas |

- Kolom C: No HP boleh format 08xx, 628xx, atau 8xx
- Kolom D: Format tanggal YYYY-MM-DD
- Kolom E: `Lunas` atau `Belum` (kalau kosong dianggap Belum)

### 4. Setup .env

```bash
cp .env.example .env
```

Edit `.env`:
```
SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms
SHEET_NAME=Tenant
NODE_ENV=test
```

> `SPREADSHEET_ID` ada di URL Google Sheets lo:
> `https://docs.google.com/spreadsheets/d/**INI_ID_NYA**/edit`

### 5. Jalankan Mode Test

```bash
npm start
```

Di mode `test`, pesan tidak benar-benar dikirim ke WA — hanya tampil di terminal.
Cocok buat ngecek apakah data terbaca dengan benar.

### 6. Jalankan Mode Production

Ganti `.env`:
```
NODE_ENV=production
```

Jalankan:
```bash
npm start
```

Akan muncul QR code di terminal. Scan dengan WhatsApp lo:
- Buka WhatsApp → Linked Devices → Link a Device → Scan QR

Setelah tersambung, bot akan kirim pesan otomatis sesuai jadwal.

### 7. Test Kirim Manual

```bash
# Edit dulu nomor HP di src/test-send.js
npm run test-send
```

---

## Deploy ke Railway (Gratis)

1. Push ke GitHub
2. Buka [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Tambah environment variables (isi semua dari .env)
4. Upload `credentials.json` via Volume atau env var
5. Deploy!

> ⚠️ **Catatan**: Sesi WA perlu di-scan ulang kalau server restart. 
> Untuk production yang lebih stabil, pertimbangkan WhatsApp Business API.

---

## Struktur Folder

```
wa-reminder/
├── config/
│   └── credentials.json     ← service account Google (jangan di-commit!)
├── src/
│   ├── index.js             ← entry point + cron scheduler
│   ├── sheets.js            ← baca data dari Google Sheets
│   ├── whatsapp.js          ← handle WA client
│   ├── reminder.js          ← logika cek jatuh tempo + kirim
│   ├── templates.js         ← template pesan H-7, H-3, H-1
│   └── test-send.js         ← kirim test ke satu nomor
├── .env
├── .env.example
├── .gitignore
└── package.json
```
