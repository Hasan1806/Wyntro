"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = DialogPrimitive.Root;
export const SheetTrigger = DialogPrimitive.Trigger;
export const SheetClose = DialogPrimitive.Close;

export function SheetContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#18181B]/30 backdrop-blur-[1px]" />
      <DialogPrimitive.Content
        className={cn(
          "fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col border-l border-[#E4E4E7] bg-white shadow-[0_16px_40px_-12px_rgba(24,24,27,0.18)] focus:outline-none",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-[6px] p-1.5 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors cursor-pointer">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export function SheetHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("border-b border-[#E4E7EC] px-6 py-4", className)}
      {...props}
    />
  );
}

export function SheetTitle({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-[16px] font-semibold text-[#101828]", className)}
      {...props}
    />
  );
}
