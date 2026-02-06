import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaExclamationTriangle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [deleteConfirm, setDeleteConfirm] = useState({ show: false, productId: null, productName: null });

    const { showToast } = useToast();
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const { data } = await axios.get('/api/products');
            console.log('Admin ProductList: Products fetched:', data.length, 'products');
            setProducts(data);
            if (data.length === 0) {
                showToast('No products found. Create your first product!', 'info');
            }
        } catch (error) {
            console.error('Admin ProductList: Error fetching products:', error);
            console.error('Error details:', error.response?.data || error.message);
            showToast(
                error.response?.data?.message || error.message || 'Error fetching products. Make sure the backend server is running.',
                'error'
            );
        }
    };

    const openDeleteConfirm = (id, productName) => {
        setDeleteConfirm({ show: true, productId: id, productName });
    };

    const closeDeleteConfirm = () => {
        setDeleteConfirm({ show: false, productId: null, productName: null });
    };

    const confirmDelete = async () => {
        const { productId } = deleteConfirm;
        if (!productId) return;

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            await axios.delete(`/api/products/${productId}`, config);
            showToast('Product deleted successfully!', 'success');
            closeDeleteConfirm();
            fetchProducts();
        } catch (error) {
            showToast('Error deleting product', 'error');
            closeDeleteConfirm();
        }
    };

    const createProductHandler = async () => {
        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post('/api/products', {}, config);
            window.location.href = `/admin/product/${data._id}/edit`;
        } catch (error) {
            showToast('Error creating product:', error);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: window.innerWidth < 480 ? 'column' : 'row', justifyContent: 'space-between', alignItems: window.innerWidth < 480 ? 'flex-start' : 'center', marginBottom: '2rem', gap: '1rem' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}>Products</h1>
                <button className="btn btn-primary" onClick={createProductHandler} style={{ whiteSpace: 'nowrap' }}>
                    <FaPlus /> Create Product
                </button>
            </div>

            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>

                <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', fontSize: window.innerWidth < 768 ? '0.875rem' : '1rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
                            <th className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>ID</th>
                            <th className="py-1">NAME</th>
                            <th className="py-1">PRICE</th>
                            <th className="py-1">CATEGORY</th>
                            <th className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>BRAND</th>
                            <th className="py-1">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>{product._id}</td>
                                <td className="py-1">{product.name}</td>
                                <td className="py-1">Rs {product.price}</td>
                                <td className="py-1">{product.category}</td>
                                <td className="py-1" style={{ display: window.innerWidth < 768 ? 'none' : 'table-cell' }}>{product.brand}</td>
                                <td className="py-1" style={{ whiteSpace: 'nowrap' }}>
                                    <Link to={`/admin/product/${product._id}/edit`} className="btn btn-outline" style={{ padding: '5px 10px', marginRight: '5px', fontSize: '0.875rem' }}>
                                        <FaEdit />
                                    </Link>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => openDeleteConfirm(product._id, product.name)}
                                        style={{ padding: '5px 10px', color: 'red', borderColor: 'red', fontSize: '0.875rem' }}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
                            Delete Product?
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
                            Are you sure you want to delete <strong style={{ color: '#1f2937' }}>"{deleteConfirm.productName}"</strong>? This action cannot be undone and will permanently remove the product from your store.
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

export default ProductList;
