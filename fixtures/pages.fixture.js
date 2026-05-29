// fixtures/pages.fixture.js
// Extends Playwright's base test with pre-instantiated page objects

const { test: base } = require('@playwright/test');
const LoginPage      = require('../pages/LoginPage');
const InventoryPage  = require('../pages/InventoryPage');
const CartPage       = require('../pages/CartPage');
const CheckoutPage   = require('../pages/CheckoutPage');
const testData       = require('../test-data/test-data.json');

const test = base.extend({

  // ── Page Objects ──────────────────────────────────────────────────

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // ── Authenticated Session ─────────────────────────────────────────
  // Use this fixture to skip login in tests that don't test login itself

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
      testData.users.standard.username,
      testData.users.standard.password
    );
    await page.waitForURL('**/inventory.html');
    await use(page);
  },

  // ── Test Data ─────────────────────────────────────────────────────

  testData: async ({}, use) => {
    await use(testData);
  },
});

const { expect } = base;
module.exports = { test, expect };
