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
        height: '3px',
        background: 'rgba(99, 102, 241, 0.1)',
        zIndex: 10001,
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)',
          width: `${progress}%`,
          transition: 'width 0.3s ease',
          boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)'
        }}
      />
    </div>
  );
};

export default LoadingProgress;

