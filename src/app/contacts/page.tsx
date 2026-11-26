"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MessageCircle } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/page-header";
import { Avatar, EmptyState, StatusIndicator } from "@/components/ui/primitives";
import { Input } from "@/components/ui/input";
import { useCrmStore } from "@/store/useCrmStore";
import { formatCurrency, getWhatsAppUrl } from "@/lib/utils";

export default function ContactsPage() {
  const { leads, team, pipelines } = useCrmStore();
  const [search, setSearch] = useState("");
  const stages = pipelines[0].stages;

  const filtered = leads.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.company.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q)
    );
  });

  return (
    <AppShell>
      <div className="space-y-5">
        <PageHeader
          title="Contacts"
          description={`${filtered.length} client contacts and decision makers`}
          actions={
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A1A1AA]" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts..."
                className="pl-9 h-9"
              />
            </div>
          }
        />

        {filtered.length === 0 ? (
          <EmptyState
            title="No contacts match your search"
            description="Try a different name, company, or email address."
          />
        ) : (
          <div className="rounded-[8px] border border-[#E4E4E7] bg-white overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-[13px]">
                <thead className="h-10 border-b border-[#E4E4E7] bg-[#F7F7F8] text-[12px] font-medium text-[#52525B]">
                  <tr>
                    <th className="px-4">Contact</th>
                    <th className="px-4">Email</th>
                    <th className="px-4">Phone</th>
                    <th className="px-4">Stage</th>
                    <th className="px-4">Owner</th>
                    <th className="px-4 text-right">Est. Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E4E7]">
                  {filtered.map((contact) => {
                    const owner = team.find((t) => t.id === contact.assignedTo);
                    const stage = stages.find((s) => s.id === contact.stageId);
                    return (
                      <tr
                        key={contact.id}
                        className="h-12 hover:bg-[#F7F7F8] transition-colors"
                      >
                        <td className="px-4">
                          <Link
                            href={`/contacts/${contact.id}`}
                            className="flex items-center gap-2.5 group"
                          >
                            <Avatar name={contact.name} color="#635BFF" size="sm" />
                            <div className="min-w-0">
                              <p className="font-medium text-[#18181B] group-hover:text-[#635BFF] truncate">
                                {contact.name}
                              </p>
                              <p className="text-[12px] text-[#71717A] truncate">
                                {contact.company}
                              </p>
                            </div>
                          </Link>
                        </td>
                        <td className="px-4 text-[#52525B] max-w-[200px] truncate" title={contact.email}>
                          {contact.email}
                        </td>
                        <td className="px-4 text-[#52525B] tabular-nums whitespace-nowrap">
                          <div className="inline-flex items-center gap-2">
                            <span>{contact.phone}</span>
                            <a
                              href={getWhatsAppUrl(contact.phone, `Hi ${contact.name},`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-6 w-6 items-center justify-center rounded-[5px] text-[#16A34A] hover:bg-[#F0FDF4]"
                              title={`Message ${contact.name} on WhatsApp`}
                              aria-label={`WhatsApp ${contact.name}`}
                            >
                              <MessageCircle className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </td>
                        <td className="px-4">
                          <StatusIndicator
                            color={stage?.color ?? "#635BFF"}
                            label={stage?.name ?? contact.stageId}
                          />
                        </td>
                        <td className="px-4 text-[#52525B]">
                          {owner?.name ?? "Unassigned"}
                        </td>
                        <td className="px-4 text-right font-medium text-[#18181B] tabular-nums">
                          {formatCurrency(contact.estimatedValue)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
