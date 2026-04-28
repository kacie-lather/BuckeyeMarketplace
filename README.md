# Buckeye Marketplace

A student-to-student marketplace for OSU students to buy and sell handmade and upcycled goods — outfits, accessories, stickers, blankets, and more.

**Live Application**
- Frontend: https://yellow-smoke-03bf58010.7.azurestaticapps.net
- Backend API: https://buckeye-api-kacie-erame2f4gpetdsfn.westus3-01.azurewebsites.net
- Swagger (local only): http://localhost:5136/swagger

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Local Development Setup](#local-development-setup)
5. [Environment Variables](#environment-variables)
6. [API Documentation](#api-documentation)
7. [Architecture](#architecture)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Testing](#testing)
11. [AI Tool Usage](#ai-tool-usage)

---

## Project Overview

Buckeye Marketplace connects OSU students through a creative peer-to-peer marketplace. Student makers can sell their handmade and upcycled designs directly to buyers looking for unique, affordable OSU-themed items — without the fees of Etsy or the trust issues of Facebook Marketplace.

The application was designed around three personas developed in Milestone 1:
- **Emily Carter** — budget-conscious buyer who wants to support student creators
- **Alex Chen** — creative seller who needs a targeted OSU platform without high fees
- **Barbara Scaff** — gift buyer who needs a simple, trustworthy shopping experience

---

## Features

**User Features**
- Browse and search product listings with images, prices, and categories
- View detailed product pages
- Register and log in with JWT-authenticated sessions
- Add items to a persistent shopping cart
- Checkout with shipping address and receive a confirmation number
- View personal order history

**Admin Features**
- Admin dashboard (restricted to Admin role)
- Add, edit, and delete products
- View all orders across all users
- Update order status

**Security**
- JWT Bearer authentication via ASP.NET Core Identity
- Role-based authorization (User / Admin)
- Password hashing via Identity (PBKDF2/HMAC-SHA256)
- JWT signing key stored in user secrets, never committed
- All queries use EF Core LINQ — no raw SQL string interpolation
- User ID derived from JWT claims, not URL parameters (OWASP BOLA prevention)
- HTTPS redirect enforced in production

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework |
| TypeScript | 6.0 | Type safety |
| Vite | 7.3 | Build tool and dev server |
| React Router | 7.13 | Client-side routing |
| Axios | 1.15 | HTTP client with interceptors |
| Vitest | 4.1 | Unit and component testing |
| React Testing Library | 16.3 | Component test utilities |
| Playwright | 1.59 | End-to-end testing |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| .NET | 10.0 | Runtime |
| ASP.NET Core | 10.0 | Web API framework |
| Entity Framework Core | 10.0 | ORM / database access |
| EF Core SQLite | 10.0.5 | Local development database |
| EF Core SQL Server | 10.0.7 | Production database |
| ASP.NET Core Identity | 10.0.5 | User management and password hashing |
| JWT Bearer Auth | 10.0.5 | Token-based authentication |
| Swashbuckle (Swagger) | 10.1 | API documentation |
| xUnit | — | Backend unit and integration testing |

### Infrastructure

| Service | Purpose |
|---|---|
| Azure Static Web Apps | Frontend hosting |
| Azure App Service | Backend API hosting |
| Azure SQL Database | Production database |
| GitHub Actions | CI/CD pipeline |

---

## Local Development Setup

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org/)
- [dotnet-ef tool](https://learn.microsoft.com/en-us/ef/core/cli/dotnet): `dotnet tool install --global dotnet-ef`

### 1. Clone the repository

```bash
git clone https://github.com/kacie-lather/BuckeyeMarketplace.git
cd BuckeyeMarketplace
```

### 2. Configure backend secrets

The JWT signing key is stored in .NET user secrets and is never committed to source control. Set it before running:

```bash
cd BuckeyeMarketplace.API
dotnet user-secrets set "Jwt:Key" "your-secret-key-minimum-32-characters"
dotnet user-secrets set "Jwt:Issuer" "BuckeyeMarketplace"
dotnet user-secrets set "Jwt:Audience" "BuckeyeMarketplaceUsers"
```

### 3. Run the backend

```bash
cd BuckeyeMarketplace.API
dotnet run
```

The API runs at `http://localhost:5136`. The SQLite database (`buckeyemarketplace.db`) is created automatically on first run. The admin user (`admin@test.com` / `Admin123!`) is seeded automatically.

Swagger UI is available at `http://localhost:5136/swagger` in development.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### 5. Run tests

```bash
# Backend tests (xUnit)
dotnet test

# Frontend unit tests (Vitest)
cd frontend
npm test -- --run

# End-to-end tests (Playwright)
cd frontend
npx playwright test
```

---

## Environment Variables

### Backend

Set via `dotnet user-secrets` for local development, or Azure App Service **Configuration → Application Settings** for production.

| Key | Description | Example |
|---|---|---|
| `Jwt:Key` | JWT signing key (min 32 chars) | `super-secret-key-...` |
| `Jwt:Issuer` | JWT issuer claim | `BuckeyeMarketplace` |
| `Jwt:Audience` | JWT audience claim | `BuckeyeMarketplaceUsers` |
| `ConnectionStrings:DefaultConnection` | Azure SQL connection string (production only; falls back to SQLite when empty) | `Server=tcp:...` |

### Frontend

Set in `frontend/.env.production` for production builds. For local development, the fallback URL in `src/config.ts` points to `http://localhost:5136`.

| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API |

---

## API Documentation

All protected endpoints require a `Bearer <token>` header. Tokens are obtained from `/api/auth/login`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | None | Register a new user account |
| POST | `/api/auth/login` | None | Log in and receive a JWT |

### Products

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/products` | None | List all products |
| GET | `/api/products/{id}` | None | Get a single product |
| POST | `/api/products` | Admin | Create a new product |
| PUT | `/api/products/{id}` | Admin | Update a product |
| DELETE | `/api/products/{id}` | Admin | Delete a product |

### Cart

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/cart` | User | Get current user's cart |
| POST | `/api/cart` | User | Add item to cart |
| PUT | `/api/cart/{cartItemId}` | User | Update item quantity |
| DELETE | `/api/cart/{cartItemId}` | User | Remove item from cart |
| DELETE | `/api/cart/clear` | User | Clear entire cart |

### Orders

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | User | Place an order from cart |
| GET | `/api/orders/mine` | User | Get current user's order history |
| GET | `/api/orders` | Admin | Get all orders (all users) |
| PUT | `/api/orders/{id}/status` | Admin | Update order status |

---

## Architecture

### Overview

Buckeye Marketplace uses a **three-tier architecture** deployed entirely on Azure:

```
┌─────────────────────────────────────────────┐
│         FRONTEND (Client Layer)             │
│   React 19 + TypeScript + Vite              │
│   Azure Static Web Apps                     │
│                                             │
│  ProductList │ ProductDetail │ Cart         │
│  Checkout │ Auth │ Admin Dashboard          │
└──────────────────┬──────────────────────────┘
                   │ HTTPS REST API (JSON)
                   │ JWT Bearer token
┌──────────────────▼──────────────────────────┐
│         BACKEND (Application Layer)         │
│   ASP.NET Core Web API (.NET 10)            │
│   Azure App Service                         │
│                                             │
│  AuthController │ ProductsController        │
│  CartController │ OrdersController          │
│                                             │
│  Middleware: JWT Auth │ CORS │ HTTPS        │
│  ORM: Entity Framework Core                 │
└──────────────────┬──────────────────────────┘
                   │ EF Core
┌──────────────────▼──────────────────────────┐
│         DATABASE (Data Layer)               │
│   SQLite (local dev)                        │
│   Azure SQL Database (production)           │
│                                             │
│  Users │ Products │ Orders │ OrderItems     │
│  CartItems │ Identity tables                │
└─────────────────────────────────────────────┘
```

### Architecture Decisions vs. M2 Plan

The M2 architecture plan proposed Node.js + Express with PostgreSQL and third-party services (Stripe, SendGrid, Socket.io). After evaluating the milestone requirements and scope, the following decisions were made:

| Component | M2 Plan | Actual Implementation | Reason |
|---|---|---|---|
| Backend | Node.js + Express | ASP.NET Core (.NET 10) | Stronger built-in Identity, JWT, and EF Core support |
| Database | PostgreSQL | SQLite (dev) / Azure SQL (prod) | Azure SQL integrates natively with App Service |
| Auth | Firebase Auth | ASP.NET Core Identity | Avoids vendor lock-in; tighter integration with JWT |
| Payments | Stripe | Not implemented (M6 scope) | Out of scope for current milestone |
| Messaging | Socket.io | Not implemented (M6 scope) | Out of scope for current milestone |
| File Storage | AWS S3 | Image URLs (external links) | Sufficient for milestone requirements |
| Frontend | React + Tailwind | React + TypeScript (no Tailwind) | TypeScript required for testing and type safety |

### CORS Policy

The API allows requests from:
- `http://localhost:5173` (local development)
- `https://yellow-smoke-03bf58010.7.azurestaticapps.net` (production frontend)

---

## Database Schema

The production schema is created via `EnsureCreated()` on startup, using EF Core with ASP.NET Core Identity. The following tables are active in production:

```
Users (AspNetUsers — Identity managed)
├── Id (string, PK)
├── Email
├── UserName
├── PasswordHash
└── [Standard Identity columns]

Roles (AspNetRoles — Identity managed)
└── Seeded: "User", "Admin"

Products
├── Id (int, PK)
├── Title
├── Description
├── Price (decimal)
├── Category
├── SellerName
├── PostedDate
└── ImageUrl

CartItems
├── Id (int, PK)
├── UserId (FK → AspNetUsers)
├── ProductId (FK → Products)
└── Quantity

Orders
├── Id (int, PK)
├── UserId (FK → AspNetUsers)
├── OrderDate
├── Status
├── Total (decimal)
├── ShippingAddress
└── ConfirmationNumber

OrderItems
├── Id (int, PK)
├── OrderId (FK → Orders)
├── ProductId (FK → Products)
├── Quantity
└── Price (decimal, snapshot at time of purchase)
```

**Key Relationships**
- `CartItems` → `AspNetUsers` (many-to-one): each cart item belongs to one user
- `CartItems` → `Products` (many-to-one): each cart item references one product
- `Orders` → `AspNetUsers` (many-to-one): each order belongs to one user
- `Orders` → `OrderItems` (one-to-many): each order has one or more line items
- `OrderItems` → `Products` (many-to-one): each line item references one product

**Note on M2 ERD:** The M2 ERD included additional planned entities (Reviews, Messages, Payments, Verification) which are documented in [docs/](docs/) but were descoped for the current milestone. The core transactional schema (Users, Products, Cart, Orders) is fully implemented.

---

## Deployment

### Backend (Azure App Service)

```bash
cd BuckeyeMarketplace.API
dotnet publish -c Release -o ./publish
cd publish && zip -r ../deploy.zip . && cd ..
az webapp deploy \
  --name buckeye-api-kacie \
  --resource-group rg-buckeye-marketplace \
  --src-path deploy.zip \
  --type zip
```

**Required Azure App Settings (Configuration → Application Settings):**
- `Jwt__Key`
- `Jwt__Issuer`
- `Jwt__Audience`
- `ConnectionStrings__DefaultConnection` (Azure SQL connection string)

### Frontend (Azure Static Web Apps)

Deployed via GitHub Actions on push to `main`. See [`.github/workflows/`](.github/workflows/) for CI/CD pipeline configuration.

### CI/CD Pipeline

The GitHub Actions workflow at [`.github/workflows/deploy-api.yml`](.github/workflows/deploy-api.yml) automates backend deployment:
1. Runs `dotnet build` and `dotnet test` on every push to `main`
2. Publishes a Release build
3. Deploys to Azure App Service using the `AZURE_PUBLISH_PROFILE` secret

---

## Testing

### Backend (xUnit)

```bash
dotnet test
```

Includes:
- Unit tests for order total calculation, cart-to-order mapping, and password validation logic
- Integration test for an authenticated endpoint using `WebApplicationFactory<Program>`

### Frontend (Vitest + React Testing Library)

```bash
cd frontend
npm test -- --run
```

Includes component and unit tests for auth context, form validation, and UI rendering.

### End-to-End (Playwright)

```bash
cd frontend
npx playwright test
```

The E2E spec at [`e2e/checkout.spec.ts`](e2e/checkout.spec.ts) covers the full happy path: register → login → browse → add to cart → checkout → view order history.

See [`docs/e2e-run.md`](docs/e2e-run.md) for E2E run notes and [`docs/test-plan.md`](docs/test-plan.md) for the full manual test plan.

---

## AI Tool Usage

AI tools were used throughout all milestones of this project. Full documentation is in [AI-USAGE.md](AI-USAGE.md).

**Summary by milestone:**

| Milestone | Primary AI Use |
|---|---|
| M1 | Persona refinement, user story drafting |
| M2 | Architecture decision research, ERD review |
| M3 | Scaffold ProductsController, generate sample product data, debug CORS |
| M4 | Cart state management patterns, EF Core relationship setup, bug diagnosis |
| M5 | JWT middleware configuration, xUnit test scaffolding, Playwright E2E spec generation |
| M6 | Production deployment configuration, Azure SQL migration fix, CI/CD workflow, README |

**Tools used:** Claude Code (Anthropic), GitHub Copilot

---

## Documentation Index

| Document | Description |
|---|---|
| [docs/test-plan.md](docs/test-plan.md) | M6 manual test plan — all user and admin flows |
| [docs/e2e-run.md](docs/e2e-run.md) | Playwright E2E run notes |
| [docs/m4-ai-usage.md](docs/m4-ai-usage.md) | M4 AI usage detail |
| [docs/security-agent.md](docs/security-agent.md) | M5 security review notes |
| [AI-USAGE.md](AI-USAGE.md) | Full AI usage log across all milestones |
| [CHANGELOG.md](CHANGELOG.md) | Bug fixes by milestone |
| [SUBMISSION.md](SUBMISSION.md) | M5 submission — test credentials and security practices |
