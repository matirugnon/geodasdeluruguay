import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { ProductDetail } from './pages/ProductDetail';
import { Tips } from './pages/Tips';
import { TipDetail } from './pages/TipDetail';
import { Admin } from './pages/Admin';
import { Shop } from './pages/Shop';
import { ShopCategory } from './pages/ShopCategory';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:id" element={<Category />} />
          <Route path="/producto/:id" element={<ProductDetail />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/tips/:id" element={<TipDetail />} />
          <Route path="/admin" element={<Admin />} />
          
          {/* New Shop Routes */}
          <Route path="/tienda" element={<Shop />} />
          <Route path="/tienda/:category" element={<ShopCategory />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}