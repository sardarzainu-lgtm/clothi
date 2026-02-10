import React, { useState, useEffect } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaExpand } from 'react-icons/fa';
import { getImageUrl, getImageErrorHandler } from '../utils/imageUtils';

const ImageGallery = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const mainImage = getImageUrl(images[selectedIndex] || images[0]);
  const thumbnails = images.slice(0, 5); // Show max 5 thumbnails

  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => {
    setIsLightboxOpen(false);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation for lightbox and navbar visibility
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    
    if (!isLightboxOpen) {
      document.body.style.overflow = 'unset';
      if (navbar) {
        navbar.classList.remove('navbar-hidden');
      }
      return;
    }

    // Hide navbar when lightbox is open (desktop only)
    if (navbar && window.innerWidth >= 768) {
      navbar.classList.add('navbar-hidden');
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
      if (navbar) {
        navbar.classList.remove('navbar-hidden');
      }
    };
  }, [isLightboxOpen, images.length]);

  return (
    <>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Main Image */}
        <div style={{ 
          position: 'relative', 
          marginBottom: '0.75rem', 
          borderRadius: '16px', 
          overflow: 'hidden',
          flex: '1 1 auto',
          minHeight: 0,
          aspectRatio: window.innerWidth < 768 ? '3/4' : '4/5',
          maxHeight: window.innerWidth < 768 ? '450px' : '550px'
        }}>
          <img
            src={mainImage}
            alt={productName}
            onError={getImageErrorHandler()}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              cursor: 'zoom-in',
              transition: 'transform 0.3s ease'
            }}
            onClick={() => openLightbox(selectedIndex)}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          />
          
          {/* Zoom Indicator */}
          <button
            onClick={() => openLightbox(selectedIndex)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              transition: 'all 0.2s ease',
              color: '#6366f1'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.background = '#6366f1';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.color = '#6366f1';
            }}
            aria-label="Zoom image"
          >
            <FaExpand />
          </button>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                  color: '#6366f1'
                }}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s ease',
                  color: '#6366f1'
                }}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            overflowX: 'auto', 
            paddingBottom: '0',
            marginTop: '0.5rem',
            flexShrink: 0
          }}>
            {thumbnails.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedIndex(index)}
                style={{
                  flexShrink: 0,
                  width: '80px',
                  height: '80px',
                  border: selectedIndex === index ? '3px solid #6366f1' : '2px solid transparent',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'none',
                  padding: 0,
                  transition: 'all 0.2s ease',
                  opacity: selectedIndex === index ? 1 : 0.7
                }}
                onMouseEnter={(e) => {
                  if (selectedIndex !== index) {
                    e.currentTarget.style.opacity = '1';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedIndex !== index) {
                    e.currentTarget.style.opacity = '0.7';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                <img
                  src={getImageUrl(image)}
                  alt={`${productName} thumbnail ${index + 1}`}
                  onError={getImageErrorHandler()}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Premium Lightbox */}
      {isLightboxOpen && (
        <div
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(15, 15, 25, 0.98) 100%)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: window.innerWidth < 768 ? '5rem 1rem 1rem 1rem' : '7rem 2rem 1rem 2rem',
            animation: 'fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            boxSizing: 'border-box',
            minHeight: 0
          }}
        >
          {/* Animated background gradient overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
              pointerEvents: 'none',
              animation: 'pulse 4s ease-in-out infinite'
            }}
          />

          {/* Premium Close Button - Top Right */}
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: window.innerWidth < 768 ? '7.5rem' : '3.5rem',
              right: window.innerWidth < 768 ? '1.5rem' : '2.5rem',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '50%',
              width: window.innerWidth < 768 ? '44px' : '52px',
              height: window.innerWidth < 768 ? '44px' : '52px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: window.innerWidth < 768 ? '1.1rem' : '1.25rem',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.transform = 'scale(1.1) rotate(90deg)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3)';
            }}
            aria-label="Close lightbox"
          >
            <FaTimes />
          </button>

          {/* Image Counter */}
          {images.length > 1 && (
            <div
              style={{
                position: 'absolute',
                top: window.innerWidth < 768 ? '7.5rem' : '3.5rem',
                left: window.innerWidth < 768 ? '1.5rem' : '2.5rem',
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '24px',
                padding: window.innerWidth < 768 ? '0.5rem 1rem' : '0.75rem 1.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: window.innerWidth < 768 ? '0.75rem' : '0.875rem',
                fontWeight: '500',
                letterSpacing: '0.5px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                zIndex: 10001,
                fontFamily: 'system-ui, -apple-system, sans-serif'
              }}
            >
              {lightboxIndex + 1} / {images.length}
            </div>
          )}

          {/* Main Image Container */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'zoomIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              boxSizing: 'border-box',
              overflow: 'visible',
              flexShrink: 0,
              padding: window.innerWidth < 768 ? '0 2rem' : '0 4rem'
            }}
          >
            {/* Image Wrapper for proper button positioning */}
            <div
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '100%',
                maxHeight: '100%',
                width: '100%',
                height: '100%',
                flexShrink: 0
              }}
            >
              <img
                src={getImageUrl(images[lightboxIndex])}
                alt={productName}
                onError={getImageErrorHandler()}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '16px',
                  boxShadow: '0 25px 100px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
                  filter: 'drop-shadow(0 0 40px rgba(99, 102, 241, 0.2))',
                  transition: 'opacity 0.3s ease',
                  display: 'block',
                  flexShrink: 0
                }}
              />

              {/* Premium Navigation Buttons - Positioned relative to image */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevLightbox();
                    }}
                    className="lightbox-nav-btn lightbox-nav-btn-left"
                    style={{
                      position: 'absolute',
                      left: window.innerWidth < 768 ? '-1.5rem' : '-3rem',
                      top: '50%',
                      marginTop: window.innerWidth < 768 ? '-24px' : '-28px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      width: window.innerWidth < 768 ? '44px' : '52px',
                      height: window.innerWidth < 768 ? '44px' : '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                      transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      zIndex: 10001,
                      margin: 0,
                      padding: 0
                    }}
                    aria-label="Previous image"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextLightbox();
                    }}
                    className="lightbox-nav-btn lightbox-nav-btn-right"
                    style={{
                      position: 'absolute',
                      right: window.innerWidth < 768 ? '-1.5rem' : '-3rem',
                      top: '50%',
                      marginTop: window.innerWidth < 768 ? '-24px' : '-28px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '50%',
                      width: window.innerWidth < 768 ? '44px' : '52px',
                      height: window.innerWidth < 768 ? '44px' : '52px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontSize: window.innerWidth < 768 ? '0.9rem' : '1rem',
                      transition: 'background 0.3s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                      zIndex: 10001,
                      margin: 0,
                      padding: 0
                    }}
                    aria-label="Next image"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}
            </div>

            {/* Keyboard hint (shown briefly on first open) */}
            {images.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: window.innerWidth < 768 ? '1.5rem' : '2rem',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  padding: '0.5rem 1rem',
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                  fontWeight: '400',
                  letterSpacing: '0.5px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  animation: 'fadeInOut 3s ease-in-out',
                  pointerEvents: 'none',
                  zIndex: 10000
                }}
              >
                Use ← → arrow keys to navigate
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;

