"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ActivityItem,
  Campaign,
  ContentItem,
  Conversation,
  DistributionRule,
  FollowUpTask,
  IntegrationItem,
  Lead,
  LeadForm,
  MessageChannel,
  MessageTemplate,
  NotificationItem,
  Organization,
  Pipeline,
  PipelineStage,
  PipelineStageId,
  Sequence,
  TeamMember,
  Workflow,
} from "@/types/crm";
import {
  SEED_ACTIVITIES,
  SEED_CAMPAIGNS,
  SEED_CONTENT,
  SEED_CONVERSATIONS,
  SEED_DISTRIBUTION_RULES,
  SEED_FOLLOWUPS,
  SEED_FORMS,
  SEED_INTEGRATIONS,
  SEED_LEADS,
  SEED_NOTIFICATIONS,
  SEED_ORGS,
  SEED_PIPELINES,
  SEED_SEQUENCES,
  SEED_TEAM,
  SEED_TEMPLATES,
  SEED_WORKFLOWS,
} from "@/data/seed";

export type ViewRole = "admin" | "rep";

interface CrmState {
  // UI & Auth simulation
  sidebarCollapsed: boolean;
  currentOrgId: string;
  currentUserId: string;
  viewRole: ViewRole;
  isDemoAuthenticated: boolean;
  hasCompletedOnboarding: boolean;

  // Core Entities
  organizations: Organization[];
  team: TeamMember[];
  pipelines: Pipeline[];
  activePipelineId: string;
  leads: Lead[];
  activities: ActivityItem[];
  followUps: FollowUpTask[];
  conversations: Conversation[];
  templates: MessageTemplate[];
  campaigns: Campaign[];
  contentItems: ContentItem[];
  forms: LeadForm[];
  workflows: Workflow[];
  distributionRules: DistributionRule[];
  sequences: Sequence[];
  integrations: IntegrationItem[];
  notifications: NotificationItem[];

  // Actions - UI & Session
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setCurrentOrgId: (orgId: string) => void;
  setViewRole: (role: ViewRole) => void;
  setDemoAuthenticated: (val: boolean) => void;
  setHasCompletedOnboarding: (val: boolean) => void;

  // Actions - Leads & Activities
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Lead;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLeads: (ids: string[]) => void;
  bulkUpdateLeads: (ids: string[], patch: Partial<Lead>) => void;
  addActivity: (item: Omit<ActivityItem, "id" | "createdAt">) => void;

  // Actions - Pipeline
  setActivePipelineId: (id: string) => void;
  moveLeadStage: (leadId: string, toStageId: PipelineStageId) => void;
  addPipelineStage: (pipelineId: string, stage: Omit<PipelineStage, "order">) => void;
  updatePipelineStage: (pipelineId: string, stageId: string, name: string) => void;

  // Actions - Follow-ups
  addFollowUp: (task: Omit<FollowUpTask, "id">) => void;
  toggleFollowUpComplete: (id: string) => void;
  rescheduleFollowUp: (id: string, dueDate: string, dueTime: string) => void;
  deleteFollowUp: (id: string) => void;

  // Actions - Inbox
  sendMessage: (
    conversationId: string,
    body: string,
    channel: MessageChannel,
    attachmentName?: string
  ) => void;
  markConversationRead: (conversationId: string) => void;

  // Actions - Templates, Campaigns, Content, Forms
  addTemplate: (tpl: Omit<MessageTemplate, "id" | "updatedAt">) => void;
  updateTemplate: (id: string, patch: Partial<MessageTemplate>) => void;
  deleteTemplate: (id: string) => void;
  addCampaign: (cmp: Omit<Campaign, "id" | "createdAt">) => void;
  updateCampaignStatus: (id: string, status: Campaign["status"]) => void;
  addContentItem: (item: Omit<ContentItem, "id" | "updatedAt">) => void;
  deleteContentItem: (id: string) => void;
  renameContentItem: (id: string, title: string) => void;
  updateForm: (id: string, patch: Partial<LeadForm>) => void;
  submitDemoForm: (formId: string, values: Record<string, string>) => Lead;

  // Actions - Automation, Distribution, Sequences, Team, Integrations
  toggleWorkflow: (id: string) => void;
  saveWorkflow: (wf: Workflow) => void;
  runWorkflowSimulation: (id: string, leadId: string) => string;
  addDistributionRule: (rule: Omit<DistributionRule, "id" | "assignedCount">) => void;
  toggleDistributionRule: (id: string) => void;
  simulateDistribution: (leadId: string) => string;
  saveSequence: (seq: Sequence) => void;
  toggleTeamAvailability: (memberId: string) => void;
  inviteTeamMember: (member: Omit<TeamMember, "id" | "leadsAssigned" | "dealsWon" | "revenueWon" | "avgResponseMins">) => void;
  toggleIntegration: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
}

export const useCrmStore = create<CrmState>()(
  persist(
    (set, get) => ({
      sidebarCollapsed: false,
      currentOrgId: SEED_ORGS[0].id,
      currentUserId: SEED_TEAM[0].id,
      viewRole: "admin",
      isDemoAuthenticated: true,
      hasCompletedOnboarding: true,

      organizations: SEED_ORGS,
      team: SEED_TEAM,
      pipelines: SEED_PIPELINES,
      activePipelineId: SEED_PIPELINES[0].id,
      leads: SEED_LEADS,
      activities: SEED_ACTIVITIES,
      followUps: SEED_FOLLOWUPS,
      conversations: SEED_CONVERSATIONS,
      templates: SEED_TEMPLATES,
      campaigns: SEED_CAMPAIGNS,
      contentItems: SEED_CONTENT,
      forms: SEED_FORMS,
      workflows: SEED_WORKFLOWS,
      distributionRules: SEED_DISTRIBUTION_RULES,
      sequences: SEED_SEQUENCES,
      integrations: SEED_INTEGRATIONS,
      notifications: SEED_NOTIFICATIONS,

      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setCurrentOrgId: (orgId) => set({ currentOrgId: orgId }),
      setViewRole: (role) => set({ viewRole: role }),
      setDemoAuthenticated: (val) => set({ isDemoAuthenticated: val }),
      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),

      addLead: (leadInput) => {
        const id = `lead-${Date.now().toString().slice(-6)}`;
        const now = new Date().toISOString();
        const newLead: Lead = {
          ...leadInput,
          id,
          createdAt: now,
        };
        const currentUser = get().team.find((t) => t.id === get().currentUserId);
        const activity: ActivityItem = {
          id: `act-${Date.now()}`,
          leadId: id,
          type: "lead_created",
          title: `Lead Created (${newLead.source})`,
          description: `${newLead.name} from ${newLead.company || "Direct"} added to pipeline.`,
          actorId: currentUser?.id ?? "system",
          actorName: currentUser?.name ?? "System",
          createdAt: now,
        };
        set((s) => ({
          leads: [newLead, ...s.leads],
          activities: [activity, ...s.activities],
        }));
        return newLead;
      },

      updateLead: (id, patch) =>
        set((s) => ({
          leads: s.leads.map((l) => (l.id === id ? { ...l, ...patch } : l)),
        })),

      deleteLeads: (ids) =>
        set((s) => ({
          leads: s.leads.filter((l) => !ids.includes(l.id)),
          followUps: s.followUps.filter((f) => !ids.includes(f.leadId)),
        })),

      bulkUpdateLeads: (ids, patch) =>
        set((s) => ({
          leads: s.leads.map((l) => (ids.includes(l.id) ? { ...l, ...patch } : l)),
        })),

      addActivity: (item) =>
        set((s) => ({
          activities: [
            {
              ...item,
              id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
              createdAt: new Date().toISOString(),
            },
            ...s.activities,
          ],
        })),

      setActivePipelineId: (id) => set({ activePipelineId: id }),

      moveLeadStage: (leadId, toStageId) => {
        const state = get();
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead || lead.stageId === toStageId) return;
        const pipeline = state.pipelines.find((p) => p.id === lead.pipelineId);
        const stageName =
          pipeline?.stages.find((st) => st.id === toStageId)?.name ?? toStageId;
        const actor = state.team.find((t) => t.id === state.currentUserId);

        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId ? { ...l, stageId: toStageId } : l
          ),
          activities: [
            {
              id: `act-${Date.now()}`,
              leadId,
              type: "stage_changed",
              title: `Moved to ${stageName}`,
              description: `Pipeline stage updated to ${stageName}.`,
              actorId: actor?.id ?? "tm-1",
              actorName: actor?.name ?? "Hasan",
              createdAt: new Date().toISOString(),
            },
            ...s.activities,
          ],
        }));
      },

      addPipelineStage: (pipelineId, stage) =>
        set((s) => ({
          pipelines: s.pipelines.map((p) =>
            p.id === pipelineId
              ? {
                  ...p,
                  stages: [...p.stages, { ...stage, order: p.stages.length }],
                }
              : p
          ),
        })),

      updatePipelineStage: (pipelineId, stageId, name) =>
        set((s) => ({
          pipelines: s.pipelines.map((p) =>
            p.id === pipelineId
              ? {
                  ...p,
                  stages: p.stages.map((st) =>
                    st.id === stageId ? { ...st, name } : st
                  ),
                }
              : p
          ),
        })),

      addFollowUp: (task) =>
        set((s) => ({
          followUps: [{ ...task, id: `fu-${Date.now()}` }, ...s.followUps],
        })),

      toggleFollowUpComplete: (id) => {
        const state = get();
        const task = state.followUps.find((f) => f.id === id);
        if (!task) return;
        const nextStatus = task.status === "completed" ? "pending" : "completed";
        const actor = state.team.find((t) => t.id === state.currentUserId);

        set((s) => ({
          followUps: s.followUps.map((f) =>
            f.id === id
              ? {
                  ...f,
                  status: nextStatus,
                  completedAt:
                    nextStatus === "completed" ? new Date().toISOString() : undefined,
                }
              : f
          ),
          activities:
            nextStatus === "completed"
              ? [
                  {
                    id: `act-${Date.now()}`,
                    leadId: task.leadId,
                    type: "followup_completed",
                    title: `Completed: ${task.title}`,
                    description: `Follow-up marked complete by ${actor?.name ?? "Team"}.`,
                    actorId: actor?.id ?? "tm-1",
                    actorName: actor?.name ?? "Hasan",
                    createdAt: new Date().toISOString(),
                  },
                  ...s.activities,
                ]
              : s.activities,
        }));
      },

      rescheduleFollowUp: (id, dueDate, dueTime) =>
        set((s) => ({
          followUps: s.followUps.map((f) =>
            f.id === id
              ? { ...f, dueDate, dueTime, status: "pending" }
              : f
          ),
        })),

      deleteFollowUp: (id) =>
        set((s) => ({
          followUps: s.followUps.filter((f) => f.id !== id),
        })),

      sendMessage: (conversationId, body, channel, attachmentName) => {
        const state = get();
        const conv = state.conversations.find((c) => c.id === conversationId);
        const actor = state.team.find((t) => t.id === state.currentUserId);
        if (!conv) return;
        const now = new Date().toISOString();
        const newMsg = {
          id: `msg-${Date.now()}`,
          conversationId,
          channel,
          direction: (channel === "internal" ? "internal" : "outbound") as
            | "internal"
            | "outbound",
          body,
          senderName: actor?.name ?? "Hasan",
          createdAt: now,
          status: "sent" as const,
          isSimulated: true,
          attachmentName,
        };

        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? {
                  ...c,
                  lastMessagePreview: body,
                  lastMessageAt: now,
                  unreadCount: 0,
                  messages: [...c.messages, newMsg],
                }
              : c
          ),
          activities:
            channel !== "internal"
              ? [
                  {
                    id: `act-${Date.now()}`,
                    leadId: conv.leadId,
                    type:
                      channel === "email"
                        ? "email_activity"
                        : "message_activity",
                    title: `Simulated ${channel.toUpperCase()} message composed`,
                    description: body,
                    actorId: actor?.id ?? "tm-1",
                    actorName: actor?.name ?? "Hasan",
                    createdAt: now,
                    isSimulated: true,
                  },
                  ...s.activities,
                ]
              : s.activities,
        }));
      },

      markConversationRead: (conversationId) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          ),
        })),

      addTemplate: (tpl) =>
        set((s) => ({
          templates: [
            {
              ...tpl,
              id: `tpl-${Date.now()}`,
              updatedAt: new Date().toISOString().slice(0, 10),
            },
            ...s.templates,
          ],
        })),

      updateTemplate: (id, patch) =>
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id
              ? { ...t, ...patch, updatedAt: new Date().toISOString().slice(0, 10) }
              : t
          ),
        })),

      deleteTemplate: (id) =>
        set((s) => ({
          templates: s.templates.filter((t) => t.id !== id),
        })),

      addCampaign: (cmp) =>
        set((s) => ({
          campaigns: [
            {
              ...cmp,
              id: `cmp-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
            ...s.campaigns,
          ],
        })),

      updateCampaignStatus: (id, status) =>
        set((s) => ({
          campaigns: s.campaigns.map((c) => (c.id === id ? { ...c, status } : c)),
        })),

      addContentItem: (item) =>
        set((s) => ({
          contentItems: [
            {
              ...item,
              id: `cnt-${Date.now()}`,
              updatedAt: new Date().toISOString().slice(0, 10),
            },
            ...s.contentItems,
          ],
        })),

      deleteContentItem: (id) =>
        set((s) => ({
          contentItems: s.contentItems.filter((c) => c.id !== id),
        })),

      renameContentItem: (id, title) =>
        set((s) => ({
          contentItems: s.contentItems.map((c) =>
            c.id === id ? { ...c, title } : c
          ),
        })),

      updateForm: (id, patch) =>
        set((s) => ({
          forms: s.forms.map((f) => (f.id === id ? { ...f, ...patch } : f)),
        })),

      submitDemoForm: (formId, values) => {
        const lead = get().addLead({
          name: values.full_name || "Form Prospect",
          email: values.email || "prospect@example.com",
          phone: values.phone || "+1 (555) 010-9900",
          company: values.company || "Inbound Form Lead",
          source: "Website Form",
          stageId: "new-lead",
          pipelineId: "pipe-main",
          assignedTo: "tm-1",
          priority: "high",
          score: 78,
          estimatedValue: 18000,
          tags: ["Web Form"],
          groups: ["Inbound"],
          notes: `Submitted via Lead Form (${formId}).`,
          customFields: values,
          lastContactedAt: null,
          nextFollowUpAt: new Date(Date.now() + 3600 * 1000 * 2).toISOString(),
          consentOptIn: true,
        });
        set((s) => ({
          forms: s.forms.map((f) =>
            f.id === formId ? { ...f, submissions: f.submissions + 1 } : f
          ),
        }));
        return lead;
      },

      toggleWorkflow: (id) =>
        set((s) => ({
          workflows: s.workflows.map((w) =>
            w.id === id ? { ...w, enabled: !w.enabled } : w
          ),
        })),

      saveWorkflow: (wf) =>
        set((s) => {
          const exists = s.workflows.some((w) => w.id === wf.id);
          return {
            workflows: exists
              ? s.workflows.map((w) => (w.id === wf.id ? wf : w))
              : [wf, ...s.workflows],
          };
        }),

      runWorkflowSimulation: (id, leadId) => {
        const state = get();
        const wf = state.workflows.find((w) => w.id === id);
        const lead = state.leads.find((l) => l.id === leadId);
        if (!wf || !lead) return "Workflow or lead not found.";

        const summary = `Simulated ${wf.nodes.length} nodes on ${lead.name} (${lead.source}). Local follow-up & tag actions executed; external messages remain simulated.`;
        const execution = {
          id: `ex-${Date.now()}`,
          workflowId: id,
          leadName: lead.name,
          status: "simulated_success" as const,
          summary,
          executedAt: new Date().toISOString(),
        };

        set((s) => ({
          workflows: s.workflows.map((w) =>
            w.id === id
              ? {
                  ...w,
                  runsCount: w.runsCount + 1,
                  lastRunAt: execution.executedAt,
                  executions: [execution, ...w.executions],
                }
              : w
          ),
          activities: [
            {
              id: `act-${Date.now()}`,
              leadId: lead.id,
              type: "note_added",
              title: `Workflow Simulated: ${wf.name}`,
              description: summary,
              actorId: "system",
              actorName: "Wyntro Automation",
              createdAt: execution.executedAt,
              isSimulated: true,
            },
            ...s.activities,
          ],
        }));
        return summary;
      },

      addDistributionRule: (rule) =>
        set((s) => ({
          distributionRules: [
            { ...rule, id: `dist-${Date.now()}`, assignedCount: 0 },
            ...s.distributionRules,
          ],
        })),

      toggleDistributionRule: (id) =>
        set((s) => ({
          distributionRules: s.distributionRules.map((r) =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
          ),
        })),

      simulateDistribution: (leadId) => {
        const state = get();
        const lead = state.leads.find((l) => l.id === leadId);
        if (!lead) return "Lead not found.";

        const enabledRules = state.distributionRules.filter((r) => r.enabled);
        const matchedRule = enabledRules.find((rule) =>
          rule.conditions.every((cond) => {
            if (cond.field === "source") {
              return lead.source.toLowerCase() === cond.value.toLowerCase();
            }
            if (cond.field === "city") {
              return (lead.city ?? "").toLowerCase() === cond.value.toLowerCase();
            }
            if (cond.field === "priority") {
              return lead.priority.toLowerCase() === cond.value.toLowerCase();
            }
            return lead.tags.some((t) =>
              t.toLowerCase().includes(cond.value.toLowerCase())
            );
          })
        );

        let targetMember: TeamMember | undefined;
        if (matchedRule && matchedRule.assignToMemberIds.length > 0) {
          const availablePool = state.team.filter(
            (m) =>
              matchedRule!.assignToMemberIds.includes(m.id) && m.available
          );
          targetMember =
            availablePool[0] ??
            state.team.find((m) =>
              matchedRule!.assignToMemberIds.includes(m.id)
            );
        }

        if (!targetMember) {
          const available = state.team.filter((m) => m.available);
          targetMember =
            available[Math.floor(Math.random() * available.length)] ??
            state.team[0];
        }

        const now = new Date().toISOString();
        set((s) => ({
          leads: s.leads.map((l) =>
            l.id === leadId ? { ...l, assignedTo: targetMember!.id } : l
          ),
          distributionRules: matchedRule
            ? s.distributionRules.map((r) =>
                r.id === matchedRule!.id
                  ? { ...r, assignedCount: r.assignedCount + 1 }
                  : r
              )
            : s.distributionRules,
          activities: [
            {
              id: `act-${Date.now()}`,
              leadId,
              type: "assignment_changed",
              title: `Assigned to ${targetMember!.name}`,
              description: matchedRule
                ? `Matched rule "${matchedRule.name}" (${matchedRule.strategy}).`
                : "Assigned via fallback round-robin among available reps.",
              actorId: "system",
              actorName: "Lead Distribution",
              createdAt: now,
              isSimulated: true,
            },
            ...s.activities,
          ],
        }));

        return matchedRule
          ? `Matched "${matchedRule.name}" → Assigned ${lead.name} to ${targetMember.name}`
          : `Fallback Round-Robin → Assigned ${lead.name} to ${targetMember.name}`;
      },

      saveSequence: (seq) =>
        set((s) => {
          const exists = s.sequences.some((q) => q.id === seq.id);
          return {
            sequences: exists
              ? s.sequences.map((q) => (q.id === seq.id ? seq : q))
              : [seq, ...s.sequences],
          };
        }),

      toggleTeamAvailability: (memberId) =>
        set((s) => ({
          team: s.team.map((m) =>
            m.id === memberId ? { ...m, available: !m.available } : m
          ),
        })),

      inviteTeamMember: (member) =>
        set((s) => ({
          team: [
            ...s.team,
            {
              ...member,
              id: `tm-${Date.now()}`,
              leadsAssigned: 0,
              dealsWon: 0,
              revenueWon: 0,
              avgResponseMins: 0,
            },
          ],
        })),

      toggleIntegration: (id) =>
        set((s) => ({
          integrations: s.integrations.map((item) =>
            item.id === id
              ? {
                  ...item,
                  connected: !item.connected,
                  statusLabel: !item.connected
                    ? "Simulated Demo Connected"
                    : "Disconnected",
                  lastSyncedAt: !item.connected
                    ? new Date().toISOString()
                    : null,
                }
              : item
          ),
        })),

      markAllNotificationsRead: () =>
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true })),
        })),

      resetDemoData: () =>
        set({
          leads: SEED_LEADS,
          activities: SEED_ACTIVITIES,
          followUps: SEED_FOLLOWUPS,
          conversations: SEED_CONVERSATIONS,
          templates: SEED_TEMPLATES,
          campaigns: SEED_CAMPAIGNS,
          contentItems: SEED_CONTENT,
          forms: SEED_FORMS,
          workflows: SEED_WORKFLOWS,
          distributionRules: SEED_DISTRIBUTION_RULES,
          sequences: SEED_SEQUENCES,
          integrations: SEED_INTEGRATIONS,
          notifications: SEED_NOTIFICATIONS,
          pipelines: SEED_PIPELINES,
          team: SEED_TEAM,
        }),
    }),
    {
      name: "wyntro-crm-demo-v4",
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        currentOrgId: state.currentOrgId,
        viewRole: state.viewRole,
      }),
    }
  )
);
