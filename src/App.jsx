import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BakeryProvider } from './context/BakeryContext';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/common/CartDrawer';

// Customer Layout & Pages
import { CustomerLayout } from './components/customer';
import { Home, Menu, About, Contact, Specials } from './pages/customer';
import Checkout from './pages/customer/Checkout';
import OrderConfirmation from './pages/customer/OrderConfirmation';

// Admin Layout & Pages
import { AdminLayout } from './components/admin';
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
} from './pages/admin';

import './App.css';

function App() {
  return (
    <BakeryProvider>
      <CartProvider>
        <Router>
          <CartDrawer />
          <Routes>
            {/* Customer Routes */}
            <Route path="/" element={<CustomerLayout />}>
              <Route index element={<Home />} />
              <Route path="menu" element={<Menu />} />
              <Route path="specials" element={<Specials />} />
              <Route path="about" element={<About />} />
              <Route path="contact" element={<Contact />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation" element={<OrderConfirmation />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLayout />}>
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
      </CartProvider>
    </BakeryProvider>
  );
}

export default App;
