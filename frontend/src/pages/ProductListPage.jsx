import { useState, useEffect } from 'react'
import ProductList from '../components/ProductList'
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

function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setLoading(false)
      })
      .catch(err => {
        setError('Could not load products. Is the API running?')
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading products...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>

  return (
    <div>
      <h2>Browse Listings</h2>
      <ProductList products={products} />
    </div>
  )
}

export default ProductListPage