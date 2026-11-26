"use client";

import { useState } from "react";
import { Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusIndicator } from "@/components/ui/primitives";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";
import type { SequenceStep } from "@/types/crm";

export default function SequencesPage() {
  const { sequences, saveSequence } = useCrmStore();
  const [selectedId, setSelectedId] = useState(sequences[0]?.id ?? "");
  const activeSeq = sequences.find((s) => s.id === selectedId) ?? sequences[0];

  const [newStepTitle, setNewStepTitle] = useState("");
  const [newStepDays, setNewStepDays] = useState(1);

  const moveStep = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= activeSeq.steps.length) return;
    const copy = [...activeSeq.steps];
    const [removed] = copy.splice(idx, 1);
    copy.splice(target, 0, removed);
    saveSequence({ ...activeSeq, steps: copy });
  };

  const addStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepTitle.trim()) return;
    const step: SequenceStep = {
      id: `st-${Date.now()}`,
      type: "send_message",
      title: newStepTitle.trim(),
      delayDays: newStepDays,
      delayHours: 0,
      description: "Simulated outreach step added in timeline editor.",
    };
    saveSequence({ ...activeSeq, steps: [...activeSeq.steps, step] });
    setNewStepTitle("");
    toast({ title: "Sequence step added" });
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          title="Follow-up Sequences"
          description="Multi-step sales engagement cadences with stop-on-reply"
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <Card className="lg:col-span-4 divide-y divide-[#E4E4E7]">
            {sequences.map((seq) => (
              <div
                key={seq.id}
                onClick={() => setSelectedId(seq.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  activeSeq.id === seq.id ? "bg-[#F4F4F5]" : "hover:bg-[#F7F7F8]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[14px] font-semibold text-[#18181B]">
                    {seq.name}
                  </p>
                  <StatusIndicator
                    color={seq.active ? "#16A34A" : "#71717A"}
                    label={seq.active ? "Active" : "Paused"}
                  />
                </div>
                <p className="text-[12px] text-[#71717A] mt-1">{seq.description}</p>
                <div className="mt-2.5 flex items-center gap-4 text-[11px] text-[#52525B] tabular-nums">
                  <span>{seq.enrolledCount} enrolled</span>
                  <span>{seq.completionRate}% completion</span>
                  <span>{seq.replyRate}% reply</span>
                </div>
              </div>
            ))}
          </Card>

          <Card className="lg:col-span-8 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E4E7] pb-3">
              <h2 className="text-[15px] font-semibold text-[#18181B]">
                {activeSeq.name}
              </h2>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-[#52525B]">Stop when customer replies</span>
                <Switch
                  checked={activeSeq.stopOnReply}
                  onCheckedChange={(v) =>
                    saveSequence({ ...activeSeq, stopOnReply: v })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              {activeSeq.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] px-3.5 py-2.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">
                        Day {step.delayDays}
                        {step.delayHours > 0 ? ` + ${step.delayHours}h` : ""}
                      </Badge>
                      <p className="text-[13px] font-medium text-[#18181B]">
                        {step.title}
                      </p>
                    </div>
                    <p className="text-[12px] text-[#71717A] mt-0.5">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Move step up"
                      onClick={() => moveStep(idx, -1)}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Move step down"
                      onClick={() => moveStep(idx, 1)}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete step"
                      onClick={() =>
                        saveSequence({
                          ...activeSeq,
                          steps: activeSeq.steps.filter((s) => s.id !== step.id),
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={addStep}
              className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-[#E4E4E7]"
            >
              <Input
                placeholder="New step title (e.g. WhatsApp reminder)"
                value={newStepTitle}
                onChange={(e) => setNewStepTitle(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                min={0}
                value={newStepDays}
                onChange={(e) => setNewStepDays(Number(e.target.value))}
                className="w-28"
                placeholder="Delay days"
              />
              <Button type="submit" size="sm">
                <Plus className="h-3.5 w-3.5" />
                Add Step
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
