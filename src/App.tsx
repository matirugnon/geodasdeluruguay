import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { Home } from './pages/Home';
import { Category } from './pages/Category';
import { ProductDetail } from './pages/ProductDetail';
import { Tips } from './pages/Tips';
import { TipDetail } from './pages/TipDetail';
import { Admin } from './pages/Admin';
import { Shop } from './pages/Shop';
import { ShopCategory } from './pages/ShopCategory';
import { Checkout } from './pages/Checkout';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Pages that render their own header (no global Navbar/Footer)
const STANDALONE_PATHS = ['/checkout'];

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isStandalone = STANDALONE_PATHS.some(p => pathname.startsWith(p));

  return (
    <div className="flex flex-col min-h-screen">
      {!isStandalone && <Navbar />}
      <CartDrawer />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:id" element={<Category />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/tips" element={<Tips />} />
        <Route path="/tips/:id" element={<TipDetail />} />
        <Route path="/admin" element={<Admin />} />
        {/* Shop Routes */}
        <Route path="/tienda" element={<Shop />} />
        <Route path="/tienda/:categorySlug" element={<Shop />} />
        {/* Checkout */}
        <Route path="/checkout" element={<Checkout />} />
      </Routes>
      {!isStandalone && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <AppLayout />
      </CartProvider>
    </Router>
  );
}