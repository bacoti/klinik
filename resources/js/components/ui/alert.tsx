import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Alert component mengikuti prinsip UI: Feedback, Error prevention, Recognition
const alertVariants = cva(
    "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive:
                    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
                warning:
                    "border-yellow-500/50 bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200 [&>svg]:text-yellow-600",
                success:
                    "border-green-500/50 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200 [&>svg]:text-green-600",
                info: "border-blue-500/50 bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200 [&>svg]:text-blue-600",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

// Icons untuk setiap jenis alert - prinsip recognition rather than recall
const AlertIcons = {
    destructive: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    ),
    warning: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
            />
        </svg>
    ),
    success: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
            />
        </svg>
    ),
    info: (
        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
            />
        </svg>
    ),
};

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> &
        VariantProps<typeof alertVariants> & {
            dismissible?: boolean;
            onDismiss?: () => void;
        }
>(
    (
        {
            className,
            variant,
            dismissible = false,
            onDismiss,
            children,
            ...props
        },
        ref
    ) => {
        const [isVisible, setIsVisible] = React.useState(true);

        const handleDismiss = () => {
            setIsVisible(false);
            onDismiss?.();
        };

        if (!isVisible) return null;

        return (
            <div
                ref={ref}
                role="alert"
                aria-live="polite"
                className={cn(alertVariants({ variant }), className)}
                {...props}
            >
                {/* Auto-add icon berdasarkan variant */}
                {variant && variant !== "default" && AlertIcons[variant]}

                <div className="flex-1">{children}</div>

                {/* Dismiss button - prinsip user control */}
                {dismissible && (
                    <button
                        type="button"
                        className="absolute top-2 right-2 p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                        onClick={handleDismiss}
                        aria-label="Dismiss alert"
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
                )}
            </div>
        );
    }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h5
        ref={ref}
        className={cn(
            "mb-1 font-medium leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("text-sm [&_p]:leading-relaxed", className)}
        {...props}
    />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
