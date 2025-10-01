import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Toast component mengikuti prinsip UI: Feedback, Non-intrusive, Temporary
const toastVariants = cva(
    "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
    {
        variants: {
            variant: {
                default: "border bg-background text-foreground",
                destructive:
                    "destructive group border-destructive bg-destructive text-destructive-foreground",
                success:
                    "border-green-500 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200",
                warning:
                    "border-yellow-500 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
                info: "border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

// Toast context untuk global toast management
interface Toast {
    id: string;
    title?: string;
    description?: string;
    action?: React.ReactNode;
    variant?: "default" | "destructive" | "success" | "warning" | "info";
    duration?: number;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
    undefined
);

// Toast Provider
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
        const id = Math.random().toString(36).substring(2);
        const newToast = { ...toast, id };

        setToasts((current) => [...current, newToast]);

        // Auto remove after duration
        if (toast.duration !== 0) {
            setTimeout(() => {
                removeToast(id);
            }, toast.duration || 5000);
        }
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts((current) => current.filter((toast) => toast.id !== id));
    }, []);

    const clearToasts = React.useCallback(() => {
        setToasts([]);
    }, []);

    return (
        <ToastContext.Provider
            value={{ toasts, addToast, removeToast, clearToasts }}
        >
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
};

// Toast Container untuk menampilkan toast
const ToastContainer: React.FC = () => {
    const context = React.useContext(ToastContext);
    if (!context) return null;

    const { toasts, removeToast } = context;

    return (
        <div className="fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
            {toasts.map((toast) => (
                <ToastComponent
                    key={toast.id}
                    toast={toast}
                    onRemove={removeToast}
                />
            ))}
        </div>
    );
};

// Individual Toast Component
interface ToastComponentProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
    return (
        <div className={cn(toastVariants({ variant: toast.variant }))}>
            <div className="grid gap-1">
                {toast.title && (
                    <div className="text-sm font-semibold">{toast.title}</div>
                )}
                {toast.description && (
                    <div className="text-sm opacity-90">
                        {toast.description}
                    </div>
                )}
            </div>
            {toast.action}
            <button
                type="button"
                className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
                onClick={() => onRemove(toast.id)}
            >
                <svg
                    className="h-4 w-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
};

// Hook untuk menggunakan toast
export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return {
        ...context,
        success: (message: string, title?: string) =>
            context.addToast({
                variant: "success",
                description: message,
                title,
            }),
        error: (message: string, title?: string) =>
            context.addToast({
                variant: "destructive",
                description: message,
                title,
            }),
        warning: (message: string, title?: string) =>
            context.addToast({
                variant: "warning",
                description: message,
                title,
            }),
        info: (message: string, title?: string) =>
            context.addToast({ variant: "info", description: message, title }),
    };
};

export { type Toast };
