import * as React from "react";
import { cn } from "@/lib/utils";

// Form components mengikuti prinsip UI: Error prevention, Chunking, Progressive disclosure
const Form = React.forwardRef<
    HTMLFormElement,
    React.FormHTMLAttributes<HTMLFormElement> & {
        onSubmit?: (
            e: React.FormEvent<HTMLFormElement>
        ) => void | Promise<void>;
        loading?: boolean;
    }
>(({ className, onSubmit, loading = false, children, ...props }, ref) => {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loading) return;

        try {
            await onSubmit?.(e);
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    return (
        <form
            ref={ref}
            className={cn("space-y-6", className)}
            onSubmit={handleSubmit}
            noValidate // We handle validation ourselves
            {...props}
        >
            <fieldset disabled={loading} className="space-y-6">
                {children}
            </fieldset>
        </form>
    );
});
Form.displayName = "Form";

// Form Group untuk chunking related fields
const FormGroup = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        title?: string;
        description?: string;
        required?: boolean;
    }
>(({ className, title, description, required, children, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-4", className)} {...props}>
        {title && (
            <div className="space-y-1">
                <h3 className="text-lg font-medium">
                    {title}
                    {required && (
                        <span className="text-destructive ml-1">*</span>
                    )}
                </h3>
                {description && (
                    <p className="text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
        )}
        <div className="space-y-4">{children}</div>
    </div>
));
FormGroup.displayName = "FormGroup";

// Form Row untuk layout horizontal
const FormRow = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        columns?: number;
        gap?: "sm" | "md" | "lg";
    }
>(({ className, columns = 2, gap = "md", children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "grid",
            {
                "grid-cols-1 md:grid-cols-2": columns === 2,
                "grid-cols-1 md:grid-cols-3": columns === 3,
                "grid-cols-1 md:grid-cols-4": columns === 4,
            },
            {
                "gap-2": gap === "sm",
                "gap-4": gap === "md",
                "gap-6": gap === "lg",
            },
            className
        )}
        {...props}
    >
        {children}
    </div>
));
FormRow.displayName = "FormRow";

// Form Actions untuk tombol-tombol
const FormActions = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        align?: "left" | "center" | "right" | "between";
        reverse?: boolean;
    }
>(
    (
        { className, align = "right", reverse = false, children, ...props },
        ref
    ) => (
        <div
            ref={ref}
            className={cn(
                "flex gap-3 pt-4 border-t",
                {
                    "justify-start": align === "left",
                    "justify-center": align === "center",
                    "justify-end": align === "right",
                    "justify-between": align === "between",
                },
                reverse && "flex-row-reverse",
                className
            )}
            {...props}
        >
            {children}
        </div>
    )
);
FormActions.displayName = "FormActions";

// Progress indicator untuk multi-step forms
const FormProgress = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        steps: string[];
        currentStep: number;
        completedSteps?: number[];
    }
>(({ className, steps, currentStep, completedSteps = [], ...props }, ref) => (
    <div ref={ref} className={cn("mb-8", className)} {...props}>
        <div className="flex items-center justify-between">
            {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(index);
                const isCurrent = index === currentStep;
                const isConnected = index < steps.length - 1;

                return (
                    <React.Fragment key={index}>
                        <div className="flex flex-col items-center">
                            <div
                                className={cn(
                                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                                    {
                                        "bg-primary border-primary text-primary-foreground":
                                            isCompleted,
                                        "bg-primary/10 border-primary text-primary":
                                            isCurrent,
                                        "bg-muted border-muted-foreground/30 text-muted-foreground":
                                            !isCompleted && !isCurrent,
                                    }
                                )}
                            >
                                {isCompleted ? (
                                    <svg
                                        className="w-4 h-4"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>
                            <span
                                className={cn("mt-2 text-xs font-medium", {
                                    "text-primary": isCurrent || isCompleted,
                                    "text-muted-foreground":
                                        !isCurrent && !isCompleted,
                                })}
                            >
                                {step}
                            </span>
                        </div>

                        {isConnected && (
                            <div
                                className={cn(
                                    "flex-1 h-0.5 mx-4",
                                    isCompleted ? "bg-primary" : "bg-muted"
                                )}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    </div>
));
FormProgress.displayName = "FormProgress";

export { Form, FormGroup, FormRow, FormActions, FormProgress };
