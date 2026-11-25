"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle2,
  Users,
  TrendingUp,
  Flame,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AddLeadDrawer } from "@/components/leads/AddLeadDrawer";
import { useCrmStore } from "@/store/useCrmStore";
import { exportToCsv, formatCurrency, getInitials } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

const ACQUISITION_DATA: Record<
  string,
  { day: string; leads: number; converted: number; pipeline: number }[]
> = {
  "7d": [
    { day: "Mon", leads: 14, converted: 4, pipeline: 42000 },
    { day: "Tue", leads: 19, converted: 5, pipeline: 58000 },
    { day: "Wed", leads: 16, converted: 6, pipeline: 64000 },
    { day: "Thu", leads: 24, converted: 7, pipeline: 81000 },
    { day: "Fri", leads: 28, converted: 9, pipeline: 96000 },
    { day: "Sat", leads: 12, converted: 3, pipeline: 38000 },
    { day: "Sun", leads: 15, converted: 4, pipeline: 49000 },
  ],
  "30d": [
    { day: "W1", leads: 64, converted: 16, pipeline: 168000 },
    { day: "W2", leads: 78, converted: 21, pipeline: 214000 },
    { day: "W3", leads: 92, converted: 27, pipeline: 278000 },
    { day: "W4", leads: 108, converted: 34, pipeline: 342000 },
  ],
  "90d": [
    { day: "Sep", leads: 240, converted: 62, pipeline: 610000 },
    { day: "Oct", leads: 295, converted: 81, pipeline: 780000 },
    { day: "Nov", leads: 342, converted: 98, pipeline: 945000 },
  ],
};

export default function DashboardPage() {
  const {
    leads,
    followUps,
    activities,
    team,
    organizations,
    currentOrgId,
    currentUserId,
    viewRole,
    pipelines,
  } = useCrmStore();

  const [dateRange, setDateRange] = useState<"7d" | "30d" | "90d">("30d");
  const [addLeadOpen, setAddLeadOpen] = useState(false);

  const currentOrg =
    organizations.find((o) => o.id === currentOrgId) ?? organizations[0];
  const currentUser = team.find((t) => t.id === currentUserId) ?? team[0];

  const scopedLeads = useMemo(() => {
    if (viewRole === "rep") {
      return leads.filter((l) => l.assignedTo === currentUserId);
    }
    return leads;
  }, [leads, viewRole, currentUserId]);

  const scopedFollowUps = useMemo(() => {
    if (viewRole === "rep") {
      return followUps.filter((f) => f.assignedTo === currentUserId);
    }
    return followUps;
  }, [followUps, viewRole, currentUserId]);

  const metrics = useMemo(() => {
    const total = scopedLeads.length;
    const newLeads = scopedLeads.filter((l) => l.stageId === "new-lead").length;
    const qualified = scopedLeads.filter((l) =>
      ["qualified", "proposal-sent", "negotiation", "closed-won"].includes(l.stageId)
    ).length;
    const won = scopedLeads.filter((l) => l.stageId === "closed-won").length;
    const conversionRate = total > 0 ? ((won / total) * 100).toFixed(1) : "0.0";
    const pipelineValue = scopedLeads
      .filter((l) => l.stageId !== "closed-lost")
      .reduce((sum, l) => sum + l.estimatedValue, 0);

    return {
      total,
      newLeads,
      qualified,
      conversionRate,
      pipelineValue,
      avgResponse: viewRole === "rep" ? `${currentUser.avgResponseMins}m` : "9m",
    };
  }, [scopedLeads, viewRole, currentUser.avgResponseMins]);

  const sourceData = useMemo(() => {
    const counts: Record<string, number> = {};
    scopedLeads.forEach((l) => {
      counts[l.source] = (counts[l.source] ?? 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [scopedLeads]);

  const funnelData = useMemo(() => {
    const stages = pipelines[0].stages.filter((s) => s.id !== "closed-lost");
    return stages.map((st) => ({
      name: st.name,
      count: scopedLeads.filter((l) => l.stageId === st.id).length,
      color: st.color,
    }));
  }, [pipelines, scopedLeads]);

  const dueToday = scopedFollowUps.filter(
    (f) => f.dueDate === "2026-11-25" && f.status !== "completed"
  );
  const overdue = scopedFollowUps.filter((f) => f.status === "overdue");
  const incomingLeads = scopedLeads.filter((l) => l.stageId === "new-lead").slice(0, 4);
  const attentionLeads = scopedLeads
    .filter((l) => l.priority === "hot" || !l.assignedTo)
    .slice(0, 4);

  const handleExport = () => {
    exportToCsv(
      `wyntro-dashboard-${dateRange}.csv`,
      scopedLeads.map((l) => ({
        Name: l.name,
        Company: l.company,
        Email: l.email,
        Source: l.source,
        Stage: l.stageId,
        Value: l.estimatedValue,
        Priority: l.priority,
      }))
    );
    toast({ title: "Report exported", description: "Downloaded CSV summary." });
  };

  const kpis = [
    {
      label: "Total Leads",
      value: String(metrics.total),
      delta: "+14.2%",
      positive: true,
      sub: "vs previous period",
    },
    {
      label: "New Leads",
      value: String(metrics.newLeads),
      delta: "+8.4%",
      positive: true,
      sub: "awaiting first touch",
    },
    {
      label: "Qualified Leads",
      value: String(metrics.qualified),
      delta: "+11.8%",
      positive: true,
      sub: "SQL & beyond",
    },
    {
      label: "Conversion Rate",
      value: `${metrics.conversionRate}%`,
      delta: "+1.9%",
      positive: true,
      sub: "closed-won ratio",
    },
    {
      label: "Pipeline Value",
      value: formatCurrency(metrics.pipelineValue),
      delta: "+18.5%",
      positive: true,
      sub: "active opportunities",
    },
    {
      label: "Avg. Response Time",
      value: metrics.avgResponse,
      delta: "-22%",
      positive: true,
      sub: "faster than target",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Welcome, {currentUser.name.split(" ")[0]}
            </h1>
            <p className="text-[13px] text-[#667085] mt-0.5">
              {currentOrg.name} •{" "}
              {viewRole === "admin"
                ? "Executive & team-wide revenue overview"
                : "Your personal pipeline, follow-ups, and response priorities"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-[8px] border border-[#E4E7EC] bg-white p-0.5">
              {(["7d", "30d", "90d"] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setDateRange(range)}
                  className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
                    dateRange === range
                      ? "bg-[#EFEDFF] text-[#635BFF]"
                      : "text-[#667085] hover:text-[#101828]"
                  }`}
                >
                  {range === "7d" ? "Last 7 days" : range === "30d" ? "Last 30 days" : "Last 90 days"}
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={handleExport}>
              <Download className="h-3.5 w-3.5" />
              Export Report
            </Button>
            <Button size="sm" onClick={() => setAddLeadOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Create Lead
            </Button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi) => (
            <Card key={kpi.label} className="p-4">
              <p className="text-[12px] font-medium text-[#667085]">{kpi.label}</p>
              <p className="mt-2 text-[28px] leading-none font-semibold tracking-[-0.02em] text-[#101828] tabular-nums">
                {kpi.value}
              </p>
              <div className="mt-3 flex items-center gap-1.5 text-[12px]">
                <span
                  className={`inline-flex items-center gap-0.5 font-medium ${
                    kpi.positive ? "text-[#12B76A]" : "text-[#F04438]"
                  }`}
                >
                  {kpi.positive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {kpi.delta}
                </span>
                <span className="text-[#98A2B3] truncate">{kpi.sub}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Lead Acquisition & Conversion Trend</CardTitle>
                <p className="text-[12px] text-[#667085]">
                  New inbound leads vs converted opportunities ({dateRange})
                </p>
              </div>
              <Badge variant="outline">Live Demo Series</Badge>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACQUISITION_DATA[dateRange]}>
                  <defs>
                    <linearGradient id="wyntroIndigo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#635BFF" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E7EC",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    name="Acquired Leads"
                    stroke="#635BFF"
                    strokeWidth={2}
                    fill="url(#wyntroIndigo)"
                  />
                  <Area
                    type="monotone"
                    dataKey="converted"
                    name="Converted"
                    stroke="#12B76A"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Lead Source Distribution</CardTitle>
                <p className="text-[12px] text-[#667085]">Active leads by channel</p>
              </div>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={96}
                    tick={{ fontSize: 12, fill: "#344054" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E7EC",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Leads" fill="#635BFF" radius={[0, 6, 6, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row 2: Sales Funnel + Pipeline Progression */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Sales Funnel</CardTitle>
                <p className="text-[12px] text-[#667085]">
                  Stage-by-stage distribution across active pipeline
                </p>
              </div>
              <Link href="/pipeline" className="text-[12px] font-medium text-[#635BFF] hover:underline">
                Open Pipeline →
              </Link>
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E7EC",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Opportunities" radius={[6, 6, 0, 0]} barSize={28}>
                    {funnelData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Pipeline Value Progression</CardTitle>
                <p className="text-[12px] text-[#667085]">
                  Estimated opportunity volume ({dateRange})
                </p>
              </div>
              <TrendingUp className="h-4 w-4 text-[#12B76A]" />
            </CardHeader>
            <CardContent className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACQUISITION_DATA[dateRange]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#667085" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#667085" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(val) => formatCurrency(Number(val))}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E7EC",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pipeline"
                    name="Pipeline Value"
                    stroke="#2E90FA"
                    strokeWidth={2}
                    fill="#EFF8FF"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Action-oriented workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Follow-ups Due Today & Overdue */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#635BFF]" />
                Follow-ups Priority
              </CardTitle>
              <Link href="/follow-ups" className="text-[12px] font-medium text-[#635BFF] hover:underline">
                View all
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {overdue.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#F04438] flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    Overdue ({overdue.length})
                  </p>
                  {overdue.map((task) => (
                    <Link
                      key={task.id}
                      href={`/leads/${task.leadId}`}
                      className="block rounded-[8px] border border-[#FDA29B] bg-[#FEF3F2]/50 p-2.5 hover:bg-[#FEF3F2]"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-[#101828]">{task.title}</p>
                        <Badge variant="error">Overdue</Badge>
                      </div>
                      <p className="text-[12px] text-[#667085] mt-0.5">
                        {task.leadName} • {task.dueDate} {task.dueTime}
                      </p>
                    </Link>
                  ))}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#667085]">
                  Due Today ({dueToday.length})
                </p>
                {dueToday.map((task) => (
                  <Link
                    key={task.id}
                    href={`/leads/${task.leadId}`}
                    className="block rounded-[8px] border border-[#E4E7EC] p-2.5 hover:bg-[#F8F9FC]"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-[13px] font-medium text-[#101828]">{task.title}</p>
                      <span className="text-[11px] font-medium text-[#635BFF] tabular-nums">
                        {task.dueTime}
                      </span>
                    </div>
                    <p className="text-[12px] text-[#667085] mt-0.5">
                      {task.leadName} • {task.company}
                    </p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* New Incoming & Immediate Attention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="h-4 w-4 text-[#F79009]" />
                {viewRole === "admin" ? "New & Attention Needed" : "My Priority Leads"}
              </CardTitle>
              <Link href="/leads" className="text-[12px] font-medium text-[#635BFF] hover:underline">
                Leads table
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {(incomingLeads.length > 0 ? incomingLeads : attentionLeads).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E7EC] p-2.5 hover:bg-[#F8F9FC]"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-[#101828]">
                        {lead.name}
                      </p>
                      {!lead.assignedTo && <Badge variant="warning">Unassigned</Badge>}
                    </div>
                    <p className="truncate text-[12px] text-[#667085]">
                      {lead.company} • {lead.source}
                    </p>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-[13px] font-semibold text-[#101828] tabular-nums">
                      {formatCurrency(lead.estimatedValue)}
                    </p>
                    <p className="text-[11px] text-[#98A2B3] capitalize">{lead.priority}</p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Top Reps (Admin) or Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {viewRole === "admin" ? (
                  <>
                    <Users className="h-4 w-4 text-[#12B76A]" />
                    Top Sales Representatives
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-[#12B76A]" />
                    Recent Customer Activity
                  </>
                )}
              </CardTitle>
              <Link
                href={viewRole === "admin" ? "/team" : "/leads"}
                className="text-[12px] font-medium text-[#635BFF] hover:underline"
              >
                {viewRole === "admin" ? "Team" : "Explore"}
              </Link>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {viewRole === "admin"
                ? [...team]
                    .sort((a, b) => b.revenueWon - a.revenueWon)
                    .slice(0, 4)
                    .map((rep) => (
                      <div
                        key={rep.id}
                        className="flex items-center justify-between rounded-[8px] border border-[#E4E7EC] p-2.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                            style={{ backgroundColor: rep.avatarColor }}
                          >
                            {getInitials(rep.name)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-[#101828]">
                              {rep.name}
                            </p>
                            <p className="text-[11px] text-[#667085]">
                              {rep.dealsWon} deals won • {rep.avgResponseMins}m avg resp
                            </p>
                          </div>
                        </div>
                        <p className="text-[13px] font-semibold text-[#101828] tabular-nums">
                          {formatCurrency(rep.revenueWon)}
                        </p>
                      </div>
                    ))
                : activities.slice(0, 4).map((act) => (
                    <Link
                      key={act.id}
                      href={`/leads/${act.leadId}`}
                      className="block rounded-[8px] border border-[#E4E7EC] p-2.5 hover:bg-[#F8F9FC]"
                    >
                      <p className="text-[13px] font-medium text-[#101828]">{act.title}</p>
                      <p className="text-[12px] text-[#667085] line-clamp-1 mt-0.5">
                        {act.description}
                      </p>
                    </Link>
                  ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <AddLeadDrawer open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </AppShell>
  );
}
