import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setShow(true);
    setProgress(0);

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(60), 300);
    const timer3 = setTimeout(() => setProgress(100), 500);

    const hideTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setShow(false), 200);
    }, 600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(hideTimer);
    };
  }, [location.pathname]);

  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'rgba(210, 168, 65, 0.15)',
        zIndex: 10001,
        overflow: 'hidden',
        backdropFilter: 'blur(10px)'
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #d2a841 0%, #deb94f 25%, #f4de85 50%, #deb94f 75%, #d2a841 100%)',
          backgroundSize: '200% 100%',
          width: `${progress}%`,
          transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 0 20px rgba(210, 168, 65, 0.6), 0 0 40px rgba(244, 222, 133, 0.4)',
          position: 'relative',
          animation: 'shimmer 2s ease-in-out infinite',
          marginBottom: '-32px'
        }}
      >
        {/* Shimmer effect overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
            animation: 'shimmer-slide 1.5s ease-in-out infinite'
          }}
        />
      </div>
      <style>{`
        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes shimmer-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default LoadingProgress;

