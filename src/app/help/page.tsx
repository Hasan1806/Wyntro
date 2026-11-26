"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
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
      <div className="space-y-5 max-w-3xl">
        <PageHeader
          title="Help Center"
          description="Quick guides, keyboard shortcuts, and demo mode documentation"
        />

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA]" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search help articles..."
            className="pl-8.5 h-9"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 space-y-1">
            <p className="text-[13px] font-semibold text-[#18181B]">
              Keyboard Shortcuts
            </p>
            <p className="text-[13px] text-[#52525B]">
              Press <kbd className="rounded-[4px] border border-[#E4E4E7] bg-[#F7F7F8] px-1.5 py-0.5 text-[11px] font-mono">Ctrl/⌘ + K</kbd> anywhere to open Global Search.
            </p>
          </Card>

          <Card className="p-4 space-y-1">
            <p className="text-[13px] font-semibold text-[#18181B]">
              Frontend Demo Mode
            </p>
            <p className="text-[13px] text-[#52525B]">
              Data persists locally in browser storage. Reset anytime in Settings → Demo & Reset.
            </p>
          </Card>
        </div>

        <Card className="divide-y divide-[#E4E4E7]">
          {filtered.map((g) => (
            <div key={g.title} className="p-4">
              <p className="text-[14px] font-semibold text-[#18181B]">{g.title}</p>
              <p className="mt-1 text-[13px] text-[#52525B]">{g.body}</p>
            </div>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
