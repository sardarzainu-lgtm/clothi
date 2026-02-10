import React, { useState, useContext, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes, FaSearch, FaHeart, FaGem } from 'react-icons/fa';
import SearchModal from './SearchModal';

const Navbar = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const navbarRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (navbarRef.current) {
                if (window.scrollY > 20) {
                    navbarRef.current.classList.add('scrolled');
                } else {
                    navbarRef.current.classList.remove('scrolled');
                }
            }
        };

        const handleKeyDown = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setSearchModalOpen(true);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        navigate('/login');
        window.location.reload();
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);

        // Clear previous timeout
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Set new timeout for debouncing (300ms)
        const timeout = setTimeout(() => {
            if (value.trim()) {
                navigate(`/shop?search=${encodeURIComponent(value.trim())}`);
            }
        }, 300);

        setSearchTimeout(timeout);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="navbar" ref={navbarRef}>
            <div className="container navbar-container">
                {/* Logo Section - Top Center */}
                <div className="navbar-logo-section">
                    <Link to="/" className="logo" style={{ display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center' }}>
                        <img
                            src="/logo.png"
                            alt="MAKHMAL JAN Logo"
                            style={{
                                height: '45px',
                                width: '45px',
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}
                        />
                        MAKHMAL JAN
                    </Link>
                </div>

                {/* Navigation Section - Below Logo */}
                <div className="navbar-nav-section">
                    {/* Search Bar */}
                    <div className="premium-search-container">
                        <form onSubmit={handleSearchSubmit} className="premium-search-form">
                            <div className="premium-search-wrapper">
                                <FaSearch className="premium-search-icon" />
                                <input
                                    type="text"
                                    placeholder="Search products, brands, categories..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="premium-search-input"
                                    aria-label="Search products"
                                />
                            </div>
                        </form>
                    </div>

                    <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
                    <li>
                        <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                    </li>
                    <li
                        className="dropdown"
                        onMouseEnter={() => setShowCategoryDropdown(true)}
                        onMouseLeave={() => setShowCategoryDropdown(false)}
                        style={{ position: 'relative' }}
                    >
                        <button
                            className="nav-link dropdown-toggle"
                            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                            Shop <FaChevronDown size={12} />
                        </button>
                        {showCategoryDropdown && (
                            <div className="dropdown-menu">
                                <Link
                                    to="/daily-deals"
                                    className="dropdown-item dropdown-item-daily-deals"
                                    onClick={() => { setShowCategoryDropdown(false); setMobileMenuOpen(false); }}
                                    style={{ fontWeight: '600', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                    <FaGem style={{ fontSize: '14px' }} />
                                    Daily Deals
                                </Link>
                                <div style={{ height: '1px', background: 'rgba(210, 168, 65, 0.2)', margin: '8px 0' }}></div>
                                <Link
                                    to="/shop?category=Men"
                                    className="dropdown-item"
                                    onClick={() => { setShowCategoryDropdown(false); setMobileMenuOpen(false); }}
                                >
                                    Men
                                </Link>
                                <Link
                                    to="/shop?category=Women"
                                    className="dropdown-item"
                                    onClick={() => { setShowCategoryDropdown(false); setMobileMenuOpen(false); }}
                                >
                                    Women
                                </Link>
                                <Link
                                    to="/shop?category=Kids"
                                    className="dropdown-item"
                                    onClick={() => { setShowCategoryDropdown(false); setMobileMenuOpen(false); }}
                                >
                                    Kids
                                </Link>
                                <Link
                                    to="/shop"
                                    className="dropdown-item"
                                    onClick={() => { setShowCategoryDropdown(false); setMobileMenuOpen(false); }}
                                >
                                    All Products
                                </Link>
                            </div>
                        )}
                    </li>

                    {/* Auth Links */}
                    {!userInfo ? (
                        <>
                            <li>
                                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                            </li>
                            <li>
                                <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => setMobileMenuOpen(false)}>
                                    Register
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/profile" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                    <FaUser /> {userInfo.name}
                                </Link>
                            </li>
                            {userInfo.isAdmin && (
                                <li>
                                    <Link to="/admin/dashboard" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                                        Admin
                                    </Link>
                                </li>
                            )}
                            <li>
                                <button onClick={() => { logoutHandler(); setMobileMenuOpen(false); }} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>
                                    <FaSignOutAlt />
                                </button>
                            </li>
                        </>
                    )}

                    {/* Wishlist Link */}
                    <li>
                        <Link to="/wishlist" className="nav-link" onClick={() => setMobileMenuOpen(false)} style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaHeart style={{ fontSize: '18px' }} />
                            <span style={{ display: window.innerWidth < 768 ? 'none' : 'inline' }}>Wishlist</span>
                            {wishlistItems.length > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: window.innerWidth < 768 ? '-8px' : 'auto',
                                    left: window.innerWidth < 768 ? 'auto' : 'calc(100% - 8px)',
                                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.7rem',
                                    fontWeight: '700',
                                    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                    border: '2px solid white'
                                }}>
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                    </li>

                    {/* Cart Link - Desktop Only */}
                    <li className="desktop-cart-link">
                        <Link to="/cart" className="nav-link cart-badge" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }} onClick={() => setMobileMenuOpen(false)}>
                            <FaShoppingCart style={{ fontSize: '18px' }} />
                            <span>Cart</span>
                            {cartItems.length > 0 && (
                                <span 
                                    className="cart-badge-pulse"
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        left: 'calc(100% - 8px)',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                        border: '2px solid white'
                                    }}
                                >
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                    </li>
                    </ul>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="mobile-menu-toggle"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Mobile Icons - Search and Cart */}
                    <div className="mobile-nav-icons">
                        <button
                            className="mobile-search-icon"
                            onClick={() => setSearchModalOpen(true)}
                            aria-label="Search"
                        >
                            <FaSearch />
                        </button>
                        <Link 
                            to="/cart" 
                            className="mobile-cart-icon" 
                            style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
                        >
                            <FaShoppingCart />
                            {cartItems.length > 0 && (
                                <span 
                                    className="cart-badge-pulse"
                                    style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        borderRadius: '50%',
                                        width: '20px',
                                        height: '20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.7rem',
                                        fontWeight: '700',
                                        boxShadow: '0 2px 8px rgba(239, 68, 68, 0.4)',
                                        border: '2px solid white',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </div>

            {/* Search Modal */}
            <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </nav>
    );
};

export default Navbar;
