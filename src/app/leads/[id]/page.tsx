import { Suspense } from "react";
import { ClientProfileWorkspace } from "@/components/leads/ClientProfileWorkspace";

async function LeadProfileLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientProfileWorkspace id={id} />;
}

export default function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-[13px] text-[#667085]">
          Loading client profile...
        </div>
      }
    >
      <LeadProfileLoader params={params} />
    </Suspense>
  );
}
