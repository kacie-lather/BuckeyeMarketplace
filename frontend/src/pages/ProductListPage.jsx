import { useState, useEffect } from 'react'
import ProductList from '../components/ProductList'

function ProductListPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:5136/api/products')
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