import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import './OrderConfirmation.css';

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [confirmationError, setConfirmationError] = useState(null);
  const orderConfirmedRef = useRef(false);

  const sessionId = searchParams.get('session_id');
  const success = searchParams.get('success');

  // Confirm order in database after successful Stripe payment
  useEffect(() => {
    const confirmOrder = async () => {
      // Wait for auth to finish loading and prevent duplicate calls
      if (authLoading || orderConfirmedRef.current) {
        return;
      }

      if (success === 'true' && sessionId) {
        orderConfirmedRef.current = true; // Mark as attempted

        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/checkout/confirm-order`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              // Transform to snake_case for backend API
              body: JSON.stringify({
                session_id: sessionId,
                customer_id: isAuthenticated && user ? user.id : null,
              }),
            }
          );

          const data = await response.json();

          if (response.ok) {
            setOrderDetails(data.order);
          } else {
            console.error('Failed to confirm order:', data.error);
            setConfirmationError(data.error);
          }
        } catch (error) {
          console.error('Error confirming order:', error);
          setConfirmationError('Failed to save order details');
          orderConfirmedRef.current = false; // Allow retry on error
        }
      }
    };

    confirmOrder();
  }, [success, sessionId, isAuthenticated, user, authLoading]);

  useEffect(() => {
    // Clear cart after successful payment
    if (success === 'true') {
      clearCart();
    }
  }, [success, clearCart]);

  // If no success param, redirect to home
  useEffect(() => {
    if (!success) {
      navigate('/');
    }
  }, [success, navigate]);

  if (success === 'false' || searchParams.get('canceled') === 'true') {
    return (
      <div className="order-confirmation-page">
        <div className="confirmation-container">
          <div className="confirmation-card error">
            <div className="confirmation-icon error">
              <Package size={48} />
            </div>
            <h1>Payment Cancelled</h1>
            <p>Your order was not completed. No charges were made.</p>
            <div className="confirmation-actions">
              <Button variant="primary" onClick={() => navigate('/checkout')}>
                Return to Checkout
              </Button>
              <Link to="/menu" className="continue-link">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-card">
          <div className="confirmation-icon">
            <CheckCircle size={64} />
          </div>

          <h1>Order Confirmed!</h1>
          <p className="confirmation-message">
            Thank you for your order! We've sent a confirmation email with your order details.
          </p>

          {(orderDetails || sessionId) && (
            <div className="order-number">
              <span>Order Number:</span>
              <strong>{orderDetails?.orderNumber || sessionId.slice(-8).toUpperCase()}</strong>
            </div>
          )}

          <div className="confirmation-details">
            <div className="detail-card">
              <Clock size={24} />
              <div>
                <h3>Estimated Time</h3>
                <p>Your order will be ready within 30-45 minutes</p>
              </div>
            </div>
            <div className="detail-card">
              <MapPin size={24} />
              <div>
                <h3>Pickup Location</h3>
                <p>123 Baker Street, Llamaville, CA 90210</p>
              </div>
            </div>
          </div>

          <div className="confirmation-next-steps">
            <h2>What's Next?</h2>
            <ul>
              <li>
                <span className="step-num">1</span>
                <span>You'll receive an email confirmation shortly</span>
              </li>
              <li>
                <span className="step-num">2</span>
                <span>We'll start preparing your delicious treats</span>
              </li>
              <li>
                <span className="step-num">3</span>
                <span>We'll notify you when your order is ready</span>
              </li>
            </ul>
          </div>

          <div className="confirmation-actions">
            <Button variant="primary" onClick={() => navigate('/menu')}>
              Order More Treats
              <ArrowRight size={18} />
            </Button>
            {isAuthenticated ? (
              <Link to="/account" className="continue-link">
                View Your Orders
              </Link>
            ) : (
              <Link to="/" className="continue-link">
                Return to Home
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
