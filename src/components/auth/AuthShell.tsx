import Link from "next/link";
import { WyntroLogo } from "@/components/brand/WyntroLogo";
import { ShieldCheck } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-between p-6">
      <div className="flex items-center justify-between max-w-6xl w-full mx-auto">
        <Link href="/dashboard">
          <WyntroLogo size="md" />
        </Link>
        <Link
          href="/dashboard"
          className="text-[13px] font-medium text-[#635BFF] hover:underline"
        >
          Enter Demo Workspace →
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[420px] my-8">
        <div className="rounded-[12px] border border-[#E4E7EC] bg-white p-7 shadow-[0_1px_3px_rgba(16,24,40,0.06)]">
          <div className="mb-6">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[#101828]">
              {title}
            </h1>
            <p className="mt-1 text-[13px] text-[#667085]">{subtitle}</p>
          </div>
          {children}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-[8px] border border-[#E4E7EC] bg-white/70 px-3 py-2 text-[12px] text-[#667085]">
          <ShieldCheck className="h-4 w-4 text-[#635BFF] shrink-0" />
          <span>
            Simulated frontend authentication for demo preview — not production security.
          </span>
        </div>
      </div>

      <div className="text-center text-[12px] text-[#98A2B3]">
        Wyntro — Connect smarter. Convert faster.
      </div>
    </div>
  );
}
