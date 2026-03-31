import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { API_BASE_URL } from '../config'

export interface CartProduct {
  id: number
  title: string
  price: number
  imageUrl: string
}

export interface CartItem {
  id: number
  productId: number
  quantity: number
  product: CartProduct
}

interface CartState {
  items: CartItem[]
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_CART' }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload, loading: false, error: null }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>
  removeItem: (cartItemId: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  itemCount: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false,
    error: null,
  })

  const refreshCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`)
      if (!res.ok) throw new Error()
      const data = await res.json()
      dispatch({ type: 'SET_ITEMS', payload: data.cartItems ?? [] })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load cart.' })
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  const addToCart = async (productId: number, quantity = 1) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      })
      if (!res.ok) throw new Error()
      await refreshCart()
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add item to cart.' })
    }
  }

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      if (!res.ok) throw new Error()
      await refreshCart()
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update quantity.' })
    }
  }

  const removeItem = async (cartItemId: number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/${cartItemId}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      await refreshCart()
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to remove item.' })
    }
  }

  const clearCart = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/cart/clear`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error()
      dispatch({ type: 'CLEAR_CART' })
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to clear cart.' })
    }
  }

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0)
  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider value={{ state, addToCart, updateQuantity, removeItem, clearCart, refreshCart, itemCount, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}