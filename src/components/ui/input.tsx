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
      "flex h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-3 py-1.5 text-[13px] text-[#101828] placeholder:text-[#98A2B3] transition-colors focus-visible:outline-none focus-visible:border-[#635BFF] focus-visible:ring-2 focus-visible:ring-[#635BFF]/15 disabled:cursor-not-allowed disabled:bg-[#F8F9FC] disabled:text-[#98A2B3]",
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
      "flex min-h-[80px] w-full rounded-[8px] border border-[#E4E7EC] bg-white px-3 py-2 text-[13px] text-[#101828] placeholder:text-[#98A2B3] transition-colors focus-visible:outline-none focus-visible:border-[#635BFF] focus-visible:ring-2 focus-visible:ring-[#635BFF]/15 disabled:cursor-not-allowed disabled:bg-[#F8F9FC]",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
