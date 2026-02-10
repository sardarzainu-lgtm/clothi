import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaShippingFast, FaUndo, FaHeadset, FaQuoteLeft, FaChevronDown, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { SkeletonProductList } from '../components/SkeletonLoader';
import TrustBadges from '../components/TrustBadges';
import ProductCard from '../components/ProductCard';
import heroImageDefault from '../assets/hero-image.jpg';
import { getImageUrl } from '../utils/imageUtils';

const Home = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [heroImage, setHeroImage] = useState(heroImageDefault);
  const [heroHeading, setHeroHeading] = useState('RAMZAN SALE');
  const [heroDescription, setHeroDescription] = useState('Get up to **30% off** on new arrivals. Discover premium fashion that defines your style.');
  const { addToWishlist, removeFromWishlist, isInWishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();

  // Hide navbar and prevent background scrolling when quick view modal is open
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
      if (quickViewProduct) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
    }
    
    // Prevent background scrolling when modal is open
    if (quickViewProduct) {
      // Save current scroll position
      const scrollY = window.scrollY;
      // Save original padding values
      const originalPaddingTop = document.body.style.paddingTop || getComputedStyle(document.body).paddingTop;
      const originalPaddingRight = document.body.style.paddingRight || getComputedStyle(document.body).paddingRight;
      
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      document.body.style.paddingTop = '0'; // Remove padding-top to prevent white space
      // Save original padding-right to prevent layout shift
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
      
      // Restore scroll position when modal closes
      return () => {
        if (navbar) {
          navbar.classList.remove('navbar-hidden');
        }
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        document.body.style.paddingTop = originalPaddingTop; // Restore original padding-top
        document.body.style.paddingRight = originalPaddingRight; // Restore original padding-right
        window.scrollTo(0, scrollY);
      };
    } else {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingTop = '';
      document.body.style.paddingRight = '';
    }
    
    // Cleanup on unmount
    return () => {
      if (navbar) {
        navbar.classList.remove('navbar-hidden');
      }
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.style.overflow = '';
      document.body.style.paddingTop = '';
      document.body.style.paddingRight = '';
    };
  }, [quickViewProduct]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get('/api/settings');
        if (data) {
          if (data.heroImage) {
            setHeroImage(data.heroImage);
          }
          if (data.heroHeading) {
            setHeroHeading(data.heroHeading);
          }
          if (data.heroDescription) {
            setHeroDescription(data.heroDescription);
          }
        }
      } catch (error) {
        console.warn('Error fetching settings, using default values:', error);
        // Keep default values if settings fetch fails
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        
        console.log('Home: Products fetched:', data.length, 'products');

        if (!data || data.length === 0) {
          console.warn('Home: No products found in database');
          setFeaturedProducts([]);
          setLoading(false);
          return;
        }

        // Get one product from each category
        const categories = ['Men', 'Women', 'Kids'];
        const featured = [];

        for (const category of categories) {
          const categoryProduct = data.find(p => p.category === category);
          if (categoryProduct) {
            // Fetch rating for this product
            try {
              const { data: ratingData } = await axios.get(`/api/products/${categoryProduct._id}/rating`);
              featured.push({
                ...categoryProduct,
                rating: ratingData.averageRating || 0,
                numReviews: ratingData.reviewCount || 0
              });
            } catch (error) {
              console.warn(`Home: Failed to fetch rating for product ${categoryProduct._id}:`, error.message);
              featured.push({ ...categoryProduct, rating: 0, numReviews: 0 });
            }
          }
        }

        console.log('Home: Featured products:', featured.length);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Home: Error fetching products:', error);
        console.error('Home: Error details:', error.response?.data || error.message);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section fade-in" style={{ backgroundImage: `linear-gradient(135deg, rgba(107, 114, 128, 0.85) 0%, rgba(156, 163, 175, 0.8) 50%, rgba(75, 85, 99, 0.85) 100%), url(${heroImage})` }}>
        <div className="hero-particles"></div>
        <div className="hero-content">
          <h1 className="hero-title">
            {heroHeading}
          </h1>
          <p className="hero-subtitle">
            {heroDescription.split('**').map((part, index) => 
              index % 2 === 1 ? (
                <strong key={index} className="hero-highlight">{part}</strong>
              ) : (
                part
              )
            )}
          </p>
          <Link 
            to="/shop" 
            className="btn btn-primary btn-xl btn-ripple hero-cta"
          >
            Shop Now →
          </Link>
          <div className="hero-trust-badges">
            <span>✓ Free Shipping</span>
            <span>✓ 30-Day Returns</span>
            <span>✓ Secure Payment</span>
          </div>
        </div>
        <div className="scroll-indicator">
          <span>Scroll</span>
          <FaChevronDown />
      </div>
      </section>

      <div className="container">

        {/* Shop by Category Section */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title gradient-text">Shop by Category</h2>
            <p className="section-subtitle">Explore our curated collections</p>
        </div>
          <div className="fashion-category-grid">
            <Link to="/shop?category=Men" className="fashion-category-card" aria-label="Browse Men's Collection">
              <div className="fashion-category-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=500&auto=format&fit=crop"
                  alt="Men's Collection"
                  className="fashion-category-image"
                />
                <div className="fashion-category-overlay"></div>
              </div>
              <div className="fashion-category-content">
                <h3 className="fashion-category-title">Men</h3>
                <span className="fashion-category-link">Shop Now →</span>
            </div>
          </Link>
            <Link to="/shop?category=Women" className="fashion-category-card" aria-label="Browse Women's Collection">
              <div className="fashion-category-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop"
                  alt="Women's Collection"
                  className="fashion-category-image"
                />
                <div className="fashion-category-overlay"></div>
              </div>
              <div className="fashion-category-content">
                <h3 className="fashion-category-title">Women</h3>
                <span className="fashion-category-link">Shop Now →</span>
            </div>
          </Link>
            <Link to="/shop?category=Kids" className="fashion-category-card" aria-label="Browse Kids' Collection">
              <div className="fashion-category-image-wrapper">
            <img
              src="https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=500&auto=format&fit=crop"
                  alt="Kids' Collection"
                  className="fashion-category-image"
                />
                <div className="fashion-category-overlay"></div>
              </div>
              <div className="fashion-category-content">
                <h3 className="fashion-category-title">Kids</h3>
                <span className="fashion-category-link">Shop Now →</span>
            </div>
          </Link>
        </div>
        </section>

        {/* Featured Products - One from each category */}
        <section className="section">
          <div className="section-header">
            <h2 className="section-title gradient-text">Featured Products</h2>
            <p className="section-subtitle">Discover our handpicked selection from each collection</p>
        </div>
          {loading ? (
            <SkeletonProductList count={3} />
          ) : (
            <div className="fashion-product-grid">
          {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onQuickView={(product) => setQuickViewProduct(product)}
                  onAddToWishlist={(product) => {
                    if (isInWishlist(product._id)) {
                      removeFromWishlist(product._id);
                      showToast('Removed from wishlist', 'success');
                    } else {
                      addToWishlist(product);
                      showToast('Added to wishlist', 'success');
                    }
                  }}
                  onAddToCart={(product, qty) => {
                    addToCart(product, qty);
                    showToast('Added to cart', 'success');
                  }}
                  isInWishlist={isInWishlist(product._id)}
                  showQuickActions={true}
                />
              ))}
            </div>
          )}
        </section>

        {/* Trust Badges */}
        <section className="section">
          <TrustBadges />
        </section>

        {/* Features Section */}
        <section className="section" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(99, 102, 241, 0.02) 50%, transparent 100%)', paddingTop: 'var(--spacing-md)', paddingBottom: 'var(--spacing-md)' }}>
          <div className="section-header">
            <h2 className="section-title gradient-text" style={{ marginBottom: 'var(--spacing-md)' }}>Why Choose Us</h2>
            <p className="section-subtitle" style={{ fontSize: 'var(--font-size-lg)', color: 'var(--gray-600)' }}>Experience the difference</p>
          </div>
          <div className="responsive-grid" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-md)' }}>
            <div className="feature-card stagger-item" tabIndex="0" role="article" aria-label="Free Shipping Benefit">
              <div className="feature-icon" aria-hidden="true">
                <FaShippingFast size={38} style={{ color: 'white' }} />
        </div>
              <h3 className="feature-card-title">Free Shipping</h3>
              <p className="feature-card-description">On all orders over $100</p>
            </div>
            <div className="feature-card stagger-item" tabIndex="0" role="article" aria-label="Easy Returns Benefit">
              <div className="feature-icon" aria-hidden="true">
                <FaUndo size={38} style={{ color: 'white' }} />
          </div>
              <h3 className="feature-card-title">Easy Returns</h3>
              <p className="feature-card-description">30 days money back guarantee</p>
            </div>
            <div className="feature-card stagger-item" tabIndex="0" role="article" aria-label="24/7 Support Benefit">
              <div className="feature-icon" aria-hidden="true">
                <FaHeadset size={38} style={{ color: 'white' }} />
          </div>
              <h3 className="feature-card-title">24/7 Support</h3>
              <p className="feature-card-description">Dedicated support team</p>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section">
          <div className="testimonials-container">
            <div className="section-header">
              <h2 className="section-title gradient-text">What Our Customers Say</h2>
              <p className="section-subtitle">Real reviews from real customers</p>
            </div>
          <div className="responsive-grid">
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  <FaQuoteLeft size={24} style={{ color: 'white' }} />
              </div>
                <p className="testimonial-text">
                "Amazing quality and fast shipping! The fit is perfect and the fabric feels premium. Will definitely order again!"
              </p>
                <div className="testimonial-author">
                  <div className="font-bold mb-xs">Sarah Johnson</div>
                  <div className="text-gray-600 text-sm">New York, NY</div>
            </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  <FaQuoteLeft size={24} style={{ color: 'white' }} />
                </div>
                <p className="testimonial-text">
                "Best online shopping experience! The customer service is outstanding and the products exceed expectations."
              </p>
                <div className="testimonial-author">
                  <div className="font-bold mb-xs">Michael Chen</div>
                  <div className="text-gray-600 text-sm">Los Angeles, CA</div>
            </div>
              </div>
              <div className="testimonial-card">
                <div className="testimonial-icon">
                  <FaQuoteLeft size={24} style={{ color: 'white' }} />
                </div>
                <p className="testimonial-text">
                "Love the variety and style! Found exactly what I was looking for. The quality is top-notch!"
              </p>
                <div className="testimonial-author">
                  <div className="font-bold mb-xs">Emma Davis</div>
                  <div className="text-gray-600 text-sm">Chicago, IL</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="newsletter-section">
          <h2 className="newsletter-title">Subscribe to Our Newsletter</h2>
          <p className="newsletter-subtitle">Get exclusive offers and updates delivered to your inbox</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="newsletter-input"
              required
            />
            <button
              type="submit"
              className="btn btn-lg"
              style={{
                background: 'white',
                color: 'var(--accent-color)',
                fontWeight: 'var(--font-weight-bold)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
              }}
            >
              Subscribe
            </button>
          </form>
        </section>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
};

// Premium Quick View Modal Component (Same as Shop page)
const QuickViewModal = ({ product, onClose }) => {
  const { addToCart } = useContext(CartContext);
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);

  const handleAddToCart = () => {
    if (product.countInStock > 0) {
      addToCart(product, qty);
      showToast('Added to cart', 'success');
      onClose();
    }
  };

  return (
    <div
      className="fashion-quickview-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Quick view product"
    >
      <div
        className="fashion-quickview-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="fashion-quickview-close"
          aria-label="Close quick view"
        >
          <FaTimes aria-hidden="true" />
        </button>

        <div className="fashion-quickview-content">
          <div className="fashion-quickview-image">
            <img
              src={getImageUrl(product.image)}
              alt={product.name}
              onError={(e) => { e.target.src = heroImageDefault; }}
            />
          </div>

          <div className="fashion-quickview-info">
            <span className="fashion-quickview-category">{product.category}</span>
            <h2 className="fashion-quickview-title">{product.name}</h2>
            
            {product.rating > 0 && (
              <div className="fashion-quickview-rating" aria-label={`Rating: ${product.rating} out of 5`}>
                <span className="fashion-rating-stars" aria-hidden="true">
                  {'★'.repeat(Math.round(product.rating || 0))}
                  <span className="fashion-rating-empty">{'★'.repeat(5 - Math.round(product.rating || 0))}</span>
                </span>
                {product.numReviews > 0 && (
                  <span className="fashion-rating-count">({product.numReviews} reviews)</span>
                )}
              </div>
            )}

            <div className="fashion-quickview-price">Rs {product.price}</div>
            
            <p className="fashion-quickview-description">
              {product.description}
            </p>

            <div className="fashion-quickview-status">
              <span className="fashion-status-label">Status:</span>
              <span className={`fashion-status-value ${product.countInStock > 0 ? 'fashion-in-stock' : 'fashion-out-stock'}`}>
                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
              </span>
            </div>

            {product.countInStock > 0 && (
              <div className="fashion-quickview-quantity">
                <label className="form-label">Quantity:</label>
                <div className="quantity-control" style={{ width: 'fit-content' }}>
                  <button
                    className="quantity-btn"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    className="quantity-input"
                    value={qty}
                    min="1"
                    max={product.countInStock}
                    onChange={(e) => {
                      const val = Math.max(1, Math.min(product.countInStock, Number(e.target.value) || 1));
                      setQty(val);
                    }}
                    aria-label="Quantity"
                  />
                  <button
                    className="quantity-btn"
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    disabled={qty >= product.countInStock}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="fashion-quickview-actions">
              <Link
                to={`/product/${product._id}`}
                className="btn btn-outline"
                onClick={onClose}
              >
                View Full Details
              </Link>
              <button
                onClick={handleAddToCart}
                className="btn btn-primary"
                disabled={product.countInStock === 0}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
