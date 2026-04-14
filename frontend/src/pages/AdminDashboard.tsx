import { useEffect, useState } from 'react'
import { Product } from '../types/Product'
import api from '../services/api'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminOrder {
  id: number
  userId: string
  confirmationNumber: string
  orderDate: string
  status: string
  total: number
  shippingAddress: string
  items: { productId: number; title: string; price: number; quantity: number; subtotal: number }[]
}

interface ProductForm {
  title: string
  description: string
  price: string
  category: string
  sellerName: string
  imageUrl: string
}

const EMPTY_FORM: ProductForm = {
  title: '', description: '', price: '', category: '', sellerName: '', imageUrl: ''
}

const ORDER_STATUSES = ['Confirmed', 'Processing', 'Shipped', 'Delivered']

// ─── Styles ───────────────────────────────────────────────────────────────────

const thStyle: React.CSSProperties = {
  padding: '10px 12px', textAlign: 'left', backgroundColor: '#f5f5f5',
  borderBottom: '2px solid #ddd', fontWeight: 'bold', whiteSpace: 'nowrap'
}
const tdStyle: React.CSSProperties = {
  padding: '10px 12px', borderBottom: '1px solid #eee', verticalAlign: 'middle'
}
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px',
  fontSize: '0.95rem', boxSizing: 'border-box'
}
const primaryBtn: React.CSSProperties = {
  backgroundColor: '#BB0000', color: 'white', border: 'none',
  borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem'
}
const secondaryBtn: React.CSSProperties = {
  backgroundColor: '#666', color: 'white', border: 'none',
  borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '0.9rem'
}
const ghostBtn: React.CSSProperties = {
  background: 'none', border: '1px solid #ccc', borderRadius: '4px',
  padding: '6px 12px', cursor: 'pointer', fontSize: '0.85rem'
}

// ─── Products Tab ─────────────────────────────────────────────────────────────

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadProducts = () =>
    api.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false))

  useEffect(() => { loadProducts() }, [])

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setEditingId(null)
    setShowForm(false)
  }

  const startEdit = (p: Product) => {
    setForm({
      title: p.title,
      description: p.description,
      price: String(p.price),
      category: p.category,
      sellerName: p.sellerName,
      imageUrl: p.imageUrl
    })
    setEditingId(p.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: number, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      await api.delete(`/products/${id}`)
      setProducts(prev => prev.filter(p => p.id !== id))
    } catch {
      setError('Failed to delete product.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const payload = { ...form, price: parseFloat(form.price) }
    try {
      if (editingId !== null) {
        const res = await api.put(`/products/${editingId}`, payload)
        setProducts(prev => prev.map(p => p.id === editingId ? res.data : p))
      } else {
        const res = await api.post('/products', payload)
        setProducts(prev => [...prev, res.data])
      }
      resetForm()
    } catch {
      setError('Failed to save product.')
    } finally {
      setSaving(false)
    }
  }

  const field = (key: keyof ProductForm, label: string, type = 'text') => (
    <div style={{ marginBottom: '12px' }}>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 'bold', fontSize: '0.9rem' }}>{label}</label>
      {key === 'description' ? (
        <textarea
          value={form[key]}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
          required rows={3}
          style={{ ...inputStyle, resize: 'vertical' }}
        />
      ) : (
        <input
          type={type}
          value={form[key]}
          onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
          required
          style={inputStyle}
        />
      )}
    </div>
  )

  if (loading) return <p>Loading products...</p>

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Form */}
      {showForm && (
        <div style={{ border: '1px solid #ddd', borderRadius: '6px', padding: '20px', marginBottom: '24px', backgroundColor: '#fafafa' }}>
          <h3 style={{ marginTop: 0 }}>{editingId !== null ? 'Edit Product' : 'Add Product'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
              <div>{field('title', 'Title')}</div>
              <div>{field('category', 'Category')}</div>
              <div>{field('price', 'Price', 'number')}</div>
              <div>{field('sellerName', 'Seller Name')}</div>
              <div style={{ gridColumn: '1 / -1' }}>{field('imageUrl', 'Image URL')}</div>
              <div style={{ gridColumn: '1 / -1' }}>{field('description', 'Description')}</div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button type="submit" disabled={saving} style={primaryBtn}>
                {saving ? 'Saving...' : editingId !== null ? 'Save Changes' : 'Add Product'}
              </button>
              <button type="button" onClick={resetForm} style={secondaryBtn}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      {!showForm && (
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => setShowForm(true)} style={primaryBtn}>+ Add Product</button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Category</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Seller</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} style={{ backgroundColor: editingId === p.id ? '#fff8f8' : 'white' }}>
                <td style={tdStyle}>{p.title}</td>
                <td style={tdStyle}>{p.category}</td>
                <td style={tdStyle}>${p.price.toFixed(2)}</td>
                <td style={tdStyle}>{p.sellerName}</td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => startEdit(p)} style={ghostBtn}>Edit</button>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      style={{ ...ghostBtn, color: '#BB0000', borderColor: '#BB0000' }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Orders Tab ───────────────────────────────────────────────────────────────

function OrdersTab() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [localStatus, setLocalStatus] = useState<Record<number, string>>({})
  const [saving, setSaving] = useState<number | null>(null)
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    api.get('/orders/admin/orders')
      .then(res => {
        setOrders(res.data)
        const statusMap: Record<number, string> = {}
        res.data.forEach((o: AdminOrder) => { statusMap[o.id] = o.status })
        setLocalStatus(statusMap)
      })
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false))
  }, [])

  const handleSaveStatus = async (orderId: number) => {
    setSaving(orderId)
    try {
      await api.put(`/orders/${orderId}/status`, { status: localStatus[orderId] })
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: localStatus[orderId] } : o))
    } catch {
      setError('Failed to update order status.')
    } finally {
      setSaving(null)
    }
  }

  if (loading) return <p>Loading orders...</p>

  return (
    <div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
          <thead>
            <tr>
              <th style={thStyle}>Confirmation #</th>
              <th style={thStyle}>Date</th>
              <th style={thStyle}>User ID</th>
              <th style={thStyle}>Total</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <>
                <tr
                  key={o.id}
                  style={{ cursor: 'pointer', backgroundColor: expandedId === o.id ? '#fff8f8' : 'white' }}
                  onClick={() => setExpandedId(expandedId === o.id ? null : o.id)}
                >
                  <td style={tdStyle}><strong>{o.confirmationNumber}</strong></td>
                  <td style={tdStyle}>{new Date(o.orderDate).toLocaleDateString()}</td>
                  <td style={{ ...tdStyle, fontSize: '0.8rem', color: '#666', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.userId}</td>
                  <td style={tdStyle}>${o.total.toFixed(2)}</td>
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <select
                      value={localStatus[o.id] ?? o.status}
                      onChange={e => setLocalStatus(prev => ({ ...prev, [o.id]: e.target.value }))}
                      style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '0.9rem' }}
                    >
                      {ORDER_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td style={tdStyle} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => handleSaveStatus(o.id)}
                      disabled={saving === o.id || localStatus[o.id] === o.status}
                      style={{
                        ...primaryBtn,
                        opacity: (saving === o.id || localStatus[o.id] === o.status) ? 0.5 : 1,
                        cursor: (saving === o.id || localStatus[o.id] === o.status) ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {saving === o.id ? 'Saving...' : 'Save'}
                    </button>
                  </td>
                </tr>
                {expandedId === o.id && (
                  <tr key={`${o.id}-items`}>
                    <td colSpan={6} style={{ padding: '0 12px 12px', backgroundColor: '#fff8f8' }}>
                      <div style={{ fontSize: '0.85rem', color: '#555', marginBottom: '6px' }}>
                        <strong>Ship to:</strong> {o.shippingAddress}
                      </div>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '1px solid #ddd' }}>
                            <th style={{ padding: '4px 8px', textAlign: 'left' }}>Item</th>
                            <th style={{ padding: '4px 8px', textAlign: 'center' }}>Qty</th>
                            <th style={{ padding: '4px 8px', textAlign: 'right' }}>Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items.map(item => (
                            <tr key={item.productId}>
                              <td style={{ padding: '4px 8px' }}>{item.title}</td>
                              <td style={{ padding: '4px 8px', textAlign: 'center' }}>{item.quantity}</td>
                              <td style={{ padding: '4px 8px', textAlign: 'right' }}>${item.subtotal.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#999' }}>No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Dashboard Shell ──────────────────────────────────────────────────────────

type Tab = 'products' | 'orders'

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>('products')

  const tabBtn = (t: Tab, label: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        background: 'none', border: 'none', borderBottom: tab === t ? '3px solid #BB0000' : '3px solid transparent',
        color: tab === t ? '#BB0000' : '#555', fontWeight: tab === t ? 'bold' : 'normal',
        fontSize: '1rem', padding: '10px 20px', cursor: 'pointer', marginBottom: '-1px'
      }}
    >
      {label}
    </button>
  )

  return (
    <div>
      <h2 style={{ marginBottom: '8px' }}>Admin Dashboard</h2>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid #ddd', marginBottom: '24px' }}>
        {tabBtn('products', 'Products')}
        {tabBtn('orders', 'Orders')}
      </div>

      {tab === 'products' && <ProductsTab />}
      {tab === 'orders' && <OrdersTab />}
    </div>
  )
}
