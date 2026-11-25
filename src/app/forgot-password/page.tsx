"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your business email to receive a simulated reset link."
    >
      {sent ? (
        <div className="space-y-4 text-center py-2">
          <CheckCircle2 className="h-10 w-10 text-[#12B76A] mx-auto" />
          <p className="text-[13px] text-[#344054]">
            Simulated reset instructions prepared for <strong>{email}</strong>.
          </p>
          <Button asChild className="w-full">
            <Link href="/reset-password">Open Simulated Reset Screen</Link>
          </Button>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (email.includes("@")) setSent(true);
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-[12px] font-medium text-[#344054] mb-1">
              Business email
            </label>
            <Input
              type="email"
              required
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Send reset link
          </Button>
          <p className="text-center text-[12px] text-[#667085]">
            <Link href="/login" className="text-[#635BFF] hover:underline">
              Back to sign in
            </Link>
          </p>
        </form>
      )}
    </AuthShell>
  );
}
