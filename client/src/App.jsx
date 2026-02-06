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
import { SkeletonProductList } from './components/SkeletonLoader';

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

function App() {
    return (
        <ToastProvider>
            <RecentlyViewedProvider>
                <WishlistProvider>
                    <CartProvider>
                        <Router>
                            <ScrollToTop />
                            <LoadingProgress />
                            <div className="top-banner">
                                <div className="top-banner-content">
                                    <span className="top-banner-text">WINTER SALE: UP TO 30%-50% OFF</span>
                                </div>
                            </div>
                            <Navbar />
                            <main style={{ minHeight: '80vh' }}>
                                <Suspense fallback={
                                    <div style={{ 
                                        padding: '2rem', 
                                        textAlign: 'center',
                                        minHeight: '50vh',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <div>Loading...</div>
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
                                    </Routes>
                                </Suspense>
                            </main>
                            <footer>
                                <div className="container">
                                    <div>
                                        <h3>CLOTHI.</h3>
                                        <p>
                                            Your one-stop destination for premium fashion. Discover the latest trends and timeless classics.
                                        </p>
                                    </div>
                                    <div>
                                        <h4>Quick Links</h4>
                                        <ul>
                                            <li>
                                                <a href="/">Home</a>
                                            </li>
                                            <li>
                                                <a href="/shop">Shop</a>
                                            </li>
                                            <li>
                                                <a href="/cart">Cart</a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4>Contact</h4>
                                        <p>
                                            <span>Email: support@clothi.com</span>
                                            <span>Phone: +1 (555) 123-4567</span>
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
