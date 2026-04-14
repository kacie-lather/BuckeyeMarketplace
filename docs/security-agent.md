# Security Agent — Buckeye Marketplace

## Rules
1. JWT key must come from User Secrets, never appsettings.json
2. UserId always from JWT claims, never from URL or request body
3. Protected endpoints need [Authorize]
4. Admin endpoints need [Authorize(Roles = "Admin")]
5. Use LINQ only, never FromSqlRaw with string interpolation
6. Never use dangerouslySetInnerHTML on user content
7. Passwords must be hashed with ASP.NET Core Identity PasswordHasher
8. JWT tokens must expire (60 minutes max)
9. Always show a plan before editing anything