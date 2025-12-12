import { useState } from 'react';
import { ShoppingBag, Heart, Eye, Plus, Minus, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({
  product,
  onViewDetails,
  onToggleFavorite,
  showQuickActions = true,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const { addToCart, isInCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    onToggleFavorite?.(product, !isFavorite);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setShowAddedFeedback(true);
    setTimeout(() => setShowAddedFeedback(false), 1500);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    incrementQuantity(product.id);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    decrementQuantity(product.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(product);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const hasImage = product.images?.length > 0 && !imageError;
  const mainImage = hasImage ? product.images[0] : null;
  const inCart = isInCart(product.id);
  const quantity = getItemQuantity(product.id);

  return (
    <div
      className={`product-card ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleViewDetails}
    >
      <div className="product-card-image">
        {hasImage ? (
          <img
            src={mainImage}
            alt={product.name}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="product-card-placeholder">
            <ShoppingBag size={48} />
            <span>Image Coming Soon</span>
          </div>
        )}

        {product.featured && (
          <span className="product-badge product-badge-featured">Featured</span>
        )}

        {product.discount && (
          <span className="product-badge product-badge-sale">
            {product.discount}% OFF
          </span>
        )}

        {showQuickActions && (
          <div className={`product-card-actions ${isHovered ? 'visible' : ''}`}>
            <button
              className={`action-btn favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              title="Add to favorites"
            >
              <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              className="action-btn view-btn"
              onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
              title="View details"
            >
              <Eye size={18} />
            </button>
            {!inCart ? (
              <button
                className={`action-btn cart-btn ${showAddedFeedback ? 'added' : ''}`}
                onClick={handleAddToCart}
                title="Add to cart"
              >
                {showAddedFeedback ? <Check size={18} /> : <ShoppingBag size={18} />}
              </button>
            ) : (
              <div className="action-btn cart-qty-control" onClick={(e) => e.stopPropagation()}>
                <button onClick={handleDecrement} className="qty-minus">
                  <Minus size={14} />
                </button>
                <span className="qty-display">{quantity}</span>
                <button onClick={handleIncrement} className="qty-plus">
                  <Plus size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Feedback overlay */}
        {showAddedFeedback && (
          <div className="added-feedback">
            <Check size={24} />
            <span>Added!</span>
          </div>
        )}
      </div>

      <div className="product-card-content">
        <h3 className="product-card-name">{product.name}</h3>
        <p className="product-card-description">{product.description}</p>
        <div className="product-card-footer">
          <span className="product-card-price">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="product-card-original-price">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
        {product.allergens && product.allergens.length > 0 && (
          <div className="product-card-allergens">
            {product.allergens.slice(0, 3).map((allergen) => (
              <span key={allergen} className="allergen-tag">
                {allergen}
              </span>
            ))}
          </div>
        )}

        {/* Quick add to cart button at bottom */}
        <button
          className={`product-add-btn ${inCart ? 'in-cart' : ''}`}
          onClick={inCart ? (e) => e.stopPropagation() : handleAddToCart}
        >
          {inCart ? (
            <>
              <Check size={16} />
              In Cart ({quantity})
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
