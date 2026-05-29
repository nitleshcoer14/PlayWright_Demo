// tests/cart.spec.js
const { test, expect } = require('../fixtures/pages.fixture');
const InventoryPage    = require('../pages/InventoryPage');
const CartPage         = require('../pages/CartPage');

test.describe('Shopping Cart Tests', () => {

  test.beforeEach(async ({ authenticatedPage }) => {
    // authenticatedPage fixture handles login automatically
  });

  test('@smoke Added items appear in cart', async ({ page, testData }) => {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);

    await inventory.addToCart(testData.products.backpack.id);
    await inventory.addToCart(testData.products.bikeLight.id);
    await inventory.goToCart();

    const names = await cart.getCartItemNames();
    expect(names).toContain(testData.products.backpack.name);
    expect(names).toContain(testData.products.bikeLight.name);
    expect(await cart.getCartItemCount()).toBe(2);
  });

  test('@regression Item can be removed from the cart', async ({ page, testData }) => {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);

    await inventory.addToCart(testData.products.backpack.id);
    await inventory.goToCart();
    expect(await cart.getCartItemCount()).toBe(1);

    await cart.removeItem(testData.products.backpack.id);
    expect(await cart.getCartItemCount()).toBe(0);
  });

  test('@regression Continue Shopping navigates back to inventory', async ({ page, testData }) => {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);

    await inventory.addToCart(testData.products.backpack.id);
    await inventory.goToCart();
    await cart.continueShopping();

    await expect(page).toHaveURL(/inventory/);
  });

  test('@regression Cart persists items after navigating away', async ({ page, testData }) => {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);

    await inventory.addToCart(testData.products.backpack.id);
    await page.goto('/');                 // navigate away
    await page.goto('/cart.html');        // return to cart

    const names = await cart.getCartItemNames();
    expect(names).toContain(testData.products.backpack.name);
  });
});
