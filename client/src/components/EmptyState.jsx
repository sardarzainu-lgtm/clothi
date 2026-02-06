import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaSearch, FaHeart, FaShoppingCart } from 'react-icons/fa';

const EmptyState = ({ 
  type = 'cart', 
  title, 
  message, 
  actionLabel, 
  actionLink,
  icon: CustomIcon 
}) => {
  const getIcon = () => {
    if (CustomIcon) return <CustomIcon size={80} />;
    
    switch (type) {
      case 'cart':
        return <FaShoppingCart size={80} />;
      case 'wishlist':
        return <FaHeart size={80} />;
      case 'search':
        return <FaSearch size={80} />;
      case 'products':
        return <FaShoppingBag size={80} />;
      default:
        return <FaShoppingBag size={80} />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case 'cart':
        return 'Your cart is empty';
      case 'wishlist':
        return 'Your wishlist is empty';
      case 'search':
        return 'No products found';
      case 'products':
        return 'No products available';
      default:
        return 'Nothing here';
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case 'cart':
        return 'Start shopping to add items to your cart';
      case 'wishlist':
        return 'Save your favorite items for later';
      case 'search':
        return 'Try adjusting your filters or search terms';
      case 'products':
        return 'Check back later for new products';
      default:
        return 'There\'s nothing to show here';
    }
  };

  const getDefaultAction = () => {
    switch (type) {
      case 'cart':
      case 'wishlist':
        return { label: 'Continue Shopping', link: '/shop' };
      case 'search':
        return { label: 'Browse All Products', link: '/shop' };
      default:
        return { label: 'Go to Shop', link: '/shop' };
    }
  };

  const defaultAction = getDefaultAction();

  return (
    <div style={{
      textAlign: 'center',
      padding: '4rem 2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(99, 102, 241, 0.1)',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <div style={{
        width: '120px',
        height: '120px',
        margin: '0 auto 2rem',
        background: 'linear-gradient(135deg, #d2a841 0%, #deb94f 30%, #eed370 50%, #deb94f 70%, #c89b39 100%)',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        boxShadow: '0 15px 35px rgba(210, 168, 65, 0.4), 0 5px 15px rgba(210, 168, 65, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
        border: '3px solid rgba(255, 255, 255, 0.2)',
        animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}>
        {getIcon()}
      </div>
      
      <h2 style={{
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#0f172a',
        marginBottom: '1rem'
      }}>
        {title || getDefaultTitle()}
      </h2>
      
      <p style={{
        fontSize: '1.1rem',
        color: '#64748b',
        marginBottom: '2rem',
        lineHeight: '1.6'
      }}>
        {message || getDefaultMessage()}
      </p>
      
      {actionLink && (
        <Link 
          to={actionLink} 
          className="btn btn-primary btn-lg"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {actionLabel || defaultAction.label}
          <span>→</span>
        </Link>
      )}
    </div>
  );
};

export default EmptyState;

