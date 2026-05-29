// tests/login.spec.js
const { test, expect } = require('../fixtures/pages.fixture');

test.describe('Login Tests', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  // ── Positive ─────────────────────────────────────────────────────

  test('@smoke Standard user can log in successfully', async ({ loginPage, page }) => {
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/inventory/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  // ── Negative ─────────────────────────────────────────────────────

  test('@regression Locked-out user sees error message', async ({ loginPage }) => {
    await loginPage.login('locked_out_user', 'secret_sauce');
    expect(await loginPage.isErrorVisible()).toBe(true);
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Sorry, this user has been locked out');
  });

  test('@regression Invalid credentials show error', async ({ loginPage }) => {
    await loginPage.login('wrong_user', 'wrong_pass');
    expect(await loginPage.isErrorVisible()).toBe(true);
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Username and password do not match');
  });

  test('@regression Empty username shows validation error', async ({ loginPage }) => {
    await loginPage.login('', 'secret_sauce');
    expect(await loginPage.isErrorVisible()).toBe(true);
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Username is required');
  });

  test('@regression Empty password shows validation error', async ({ loginPage }) => {
    await loginPage.login('standard_user', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    const msg = await loginPage.getErrorMessage();
    expect(msg).toContain('Password is required');
  });

  test('@regression Error message can be dismissed', async ({ loginPage }) => {
    await loginPage.login('', '');
    expect(await loginPage.isErrorVisible()).toBe(true);
    await loginPage.closeError();
    expect(await loginPage.isErrorVisible()).toBe(false);
  });
});
