import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';

const AdminDailyDeals = () => {
    const [deals, setDeals] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [endTime, setEndTime] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState('');
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, dealId: null, dealName: null });
    const { showToast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dealsRes, productsRes] = await Promise.all([
                    axios.get('/api/dailydeals'),
                    axios.get('/api/products')
                ]);
                setDeals(dealsRes.data);
                setProducts(productsRes.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                showToast('Error loading data', 'error');
                setLoading(false);
            }
        };
        fetchData();
    }, [showToast]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            // Validate discount percentage
            const discount = discountPercentage ? parseFloat(discountPercentage) : 0;
            if (isNaN(discount) || discount < 0 || discount > 100) {
                showToast('Discount percentage must be a number between 0 and 100', 'error');
                return;
            }

            await axios.post(
                '/api/dailydeals',
                {
                    product: selectedProduct,
                    endTime,
                    discountPercentage: discount,
                },
                config
            );

            showToast('Daily deal created successfully!', 'success');
            setShowForm(false);
            setSelectedProduct('');
            setEndTime('');
            setDiscountPercentage('');
            
            // Refresh deals list
            const { data } = await axios.get('/api/dailydeals');
            setDeals(data);
        } catch (error) {
            console.error('Error creating daily deal:', error);
            // Extract error message from response
            let errorMessage = 'Error creating daily deal';
            
            if (error.response?.data) {
                // Try different possible error message formats
                errorMessage = error.response.data.message || 
                             error.response.data.error || 
                             (typeof error.response.data === 'string' ? error.response.data : errorMessage);
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Show the error message
            showToast(errorMessage, 'error');
        }
    };

    const openDeleteConfirm = (id, dealName) => {
        setDeleteConfirm({ show: true, dealId: id, dealName });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, dealId: null, dealName: null });
    };

    const confirmDelete = async () => {
        const { dealId } = deleteConfirm;
        if (!dealId) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.delete(`/api/dailydeals/${dealId}`, config);
            showToast('Daily deal deleted successfully!', 'success');
            closeDeleteConfirm();
            
            // Refresh deals list
            const { data } = await axios.get('/api/dailydeals');
            setDeals(data);
        } catch (error) {
            console.error('Error deleting daily deal:', error);
            showToast('Error deleting daily deal', 'error');
            closeDeleteConfirm();
        }
    };

    const toggleActiveHandler = async (deal) => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            await axios.put(
                `/api/dailydeals/${deal._id}`,
                {
                    isActive: !deal.isActive,
                },
                config
            );

            showToast('Daily deal updated successfully!', 'success');
            
            // Refresh deals list
            const { data } = await axios.get('/api/dailydeals');
            setDeals(data);
        } catch (error) {
            console.error('Error updating daily deal:', error);
            showToast('Error updating daily deal', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '1200px', padding: '0 1rem' }}>
            <Link to="/admin/dashboard" className="btn btn-outline" style={{ marginBottom: '1rem' }}>
                ← Back to Dashboard
            </Link>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Daily Deals Management</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add Daily Deal'}
                </button>
            </div>

            {showForm && (
                <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Create New Daily Deal</h2>
                    <form onSubmit={submitHandler}>
                        <div className="form-group">
                            <label className="form-label">Product <span style={{ color: 'red' }}>*</span></label>
                            <select
                                className="form-control"
                                value={selectedProduct}
                                onChange={(e) => setSelectedProduct(e.target.value)}
                                required
                            >
                                <option value="">Select a product</option>
                                {products.map((product) => (
                                    <option key={product._id} value={product._id}>
                                        {product.name} - Rs {product.price}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Deal End Time <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={endTime}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                                min={new Date().toISOString().slice(0, 16)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Discount Percentage <span style={{ color: 'red' }}>*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                value={discountPercentage}
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                required
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="e.g., 20 for 20% off"
                            />
                            <small style={{ color: '#666', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>
                                Enter the discount percentage (0-100). The discounted price will be calculated automatically.
                            </small>
                        </div>

                        <button type="submit" className="btn btn-primary btn-block">
                            Create Daily Deal
                        </button>
                    </form>
                </div>
            )}

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem' }}>Active Daily Deals</h2>
                {deals.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                        No daily deals found. Create one above.
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {deals.map((deal) => (
                            <div
                                key={deal._id}
                                className="card"
                                style={{
                                    padding: '1.5rem',
                                    border: `2px solid ${deal.isActive ? 'var(--accent-color)' : '#e2e8f0'}`,
                                    opacity: deal.isActive ? 1 : 0.7,
                                }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '1rem', alignItems: 'center' }}>
                                    <div>
                                        {deal.product ? (
                                            <>
                                                <h3 style={{ marginBottom: '0.5rem' }}>{deal.product.name}</h3>
                                                <p style={{ color: '#666', marginBottom: '0.5rem' }}>
                                                    Original Price: Rs {deal.product.price}
                                                    {deal.discountPercentage > 0 && (
                                                        <>
                                                            <br />
                                                            Discount: {deal.discountPercentage}% off
                                                            <br />
                                                            <strong style={{ color: 'var(--accent-color)' }}>
                                                                Deal Price: Rs {(
                                                                    deal.product.price * (1 - deal.discountPercentage / 100)
                                                                ).toFixed(2)}
                                                            </strong>
                                                        </>
                                                    )}
                                                </p>
                                                <p style={{ color: '#666', fontSize: '0.9rem' }}>
                                                    Ends: {new Date(deal.endTime).toLocaleString()}
                                                </p>
                                            </>
                                        ) : (
                                            <p>Product not found</p>
                                        )}
                                    </div>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => toggleActiveHandler(deal)}
                                        style={{ whiteSpace: 'nowrap' }}
                                    >
                                        {deal.isActive ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        className="btn"
                                        onClick={() => openDeleteConfirm(deal._id, deal.product?.name || 'this deal')}
                                        style={{
                                            background: 'var(--error-color)',
                                            color: 'white',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Premium Delete Confirmation Modal */}
            {deleteConfirm.show && (
                <div
                    className="premium-delete-modal-overlay"
                    onClick={closeDeleteConfirm}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.75)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10000,
                        padding: '1rem',
                        animation: 'fadeIn 0.3s ease'
                    }}
                >
                    <div
                        className="premium-delete-modal"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '2rem',
                            maxWidth: '500px',
                            width: '100%',
                            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)',
                            position: 'relative',
                            animation: 'zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '1px solid rgba(210, 168, 65, 0.2)'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeDeleteConfirm}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '1.5rem',
                                color: '#666',
                                cursor: 'pointer',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#f3f4f6';
                                e.currentTarget.style.color = '#000';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = '#666';
                            }}
                            aria-label="Close"
                        >
                            <FaTimes />
                        </button>

                        {/* Warning Icon */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginBottom: '1.5rem'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '3px solid rgba(239, 68, 68, 0.2)'
                            }}>
                                <FaExclamationTriangle 
                                    style={{ 
                                        fontSize: '2.5rem', 
                                        color: '#ef4444' 
                                    }} 
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            textAlign: 'center',
                            marginBottom: '1rem',
                            color: '#1f2937',
                            letterSpacing: '-0.01em'
                        }}>
                            Delete Daily Deal?
                        </h2>

                        {/* Message */}
                        <p style={{
                            fontSize: '1rem',
                            color: '#6b7280',
                            textAlign: 'center',
                            lineHeight: '1.6',
                            marginBottom: '2rem',
                            padding: '0 1rem'
                        }}>
                            Are you sure you want to delete <strong style={{ color: '#1f2937' }}>"{deleteConfirm.dealName}"</strong>? This action cannot be undone.
                        </p>

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '1rem',
                            justifyContent: 'center'
                        }}>
                            <button
                                onClick={closeDeleteConfirm}
                                className="premium-modal-cancel-btn"
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '12px',
                                    border: '2px solid #e5e7eb',
                                    background: 'white',
                                    color: '#374151',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    flex: 1,
                                    maxWidth: '150px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = '#f9fafb';
                                    e.currentTarget.style.borderColor = '#d1d5db';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'white';
                                    e.currentTarget.style.borderColor = '#e5e7eb';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="premium-modal-delete-btn"
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                                    flex: 1,
                                    maxWidth: '150px'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDailyDeals;

