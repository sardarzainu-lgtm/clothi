import React from 'react';
import { FaShieldAlt, FaLock, FaTruck, FaUndo, FaCreditCard } from 'react-icons/fa';

// Helper function to get premium gradient for each color
const getIconGradient = (color) => {
  const gradients = {
    '#10b981': 'linear-gradient(135deg, #10b981 0%, #059669 30%, #34d399 50%, #059669 70%, #047857 100%)', // Green
    '#3b82f6': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 30%, #60a5fa 50%, #2563eb 70%, #1d4ed8 100%)', // Blue
    '#f59e0b': 'linear-gradient(135deg, #f59e0b 0%, #d97706 30%, #fbbf24 50%, #d97706 70%, #b45309 100%)', // Orange
    '#6366f1': 'linear-gradient(135deg, #6366f1 0%, #4f46e5 30%, #818cf8 50%, #4f46e5 70%, #4338ca 100%)', // Purple
  };
  return gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color} 100%)`;
};

// Helper function to get premium shadow
const getIconShadow = (color) => {
  const rgb = hexToRgb(color);
  return `
    0 12px 30px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4),
    0 4px 12px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 rgba(0, 0, 0, 0.1)
  `;
};

// Helper function to get hover shadow
const getIconHoverShadow = (color) => {
  const rgb = hexToRgb(color);
  return `
    0 20px 45px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.6),
    0 8px 20px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.4),
    0 0 0 10px rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.15),
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    inset 0 -2px 0 rgba(0, 0, 0, 0.15)
  `;
};

// Helper to convert hex to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 99, g: 102, b: 241 };
};

const TrustBadges = ({ variant = 'horizontal' }) => {
  const badges = [
    { icon: FaShieldAlt, text: 'Secure Payment', color: '#10b981' },
    { icon: FaTruck, text: 'Free Shipping', color: '#3b82f6' },
    { icon: FaUndo, text: '30-Day Returns', color: '#f59e0b' },
    { icon: FaLock, text: 'SSL Encrypted', color: '#6366f1' },
  ];

  if (variant === 'compact') {
    return (
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#64748b',
                fontSize: '0.875rem'
              }}
            >
              <Icon style={{ color: badge.color }} />
              <span>{badge.text}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      padding: '2rem',
      background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
      borderRadius: '16px',
      border: '1px solid rgba(99, 102, 241, 0.1)'
    }}>
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              textAlign: 'center',
              padding: '1rem',
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div 
              className="trust-badge-icon"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: getIconGradient(badge.color),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.75rem',
                position: 'relative',
                boxShadow: getIconShadow(badge.color),
                border: '3px solid rgba(255, 255, 255, 0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                animation: 'trustIconFloat 3s ease-in-out infinite'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.15) translateY(-5px) rotate(5deg)';
                e.currentTarget.style.boxShadow = getIconHoverShadow(badge.color);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1) translateY(0) rotate(0deg)';
                e.currentTarget.style.boxShadow = getIconShadow(badge.color);
              }}
            >
              <Icon size={36} style={{ color: 'white', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
            </div>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#0f172a'
            }}>
              {badge.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default TrustBadges;

