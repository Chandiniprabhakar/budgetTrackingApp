"use client";

import { cn } from "lib/utils";
import * as React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error";
}

const Badge: React.FC<BadgeProps> = ({ className, variant = "default", ...props }) => {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        {
          "bg-gray-200 text-gray-800": variant === "default",
          "bg-green-500 text-white": variant === "success",
          "bg-yellow-500 text-white": variant === "warning",
          "bg-red-500 text-white": variant === "error",
        },
        className
      )}
      {...props}
    />
  );
};

export { Badge };
