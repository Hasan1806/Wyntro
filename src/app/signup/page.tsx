"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/toast";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [terms, setTerms] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email.includes("@") || password.length < 8 || !orgName || !terms) {
      setError("Complete all fields (8+ char password) and accept terms to continue.");
      return;
    }
    toast({
      title: "Demo account created",
      description: "Proceeding to email verification & onboarding.",
    });
    router.push("/verify-email");
  };

  return (
    <AuthShell
      title="Create your Wyntro workspace"
      subtitle="Start converting leads faster in under 2 minutes."
    >
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {error && (
          <div className="rounded-[8px] border border-[#FDA29B] bg-[#FEF3F2] px-3 py-2 text-[12px] text-[#B42318]">
            {error}
          </div>
        )}
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Full name
          </label>
          <Input
            placeholder="Sophia Lindqvist"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Business email
          </label>
          <Input
            type="email"
            placeholder="sophia@nordiccloud.se"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Organisation name
          </label>
          <Input
            placeholder="NordicCloud AB"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Password
          </label>
          <Input
            type="password"
            placeholder="Minimum 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-2 pt-1">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(v) => setTerms(Boolean(v))}
          />
          <label htmlFor="terms" className="text-[12px] text-[#667085] leading-snug">
            I agree to the Wyntro Terms of Service and Privacy Policy (Demo).
          </label>
        </div>

        <Button type="submit" className="w-full">
          Create account
        </Button>

        <p className="text-center text-[12px] text-[#667085] pt-1">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-[#635BFF] hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
