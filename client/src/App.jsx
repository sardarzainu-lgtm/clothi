import React, { lazy, Suspense } from 'react';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Navbar from './components/Navbar';
import WhatsAppFloat from './components/WhatsAppFloat';
import LoadingProgress from './components/LoadingProgress';
import TopBanner from './components/TopBanner';
import { SkeletonProductList } from './components/SkeletonLoader';
import { FaHome, FaShoppingBag, FaShoppingCart, FaTag, FaShieldAlt, FaFileContract, FaEnvelope, FaPhone } from 'react-icons/fa';

// Lazy load routes for code splitting (except Shop which is critical)
import Shop from './pages/Shop';
import Home from './pages/Home';
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminSettings = lazy(() => import('./pages/AdminSettings'));
const AdminDailyDeals = lazy(() => import('./pages/AdminDailyDeals'));
const ProductList = lazy(() => import('./pages/ProductList'));
const OrderList = lazy(() => import('./pages/OrderList'));
const Profile = lazy(() => import('./pages/Profile'));
const ProductEdit = lazy(() => import('./pages/ProductEdit'));
const OrderDetails = lazy(() => import('./pages/OrderDetails'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const DailyDeals = lazy(() => import('./pages/DailyDeals'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));

function App() {
    return (
        <ToastProvider>
            <RecentlyViewedProvider>
                <WishlistProvider>
                    <CartProvider>
                        <Router>
                            <ScrollToTop />
                            <LoadingProgress />
                            <TopBanner />
                            <Navbar />
                            <main style={{ minHeight: '80vh' }}>
                                <Suspense fallback={
                                    <div style={{ 
                                        padding: '2rem', 
                                        paddingBottom: 'calc(2rem + 32px)',
                                        textAlign: 'center',
                                        minHeight: 'calc(50vh + 32px)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 50%, #1e293b 75%, #0f172a 100%)',
                                        position: 'relative',
                                        overflow: 'visible',
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
                                        
                                        {/* Loading spinner */}
                                        <div style={{
                                            position: 'relative',
                                            zIndex: 2,
                                            marginBottom: '2rem'
                                        }}>
                                            <div style={{
                                                width: '80px',
                                                height: '80px',
                                                border: '4px solid rgba(210, 168, 65, 0.2)',
                                                borderTop: '4px solid #d2a841',
                                                borderRight: '4px solid #deb94f',
                                                borderRadius: '50%',
                                                animation: 'spin 1s linear infinite',
                                                boxShadow: '0 0 30px rgba(210, 168, 65, 0.5)',
                                                position: 'relative'
                                            }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                    width: '60px',
                                                    height: '60px',
                                                    border: '3px solid rgba(244, 222, 133, 0.3)',
                                                    borderTop: '3px solid #f4de85',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.8s linear infinite reverse'
                                                }}></div>
                                            </div>
                                        </div>
                                        
                                        {/* Loading text */}
                                        <div style={{
                                            position: 'relative',
                                            zIndex: 2
                                        }}>
                                            <h2 style={{
                                                fontSize: '2rem',
                                                fontWeight: '700',
                                                marginBottom: '0.75rem',
                                                background: 'linear-gradient(135deg, #f4de85 0%, #deb94f 25%, #d2a841 50%, #deb94f 75%, #f4de85 100%)',
                                                backgroundSize: '200% 100%',
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundClip: 'text',
                                                letterSpacing: '-0.02em',
                                                animation: 'shimmer 3s ease-in-out infinite',
                                                textShadow: '0 0 30px rgba(210, 168, 65, 0.3)'
                                            }}>
                                                Loading...
                                            </h2>
                                            <p style={{
                                                color: 'rgba(255, 255, 255, 0.7)',
                                                fontSize: '1rem',
                                                fontWeight: '400',
                                                letterSpacing: '0.01em'
                                            }}>
                                                Please wait while we prepare everything for you
                                            </p>
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
                                            @keyframes spin {
                                                0% { transform: rotate(0deg); }
                                                100% { transform: rotate(360deg); }
                                            }
                                        `}</style>
                                    </div>
                                }>
                                    <Routes>
                                        <Route path="/login" element={<Login />} />
                                        <Route path="/register" element={<Register />} />
                                        <Route path="/profile" element={<Profile />} />
                                        <Route path="/" element={<Home />} />
                                        <Route path="/shop" element={<Shop />} />
                                        <Route path="/daily-deals" element={<DailyDeals />} />
                                        <Route path="/product/:id" element={<ProductDetails />} />
                                        <Route path="/cart" element={<Cart />} />
                                        <Route path="/checkout" element={<Checkout />} />

                                        {/* Admin Routes */}
                                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                        <Route path="/admin/settings" element={<AdminSettings />} />
                                        <Route path="/admin/daily-deals" element={<AdminDailyDeals />} />
                                        <Route path="/admin/products" element={<ProductList />} />
                                        <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
                                        <Route path="/admin/orders" element={<OrderList />} />
                                        <Route path="/order/:id" element={<OrderDetails />} />
                                        <Route path="/wishlist" element={<Wishlist />} />
                                        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                                    </Routes>
                                </Suspense>
                            </main>
                            <footer>
                                <div className="container">
                                    <div>
                                        <h3>MAKHMAL JAN</h3>
                                        <p>
                                            Your one-stop destination for premium fashion. Discover the latest trends and timeless classics.
                                        </p>
                                    </div>
                                    <div>
                                        <h4>Quick Links</h4>
                                        <ul>
                                            <li>
                                                <a href="/">
                                                    <FaHome className="footer-link-icon" />
                                                    Home
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/shop">
                                                    <FaShoppingBag className="footer-link-icon" />
                                                    Shop
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/cart">
                                                    <FaShoppingCart className="footer-link-icon" />
                                                    Cart
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/daily-deals">
                                                    <FaTag className="footer-link-icon" />
                                                    Daily Deals
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4>Legal</h4>
                                        <ul>
                                            <li>
                                                <a href="/privacy-policy">
                                                    <FaShieldAlt className="footer-link-icon" />
                                                    Privacy Policy
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/terms-and-conditions">
                                                    <FaFileContract className="footer-link-icon" />
                                                    Terms & Conditions
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4>Contact</h4>
                                        <p>
                                            <span>
                                                <FaEnvelope className="footer-contact-icon" />
                                                Email: officialmakhmal@gmail.com
                                            </span>
                                            <span>
                                                <FaPhone className="footer-contact-icon" />
                                                Phone: +92 315-1327729
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    Copyright &copy; {new Date().getFullYear()} CLOTHI. All rights reserved.
                                </div>
                            </footer>
                        </Router>
                    </CartProvider>
                </WishlistProvider>
            </RecentlyViewedProvider>

            {/* WhatsApp Floating Button - Change phoneNumber to your WhatsApp number with country code */}
            <WhatsAppFloat
                phoneNumber="1234567890"
                message="Hello! I'm interested in your products from CLOTHI."
            />
        </ToastProvider>
    );
}

export default App;
