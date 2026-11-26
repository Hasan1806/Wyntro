import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  meta?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  meta,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-[#E4E4E7]",
        className
      )}
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-[26px] leading-[34px] font-semibold tracking-[-0.65px] text-[#18181B]">
            {title}
          </h1>
          {meta}
        </div>
        {description && (
          <p className="mt-1.5 text-[13px] leading-[20px] text-[#71717A]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
