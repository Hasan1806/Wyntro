"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { useCrmStore } from "@/store/useCrmStore";
import type { LeadPriority, LeadSource } from "@/types/crm";

const leadSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z.string().min(6, "Valid phone number is required"),
  email: z.string().email("Valid email address is required"),
  company: z.string().min(1, "Company name is required"),
  source: z.string(),
  assignedTo: z.string(),
  stageId: z.string(),
  priority: z.enum(["hot", "high", "medium", "low"]),
  estimatedValue: z.coerce.number().min(0, "Value must be 0 or more"),
  tags: z.string(),
  notes: z.string(),
  city: z.string(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

interface AddLeadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultStageId?: string;
}

const LEAD_SOURCES: LeadSource[] = [
  "Website Form",
  "Facebook Ads",
  "Google Ads",
  "WhatsApp",
  "LinkedIn",
  "Referral",
  "Cold Outreach",
  "Manual",
];

export function AddLeadDrawer({
  open,
  onOpenChange,
  defaultStageId = "new-lead",
}: AddLeadDrawerProps) {
  const { team, pipelines, activePipelineId, addLead } = useCrmStore();
  const activePipeline =
    pipelines.find((p) => p.id === activePipelineId) ?? pipelines[0];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(leadSchema) as any,
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      company: "",
      source: "Website Form",
      assignedTo: team[0]?.id ?? "",
      stageId: defaultStageId,
      priority: "high",
      estimatedValue: 15000,
      tags: "Inbound",
      notes: "",
      city: "",
    },
  });

  const onSubmit = (values: LeadFormValues) => {
    const newLead = addLead({
      name: values.name,
      phone: values.phone,
      email: values.email,
      company: values.company,
      city: values.city || undefined,
      source: values.source as LeadSource,
      stageId: values.stageId,
      pipelineId: activePipeline.id,
      assignedTo: values.assignedTo,
      priority: values.priority as LeadPriority,
      score: values.priority === "hot" ? 88 : values.priority === "high" ? 75 : 58,
      estimatedValue: values.estimatedValue,
      tags: values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      groups: ["Inbound"],
      notes: values.notes,
      customFields: {},
      lastContactedAt: null,
      nextFollowUpAt: new Date(Date.now() + 86400000).toISOString(),
      consentOptIn: true,
    });

    toast({
      title: "Lead created",
      description: `${newLead.name} (${newLead.company}) added to ${activePipeline.name}.`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px]">
        <SheetHeader>
          <SheetTitle>Create New Lead</SheetTitle>
          <p className="text-[12px] text-[#667085]">
            Add a prospect directly into your Wyntro pipeline and activity feed.
          </p>
        </SheetHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Full Name *
              </label>
              <Input placeholder="e.g. Sophia Lindqvist" {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-[11px] text-[#F04438]">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Company *
              </label>
              <Input placeholder="e.g. NordicCloud AB" {...register("company")} />
              {errors.company && (
                <p className="mt-1 text-[11px] text-[#F04438]">
                  {errors.company.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Phone / WhatsApp *
              </label>
              <Input placeholder="+1 (415) 555-0192" {...register("phone")} />
              {errors.phone && (
                <p className="mt-1 text-[11px] text-[#F04438]">{errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Work Email *
              </label>
              <Input placeholder="name@company.com" {...register("email")} />
              {errors.email && (
                <p className="mt-1 text-[11px] text-[#F04438]">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Lead Source
              </label>
              <select
                {...register("source")}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#101828] focus:border-[#635BFF] focus:outline-none"
              >
                {LEAD_SOURCES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Assigned Representative
              </label>
              <select
                {...register("assignedTo")}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-3 text-[13px] text-[#101828] focus:border-[#635BFF] focus:outline-none"
              >
                <option value="">Unassigned</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Pipeline Stage
              </label>
              <select
                {...register("stageId")}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[13px] text-[#101828] focus:border-[#635BFF] focus:outline-none"
              >
                {activePipeline.stages.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Priority
              </label>
              <select
                {...register("priority")}
                className="h-9 w-full rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[13px] text-[#101828] focus:border-[#635BFF] focus:outline-none"
              >
                <option value="hot">Hot</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Est. Value ($)
              </label>
              <Input type="number" {...register("estimatedValue")} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                City
              </label>
              <Input placeholder="e.g. London, Indore" {...register("city")} />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-[#344054] mb-1">
                Tags (comma separated)
              </label>
              <Input placeholder="Enterprise, Q4 Priority" {...register("tags")} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-medium text-[#344054] mb-1">
              Initial Notes
            </label>
            <Textarea
              rows={3}
              placeholder="Context from discovery call, product interest, or next steps..."
              {...register("notes")}
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E4E7EC]">
            <Button
              type="button"
              variant="secondary"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Create Lead
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
