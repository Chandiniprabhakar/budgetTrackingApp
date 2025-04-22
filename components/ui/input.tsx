import { cn } from "lib/utils";
import * as React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
