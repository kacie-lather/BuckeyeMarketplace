# AI Usage — Milestone 5

This document describes how Claude (Anthropic) and GitHub Copilot were used 
during the development of Milestone 5.

---

## Tools Used

**Claude** (claude.ai) — used interactively for step-by-step guidance, 
debugging, and prompt crafting throughout the entire milestone.

**GitHub Copilot** (agent mode) via the VS Code extension, used for code 
generation, security auditing, test generation, and Playwright MCP setup.

---

## Copilot Agent Prompts Used

### Setting Up Copilot Agents
Created two reusable instruction files attached to Copilot prompts:
- `docs/testing-agent.md` — rules for generating tests (never weaken 
  assertions, always read actual files first, run tests and show output)
- `docs/security-agent.md` — rules for security review (JWT key in User 
  Secrets, userId from JWT claims only, LINQ only, no dangerouslySetInnerHTML)

### Authentication Backend
Prompt given to Copilot:Read BuckeyeMarketplace.API/Controllers/AuthController.cs and Program.cs.
Fix by updating Program.cs to register Identity with IdentityUser.
Also check AppDbContext.cs — it should extend IdentityDbContext<IdentityUser>.
Make both files consistent with IdentityUser throughout.

### Admin Endpoints
Prompt given to Copilot:
Read BuckeyeMarketplace.API/Controllers/ProductsController.cs and other
controller files. Add [Authorize(Roles = "Admin")] to POST, PUT, DELETE
on products. Create GET /api/admin/orders and PUT /api/orders/{orderId}/status
admin-only endpoints.

### Frontend Authentication
Prompt given to Copilot (with security-agent.md attached):
Read the frontend/ folder structure then build the frontend authentication
system. I need: AuthContext.jsx, api.js with auto Bearer token, LoginPage.jsx,
RegisterPage.jsx, ProtectedRoute.jsx. Store JWT in localStorage. Use React
Router. No dangerouslySetInnerHTML anywhere.

### Cart Service Fix
Prompt given to Copilot:
Read frontend/src/services/cartService.ts and frontend/src/services/api.ts.
The cart endpoint returns 401 even after login. Replace all fetch() calls
in cartService with the api axios instance. Use relative paths (/cart).
Add auth token dependency to CartContext useEffect.

### Order Flow
Prompt given to Copilot:
Read CartPage.tsx, api.ts, and OrdersController.cs. Build checkout flow:
CheckoutPage.tsx with shipping form, OrderConfirmationPage.tsx showing
confirmation number, OrderHistoryPage.tsx calling GET /api/orders/mine.
Add protected routes /checkout, /order-confirmation, /orders in App.tsx.

### Admin Dashboard
Prompt given to Copilot:
Build an Admin Dashboard at /admin. Products tab: table with Edit/Delete,
Add Product form. Orders tab: all orders with status dropdown and Save button.
Protected by ProtectedRoute with roles={['Admin']}. Match OSU scarlet styling.

### Backend Tests
Prompt given to Copilot (with testing-agent.md attached)
Read OrdersController.cs, AuthController.cs, Order.cs, OrderItem.cs.
Create at least 3 unit tests: order total calculation, password minimum
length validation, order confirmation number format. Create 1 integration
test using WebApplicationFactory<Program>: GET /api/orders/mine without
token returns 401. Do not invent classes that don't exist.

### Frontend Tests
Prompt given to Copilot (with testing-agent.md attached):
Read AuthContext.tsx, LoginPage.jsx, package.json. Create 3+ frontend tests:

isValidEmail pure function test
AuthContext logout clears localStorage
LoginPage shows error on empty submit
Use Vitest + React Testing Library. Check packages are installed first.


### Playwright E2E
Prompt given to Copilot:
Using Playwright MCP, run this E2E flow on http://localhost:5173:

Register with e2etest@buckeye.com / Buckeye1!
Log in
Browse products, add one to cart
Checkout with address "123 High St, Columbus OH"
Verify confirmation number appears
Navigate to order history and verify order is listed
Save spec as docs/e2e/checkout.spec.ts. Create docs/e2e-run.md documenting
what failed and what was corrected.


---

## Security Auditing
laude was used to audit the codebase against the M5 security checklist:
- Verified `Jwt:Key` was not stored in any committed config file
- Confirmed password hashing used ASP.NET Core Identity exclusively
- Confirmed all API endpoints had correct `[Authorize]` attributes
- Verified all protected endpoints derived userId from JWT claims, not URL

## Bug Fixes

Claude identified and fixed:
- `AppDbContext` not extending `IdentityDbContext<IdentityUser>` — caused 
  registration to fail with 500 errors
- Role seeding missing — "User" and "Admin" roles not created on startup, 
  causing `AddToRoleAsync` to throw
- Cart service using raw `fetch()` instead of authenticated axios instance — 
  caused 401 errors even when logged in
- JWT role claim returning string instead of array — caused `.flat()` 
  TypeError on login
- Dual EF provider conflict in integration tests — fixed by removing all 
  DbContext descriptors before adding InMemory provider

## Test Results
- `dotnet test` — 6/6 backend tests pass
- `npm test -- --run` — 4/4 frontend tests pass  
- `npx playwright test --project=chromium` — 1/1 E2E test passes