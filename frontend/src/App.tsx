import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Home from './pages/Home'
import AdminLayout from './pages/admin/AdminLayout'
import MainLayout from './pages/MainLayout'
import ProductDetail from './pages/ProductDetail'
import UserProfile from './pages/UserProfile'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import MyOrders from './pages/MyOrders'
import { CartProvider } from './context/CartContext'
import { Toaster } from 'sonner'

function App() {
  return (
    <CartProvider>
    <Toaster position="top-right" richColors closeButton />
    <Router>
      <Routes>
        {/* Routes ที่ต้องการ NavBar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<OrderSuccess />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Route>

        {/* Routes ที่ไม่ต้องการ NavBar */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
    </CartProvider>
  )
}

export default App