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
import { Download, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import {
  Avatar,
  MetricCard,
  SectionHeader,
  StatusIndicator,
} from "@/components/ui/primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddLeadDrawer } from "@/components/leads/AddLeadDrawer";
import { useCrmStore } from "@/store/useCrmStore";
import { exportToCsv, formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

const ACQUISITION_DATA: Record<
  string,
  { day: string; leads: number; converted: number; pipeline: number }[]
> = {
  "7d": [
    { day: "Mon", leads: 14, converted: 4, pipeline: 420000 },
    { day: "Tue", leads: 19, converted: 5, pipeline: 580000 },
    { day: "Wed", leads: 16, converted: 6, pipeline: 640000 },
    { day: "Thu", leads: 24, converted: 7, pipeline: 810000 },
    { day: "Fri", leads: 28, converted: 9, pipeline: 960000 },
    { day: "Sat", leads: 12, converted: 3, pipeline: 380000 },
    { day: "Sun", leads: 15, converted: 4, pipeline: 490000 },
  ],
  "30d": [
    { day: "W1", leads: 64, converted: 16, pipeline: 1680000 },
    { day: "W2", leads: 78, converted: 21, pipeline: 2140000 },
    { day: "W3", leads: 92, converted: 27, pipeline: 2780000 },
    { day: "W4", leads: 108, converted: 34, pipeline: 3420000 },
  ],
  "90d": [
    { day: "Sep", leads: 240, converted: 62, pipeline: 6100000 },
    { day: "Oct", leads: 295, converted: 81, pipeline: 7800000 },
    { day: "Nov", leads: 342, converted: 98, pipeline: 9450000 },
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

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title={`Welcome, ${currentUser.name.split(" ")[0]}`}
          description={`${currentOrg.name} · ${
            viewRole === "admin"
              ? "Executive and team-wide revenue overview"
              : "Personal pipeline, follow-ups, and response priorities"
          }`}
          actions={
            <>
              <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
                {(["7d", "30d", "90d"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`rounded-[4px] px-2.5 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
                      dateRange === range
                        ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                        : "text-[#71717A] hover:text-[#18181B]"
                    }`}
                  >
                    {range === "7d" ? "7 days" : range === "30d" ? "30 days" : "90 days"}
                  </button>
                ))}
              </div>
              <Button variant="secondary" size="sm" onClick={handleExport}>
                <Download className="h-3.5 w-3.5" />
                Export
              </Button>
              <Button size="sm" onClick={() => setAddLeadOpen(true)}>
                <Plus className="h-3.5 w-3.5" />
                Create Lead
              </Button>
            </>
          }
        />

        {/* Compact KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            label="Total Leads"
            value={String(metrics.total)}
            delta="+14.2%"
            sublabel="vs prior period"
          />
          <MetricCard
            label="New Leads"
            value={String(metrics.newLeads)}
            delta="+8.4%"
            sublabel="awaiting touch"
          />
          <MetricCard
            label="Qualified"
            value={String(metrics.qualified)}
            delta="+11.8%"
            sublabel="SQL & beyond"
          />
          <MetricCard
            label="Conversion Rate"
            value={`${metrics.conversionRate}%`}
            delta="+1.9%"
            sublabel="closed-won"
          />
          <MetricCard
            label="Pipeline Value"
            value={formatCurrency(metrics.pipelineValue)}
            delta="+18.5%"
            sublabel="active deals"
          />
          <MetricCard
            label="Avg. Response"
            value={metrics.avgResponse}
            delta="-22%"
            sublabel="faster than SLA"
          />
        </div>

        {/* Analytics Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Lead Acquisition & Conversion</CardTitle>
                <p className="text-[12px] text-[#71717A]">
                  Inbound volume vs converted opportunities ({dateRange})
                </p>
              </div>
            </CardHeader>
            <CardContent className="h-[248px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACQUISITION_DATA[dateRange]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="leads"
                    name="Acquired Leads"
                    stroke="#635BFF"
                    strokeWidth={1.75}
                    fill="#EFEDFF"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="converted"
                    name="Converted"
                    stroke="#16A34A"
                    strokeWidth={1.75}
                    fill="transparent"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div>
                <CardTitle>Lead Sources</CardTitle>
                <p className="text-[12px] text-[#71717A]">Distribution by channel</p>
              </div>
            </CardHeader>
            <CardContent className="h-[248px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={96}
                    tick={{ fontSize: 12, fill: "#52525B" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Leads" fill="#635BFF" radius={[0, 4, 4, 0]} barSize={16} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <div>
                <CardTitle>Sales Funnel</CardTitle>
                <p className="text-[12px] text-[#71717A]">Opportunities by stage</p>
              </div>
              <Link href="/pipeline" className="text-[12px] font-medium text-[#635BFF] hover:underline">
                Open Pipeline →
              </Link>
            </CardHeader>
            <CardContent className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="count" name="Opportunities" radius={[4, 4, 0, 0]} barSize={24} isAnimationActive={false}>
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
                <p className="text-[12px] text-[#71717A]">Estimated opportunity volume ({dateRange})</p>
              </div>
            </CardHeader>
            <CardContent className="h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ACQUISITION_DATA[dateRange]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#71717A" }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(val) => formatCurrency(Number(val))}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="pipeline"
                    name="Pipeline Value"
                    stroke="#2563EB"
                    strokeWidth={1.75}
                    fill="#EFF6FF"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Actionable Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="border-b border-[#E4E4E7]">
              <SectionHeader
                title="Follow-ups Priority"
                action={
                  <Link href="/follow-ups" className="text-[12px] font-medium text-[#635BFF] hover:underline">
                    View all
                  </Link>
                }
              />
            </CardHeader>
            <div className="divide-y divide-[#E4E4E7]">
              {overdue.map((task) => (
                <Link
                  key={task.id}
                  href={`/leads/${task.leadId}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#F7F7F8]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-[13px] font-medium text-[#18181B]">{task.title}</p>
                    <p className="truncate text-[12px] text-[#71717A]">
                      {task.leadName} · {task.dueDate} {task.dueTime}
                    </p>
                  </div>
                  <StatusIndicator color="#DC2626" label="Overdue" />
                </Link>
              ))}
              {dueToday.map((task) => (
                <Link
                  key={task.id}
                  href={`/leads/${task.leadId}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#F7F7F8]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-[13px] font-medium text-[#18181B]">{task.title}</p>
                    <p className="truncate text-[12px] text-[#71717A]">
                      {task.leadName} · {task.company}
                    </p>
                  </div>
                  <span className="text-[12px] font-medium text-[#52525B] tabular-nums shrink-0">
                    {task.dueTime}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader className="border-b border-[#E4E4E7]">
              <SectionHeader
                title={viewRole === "admin" ? "New & Attention Needed" : "Priority Leads"}
                action={
                  <Link href="/leads" className="text-[12px] font-medium text-[#635BFF] hover:underline">
                    Leads table
                  </Link>
                }
              />
            </CardHeader>
            <div className="divide-y divide-[#E4E4E7]">
              {(incomingLeads.length > 0 ? incomingLeads : attentionLeads).map((lead) => (
                <Link
                  key={lead.id}
                  href={`/leads/${lead.id}`}
                  className="flex items-center justify-between px-5 py-3 hover:bg-[#F7F7F8]"
                >
                  <div className="min-w-0 pr-2">
                    <p className="truncate text-[13px] font-medium text-[#18181B]">{lead.name}</p>
                    <p className="truncate text-[12px] text-[#71717A]">
                      {lead.company} · {lead.source}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-semibold text-[#18181B] tabular-nums">
                      {formatCurrency(lead.estimatedValue)}
                    </p>
                    <p className="text-[11px] text-[#71717A] capitalize">
                      {!lead.assignedTo ? "Unassigned" : lead.priority}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </Card>

          <Card>
            <CardHeader className="border-b border-[#E4E4E7]">
              <SectionHeader
                title={viewRole === "admin" ? "Top Sales Representatives" : "Recent Activity"}
                action={
                  <Link
                    href={viewRole === "admin" ? "/team" : "/leads"}
                    className="text-[12px] font-medium text-[#635BFF] hover:underline"
                  >
                    {viewRole === "admin" ? "Team" : "Explore"}
                  </Link>
                }
              />
            </CardHeader>
            <div className="divide-y divide-[#E4E4E7]">
              {viewRole === "admin"
                ? [...team]
                    .sort((a, b) => b.revenueWon - a.revenueWon)
                    .slice(0, 4)
                    .map((rep) => (
                      <div
                        key={rep.id}
                        className="flex items-center justify-between px-5 py-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Avatar name={rep.name} color={rep.avatarColor} size="md" />
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium text-[#18181B]">
                              {rep.name}
                            </p>
                            <p className="text-[12px] text-[#71717A] tabular-nums">
                              {rep.dealsWon} deals · {rep.avgResponseMins}m resp
                            </p>
                          </div>
                        </div>
                        <p className="text-[13px] font-semibold text-[#18181B] tabular-nums shrink-0">
                          {formatCurrency(rep.revenueWon)}
                        </p>
                      </div>
                    ))
                : activities.slice(0, 4).map((act) => (
                    <Link
                      key={act.id}
                      href={`/leads/${act.leadId}`}
                      className="block px-5 py-3 hover:bg-[#F7F7F8]"
                    >
                      <p className="text-[13px] font-medium text-[#18181B]">{act.title}</p>
                      <p className="text-[12px] text-[#71717A] line-clamp-1 mt-0.5">
                        {act.description}
                      </p>
                    </Link>
                  ))}
            </div>
          </Card>
        </div>
      </div>

      <AddLeadDrawer open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </AppShell>
  );
}
