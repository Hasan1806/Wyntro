"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <AuthShell
      title="Verify your email"
      subtitle="Simulated verification step before workspace onboarding."
    >
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#EFEDFF] text-[#635BFF]">
          <MailCheck className="h-6 w-6" />
        </div>
        <p className="text-[13px] text-[#667085]">
          In production, a verification link would be sent to your inbox. In this demo, click below to verify and launch onboarding.
        </p>
        <Button asChild className="w-full">
          <Link href="/onboarding">Verify & Continue to Onboarding</Link>
        </Button>
      </div>
    </AuthShell>
  );
}
