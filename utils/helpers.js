// utils/helpers.js
// Reusable helper functions shared across tests

const logger = require('./logger');

/**
 * Wait for a fixed number of milliseconds (use sparingly).
 * @param {number} ms
 */
async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry an async function up to `retries` times.
 * @param {Function} fn      - async function to retry
 * @param {number}   retries - max attempts (default 3)
 * @param {number}   delay   - ms between retries (default 1000)
 */
async function retry(fn, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt === retries) throw err;
      logger.warn(`Attempt ${attempt} failed. Retrying in ${delay}ms... (${err.message})`);
      await sleep(delay);
    }
  }
}

/**
 * Generate a random alphanumeric string.
 * @param {number} length
 */
function randomString(length = 8) {
  return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Generate a random 5-digit US ZIP code.
 */
function randomZip() {
  return String(Math.floor(10000 + Math.random() * 90000));
}

/**
 * Format a price string to a float.
 * @param {string} priceStr  e.g. '$29.99'
 */
function parsePrice(priceStr) {
  return parseFloat(priceStr.replace(/[^0-9.]/g, ''));
}

/**
 * Get the current ISO timestamp string (safe for filenames).
 */
function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

module.exports = { sleep, retry, randomString, randomZip, parsePrice, timestamp };
