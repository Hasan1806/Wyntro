"use client";

import { Plug } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { StatusIndicator } from "@/components/ui/primitives";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";

export default function IntegrationsPage() {
  const { integrations, toggleIntegration } = useCrmStore();

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          title="Integrations"
          description="Connect lead sources, messaging providers, calendars, and webhooks (Simulated)"
        />

        <Card className="divide-y divide-[#E4E4E7]">
          {integrations.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 py-4 hover:bg-[#F7F7F8] transition-colors"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] text-[#52525B]">
                  <Plug className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-semibold text-[#18181B]">
                      {item.name}
                    </p>
                    <span className="text-[11px] text-[#A1A1AA]">
                      {item.category}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#71717A] mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                <StatusIndicator
                  color={item.connected ? "#16A34A" : "#71717A"}
                  label={item.statusLabel}
                />
                <Switch
                  checked={item.connected}
                  onCheckedChange={() => {
                    toggleIntegration(item.id);
                    toast({
                      title: item.connected
                        ? `${item.name} disconnected`
                        : `${item.name} connected (Simulated)`,
                      variant: "info",
                    });
                  }}
                />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </AppShell>
  );
}
