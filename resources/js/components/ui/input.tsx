import * as React from "react";
import { cn } from "@/lib/utils";

// Input component mengikuti prinsip UI: Error prevention, Help and documentation, Recognition rather than recall
export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    hint?: string;
    required?: boolean;
    icon?: React.ReactNode;
    suffix?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            error,
            label,
            hint,
            required,
            icon,
            suffix,
            id,
            ...props
        },
        ref
    ) => {
        const inputId = id || React.useId();
        const hintId = `${inputId}-hint`;
        const errorId = `${inputId}-error`;

        return (
            <div className="space-y-2">
                {/* Label dengan prinsip recognition rather than recall */}
                {label && (
                    <label
                        htmlFor={inputId}
                        className={cn(
                            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                            error ? "text-destructive" : "text-foreground"
                        )}
                    >
                        {label}
                        {required && (
                            <span
                                className="text-destructive ml-1"
                                aria-label="required"
                            >
                                *
                            </span>
                        )}
                    </label>
                )}

                {/* Help text - prinsip help and documentation */}
                {hint && !error && (
                    <p id={hintId} className="text-xs text-muted-foreground">
                        {hint}
                    </p>
                )}

                {/* Input wrapper dengan icon support */}
                <div className="relative">
                    {icon && (
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            {icon}
                        </div>
                    )}

                    <input
                        type={type}
                        id={inputId}
                        className={cn(
                            // Base styles dengan prinsip consistency
                            "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                            // Prinsip feedback untuk error state
                            error
                                ? "border-destructive focus-visible:ring-destructive"
                                : "border-input",
                            // Icon spacing
                            icon && "pl-10",
                            suffix && "pr-10",
                            className
                        )}
                        ref={ref}
                        aria-invalid={error ? "true" : "false"}
                        aria-describedby={cn(
                            hint && !error ? hintId : undefined,
                            error ? errorId : undefined
                        )}
                        {...props}
                    />

                    {suffix && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                            {suffix}
                        </div>
                    )}
                </div>

                {/* Error message dengan prinsip error prevention dan feedback */}
                {error && (
                    <p
                        id={errorId}
                        className="text-xs text-destructive flex items-center gap-1"
                    >
                        <svg
                            className="h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);
Input.displayName = "Input";

export { Input };
