import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [originalPrice, setOriginalPrice] = useState(0);
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [isOnSale, setIsOnSale] = useState(false);
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setOriginalPrice(data.originalPrice || data.price);
                setDiscountPercentage(data.discountPercentage || 0);
                setIsOnSale(data.isOnSale || false);
                setImage(data.image);
                setBrand(data.brand);
                setCategory(data.category);
                setCountInStock(data.countInStock);
                setDescription(data.description);
            } catch (error) {
                showToast('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            setImage(data);
            setUploading(false);
        } catch (error) {
            showToast('Error uploading image:', error);
            setUploading(false);
        }
    };

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

            await axios.put(
                `/api/products/${id}`,
                {
                    name,
                    price,
                    originalPrice: isOnSale ? originalPrice : null,
                    discountPercentage: isOnSale ? discountPercentage : 0,
                    isOnSale,
                    image,
                    brand,
                    category,
                    countInStock,
                    description,
                },
                config
            );
            navigate('/admin/products');
        } catch (error) {
            showToast('Error updating product:', error);
        }
    };

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: 'min(600px, 95vw)', padding: '0 1rem' }}>
            <Link to="/admin/products" className="btn btn-outline" style={{ marginBottom: '1rem' }}>
                Go Back
            </Link>

            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1.5rem' }}>Edit Product</h1>

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
                    <label className="form-label">
                        <input
                            type="checkbox"
                            checked={isOnSale}
                            onChange={(e) => {
                                setIsOnSale(e.target.checked);
                                if (!e.target.checked) {
                                    setDiscountPercentage(0);
                                    setOriginalPrice(price);
                                }
                            }}
                            style={{ marginRight: '8px' }}
                        />
                        Product is on Sale
                    </label>
                </div>

                {isOnSale && (
                    <>
                        <div className="form-group">
                            <label className="form-label">Original Price (Before Discount)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={originalPrice}
                                onChange={(e) => {
                                    const origPrice = parseFloat(e.target.value) || 0;
                                    setOriginalPrice(origPrice);
                                    if (origPrice > 0 && price > 0) {
                                        const discount = Math.round(((origPrice - price) / origPrice) * 100);
                                        setDiscountPercentage(discount);
                                    }
                                }}
                                placeholder="Enter original price"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Discount Percentage (%)</label>
                            <input
                                type="number"
                                className="form-control"
                                value={discountPercentage}
                                onChange={(e) => {
                                    const discount = parseFloat(e.target.value) || 0;
                                    setDiscountPercentage(discount);
                                    if (originalPrice > 0 && discount > 0) {
                                        const discountedPrice = originalPrice * (1 - discount / 100);
                                        setPrice(Math.round(discountedPrice * 100) / 100);
                                    }
                                }}
                                min="0"
                                max="100"
                                placeholder="Enter discount percentage"
                            />
                        </div>
                    </>
                )}

                <div className="form-group">
                    <label className="form-label">Current Price (Sale Price if on sale)</label>
                    <input
                        type="number"
                        className="form-control"
                        value={price}
                        onChange={(e) => {
                            const newPrice = parseFloat(e.target.value) || 0;
                            setPrice(newPrice);
                            if (isOnSale && originalPrice > 0 && newPrice > 0) {
                                const discount = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
                                setDiscountPercentage(discount);
                            }
                        }}
                    />
                    {isOnSale && originalPrice > 0 && (
                        <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>
                            {discountPercentage > 0 ? `${discountPercentage}% OFF` : 'No discount calculated'}
                        </small>
                    )}
                </div>

                <div className="form-group">
                    <label className="form-label">Image</label>
                    <input
                        type="text"
                        className="form-control"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        style={{ marginBottom: '10px' }}
                    />
                    <input
                        type="file"
                        onChange={uploadFileHandler}
                        className="form-control"
                        accept="image/*"
                    />
                    {uploading && <div>Uploading...</div>}
                </div>

                <div className="form-group">
                    <label className="form-label">Brand</label>
                    <input
                        type="text"
                        className="form-control"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Category</label>
                    <select
                        className="form-control"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                        <option value="Kids">Kids</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label">Count In Stock</label>
                    <input
                        type="number"
                        className="form-control"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Description</label>
                    <textarea
                        className="form-control"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                    ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-block">
                    Update
                </button>
            </form>
        </div>
    );
};

export default ProductEdit;
