"use client";

import { useState } from "react";
import { Repeat, Plus, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
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
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
            Follow-up Sequences
          </h1>
          <p className="text-[13px] text-[#667085]">
            Multi-step sales engagement cadences with automatic stop-on-reply
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-4 space-y-2.5">
            {sequences.map((seq) => (
              <Card
                key={seq.id}
                onClick={() => setSelectedId(seq.id)}
                className={`p-4 cursor-pointer ${
                  activeSeq.id === seq.id
                    ? "border-[#635BFF] ring-1 ring-[#635BFF]/20"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-[#101828]">
                    {seq.name}
                  </p>
                  <Badge variant={seq.active ? "success" : "default"}>
                    {seq.active ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="text-[12px] text-[#667085] mt-1">{seq.description}</p>
                <div className="mt-3 flex items-center gap-4 text-[11px] text-[#667085] tabular-nums">
                  <span>{seq.enrolledCount} enrolled</span>
                  <span>{seq.completionRate}% completion</span>
                  <span>{seq.replyRate}% reply rate</span>
                </div>
              </Card>
            ))}
          </div>

          <Card className="lg:col-span-8 p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E4E7EC] pb-3">
              <div className="flex items-center gap-2">
                <Repeat className="h-4 w-4 text-[#635BFF]" />
                <h2 className="text-[16px] font-semibold text-[#101828]">
                  {activeSeq.name}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="text-[#667085]">Stop when customer replies</span>
                <Switch
                  checked={activeSeq.stopOnReply}
                  onCheckedChange={(v) =>
                    saveSequence({ ...activeSeq, stopOnReply: v })
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              {activeSeq.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="flex items-center justify-between rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-3.5"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="primary">
                        Day {step.delayDays}
                        {step.delayHours > 0 ? ` + ${step.delayHours}h` : ""}
                      </Badge>
                      <p className="text-[13px] font-semibold text-[#101828]">
                        {step.title}
                      </p>
                    </div>
                    <p className="text-[12px] text-[#667085] mt-1">
                      {step.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveStep(idx, -1)}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => moveStep(idx, 1)}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        saveSequence({
                          ...activeSeq,
                          steps: activeSeq.steps.filter((s) => s.id !== step.id),
                        })
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#F04438]" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={addStep}
              className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-[#E4E7EC]"
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
