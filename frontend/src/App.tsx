import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Home from './pages/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Product />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;