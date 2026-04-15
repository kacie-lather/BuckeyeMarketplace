# M5 E2E Run Notes

## Approach

Playwright MCP browser tools were not available in the session. Instead, the spec
was written by reading the source code of every page in the flow:

- `RegisterPage.tsx` – form field IDs, submit button label
- `LoginPage.tsx` – form field IDs, submit button label
- `ProductListPage.tsx` / `ProductCard.tsx` – "Add to Cart" button, "✓ Added!" feedback
- `CartPage.tsx` – "Checkout" button
- `CheckoutPage.tsx` – `<textarea>` for shipping address, "Place Order" button
- `OrderConfirmationPage.tsx` – `<strong>{order.confirmationNumber}</strong>`, "View Order History" button
- `OrderHistoryPage.tsx` – route `/orders`, confirmation number rendered as bold text
- `App.tsx` – routes, header Cart button with dynamic label `Cart (N)`

The confirmation number format was read directly from `OrdersController.cs`:
```
ORD-{yyyyMMdd}-{first 8 chars of GUID uppercased}
```

---

## Attempt 1 – Failure

**Error:**
```
strict mode violation: getByRole('button', { name: 'Register' }) resolved to 2 elements
```

**Cause:** The app header always renders a "Register" nav button while the user
is unauthenticated. On `/register`, both the header nav button and the form's
submit button matched `{ name: 'Register' }`.

**Fix:** Changed both the Register and Login submit clicks to
`page.locator('form button[type="submit"]').click()`, which scopes the match
to the form element.

---

## Attempt 2 – Failure

**Error:**
```
strict mode violation: getByRole('button', { name: /Cart/ }) resolved to 8 elements
```

**Cause:** The regex `/Cart/` (contains "Cart") matched the header "Cart (1)"
button AND all 7 visible "Add to Cart" product buttons.

**Fix:** Changed the regex to `/^Cart/` (starts with "Cart"), which matches
"Cart (1)" in the header but not "Add to Cart".

---

## Attempt 3 – Pass

```
Running 1 test using 1 worker
1 passed (9.9s)
```

All 9 steps completed successfully:
1. Registered `e2etest@buckeye.com` (gracefully handles already-registered)
2. Logged in
3. Added first product to cart, confirmed "✓ Added!" feedback
4. Navigated to `/cart`
5. Proceeded to `/checkout`
6. Entered shipping address `123 High St, Columbus OH`
7. Placed the order
8. Confirmed a `ORD-YYYYMMDD-XXXXXXXX` confirmation number on the confirmation page
9. Verified the confirmation number appeared on `/orders`
