"use client";

import Link from "next/link";
import { Plus, Workflow as WorkflowIcon, Play, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";

export default function AutomationsPage() {
  const { workflows, leads, toggleWorkflow, runWorkflowSimulation, saveWorkflow } =
    useCrmStore();

  const handleCreateWorkflow = () => {
    const id = `wf-${Date.now()}`;
    saveWorkflow({
      id,
      name: "Untitled Automation Workflow",
      description: "Configure a trigger and at least one action before activating.",
      enabled: false,
      runsCount: 0,
      lastRunAt: null,
      nodes: [
        {
          id: `n-${Date.now()}`,
          category: "trigger",
          kind: "new_lead_created",
          label: "New lead created",
          config: { source: "Any" },
        },
      ],
      executions: [],
    });
    toast({ title: "Draft workflow created" });
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Workflow Automations
            </h1>
            <p className="text-[13px] text-[#667085]">
              Visual node-based automation builder with deterministic local simulation
            </p>
          </div>
          <Button size="sm" onClick={handleCreateWorkflow}>
            <Plus className="h-3.5 w-3.5" />
            New Workflow
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflows.map((wf) => {
            const hasTrigger = wf.nodes.some((n) => n.category === "trigger");
            const hasAction = wf.nodes.some((n) => n.category === "action");
            const isValid = hasTrigger && hasAction;

            return (
              <Card key={wf.id} className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-[#EFEDFF] text-[#635BFF]">
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

                <div className="flex flex-wrap items-center gap-2 text-[12px]">
                  <Badge variant={wf.enabled ? "success" : "default"}>
                    {wf.enabled ? "Active (Simulated)" : "Draft"}
                  </Badge>
                  <Badge variant="outline">{wf.nodes.length} nodes</Badge>
                  <span className="text-[#667085] tabular-nums">
                    {wf.runsCount} simulated runs
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#E4E7EC]">
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
                  <Link
                    href={`/automations/${wf.id}`}
                    className="inline-flex items-center gap-1 text-[13px] font-medium text-[#635BFF] hover:underline"
                  >
                    Open Builder
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
