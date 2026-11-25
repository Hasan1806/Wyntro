"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Contact2,
  Kanban,
  CheckSquare,
  Calendar as CalendarIcon,
  Inbox,
  Megaphone,
  FileText,
  FolderOpen,
  ClipboardList,
  Workflow,
  GitFork,
  Repeat,
  BarChart3,
  UserCog,
  Plug,
  Settings,
  CreditCard,
  HelpCircle,
  Search,
  Bell,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  LogOut,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { WyntroLogo } from "@/components/brand/WyntroLogo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddLeadDrawer } from "@/components/leads/AddLeadDrawer";
import { useCrmStore } from "@/store/useCrmStore";
import { cn, getInitials } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const {
    sidebarCollapsed,
    toggleSidebar,
    organizations,
    currentOrgId,
    setCurrentOrgId,
    team,
    currentUserId,
    viewRole,
    setViewRole,
    leads,
    conversations,
    followUps,
    notifications,
    markAllNotificationsRead,
  } = useCrmStore();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [orgMenuOpen, setOrgMenuOpen] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const currentOrg =
    organizations.find((o) => o.id === currentOrgId) ?? organizations[0];
  const currentUser = team.find((t) => t.id === currentUserId) ?? team[0];
  const unreadNotifs = notifications.filter((n) => !n.read).length;
  const unreadInbox = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const pendingFollowUps = followUps.filter((f) => f.status !== "completed").length;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const navGroups: NavGroup[] = useMemo(
    () => [
      {
        title: "WORKSPACE",
        items: [
          { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
          { label: "Leads", href: "/leads", icon: Users, badge: leads.length },
          { label: "Contacts", href: "/contacts", icon: Contact2 },
          { label: "Sales Pipeline", href: "/pipeline", icon: Kanban },
          { label: "Follow-ups", href: "/follow-ups", icon: CheckSquare, badge: pendingFollowUps },
          { label: "Calendar", href: "/calendar", icon: CalendarIcon },
          { label: "Inbox", href: "/inbox", icon: Inbox, badge: unreadInbox || undefined },
        ],
      },
      {
        title: "ENGAGEMENT",
        items: [
          { label: "Campaigns", href: "/campaigns", icon: Megaphone },
          { label: "Message Templates", href: "/templates", icon: FileText },
          { label: "Content Library", href: "/content", icon: FolderOpen },
          { label: "Lead Forms", href: "/forms", icon: ClipboardList },
        ],
      },
      {
        title: "AUTOMATION",
        items: [
          { label: "Workflows", href: "/automations", icon: Workflow },
          { label: "Lead Distribution", href: "/lead-distribution", icon: GitFork },
          { label: "Sequences", href: "/sequences", icon: Repeat },
        ],
      },
      {
        title: "MANAGEMENT",
        items: [
          { label: "Analytics", href: "/analytics", icon: BarChart3 },
          { label: "Team", href: "/team", icon: UserCog },
          { label: "Integrations", href: "/integrations", icon: Plug },
        ],
      },
      {
        title: "SYSTEM",
        items: [
          { label: "Settings", href: "/settings", icon: Settings },
          { label: "Billing", href: "/billing", icon: CreditCard },
          { label: "Help Center", href: "/help", icon: HelpCircle },
        ],
      },
    ],
    [leads.length, pendingFollowUps, unreadInbox]
  );

  const breadcrumbs = useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Overview", href: "/dashboard" }];
    return parts.map((part, idx) => ({
      label: part
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      href: "/" + parts.slice(0, idx + 1).join("/"),
    }));
  }, [pathname]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matchedLeads = leads
      .filter(
        (l) =>
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.company.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q)
      )
      .slice(0, 5);
    const matchedPages = navGroups
      .flatMap((g) => g.items)
      .filter((item) => !q || item.label.toLowerCase().includes(q))
      .slice(0, 6);
    return { matchedLeads, matchedPages };
  }, [searchQuery, leads, navGroups]);

  const toggleGroup = (title: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const SidebarContent = (isMobile = false) => {
    const collapsed = isMobile ? false : sidebarCollapsed;
    return (
      <div className="flex h-full flex-col bg-white border-r border-[#E4E7EC]">
        {/* Brand + collapse toggle */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-[#E4E7EC]">
          <Link href="/dashboard" className="flex items-center">
            <WyntroLogo collapsed={collapsed} size="md" />
          </Link>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="rounded-[6px] p-1.5 text-[#667085] hover:bg-[#F2F4F7] hover:text-[#101828] cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-[6px] p-1.5 text-[#667085] hover:bg-[#F2F4F7]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Organisation Switcher + Search Trigger */}
        <div className="p-3 space-y-2 border-b border-[#E4E7EC]">
          <div className="relative">
            <button
              onClick={() => setOrgMenuOpen((o) => !o)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] px-2.5 py-2 text-left hover:bg-[#F2F4F7] transition-colors cursor-pointer",
                collapsed && "justify-center px-0"
              )}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[#EFEDFF] text-[#635BFF]">
                <Building2 className="h-3.5 w-3.5" />
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-[#101828]">
                      {currentOrg.name}
                    </p>
                    <p className="truncate text-[11px] text-[#667085]">
                      {currentOrg.plan} Workspace
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-[#98A2B3]" />
                </>
              )}
            </button>

            {orgMenuOpen && !collapsed && (
              <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-[8px] border border-[#E4E7EC] bg-white p-1 shadow-lg">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrgId(org.id);
                      setOrgMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-left text-[12px] hover:bg-[#F8F9FC] cursor-pointer",
                      org.id === currentOrgId && "bg-[#EFEDFF] text-[#635BFF] font-medium"
                    )}
                  >
                    <span className="truncate">{org.name}</span>
                    <span className="text-[10px] text-[#98A2B3]">{org.plan}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "flex w-full items-center gap-2 rounded-[8px] border border-[#E4E7EC] bg-white px-2.5 py-1.5 text-[12px] text-[#667085] hover:border-[#D0D5DD] hover:text-[#101828] transition-colors cursor-pointer",
              collapsed && "justify-center px-0"
            )}
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-[#98A2B3]" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Quick search...</span>
                <kbd className="rounded border border-[#E4E7EC] bg-[#F8F9FC] px-1.5 py-0.5 text-[10px] font-mono text-[#667085]">
                  ⌘K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4">
          {navGroups.map((group) => {
            const isGroupCollapsed = collapsedGroups[group.title];
            return (
              <div key={group.title}>
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center justify-between px-2 pb-1.5 text-[11px] font-semibold tracking-wider text-[#98A2B3] hover:text-[#667085] cursor-pointer"
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isGroupCollapsed && "-rotate-90"
                      )}
                    />
                  </button>
                )}
                {!isGroupCollapsed && (
                  <div className="space-y-0.5">
                    {group.items.map((item) => {
                      const active =
                        pathname === item.href ||
                        (item.href !== "/dashboard" &&
                          pathname.startsWith(item.href + "/"));
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          title={collapsed ? item.label : undefined}
                          className={cn(
                            "group relative flex items-center gap-2.5 rounded-[8px] px-2.5 py-2 text-[13px] transition-colors",
                            active
                              ? "bg-[#EFEDFF] text-[#635BFF] font-medium"
                              : "text-[#475467] hover:bg-[#F8F9FC] hover:text-[#101828]",
                            collapsed && "justify-center px-0"
                          )}
                        >
                          {active && (
                            <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-[#635BFF]" />
                          )}
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0",
                              active
                                ? "text-[#635BFF]"
                                : "text-[#667085] group-hover:text-[#101828]"
                            )}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge !== undefined && (
                                <span
                                  className={cn(
                                    "rounded-full px-1.5 py-0.5 text-[11px] font-medium tabular-nums",
                                    active
                                      ? "bg-white/80 text-[#635BFF]"
                                      : "bg-[#F2F4F7] text-[#667085]"
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="border-t border-[#E4E7EC] p-3">
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-[8px] p-1.5",
              collapsed && "justify-center"
            )}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold text-white"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {getInitials(currentUser.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#101828]">
                  {currentUser.name}
                </p>
                <p className="truncate text-[11px] text-[#667085]">
                  {viewRole === "admin" ? "Admin View" : "Sales Rep View"}
                </p>
              </div>
            )}
            {!collapsed && (
              <Link
                href="/login"
                title="Switch / Sign out (Demo)"
                className="rounded-[6px] p-1.5 text-[#98A2B3] hover:bg-[#F2F4F7] hover:text-[#101828]"
              >
                <LogOut className="h-3.5 w-3.5" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FC]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block shrink-0 transition-all duration-200 sticky top-0 h-screen z-30",
          sidebarCollapsed ? "w-[68px]" : "w-[248px]"
        )}
      >
        {SidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#101828]/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-[260px] h-full">
            {SidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-[#E4E7EC] bg-white/95 backdrop-blur-sm px-4 lg:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-[8px] p-1.5 text-[#667085] hover:bg-[#F2F4F7]"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] min-w-0">
              <Link
                href="/dashboard"
                className="text-[#667085] hover:text-[#101828] hidden sm:inline"
              >
                Wyntro
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  <span className="text-[#D0D5DD] hidden sm:inline">/</span>
                  <Link
                    href={crumb.href}
                    className={cn(
                      "truncate",
                      i === breadcrumbs.length - 1
                        ? "font-medium text-[#101828]"
                        : "text-[#667085] hover:text-[#101828]"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <Badge variant="primary" className="hidden md:inline-flex">
              <Sparkles className="h-3 w-3" />
              Frontend Demo Mode
            </Badge>

            {/* Role Priority Toggle */}
            <div className="hidden sm:flex items-center rounded-[8px] border border-[#E4E7EC] bg-[#F8F9FC] p-0.5 text-[12px]">
              <button
                onClick={() => setViewRole("admin")}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 font-medium transition-colors cursor-pointer",
                  viewRole === "admin"
                    ? "bg-white text-[#101828] shadow-xs"
                    : "text-[#667085] hover:text-[#101828]"
                )}
              >
                Admin
              </button>
              <button
                onClick={() => setViewRole("rep")}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 font-medium transition-colors cursor-pointer",
                  viewRole === "rep"
                    ? "bg-white text-[#101828] shadow-xs"
                    : "text-[#667085] hover:text-[#101828]"
                )}
              >
                Sales Rep
              </button>
            </div>

            {/* Quick Search button */}
            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => setSearchOpen(true)}
              title="Global Search (Ctrl+K)"
            >
              <Search className="h-4 w-4 text-[#667085]" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => setNotifOpen((o) => !o)}
                title="Notifications"
              >
                <Bell className="h-4 w-4 text-[#667085]" />
                {unreadNotifs > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#635BFF] text-[10px] font-semibold text-white">
                    {unreadNotifs}
                  </span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 w-80 rounded-[10px] border border-[#E4E7EC] bg-white shadow-xl">
                  <div className="flex items-center justify-between border-b border-[#E4E7EC] px-4 py-3">
                    <span className="text-[13px] font-semibold text-[#101828]">
                      Notifications
                    </span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[12px] font-medium text-[#635BFF] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E4E7EC]">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.href ?? "/dashboard"}
                        onClick={() => setNotifOpen(false)}
                        className="block px-4 py-3 hover:bg-[#F8F9FC]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-medium text-[#101828]">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#635BFF]" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#667085]">
                          {n.description}
                        </p>
                        <p className="mt-1 text-[11px] text-[#98A2B3]">
                          {n.createdAt}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Create */}
            <div className="relative">
              <Button
                size="sm"
                onClick={() => setQuickCreateOpen((o) => !o)}
                className="gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Quick Create</span>
              </Button>

              {quickCreateOpen && (
                <div className="absolute right-0 top-full z-40 mt-2 w-52 rounded-[10px] border border-[#E4E7EC] bg-white p-1.5 shadow-xl">
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      setAddLeadOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#101828] hover:bg-[#F8F9FC] cursor-pointer"
                  >
                    <Users className="h-4 w-4 text-[#635BFF]" />
                    New Lead
                  </button>
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push("/follow-ups");
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#101828] hover:bg-[#F8F9FC] cursor-pointer"
                  >
                    <CheckSquare className="h-4 w-4 text-[#12B76A]" />
                    Schedule Follow-up
                  </button>
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push("/campaigns");
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#101828] hover:bg-[#F8F9FC] cursor-pointer"
                  >
                    <Megaphone className="h-4 w-4 text-[#F79009]" />
                    New Campaign
                  </button>
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push("/automations");
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-3 py-2 text-[13px] text-[#101828] hover:bg-[#F8F9FC] cursor-pointer"
                  >
                    <Workflow className="h-4 w-4 text-[#2E90FA]" />
                    New Workflow
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-4 lg:p-6 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Global Command Search</DialogTitle>
          </DialogHeader>
          <div className="flex items-center border-b border-[#E4E7EC] px-4 py-3">
            <Search className="h-4 w-4 text-[#98A2B3] mr-2.5" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, companies, or jump to a module..."
              className="flex-1 bg-transparent text-[14px] text-[#101828] placeholder:text-[#98A2B3] focus:outline-none"
            />
          </div>
          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            <div>
              <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                Matching Leads
              </p>
              {searchResults.matchedLeads.length === 0 ? (
                <p className="px-2 py-2 text-[13px] text-[#667085]">
                  No leads match &ldquo;{searchQuery}&rdquo;.
                </p>
              ) : (
                <div className="space-y-0.5">
                  {searchResults.matchedLeads.map((lead) => (
                    <button
                      key={lead.id}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(`/leads/${lead.id}`);
                      }}
                      className="flex w-full items-center justify-between rounded-[8px] px-2.5 py-2 text-left hover:bg-[#F8F9FC] cursor-pointer"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-[#101828]">
                          {lead.name}
                        </p>
                        <p className="text-[12px] text-[#667085]">
                          {lead.company} • {lead.email}
                        </p>
                      </div>
                      <Badge variant="outline">{lead.source}</Badge>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#98A2B3]">
                Navigation
              </p>
              <div className="grid grid-cols-2 gap-1">
                {searchResults.matchedPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.href}
                      onClick={() => {
                        setSearchOpen(false);
                        router.push(page.href);
                      }}
                      className="flex items-center gap-2 rounded-[8px] px-2.5 py-2 text-[13px] text-[#101828] hover:bg-[#F8F9FC] cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-[#635BFF]" />
                      {page.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddLeadDrawer open={addLeadOpen} onOpenChange={setAddLeadOpen} />
    </div>
  );
}
