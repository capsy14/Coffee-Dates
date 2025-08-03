import { toast } from "react-toastify";

// Track recent toast messages to prevent duplicates
const recentToasts = new Map();
const TOAST_DEBOUNCE_TIME = 2000; // 2 seconds - increased for better deduplication

const isRecentToast = (message, type = 'default') => {
  const key = `${type}_${message}`;
  const now = Date.now();
  
  if (recentToasts.has(key)) {
    const lastShown = recentToasts.get(key);
    if (now - lastShown < TOAST_DEBOUNCE_TIME) {
      return true; // This toast was recently shown
    }
  }
  
  recentToasts.set(key, now);
  
  // Clean up old entries
  if (recentToasts.size > 20) {
    const cutoff = now - TOAST_DEBOUNCE_TIME * 2;
    for (const [k, timestamp] of recentToasts.entries()) {
      if (timestamp < cutoff) {
        recentToasts.delete(k);
      }
    }
  }
  
  return false;
};

export const showToast = {
  success: (message, options = {}) => {
    if (isRecentToast(message, 'success')) {
      console.log('Duplicate success toast prevented:', message);
      return;
    }
    return toast.success(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      containerId: "global-toast-container",
      toastId: `success_${Date.now()}_${Math.random()}`,
      ...options
    });
  },
  error: (message, options = {}) => {
    if (isRecentToast(message, 'error')) {
      console.log('Duplicate error toast prevented:', message);
      return;
    }
    return toast.error(message, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      containerId: "global-toast-container",
      toastId: `error_${Date.now()}_${Math.random()}`,
      ...options
    });
  },
  info: (message, options = {}) => {
    if (isRecentToast(message, 'info')) {
      console.log('Duplicate info toast prevented:', message);
      return;
    }
    return toast.info(message, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      containerId: "global-toast-container",
      toastId: `info_${Date.now()}_${Math.random()}`,
      ...options
    });
  },
  warning: (message, options = {}) => {
    if (isRecentToast(message, 'warning')) {
      console.log('Duplicate warning toast prevented:', message);
      return;
    }
    return toast.warning(message, {
      position: "top-right",
      autoClose: 3500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      containerId: "global-toast-container",
      toastId: `warning_${Date.now()}_${Math.random()}`,
      ...options
    });
  }
};

export default showToast;