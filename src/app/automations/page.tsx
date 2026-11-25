"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Workflow as WorkflowIcon,
  Play,
  ArrowRight,
  Zap,
  GitBranch,
  Cog,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useCrmStore } from "@/store/useCrmStore";
import { uid } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { Workflow } from "@/types/crm";

const BLUEPRINTS: {
  id: string;
  name: string;
  category: string;
  description: string;
  nodes: Workflow["nodes"];
}[] = [
  {
    id: "bp-1",
    name: "Speed-to-Lead: Meta & Google Ads",
    category: "Lead Routing",
    description:
      "Instantly routes ad leads, creates a 15-minute call task, and logs a simulated WhatsApp welcome.",
    nodes: [
      { id: "b1-1", category: "trigger", kind: "new_lead_created", label: "New lead created", config: { source: "Facebook Ads" } },
      { id: "b1-2", category: "condition", kind: "lead_source", label: "Source is Facebook or Google Ads", config: { value: "Facebook Ads" } },
      { id: "b1-3", category: "action", kind: "assign_salesperson", label: "Round-robin assign rep", config: { value: "APAC Inbound" }, branch: "yes" },
      { id: "b1-4", category: "action", kind: "send_whatsapp", label: "Send WhatsApp Intro (Simulated)", config: { value: "Warm Inbound Introduction" }, branch: "yes" },
    ],
  },
  {
    id: "bp-2",
    name: "Proposal Sent 48h Follow-up",
    category: "Deal Velocity",
    description:
      "Waits 48 hours after a proposal is sent, then schedules a high-priority check-in call.",
    nodes: [
      { id: "b2-1", category: "trigger", kind: "stage_changed", label: "Stage changed to Proposal Sent", config: { value: "Proposal Sent" } },
      { id: "b2-2", category: "action", kind: "wait_duration", label: "Wait 48 hours", config: { value: "48 hours" } },
      { id: "b2-3", category: "action", kind: "create_followup", label: "Create follow-up task", config: { value: "Proposal check-in call" } },
    ],
  },
  {
    id: "bp-3",
    name: "VIP Hot Lead Fast-Track",
    category: "Qualification",
    description:
      "Flags hot-priority form submissions, tags them VIP, and assigns to Enterprise Core.",
    nodes: [
      { id: "b3-1", category: "trigger", kind: "form_submitted", label: "Enterprise form submitted", config: { value: "Enterprise Demo Request" } },
      { id: "b3-2", category: "condition", kind: "lead_priority", label: "Priority equals Hot", config: { value: "hot" } },
      { id: "b3-3", category: "action", kind: "add_tag", label: "Add tag: VIP Fast-Track", config: { value: "VIP Fast-Track" }, branch: "yes" },
      { id: "b3-4", category: "action", kind: "assign_salesperson", label: "Assign to Meenal Shrivastava", config: { value: "Meenal Shrivastava" }, branch: "yes" },
    ],
  },
  {
    id: "bp-4",
    name: "Inbound Reply Stage Escalation",
    category: "Engagement",
    description:
      "Moves prospects to Interested automatically when they reply on WhatsApp or Email.",
    nodes: [
      { id: "b4-1", category: "trigger", kind: "customer_replied", label: "Customer replied", config: { value: "Any channel" } },
      { id: "b4-2", category: "action", kind: "update_stage", label: "Move stage to Interested", config: { value: "Interested" } },
      { id: "b4-3", category: "action", kind: "create_followup", label: "Notify rep to respond", config: { value: "Reply within 10 mins" } },
    ],
  },
];

export default function AutomationsPage() {
  const router = useRouter();
  const { workflows, leads, toggleWorkflow, runWorkflowSimulation, saveWorkflow } =
    useCrmStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((wf) => {
      if (statusFilter === "active" && !wf.enabled) return false;
      if (statusFilter === "draft" && wf.enabled) return false;
      if (
        search.trim() &&
        !wf.name.toLowerCase().includes(search.toLowerCase()) &&
        !wf.description.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [workflows, statusFilter, search]);

  const allExecutions = useMemo(() => {
    return workflows
      .flatMap((w) =>
        w.executions.map((ex) => ({
          ...ex,
          workflowName: w.name,
        }))
      )
      .sort((a, b) => b.executedAt.localeCompare(a.executedAt));
  }, [workflows]);

  const totalRuns = workflows.reduce((acc, w) => acc + w.runsCount, 0);
  const activeCount = workflows.filter((w) => w.enabled).length;

  const handleCreateWorkflow = () => {
    const id = uid("wf");
    saveWorkflow({
      id,
      name: "Untitled Automation Workflow",
      description: "Configure a trigger and at least one action before activating.",
      enabled: false,
      runsCount: 0,
      lastRunAt: null,
      nodes: [
        {
          id: uid("n"),
          category: "trigger",
          kind: "new_lead_created",
          label: "New lead created",
          config: { source: "Any" },
        },
      ],
      executions: [],
    });
    toast({ title: "Draft workflow created" });
    router.push(`/automations/${id}`);
  };

  const handleUseBlueprint = (bp: (typeof BLUEPRINTS)[number]) => {
    const id = uid("wf");
    saveWorkflow({
      id,
      name: bp.name,
      description: bp.description,
      enabled: false,
      runsCount: 0,
      lastRunAt: null,
      nodes: bp.nodes.map((n) => ({ ...n, id: uid("n") })),
      executions: [],
    });
    toast({
      title: "Blueprint added",
      description: `Opened "${bp.name}" in the visual builder.`,
    });
    router.push(`/automations/${id}`);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Automation Studio
            </h1>
            <p className="text-[13px] text-[#667085]">
              Build visual trigger-condition-action workflows with deterministic local simulation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="primary">
              <Sparkles className="h-3 w-3" />
              Simulated Execution Engine
            </Badge>
            <Button size="sm" onClick={handleCreateWorkflow}>
              <Plus className="h-3.5 w-3.5" />
              New Workflow
            </Button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Active Workflows</p>
            <p className="mt-1.5 text-[28px] font-semibold text-[#101828] tabular-nums">
              {activeCount}
              <span className="text-[14px] font-normal text-[#98A2B3]">
                /{workflows.length}
              </span>
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Total Simulated Runs</p>
            <p className="mt-1.5 text-[28px] font-semibold text-[#635BFF] tabular-nums">
              {totalRuns}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Est. Time Saved</p>
            <p className="mt-1.5 text-[28px] font-semibold text-[#101828] tabular-nums">
              {Math.round(totalRuns * 0.18)}h
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-[12px] text-[#667085]">Simulation Success</p>
            <p className="mt-1.5 text-[28px] font-semibold text-[#12B76A] tabular-nums">
              99.2%
            </p>
          </Card>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workflows..."
              className="pl-9"
            />
          </div>
          <div className="inline-flex rounded-[8px] border border-[#E4E7EC] bg-white p-0.5">
            {(["all", "active", "draft"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`rounded-[6px] px-3 py-1 text-[12px] font-medium capitalize cursor-pointer ${
                  statusFilter === tab
                    ? "bg-[#EFEDFF] text-[#635BFF]"
                    : "text-[#667085] hover:text-[#101828]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Workflows with Mini Visual Flow */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredWorkflows.map((wf) => {
            const hasTrigger = wf.nodes.some((n) => n.category === "trigger");
            const hasAction = wf.nodes.some((n) => n.category === "action");
            const isValid = hasTrigger && hasAction;

            return (
              <Card key={wf.id} className="p-5 space-y-4 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-[#EFEDFF] text-[#635BFF]">
                        <WorkflowIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <Link
                          href={`/automations/${wf.id}`}
                          className="text-[15px] font-semibold text-[#101828] hover:text-[#635BFF]"
                        >
                          {wf.name}
                        </Link>
                        <p className="text-[12px] text-[#667085] mt-0.5">
                          {wf.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={wf.enabled}
                      onCheckedChange={() => {
                        if (!wf.enabled && !isValid) {
                          toast({
                            title: "Cannot activate incomplete workflow",
                            description: "Add at least one trigger and one action.",
                            variant: "error",
                          });
                          return;
                        }
                        toggleWorkflow(wf.id);
                      }}
                    />
                  </div>

                  {/* Mini Visual Node Flow */}
                  <div className="rounded-[10px] border border-[#E4E7EC] bg-[#F8F9FC] p-3 overflow-x-auto">
                    <div className="flex items-center gap-1.5 min-w-max">
                      {wf.nodes.map((node, idx) => {
                        const Icon =
                          node.category === "trigger"
                            ? Zap
                            : node.category === "condition"
                            ? GitBranch
                            : Cog;
                        const pillColor =
                          node.category === "trigger"
                            ? "border-[#635BFF]/30 bg-[#EFEDFF] text-[#5148E5]"
                            : node.category === "condition"
                            ? "border-[#F79009]/30 bg-[#FFFAEB] text-[#B54708]"
                            : "border-[#12B76A]/30 bg-[#ECFDF3] text-[#027A48]";
                        return (
                          <div key={node.id} className="flex items-center gap-1.5">
                            <span
                              className={`inline-flex items-center gap-1 rounded-[6px] border px-2 py-1 text-[11px] font-medium ${pillColor}`}
                            >
                              <Icon className="h-3 w-3 shrink-0" />
                              <span className="max-w-[130px] truncate">{node.label}</span>
                            </span>
                            {idx < wf.nodes.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-[#98A2B3] shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E4E7EC]">
                  <div className="flex items-center gap-2 text-[12px]">
                    <Badge variant={wf.enabled ? "success" : "default"}>
                      {wf.enabled ? "Active (Simulated)" : "Draft"}
                    </Badge>
                    <span className="text-[#667085] tabular-nums flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {wf.runsCount} runs
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (!isValid || !leads[0]) return;
                        const summary = runWorkflowSimulation(wf.id, leads[0].id);
                        toast({
                          title: "Workflow Simulated",
                          description: summary,
                          variant: "info",
                        });
                      }}
                      disabled={!isValid}
                    >
                      <Play className="h-3.5 w-3.5" />
                      Test Run
                    </Button>
                    <Button size="sm" variant="soft" asChild>
                      <Link href={`/automations/${wf.id}`}>
                        Open Builder
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Pre-Built Blueprints Gallery */}
        <div className="space-y-3 pt-2">
          <div>
            <h2 className="text-[18px] font-semibold text-[#101828]">
              Automation Blueprints
            </h2>
            <p className="text-[12px] text-[#667085]">
              Start faster with pre-configured CRM workflows — customize any node in the visual studio.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {BLUEPRINTS.map((bp) => (
              <Card
                key={bp.id}
                className="p-4 flex flex-col justify-between hover:border-[#635BFF]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{bp.category}</Badge>
                    <span className="text-[11px] text-[#98A2B3]">
                      {bp.nodes.length} nodes
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-[14px] font-semibold text-[#101828]">
                    {bp.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#667085] leading-relaxed">
                    {bp.description}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="mt-4 w-full"
                  onClick={() => handleUseBlueprint(bp)}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Use Blueprint
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* Simulated Execution History */}
        <div className="space-y-3 pt-2">
          <h2 className="text-[18px] font-semibold text-[#101828]">
            Recent Simulated Executions
          </h2>
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#E4E7EC] bg-[#F8F9FC] text-[12px] font-medium text-[#667085]">
                <tr>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Workflow</th>
                  <th className="px-4 py-2.5">Lead</th>
                  <th className="px-4 py-2.5">Summary</th>
                  <th className="px-4 py-2.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {allExecutions.slice(0, 6).map((ex) => (
                  <tr key={ex.id} className="hover:bg-[#F8F9FC]">
                    <td className="px-4 py-2.5">
                      <Badge variant="success">
                        <CheckCircle2 className="h-3 w-3" />
                        Simulated OK
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-[#101828]">
                      {ex.workflowName}
                    </td>
                    <td className="px-4 py-2.5 text-[#344054]">{ex.leadName}</td>
                    <td className="px-4 py-2.5 text-[#667085] max-w-md truncate">
                      {ex.summary}
                    </td>
                    <td className="px-4 py-2.5 text-[12px] text-[#98A2B3] tabular-nums">
                      {ex.executedAt.slice(0, 16).replace("T", " ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
