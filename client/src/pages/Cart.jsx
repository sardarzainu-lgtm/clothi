import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import EmptyState from '../components/EmptyState';

const Cart = () => {
    const navigate = useNavigate();
    const { cartItems, removeFromCart, addToCart } = useContext(CartContext);

    const { showToast } = useToast();
    const checkoutHandler = () => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo) {
            navigate('/checkout');
        } else {
            navigate('/login?redirect=/checkout');
        }
    };

    const total = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

    return (
        <div className="container fade-in" style={{ marginTop: 'var(--spacing-2xl)', marginBottom: 'var(--spacing-3xl)' }}>
            <div className="page-header mb-2xl">
                <h1 className="page-title gradient-text">Shopping Cart</h1>
                {cartItems.length > 0 && (
                    <p className="page-subtitle">
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)} {cartItems.reduce((acc, item) => acc + item.qty, 0) === 1 ? 'item' : 'items'} in your cart
                    </p>
                )}
            </div>

            {cartItems.length === 0 ? (
                <EmptyState
                    type="cart"
                    title="Your cart is empty"
                    message="Start shopping to add items to your cart"
                    actionLabel="Continue Shopping"
                    actionLink="/shop"
                />
            ) : (
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <div key={item.product} className="cart-item-card">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="cart-item-image"
                                />
                                <div className="cart-item-info">
                                    <Link
                                        to={`/product/${item.product}`}
                                        className="cart-item-name"
                                    >
                                        {item.name}
                                    </Link>
                                    <div className="cart-item-price-text">
                                        Rs {item.price} each
                                    </div>
                                    <div className="cart-item-subtotal">
                                        Subtotal: <span className="subtotal-amount">Rs {(item.price * item.qty).toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="cart-item-price">
                                    <span>Rs {item.price}</span>
                                </div>
                                <div className="quantity-control">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => {
                                            if (item.qty > 1) {
                                                addToCart({ ...item, _id: item.product, countInStock: item.countInStock }, item.qty - 1);
                                            }
                                        }}
                                        disabled={item.qty <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        className="quantity-input"
                                        value={item.qty}
                                        min="1"
                                        max={item.countInStock}
                                        readOnly
                                        aria-label="Quantity"
                                    />
                                    <button
                                        className="quantity-btn"
                                        onClick={() => {
                                            if (item.qty < item.countInStock) {
                                                addToCart({ ...item, _id: item.product, countInStock: item.countInStock }, item.qty + 1);
                                            }
                                        }}
                                        disabled={item.qty >= item.countInStock}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    className="cart-item-remove"
                                    onClick={() => {
                                        removeFromCart(item.product);
                                        showToast('Item removed from cart', 'success');
                                    }}
                                    aria-label="Remove item"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="order-summary-card">
                        <h2 className="order-summary-title">Order Summary</h2>
                        <div className="order-summary-divider">
                            <div className="order-summary-row">
                                <span className="text-gray-600">Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
                                <span className="font-semibold">Rs {total}</span>
                            </div>
                        </div>
                        <div className="order-total">
                            Total: <span className="total-amount">Rs {total}</span>
                        </div>
                        <button
                            className="btn btn-primary btn-block btn-lg"
                            disabled={cartItems.length === 0}
                            onClick={checkoutHandler}
                            style={{ fontWeight: 'var(--font-weight-bold)' }}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
