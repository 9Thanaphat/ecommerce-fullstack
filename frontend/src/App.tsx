import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Auth from './pages/Auth'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Home from './pages/Home'
import AdminLayout from './pages/admin/AdminLayout'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;