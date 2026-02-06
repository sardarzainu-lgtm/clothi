import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaTimes, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching order:', error);
                alert('Failed to load order');
                navigate('/admin/orders');
            }
        };

        fetchOrder();
    }, [id, navigate]);

    if (loading) {
        return <div className="container" style={{ marginTop: '2rem' }}>Loading...</div>;
    }

    if (!order) {
        return <div className="container" style={{ marginTop: '2rem' }}>Order not found</div>;
    }

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Order {order._id}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '2fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div>
                    {/* Shipping Info */}
                    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Shipping Address</h2>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>Name:</strong> {order.shippingAddress.firstName || order.user.name} {order.shippingAddress.lastName || ''}</p>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>Email:</strong> {order.user.email}</p>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>Phone Number:</strong> {order.shippingAddress.phoneNumber || 'N/A'}</p>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>Street Address:</strong> {order.shippingAddress.address}</p>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>City:</strong> {order.shippingAddress.city}</p>
                        </div>
                        {order.shippingAddress.state && (
                            <div style={{ marginBottom: '0.5rem' }}>
                                <p><strong>State/Province:</strong> {order.shippingAddress.state}</p>
                            </div>
                        )}
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>Zip/Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                            <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                        </div>
                        {order.isDelivered ? (
                            <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginTop: '1rem' }}>
                                Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                            </div>
                        ) : (
                            <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginTop: '1rem' }}>
                                Not Delivered
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Payment Method</h2>
                        <p>{order.paymentMethod}</p>
                        {order.isPaid ? (
                            <div style={{ padding: '10px', background: '#d4edda', color: '#155724', borderRadius: '4px', marginTop: '1rem' }}>
                                Paid on {new Date(order.paidAt).toLocaleDateString()}
                            </div>
                        ) : (
                            <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginTop: '1rem' }}>
                                Not Paid
                            </div>
                        )}
                    </div>

                    {/* Order Items */}
                    <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Order Items</h2>
                        {order.orderItems.map((item, index) => (
                            <div key={index} style={{ display: 'flex', alignItems: 'center', padding: '1rem 0', borderBottom: index < order.orderItems.length - 1 ? '1px solid #eee' : 'none' }}>
                                <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '1rem' }} />
                                <div style={{ flex: 1 }}>
                                    <div>{item.name}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    {item.qty} x Rs {item.price} = Rs {(item.qty * item.price).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column - Order Summary */}
                <div>
                    <div style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px' }}>
                        <h2 style={{ marginBottom: '1rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                            <span>Items:</span>
                            <span>Rs {order.itemsPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                            <span>Shipping:</span>
                            <span>Rs {order.shippingPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
                            <span>Tax:</span>
                            <span>Rs {order.taxPrice}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total:</span>
                            <span>Rs {order.totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
