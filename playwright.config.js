// @ts-check
const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

module.exports = defineConfig({
  // ── Test Discovery ─────────────────────────────────────────────────
  testDir: './tests',
  testMatch: '**/*.spec.js',

  // ── Execution ──────────────────────────────────────────────────────
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: process.env.CI ? 2 : 1,
  timeout: 30_000,
  expect: { timeout: 5_000 },

  // ── Reporting ──────────────────────────────────────────────────────
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html-report', open: 'always' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/results.xml' }],
  ],

  // ── Global Setup / Teardown ────────────────────────────────────────
  globalSetup: require.resolve('./config/global-setup.js'),
  globalTeardown: require.resolve('./config/global-teardown.js'),

  // ── Shared Settings ────────────────────────────────────────────────
  use: {
    baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',
    headless: process.env.HEADLESS !== 'false',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    actionTimeout: 10_000,
    navigationTimeout: 15_000,
  },

  // ── Output ─────────────────────────────────────────────────────────
  outputDir: 'reports/test-artifacts',

  // ── Projects (Browsers) ────────────────────────────────────────────
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    ],
});
