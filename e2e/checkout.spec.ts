import { test, expect } from '@playwright/test'

const EMAIL = 'e2etest@buckeye.com'
const PASSWORD = 'Buckeye1!'
const BASE_URL = 'http://localhost:5173'

test.describe('M5 – Checkout Flow', () => {
  test('register (or skip if exists), login, add to cart, checkout, verify confirmation and order history', async ({ page }) => {
    // ── Step 1: Register ──────────────────────────────────────────────────────
    // If already registered the API returns an error banner; catch that and
    // navigate to /login directly instead.
    await page.goto(`${BASE_URL}/register`)
    await page.fill('#email', EMAIL)
    await page.fill('#password', PASSWORD)
    await page.fill('#confirmPassword', PASSWORD)
    // Use type="submit" to avoid matching the header nav button with the same label
    await page.locator('form button[type="submit"]').click()

    await page.waitForURL(`${BASE_URL}/login`, { timeout: 8000 }).catch(async () => {
      // Already registered or unexpected error — go straight to login
      await page.goto(`${BASE_URL}/login`)
    })

    // ── Step 2: Log in ────────────────────────────────────────────────────────
    await page.fill('#email', EMAIL)
    await page.fill('#password', PASSWORD)
    await page.locator('form button[type="submit"]').click()
    await page.waitForURL(`${BASE_URL}/`, { timeout: 8000 })

    // ── Step 3: Add one item to cart ──────────────────────────────────────────
    // Wait for products to load from the API
    await expect(page.getByRole('button', { name: 'Add to Cart' }).first()).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: 'Add to Cart' }).first().click()
    // ProductCard shows "✓ Added!" for 2 seconds after a successful add
    await expect(page.getByRole('button', { name: /Added/ }).first()).toBeVisible({ timeout: 8000 })

    // ── Step 4: Navigate to cart ──────────────────────────────────────────────
    await page.getByRole('button', { name: /^Cart/ }).click()
    await page.waitForURL(`${BASE_URL}/cart`, { timeout: 8000 })

    // ── Step 5: Proceed to checkout ───────────────────────────────────────────
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible({ timeout: 8000 })
    await page.getByRole('button', { name: 'Checkout' }).click()
    await page.waitForURL(`${BASE_URL}/checkout`, { timeout: 8000 })

    // ── Step 6: Enter shipping address ────────────────────────────────────────
    await page.fill('textarea', '123 High St, Columbus OH')

    // ── Step 7: Place the order ───────────────────────────────────────────────
    await page.getByRole('button', { name: 'Place Order' }).click()
    await page.waitForURL(`${BASE_URL}/order-confirmation`, { timeout: 10000 })

    // ── Step 8: Verify a confirmation number appears ──────────────────────────
    // OrderConfirmationPage renders: <strong>{order.confirmationNumber}</strong>
    // Format: ORD-YYYYMMDD-XXXXXXXX (first 8 hex chars of a GUID, uppercased)
    const confirmLocator = page.locator('strong').filter({ hasText: /^ORD-/ })
    await expect(confirmLocator).toBeVisible({ timeout: 8000 })
    const confirmationNumber = await confirmLocator.textContent()
    expect(confirmationNumber).toMatch(/^ORD-\d{8}-[A-F0-9]{8}$/)

    // ── Step 9: Navigate to order history and verify the order is listed ──────
    await page.getByRole('button', { name: 'View Order History' }).click()
    await page.waitForURL(`${BASE_URL}/orders`, { timeout: 8000 })
    // OrderHistoryPage renders the confirmationNumber as bold text in each row
    await expect(page.getByText(confirmationNumber!)).toBeVisible({ timeout: 8000 })
  })
})
