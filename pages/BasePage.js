// pages/BasePage.js
// All page objects extend this — shared helpers live here

class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────

  async navigate(path = '') {
    await this.page.goto(path);
  }

  async getTitle() {
    return this.page.title();
  }

  async getCurrentURL() {
    return this.page.url();
  }

  // ── Interactions ──────────────────────────────────────────────────

  async click(selector) {
    await this.page.locator(selector).click();
  }

  async fill(selector, value) {
    await this.page.locator(selector).fill(value);
  }

  async getText(selector) {
    return this.page.locator(selector).textContent();
  }

  async isVisible(selector) {
    return this.page.locator(selector).isVisible();
  }

  async waitForURL(urlPattern) {
    await this.page.waitForURL(urlPattern);
  }

  // ── Assertions ────────────────────────────────────────────────────

  async waitForSelector(selector, options = {}) {
    await this.page.locator(selector).waitFor(options);
  }

  // ── Screenshots ───────────────────────────────────────────────────

  async takeScreenshot(name) {
    await this.page.screenshot({
      path: `reports/test-artifacts/screenshots/${name}-${Date.now()}.png`,
      fullPage: true,
    });
  }
}

module.exports = BasePage;
