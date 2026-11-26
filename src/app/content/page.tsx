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
import { PageHeader } from "@/components/ui/page-header";
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
  const [view, setView] = useState<"grid" | "list">("list");
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
        sizeLabel: `${Math.max(1, Math.round(file.size / 1024))} KB · Local`,
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
    if (type === "image") return <ImageIcon className="h-4 w-4 text-[#52525B]" />;
    if (type === "video") return <Video className="h-4 w-4 text-[#52525B]" />;
    if (type === "sales_page" || type === "link")
      return <Globe className="h-4 w-4 text-[#52525B]" />;
    return <FileText className="h-4 w-4 text-[#52525B]" />;
  };

  return (
    <AppShell>
      <div className="space-y-4">
        <PageHeader
          title="Content Library"
          description="Brochures, decks, videos, and shareable sales pages"
          actions={
            <label className="inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-[6px] bg-[#635BFF] px-3 text-[12px] font-medium text-white hover:bg-[#5148E5] transition-colors">
              <UploadCloud className="h-3.5 w-3.5" />
              Upload (Local Demo)
              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => handleFiles(e.target.files)}
              />
            </label>
          }
        />

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
          className={`rounded-[8px] border border-dashed px-4 py-3 text-center text-[12px] transition-colors ${
            dragging
              ? "border-[#635BFF] bg-[#EFEDFF]/40 text-[#5148E5]"
              : "border-[#D4D4D8] bg-white text-[#71717A]"
          }`}
        >
          Drag and drop documents or images here for local browser preview (cloud storage is simulated).
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#A1A1AA]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search content..."
                className="pl-8.5 h-9"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => setFolder(f)}
                  className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium cursor-pointer transition-colors ${
                    folder === f
                      ? "bg-[#18181B] text-white"
                      : "bg-white border border-[#E4E4E7] text-[#52525B] hover:bg-[#F4F4F5]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="inline-flex rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5">
            <button
              onClick={() => setView("list")}
              aria-label="List view"
              className={`rounded-[4px] p-1.5 cursor-pointer ${
                view === "list"
                  ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                  : "text-[#71717A]"
              }`}
            >
              <List className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setView("grid")}
              aria-label="Grid view"
              className={`rounded-[4px] p-1.5 cursor-pointer ${
                view === "grid"
                  ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                  : "text-[#71717A]"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <Card key={item.id} className="p-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[6px] bg-[#F7F7F8] border border-[#E4E4E7]">
                      {getIcon(item.type)}
                    </div>
                    <Badge variant="outline">{item.folder}</Badge>
                  </div>
                  <h3 className="mt-3 text-[14px] font-semibold text-[#18181B]">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-[#71717A]">{item.sizeLabel}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E4E4E7] flex items-center justify-between text-[12px]">
                  <span className="text-[#71717A] tabular-nums">
                    {item.views} views · {item.shares} shares
                  </span>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setPreviewItem(item)}
                      title="Preview"
                      aria-label="Preview"
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
                      aria-label="Copy link"
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
                      aria-label="Duplicate"
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
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
                <tr>
                  <th className="px-4">Asset</th>
                  <th className="px-4">Folder</th>
                  <th className="px-4">Format</th>
                  <th className="px-4 text-right">Views (Sim)</th>
                  <th className="px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E4E7]">
                {filtered.map((item) => (
                  <tr key={item.id} className="h-12 hover:bg-[#F7F7F8]">
                    <td className="px-4">
                      <div className="flex items-center gap-2.5">
                        {getIcon(item.type)}
                        <span className="font-medium text-[#18181B]">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-4 text-[#52525B]">{item.folder}</td>
                    <td className="px-4 text-[#71717A]">{item.sizeLabel}</td>
                    <td className="px-4 text-right tabular-nums text-[#52525B]">{item.views}</td>
                    <td className="px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <Button size="sm" variant="secondary" onClick={() => setPreviewItem(item)}>
                          Preview
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label="Delete"
                          onClick={() => {
                            deleteContentItem(item.id);
                            toast({ title: "Item removed" });
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-[#DC2626]" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
              <p className="text-[#52525B]">{previewItem.previewText}</p>
              <div className="rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-3 text-[12px] space-y-1">
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
