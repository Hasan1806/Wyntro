"use client";

import { useState } from "react";
import { Search, Keyboard, ShieldCheck, BookOpen } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const GUIDES = [
  {
    title: "Managing Leads & Saved Views",
    body: "Use the Leads table to filter by source, owner, stage, and priority. Export filtered slices to CSV or run bulk updates.",
  },
  {
    title: "Drag-and-Drop Sales Pipeline",
    body: "Switch between Board and List views in Sales Pipeline. Moving a card updates the lead stage and logs a timeline entry automatically.",
  },
  {
    title: "Simulated Messaging & Automations",
    body: "All WhatsApp, Email, SMS, and workflow executions run deterministically in local browser state without contacting external providers.",
  },
];

export default function HelpPage() {
  const [q, setQ] = useState("");
  const filtered = GUIDES.filter(
    (g) =>
      !q.trim() ||
      g.title.toLowerCase().includes(q.toLowerCase()) ||
      g.body.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <AppShell>
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
            Help Center
          </h1>
          <p className="text-[13px] text-[#667085]">
            Quick guides, keyboard shortcuts, and frontend demo documentation
          </p>
        </div>

        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search help articles..."
            className="pl-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828]">
              <Keyboard className="h-4 w-4 text-[#635BFF]" />
              Keyboard Shortcuts
            </div>
            <p className="text-[13px] text-[#667085]">
              Press <kbd className="rounded border px-1.5 py-0.5 text-[11px]">Ctrl/⌘ + K</kbd> anywhere to open Global Command Search.
            </p>
          </Card>

          <Card className="p-5 space-y-2">
            <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828]">
              <ShieldCheck className="h-4 w-4 text-[#12B76A]" />
              Frontend Demo Mode
            </div>
            <p className="text-[13px] text-[#667085]">
              All data persists locally in browser storage. Reset anytime in Settings → Demo & Reset.
            </p>
          </Card>
        </div>

        <div className="space-y-3">
          {filtered.map((g) => (
            <Card key={g.title} className="p-5">
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#101828]">
                <BookOpen className="h-4 w-4 text-[#635BFF]" />
                {g.title}
              </div>
              <p className="mt-1.5 text-[13px] text-[#667085]">{g.body}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
