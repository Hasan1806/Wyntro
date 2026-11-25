import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#F2F4F7] text-[#344054]",
        primary: "bg-[#EFEDFF] text-[#635BFF]",
        success: "bg-[#ECFDF3] text-[#027A48]",
        warning: "bg-[#FFFAEB] text-[#B54708]",
        error: "bg-[#FEF3F2] text-[#B42318]",
        info: "bg-[#EFF8FF] text-[#175CD3]",
        outline: "border border-[#E4E7EC] text-[#667085] bg-white",
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
