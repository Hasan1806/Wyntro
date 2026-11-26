"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";

export default function TeamPage() {
  const { team, toggleTeamAvailability, inviteTeamMember } = useCrmStore();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"Admin" | "Sales Manager" | "Sales Rep">("Sales Rep");
  const [teamName, setTeamName] = useState("EMEA Growth");

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          title="Team"
          description="Manage sales representatives, roles, routing availability, and attainment"
          actions={
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <UserPlus className="h-3.5 w-3.5" />
              Invite Member
            </Button>
          }
        />

        <div className="rounded-[8px] border border-[#E4E4E7] bg-white overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
              <tr>
                <th className="px-4">Member</th>
                <th className="px-4">Role</th>
                <th className="px-4">Team</th>
                <th className="px-4">Availability</th>
                <th className="px-4 text-right">Leads</th>
                <th className="px-4 text-right">Deals Won</th>
                <th className="px-4 text-right">Revenue Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E4E7]">
              {team.map((m) => (
                <tr key={m.id} className="h-12 hover:bg-[#F7F7F8]">
                  <td className="px-4">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={m.name} color={m.avatarColor} size="md" />
                      <div>
                        <p className="font-medium text-[#18181B]">{m.name}</p>
                        <p className="text-[12px] text-[#71717A]">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4">
                    <Badge variant={m.role === "Admin" ? "primary" : "outline"}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="px-4 text-[#52525B]">{m.team}</td>
                  <td className="px-4">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={m.available}
                        onCheckedChange={() => toggleTeamAvailability(m.id)}
                      />
                      <span className="text-[12px] text-[#71717A]">
                        {m.available ? "Available" : "Away"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 text-right tabular-nums">{m.leadsAssigned}</td>
                  <td className="px-4 text-right tabular-nums">{m.dealsWon}</td>
                  <td className="px-4 text-right font-semibold tabular-nums">
                    {formatCurrency(m.revenueWon)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-[460px]">
          <DialogHeader>
            <DialogTitle>Invite Team Member (Demo)</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim() || !email.includes("@")) return;
              inviteTeamMember({
                name: name.trim(),
                email: email.trim(),
                role,
                team: teamName,
                available: true,
                avatarColor: "#635BFF",
              });
              setName("");
              setEmail("");
              setInviteOpen(false);
              toast({ title: "Team member added (Simulated invite)" });
            }}
            className="space-y-3.5"
          >
            <Input
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="grid grid-cols-2 gap-2.5">
              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value as "Admin" | "Sales Manager" | "Sales Rep")
                }
                className="h-[38px] rounded-[6px] border border-[#E4E4E7] px-2.5 text-[12px]"
              >
                <option value="Sales Rep">Sales Rep</option>
                <option value="Sales Manager">Sales Manager</option>
                <option value="Admin">Admin</option>
              </select>
              <Input
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Team name"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Demo Invite</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
