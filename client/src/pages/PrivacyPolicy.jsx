import React from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaLock, FaUserShield, FaCreditCard, FaEnvelope } from 'react-icons/fa';

const PrivacyPolicy = () => {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
            padding: '4rem 1rem',
            position: 'relative',
            overflow: 'hidden',
            marginBottom: '-32px'
        }}>
            {/* Animated Background Elements */}
            <div style={{
                position: 'absolute',
                top: '-20%',
                right: '-10%',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(210, 168, 65, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 20s ease-in-out infinite',
                filter: 'blur(40px)'
            }}></div>
            <div style={{
                position: 'absolute',
                bottom: '-15%',
                left: '-8%',
                width: '500px',
                height: '500px',
                background: 'radial-gradient(circle, rgba(244, 222, 133, 0.08) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'float 25s ease-in-out infinite reverse',
                filter: 'blur(40px)'
            }}></div>

            <div className="container" style={{
                maxWidth: '900px',
                margin: '0 auto',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '3rem',
                    animation: 'fadeInUp 0.6s ease'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(210, 168, 65, 0.2) 0%, rgba(244, 222, 133, 0.15) 100%)',
                        marginBottom: '1.5rem',
                        border: '2px solid rgba(210, 168, 65, 0.3)',
                        boxShadow: '0 0 30px rgba(210, 168, 65, 0.2)'
                    }}>
                        <FaShieldAlt size={40} color="#d2a841" />
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #f4de85 0%, #deb94f 25%, #d2a841 50%, #deb94f 75%, #f4de85 100%)',
                        backgroundSize: '200% 100%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em',
                        animation: 'shimmer 3s ease-in-out infinite'
                    }}>
                        Privacy Policy
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
                    </p>
                    <div style={{
                        marginTop: '1.5rem',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <Link to="/" className="btn btn-outline" style={{
                            borderColor: 'rgba(210, 168, 65, 0.5)',
                            color: '#d2a841'
                        }}>
                            ← Back to Home
                        </Link>
                    </div>
                </div>

                {/* Content Card */}
                <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    padding: '3rem',
                    border: '1px solid rgba(210, 168, 65, 0.2)',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(210, 168, 65, 0.1)',
                    animation: 'fadeInUp 0.8s ease 0.2s both'
                }}>
                    <div style={{ color: 'rgba(255, 255, 255, 0.9)', lineHeight: '1.8' }}>
                        <p style={{ marginBottom: '2rem', fontSize: '0.95rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                            <strong style={{ color: '#d2a841' }}>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>

                        {/* Section 1 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(210, 168, 65, 0.2) 0%, rgba(244, 222, 133, 0.15) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(210, 168, 65, 0.3)'
                                }}>
                                    <FaUserShield size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    1. Information We Collect
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    At <strong style={{ color: '#d2a841' }}>MAKHMAL JAN (CLOTHI)</strong>, we collect information that you provide directly to us when you:
                                </p>
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '1rem 0'
                                }}>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Create an account or register on our website
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Place an order for products
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Subscribe to our newsletter or marketing communications
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Contact our customer service team
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Participate in surveys or promotional activities
                                    </li>
                                </ul>
                                <p style={{ marginTop: '1.5rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Personal Information:</strong> Name, email address, phone number, shipping address, billing address, payment information (processed securely through third-party payment processors).
                                </p>
                            </div>
                        </section>

                        {/* Section 2 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(210, 168, 65, 0.2) 0%, rgba(244, 222, 133, 0.15) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(210, 168, 65, 0.3)'
                                }}>
                                    <FaLock size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    2. How We Use Your Information
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    We use the information we collect to:
                                </p>
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '1rem 0'
                                }}>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Process and fulfill your orders
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Send you order confirmations and shipping updates
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Communicate with you about products, services, and promotions
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Improve our website and customer experience
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Detect and prevent fraud or abuse
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Comply with legal obligations
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(210, 168, 65, 0.2) 0%, rgba(244, 222, 133, 0.15) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(210, 168, 65, 0.3)'
                                }}>
                                    <FaCreditCard size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    3. Payment Information
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    We understand the importance of protecting your payment information. All payment transactions are processed through secure, encrypted connections. We do not store your complete credit card information on our servers. Payment details are handled by trusted third-party payment processors that comply with PCI DSS standards.
                                </p>
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, rgba(210, 168, 65, 0.2) 0%, rgba(244, 222, 133, 0.15) 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    border: '1px solid rgba(210, 168, 65, 0.3)'
                                }}>
                                    <FaShieldAlt size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    4. Data Security
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    We implement industry-standard security measures to protect your personal information:
                                </p>
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '1rem 0'
                                }}>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        SSL/TLS encryption for data transmission
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Secure password hashing (bcrypt)
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Regular security audits and updates
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Access controls and authentication measures
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 5 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                5. Cookies and Tracking
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings.
                                </p>
                            </div>
                        </section>

                        {/* Section 6 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                6. Third-Party Services
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    We may share your information with trusted third-party service providers who assist us in operating our website, conducting business, or serving our customers. These parties are contractually obligated to keep your information confidential and use it only for the purposes we specify.
                                </p>
                            </div>
                        </section>

                        {/* Section 7 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                7. Your Rights
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    You have the right to:
                                </p>
                                <ul style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    margin: '1rem 0'
                                }}>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Access and review your personal information
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Request correction of inaccurate data
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Request deletion of your personal information
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative',
                                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Opt-out of marketing communications
                                    </li>
                                    <li style={{
                                        padding: '0.75rem 0',
                                        paddingLeft: '2rem',
                                        position: 'relative'
                                    }}>
                                        <span style={{
                                            position: 'absolute',
                                            left: 0,
                                            color: '#d2a841'
                                        }}>•</span>
                                        Withdraw consent for data processing
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* Section 8 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                8. Children's Privacy
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately.
                                </p>
                            </div>
                        </section>

                        {/* Section 9 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                9. Changes to This Policy
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
                                </p>
                            </div>
                        </section>

                        {/* Contact Section */}
                        <section style={{
                            marginTop: '3rem',
                            padding: '2rem',
                            background: 'rgba(210, 168, 65, 0.1)',
                            borderRadius: '16px',
                            border: '1px solid rgba(210, 168, 65, 0.2)'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                marginBottom: '1rem'
                            }}>
                                <FaEnvelope size={24} color="#d2a841" />
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    Contact Us
                                </h2>
                            </div>
                            <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
                            </p>
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.5rem',
                                color: 'rgba(255, 255, 255, 0.9)'
                            }}>
                                <p style={{ margin: 0 }}>
                                    <strong style={{ color: '#d2a841' }}>Email:</strong> officialmakhmal@gmail.com
                                </p>
                                <p style={{ margin: 0 }}>
                                    <strong style={{ color: '#d2a841' }}>Phone:</strong> +92 315-1327729
                                </p>
                            </div>
                        </section>
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
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
};

export default PrivacyPolicy;

