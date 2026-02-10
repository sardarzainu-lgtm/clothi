import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useToast } from '../context/ToastContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState({ email: false, password: false });
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

    return (
        <div className="login-container" style={{
            minHeight: 'calc(100vh + 32px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 1rem',
            paddingBottom: 'calc(2rem + 32px)',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '-32px'
        }}>
            {/* Premium animated background elements */}
            <div style={{
                position: 'absolute',
                top: '-40%',
                right: '-15%',
                width: '800px',
                height: '800px',
                background: 'radial-gradient(circle, rgba(210, 168, 65, 0.15) 0%, rgba(210, 168, 65, 0.05) 40%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 25s ease-in-out infinite',
                filter: 'blur(60px)'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-35%',
                left: '-10%',
                width: '700px',
                height: '700px',
                background: 'radial-gradient(circle, rgba(244, 222, 133, 0.12) 0%, rgba(244, 222, 133, 0.04) 40%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 30s ease-in-out infinite reverse',
                filter: 'blur(60px)'
            }}></div>
            <div style={{
                position: 'absolute',
                top: '20%',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(210, 168, 65, 0.08) 0%, transparent 60%)',
                borderRadius: '50%',
                animation: 'pulse 15s ease-in-out infinite',
                filter: 'blur(80px)'
            }}></div>
            
            {/* Subtle grid pattern overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: '-32px',
                backgroundImage: `
                    linear-gradient(rgba(210, 168, 65, 0.03) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(210, 168, 65, 0.03) 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px',
                opacity: 0.4
            }}></div>

            <div className="fade-in login-form-container" style={{
                width: '100%',
                maxWidth: '520px',
                position: 'relative',
                zIndex: 1
            }}>
                <div className="login-form-card" style={{
                    background: 'rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(40px) saturate(180%)',
                    WebkitBackdropFilter: 'blur(40px) saturate(180%)',
                    borderRadius: '32px',
                    padding: '3.5rem 3rem',
                    boxShadow: `
                        0 8px 32px rgba(0, 0, 0, 0.4),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.2),
                        inset 0 -1px 0 rgba(0, 0, 0, 0.1)
                    `,
                    border: '1px solid rgba(255, 255, 255, 0.18)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Premium gradient border glow */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: 'linear-gradient(90deg, #d2a841 0%, #f4de85 25%, #deb94f 50%, #f4de85 75%, #d2a841 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 4s ease-in-out infinite',
                        boxShadow: '0 0 20px rgba(210, 168, 65, 0.5)'
                    }}></div>
                    
                    {/* Subtle inner glow */}
                    <div style={{
                        position: 'absolute',
                        top: '20%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '300px',
                        height: '300px',
                        background: 'radial-gradient(circle, rgba(210, 168, 65, 0.1) 0%, transparent 70%)',
                        borderRadius: '50%',
                        filter: 'blur(40px)',
                        opacity: 0.6
                    }}></div>

                    {/* Header */}
                    <div className="login-header" style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
                        <h1 style={{
                            fontSize: '2.75rem',
                            fontWeight: '800',
                            marginBottom: '0.75rem',
                            background: 'linear-gradient(135deg, #f4de85 0%, #deb94f 25%, #d2a841 50%, #deb94f 75%, #f4de85 100%)',
                            backgroundSize: '200% 100%',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            letterSpacing: '-0.03em',
                            animation: 'shimmer 4s ease-in-out infinite',
                            textShadow: '0 0 30px rgba(210, 168, 65, 0.3)',
                            lineHeight: '1.2'
                        }}>
                            Sign In
                        </h1>
                        <p style={{
                            color: 'rgba(255, 255, 255, 0.7)',
                            fontSize: '1rem',
                            fontWeight: '400',
                            margin: 0,
                            letterSpacing: '0.01em'
                        }}>
                            Welcome back! Please sign in to your account
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <div style={{
                        marginBottom: '2.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <div style={{
                            width: '100%',
                            maxWidth: '100%',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            position: 'relative',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.2)';
                            e.currentTarget.style.transform = 'translateY(-2px) scale(1.01)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        }}
                        >
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
                    </div>

                    {/* Divider */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '2.5rem',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent)'
                        }}></div>
                        <span style={{
                            padding: '0 1.25rem',
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            background: 'transparent',
                            position: 'relative',
                            letterSpacing: '0.1em'
                        }}>OR</span>
                        <div style={{
                            flex: 1,
                            height: '1px',
                            background: 'linear-gradient(to left, transparent, rgba(255, 255, 255, 0.2), transparent)'
                        }}></div>
                    </div>

                    {/* Form */}
                    <form onSubmit={submitHandler} style={{ position: 'relative', zIndex: 2 }}>
                        {/* Email Field */}
                        <div style={{ marginBottom: '1.75rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.625rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                letterSpacing: '0.02em'
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaEnvelope style={{
                                    position: 'absolute',
                                    left: '1.25rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: isFocused.email ? '#f4de85' : 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    filter: isFocused.email ? 'drop-shadow(0 0 8px rgba(244, 222, 133, 0.6))' : 'none'
                                }} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onFocus={() => setIsFocused({ ...isFocused, email: true })}
                                    onBlur={() => setIsFocused({ ...isFocused, email: email.length > 0 })}
                                    placeholder="Enter your email"
                                    required
                                    style={{
                                        width: '100%',
                                        height: '56px',
                                        padding: '0 1.25rem 0 3rem',
                                        fontSize: '1rem',
                                        border: `2px solid ${isFocused.email ? 'rgba(244, 222, 133, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                                        borderRadius: '16px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        color: '#ffffff',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        outline: 'none',
                                        boxShadow: isFocused.email 
                                            ? '0 0 0 4px rgba(244, 222, 133, 0.15), 0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                                            : '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div style={{ marginBottom: '2.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.625rem',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: 'rgba(255, 255, 255, 0.9)',
                                letterSpacing: '0.02em'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <FaLock style={{
                                    position: 'absolute',
                                    left: '1.25rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: isFocused.password ? '#f4de85' : 'rgba(255, 255, 255, 0.5)',
                                    fontSize: '1.1rem',
                                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                    pointerEvents: 'none',
                                    zIndex: 1,
                                    filter: isFocused.password ? 'drop-shadow(0 0 8px rgba(244, 222, 133, 0.6))' : 'none'
                                }} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onFocus={() => setIsFocused({ ...isFocused, password: true })}
                                    onBlur={() => setIsFocused({ ...isFocused, password: password.length > 0 })}
                                    placeholder="Enter your password"
                                    required
                                    style={{
                                        width: '100%',
                                        height: '56px',
                                        padding: '0 1.25rem 0 3rem',
                                        paddingRight: '3.5rem',
                                        fontSize: '1rem',
                                        border: `2px solid ${isFocused.password ? 'rgba(244, 222, 133, 0.6)' : 'rgba(255, 255, 255, 0.15)'}`,
                                        borderRadius: '16px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        backdropFilter: 'blur(10px)',
                                        color: '#ffffff',
                                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                        outline: 'none',
                                        boxShadow: isFocused.password 
                                            ? '0 0 0 4px rgba(244, 222, 133, 0.15), 0 8px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                                            : '0 4px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: 'none',
                                        color: 'rgba(255, 255, 255, 0.7)',
                                        cursor: 'pointer',
                                        padding: '0.625rem',
                                        fontSize: '1.1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        borderRadius: '10px',
                                        backdropFilter: 'blur(10px)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#f4de85';
                                        e.target.style.background = 'rgba(244, 222, 133, 0.2)';
                                        e.target.style.transform = 'translateY(-50%) scale(1.1)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = 'rgba(255, 255, 255, 0.7)';
                                        e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                                        e.target.style.transform = 'translateY(-50%) scale(1)';
                                    }}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                height: '56px',
                                background: 'linear-gradient(135deg, #d2a841 0%, #deb94f 25%, #f4de85 50%, #deb94f 75%, #d2a841 100%)',
                                backgroundSize: '200% 100%',
                                border: 'none',
                                borderRadius: '16px',
                                color: 'white',
                                fontSize: '1.05rem',
                                fontWeight: '700',
                                letterSpacing: '0.03em',
                                cursor: 'pointer',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 8px 24px rgba(210, 168, 65, 0.4), 0 4px 12px rgba(210, 168, 65, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-3px) scale(1.02)';
                                e.target.style.boxShadow = '0 12px 32px rgba(210, 168, 65, 0.5), 0 6px 16px rgba(210, 168, 65, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)';
                                e.target.style.backgroundPosition = '100% 50%';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0) scale(1)';
                                e.target.style.boxShadow = '0 8px 24px rgba(210, 168, 65, 0.4), 0 4px 12px rgba(210, 168, 65, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)';
                                e.target.style.backgroundPosition = '0% 50%';
                            }}
                        >
                            <span style={{ position: 'relative', zIndex: 1 }}>Sign In</span>
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                                transition: 'left 0.5s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.left = '100%';
                            }}
                            ></div>
                        </button>
                    </form>

                    {/* Footer Link */}
                    <div style={{
                        textAlign: 'center',
                        marginTop: '2.5rem',
                        paddingTop: '2.5rem',
                        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <span style={{
                            color: 'rgba(255, 255, 255, 0.6)',
                            fontSize: '0.9375rem',
                            fontWeight: '400'
                        }}>
                            New Customer?{' '}
                        </span>
                        <Link
                            to="/register"
                            style={{
                                color: '#f4de85',
                                fontWeight: '700',
                                textDecoration: 'none',
                                fontSize: '0.9375rem',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderBottom: '2px solid transparent',
                                textShadow: '0 0 10px rgba(244, 222, 133, 0.3)'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = '#deb94f';
                                e.target.style.borderBottomColor = '#deb94f';
                                e.target.style.textShadow = '0 0 15px rgba(244, 222, 133, 0.5)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = '#f4de85';
                                e.target.style.borderBottomColor = 'transparent';
                                e.target.style.textShadow = '0 0 10px rgba(244, 222, 133, 0.3)';
                            }}
                        >
                            Create an account
                        </Link>
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    33% { transform: translate(30px, -30px) rotate(5deg); }
                    66% { transform: translate(-20px, 20px) rotate(-5deg); }
                }
                @keyframes shimmer {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.4; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.6; transform: translateX(-50%) scale(1.1); }
                }
                input::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }
                
                /* Responsive Styles */
                @media (max-width: 768px) {
                    .login-container {
                        padding: 1rem !important;
                        padding-bottom: calc(1rem + 32px) !important;
                    }
                    .login-form-card {
                        padding: 2rem 1.5rem !important;
                        border-radius: 24px !important;
                    }
                    .login-header h1 {
                        font-size: 2rem !important;
                        margin-bottom: 0.5rem !important;
                    }
                    .login-header p {
                        font-size: 0.9rem !important;
                    }
                    .login-form-container {
                        max-width: 100% !important;
                    }
                }
                
                @media (max-width: 480px) {
                    .login-container {
                        padding: 0.75rem !important;
                        padding-bottom: calc(0.75rem + 32px) !important;
                    }
                    .login-form-card {
                        padding: 1.5rem 1rem !important;
                        border-radius: 20px !important;
                    }
                    .login-header h1 {
                        font-size: 1.75rem !important;
                    }
                    .login-header {
                        margin-bottom: 2rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Login;
