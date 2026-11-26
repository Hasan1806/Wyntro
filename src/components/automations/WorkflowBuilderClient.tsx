"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Play,
  AlertTriangle,
  CheckCircle2,
  Zap,
  GitBranch,
  Cog,
  ArrowUp,
  ArrowDown,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrmStore } from "@/store/useCrmStore";
import { uid } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { WorkflowNode, WorkflowNodeCategory } from "@/types/crm";

const NODE_CATALOG: {
  category: WorkflowNodeCategory;
  kind: string;
  label: string;
}[] = [
  { category: "trigger", kind: "new_lead_created", label: "New lead created" },
  { category: "trigger", kind: "stage_changed", label: "Lead stage changed" },
  { category: "trigger", kind: "followup_due", label: "Follow-up due" },
  { category: "trigger", kind: "form_submitted", label: "Form submitted" },
  { category: "trigger", kind: "customer_replied", label: "Customer replied" },
  { category: "condition", kind: "lead_source", label: "Lead source condition" },
  { category: "condition", kind: "pipeline_stage", label: "Pipeline stage condition" },
  { category: "condition", kind: "lead_priority", label: "Lead priority condition" },
  { category: "action", kind: "assign_salesperson", label: "Assign salesperson" },
  { category: "action", kind: "update_stage", label: "Update stage" },
  { category: "action", kind: "add_tag", label: "Add tag" },
  { category: "action", kind: "create_followup", label: "Create follow-up" },
  { category: "action", kind: "send_whatsapp", label: "Send WhatsApp (Simulated)" },
  { category: "action", kind: "send_email", label: "Send Email (Simulated)" },
  { category: "action", kind: "wait_duration", label: "Wait for duration" },
];

export function WorkflowBuilderClient({ id }: { id: string }) {
  const { workflows, leads, saveWorkflow, runWorkflowSimulation } = useCrmStore();
  const existing = workflows.find((w) => w.id === id) ?? workflows[0];

  const [draft, setDraft] = useState(existing);
  const [selectedNodeId, setSelectedNodeId] = useState(existing.nodes[0]?.id ?? "");
  const [testLeadId, setTestLeadId] = useState(leads[0]?.id ?? "");
  const [traceSteps, setTraceSteps] = useState<string[]>([]);
  const [zoom, setZoom] = useState(100);

  const hasTrigger = draft.nodes.some((n) => n.category === "trigger");
  const hasAction = draft.nodes.some((n) => n.category === "action");
  const isValid = hasTrigger && hasAction;

  const selectedNode = draft.nodes.find((n) => n.id === selectedNodeId);

  const addNode = (item: (typeof NODE_CATALOG)[number]) => {
    const node: WorkflowNode = {
      id: uid("n"),
      category: item.category,
      kind: item.kind,
      label: item.label,
      config: { value: "Default" },
      branch: item.category === "action" ? "yes" : "all",
    };
    setDraft((d) => ({ ...d, nodes: [...d.nodes, node] }));
    setSelectedNodeId(node.id);
  };

  const moveNode = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= draft.nodes.length) return;
    const copy = [...draft.nodes];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    setDraft((d) => ({ ...d, nodes: copy }));
  };

  const removeNode = (nodeId: string) => {
    setDraft((d) => ({
      ...d,
      nodes: d.nodes.filter((n) => n.id !== nodeId),
    }));
  };

  const handleSave = () => {
    if (draft.enabled && !isValid) {
      toast({
        title: "Validation failed",
        description: "Workflow needs at least 1 trigger and 1 action to stay enabled.",
        variant: "error",
      });
      return;
    }
    saveWorkflow(draft);
    toast({ title: "Workflow saved" });
  };

  const handleTest = () => {
    saveWorkflow(draft);
    const lead = leads.find((l) => l.id === testLeadId) ?? leads[0];
    const msg = runWorkflowSimulation(draft.id, testLeadId);
    setTraceSteps(
      draft.nodes.map(
        (n, i) =>
          `Step ${i + 1} [${n.category.toUpperCase()}]: ${n.label} → OK for ${lead?.name ?? "Lead"}`
      )
    );
    toast({ title: "Simulated Execution", description: msg, variant: "info" });
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[#E4E4E7]">
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/automations"
              className="rounded-[6px] border border-[#E4E4E7] bg-white p-2 text-[#52525B] hover:text-[#18181B] shrink-0"
              aria-label="Back to Workflows"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div className="min-w-0 flex-1">
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="font-semibold text-[16px] h-8 border-transparent hover:border-[#E4E4E7] px-1.5"
              />
              <p className="text-[12px] text-[#71717A] px-1.5">
                Visual Workflow Studio · Deterministic Local Simulator
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 h-[30px]">
              <span className="text-[12px] font-medium text-[#52525B]">Enabled</span>
              <Switch
                checked={draft.enabled}
                onCheckedChange={(v) => {
                  if (v && !isValid) {
                    toast({
                      title: "Incomplete workflow",
                      description: "Add a Trigger and an Action before enabling.",
                      variant: "error",
                    });
                    return;
                  }
                  setDraft({ ...draft, enabled: v });
                }}
              />
            </div>
            <Button variant="secondary" size="sm" onClick={handleSave}>
              Save Draft
            </Button>
            <Button size="sm" disabled={!isValid} onClick={handleTest}>
              <Play className="h-3.5 w-3.5" />
              Test Workflow
            </Button>
          </div>
        </div>

        {!isValid && (
          <div className="flex items-center gap-2 rounded-[6px] border border-[#FDE68A] bg-[#FFFBEB] px-3.5 py-2 text-[12px] text-[#B45309]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Add at least one Trigger and one Action node before activating.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Palette */}
          <Card className="lg:col-span-3 p-4 space-y-4">
            {(["trigger", "condition", "action"] as const).map((cat) => (
              <div key={cat} className="space-y-1">
                <p className="text-[11px] font-medium text-[#71717A] capitalize pb-0.5">
                  {cat}s
                </p>
                {NODE_CATALOG.filter((n) => n.category === cat).map((item) => (
                  <button
                    key={item.kind}
                    onClick={() => addNode(item)}
                    className="flex w-full items-center justify-between rounded-[6px] border border-[#E4E4E7] px-2.5 py-1.5 text-left text-[12px] text-[#18181B] hover:bg-[#F7F7F8] hover:border-[#D4D4D8] cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <Plus className="h-3.5 w-3.5 text-[#71717A]" />
                  </button>
                ))}
              </div>
            ))}
          </Card>

          {/* Studio Canvas */}
          <div className="lg:col-span-6 rounded-[8px] border border-[#E4E4E7] bg-[#F7F7F8] bg-[radial-gradient(#D4D4D8_1px,transparent_1px)] [background-size:16px_16px] flex flex-col min-h-[560px]">
            {/* Canvas Controls */}
            <div className="flex items-center justify-between border-b border-[#E4E4E7] bg-white px-3 py-2 rounded-t-[8px]">
              <span className="text-[12px] font-medium text-[#71717A]">
                {draft.nodes.length} node{draft.nodes.length === 1 ? "" : "s"}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Zoom out"
                  onClick={() => setZoom((z) => Math.max(80, z - 10))}
                >
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-[11px] font-medium text-[#52525B] tabular-nums w-10 text-center">
                  {zoom}%
                </span>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Zoom in"
                  onClick={() => setZoom((z) => Math.min(120, z + 10))}
                >
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  aria-label="Fit to view"
                  onClick={() => setZoom(100)}
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <div className="flex-1 p-6 overflow-auto">
              <div
                className="max-w-[380px] mx-auto space-y-0 transition-transform origin-top"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                {draft.nodes.map((node, idx) => {
                  const Icon =
                    node.category === "trigger"
                      ? Zap
                      : node.category === "condition"
                      ? GitBranch
                      : Cog;
                  const accentColor =
                    node.category === "trigger"
                      ? "#635BFF"
                      : node.category === "condition"
                      ? "#D97706"
                      : "#16A34A";
                  const badgeVar =
                    node.category === "trigger"
                      ? "primary"
                      : node.category === "condition"
                      ? "warning"
                      : "success";

                  return (
                    <div key={node.id} className="flex flex-col items-center">
                      <div
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`w-full rounded-[8px] border bg-white p-3.5 cursor-pointer transition-colors border-l-[3px] ${
                          selectedNodeId === node.id
                            ? "border-[#635BFF] ring-2 ring-[#635BFF]/15"
                            : "border-[#E4E4E7] hover:border-[#D4D4D8]"
                        }`}
                        style={{ borderLeftColor: accentColor }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <Icon
                              className="h-4 w-4 shrink-0 mt-0.5"
                              style={{ color: accentColor }}
                            />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5">
                                <Badge variant={badgeVar} className="capitalize">
                                  {node.category}
                                </Badge>
                                {node.branch && node.branch !== "all" && (
                                  <Badge variant="outline">
                                    {node.branch.toUpperCase()}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[13px] font-medium text-[#18181B] mt-1">
                                {node.label}
                              </p>
                              {Object.values(node.config)[0] && (
                                <p className="mt-1 text-[11px] text-[#71717A] truncate">
                                  {Object.values(node.config)[0]}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveNode(idx, -1);
                              }}
                              className="p-1 text-[#A1A1AA] hover:text-[#18181B] cursor-pointer"
                              aria-label="Move node up"
                            >
                              <ArrowUp className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                moveNode(idx, 1);
                              }}
                              className="p-1 text-[#A1A1AA] hover:text-[#18181B] cursor-pointer"
                              aria-label="Move node down"
                            >
                              <ArrowDown className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNode(node.id);
                              }}
                              className="p-1 text-[#A1A1AA] hover:text-[#DC2626] cursor-pointer"
                              aria-label="Delete node"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                      {idx < draft.nodes.length - 1 && (
                        <div className="h-6 w-px bg-[#D4D4D8]" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Inspector & Trace */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4 space-y-3">
              <p className="text-[12px] font-semibold text-[#18181B]">
                Node Configuration
              </p>
              {selectedNode ? (
                <>
                  <div>
                    <label className="block text-[12px] font-medium text-[#52525B] mb-1">
                      Label
                    </label>
                    <Input
                      value={selectedNode.label}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          nodes: draft.nodes.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, label: e.target.value }
                              : n
                          ),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#52525B] mb-1">
                      Parameter
                    </label>
                    <Input
                      value={Object.values(selectedNode.config)[0] ?? ""}
                      onChange={(e) =>
                        setDraft({
                          ...draft,
                          nodes: draft.nodes.map((n) =>
                            n.id === selectedNode.id
                              ? { ...n, config: { value: e.target.value } }
                              : n
                          ),
                        })
                      }
                    />
                  </div>
                  {selectedNode.category === "action" && (
                    <div>
                      <label className="block text-[12px] font-medium text-[#52525B] mb-1">
                        Branch
                      </label>
                      <select
                        value={selectedNode.branch ?? "all"}
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            nodes: draft.nodes.map((n) =>
                              n.id === selectedNode.id
                                ? {
                                    ...n,
                                    branch: e.target.value as "all" | "yes" | "no",
                                  }
                                : n
                            ),
                          })
                        }
                        className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] px-2.5 text-[12px]"
                      >
                        <option value="all">Always run (All)</option>
                        <option value="yes">Condition matched (Yes)</option>
                        <option value="no">Condition failed (No)</option>
                      </select>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[12px] text-[#71717A]">Select a node to edit.</p>
              )}
            </Card>

            <Card className="p-4 space-y-3">
              <p className="text-[12px] font-semibold text-[#18181B]">
                Simulation & History
              </p>
              <select
                value={testLeadId}
                onChange={(e) => setTestLeadId(e.target.value)}
                className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] px-2.5 text-[12px]"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    Test Lead: {l.name}
                  </option>
                ))}
              </select>

              {traceSteps.length > 0 && (
                <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F0FDF4] p-2.5 space-y-1 text-[11px] text-[#15803D]">
                  <p className="font-semibold">Latest Simulation Trace</p>
                  {traceSteps.map((s) => (
                    <p key={s}>{s}</p>
                  ))}
                </div>
              )}

              <div className="space-y-2 max-h-56 overflow-y-auto">
                {existing.executions.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-2.5 text-[11px]"
                  >
                    <div className="flex items-center gap-1 font-medium text-[#16A34A]">
                      <CheckCircle2 className="h-3 w-3" />
                      {ex.leadName}
                    </div>
                    <p className="text-[#52525B] mt-0.5">{ex.summary}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
