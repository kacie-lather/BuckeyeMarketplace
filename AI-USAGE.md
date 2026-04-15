# AI Usage — Milestone 5

This document describes how Claude Code (Anthropic) was used during the development of Milestone 5.

---

## Tool Used

**Claude Code** (claude-sonnet-4-6) via the VS Code extension, used interactively throughout development.

---

## How It Was Used

### Security Auditing
Claude was used to audit the codebase against the M5 security checklist:
- Verified that `Jwt:Key` was not stored in any committed config file (`appsettings.json`, `appsettings.Development.json`, or git history)
- Confirmed that password hashing used ASP.NET Core Identity exclusively and no manual hashing existed
- Confirmed all API endpoints had correct `[Authorize]` attributes and role restrictions
- Verified that all protected endpoints derived the user ID from the JWT claim, not the URL

### Bug Fixes
Claude identified and fixed the following issues:
- `DateTime.Now` → `DateTime.UtcNow` in JWT token expiration (`AuthController.cs`) — JWT `exp` claims must use UTC per RFC 7519
- Added explicit password rule configuration to `AddIdentity` in `Program.cs` (`RequiredLength = 8`, `RequireDigit = true`, `RequireUppercase = true`)
- Added `[EmailAddress]` data annotation to `RegisterModel` for server-side email format validation

### Test Verification
Claude ran and interpreted the output of:
- `dotnet test` — confirmed 6/6 backend tests pass
- `npm test -- --run` — confirmed 4/4 frontend tests pass
- `npx playwright test` — confirmed 3/3 E2E tests pass across Chromium, Firefox, and WebKit

### Playwright E2E Troubleshooting
Claude diagnosed why the Playwright tests failed on the second run (JWT config not loaded after backend restart) and guided the fix: setting `Jwt:Key`, `Jwt:Issuer`, and `Jwt:Audience` via `dotnet user-secrets`.

### Code Explanation and Review
Claude explained Identity's `AddIdentity` vs `AddIdentityCore` distinction, JWT claim ordering, and why `CheckPasswordAsync` does not re-validate password rules against stored hashes (confirming existing credentials were safe after tightening password rules).

---

## What Was Not AI-Generated

- All application feature code (controllers, pages, models, services, context) was written by the developer
- The Playwright spec (`docs/e2e/checkout.spec.ts`) and E2E run notes (`docs/e2e-run.md`) were produced through the developer's own agent-mode session
- All architectural decisions (JWT auth, Identity, EF Core, React + Vite) were made by the developer
