"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Play,
  ArrowRight,
  Zap,
  GitBranch,
  Cog,
  Clock,
  Search,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import {
  MetricCard,
  SectionHeader,
  StatusIndicator,
} from "@/components/ui/primitives";
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
      "Routes ad leads, creates a 15-minute call task, and logs a simulated WhatsApp welcome.",
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
      "Waits 48 hours after a proposal is sent, then schedules a check-in call.",
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
      { id: "b3-4", category: "action", kind: "assign_salesperson", label: "Assign to Hasan", config: { value: "Hasan" }, branch: "yes" },
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
        <PageHeader
          title="Workflows"
          description="Trigger-condition-action automation with deterministic local simulation"
          actions={
            <Button size="sm" onClick={handleCreateWorkflow}>
              <Plus className="h-3.5 w-3.5" />
              New Workflow
            </Button>
          }
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Active Workflows"
            value={`${activeCount}/${workflows.length}`}
            sublabel="configured automations"
          />
          <MetricCard
            label="Simulated Runs"
            value={String(totalRuns)}
            sublabel="deterministic local"
          />
          <MetricCard
            label="Est. Time Saved"
            value={`${Math.round(totalRuns * 0.18)}h`}
            sublabel="manual triage avoided"
          />
          <MetricCard
            label="Simulation Success"
            value="99.2%"
            sublabel="zero validation errors"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workflows..."
              className="pl-8.5 h-9"
            />
          </div>
          <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
            {(["all", "active", "draft"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`rounded-[4px] px-2.5 py-1 text-[12px] font-medium capitalize cursor-pointer ${
                  statusFilter === tab
                    ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                    : "text-[#71717A] hover:text-[#18181B]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredWorkflows.map((wf) => {
            const hasTrigger = wf.nodes.some((n) => n.category === "trigger");
            const hasAction = wf.nodes.some((n) => n.category === "action");
            const isValid = hasTrigger && hasAction;

            return (
              <Card key={wf.id} className="p-4 space-y-3.5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/automations/${wf.id}`}
                        className="text-[14px] font-semibold text-[#18181B] hover:text-[#635BFF]"
                      >
                        {wf.name}
                      </Link>
                      <p className="text-[12px] text-[#71717A] mt-0.5">
                        {wf.description}
                      </p>
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

                  {/* Compact Node Chain */}
                  <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-2.5 overflow-x-auto">
                    <div className="flex items-center gap-1.5 min-w-max">
                      {wf.nodes.map((node, idx) => {
                        const Icon =
                          node.category === "trigger"
                            ? Zap
                            : node.category === "condition"
                            ? GitBranch
                            : Cog;
                        const dotColor =
                          node.category === "trigger"
                            ? "text-[#635BFF]"
                            : node.category === "condition"
                            ? "text-[#D97706]"
                            : "text-[#16A34A]";
                        return (
                          <div key={node.id} className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 rounded-[5px] border border-[#E4E4E7] bg-white px-2 py-1 text-[11px] font-medium text-[#18181B]">
                              <Icon className={`h-3 w-3 shrink-0 ${dotColor}`} />
                              <span className="max-w-[130px] truncate">{node.label}</span>
                            </span>
                            {idx < wf.nodes.length - 1 && (
                              <ArrowRight className="h-3 w-3 text-[#A1A1AA] shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-[#E4E4E7]">
                  <div className="flex items-center gap-3 text-[12px]">
                    <StatusIndicator
                      color={wf.enabled ? "#16A34A" : "#71717A"}
                      label={wf.enabled ? "Active (Simulated)" : "Draft"}
                    />
                    <span className="text-[#71717A] tabular-nums flex items-center gap-1">
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
                      <Play className="h-3 w-3" />
                      Test
                    </Button>
                    <Button size="sm" variant="soft" asChild>
                      <Link href={`/automations/${wf.id}`}>
                        Edit
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="space-y-3 pt-2">
          <SectionHeader
            title="Automation Blueprints"
            description="Pre-configured CRM workflows you can customize in the builder"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {BLUEPRINTS.map((bp) => (
              <Card
                key={bp.id}
                className="p-4 flex flex-col justify-between hover:border-[#D4D4D8] transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{bp.category}</Badge>
                    <span className="text-[11px] text-[#A1A1AA] tabular-nums">
                      {bp.nodes.length} nodes
                    </span>
                  </div>
                  <h3 className="mt-2.5 text-[14px] font-semibold text-[#18181B]">
                    {bp.name}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#71717A] leading-[18px]">
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

        <div className="space-y-3 pt-2">
          <SectionHeader title="Recent Simulated Executions" />
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
                <tr>
                  <th className="px-4">Status</th>
                  <th className="px-4">Workflow</th>
                  <th className="px-4">Lead</th>
                  <th className="px-4">Summary</th>
                  <th className="px-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {allExecutions.slice(0, 6).map((ex) => (
                  <tr key={ex.id} className="h-11 hover:bg-[#F7F7F8]">
                    <td className="px-4">
                      <StatusIndicator color="#16A34A" label="Simulated OK" />
                    </td>
                    <td className="px-4 font-medium text-[#18181B]">
                      {ex.workflowName}
                    </td>
                    <td className="px-4 text-[#52525B]">{ex.leadName}</td>
                    <td className="px-4 text-[#71717A] max-w-md truncate">
                      {ex.summary}
                    </td>
                    <td className="px-4 text-right text-[12px] text-[#A1A1AA] tabular-nums whitespace-nowrap">
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
