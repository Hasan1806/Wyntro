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
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrmStore } from "@/store/useCrmStore";
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

  const hasTrigger = draft.nodes.some((n) => n.category === "trigger");
  const hasAction = draft.nodes.some((n) => n.category === "action");
  const isValid = hasTrigger && hasAction;

  const selectedNode = draft.nodes.find((n) => n.id === selectedNodeId);

  const addNode = (item: (typeof NODE_CATALOG)[number]) => {
    const node: WorkflowNode = {
      id: `n-${Date.now()}`,
      category: item.category,
      kind: item.kind,
      label: item.label,
      config: { value: "Default" },
      branch: item.category === "action" ? "yes" : "all",
    };
    setDraft((d) => ({ ...d, nodes: [...d.nodes, node] }));
    setSelectedNodeId(node.id);
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

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/automations"
              className="rounded-[8px] border border-[#E4E7EC] bg-white p-2 text-[#667085] hover:text-[#101828]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <Input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="font-semibold text-[16px] h-8 border-transparent hover:border-[#E4E7EC] px-1.5"
              />
              <p className="text-[12px] text-[#667085] px-1.5">
                Visual Node Builder • Deterministic Local Simulator
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-2 rounded-[8px] border border-[#E4E7EC] bg-white px-3 py-1.5">
              <span className="text-[12px] font-medium text-[#344054]">Enabled</span>
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
            <Button
              size="sm"
              disabled={!isValid}
              onClick={() => {
                saveWorkflow(draft);
                const msg = runWorkflowSimulation(draft.id, testLeadId);
                toast({ title: "Simulated Execution", description: msg, variant: "info" });
              }}
            >
              <Play className="h-3.5 w-3.5" />
              Test Workflow
            </Button>
          </div>
        </div>

        {!isValid && (
          <div className="flex items-center gap-2 rounded-[8px] border border-[#F79009]/40 bg-[#FFFAEB] px-4 py-2.5 text-[12px] text-[#B54708]">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Workflow validation: Add at least one Trigger and one Action node before activating.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <Card className="lg:col-span-3 p-4 space-y-4">
            {(["trigger", "condition", "action"] as const).map((cat) => (
              <div key={cat} className="space-y-1.5">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                  {cat}s
                </p>
                {NODE_CATALOG.filter((n) => n.category === cat).map((item) => (
                  <button
                    key={item.kind}
                    onClick={() => addNode(item)}
                    className="flex w-full items-center justify-between rounded-[8px] border border-[#E4E7EC] px-2.5 py-2 text-left text-[12px] hover:border-[#635BFF] hover:bg-[#EFEDFF]/40 cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <Plus className="h-3.5 w-3.5 text-[#635BFF]" />
                  </button>
                ))}
              </div>
            ))}
          </Card>

          <div className="lg:col-span-6 space-y-2">
            {draft.nodes.map((node, idx) => {
              const Icon =
                node.category === "trigger"
                  ? Zap
                  : node.category === "condition"
                  ? GitBranch
                  : Cog;
              const badgeVar =
                node.category === "trigger"
                  ? "primary"
                  : node.category === "condition"
                  ? "warning"
                  : "success";

              return (
                <div key={node.id} className="flex flex-col items-center">
                  <Card
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`w-full p-4 cursor-pointer transition-all ${
                      selectedNodeId === node.id
                        ? "border-[#635BFF] ring-2 ring-[#635BFF]/15"
                        : "hover:border-[#D0D5DD]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#E4E7EC]">
                          <Icon className="h-4 w-4 text-[#635BFF]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Badge variant={badgeVar} className="uppercase text-[10px]">
                              {node.category}
                            </Badge>
                            {node.branch && node.branch !== "all" && (
                              <Badge variant="outline" className="text-[10px]">
                                Branch: {node.branch.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                          <p className="text-[13px] font-semibold text-[#101828] mt-1">
                            {node.label}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNode(node.id);
                        }}
                        className="p-1 text-[#98A2B3] hover:text-[#F04438] cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </Card>
                  {idx < draft.nodes.length - 1 && (
                    <div className="h-5 w-0.5 bg-[#D0D5DD]" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-3 space-y-4">
            <Card className="p-4 space-y-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                Configure Node
              </p>
              {selectedNode ? (
                <>
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
                  <div>
                    <label className="block text-[11px] text-[#667085] mb-1">
                      Parameter / Value
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
                </>
              ) : (
                <p className="text-[12px] text-[#667085]">Select a node to edit.</p>
              )}
            </Card>

            <Card className="p-4 space-y-3">
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                Test & Execution History
              </p>
              <select
                value={testLeadId}
                onChange={(e) => setTestLeadId(e.target.value)}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    Test Lead: {l.name}
                  </option>
                ))}
              </select>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {existing.executions.map((ex) => (
                  <div
                    key={ex.id}
                    className="rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-2.5 text-[11px]"
                  >
                    <div className="flex items-center gap-1 font-medium text-[#12B76A]">
                      <CheckCircle2 className="h-3 w-3" />
                      {ex.leadName}
                    </div>
                    <p className="text-[#667085] mt-0.5">{ex.summary}</p>
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
