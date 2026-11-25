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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Analytics & Reporting
            </h1>
            <p className="text-[13px] text-[#667085]">
              Cross-channel acquisition, funnel velocity, and team conversion metrics
            </p>
          </div>
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
            Export Report
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 rounded-[10px] border border-[#E4E7EC] bg-white p-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="h-9 rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-9 rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
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
            className="h-9 rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
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

        {/* Summary Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Total Acquired Leads</p>
            <p className="mt-1 text-[28px] font-semibold tabular-nums text-[#101828]">
              {scopedLeads.length}
            </p>
            <p className="text-[11px] text-[#12B76A] mt-1">+14.2% vs prior period</p>
          </Card>
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Qualification Rate</p>
            <p className="mt-1 text-[28px] font-semibold tabular-nums text-[#101828]">
              {qualRate}%
            </p>
            <p className="text-[11px] text-[#12B76A] mt-1">+3.1% vs prior period</p>
          </Card>
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Conversion Rate</p>
            <p className="mt-1 text-[28px] font-semibold tabular-nums text-[#101828]">
              {convRate}%
            </p>
            <p className="text-[11px] text-[#12B76A] mt-1">+1.8% vs prior period</p>
          </Card>
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Closed-Won Revenue</p>
            <p className="mt-1 text-[28px] font-semibold tabular-nums text-[#101828]">
              {formatCurrency(totalRevenue)}
            </p>
            <p className="text-[11px] text-[#667085] mt-1">Est. CPL: $24.50 (Demo)</p>
          </Card>
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
                <CardTitle>Leads & Pipeline by Source</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                    <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#635BFF" radius={[6, 6, 0, 0]} />
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
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sourceChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                    <XAxis dataKey="source" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Bar dataKey="value" fill="#2E90FA" radius={[6, 6, 0, 0]} />
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
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={funnelChart}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                    <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#12B76A" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team">
            <Card className="p-4 overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-[#E4E7EC] text-[12px] text-[#667085]">
                  <tr>
                    <th className="py-2.5">Representative</th>
                    <th className="py-2.5">Team</th>
                    <th className="py-2.5">Leads Assigned</th>
                    <th className="py-2.5">Deals Won</th>
                    <th className="py-2.5">Revenue Won</th>
                    <th className="py-2.5">Avg Response</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC]">
                  {team.map((m) => (
                    <tr key={m.id}>
                      <td className="py-3 font-medium text-[#101828]">{m.name}</td>
                      <td className="py-3 text-[#667085]">{m.team}</td>
                      <td className="py-3 tabular-nums">{m.leadsAssigned}</td>
                      <td className="py-3 tabular-nums">{m.dealsWon}</td>
                      <td className="py-3 font-semibold tabular-nums">
                        {formatCurrency(m.revenueWon)}
                      </td>
                      <td className="py-3 tabular-nums">{m.avgResponseMins}m</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </TabsContent>

          <TabsContent value="revenue">
            <Card>
              <CardHeader>
                <CardTitle>Closed & Pipeline Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={team}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(v) => `$${Math.round(v / 1000)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v) => formatCurrency(Number(v))} />
                    <Bar dataKey="revenueWon" fill="#635BFF" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="campaigns">
            <Card className="p-4 overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-[#E4E7EC] text-[12px] text-[#667085]">
                  <tr>
                    <th className="py-2.5">Campaign</th>
                    <th className="py-2.5">Channel</th>
                    <th className="py-2.5">Sent</th>
                    <th className="py-2.5">Delivery Rate</th>
                    <th className="py-2.5">Reply Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E7EC]">
                  {campaigns.map((c) => (
                    <tr key={c.id}>
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3 uppercase text-[11px]">{c.channel}</td>
                      <td className="py-3 tabular-nums">{c.sentCount}</td>
                      <td className="py-3 tabular-nums">{c.deliveryRate}%</td>
                      <td className="py-3 tabular-nums">{c.replyRate}%</td>
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
              <CardContent className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={responseSeries}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E4E7EC" vertical={false} />
                    <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="mins"
                      stroke="#635BFF"
                      strokeWidth={2.5}
                      dot={{ r: 4 }}
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
