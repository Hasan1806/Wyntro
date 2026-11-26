import Link from "next/link";
import { WyntroLogo } from "@/components/brand/WyntroLogo";

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
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between p-6">
      <div className="flex items-center justify-between max-w-5xl w-full mx-auto">
        <Link href="/">
          <WyntroLogo size="md" />
        </Link>
        <Link
          href="/dashboard"
          className="text-[13px] font-medium text-[#635BFF] hover:underline"
        >
          Enter Demo Workspace →
        </Link>
      </div>

      <div className="mx-auto w-full max-w-[400px] my-8">
        <div className="rounded-[8px] border border-[#E4E4E7] bg-white p-6">
          <div className="mb-5">
            <h1 className="text-[20px] font-semibold tracking-[-0.02em] text-[#18181B]">
              {title}
            </h1>
            <p className="mt-1 text-[13px] text-[#71717A]">{subtitle}</p>
          </div>
          {children}
        </div>

        <p className="mt-3 text-center text-[12px] text-[#71717A]">
          Simulated frontend authentication for demo preview — not production security.
        </p>
      </div>

      <div className="text-center text-[12px] text-[#A1A1AA]">
        Wyntro — Connect smarter. Convert faster.
      </div>
    </div>
  );
}
