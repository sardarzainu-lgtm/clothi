import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { SkeletonProductList } from '../components/SkeletonLoader';
import EmptyState from '../components/EmptyState';
import ProductCard from '../components/ProductCard';

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
                    ${values[0]}
                </span>
                <span 
                    className="filter-range-label filter-range-label-max" 
                    style={{ left: `${rightPercent}%` }}
                >
                    ${values[1]}
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
        <div className="fashion-shop-container">
            {/* Page Header */}
            {/* Page Header - Removed */}
            {/* <div className="fashion-page-header">
                <div className="container" style={{ maxWidth: '1320px', margin: '0 auto' }}>
                    <h1 className="fashion-page-title">{getPageTitle()}</h1>
                </div>
            </div> */}

            <div className="fashion-shop-layout" style={{ maxWidth: '1600px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
                {/* Filter Bar - All Filters Inline */}
                <div className="filter-bar" style={{ gridColumn: '1 / -1' }}>
                    {/* Category Filter Chips - Top Center */}
                    <div className="filter-category-chips-top">
                        <Link 
                            to="/shop" 
                            className={`fashion-category-chip ${!selectedCategory && !category ? 'fashion-chip-active' : ''}`}
                            onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory('');
                                navigate('/shop');
                            }}
                        >
                            All
                        </Link>
                        {categories.map(cat => (
                            <Link
                                key={cat}
                                to={`/shop?category=${cat}`}
                                className={`fashion-category-chip ${(selectedCategory === cat || category === cat) ? 'fashion-chip-active' : ''}`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedCategory(cat);
                                    navigate(`/shop?category=${cat}`);
                                }}
                            >
                                {cat}
                            </Link>
                        ))}
                    </div>
                    {/* Filter Items Container */}
                    <div className="filter-bar-items-container">
                    {/* Price Range Filter */}
                    <div className="filter-bar-item filter-price-container">
                        <label className="filter-price-heading">Price:</label>
                        <div className="filter-range-container">
                            <CustomDualRangeSlider
                                min={0}
                                max={10000}
                                values={priceRange}
                                onChange={setPriceRange}
                            />
                        </div>
                    </div>

                    {/* Rating Filter */}
                    <div className="filter-bar-item">
                        <label htmlFor="rating-select" className="filter-inline-label">Rating:</label>
                        <select
                            id="rating-select"
                            value={minRating}
                            onChange={(e) => setMinRating(Number(e.target.value))}
                            className="fashion-select-inline"
                            aria-label="Minimum rating"
                        >
                            <option value="0">All Ratings</option>
                            <option value="1">⭐ 1 & up</option>
                            <option value="2">⭐⭐ 2 & up</option>
                            <option value="3">⭐⭐⭐ 3 & up</option>
                            <option value="4">⭐⭐⭐⭐ 4 & up</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 only</option>
                        </select>
                    </div>

                    {/* Availability Filter */}
                    <div className="filter-bar-item">
                        <label className="filter-checkbox-inline">
                            <input
                                type="checkbox"
                                checked={inStockOnly}
                                onChange={(e) => setInStockOnly(e.target.checked)}
                                className="fashion-checkbox"
                                aria-label="Show only in stock items"
                            />
                            <span>In Stock</span>
                        </label>
                    </div>

                    {/* Sort Controls */}
                    <div className="filter-controls">
                        <label htmlFor="sort-select" className="filter-label">Sort:</label>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="fashion-select"
                            aria-label="Sort products"
                        >
                            <option value="default">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="rating">Highest Rated</option>
                            <option value="newest">Newest First</option>
                        </select>

                        <span className="fashion-product-count" aria-live="polite">
                            {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
                        </span>
                    </div>
                    </div>
                </div>

                {/* Clear search button */}
                {search && (
                    <div className="fashion-clear-search">
                        <Link to="/shop" className="fashion-clear-link">
                            Clear Search
                        </Link>
                    </div>
                )}

                {/* Products Grid */}
                <main className="fashion-products-main" role="main" aria-label="Product listing" style={{ width: '100%', minWidth: 0 }}>
                    {loading ? (
                        <SkeletonProductList count={12} />
                    ) : filteredProducts.length === 0 ? (
                        <EmptyState
                            type="search"
                            title="No products found"
                            message="Try adjusting your filters or browse all products"
                            actionLabel="Reset Filters"
                            actionLink="/shop"
                        />
                    ) : (
                        <>
                            <div className="fashion-product-grid" style={{ width: '100%', maxWidth: '100%' }}>
                                {paginatedProducts.map((product) => (
                                    <ProductCard
                                        key={product._id}
                                        product={product}
                                        onQuickView={handleQuickView}
                                        onAddToWishlist={handleAddToWishlist}
                                        onAddToCart={handleAddToCart}
                                        isInWishlist={isInWishlist(product._id)}
                                        showQuickActions={true}
                                    />
                                ))}
                            </div>
                            
                            {/* Pagination Controls */}
                            {totalPages > 1 && (
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    gap: '1rem',
                                    marginTop: '2rem',
                                    marginBottom: '2rem'
                                }}>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="btn btn-outline"
                                        style={{ 
                                            opacity: currentPage === 1 ? 0.5 : 1,
                                            cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Previous
                                    </button>
                                    <span style={{ 
                                        color: '#666',
                                        fontSize: '0.9rem'
                                    }}>
                                        Page {currentPage} of {totalPages} ({filteredProducts.length} items)
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                        disabled={currentPage === totalPages}
                                        className="btn btn-outline"
                                        style={{ 
                                            opacity: currentPage === totalPages ? 0.5 : 1,
                                            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>

            {/* Quick View Modal */}
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
                            src={product.image}
                            alt={product.name}
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
