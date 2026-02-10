import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { RecentlyViewedContext } from '../context/RecentlyViewedContext';
import axios from 'axios';
import { useToast } from '../context/ToastContext';
import ImageGallery from '../components/ImageGallery';
import { SkeletonProductDetails } from '../components/SkeletonLoader';
import { getImageUrl } from '../utils/imageUtils';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useContext(CartContext);
    const { addToRecentlyViewed, recentlyViewed } = useContext(RecentlyViewedContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [reviews, setReviews] = useState([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [averageRating, setAverageRating] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const { showToast } = useToast();

    useEffect(() => {
        setLoading(true);
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setProduct(data);
                // Add to recently viewed only once when product is loaded
                if (data) {
                    addToRecentlyViewed(data);
                }
            } catch (error) {
                showToast('Error fetching product:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}/reviews`);
                setReviews(data);
            } catch (error) {
                showToast('Error fetching reviews:', error);
            }
        };

        const fetchRating = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}/rating`);
                setAverageRating(data.averageRating);
                setReviewCount(data.reviewCount);
            } catch (error) {
                showToast('Error fetching rating:', error);
            }
        };

        Promise.all([fetchProduct(), fetchReviews(), fetchRating()]).finally(() => {
            setLoading(false);
        });
        // Only depend on id - addToRecentlyViewed is now memoized with useCallback
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // Fetch related products when product changes
    useEffect(() => {
        const fetchRelatedProducts = async () => {
            if (!product || !product._id) return;

            try {
                const { data } = await axios.get('/api/products');
                // Filter products by same category, excluding current product
                const related = data
                    .filter(p => p.category === product.category && p._id !== product._id)
                    .slice(0, 4); // Limit to 4 products
                setRelatedProducts(related);
            } catch (error) {
                showToast('Error fetching related products:', error);
            }
        };

        fetchRelatedProducts();
        // Only depend on product ID and category - showToast is stable
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?._id, product?.category]);

    const submitReviewHandler = async (e) => {
        e.preventDefault();

        if (!userInfo) {
            showToast('Please login to submit a review');
            navigate('/login');
            return;
        }

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
            showToast('Review submitted successfully!');
            setComment('');
            setRating(5);

            // Refresh reviews and rating
            const { data: reviewsData } = await axios.get(`/api/products/${id}/reviews`);
            setReviews(reviewsData);
            const { data: ratingData } = await axios.get(`/api/products/${id}/rating`);
            setAverageRating(ratingData.averageRating);
            setReviewCount(ratingData.reviewCount);
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to submit review');
        }
    };

    if (loading || !product) return (
        <div className="container fade-in" style={{ marginTop: '2rem', marginBottom: '3rem' }}>
            <SkeletonProductDetails />
        </div>
    );

    return (
        <div className="container fade-in" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-3xl)' }}>
            <Link to="/shop" className="btn btn-outline mb-2xl" style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                &larr; Back to Shop
            </Link>

            <div className="product-details-grid">
                {/* Image Gallery */}
                <div className="product-image-container">
                    <ImageGallery 
                        images={[getImageUrl(product.image), getImageUrl(product.image), getImageUrl(product.image)]} 
                        productName={product.name}
                    />
                </div>

                {/* Details */}
                <div className="product-info">
                    <span className="product-category-badge">{product.category}</span>
                    <h1 className="product-title gradient-text">{product.name}</h1>
                    <div className="product-rating mb-lg">
                        <span className="rating-stars">
                            {'★'.repeat(Math.round(averageRating || 0))}
                            <span className="rating-stars-empty">{'★'.repeat(5 - Math.round(averageRating || 0))}</span>
                        </span>
                        <span className="rating-count">({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})</span>
                    </div>
                    <div className="product-price mb-xl">Rs {product.price}</div>
                    
                    {/* Premium Description Section */}
                    <div className="premium-product-description-wrapper mb-2xl">
                        <div className="premium-description-header">
                            <h3 className="premium-description-title">Product Description</h3>
                            <div className="premium-description-divider"></div>
                        </div>
                        <div className="premium-product-description">
                            <p className="premium-description-text">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    <div className="product-actions-card">
                        <div className="product-status-row">
                            <span className="status-label">Status:</span>
                            <span className={`status-value ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="mb-xl">
                                <label className="form-label mb-md">Quantity:</label>
                                <div className="quantity-control" style={{ width: 'fit-content' }}>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        disabled={qty <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        className="quantity-input"
                                        value={qty}
                                        min="1"
                                        max={product.countInStock}
                                        onChange={(e) => {
                                            const val = Math.max(1, Math.min(product.countInStock, Number(e.target.value) || 1));
                                            setQty(val);
                                        }}
                                        aria-label="Quantity"
                                    />
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                        disabled={qty >= product.countInStock}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="stock-info">
                                    {product.countInStock} available in stock
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => {
                                addToCart(product, qty);
                                navigate('/cart');
                            }}
                            className="btn btn-primary btn-block btn-lg"
                            disabled={product.countInStock === 0}
                            style={{
                                opacity: product.countInStock === 0 ? 0.5 : 1,
                                fontWeight: 'var(--font-weight-bold)',
                                fontSize: 'var(--font-size-lg)',
                                marginTop: 'var(--spacing-md)'
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <section className="section">
                <h2 className="section-title gradient-text">Customer Reviews</h2>

                {/* Write a Review */}
                <div className="review-form-card mb-2xl">
                    <h3 className="review-form-title">Write a Review</h3>

                    {userInfo ? (
                        <form onSubmit={submitReviewHandler}>
                            <div className="form-group">
                                <label className="form-label">Rating</label>
                                <select
                                    value={rating}
                                    onChange={(e) => setRating(Number(e.target.value))}
                                    className="form-control"
                                >
                                    <option value="5">5 - Excellent</option>
                                    <option value="4">4 - Good</option>
                                    <option value="3">3 - Average</option>
                                    <option value="2">2 - Poor</option>
                                    <option value="1">1 - Terrible</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Comment</label>
                                <textarea
                                    rows="4"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    className="form-control"
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn btn-primary">
                                Submit Review
                            </button>
                        </form>
                    ) : (
                        <p>Please <Link to="/login">login</Link> to write a review</p>
                    )}
                </div>

                {/* Reviews List */}
                {reviews.length === 0 ? (
                    <div className="card p-2xl text-center" style={{ background: 'linear-gradient(135deg, var(--gray-50) 0%, var(--gray-100) 100%)' }}>
                        <p className="text-gray-600 text-lg">No reviews yet. Be the first to review this product!</p>
                    </div>
                ) : (
                    <div className="reviews-list">
                        {reviews.map((review) => (
                            <div key={review._id} className="review-card">
                                <div className="review-header">
                                    <strong className="review-author">{review.user.name}</strong>
                                    <span className="review-date">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="review-rating mb-md">
                                    <span className="rating-stars">
                                        {'★'.repeat(review.rating)}
                                        <span className="rating-stars-empty">{'★'.repeat(5 - review.rating)}</span>
                                    </span>
                                </div>
                                <p className="review-comment">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Recently Viewed Products Section - Premium Design */}
            {recentlyViewed.length > 1 && (
                <div className="premium-recently-viewed-section" style={{ 
                    marginTop: '5rem', 
                    paddingTop: '4rem', 
                    borderTop: '1px solid rgba(226, 232, 240, 0.5)',
                    position: 'relative'
                }}>
                    {/* Premium Header */}
                    <div style={{ 
                        position: 'relative',
                        marginBottom: '3rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <h2 className="premium-section-title" style={{ 
                                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', 
                                fontWeight: '800',
                                letterSpacing: '-0.02em',
                                margin: 0,
                                background: 'linear-gradient(135deg, #d2a845 0%, #dea84f 50%, #f4c430 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                position: 'relative',
                                display: 'inline-block'
                            }}>
                                Recently Viewed
                            </h2>
                            <div style={{
                                position: 'absolute',
                                bottom: '-8px',
                                left: 0,
                                width: '60px',
                                height: '4px',
                                background: 'linear-gradient(90deg, #d2a845 0%, #dea84f 100%)',
                                borderRadius: '2px',
                                boxShadow: '0 2px 8px rgba(210, 168, 65, 0.4)'
                            }} />
                        </div>
                        <div style={{
                            fontSize: '0.875rem',
                            color: 'var(--gray-600)',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>Continue browsing</span>
                        </div>
                    </div>

                    {/* Premium Product Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                        gap: window.innerWidth < 768 ? '1rem' : '1.5rem'
                    }}>
                        {recentlyViewed
                            .filter(p => p._id !== id) // Exclude current product
                            .slice(0, 4)
                            .map((product, index) => (
                                <Link
                                    key={product._id}
                                    to={`/product/${product._id}`}
                                    className="premium-recently-viewed-card"
                                    style={{ 
                                        textDecoration: 'none', 
                                        color: 'inherit',
                                        display: 'block',
                                        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                                    }}
                                >
                                    <div style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
                                        border: '1px solid rgba(226, 232, 240, 0.6)',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        position: 'relative',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                        {/* Image Container */}
                                        <div style={{
                                            position: 'relative',
                                            width: '100%',
                                            paddingTop: '133.33%', // 3:4 aspect ratio
                                            overflow: 'hidden',
                                            background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
                                        }}>
                                            <img
                                                src={getImageUrl(product.image)}
                                                alt={product.name}
                                                style={{ 
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.transform = 'scale(1.1)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'scale(1)';
                                                }}
                                            />
                                            {/* Premium Overlay Gradient */}
                                            <div style={{
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '40%',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, transparent 100%)',
                                                pointerEvents: 'none'
                                            }} />
                                        </div>
                                        
                                        {/* Content */}
                                        <div style={{ 
                                            padding: '1.25rem',
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between'
                                        }}>
                                            <h4 style={{ 
                                                fontSize: '0.95rem', 
                                                marginBottom: '0.75rem', 
                                                height: '2.5em', 
                                                overflow: 'hidden',
                                                fontWeight: '600',
                                                color: 'var(--text-primary)',
                                                lineHeight: '1.4',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {product.name}
                                            </h4>
                                            <div style={{ 
                                                fontWeight: '700', 
                                                fontSize: '1.1rem',
                                                color: 'var(--primary-color)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{
                                                    background: 'linear-gradient(135deg, #d2a845 0%, #dea84f 100%)',
                                                    WebkitBackgroundClip: 'text',
                                                    WebkitTextFillColor: 'transparent',
                                                    backgroundClip: 'text'
                                                }}>
                                                    Rs {product.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                    </div>
                </div>
            )}

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <div style={{ marginTop: '4rem', paddingTop: '3rem', borderTop: '2px solid #e2e8f0' }}>
                    <h2 className="gradient-text" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.25rem)', marginBottom: '2rem', fontWeight: '700' }}>You Might Also Like</h2>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
                        gap: window.innerWidth < 768 ? '1rem' : '1.5rem'
                    }}>
                        {relatedProducts.map((product) => (
                            <Link
                                key={product._id}
                                to={`/product/${product._id}`}
                                className="card"
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <img
                                    src={getImageUrl(product.image)}
                                    alt={product.name}
                                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                />
                                <div style={{ padding: '1rem' }}>
                                    <h4 style={{ fontSize: '0.95rem', marginBottom: '0.5rem', height: '2.5em', overflow: 'hidden' }}>
                                        {product.name}
                                    </h4>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary-color)' }}>
                                        Rs {product.price}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetails;
