"use client";

import { useState } from "react";
import { Plus, Megaphone, Sparkles, Play, Pause } from "lucide-react";
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

const STATUS_BADGE: Record<
  string,
  "default" | "primary" | "success" | "warning" | "error" | "info"
> = {
  draft: "default",
  scheduled: "info",
  running: "primary",
  paused: "warning",
  completed: "success",
  failed: "error",
};

export default function CampaignsPage() {
  const { campaigns, templates, addCampaign, updateCampaignStatus } =
    useCrmStore();

  const [builderOpen, setBuilderOpen] = useState(false);
  const [step, setStep] = useState(1);

  const [name, setName] = useState("Q4 Customer Expansion Broadcast");
  const [channel, setChannel] = useState<"whatsapp" | "email" | "sms">("whatsapp");
  const [audienceName, setAudienceName] = useState("VIP Accounts & Hot Leads");
  const [audienceCount, setAudienceCount] = useState(148);
  const [templateId, setTemplateId] = useState(templates[0]?.id ?? "");
  const [messageBody, setMessageBody] = useState(
    templates[0]?.body ?? "Hi {{client_name}}, checking in from Wyntro!"
  );
  const [scheduledAt, setScheduledAt] = useState("2026-11-27T10:00");

  const optedInCount = Math.round(audienceCount * 0.92);
  const estimatedCost = Number((optedInCount * (channel === "email" ? 0.01 : 0.08)).toFixed(2));

  const handleLaunch = () => {
    addCampaign({
      name,
      channel,
      audienceName,
      audienceCount,
      optedInCount,
      status: "scheduled",
      scheduledAt,
      sentCount: 0,
      deliveryRate: 0,
      replyRate: 0,
      estimatedCost,
      createdBy: "Aarav Mehta",
      templateId,
      messagePreview: messageBody,
      isSimulated: true,
    });
    setBuilderOpen(false);
    setStep(1);
    toast({
      title: "Campaign scheduled (Simulated)",
      description: `${name} added in demo mode. No real messages will be sent.`,
      variant: "info",
    });
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Campaigns
            </h1>
            <p className="text-[13px] text-[#667085]">
              Broadcast personalized WhatsApp, Email, and SMS campaigns to segmented audiences
            </p>
          </div>
          <Button size="sm" onClick={() => setBuilderOpen(true)}>
            <Plus className="h-3.5 w-3.5" />
            Create Campaign
          </Button>
        </div>

        <div className="rounded-[10px] border border-[#E4E7EC] bg-white overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#E4E7EC] bg-[#F8F9FC] text-[12px] font-medium text-[#667085]">
              <tr>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Channel</th>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Sent</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Reply Rate</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {campaigns.map((cmp) => (
                <tr key={cmp.id} className="hover:bg-[#F8F9FC]">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#101828]">{cmp.name}</p>
                    <p className="text-[11px] text-[#667085]">
                      By {cmp.createdBy} • Simulated
                    </p>
                  </td>
                  <td className="px-4 py-3 uppercase text-[11px] font-semibold text-[#344054]">
                    {cmp.channel}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-[#101828]">{cmp.audienceName}</p>
                    <p className="text-[11px] text-[#667085] tabular-nums">
                      {cmp.optedInCount}/{cmp.audienceCount} opted-in
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={STATUS_BADGE[cmp.status] ?? "default"} className="capitalize">
                      {cmp.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{cmp.sentCount}</td>
                  <td className="px-4 py-3 tabular-nums">{cmp.deliveryRate}%</td>
                  <td className="px-4 py-3 tabular-nums">{cmp.replyRate}%</td>
                  <td className="px-4 py-3">
                    {cmp.status === "running" ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => updateCampaignStatus(cmp.id, "paused")}
                      >
                        <Pause className="h-3 w-3" /> Pause
                      </Button>
                    ) : cmp.status === "paused" || cmp.status === "draft" ? (
                      <Button
                        size="sm"
                        variant="soft"
                        onClick={() => updateCampaignStatus(cmp.id, "running")}
                      >
                        <Play className="h-3 w-3" /> Simulate Run
                      </Button>
                    ) : (
                      <span className="text-[12px] text-[#98A2B3]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6-Step Campaign Builder */}
      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-[#635BFF]" />
              Campaign Builder — Step {step} of 6
            </DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-6 gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`h-1.5 rounded-full ${
                  n <= step ? "bg-[#635BFF]" : "bg-[#E4E7EC]"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#101828]">
                Step 1: Campaign details
              </p>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Campaign name"
              />
              <div className="grid grid-cols-3 gap-2">
                {(["whatsapp", "email", "sms"] as const).map((ch) => (
                  <button
                    key={ch}
                    type="button"
                    onClick={() => setChannel(ch)}
                    className={`rounded-[8px] border py-2.5 text-[12px] font-medium uppercase cursor-pointer ${
                      channel === ch
                        ? "border-[#635BFF] bg-[#EFEDFF] text-[#635BFF]"
                        : "border-[#E4E7EC]"
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#101828]">
                Step 2: Audience selection & opt-in eligibility
              </p>
              <select
                value={audienceName}
                onChange={(e) => {
                  setAudienceName(e.target.value);
                  setAudienceCount(e.target.value.includes("All") ? 420 : 148);
                }}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] px-3 text-[13px]"
              >
                <option>VIP Accounts & Hot Leads</option>
                <option>EMEA Qualified Leads</option>
                <option>All Opted-in Leads</option>
              </select>
              <Card className="p-3.5 bg-[#F8F9FC] text-[12px] space-y-1">
                <p>
                  Total segment size: <strong className="tabular-nums">{audienceCount}</strong>
                </p>
                <p className="text-[#12B76A]">
                  Eligible opted-in contacts: <strong className="tabular-nums">{optedInCount}</strong>
                </p>
                <p className="text-[#667085]">
                  Estimated simulated cost: <strong className="tabular-nums">${estimatedCost}</strong>
                </p>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#101828]">
                Step 3: Message template
              </p>
              <select
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  const found = templates.find((t) => t.id === e.target.value);
                  if (found) setMessageBody(found.body);
                }}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] px-3 text-[13px]"
              >
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.channel})
                  </option>
                ))}
              </select>
              <Textarea
                rows={4}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
              />
            </div>
          )}

          {step === 4 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#101828]">
                Step 4: Personalisation & preview
              </p>
              <div className="rounded-[10px] border border-[#E4E7EC] bg-[#F8F9FC] p-4 text-[13px] text-[#101828]">
                {messageBody
                  .replace("{{client_name}}", "Sophia Lindqvist")
                  .replace("{{company_name}}", "NordicCloud AB")
                  .replace("{{salesperson}}", "Aarav Mehta")
                  .replace("{{followup_date}}", "Nov 27")}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#101828]">
                Step 5: Schedule & review
              </p>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <div className="rounded-[8px] border border-[#E4E7EC] p-3 text-[12px] space-y-1 text-[#667085]">
                <p>Campaign: <strong className="text-[#101828]">{name}</strong></p>
                <p>Channel: <strong className="text-[#101828] uppercase">{channel}</strong></p>
                <p>Eligible Recipients: <strong className="text-[#101828]">{optedInCount}</strong></p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-3 text-center py-3">
              <Sparkles className="h-8 w-8 text-[#635BFF] mx-auto" />
              <p className="text-[15px] font-semibold text-[#101828]">
                Ready for Simulated Launch
              </p>
              <p className="text-[12px] text-[#667085]">
                Demo mode: Launching creates a scheduled campaign record locally without triggering external provider APIs.
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-between border-t border-[#E4E7EC] pt-3">
            <Button
              variant="secondary"
              disabled={step === 1}
              onClick={() => setStep((s) => Math.max(1, s - 1))}
            >
              Back
            </Button>
            {step < 6 ? (
              <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
            ) : (
              <Button onClick={handleLaunch}>Simulated Launch</Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
