# M4 AI Tool Usage

## Tool Used
Claude (Anthropic) - claude.ai

## Prompts Used
- "Help me walk through milestone 4 step by step in order to meet all requirements"
- "Help me build the CartController with all 5 required endpoints using my existing models"
- "Create a CartContext using useReducer and Context API for my React/TypeScript app"
- "Create a cartService with fetch calls for all cart API endpoints"
- "Build a CartPage component with loading states, error handling, and empty cart state"
- "Add an Add to Cart button to my existing ProductCard component"
- "Update App.tsx to add cart routing and a cart count in the header"
- "How do I test all 5 endpoints in Swagger?"
- "Help me add a useEffect to CartContext to load cart on app startup"
- "Fix CartItemRow.tsx - it was referencing wrong CartItem interface properties"
- "How do I wrap my app with CartProvider in main.tsx?"
- "Fix corrupted files using git checkout to restore from last commit"
- "Update cartService.ts to use API_BASE_URL from config file instead of hardcoded port"
- "Add CORS configuration to Program.cs so React frontend can call the API"
- "Help me rewrite files safely using cat > in terminal to avoid VS Code corruption"

## Generated Code
- BuckeyeMarketplace.API/Controllers/CartController.cs
- BuckeyeMarketplace.API/Models/CartDtos.cs
- frontend/src/context/CartContext.tsx
- frontend/src/services/cartService.ts
- frontend/src/pages/CartPage.tsx
- frontend/src/components/ProductCard.tsx (updated with Add to Cart button)
- frontend/src/App.tsx (updated with Header component, cart route, cart count)
- frontend/src/main.tsx (updated to wrap app with CartProvider)
- frontend/src/components/cart/CartItemRow.tsx (fixed)

## Modifications Made
- Fixed CartItemRow.tsx to use correct CartItem interface properties (item.imageUrl, item.title, item.cartItemId instead of item.product.imageUrl etc.)
- Updated cartService.ts to import API_BASE_URL from config.ts instead of hardcoded localhost:5000
- Restored corrupted files using git checkout HEAD when VS Code corrupted them during editing
- Rewrote files using cat > terminal commands instead of VS Code to prevent corruption
- Confirmed API port was 5136 (not 5000) by checking launchSettings and config.ts
- Added .gitignore entries for SQLite database files (*.db, *.db-shm, *.db-wal)

## What I Learned / How I Modified AI Output
- Understood why useReducer is better than useState for cart state with multiple operations
- Understood the upsert pattern in CartController POST (find existing item, increment quantity vs create new)
- Understood why CartProvider wraps inside BrowserRouter so cart components can use useNavigate
- Understood why the clear endpoint must be defined before the {cartItemId} route in the controller
