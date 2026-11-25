import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[8px] text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#635BFF] text-white hover:bg-[#5148E5] shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
        secondary:
          "bg-white text-[#101828] border border-[#E4E7EC] hover:bg-[#F8F9FC] shadow-[0_1px_2px_rgba(16,24,40,0.04)]",
        ghost: "text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828]",
        soft: "bg-[#EFEDFF] text-[#635BFF] hover:bg-[#E4E0FF]",
        destructive:
          "bg-[#F04438] text-white hover:bg-[#D92D20] shadow-[0_1px_2px_rgba(16,24,40,0.06)]",
        outline:
          "border border-[#E4E7EC] bg-transparent text-[#101828] hover:bg-[#F8F9FC]",
      },
      size: {
        default: "h-9 px-3.5 py-2",
        sm: "h-8 px-2.5 text-[12px]",
        lg: "h-10 px-4 text-[14px]",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
