import { Routes, Route, useNavigate } from 'react-router-dom'
import ProductListPage from './pages/ProductListPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderConfirmationPage from './pages/OrderConfirmationPage'
import OrderHistoryPage from './pages/OrderHistoryPage'
import AdminDashboard from './pages/AdminDashboard'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useCart } from './context/CartContext'
import { useAuth } from './context/AuthContext'

function Header() {
  const { state } = useCart()
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
      <h1 style={{ color: '#BB0000', cursor: 'pointer' }} onClick={() => navigate('/')}>
        Buckeye Marketplace
      </h1>
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {isAuthenticated && user && (
          <span style={{ marginRight: '10px' }}>
            {user.email}
          </span>
        )}
        {isAuthenticated ? (
          <>
            {user?.roles.includes('Admin') && (
              <button
                onClick={() => navigate('/admin')}
                style={{ background: 'none', border: 'none', color: '#BB0000', cursor: 'pointer', fontSize: '1rem', padding: '8px 4px' }}
              >
                Admin
              </button>
            )}
            <button
              onClick={() => navigate('/orders')}
              style={{ background: 'none', border: 'none', color: '#BB0000', cursor: 'pointer', fontSize: '1rem', padding: '8px 4px' }}
            >
              Orders
            </button>
            <button
              onClick={() => navigate('/cart')}
              style={{ backgroundColor: '#BB0000', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Cart {state.itemCount > 0 && `(${state.itemCount})`}
            </button>
            <button
              onClick={() => {
                logout()
                navigate('/')
              }}
              style={{ backgroundColor: '#666', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/login')}
              style={{ backgroundColor: '#BB0000', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              style={{ backgroundColor: '#0066BB', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', cursor: 'pointer', fontSize: '1rem' }}
            >
              Register
            </button>
          </>
        )}
      </div>
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrderHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['Admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  )
}

export default App
