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
import { formatCurrency, getInitials } from "@/lib/utils";
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
      className={`rounded-[8px] border border-[#E4E7EC] bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-shadow hover:border-[#D0D5DD] ${
        isDragging ? "opacity-40" : ""
      } ${isOverlay ? "shadow-xl rotate-[1deg] border-[#635BFF]" : ""}`}
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/leads/${lead.id}`}
          className="text-[13px] font-semibold text-[#101828] hover:text-[#635BFF] leading-snug"
        >
          {lead.name}
        </Link>
        <button
          {...(isOverlay ? {} : listeners)}
          {...(isOverlay ? {} : attributes)}
          className="text-[#98A2B3] hover:text-[#344054] cursor-grab active:cursor-grabbing p-0.5"
          aria-label="Drag opportunity"
        >
          <GripVertical className="h-3.5 w-3.5" />
        </button>
      </div>
      <p className="text-[12px] text-[#667085] mt-0.5">{lead.company}</p>

      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#101828] tabular-nums">
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

      <div className="mt-2.5 pt-2 border-t border-[#E4E7EC] flex items-center justify-between text-[11px] text-[#667085]">
        <span>{lead.source}</span>
        <div className="flex items-center gap-1.5">
          <span
            className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
            style={{ backgroundColor: repColor }}
          >
            {getInitials(repName)}
          </span>
          <span className="truncate max-w-[80px]">{repName}</span>
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
      className={`flex w-[290px] shrink-0 flex-col rounded-[10px] border bg-[#F8F9FC] transition-colors ${
        isOver ? "border-[#635BFF] bg-[#EFEDFF]/40" : "border-[#E4E7EC]"
      }`}
    >
      <div className="p-3 border-b border-[#E4E7EC] bg-white rounded-t-[10px]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: stage.color }}
            />
            <span className="truncate text-[13px] font-semibold text-[#101828]">
              {stage.name}
            </span>
            <span className="rounded-full bg-[#F2F4F7] px-1.5 py-0.5 text-[11px] font-medium text-[#667085] tabular-nums">
              {items.length}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => onRenameStage(stage)}
              className="rounded p-1 text-[#98A2B3] hover:bg-[#F2F4F7] hover:text-[#101828] cursor-pointer"
              title="Rename stage"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => onAddDeal(stage.id)}
              className="rounded p-1 text-[#98A2B3] hover:bg-[#F2F4F7] hover:text-[#635BFF] cursor-pointer"
              title="Add opportunity"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <p className="mt-1 text-[12px] font-medium text-[#667085] tabular-nums">
          {formatCurrency(totalValue)}
        </p>
      </div>

      <div className="flex-1 p-2.5 space-y-2.5 min-h-[260px] max-h-[calc(100vh-290px)] overflow-y-auto">
        {items.map((lead) => {
          const rep = teamMap[lead.assignedTo] ?? {
            name: "Unassigned",
            color: "#98A2B3",
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Sales Pipeline
            </h1>
            <p className="text-[13px] text-[#667085]">
              Drag opportunities across stages to update forecasts and client timelines
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={activePipeline.id}
              onChange={(e) => setActivePipelineId(e.target.value)}
              className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-3 text-[13px] font-medium text-[#101828]"
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
              + Stage
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
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#E4E7EC] bg-white p-3">
          <div className="flex flex-wrap items-center gap-2 flex-1">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter opportunities..."
                className="pl-9"
              />
            </div>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[12px]"
            >
              <option value="">All Owners</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          <div className="inline-flex rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-0.5">
            <button
              onClick={() => setViewMode("board")}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium cursor-pointer ${
                viewMode === "board"
                  ? "bg-white text-[#101828] shadow-xs"
                  : "text-[#667085]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-1.5 rounded-[6px] px-2.5 py-1 text-[12px] font-medium cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-[#101828] shadow-xs"
                  : "text-[#667085]"
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
            <div className="flex gap-3.5 overflow-x-auto pb-4">
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
                  repColor={teamMap[activeLead.assignedTo]?.color ?? "#98A2B3"}
                  isOverlay
                />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <div className="rounded-[10px] border border-[#E4E7EC] bg-white overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="border-b border-[#E4E7EC] bg-[#F8F9FC] text-[12px] font-medium text-[#667085]">
                <tr>
                  <th className="px-4 py-2.5">Opportunity</th>
                  <th className="px-4 py-2.5">Stage</th>
                  <th className="px-4 py-2.5">Value</th>
                  <th className="px-4 py-2.5">Owner</th>
                  <th className="px-4 py-2.5">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {filteredLeads.map((l) => (
                  <tr key={l.id} className="hover:bg-[#F8F9FC]">
                    <td className="px-4 py-3">
                      <Link
                        href={`/leads/${l.id}`}
                        className="font-medium text-[#101828] hover:text-[#635BFF]"
                      >
                        {l.name}
                      </Link>
                      <p className="text-[12px] text-[#667085]">{l.company}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={l.stageId}
                        onChange={(e) => moveLeadStage(l.id, e.target.value)}
                        className="h-8 rounded-[6px] border border-[#E4E7EC] bg-white px-2 text-[12px]"
                      >
                        {activePipeline.stages.map((st) => (
                          <option key={st.id} value={st.id}>
                            {st.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 font-semibold tabular-nums">
                      {formatCurrency(l.estimatedValue)}
                    </td>
                    <td className="px-4 py-3 text-[#344054]">
                      {teamMap[l.assignedTo]?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-3">
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

      {/* Add Stage Dialog */}
      <Dialog open={newStageOpen} onOpenChange={setNewStageOpen}>
        <DialogContent>
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

      {/* Rename Stage Dialog */}
      <Dialog
        open={Boolean(editingStage)}
        onOpenChange={(o) => !o && setEditingStage(null)}
      >
        <DialogContent>
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
