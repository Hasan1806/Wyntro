"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Send,
  Paperclip,
  Sparkles,
  FileText,
  Lock,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency, getInitials } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { MessageChannel } from "@/types/crm";

export default function InboxPage() {
  const {
    conversations,
    leads,
    team,
    templates,
    sendMessage,
    markConversationRead,
    addFollowUp,
    currentUserId,
  } = useCrmStore();

  const [selectedId, setSelectedId] = useState(conversations[0]?.id ?? "");
  const [search, setSearch] = useState("");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [composerMode, setComposerMode] = useState<MessageChannel>("whatsapp");
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState("");
  const [showTemplates, setShowTemplates] = useState(false);

  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
      if (channelFilter !== "all" && c.channel !== channelFilter) return false;
      if (unreadOnly && c.unreadCount === 0) return false;
      if (ownerFilter && c.assignedTo !== ownerFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !c.leadName.toLowerCase().includes(q) &&
          !c.company.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [conversations, channelFilter, unreadOnly, ownerFilter, search]);

  const activeConv =
    conversations.find((c) => c.id === selectedId) ?? filteredConversations[0];
  const activeLead = activeConv
    ? leads.find((l) => l.id === activeConv.leadId)
    : undefined;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConv || !draft.trim()) return;
    sendMessage(activeConv.id, draft.trim(), composerMode, attachment || undefined);
    setDraft("");
    setAttachment("");
    toast({
      title:
        composerMode === "internal"
          ? "Internal note saved"
          : `Simulated ${composerMode.toUpperCase()} message logged`,
      description:
        composerMode === "internal"
          ? undefined
          : "Demo mode: no external message was transmitted.",
      variant: "info",
    });
  };

  return (
    <AppShell>
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-[#101828]">
              Unified Inbox
            </h1>
            <p className="text-[12px] text-[#667085]">
              WhatsApp, Email, SMS, and Internal Team Notes in one workspace
            </p>
          </div>
          <Badge variant="primary">
            <Sparkles className="h-3 w-3" />
            Simulated Demo Messaging — No external delivery
          </Badge>
        </div>

        {/* 3-Column Inbox Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[10px] border border-[#E4E7EC] bg-white overflow-hidden min-h-[620px]">
          {/* LEFT: Conversation List */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#E4E7EC] flex flex-col">
            <div className="p-3 border-b border-[#E4E7EC] space-y-2.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#98A2B3]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-8 h-8 text-[12px]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {["all", "whatsapp", "email", "sms"].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => setChannelFilter(ch)}
                    className={`rounded-[6px] px-2 py-1 text-[11px] font-medium capitalize cursor-pointer ${
                      channelFilter === ch
                        ? "bg-[#EFEDFF] text-[#635BFF]"
                        : "text-[#667085] hover:bg-[#F8F9FC]"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
                <button
                  onClick={() => setUnreadOnly((u) => !u)}
                  className={`rounded-[6px] px-2 py-1 text-[11px] font-medium cursor-pointer ${
                    unreadOnly
                      ? "bg-[#635BFF] text-white"
                      : "text-[#667085] hover:bg-[#F8F9FC]"
                  }`}
                >
                  Unread
                </button>
              </div>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="h-8 w-full rounded-[6px] border border-[#E4E7EC] bg-white px-2 text-[12px]"
              >
                <option value="">All Assignees</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E4E7EC]">
              {filteredConversations.map((conv) => {
                const active = conv.id === activeConv?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedId(conv.id);
                      markConversationRead(conv.id);
                      setComposerMode(conv.channel);
                    }}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer ${
                      active ? "bg-[#EFEDFF]/60" : "hover:bg-[#F8F9FC]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[13px] font-semibold text-[#101828]">
                        {conv.leadName}
                      </p>
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {conv.channel}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#667085]">{conv.company}</p>
                    <div className="mt-1.5 flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] text-[#475467]">
                        {conv.lastMessagePreview}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-semibold text-white">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER: Message History & Composer */}
          <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-[#E4E7EC]">
            {activeConv ? (
              <>
                <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#101828]">
                      {activeConv.leadName}
                    </p>
                    <p className="text-[12px] text-[#667085]">
                      {activeConv.company} • Channel: {activeConv.channel.toUpperCase()} (Simulated)
                    </p>
                  </div>
                  <Link
                    href={`/leads/${activeConv.leadId}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#635BFF] hover:underline"
                  >
                    View Profile
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FC]/60 max-h-[400px]">
                  {activeConv.messages.map((msg) => {
                    const isOut = msg.direction === "outbound";
                    const isInternal = msg.direction === "internal";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isInternal
                            ? "items-center"
                            : isOut
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[82%] rounded-[10px] px-3.5 py-2.5 text-[13px] ${
                            isInternal
                              ? "border border-[#F79009]/40 bg-[#FFFAEB] text-[#7A2E0E] w-full"
                              : isOut
                              ? "bg-[#635BFF] text-white"
                              : "border border-[#E4E7EC] bg-white text-[#101828]"
                          }`}
                        >
                          {isInternal && (
                            <p className="text-[10px] font-semibold uppercase tracking-wider mb-1 flex items-center gap-1">
                              <Lock className="h-3 w-3" /> Internal Note
                            </p>
                          )}
                          <p className="whitespace-pre-wrap">{msg.body}</p>
                          {msg.attachmentName && (
                            <p className="mt-1.5 text-[11px] underline opacity-90">
                              📎 {msg.attachmentName}
                            </p>
                          )}
                        </div>
                        <span className="mt-1 text-[10px] text-[#98A2B3] tabular-nums">
                          {msg.senderName} • {msg.createdAt.slice(11, 16)} •{" "}
                          {msg.status} (Simulated)
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Composer */}
                <form
                  onSubmit={handleSend}
                  className="border-t border-[#E4E7EC] bg-white p-3.5 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {(["whatsapp", "email", "sms", "internal"] as const).map(
                        (mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setComposerMode(mode)}
                            className={`rounded-[6px] px-2.5 py-1 text-[11px] font-medium capitalize cursor-pointer ${
                              composerMode === mode
                                ? mode === "internal"
                                  ? "bg-[#FFFAEB] text-[#B54708] border border-[#F79009]/40"
                                  : "bg-[#635BFF] text-white"
                                : "bg-[#F8F9FC] text-[#667085] hover:text-[#101828]"
                            }`}
                          >
                            {mode === "internal" ? "Internal Note" : mode}
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 relative">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowTemplates((s) => !s)}
                      >
                        <FileText className="h-3.5 w-3.5" />
                        Templates
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setAttachment("Wyntro-Overview-2026.pdf")}
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                        Attach
                      </Button>

                      {showTemplates && (
                        <div className="absolute bottom-full right-0 mb-1 w-64 rounded-[8px] border border-[#E4E7EC] bg-white p-1.5 shadow-xl z-20">
                          {templates.map((tpl) => (
                            <button
                              key={tpl.id}
                              type="button"
                              onClick={() => {
                                const personalized = tpl.body
                                  .replace("{{client_name}}", activeConv.leadName)
                                  .replace("{{company_name}}", activeConv.company)
                                  .replace("{{salesperson}}", "Hasan")
                                  .replace("{{followup_date}}", "tomorrow");
                                setDraft(personalized);
                                setShowTemplates(false);
                              }}
                              className="w-full text-left rounded-[6px] px-2.5 py-1.5 text-[12px] hover:bg-[#F8F9FC] cursor-pointer"
                            >
                              <p className="font-medium text-[#101828]">{tpl.name}</p>
                              <p className="text-[11px] text-[#667085] truncate">
                                {tpl.category}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {attachment && (
                    <div className="flex items-center justify-between rounded-[6px] bg-[#F8F9FC] px-2.5 py-1 text-[11px] text-[#344054]">
                      <span>Attached (Demo): {attachment}</span>
                      <button
                        type="button"
                        onClick={() => setAttachment("")}
                        className="text-[#F04438] cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  <Textarea
                    rows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={
                      composerMode === "internal"
                        ? "Write an internal team note..."
                        : `Type a simulated ${composerMode} message...`
                    }
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#98A2B3]">
                      Demo composer • Delivery states are simulated
                    </span>
                    <Button type="submit" size="sm">
                      <Send className="h-3.5 w-3.5" />
                      {composerMode === "internal" ? "Add Note" : "Send (Demo)"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[#667085]">
                Select a conversation to view messages.
              </div>
            )}
          </div>

          {/* RIGHT: Customer Context */}
          <div className="lg:col-span-3 p-4 space-y-4 bg-white">
            {activeLead ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFEDFF] text-[13px] font-semibold text-[#635BFF]">
                    {getInitials(activeLead.name)}
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#101828]">
                      {activeLead.name}
                    </p>
                    <p className="text-[12px] text-[#667085]">{activeLead.company}</p>
                  </div>
                </div>

                <div className="space-y-2.5 border-t border-[#E4E7EC] pt-3 text-[12px]">
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Stage</span>
                    <Badge variant="primary" className="capitalize">
                      {activeLead.stageId}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Est. Value</span>
                    <span className="font-semibold text-[#101828] tabular-nums">
                      {formatCurrency(activeLead.estimatedValue)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Owner</span>
                    <span className="text-[#101828]">
                      {team.find((m) => m.id === activeLead.assignedTo)?.name ??
                        "Unassigned"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#667085]">Phone</span>
                    <span className="tabular-nums">{activeLead.phone}</span>
                  </div>
                </div>

                <div className="border-t border-[#E4E7EC] pt-3 space-y-2">
                  <p className="text-[12px] font-semibold text-[#101828]">
                    Quick Follow-up
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      addFollowUp({
                        leadId: activeLead.id,
                        leadName: activeLead.name,
                        company: activeLead.company,
                        title: `Follow up with ${activeLead.name}`,
                        description: "Created from Unified Inbox.",
                        dueDate: "2026-11-26",
                        dueTime: "10:00",
                        priority: "high",
                        assignedTo: activeLead.assignedTo || currentUserId,
                        status: "pending",
                        recurrence: "none",
                        channel: "whatsapp",
                      });
                      toast({ title: "Follow-up scheduled for tomorrow" });
                    }}
                  >
                    + Schedule Tomorrow 10:00 AM
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-[12px] text-[#667085]">No lead context available.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
