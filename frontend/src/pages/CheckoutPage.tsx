import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../services/api'

function CheckoutPage() {
  const { state, dispatch } = useCart()
  const navigate = useNavigate()
  const [shippingAddress, setShippingAddress] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!shippingAddress.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await api.post('/orders', { shippingAddress })
      dispatch({ type: 'SET_CART', items: [], total: 0, itemCount: 0 })
      navigate('/order-confirmation', { state: res.data })
    } catch {
      setError('Failed to place order. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (state.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>Your cart is empty.</p>
        <button
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#BB0000', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <h2>Checkout</h2>

      <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ marginTop: 0 }}>Order Summary</h3>
        {state.items.map(item => (
          <div key={item.cartItemId} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
            <span>{item.title} × {item.quantity}</span>
            <span>${item.subtotal.toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontWeight: 'bold', fontSize: '1.1rem' }}>
          <span>Total</span>
          <span>${state.total.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3 style={{ marginTop: 0 }}>Shipping Address</h3>
        <textarea
          value={shippingAddress}
          onChange={e => setShippingAddress(e.target.value)}
          placeholder="Enter your full shipping address"
          required
          rows={3}
          style={{ width: '100%', padding: '10px', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'vertical' }}
        />

        {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => navigate('/cart')}
            style={{ padding: '10px 20px', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', background: 'white' }}
          >
            Back to Cart
          </button>
          <button
            type="submit"
            disabled={submitting || !shippingAddress.trim()}
            style={{ backgroundColor: submitting ? '#999' : '#BB0000', color: 'white', padding: '10px 24px', border: 'none', borderRadius: '4px', cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '1rem' }}
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutPage
