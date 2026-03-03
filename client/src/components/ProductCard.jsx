import React, { memo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaEye, FaShoppingCart } from 'react-icons/fa';
import { getImageUrl, getImageErrorHandler } from '../utils/imageUtils';

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
  className = '',
  variant = 'default', // 'default' | 'shop' (premium shop page design)
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

  const navigate = useNavigate();
  const handleCardClick = () => navigate(`/product/${product._id}`);

  // Premium shop page design (shop_page.html)
  if (variant === 'shop') {
    const hasSale = product.isOnSale && product.originalPrice && Number(product.originalPrice) > Number(product.price);
    return (
      <article
        className={`product-card group relative flex flex-col cursor-pointer ${className}`}
        aria-label={`Product: ${product.name}`}
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } }}
      >
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-primary/5">
          <div className="block w-full h-full">
            <img
              src={getImageUrl(product.image, 'medium')}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={getImageErrorHandler()}
            />
          </div>
          {showQuickActions && (
            <div className="hover-overlay opacity-0 absolute inset-0 bg-background-dark/40 backdrop-blur-[2px] flex items-center justify-center gap-4 transition-opacity duration-300">
              <button
                type="button"
                onClick={handleQuickViewClick}
                className="w-12 h-12 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-background-dark transition-colors shadow-xl"
                aria-label={`Quick view ${product.name}`}
              >
                <FaEye className="text-lg" />
              </button>
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={product.countInStock === 0}
                className="w-12 h-12 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 rounded-full flex items-center justify-center hover:bg-primary hover:text-background-dark transition-colors shadow-xl disabled:opacity-50"
                aria-label={`Add ${product.name} to cart`}
              >
                <FaShoppingCart className="text-lg" />
              </button>
              <button
                type="button"
                onClick={handleWishlistClick}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-xl ${
                  isInWishlist ? 'bg-primary text-background-dark' : 'bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 hover:bg-primary hover:text-background-dark'
                }`}
                aria-label={isInWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                <FaHeart className="text-lg" />
              </button>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-col items-center text-center">
          <h3 className="text-lg font-semibold tracking-tight text-black group-hover:text-primary transition-colors">{product.name}</h3>
          <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">MAKHMAL JAN</p>
          <div className="mt-2 flex items-center gap-3 justify-center">
            {hasSale && (
              <span className="text-sm text-slate-400 line-through">Rs {product.originalPrice}</span>
            )}
            <span className="text-lg font-bold text-primary">Rs {product.price}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`fashion-product-card cursor-pointer ${className}`}
      aria-label={`Product: ${product.name}`}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleCardClick(); } }}
    >
      {/* Product Image Container */}
      <div className="fashion-product-image-wrapper">
        <div className="fashion-product-image-link">
          <img
            src={getImageUrl(product.image, 'thumbnail')}
            alt={product.name}
            className="fashion-product-image"
            loading="lazy"
            decoding="async"
            fetchpriority="low"
            referrerPolicy="no-referrer"
            crossOrigin="anonymous"
            onError={getImageErrorHandler()}
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
        </div>

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
        <div className="fashion-product-link">
          <span className="fashion-product-category" aria-label={`Category: ${product.category}`}>
            {product.category}
          </span>
          <h3 className="fashion-product-title" title={product.name}>
            {product.name}
          </h3>
        </div>

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

