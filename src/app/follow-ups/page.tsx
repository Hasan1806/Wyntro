"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Plus,
  Trash2,
  CalendarClock,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState, StatusIndicator } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";
import type { TaskPriority, TaskRecurrence } from "@/types/crm";

type FollowUpView = "today" | "upcoming" | "overdue" | "completed" | "all";

export default function FollowUpsPage() {
  const {
    followUps,
    leads,
    team,
    addFollowUp,
    toggleFollowUpComplete,
    rescheduleFollowUp,
    deleteFollowUp,
  } = useCrmStore();

  const [view, setView] = useState<FollowUpView>("today");
  const [createOpen, setCreateOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("2026-11-26");
  const [newTime, setNewTime] = useState("11:00");

  const [leadId, setLeadId] = useState(leads[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("2026-11-25");
  const [dueTime, setDueTime] = useState("15:00");
  const [assignedTo, setAssignedTo] = useState(team[0]?.id ?? "");
  const [priority, setPriority] = useState<TaskPriority>("high");
  const [recurrence, setRecurrence] = useState<TaskRecurrence>("none");

  const filtered = useMemo(() => {
    return followUps.filter((f) => {
      if (view === "today") return f.dueDate === "2026-11-25" && f.status !== "completed";
      if (view === "upcoming") return f.dueDate > "2026-11-25" && f.status !== "completed";
      if (view === "overdue") return f.status === "overdue";
      if (view === "completed") return f.status === "completed";
      return true;
    });
  }, [followUps, view]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || !title.trim()) return;
    addFollowUp({
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      dueTime,
      priority,
      assignedTo,
      status: dueDate < "2026-11-25" ? "overdue" : "pending",
      recurrence,
      channel: "call",
    });
    setTitle("");
    setDescription("");
    setCreateOpen(false);
    toast({ title: "Follow-up created" });
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Follow-ups"
          description="Manage scheduled calls, proposals, and client commitments"
          actions={
            <Button size="sm" onClick={() => setCreateOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Create Follow-up
            </Button>
          }
        />

        <div className="flex flex-wrap items-center gap-1 border-b border-[#E4E4E7] pb-2">
          {(
            [
              { id: "today", label: "Today" },
              { id: "upcoming", label: "Upcoming" },
              { id: "overdue", label: "Overdue" },
              { id: "completed", label: "Completed" },
              { id: "all", label: "All tasks" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
                view === tab.id
                  ? "bg-[#18181B] text-white"
                  : "text-[#52525B] hover:bg-[#F4F4F5] hover:text-[#18181B]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No follow-ups in this view"
            description="Create a new follow-up task or switch to another filter."
            action={
              <Button size="sm" variant="secondary" onClick={() => setCreateOpen(true)}>
                Schedule Follow-up
              </Button>
            }
          />
        ) : (
          <div className="rounded-[8px] border border-[#E4E4E7] bg-white divide-y divide-[#E4E4E7]">
            {filtered.map((task) => {
              const rep = team.find((m) => m.id === task.assignedTo);
              const isOverdue = task.status === "overdue";
              const isDone = task.status === "completed";
              return (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 hover:bg-[#F7F7F8] transition-colors"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => {
                        toggleFollowUpComplete(task.id);
                        toast({
                          title: isDone ? "Task reopened" : "Follow-up completed",
                          description: isDone
                            ? undefined
                            : "Updated client activity timeline.",
                        });
                      }}
                      aria-label={isDone ? "Reopen task" : "Complete task"}
                      className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full border cursor-pointer transition-colors ${
                        isDone
                          ? "border-[#16A34A] bg-[#16A34A] text-white"
                          : isOverdue
                          ? "border-[#DC2626] text-[#DC2626]"
                          : "border-[#D4D4D8] hover:border-[#635BFF]"
                      }`}
                    >
                      {isDone && <CheckCircle2 className="h-3 w-3" />}
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p
                          className={`text-[13px] font-medium ${
                            isDone ? "line-through text-[#A1A1AA]" : "text-[#18181B]"
                          }`}
                        >
                          {task.title}
                        </p>
                        {isOverdue && <StatusIndicator color="#DC2626" label="Overdue" />}
                        {!isOverdue && !isDone && (
                          <StatusIndicator color="#2563EB" label="Scheduled" />
                        )}
                        {isDone && <StatusIndicator color="#16A34A" label="Completed" />}
                        {task.recurrence !== "none" && (
                          <Badge variant="outline" className="capitalize">
                            {task.recurrence}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2.5 text-[12px] text-[#71717A]">
                        <Link
                          href={`/leads/${task.leadId}`}
                          className="font-medium text-[#52525B] hover:text-[#635BFF]"
                        >
                          {task.leadName} ({task.company})
                        </Link>
                        <span>·</span>
                        <span className="tabular-nums">
                          {task.dueDate} at {task.dueTime}
                        </span>
                        <span>·</span>
                        <span>{rep?.name ?? "Unassigned"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRescheduleId(task.id);
                        setNewDate(task.dueDate);
                        setNewTime(task.dueTime);
                      }}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      Reschedule
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        deleteFollowUp(task.id);
                        toast({ title: "Follow-up deleted" });
                      }}
                      title="Delete task"
                      aria-label="Delete task"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#71717A] hover:text-[#DC2626]" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Follow-up</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                Associated Client
              </label>
              <select
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[13px]"
              >
                {leads.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.company})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                Task Title
              </label>
              <Input
                placeholder="e.g. Review annual contract terms"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                  Date
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                  Time
                </label>
                <Input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                  Assignee
                </label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2 text-[12px]"
                >
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2 text-[12px]"
                >
                  <option value="urgent">Urgent</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                  Recurrence
                </label>
                <select
                  value={recurrence}
                  onChange={(e) => setRecurrence(e.target.value as TaskRecurrence)}
                  className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2 text-[12px]"
                >
                  <option value="none">None</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                Description
              </label>
              <Textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Follow-up</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(rescheduleId)}
        onOpenChange={(o) => !o && setRescheduleId(null)}
      >
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Reschedule Follow-up</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!rescheduleId) return;
              rescheduleFollowUp(rescheduleId, newDate, newTime);
              setRescheduleId(null);
              toast({ title: "Follow-up rescheduled" });
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setRescheduleId(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Schedule</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
