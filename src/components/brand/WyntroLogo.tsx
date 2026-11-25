import { cn } from "@/lib/utils";

interface WyntroLogoProps {
  collapsed?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function WyntroLogo({
  collapsed = false,
  size = "md",
  className,
}: WyntroLogoProps) {
  const iconDim = size === "sm" ? 26 : size === "lg" ? 36 : 30;
  const textSize =
    size === "sm" ? "text-base" : size === "lg" ? "text-xl" : "text-[17px]";

  return (
    <div className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <svg
        width={iconDim}
        height={iconDim}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Wyntro"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill="#635BFF" />
        <path
          d="M7.5 10.5L11.8 21.5L16 12.8L20.2 21.5L24.5 10.5"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {!collapsed && (
        <span
          className={cn(
            "font-semibold tracking-[-0.02em] text-[#101828]",
            textSize
          )}
        >
          Wyntro
        </span>
      )}
    </div>
  );
}
