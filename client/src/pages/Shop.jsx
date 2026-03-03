import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTimes, FaSearch } from 'react-icons/fa';
import axios from 'axios';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SkeletonProductList } from '../components/SkeletonLoader';
import ProductCard from '../components/ProductCard';
import { getImageUrl } from '../utils/imageUtils';
import heroImageDefault from '../assets/hero-image.jpg';

// Custom Dual Range Slider Component
const CustomDualRangeSlider = ({ min, max, values, onChange }) => {
    const trackRef = useRef(null);
    const [activeThumb, setActiveThumb] = useState(null); // 'left' | 'right' | null

    const getValueFromPosition = (clientX) => {
        if (!trackRef.current) return min;
        const rect = trackRef.current.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return Math.round(min + percent * (max - min));
    };

    const handlePointerDown = (e, thumb) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveThumb(thumb);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e) => {
        if (activeThumb === null) return;
        
        const newValue = getValueFromPosition(e.clientX);
        
        if (activeThumb === 'left') {
            const clampedValue = Math.min(newValue, values[1]);
            onChange([clampedValue, values[1]]);
        } else {
            const clampedValue = Math.max(newValue, values[0]);
            onChange([values[0], clampedValue]);
        }
    };

    const handlePointerUp = (e) => {
        if (activeThumb) {
            e.currentTarget.releasePointerCapture(e.pointerId);
            setActiveThumb(null);
        }
    };

    const leftPercent = ((values[0] - min) / (max - min)) * 100;
    const rightPercent = ((values[1] - min) / (max - min)) * 100;

    return (
        <div className="filter-range-wrapper">
            <div 
                ref={trackRef}
                className="custom-range-track"
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
            >
                <div 
                    className="custom-range-fill"
                    style={{
                        left: `${leftPercent}%`,
                        width: `${rightPercent - leftPercent}%`
                    }}
                ></div>
                <div
                    className="custom-range-thumb custom-range-thumb-left"
                    style={{ left: `${leftPercent}%` }}
                    onPointerDown={(e) => handlePointerDown(e, 'left')}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <div className="custom-range-thumb-inner"></div>
                </div>
                <div
                    className="custom-range-thumb custom-range-thumb-right"
                    style={{ left: `${rightPercent}%` }}
                    onPointerDown={(e) => handlePointerDown(e, 'right')}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                >
                    <div className="custom-range-thumb-inner"></div>
                </div>
            </div>
            <div className="filter-range-labels">
                <span 
                    className="filter-range-label filter-range-label-min" 
                    style={{ left: `${leftPercent}%` }}
                >
                    Rs {values[0]}
                </span>
                <span 
                    className={`filter-range-label filter-range-label-max ${rightPercent >= 99.5 ? 'filter-range-label-at-max' : ''}`}
                    style={rightPercent >= 99.5 ? { right: 0, left: 'auto' } : { left: `${rightPercent}%` }}
                >
                    Rs {values[1]}
                </span>
            </div>
        </div>
    );
};

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [quickViewProduct, setQuickViewProduct] = useState(null);
    // Removed showFilters state - all filters now always visible
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20; // Show 20 products per page for better performance

    // Hide navbar and prevent background scrolling when quick view modal is open
    useEffect(() => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (quickViewProduct) {
                navbar.classList.add('navbar-hidden');
            } else {
                navbar.classList.remove('navbar-hidden');
            }
        }
        
        // Prevent background scrolling when modal is open
        if (quickViewProduct) {
            // Save current scroll position
            const scrollY = window.scrollY;
            // Save original padding values
            const originalPaddingTop = document.body.style.paddingTop || getComputedStyle(document.body).paddingTop;
            const originalPaddingRight = document.body.style.paddingRight || getComputedStyle(document.body).paddingRight;
            
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.paddingTop = '0'; // Remove padding-top to prevent white space
            // Save original padding-right to prevent layout shift
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`;
            }
            
            // Restore scroll position when modal closes
            return () => {
                if (navbar) {
                    navbar.classList.remove('navbar-hidden');
                }
                document.body.style.position = '';
                document.body.style.top = '';
                document.body.style.width = '';
                document.body.style.overflow = '';
                document.body.style.paddingTop = originalPaddingTop; // Restore original padding-top
                document.body.style.paddingRight = originalPaddingRight; // Restore original padding-right
                window.scrollTo(0, scrollY);
            };
        } else {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.paddingTop = '';
            document.body.style.paddingRight = '';
        }
        
        // Cleanup on unmount
        return () => {
            if (navbar) {
                navbar.classList.remove('navbar-hidden');
            }
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.paddingTop = '';
            document.body.style.paddingRight = '';
        };
    }, [quickViewProduct]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (priceFilterRef.current && !priceFilterRef.current.contains(e.target)) setPriceFilterOpen(false);
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(e.target)) setSortDropdownOpen(false);
            if (ratingDropdownRef.current && !ratingDropdownRef.current.contains(e.target)) setRatingDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const location = useLocation();
    const navigate = useNavigate();
    const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } = React.useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();

    // Filter states
    const [priceRange, setPriceRange] = useState([0, 10000]); // Increased max price to 10000
    const [minRating, setMinRating] = useState(0);
    const [inStockOnly, setInStockOnly] = useState(false);
    const [sortBy, setSortBy] = useState('default');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceFilterOpen, setPriceFilterOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
    const priceFilterRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const ratingDropdownRef = useRef(null);

    const applyFiltersAndSort = React.useCallback((productsList) => {
        if (!productsList || productsList.length === 0) {
            setFilteredProducts([]);
            return;
        }

        // Get query params
        const params = new URLSearchParams(location.search);
        const urlCategory = params.get('category');
        const search = params.get('search');

        let filtered = [...productsList];

        // Category filter (from URL or selected category)
        const activeCategory = urlCategory || selectedCategory;
        if (activeCategory) {
            filtered = filtered.filter(p => p.category === activeCategory);
        }

        // Brand filter
        if (selectedBrands.length > 0) {
            filtered = filtered.filter(p => selectedBrands.includes(p.brand));
        }

        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                (p.description && p.description.toLowerCase().includes(searchLower)) ||
                (p.brand && p.brand.toLowerCase().includes(searchLower))
            );
        }

        // Price filter
        filtered = filtered.filter(p => {
            const price = Number(p.price) || 0;
            return price >= priceRange[0] && price <= priceRange[1];
        });

        // Rating filter
        filtered = filtered.filter(p => (p.rating || 0) >= minRating);

        // Stock filter
        if (inStockOnly) {
            filtered = filtered.filter(p => p.countInStock > 0);
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
                break;
            default:
                break;
        }

        setFilteredProducts(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [location, selectedCategory, selectedBrands, priceRange, minRating, inStockOnly, sortBy]);

    // Pagination logic - ensure we have valid data
    const totalPages = filteredProducts.length > 0 ? Math.ceil(filteredProducts.length / itemsPerPage) : 0;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = filteredProducts.length > 0 ? filteredProducts.slice(startIndex, endIndex) : [];

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await axios.get('/api/products');
                
                if (!data || data.length === 0) {
                    setProducts([]);
                    setFilteredProducts([]);
                    setLoading(false);
                    return;
                }

                // Optimize: Fetch ratings in batches instead of individual calls
                // This reduces API calls from N to ceil(N/10)
                const batchSize = 10;
                const productsWithRatings = [];
                
                for (let i = 0; i < data.length; i += batchSize) {
                    const batch = data.slice(i, i + batchSize);
                    const batchPromises = batch.map(async (product) => {
                        try {
                            const { data: ratingData } = await axios.get(`/api/products/${product._id}/rating`, {
                                timeout: 3000 // 3 second timeout per request
                            });
                            return {
                                ...product,
                                rating: ratingData.averageRating || 0,
                                numReviews: ratingData.reviewCount || 0
                            };
                        } catch (error) {
                            // Fail silently and use default values
                            return { ...product, rating: 0, numReviews: 0 };
                        }
                    });
                    
                    const batchResults = await Promise.all(batchPromises);
                    productsWithRatings.push(...batchResults);
                }

                setProducts(productsWithRatings);
                applyFiltersAndSort(productsWithRatings);
            } catch (error) {
                showToast(
                    error.response?.data?.message || error.message || 'Error fetching products. Please try again.',
                    'error'
                );
                setProducts([]);
                setFilteredProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    useEffect(() => {
        if (products.length > 0) {
            applyFiltersAndSort(products);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [priceRange, minRating, inStockOnly, sortBy, location, selectedCategory, selectedBrands]);

    const resetFilters = () => {
        setPriceRange([0, 10000]); // Match the initial state
        setMinRating(0);
        setInStockOnly(false);
        setSortBy('default');
        setSelectedCategory('');
        setSelectedBrands([]);
        navigate('/shop');
    };

    // Get query params
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const search = params.get('search');

    // Get unique brands and categories for filters
    const uniqueBrands = [...new Set(products.map(p => p.brand).filter(Boolean))].sort();
    const categories = ['Men', 'Women', 'Kids'];

    // Sync selectedCategory with URL
    useEffect(() => {
        if (category) {
            setSelectedCategory(category);
        } else {
            setSelectedCategory('');
        }
    }, [category]);

    const getPageTitle = () => {
        if (search) return `Search: "${search}"`;
        if (category) return category;
        return 'All Products';
    };

    const toggleBrand = (brand) => {
        setSelectedBrands(prev => 
            prev.includes(brand) 
                ? prev.filter(b => b !== brand)
                : [...prev, brand]
        );
    };

    const handleQuickView = (product) => {
        setQuickViewProduct(product);
    };

    const handleAddToWishlist = (product) => {
        if (isInWishlist(product._id)) {
            removeFromWishlist(product._id);
            showToast('Removed from wishlist', 'success');
        } else {
            addToWishlist(product);
            showToast('Added to wishlist', 'success');
        }
    };

    const handleAddToCart = (product, qty) => {
        if (product.countInStock > 0) {
            addToCart(product, qty);
            showToast('Added to cart', 'success');
        }
    };

    return (
        <div className="bg-background-dark font-display text-slate-100 min-h-screen">
            {/* Category Sub-Nav (shop_page design) */}
            <nav className="bg-background-dark border-b border-primary/10 pt-10 lg:pt-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-center gap-8 md:gap-12">
                        <Link
                            to="/shop"
                            className={`py-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${
                                !category && !selectedCategory ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-primary hover:border-primary'
                            }`}
                            onClick={() => setSelectedCategory('')}
                        >
                            All
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat}
                                to={`/shop?category=${cat}`}
                                className={`py-4 text-xs font-bold tracking-widest uppercase border-b-2 transition-all ${
                                    selectedCategory === cat || category === cat ? 'text-primary border-primary' : 'text-slate-500 border-transparent hover:text-primary hover:border-primary'
                                }`}
                                onClick={() => { setSelectedCategory(cat); navigate(`/shop?category=${cat}`); }}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Filter & Sort Section (shop_page design) */}
            <section className="py-6 border-b border-primary/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Sort by – custom dropdown to match design */}
                            <div className="relative" ref={sortDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => { setSortDropdownOpen((o) => !o); setRatingDropdownOpen(false); }}
                                    className={`flex items-center justify-between gap-2 px-4 py-2.5 min-w-[160px] rounded-lg border text-sm font-medium transition-colors ${
                                        sortDropdownOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-primary/5 border-primary/20 text-slate-100 hover:bg-primary/10'
                                    }`}
                                    aria-expanded={sortDropdownOpen}
                                    aria-haspopup="listbox"
                                    aria-label="Sort products"
                                >
                                    <span>
                                        {sortBy === 'default' && 'Sort by'}
                                        {sortBy === 'price-low' && 'Price: Low to High'}
                                        {sortBy === 'price-high' && 'Price: High to Low'}
                                        {sortBy === 'rating' && 'Highest Rated'}
                                        {sortBy === 'newest' && 'Newest First'}
                                    </span>
                                    <span className="text-slate-500 flex flex-col leading-none text-[14px]">▾</span>
                                </button>
                                {sortDropdownOpen && (
                                    <ul
                                        className="shop-filter-dropdown absolute top-full left-0 mt-1 z-50 min-w-[200px] py-1 rounded-lg border border-slate-200 bg-white shadow-xl"
                                        role="listbox"
                                    >
                                        {[
                                            { value: 'default', label: 'Sort by' },
                                            { value: 'price-low', label: 'Price: Low to High' },
                                            { value: 'price-high', label: 'Price: High to Low' },
                                            { value: 'rating', label: 'Highest Rated' },
                                            { value: 'newest', label: 'Newest First' },
                                        ].map((opt) => (
                                            <li key={opt.value} role="option" aria-selected={sortBy === opt.value}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                        sortBy === opt.value
                                                            ? 'bg-primary text-white'
                                                            : 'text-slate-600 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-primary/20 bg-primary/5 text-sm font-medium text-slate-100 hover:bg-primary/10 transition-colors">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={inStockOnly}
                                        onChange={(e) => setInStockOnly(e.target.checked)}
                                        className="rounded border-primary/30 bg-background-dark text-primary focus:ring-primary"
                                        aria-label="In stock only"
                                    />
                                    In Stock
                                </label>
                            </div>
                            {/* Rating – custom dropdown to match design */}
                            <div className="relative" ref={ratingDropdownRef}>
                                <button
                                    type="button"
                                    onClick={() => { setRatingDropdownOpen((o) => !o); setSortDropdownOpen(false); }}
                                    className={`flex items-center justify-between gap-2 px-4 py-2.5 min-w-[120px] rounded-lg border text-sm font-medium transition-colors ${
                                        ratingDropdownOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-primary/5 border-primary/20 text-slate-100 hover:bg-primary/10'
                                    }`}
                                    aria-expanded={ratingDropdownOpen}
                                    aria-haspopup="listbox"
                                    aria-label="Minimum rating"
                                >
                                    <span>{minRating === 0 ? 'Rating' : `⭐ ${minRating}+`}</span>
                                    <span className="text-slate-500 flex flex-col leading-none text-[14px]">▾</span>
                                </button>
                                {ratingDropdownOpen && (
                                    <ul
                                        className="shop-filter-dropdown absolute top-full left-0 mt-1 z-50 min-w-[160px] py-1 rounded-lg border border-slate-200 bg-white shadow-xl"
                                        role="listbox"
                                    >
                                        {[
                                            { value: 0, label: 'Rating' },
                                            { value: 1, label: '⭐ 1+' },
                                            { value: 2, label: '⭐ 2+' },
                                            { value: 3, label: '⭐ 3+' },
                                            { value: 4, label: '⭐ 4+' },
                                            { value: 5, label: '⭐ 5' },
                                        ].map((opt) => (
                                            <li key={opt.value} role="option" aria-selected={minRating === opt.value}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setMinRating(opt.value); setRatingDropdownOpen(false); }}
                                                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                                                        minRating === opt.value
                                                            ? 'bg-primary text-white'
                                                            : 'text-slate-600 hover:bg-slate-100'
                                                    }`}
                                                >
                                                    {opt.label}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            {/* Price button – opens dropdown with range slider (full width on mobile) */}
                            <div className="relative w-full min-w-full sm:min-w-0 sm:w-auto" ref={priceFilterRef}>
                                <button
                                    type="button"
                                    onClick={() => setPriceFilterOpen((open) => !open)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border w-full sm:w-auto justify-between ${
                                        priceFilterOpen || priceRange[0] > 0 || priceRange[1] < 10000
                                            ? 'bg-primary/10 border-primary/30 text-primary'
                                            : 'bg-primary/5 border-primary/20 text-slate-100 hover:bg-primary/10'
                                    }`}
                                    aria-expanded={priceFilterOpen}
                                    aria-haspopup="true"
                                    aria-label="Filter by price"
                                >
                                    <span className="flex items-center gap-2">
                                        Price
                                        {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                                            <span className="text-[10px] text-primary">Rs {priceRange[0]}–{priceRange[1]}</span>
                                        )}
                                    </span>
                                    <span className="text-slate-400">▾</span>
                                </button>
                                {priceFilterOpen && (
                                    <div className="shop-price-dropdown absolute top-full left-0 mt-1 z-50 w-full sm:min-w-[300px] sm:w-auto p-4 sm:p-5 bg-[#0a0a0a] border border-primary/30 rounded-xl shadow-2xl shadow-black/40 shop-price-dropdown-mobile">
                                        <p className="text-sm text-slate-300 mb-4 font-medium">Price: Rs {priceRange[0]} – Rs {priceRange[1]}</p>
                                        <div className="w-full shop-price-slider">
                                            <CustomDualRangeSlider min={0} max={10000} values={priceRange} onChange={setPriceRange} />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => { setPriceRange([0, 10000]); setPriceFilterOpen(false); }}
                                            className="mt-4 py-3 w-full sm:w-auto text-center text-xs font-semibold text-primary uppercase tracking-widest hover:text-primary/90 transition-colors rounded-lg hover:bg-primary/5"
                                        >
                                            Reset price
                                        </button>
                                    </div>
                                )}
                            </div>
                            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="px-4 py-2 text-xs font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                >
                                    Clear filters
                                </button>
                            )}
                        </div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest" aria-live="polite">
                            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Products Grid */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" role="main" aria-label="Product listing">
                {search && (
                    <div className="mb-4">
                        <Link to="/shop" className="text-primary hover:underline text-sm">Clear search &quot;{search}&quot;</Link>
                    </div>
                )}
                {loading ? (
                    <SkeletonProductList count={12} />
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 w-full">
                        {/* No products found – premium empty state (no-product-found.html) */}
                        <div className="max-w-2xl w-full text-center flex flex-col items-center">
                            <div className="mb-12 relative">
                                <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full scale-150" aria-hidden />
                                <div className="relative w-32 h-32 flex items-center justify-center border border-primary/20 rounded-full bg-background-dark/50">
                                    <FaSearch className="text-6xl text-primary font-light" aria-hidden />
                                </div>
                            </div>
                            <div className="space-y-6 max-w-md">
                                <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-slate-100 font-normal tracking-tight">
                                    No products found
                                </h1>
                                <p className="text-slate-400 text-lg font-light leading-relaxed">
                                    We couldn&apos;t find any items matching your current selection. Try adjusting your filters or browse our full catalog.
                                </p>
                            </div>
                            <div className="mt-12 flex flex-col sm:flex-row gap-4">
                                <button
                                    type="button"
                                    onClick={() => { resetFilters(); navigate('/shop'); }}
                                    className="bg-primary hover:bg-primary/90 text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group"
                                >
                                    Reset Filters
                                    <span className="inline-block group-hover:translate-x-1 transition-transform" aria-hidden>→</span>
                                </button>
                                <Link
                                    to="/shop"
                                    className="border border-white/20 hover:border-primary/50 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs transition-all text-center"
                                >
                                    Browse All Products
                                </Link>
                            </div>
                        </div>

                        {/* Recommended for You – real products */}
                        {products.length > 0 && (
                            <div className="w-full max-w-6xl mt-24 px-4">
                                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                                    <h2 className="font-serif text-2xl italic text-slate-100">Recommended for You</h2>
                                    <Link to="/shop" className="text-xs uppercase tracking-[0.2em] font-bold text-primary hover:text-white transition-colors">
                                        View All
                                    </Link>
                                </div>
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                                    {products.slice(0, 4).map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            variant="shop"
                                            onQuickView={handleQuickView}
                                            onAddToWishlist={handleAddToWishlist}
                                            onAddToCart={handleAddToCart}
                                            isInWishlist={isInWishlist(product._id)}
                                            showQuickActions
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {paginatedProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    variant="shop"
                                    onQuickView={handleQuickView}
                                    onAddToWishlist={handleAddToWishlist}
                                    onAddToCart={handleAddToCart}
                                    isInWishlist={isInWishlist(product._id)}
                                    showQuickActions
                                />
                            ))}
                        </div>

                        {/* Pagination (shop_page design) */}
                        {totalPages > 1 && (
                            <div className="mt-16 flex justify-center gap-2 flex-wrap">
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="w-10 h-10 border border-primary/20 flex items-center justify-center rounded hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Previous page"
                                >
                                    ‹
                                </button>
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    const startPage = totalPages <= 5 ? 1 : Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                                    const page = startPage + i;
                                    if (page > totalPages) return null;
                                    return (
                                        <button
                                            key={page}
                                            type="button"
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-10 h-10 border flex items-center justify-center rounded transition-colors ${
                                                currentPage === page
                                                    ? 'border-primary bg-primary text-background-dark font-bold'
                                                    : 'border-primary/20 hover:bg-primary/10'
                                            }`}
                                            aria-label={`Page ${page}`}
                                            aria-current={currentPage === page ? 'page' : undefined}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    type="button"
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="w-10 h-10 border border-primary/20 flex items-center justify-center rounded hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    aria-label="Next page"
                                >
                                    ›
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {quickViewProduct && (
                <QuickViewModal
                    product={quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                />
            )}
        </div>
    );
};

// Premium Quick View Modal Component
const QuickViewModal = ({ product, onClose }) => {
    const { addToCart } = useContext(CartContext);
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [qty, setQty] = useState(1);

    const handleAddToCart = () => {
        if (product.countInStock > 0) {
            addToCart(product, qty);
            showToast('Added to cart', 'success');
            onClose();
        }
    };

    return (
        <div
            className="fashion-quickview-overlay"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label="Quick view product"
        >
            <div
                className="fashion-quickview-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="fashion-quickview-close"
                    aria-label="Close quick view"
                >
                    <FaTimes aria-hidden="true" />
                </button>

                <div className="fashion-quickview-content">
                    <div className="fashion-quickview-image">
                        <img
                            src={getImageUrl(product.image)}
                            alt={product.name}
                            referrerPolicy="no-referrer"
                            onError={(e) => { e.target.src = heroImageDefault; }}
                        />
                    </div>

                    <div className="fashion-quickview-info">
                        <span className="fashion-quickview-category">{product.category}</span>
                        <h2 className="fashion-quickview-title">{product.name}</h2>
                        
                        {product.rating > 0 && (
                            <div className="fashion-quickview-rating" aria-label={`Rating: ${product.rating} out of 5`}>
                                <span className="fashion-rating-stars" aria-hidden="true">
                                    {'★'.repeat(Math.round(product.rating || 0))}
                                    <span className="fashion-rating-empty">{'★'.repeat(5 - Math.round(product.rating || 0))}</span>
                                </span>
                                {product.numReviews > 0 && (
                                    <span className="fashion-rating-count">({product.numReviews} reviews)</span>
                                )}
                            </div>
                        )}

                        <div className="fashion-quickview-price">Rs {product.price}</div>
                        
                        <p className="fashion-quickview-description">
                            {product.description}
                        </p>

                        <div className="fashion-quickview-status">
                            <span className="fashion-status-label">Status:</span>
                            <span className={`fashion-status-value ${product.countInStock > 0 ? 'fashion-in-stock' : 'fashion-out-stock'}`}>
                                {product.countInStock > 0 ? `In Stock (${product.countInStock} available)` : 'Out of Stock'}
                            </span>
                        </div>

                        {product.countInStock > 0 && (
                            <div className="fashion-quickview-quantity">
                                <label className="form-label">Quantity:</label>
                                <div className="quantity-control" style={{ width: 'fit-content' }}>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                        disabled={qty <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        −
                                    </button>
                                    <input
                                        type="number"
                                        className="quantity-input"
                                        value={qty}
                                        min="1"
                                        max={product.countInStock}
                                        onChange={(e) => {
                                            const val = Math.max(1, Math.min(product.countInStock, Number(e.target.value) || 1));
                                            setQty(val);
                                        }}
                                        aria-label="Quantity"
                                    />
                                    <button
                                        className="quantity-btn"
                                        onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                                        disabled={qty >= product.countInStock}
                                        aria-label="Increase quantity"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="fashion-quickview-actions">
                            <Link
                                to={`/product/${product._id}`}
                                className="btn btn-outline"
                                onClick={onClose}
                            >
                                View Full Details
                            </Link>
                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary"
                                disabled={product.countInStock === 0}
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
