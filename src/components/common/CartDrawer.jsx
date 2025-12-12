import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import Button from './Button';
import './CartDrawer.css';

const CartDrawer = () => {
  const navigate = useNavigate();
  const drawerRef = useRef(null);
  const {
    items,
    isCartOpen,
    closeCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    itemCount,
    subtotal,
    tax,
    total,
    clearCart,
  } = useCart();

  // Close drawer on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  // Handle clicking outside to close
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeCart();
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const formatPrice = (price) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder-product.jpg';
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={handleOverlayClick}
        aria-hidden={!isCartOpen}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`cart-drawer ${isCartOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        {/* Header */}
        <div className="cart-drawer-header">
          <h2>
            <ShoppingBag size={24} />
            Your Cart
            {itemCount > 0 && <span className="cart-count">({itemCount})</span>}
          </h2>
          <button
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-drawer-content">
          {items.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={64} strokeWidth={1} />
              <h3>Your cart is empty</h3>
              <p>Add some delicious treats to get started!</p>
              <Button variant="primary" onClick={() => { closeCart(); navigate('/menu'); }}>
                Browse Menu
              </Button>
            </div>
          ) : (
            <ul className="cart-items-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={getProductImage(item)} alt={item.name} />
                  </div>
                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                    <div className="cart-item-actions">
                      <div className="quantity-controls">
                        <button
                          className="qty-btn"
                          onClick={() => decrementQuantity(item.id)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => incrementQuantity(item.id)}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-total">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with totals and checkout */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>

            <div className="cart-totals">
              <div className="cart-total-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="cart-total-row">
                <span>Tax (8.5%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="cart-total-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="large"
              fullWidth
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
