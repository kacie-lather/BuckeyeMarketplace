# Changelog

## Milestone 6 — Production Deployment & CI/CD

### Bug Fixes

**Fix SQLite migration incompatibility with Azure SQL (`Program.cs`)**
Replaced `db.Database.Migrate()` with `db.Database.EnsureCreated()` in the
startup block. The existing EF Core migrations were generated against the SQLite
provider (columns typed as `TEXT`) and could not be applied to Azure SQL Server,
causing the app to crash on startup with exit code 134 (SIGABRT). `EnsureCreated()`
creates the schema directly from the EF Core model annotations in a
provider-agnostic way, bypassing the migration system entirely.

**Fix CORS policy to allow production frontend URL (`Program.cs`)**
Added `https://yellow-smoke-03bf58010.7.azurestaticapps.net` to `WithOrigins()`
in the CORS policy. Without this, all API requests from the deployed frontend
were blocked by the browser with a CORS error, making the live site non-functional.

**Fix cart identity context not initialized on page load (`CartContext.tsx`)**
Cart requests were firing before the authenticated user context was fully
initialized, causing the cart to return empty or 401 on first load even when
the user was logged in. Fixed by adding the auth token as a dependency to the
CartContext `useEffect` so cart data is only fetched after authentication state
is confirmed.

**Fix database configuration to use Azure SQL in production (`Program.cs`, `appsettings.json`)**
Added conditional database provider registration: the app uses SQL Server when
`ConnectionStrings:DefaultConnection` is set (Azure production) and falls back
to SQLite when it is empty (local development). Previously the app always used
SQLite regardless of environment.

**Fix frontend hardcoded localhost URLs not replaced for production (`AuthContext.tsx`, `api.ts`, `config.ts`)**
`AuthContext.tsx` had two hardcoded `http://localhost:5136` URLs for login and
register that were not reading from `config.ts`. All API base URLs are now
read from the `VITE_API_URL` environment variable set in `.env.production`,
with the production Azure URL as the fallback.

**Fix TypeScript error on `import.meta.env` (`tsconfig.json`)**
`tsconfig.json` declared `"types": ["node"]` only, which caused the TypeScript
compiler to report `Property 'env' does not exist on type 'ImportMeta'` when
reading Vite environment variables. Fixed by adding `"vite/client"` to the
types array, which provides the Vite-specific `ImportMeta` augmentation.

**Remove `appsettings.Development.json` from git tracking (`.gitignore`)**
The file containing local JWT secrets was previously committed to the repository.
Removed from tracking with `git rm --cached` and added to `.gitignore` to
prevent re-committing. Deploy artifacts (`deploy.zip`, `publish/`) also added
to `.gitignore`.

---

## Milestone 5 — Authentication, Security & Order Processing

### Bug Fixes

**Fix JWT token expiration to use UTC (`AuthController.cs`)**
Changed `DateTime.Now.AddHours(1)` to `DateTime.UtcNow.AddHours(1)` in the JWT token generation. The JWT specification (RFC 7519) requires the `exp` claim to be a UTC timestamp; using local server time could cause validation failures across timezones.

**Add explicit password rules to Identity configuration (`Program.cs`)**
Added `options.Password.RequiredLength = 8`, `RequireDigit = true`, and `RequireUppercase = true` to the `AddIdentity` call. Previously the default `RequiredLength` of 6 was in effect, which did not meet the milestone requirement of a minimum 8-character password.

**Add email format validation to RegisterModel (`AuthController.cs`)**
Added the `[EmailAddress]` data annotation to `RegisterModel.Email`. Without this, the registration endpoint accepted any string as an email address. ASP.NET model validation now returns a 400 Bad Request automatically for malformed email inputs.

**Set JWT configuration in user secrets**
Moved `Jwt:Key`, `Jwt:Issuer`, and `Jwt:Audience` out of `appsettings.json` (where they were absent but expected at runtime) and into `dotnet user-secrets`. This ensures the signing key is never committed to source control.

**Fix cart service to use authenticated axios instance (`cartService.ts`)**
Replaced all raw `fetch()` calls in `cartService.ts` with the configured 
axios instance from `api.ts`. The raw fetch calls bypassed the axios 
interceptor that attaches the Bearer token, causing all cart endpoints 
to return 401 Unauthorized even when the user was logged in.

**Fix AppDbContext to extend IdentityDbContext (`AppDbContext.cs`)**
Changed `AppDbContext` to extend `IdentityDbContext<IdentityUser>` instead 
of plain `DbContext`. Without this, ASP.NET Identity had no knowledge of 
the Identity tables, causing user registration to fail with a 500 error.
