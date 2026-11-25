"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/toast";

export default function InviteAcceptPage() {
  const router = useRouter();
  const [name, setName] = useState("Jordan Hayes");
  const [password, setPassword] = useState("");

  return (
    <AuthShell
      title="Join Wyntro Global Sales"
      subtitle="Aarav Mehta invited you to collaborate in Wyntro."
    >
      <div className="mb-4 flex items-center justify-between rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] px-3 py-2.5">
        <div>
          <p className="text-[12px] font-medium text-[#101828]">Assigned Role</p>
          <p className="text-[11px] text-[#667085]">EMEA Growth Team</p>
        </div>
        <Badge variant="primary">Sales Rep</Badge>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast({ title: "Invitation accepted (Demo)", description: "Entering workspace." });
          router.push("/dashboard");
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Your full name
          </label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Create password
          </label>
          <Input
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Accept Invitation & Enter Workspace
        </Button>
      </form>
    </AuthShell>
  );
}
