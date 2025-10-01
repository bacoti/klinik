import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";

// Toast component inline since it's simple
const Toast: React.FC<{
    variant: "success" | "error" | "warning" | "info";
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
    action?: {
        label: string;
        onClick: () => void;
    };
}> = ({ variant, title, children, onClose, action }) => {
    const variantStyles = {
        success: "bg-green-50 border-green-200 text-green-800",
        error: "bg-red-50 border-red-200 text-red-800",
        warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
    };

    const iconStyles = {
        success: "✓",
        error: "✕",
        warning: "⚠",
        info: "ℹ",
    };

    return (
        <div
            className={`max-w-sm w-full border rounded-lg p-4 shadow-lg ${variantStyles[variant]} transition-all duration-300 ease-in-out`}
        >
            <div className="flex items-start">
                <div className="flex-shrink-0">
                    <span className="text-lg font-bold">
                        {iconStyles[variant]}
                    </span>
                </div>
                <div className="ml-3 flex-1">
                    {title && (
                        <h3 className="text-sm font-medium mb-1">{title}</h3>
                    )}
                    <div className="text-sm">{children}</div>
                    {action && (
                        <div className="mt-2">
                            <button
                                onClick={action.onClick}
                                className="text-sm font-medium underline hover:no-underline"
                            >
                                {action.label}
                            </button>
                        </div>
                    )}
                </div>
                <div className="ml-4 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
};

// Toast types
type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
    id: string;
    type: ToastType;
    title?: string;
    message: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

interface ToastContextType {
    toasts: ToastItem[];
    success: (message: string, title?: string, duration?: number) => void;
    error: (title: string, message?: string, duration?: number) => void;
    warning: (message: string, title?: string, duration?: number) => void;
    info: (message: string, title?: string, duration?: number) => void;
    dismiss: (id: string) => void;
    dismissAll: () => void;
}

// Create context
const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Toast provider component
export const ToastProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    // Generate unique ID for toasts
    const generateId = useCallback(() => {
        return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }, []);

    // Add toast
    const addToast = useCallback(
        (toast: Omit<ToastItem, "id">) => {
            const id = generateId();
            const newToast: ToastItem = { id, ...toast };

            setToasts((prev) => [...prev, newToast]);

            // Auto dismiss after duration
            const duration = toast.duration ?? 5000;
            if (duration > 0) {
                setTimeout(() => {
                    setToasts((prev) => prev.filter((t) => t.id !== id));
                }, duration);
            }

            return id;
        },
        [generateId]
    );

    // Convenience methods for different toast types
    const success = useCallback(
        (message: string, title?: string, duration?: number) => {
            return addToast({
                type: "success",
                title,
                message,
                duration,
            });
        },
        [addToast]
    );

    const error = useCallback(
        (title: string, message?: string, duration?: number) => {
            return addToast({
                type: "error",
                title,
                message: message || "",
                duration: duration ?? 7000, // Longer duration for errors
            });
        },
        [addToast]
    );

    const warning = useCallback(
        (message: string, title?: string, duration?: number) => {
            return addToast({
                type: "warning",
                title,
                message,
                duration,
            });
        },
        [addToast]
    );

    const info = useCallback(
        (message: string, title?: string, duration?: number) => {
            return addToast({
                type: "info",
                title,
                message,
                duration,
            });
        },
        [addToast]
    );

    // Dismiss specific toast
    const dismiss = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    // Dismiss all toasts
    const dismissAll = useCallback(() => {
        setToasts([]);
    }, []);

    const value: ToastContextType = {
        toasts,
        success,
        error,
        warning,
        info,
        dismiss,
        dismissAll,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {/* Render toasts */}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        variant={toast.type}
                        title={toast.title}
                        onClose={() => dismiss(toast.id)}
                        action={toast.action}
                    >
                        {toast.message}
                    </Toast>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

// Custom hook to use toast context
export const useToast = (): ToastContextType => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

export default ToastContext;
