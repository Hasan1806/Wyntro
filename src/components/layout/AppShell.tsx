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
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Building2,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { WyntroLogo } from "@/components/brand/WyntroLogo";
import { Button } from "@/components/ui/button";
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
        title: "Workspace",
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
        title: "Engagement",
        items: [
          { label: "Campaigns", href: "/campaigns", icon: Megaphone },
          { label: "Message Templates", href: "/templates", icon: FileText },
          { label: "Content Library", href: "/content", icon: FolderOpen },
          { label: "Lead Forms", href: "/forms", icon: ClipboardList },
        ],
      },
      {
        title: "Automation",
        items: [
          { label: "Workflows", href: "/automations", icon: Workflow },
          { label: "Lead Distribution", href: "/lead-distribution", icon: GitFork },
          { label: "Sequences", href: "/sequences", icon: Repeat },
        ],
      },
      {
        title: "Management",
        items: [
          { label: "Analytics", href: "/analytics", icon: BarChart3 },
          { label: "Team", href: "/team", icon: UserCog },
          { label: "Integrations", href: "/integrations", icon: Plug },
        ],
      },
      {
        title: "System",
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
      <div className="flex h-full flex-col bg-[#FFFFFF] border-r border-[#E4E4E7]">
        {/* Brand + Collapse */}
        <div className="flex h-14 items-center justify-between px-3.5 border-b border-[#E4E4E7]">
          <Link href="/dashboard" className="flex items-center">
            <WyntroLogo collapsed={collapsed} size="sm" />
          </Link>
          {!isMobile ? (
            <button
              onClick={toggleSidebar}
              className="rounded-[6px] p-1 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B] transition-colors cursor-pointer"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4 stroke-[1.6]" />
              ) : (
                <PanelLeftClose className="h-4 w-4 stroke-[1.6]" />
              )}
            </button>
          ) : (
            <button
              onClick={() => setMobileOpen(false)}
              className="rounded-[6px] p-1 text-[#71717A] hover:bg-[#F4F4F5]"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Organisation Switcher + Search Trigger */}
        <div className="p-2.5 space-y-1.5 border-b border-[#E4E4E7]">
          <div className="relative">
            <button
              onClick={() => setOrgMenuOpen((o) => !o)}
              className={cn(
                "flex w-full items-center gap-2 rounded-[6px] px-2 py-1.5 text-left hover:bg-[#F4F4F5] transition-colors cursor-pointer",
                collapsed && "justify-center px-0"
              )}
            >
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[5px] bg-[#F4F4F5] text-[#52525B]">
                <Building2 className="h-3.5 w-3.5 stroke-[1.6]" />
              </div>
              {!collapsed && (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-medium text-[#18181B]">
                      {currentOrg.name}
                    </p>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-[#A1A1AA]" />
                </>
              )}
            </button>

            {orgMenuOpen && !collapsed && (
              <div className="absolute left-0 right-0 top-full z-40 mt-1 rounded-[8px] border border-[#E4E4E7] bg-white p-1 shadow-[0_8px_24px_-4px_rgba(24,24,27,0.12)]">
                {organizations.map((org) => (
                  <button
                    key={org.id}
                    onClick={() => {
                      setCurrentOrgId(org.id);
                      setOrgMenuOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-[6px] px-2.5 py-1.5 text-left text-[12px] hover:bg-[#F4F4F5] cursor-pointer",
                      org.id === currentOrgId && "bg-[#F4F4F5] text-[#18181B] font-medium"
                    )}
                  >
                    <span className="truncate">{org.name}</span>
                    <span className="text-[11px] text-[#71717A]">{org.plan}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setSearchOpen(true)}
            className={cn(
              "flex w-full h-8 items-center gap-2 rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] px-2.5 text-[12px] text-[#71717A] hover:border-[#D4D4D8] hover:text-[#18181B] transition-colors cursor-pointer",
              collapsed && "justify-center px-0"
            )}
          >
            <Search className="h-3.5 w-3.5 shrink-0 text-[#A1A1AA] stroke-[1.6]" />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">Search...</span>
                <kbd className="rounded-[4px] border border-[#E4E4E7] bg-white px-1.5 py-0.5 text-[10px] font-mono text-[#71717A]">
                  ⌘K
                </kbd>
              </>
            )}
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-2 py-2.5 space-y-3.5">
          {navGroups.map((group) => {
            const isGroupCollapsed = collapsedGroups[group.title];
            return (
              <div key={group.title}>
                {!collapsed && (
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className="flex w-full items-center justify-between px-2 pb-1 text-[11px] font-medium text-[#A1A1AA] hover:text-[#71717A] cursor-pointer"
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-150",
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
                            "group flex h-[34px] items-center gap-2.5 rounded-[6px] px-2.5 text-[13px] leading-[20px] font-medium transition-colors duration-100",
                            active
                              ? "bg-[#F4F4F5] text-[#18181B]"
                              : "text-[#52525B] hover:bg-[#F7F7F8] hover:text-[#18181B]",
                            collapsed && "justify-center px-0"
                          )}
                        >
                          <Icon
                            className={cn(
                              "h-4 w-4 shrink-0 stroke-[1.6]",
                              active
                                ? "text-[#635BFF]"
                                : "text-[#71717A] group-hover:text-[#18181B]"
                            )}
                          />
                          {!collapsed && (
                            <>
                              <span className="flex-1 truncate">{item.label}</span>
                              {item.badge !== undefined && (
                                <span
                                  className={cn(
                                    "text-[11px] font-medium tabular-nums",
                                    active ? "text-[#18181B]" : "text-[#A1A1AA]"
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
        <div className="border-t border-[#E4E4E7] p-2.5">
          <div
            className={cn(
              "flex items-center gap-2.5 rounded-[6px] px-1.5 py-1",
              collapsed && "justify-center"
            )}
          >
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-medium text-white"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {getInitials(currentUser.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-[#18181B]">
                  {currentUser.name}
                </p>
                <p className="truncate text-[11px] text-[#71717A]">
                  {viewRole === "admin" ? "Admin" : "Sales Rep"}
                </p>
              </div>
            )}
            {!collapsed && (
              <Link
                href="/login"
                title="Switch / Sign out (Demo)"
                aria-label="Sign out"
                className="rounded-[6px] p-1 text-[#71717A] hover:bg-[#F4F4F5] hover:text-[#18181B]"
              >
                <LogOut className="h-3.5 w-3.5 stroke-[1.6]" />
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA]">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:block shrink-0 transition-[width] duration-200 sticky top-0 h-screen z-30",
          sidebarCollapsed ? "w-[64px]" : "w-[232px]"
        )}
      >
        {SidebarContent(false)}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#18181B]/35"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative z-10 w-[248px] h-full">
            {SidebarContent(true)}
          </aside>
        </div>
      )}

      {/* Main Column */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Global Header (56px) */}
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-2 sm:gap-4 border-b border-[#E4E4E7] bg-white px-4 lg:px-6">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-[6px] p-1.5 text-[#52525B] hover:bg-[#F4F4F5]"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>

            <Link href="/dashboard" className="lg:hidden flex items-center shrink-0">
              <WyntroLogo size="sm" />
            </Link>

            <nav
              aria-label="Breadcrumb"
              className="hidden sm:flex items-center gap-1.5 text-[13px] min-w-0"
            >
              <Link
                href="/dashboard"
                className="text-[#71717A] hover:text-[#18181B]"
              >
                Wyntro
              </Link>
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={crumb.href}>
                  <span className="text-[#D4D4D8]">/</span>
                  <Link
                    href={crumb.href}
                    className={cn(
                      "truncate",
                      i === breadcrumbs.length - 1
                        ? "font-medium text-[#18181B]"
                        : "text-[#71717A] hover:text-[#18181B]"
                    )}
                  >
                    {crumb.label}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden md:inline-flex items-center rounded-[5px] border border-[#E4E4E7] bg-[#F7F7F8] px-2 py-0.5 text-[11px] font-medium text-[#52525B]">
              Demo Mode
            </span>

            {/* Role Switcher */}
            <div className="hidden sm:flex items-center rounded-[6px] border border-[#E4E4E7] bg-[#F7F7F8] p-0.5 text-[12px]">
              <button
                onClick={() => setViewRole("admin")}
                className={cn(
                  "rounded-[4px] px-2 py-0.5 font-medium transition-colors cursor-pointer",
                  viewRole === "admin"
                    ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                    : "text-[#71717A] hover:text-[#18181B]"
                )}
              >
                Admin
              </button>
              <button
                onClick={() => setViewRole("rep")}
                className={cn(
                  "rounded-[4px] px-2 py-0.5 font-medium transition-colors cursor-pointer",
                  viewRole === "rep"
                    ? "bg-white text-[#18181B] shadow-[0_1px_2px_rgba(24,24,27,0.06)]"
                    : "text-[#71717A] hover:text-[#18181B]"
                )}
              >
                Rep
              </button>
            </div>

            <Button
              variant="secondary"
              size="icon-sm"
              onClick={() => setSearchOpen(true)}
              title="Global Search (Ctrl+K)"
              aria-label="Global Search"
            >
              <Search className="h-3.5 w-3.5 text-[#52525B]" />
            </Button>

            {/* Notifications */}
            <div className="relative">
              <Button
                variant="secondary"
                size="icon-sm"
                onClick={() => setNotifOpen((o) => !o)}
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="h-3.5 w-3.5 text-[#52525B]" />
                {unreadNotifs > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#635BFF] text-[9px] font-semibold text-white">
                    {unreadNotifs}
                  </span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute right-0 top-full z-40 mt-1.5 w-80 rounded-[8px] border border-[#E4E4E7] bg-white shadow-[0_12px_32px_-8px_rgba(24,24,27,0.14)]">
                  <div className="flex items-center justify-between border-b border-[#E4E4E7] px-3.5 py-2.5">
                    <span className="text-[13px] font-semibold text-[#18181B]">
                      Notifications
                    </span>
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-[12px] font-medium text-[#635BFF] hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-[#E4E4E7]">
                    {notifications.map((n) => (
                      <Link
                        key={n.id}
                        href={n.href ?? "/dashboard"}
                        onClick={() => setNotifOpen(false)}
                        className="block px-3.5 py-2.5 hover:bg-[#F7F7F8]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-[13px] font-medium text-[#18181B]">
                            {n.title}
                          </p>
                          {!n.read && (
                            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#635BFF]" />
                          )}
                        </div>
                        <p className="mt-0.5 text-[12px] text-[#52525B]">
                          {n.description}
                        </p>
                        <p className="mt-1 text-[11px] text-[#A1A1AA]">
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
              >
                <Plus className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">New</span>
              </Button>

              {quickCreateOpen && (
                <div className="absolute right-0 top-full z-40 mt-1.5 w-48 rounded-[8px] border border-[#E4E4E7] bg-white p-1 shadow-[0_12px_32px_-8px_rgba(24,24,27,0.14)]">
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      setAddLeadOpen(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-[13px] text-[#18181B] hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    <Users className="h-3.5 w-3.5 text-[#71717A]" />
                    New Lead
                  </button>
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push("/follow-ups");
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-[13px] text-[#18181B] hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    <CheckSquare className="h-3.5 w-3.5 text-[#71717A]" />
                    Follow-up Task
                  </button>
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push("/campaigns");
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-[13px] text-[#18181B] hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    <Megaphone className="h-3.5 w-3.5 text-[#71717A]" />
                    Campaign
                  </button>
                  <button
                    onClick={() => {
                      setQuickCreateOpen(false);
                      router.push("/automations");
                    }}
                    className="flex w-full items-center gap-2 rounded-[6px] px-2.5 py-1.5 text-[13px] text-[#18181B] hover:bg-[#F4F4F5] cursor-pointer"
                  >
                    <Workflow className="h-3.5 w-3.5 text-[#71717A]" />
                    Workflow
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-4 sm:p-6 lg:px-8 lg:py-6 max-w-[1520px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Raycast-style Global Command Search */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-xl p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Global Command Search</DialogTitle>
          </DialogHeader>
          <div className="flex items-center border-b border-[#E4E4E7] px-4 py-3">
            <Search className="h-4 w-4 text-[#A1A1AA] mr-2.5" />
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads, companies, or jump to a module..."
              className="flex-1 bg-transparent text-[14px] text-[#18181B] placeholder:text-[#A1A1AA] focus:outline-none"
            />
            <kbd className="rounded-[4px] border border-[#E4E4E7] bg-[#F7F7F8] px-1.5 py-0.5 text-[10px] font-mono text-[#71717A]">
              ESC
            </kbd>
          </div>
          <div className="max-h-96 overflow-y-auto p-3 space-y-4">
            <div>
              <p className="px-2 pb-1 text-[11px] font-medium text-[#A1A1AA]">
                Leads
              </p>
              {searchResults.matchedLeads.length === 0 ? (
                <p className="px-2 py-2 text-[13px] text-[#71717A]">
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
                      className="flex w-full items-center justify-between rounded-[6px] px-2.5 py-2 text-left hover:bg-[#F4F4F5] cursor-pointer"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-[#18181B]">
                          {lead.name}
                        </p>
                        <p className="text-[12px] text-[#71717A]">
                          {lead.company} · {lead.email}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-[#71717A]">
                        {lead.source}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="px-2 pb-1 text-[11px] font-medium text-[#A1A1AA]">
                Pages
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
                      className="flex items-center gap-2 rounded-[6px] px-2.5 py-2 text-[13px] text-[#18181B] hover:bg-[#F4F4F5] cursor-pointer"
                    >
                      <Icon className="h-4 w-4 text-[#71717A] stroke-[1.6]" />
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
