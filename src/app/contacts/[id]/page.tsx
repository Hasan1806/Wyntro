import { Suspense } from "react";
import { ClientProfileWorkspace } from "@/components/leads/ClientProfileWorkspace";

async function ContactProfileLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ClientProfileWorkspace id={id} />;
}

export default function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-[13px] text-[#667085]">
          Loading contact profile...
        </div>
      }
    >
      <ContactProfileLoader params={params} />
    </Suspense>
  );
}
