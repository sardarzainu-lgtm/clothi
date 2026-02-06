import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';

const WhatsAppFloat = ({ phoneNumber = "1234567890", message = "Hello! I'm interested in your products." }) => {
    const handleClick = () => {
        // Format: https://wa.me/[country code][phone number]?text=[message]
        const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <>
            <style>
                {`
                    @keyframes float-whatsapp {
                        0%, 100% {
                            transform: translateY(0px);
                        }
                        50% {
                            transform: translateY(-15px);
                        }
                    }

                    .whatsapp-float-btn {
                        animation: float-whatsapp 1.5s ease-in-out infinite;
                    }

                    .whatsapp-float-btn:hover {
                        animation-play-state: paused;
                        transform: scale(1.1);
                    }

                    /* Responsive adjustments */
                    @media (max-width: 768px) {
                        .whatsapp-float-btn {
                            width: 50px !important;
                            height: 50px !important;
                            bottom: 20px !important;
                            right: 20px !important;
                            font-size: 26px !important;
                        }
                    }

                    @media (max-width: 480px) {
                        .whatsapp-float-btn {
                            width: 45px !important;
                            height: 45px !important;
                            bottom: 15px !important;
                            right: 15px !important;
                            font-size: 24px !important;
                        }
                    }
                `}
            </style>
            <button
                onClick={handleClick}
                className="whatsapp-float-btn"
                style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#000',
                    color: '#fff',
                    borderRadius: '50%',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    zIndex: 9998,
                    transition: 'transform 0.3s ease'
                }}
                aria-label="Contact us on WhatsApp"
            >
                <FaWhatsapp />
            </button>
        </>
    );
};

export default WhatsAppFloat;
