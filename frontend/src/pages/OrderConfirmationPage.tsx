import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

interface OrderConfirmation {
  orderId: number
  confirmationNumber: string
  total: number
  status: string
}

function OrderConfirmationPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state as OrderConfirmation | null

  useEffect(() => {
    if (!order) navigate('/orders', { replace: true })
  }, [order, navigate])

  if (!order) return null

  return (
    <div style={{ maxWidth: '560px', margin: '40px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✓</div>
      <h2 style={{ color: '#BB0000', marginTop: 0 }}>Order Placed!</h2>
      <p style={{ color: '#555', marginBottom: '24px' }}>
        Thanks for your order. Here are your details:
      </p>

      <div style={{ border: '1px solid #eee', borderRadius: '6px', padding: '24px', textAlign: 'left', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ color: '#666' }}>Confirmation #</span>
          <strong>{order.confirmationNumber}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ color: '#666' }}>Order ID</span>
          <span>{order.orderId}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
          <span style={{ color: '#666' }}>Total</span>
          <span>${order.total.toFixed(2)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <span style={{ color: '#666' }}>Status</span>
          <span style={{ color: 'green', fontWeight: 'bold' }}>{order.status}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          onClick={() => navigate('/orders')}
          style={{ padding: '10px 20px', border: '1px solid #BB0000', borderRadius: '4px', cursor: 'pointer', color: '#BB0000', background: 'white' }}
        >
          View Order History
        </button>
        <button
          onClick={() => navigate('/')}
          style={{ backgroundColor: '#BB0000', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
