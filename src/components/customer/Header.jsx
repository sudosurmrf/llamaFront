import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogIn } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { itemCount, toggleCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/specials', label: 'Specials' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleCartClick = (e) => {
    e.preventDefault();
    toggleCart();
  };

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="header-logo">
          <span className="logo-icon"><img className="logo-icon" style={{"width": "50px"}}src="./llamaTreats2.png" /></span>
          <span className="logo-text">
            <span className="logo-name">Llama Treats</span>
            <span className="logo-tagline">Bakery</span>
          </span>
        </Link>

        <nav className={`header-nav ${mobileMenuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${isActive(link.path) ? 'active' : ''}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-actions">
          <button
            className="header-action-btn cart-btn"
            onClick={handleCartClick}
            aria-label={`Shopping cart with ${itemCount} items`}
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>
            )}
          </button>
          {isAuthenticated ? (
            <Link
              to="/account"
              className="header-action-btn account-btn"
              aria-label="My account"
              title={`${user?.firstName}'s account`}
            >
              <User size={22} />
            </Link>
          ) : (
            <Link
              to="/login"
              className="header-action-btn login-btn"
              aria-label="Sign in"
            >
              <LogIn size={22} />
            </Link>
          )}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}
    </header>
  );
};

export default Header;
