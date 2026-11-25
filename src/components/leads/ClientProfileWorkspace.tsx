"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Phone,
  MessageSquare,
  Mail,
  StickyNote,
  CalendarPlus,
  CheckSquare,
  Share2,
  ArrowLeft,
  Building2,
  MapPin,
  Sparkles,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Textarea } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency, getInitials } from "@/lib/utils";
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
        <div className="rounded-[10px] border border-[#E4E7EC] bg-white p-8 text-center">
          <p className="text-[15px] font-semibold text-[#101828]">Record not found</p>
          <p className="text-[13px] text-[#667085] mt-1">
            This lead or contact may have been deleted in demo mode.
          </p>
          <Button asChild className="mt-4">
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
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#667085] hover:text-[#101828]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Leads
          </Link>
          <Badge variant="primary">
            <Sparkles className="h-3 w-3" />
            Simulated Activity & Demo Messaging
          </Badge>
        </div>

        {/* 3-Region Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* LEFT REGION: Identity & Client Info */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EFEDFF] text-[15px] font-semibold text-[#635BFF]">
                  {getInitials(lead.name)}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-[17px] font-semibold text-[#101828]">
                    {lead.name}
                  </h1>
                  <p className="truncate text-[12px] text-[#667085] flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {lead.company}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mt-4 grid grid-cols-4 gap-1.5">
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-col h-14 px-1 text-[11px]"
                  onClick={() =>
                    handleLogQuickAction(
                      "call_logged",
                      "Outbound Call Logged",
                      `Simulated call attempt to ${lead.phone}.`
                    )
                  }
                >
                  <Phone className="h-3.5 w-3.5 text-[#635BFF]" />
                  Call
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-col h-14 px-1 text-[11px]"
                  onClick={() => setSimChannel("whatsapp")}
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[#12B76A]" />
                  WhatsApp
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-col h-14 px-1 text-[11px]"
                  onClick={() => setSimChannel("email")}
                >
                  <Mail className="h-3.5 w-3.5 text-[#2E90FA]" />
                  Email
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="flex-col h-14 px-1 text-[11px]"
                  onClick={() =>
                    handleLogQuickAction(
                      "file_shared",
                      "Content Shared",
                      `Shared ${contentItems[0]?.title ?? "Overview Deck"} (Simulated).`
                    )
                  }
                >
                  <Share2 className="h-3.5 w-3.5 text-[#F79009]" />
                  Share
                </Button>
              </div>

              <div className="mt-5 space-y-3 border-t border-[#E4E7EC] pt-4 text-[13px]">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#98A2B3]">Email</p>
                  <p className="text-[#101828] break-all">{lead.email}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#98A2B3]">Phone</p>
                  <p className="text-[#101828] tabular-nums">{lead.phone}</p>
                </div>
                {(lead.city || lead.country) && (
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#98A2B3]">Location</p>
                    <p className="text-[#101828] flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-[#98A2B3]" />
                      {[lead.city, lead.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-[#98A2B3]">Tags</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {lead.tags.map((t) => (
                      <Badge key={t} variant="primary">
                        {t}
                      </Badge>
                    ))}
                  </div>
                </div>
                {Object.keys(lead.customFields).length > 0 && (
                  <div className="pt-2 border-t border-[#E4E7EC] space-y-2">
                    <p className="text-[11px] uppercase tracking-wider text-[#98A2B3]">
                      Custom Fields
                    </p>
                    {Object.entries(lead.customFields).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-[12px]">
                        <span className="text-[#667085]">{k}</span>
                        <span className="font-medium text-[#101828]">{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* CENTER REGION: Timeline & 7 Tabs */}
          <div className="lg:col-span-6 space-y-4">
            <Card className="p-5">
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
                  <div className="rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-4">
                    <p className="text-[12px] font-medium text-[#667085]">Qualification Notes</p>
                    <p className="mt-1 text-[13px] text-[#101828]">{lead.notes || "No notes added yet."}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-[8px] border border-[#E4E7EC] p-3">
                      <p className="text-[11px] text-[#667085]">Deal Value</p>
                      <p className="text-[18px] font-semibold text-[#101828] tabular-nums">
                        {formatCurrency(lead.estimatedValue)}
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#E4E7EC] p-3">
                      <p className="text-[11px] text-[#667085]">Lead Score</p>
                      <p className="text-[18px] font-semibold text-[#635BFF] tabular-nums">
                        {lead.score}/100
                      </p>
                    </div>
                    <div className="rounded-[8px] border border-[#E4E7EC] p-3">
                      <p className="text-[11px] text-[#667085]">Opt-in Consent</p>
                      <p className="text-[14px] font-semibold text-[#12B76A] mt-1">
                        {lead.consentOptIn ? "Opted In" : "Pending"}
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-4">
                  {/* Simulated Composer */}
                  <form
                    onSubmit={handleSendSimulatedComm}
                    className="rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-3 space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {(["whatsapp", "email", "sms"] as const).map((ch) => (
                          <button
                            key={ch}
                            type="button"
                            onClick={() => setSimChannel(ch)}
                            className={`rounded-[6px] px-2.5 py-1 text-[11px] font-medium uppercase cursor-pointer ${
                              simChannel === ch
                                ? "bg-[#635BFF] text-white"
                                : "bg-white border border-[#E4E7EC] text-[#667085]"
                            }`}
                          >
                            {ch}
                          </button>
                        ))}
                      </div>
                      <span className="text-[11px] text-[#98A2B3]">
                        Simulated Composer (Demo)
                      </span>
                    </div>
                    <Textarea
                      rows={2}
                      value={simMessage}
                      onChange={(e) => setSimMessage(e.target.value)}
                      placeholder={`Compose a simulated ${simChannel} message to ${lead.name}...`}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm">
                        Log Simulated {simChannel.toUpperCase()}
                      </Button>
                    </div>
                  </form>

                  {/* Timeline */}
                  <div className="space-y-3">
                    {leadActivities.length === 0 ? (
                      <p className="text-[13px] text-[#667085] py-4 text-center">
                        No timeline activities recorded yet.
                      </p>
                    ) : (
                      leadActivities.map((act) => (
                        <div
                          key={act.id}
                          className="relative pl-5 pb-3 border-l border-[#E4E7EC] last:pb-0"
                        >
                          <span className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-medium text-[#101828]">
                              {act.title}
                            </p>
                            <div className="flex items-center gap-1.5">
                              {act.isSimulated && (
                                <Badge variant="outline">Simulated</Badge>
                              )}
                              <span className="text-[11px] text-[#98A2B3] tabular-nums">
                                {act.createdAt.slice(0, 10)}
                              </span>
                            </div>
                          </div>
                          <p className="mt-0.5 text-[12px] text-[#667085]">
                            {act.description}
                          </p>
                          <p className="mt-1 text-[11px] text-[#98A2B3]">
                            by {act.actorName}
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
                          className="rounded-[8px] border border-[#E4E7EC] p-3 text-[13px]"
                        >
                          <div className="flex items-center justify-between text-[11px] text-[#667085] mb-1">
                            <span className="font-medium text-[#101828]">
                              {m.senderName} ({m.channel})
                            </span>
                            <span>{m.status} • Simulated</span>
                          </div>
                          <p className="text-[#344054]">{m.body}</p>
                        </div>
                      ))}
                      <Button asChild variant="secondary" size="sm">
                        <Link href="/inbox">Open in Unified Inbox →</Link>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-[13px] text-[#667085] py-4">
                      No conversation thread yet.{" "}
                      <Link href="/inbox" className="text-[#635BFF] hover:underline">
                        Open Unified Inbox
                      </Link>
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="deals">
                  <div className="rounded-[8px] border border-[#E4E7EC] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-[#101828]">
                        {lead.company} — Enterprise Opportunity
                      </p>
                      <p className="text-[12px] text-[#667085] mt-0.5">
                        Pipeline: {pipeline.name} • Stage: {lead.stageId}
                      </p>
                    </div>
                    <p className="text-[16px] font-semibold text-[#101828] tabular-nums">
                      {formatCurrency(lead.estimatedValue)}
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="tasks" className="space-y-3">
                  {leadFollowUps.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-[8px] border border-[#E4E7EC] p-3"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-[#101828]">{t.title}</p>
                        <p className="text-[12px] text-[#667085]">
                          Due {t.dueDate} at {t.dueTime}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant={t.status === "completed" ? "soft" : "secondary"}
                        onClick={() => toggleFollowUpComplete(t.id)}
                      >
                        {t.status === "completed" ? "Completed" : "Mark Complete"}
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="files" className="space-y-2.5">
                  {contentItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-[8px] border border-[#E4E7EC] p-3"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-[#101828]">{item.title}</p>
                        <p className="text-[11px] text-[#667085]">{item.sizeLabel}</p>
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
          </div>

          {/* RIGHT REGION: Sales Properties, Follow-ups & Ownership */}
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sales Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#667085] mb-1">
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
                        description: "Updated from client profile sidebar.",
                        actorId: actor.id,
                        actorName: actor.name,
                      });
                      toast({ title: "Stage updated" });
                    }}
                    className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[13px]"
                  >
                    {pipeline.stages.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[#667085] mb-1">
                    Lead Owner
                  </label>
                  <select
                    value={lead.assignedTo}
                    onChange={(e) => {
                      updateLead(lead.id, { assignedTo: e.target.value });
                      toast({ title: "Owner updated" });
                    }}
                    className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[13px]"
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
                  <label className="block text-[11px] font-medium text-[#667085] mb-1">
                    Priority
                  </label>
                  <select
                    value={lead.priority}
                    onChange={(e) =>
                      updateLead(lead.id, {
                        priority: e.target.value as typeof lead.priority,
                      })
                    }
                    className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[13px]"
                  >
                    <option value="hot">Hot</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-1.5">
                  <CalendarPlus className="h-4 w-4 text-[#635BFF]" />
                  Schedule Follow-up
                </CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
