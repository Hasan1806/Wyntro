"use client";

import { useMemo, useState } from "react";
import {
  LayoutGrid,
  List,
  Search,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Video,
  Globe,
  Share2,
  Trash2,
  Copy,
  Eye,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCrmStore } from "@/store/useCrmStore";
import { toast } from "@/components/ui/toast";
import type { ContentItem } from "@/types/crm";

export default function ContentLibraryPage() {
  const { contentItems, addContentItem, deleteContentItem } = useCrmStore();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [folder, setFolder] = useState("All");
  const [dragging, setDragging] = useState(false);
  const [previewItem, setPreviewItem] = useState<ContentItem | null>(null);

  const folders = useMemo(
    () => ["All", ...Array.from(new Set(contentItems.map((c) => c.folder)))],
    [contentItems]
  );

  const filtered = useMemo(() => {
    return contentItems.filter((c) => {
      if (folder !== "All" && c.folder !== folder) return false;
      if (search.trim() && !c.title.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [contentItems, folder, search]);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      const isVideo = file.type.startsWith("video/");
      addContentItem({
        title: file.name,
        type: isImage ? "image" : isVideo ? "video" : "document",
        folder: folder === "All" ? "Uploaded (Local Demo)" : folder,
        sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB • Local`,
        url: URL.createObjectURL(file),
        views: 0,
        shares: 0,
        avgReadTime: "0m 00s",
        previewText: "Local browser preview file (not uploaded to cloud storage).",
      });
    });
    toast({
      title: "File added to local preview",
      description: "Demo mode: stored locally in browser memory.",
    });
  };

  const getIcon = (type: ContentItem["type"]) => {
    if (type === "image") return <ImageIcon className="h-5 w-5 text-[#2E90FA]" />;
    if (type === "video") return <Video className="h-5 w-5 text-[#F79009]" />;
    if (type === "sales_page" || type === "link")
      return <Globe className="h-5 w-5 text-[#12B76A]" />;
    return <FileText className="h-5 w-5 text-[#635BFF]" />;
  };

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Content Library
            </h1>
            <p className="text-[13px] text-[#667085]">
              Manage brochures, decks, videos, and shareable sales pages with simulated engagement metrics
            </p>
          </div>
          <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-[8px] bg-[#635BFF] px-3.5 text-[13px] font-medium text-white hover:bg-[#5148E5]">
            <UploadCloud className="h-4 w-4" />
            Upload File (Local Demo)
            <input
              type="file"
              className="hidden"
              multiple
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            handleFiles(e.dataTransfer.files);
          }}
          className={`rounded-[10px] border-2 border-dashed p-4 text-center text-[13px] transition-colors ${
            dragging
              ? "border-[#635BFF] bg-[#EFEDFF]/50 text-[#635BFF]"
              : "border-[#E4E7EC] bg-white text-[#667085]"
          }`}
        >
          Drag & drop documents, brochures, or images here for instant local preview (cloud storage is disabled in frontend demo).
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content..."
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`rounded-[8px] px-3 py-1.5 text-[12px] font-medium cursor-pointer ${
                    folder === f
                      ? "bg-[#635BFF] text-white"
                      : "bg-white border border-[#E4E7EC] text-[#667085]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="inline-flex rounded-[8px] border border-[#E4E7EC] bg-white p-0.5">
            <button
              onClick={() => setView("grid")}
              className={`rounded-[6px] p-1.5 cursor-pointer ${
                view === "grid" ? "bg-[#EFEDFF] text-[#635BFF]" : "text-[#667085]"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`rounded-[6px] p-1.5 cursor-pointer ${
                view === "list" ? "bg-[#EFEDFF] text-[#635BFF]" : "text-[#667085]"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#F8F9FC] border border-[#E4E7EC]">
                      {getIcon(item.type)}
                    </div>
                    <Badge variant="outline">{item.folder}</Badge>
                  </div>
                  <h3 className="mt-3 text-[14px] font-semibold text-[#101828]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-[#667085]">{item.sizeLabel}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-[12px]">
                  <span className="text-[#667085] tabular-nums">
                    {item.views} views • {item.shares} shares (Sim)
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPreviewItem(item)}
                      title="Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.url);
                        toast({
                          title: "Simulated share link copied",
                          description: item.url,
                          variant: "info",
                        });
                      }}
                      title="Copy simulated link"
                    >
                      <Share2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        addContentItem({
                          ...item,
                          title: `${item.title} (Copy)`,
                        });
                        toast({ title: "Duplicated item" });
                      }}
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => {
                        deleteContentItem(item.id);
                        toast({ title: "Item removed" });
                      }}
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#F04438]" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="divide-y divide-[#E4E7EC]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {getIcon(item.type)}
                  <div>
                    <p className="text-[13px] font-medium text-[#101828]">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#667085]">
                      {item.folder} • {item.sizeLabel}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[12px] text-[#667085]">
                  <span className="tabular-nums">{item.views} views (Sim)</span>
                  <Button size="sm" variant="secondary" onClick={() => setPreviewItem(item)}>
                    Preview
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>

      <Dialog
        open={Boolean(previewItem)}
        onOpenChange={(o) => !o && setPreviewItem(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{previewItem?.title}</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-3 text-[13px]">
              <p className="text-[#667085]">{previewItem.previewText}</p>
              <div className="rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-3 text-[12px] space-y-1">
                <p>Simulated Views: <strong>{previewItem.views}</strong></p>
                <p>Simulated Avg Read Time: <strong>{previewItem.avgReadTime}</strong></p>
                <p>Simulated Link: <span className="text-[#635BFF]">{previewItem.url}</span></p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
