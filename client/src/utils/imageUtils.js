/**
 * Image URL utility functions
 * Handles both relative and absolute image URLs.
 * API base is read from: window.__API_URL__ (runtime) then VITE_API_URL (build time).
 * When the site is on production (not localhost), we never use localhost as API base.
 */
const PRODUCTION_API_URL = 'https://whitesmoke-armadillo-865654.hostingersite.com';
// 1x1 transparent GIF - no network request, avoids 404/422 for missing placeholder
const PLACEHOLDER_DATA_URL = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function getApiBase() {
  const fromWindow = typeof window !== 'undefined' && window.__API_URL__;
  const fromEnv = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL;
  let raw = (fromWindow || fromEnv || '').trim();
  raw = raw ? raw.replace(/\/$/, '') : '';
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && !window.location.hostname.startsWith('127.');
  // Production host but config points to localhost → use production backend
  if (isProduction && raw && (raw.includes('localhost') || raw.startsWith('http://127.'))) {
    return PRODUCTION_API_URL;
  }
  // Production host and no API URL set (e.g. old deploy without script) → use production backend so /uploads don't hit frontend (422)
  if (isProduction && !raw) {
    return PRODUCTION_API_URL;
  }
  return raw;
}

/**
 * Convert a relative image path (e.g. from upload API) to an absolute URL using the API base.
 * Only prefixes paths under /uploads/ so frontend assets (/assets/) are not changed.
 */
export function toAbsoluteImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  const u = url.trim();
  if (u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:')) return u;
  const base = getApiBase();
  if (base && u.startsWith('/uploads')) return base + (u.startsWith('/') ? u : '/' + u);
  return u;
}

/**
 * Get the full image URL with optional size optimization
 * Handles both relative paths (/uploads/image.jpg) and absolute URLs (http://...)
 * For existing images without optimized versions, returns original path
 * In production, relative /uploads paths are prefixed with the API URL.
 * @param {string} imagePath - Image path from database
 * @param {string} size - Image size: 'thumbnail', 'medium', 'large', or 'original' (default: 'medium')
 * @returns {string} - Full image URL
 */
export const getImageUrl = (imagePath, size = 'medium') => {
    const API_BASE = getApiBase();
    if (!imagePath || typeof imagePath !== 'string' || imagePath.trim() === '') {
        return PLACEHOLDER_DATA_URL;
    }

    // If it's already a full URL (http:// or https://), return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }

    // If it's a data URL, return as is
    if (imagePath.startsWith('data:')) {
        return imagePath;
    }

    // If it's already an optimized WebP image, use it but still prefix with API_BASE in production
    if (imagePath.includes('-thumb.webp') || 
        imagePath.includes('-medium.webp') || 
        imagePath.includes('-large.webp') ||
        imagePath.includes('-original.webp')) {
        const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return path.startsWith('/') && API_BASE ? `${API_BASE}${path}` : path;
    }

    // Normalize the path
    let normalizedPath = imagePath.trim();
    if (!normalizedPath.startsWith('/')) {
        if (normalizedPath.includes('uploads/')) {
            normalizedPath = `/${normalizedPath}`;
        } else {
            normalizedPath = `/uploads/${normalizedPath}`;
        }
    }

    // For existing products, return original path to avoid breaking
    // New uploads will have optimized versions generated
    // The error handler will gracefully handle missing optimized images
    // Try optimized version first, but it will fallback if not found
    try {
        const optimizedUrl = getOptimizedImageUrl(normalizedPath, size);
        // In production, prefix relative URLs with API base so /uploads/... loads from backend
        const url = optimizedUrl.startsWith('/') && API_BASE ? `${API_BASE}${optimizedUrl}` : optimizedUrl;
        return url;
    } catch (error) {
        // If optimization fails, return original path (with API prefix in production)
        const url = normalizedPath.startsWith('/') && API_BASE ? `${API_BASE}${normalizedPath}` : normalizedPath;
        return url;
    }
};

/**
 * Get optimized image URL based on size
 * Converts regular image paths to optimized WebP versions
 * @param {string} imagePath - Original image path
 * @param {string} size - 'thumbnail', 'medium', 'large', or 'original'
 * @returns {string} - Optimized image URL
 */
const getOptimizedImageUrl = (imagePath, size = 'medium') => {
    if (!imagePath) return PLACEHOLDER_DATA_URL;
    
    // Handle empty paths or malformed paths
    if (imagePath === '/' || imagePath.trim() === '') {
        return PLACEHOLDER_DATA_URL;
    }
    
    // Extract base filename without extension
    const pathParts = imagePath.split('/').filter(part => part); // Remove empty parts
    if (pathParts.length === 0) return PLACEHOLDER_DATA_URL;
    
    const filename = pathParts[pathParts.length - 1];
    
    // Handle cases where filename might be empty or just an extension
    if (!filename || filename.startsWith('.')) {
        return imagePath; // Return original if we can't parse it
    }
    
    const baseFilename = filename.replace(/\.[^/.]+$/, ''); // Remove extension
    
    // If baseFilename is empty after removing extension, return original
    if (!baseFilename) {
        return imagePath;
    }
    
    // Map size to suffix
    const sizeMap = {
        'thumbnail': '-thumb',
        'medium': '-medium',
        'large': '-large',
        'original': '-original'
    };
    
    const suffix = sizeMap[size] || '-medium';
    const directory = pathParts.slice(0, -1).join('/');
    
    // Ensure directory starts with /
    const dirPath = directory ? `/${directory}` : '';
    
    // Return optimized WebP path
    return `${dirPath}/${baseFilename}${suffix}.webp`;
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
 * Get image error handler with fallback to original image
 * Tries optimized version first, falls back to original if not found
 * Prevents infinite loops by tracking fallback attempts
 * @param {string} fallback - Fallback image path
 * @returns {Function} - Error handler function
 */
export const getImageErrorHandler = (fallback = PLACEHOLDER_DATA_URL) => {
    // Use a Map to track fallback attempts per image src
    const fallbackAttempts = new Map();
    
    return (e) => {
        try {
            const img = e.target;
            if (!img) return;
            
            const currentSrc = img.src || '';
            
            // Get or initialize fallback counter for this image src
            let attempts = fallbackAttempts.get(currentSrc) || 0;
            
            // Prevent infinite loops - max 2 fallback attempts
            if (attempts >= 2) {
                // Final fallback - stop trying
                if (currentSrc !== fallback && !currentSrc.includes('data:image')) {
                    img.src = fallback;
                    // Remove error handler to prevent further attempts
                    img.onerror = null;
                }
                return;
            }
            
            // Increment attempt counter
            fallbackAttempts.set(currentSrc, attempts + 1);
            
            // If optimized image fails, try original (use API base for cross-origin)
            const apiBase = getApiBase();
            if (currentSrc.includes('-thumb.webp') || 
                currentSrc.includes('-medium.webp') || 
                currentSrc.includes('-large.webp') ||
                currentSrc.includes('-original.webp')) {
                const basePath = currentSrc.replace(/-(thumb|medium|large|original)\.webp$/, '');
                if (attempts === 0) {
                    const next = basePath + '.jpg';
                    img.src = next.startsWith('/') && apiBase ? `${apiBase}${next}` : next;
                } else {
                    const pathParts = basePath.split('/');
                    const filename = pathParts[pathParts.length - 1];
                    const next = `/uploads/${filename}`;
                    img.src = apiBase ? `${apiBase}${next}` : next;
                }
            } else {
                // Final fallback to placeholder
                if (currentSrc !== fallback && !currentSrc.includes('data:image')) {
                    img.src = fallback;
                    img.onerror = null; // Stop error handling
                }
            }
        } catch (error) {
            // Silently fail - don't crash the app
            console.error('Image error handler failed:', error);
        }
    };
};

