# Testing Agent — Buckeye Marketplace

## Project Info
- API: BuckeyeMarketplace.API
- Frontend: frontend/
- Tests: BuckeyeMarketplace.Tests

## Commands
- dotnet test
- npm test -- --run
- npx playwright test

## Rules
1. Never weaken assertions to make tests pass
2. Never invent classes, endpoints, or claims that do not exist in the repo
3. Always read the actual file before writing tests for it
4. Use WebApplicationFactory<Program> for integration tests
5. Use React Testing Library + Vitest for frontend tests
6. Prefer getByRole, getByLabel, or getByTestId for Playwright selectors
7. Run the tests and show me the actual output after generating them
8. If a test fails, fix the code or test logic — never remove the assertion
