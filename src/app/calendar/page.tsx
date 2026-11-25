"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Calendar
            </h1>
            <p className="text-[13px] text-[#667085]">
              November 2026 • Synchronized with your follow-ups and calls
            </p>
          </div>
          <div className="inline-flex rounded-[8px] border border-[#E4E7EC] bg-white p-0.5">
            {(["daily", "weekly", "monthly", "agenda"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium capitalize cursor-pointer ${
                  view === v
                    ? "bg-[#EFEDFF] text-[#635BFF]"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "daily" && (
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[#101828]">
                Schedule for {selectedDate}
              </h2>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-8 rounded-[6px] border border-[#E4E7EC] px-2 text-[12px]"
              />
            </div>
            {followUps
              .filter((f) => f.dueDate === selectedDate)
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/leads/${f.leadId}`}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E7EC] p-3 hover:bg-[#F8F9FC]"
                >
                  <div>
                    <p className="text-[13px] font-medium text-[#101828]">{f.title}</p>
                    <p className="text-[12px] text-[#667085]">
                      {f.leadName} • {f.company}
                    </p>
                  </div>
                  <Badge variant={f.status === "completed" ? "success" : "primary"}>
                    {f.dueTime}
                  </Badge>
                </Link>
              ))}
          </Card>
        )}

        {view === "weekly" && (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weekDates.map((date) => {
              const items = followUps.filter((f) => f.dueDate === date);
              const isToday = date === "2026-11-25";
              return (
                <Card
                  key={date}
                  className={`p-3 min-h-[220px] ${
                    isToday ? "border-[#635BFF] ring-1 ring-[#635BFF]/20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#E4E7EC]">
                    <span className="text-[12px] font-semibold text-[#101828] tabular-nums">
                      {date.slice(5)}
                    </span>
                    {isToday && <Badge variant="primary">Today</Badge>}
                  </div>
                  <div className="space-y-2">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        href={`/leads/${item.leadId}`}
                        className="block rounded-[6px] border border-[#E4E7EC] bg-[#F8F9FC] p-2 hover:border-[#635BFF]"
                      >
                        <p className="text-[11px] font-semibold text-[#635BFF] tabular-nums">
                          {item.dueTime}
                        </p>
                        <p className="text-[12px] font-medium text-[#101828] line-clamp-2">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-[#667085] truncate">
                          {item.leadName}
                        </p>
                      </Link>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {view === "monthly" && (
          <Card className="p-4">
            <div className="grid grid-cols-7 gap-2">
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
                    className={`rounded-[8px] border p-2.5 text-left min-h-[76px] hover:border-[#635BFF] cursor-pointer ${
                      isToday ? "border-[#635BFF] bg-[#EFEDFF]/40" : "border-[#E4E7EC]"
                    }`}
                  >
                    <span className="text-[12px] font-semibold text-[#101828] tabular-nums">
                      {date.slice(8)}
                    </span>
                    {count > 0 && (
                      <p className="mt-1.5 text-[11px] font-medium text-[#635BFF]">
                        {count} task{count > 1 ? "s" : ""}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        )}

        {view === "agenda" && (
          <Card className="divide-y divide-[#E4E7EC]">
            {[...followUps]
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .map((f) => (
                <Link
                  key={f.id}
                  href={`/leads/${f.leadId}`}
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F8F9FC]"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-[12px] font-medium text-[#667085] tabular-nums w-24">
                      {f.dueDate}
                    </span>
                    <div>
                      <p className="text-[13px] font-medium text-[#101828]">{f.title}</p>
                      <p className="text-[12px] text-[#667085]">
                        {f.leadName} • {f.company}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      f.status === "completed"
                        ? "success"
                        : f.status === "overdue"
                        ? "error"
                        : "info"
                    }
                    className="capitalize"
                  >
                    {f.status}
                  </Badge>
                </Link>
              ))}
          </Card>
        )}
      </div>
    </AppShell>
  );
}
