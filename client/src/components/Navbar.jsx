import React, { useState, useContext, useEffect, useRef } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaChevronDown, FaBars, FaTimes, FaSearch, FaHeart, FaGem } from 'react-icons/fa';
import SearchModal from './SearchModal';

const Navbar = () => {
    const navigate = useNavigate();
    const { cartItems } = useContext(CartContext);
    const { wishlistItems } = useContext(WishlistContext);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
    const [showAccountDropdown, setShowAccountDropdown] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchModalOpen, setSearchModalOpen] = useState(false);
    const [logoError, setLogoError] = useState(false);
    const navbarRef = useRef(null);
    const accountDropdownRef = useRef(null);

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

        const handleClickOutside = (e) => {
            if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target)) {
                setShowAccountDropdown(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('userInfo');
        setShowAccountDropdown(false);
        setMobileMenuOpen(false);
        navigate('/login');
        window.location.reload();
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    const logoContent = (
        <Link to="/" className="flex flex-col items-center group">
            {!logoError ? (
                <img
                    src="/logo.svg"
                    alt="MAKHMAL JAN Logo"
                    className="h-20 w-20 lg:h-16 lg:w-16 object-contain drop-shadow-sm group-hover:opacity-90 transition-opacity"
                    onError={() => setLogoError(true)}
                />
            ) : (
                <span className="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-primary text-background-dark text-lg lg:text-xl font-bold flex items-center justify-center">
                    M
                </span>
            )}
        </Link>
    );

    const navLinkClass = ({ isActive }) =>
        `text-sm font-medium tracking-widest uppercase font-display transition-colors duration-300 ${
            isActive ? 'text-primary nav-active-link' : 'text-slate-100 hover:text-primary'
        }`;

    return (
        <>
            <nav
                className="navbar navbar-premium w-full bg-background-dark border-b border-primary/30 px-4 lg:px-12 py-2"
                ref={navbarRef}
            >
                <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-4">
                    {/* Left: Desktop nav links */}
                    <div className="hidden lg:flex items-center gap-8 lg:gap-10 flex-1">
                        <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </NavLink>
                        <div
                            className="relative"
                            onMouseEnter={() => setShowCategoryDropdown(true)}
                            onMouseLeave={() => setShowCategoryDropdown(false)}
                        >
                            <button
                                type="button"
                                className="text-sm font-medium tracking-widest uppercase text-slate-100 hover:text-primary transition-colors duration-300 font-display flex items-center gap-1"
                            >
                                Shop <FaChevronDown className="text-xs" />
                            </button>
                            {showCategoryDropdown && (
                                <div className="navbar-dropdown absolute top-full left-0 mt-1 py-2 min-w-[180px] bg-background-dark border border-primary/30 rounded-lg shadow-xl z-[10000]">
                                    <Link
                                        to="/daily-deals"
                                        className="navbar-dropdown-item flex items-center gap-2 px-4 py-2.5 text-primary font-semibold hover:bg-primary/10"
                                        onClick={() => setShowCategoryDropdown(false)}
                                    >
                                        <FaGem className="text-sm" /> Daily Deals
                                    </Link>
                                    <div className="h-px bg-primary/20 my-1" />
                                    <Link to="/shop?category=Men" className="navbar-dropdown-item px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary" onClick={() => setShowCategoryDropdown(false)}>Men</Link>
                                    <Link to="/shop?category=Women" className="navbar-dropdown-item px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary" onClick={() => setShowCategoryDropdown(false)}>Women</Link>
                                    <Link to="/shop?category=Kids" className="navbar-dropdown-item px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary" onClick={() => setShowCategoryDropdown(false)}>Kids</Link>
                                    <Link to="/shop" className="navbar-dropdown-item px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary" onClick={() => setShowCategoryDropdown(false)}>All Products</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mobile: Hamburger */}
                    <div className="lg:hidden flex items-center flex-1">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-100 hover:text-primary transition-colors p-2"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                        </button>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex items-center justify-center flex-1 shrink-0">
                        {logoContent}
                    </div>

                    {/* Right: Icons + Account */}
                    <div className="flex items-center justify-end gap-4 lg:gap-6 flex-1">
                        <button
                            type="button"
                            onClick={() => setSearchModalOpen(true)}
                            className="text-slate-100 hover:text-primary transition-colors p-1.5"
                            aria-label="Search"
                        >
                            <FaSearch className="text-lg" />
                        </button>
                        <Link to="/wishlist" className="hidden lg:flex text-slate-100 hover:text-primary transition-colors p-1.5 relative items-center" onClick={() => setMobileMenuOpen(false)}>
                            <FaHeart className="text-lg" />
                            {wishlistItems.length > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-primary text-background-dark text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {wishlistItems.length}
                                </span>
                            )}
                        </Link>
                        <Link to="/cart" className="text-slate-100 hover:text-primary transition-colors p-1.5 relative" onClick={() => setMobileMenuOpen(false)}>
                            <FaShoppingCart className="text-lg" />
                            {cartCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 bg-primary text-background-dark text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <div className="relative hidden lg:block" ref={accountDropdownRef}>
                            {!userInfo ? (
                                <div className="flex items-center gap-2">
                                    <Link to="/login" className="text-slate-100 hover:text-primary transition-colors p-1.5 inline-flex items-center gap-1.5 text-sm tracking-widest uppercase" onClick={() => setMobileMenuOpen(false)}>
                                        <FaUser className="text-lg" /> Login
                                    </Link>
                                    <Link to="/register" className="px-3 py-1.5 border border-primary/60 hover:bg-primary hover:text-background-dark text-slate-100 text-sm tracking-widest uppercase transition-colors" onClick={() => setMobileMenuOpen(false)}>
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                                        className="text-slate-100 hover:text-primary transition-colors p-1.5 flex items-center"
                                        aria-expanded={showAccountDropdown}
                                    >
                                        <FaUser className="text-lg" />
                                    </button>
                                    {showAccountDropdown && (
                                        <div className="navbar-dropdown absolute top-full right-0 mt-1 py-2 min-w-[160px] bg-background-dark border border-primary/30 rounded-lg shadow-xl z-[10000]">
                                            <Link to="/profile" className="navbar-dropdown-item block px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary" onClick={() => { setShowAccountDropdown(false); setMobileMenuOpen(false); }}>{userInfo.name}</Link>
                                            {userInfo.isAdmin && (
                                                <Link to="/admin/dashboard" className="navbar-dropdown-item block px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary" onClick={() => { setShowAccountDropdown(false); setMobileMenuOpen(false); }}>Admin</Link>
                                            )}
                                            <button type="button" onClick={logoutHandler} className="navbar-dropdown-item w-full text-left px-4 py-2.5 text-slate-200 hover:bg-primary/10 hover:text-primary flex items-center gap-2">
                                                <FaSignOutAlt /> Logout
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile menu panel */}
                {mobileMenuOpen && (
                    <div className="lg:hidden absolute top-full left-0 right-0 bg-background-dark border-b border-primary/30 shadow-xl z-[9998]">
                        <div className="navbar-mobile-menu px-6 py-4 flex flex-col gap-3">
                            <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>Home</NavLink>
                            <div>
                                <button type="button" className="text-sm font-medium tracking-widest uppercase text-slate-100 hover:text-primary flex items-center gap-1" onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}>
                                    Shop <FaChevronDown className={`text-xs transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                                </button>
                                {showCategoryDropdown && (
                                    <div className="mt-2 pl-4 flex flex-col gap-1">
                                        <Link to="/daily-deals" className="flex items-center gap-2 py-2 text-primary font-semibold" onClick={() => setMobileMenuOpen(false)}><FaGem className="text-sm" /> Daily Deals</Link>
                                        <Link to="/shop?category=Men" className="py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>Men</Link>
                                        <Link to="/shop?category=Women" className="py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>Women</Link>
                                        <Link to="/shop?category=Kids" className="py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>Kids</Link>
                                        <Link to="/shop" className="py-2 text-slate-300" onClick={() => setMobileMenuOpen(false)}>All Products</Link>
                                    </div>
                                )}
                            </div>
                            {!userInfo ? (
                                <>
                                    <Link to="/login" className="text-slate-100 hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                                    <Link to="/register" className="text-primary border border-primary/60 py-2 px-4 inline-block text-center" onClick={() => setMobileMenuOpen(false)}>Register</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/profile" className="text-slate-100 hover:text-primary py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}><FaUser /> {userInfo.name}</Link>
                                    {userInfo.isAdmin && <Link to="/admin/dashboard" className="text-slate-100 hover:text-primary py-2" onClick={() => setMobileMenuOpen(false)}>Admin</Link>}
                                    <button type="button" onClick={logoutHandler} className="text-left text-slate-100 hover:text-primary py-2 flex items-center gap-2"><FaSignOutAlt /> Logout</button>
                                </>
                            )}
                            <Link to="/wishlist" className="text-slate-100 hover:text-primary py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                <FaHeart /> Wishlist {wishlistItems.length > 0 && `(${wishlistItems.length})`}
                            </Link>
                            <Link to="/cart" className="text-slate-100 hover:text-primary py-2 flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                                <FaShoppingCart /> Cart {cartCount > 0 && `(${cartCount})`}
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            <SearchModal isOpen={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
        </>
    );
};

export default Navbar;
