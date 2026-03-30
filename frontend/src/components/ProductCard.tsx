import { useNavigate } from 'react-router-dom'
import { Product } from '../types/Product'

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        backgroundColor: 'white'
      }}
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
    </div>
  )
}

export default ProductCard