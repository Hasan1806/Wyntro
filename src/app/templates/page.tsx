"use client";

import { useMemo, useState } from "react";
import { Plus, Copy, Trash2, Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
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
import type { TemplateCategory } from "@/types/crm";

const CATEGORIES: TemplateCategory[] = [
  "Introduction",
  "Follow-up",
  "Product enquiry",
  "Quotation",
  "Meeting confirmation",
  "Payment reminder",
  "Customer retention",
  "Custom",
];

export default function TemplatesPage() {
  const { templates, addTemplate, deleteTemplate } = useCrmStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [selectedId, setSelectedId] = useState(templates[0]?.id ?? "");
  const [createOpen, setCreateOpen] = useState(false);

  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<TemplateCategory>("Follow-up");
  const [newChannel, setNewChannel] = useState<"whatsapp" | "email" | "sms">("whatsapp");
  const [newBody, setNewBody] = useState(
    "Hi {{client_name}}, following up on {{company_name}}'s Wyntro demo for {{followup_date}}."
  );

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      if (category !== "all" && t.category !== category) return false;
      if (search.trim() && !t.name.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [templates, category, search]);

  const active = templates.find((t) => t.id === selectedId) ?? filtered[0];

  const renderPreview = (body: string) =>
    body
      .replaceAll("{{client_name}}", "Sophia Lindqvist")
      .replaceAll("{{company_name}}", "NordicCloud AB")
      .replaceAll("{{salesperson}}", "Aarav Mehta")
      .replaceAll("{{product}}", "Wyntro Enterprise")
      .replaceAll("{{followup_date}}", "Nov 26, 2:00 PM");

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Message Templates
            </h1>
            <p className="text-[13px] text-[#667085]">
              Reusable multi-channel snippets with dynamic personalization placeholders
            </p>
          </div>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            New Template
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search templates..."
              className="pl-9"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-3 text-[12px]"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-7 space-y-2.5">
            {filtered.map((tpl) => (
              <Card
                key={tpl.id}
                onClick={() => setSelectedId(tpl.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  active?.id === tpl.id
                    ? "border-[#635BFF] ring-1 ring-[#635BFF]/20"
                    : "hover:border-[#D0D5DD]"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-[#101828]">
                        {tpl.name}
                      </p>
                      <Badge variant="outline" className="uppercase text-[10px]">
                        {tpl.channel}
                      </Badge>
                      {tpl.whatsappStatus && (
                        <Badge
                          variant={
                            tpl.whatsappStatus === "approved_simulated"
                              ? "success"
                              : "warning"
                          }
                        >
                          {tpl.whatsappStatus === "approved_simulated"
                            ? "Simulated Approved"
                            : "Simulated Pending"}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[12px] text-[#667085] mt-1 line-clamp-2">
                      {tpl.body}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        addTemplate({
                          name: `${tpl.name} (Copy)`,
                          category: tpl.category,
                          channel: tpl.channel,
                          body: tpl.body,
                          placeholders: tpl.placeholders,
                          whatsappStatus: tpl.whatsappStatus,
                          whatsappCategory: tpl.whatsappCategory,
                        });
                        toast({ title: "Template duplicated" });
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTemplate(tpl.id);
                        toast({ title: "Template deleted" });
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#F04438]" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Live Personalized Preview */}
          <Card className="lg:col-span-5 p-5 h-fit sticky top-20">
            <p className="text-[13px] font-semibold text-[#101828]">
              Live Personalized Preview
            </p>
            <p className="text-[11px] text-[#667085] mt-0.5">
              Sample data: Sophia Lindqvist • NordicCloud AB
            </p>
            {active ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-[10px] border border-[#E4E7EC] bg-[#F8F9FC] p-4 text-[13px] text-[#101828] whitespace-pre-wrap">
                  {renderPreview(active.body)}
                </div>
                {active.channel === "whatsapp" && (
                  <div className="rounded-[8px] border border-[#E4E7EC] p-3 text-[12px] space-y-1">
                    <p className="font-medium text-[#101828]">
                      WhatsApp Provider Metadata (Simulated)
                    </p>
                    <p className="text-[#667085]">
                      Category: {active.whatsappCategory ?? "UTILITY"} • Status:{" "}
                      {active.whatsappStatus ?? "approved_simulated"}
                    </p>
                  </div>
                )}
              </div>
            ) : null}
          </Card>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Message Template</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newName.trim()) return;
              addTemplate({
                name: newName.trim(),
                category: newCategory,
                channel: newChannel,
                body: newBody,
                placeholders: ["client_name", "company_name", "followup_date"],
                whatsappStatus:
                  newChannel === "whatsapp" ? "pending_simulated" : undefined,
                whatsappCategory: newChannel === "whatsapp" ? "UTILITY" : undefined,
              });
              setNewName("");
              setCreateOpen(false);
              toast({ title: "Template saved" });
            }}
            className="space-y-3.5"
          >
            <Input
              placeholder="Template name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-2.5">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as TemplateCategory)}
                className="h-9 rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={newChannel}
                onChange={(e) =>
                  setNewChannel(e.target.value as "whatsapp" | "email" | "sms")
                }
                className="h-9 rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
                <option value="sms">SMS</option>
              </select>
            </div>
            <Textarea
              rows={4}
              value={newBody}
              onChange={(e) => setNewBody(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Template</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
