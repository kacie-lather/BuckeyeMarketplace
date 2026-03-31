import { Routes, Route, useNavigate } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import { useCart } from './context/CartContext'

function Header() {
  const { state } = useCart()
  const navigate = useNavigate()
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h1 style={{ color: '#BB0000', cursor: 'pointer' }} onClick={() => navigate('/')}>
        🌰 Buckeye Marketplace
      </h1>
      <button
        onClick={() => navigate('/cart')}
        style={{ backgroundColor: '#BB0000', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '1rem' }}
      >
        🛒 Cart {state.itemCount > 0 && `(${state.itemCount})`}
      </button>
    </div>
  )
}

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Header />
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  )
}

export default App
