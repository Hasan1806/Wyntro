"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8 || password !== confirm) {
      setError("Passwords must match and be at least 8 characters.");
      return;
    }
    toast({ title: "Password updated (Simulated)", description: "You can now sign in." });
    router.push("/login");
  };

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Set a strong password for your Wyntro account."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-[8px] border border-[#FDA29B] bg-[#FEF3F2] px-3 py-2 text-[12px] text-[#B42318]">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            New password
          </label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Confirm password
          </label>
          <Input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
