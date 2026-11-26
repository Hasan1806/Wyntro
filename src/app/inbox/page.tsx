"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  Send,
  Paperclip,
  FileText,
  Lock,
  ExternalLink,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, PropertyRow } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency } from "@/lib/utils";
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
      <div className="space-y-4">
        <PageHeader
          title="Inbox"
          description="WhatsApp, Email, SMS, and internal team notes"
          meta={
            <span className="rounded-[5px] border border-[#E4E4E7] bg-[#F7F7F8] px-2 py-0.5 text-[11px] font-medium text-[#52525B]">
              Simulated Demo Messaging
            </span>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 rounded-[8px] border border-[#E4E4E7] bg-white overflow-hidden min-h-[600px]">
          {/* LEFT: Conversation List */}
          <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-[#E4E4E7] flex flex-col">
            <div className="p-3 border-b border-[#E4E4E7] space-y-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA]" />
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
                    className={`rounded-[4px] px-2 py-0.5 text-[11px] font-medium capitalize cursor-pointer ${
                      channelFilter === ch
                        ? "bg-[#18181B] text-white"
                        : "text-[#52525B] hover:bg-[#F4F4F5]"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
                <button
                  onClick={() => setUnreadOnly((u) => !u)}
                  className={`rounded-[4px] px-2 py-0.5 text-[11px] font-medium cursor-pointer ${
                    unreadOnly
                      ? "bg-[#635BFF] text-white"
                      : "text-[#52525B] hover:bg-[#F4F4F5]"
                  }`}
                >
                  Unread
                </button>
              </div>
              <select
                value={ownerFilter}
                onChange={(e) => setOwnerFilter(e.target.value)}
                className="h-8 w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2 text-[12px] text-[#18181B]"
              >
                <option value="">All Assignees</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-[#E4E4E7]">
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
                    className={`w-full text-left px-3.5 py-3 transition-colors cursor-pointer ${
                      active ? "bg-[#F4F4F5]" : "hover:bg-[#F7F7F8]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`truncate text-[13px] ${
                          conv.unreadCount > 0
                            ? "font-semibold text-[#18181B]"
                            : "font-medium text-[#18181B]"
                        }`}
                      >
                        {conv.leadName}
                      </p>
                      <span className="text-[10px] font-medium uppercase text-[#71717A] shrink-0">
                        {conv.channel}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#71717A]">{conv.company}</p>
                    <div className="mt-1 flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] text-[#52525B]">
                        {conv.lastMessagePreview}
                      </p>
                      {conv.unreadCount > 0 && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#635BFF]" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CENTER: Message Thread & Composer */}
          <div className="lg:col-span-6 flex flex-col border-b lg:border-b-0 lg:border-r border-[#E4E4E7]">
            {activeConv ? (
              <>
                <div className="flex items-center justify-between border-b border-[#E4E4E7] px-4 py-3">
                  <div>
                    <p className="text-[14px] font-semibold text-[#18181B]">
                      {activeConv.leadName}
                    </p>
                    <p className="text-[12px] text-[#71717A]">
                      {activeConv.company} · {activeConv.channel.toUpperCase()} (Simulated)
                    </p>
                  </div>
                  <Link
                    href={`/leads/${activeConv.leadId}`}
                    className="inline-flex items-center gap-1 text-[12px] font-medium text-[#635BFF] hover:underline"
                  >
                    Profile
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAFA] max-h-[390px]">
                  {activeConv.messages.map((msg) => {
                    const isOut = msg.direction === "outbound";
                    const isInternal = msg.direction === "internal";
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${
                          isInternal
                            ? "items-stretch"
                            : isOut
                            ? "items-end"
                            : "items-start"
                        }`}
                      >
                        <div
                          className={`max-w-[78%] rounded-[8px] px-3 py-2 text-[13px] leading-[19px] ${
                            isInternal
                              ? "max-w-full border border-[#E4E4E7] bg-[#FFFBEB] text-[#92400E]"
                              : isOut
                              ? "bg-[#635BFF] text-white"
                              : "border border-[#E4E4E7] bg-white text-[#18181B]"
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
                              {msg.attachmentName}
                            </p>
                          )}
                        </div>
                        <span className="mt-1 text-[11px] text-[#A1A1AA] tabular-nums">
                          {msg.senderName} · {msg.createdAt.slice(11, 16)} · {msg.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form
                  onSubmit={handleSend}
                  className="border-t border-[#E4E4E7] bg-white p-3.5 space-y-2.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {(["whatsapp", "email", "sms", "internal"] as const).map(
                        (mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setComposerMode(mode)}
                            className={`rounded-[4px] px-2 py-1 text-[11px] font-medium capitalize cursor-pointer ${
                              composerMode === mode
                                ? mode === "internal"
                                  ? "bg-[#FFFBEB] text-[#B45309] border border-[#FDE68A]"
                                  : "bg-[#18181B] text-white"
                                : "bg-[#F7F7F8] text-[#52525B] hover:text-[#18181B]"
                            }`}
                          >
                            {mode === "internal" ? "Internal Note" : mode}
                          </button>
                        )
                      )}
                    </div>

                    <div className="flex items-center gap-1 relative">
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
                        <div className="absolute bottom-full right-0 mb-1 w-64 rounded-[8px] border border-[#E4E4E7] bg-white p-1 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.14)] z-20">
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
                              className="w-full text-left rounded-[6px] px-2.5 py-1.5 text-[12px] hover:bg-[#F4F4F5] cursor-pointer"
                            >
                              <p className="font-medium text-[#18181B]">{tpl.name}</p>
                              <p className="text-[11px] text-[#71717A] truncate">
                                {tpl.category}
                              </p>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {attachment && (
                    <div className="flex items-center justify-between rounded-[6px] bg-[#F7F7F8] px-2.5 py-1 text-[11px] text-[#52525B]">
                      <span>Attached (Demo): {attachment}</span>
                      <button
                        type="button"
                        onClick={() => setAttachment("")}
                        className="text-[#DC2626] cursor-pointer"
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
                    <span className="text-[11px] text-[#A1A1AA]">
                      Demo composer · Delivery states are simulated
                    </span>
                    <Button type="submit" size="sm">
                      <Send className="h-3.5 w-3.5" />
                      {composerMode === "internal" ? "Add Note" : "Send (Demo)"}
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-[13px] text-[#71717A]">
                Select a conversation to view messages.
              </div>
            )}
          </div>

          {/* RIGHT: Customer Context */}
          <div className="lg:col-span-3 p-4 space-y-4 bg-white">
            {activeLead ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar name={activeLead.name} color="#635BFF" size="lg" />
                  <div className="min-w-0">
                    <p className="text-[14px] font-semibold text-[#18181B] truncate">
                      {activeLead.name}
                    </p>
                    <p className="text-[12px] text-[#71717A] truncate">{activeLead.company}</p>
                  </div>
                </div>

                <div className="border-t border-[#E4E4E7] pt-2">
                  <PropertyRow label="Stage" value={activeLead.stageId} />
                  <PropertyRow
                    label="Est. Value"
                    value={<span className="tabular-nums">{formatCurrency(activeLead.estimatedValue)}</span>}
                  />
                  <PropertyRow
                    label="Owner"
                    value={
                      team.find((m) => m.id === activeLead.assignedTo)?.name ??
                      "Unassigned"
                    }
                  />
                  <PropertyRow
                    label="Phone"
                    value={<span className="tabular-nums">{activeLead.phone}</span>}
                  />
                </div>

                <div className="border-t border-[#E4E4E7] pt-3 space-y-2">
                  <p className="text-[12px] font-semibold text-[#18181B]">
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
                    Schedule Tomorrow 10:00
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-[12px] text-[#71717A]">No lead context available.</p>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
