"use client";

import { Plug } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";

export default function IntegrationsPage() {
  const { integrations, toggleIntegration } = useCrmStore();

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
            Integrations
          </h1>
          <p className="text-[13px] text-[#667085]">
            Connect lead sources, messaging providers, calendars, and webhooks (Simulated in frontend demo)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {integrations.map((item) => (
            <Card key={item.id} className="p-5 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#EFEDFF] text-[#635BFF]">
                    <Plug className="h-5 w-5" />
                  </div>
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
                <h3 className="mt-3 text-[15px] font-semibold text-[#101828]">
                  {item.name}
                </h3>
                <p className="text-[12px] text-[#667085] mt-1">{item.description}</p>
              </div>

              <div className="pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-[12px]">
                <Badge variant={item.connected ? "success" : "default"}>
                  {item.statusLabel}
                </Badge>
                <span className="text-[#98A2B3]">{item.category}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
