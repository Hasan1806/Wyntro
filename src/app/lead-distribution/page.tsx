"use client";

import { useState } from "react";
import { GitFork, Play, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";
import type { DistributionStrategy } from "@/types/crm";

export default function LeadDistributionPage() {
  const {
    distributionRules,
    leads,
    team,
    addDistributionRule,
    toggleDistributionRule,
    simulateDistribution,
  } = useCrmStore();

  const [ruleName, setRuleName] = useState("");
  const [strategy, setStrategy] = useState<DistributionStrategy>("source_based");
  const [condField, setCondField] = useState<"source" | "city" | "priority">("source");
  const [condValue, setCondValue] = useState("Facebook Ads");
  const [targetMemberId, setTargetMemberId] = useState(team[0]?.id ?? "");
  const [simLeadId, setSimLeadId] = useState(
    leads.find((l) => !l.assignedTo)?.id ?? leads[0]?.id ?? ""
  );
  const [simResult, setSimResult] = useState("");

  const unassignedLeads = leads.filter((l) => !l.assignedTo);

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ruleName.trim()) return;
    const member = team.find((m) => m.id === targetMemberId);
    addDistributionRule({
      name: ruleName.trim(),
      strategy,
      enabled: true,
      conditions: [{ field: condField, operator: "equals", value: condValue }],
      assignToTeam: member?.team ?? "Enterprise Core",
      assignToMemberIds: [targetMemberId],
    });
    setRuleName("");
    toast({ title: "Distribution rule created" });
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Lead Distribution
            </h1>
            <p className="text-[13px] text-[#667085]">
              Automated round-robin, source, location, and priority-based lead routing
            </p>
          </div>
          <Badge variant="warning">
            {unassignedLeads.length} Unassigned in Queue
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Rules List */}
          <div className="lg:col-span-7 space-y-3">
            {distributionRules.map((rule) => (
              <Card key={rule.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <GitFork className="h-4 w-4 text-[#635BFF]" />
                    <p className="text-[14px] font-semibold text-[#101828]">
                      {rule.name}
                    </p>
                    <Badge variant="outline" className="capitalize">
                      {rule.strategy.replace("_", " ")}
                    </Badge>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleDistributionRule(rule.id)}
                  />
                </div>
                <div className="rounded-[8px] bg-[#F8F9FC] border border-[#E4E7EC] p-3 text-[12px] space-y-1">
                  {rule.conditions.map((c, idx) => (
                    <p key={idx}>
                      <span className="font-semibold text-[#635BFF]">
                        {idx === 0 ? "WHEN" : "AND"}
                      </span>{" "}
                      {c.field} {c.operator} <strong>{c.value}</strong>
                    </p>
                  ))}
                  <p>
                    <span className="font-semibold text-[#12B76A]">THEN</span> Assign to{" "}
                    <strong>{rule.assignToTeam}</strong>
                  </p>
                </div>
                <p className="text-[11px] text-[#667085] tabular-nums">
                  {rule.assignedCount} leads routed by this rule
                </p>
              </Card>
            ))}
          </div>

          {/* Rule Builder + Simulator */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5 space-y-3.5">
              <h2 className="text-[15px] font-semibold text-[#101828]">
                Create Routing Rule
              </h2>
              <form onSubmit={handleAddRule} className="space-y-3">
                <Input
                  placeholder="Rule name (e.g. UK Website Inbound)"
                  value={ruleName}
                  onChange={(e) => setRuleName(e.target.value)}
                  required
                />
                <select
                  value={strategy}
                  onChange={(e) => setStrategy(e.target.value as DistributionStrategy)}
                  className="h-9 w-full rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
                >
                  <option value="round_robin">Round-robin</option>
                  <option value="source_based">Source-based</option>
                  <option value="location_based">Location-based</option>
                  <option value="team_based">Team-based</option>
                  <option value="priority_based">Priority-based</option>
                  <option value="manual">Manual</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={condField}
                    onChange={(e) =>
                      setCondField(e.target.value as "source" | "city" | "priority")
                    }
                    className="h-9 rounded-[8px] border border-[#E4E7EC] px-2 text-[12px]"
                  >
                    <option value="source">Lead source</option>
                    <option value="city">City</option>
                    <option value="priority">Priority</option>
                  </select>
                  <Input
                    value={condValue}
                    onChange={(e) => setCondValue(e.target.value)}
                    placeholder="Value"
                  />
                </div>
                <select
                  value={targetMemberId}
                  onChange={(e) => setTargetMemberId(e.target.value)}
                  className="h-9 w-full rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
                >
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      Assign to {m.name} ({m.available ? "Available" : "Unavailable"})
                    </option>
                  ))}
                </select>
                <Button type="submit" size="sm" className="w-full">
                  <Plus className="h-3.5 w-3.5" />
                  Add Distribution Rule
                </Button>
              </form>
            </Card>

            <Card className="p-5 space-y-3">
              <h2 className="text-[15px] font-semibold text-[#101828]">
                Simulate Distribution
              </h2>
              <select
                value={simLeadId}
                onChange={(e) => setSimLeadId(e.target.value)}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.source} • {l.city || "No city"})
                  </option>
                ))}
              </select>
              <Button
                variant="soft"
                size="sm"
                className="w-full"
                onClick={() => {
                  const res = simulateDistribution(simLeadId);
                  setSimResult(res);
                  toast({ title: "Lead distributed", description: res });
                }}
              >
                <Play className="h-3.5 w-3.5" />
                Run Distribution Simulator
              </Button>
              {simResult && (
                <p className="rounded-[8px] bg-[#ECFDF3] p-2.5 text-[12px] text-[#027A48]">
                  {simResult}
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
