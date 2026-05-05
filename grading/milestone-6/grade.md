# Lab Evaluation Report

**Student Repository**: `kacie-lather-BuckeyeMarketplace`
**Date**: May 4, 2026
**Rubric**: rubric.md (Milestone 6 — 25 points)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                       |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Server runs on http://localhost:5136                                                                              |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` (Vite v7.3.1) succeeded. Dev server on http://localhost:5173                                                                |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 items); POST /api/auth/login → 200 (JWT); GET /api/cart → 401 (unauth) / 404 (empty); GET /api/orders/mine → 200 |
| Backend Tests       | —     | ✅   | `dotnet test`: 6 passed, 0 failed                                                                                                           |
| Frontend Tests      | —     | ✅   | `npm test -- --run`: 4 passed, 0 failed                                                                                                     |

## 1. Project Structure

| Component                        | Path                                                                 | Status |
| -------------------------------- | -------------------------------------------------------------------- | ------ |
| Backend API project              | `BuckeyeMarketplace.API/`                                            | ✅     |
| Backend test project             | `BuckeyeMarketplace.Tests/`                                          | ✅     |
| Frontend React/TS project        | `frontend/`                                                          | ✅     |
| E2E test spec                    | `e2e/checkout.spec.ts`                                               | ✅     |
| CI/CD — backend deploy workflow  | `.github/workflows/deploy-api.yml`                                   | ✅     |
| CI/CD — frontend deploy workflow | `.github/workflows/azure-static-web-apps-yellow-smoke-03bf58010.yml` | ✅     |
| Production env config            | `frontend/.env.production`                                           | ✅     |
| README                           | `README.md`                                                          | ✅     |
| CHANGELOG                        | `CHANGELOG.md`                                                       | ✅     |
| SUBMISSION                       | `SUBMISSION.md`                                                      | ✅     |
| AI Usage doc                     | `AI-USAGE.md`                                                        | ✅     |
| Test plan                        | `docs/test-plan.md`                                                  | ✅     |
| User guide                       | `docs/user-guide.md`                                                 | ✅     |
| Admin guide                      | `docs/admin-guide.md`                                                | ✅     |
| E2E run notes                    | `docs/e2e-run.md`                                                    | ✅     |
| Screenshots (13 images)          | `docs/*.png`                                                         | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                                                                 | Points | Status | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --- | --------------------------------------------------------------------------- | ------ | ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Production Deployment** — Flawless deployment, HTTPS, professional setup  | 5      | ✅ Met | [README.md](README.md#L5-L7) — live HTTPS URLs: frontend on Azure Static Web Apps (`https://yellow-smoke-03bf58010.7.azurestaticapps.net`), backend on Azure App Service (`https://buckeye-api-kacie-erame2f4gpetdsfn.westus3-01.azurewebsites.net`). Both use HTTPS. [Program.cs](BuckeyeMarketplace.API/Program.cs#L16-L22) — conditional SQL Server (production) / SQLite (local) DB registration. [.env.production](frontend/.env.production#L1) — `VITE_API_URL` set to production backend. [config.ts](frontend/src/config.ts#L1) — reads env var with fallback. CORS configured for production origin. API verified returning 200 with JWT auth working. |
| 2   | **CI/CD Pipeline** — Automated pipeline working perfectly                   | 4      | ✅ Met | [deploy-api.yml](.github/workflows/deploy-api.yml) — triggers on push to `main`, builds .NET Release, runs `dotnet test`, publishes, deploys to Azure App Service via `azure/webapps-deploy@v3` with `AZURE_PUBLISH_PROFILE` secret. [azure-static-web-apps-yellow-smoke-03bf58010.yml](.github/workflows/azure-static-web-apps-yellow-smoke-03bf58010.yml) — Azure Static Web Apps CI/CD for frontend, triggers on push and PR to `main`, builds from `./frontend` with `dist` output. Two workflows cover both frontend and backend automated deployment.                                                                                                     |
| 3   | **Testing & QA** — Comprehensive testing, well-documented                   | 4      | ✅ Met | Backend: 6 xUnit tests passing (unit + integration via `WebApplicationFactory`). Frontend: 4 Vitest tests passing. E2E: Playwright spec at [e2e/checkout.spec.ts](e2e/checkout.spec.ts) covering full user flow. [docs/test-plan.md](docs/test-plan.md) — 12 manual test cases (6 user, 6 admin) all PASS, cross-browser results (Chrome, Firefox, iOS Safari), 3 bugs found and fixed. [docs/e2e-run.md](docs/e2e-run.md) — documented E2E iterations with failure analysis and fixes.                                                                                                                                                                         |
| 4   | **Technical Docs** — Excellent documentation, comprehensive                 | 5      | ✅ Met | [README.md](README.md) — comprehensive (~430 lines): project overview with personas, feature list, full tech stack table, local dev setup with 5-step instructions, environment variables table, complete API endpoint reference (14 endpoints), ASCII architecture diagram, architecture decisions vs. M2 plan comparison table, database schema with relationships, deployment instructions for both Azure services, testing commands, AI usage summary table, documentation index. [CHANGELOG.md](CHANGELOG.md) — detailed M5 and M6 bug fixes with root cause analysis.                                                                                     |
| 5   | **User Docs** — Professional user guide with screenshots                    | 4      | ✅ Met | [docs/user-guide.md](docs/user-guide.md) — 6-section user guide: browsing, registration, login, cart, checkout, order history. 7 screenshots with descriptive alt text (Product-list-Grid.png, Registration-Page.png, Login-Page.png, Shopping-Cart.png, Checkout-Form.png, Order-Confirmation.png, Order-History.png). Troubleshooting table at bottom. [docs/admin-guide.md](docs/admin-guide.md) — separate admin guide with 5 screenshots covering dashboard, add/edit/delete products, and order management. 13 total screenshot images in `docs/`.                                                                                                        |
| 6   | **AI Reflection** — Insightful reflection, specific examples, deep analysis | 3      | ✅ Met | [AI-USAGE.md](AI-USAGE.md) — ~280 lines covering all 6 milestones. M6 section includes 7 specific prompt-result pairs (deployment config, Azure SQL migration fix, CORS, frontend env vars, CI/CD workflow, README, test plan). Each entry shows the exact prompt given and the AI's response/action. M5 section documents agent instruction files (`testing-agent.md`, `security-agent.md`), specific prompts for auth/admin/cart/tests, and a bug fix log with root causes. Earlier milestones (M1–M4) document progressive AI usage with generated file lists and modifications made.                                                                        |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Hardcoded production URL as fallback**: [config.ts](frontend/src/config.ts#L1) uses the production Azure URL as the fallback value instead of `http://localhost:5136`. This means if `VITE_API_URL` is unset in any environment, all requests go to production. Consider using `http://localhost:5136` as the fallback and only setting the production URL in `.env.production`.

- **EnsureCreated vs. Migrations**: [Program.cs](BuckeyeMarketplace.API/Program.cs) uses `EnsureCreated()` instead of `Migrate()` due to a SQLite-to-SQL-Server migration incompatibility. This works but prevents future schema changes from being applied incrementally. For a production app, regenerate migrations targeting SQL Server or use a multi-provider migration strategy.

- **SUBMISSION.md references M5**: [SUBMISSION.md](SUBMISSION.md#L1) header says "Milestone 5 Submission" rather than Milestone 6. Should be updated to reflect the current milestone.

- **Secrets in appsettings.json**: While JWT secrets are properly kept in user-secrets and not committed, the `ConnectionStrings` section in `appsettings.json` should ensure no production credentials are ever added there. The current file is clean.

## 6. Git Practices Coaching (Non-Scoring)

- **Meaningful commit history**: The CHANGELOG.md documents a clear progression of bug fixes with root cause analysis across M5 and M6, indicating incremental development rather than a single bulk commit.

- **CI/CD integration**: Having two GitHub Actions workflows that trigger on push to `main` shows good adoption of continuous delivery practices. Consider adding branch protection rules to require passing CI before merge.

---

**25/25** — All six rubric criteria are fully met with strong evidence across deployment, CI/CD, testing, documentation, user guides, and AI reflection. The coaching notes above (fallback URL, EnsureCreated, submission header) are suggestions for professional growth, not scoring deductions.
