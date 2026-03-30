import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from '../config'

interface Product {
  id: number
  title: string
  description: string
  price: number
  category: string
  sellerName: string
  postedDate: string
  imageUrl: string
}

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Product not found')
        return res.json()
      })
      .then(data => {
        setProduct(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Loading product...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!product) return null

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto' }}>
      <button
        onClick={() => navigate('/')}
        style={{ marginBottom: '20px', padding: '8px 16px', cursor: 'pointer' }}
      >
        ← Back to Listings
      </button>
      <img
        src={product.imageUrl}
        alt={product.title}
        style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
      />
      <h2 style={{ marginTop: '20px' }}>{product.title}</h2>
      <p style={{ color: '#BB0000', fontWeight: 'bold', fontSize: '1.5rem' }}>
        ${product.price.toFixed(2)}
      </p>
      <p><strong>Category:</strong> {product.category}</p>
      <p><strong>Seller:</strong> {product.sellerName}</p>
      <p><strong>Posted:</strong> {new Date(product.postedDate).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {product.description}</p>
    </div>
  )
}

export default ProductDetailPage