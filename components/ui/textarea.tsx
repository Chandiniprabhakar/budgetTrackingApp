import { cn } from "lib/utils";
import * as React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border px-3 py-2 text-sm outline-none transition-all focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
