"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";

export default function LoginPage() {
  const router = useRouter();
  const { setDemoAuthenticated } = useCrmStore();
  const [email, setEmail] = useState("meenal.shrivastava@wyntro.io");
  const [password, setPassword] = useState("WyntroDemo2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@") || password.length < 6) {
      setError("Please enter a valid email and a password of at least 6 characters.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setDemoAuthenticated(true);
      setLoading(false);
      toast({
        title: "Signed in (Demo Mode)",
        description: `Welcome back to Wyntro, ${email}.`,
      });
      router.push("/dashboard");
    }, 550);
  };

  return (
    <AuthShell
      title="Sign in to Wyntro"
      subtitle="Connect smarter. Convert faster."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-[8px] border border-[#FDA29B] bg-[#FEF3F2] px-3 py-2 text-[12px] text-[#B42318]">
            {error}
          </div>
        )}

        <div>
          <label className="block text-[12px] font-medium text-[#344054] mb-1">
            Email address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[12px] font-medium text-[#344054]">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-[#635BFF] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-9"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#98A2B3] hover:text-[#101828] cursor-pointer"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setRemember(Boolean(v))}
          />
          <label htmlFor="remember" className="text-[12px] text-[#667085] cursor-pointer">
            Remember me on this device
          </label>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-[#E4E7EC]" />
          </div>
          <div className="relative flex justify-center text-[11px] uppercase">
            <span className="bg-white px-2 text-[#98A2B3]">or</span>
          </div>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={() => {
            setDemoAuthenticated(true);
            toast({ title: "Simulated Google SSO", description: "Entered Wyntro demo workspace." });
            router.push("/dashboard");
          }}
        >
          Continue with Google (Demo)
        </Button>

        <p className="text-center text-[12px] text-[#667085] pt-2">
          New to Wyntro?{" "}
          <Link href="/signup" className="font-medium text-[#635BFF] hover:underline">
            Create account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
