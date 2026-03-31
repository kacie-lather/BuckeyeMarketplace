import { useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { fetchCart, updateCartItem, removeCartItem, clearCart } from '../services/cartService'
import { useNavigate } from 'react-router-dom'

function CartPage() {
  const { state, dispatch } = useCart()
  const navigate = useNavigate()

  const loadCart = async () => {
    dispatch({ type: 'SET_LOADING', loading: true })
    try {
      const cart = await fetchCart()
      dispatch({ type: 'SET_CART', items: cart.items, total: cart.total, itemCount: cart.itemCount })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Failed to load cart.' })
    }
  }

  useEffect(() => { loadCart() }, [])

  const handleUpdateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return
    try {
      await updateCartItem(cartItemId, quantity)
      await loadCart()
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Failed to update quantity.' })
    }
  }

  const handleRemove = async (cartItemId: number) => {
    try {
      await removeCartItem(cartItemId)
      await loadCart()
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Failed to remove item.' })
    }
  }

  const handleClear = async () => {
    try {
      await clearCart()
      await loadCart()
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Failed to clear cart.' })
    }
  }

  if (state.loading) return <p>Loading cart...</p>

  if (state.error) return (
    <div>
      <p style={{ color: 'red' }}>{state.error}</p>
      <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })}>Dismiss</button>
    </div>
  )

  if (state.items.length === 0) return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <p>Your cart is empty.</p>
      <button onClick={() => navigate('/')} style={{ backgroundColor: '#BB0000', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Browse Products
      </button>
    </div>
  )

  return (
    <div>
      <h2>Your Cart ({state.itemCount} items)</h2>
      {state.items.map(item => (
        <div key={item.cartItemId} style={{ display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid #eee', padding: '16px 0' }}>
          <img src={item.imageUrl} alt={item.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 'bold', margin: 0 }}>{item.title}</p>
            <p style={{ color: '#BB0000', margin: '4px 0' }}>${item.price.toFixed(2)} each</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity - 1)} disabled={item.quantity <= 1}>−</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => handleUpdateQuantity(item.cartItemId, item.quantity + 1)}>+</button>
          </div>
          <p style={{ minWidth: '70px', textAlign: 'right' }}>${item.subtotal.toFixed(2)}</p>
          <button type="button" onClick={() => handleRemove(item.cartItemId)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>Remove</button>
        </div>
      ))}
      <div style={{ textAlign: 'right', marginTop: '16px' }}>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total: ${state.total.toFixed(2)}</p>
        <button type="button" onClick={handleClear} style={{ marginRight: '8px', padding: '8px 16px', cursor: 'pointer' }}>Clear Cart</button>
        <button type="button" style={{ backgroundColor: '#BB0000', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage
