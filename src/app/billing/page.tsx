"use client";

import { CreditCard, Check } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { PropertyRow, StatusIndicator } from "@/components/ui/primitives";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

export default function BillingPage() {
  return (
    <AppShell>
      <div className="space-y-5 max-w-3xl">
        <PageHeader
          title="Billing"
          description="Subscription overview, seat usage, and simulated invoice summary"
        />

        <Card className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[16px] font-semibold text-[#18181B]">
                Wyntro Enterprise
              </h2>
              <StatusIndicator color="#16A34A" label="Active Demo Plan" />
            </div>
            <p className="text-[13px] text-[#52525B]">
              Unlimited pipelines, visual workflow automation, and team routing.
            </p>
            <div className="pt-1 flex flex-wrap gap-4 text-[12px] text-[#52525B]">
              <span className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#16A34A]" /> 5 / 25 Seats Used
              </span>
              <span className="inline-flex items-center gap-1">
                <Check className="h-3.5 w-3.5 text-[#16A34A]" /> Unlimited Lead Forms
              </span>
            </div>
          </div>
          <div className="text-left sm:text-right shrink-0">
            <p className="text-[28px] font-semibold text-[#18181B] tabular-nums">
              ₹6,499<span className="text-[12px] font-normal text-[#71717A]">/seat/mo</span>
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

        <Card className="p-5">
          <p className="text-[13px] font-semibold text-[#18181B] mb-2">
            Billing Details
          </p>
          <PropertyRow label="Billing Cycle" value="Monthly (Simulated)" />
          <PropertyRow label="Next Invoice Date" value="2026-12-01" />
          <PropertyRow label="Payment Method" value="Demo Card •••• 4242" />
        </Card>
      </div>
    </AppShell>
  );
}
