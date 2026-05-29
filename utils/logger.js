// utils/logger.js
// Lightweight console logger with timestamps and levels

const LEVELS = { INFO: '🔵', PASS: '✅', FAIL: '❌', WARN: '⚠️ ', DEBUG: '🔍' };

function log(level, message) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  console.log(`[${timestamp}] ${LEVELS[level] || '  '} ${message}`);
}

const logger = {
  info:  (msg) => log('INFO',  msg),
  pass:  (msg) => log('PASS',  msg),
  fail:  (msg) => log('FAIL',  msg),
  warn:  (msg) => log('WARN',  msg),
  debug: (msg) => log('DEBUG', msg),
};

module.exports = logger;
