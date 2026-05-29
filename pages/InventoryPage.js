// pages/InventoryPage.js
const BasePage = require('./BasePage');

class InventoryPage extends BasePage {
  constructor(page) {
    super(page);

    // ── Locators ────────────────────────────────────────────────────
    this.pageTitle       = page.locator('.title');
    this.cartIcon        = page.locator('.shopping_cart_link');
    this.cartBadge       = page.locator('.shopping_cart_badge');
    this.inventoryList   = page.locator('.inventory_list');
    this.inventoryItems  = page.locator('.inventory_item');
    this.sortDropdown    = page.locator('[data-test="product-sort-container"]');
    this.menuButton      = page.locator('#react-burger-menu-btn');
    this.logoutLink      = page.locator('#logout_sidebar_link');
  }

  // ── Add / Remove ─────────────────────────────────────────────────

  /**
   * @param {string} productId  e.g. 'sauce-labs-backpack'
   */
  async addToCart(productId) {
    await this.page.locator(`#add-to-cart-${productId}`).click();
  }

  async removeFromCart(productId) {
    await this.page.locator(`#remove-${productId}`).click();
  }

  async addMultipleToCart(productIds = []) {
    for (const id of productIds) {
      await this.addToCart(id);
    }
  }

  // ── Navigation ────────────────────────────────────────────────────

  async goToCart() {
    await this.cartIcon.click();
    await this.page.waitForURL('**/cart.html');
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.waitFor({ state: 'visible' });
    await this.logoutLink.click();
    await this.page.waitForURL('/');
  }

  // ── Sorting ───────────────────────────────────────────────────────

  async sortBy(option) {
    await this.sortDropdown.selectOption(option);
  }

  // ── Getters ───────────────────────────────────────────────────────

  async getCartCount() {
    const badge = this.cartBadge;
    return (await badge.isVisible()) ? parseInt(await badge.textContent(), 10) : 0;
  }

  async getPageTitle() {
    return this.pageTitle.textContent();
  }

  async getProductNames() {
    return this.page.locator('.inventory_item_name').allTextContents();
  }

  async getProductPrices() {
    const rawPrices = await this.page.locator('.inventory_item_price').allTextContents();
    return rawPrices.map(p => parseFloat(p.replace('$', '')));
  }
}

module.exports = InventoryPage;
