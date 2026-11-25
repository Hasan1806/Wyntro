"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  Search,
  Plus,
  Download,
  Upload,
  SlidersHorizontal,
  ArrowUpDown,
  Trash2,
  X,
  Eye,
  MoreHorizontal,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { AddLeadDrawer } from "@/components/leads/AddLeadDrawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrmStore } from "@/store/useCrmStore";
import { exportToCsv, formatCurrency } from "@/lib/utils";
import { toast } from "@/components/ui/toast";
import type { Lead } from "@/types/crm";

type SavedViewId =
  | "all"
  | "new"
  | "uncontacted"
  | "my"
  | "hot"
  | "unassigned"
  | "followup_due"
  | "converted"
  | "lost";

const SAVED_VIEWS: { id: SavedViewId; label: string }[] = [
  { id: "all", label: "All leads" },
  { id: "new", label: "New leads" },
  { id: "uncontacted", label: "Uncontacted" },
  { id: "my", label: "My leads" },
  { id: "hot", label: "Hot leads" },
  { id: "unassigned", label: "Unassigned" },
  { id: "followup_due", label: "Follow-up due" },
  { id: "converted", label: "Converted" },
  { id: "lost", label: "Lost" },
];

export default function LeadsPage() {
  const {
    leads,
    team,
    pipelines,
    currentUserId,
    bulkUpdateLeads,
    deleteLeads,
    addLead,
  } = useCrmStore();

  const [savedView, setSavedView] = useState<SavedViewId>("all");
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showColumns, setShowColumns] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const stages = pipelines[0].stages;

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (savedView === "new" && lead.stageId !== "new-lead") return false;
      if (savedView === "uncontacted" && lead.lastContactedAt !== null) return false;
      if (savedView === "my" && lead.assignedTo !== currentUserId) return false;
      if (savedView === "hot" && lead.priority !== "hot") return false;
      if (savedView === "unassigned" && lead.assignedTo !== "") return false;
      if (savedView === "followup_due" && !lead.nextFollowUpAt) return false;
      if (savedView === "converted" && lead.stageId !== "closed-won") return false;
      if (savedView === "lost" && lead.stageId !== "closed-lost") return false;

      if (sourceFilter && lead.source !== sourceFilter) return false;
      if (stageFilter && lead.stageId !== stageFilter) return false;
      if (ownerFilter && lead.assignedTo !== ownerFilter) return false;
      if (priorityFilter && lead.priority !== priorityFilter) return false;
      if (groupFilter && !lead.groups.includes(groupFilter)) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const match =
          lead.name.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [
    leads,
    savedView,
    currentUserId,
    sourceFilter,
    stageFilter,
    ownerFilter,
    priorityFilter,
    groupFilter,
    search,
  ]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (sourceFilter)
      chips.push({ key: "source", label: `Source: ${sourceFilter}`, clear: () => setSourceFilter("") });
    if (stageFilter)
      chips.push({
        key: "stage",
        label: `Stage: ${stages.find((s) => s.id === stageFilter)?.name ?? stageFilter}`,
        clear: () => setStageFilter(""),
      });
    if (ownerFilter)
      chips.push({
        key: "owner",
        label: `Owner: ${team.find((t) => t.id === ownerFilter)?.name ?? ownerFilter}`,
        clear: () => setOwnerFilter(""),
      });
    if (priorityFilter)
      chips.push({ key: "priority", label: `Priority: ${priorityFilter}`, clear: () => setPriorityFilter("") });
    if (groupFilter)
      chips.push({ key: "group", label: `Group: ${groupFilter}`, clear: () => setGroupFilter("") });
    return chips;
  }, [sourceFilter, stageFilter, ownerFilter, priorityFilter, groupFilter, stages, team]);

  const columns = useMemo<ColumnDef<Lead>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(v) => table.toggleAllPageRowsSelected(Boolean(v))}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => row.toggleSelected(Boolean(v))}
            aria-label={`Select ${row.original.name}`}
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: "Client Name",
        cell: ({ row }) => (
          <div>
            <Link
              href={`/leads/${row.original.id}`}
              className="font-medium text-[#101828] hover:text-[#635BFF]"
            >
              {row.original.name}
            </Link>
            <p className="text-[12px] text-[#667085]">{row.original.company}</p>
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <span className="text-[#344054] tabular-nums whitespace-nowrap">
            {row.original.phone}
          </span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => (
          <span className="text-[#667085]">{row.original.email}</span>
        ),
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => <Badge variant="outline">{row.original.source}</Badge>,
      },
      {
        accessorKey: "stageId",
        header: "Sales Stage",
        cell: ({ row }) => {
          const st = stages.find((s) => s.id === row.original.stageId);
          return (
            <span className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#344054]">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: st?.color ?? "#635BFF" }}
              />
              {st?.name ?? row.original.stageId}
            </span>
          );
        },
      },
      {
        accessorKey: "assignedTo",
        header: "Assigned Rep",
        cell: ({ row }) => {
          const rep = team.find((t) => t.id === row.original.assignedTo);
          return rep ? (
            <span className="text-[#344054]">{rep.name}</span>
          ) : (
            <Badge variant="warning">Unassigned</Badge>
          );
        },
      },
      {
        accessorKey: "score",
        header: "Score / Priority",
        cell: ({ row }) => {
          const p = row.original.priority;
          const variant =
            p === "hot" ? "error" : p === "high" ? "warning" : p === "medium" ? "info" : "default";
          return (
            <div className="flex items-center gap-1.5">
              <span className="font-semibold tabular-nums text-[#101828]">
                {row.original.score}
              </span>
              <Badge variant={variant} className="capitalize">
                {p}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: "lastContactedAt",
        header: "Last Contacted",
        cell: ({ row }) => (
          <span className="text-[12px] text-[#667085] tabular-nums">
            {row.original.lastContactedAt
              ? row.original.lastContactedAt.slice(0, 10)
              : "Never"}
          </span>
        ),
      },
      {
        accessorKey: "nextFollowUpAt",
        header: "Next Follow-up",
        cell: ({ row }) => (
          <span className="text-[12px] text-[#667085] tabular-nums">
            {row.original.nextFollowUpAt
              ? row.original.nextFollowUpAt.slice(0, 10)
              : "—"}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: ({ row }) => (
          <span className="text-[12px] text-[#98A2B3] tabular-nums">
            {row.original.createdAt.slice(0, 10)}
          </span>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            href={`/leads/${row.original.id}`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-[6px] text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828]"
            title="Open Lead Profile"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Link>
        ),
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [stages, team]
  );

  const table = useReactTable({
    data: filteredLeads,
    columns,
    getRowId: (row) => row.id,
    state: { sorting, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const selectedIds = Object.keys(rowSelection).filter((k) => rowSelection[k]);

  const handleCsvExport = () => {
    exportToCsv(
      "wyntro-leads.csv",
      filteredLeads.map((l) => ({
        Name: l.name,
        Company: l.company,
        Phone: l.phone,
        Email: l.email,
        Source: l.source,
        Stage: l.stageId,
        Value: formatCurrency(l.estimatedValue),
        Priority: l.priority,
        Created: l.createdAt.slice(0, 10),
      }))
    );
    toast({ title: "CSV Exported", description: `${filteredLeads.length} leads exported.` });
  };

  const handleSimulatedImport = () => {
    addLead({
      name: "Nadia Al-Mansoor",
      phone: "+971 52 901 3344",
      email: "nadia@oasisventures.ae",
      company: "Oasis Ventures",
      city: "Dubai",
      source: "Manual",
      stageId: "new-lead",
      pipelineId: "pipe-main",
      assignedTo: "tm-1",
      priority: "high",
      score: 79,
      estimatedValue: 26000,
      tags: ["CSV Import"],
      groups: ["EMEA"],
      notes: "Imported via CSV preview demo.",
      customFields: {},
      lastContactedAt: null,
      nextFollowUpAt: "2026-11-26T10:00:00Z",
      consentOptIn: true,
    });
    setImportOpen(false);
    toast({ title: "CSV Import Simulated", description: "Added Nadia Al-Mansoor from sample CSV." });
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Leads
            </h1>
            <p className="text-[13px] text-[#667085]">
              {filteredLeads.length} matching records across your active pipelines
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" size="sm" onClick={() => setImportOpen(true)}>
              <Upload className="h-3.5 w-3.5" />
              Import CSV
            </Button>
            <Button variant="secondary" size="sm" onClick={handleCsvExport}>
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Saved Views Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {SAVED_VIEWS.map((view) => (
            <button
              key={view.id}
              onClick={() => setSavedView(view.id)}
              className={`rounded-[8px] px-3 py-1.5 text-[12px] font-medium whitespace-nowrap transition-colors cursor-pointer ${
                savedView === view.id
                  ? "bg-[#635BFF] text-white"
                  : "bg-white border border-[#E4E7EC] text-[#667085] hover:text-[#101828]"
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        {/* Search + Filter & Column Controls */}
        <div className="rounded-[10px] border border-[#E4E7EC] bg-white p-3.5 space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, company, email, or phone..."
                className="pl-9"
              />
            </div>

            <div className="flex items-center gap-2 relative">
              <Button
                variant={showFilters ? "soft" : "secondary"}
                size="sm"
                onClick={() => setShowFilters((s) => !s)}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filters
                {activeChips.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#635BFF] px-1.5 text-[10px] text-white">
                    {activeChips.length}
                  </span>
                )}
              </Button>

              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowColumns((s) => !s)}
                >
                  <Eye className="h-3.5 w-3.5" />
                  Columns
                </Button>
                {showColumns && (
                  <div className="absolute right-0 top-full z-30 mt-1.5 w-48 rounded-[8px] border border-[#E4E7EC] bg-white p-2 shadow-lg space-y-1.5">
                    {table
                      .getAllLeafColumns()
                      .filter((c) => c.getCanHide())
                      .map((col) => (
                        <label
                          key={col.id}
                          className="flex items-center gap-2 text-[12px] text-[#344054] cursor-pointer px-1 py-0.5 hover:bg-[#F8F9FC] rounded"
                        >
                          <Checkbox
                            checked={col.getIsVisible()}
                            onCheckedChange={(v) => col.toggleVisibility(Boolean(v))}
                          />
                          <span className="capitalize">
                            {typeof col.columnDef.header === "string"
                              ? col.columnDef.header
                              : col.id}
                          </span>
                        </label>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Filter Builder */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2 border-t border-[#E4E7EC]">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[12px]"
              >
                <option value="">All Sources</option>
                {[
                  "Facebook Ads",
                  "Google Ads",
                  "Website Form",
                  "WhatsApp",
                  "LinkedIn",
                  "Referral",
                  "Cold Outreach",
                  "Manual",
                ].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[12px]"
              >
                <option value="">All Stages</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

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

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[12px]"
              >
                <option value="">All Priorities</option>
                <option value="hot">Hot</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="h-9 rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 text-[12px]"
              >
                <option value="">All Groups</option>
                {["VIP Accounts", "EMEA", "APAC", "North America", "High Intent"].map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Active Filter Chips */}
          {activeChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1 rounded-full bg-[#EFEDFF] px-2.5 py-1 text-[11px] font-medium text-[#635BFF]"
                >
                  {chip.label}
                  <button onClick={chip.clear} className="hover:text-[#101828] cursor-pointer">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#635BFF]/30 bg-[#EFEDFF] px-4 py-2.5">
            <span className="text-[13px] font-medium text-[#101828]">
              {selectedIds.length} lead(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <select
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  bulkUpdateLeads(selectedIds, { assignedTo: e.target.value });
                  toast({ title: "Bulk assigned", description: `Updated ${selectedIds.length} leads.` });
                  setRowSelection({});
                }}
                className="h-8 rounded-[6px] border border-[#D0D5DD] bg-white px-2 text-[12px]"
              >
                <option value="">Assign Rep...</option>
                {team.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                defaultValue=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  bulkUpdateLeads(selectedIds, { stageId: e.target.value });
                  toast({ title: "Bulk stage updated" });
                  setRowSelection({});
                }}
                className="h-8 rounded-[6px] border border-[#D0D5DD] bg-white px-2 text-[12px]"
              >
                <option value="">Move Stage...</option>
                {stages.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteConfirmOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="rounded-[10px] border border-[#E4E7EC] bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead className="border-b border-[#E4E7EC] bg-[#F8F9FC] text-[12px] font-medium text-[#667085]">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((header) => (
                      <th key={header.id} className="px-3.5 py-2.5 whitespace-nowrap">
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            onClick={header.column.getToggleSortingHandler()}
                            className="inline-flex items-center gap-1 hover:text-[#101828] cursor-pointer"
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <ArrowUpDown className="h-3 w-3 text-[#98A2B3]" />
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-[#E4E7EC]">
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="px-4 py-10 text-center text-[#667085]">
                      No leads match your current view and filters.
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="hover:bg-[#F8F9FC] transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-3.5 py-3 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-[#E4E7EC] px-4 py-3 text-[12px] text-[#667085]">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.max(1, table.getPageCount())}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AddLeadDrawer open={addOpen} onOpenChange={setAddOpen} />

      {/* CSV Import Preview Modal */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>CSV Import Preview (Demo)</DialogTitle>
            <DialogDescription>
              Preview column mapping before importing leads into Wyntro.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-3 text-[12px] space-y-1.5">
            <p className="font-medium text-[#101828]">Sample Row Detected:</p>
            <p className="text-[#667085]">
              Name: Nadia Al-Mansoor • Company: Oasis Ventures • Email: nadia@oasisventures.ae
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSimulatedImport}>Confirm Demo Import</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {selectedIds.length} lead(s)?</DialogTitle>
            <DialogDescription>
              This removes the selected records and their scheduled follow-ups from your local demo state.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                deleteLeads(selectedIds);
                setRowSelection({});
                setDeleteConfirmOpen(false);
                toast({ title: "Leads deleted" });
              }}
            >
              Delete Leads
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
