const fs = require('fs/promises');
const path = require('path');
const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'audit.log');
async function logEvent(entry) {
  try {
    await fs.mkdir(LOG_DIR, { recursive: true });
    await fs.appendFile(LOG_FILE, JSON.stringify({ ...entry, timestamp: new Date().toISOString() }) + '\n');
  } catch (err) {
    console.error('Audit log failed:', err.message);
  }
}
module.exports = { logEvent };
