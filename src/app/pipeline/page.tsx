"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  useDraggable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Plus,
  LayoutGrid,
  List,
  Search,
  GripVertical,
  Pencil,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar } from "@/components/ui/primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { AddLeadDrawer } from "@/components/leads/AddLeadDrawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { Lead, PipelineStage } from "@/types/crm";

function OpportunityCard({
  lead,
  repName,
  repColor,
  isOverlay = false,
}: {
  lead: Lead;
  repName: string;
  repColor: string;
  isOverlay?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: lead.id,
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      className={`rounded-[6px] border border-[#E4E4E7] bg-white p-3 transition-colors hover:border-[#D4D4D8] ${
        isDragging ? "opacity-40" : ""
      } ${isOverlay ? "shadow-[0_12px_28px_-8px_rgba(24,24,27,0.18)] border-[#635BFF]" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/leads/${lead.id}`}
          className="text-[13px] font-medium text-[#18181B] hover:text-[#635BFF] leading-[18px] truncate"
        >
          {lead.name}
        </Link>
        <button
          {...(isOverlay ? {} : listeners)}
          {...(isOverlay ? {} : attributes)}
          className="text-[#A1A1AA] hover:text-[#52525B] cursor-grab active:cursor-grabbing p-0.5 shrink-0"
          aria-label="Drag opportunity"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-[12px] text-[#71717A] truncate mt-0.5">{lead.company}</p>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#18181B] tabular-nums">
          {formatCurrency(lead.estimatedValue)}
        </span>
        <Badge
          variant={
            lead.priority === "hot"
              ? "error"
              : lead.priority === "high"
              ? "warning"
              : "default"
          }
          className="capitalize"
        >
          {lead.priority}
        </Badge>
      </div>

      <div className="mt-2.5 pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-[11px] text-[#71717A]">
        <span className="truncate">{lead.source}</span>
        <div className="flex items-center gap-1.5 shrink-0">
          <Avatar name={repName} color={repColor} size="sm" className="h-5 w-5 text-[9px]" />
          <span className="truncate max-w-[84px]">{repName}</span>
        </div>
      </div>
    </div>
  );
}

function StageColumn({
  stage,
  items,
  teamMap,
  onAddDeal,
  onRenameStage,
}: {
  stage: PipelineStage;
  items: Lead[];
  teamMap: Record<string, { name: string; color: string }>;
  onAddDeal: (stageId: string) => void;
  onRenameStage: (stage: PipelineStage) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id });
  const totalValue = items.reduce((sum, l) => sum + l.estimatedValue, 0);

  return (
    <div
      ref={setNodeRef}
      className={`flex w-[272px] shrink-0 flex-col rounded-[8px] border transition-colors ${
        isOver
          ? "border-[#635BFF] bg-[#EFEDFF]/30"
          : "border-[#E4E4E7] bg-[#F7F7F8]"
      }`}
    >
      <div className="px-3 py-2.5 border-b border-[#E4E4E7] bg-white rounded-t-[8px] sticky top-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2 w-2 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <span className="truncate text-[13px] font-semibold text-[#18181B]">
              {stage.name}
            </span>
            <span className="text-[11px] font-medium text-[#71717A] tabular-nums">
              {items.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onRenameStage(stage)}
              className="rounded-[4px] p-1 text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#18181B] cursor-pointer"
              title="Rename stage"
              aria-label={`Rename ${stage.name}`}
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              onClick={() => onAddDeal(stage.id)}
              className="rounded-[4px] p-1 text-[#A1A1AA] hover:bg-[#F4F4F5] hover:text-[#635BFF] cursor-pointer"
              title="Add opportunity"
              aria-label={`Add opportunity to ${stage.name}`}
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-0.5 text-[12px] font-medium text-[#71717A] tabular-nums">
          {formatCurrency(totalValue)}
        </p>
      </div>

      <div className="flex-1 p-2 space-y-2 min-h-[260px] max-h-[calc(100vh-280px)] overflow-y-auto">
        {items.map((lead) => {
          const rep = teamMap[lead.assignedTo] ?? {
            name: "Unassigned",
            color: "#A1A1AA",
          };
          return (
            <OpportunityCard
              key={lead.id}
              lead={lead}
              repName={rep.name}
              repColor={rep.color}
            />
          );
        })}
      </div>
    </div>
  );
}

export default function PipelinePage() {
  const {
    pipelines,
    activePipelineId,
    setActivePipelineId,
    leads,
    team,
    moveLeadStage,
    addPipelineStage,
    updatePipelineStage,
  } = useCrmStore();

  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [search, setSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [defaultStageId, setDefaultStageId] = useState("new-lead");
  const [newStageOpen, setNewStageOpen] = useState(false);
  const [newStageName, setNewStageName] = useState("");
  const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
  const [editStageName, setEditStageName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const activePipeline =
    pipelines.find((p) => p.id === activePipelineId) ?? pipelines[0];

  const teamMap = useMemo(() => {
    const map: Record<string, { name: string; color: string }> = {};
    team.forEach((m) => {
      map[m.id] = { name: m.name, color: m.avatarColor };
    });
    return map;
  }, [team]);

  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      if (l.pipelineId !== activePipeline.id) return false;
      if (ownerFilter && l.assignedTo !== ownerFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        if (
          !l.name.toLowerCase().includes(q) &&
          !l.company.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [leads, activePipeline.id, ownerFilter, search]);

  const activeLead = activeDragId
    ? filteredLeads.find((l) => l.id === activeDragId) ?? null
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;
    if (!over) return;
    const leadId = String(active.id);
    const toStageId = String(over.id);
    moveLeadStage(leadId, toStageId);
    const stageName =
      activePipeline.stages.find((s) => s.id === toStageId)?.name ?? toStageId;
    toast({ title: "Stage updated", description: `Moved opportunity to ${stageName}.` });
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Sales Pipeline"
          description="Drag opportunities across stages to update forecasts and timelines"
          actions={
            <>
              <select
                value={activePipeline.id}
                onChange={(e) => setActivePipelineId(e.target.value)}
                className="h-[30px] rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[12px] font-medium text-[#18181B]"
              >
                {pipelines.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setNewStageOpen(true)}
              >
                Add Stage
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setDefaultStageId("new-lead");
                  setAddOpen(true);
                }}
              >
                <Plus className="h-3.5 w-3.5" />
                New Opportunity
              </Button>
            </>
          }
        />

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter opportunities..."
                className="pl-8.5 h-9"
              />
            </div>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="h-9 rounded-[6px] border border-[#E4E4E7] bg-white px-2.5 text-[12px] text-[#18181B]"
            >
              <option value="">All Owners</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
            <button
              onClick={() => setViewMode("board")}
              className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[12px] font-medium cursor-pointer ${
                viewMode === "board"
                  ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                  : "text-[#71717A]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 rounded-[4px] px-2.5 py-1 text-[12px] font-medium cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                  : "text-[#71717A]"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              List
            </button>
          </div>
        </div>

        {/* Board vs List */}
        {viewMode === "board" ? (
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 overflow-x-auto pb-4">
              {activePipeline.stages.map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  items={filteredLeads.filter((l) => l.stageId === stage.id)}
                  teamMap={teamMap}
                  onAddDeal={(stageId) => {
                    setDefaultStageId(stageId);
                    setAddOpen(true);
                  }}
                  onRenameStage={(st) => {
                    setEditingStage(st);
                    setEditStageName(st.name);
                  }}
                />
              ))}
            </div>
            <DragOverlay>
              {activeLead ? (
                <OpportunityCard
                  lead={activeLead}
                  repName={teamMap[activeLead.assignedTo]?.name ?? "Unassigned"}
                  repColor={teamMap[activeLead.assignedTo]?.color ?? "#A1A1AA"}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="rounded-[8px] border border-[#E4E4E7] bg-white overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
                <tr>
                  <th className="px-4">Opportunity</th>
                  <th className="px-4">Stage</th>
                  <th className="px-4 text-right">Value</th>
                  <th className="px-4">Owner</th>
                  <th className="px-4">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {filteredLeads.map((l) => (
                  <tr key={l.id} className="h-12 hover:bg-[#F7F7F8]">
                    <td className="px-4">
                      <Link
                        href={`/leads/${l.id}`}
                        className="font-medium text-[#18181B] hover:text-[#635BFF]"
                      >
                        {l.name}
                      </Link>
                      <p className="text-[12px] text-[#71717A]">{l.company}</p>
                    </td>
                    <td className="px-4">
                      <select
                        value={l.stageId}
                        onChange={(e) => moveLeadStage(l.id, e.target.value)}
                        className="h-8 rounded-[6px] border border-[#E4E4E7] bg-white px-2 text-[12px]"
                      >
                        {activePipeline.stages.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 text-right font-medium text-[#18181B] tabular-nums">
                      {formatCurrency(l.estimatedValue)}
                    </td>
                    <td className="px-4 text-[#52525B]">
                      {teamMap[l.assignedTo]?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4">
                      <Badge variant="outline" className="capitalize">
                        {l.priority}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AddLeadDrawer
        open={addOpen}
        onOpenChange={setAddOpen}
        defaultStageId={defaultStageId}
      />

      <Dialog open={newStageOpen} onOpenChange={setNewStageOpen}>
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Create Pipeline Stage</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newStageName.trim()) return;
              addPipelineStage(activePipeline.id, {
                id: newStageName.toLowerCase().replace(/\s+/g, "-"),
                name: newStageName.trim(),
                color: "#635BFF",
              });
              setNewStageName("");
              setNewStageOpen(false);
              toast({ title: "Stage created" });
            }}
            className="space-y-4"
          >
            <Input
              placeholder="e.g. Security Review"
              value={newStageName}
              onChange={(e) => setNewStageName(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setNewStageOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Stage</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={Boolean(editingStage)}
        onOpenChange={(o) => !o && setEditingStage(null)}
      >
        <DialogContent className="max-w-[420px]">
          <DialogHeader>
            <DialogTitle>Rename Stage</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!editingStage || !editStageName.trim()) return;
              updatePipelineStage(
                activePipeline.id,
                editingStage.id,
                editStageName.trim()
              );
              setEditingStage(null);
              toast({ title: "Stage renamed" });
            }}
            className="space-y-4"
          >
            <Input
              value={editStageName}
              onChange={(e) => setEditStageName(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setEditingStage(null)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Name</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
