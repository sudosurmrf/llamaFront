import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useBakery } from '../../context/BakeryContext';
import { useCart } from '../../context/CartContext';
import { useFavorites } from '../../context/FavoritesContext';
import { Loading } from '../../components/common';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, categories, loading } = useBakery();
  const { addToCart, isInCart, getItemQuantity, incrementQuantity, decrementQuantity } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showAddedFeedback, setShowAddedFeedback] = useState(false);

  const product = products.find((p) => p.id === parseInt(id));
  const category = product ? categories.find((c) => c.id === product.categoryId) : null;
  const inCart = product ? isInCart(product.id) : false;
  const cartQuantity = product ? getItemQuantity(product.id) : 0;
  const favorite = product ? isFavorite(product.id) : false;

  // Related products (same category, excluding current)
  const relatedProducts = product
    ? products
        .filter((p) => p.categoryId === product.categoryId && p.id !== product.id && p.active)
        .slice(0, 4)
    : [];

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      setShowAddedFeedback(true);
      setTimeout(() => setShowAddedFeedback(false), 2000);
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      toggleFavorite(product);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  if (loading) {
    return <Loading fullScreen text="Loading product..." />;
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="container">
          <div className="product-not-found">
            <AlertTriangle size={64} />
            <h1>Product Not Found</h1>
            <p>Sorry, we couldn't find the product you're looking for.</p>
            <Link to="/menu" className="btn-back-to-menu">
              <ArrowLeft size={18} />
              Back to Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasImages = product.images && product.images.length > 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/menu">Menu</Link>
          {category && (
            <>
              <span>/</span>
              <Link to={`/menu?category=${category.slug}`}>{category.name}</Link>
            </>
          )}
          <span>/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="product-detail-content">
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="gallery-main">
              {hasImages ? (
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="main-image"
                />
              ) : (
                <div className="image-placeholder">
                  <ShoppingBag size={64} />
                  <span>Image Coming Soon</span>
                </div>
              )}
              {product.featured && (
                <span className="product-badge featured">Featured</span>
              )}
            </div>
            {hasImages && product.images.length > 1 && (
              <div className="gallery-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${index === selectedImage ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-header">
              <h1 className="product-title">{product.name}</h1>
              <button
                className={`favorite-btn ${favorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                title={favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={24} fill={favorite ? 'currentColor' : 'none'} />
              </button>
            </div>

            {category && (
              <Link to={`/menu?category=${category.slug}`} className="product-category">
                {category.name}
              </Link>
            )}

            <div className="product-price">
              {formatPrice(product.price)}
            </div>

            <p className="product-description">{product.description}</p>

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="product-allergens">
                <h4>Allergens:</h4>
                <div className="allergen-tags">
                  {product.allergens.map((allergen) => (
                    <span key={allergen} className="allergen-tag">
                      {allergen}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="product-ingredients">
                <h4>Ingredients:</h4>
                <p>{product.ingredients.join(', ')}</p>
              </div>
            )}

            {/* Add to Cart */}
            <div className="product-actions">
              {!inCart ? (
                <>
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <button
                    className={`btn-add-to-cart ${showAddedFeedback ? 'added' : ''}`}
                    onClick={handleAddToCart}
                  >
                    {showAddedFeedback ? (
                      <>
                        <Check size={20} />
                        Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} />
                        Add to Cart - {formatPrice(product.price * quantity)}
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="in-cart-controls">
                  <div className="quantity-selector">
                    <button
                      className="qty-btn"
                      onClick={() => decrementQuantity(product.id)}
                    >
                      <Minus size={18} />
                    </button>
                    <span className="qty-value">{cartQuantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => incrementQuantity(product.id)}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  <div className="cart-status">
                    <Check size={18} />
                    <span>{cartQuantity} in cart</span>
                  </div>
                  <button
                    className="btn-view-cart"
                    onClick={() => navigate('/checkout')}
                  >
                    View Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="related-products">
            <h2>You May Also Like</h2>
            <div className="related-grid">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  to={`/product/${relatedProduct.id}`}
                  className="related-card"
                >
                  <div className="related-image">
                    {relatedProduct.images?.[0] ? (
                      <img src={relatedProduct.images[0]} alt={relatedProduct.name} />
                    ) : (
                      <div className="related-placeholder">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>
                  <div className="related-info">
                    <h4>{relatedProduct.name}</h4>
                    <span className="related-price">{formatPrice(relatedProduct.price)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
