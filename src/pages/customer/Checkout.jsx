import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, CreditCard, Truck, ArrowLeft, Lock, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const {
    items,
    subtotal,
    tax,
    total,
    itemCount,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Review, 2: Details, 3: Payment
  const [formData, setFormData] = useState({
    // Contact info
    email: '',
    phone: '',
    // Delivery/Pickup
    orderType: 'pickup', // 'pickup' or 'delivery'
    // Pickup info
    pickupDate: '',
    pickupTime: '',
    // Delivery address
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    deliveryInstructions: '',
  });

  const [errors, setErrors] = useState({});

  // Pre-fill form with user data if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        firstName: user.firstName || prev.firstName,
        lastName: user.lastName || prev.lastName,
      }));
    }
  }, [isAuthenticated, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return '/placeholder-product.jpg';
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';

    if (!formData.phone) newErrors.phone = 'Phone number is required';

    if (formData.orderType === 'pickup') {
      if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
      if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
    } else {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.address) newErrors.address = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (validateStep2()) {
        setStep(3);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/menu');
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);

    try {
      // Call Stripe checkout endpoint
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/checkout/create-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.images?.[0] || null,
          })),
          // Transform to snake_case for backend API
          customer_info: {
            email: formData.email,
            phone: formData.phone,
            order_type: formData.orderType,
            customer_id: isAuthenticated && user ? user.id : null,
            first_name: formData.firstName,
            last_name: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`.trim() || user?.firstName && `${user.firstName} ${user.lastName}`.trim(),
            ...(formData.orderType === 'pickup'
              ? {
                  pickup_date: formData.pickupDate,
                  pickup_time: formData.pickupTime,
                }
              : {
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  address: formData.address,
                  apartment: formData.apartment,
                  city: formData.city,
                  state: formData.state,
                  zip_code: formData.zipCode,
                  delivery_instructions: formData.deliveryInstructions,
                }),
          },
        }),
      });

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('There was an error processing your order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate available pickup times
  const getPickupTimes = () => {
    const times = [];
    for (let hour = 7; hour <= 17; hour++) {
      const time = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      times.push(time);
      if (hour < 17) {
        const halfTime = hour > 12 ? `${hour - 12}:30 PM` : hour === 12 ? '12:30 PM' : `${hour}:30 AM`;
        times.push(halfTime);
      }
    }
    return times;
  };

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <ShoppingBag size={64} strokeWidth={1} />
          <h2>Your cart is empty</h2>
          <p>Add some delicious treats to get started!</p>
          <Button variant="primary" onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Progress Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Review</span>
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Details</span>
          </div>
          <div className="step-line" />
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-number">3</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        <div className="checkout-content">
          {/* Main Content */}
          <div className="checkout-main">
            {/* Step 1: Review Cart */}
            {step === 1 && (
              <div className="checkout-section">
                <h2>Review Your Order</h2>
                <div className="checkout-items">
                  {items.map((item) => (
                    <div key={item.id} className="checkout-item">
                      <div className="checkout-item-image">
                        <img src={getProductImage(item)} alt={item.name} />
                      </div>
                      <div className="checkout-item-details">
                        <h4>{item.name}</h4>
                        <p className="checkout-item-price">{formatPrice(item.price)} each</p>
                      </div>
                      <div className="checkout-item-quantity">
                        <button onClick={() => decrementQuantity(item.id)}>
                          <Minus size={16} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => incrementQuantity(item.id)}>
                          <Plus size={16} />
                        </button>
                      </div>
                      <div className="checkout-item-total">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button
                        className="checkout-item-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Contact & Delivery Details */}
            {step === 2 && (
              <div className="checkout-section">
                <h2>Contact Information</h2>
                <div className="form-row">
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    required
                  />
                </div>

                <h2 style={{ marginTop: '2rem' }}>Order Type</h2>
                <div className="order-type-options">
                  <label className={`order-type-option ${formData.orderType === 'pickup' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="pickup"
                      checked={formData.orderType === 'pickup'}
                      onChange={handleChange}
                    />
                    <ShoppingBag size={24} />
                    <span>Pickup</span>
                  </label>
                  <label className={`order-type-option ${formData.orderType === 'delivery' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="orderType"
                      value="delivery"
                      checked={formData.orderType === 'delivery'}
                      onChange={handleChange}
                    />
                    <Truck size={24} />
                    <span>Delivery</span>
                  </label>
                </div>

                {formData.orderType === 'pickup' && (
                  <>
                    <h3 style={{ marginTop: '1.5rem' }}>Pickup Details</h3>
                    <p className="pickup-address">
                      <strong>Pickup Location:</strong> 123 Baker Street, Llamaville, CA 90210
                    </p>
                    <div className="form-row">
                      <Input
                        label="Pickup Date"
                        type="date"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleChange}
                        error={errors.pickupDate}
                        min={getMinDate()}
                        required
                      />
                      <div className="input-wrapper">
                        <label className="input-label">Pickup Time *</label>
                        <select
                          name="pickupTime"
                          value={formData.pickupTime}
                          onChange={handleChange}
                          className={`input-field ${errors.pickupTime ? 'error' : ''}`}
                        >
                          <option value="">Select time</option>
                          {getPickupTimes().map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                        {errors.pickupTime && (
                          <span className="input-error">{errors.pickupTime}</span>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {formData.orderType === 'delivery' && (
                  <>
                    <h3 style={{ marginTop: '1.5rem' }}>Delivery Address</h3>
                    <div className="form-row">
                      <Input
                        label="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={errors.firstName}
                        required
                      />
                      <Input
                        label="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={errors.lastName}
                        required
                      />
                    </div>
                    <Input
                      label="Street Address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                      required
                    />
                    <Input
                      label="Apartment, suite, etc. (optional)"
                      name="apartment"
                      value={formData.apartment}
                      onChange={handleChange}
                    />
                    <div className="form-row form-row-3">
                      <Input
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                        required
                      />
                      <Input
                        label="State"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                        required
                      />
                      <Input
                        label="ZIP Code"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        error={errors.zipCode}
                        required
                      />
                    </div>
                    <div className="input-wrapper">
                      <label className="input-label">Delivery Instructions (optional)</label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleChange}
                        className="input-field"
                        rows={3}
                        placeholder="e.g., Ring doorbell, leave at door..."
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="checkout-section">
                <h2>Payment</h2>
                <div className="payment-info">
                  <div className="payment-secure">
                    <Lock size={20} />
                    <span>Secure payment powered by Stripe</span>
                  </div>
                  <p>
                    Click the button below to proceed to our secure payment page.
                    You'll be redirected to Stripe to complete your purchase.
                  </p>
                  <div className="payment-methods">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" height="30" />
                  </div>
                </div>

                <div className="order-summary-final">
                  <h3>Order Summary</h3>
                  {items.map((item) => (
                    <div key={item.id} className="summary-item">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="summary-divider" />
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Tax (8.5%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  {formData.orderType === 'delivery' && (
                    <div className="summary-row">
                      <span>Delivery Fee</span>
                      <span>$5.00</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>
                      {formatPrice(
                        total + (formData.orderType === 'delivery' ? 5 : 0)
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="checkout-nav">
              <button className="btn-back" onClick={handleBack}>
                <ArrowLeft size={18} />
                {step === 1 ? 'Continue Shopping' : 'Back'}
              </button>
              {step < 3 ? (
                <Button variant="primary" onClick={handleContinue}>
                  Continue
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    'Processing...'
                  ) : (
                    <>
                      <CreditCard size={18} />
                      Pay {formatPrice(total + (formData.orderType === 'delivery' ? 5 : 0))}
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="summary-items">
                {items.map((item) => (
                  <div key={item.id} className="summary-item">
                    <span className="summary-item-qty">{item.quantity}x</span>
                    <span className="summary-item-name">{item.name}</span>
                    <span className="summary-item-price">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal ({itemCount} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                {formData.orderType === 'delivery' && (
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span>$5.00</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>
                    {formatPrice(total + (formData.orderType === 'delivery' ? 5 : 0))}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
