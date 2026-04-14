import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

interface OrderItem {
  productId: number
  title: string
  price: number
  quantity: number
  subtotal: number
}

interface Order {
  id: number
  confirmationNumber: string
  orderDate: string
  status: string
  total: number
  shippingAddress: string
  items: OrderItem[]
}

function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/orders/mine')
      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p>Loading orders...</p>

  if (error) return <p style={{ color: 'red' }}>{error}</p>

  if (orders.length === 0) {
    return (
      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <p>You haven't placed any orders yet.</p>
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
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <h2>Order History</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #eee', borderRadius: '6px', marginBottom: '16px', overflow: 'hidden' }}>
          <div
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', backgroundColor: '#fafafa', cursor: 'pointer' }}
            onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
          >
            <div>
              <strong>{order.confirmationNumber}</strong>
              <span style={{ color: '#666', marginLeft: '16px', fontSize: '0.9rem' }}>
                {new Date(order.orderDate).toLocaleDateString()}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ color: order.status === 'Confirmed' ? 'green' : '#555', fontWeight: 'bold' }}>
                {order.status}
              </span>
              <strong>${order.total.toFixed(2)}</strong>
              <span style={{ color: '#999' }}>{expandedId === order.id ? '▲' : '▼'}</span>
            </div>
          </div>

          {expandedId === order.id && (
            <div style={{ padding: '16px' }}>
              <p style={{ color: '#555', margin: '0 0 12px' }}>
                <strong>Ship to:</strong> {order.shippingAddress}
              </p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                    <th style={{ padding: '6px 8px' }}>Item</th>
                    <th style={{ padding: '6px 8px', textAlign: 'center' }}>Qty</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Price</th>
                    <th style={{ padding: '6px 8px', textAlign: 'right' }}>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map(item => (
                    <tr key={item.productId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '6px 8px' }}>{item.title}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right' }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: '6px 8px', textAlign: 'right' }}>${item.subtotal.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default OrderHistoryPage
