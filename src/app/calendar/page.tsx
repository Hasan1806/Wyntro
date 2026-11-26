"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusIndicator } from "@/components/ui/primitives";
import { Card } from "@/components/ui/card";
import { useCrmStore } from "@/store/useCrmStore";

type CalView = "daily" | "weekly" | "monthly" | "agenda";

const NOV_DAYS = Array.from({ length: 30 }, (_, i) => {
  const day = String(i + 1).padStart(2, "0");
  return `2026-11-${day}`;
});

export default function CalendarPage() {
  const { followUps } = useCrmStore();
  const [view, setView] = useState<CalView>("weekly");
  const [selectedDate, setSelectedDate] = useState("2026-11-25");

  const weekDates = useMemo(
    () => [
      "2026-11-23",
      "2026-11-24",
      "2026-11-25",
      "2026-11-26",
      "2026-11-27",
      "2026-11-28",
      "2026-11-29",
    ],
    []
  );

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Calendar"
          description="November 2026 · Synchronized with follow-ups and scheduled calls"
          actions={
            <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
              {(["daily", "weekly", "monthly", "agenda"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`rounded-[4px] px-2.5 py-1 text-[12px] font-medium capitalize cursor-pointer transition-colors ${
                    view === v
                      ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          }
        />

        {view === "daily" && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-3">
              <h2 className="text-[14px] font-semibold text-[#18181B]">
                Schedule for {selectedDate}
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-8 rounded-[6px] border border-[#E4E4E7] px-2 text-[12px]"
              />
            </div>
            <div className="divide-y divide-[#E4E4E7]">
              {followUps
                .filter((f) => f.dueDate === selectedDate)
                .map((f) => (
                  <Link
                    key={f.id}
                    href={`/leads/${f.leadId}`}
                    className="flex items-center justify-between py-3 hover:bg-[#F7F7F8] px-2 rounded-[6px]"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-[#18181B]">{f.title}</p>
                      <p className="text-[12px] text-[#71717A]">
                        {f.leadName} · {f.company}
                      </p>
                    </div>
                    <span className="text-[12px] font-medium text-[#52525B] tabular-nums">
                      {f.dueTime}
                    </span>
                  </Link>
                ))}
            </div>
          </Card>
        )}

        {view === "weekly" && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
            {weekDates.map((date) => {
              const items = followUps.filter((f) => f.dueDate === date);
              const isToday = date === "2026-11-25";
              return (
                <div
                  key={date}
                  className={`rounded-[8px] border bg-white p-3 min-h-[240px] flex flex-col ${
                    isToday ? "border-[#635BFF]" : "border-[#E4E4E7]"
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E4E4E7]">
                    <span className="text-[12px] font-semibold text-[#18181B] tabular-nums">
                      {date.slice(5)}
                    </span>
                    {isToday && (
                      <span className="text-[11px] font-medium text-[#635BFF]">Today</span>
                    )}
                  </div>
                  <div className="space-y-1.5 flex-1">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/leads/${item.leadId}`}
                        className="block rounded-[6px] border border-[#E4E4E7] bg-[#FAFAFA] p-2 hover:border-[#D4D4D8] hover:bg-white transition-colors"
                      >
                        <p className="text-[11px] font-medium text-[#635BFF] tabular-nums">
                          {item.dueTime}
                        </p>
                        <p className="text-[12px] font-medium text-[#18181B] line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#71717A] truncate">
                          {item.leadName}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {view === "monthly" && (
          <Card className="p-3">
            <div className="grid grid-cols-7 gap-1.5">
              {NOV_DAYS.map((date) => {
                const count = followUps.filter((f) => f.dueDate === date).length;
                const isToday = date === "2026-11-25";
                return (
                  <button
                    key={date}
                    onClick={() => {
                      setSelectedDate(date);
                      setView("daily");
                    }}
                    className={`rounded-[6px] border p-2.5 text-left h-[82px] hover:border-[#D4D4D8] cursor-pointer flex flex-col justify-between ${
                      isToday
                        ? "border-[#635BFF] bg-[#EFEDFF]/30"
                        : "border-[#E4E4E7] bg-white"
                    }`}
                  >
                    <span className="text-[12px] font-medium text-[#18181B] tabular-nums">
                      {date.slice(8)}
                    </span>
                    {count > 0 && (
                      <span className="text-[11px] font-medium text-[#635BFF] truncate">
                        {count} task{count > 1 ? "s" : ""}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {view === "agenda" && (
          <Card className="divide-y divide-[#E4E4E7]">
            {[...followUps]
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/leads/${f.leadId}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-[#F7F7F8]"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[12px] font-medium text-[#71717A] tabular-nums w-24 shrink-0">
                      {f.dueDate}
                    </span>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#18181B] truncate">
                        {f.title}
                      </p>
                      <p className="text-[12px] text-[#71717A] truncate">
                        {f.leadName} · {f.company}
                      </p>
                    </div>
                  </div>
                  <StatusIndicator
                    color={
                      f.status === "completed"
                        ? "#16A34A"
                        : f.status === "overdue"
                        ? "#DC2626"
                        : "#2563EB"
                    }
                    label={f.status}
                  />
                </Link>
              ))}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
