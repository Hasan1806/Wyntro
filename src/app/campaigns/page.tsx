"use client";

import { useState } from "react";
import { Plus, Play, Pause } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusIndicator } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";

const STATUS_COLOR: Record<string, string> = {
  draft: "#71717A",
  scheduled: "#2563EB",
  running: "#635BFF",
  paused: "#D97706",
  completed: "#16A34A",
  failed: "#DC2626",
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
  const estimatedCost = Number((optedInCount * (channel === "email" ? 0.5 : 4.5)).toFixed(2));

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
      createdBy: "Hasan",
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
      <div className="space-y-4">
        <PageHeader
          title="Campaigns"
          description="Broadcast personalized WhatsApp, Email, and SMS campaigns"
          actions={
            <Button size="sm" onClick={() => setBuilderOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Create Campaign
            </Button>
          }
        />

        <div className="rounded-[8px] border border-[#E4E4E7] bg-white overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
              <tr>
                <th className="px-4">Campaign</th>
                <th className="px-4">Channel</th>
                <th className="px-4">Audience</th>
                <th className="px-4">Status</th>
                <th className="px-4 text-right">Sent</th>
                <th className="px-4 text-right">Delivery</th>
                <th className="px-4 text-right">Reply Rate</th>
                <th className="px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {campaigns.map((cmp) => (
                <tr key={cmp.id} className="h-12 hover:bg-[#F7F7F8]">
                  <td className="px-4">
                    <p className="font-medium text-[#18181B]">{cmp.name}</p>
                    <p className="text-[11px] text-[#71717A]">
                      {cmp.createdBy} · Simulated
                    </p>
                  </td>
                  <td className="px-4 uppercase text-[11px] font-medium text-[#52525B]">
                    {cmp.channel}
                  </td>
                  <td className="px-4">
                    <p className="text-[#18181B]">{cmp.audienceName}</p>
                    <p className="text-[11px] text-[#71717A] tabular-nums">
                      {cmp.optedInCount}/{cmp.audienceCount} opted-in
                    </p>
                  </td>
                  <td className="px-4">
                    <StatusIndicator
                      color={STATUS_COLOR[cmp.status] ?? "#71717A"}
                      label={cmp.status}
                      className="capitalize"
                    />
                  </td>
                  <td className="px-4 text-right tabular-nums">{cmp.sentCount}</td>
                  <td className="px-4 text-right tabular-nums">{cmp.deliveryRate}%</td>
                  <td className="px-4 text-right tabular-nums">{cmp.replyRate}%</td>
                  <td className="px-4 text-right">
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
                        <Play className="h-3 w-3" /> Run
                      </Button>
                    ) : (
                      <span className="text-[12px] text-[#A1A1AA]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
        <DialogContent className="max-w-[560px]">
          <DialogHeader>
            <DialogTitle>Create Campaign — Step {step} of 6</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-6 gap-1 mb-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`h-1 rounded-full ${
                  n <= step ? "bg-[#635BFF]" : "bg-[#E4E4E7]"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#18181B]">
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
                    className={`rounded-[6px] border py-2 text-[12px] font-medium uppercase cursor-pointer ${
                      channel === ch
                        ? "border-[#635BFF] bg-[#EFEDFF] text-[#5148E5]"
                        : "border-[#E4E4E7] text-[#52525B]"
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
              <p className="text-[13px] font-medium text-[#18181B]">
                Step 2: Audience selection & opt-in eligibility
              </p>
              <select
                value={audienceName}
                onChange={(e) => {
                  setAudienceName(e.target.value);
                  setAudienceCount(e.target.value.includes("All") ? 420 : 148);
                }}
                className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] px-3 text-[13px]"
              >
                <option>VIP Accounts & Hot Leads</option>
                <option>EMEA Qualified Leads</option>
                <option>All Opted-in Leads</option>
              </select>
              <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-3 text-[12px] space-y-1">
                <p>
                  Total segment size: <strong className="tabular-nums">{audienceCount}</strong>
                </p>
                <p className="text-[#16A34A]">
                  Eligible opted-in contacts: <strong className="tabular-nums">{optedInCount}</strong>
                </p>
                <p className="text-[#71717A]">
                  Estimated simulated cost: <strong className="tabular-nums">₹{estimatedCost}</strong>
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#18181B]">
                Step 3: Message template
              </p>
              <select
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  const found = templates.find((t) => t.id === e.target.value);
                  if (found) setMessageBody(found.body);
                }}
                className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] px-3 text-[13px]"
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
              <p className="text-[13px] font-medium text-[#18181B]">
                Step 4: Personalisation & preview
              </p>
              <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-4 text-[13px] text-[#18181B]">
                {messageBody
                  .replace("{{client_name}}", "Sophia Lindqvist")
                  .replace("{{company_name}}", "NordicCloud AB")
                  .replace("{{salesperson}}", "Hasan")
                  .replace("{{followup_date}}", "Nov 27")}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-3.5">
              <p className="text-[13px] font-medium text-[#18181B]">
                Step 5: Schedule & review
              </p>
              <Input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
              />
              <div className="rounded-[6px] border border-[#E4E4E7] p-3 text-[12px] space-y-1 text-[#52525B]">
                <p>Campaign: <strong className="text-[#18181B]">{name}</strong></p>
                <p>Channel: <strong className="text-[#18181B] uppercase">{channel}</strong></p>
                <p>Eligible Recipients: <strong className="text-[#18181B] tabular-nums">{optedInCount}</strong></p>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-2 py-2">
              <p className="text-[14px] font-semibold text-[#18181B]">
                Ready for Simulated Launch
              </p>
              <p className="text-[13px] text-[#52525B]">
                Demo mode: Launching creates a scheduled campaign record locally without triggering external provider APIs.
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-between border-t border-[#E4E4E7] pt-3">
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
