# Test Plan — Buckeye Marketplace

**Milestone:** 6  
**Tester:** Kacie Lather  
**Date Tested:** April 28, 2026  
**Frontend:** https://yellow-smoke-03bf58010.7.azurestaticapps.net  
**Backend:** https://buckeye-api-kacie-erame2f4gpetdsfn.westus3-01.azurewebsites.net

---

## User Flows

| # | Test Case | Steps | Expected Result | Actual Result | Status |
|---|-----------|-------|-----------------|---------------|--------|
| 1 | Browse products | Navigate to home page | Products display with images, prices, and categories | Products loaded correctly with all fields visible | PASS |
| 2 | Register account | Click Register, enter email `newuser@gmail.com` and a valid password, submit form | Account created successfully, user redirected or shown confirmation | Registration accepted, user account created | PASS |
| 3 | Login | Enter registered credentials, submit login form | Redirect to home page with user logged in and session active | Redirected to home page, user state reflected in UI | PASS |
| 4 | Add to cart | Open a product detail page, click Add to Cart | Cart count updates to reflect added item | Cart badge incremented correctly | PASS |
| 5 | Checkout | Navigate to cart, fill in shipping address form, click Place Order | Order confirmation shown with confirmation number | Confirmation number displayed on success screen | PASS |
| 6 | View order history | Navigate to Orders page while logged in | Previously placed order appears in order history | Order listed with correct details and status | PASS |

---

## Admin Flows

| # | Test Case | Steps | Expected Result | Actual Result | Status |
|---|-----------|-------|-----------------|---------------|--------|
| 7 | Admin login | Log in as `admin@test.com` | Admin dashboard accessible, admin-only navigation visible | Admin dashboard loaded successfully | PASS |
| 8 | Add product | Navigate to Add Product, fill in title, description, price, category, and image URL, submit | New product appears in product list | Product created and visible in listing | PASS |
| 9 | Edit product | Select an existing product, modify details, save changes | Updated product details reflected in product list and detail view | Changes saved and displayed correctly | PASS |
| 10 | Delete product | Select a product, click Delete, confirm | Product removed from product list | Product no longer appears in listing | PASS |
| 11 | View all orders | Navigate to Orders in admin dashboard | All orders from all users are visible | Full order list displayed with user and status info | PASS |
| 12 | Update order status | Select an order, change its status, save | Order status updated and reflected in order view | Status change saved and displayed correctly | PASS |

---

## Cross-Browser & Device Testing

| Platform | Result |
|----------|--------|
| Chrome (desktop) | PASS |
| Firefox (desktop) | PASS |
| Mobile — iOS Safari | PASS |

---

## Bug Fixes

The following bugs were identified and resolved during testing:

- **Cart identity context** — Cart service was not receiving the authenticated user context correctly on page load. Fixed by ensuring the Identity context was fully initialized before cart requests were made.
- **Security configuration** — CORS policy was not permitting requests from the production frontend URL. Fixed by adding the Azure Static Web App origin to `WithOrigins()` in `Program.cs`.
- **SQLite migration incompatibility** — Existing EF Core migrations were generated against the SQLite provider and could not be applied to Azure SQL Server on startup. Resolved by switching to `EnsureCreated()` for provider-agnostic schema initialization.

---

## Test Environment

| Component | Details |
|-----------|---------|
| Frontend URL | https://yellow-smoke-03bf58010.7.azurestaticapps.net |
| Backend URL | https://buckeye-api-kacie-erame2f4gpetdsfn.westus3-01.azurewebsites.net |
| Database | Azure SQL (production), SQLite (local development) |
| Auth | JWT Bearer tokens via ASP.NET Core Identity |
| Date Tested | April 28, 2026 |
| Tester | Kacie Lather |
