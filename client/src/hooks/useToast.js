import { useState, useCallback } from 'react';

let globalToastHandler = null;

export const setGlobalToastHandler = (handler) => {
    globalToastHandler = handler;
};

// Global function to show toast from anywhere
export const showToast = (message, type = 'success') => {
    if (globalToastHandler) {
        globalToastHandler(message, type);
    }
};

const useToast = () => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Date.now() + Math.random();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, 3000);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return { toasts, addToast, removeToast };
};

export default useToast;
