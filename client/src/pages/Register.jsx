import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const { showToast } = useToast();
    const redirect = new URLSearchParams(window.location.search).get('redirect') || '/';

    const submitHandler = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
        } else {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                };

                const { data } = await axios.post(
                    '/api/users',
                    { name, email, password },
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
        }
    };

    return (
        <div className="container" style={{ maxWidth: 'min(400px, 90vw)', marginTop: 'clamp(2rem, 5vh, 4rem)', padding: '0 1rem' }}>
            <h1 className="text-center" style={{ marginBottom: '2rem' }}>Sign Up</h1>

            <button
                className="btn btn-block btn-outline"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '1.5rem' }}
            >
                <FaGoogle /> Sign up with Google
            </button>

            <div style={{ textAlign: 'center', color: '#666', marginBottom: '1.5rem' }}>
                OR
            </div>

            <form onSubmit={submitHandler}>
                <div className="form-group">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Enter email"
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

                <button type="submit" className="btn btn-primary btn-block">
                    Register
                </button>
            </form>

            <div className="py-1 text-center">
                Have an Account? <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: '600' }}>Login</Link>
            </div>
        </div>
    );
};

export default Register;
