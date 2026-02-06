import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const AdminSettings = () => {
    const [heroImage, setHeroImage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data } = await axios.get('/api/settings');
                setHeroImage(data.heroImage || '');
                setLoading(false);
            } catch (error) {
                console.error('Error fetching settings:', error);
                showToast('Error fetching settings', 'error');
                setLoading(false);
            }
        };
        fetchSettings();
    }, [showToast]);

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const userInfo = JSON.parse(localStorage.getItem('userInfo'));
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            setHeroImage(data);
            setUploading(false);
            showToast('Image uploaded successfully!', 'success');
        } catch (error) {
            console.error('Error uploading image:', error);
            showToast('Error uploading image', 'error');
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
                '/api/settings',
                { heroImage },
                config
            );
            showToast('Settings updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating settings:', error);
            showToast('Error updating settings', 'error');
        }
    };

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '800px', padding: '0 1rem' }}>
            <Link to="/admin/dashboard" className="btn btn-outline" style={{ marginBottom: '1rem' }}>
                ← Back to Dashboard
            </Link>

            <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)', marginBottom: '1.5rem' }}>Site Settings</h1>

            <div className="card" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Homepage Hero Image</h2>
                
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label">Hero Image URL</label>
                        <input
                            type="text"
                            className="form-control"
                            value={heroImage}
                            onChange={(e) => setHeroImage(e.target.value)}
                            placeholder="Enter image URL or upload an image"
                            style={{ marginBottom: '10px' }}
                        />
                        <input
                            type="file"
                            onChange={uploadFileHandler}
                            className="form-control"
                            accept="image/*"
                        />
                        {uploading && <div style={{ marginTop: '10px', color: '#666' }}>Uploading...</div>}
                    </div>

                    {heroImage && (
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">Preview</label>
                            <div style={{
                                width: '100%',
                                height: '300px',
                                borderRadius: '8px',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                marginTop: '10px'
                            }}>
                                <img
                                    src={heroImage}
                                    alt="Hero preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.parentElement.innerHTML = '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: #999;">Image not found</div>';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-block">
                        Save Settings
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdminSettings;

