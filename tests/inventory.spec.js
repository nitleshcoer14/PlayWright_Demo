// tests/inventory.spec.js
const { test, expect } = require('../fixtures/pages.fixture');
const InventoryPage    = require('../pages/InventoryPage');

test.describe('Inventory / Product Listing Tests', () => {

  test.beforeEach(async ({ authenticatedPage }) => {
    // authenticatedPage fixture handles login automatically
  });

  test('@smoke Products page loads with items', async ({ page }) => {
    const inventory = new InventoryPage(page);
    const title = await inventory.getPageTitle();
    expect(title).toBe('Products');
    const count = await inventory.inventoryItems.count();
    expect(count).toBeGreaterThan(0);
  });

  test('@regression Products can be sorted A→Z', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('az');
    const names = await inventory.getProductNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('@regression Products can be sorted Z→A', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('za');
    const names = await inventory.getProductNames();
    const sortedDesc = [...names].sort().reverse();
    expect(names).toEqual(sortedDesc);
  });

  test('@regression Products can be sorted by price (low to high)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('lohi');
    const prices = await inventory.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('@regression Products can be sorted by price (high to low)', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sortBy('hilo');
    const prices = await inventory.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('@smoke Cart badge increments when item is added', async ({ page }) => {
    const inventory = new InventoryPage(page);
    expect(await inventory.getCartCount()).toBe(0);
    await inventory.addToCart('sauce-labs-backpack');
    expect(await inventory.getCartCount()).toBe(1);
    await inventory.addToCart('sauce-labs-bike-light');
    expect(await inventory.getCartCount()).toBe(2);
  });

  test('@regression Item can be removed from inventory page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    expect(await inventory.getCartCount()).toBe(1);
    await inventory.removeFromCart('sauce-labs-backpack');
    expect(await inventory.getCartCount()).toBe(0);
  });
});
