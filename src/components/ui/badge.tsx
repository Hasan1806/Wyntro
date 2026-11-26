import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-[5px] px-2 py-0.5 text-[11px] leading-[16px] font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#F4F4F5] text-[#52525B]",
        primary: "bg-[#EFEDFF] text-[#5148E5]",
        success: "bg-[#F0FDF4] text-[#15803D]",
        warning: "bg-[#FFFBEB] text-[#B45309]",
        error: "bg-[#FEF2F2] text-[#B91C1C]",
        info: "bg-[#EFF6FF] text-[#1D4ED8]",
        outline: "border border-[#E4E4E7] text-[#52525B] bg-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
