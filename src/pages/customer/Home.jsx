import { Link } from 'react-router-dom';
import { ArrowRight, Star, Truck, Clock, Award } from 'lucide-react';
import { ImageSlider, ProductCard, Button } from '../../components/common';
import { useBakery } from '../../context/BakeryContext';
import './Home.css';

const Home = () => {
  const { featuredProducts, activePromotions, categories } = useBakery();

  // Get hero promotions for the slider (handle both camelCase and snake_case from backend)
  const heroPromotions = activePromotions.filter(
    (p) => (p.displayLocation || p.display_location) === 'homepage_hero'
  );

  // Transform promotions to slider format
  const heroSlides = heroPromotions.length > 0
    ? heroPromotions.map((promo) => ({
        id: promo.id,
        title: promo.title,
        subtitle: promo.subtitle,
        description: promo.description,
        buttonText: promo.buttonText || promo.button_text,
        buttonLink: promo.buttonLink || promo.button_link,
        image: promo.image,
        backgroundColor: promo.backgroundColor || promo.background_color,
        textColor: promo.textColor || promo.text_color,
      }))
    : [
        {
          id: 1,
          title: 'Welcome to Llama Treats',
          subtitle: 'Artisan Bakery',
          description: 'Handcrafted baked goods made with love and the finest ingredients.',
          buttonText: 'Explore Our Menu',
          buttonLink: '/menu',
          backgroundColor: '#f8e8d4',
          textColor: '#5c3d2e',
        },
      ];

  const features = [
    {
      icon: Star,
      title: 'Premium Quality',
      description: 'Made with the finest ingredients sourced locally and globally.',
    },
    {
      icon: Clock,
      title: 'Fresh Daily',
      description: 'Baked fresh every morning to ensure the best taste and texture.',
    },
    {
      icon: Truck,
      title: 'Local Delivery',
      description: 'Free delivery on orders over $35 within 10 miles.',
    },
    {
      icon: Award,
      title: 'Award Winning',
      description: 'Recognized for excellence in artisan baking since 2018.',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <ImageSlider
          slides={heroSlides}
          autoPlay={true}
          autoPlayInterval={6000}
          aspectRatio="21/9"
          className="hero-slider"
        />
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Featured Treats</h2>
              <p className="section-subtitle">Our most loved baked goods, handpicked for you</p>
            </div>
            <Link to="/menu" className="view-all-link">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          <div className="products-grid">
            {featuredProducts.slice(0, 4).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header center">
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find exactly what you're craving</p>
          </div>
          <div className="categories-grid">
            {categories.filter(c => c.active).slice(0, 6).map((category) => (
              <Link
                key={category.id}
                to={`/menu?category=${category.slug}`}
                className="category-card"
              >
                <div className="category-image">
                  {category.image ? (
                    <img src={category.image} alt={category.name} />
                  ) : (
                    <div className="category-placeholder">
                      <span>🍪</span>
                    </div>
                  )}
                </div>
                <h3 className="category-name">{category.name}</h3>
                <p className="category-description">{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="story-section">
        <div className="container">
          <div className="story-grid">
            <div className="story-images">
                <img className="story-image-placeholder" src="./llamaTreats.png" />
            </div>
            <div className="story-content">
              <h2 className="section-title">Our Story</h2>
              <p>
                Llama Treats Bakery started with a simple dream: to bring joy through
                delicious, handcrafted baked goods. Founded in 2018, we've grown from a
                small kitchen operation into a beloved local bakery.
              </p>
              <p>
                Every item we make is crafted with care, using traditional techniques
                passed down through generations, combined with our own creative touches.
                We believe that great baking starts with quality ingredients and ends
                with happy customers.
              </p>
              <Button variant="outline" icon={ArrowRight} iconPosition="right">
                <Link to="/about" style={{ color: 'inherit', textDecoration: 'none' }}>
                  Read More About Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay in the Loop</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter for exclusive deals, new product announcements,
              and baking tips delivered straight to your inbox.
            </p>
            <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email address"
                className="newsletter-input"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
