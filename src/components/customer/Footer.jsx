import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-section footer-about">
            <div className="footer-logo">
              <span className="logo-icon"><img src="./llamaTreats.png" /></span>
              <span className="logo-text">Llama Treats Bakery</span>
            </div>
            <p className="footer-description">
              Handcrafted baked goods made with love and the finest ingredients.
              From our oven to your table, every treat tells a story.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/llamatreatsbakery" className="social-link" aria-label="Instagram">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Our Menu</Link></li>
              <li><Link to="/specials">Specials & Deals</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Categories</h3>
            <ul className="footer-links">
              <li><Link to="/menu?category=fudge">Fudge</Link></li>
              <li><Link to="/menu?category=cookies">Cookies</Link></li>
              <li><Link to="/menu?category=specialty-cookies">Specialty Cookies</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Visit Us</h3>
            <ul className="footer-contact">
              <li>
                <MapPin size={18} />
                <span>Greer, SC 29651</span>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:llamatreatsbakery@gmail.com">llamatreatsbakery@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Llama Treats Bakery. All rights reserved.</p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
