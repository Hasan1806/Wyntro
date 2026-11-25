"use client";

import { CreditCard, Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function BillingPage() {
  return (
    <AppShell>
      <div className="space-y-5 max-w-4xl">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
            Billing & Plan
          </h1>
          <p className="text-[13px] text-[#667085]">
            Simulated subscription overview for Wyntro Enterprise Demo
          </p>
        </div>

        <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[18px] font-semibold text-[#101828]">
                Wyntro Enterprise
              </h2>
              <Badge variant="primary">Active Demo Plan</Badge>
            </div>
            <p className="text-[13px] text-[#667085] mt-1">
              Includes unlimited pipelines, visual workflow automation, and team routing.
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-[#344054]">
              <span className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#12B76A]" /> 5 / 25 Seats Used
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#12B76A]" /> Unlimited Lead Forms
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[28px] font-semibold text-[#101828] tabular-nums">
              ₹6,499<span className="text-[13px] font-normal text-[#667085]">/seat/mo</span>
            </p>
            <Button
              size="sm"
              variant="secondary"
              className="mt-2"
              onClick={() =>
                toast({
                  title: "Simulated Billing Portal",
                  description: "No payment processor is connected in demo mode.",
                  variant: "info",
                })
              }
            >
              <CreditCard className="h-3.5 w-3.5" />
              Manage Payment (Demo)
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
