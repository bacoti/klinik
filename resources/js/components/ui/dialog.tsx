import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

// Dialog mengikuti prinsip ragam dialog: Modal, Non-modal, System-initiated, User-initiated
const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

// Overlay dengan proper feedback dan transition
const DialogOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            className
        )}
        {...props}
    />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Dialog Content dengan different sizes - prinsip progressive disclosure
const DialogContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        size?: "sm" | "md" | "lg" | "xl" | "full";
        closable?: boolean;
        onEscapeKeyDown?: (event: KeyboardEvent) => void;
    }
>(
    (
        {
            className,
            children,
            size = "md",
            closable = true,
            onEscapeKeyDown,
            ...props
        },
        ref
    ) => (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed left-[50%] top-[50%] z-50 grid w-full translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
                    {
                        "max-w-sm": size === "sm",
                        "max-w-lg": size === "md",
                        "max-w-2xl": size === "lg",
                        "max-w-4xl": size === "xl",
                        "max-w-[95vw] max-h-[95vh]": size === "full",
                    },
                    className
                )}
                onEscapeKeyDown={onEscapeKeyDown}
                {...props}
            >
                {children}
                {closable && (
                    <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                        <X className="h-4 w-4" />
                        <span className="sr-only">Close</span>
                    </DialogPrimitive.Close>
                )}
            </DialogPrimitive.Content>
        </DialogPortal>
    )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-col space-y-1.5 text-center sm:text-left",
            className
        )}
        {...props}
    />
));
DialogHeader.displayName = "DialogHeader";

const DialogFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        align?: "left" | "center" | "right" | "between";
    }
>(({ className, align = "right", ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex flex-col-reverse sm:flex-row gap-2",
            {
                "sm:justify-start": align === "left",
                "sm:justify-center": align === "center",
                "sm:justify-end": align === "right",
                "sm:justify-between": align === "between",
            },
            className
        )}
        {...props}
    />
));
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn(
            "text-lg font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// Confirmation Dialog - prinsip error prevention
interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => void | Promise<void>;
    loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default",
    onConfirm,
    loading = false,
}) => {
    const handleConfirm = async () => {
        try {
            await onConfirm();
            onOpenChange(false);
        } catch (error) {
            console.error("Confirmation action failed:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent size="sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={loading}
                        className={cn(
                            "px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50",
                            variant === "destructive"
                                ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                                : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                        )}
                    >
                        {loading ? "Processing..." : confirmText}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export {
    Dialog,
    DialogPortal,
    DialogOverlay,
    DialogClose,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
    ConfirmDialog,
};
