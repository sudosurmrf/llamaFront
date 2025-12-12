import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BakeryProvider } from './context/BakeryContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import CartDrawer from './components/common/CartDrawer';

// Customer Layout & Pages
import { CustomerLayout } from './components/customer';
import { Home, Menu, About, Contact, Specials, SpecialDetail, Login, Register, Account } from './pages/customer';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';
import ProductDetail from './pages/customer/ProductDetail';

// Admin Layout & Pages
import { AdminLayout, ProtectedAdminRoute } from './components/admin';
import {
  Dashboard,
  Products,
  ProductForm,
  Categories,
  Specials as AdminSpecials,
  SpecialForm,
  Promotions,
  PromotionForm,
  Banners,
  Settings,
  AdminLogin,
} from './pages/admin';

import './App.css';

function App() {
  return (
    <BakeryProvider>
      <AuthProvider>
        <AdminAuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <Router>
              <CartDrawer />
              <Routes>
                {/* Customer Routes */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<Home />} />
                  <Route path="menu" element={<Menu />} />
                  <Route path="specials" element={<Specials />} />
                  <Route path="specials/:id" element={<SpecialDetail />} />
                  <Route path="about" element={<About />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="order-confirmation" element={<OrderConfirmation />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="account" element={<Account />} />
                  <Route path="product/:id" element={<ProductDetail />} />
                </Route>

                {/* Admin Login (outside protected route) */}
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedAdminRoute>
                      <AdminLayout />
                    </ProtectedAdminRoute>
                  }
                >
                  <Route index element={<Dashboard />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="categories" element={<Categories />} />
                  <Route path="specials" element={<AdminSpecials />} />
                  <Route path="specials/new" element={<SpecialForm />} />
                  <Route path="specials/:id" element={<SpecialForm />} />
                  <Route path="promotions" element={<Promotions />} />
                  <Route path="promotions/new" element={<PromotionForm />} />
                  <Route path="promotions/:id" element={<PromotionForm />} />
                  <Route path="banners" element={<Banners />} />
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
              </Router>
            </FavoritesProvider>
          </CartProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BakeryProvider>
  );
}

export default App;
