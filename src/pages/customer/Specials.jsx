import { Link, useNavigate } from 'react-router-dom';
import { Tag, Percent, Gift, Calendar, Clock, ArrowRight, ShoppingBag } from 'lucide-react';
import { Button, ProductCard } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './Specials.css';

const Specials = () => {
  const navigate = useNavigate();
  const { activeSpecials, activePromotions, products } = useBakery();

  const getSpecialIcon = (type) => {
    switch (type) {
      case 'discount_percentage':
        return Percent;
      case 'buy_x_get_y':
        return Gift;
      case 'bundle_discount':
        return Tag;
      default:
        return Tag;
    }
  };

  const getSpecialLabel = (special) => {
    // Handle value being either a primitive or an object (from JSONB)
    const value = special.value;

    switch (special.type) {
      case 'discount_percentage':
        // value is a number (e.g., 20 for 20% off)
        return `${typeof value === 'object' ? value.percentage || value : value}% OFF`;
      case 'buy_x_get_y':
        // value is { buyQuantity/buy_quantity, getQuantity/get_quantity }
        if (typeof value === 'object') {
          const buyQty = value.buyQuantity || value.buy_quantity;
          const getQty = value.getQuantity || value.get_quantity;
          if (buyQty && getQty) {
            return `Buy ${buyQty}, Get ${getQty} Free`;
          }
        }
        return 'Buy More, Get Free';
      case 'bundle_discount':
        // value is { freeItem, freeQuantity, minPurchase } or a discount amount
        if (typeof value === 'object') {
          if (value.freeItem || value.free_item) {
            return `Free ${value.freeQuantity || value.free_quantity || ''} ${value.freeItem || value.free_item}`;
          }
          return `$${value.discount || value.amount || 0} OFF Bundle`;
        }
        return `$${value} OFF Bundle`;
      case 'fixed_price':
        // value is a number (the special price)
        return `Special Price: $${typeof value === 'object' ? value.price || value : value}`;
      default:
        return 'Special Offer';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Get products that are on special (handle both camelCase and snake_case)
  const specialProducts = products.filter((product) =>
    activeSpecials.some((special) => {
      const productIds = special.productIds || special.product_ids || [];
      return productIds.includes(product.id);
    })
  );

  return (
    <div className="specials-page">
      {/* Header */}
      <section className="specials-hero">
        <div className="container">
          <h1 className="specials-title">Specials & Deals</h1>
          <p className="specials-subtitle">
            Discover our current promotions and save on your favorite treats.
            Don't miss out on these limited-time offers!
          </p>
        </div>
      </section>

      {/* Active Promotions */}
      {activePromotions.length > 0 && (
        <section className="promotions-section">
          <div className="container">
            <h2 className="section-title">Current Promotions</h2>
            <div className="promotions-grid">
              {activePromotions.map((promo) => {
                const bgColor = promo.backgroundColor || promo.background_color || '#f8e8d4';
                const txtColor = promo.textColor || promo.text_color || '#5c3d2e';
                const endDate = promo.endDate || promo.end_date;
                const btnText = promo.buttonText || promo.button_text;
                const btnLink = promo.buttonLink || promo.button_link || '/menu';

                return (
                  <div
                    key={promo.id}
                    className="promo-card"
                    style={{
                      backgroundColor: bgColor,
                      color: txtColor,
                    }}
                  >
                    <div className="promo-content">
                      {promo.subtitle && (
                        <span className="promo-label">{promo.subtitle}</span>
                      )}
                      <h3 className="promo-title">{promo.title}</h3>
                      {promo.description && (
                        <p className="promo-description">{promo.description}</p>
                      )}
                      <div className="promo-footer">
                        <div className="promo-dates">
                          <Calendar size={14} />
                          <span>
                            Until {formatDate(endDate)}
                          </span>
                        </div>
                        {btnText && (
                          <a href={btnLink} className="promo-button">
                            {btnText}
                          </a>
                        )}
                      </div>
                    </div>
                    {promo.image && (
                      <div className="promo-image">
                        <img src={promo.image} alt={promo.title} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Active Specials */}
      {activeSpecials.length > 0 && (
        <section className="deals-section">
          <div className="container">
            <h2 className="section-title">Current Deals</h2>
            <div className="deals-grid">
              {activeSpecials.map((special) => {
                const Icon = getSpecialIcon(special.type);
                const endDate = special.endDate || special.end_date;
                const minPurchase = special.minPurchase || special.min_purchase;
                const hasQualifyingProducts = (special.product_ids?.length > 0) || (special.category_ids?.length > 0);

                return (
                  <Link
                    key={special.id}
                    to={`/specials/${special.id}`}
                    className="deal-card deal-card-link"
                  >
                    <div className="deal-icon">
                      <Icon size={28} />
                    </div>
                    <div className="deal-badge">{getSpecialLabel(special)}</div>
                    <h3 className="deal-name">{special.name}</h3>
                    <p className="deal-description">{special.description}</p>
                    <div className="deal-meta">
                      <div className="deal-date">
                        <Clock size={14} />
                        <span>Ends {formatDate(endDate)}</span>
                      </div>
                      {special.code && (
                        <div className="deal-code">
                          <span>Code: <strong>{special.code}</strong></span>
                        </div>
                      )}
                      {minPurchase && (
                        <div className="deal-min">
                          Min. purchase: ${minPurchase}
                        </div>
                      )}
                    </div>
                    {hasQualifyingProducts && (
                      <div className="deal-cta">
                        <span>Shop qualifying items</span>
                        <ArrowRight size={16} />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products on Special */}
      {specialProducts.length > 0 && (
        <section className="special-products-section">
          <div className="container">
            <h2 className="section-title">Items on Special</h2>
            <div className="products-grid">
              {specialProducts.slice(0, 4).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="newsletter-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Never Miss a Deal</h2>
            <p>
              Subscribe to our newsletter to receive exclusive offers, early access
              to new products, and special member-only discounts.
            </p>
            <form className="cta-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="cta-input"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>

      {/* Empty State */}
      {activeSpecials.length === 0 && activePromotions.length === 0 && (
        <section className="empty-specials">
          <div className="container">
            <div className="empty-content">
              <Tag size={64} />
              <h2>No Active Specials</h2>
              <p>
                Check back soon for new deals and promotions. In the meantime,
                explore our full menu of delicious treats!
              </p>
              <Button>
                <a href="/menu" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Browse Menu
                </a>
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Specials;
