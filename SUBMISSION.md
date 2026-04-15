# Milestone 5 Submission

## Test Credentials

### Admin User (seeded on every fresh database)
- **Email:** admin@test.com
- **Password:** Admin123!

### Regular User (created by Playwright E2E test)
- **Email:** e2etest@buckeye.com
- **Password:** Buckeye1!

> To create the regular user on a fresh clone, run `npx playwright test` from the `frontend/` directory. The spec registers the account automatically. Alternatively, register a new account via the UI at `/register`.

---

## Security Practices Applied

### 1. JWT Signing Key in User Secrets
The `Jwt:Key`, `Jwt:Issuer`, and `Jwt:Audience` values are stored exclusively via `dotnet user-secrets` and are never committed to `appsettings.json` or any tracked config file. A `git grep -i "Jwt:Key"` confirms no secret value appears in the repository.

### 2. Parameterized Queries via EF Core LINQ
All database queries use EF Core LINQ methods (`Where`, `FindAsync`, `FirstOrDefaultAsync`). No raw SQL (`FromSqlRaw` with string interpolation) is used anywhere, eliminating SQL injection risk.

### 3. JWT Claim-Scoped Queries (Broken Object-Level Authorization Prevention)
Every user-facing endpoint (`GET /api/orders/mine`, all cart endpoints) derives the user ID from `User.FindFirst(ClaimTypes.NameIdentifier)` in the JWT — never from a URL parameter supplied by the client. This prevents users from accessing other users' data by manipulating request parameters.

### 4. Password Hashing via ASP.NET Core Identity
Passwords are hashed using ASP.NET Core Identity's built-in PBKDF2/HMAC-SHA256 implementation. No manual hashing is used anywhere in the codebase. Password rules enforce a minimum of 8 characters with at least one digit and one uppercase letter.

### 5. No XSS via dangerouslySetInnerHTML
No user-supplied content is rendered via `dangerouslySetInnerHTML` in the React frontend. All dynamic content is rendered through React's default JSX escaping, which prevents cross-site scripting attacks.

---

## AI Usage

See [AI-USAGE.md](AI-USAGE.md) for full documentation of how Claude Code was used during this milestone.
