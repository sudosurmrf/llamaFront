import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Package,
  LogOut,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, getOrders, loading } = useAuth();
  const {
    items: cartItems,
    itemCount,
    subtotal,
    tax,
    total,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
  } = useCart();
  const { favorites, favoriteCount, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      if (isAuthenticated) {
        setOrdersLoading(true);
        const result = await getOrders();
        if (result.success) {
          setOrders(result.orders);
        }
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, getOrders]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'Pending', className: 'status-pending', icon: Clock },
      confirmed: { label: 'Confirmed', className: 'status-confirmed', icon: CheckCircle },
      preparing: { label: 'Preparing', className: 'status-preparing', icon: Loader },
      ready: { label: 'Ready', className: 'status-ready', icon: CheckCircle },
      completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle },
      cancelled: { label: 'Cancelled', className: 'status-cancelled', icon: XCircle },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span className={`order-status ${config.className}`}>
        <Icon size={14} />
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="account-page">
        <div className="loading-state">
          <Loader className="spin" size={32} />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="account-page">
      <div className="container">
        <div className="account-layout">
          {/* Sidebar */}
          <aside className="account-sidebar">
            <div className="user-info">
              <div className="user-avatar">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="user-details">
                <h2>{user.firstName} {user.lastName}</h2>
                <p>{user.email}</p>
              </div>
            </div>

            <nav className="account-nav">
              <button
                className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <Package size={20} />
                <span>Orders</span>
                <ChevronRight size={18} className="nav-arrow" />
              </button>
              <button
                className={`nav-item ${activeTab === 'favorites' ? 'active' : ''}`}
                onClick={() => setActiveTab('favorites')}
              >
                <Heart size={20} />
                <span>Favorites</span>
                {favoriteCount > 0 && <span className="nav-badge">{favoriteCount}</span>}
                <ChevronRight size={18} className="nav-arrow" />
              </button>
              <button
                className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <User size={20} />
                <span>Profile</span>
                <ChevronRight size={18} className="nav-arrow" />
              </button>
              <button className="nav-item logout" onClick={handleLogout}>
                <LogOut size={20} />
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="account-main">
            {/* Current Cart Section - Always visible if cart has items */}
            {cartItems.length > 0 && (
              <div className="account-section cart-section">
                <div className="cart-section-header">
                  <h2 className="section-title">
                    <ShoppingBag size={24} />
                    Your Cart
                    <span className="cart-count">({itemCount} items)</span>
                  </h2>
                  <button
                    className="btn-checkout"
                    onClick={() => navigate('/checkout')}
                  >
                    Checkout Now
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div className="cart-items-list">
                  {cartItems.map((item) => (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} alt={item.name} />
                        ) : (
                          <div className="cart-item-placeholder">
                            <ShoppingBag size={20} />
                          </div>
                        )}
                      </div>
                      <div className="cart-item-details">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">
                          ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                      <div className="cart-item-actions">
                        <div className="quantity-controls">
                          <button
                            className="qty-btn"
                            onClick={() => decrementQuantity(item.id)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="qty-value">{item.quantity}</span>
                          <button
                            className="qty-btn"
                            onClick={() => incrementQuantity(item.id)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn-checkout-full"
                    onClick={() => navigate('/checkout')}
                  >
                    Proceed to Checkout
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="account-section">
                <h1 className="section-title">Your Orders</h1>

                {ordersLoading ? (
                  <div className="loading-state">
                    <Loader className="spin" size={24} />
                    <span>Loading orders...</span>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="empty-state">
                    <Package size={48} />
                    <h3>No orders yet</h3>
                    <p>When you place an order, it will appear here.</p>
                    <button className="btn-primary" onClick={() => navigate('/menu')}>
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <div className="order-info">
                            <span className="order-number">{order.orderNumber}</span>
                            <span className="order-date">{formatDate(order.createdAt)}</span>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>

                        <div className="order-items">
                          {order.items.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="order-item">
                              <span className="item-qty">{item.quantity}x</span>
                              <span className="item-name">{item.productName}</span>
                              <span className="item-price">${parseFloat(item.totalPrice).toFixed(2)}</span>
                            </div>
                          ))}
                          {order.items.length > 3 && (
                            <div className="more-items">
                              +{order.items.length - 3} more items
                            </div>
                          )}
                        </div>

                        <div className="order-footer">
                          <div className="order-fulfillment">
                            <span className="fulfillment-type">
                              {order.fulfillmentType === 'delivery' ? 'Delivery' : 'Pickup'}
                            </span>
                          </div>
                          <div className="order-total">
                            Total: <strong>${parseFloat(order.total).toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="account-section">
                <h1 className="section-title">Your Favorites</h1>

                {favorites.length === 0 ? (
                  <div className="empty-state">
                    <Heart size={48} />
                    <h3>No favorites yet</h3>
                    <p>Save your favorite treats by clicking the heart icon on any product.</p>
                    <button className="btn-primary" onClick={() => navigate('/menu')}>
                      Browse Menu
                    </button>
                  </div>
                ) : (
                  <div className="favorites-grid">
                    {favorites.map((item) => (
                      <div key={item.id} className="favorite-card">
                        <Link to={`/product/${item.id}`} className="favorite-link">
                          <div className="favorite-image">
                            {item.images?.[0] ? (
                              <img src={item.images[0]} alt={item.name} />
                            ) : (
                              <div className="favorite-placeholder">
                                <ShoppingBag size={24} />
                              </div>
                            )}
                          </div>
                          <div className="favorite-info">
                            <h4 className="favorite-name">{item.name}</h4>
                            <span className="favorite-price">
                              ${parseFloat(item.price).toFixed(2)}
                            </span>
                          </div>
                        </Link>
                        <button
                          className="favorite-remove-btn"
                          onClick={() => removeFromFavorites(item.id)}
                          title="Remove from favorites"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="account-section">
                <h1 className="section-title">Your Profile</h1>

                <div className="profile-card">
                  <div className="profile-field">
                    <label>First Name</label>
                    <span>{user.firstName}</span>
                  </div>
                  <div className="profile-field">
                    <label>Last Name</label>
                    <span>{user.lastName}</span>
                  </div>
                  <div className="profile-field">
                    <label>Email</label>
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="profile-field">
                      <label>Phone</label>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Account;
