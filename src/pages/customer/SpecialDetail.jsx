import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Tag,
  Percent,
  Gift,
  Clock,
  ShoppingBag,
  Check,
  AlertTriangle,
  Copy,
  CheckCircle,
} from 'lucide-react';
import { useBakery } from '../../context/BakeryContext';
import { useCart } from '../../context/CartContext';
import { ProductCard, Loading, Button } from '../../components/common';
import './SpecialDetail.css';

const SpecialDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, loading: bakeryLoading } = useBakery();
  const { items: cartItems, addToCart } = useCart();

  const [special, setSpecial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [codeCopied, setCodeCopied] = useState(false);

  // Fetch the special details
  useEffect(() => {
    const fetchSpecial = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/specials/${id}`
        );
        if (!response.ok) {
          throw new Error('Special not found');
        }
        const data = await response.json();
        setSpecial(data.special);
      } catch (err) {
        console.error('Error fetching special:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecial();
  }, [id]);

  // Get buy and get products for buy_x_get_y promos
  const { buyProducts, getProducts, isTwoPartPromo } = useMemo(() => {
    if (!special || !products.length) {
      return { buyProducts: [], getProducts: [], isTwoPartPromo: false };
    }

    const value = special.value || {};
    const buyCategoryIds = value.buy_category_ids || value.buyCategoryIds || [];
    const buyProductIds = value.buy_product_ids || value.buyProductIds || [];
    const getCategoryIds = value.get_category_ids || value.getCategoryIds || [];
    const getProductIds = value.get_product_ids || value.getProductIds || [];

    // Check if this is a two-part promo (separate buy and get categories)
    const hasSeparateBuyGet = buyCategoryIds.length > 0 || buyProductIds.length > 0 ||
                              getCategoryIds.length > 0 || getProductIds.length > 0;

    if (special.type === 'buy_x_get_y' && hasSeparateBuyGet) {
      // Get buy products
      let buyProds = [];
      if (buyProductIds.length > 0) {
        buyProds = products.filter((p) => buyProductIds.includes(p.id) && p.active);
      } else if (buyCategoryIds.length > 0) {
        buyProds = products.filter((p) => {
          const pCategoryId = p.category_id || p.categoryId;
          return buyCategoryIds.includes(pCategoryId) && p.active;
        });
      }

      // Get free products
      let getProds = [];
      if (getProductIds.length > 0) {
        getProds = products.filter((p) => getProductIds.includes(p.id) && p.active);
      } else if (getCategoryIds.length > 0) {
        getProds = products.filter((p) => {
          const pCategoryId = p.category_id || p.categoryId;
          return getCategoryIds.includes(pCategoryId) && p.active;
        });
      }

      return { buyProducts: buyProds, getProducts: getProds, isTwoPartPromo: true };
    }

    return { buyProducts: [], getProducts: [], isTwoPartPromo: false };
  }, [special, products]);

  // Get qualifying products for this special (fallback for non two-part promos)
  const qualifyingProducts = useMemo(() => {
    if (!special || !products.length || isTwoPartPromo) return [];

    const productIds = special.product_ids || special.productIds || [];
    const categoryIds = special.category_ids || special.categoryIds || [];

    if (productIds.length > 0) {
      return products.filter((p) => productIds.includes(p.id) && p.active);
    }

    if (categoryIds.length > 0) {
      return products.filter((p) => {
        const pCategoryId = p.category_id || p.categoryId;
        return categoryIds.includes(pCategoryId) && p.active;
      });
    }

    // If no specific products/categories, all active products qualify
    return products.filter((p) => p.active);
  }, [special, products, isTwoPartPromo]);

  // Calculate buy items in cart (for two-part promos)
  const buyCartInfo = useMemo(() => {
    if (!special || !cartItems.length || !isTwoPartPromo) return { count: 0, items: [] };

    const buyIds = buyProducts.map((p) => p.id);
    const buyItems = cartItems.filter((item) => buyIds.includes(item.id));
    const count = buyItems.reduce((sum, item) => sum + item.quantity, 0);

    return { count, items: buyItems };
  }, [special, cartItems, buyProducts, isTwoPartPromo]);

  // Calculate qualifying items in cart (for non two-part promos)
  const qualifyingCartInfo = useMemo(() => {
    if (!special || !cartItems.length || isTwoPartPromo) return { count: 0, items: [] };

    const qualifyingIds = qualifyingProducts.map((p) => p.id);
    const qualifyingItems = cartItems.filter((item) => qualifyingIds.includes(item.id));
    const count = qualifyingItems.reduce((sum, item) => sum + item.quantity, 0);

    return { count, items: qualifyingItems };
  }, [special, cartItems, qualifyingProducts, isTwoPartPromo]);

  // Get category names for display
  const categoryNames = useMemo(() => {
    if (!special || !categories.length) return { buyCategories: [], getCategories: [] };

    const value = special.value || {};
    const buyCategoryIds = value.buy_category_ids || value.buyCategoryIds || [];
    const getCategoryIds = value.get_category_ids || value.getCategoryIds || [];

    const buyCategories = categories
      .filter((c) => buyCategoryIds.includes(c.id))
      .map((c) => c.name);
    const getCategories = categories
      .filter((c) => getCategoryIds.includes(c.id))
      .map((c) => c.name);

    return { buyCategories, getCategories };
  }, [special, categories]);

  // Get special type info
  const getSpecialInfo = () => {
    if (!special) return null;

    const value = special.value;
    const minPurchase = special.min_purchase || special.minPurchase;

    switch (special.type) {
      case 'discount_percentage':
        return {
          icon: Percent,
          label: `${typeof value === 'object' ? value.percentage || value : value}% OFF`,
          description: minPurchase
            ? `Get ${value}% off when you spend $${minPurchase} or more on qualifying items.`
            : `Get ${value}% off on all qualifying items.`,
          requirement: minPurchase ? `Minimum purchase: $${minPurchase}` : null,
        };

      case 'buy_x_get_y': {
        const buyQty = value?.buy_quantity || value?.buyQuantity || 1;
        const getQty = value?.get_quantity || value?.getQuantity || 1;

        // Use buyCartInfo for two-part promos, qualifyingCartInfo for simple promos
        const progress = isTwoPartPromo ? buyCartInfo.count : qualifyingCartInfo.count;
        const remaining = Math.max(0, buyQty - progress);

        // Build description based on whether it's a two-part promo
        let description = `Add ${buyQty} qualifying items to your cart and get ${getQty} item(s) FREE at checkout!`;
        if (isTwoPartPromo && categoryNames.buyCategories.length > 0 && categoryNames.getCategories.length > 0) {
          description = `Buy ${buyQty} ${categoryNames.buyCategories.join(' or ')} and get ${getQty} FREE ${categoryNames.getCategories.join(' or ')}!`;
        }

        return {
          icon: Gift,
          label: `Buy ${buyQty}, Get ${getQty} Free`,
          description,
          requirement: isTwoPartPromo
            ? `Purchase ${buyQty} ${categoryNames.buyCategories.join(' or ') || 'qualifying item(s)'}`
            : `${buyQty} qualifying items required`,
          progress: {
            current: progress,
            required: buyQty,
            remaining,
            message:
              remaining > 0
                ? isTwoPartPromo
                  ? `Add ${remaining} more ${categoryNames.buyCategories.join(' or ') || 'item(s)'} to qualify!`
                  : `Add ${remaining} more item(s) to qualify!`
                : `You qualify for ${getQty} FREE ${categoryNames.getCategories.join(' or ') || 'item(s)'}!`,
          },
          isTwoPartPromo,
        };
      }

      case 'bundle_discount': {
        const discountValue = typeof value === 'object' ? value.discount || value.amount : value;
        return {
          icon: Tag,
          label: `$${discountValue} OFF Bundle`,
          description: `Save $${discountValue} when you purchase a bundle of qualifying items.`,
          requirement: minPurchase ? `Minimum purchase: $${minPurchase}` : null,
        };
      }

      case 'fixed_price': {
        const price = typeof value === 'object' ? value.price || value : value;
        return {
          icon: Tag,
          label: `Special Price: $${price}`,
          description: `Get qualifying items at the special price of $${price}!`,
          requirement: null,
        };
      }

      default:
        return {
          icon: Tag,
          label: 'Special Offer',
          description: special.description || 'Check out this special deal!',
          requirement: null,
        };
    }
  };

  const specialInfo = getSpecialInfo();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleCopyCode = () => {
    if (special?.code) {
      navigator.clipboard.writeText(special.code);
      setCodeCopied(true);
      setTimeout(() => setCodeCopied(false), 2000);
    }
  };

  if (loading || bakeryLoading) {
    return <Loading fullScreen text="Loading special..." />;
  }

  if (error || !special) {
    return (
      <div className="special-detail-page">
        <div className="container">
          <div className="special-not-found">
            <AlertTriangle size={64} />
            <h1>Special Not Found</h1>
            <p>Sorry, we couldn't find this special offer. It may have expired or been removed.</p>
            <Link to="/specials" className="btn-back-to-specials">
              <ArrowLeft size={18} />
              Back to Specials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const Icon = specialInfo?.icon || Tag;
  const endDate = special.end_date || special.endDate;

  return (
    <div className="special-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/specials">Specials</Link>
          <span>/</span>
          <span className="current">{special.name}</span>
        </nav>

        {/* Special Header */}
        <div className="special-header">
          <div className="special-header-content">
            <div className="special-icon">
              <Icon size={32} />
            </div>
            <div className="special-badge">{specialInfo?.label}</div>
            <h1 className="special-title">{special.name}</h1>
            <p className="special-description">
              {specialInfo?.description || special.description}
            </p>

            <div className="special-meta">
              <div className="special-expires">
                <Clock size={16} />
                <span>Offer ends {formatDate(endDate)}</span>
              </div>

              {special.code && (
                <div className="special-code-wrapper">
                  <span className="code-label">Use code at checkout:</span>
                  <button className="special-code" onClick={handleCopyCode}>
                    <span>{special.code}</span>
                    {codeCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                  </button>
                  {codeCopied && <span className="copied-msg">Copied!</span>}
                </div>
              )}
            </div>

            {/* Progress for buy_x_get_y */}
            {specialInfo?.progress && (
              <div className="special-progress">
                <div className="progress-header">
                  <span className="progress-label">Your Progress</span>
                  <span className="progress-count">
                    {specialInfo.progress.current} / {specialInfo.progress.required}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${Math.min(100, (specialInfo.progress.current / specialInfo.progress.required) * 100)}%`,
                    }}
                  />
                </div>
                <p
                  className={`progress-message ${specialInfo.progress.remaining === 0 ? 'success' : ''}`}
                >
                  {specialInfo.progress.remaining === 0 && <Check size={16} />}
                  {specialInfo.progress.message}
                </p>
                {specialInfo.progress.remaining === 0 && (
                  <Button
                    variant="primary"
                    onClick={() => navigate('/checkout')}
                    className="go-to-checkout-btn"
                  >
                    <ShoppingBag size={18} />
                    Go to Checkout
                  </Button>
                )}
              </div>
            )}
          </div>

          {special.image && (
            <div className="special-header-image">
              <img src={special.image} alt={special.name} />
            </div>
          )}
        </div>

        {/* Two-Part Promo: Buy Products Section */}
        {isTwoPartPromo && (
          <>
            <section className="qualifying-products buy-products-section">
              <div className="section-header">
                <span className="step-badge">Step 1</span>
                <h2 className="section-title">
                  Buy {categoryNames.buyCategories.join(' or ') || 'Qualifying Items'}
                </h2>
                <p className="section-subtitle">
                  Add {special.value?.buy_quantity || special.value?.buyQuantity || 1} item(s) from this section to your cart
                </p>
              </div>
              {buyProducts.length > 0 ? (
                <div className="products-grid">
                  {buyProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <ShoppingBag size={48} />
                  <p>No products available in this category</p>
                </div>
              )}
            </section>

            <section className="qualifying-products get-products-section">
              <div className="section-header">
                <span className="step-badge step-badge-free">Step 2</span>
                <h2 className="section-title">
                  Get FREE {categoryNames.getCategories.join(' or ') || 'Items'}
                </h2>
                <p className="section-subtitle">
                  {specialInfo?.progress?.remaining === 0
                    ? `You'll get ${special.value?.get_quantity || special.value?.getQuantity || 1} item(s) FREE from this section!`
                    : `Complete Step 1 to choose your ${special.value?.get_quantity || special.value?.getQuantity || 1} FREE item(s)`}
                </p>
              </div>
              {getProducts.length > 0 ? (
                <div className={`products-grid ${specialInfo?.progress?.remaining > 0 ? 'dimmed' : ''}`}>
                  {getProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="no-products">
                  <Gift size={48} />
                  <p>Free items will be selected at checkout</p>
                </div>
              )}
            </section>
          </>
        )}

        {/* Regular Qualifying Products (non two-part promos) */}
        {!isTwoPartPromo && (
          <section className="qualifying-products">
            <h2 className="section-title">
              {qualifyingProducts.length > 0
                ? 'Qualifying Items'
                : 'Browse Our Products'}
            </h2>
            {qualifyingProducts.length > 0 ? (
              <div className="products-grid">
                {qualifyingProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <ShoppingBag size={48} />
                <p>All products qualify for this special!</p>
                <Button onClick={() => navigate('/menu')}>Browse Menu</Button>
              </div>
            )}
          </section>
        )}

        {/* Cart Summary for two-part promo */}
        {isTwoPartPromo && buyCartInfo.count > 0 && (
          <div className="special-cart-summary">
            <h3>
              <ShoppingBag size={20} />
              {categoryNames.buyCategories.join(' / ') || 'Qualifying Items'} in Your Cart
            </h3>
            <div className="cart-items-list">
              {buyCartInfo.items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <span className="cart-item-qty">{item.quantity}x</span>
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="cart-summary-footer">
              <span>
                {buyCartInfo.count} / {special.value?.buy_quantity || special.value?.buyQuantity || 1} required item(s) in cart
              </span>
              {specialInfo?.progress?.remaining === 0 && (
                <Button variant="primary" onClick={() => navigate('/checkout')}>
                  Proceed to Select Free Items
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Cart Summary for regular promo */}
        {!isTwoPartPromo && qualifyingCartInfo.count > 0 && (
          <div className="special-cart-summary">
            <h3>
              <ShoppingBag size={20} />
              Qualifying Items in Your Cart
            </h3>
            <div className="cart-items-list">
              {qualifyingCartInfo.items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <span className="cart-item-qty">{item.quantity}x</span>
                  <span className="cart-item-name">{item.name}</span>
                  <span className="cart-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="cart-summary-footer">
              <span>
                {qualifyingCartInfo.count} qualifying item(s) in cart
              </span>
              <Button variant="primary" onClick={() => navigate('/checkout')}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpecialDetail;
