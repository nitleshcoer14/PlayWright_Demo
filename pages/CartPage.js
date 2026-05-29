// pages/CartPage.js
const BasePage = require('./BasePage');

class CartPage extends BasePage {
  constructor(page) {
    super(page);

    // ── Locators ────────────────────────────────────────────────────
    this.pageTitle        = page.locator('.title');
    this.cartItems        = page.locator('.cart_item');
    this.cartItemNames    = page.locator('.inventory_item_name');
    this.cartItemPrices   = page.locator('.inventory_item_price');
    this.checkoutButton   = page.locator('#checkout');
    this.continueShopBtn  = page.locator('#continue-shopping');
  }

  // ── Actions ───────────────────────────────────────────────────────

  async proceedToCheckout() {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout-step-one.html');
  }

  async continueShopping() {
    await this.continueShopBtn.click();
    await this.page.waitForURL('**/inventory.html');
  }

  async removeItem(productId) {
    await this.page.locator(`#remove-${productId}`).click();
  }

  // ── Getters ───────────────────────────────────────────────────────

  async getCartItemCount() {
    return this.cartItems.count();
  }

  async getCartItemNames() {
    return this.cartItemNames.allTextContents();
  }

  async getCartItemPrices() {
    const raw = await this.cartItemPrices.allTextContents();
    return raw.map(p => parseFloat(p.replace('$', '')));
  }

  async isItemInCart(productName) {
    const names = await this.getCartItemNames();
    return names.includes(productName);
  }
}

module.exports = CartPage;
