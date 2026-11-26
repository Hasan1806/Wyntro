import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] text-[13px] leading-[20px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#635BFF]/30 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#635BFF] text-white hover:bg-[#5148E5] active:bg-[#463ED8]",
        secondary:
          "bg-white text-[#18181B] border border-[#E4E4E7] hover:bg-[#F4F4F5] hover:border-[#D4D4D8]",
        outline:
          "border border-[#E4E4E7] bg-transparent text-[#18181B] hover:bg-[#F4F4F5] hover:border-[#D4D4D8]",
        ghost: "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B]",
        soft: "bg-[#EFEDFF] text-[#5148E5] hover:bg-[#E4E0FF]",
        destructive: "bg-[#DC2626] text-white hover:bg-[#B91C1C]",
      },
      size: {
        default: "h-9 px-3.5",
        sm: "h-[30px] px-2.5 text-[12px]",
        lg: "h-10 px-4 text-[13px]",
        icon: "h-9 w-9",
        "icon-sm": "h-[30px] w-[30px]",
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
