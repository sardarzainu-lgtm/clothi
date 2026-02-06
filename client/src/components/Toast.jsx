import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger animation
        setTimeout(() => setIsVisible(true), 10);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FaCheckCircle size={20} />;
            case 'error':
                return <FaExclamationCircle size={20} />;
            case 'info':
                return <FaInfoCircle size={20} />;
            default:
                return <FaCheckCircle size={20} />;
        }
    };

    const getColor = () => {
        switch (type) {
            case 'success':
                return '#00b894';
            case 'error':
                return '#d63031';
            case 'info':
                return '#0984e3';
            default:
                return '#00b894';
        }
    };

    return (
        <div
            style={{
                background: 'white',
                padding: '16px 20px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '300px',
                maxWidth: '400px',
                borderLeft: `4px solid ${getColor()}`,
                transform: isVisible ? 'translateX(0)' : 'translateX(400px)',
                opacity: isVisible ? 1 : 0,
                transition: 'all 0.3s ease',
                pointerEvents: 'auto', // Re-enable pointer events on toast itself
                zIndex: 10001,
            }}
        >
            <div style={{ color: getColor() }}>
                {getIcon()}
            </div>
            <div style={{ flex: 1, fontSize: '14px', color: '#333' }}>
                {message}
            </div>
            <button
                onClick={handleClose}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <FaTimes size={16} />
            </button>
        </div>
    );
};

export default Toast;
