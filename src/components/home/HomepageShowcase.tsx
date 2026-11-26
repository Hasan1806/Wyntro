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

const revealProps = {
  initial: { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { duration: 0.35, ease: "easeOut" as const },
};

export function HomepageShowcase() {
  const [activeTab, setActiveTab] =
    useState<(typeof PREVIEW_TABS)[number]["id"]>("pipeline");
  const [roleView, setRoleView] = useState<"admin" | "rep">("admin");

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#0F172A] flex flex-col selection:bg-[#635BFF]/15 selection:text-[#635BFF]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#E4E4E7] bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 sm:h-[72px] max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex items-center shrink-0">
            <WyntroLogo size="md" className="sm:hidden" />
            <WyntroLogo size="lg" className="hidden sm:inline-flex" />
          </Link>

          <nav className="hidden md:flex items-center gap-1.5 text-[14px] font-medium text-[#52525B]">
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
                className="rounded-[8px] px-3.5 py-2 transition-colors duration-150 hover:bg-[#F4F4F5] hover:text-[#18181B]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/login"
              className="rounded-[8px] border border-[#E4E4E7] bg-white px-3 py-2 sm:px-4 text-[13px] sm:text-[14px] font-medium text-[#18181B] transition-colors hover:bg-[#F4F4F5] hover:border-[#D4D4D8] whitespace-nowrap"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-1.5 sm:gap-2 rounded-[8px] bg-[#635BFF] px-3.5 py-2 sm:px-4.5 text-[13px] sm:text-[14px] font-medium text-white shadow-[0_2px_8px_rgba(99,91,255,0.28)] transition-all hover:bg-[#5148E5] hover:shadow-[0_4px_14px_rgba(99,91,255,0.34)] whitespace-nowrap"
            >
              <span>Open Workspace</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-[#635BFF]/20 bg-[#EFEDFF] px-3.5 py-1 text-[13px] font-medium text-[#5148E5]">
                <Sparkles className="h-3.5 w-3.5" />
                Wyntro CRM · Interactive Frontend Workspace
              </div>

              <h1 className="text-[42px] sm:text-[56px] lg:text-[60px] font-semibold tracking-[-0.035em] leading-[1.06] text-[#18181B]">
                Connect smarter.{" "}
                <span className="text-[#635BFF]">Convert faster.</span>
              </h1>

              <p className="text-[16px] sm:text-[18px] text-[#52525B] leading-[1.6] max-w-xl">
                A next-generation lead management, sales pipeline, unified inbox,
                and workflow automation platform built for high-velocity revenue
                teams.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  asChild
                  className="h-11 px-6 text-[14px] sm:text-[15px] font-medium shadow-[0_4px_14px_rgba(99,91,255,0.25)] transition-transform duration-150 hover:-translate-y-0.5"
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
                  className="h-11 px-6 text-[14px] sm:text-[15px] font-medium border-[#D4D4D8]"
                >
                  <Link href="/onboarding">Try 7-Step Onboarding</Link>
                </Button>
                <Link
                  href="/leads"
                  className="px-2 py-2 text-[14px] font-medium text-[#52525B] hover:text-[#635BFF] transition-colors"
                >
                  Browse Leads Table →
                </Link>
              </div>

              <div className="pt-5 border-t border-[#E4E4E7] flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#71717A]">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                  No credentials required
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#16A34A]" />
                  Persisted local demo state
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-[#635BFF]" />
                  Simulated messaging & automations
                </span>
              </div>
            </motion.div>

            {/* Interactive Product Preview */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
              className="lg:col-span-6"
            >
              <div className="rounded-[14px] border border-[#E4E4E7] bg-white p-2 shadow-[0_24px_60px_-15px_rgba(15,23,42,0.12)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4E4E7] px-3 py-2.5">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#DC2626]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D97706]/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A]/70" />
                  </div>
                  <div className="flex flex-wrap items-center gap-1 rounded-[8px] bg-[#F7F7F8] p-0.5 border border-[#E4E4E7] w-full sm:w-auto justify-center">
                    {PREVIEW_TABS.map((tab) => {
                      const Icon = tab.icon;
                      const active = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-all cursor-pointer ${
                            active
                              ? "bg-white text-[#18181B] shadow-xs"
                              : "text-[#71717A] hover:text-[#18181B]"
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5 text-[#635BFF]" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 bg-[#FAFAFA] rounded-b-[10px] min-h-[320px]"
                >
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
                          color: "#EC4899",
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
                          className="rounded-[10px] border border-[#E4E4E7] bg-white p-2.5 space-y-2"
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-[#E4E4E7]">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#18181B]">
                              <span
                                className="h-2 w-2 rounded-full"
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
                              className="rounded-[8px] border border-[#E4E4E7] bg-[#FAFAFA] p-2"
                            >
                              <p className="text-[11px] font-semibold text-[#18181B] truncate">
                                {c.name}
                              </p>
                              <p className="text-[10px] text-[#71717A] truncate">{c.co}</p>
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
                    <div className="rounded-[10px] border border-[#E4E4E7] bg-white p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2.5">
                        <div>
                          <p className="text-[13px] font-semibold text-[#18181B]">
                            Sophia Lindqvist · NordicCloud AB
                          </p>
                          <p className="text-[12px] text-[#71717A]">
                            WhatsApp Business · Simulated Thread
                          </p>
                        </div>
                        <span className="rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[11px] font-medium text-[#15803D]">
                          Active Deal
                        </span>
                      </div>
                      <div className="space-y-2 text-[12px]">
                        <div className="ml-auto max-w-[80%] rounded-[10px] bg-[#635BFF] px-3 py-2 text-white">
                          Hi Sophia, sharing the updated security whitepaper and DPA for your review.
                        </div>
                        <div className="rounded-[10px] border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-[#92400E] text-[11px]">
                          Internal Note: CFO approved 12% volume discount for 45 seats.
                        </div>
                        <div className="max-w-[80%] rounded-[10px] border border-[#E4E4E7] bg-[#F7F7F8] px-3 py-2 text-[#18181B]">
                          Our legal team approved the DPA. Can we review pricing at 2 PM?
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics" && (
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { label: "Pipeline Value", val: "₹33,50,000", delta: "+18.5%" },
                          { label: "Conversion", val: "24.8%", delta: "+1.9%" },
                          { label: "Avg Response", val: "9m", delta: "-22%" },
                        ].map((k) => (
                          <div
                            key={k.label}
                            className="rounded-[10px] border border-[#E4E4E7] bg-white p-3"
                          >
                            <p className="text-[11px] text-[#71717A]">{k.label}</p>
                            <p className="mt-1 text-[18px] font-semibold text-[#18181B] tabular-nums">
                              {k.val}
                            </p>
                            <p className="text-[11px] font-medium text-[#16A34A]">{k.delta}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-[10px] border border-[#E4E4E7] bg-white p-3.5">
                        <p className="text-[11px] font-medium text-[#71717A] mb-2.5">
                          Lead Source Velocity
                        </p>
                        <div className="space-y-2">
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
                    </div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 2. METRICS BENCHMARK STRIP */}
        <section className="border-y border-[#E4E4E7] bg-white">
          <motion.div
            {...revealProps}
            className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-12 grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
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
                <p className="text-[28px] sm:text-[34px] font-semibold tracking-[-0.02em] text-[#18181B] tabular-nums">
                  {item.metric}
                </p>
                <p className="text-[14px] font-semibold text-[#635BFF]">
                  {item.label}
                </p>
                <p className="text-[13px] text-[#71717A] leading-relaxed">
                  {item.sub}
                </p>
              </div>
            ))}
          </motion.div>
        </section>

        {/* 3. SPEED-TO-LEAD LIFECYCLE SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
          <motion.div
            {...revealProps}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            <div className="lg:col-span-5 space-y-5">
              <p className="text-[13px] font-semibold uppercase tracking-wider text-[#635BFF]">
                End-to-End Velocity
              </p>
              <h2 className="text-[32px] sm:text-[38px] font-semibold tracking-[-0.025em] leading-[1.12] text-[#18181B]">
                From first click to closed-won, without losing context.
              </h2>
              <p className="text-[16px] sm:text-[17px] text-[#52525B] leading-[1.6]">
                Every lead captured through your custom forms or ad channels is
                instantly scored, routed to the right representative, and
                enrolled into structured follow-up sequences.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Button size="lg" asChild>
                  <Link href="/forms">Try Lead Form Builder →</Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
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
                  accent: "text-[#2563EB] bg-[#EFF6FF]",
                },
                {
                  step: "03",
                  title: "Multi-Channel Engage",
                  desc: "Respond from the Unified Inbox via WhatsApp, Email, SMS, or internal team notes.",
                  icon: Inbox,
                  accent: "text-[#16A34A] bg-[#F0FDF4]",
                },
                {
                  step: "04",
                  title: "Track & Close",
                  desc: "Move deals across your Kanban pipeline while follow-ups and analytics update live.",
                  icon: Target,
                  accent: "text-[#D97706] bg-[#FFFBEB]",
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.step}
                    className="rounded-[12px] border border-[#E4E4E7] bg-white p-5 space-y-3 shadow-[0_1px_3px_rgba(16,24,40,0.03)] transition-all hover:border-[#D4D4D8] hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-[8px] ${card.accent}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-[12px] font-mono font-semibold text-[#A1A1AA]">
                        {card.step}
                      </span>
                    </div>
                    <h3 className="text-[16px] font-semibold text-[#18181B]">
                      {card.title}
                    </h3>
                    <p className="text-[14px] text-[#52525B] leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </section>

        {/* 4. BENTO PLATFORM ARCHITECTURE WITH RESTORED NAVY BLUE SECTION */}
        <section className="border-t border-[#E4E4E7] bg-white py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
            <motion.div
              {...revealProps}
              className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
            >
              <div>
                <p className="text-[13px] font-semibold uppercase tracking-wider text-[#635BFF]">
                  Complete CRM Workspace
                </p>
                <h2 className="mt-1.5 text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] leading-[1.12] text-[#18181B]">
                  Every revenue workflow, connected.
                </h2>
                <p className="mt-2 text-[16px] text-[#52525B]">
                  Jump directly into any Wyntro module to test live interactions.
                </p>
              </div>
              <Button variant="secondary" size="lg" asChild>
                <Link href="/dashboard">Go to Dashboard →</Link>
              </Button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Featured Wide 1 */}
              <Link href="/dashboard" className="md:col-span-3 group">
                <div className="h-full rounded-[14px] border border-[#E4E4E7] bg-[#FAFAFA] p-6 transition-all hover:border-[#635BFF]/50 hover:bg-white hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EFEDFF] text-[#635BFF]">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#F0FDF4] px-2.5 py-0.5 text-[12px] font-medium text-[#15803D]">
                        Admin & Rep Views
                      </span>
                    </div>
                    <h3 className="mt-4 text-[20px] font-semibold text-[#18181B] group-hover:text-[#635BFF]">
                      Executive & Rep Dashboard
                    </h3>
                    <p className="mt-1.5 text-[15px] text-[#52525B] leading-relaxed">
                      Real-time KPIs, acquisition trends, sales funnel, and role-based daily priorities.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E4E4E7] text-[13px] font-medium text-[#635BFF]">
                    <span>Open Dashboard</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* Featured Wide 2 */}
              <Link href="/leads" className="md:col-span-3 group">
                <div className="h-full rounded-[14px] border border-[#E4E4E7] bg-[#FAFAFA] p-6 transition-all hover:border-[#635BFF]/50 hover:bg-white hover:shadow-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#EFF6FF] text-[#2563EB]">
                        <Users className="h-5 w-5" />
                      </div>
                      <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[12px] font-medium text-[#1D4ED8]">
                        9 Saved Views
                      </span>
                    </div>
                    <h3 className="mt-4 text-[20px] font-semibold text-[#18181B] group-hover:text-[#635BFF]">
                      Leads & Client Profiles
                    </h3>
                    <p className="mt-1.5 text-[15px] text-[#52525B] leading-relaxed">
                      Enterprise data table with 9 saved views, filter builder, CSV export, and 3-region profiles.
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between pt-4 border-t border-[#E4E4E7] text-[13px] font-medium text-[#635BFF]">
                    <span>Open Leads Table</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>

              {/* 3 Medium Cards */}
              <Link href="/pipeline" className="md:col-span-2 group">
                <div className="h-full rounded-[14px] border border-[#E4E4E7] bg-white p-5 transition-all hover:border-[#635BFF]/50 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FFFBEB] text-[#D97706]">
                      <Kanban className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3.5 text-[16px] font-semibold text-[#18181B] group-hover:text-[#635BFF]">
                      Drag-and-Drop Pipeline
                    </h3>
                    <p className="mt-1.5 text-[14px] text-[#52525B] leading-relaxed">
                      Multi-pipeline Kanban board with custom stages, list view, and instant timeline sync.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#635BFF]">
                    Open module <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>

              <Link href="/inbox" className="md:col-span-2 group">
                <div className="h-full rounded-[14px] border border-[#E4E4E7] bg-white p-5 transition-all hover:border-[#635BFF]/50 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#F0FDF4] text-[#16A34A]">
                      <Inbox className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3.5 text-[16px] font-semibold text-[#18181B] group-hover:text-[#635BFF]">
                      Unified Communication Inbox
                    </h3>
                    <p className="mt-1.5 text-[14px] text-[#52525B] leading-relaxed">
                      Simulated WhatsApp, Email, SMS, and internal team notes with quick-reply templates.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#635BFF]">
                    Open module <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>

              <Link href="/forms" className="md:col-span-2 group">
                <div className="h-full rounded-[14px] border border-[#E4E4E7] bg-white p-5 transition-all hover:border-[#635BFF]/50 hover:shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex h-9 w-9 items-center justify-center rounded-[8px] bg-[#FDF2FA] text-[#DD2590]">
                      <ClipboardList className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3.5 text-[16px] font-semibold text-[#18181B] group-hover:text-[#635BFF]">
                      Visual Lead Form Builder
                    </h3>
                    <p className="mt-1.5 text-[14px] text-[#52525B] leading-relaxed">
                      3-panel form designer with desktop/mobile preview that feeds leads directly into Wyntro.
                    </p>
                  </div>
                  <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#635BFF]">
                    Open module <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>

              {/* RESTORED HIGH-CONTRAST DEEP NAVY BLUE AUTOMATION BAND */}
              <motion.div
                {...revealProps}
                className="md:col-span-6 rounded-[16px] bg-[#0B0F19] text-white p-7 lg:p-10 mt-2 border border-[#1E293B]"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
                  <div>
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wider text-[#A5B4FC]">
                      <Zap className="h-3.5 w-3.5" />
                      Automation & Engagement Engine
                    </span>
                    <h3 className="mt-1.5 text-[26px] sm:text-[32px] font-semibold tracking-[-0.02em] leading-[1.18]">
                      Route, nurture, and broadcast automatically.
                    </h3>
                  </div>
                  <Button
                    size="lg"
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
                          <h4 className="mt-3.5 text-[16px] font-semibold text-white">
                            {item.title}
                          </h4>
                          <p className="mt-1.5 text-[14px] text-[#94A3B8] leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                        <span className="mt-4 inline-flex items-center gap-1 text-[13px] font-medium text-[#A5B4FC]">
                          Open module{" "}
                          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* 5. ROLE-BASED EXPERIENCE SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-20 lg:py-24">
          <motion.div
            {...revealProps}
            className="rounded-[16px] border border-[#E4E4E7] bg-white p-7 lg:p-10 shadow-[0_4px_20px_rgba(16,24,40,0.04)]"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-7 border-b border-[#E4E4E7]">
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#635BFF]">
                  Built For Every Seat
                </p>
                <h2 className="mt-1 text-[26px] sm:text-[32px] font-semibold tracking-[-0.02em] text-[#18181B]">
                  Tailored views for Leaders & Sales Reps
                </h2>
              </div>
              <div className="inline-flex rounded-[10px] border border-[#E4E4E7] bg-[#F7F7F8] p-1">
                <button
                  onClick={() => setRoleView("admin")}
                  className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-all ${
                    roleView === "admin"
                      ? "bg-white text-[#18181B] shadow-xs"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  Revenue Admin
                </button>
                <button
                  onClick={() => setRoleView("rep")}
                  className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium cursor-pointer transition-all ${
                    roleView === "rep"
                      ? "bg-white text-[#18181B] shadow-xs"
                      : "text-[#71717A] hover:text-[#18181B]"
                  }`}
                >
                  Sales Representative
                </button>
              </div>
            </div>

            <motion.div
              key={roleView}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-7"
            >
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
                    <h3 className="text-[16px] font-semibold text-[#18181B]">
                      {item.title}
                    </h3>
                    <p className="text-[14px] text-[#52525B] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </motion.div>
          </motion.div>
        </section>

        {/* 6. BOTTOM CONVERSION CTA */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-20">
          <motion.div
            {...revealProps}
            className="rounded-[16px] bg-[#0B1736] px-8 py-12 lg:px-12 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-[#1E293B]"
          >
            <div className="space-y-2 max-w-xl">
              <h2 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.02em] leading-[1.15]">
                Ready to explore Wyntro?
              </h2>
              <p className="text-[16px] text-[#CBD5E1] leading-relaxed">
                Jump straight into the pre-populated demo workspace or walk through
                the 7-step onboarding flow.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Button
                size="lg"
                asChild
                className="bg-[#635BFF] hover:bg-[#5148E5] text-white h-11 px-6 text-[14px] sm:text-[15px]"
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
                className="border-white/25 text-white hover:bg-white/10 h-11 px-5 text-[14px] sm:text-[15px]"
              >
                <Link href="/onboarding">Start Onboarding</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* 7. ENTERPRISE FOOTER */}
      <footer className="border-t border-[#E4E4E7] bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-[#E4E4E7]">
            <div className="col-span-2 md:col-span-1 space-y-3">
              <WyntroLogo size="sm" />
              <p className="text-[13px] text-[#71717A] leading-relaxed">
                Connect smarter. Convert faster. Modern lead management and
                revenue workflow platform.
              </p>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <p className="font-semibold text-[#18181B] text-[12px] uppercase tracking-wider">
                Workspace
              </p>
              <div className="flex flex-col gap-1.5 text-[#52525B]">
                <Link href="/dashboard" className="hover:text-[#18181B]">Overview</Link>
                <Link href="/leads" className="hover:text-[#18181B]">Leads</Link>
                <Link href="/pipeline" className="hover:text-[#18181B]">Sales Pipeline</Link>
                <Link href="/inbox" className="hover:text-[#18181B]">Unified Inbox</Link>
              </div>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <p className="font-semibold text-[#18181B] text-[12px] uppercase tracking-wider">
                Automation
              </p>
              <div className="flex flex-col gap-1.5 text-[#52525B]">
                <Link href="/automations" className="hover:text-[#18181B]">Workflows</Link>
                <Link href="/lead-distribution" className="hover:text-[#18181B]">Lead Distribution</Link>
                <Link href="/sequences" className="hover:text-[#18181B]">Sequences</Link>
                <Link href="/forms" className="hover:text-[#18181B]">Lead Forms</Link>
              </div>
            </div>

            <div className="space-y-2.5 text-[13px]">
              <p className="font-semibold text-[#18181B] text-[12px] uppercase tracking-wider">
                Demo Access
              </p>
              <div className="flex flex-col gap-1.5 text-[#52525B]">
                <Link href="/login" className="hover:text-[#18181B]">Sign In (Demo)</Link>
                <Link href="/signup" className="hover:text-[#18181B]">Sign Up (Demo)</Link>
                <Link href="/onboarding" className="hover:text-[#18181B]">7-Step Onboarding</Link>
                <Link href="/help" className="hover:text-[#18181B]">Help Center</Link>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#71717A]">
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
