"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";

export default function SettingsPage() {
  const { organizations, currentOrgId, resetDemoData } = useCrmStore();
  const currentOrg =
    organizations.find((o) => o.id === currentOrgId) ?? organizations[0];

  const [orgName, setOrgName] = useState(currentOrg.name);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifFollowup, setNotifFollowup] = useState(true);

  return (
    <AppShell>
      <div className="space-y-5 max-w-3xl">
        <PageHeader
          title="Settings"
          description="Workspace preferences, notifications, and demo state"
        />

        <Tabs defaultValue="workspace">
          <TabsList>
            <TabsTrigger value="workspace">Workspace</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="demo">Demo & Reset</TabsTrigger>
          </TabsList>

          <TabsContent value="workspace">
            <Card className="p-5 space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                  Organisation Name
                </label>
                <Input value={orgName} onChange={(e) => setOrgName(e.target.value)} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                    Default Currency
                  </label>
                  <Input value={currentOrg.currency} readOnly />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#18181B] mb-1.5">
                    Industry
                  </label>
                  <Input value={currentOrg.industry} readOnly />
                </div>
              </div>
              <div className="pt-2 border-t border-[#E4E4E7] flex justify-end">
                <Button
                  size="sm"
                  onClick={() => toast({ title: "Workspace settings saved" })}
                >
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="divide-y divide-[#E4E4E7]">
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-[13px] font-medium text-[#18181B]">
                    New lead assignment alerts
                  </p>
                  <p className="text-[12px] text-[#71717A]">
                    Notify reps immediately when a lead is routed to them.
                  </p>
                </div>
                <Switch checked={notifEmail} onCheckedChange={setNotifEmail} />
              </div>
              <div className="flex items-center justify-between p-5">
                <div>
                  <p className="text-[13px] font-medium text-[#18181B]">
                    Follow-up due reminders
                  </p>
                  <p className="text-[12px] text-[#71717A]">
                    Surface in-app reminders 15 minutes before scheduled calls.
                  </p>
                </div>
                <Switch checked={notifFollowup} onCheckedChange={setNotifFollowup} />
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <Card className="p-5 space-y-3 border-[#FECACA]">
              <p className="text-[14px] font-semibold text-[#18181B]">
                Reset Frontend Demo Data
              </p>
              <p className="text-[13px] text-[#52525B]">
                Restore all leads, pipeline stages, follow-ups, inbox conversations, and workflows back to the initial seed dataset.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  resetDemoData();
                  toast({ title: "Demo data restored to defaults" });
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset Demo Workspace
              </Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
