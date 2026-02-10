import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TopBanner = () => {
    const [topBannerText, setTopBannerText] = useState('WINTER SALE: UP TO 30%-50% OFF');
    const [topBannerEnabled, setTopBannerEnabled] = useState(true);
    const [loading, setLoading] = useState(true);
    const isFetchingRef = useRef(false);
    const lastFetchRef = useRef(0);

    const fetchSettings = async () => {
        // Prevent concurrent requests
        if (isFetchingRef.current) {
            return;
        }

        // Rate limit: Don't fetch more than once per 30 seconds
        const now = Date.now();
        if (now - lastFetchRef.current < 30000) {
            return;
        }

        isFetchingRef.current = true;
        lastFetchRef.current = now;

        try {
            const { data } = await axios.get('/api/settings');
            if (data) {
                if (data.topBannerText) {
                    setTopBannerText(data.topBannerText);
                }
                if (data.topBannerEnabled !== undefined) {
                    setTopBannerEnabled(data.topBannerEnabled);
                }
            }
        } catch (error) {
            // Only log non-rate-limit errors
            if (error.response?.status !== 429) {
                console.warn('Error fetching banner settings, using defaults:', error);
            }
            // Keep default values if settings fetch fails
        } finally {
            setLoading(false);
            isFetchingRef.current = false;
        }
    };

    useEffect(() => {
        fetchSettings();
        
        // Only poll when page is visible to reduce unnecessary requests
        const handleVisibilityChange = () => {
            if (document.hidden) {
                return; // Don't poll when page is hidden
            }
            // Fetch immediately when page becomes visible
            fetchSettings();
        };
        
        // Poll for updates every 2 minutes (only when page is visible)
        // This reduces API calls significantly while still keeping banner updated
        // With rate limit of 100 requests per 15 minutes, this allows ~7 requests per 15 minutes
        let interval;
        const startPolling = () => {
            if (!document.hidden) {
                interval = setInterval(() => {
                    if (!document.hidden) {
                        fetchSettings();
                    }
                }, 120000); // 2 minutes (120 seconds)
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        startPolling();
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (interval) {
                clearInterval(interval);
            }
        };
    }, []);

    // Update CSS variables and navbar position based on banner state
    useEffect(() => {
        const updateBannerHeight = () => {
            const isMobile = window.innerWidth <= 767;
            const bannerHeight = topBannerEnabled && !loading ? (isMobile ? '36px' : '40px') : '0px';
            
            document.documentElement.style.setProperty('--banner-height', bannerHeight);
        };

        updateBannerHeight();

        // Update on window resize
        window.addEventListener('resize', updateBannerHeight);
        
        return () => {
            window.removeEventListener('resize', updateBannerHeight);
        };
    }, [topBannerEnabled, loading]);

    if (loading) {
        return null;
    }

    if (!topBannerEnabled) {
        return null;
    }

    return (
        <div className="top-banner">
            <div className="top-banner-content">
                <span className="top-banner-text">{topBannerText}</span>
            </div>
        </div>
    );
};

export default TopBanner;

