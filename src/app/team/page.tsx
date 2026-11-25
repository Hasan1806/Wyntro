"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
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
import { formatCurrency, getInitials } from "@/lib/utils";
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Team Management
            </h1>
            <p className="text-[13px] text-[#667085]">
              Manage sales representatives, roles, routing availability, and quota attainment
            </p>
          </div>
          <Button size="sm" onClick={() => setInviteOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" />
            Invite Member
          </Button>
        </div>

        <div className="rounded-[10px] border border-[#E4E7EC] bg-white overflow-x-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[#E4E7EC] bg-[#F8F9FC] text-[12px] font-medium text-[#667085]">
              <tr>
                <th className="px-4 py-3">Member</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Team</th>
                <th className="px-4 py-3">Routing Availability</th>
                <th className="px-4 py-3">Leads</th>
                <th className="px-4 py-3">Deals Won</th>
                <th className="px-4 py-3">Revenue Won</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC]">
              {team.map((m) => (
                <tr key={m.id} className="hover:bg-[#F8F9FC]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold text-white"
                        style={{ backgroundColor: m.avatarColor }}
                      >
                        {getInitials(m.name)}
                      </div>
                      <div>
                        <p className="font-medium text-[#101828]">{m.name}</p>
                        <p className="text-[11px] text-[#667085]">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={m.role === "Admin" ? "primary" : "outline"}>
                      {m.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#344054]">{m.team}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={m.available}
                        onCheckedChange={() => toggleTeamAvailability(m.id)}
                      />
                      <span className="text-[12px] text-[#667085]">
                        {m.available ? "Available" : "Away"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{m.leadsAssigned}</td>
                  <td className="px-4 py-3 tabular-nums">{m.dealsWon}</td>
                  <td className="px-4 py-3 font-semibold tabular-nums">
                    {formatCurrency(m.revenueWon)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
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
                className="h-9 rounded-[8px] border border-[#E4E7EC] px-2.5 text-[12px]"
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
