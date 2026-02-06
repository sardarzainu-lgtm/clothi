import React from 'react';

export const SkeletonProductCard = () => {
  return (
    <div className="skeleton-product-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-product-card-content">
        <div className="skeleton skeleton-text short" style={{ marginBottom: '0.75rem' }}></div>
        <div className="skeleton skeleton-text long" style={{ marginBottom: '0.5rem', height: '1.2em' }}></div>
        <div className="skeleton skeleton-text medium" style={{ marginBottom: '1rem', height: '1em' }}></div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="skeleton skeleton-text short" style={{ width: '80px', height: '1.5em' }}></div>
          <div className="skeleton skeleton-text short" style={{ width: '100px', height: '1em' }}></div>
        </div>
        <div className="skeleton skeleton-button"></div>
      </div>
    </div>
  );
};

export const SkeletonProductList = ({ count = 8 }) => {
  return (
    <div className="product-grid">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonProductCard key={index} />
      ))}
    </div>
  );
};

export const SkeletonProductDetails = () => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr', gap: '4rem' }}>
      <div>
        <div className="skeleton skeleton-image" style={{ height: '500px', borderRadius: '16px' }}></div>
      </div>
      <div>
        <div className="skeleton skeleton-text short" style={{ marginBottom: '1rem', height: '1.5em' }}></div>
        <div className="skeleton skeleton-text long" style={{ marginBottom: '1rem', height: '2em' }}></div>
        <div className="skeleton skeleton-text medium" style={{ marginBottom: '1.5rem', height: '1.5em' }}></div>
        <div className="skeleton skeleton-text long" style={{ marginBottom: '2rem', height: '3em' }}></div>
        <div className="skeleton skeleton-text short" style={{ marginBottom: '1rem', height: '2em', width: '150px' }}></div>
        <div className="skeleton skeleton-button" style={{ width: '100%', height: '48px' }}></div>
      </div>
    </div>
  );
};

export const SkeletonCartItem = () => {
  return (
    <div style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', background: 'white', borderRadius: '16px', marginBottom: '1rem' }}>
      <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '12px', flexShrink: 0 }}></div>
      <div style={{ flex: 1 }}>
        <div className="skeleton skeleton-text long" style={{ marginBottom: '0.5rem', height: '1.2em' }}></div>
        <div className="skeleton skeleton-text short" style={{ marginBottom: '0.5rem', height: '1em' }}></div>
        <div className="skeleton skeleton-text short" style={{ width: '100px', height: '1.5em' }}></div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
        <div className="skeleton skeleton-text short" style={{ width: '80px', height: '1.5em' }}></div>
        <div className="skeleton skeleton-button" style={{ width: '100px' }}></div>
      </div>
    </div>
  );
};

export default SkeletonProductCard;

