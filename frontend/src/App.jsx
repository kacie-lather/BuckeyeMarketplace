import { Routes, Route } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'

function App() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#BB0000' }}>🌰 Buckeye Marketplace</h1>
      <Routes>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
      </Routes>
    </div>
  )
}

export default App