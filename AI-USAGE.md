# AI Usage — Buckeye Marketplace

This document describes how Claude (Anthropic) and GitHub Copilot were used
across all milestones of this project.

---

## Tools Used

**Claude Code** (Anthropic) — used interactively via the Claude Code CLI and
claude.ai for step-by-step guidance, debugging, architecture decisions, and
documentation throughout all milestones.

**GitHub Copilot** (agent mode) via the VS Code extension, used for code
generation, security auditing, test generation, and Playwright MCP setup
primarily during M5.

---

## Milestone 6 — Production Deployment & CI/CD

### Production Deployment Configuration

**Prompt given to Claude Code:**
Read Program.cs and appsettings.json. In production on Azure the app should
use the DefaultConnection connection string (SQL Server/Azure SQL), not SQLite.
Check: does Program.cs conditionally use SQL Server when DefaultConnection is
set and fall back to SQLite when it's empty? Does appsettings.json have a
ConnectionStrings section? Does the .csproj reference the SQL Server EF Core
package? Fix all three.

**Result:** Added conditional DB registration (`UseSqlServer` when connection
string is set, `UseSqlite` otherwise), added `ConnectionStrings` section to
appsettings.json, and added `Microsoft.EntityFrameworkCore.SqlServer` package
reference to the .csproj.

---

### Azure SQL Migration Incompatibility Fix

**Prompt given to Claude Code:**
The Azure App Service is crashing on startup with exit code 134 (SIGABRT).
The app worked with SQLite locally. After setting DefaultConnection to Azure SQL
in App Settings, it crashes immediately. Diagnose and fix.

**Claude's diagnosis:** The EF Core migrations were generated against the SQLite
provider (all columns typed as `TEXT`). When `db.Database.Migrate()` tried to
apply them to SQL Server, it crashed with an unhandled exception. The fix was to
replace `db.Database.Migrate()` with `db.Database.EnsureCreated()`, which
creates the schema directly from the EF Core model without running provider-
specific migrations.

---

### CORS Policy Update

**Prompt given to Claude Code:**
Update CORS in Program.cs to allow the production frontend URL. Add
`https://yellow-smoke-03bf58010.7.azurestaticapps.net` to the WithOrigins()
call alongside localhost:5173.

---

### Frontend Production API URL

**Prompt given to Claude Code:**
Update the API base URL in my React frontend. The production API URL is
`https://buckeye-api-kacie-erame2f4gpetdsfn.westus3-01.azurewebsites.net`.
I need: a Vite env variable (VITE_API_URL) in .env.production, a config.ts
that reads the env var with fallback, and all hardcoded localhost URLs replaced.

**Claude identified** that AuthContext.tsx had its own hardcoded URLs and was
not importing from config.ts — fixed by adding the import and replacing both
login and register URLs. Also identified a TypeScript error (`Property 'env'
does not exist on type 'ImportMeta'`) caused by missing `vite/client` in
tsconfig.json types array.

---

### GitHub Actions CI/CD Workflow

**Prompt given to Claude Code:**
Create `.github/workflows/deploy-api.yml` for automated backend deployment to
Azure App Service. Requirements: trigger on push to main, build with
`dotnet build --configuration Release`, run `dotnet test` (test project is at
repo root, not inside the API folder), publish to ./output, upload artifact,
deploy using azure/webapps-deploy@v3 with AZURE_PUBLISH_PROFILE secret.

---

### README and Technical Documentation

**Prompt given to Claude Code:**
Help write comprehensive M6 technical documentation for the README. Provided:
all 6 milestone PDFs, M2 architecture plan, M2 ERD PDF, and system architecture
diagram. Claude structured the README to reflect the actual implementation with
an explicit comparison table showing deviations from the M2 plan (Node.js →
ASP.NET Core, PostgreSQL → SQLite/Azure SQL, Firebase Auth → ASP.NET Identity).

---

### Test Plan

**Prompt given to Claude Code:**
Create `docs/test-plan.md` with a professional test plan for Milestone 6
covering: 6 user flow tests (browse, register, login, add to cart, checkout,
order history), 6 admin flow tests (login, add/edit/delete product, view orders,
update status), cross-browser results, and bug fixes found during testing.

---

## Milestone 5 — Authentication, Security & Order Processing

### Setting Up Copilot Agents
Created two reusable instruction files attached to Copilot prompts:
- `docs/testing-agent.md` — rules for generating tests (never weaken
  assertions, always read actual files first, run tests and show output)
- `docs/security-agent.md` — rules for security review (JWT key in User
  Secrets, userId from JWT claims only, LINQ only, no dangerouslySetInnerHTML)

### Authentication Backend
Prompt given to Copilot:
Read BuckeyeMarketplace.API/Controllers/AuthController.cs and Program.cs.
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
Prompt given to Copilot (with testing-agent.md attached):
Read OrdersController.cs, AuthController.cs, Order.cs, OrderItem.cs.
Create at least 3 unit tests: order total calculation, password minimum
length validation, order confirmation number format. Create 1 integration
test using WebApplicationFactory<Program>: GET /api/orders/mine without
token returns 401. Do not invent classes that don't exist.

### Frontend Tests
Prompt given to Copilot (with testing-agent.md attached):
Read AuthContext.tsx, LoginPage.jsx, package.json. Create 3+ frontend tests:
isValidEmail pure function test, AuthContext logout clears localStorage,
LoginPage shows error on empty submit.
Use Vitest + React Testing Library. Check packages are installed first.

### Playwright E2E
Prompt given to Copilot:
Using Playwright MCP, run this E2E flow on http://localhost:5173:
Register with e2etest@buckeye.com / Buckeye1!, log in, browse products,
add one to cart, checkout with address "123 High St, Columbus OH", verify
confirmation number appears, navigate to order history and verify order is
listed. Save spec as e2e/checkout.spec.ts.

### Security Auditing
Claude was used to audit the codebase against the M5 security checklist:
- Verified `Jwt:Key` was not stored in any committed config file
- Confirmed password hashing used ASP.NET Core Identity exclusively
- Confirmed all API endpoints had correct `[Authorize]` attributes
- Verified all protected endpoints derived userId from JWT claims, not URL

### M5 Bug Fixes (Claude)
- `AppDbContext` not extending `IdentityDbContext<IdentityUser>` — caused
  registration to fail with 500 errors
- Role seeding missing — "User" and "Admin" roles not created on startup,
  causing `AddToRoleAsync` to throw
- Cart service using raw `fetch()` instead of authenticated axios instance —
  caused 401 errors even when logged in
- JWT role claim returning string instead of array — caused `.flat()` TypeError
  on login
- Dual EF provider conflict in integration tests — fixed by removing all
  DbContext descriptors before adding InMemory provider

### M5 Test Results
- `dotnet test` — 6/6 backend tests pass
- `npm test -- --run` — 4/4 frontend tests pass
- `npx playwright test --project=chromium` — 1/1 E2E test passes

---

## Milestone 4 — Cart, Orders & Admin

Claude and Copilot were used for:
- Cart state management patterns (React Context + useReducer)
- EF Core relationship setup (CartItems → Users, Orders → OrderItems)
- Bug diagnosis: cart identity context not initialized before first request

---

## Milestone 3 — Products API

Claude and Copilot were used for:
- Scaffolding ProductsController with CRUD endpoints
- Generating sample product seed data (OSU-themed items)
- Debugging CORS errors between React dev server and .NET API

---

## Milestone 2 — Architecture

Claude was used for:
- Architecture decision research (ASP.NET Core vs Node.js/Express)
- ERD review and entity relationship planning

---

## Milestone 1 — Personas & User Stories

Claude was used for:
- Persona refinement (Emily Carter, Alex Chen, Barbara Scaff)
- User story drafting from persona research
