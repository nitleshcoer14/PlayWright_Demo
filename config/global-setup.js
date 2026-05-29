// config/global-setup.js
// Runs once before all test suites

const { chromium } = require('@playwright/test');

async function globalSetup() {
  console.log('\n🚀 Global Setup: Starting test run...');
  console.log(`   BASE_URL  : ${process.env.BASE_URL || 'https://www.saucedemo.com'}`);
  console.log(`   Headless  : ${process.env.HEADLESS !== 'false'}`);
  console.log(`   Timestamp : ${new Date().toISOString()}\n`);

  // Example: you could pre-authenticate and save storage state here
  // const browser = await chromium.launch();
  // const page = await browser.newPage();
  // await page.goto(process.env.BASE_URL);
  // ... login steps ...
  // await page.context().storageState({ path: 'config/auth.json' });
  // await browser.close();
}

module.exports = globalSetup;
