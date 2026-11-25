"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { WyntroLogo } from "@/components/brand/WyntroLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const STEPS = [
  "Personal info",
  "Organisation",
  "Industry & size",
  "Sales channels",
  "Lead sources",
  "Invite team",
  "Launch",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { setHasCompletedOnboarding } = useCrmStore();
  const [step, setStep] = useState(0);

  const [fullName, setFullName] = useState("Meenal Shrivastava");
  const [roleTitle, setRoleTitle] = useState("Head of Revenue");
  const [orgName, setOrgName] = useState("Wyntro Global Sales");
  const [timezone, setTimezone] = useState("UTC+05:30 (Asia/Kolkata)");
  const [industry, setIndustry] = useState("B2B SaaS & Software");
  const [teamSize, setTeamSize] = useState("11-30 reps");
  const [channels, setChannels] = useState<string[]>(["WhatsApp", "Email"]);
  const [sources, setSources] = useState<string[]>(["Website Form", "Meta Lead Ads"]);
  const [invites, setInvites] = useState("elena@wyntro.io, marcus@wyntro.io");

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const finishOnboarding = () => {
    setHasCompletedOnboarding(true);
    toast({
      title: "Workspace configured",
      description: `${orgName} is ready in demo mode.`,
    });
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <WyntroLogo size="md" />
          <Badge variant="primary">Step {step + 1} of 7</Badge>
        </div>

        {/* Stepper */}
        <div className="mb-6 grid grid-cols-7 gap-1.5">
          {STEPS.map((label, idx) => (
            <div key={label} className="space-y-1.5">
              <div
                className={cn(
                  "h-1.5 rounded-full transition-colors",
                  idx <= step ? "bg-[#635BFF]" : "bg-[#E4E7EC]"
                )}
              />
              <p
                className={cn(
                  "text-[10px] truncate hidden sm:block",
                  idx === step ? "font-semibold text-[#101828]" : "text-[#98A2B3]"
                )}
              >
                {label}
              </p>
            </div>
          ))}
        </div>

        <motion.div
          key={step}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.18 }}
          className="rounded-[12px] border border-[#E4E7EC] bg-white p-7 shadow-[0_1px_3px_rgba(16,24,40,0.06)]"
        >
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[20px] font-semibold text-[#101828]">
                  Personal information
                </h1>
                <p className="text-[13px] text-[#667085]">
                  Tell us how you&apos;d like to appear to your sales team and clients.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#344054] mb-1">
                    Full name
                  </label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#344054] mb-1">
                    Job title
                  </label>
                  <Input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[20px] font-semibold text-[#101828]">
                  Organisation details
                </h1>
                <p className="text-[13px] text-[#667085]">
                  Configure your primary Wyntro workspace identity and timezone.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-medium text-[#344054] mb-1">
                    Organisation name
                  </label>
                  <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
                </div>
                <div>
                  <label className="block text-[12px] font-medium text-[#344054] mb-1">
                    Primary timezone
                  </label>
                  <Input value={timezone} onChange={(e) => setTimezone(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[20px] font-semibold text-[#101828]">
                  Business industry and team size
                </h1>
                <p className="text-[13px] text-[#667085]">
                  We tailor pipeline stages and lead scoring templates to your model.
                </p>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#344054] mb-2">
                  Industry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "B2B SaaS & Software",
                    "Real Estate",
                    "Financial Services",
                    "Education & EdTech",
                    "Healthcare",
                    "Agency & Consulting",
                  ].map((ind) => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setIndustry(ind)}
                      className={cn(
                        "rounded-[8px] border px-3 py-2.5 text-left text-[12px] font-medium transition-colors cursor-pointer",
                        industry === ind
                          ? "border-[#635BFF] bg-[#EFEDFF] text-[#635BFF]"
                          : "border-[#E4E7EC] hover:bg-[#F8F9FC]"
                      )}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-medium text-[#344054] mb-2">
                  Sales team size
                </label>
                <div className="flex flex-wrap gap-2">
                  {["Solo", "2-10 reps", "11-30 reps", "31-100 reps", "100+ reps"].map(
                    (sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setTeamSize(sz)}
                        className={cn(
                          "rounded-[8px] border px-3.5 py-2 text-[12px] font-medium cursor-pointer",
                          teamSize === sz
                            ? "border-[#635BFF] bg-[#EFEDFF] text-[#635BFF]"
                            : "border-[#E4E7EC] hover:bg-[#F8F9FC]"
                        )}
                      >
                        {sz}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[20px] font-semibold text-[#101828]">
                  Primary sales channels
                </h1>
                <p className="text-[13px] text-[#667085]">
                  Select the channels your reps use daily in the Unified Inbox.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {["WhatsApp", "Email", "SMS", "Phone Calls"].map((ch) => {
                  const selected = channels.includes(ch);
                  return (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => toggleItem(channels, setChannels, ch)}
                      className={cn(
                        "flex items-center justify-between rounded-[8px] border px-3.5 py-3 text-[13px] font-medium cursor-pointer",
                        selected
                          ? "border-[#635BFF] bg-[#EFEDFF] text-[#635BFF]"
                          : "border-[#E4E7EC] hover:bg-[#F8F9FC]"
                      )}
                    >
                      <span>{ch}</span>
                      {selected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[20px] font-semibold text-[#101828]">
                  Connect lead sources (Simulated)
                </h1>
                <p className="text-[13px] text-[#667085]">
                  Choose which sources to pre-enable in your demo workspace, or skip for now.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  "Website Form",
                  "Meta Lead Ads",
                  "Google Ads",
                  "LinkedIn Lead Gen",
                  "Inbound Webhooks",
                  "CSV Import",
                ].map((src) => {
                  const selected = sources.includes(src);
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => toggleItem(sources, setSources, src)}
                      className={cn(
                        "flex items-center justify-between rounded-[8px] border px-3.5 py-2.5 text-[13px] font-medium cursor-pointer",
                        selected
                          ? "border-[#635BFF] bg-[#EFEDFF] text-[#635BFF]"
                          : "border-[#E4E7EC] hover:bg-[#F8F9FC]"
                      )}
                    >
                      <span>{src}</span>
                      {selected && <Check className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[20px] font-semibold text-[#101828]">
                  Invite team members
                </h1>
                <p className="text-[13px] text-[#667085]">
                  Enter teammate emails (comma-separated) or continue directly.
                </p>
              </div>
              <Input
                value={invites}
                onChange={(e) => setInvites(e.target.value)}
                placeholder="colleague@company.com, rep@company.com"
              />
              <p className="text-[12px] text-[#98A2B3]">
                Demo mode: invitations are simulated locally without sending real emails.
              </p>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4 text-center py-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEDFF] text-[#635BFF]">
                <Sparkles className="h-6 w-6" />
              </div>
              <h1 className="text-[22px] font-semibold text-[#101828]">
                {orgName} is ready
              </h1>
              <p className="text-[13px] text-[#667085] max-w-md mx-auto">
                We&apos;ve prepared your pipeline, {channels.length} communication channels, and{" "}
                {sources.length} simulated lead sources for {industry}.
              </p>
              <Button size="lg" onClick={finishOnboarding} className="mt-2">
                Enter Wyntro Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Footer Controls */}
          {step < 6 && (
            <div className="mt-7 flex items-center justify-between border-t border-[#E4E7EC] pt-4">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="flex items-center gap-2">
                {(step === 4 || step === 5) && (
                  <Button variant="ghost" onClick={() => setStep((s) => s + 1)}>
                    Skip
                  </Button>
                )}
                <Button onClick={() => setStep((s) => Math.min(6, s + 1))}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
