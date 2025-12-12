import { Tag, Percent, Gift, Calendar, Clock } from 'lucide-react';
import { Button, ProductCard } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './Specials.css';

const Specials = () => {
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
        // value is { buyQuantity, getQuantity }
        if (typeof value === 'object' && value.buyQuantity && value.getQuantity) {
          return `Buy ${value.buyQuantity}, Get ${value.getQuantity} Free`;
        }
        return 'Buy More, Get Free';
      case 'bundle_discount':
        // value is { freeItem, freeQuantity, minPurchase } or a discount amount
        if (typeof value === 'object') {
          if (value.freeItem) {
            return `Free ${value.freeQuantity || ''} ${value.freeItem}`;
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

  // Get products that are on special
  const specialProducts = products.filter((product) =>
    activeSpecials.some((special) =>
      special.productIds?.includes(product.id)
    )
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
              {activePromotions.map((promo) => (
                <div
                  key={promo.id}
                  className="promo-card"
                  style={{
                    backgroundColor: promo.backgroundColor || '#f8e8d4',
                    color: promo.textColor || '#5c3d2e',
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
                          Until {formatDate(promo.endDate)}
                        </span>
                      </div>
                      {promo.buttonText && (
                        <a href={promo.buttonLink || '/menu'} className="promo-button">
                          {promo.buttonText}
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
              ))}
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
                return (
                  <div key={special.id} className="deal-card">
                    <div className="deal-icon">
                      <Icon size={28} />
                    </div>
                    <div className="deal-badge">{getSpecialLabel(special)}</div>
                    <h3 className="deal-name">{special.name}</h3>
                    <p className="deal-description">{special.description}</p>
                    <div className="deal-meta">
                      <div className="deal-date">
                        <Clock size={14} />
                        <span>Ends {formatDate(special.endDate)}</span>
                      </div>
                      {special.code && (
                        <div className="deal-code">
                          <span>Code: <strong>{special.code}</strong></span>
                        </div>
                      )}
                      {special.minPurchase && (
                        <div className="deal-min">
                          Min. purchase: ${special.minPurchase}
                        </div>
                      )}
                    </div>
                  </div>
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
                  onViewDetails={() => {}}
                  onAddToCart={() => {}}
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
