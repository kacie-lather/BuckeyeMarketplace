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

## Generated Code
- BuckeyeMarketplace.API/Controllers/CartController.cs
- BuckeyeMarketplace.API/Models/CartDtos.cs
- frontend/src/context/CartContext.tsx
- frontend/src/services/cartService.ts
- frontend/src/pages/CartPage.tsx
- frontend/src/components/ProductCard.tsx (updated)
- frontend/src/App.tsx (updated)

## Modifications Made
- Fixed CartItemRow.tsx to use correct CartItem interface properties
- Updated cartService.ts to use API_BASE_URL from config instead of hardcoded port
- Resolved file corruption issues by rewriting files via terminal instead of VS Code
