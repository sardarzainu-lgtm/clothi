import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaGem } from 'react-icons/fa';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';

const DailyDeals = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = React.useContext(CartContext);
    const { addToWishlist, removeFromWishlist, isInWishlist } = React.useContext(WishlistContext);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const { data } = await axios.get('/api/dailydeals');
                setDeals(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching daily deals:', error);
                showToast('Error loading daily deals', 'error');
                setLoading(false);
            }
        };
        fetchDeals();
    }, [showToast]);

    const handleAddToCart = (product, qty) => {
        addToCart(product, qty);
        showToast('Added to cart', 'success');
    };

    const handleAddToWishlist = (product) => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
            showToast('Removed from wishlist', 'success');
        } else {
            addToWishlist(product);
            showToast('Added to wishlist', 'success');
        }
    };

    const calculateTimeLeft = (endTime) => {
        const now = new Date().getTime();
        const end = new Date(endTime).getTime();
        const difference = end - now;

        if (difference <= 0) {
            return { hours: 0, minutes: 0, seconds: 0, expired: true };
        }

        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        return { hours, minutes, seconds, expired: false };
    };

    const CountdownTimer = ({ endTime }) => {
        const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(endTime));

        useEffect(() => {
            const timer = setInterval(() => {
                const newTimeLeft = calculateTimeLeft(endTime);
                setTimeLeft(newTimeLeft);
                if (newTimeLeft.expired) {
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        }, [endTime]);

        if (timeLeft.expired) {
            return (
                <div className="daily-deal-expired">
                    <span>Deal Expired</span>
                </div>
            );
        }

        return (
            <div className="daily-deal-countdown">
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.hours).padStart(2, '0')}</div>
                    <div className="countdown-label">Hours</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.minutes).padStart(2, '0')}</div>
                    <div className="countdown-label">Minutes</div>
                </div>
                <div className="countdown-separator">:</div>
                <div className="countdown-item">
                    <div className="countdown-value">{String(timeLeft.seconds).padStart(2, '0')}</div>
                    <div className="countdown-label">Seconds</div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center', padding: '4rem 2rem' }}>
                <p>Loading daily deals...</p>
            </div>
        );
    }

    return (
        <div className="container fade-in" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-3xl)' }}>
            <div className="page-header mb-2xl">
                <h1 className="page-title gradient-text" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <FaGem className="daily-deals-icon" />
                    Daily Deals
                </h1>
                <p className="page-subtitle">Limited time offers - Don't miss out!</p>
            </div>

            {deals.length === 0 ? (
                <EmptyState
                    type="search"
                    title="No Daily Deals Available"
                    message="Check back soon for amazing deals!"
                    actionLabel="Continue Shopping"
                    actionLink="/shop"
                />
            ) : (
                <div className="daily-deals-container">
                    {deals.map((deal) => (
                        <div key={deal._id} className="daily-deal-card">
                            <div className="daily-deal-header">
                                <h2 className="daily-deal-title">DAILY DEAL ENDS IN</h2>
                                <CountdownTimer endTime={deal.endTime} />
                                <p className="daily-deal-urgency">Hurry! Limited Stock Available</p>
                            </div>

                            {deal.product && (() => {
                                // Calculate discounted price
                                const originalPrice = deal.product.price;
                                const discount = deal.discountPercentage || 0;
                                const discountedPrice = originalPrice * (1 - discount / 100);
                                
                                // Create a modified product object with discounted price
                                const dealProduct = {
                                    ...deal.product,
                                    price: discountedPrice,
                                    originalPrice: originalPrice,
                                    discountPercentage: discount,
                                    isOnSale: discount > 0,
                                };

                                return (
                                    <div className="daily-deal-product">
                                        <ProductCard
                                            product={dealProduct}
                                            onAddToCart={(product) => {
                                                // Use the discounted price when adding to cart
                                                addToCart(product, 1);
                                                showToast('Added to cart', 'success');
                                            }}
                                            onAddToWishlist={handleAddToWishlist}
                                            isInWishlist={isInWishlist(deal.product._id)}
                                            showQuickActions={true}
                                        />
                                    </div>
                                );
                            })()}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DailyDeals;

