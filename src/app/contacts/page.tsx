"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Mail, Phone, Building2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCrmStore } from "@/store/useCrmStore";
import { getInitials } from "@/lib/utils";

export default function ContactsPage() {
  const { leads, team } = useCrmStore();
  const [search, setSearch] = useState("");

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-semibold tracking-[-0.02em] text-[#101828]">
              Contacts
            </h1>
            <p className="text-[13px] text-[#667085]">
              Unified directory of all client contacts and decision makers
            </p>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#98A2B3]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contacts..."
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((contact) => {
            const owner = team.find((t) => t.id === contact.assignedTo);
            return (
              <Link key={contact.id} href={`/contacts/${contact.id}`}>
                <Card className="p-4 hover:border-[#635BFF]/50 transition-colors h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EFEDFF] text-[13px] font-semibold text-[#635BFF]">
                        {getInitials(contact.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-[14px] font-semibold text-[#101828]">
                          {contact.name}
                        </p>
                        <p className="truncate text-[12px] text-[#667085] flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {contact.company}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{contact.source}</Badge>
                  </div>

                  <div className="mt-4 space-y-1.5 text-[12px] text-[#667085]">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="h-3.5 w-3.5 text-[#98A2B3]" />
                      {contact.email}
                    </p>
                    <p className="flex items-center gap-2 tabular-nums">
                      <Phone className="h-3.5 w-3.5 text-[#98A2B3]" />
                      {contact.phone}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E4E7EC] flex items-center justify-between text-[12px]">
                    <span className="text-[#98A2B3]">
                      Owner: <strong className="text-[#344054] font-medium">{owner?.name ?? "Unassigned"}</strong>
                    </span>
                    <span className="text-[#635BFF] font-medium">Open profile →</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
