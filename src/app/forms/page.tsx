"use client";

import { useState } from "react";
import {
  Plus,
  Trash2,
  Monitor,
  Smartphone,
  QrCode,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useCrmStore } from "@/store/useCrmStore";
import { uid } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { FormFieldConfig, FormFieldType } from "@/types/crm";

const FIELD_PALETTE: { type: FormFieldType; label: string }[] = [
  { type: "full_name", label: "Full Name" },
  { type: "email", label: "Email" },
  { type: "phone", label: "Phone Number" },
  { type: "text", label: "Text" },
  { type: "long_text", label: "Long Text" },
  { type: "number", label: "Number" },
  { type: "dropdown", label: "Dropdown" },
  { type: "multiple_choice", label: "Multiple Choice" },
  { type: "checkbox", label: "Checkbox" },
  { type: "date", label: "Date" },
  { type: "consent", label: "Consent" },
];

export default function FormsBuilderPage() {
  const { forms, updateForm, submitDemoForm } = useCrmStore();
  const activeForm = forms[0];

  const [selectedFieldId, setSelectedFieldId] = useState(
    activeForm.fields[0]?.id ?? ""
  );
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [demoValues, setDemoValues] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const selectedField = activeForm.fields.find((f) => f.id === selectedFieldId);

  const addField = (type: FormFieldType, label: string) => {
    const newField: FormFieldConfig = {
      id: uid("f"),
      type,
      label,
      placeholder: `Enter ${label.toLowerCase()}`,
      required: type === "email" || type === "full_name",
      options:
        type === "dropdown" || type === "multiple_choice"
          ? ["Option A", "Option B"]
          : undefined,
      step: 1,
    };
    updateForm(activeForm.id, { fields: [...activeForm.fields, newField] });
    setSelectedFieldId(newField.id);
  };

  const moveField = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= activeForm.fields.length) return;
    const copy = [...activeForm.fields];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    updateForm(activeForm.id, { fields: copy });
  };

  const updateSelectedField = (patch: Partial<FormFieldConfig>) => {
    if (!selectedField) return;
    updateForm(activeForm.id, {
      fields: activeForm.fields.map((f) =>
        f.id === selectedField.id ? { ...f, ...patch } : f
      ),
    });
  };

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mapped: Record<string, string> = {};
    activeForm.fields.forEach((f) => {
      mapped[f.type] = demoValues[f.id] || f.placeholder || "";
    });
    const created = submitDemoForm(activeForm.id, {
      full_name: mapped.full_name || demoValues[activeForm.fields[0]?.id] || "Demo Form Lead",
      email: mapped.email || "lead@demoform.io",
      phone: mapped.phone || "+1 (555) 234-5678",
      company: mapped.text || "Demo Web Company",
    });
    setSubmitted(true);
    toast({
      title: "Demo form submitted",
      description: `${created.name} was added to your Leads table.`,
    });
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Lead Form Builder"
          description={`${activeForm.name} · ${activeForm.submissions} submissions (${activeForm.conversionRate}% conv)`}
          actions={
            <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
              <button
                onClick={() => setDevice("desktop")}
                className={`rounded-[4px] px-2.5 py-1 text-[12px] font-medium flex items-center gap-1 cursor-pointer ${
                  device === "desktop"
                    ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                    : "text-[#71717A]"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" /> Desktop
              </button>
              <button
                onClick={() => setDevice("mobile")}
                className={`rounded-[4px] px-2.5 py-1 text-[12px] font-medium flex items-center gap-1 cursor-pointer ${
                  device === "mobile"
                    ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                    : "text-[#71717A]"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" /> Mobile
              </button>
            </div>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          <Card className="lg:col-span-3 p-4 space-y-2.5">
            <p className="text-[11px] font-medium text-[#71717A]">
              Field Components
            </p>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-1.5">
              {FIELD_PALETTE.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addField(item.type, item.label)}
                  className="flex items-center justify-between rounded-[6px] border border-[#E4E4E7] px-2.5 py-1.5 text-[12px] font-medium text-[#18181B] hover:bg-[#F7F7F8] hover:border-[#D4D4D8] cursor-pointer"
                >
                  <span>{item.label}</span>
                  <Plus className="h-3.5 w-3.5 text-[#71717A]" />
                </button>
              ))}
            </div>
          </Card>

          <div className="lg:col-span-6 flex justify-center">
            <Card
              className={`p-6 transition-all w-full ${
                device === "mobile" ? "max-w-[380px]" : "max-w-full"
              }`}
            >
              <div
                className="h-1 w-12 rounded-full mb-4"
                style={{ backgroundColor: activeForm.brandColor }}
              />
              <h2 className="text-[16px] font-semibold text-[#18181B]">
                {activeForm.name}
              </h2>
              <p className="text-[12px] text-[#71717A] mt-0.5 mb-5">
                {activeForm.description}
              </p>

              {submitted ? (
                <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F0FDF4] p-5 text-center space-y-2">
                  <CheckCircle2 className="h-6 w-6 text-[#16A34A] mx-auto" />
                  <p className="text-[13px] font-medium text-[#15803D]">
                    {activeForm.successMessage}
                  </p>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSubmitted(false)}
                  >
                    Reset Demo Form
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleDemoSubmit} className="space-y-3">
                  {activeForm.fields.map((field, idx) => (
                    <div
                      key={field.id}
                      onClick={() => setSelectedFieldId(field.id)}
                      className={`rounded-[6px] border p-3 transition-colors cursor-pointer ${
                        selectedFieldId === field.id
                          ? "border-[#635BFF] bg-[#EFEDFF]/20"
                          : "border-[#E4E4E7] hover:border-[#D4D4D8]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-[12px] font-medium text-[#18181B]">
                          {field.label} {field.required && <span className="text-[#DC2626]">*</span>}
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            aria-label="Move up"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(idx, -1);
                            }}
                            className="p-0.5 text-[#A1A1AA] hover:text-[#18181B]"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            aria-label="Move down"
                            onClick={(e) => {
                              e.stopPropagation();
                              moveField(idx, 1);
                            }}
                            className="p-0.5 text-[#A1A1AA] hover:text-[#18181B]"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            aria-label="Delete field"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateForm(activeForm.id, {
                                fields: activeForm.fields.filter((f) => f.id !== field.id),
                              });
                            }}
                            className="p-0.5 text-[#A1A1AA] hover:text-[#DC2626]"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {field.type === "dropdown" ? (
                        <select className="h-[38px] w-full rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[13px]">
                          {(field.options ?? ["Option 1"]).map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      ) : field.type === "consent" || field.type === "checkbox" ? (
                        <div className="flex items-center gap-2 text-[12px] text-[#52525B]">
                          <Checkbox defaultChecked={field.type === "consent"} />
                          <span>Confirmed</span>
                        </div>
                      ) : (
                        <Input
                          placeholder={field.placeholder}
                          value={demoValues[field.id] ?? ""}
                          onChange={(e) =>
                            setDemoValues((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                  <Button
                    type="submit"
                    className="w-full"
                    style={{ backgroundColor: activeForm.brandColor }}
                  >
                    Submit Demo Form (Creates Lead)
                  </Button>
                </form>
              )}
            </Card>
          </div>

          <Card className="lg:col-span-3 p-4 space-y-4">
            <div>
              <p className="text-[11px] font-medium text-[#71717A]">
                Field Settings
              </p>
              {selectedField ? (
                <div className="mt-3 space-y-3">
                  <div>
                    <label className="block text-[12px] font-medium text-[#18181B] mb-1">
                      Label
                    </label>
                    <Input
                      value={selectedField.label}
                      onChange={(e) =>
                        updateSelectedField({ label: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-[12px] font-medium text-[#18181B] mb-1">
                      Placeholder
                    </label>
                    <Input
                      value={selectedField.placeholder}
                      onChange={(e) =>
                        updateSelectedField({ placeholder: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#52525B]">Required</span>
                    <Switch
                      checked={selectedField.required}
                      onCheckedChange={(v) => updateSelectedField({ required: v })}
                    />
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-[12px] text-[#71717A]">
                  Click a field in the canvas to edit it.
                </p>
              )}
            </div>

            <div className="border-t border-[#E4E4E7] pt-4 space-y-3">
              <p className="text-[11px] font-medium text-[#71717A]">
                Branding & Share (Simulated)
              </p>
              <div>
                <label className="block text-[12px] font-medium text-[#18181B] mb-1">
                  Accent Color
                </label>
                <Input
                  type="color"
                  value={activeForm.brandColor}
                  onChange={(e) =>
                    updateForm(activeForm.id, { brandColor: e.target.value })
                  }
                  className="h-9 p-1 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#52525B]">Multi-step mode</span>
                <Switch
                  checked={activeForm.isMultiStep}
                  onCheckedChange={(v) =>
                    updateForm(activeForm.id, { isMultiStep: v })
                  }
                />
              </div>
              <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-2.5 flex items-center gap-2.5">
                <QrCode className="h-8 w-8 text-[#18181B] shrink-0" />
                <div className="text-[11px] text-[#52525B] min-w-0">
                  <p className="font-medium text-[#18181B]">Simulated Public Link</p>
                  <p className="truncate">demo.wyntro.local/f/{activeForm.id}</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
