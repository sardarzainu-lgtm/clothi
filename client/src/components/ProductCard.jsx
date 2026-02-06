import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';

/**
 * Premium ProductCard Component
 * Fashion-forward design inspired by Zara, H&M, Myntra
 * 
 * Design Decisions:
 * - Clean, minimal aesthetic with focus on product imagery
 * - Large image area (60% of card) for visual impact
 * - Subtle hover effects that don't distract from product
 * - Clear hierarchy: Image > Title > Price > Actions
 * - Touch-friendly buttons (44px minimum)
 * - Accessible with proper ARIA labels
 * - Memoized for performance optimization
 */
const ProductCard = memo(({
  product,
  onQuickView,
  onAddToWishlist,
  onAddToCart,
  isInWishlist = false,
  showQuickActions = true,
  className = ''
}) => {
  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToWishlist) {
      onAddToWishlist(product);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleAddToCartClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart && product.countInStock > 0) {
      onAddToCart(product, 1);
    }
  };

  return (
    <article 
      className={`fashion-product-card ${className}`}
      aria-label={`Product: ${product.name}`}
    >
      {/* Product Image Container */}
      <div className="fashion-product-image-wrapper">
        <Link 
          to={`/product/${product._id}`}
          className="fashion-product-image-link"
          aria-label={`View details for ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="fashion-product-image"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
          />
          
          {/* Product Badges */}
          {product.countInStock < 5 && product.countInStock > 0 && (
            <span className="fashion-product-badge fashion-badge-limited" aria-label="Limited stock">
              Limited
            </span>
          )}
          {(product.isOnSale || (product.originalPrice && product.originalPrice > product.price) || (product.discountPercentage && product.discountPercentage > 0)) && (
            <span className="fashion-product-badge fashion-badge-sale" aria-label="On sale">
              SALE
            </span>
          )}
          {product.countInStock === 0 && (
            <span className="fashion-product-badge fashion-badge-out" aria-label="Out of stock">
              Sold Out
            </span>
          )}
        </Link>

        {/* Quick Actions Overlay */}
        {showQuickActions && (
          <div className="fashion-product-actions" aria-label="Product actions">
            <button
              onClick={handleQuickViewClick}
              className="fashion-action-btn"
              aria-label={`Quick view ${product.name}`}
              title="Quick view"
            >
              <FaEye aria-hidden="true" />
            </button>
            <button
              onClick={handleWishlistClick}
              className={`fashion-action-btn ${isInWishlist ? 'fashion-action-active' : ''}`}
              aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isInWishlist ? <FaHeart aria-hidden="true" /> : <FaRegHeart aria-hidden="true" />}
            </button>
            <button
              onClick={handleAddToCartClick}
              className="fashion-action-btn fashion-action-cart"
              disabled={product.countInStock === 0}
              aria-label={`Add ${product.name} to cart`}
              title="Add to cart"
            >
              <FaShoppingCart aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="fashion-product-info">
        <Link 
          to={`/product/${product._id}`}
          className="fashion-product-link"
        >
          <span className="fashion-product-category" aria-label={`Category: ${product.category}`}>
            {product.category}
          </span>
          <h3 className="fashion-product-title" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <div className="fashion-product-footer">
          <div className="fashion-product-price">
            {product.isOnSale && product.originalPrice && product.originalPrice > product.price ? (
              <div className="fashion-price-discount-container">
                <div className="fashion-price-row">
                  <span className="fashion-price-amount fashion-price-current">Rs {product.price}</span>
                  {product.discountPercentage > 0 && (
                    <span className="fashion-discount-badge">{product.discountPercentage}% OFF</span>
                  )}
                </div>
                <div className="fashion-price-row">
                  <span className="fashion-price-original">Rs {product.originalPrice}</span>
                </div>
              </div>
            ) : (
              <span className="fashion-price-amount">Rs {product.price}</span>
            )}
            {product.rating > 0 && (
              <div className="fashion-product-rating" aria-label={`Rating: ${product.rating} out of 5`}>
                <span className="fashion-rating-stars" aria-hidden="true">
                  {'★'.repeat(Math.round(product.rating || 0))}
                  <span className="fashion-rating-empty">{'★'.repeat(5 - Math.round(product.rating || 0))}</span>
                </span>
                {product.numReviews > 0 && (
                  <span className="fashion-rating-count">
                    ({product.numReviews})
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;

