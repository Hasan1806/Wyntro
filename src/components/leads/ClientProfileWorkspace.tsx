"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Mail,
  StickyNote,
  CheckSquare,
  Share2,
  ArrowLeft,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Avatar, PropertyRow } from "@/components/ui/primitives";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency, openWhatsApp } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export function ClientProfileWorkspace({ id }: { id: string }) {
  const {
    leads,
    team,
    pipelines,
    activities,
    followUps,
    conversations,
    contentItems,
    updateLead,
    addActivity,
    addFollowUp,
    toggleFollowUpComplete,
    currentUserId,
  } = useCrmStore();

  const lead = leads.find((l) => l.id === id);
  const [noteText, setNoteText] = useState("");
  const [simMessage, setSimMessage] = useState("");
  const [simChannel, setSimChannel] = useState<"whatsapp" | "email" | "sms">("whatsapp");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDate, setNewTaskDate] = useState("2026-11-26");

  if (!lead) {
    return (
      <AppShell>
        <div className="rounded-[8px] border border-[#E4E4E7] bg-white p-8 text-center">
          <p className="text-[14px] font-semibold text-[#18181B]">Record not found</p>
          <p className="text-[13px] text-[#71717A] mt-1">
            This lead or contact may have been deleted in demo mode.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link href="/leads">Back to Leads</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const pipeline = pipelines.find((p) => p.id === lead.pipelineId) ?? pipelines[0];
  const actor = team.find((t) => t.id === currentUserId) ?? team[0];
  const leadActivities = activities.filter((a) => a.leadId === lead.id);
  const leadFollowUps = followUps.filter((f) => f.leadId === lead.id);
  const leadConversation = conversations.find((c) => c.leadId === lead.id);

  const handleLogQuickAction = (
    type: "call_logged" | "meeting_scheduled" | "file_shared",
    title: string,
    description: string
  ) => {
    addActivity({
      leadId: lead.id,
      type,
      title,
      description,
      actorId: actor.id,
      actorName: actor.name,
      isSimulated: true,
    });
    updateLead(lead.id, { lastContactedAt: new Date().toISOString() });
    toast({ title, description: "Logged to activity timeline (Simulated)." });
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    addActivity({
      leadId: lead.id,
      type: "note_added",
      title: "Internal Note Added",
      description: noteText.trim(),
      actorId: actor.id,
      actorName: actor.name,
    });
    setNoteText("");
    toast({ title: "Note added" });
  };

  const handleSendSimulatedComm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simMessage.trim()) return;
    addActivity({
      leadId: lead.id,
      type: simChannel === "email" ? "email_activity" : "message_activity",
      title: `Simulated ${simChannel.toUpperCase()} Composed`,
      description: `${simMessage.trim()} (Demo only — not externally delivered)`,
      actorId: actor.id,
      actorName: actor.name,
      isSimulated: true,
    });
    updateLead(lead.id, { lastContactedAt: new Date().toISOString() });
    setSimMessage("");
    toast({
      title: "Simulated communication logged",
      description: "Marked as demo activity; no external message was sent.",
      variant: "info",
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addFollowUp({
      leadId: lead.id,
      leadName: lead.name,
      company: lead.company,
      title: newTaskTitle.trim(),
      description: "Scheduled from client profile.",
      dueDate: newTaskDate,
      dueTime: "11:00",
      priority: "high",
      assignedTo: lead.assignedTo || actor.id,
      status: "pending",
      recurrence: "none",
      channel: "call",
    });
    setNewTaskTitle("");
    toast({ title: "Follow-up scheduled" });
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#52525B] hover:text-[#18181B]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Leads
          </Link>
          <span className="text-[12px] text-[#71717A]">
            Simulated Demo Activity & Messaging
          </span>
        </div>

        {/* 3-Region Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT: Identity & Structured Property Rows */}
          <Card className="lg:col-span-3 p-4 space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={lead.name} color="#635BFF" size="lg" />
              <div className="min-w-0">
                <h1 className="truncate text-[16px] font-semibold text-[#18181B]">
                  {lead.name}
                </h1>
                <p className="truncate text-[12px] text-[#71717A]">{lead.company}</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              <Button
                variant="secondary"
                size="sm"
                className="flex-col h-12 px-1 text-[11px]"
                onClick={() =>
                  handleLogQuickAction(
                    "call_logged",
                    "Outbound Call Logged",
                    `Simulated call attempt to ${lead.phone}.`
                  )
                }
              >
                <Phone className="h-3.5 w-3.5 text-[#52525B]" />
                Call
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-col h-12 px-1 text-[11px]"
                onClick={() => {
                  setSimChannel("whatsapp");
                  openWhatsApp(
                    lead.phone,
                    `Hi ${lead.name}, this is ${actor.name} from Wyntro.`
                  );
                }}
              >
                <MessageSquare className="h-3.5 w-3.5 text-[#16A34A]" />
                WhatsApp
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-col h-12 px-1 text-[11px]"
                onClick={() => setSimChannel("email")}
              >
                <Mail className="h-3.5 w-3.5 text-[#52525B]" />
                Email
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="flex-col h-12 px-1 text-[11px]"
                onClick={() =>
                  handleLogQuickAction(
                    "file_shared",
                    "Content Shared",
                    `Shared ${contentItems[0]?.title ?? "Overview Deck"} (Simulated).`
                  )
                }
              >
                <Share2 className="h-3.5 w-3.5 text-[#52525B]" />
                Share
              </Button>
            </div>

            <div className="border-t border-[#E4E4E7] pt-2">
              <PropertyRow label="Email" value={lead.email} />
              <PropertyRow label="Phone" value={<span className="tabular-nums">{lead.phone}</span>} />
              {(lead.city || lead.country) && (
                <PropertyRow
                  label="Location"
                  value={[lead.city, lead.country].filter(Boolean).join(", ")}
                />
              )}
              <PropertyRow label="Source" value={lead.source} />
              <PropertyRow
                label="Est. Value"
                value={<span className="tabular-nums">{formatCurrency(lead.estimatedValue)}</span>}
              />
              <PropertyRow
                label="Lead Score"
                value={<span className="tabular-nums">{lead.score}/100</span>}
              />
            </div>

            {lead.tags.length > 0 && (
              <div className="border-t border-[#E4E4E7] pt-3">
                <p className="text-[11px] font-medium text-[#71717A] mb-1.5">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {lead.tags.map((t) => (
                    <Badge key={t} variant="default">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {Object.keys(lead.customFields).length > 0 && (
              <div className="border-t border-[#E4E4E7] pt-2">
                <p className="text-[11px] font-medium text-[#71717A] mb-1">Custom Fields</p>
                {Object.entries(lead.customFields).map(([k, v]) => (
                  <PropertyRow key={k} label={k} value={v} />
                ))}
              </div>
            )}
          </Card>

          {/* CENTER: Activity Timeline & 7 Tabs */}
          <Card className="lg:col-span-6 p-4">
            <Tabs defaultValue="activity">
              <TabsList className="w-full overflow-x-auto justify-start">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="conversations">Conversations</TabsTrigger>
                <TabsTrigger value="deals">Deals</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
                <TabsTrigger value="files">Files</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-3.5">
                  <p className="text-[12px] font-medium text-[#71717A]">Qualification Notes</p>
                  <p className="mt-1 text-[13px] text-[#18181B]">
                    {lead.notes || "No notes added yet."}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[6px] border border-[#E4E4E7] p-3">
                    <p className="text-[11px] text-[#71717A]">Deal Value</p>
                    <p className="mt-1 text-[16px] font-semibold text-[#18181B] tabular-nums">
                      {formatCurrency(lead.estimatedValue)}
                    </p>
                  </div>
                  <div className="rounded-[6px] border border-[#E4E4E7] p-3">
                    <p className="text-[11px] text-[#71717A]">Lead Score</p>
                    <p className="mt-1 text-[16px] font-semibold text-[#635BFF] tabular-nums">
                      {lead.score}/100
                    </p>
                  </div>
                  <div className="rounded-[6px] border border-[#E4E4E7] p-3">
                    <p className="text-[11px] text-[#71717A]">Opt-in</p>
                    <p className="mt-1 text-[14px] font-semibold text-[#16A34A]">
                      {lead.consentOptIn ? "Opted In" : "Pending"}
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <form
                  onSubmit={handleSendSimulatedComm}
                  className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {(["whatsapp", "email", "sms"] as const).map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setSimChannel(ch)}
                          className={`rounded-[4px] px-2 py-0.5 text-[11px] font-medium uppercase cursor-pointer ${
                            simChannel === ch
                              ? "bg-[#18181B] text-white"
                              : "bg-white border border-[#E4E4E7] text-[#52525B]"
                          }`}
                        >
                          {ch}
                        </button>
                      ))}
                    </div>
                    <span className="text-[11px] text-[#71717A]">
                      Simulated Composer
                    </span>
                  </div>
                  <Textarea
                    rows={2}
                    value={simMessage}
                    onChange={(e) => setSimMessage(e.target.value)}
                    placeholder={`Compose a simulated ${simChannel} message to ${lead.name}...`}
                  />
                  <div className="flex justify-end gap-2">
                    {simChannel === "whatsapp" && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => openWhatsApp(lead.phone, simMessage.trim() || undefined)}
                      >
                        Open WhatsApp
                      </Button>
                    )}
                    <Button type="submit" size="sm">
                      Log Simulated {simChannel.toUpperCase()}
                    </Button>
                  </div>
                </form>

                <div className="divide-y divide-[#E4E4E7]">
                  {leadActivities.length === 0 ? (
                    <p className="text-[13px] text-[#71717A] py-6 text-center">
                      No timeline activities recorded yet.
                    </p>
                  ) : (
                    leadActivities.map((act) => (
                      <div key={act.id} className="py-3 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[13px] font-medium text-[#18181B]">
                            {act.title}
                          </p>
                          <div className="flex items-center gap-2 shrink-0">
                            {act.isSimulated && (
                              <Badge variant="outline">Simulated</Badge>
                            )}
                            <span className="text-[11px] text-[#A1A1AA] tabular-nums">
                              {act.createdAt.slice(0, 10)}
                            </span>
                          </div>
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#52525B]">
                          {act.description}
                        </p>
                        <p className="mt-1 text-[11px] text-[#A1A1AA]">
                          {act.actorName}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="conversations">
                {leadConversation ? (
                  <div className="space-y-2.5">
                    {leadConversation.messages.map((m) => (
                      <div
                        key={m.id}
                        className="rounded-[6px] border border-[#E4E4E7] p-3 text-[13px]"
                      >
                        <div className="flex items-center justify-between text-[11px] text-[#71717A] mb-1">
                          <span className="font-medium text-[#18181B]">
                            {m.senderName} · {m.channel}
                          </span>
                          <span>{m.status} (Simulated)</span>
                        </div>
                        <p className="text-[#52525B]">{m.body}</p>
                      </div>
                    ))}
                    <Button asChild variant="secondary" size="sm">
                      <Link href="/inbox">Open in Unified Inbox →</Link>
                    </Button>
                  </div>
                ) : (
                  <p className="text-[13px] text-[#71717A] py-4">
                    No conversation thread yet.{" "}
                    <Link href="/inbox" className="text-[#635BFF] hover:underline">
                      Open Unified Inbox
                    </Link>
                  </p>
                )}
              </TabsContent>

              <TabsContent value="deals">
                <div className="rounded-[6px] border border-[#E4E4E7] p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[14px] font-semibold text-[#18181B]">
                      {lead.company} — Enterprise Opportunity
                    </p>
                    <p className="text-[12px] text-[#71717A] mt-0.5">
                      {pipeline.name} · Stage: {lead.stageId}
                    </p>
                  </div>
                  <p className="text-[16px] font-semibold text-[#18181B] tabular-nums">
                    {formatCurrency(lead.estimatedValue)}
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="tasks" className="space-y-2.5">
                {leadFollowUps.length === 0 ? (
                  <p className="text-[13px] text-[#71717A] py-4">
                    No follow-up tasks scheduled for this client.
                  </p>
                ) : (
                  leadFollowUps.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-[6px] border border-[#E4E4E7] px-3.5 py-2.5"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-[#18181B]">{t.title}</p>
                        <p className="text-[12px] text-[#71717A] tabular-nums">
                          Due {t.dueDate} at {t.dueTime}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={t.status === "completed" ? "soft" : "secondary"}
                        onClick={() => toggleFollowUpComplete(t.id)}
                      >
                        {t.status === "completed" ? "Completed" : "Complete"}
                      </Button>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="files" className="space-y-2">
                {contentItems.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-[6px] border border-[#E4E4E7] px-3.5 py-2.5"
                  >
                    <div>
                      <p className="text-[13px] font-medium text-[#18181B]">{item.title}</p>
                      <p className="text-[11px] text-[#71717A]">{item.sizeLabel}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        handleLogQuickAction(
                          "file_shared",
                          `Shared ${item.title}`,
                          `Simulated share link generated for ${lead.name}.`
                        )
                      }
                    >
                      Share
                    </Button>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="notes">
                <form onSubmit={handleAddNote} className="space-y-3">
                  <Textarea
                    rows={3}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Write an internal note about this client..."
                  />
                  <Button type="submit" size="sm">
                    <StickyNote className="h-3.5 w-3.5" />
                    Save Note
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </Card>

          {/* RIGHT: Sales Properties & Follow-ups */}
          <Card className="lg:col-span-3 p-4 space-y-5">
            <div className="space-y-3">
              <p className="text-[13px] font-semibold text-[#18181B]">
                Sales Properties
              </p>

              <div>
                <label className="block text-[12px] font-medium text-[#52525B] mb-1">
                  Pipeline Stage
                </label>
                <select
                  value={lead.stageId}
                  onChange={(e) => {
                    updateLead(lead.id, { stageId: e.target.value });
                    addActivity({
                      leadId: lead.id,
                      type: "stage_changed",
                      title: `Stage changed to ${e.target.value}`,
                      description: "Updated from client profile.",
                      actorId: actor.id,
                      actorName: actor.name,
                    });
                    toast({ title: "Stage updated" });
                  }}
                  className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[13px] text-[#18181B]"
                >
                  {pipeline.stages.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#52525B] mb-1">
                  Lead Owner
                </label>
                <select
                  value={lead.assignedTo}
                  onChange={(e) => {
                    updateLead(lead.id, { assignedTo: e.target.value });
                    toast({ title: "Owner updated" });
                  }}
                  className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[13px] text-[#18181B]"
                >
                  <option value="">Unassigned</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-medium text-[#52525B] mb-1">
                  Priority
                </label>
                <select
                  value={lead.priority}
                  onChange={(e) =>
                    updateLead(lead.id, {
                      priority: e.target.value as typeof lead.priority,
                    })
                  }
                  className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[13px] text-[#18181B]"
                >
                  <option value="hot">Hot</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="border-t border-[#E4E4E7] pt-4 space-y-2.5">
              <p className="text-[13px] font-semibold text-[#18181B]">
                Schedule Follow-up
              </p>
              <form onSubmit={handleCreateTask} className="space-y-2.5">
                <Input
                  placeholder="e.g. Pricing review call"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                />
                <Input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                />
                <Button type="submit" size="sm" className="w-full">
                  <CheckSquare className="h-3.5 w-3.5" />
                  Add Follow-up
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
