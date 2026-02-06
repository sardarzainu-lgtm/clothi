import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Profile = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (!userInfo) {
            navigate('/login');
            return;
        }

        // Set user data from localStorage
        setName(userInfo.name);
        setEmail(userInfo.email);

        // Fetch user's orders
        const fetchOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
                setLoading(false);
            } catch (error) {
                showToast('Error fetching orders:', error);
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToast('Passwords do not match');
            return;
        }

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.put(
                '/api/users/profile',
                { name, email, password },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            showToast('Profile Updated Successfully!');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            showToast(error);
            alert(error.response && error.response.data.message ? error.response.data.message : error.message);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 2fr', gap: 'clamp(2rem, 4vw, 4rem)' }}>

                {/* User Details */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>User Profile</h2>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Update
                        </button>
                    </form>
                </div>

                {/* Order History */}
                <div>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>My Orders</h2>
                    {loading ? (
                        <div>Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div>No orders yet. <Link to="/shop">Start Shopping</Link></div>
                    ) : (
                        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                            <table style={{ width: '100%', minWidth: '500px', borderCollapse: 'collapse', fontSize: window.innerWidth < 768 ? '0.875rem' : '1rem' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                                        <th className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>ID</th>
                                        <th className="py-1">DATE</th>
                                        <th className="py-1">TOTAL</th>
                                        <th className="py-1">PAID</th>
                                        <th className="py-1">DELIVERED</th>
                                        <th className="py-1"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>{order._id}</td>
                                            <td className="py-1">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="py-1">Rs {order.totalPrice}</td>
                                            <td className="py-1">
                                                {order.isPaid ? (
                                                    <span style={{ color: 'green' }}>Paid</span>
                                                ) : (
                                                    <FaTimes style={{ color: 'red' }} />
                                                )}
                                            </td>
                                            <td className="py-1">
                                                {order.isDelivered ? (
                                                    <span style={{ color: 'green' }}>Delivered</span>
                                                ) : (
                                                    <FaTimes style={{ color: 'red' }} />
                                                )}
                                            </td>
                                            <td className="py-1">
                                                <Link to={`/order/${order._id}`} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
