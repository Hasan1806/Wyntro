import { Suspense } from "react";
import { WorkflowBuilderClient } from "@/components/automations/WorkflowBuilderClient";

async function WorkflowLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WorkflowBuilderClient id={id} />;
}

export default function WorkflowBuilderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-[13px] text-[#667085]">
          Loading workflow builder...
        </div>
      }
    >
      <WorkflowLoader params={params} />
    </Suspense>
  );
}
