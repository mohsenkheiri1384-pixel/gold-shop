import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import BuyList from './pages/BuyList'
import SellList from './pages/SellList'
import InvoiceCreate from './pages/InvoiceCreate'
import InvoiceDetail from './pages/InvoiceDetail'
import Login from './pages/Login'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div className="spinner"></div>
  if (!user) return <Navigate to="/login" replace />

  return children
}

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<BuyList />} />
            <Route path="/sell" element={<SellList />} />
            <Route path="/invoices/new" element={<InvoiceCreate />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App