import * as React from "react";
import { cn } from "@/lib/utils";

// Card components mengikuti prinsip UI: Chunking, Proximity, Closure
const Card = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "outlined" | "elevated" | "ghost";
        interactive?: boolean;
    }
>(({ className, variant = "default", interactive = false, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            // Base styles dengan prinsip consistency
            "rounded-lg text-card-foreground",
            // Variant styles - prinsip visual hierarchy
            {
                "bg-card border shadow-sm": variant === "default",
                "border-2 bg-card": variant === "outlined",
                "bg-card shadow-lg border": variant === "elevated",
                "bg-transparent": variant === "ghost",
            },
            // Interactive states - prinsip feedback
            interactive &&
                "cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] active:scale-[0.98]",
            className
        )}
        {...props}
    />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLHeadingElement> & {
        level?: 1 | 2 | 3 | 4 | 5 | 6;
    }
>(({ className, level = 3, children, ...props }, ref) => {
    return React.createElement(
        `h${level}`,
        {
            ref,
            className: cn(
                // Typography hierarchy - prinsip visual hierarchy
                "text-2xl font-semibold leading-none tracking-tight",
                {
                    "text-3xl": level === 1,
                    "text-2xl": level === 2,
                    "text-xl": level === 3,
                    "text-lg": level === 4,
                    "text-base": level === 5,
                    "text-sm": level === 6,
                },
                className
            ),
            ...props,
        },
        children
    );
});
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
));
CardFooter.displayName = "CardFooter";

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};
