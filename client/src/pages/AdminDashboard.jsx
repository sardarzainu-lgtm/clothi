import React from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaUsers, FaCog, FaGem } from 'react-icons/fa';

const AdminDashboard = () => {
    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <h1 className="text-center" style={{ marginBottom: '2rem', fontSize: 'clamp(1.75rem, 5vw, 2.5rem)' }}>Admin Dashboard</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FaBox size={40} color="#0984e3" style={{ marginBottom: '1rem' }} />
                    <h2>Products</h2>
                    <p>Manage your product inventory</p>
                    <Link to="/admin/products" className="btn btn-outline btn-block">
                        Manage Products
                    </Link>
                </div>

                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FaClipboardList size={40} color="#00b894" style={{ marginBottom: '1rem' }} />
                    <h2>Orders</h2>
                    <p>View and process orders</p>
                    <Link to="/admin/orders" className="btn btn-outline btn-block">
                        Manage Orders
                    </Link>
                </div>

                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FaUsers size={40} color="#6c5ce7" style={{ marginBottom: '1rem' }} />
                    <h2>Users</h2>
                    <p>Manage registered users</p>
                    <Link to="/admin/users" className="btn btn-outline btn-block">
                        Manage Users
                    </Link>
                </div>

                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FaCog size={40} color="#d2a841" style={{ marginBottom: '1rem' }} />
                    <h2>Settings</h2>
                    <p>Manage site settings and homepage</p>
                    <Link to="/admin/settings" className="btn btn-outline btn-block">
                        Manage Settings
                    </Link>
                </div>

                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                    <FaGem size={40} color="#d2a841" style={{ marginBottom: '1rem' }} />
                    <h2>Daily Deals</h2>
                    <p>Manage daily deals and countdown timers</p>
                    <Link to="/admin/daily-deals" className="btn btn-outline btn-block">
                        Manage Daily Deals
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
