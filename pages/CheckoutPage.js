// pages/CheckoutPage.js
const BasePage = require('./BasePage');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);

    // ── Step 1 Locators ───────────────────────────────────────────
    this.firstNameInput  = page.locator('#first-name');
    this.lastNameInput   = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton  = page.locator('#continue');
    this.cancelButton    = page.locator('#cancel');
    this.errorMessage    = page.locator('[data-test="error"]');

    // ── Step 2 (Summary) Locators ─────────────────────────────────
    this.summaryItems        = page.locator('.cart_item');
    this.subtotalLabel       = page.locator('.summary_subtotal_label');
    this.taxLabel            = page.locator('.summary_tax_label');
    this.totalLabel          = page.locator('.summary_total_label');
    this.finishButton        = page.locator('#finish');
    this.summaryPaymentInfo  = page.locator('.summary_value_label').first();
    this.summaryShippingInfo = page.locator('.summary_value_label').last();

    // ── Confirmation Locators ─────────────────────────────────────
    this.confirmationHeader  = page.locator('h2.complete-header');
    this.confirmationText    = page.locator('.complete-text');
    this.backHomeButton      = page.locator('#back-to-products');
    this.ponyExpressImage    = page.locator('.pony_express');
  }

  // ── Step 1: Customer Info ─────────────────────────────────────────

  async fillCustomerInfo({ firstName, lastName, zipCode }) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(zipCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  async fillAndContinue(customerInfo) {
    await this.fillCustomerInfo(customerInfo);
    await this.clickContinue();
    await this.page.waitForURL('**/checkout-step-two.html');
  }

  async getErrorMessage() {
    return this.errorMessage.textContent();
  }

  async isErrorVisible() {
    return this.errorMessage.isVisible();
  }

  // ── Step 2: Order Summary ─────────────────────────────────────────

  async getSubtotal() {
    const text = await this.subtotalLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getTax() {
    const text = await this.taxLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async getOrderTotal() {
    const text = await this.totalLabel.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ''));
  }

  async clickFinish() {
    await this.finishButton.click();
    await this.page.waitForURL('**/checkout-complete.html');
  }

  async cancelOrder() {
    await this.cancelButton.click();
  }

  // ── Confirmation ──────────────────────────────────────────────────

  async getConfirmationHeader() {
    return this.confirmationHeader.textContent();
  }

  async getConfirmationText() {
    return this.confirmationText.textContent();
  }

  async isConfirmationVisible() {
    return this.confirmationHeader.isVisible();
  }

  async backToHome() {
    await this.backHomeButton.click();
    await this.page.waitForURL('**/inventory.html');
  }
}

module.exports = CheckoutPage;
