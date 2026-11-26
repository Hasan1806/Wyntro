"use client";

import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { MetricCard } from "@/components/ui/primitives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCrmStore } from "@/store/useCrmStore";
import { exportToCsv, formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export default function AnalyticsPage() {
  const { leads, team, campaigns, pipelines } = useCrmStore();
  const [dateRange, setDateRange] = useState("30d");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");

  const scopedLeads = useMemo(() => {
    return leads.filter((l) => {
      if (ownerFilter && l.assignedTo !== ownerFilter) return false;
      if (sourceFilter && l.source !== sourceFilter) return false;
      return true;
    });
  }, [leads, ownerFilter, sourceFilter]);

  const qualifiedCount = scopedLeads.filter((l) =>
    ["qualified", "proposal-sent", "negotiation", "closed-won"].includes(l.stageId)
  ).length;
  const wonCount = scopedLeads.filter((l) => l.stageId === "closed-won").length;
  const qualRate = scopedLeads.length
    ? ((qualifiedCount / scopedLeads.length) * 100).toFixed(1)
    : "0.0";
  const convRate = scopedLeads.length
    ? ((wonCount / scopedLeads.length) * 100).toFixed(1)
    : "0.0";
  const totalRevenue = scopedLeads
    .filter((l) => l.stageId === "closed-won")
    .reduce((sum, l) => sum + l.estimatedValue, 0);

  const sourceChart = useMemo(() => {
    const map: Record<string, { source: string; leads: number; value: number }> = {};
    scopedLeads.forEach((l) => {
      if (!map[l.source]) map[l.source] = { source: l.source, leads: 0, value: 0 };
      map[l.source].leads += 1;
      map[l.source].value += l.estimatedValue;
    });
    return Object.values(map);
  }, [scopedLeads]);

  const funnelChart = useMemo(() => {
    return pipelines[0].stages
      .filter((s) => s.id !== "closed-lost")
      .map((st) => ({
        stage: st.name,
        count: scopedLeads.filter((l) => l.stageId === st.id).length,
      }));
  }, [pipelines, scopedLeads]);

  const responseSeries = [
    { day: "Mon", mins: 11 },
    { day: "Tue", mins: 9 },
    { day: "Wed", mins: 8 },
    { day: "Thu", mins: 10 },
    { day: "Fri", mins: 7 },
  ];

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          title="Analytics"
          description="Cross-channel acquisition, funnel velocity, and team conversion metrics"
          actions={
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                exportToCsv(
                  `wyntro-analytics-${dateRange}.csv`,
                  scopedLeads.map((l) => ({
                    Name: l.name,
                    Source: l.source,
                    Stage: l.stageId,
                    Value: l.estimatedValue,
                  }))
                );
                toast({ title: "Analytics exported to CSV" });
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[12px] text-[#18181B]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-9 rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[12px] text-[#18181B]"
          >
            <option value="">All Employees</option>
            {team.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="h-9 rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[12px] text-[#18181B]"
          >
            <option value="">All Lead Sources</option>
            {[
              "Facebook Ads",
              "Google Ads",
              "Website Form",
              "WhatsApp",
              "LinkedIn",
              "Referral",
            ].map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Acquired Leads"
            value={String(scopedLeads.length)}
            delta="+14.2%"
            sublabel="vs prior period"
          />
          <MetricCard
            label="Qualification Rate"
            value={`${qualRate}%`}
            delta="+3.1%"
            sublabel="vs prior period"
          />
          <MetricCard
            label="Conversion Rate"
            value={`${convRate}%`}
            delta="+1.8%"
            sublabel="vs prior period"
          />
          <MetricCard
            label="Closed-Won Revenue"
            value={formatCurrency(totalRevenue)}
            sublabel="Est. CPL: ₹1,950 (Demo)"
          />
        </div>

        <Tabs defaultValue="overview">
          <TabsList className="w-full overflow-x-auto justify-start">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sources">Lead Sources</TabsTrigger>
            <TabsTrigger value="funnel">Sales Funnel</TabsTrigger>
            <TabsTrigger value="team">Team Performance</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="response">Response Time</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Leads by Source</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                    <XAxis dataKey="source" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E4E4E7", fontSize: "12px" }} />
                    <Bar dataKey="leads" fill="#635BFF" radius={[4, 4, 0, 0]} barSize={28} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sources">
            <Card>
              <CardHeader>
                <CardTitle>Pipeline Value by Lead Source</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                    <XAxis dataKey="source" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: "8px", border: "1px solid #E4E4E7", fontSize: "12px" }} />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={28} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="funnel">
            <Card>
              <CardHeader>
                <CardTitle>Stage Conversion Funnel</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fontSize: 11, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E4E4E7", fontSize: "12px" }} />
                    <Bar dataKey="count" fill="#16A34A" radius={[4, 4, 0, 0]} barSize={28} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
                  <tr>
                    <th className="px-4">Representative</th>
                    <th className="px-4">Team</th>
                    <th className="px-4 text-right">Leads</th>
                    <th className="px-4 text-right">Deals Won</th>
                    <th className="px-4 text-right">Revenue Won</th>
                    <th className="px-4 text-right">Avg Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {team.map((m) => (
                    <tr key={m.id} className="h-11 hover:bg-[#F7F7F8]">
                      <td className="px-4 font-medium text-[#18181B]">{m.name}</td>
                      <td className="px-4 text-[#52525B]">{m.team}</td>
                      <td className="px-4 text-right tabular-nums">{m.leadsAssigned}</td>
                      <td className="px-4 text-right tabular-nums">{m.dealsWon}</td>
                      <td className="px-4 text-right font-semibold tabular-nums">
                        {formatCurrency(m.revenueWon)}
                      </td>
                      <td className="px-4 text-right tabular-nums">{m.avgResponseMins}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Closed Revenue by Representative</CardTitle>
              </CardHeader>
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={team}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <YAxis tickFormatter={(v) => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} contentStyle={{ borderRadius: "8px", border: "1px solid #E4E4E7", fontSize: "12px" }} />
                    <Bar dataKey="revenueWon" fill="#635BFF" radius={[4, 4, 0, 0]} barSize={28} isAnimationActive={false} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
                  <tr>
                    <th className="px-4">Campaign</th>
                    <th className="px-4">Channel</th>
                    <th className="px-4 text-right">Sent</th>
                    <th className="px-4 text-right">Delivery Rate</th>
                    <th className="px-4 text-right">Reply Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {campaigns.map((c) => (
                    <tr key={c.id} className="h-11 hover:bg-[#F7F7F8]">
                      <td className="px-4 font-medium text-[#18181B]">{c.name}</td>
                      <td className="px-4 uppercase text-[11px] text-[#52525B]">{c.channel}</td>
                      <td className="px-4 text-right tabular-nums">{c.sentCount}</td>
                      <td className="px-4 text-right tabular-nums">{c.deliveryRate}%</td>
                      <td className="px-4 text-right tabular-nums">{c.replyRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="response">
            <Card>
              <CardHeader>
                <CardTitle>Average First Response Time (Minutes)</CardTitle>
              </CardHeader>
              <CardContent className="h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#71717A" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #E4E4E7", fontSize: "12px" }} />
                    <Line
                      type="monotone"
                      dataKey="mins"
                      stroke="#635BFF"
                      strokeWidth={2}
                      dot={{ r: 3.5 }}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
