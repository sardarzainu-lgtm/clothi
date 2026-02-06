import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: {
                        Authorization: `Bearer ${userInfo.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders', config);
                setOrders(data);
            } catch (error) {
                showToast('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Orders</h1>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>

                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: window.innerWidth < 768 ? '0.875rem' : '1rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                            <th className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>ID</th>
                            <th className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>USER</th>
                            <th className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>DATE</th>
                            <th className="py-1">TOTAL</th>
                            <th className="py-1">PAID</th>
                            <th className="py-1">DELIVERED</th>
                            <th className="py-1">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>{order._id}</td>
                                <td className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>{order.user && order.user.name}</td>
                                <td className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>{order.createdAt.substring(0, 10)}</td>
                                <td className="py-1">Rs {order.totalPrice}</td>
                                <td className="py-1">
                                    {order.isPaid ? (
                                        <span style={{ color: 'green' }}>{order.paidAt.substring(0, 10)}</span>
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
        </div>
    );
};

export default OrderList;
