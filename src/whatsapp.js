const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client = null;
let isReady = false;

function createClient() {
  client = new Client({
    authStrategy: new LocalAuth({ dataPath: './.wwebjs_auth' }),
    puppeteer: {
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    },
  });

  client.on('qr', (qr) => {
    console.log('\n[WA] Scan QR code ini dengan WhatsApp lo:\n');
    qrcode.generate(qr, { small: true });
    console.log('\nBuka WhatsApp > Linked Devices > Link a Device\n');
  });

  client.on('ready', () => {
    isReady = true;
    console.log('[WA] WhatsApp client siap! ✅');
  });

  client.on('auth_failure', (msg) => {
    console.error('[WA] Auth gagal:', msg);
    isReady = false;
  });

  client.on('disconnected', (reason) => {
    console.warn('[WA] Client disconnect:', reason);
    isReady = false;
  });

  return client;
}

async function initWhatsApp() {
  if (!client) createClient();
  await client.initialize();

  // Tunggu sampai ready (max 60 detik)
  return new Promise((resolve, reject) => {
    if (isReady) return resolve();
    const timeout = setTimeout(() => reject(new Error('WA timeout')), 60000);
    client.once('ready', () => {
      clearTimeout(timeout);
      resolve();
    });
  });
}

/**
 * Kirim pesan WA
 * @param {string} noHp - format 628xx
 * @param {string} pesan
 */
async function kirimPesan(noHp, pesan) {
  if (!isReady || !client) throw new Error('WA client belum ready');

  const chatId = `${noHp}@c.us`;

  try {
    await client.sendMessage(chatId, pesan);
    console.log(`[WA] ✅ Pesan terkirim ke ${noHp}`);
    return true;
  } catch (err) {
    console.error(`[WA] ❌ Gagal kirim ke ${noHp}:`, err.message);
    return false;
  }
}

function getClient() {
  return client;
}

function isClientReady() {
  return isReady;
}

module.exports = { initWhatsApp, kirimPesan, getClient, isClientReady };
