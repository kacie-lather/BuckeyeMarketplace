# Changelog

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
