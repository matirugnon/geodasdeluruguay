import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

// Lazy-loaded pages for code splitting
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Category = lazy(() => import('./pages/Category').then(m => ({ default: m.Category })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Tips = lazy(() => import('./pages/Tips').then(m => ({ default: m.Tips })));
const TipDetail = lazy(() => import('./pages/TipDetail').then(m => ({ default: m.TipDetail })));
const Shop = lazy(() => import('./pages/Shop').then(m => ({ default: m.Shop })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));

const PageLoader = () => (
  <div className="site-shell min-h-screen flex items-center justify-center">
    <div className="surface-panel-soft flex items-center gap-3 rounded-full px-5 py-3 text-sm text-stone-600">
      <div className="h-5 w-5 rounded-full border-2 border-[#7f6242]/20 border-t-[#7f6242] animate-spin" />
      Preparando la experiencia...
    </div>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

// Trailing slash normalizer — redirect /tienda/ → /tienda
const TrailingSlashRedirect = () => {
  const { pathname, search } = useLocation();
  if (pathname !== '/' && pathname.endsWith('/')) {
    return <Navigate to={pathname.slice(0, -1) + search} replace />;
  }
  return null;
};

// Pages that render their own header (no global Navbar/Footer)
const STANDALONE_PATHS = ['/checkout'];

const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isStandalone = STANDALONE_PATHS.some(p => pathname.startsWith(p));

  return (
    <div className="site-shell flex min-h-screen flex-col">
      {!isStandalone && <Navbar />}
      <CartDrawer />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/categoria/:id" element={<Category />} />
          {/* Producto: slug descriptivo con ID al final */}
          <Route path="/producto/:slug" element={<ProductDetail />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/tips/:slug" element={<TipDetail />} />
          {/* Shop Routes */}
          <Route path="/tienda" element={<Shop />} />
          <Route path="/tienda/:categorySlug" element={<Shop />} />
          {/* Checkout */}
          <Route path="/checkout" element={<Checkout />} />
          {/* Catch-all → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      {!isStandalone && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <TrailingSlashRedirect />
        <CartProvider>
          <AppLayout />
        </CartProvider>
      </Router>
    </HelmetProvider>
  );
}
