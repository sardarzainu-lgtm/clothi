import React from 'react';
import { Link } from 'react-router-dom';
import { FaFileContract, FaShoppingBag, FaUndo, FaExclamationTriangle, FaGavel } from 'react-icons/fa';

const TermsAndConditions = () => {
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
                        <FaFileContract size={40} color="#d2a841" />
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
                        Terms & Conditions
                    </h1>
                    <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Please read these terms carefully before using our services. By using our website, you agree to be bound by these terms.
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
                                    <FaGavel size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    1. Acceptance of Terms
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    By accessing and using <strong style={{ color: '#d2a841' }}>MAKHMAL JAN (CLOTHI)</strong> website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our services.
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
                                    <FaShoppingBag size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    2. Products and Pricing
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Product Information:</strong> We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Pricing:</strong> All prices are displayed in Pakistani Rupees (PKR) unless otherwise stated. Prices are subject to change without notice. We reserve the right to correct any pricing errors.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Availability:</strong> Product availability is subject to change. We reserve the right to limit quantities and refuse or cancel orders if products are unavailable.
                                </p>
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
                                    <FaShoppingBag size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    3. Orders and Payment
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Order Acceptance:</strong> Your order is an offer to purchase products from us. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or suspected fraud.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Payment:</strong> Payment must be received before we ship your order. We accept various payment methods as displayed during checkout. All payments are processed securely through encrypted connections.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Order Confirmation:</strong> You will receive an email confirmation once your order is placed. This confirmation does not constitute acceptance of your order.
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
                                    <FaUndo size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    4. Returns and Refunds
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Return Policy:</strong> We want you to be completely satisfied with your purchase. If you are not satisfied, you may return eligible items within 7 days of delivery.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Return Conditions:</strong>
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
                                        Items must be unused, unwashed, and in original condition with tags attached
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
                                        Original packaging and receipt must be included
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
                                        Sale items and personalized products may not be eligible for return
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
                                        Return shipping costs are the responsibility of the customer unless the item is defective
                                    </li>
                                </ul>
                                <p style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Refunds:</strong> Once we receive and inspect your returned item, we will process your refund within 5-7 business days. Refunds will be issued to the original payment method.
                                </p>
                            </div>
                        </section>

                        {/* Section 5 */}
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
                                    <FaShoppingBag size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    5. Shipping and Delivery
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Shipping:</strong> We ship throughout Pakistan. Shipping costs and estimated delivery times are calculated at checkout based on your location and selected shipping method.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Delivery:</strong> We are not responsible for delays caused by shipping carriers or customs. Delivery times are estimates and not guaranteed.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Risk of Loss:</strong> Risk of loss and title for products pass to you upon delivery to the carrier.
                                </p>
                            </div>
                        </section>

                        {/* Section 6 */}
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
                                    <FaExclamationTriangle size={24} color="#d2a841" />
                                </div>
                                <h2 style={{
                                    fontSize: '1.75rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    6. Intellectual Property
                                </h2>
                            </div>
                            <div style={{ paddingLeft: '4rem' }}>
                                <p style={{ marginBottom: '1rem' }}>
                                    All content on this website, including text, graphics, logos, images, and software, is the property of <strong style={{ color: '#d2a841' }}>MAKHMAL JAN (CLOTHI)</strong> and is protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from any content without our express written permission.
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
                                7. User Accounts
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Account Responsibility:</strong> You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
                                </p>
                                <p style={{ marginBottom: '1rem' }}>
                                    <strong style={{ color: '#d2a841' }}>Account Information:</strong> You agree to provide accurate, current, and complete information when creating an account and to update such information to keep it accurate, current, and complete.
                                </p>
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
                                8. Prohibited Uses
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    You agree not to use our website:
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
                                        For any unlawful purpose or to solicit others to perform unlawful acts
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
                                        To violate any international, federal, provincial, or state regulations, rules, or laws
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
                                        To infringe upon or violate our intellectual property rights or the intellectual property rights of others
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
                                        To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate
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
                                        To submit false or misleading information
                                    </li>
                                </ul>
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
                                9. Limitation of Liability
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    To the fullest extent permitted by law, <strong style={{ color: '#d2a841' }}>MAKHMAL JAN (CLOTHI)</strong> shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of our services.
                                </p>
                            </div>
                        </section>

                        {/* Section 10 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                10. Governing Law
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    These Terms and Conditions shall be governed by and construed in accordance with the laws of Pakistan, without regard to its conflict of law provisions.
                                </p>
                            </div>
                        </section>

                        {/* Section 11 */}
                        <section style={{ marginBottom: '3rem' }}>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#fff',
                                marginBottom: '1.5rem'
                            }}>
                                11. Changes to Terms
                            </h2>
                            <div>
                                <p style={{ marginBottom: '1rem' }}>
                                    We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms and Conditions on this page and updating the "Last Updated" date. Your continued use of our services after such modifications constitutes acceptance of the updated terms.
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
                                <FaGavel size={24} color="#d2a841" />
                                <h2 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#fff',
                                    margin: 0
                                }}>
                                    Questions About Terms?
                                </h2>
                            </div>
                            <p style={{ marginBottom: '1rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                                If you have any questions about these Terms and Conditions, please contact us:
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

export default TermsAndConditions;

