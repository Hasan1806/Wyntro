"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  GitFork,
  Inbox,
  Kanban,
  Megaphone,
  ShieldCheck,
  Users,
  Workflow,
  Clock,
  Layers,
  Activity,
  Target,
} from "lucide-react";
import { WyntroLogo } from "@/components/brand/WyntroLogo";
import { Button } from "@/components/ui/button";

const PREVIEW_TABS = [
  { id: "pipeline", label: "Sales Pipeline", icon: Kanban },
  { id: "inbox", label: "Unified Inbox", icon: Inbox },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function HomepageShowcase() {
  const [activeTab, setActiveTab] =
    useState<(typeof PREVIEW_TABS)[number]["id"]>("pipeline");
  const [roleView, setRoleView] = useState<"admin" | "rep">("admin");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#18181B] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link href="/" className="flex items-center shrink-0">
            <WyntroLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-[#52525B]">
            {[
              { label: "Overview", href: "/dashboard" },
              { label: "Leads", href: "/leads" },
              { label: "Pipeline", href: "/pipeline" },
              { label: "Inbox", href: "/inbox" },
              { label: "Automations", href: "/automations" },
              { label: "Analytics", href: "/analytics" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-[6px] px-3 py-1.5 transition-colors hover:bg-[#F4F4F5] hover:text-[#18181B]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="secondary" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/dashboard">
                Open Workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-14 pb-16 lg:pt-20 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-[5px] border border-[#E4E4E7] bg-white px-2.5 py-1 text-[12px] font-medium text-[#52525B]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF]" />
                Wyntro CRM · Frontend Interactive Workspace
              </div>

              <h1 className="text-[36px] sm:text-[44px] font-semibold tracking-[-0.03em] leading-[1.1] text-[#18181B]">
                Connect smarter.{" "}
                <span className="text-[#635BFF]">Convert faster.</span>
              </h1>

              <p className="text-[15px] leading-[24px] text-[#52525B] max-w-lg">
                Lead management, multi-stage sales pipelines, unified
                multi-channel inbox, and deterministic workflow automation
                designed for revenue teams.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Launch Demo Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/onboarding">Try 7-Step Onboarding</Link>
                </Button>
                <Button size="lg" variant="ghost" asChild>
                  <Link href="/leads">Browse Leads</Link>
                </Button>
              </div>

              <div className="pt-4 border-t border-[#E4E4E7] flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[#71717A]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  No credentials required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                  Persisted local demo state
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#635BFF]" />
                  Simulated messaging & workflows
                </span>
              </div>
            </div>

            {/* Interactive Product Frame */}
            <div className="lg:col-span-6">
              <div className="rounded-[8px] border border-[#E4E4E7] bg-white overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] bg-[#F7F7F8] px-3 py-2">
                  <span className="text-[11px] font-medium text-[#71717A]">
                    wyntro.app / workspace
                  </span>
                  <div className="flex items-center gap-1 rounded-[6px] border border-[#E4E4E7] bg-white p-0.5">
                    {PREVIEW_TABS.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[11px] font-medium transition-colors cursor-pointer ${
                            active
                              ? "bg-[#F4F4F5] text-[#18181B]"
                              : "text-[#71717A] hover:text-[#18181B]"
                          }`}
                        >
                          <Icon className="h-3 w-3 text-[#635BFF]" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-[#FAFAFA] min-h-[296px]">
                  {activeTab === "pipeline" && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        {
                          stage: "Qualified",
                          color: "#D97706",
                          val: "₹7.2L",
                          cards: [
                            { name: "Sophia Lindqvist", co: "NordicCloud AB", amt: "₹4,80,000" },
                            { name: "Ananya Deshmukh", co: "Meridian Prop.", amt: "₹2,40,000" },
                          ],
                        },
                        {
                          stage: "Proposal Sent",
                          color: "#635BFF",
                          val: "₹6.85L",
                          cards: [
                            { name: "Daniel K. Thorne", co: "Veridian Labs", amt: "₹3,25,000" },
                            { name: "Rohan Kapoor", co: "Velox Logistics", amt: "₹3,60,000" },
                          ],
                        },
                        {
                          stage: "Closed Won",
                          color: "#16A34A",
                          val: "₹6.4L",
                          cards: [
                            { name: "Kenji Takahashi", co: "Apex FinTech", amt: "₹6,40,000" },
                          ],
                        },
                      ].map((col) => (
                        <div
                          key={col.stage}
                          className="rounded-[8px] border border-[#E4E4E7] bg-white p-2.5 space-y-2"
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-[#E4E4E7]">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#18181B]">
                              <span
                                className="h-1.5 w-1.5 rounded-full"
                                style={{ backgroundColor: col.color }}
                              />
                              {col.stage}
                            </span>
                            <span className="text-[11px] font-medium text-[#71717A] tabular-nums">
                              {col.val}
                            </span>
                          </div>
                          {col.cards.map((c) => (
                            <div
                              key={c.name}
                              className="rounded-[6px] border border-[#E4E4E7] bg-[#FAFAFA] p-2"
                            >
                              <p className="text-[11px] font-medium text-[#18181B] truncate">
                                {c.name}
                              </p>
                              <p className="text-[10px] text-[#71717A] truncate">{c.co}</p>
                              <p className="mt-1 text-[11px] font-semibold text-[#18181B] tabular-nums">
                                {c.amt}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "inbox" && (
                    <div className="rounded-[8px] border border-[#E4E4E7] bg-white p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
                        <div>
                          <p className="text-[13px] font-semibold text-[#18181B]">
                            Sophia Lindqvist · NordicCloud AB
                          </p>
                          <p className="text-[11px] text-[#71717A]">
                            WhatsApp · Simulated Thread
                          </p>
                        </div>
                        <span className="text-[11px] font-medium text-[#16A34A]">
                          Negotiation
                        </span>
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="ml-auto max-w-[82%] rounded-[6px] bg-[#635BFF] px-3 py-2 text-white">
                          Hi Sophia, sharing the updated security whitepaper and DPA for your review.
                        </div>
                        <div className="rounded-[6px] border border-[#E4E4E7] bg-[#FFFBEB] px-3 py-2 text-[#92400E] text-[11px]">
                          Internal Note: CFO approved 12% volume discount for 45 seats.
                        </div>
                        <div className="max-w-[82%] rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] px-3 py-2 text-[#18181B]">
                          Our legal team approved the DPA. Can we review pricing at 2 PM?
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics" && (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { label: "Pipeline Value", val: "₹33,50,000", delta: "+18.5%" },
                          { label: "Conversion", val: "24.8%", delta: "+1.9%" },
                          { label: "Avg Response", val: "9m", delta: "-22%" },
                        ].map((k) => (
                          <div
                            key={k.label}
                            className="rounded-[8px] border border-[#E4E4E7] bg-white p-3"
                          >
                            <p className="text-[11px] text-[#71717A]">{k.label}</p>
                            <p className="mt-1 text-[18px] font-semibold text-[#18181B] tabular-nums">
                              {k.val}
                            </p>
                            <p className="text-[11px] font-medium text-[#16A34A]">{k.delta}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-[8px] border border-[#E4E4E7] bg-white p-3.5 space-y-2">
                        <p className="text-[11px] font-medium text-[#71717A]">
                          Lead Source Velocity
                        </p>
                        {[
                          { name: "LinkedIn", pct: "84%", color: "#635BFF" },
                          { name: "Website Form", pct: "72%", color: "#2563EB" },
                          { name: "Facebook Ads", pct: "61%", color: "#16A34A" },
                        ].map((row) => (
                          <div key={row.name} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-medium text-[#52525B]">{row.name}</span>
                              <span className="text-[#71717A] tabular-nums">{row.pct}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#F4F4F5] overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{ width: row.pct, backgroundColor: row.color }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Strip */}
        <section className="border-y border-[#E4E4E7] bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { metric: "< 5 sec", label: "Dashboard clarity", sub: "Immediate KPIs & overdue priorities" },
              { metric: "3.2x", label: "Faster first touch", sub: "Instant lead routing & templates" },
              { metric: "8 Stages", label: "Flexible pipelines", sub: "Drag-and-drop Kanban & list views" },
              { metric: "100%", label: "Unified timeline", sub: "Calls, emails, notes & stage history" },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[26px] font-semibold tracking-[-0.02em] text-[#18181B] tabular-nums">
                  {item.metric}
                </p>
                <p className="text-[13px] font-medium text-[#635BFF]">{item.label}</p>
                <p className="text-[12px] text-[#71717A]">{item.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Lifecycle */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-[24px] leading-[32px] font-semibold tracking-[-0.02em] text-[#18181B]">
                From first click to closed-won, without losing context.
              </h2>
              <p className="text-[14px] leading-[22px] text-[#52525B]">
                Every lead captured through custom forms or ad channels is
                scored, routed to the right representative, and enrolled into
                structured follow-up sequences.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button asChild>
                  <Link href="/forms">Open Form Builder</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/lead-distribution">View Routing Rules</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { step: "01", title: "Capture & Enrich", desc: "Multi-step Lead Forms and ad sources feed directly into your Leads table.", icon: ClipboardList },
                { step: "02", title: "Smart Distribution", desc: "WHEN/AND/THEN rules by source, city, or priority with round-robin balancing.", icon: GitFork },
                { step: "03", title: "Multi-Channel Engage", desc: "Respond from the Unified Inbox via WhatsApp, Email, SMS, or internal notes.", icon: Inbox },
                { step: "04", title: "Track & Close", desc: "Move deals across your Kanban pipeline while follow-ups and analytics update.", icon: Target },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.step}
                    className="rounded-[8px] border border-[#E4E4E7] bg-white p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[#71717A]">
                      <Icon className="h-4 w-4 text-[#635BFF]" />
                      <span className="text-[11px] font-mono">{card.step}</span>
                    </div>
                    <h3 className="text-[14px] font-semibold text-[#18181B]">{card.title}</h3>
                    <p className="text-[13px] text-[#52525B] leading-[20px]">{card.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Complete Module Directory */}
        <section className="border-t border-[#E4E4E7] bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#18181B]">
                  Complete CRM Workspace
                </h2>
                <p className="text-[13px] text-[#71717A] mt-0.5">
                  Jump directly into any Wyntro module.
                </p>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/dashboard">Go to Dashboard →</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { title: "Executive & Rep Dashboard", desc: "KPIs, acquisition trends, funnel, and role priorities.", href: "/dashboard", icon: BarChart3 },
                { title: "Leads & Client Profiles", desc: "TanStack Table, 9 saved views, filters, and 3-region profiles.", href: "/leads", icon: Users },
                { title: "Sales Pipeline", desc: "Multi-pipeline drag-and-drop Kanban and list views.", href: "/pipeline", icon: Kanban },
                { title: "Unified Inbox", desc: "Simulated WhatsApp, Email, SMS, and internal notes.", href: "/inbox", icon: Inbox },
                { title: "Workflow Automations", desc: "Visual node builder with deterministic local simulation.", href: "/automations", icon: Workflow },
                { title: "Lead Distribution", desc: "Round-robin, source, and location-based routing rules.", href: "/lead-distribution", icon: GitFork },
                { title: "Campaigns & Templates", desc: "6-step campaign builder and live personalized previews.", href: "/campaigns", icon: Megaphone },
                { title: "Lead Form Builder", desc: "3-panel form designer that creates live leads in Wyntro.", href: "/forms", icon: ClipboardList },
              ].map((mod) => {
                const Icon = mod.icon;
                return (
                  <Link
                    key={mod.href}
                    href={mod.href}
                    className="group rounded-[8px] border border-[#E4E4E7] bg-[#FAFAFA] p-4 hover:border-[#D4D4D8] hover:bg-white transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <Icon className="h-4 w-4 text-[#635BFF]" />
                      <h3 className="mt-3 text-[14px] font-semibold text-[#18181B] group-hover:text-[#635BFF]">
                        {mod.title}
                      </h3>
                      <p className="mt-1 text-[12px] text-[#71717A] leading-[18px]">
                        {mod.desc}
                      </p>
                    </div>
                    <span className="mt-4 text-[12px] font-medium text-[#52525B] group-hover:text-[#18181B]">
                      Open →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Role Switcher */}
        <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
          <div className="rounded-[8px] border border-[#E4E4E7] bg-white p-6 lg:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E7]">
              <div>
                <h2 className="text-[18px] font-semibold text-[#18181B]">
                  Tailored views for Leaders & Sales Reps
                </h2>
                <p className="text-[13px] text-[#71717A]">
                  Switch roles in the top bar anytime inside the workspace.
                </p>
              </div>
              <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
                <button
                  onClick={() => setRoleView("admin")}
                  className={`rounded-[4px] px-3 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
                    roleView === "admin"
                      ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  Revenue Admin
                </button>
                <button
                  onClick={() => setRoleView("rep")}
                  className={`rounded-[4px] px-3 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
                    roleView === "rep"
                      ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  Sales Representative
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
              {(roleView === "admin"
                ? [
                    { icon: Layers, title: "Team-Wide Pipeline Governance", desc: "Monitor conversion rates across every source, territory, and sales rep." },
                    { icon: GitFork, title: "Automated Lead Distribution", desc: "Ensure zero leads sit unassigned with round-robin and priority routing." },
                    { icon: Activity, title: "Campaign & Content Attribution", desc: "Track broadcast engagement, template approvals, and content views." },
                  ]
                : [
                    { icon: Clock, title: "Focused Daily Follow-ups", desc: "Start every morning with overdue alerts, today’s calls, and calendar sync." },
                    { icon: Inbox, title: "Zero-Friction Client Replies", desc: "Send personalized WhatsApp, Email, and SMS templates from the Inbox." },
                    { icon: Kanban, title: "Visual Deal Momentum", desc: "Drag opportunities across stages and log notes onto the client timeline." },
                  ]
              ).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="space-y-1.5">
                    <Icon className="h-4 w-4 text-[#635BFF]" />
                    <h3 className="text-[14px] font-semibold text-[#18181B]">{item.title}</h3>
                    <p className="text-[13px] text-[#52525B] leading-[20px]">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E4E4E7] bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#71717A]">
          <div className="flex items-center gap-2.5">
            <WyntroLogo size="sm" />
            <span>· Connect smarter. Convert faster.</span>
          </div>
          <span>Frontend Demo Mode — Simulated auth, messaging, and workflow execution.</span>
        </div>
      </footer>
    </div>
  );
}
