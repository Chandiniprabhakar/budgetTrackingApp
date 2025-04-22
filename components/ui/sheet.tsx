"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "lib/utils";
import { ReactNode } from "react";

interface SheetContentProps extends React.ComponentProps<typeof Dialog.Content> {
  children: ReactNode;
  className?: string;
  side?: "left" | "right" | "top" | "bottom"; // ✅ Add a side prop
  title?: string; // ✅ Add title prop
}

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;

export const SheetContent = ({ children, className, side = "right", title = "Sheet", ...props }: SheetContentProps) => {
  const sideClasses = {
    left: "left-0 top-0 h-full w-80", 
    right: "right-0 top-0 h-full w-80", 
    top: "top-0 left-0 w-full h-64", 
    bottom: "bottom-0 left-0 w-full h-64", 
  };

  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50" />
      <Dialog.Content
        className={cn(
          "fixed bg-white dark:bg-gray-900 shadow-lg transition-transform",
          sideClasses[side], 
          className
        )}
        {...props}
      >
        <Dialog.Title className="sr-only">{title}</Dialog.Title> {/* ✅ Add Title for Accessibility */}
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};
