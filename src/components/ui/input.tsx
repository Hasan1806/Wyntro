import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => (
  <input
    type={type}
    ref={ref}
    className={cn(
      "flex h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-3 py-1.5 text-[13px] leading-[20px] text-[#18181B] placeholder:text-[#A1A1AA] transition-colors duration-150 focus-visible:outline-none focus-visible:border-[#635BFF] focus-visible:ring-2 focus-visible:ring-[#635BFF]/15 disabled:cursor-not-allowed disabled:bg-[#F7F7F8] disabled:text-[#71717A]",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-[80px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-3 py-2 text-[13px] leading-[20px] text-[#18181B] placeholder:text-[#A1A1AA] transition-colors duration-150 focus-visible:outline-none focus-visible:border-[#635BFF] focus-visible:ring-2 focus-visible:ring-[#635BFF]/15 disabled:cursor-not-allowed disabled:bg-[#F7F7F8]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
