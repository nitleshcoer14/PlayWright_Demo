// tests/checkout.spec.js
const { test, expect } = require('../fixtures/pages.fixture');
const InventoryPage    = require('../pages/InventoryPage');
const CartPage         = require('../pages/CartPage');
const CheckoutPage     = require('../pages/CheckoutPage');

test.describe('Checkout Flow Tests', () => {

  /** Helper: login, add two items, go to cart, and proceed to checkout step 1 */
  async function reachCheckoutStep1(page, testData) {
    const inventory = new InventoryPage(page);
    const cart      = new CartPage(page);

    await inventory.addToCart(testData.products.backpack.id);
    await inventory.addToCart(testData.products.bikeLight.id);
    await inventory.goToCart();
    await cart.proceedToCheckout();
  }

  test.beforeEach(async ({ authenticatedPage }) => {
    // authenticatedPage fixture handles login automatically
  });

  // ── Full E2E ──────────────────────────────────────────────────────

  test('@smoke Complete end-to-end checkout flow', async ({ page, testData }) => {
    const checkout = new CheckoutPage(page);

    // 1. Add items & navigate to checkout
    await reachCheckoutStep1(page, testData);
    await expect(page).toHaveURL(/checkout-step-one/);

    // 2. Fill customer info
    await checkout.fillAndContinue(testData.checkout.valid);
    await expect(page).toHaveURL(/checkout-step-two/);

    // 3. Verify order summary
    const itemCount = await checkout.summaryItems.count();
    expect(itemCount).toBe(2);

    const subtotal = await checkout.getSubtotal();
    const tax      = await checkout.getTax();
    const total    = await checkout.getOrderTotal();
    expect(total).toBeCloseTo(subtotal + tax, 2);

    // 4. Finish order
    await checkout.clickFinish();
    await expect(page).toHaveURL(/checkout-complete/);

    // 5. Verify success message
    const header = await checkout.getConfirmationHeader();
    expect(header.trim()).toBe(testData.messages.orderSuccess);

    expect(await checkout.isConfirmationVisible()).toBe(true);
    expect(await checkout.ponyExpressImage.isVisible()).toBe(true);
  });

  // ── Validation ────────────────────────────────────────────────────

  test('@regression Missing first name shows error', async ({ page, testData }) => {
    const checkout = new CheckoutPage(page);
    await reachCheckoutStep1(page, testData);
    await checkout.fillCustomerInfo({ firstName: '', lastName: 'Doe', zipCode: '12345' });
    await checkout.clickContinue();
    expect(await checkout.isErrorVisible()).toBe(true);
    expect(await checkout.getErrorMessage()).toContain('First Name is required');
  });

  test('@regression Missing last name shows error', async ({ page, testData }) => {
    const checkout = new CheckoutPage(page);
    await reachCheckoutStep1(page, testData);
    await checkout.fillCustomerInfo({ firstName: 'John', lastName: '', zipCode: '12345' });
    await checkout.clickContinue();
    expect(await checkout.isErrorVisible()).toBe(true);
    expect(await checkout.getErrorMessage()).toContain('Last Name is required');
  });

  test('@regression Missing zip code shows error', async ({ page, testData }) => {
    const checkout = new CheckoutPage(page);
    await reachCheckoutStep1(page, testData);
    await checkout.fillCustomerInfo({ firstName: 'John', lastName: 'Doe', zipCode: '' });
    await checkout.clickContinue();
    expect(await checkout.isErrorVisible()).toBe(true);
    expect(await checkout.getErrorMessage()).toContain('Postal Code is required');
  });

  // ── Post-order ────────────────────────────────────────────────────

  test('@regression Back Home button returns to inventory', async ({ page, testData }) => {
    const checkout = new CheckoutPage(page);
    await reachCheckoutStep1(page, testData);
    await checkout.fillAndContinue(testData.checkout.valid);
    await checkout.clickFinish();
    await checkout.backToHome();
    await expect(page).toHaveURL(/inventory/);
  });

  test('@regression Cart is cleared after successful order', async ({ page, testData }) => {
    const inventory = new InventoryPage(page);
    const checkout  = new CheckoutPage(page);
    const cart      = new CartPage(page);

    await reachCheckoutStep1(page, testData);
    await checkout.fillAndContinue(testData.checkout.valid);
    await checkout.clickFinish();
    await checkout.backToHome();

    // Cart badge should be gone
    const count = await inventory.getCartCount();
    expect(count).toBe(0);
  });
});
