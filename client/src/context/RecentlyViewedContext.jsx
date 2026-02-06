import React, { createContext, useState, useEffect, useCallback } from 'react';

export const RecentlyViewedContext = createContext();

export const RecentlyViewedProvider = ({ children }) => {
    const [recentlyViewed, setRecentlyViewed] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('recentlyViewed');
        if (stored) {
            setRecentlyViewed(JSON.parse(stored));
        }
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    const addToRecentlyViewed = useCallback((product) => {
        setRecentlyViewed((prev) => {
            // Remove if already exists
            const filtered = prev.filter((p) => p._id !== product._id);
            // Add to beginning, limit to 10 items
            return [product, ...filtered].slice(0, 10);
        });
    }, []);

    const clearRecentlyViewed = useCallback(() => {
        setRecentlyViewed([]);
        localStorage.removeItem('recentlyViewed');
    }, []);

    return (
        <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
};
