/**
 * Image URL utility functions
 * Handles both relative and absolute image URLs
 */

/**
 * Get the full image URL
 * Handles both relative paths (/uploads/image.jpg) and absolute URLs (http://...)
 * @param {string} imagePath - Image path from database
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath) => {
    if (!imagePath) {
        return '/placeholder-image.jpg'; // Fallback image
    }

    // If it's already a full URL (http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a data URL, return as is
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }

    // If it starts with /, it's already a relative path, return as is
    if (imagePath.startsWith('/')) {
        return imagePath;
    }

    // Otherwise, assume it's a relative path and add /uploads/ if needed
    if (imagePath.includes('uploads/')) {
        return `/${imagePath}`;
    }

    // Default: assume it's in uploads directory
    return `/uploads/${imagePath}`;
};

/**
 * Check if image URL is valid
 * @param {string} imagePath - Image path to validate
 * @returns {boolean} - True if valid
 */
export const isValidImageUrl = (imagePath) => {
    if (!imagePath) return false;
    
    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico', '.tiff', '.tif', '.heic', '.heif', '.avif'];
    const lowerPath = imagePath.toLowerCase();
    
    return imageExtensions.some(ext => lowerPath.includes(ext)) || 
           imagePath.startsWith('data:image/') ||
           imagePath.startsWith('http');
};

/**
 * Get image error handler
 * Returns a fallback image URL if image fails to load
 * @param {string} fallback - Fallback image path
 * @returns {Function} - Error handler function
 */
export const getImageErrorHandler = (fallback = '/placeholder-image.jpg') => {
    return (e) => {
        if (e.target.src !== fallback) {
            e.target.src = fallback;
        }
    };
};

