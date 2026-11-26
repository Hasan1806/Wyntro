import React from "react";
import { cn, getInitials } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center justify-between gap-3", className)}>
      <div>
        <h2 className="text-[16px] leading-[24px] font-semibold text-[#18181B]">
          {title}
        </h2>
        {description && (
          <p className="text-[12px] leading-[18px] text-[#71717A]">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  delta,
  positive = true,
  sublabel,
  className,
}: {
  label: string;
  value: string;
  delta?: string;
  positive?: boolean;
  sublabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[8px] border border-[#E4E4E7] bg-white px-4 py-3.5",
        className
      )}
    >
      <p className="text-[12px] leading-[18px] font-medium text-[#71717A]">{label}</p>
      <p className="mt-1.5 text-[28px] leading-[32px] font-semibold tracking-[-0.02em] text-[#18181B] tabular-nums">
        {value}
      </p>
      {(delta || sublabel) && (
        <div className="mt-2 flex items-center gap-1.5 text-[12px] leading-[18px]">
          {delta && (
            <span
              className={cn(
                "font-medium tabular-nums",
                positive ? "text-[#16A34A]" : "text-[#DC2626]"
              )}
            >
              {delta}
            </span>
          )}
          {sublabel && <span className="text-[#A1A1AA] truncate">{sublabel}</span>}
        </div>
      )}
    </div>
  );
}

export function StatusIndicator({
  color = "#71717A",
  label,
  className,
}: {
  color?: string;
  label: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-[12px] leading-[18px] font-medium text-[#52525B]",
        className
      )}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span>{label}</span>
    </span>
  );
}

export function PropertyRow({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 py-2 text-[13px] border-b border-[#E4E4E7] last:border-b-0",
        className
      )}
    >
      <span className="text-[#71717A] shrink-0">{label}</span>
      <span className="text-[#18181B] font-medium text-right truncate">{value}</span>
    </div>
  );
}

export function Avatar({
  name,
  color = "#635BFF",
  size = "md",
  className,
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const dims =
    size === "sm"
      ? "h-6 w-6 text-[10px]"
      : size === "lg"
      ? "h-10 w-10 text-[13px]"
      : "h-8 w-8 text-[11px]";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium text-white select-none",
        dims,
        className
      )}
      style={{ backgroundColor: color }}
    >
      {getInitials(name)}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[8px] border border-[#E4E4E7] bg-white px-6 py-12 text-center",
        className
      )}
    >
      {icon && <div className="mb-3 text-[#A1A1AA]">{icon}</div>}
      <p className="text-[14px] font-semibold text-[#18181B]">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] text-[#71717A]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadingSkeleton({
  rows = 4,
  className,
}: {
  rows?: number;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2.5", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-10 w-full animate-pulse rounded-[6px] bg-[#F4F4F5]"
        />
      ))}
    </div>
  );
}

export function ErrorState({
  title = "Something went wrong",
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-[8px] border border-[#FECACA] bg-[#FEF2F2] px-6 py-10 text-center">
      <AlertCircle className="h-5 w-5 text-[#DC2626] mb-2" />
      <p className="text-[14px] font-semibold text-[#18181B]">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-[13px] text-[#52525B]">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
