import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Product } from '../types/Product'
import { useCart } from '../context/CartContext'
import { addToCart, fetchCart } from '../services/cartService'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  const { dispatch } = useCart()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setAdding(true)
    try {
      await addToCart(product.id)
      const cart = await fetchCart()
      dispatch({ type: 'SET_CART', items: cart.items, total: cart.total, itemCount: cart.itemCount })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      alert('Could not add to cart. Please try again.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '16px', cursor: 'pointer', transition: 'box-shadow 0.2s', backgroundColor: 'white' }}
      onMouseOver={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
      onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
    >
      <img
        src={product.imageUrl}
        alt={product.title}
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '4px' }}
      />
      <h3 style={{ margin: '12px 0 4px' }}>{product.title}</h3>
      <p style={{ color: '#BB0000', fontWeight: 'bold', fontSize: '1.2rem', margin: '4px 0' }}>
        ${product.price.toFixed(2)}
      </p>
      <p style={{ color: '#666', margin: '4px 0' }}>📦 {product.category}</p>
      <p style={{ color: '#666', margin: '4px 0' }}>👤 {product.sellerName}</p>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={adding}
        style={{ marginTop: '8px', width: '100%', padding: '8px', backgroundColor: added ? '#2d6a2d' : '#BB0000', color: 'white', border: 'none', borderRadius: '4px', cursor: adding ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
      >
        {adding ? 'Adding...' : added ? '✓ Added!' : 'Add to Cart'}
      </button>
    </div>
  )
}

export default ProductCard
