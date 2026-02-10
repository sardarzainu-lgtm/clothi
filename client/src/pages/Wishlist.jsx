import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { getImageUrl } from '../utils/imageUtils';

const Wishlist = () => {
    const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);

    if (wishlistItems.length === 0) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center', padding: '4rem 2rem' }}>
                <FaHeart size={64} color="#ddd" style={{ marginBottom: '1.5rem' }} />
                <h2 style={{ marginBottom: '1rem' }}>Your Wishlist is Empty</h2>
                <p style={{ color: '#999', marginBottom: '2rem' }}>Save your favorite items for later!</p>
                <Link to="/shop" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>
                My Wishlist ({wishlistItems.length} items)
            </h1>

            <div className="product-grid">
                {wishlistItems.map((product) => (
                    <div key={product._id} className="card" style={{ position: 'relative' }}>
                        {/* Remove Heart Button */}
                        <button
                            onClick={() => removeFromWishlist(product._id)}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                zIndex: 1,
                            }}
                        >
                            <FaHeart size={20} color="#e74c3c" />
                        </button>

                        <Link to={`/product/${product._id}`}>
                            <img
                                src={getImageUrl(product.image)}
                                alt={product.name}
                                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                onError={(e) => { e.target.style.display = 'none'; }}
                            />
                        </Link>
                        <div style={{ padding: '1rem' }}>
                            <Link to={`/product/${product._id}`}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                            </Link>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>Rs {product.price}</span>
                            </div>
                            <button
                                onClick={() => {
                                    addToCart(product, 1);
                                    alert('Added to cart!');
                                }}
                                className="btn btn-primary btn-block"
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                disabled={product.countInStock === 0}
                            >
                                <FaShoppingCart /> Add to Cart
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
