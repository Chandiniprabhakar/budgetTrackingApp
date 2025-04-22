"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "lib/utils";

interface ProgressProps extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value: number;
  max?: number;
  indicator?: string;
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, max = 100, indicator, ...props }, ref) => {
  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("relative h-4 w-full overflow-hidden rounded-full bg-gray-200", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-blue-500 transition-all", // Fixed missing comma
          indicator 
        )}
        style={{ transform: `translateX(-${100 - (value / max) * 100}%)` }}
      />
    </ProgressPrimitive.Root>
  );
});

Progress.displayName = "Progress";

export { Progress };
