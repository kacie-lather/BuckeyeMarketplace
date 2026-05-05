# Lab Evaluation Report

**Student Repository**: `kacie-lather-BuckeyeMarketplace`  
**Date**: May 4, 2026  
**Rubric**: rubric.md (Milestone 4 — Cart, Orders & Admin)

## 0. Build & Run Status

| Component           | Build | Runs | Notes                                                                                                                                       |
| ------------------- | ----- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| Backend (.NET)      | ✅    | ✅   | `dotnet build` succeeded. Server runs on http://localhost:5136                                                                              |
| Frontend (React/TS) | ✅    | ✅   | `npm run build` (Vite v7.3.1) succeeded. Dev server on http://localhost:5173                                                                |
| API Endpoints       | —     | ✅   | GET /api/products → 200 (8 items); POST /api/auth/login → 200 (JWT); GET /api/cart → 401 (unauth) / 404 (empty); GET /api/orders/mine → 200 |
| Backend Tests       | —     | ✅   | `dotnet test`: 6 passed, 0 failed                                                                                                           |
| Frontend Tests      | —     | ✅   | `npm test -- --run`: 4 passed, 0 failed                                                                                                     |

## 1. Project Structure

| Component                  | Expected                          | Found                                                                    | Status |
| -------------------------- | --------------------------------- | ------------------------------------------------------------------------ | ------ |
| Cart Controller            | `Controllers/CartController.cs`   | `BuckeyeMarketplace.API/Controllers/CartController.cs`                   | ✅     |
| Cart Model                 | `Models/Cart.cs`                  | `BuckeyeMarketplace.API/Models/Cart.cs`                                  | ✅     |
| CartItem Model             | `Models/CartItem.cs`              | `BuckeyeMarketplace.API/Models/CartItem.cs`                              | ✅     |
| Cart DTOs                  | `Models/CartDtos.cs`              | `BuckeyeMarketplace.API/Models/CartDtos.cs`                              | ✅     |
| Cart Context               | `context/CartContext.tsx`         | `frontend/src/context/CartContext.tsx`                                   | ✅     |
| Cart Service               | `services/cartService.ts`         | `frontend/src/services/cartService.ts`                                   | ✅     |
| Cart Page                  | `pages/CartPage.tsx`              | `frontend/src/pages/CartPage.tsx`                                        | ✅     |
| CartItemRow Component      | `components/cart/CartItemRow.tsx` | `frontend/src/components/cart/CartItemRow.tsx`                           | ✅     |
| Cart Migration             | `Migrations/AddCartAndCartItem`   | `BuckeyeMarketplace.API/Migrations/20260330205815_AddCartAndCartItem.cs` | ✅     |
| DbContext with Cart DbSets | `Data/AppDbContext.cs`            | `BuckeyeMarketplace.API/Data/AppDbContext.cs`                            | ✅     |
| AI Usage Documentation     | `AI-USAGE.md`                     | `AI-USAGE.md`                                                            | ✅     |

## 2. Rubric Scorecard

| #   | Requirement                              | Points | Status | Evidence                                                                                                                                                                                                                                          |
| --- | ---------------------------------------- | ------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1a  | useReducer or Context API for cart state | 2      | ✅ Met | [CartContext.tsx](frontend/src/context/CartContext.tsx#L1) — `useReducer` with `CartState`/`CartAction` types, `CartProvider` wrapper, and `useCart` custom hook                                                                                  |
| 1b  | Add, update quantity, remove operations  | 2      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L24-L49) — `handleUpdateQuantity`, `handleRemove`, `handleClear` all dispatch through cartService then refresh state                                                                               |
| 1c  | Cart count in header + calculated totals | 1      | ✅ Met | [App.tsx](frontend/src/App.tsx#L52) — Header shows `state.itemCount` in Cart button; [CartPage.tsx](frontend/src/pages/CartPage.tsx#L90) — displays `state.total`                                                                                 |
| 2a  | GET /api/cart                            | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplace.API/Controllers/CartController.cs#L24) — `[HttpGet]` returns cart with items, total, itemCount; verified 200/404 responses                                                                                 |
| 2b  | POST /api/cart (add item)                | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplace.API/Controllers/CartController.cs#L56) — `[HttpPost]` with upsert logic (increment existing or create new); returns `CreatedAtAction`                                                                      |
| 2c  | PUT /api/cart/{cartItemId} (update qty)  | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplace.API/Controllers/CartController.cs#L99) — `[HttpPut("{cartItemId}")]` validates quantity ≥ 1, returns updated item                                                                                          |
| 2d  | DELETE endpoints (item + clear)          | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplace.API/Controllers/CartController.cs#L120-L153) — `[HttpDelete("clear")]` removes all items; `[HttpDelete("{cartItemId}")]` removes single item; both return `NoContent`                                      |
| 2e  | Proper status codes and responses        | 1      | ✅ Met | [CartController.cs](BuckeyeMarketplace.API/Controllers/CartController.cs) — uses `Ok`, `CreatedAtAction`, `NoContent`, `NotFound`, `BadRequest` with descriptive messages; `[Authorize]` on controller returns 401 for unauthenticated            |
| 3a  | Cart/CartItem EF entities                | 2      | ✅ Met | [Cart.cs](BuckeyeMarketplace.API/Models/Cart.cs) — `Id`, `UserId`, `CreatedAt`, `UpdatedAt`, `CartItems` collection; [CartItem.cs](BuckeyeMarketplace.API/Models/CartItem.cs) — `Id`, `CartId`, `ProductId`, `Quantity`, `AddedAt`                |
| 3b  | Relationships and navigation properties  | 1      | ✅ Met | [AppDbContext.cs](BuckeyeMarketplace.API/Data/AppDbContext.cs#L25-L36) — `Cart→CartItem` (Cascade) and `CartItem→Product` (Restrict) configured via Fluent API; nav properties on both entities                                                   |
| 3c  | Migrations applied, data persists        | 1      | ✅ Met | [20260330205815_AddCartAndCartItem.cs](BuckeyeMarketplace.API/Migrations/20260330205815_AddCartAndCartItem.cs) — migration exists; orchestrator confirmed GET /api/cart returns data from DB                                                      |
| 4a  | Real API replaces mock/localStorage      | 2      | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts) — all 5 functions use `api` axios instance (no `localStorage`, no mock data); [api.ts](frontend/src/services/api.ts) — centralized axios with Bearer token interceptor                     |
| 4b  | All cart operations call API             | 2      | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts#L3-L23) — `fetchCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart` all call API endpoints                                                                                  |
| 4c  | State synchronization                    | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L26-L49) — after every mutation (update/remove/clear), `loadCart()` re-fetches and dispatches `SET_CART`; [ProductCard.tsx](frontend/src/components/ProductCard.tsx#L23-L26) — same pattern on add |
| 5a  | Loading states                           | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L53) — `"Loading cart..."` when `state.loading`; [ProductCard.tsx](frontend/src/components/ProductCard.tsx#L21) — `adding` state disables button, shows `"Adding..."`                              |
| 5b  | Error messages and edge cases            | 1      | ✅ Met | [CartPage.tsx](frontend/src/pages/CartPage.tsx#L55-L60) — red error message with Dismiss button; lines 62-68 empty cart state with "Browse Products" navigation; quantity capped at ≥ 1                                                           |
| 5c  | Success feedback                         | 1      | ✅ Met | [ProductCard.tsx](frontend/src/components/ProductCard.tsx#L27-L28) — button turns green with `"✓ Added!"` for 2 seconds after successful add; [ProductDetailPage.tsx](frontend/src/pages/ProductDetailPage.tsx#L42-L43) — same pattern            |
| 6a  | Clean component structure                | 1      | ✅ Met | Separated into pages (`CartPage`, `ProductDetailPage`), components (`ProductCard`, `CartItemRow`), context (`CartContext`), services (`cartService`, `api`)                                                                                       |
| 6b  | Service layer / custom hooks             | 1      | ✅ Met | [cartService.ts](frontend/src/services/cartService.ts) — dedicated service layer; [CartContext.tsx](frontend/src/context/CartContext.tsx#L83-L87) — `useCart()` custom hook                                                                       |
| 6c  | AI usage documented                      | 1      | ✅ Met | [AI-USAGE.md](AI-USAGE.md#L223-L290) — M4 section lists 15 prompts, 9 generated files, specific modifications made, and "What I Learned" reflections                                                                                              |

**Total: 25 / 25**

## 3. Detailed Findings

All rubric items are met. No deficiencies to report.

## 4. Action Plan

No corrective actions required — full marks earned.

## 5. Code Quality Coaching (Non-Scoring)

- **Hardcoded fallback URL in api.ts**: [api.ts](frontend/src/services/api.ts#L3) falls back to the production Azure URL instead of `localhost:5136`. This means local development without a `.env` file will accidentally hit the production API. Consider defaulting to `http://localhost:5136` for safer local development.

- **Mixed fetch/axios usage**: [ProductDetailPage.tsx](frontend/src/pages/ProductDetailPage.tsx#L21) still uses raw `fetch()` for loading product data while the rest of the app uses the `api` axios instance. This bypasses the auth interceptor (acceptable for public endpoints) but is inconsistent. Consider using `api.get()` everywhere for uniformity.

- **Null assertion on claims**: [CartController.cs](BuckeyeMarketplace.API/Controllers/CartController.cs#L30) uses `User.FindFirst(ClaimTypes.NameIdentifier)!.Value` with a null-forgiving operator. If the claim is ever missing despite `[Authorize]`, this will throw a `NullReferenceException`. Extracting userId into a helper method with a proper null check would be safer.

- **No try/catch in CartItemRow**: [CartItemRow.tsx](frontend/src/components/cart/CartItemRow.tsx#L14-L25) — `handleUpdateQuantity` and `handleRemove` lack error handling, unlike the equivalent functions in `CartPage.tsx`. An unhandled error here would show no user feedback.

## 6. Git Practices Coaching (Non-Scoring)

- **Incremental commits**: The migration history shows progressive development (InitialCreate → AddCartAndCartItem → AddOrdersAndOrderItems → AddIdentityTables), which indicates good incremental work.

- **File corruption recovery**: AI-USAGE.md documents using `git checkout HEAD` to recover corrupted files — good instinct to use version control as a safety net.

---

**25/25** — All rubric criteria fully met with solid implementation across backend endpoints, frontend state management, database persistence, and API integration. The coaching notes above (hardcoded fallback URL, mixed fetch/axios, null assertion, missing error handling in CartItemRow) are suggestions for professional growth, not scoring deductions.
