// pages/LoginPage.js
const BasePage = require('./BasePage');

class LoginPage extends BasePage {
  constructor(page) {
    super(page);

    // ── Locators ────────────────────────────────────────────────────
    this.usernameInput   = page.locator('#user-name');
    this.passwordInput   = page.locator('#password');
    this.loginButton     = page.locator('#login-button');
    this.errorMessage    = page.locator('[data-test="error"]');
    this.errorCloseBtn   = page.locator('.error-button');
    this.loginLogo       = page.locator('.login_logo');
  }

  // ── Actions ───────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('/');
    await this.loginLogo.waitFor({ state: 'visible' });
  }

  async enterUsername(username) {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password) {
    await this.passwordInput.fill(password);
  }

  async clickLogin() {
    await this.loginButton.click();
  }

  async login(username, password) {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async closeError() {
    await this.errorCloseBtn.click();
  }

  // ── Getters ───────────────────────────────────────────────────────

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }
}

module.exports = LoginPage;
