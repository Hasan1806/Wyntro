"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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
  Sparkles,
  Users,
  Workflow,
  Zap,
  Clock,
  Layers,
  Target,
  Activity,
} from "lucide-react";
import { WyntroLogo } from "@/components/brand/WyntroLogo";
import { Button } from "@/components/ui/button";

const PREVIEW_TABS = [
  { id: "pipeline", label: "Sales Pipeline", icon: Kanban },
  { id: "inbox", label: "Unified Inbox", icon: Inbox },
  { id: "analytics", label: "Revenue Analytics", icon: BarChart3 },
] as const;

export function HomepageShowcase() {
  const [activeTab, setActiveTab] =
    useState<(typeof PREVIEW_TABS)[number]["id"]>("pipeline");
  const [roleView, setRoleView] = useState<"admin" | "rep">("admin");

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-[#0F172A] flex flex-col selection:bg-[#635BFF]/15 selection:text-[#635BFF]">
      {/* Subtle architectural top ambient wash */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-[560px] bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(99,91,255,0.10),transparent)]"
      />

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E4E7EC]/80 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center">
            <WyntroLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-1 rounded-full border border-[#E4E7EC] bg-[#F8F9FC] p-1 text-[13px] font-medium text-[#475467]">
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
                className="rounded-full px-3.5 py-1.5 transition-colors hover:bg-white hover:text-[#101828] hover:shadow-xs"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-[#0F172A] hover:bg-[#1E293B] text-white shadow-sm"
            >
              <Link href="/dashboard">
                Open Workspace
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 relative">
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 lg:pt-24 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#635BFF]/20 bg-[#EFEDFF] px-3 py-1 text-[12px] font-medium text-[#5148E5]">
                <Sparkles className="h-3.5 w-3.5" />
                Wyntro CRM • Interactive Frontend Workspace
              </div>

              <h1 className="text-[42px] sm:text-[56px] font-semibold tracking-[-0.035em] leading-[1.06] text-[#0F172A]">
                Connect smarter.{" "}
                <span className="bg-gradient-to-r from-[#635BFF] via-[#4F46E5] to-[#0EA5E9] bg-clip-text text-transparent">
                  Convert faster.
                </span>
              </h1>

              <p className="text-[16px] sm:text-[17px] text-[#475467] leading-[1.65] max-w-xl">
                A next-generation lead management, sales pipeline, unified inbox,
                and workflow automation platform built for high-velocity revenue
                teams.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="h-11 px-6 text-[14px] shadow-md shadow-[#635BFF]/20"
                >
                  <Link href="/dashboard">
                    Launch Demo Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="h-11 px-6 text-[14px] border-[#D0D5DD]"
                >
                  <Link href="/onboarding">Try 7-Step Onboarding</Link>
                </Button>
                <Link
                  href="/leads"
                  className="px-2 py-2 text-[13px] font-medium text-[#475467] hover:text-[#635BFF] transition-colors"
                >
                  Browse Leads Table →
                </Link>
              </div>

              <div className="pt-5 border-t border-[#E4E7EC] flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-[#667085]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#12B76A]" />
                  No credentials required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#12B76A]" />
                  Persisted local demo state
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#635BFF]" />
                  Simulated messaging & automations
                </span>
              </div>
            </motion.div>

            {/* Interactive Product Preview */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08 }}
              className="lg:col-span-6"
            >
              <div className="rounded-[16px] border border-[#E4E7EC] bg-white p-2 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.14)]">
                <div className="flex items-center justify-between border-b border-[#E4E7EC] px-3 py-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F04438]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F79009]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#12B76A]/70" />
                  </div>
                  <div className="flex items-center gap-1 rounded-[8px] bg-[#F8F9FC] p-0.5 border border-[#E4E7EC]">
                    {PREVIEW_TABS.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[11px] font-medium transition-all cursor-pointer ${
                            active
                              ? "bg-white text-[#101828] shadow-xs"
                              : "text-[#667085] hover:text-[#101828]"
                          }`}
                        >
                          <Icon className="h-3 w-3 text-[#635BFF]" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 bg-[#F8F9FC]/70 rounded-b-[12px] min-h-[320px]">
                  {activeTab === "pipeline" && (
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        {
                          stage: "Qualified",
                          color: "#F79009",
                          val: "$78k",
                          cards: [
                            { name: "Sophia Lindqvist", co: "NordicCloud AB", amt: "$48,000" },
                            { name: "Ananya Deshmukh", co: "Meridian Prop.", amt: "$24,000" },
                          ],
                        },
                        {
                          stage: "Proposal Sent",
                          color: "#EC4899",
                          val: "$68.5k",
                          cards: [
                            { name: "Daniel K. Thorne", co: "Veridian Labs", amt: "$32,500" },
                            { name: "Rohan Kapoor", co: "Velox Logistics", amt: "$36,000" },
                          ],
                        },
                        {
                          stage: "Closed Won",
                          color: "#12B76A",
                          val: "$64k",
                          cards: [
                            { name: "Kenji Takahashi", co: "Apex FinTech", amt: "$64,000" },
                          ],
                        },
                      ].map((col) => (
                        <div
                          key={col.stage}
                          className="rounded-[10px] border border-[#E4E7EC] bg-white p-2.5 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#101828]">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: col.color }}
                              />
                              {col.stage}
                            </span>
                            <span className="text-[11px] font-medium text-[#667085] tabular-nums">
                              {col.val}
                            </span>
                          </div>
                          {col.cards.map((c) => (
                            <div
                              key={c.name}
                              className="rounded-[8px] border border-[#E4E7EC] bg-[#FAFAFC] p-2"
                            >
                              <p className="text-[11px] font-semibold text-[#101828] truncate">
                                {c.name}
                              </p>
                              <p className="text-[10px] text-[#667085] truncate">{c.co}</p>
                              <p className="mt-1 text-[11px] font-semibold text-[#635BFF] tabular-nums">
                                {c.amt}
                              </p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "inbox" && (
                    <div className="rounded-[10px] border border-[#E4E7EC] bg-white p-3.5 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E4E7EC] pb-2.5">
                        <div>
                          <p className="text-[13px] font-semibold text-[#101828]">
                            Sophia Lindqvist • NordicCloud AB
                          </p>
                          <p className="text-[11px] text-[#667085]">
                            WhatsApp Business • Simulated Thread
                          </p>
                        </div>
                        <span className="rounded-full bg-[#ECFDF3] px-2 py-0.5 text-[10px] font-medium text-[#027A48]">
                          Active Deal
                        </span>
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="ml-auto max-w-[80%] rounded-[10px] bg-[#635BFF] px-3 py-2 text-white">
                          Hi Sophia, sharing the updated security whitepaper and DPA for your review.
                        </div>
                        <div className="rounded-[10px] border border-[#F79009]/30 bg-[#FFFAEB] px-3 py-2 text-[#7A2E0E] text-[11px]">
                          Internal Note: CFO approved 12% volume discount for 45 seats.
                        </div>
                        <div className="max-w-[80%] rounded-[10px] border border-[#E4E7EC] bg-[#F8F9FC] px-3 py-2 text-[#101828]">
                          Our legal team approved the DPA. Can we review pricing at 2 PM?
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-3 gap-2.5">
                        {[
                          { label: "Pipeline Value", val: "$335,000", delta: "+18.5%" },
                          { label: "Conversion", val: "24.8%", delta: "+1.9%" },
                          { label: "Avg Response", val: "9m", delta: "-22%" },
                        ].map((k) => (
                          <div
                            key={k.label}
                            className="rounded-[10px] border border-[#E4E7EC] bg-white p-3"
                          >
                            <p className="text-[11px] text-[#667085]">{k.label}</p>
                            <p className="mt-1 text-[18px] font-semibold text-[#101828] tabular-nums">
                              {k.val}
                            </p>
                            <p className="text-[11px] font-medium text-[#12B76A]">{k.delta}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-[10px] border border-[#E4E7EC] bg-white p-3.5">
                        <p className="text-[11px] font-medium text-[#667085] mb-2.5">
                          Lead Source Velocity
                        </p>
                        <div className="space-y-2">
                          {[
                            { name: "LinkedIn", pct: "84%", color: "#635BFF" },
                            { name: "Website Form", pct: "72%", color: "#2E90FA" },
                            { name: "Facebook Ads", pct: "61%", color: "#12B76A" },
                          ].map((row) => (
                            <div key={row.name} className="space-y-1">
                              <div className="flex justify-between text-[11px]">
                                <span className="font-medium text-[#344054]">{row.name}</span>
                                <span className="text-[#667085] tabular-nums">{row.pct}</span>
                              </div>
                              <div className="h-1.5 rounded-full bg-[#F2F4F7] overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{ width: row.pct, backgroundColor: row.color }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. METRICS BENCHMARK STRIP */}
        <section className="border-y border-[#E4E7EC] bg-white">
          <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                metric: "< 5 sec",
                label: "Dashboard clarity",
                sub: "Immediate KPIs, overdue tasks, and hot leads on load",
              },
              {
                metric: "3.2x",
                label: "Faster first touch",
                sub: "Instant lead distribution & simulated WhatsApp templates",
              },
              {
                metric: "8 Stages",
                label: "Flexible pipelines",
                sub: "Drag-and-drop Kanban with custom stages & forecasts",
              },
              {
                metric: "100%",
                label: "Unified timeline",
                sub: "Calls, emails, notes, files, and stage changes in one feed",
              },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <p className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em] text-[#0F172A] tabular-nums">
                  {item.metric}
                </p>
                <p className="text-[13px] font-semibold text-[#635BFF]">
                  {item.label}
                </p>
                <p className="text-[12px] text-[#667085] leading-relaxed">
                  {item.sub}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. SPEED-TO-LEAD LIFECYCLE SECTION */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-5">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#635BFF]">
                End-to-End Velocity
              </p>
              <h2 className="text-[30px] sm:text-[34px] font-semibold tracking-[-0.025em] leading-[1.15] text-[#0F172A]">
                From first click to closed-won, without losing context.
              </h2>
              <p className="text-[15px] text-[#475467] leading-relaxed">
                Every lead captured through your custom forms or ad channels is
                instantly scored, routed to the right representative, and
                enrolled into structured follow-up sequences.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <Button asChild>
                  <Link href="/forms">Try Lead Form Builder →</Link>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/lead-distribution">View Routing Rules</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  step: "01",
                  title: "Capture & Enrich",
                  desc: "Embed multi-step Lead Forms or ingest from Meta & Google Ads into your Leads table.",
                  icon: ClipboardList,
                  accent: "text-[#635BFF] bg-[#EFEDFF]",
                },
                {
                  step: "02",
                  title: "Smart Distribution",
                  desc: "Apply WHEN/AND/THEN rules by source, city, or priority with round-robin balancing.",
                  icon: GitFork,
                  accent: "text-[#2E90FA] bg-[#EFF8FF]",
                },
                {
                  step: "03",
                  title: "Multi-Channel Engage",
                  desc: "Respond from the Unified Inbox via WhatsApp, Email, SMS, or internal team notes.",
                  icon: Inbox,
                  accent: "text-[#12B76A] bg-[#ECFDF3]",
                },
                {
                  step: "04",
                  title: "Track & Close",
                  desc: "Move deals across your Kanban pipeline while follow-ups and analytics update live.",
                  icon: Target,
                  accent: "text-[#F79009] bg-[#FFFAEB]",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.step}
                    className="rounded-[14px] border border-[#E4E7EC] bg-white p-5 space-y-3 shadow-[0_1px_3px_rgba(16,24,40,0.03)]"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${card.accent}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[12px] font-mono font-semibold text-[#98A2B3]">
                        {card.step}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#0F172A]">
                      {card.title}
                    </h3>
                    <p className="text-[13px] text-[#667085] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. BENTO PLATFORM ARCHITECTURE */}
        <section className="border-t border-[#E4E7EC] bg-white py-20 lg:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#635BFF]">
                  Complete CRM Workspace
                </p>
                <h2 className="mt-1 text-[30px] font-semibold tracking-[-0.025em] text-[#0F172A]">
                  Every revenue workflow, connected.
                </h2>
                <p className="mt-1 text-[14px] text-[#667085]">
                  Jump directly into any Wyntro module to test live interactions.
                </p>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <Link href="/dashboard">Go to Dashboard →</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Link href="/dashboard" className="md:col-span-3 group">
                <div className="h-full rounded-[14px] border border-[#E4E7EC] bg-gradient-to-br from-[#FFFFFF] to-[#F8F9FC] p-6 transition-all hover:border-[#635BFF]/50 hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EFEDFF] text-[#635BFF]">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#ECFDF3] px-2.5 py-0.5 text-[11px] font-medium text-[#027A48]">
                        Admin & Rep Views
                      </span>
                    </div>
                    <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A] group-hover:text-[#635BFF]">
                      Executive & Rep Dashboard
                    </h3>
                    <p className="mt-1.5 text-[13px] text-[#667085] leading-relaxed">
                      Real-time KPIs, acquisition trends, sales funnel, and role-based daily priorities.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E4E7EC]/80 text-[12px] font-medium text-[#635BFF]">
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link href="/leads" className="md:col-span-3 group">
                <div className="h-full rounded-[14px] border border-[#E4E7EC] bg-gradient-to-br from-[#FFFFFF] to-[#F8F9FC] p-6 transition-all hover:border-[#635BFF]/50 hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EFF8FF] text-[#2E90FA]">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#EFF8FF] px-2.5 py-0.5 text-[11px] font-medium text-[#175CD3]">
                        9 Saved Views
                      </span>
                    </div>
                    <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A] group-hover:text-[#635BFF]">
                      Leads & Client Profiles
                    </h3>
                    <p className="mt-1.5 text-[13px] text-[#667085] leading-relaxed">
                      Enterprise data table with 9 saved views, filter builder, CSV export, and 3-region profiles.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E4E7EC]/80 text-[12px] font-medium text-[#635BFF]">
                    <span>Open Leads Table</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              <Link href="/pipeline" className="md:col-span-2 group">
                <div className="h-full rounded-[14px] border border-[#E4E7EC] bg-white p-5 transition-all hover:border-[#635BFF]/50 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FFFAEB] text-[#F79009]">
                      <Kanban className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3.5 text-[15px] font-semibold text-[#0F172A] group-hover:text-[#635BFF]">
                      Drag-and-Drop Pipeline
                    </h3>
                    <p className="mt-1 text-[12px] text-[#667085] leading-relaxed">
                      Multi-pipeline Kanban board with custom stages, list view, and instant timeline sync.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#635BFF]">
                    Open module <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              <Link href="/inbox" className="md:col-span-2 group">
                <div className="h-full rounded-[14px] border border-[#E4E7EC] bg-white p-5 transition-all hover:border-[#635BFF]/50 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#ECFDF3] text-[#12B76A]">
                      <Inbox className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3.5 text-[15px] font-semibold text-[#0F172A] group-hover:text-[#635BFF]">
                      Unified Communication Inbox
                    </h3>
                    <p className="mt-1 text-[12px] text-[#667085] leading-relaxed">
                      Simulated WhatsApp, Email, SMS, and internal team notes with quick-reply templates.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#635BFF]">
                    Open module <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              <Link href="/forms" className="md:col-span-2 group">
                <div className="h-full rounded-[14px] border border-[#E4E7EC] bg-white p-5 transition-all hover:border-[#635BFF]/50 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FDF2FA] text-[#DD2590]">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3.5 text-[15px] font-semibold text-[#0F172A] group-hover:text-[#635BFF]">
                      Visual Lead Form Builder
                    </h3>
                    <p className="mt-1 text-[12px] text-[#667085] leading-relaxed">
                      3-panel form designer with desktop/mobile preview that feeds leads directly into Wyntro.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#635BFF]">
                    Open module <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              {/* High-Contrast Dark Obsidian Automation Band */}
              <div className="md:col-span-6 rounded-[16px] bg-[#0B0F19] text-white p-7 lg:p-9 mt-2 border border-[#1E293B]">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-7">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#A5B4FC]">
                      <Zap className="h-3.5 w-3.5" />
                      Automation & Engagement Engine
                    </span>
                    <h3 className="mt-1 text-[24px] font-semibold tracking-[-0.02em]">
                      Route, nurture, and broadcast automatically.
                    </h3>
                  </div>
                  <Button
                    size="sm"
                    asChild
                    className="bg-[#635BFF] hover:bg-[#5148E5] text-white w-fit"
                  >
                    <Link href="/automations">Explore Automations →</Link>
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: "Visual Workflow Automations",
                      description:
                        "Node-based triggers, conditions, and actions with deterministic local simulation.",
                      href: "/automations",
                      icon: Workflow,
                    },
                    {
                      title: "Lead Distribution & Routing",
                      description:
                        "Round-robin, source-based, and location-based assignment rules with live simulation.",
                      href: "/lead-distribution",
                      icon: GitFork,
                    },
                    {
                      title: "Campaigns & Templates",
                      description:
                        "6-step campaign builder, dynamic personalization, and WhatsApp template previews.",
                      href: "/campaigns",
                      icon: Megaphone,
                    },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group rounded-[12px] border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.08] hover:border-[#635BFF]/60 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#635BFF]/20 text-[#A5B4FC]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <h4 className="mt-3.5 text-[15px] font-semibold text-white">
                            {item.title}
                          </h4>
                          <p className="mt-1.5 text-[12px] text-[#94A3B8] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-medium text-[#A5B4FC]">
                          Open module{" "}
                          <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. ROLE-BASED EXPERIENCE SECTION */}
        <section className="mx-auto max-w-6xl px-6 py-20 lg:py-24">
          <div className="rounded-[18px] border border-[#E4E7EC] bg-white p-7 lg:p-10 shadow-[0_4px_20px_rgba(16,24,40,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-7 border-b border-[#E4E7EC]">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#635BFF]">
                  Built For Every Seat
                </p>
                <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.02em] text-[#0F172A]">
                  Tailored views for Leaders & Sales Reps
                </h2>
              </div>
              <div className="inline-flex rounded-[10px] border border-[#E4E7EC] bg-[#F8F9FC] p-1">
                <button
                  onClick={() => setRoleView("admin")}
                  className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-all ${
                    roleView === "admin"
                      ? "bg-white text-[#101828] shadow-xs"
                      : "text-[#667085] hover:text-[#101828]"
                  }`}
                >
                  Revenue Admin
                </button>
                <button
                  onClick={() => setRoleView("rep")}
                  className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-all ${
                    roleView === "rep"
                      ? "bg-white text-[#101828] shadow-xs"
                      : "text-[#667085] hover:text-[#101828]"
                  }`}
                >
                  Sales Representative
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-7">
              {(roleView === "admin"
                ? [
                    {
                      icon: Layers,
                      title: "Team-Wide Pipeline Governance",
                      desc: "Monitor conversion rates across every source, territory, and sales representative in real time.",
                    },
                    {
                      icon: GitFork,
                      title: "Automated Lead Distribution",
                      desc: "Ensure zero leads sit unassigned with round-robin, location, and priority-based routing.",
                    },
                    {
                      icon: Activity,
                      title: "Campaign & Content Attribution",
                      desc: "Track broadcast engagement, template approvals, and content views across accounts.",
                    },
                  ]
                : [
                    {
                      icon: Clock,
                      title: "Focused Daily Follow-ups",
                      desc: "Start every morning with overdue alerts, today’s calls, and calendar sync in one place.",
                    },
                    {
                      icon: Inbox,
                      title: "Zero-Friction Client Replies",
                      desc: "Send personalized WhatsApp, Email, and SMS templates directly from the Unified Inbox.",
                    },
                    {
                      icon: Kanban,
                      title: "Visual Deal Momentum",
                      desc: "Drag opportunities across stages and log notes or calls onto the client timeline in seconds.",
                    },
                  ]
              ).map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="space-y-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#EFEDFF] text-[#635BFF]">
                      <Icon className="h-4 w-4" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-[#0F172A]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] text-[#667085] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. BOTTOM CONVERSION CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="rounded-[18px] bg-gradient-to-r from-[#635BFF] via-[#5148E5] to-[#4338CA] px-8 py-12 lg:px-12 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-xl shadow-[#635BFF]/15">
            <div className="space-y-2 max-w-xl">
              <h2 className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.02em]">
                Ready to explore Wyntro?
              </h2>
              <p className="text-[15px] text-white/85 leading-relaxed">
                Jump straight into the pre-populated demo workspace or walk through
                the 7-step onboarding flow.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                size="lg"
                asChild
                className="bg-white text-[#101828] hover:bg-[#F8F9FC] h-11 px-6"
              >
                <Link href="/dashboard">
                  Launch Demo Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white/30 text-white hover:bg-white/10 h-11 px-5"
              >
                <Link href="/onboarding">Start Onboarding</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* 7. ENTERPRISE FOOTER */}
      <footer className="border-t border-[#E4E7EC] bg-white py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#E4E7EC]">
            <div className="col-span-2 md:col-span-1 space-y-3">
              <WyntroLogo size="sm" />
              <p className="text-[12px] text-[#667085] leading-relaxed">
                Connect smarter. Convert faster. Modern lead management and
                revenue workflow platform.
              </p>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <p className="font-semibold text-[#101828] text-[12px] uppercase tracking-wider">
                Workspace
              </p>
              <div className="flex flex-col gap-1.5 text-[#667085]">
                <Link href="/dashboard" className="hover:text-[#101828]">Overview</Link>
                <Link href="/leads" className="hover:text-[#101828]">Leads</Link>
                <Link href="/pipeline" className="hover:text-[#101828]">Sales Pipeline</Link>
                <Link href="/inbox" className="hover:text-[#101828]">Unified Inbox</Link>
              </div>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <p className="font-semibold text-[#101828] text-[12px] uppercase tracking-wider">
                Automation
              </p>
              <div className="flex flex-col gap-1.5 text-[#667085]">
                <Link href="/automations" className="hover:text-[#101828]">Workflows</Link>
                <Link href="/lead-distribution" className="hover:text-[#101828]">Lead Distribution</Link>
                <Link href="/sequences" className="hover:text-[#101828]">Sequences</Link>
                <Link href="/forms" className="hover:text-[#101828]">Lead Forms</Link>
              </div>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <p className="font-semibold text-[#101828] text-[12px] uppercase tracking-wider">
                Demo Access
              </p>
              <div className="flex flex-col gap-1.5 text-[#667085]">
                <Link href="/login" className="hover:text-[#101828]">Sign In (Demo)</Link>
                <Link href="/signup" className="hover:text-[#101828]">Sign Up (Demo)</Link>
                <Link href="/onboarding" className="hover:text-[#101828]">7-Step Onboarding</Link>
                <Link href="/help" className="hover:text-[#101828]">Help Center</Link>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#667085]">
            <span>Wyntro CRM — Frontend Interactive Demo</span>
            <span>
              Simulated authentication, messaging, and workflow execution.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
