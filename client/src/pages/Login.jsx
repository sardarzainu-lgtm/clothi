import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();

    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const { data } = await axios.post(
                '/api/users/login',
                { email, password },
                config
            );

            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect);
            window.location.reload();
        } catch (error) {
            showToast(error.response && error.response.data.message
                ? error.response.data.message
                : error.message, 'error');
        }
    };

    const googleLoginHandler = () => {
        // Mock Google Login for demonstration
        const mockGoogleUser = {
            _id: 'google-user-id',
            name: 'Google User',
            email: 'google@example.com',
            isAdmin: false,
            token: 'mock-token',
        };
        localStorage.setItem('userInfo', JSON.stringify(mockGoogleUser));
        showToast('Logged in with Mock Google Account!', 'success');
        navigate(redirect);
        window.location.reload();
    };

    return (
        <div className="container fade-in" style={{ maxWidth: 'min(450px, 90vw)', marginTop: 'clamp(2rem, 5vh, 4rem)', padding: '0 1rem' }}>
            <div className="card" style={{
                padding: 'clamp(2rem, 4vw, 3rem)',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid rgba(99, 102, 241, 0.1)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}>
                <h1 className="text-center gradient-text" style={{ marginBottom: '0.5rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: '700' }}>Sign In</h1>
                <p className="text-center" style={{ color: '#64748b', marginBottom: '2rem' }}>Welcome back! Please sign in to your account</p>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            const { data } = await axios.post(
                                '/api/users/google-login',
                                { token: credentialResponse.credential },
                                { headers: { 'Content-Type': 'application/json' } }
                            );
                            localStorage.setItem('userInfo', JSON.stringify(data));
                            navigate(redirect);
                            window.location.reload();
                        } catch (error) {
                            showToast('Google Login Failed', 'error');
                        }
                    }}
                    onError={() => {
                        console.log('Login Failed');
                    }}
                />
            </div>

                <div style={{
                    textAlign: 'center',
                    color: '#64748b',
                    marginBottom: '1.5rem',
                    position: 'relative'
                }}>
                    <span style={{
                        background: 'white',
                        padding: '0 1rem',
                        position: 'relative',
                        zIndex: 1
                    }}>OR</span>
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: '#e2e8f0',
                        zIndex: 0
                    }}></div>
                </div>

                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#0f172a' }}>Email Address</label>
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" style={{ fontWeight: '600', color: '#0f172a' }}>Password</label>
                        <input
                            type="password"
                            className="form-control"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" style={{ marginTop: '1rem', fontWeight: '700' }}>
                        Sign In
                    </button>
                </form>

                <div className="py-1 text-center" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b' }}>New Customer? </span>
                    <Link to="/register" style={{
                        color: '#6366f1',
                        fontWeight: '700',
                        textDecoration: 'none'
                    }}>
                        Register
                    </Link>
                </div>
            </div>
        </div >
    );
};

export default Login;
