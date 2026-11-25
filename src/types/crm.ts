export type LeadSource =
  | "Facebook Ads"
  | "Google Ads"
  | "Website Form"
  | "WhatsApp"
  | "LinkedIn"
  | "Referral"
  | "Cold Outreach"
  | "Manual";

export type LeadPriority = "hot" | "high" | "medium" | "low";

export type PipelineStageId =
  | "new-lead"
  | "contacted"
  | "interested"
  | "qualified"
  | "proposal-sent"
  | "negotiation"
  | "closed-won"
  | "closed-lost"
  | string;

export type ActivityType =
  | "lead_created"
  | "assignment_changed"
  | "call_logged"
  | "message_activity"
  | "email_activity"
  | "meeting_scheduled"
  | "note_added"
  | "file_shared"
  | "file_viewed"
  | "stage_changed"
  | "followup_completed";

export interface ActivityItem {
  id: string;
  leadId: string;
  type: ActivityType;
  title: string;
  description: string;
  actorId: string;
  actorName: string;
  createdAt: string;
  isSimulated?: boolean;
  metadata?: Record<string, string | number | boolean>;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  company: string;
  role?: string;
  city?: string;
  country?: string;
  source: LeadSource;
  stageId: PipelineStageId;
  pipelineId: string;
  assignedTo: string; // TeamMember id or ""
  priority: LeadPriority;
  score: number; // 0 - 100
  estimatedValue: number;
  tags: string[];
  groups: string[];
  notes: string;
  customFields: Record<string, string>;
  lastContactedAt: string | null;
  nextFollowUpAt: string | null;
  createdAt: string;
  consentOptIn: boolean;
}

export interface PipelineStage {
  id: PipelineStageId;
  name: string;
  color: string;
  order: number;
}

export interface Pipeline {
  id: string;
  name: string;
  description: string;
  stages: PipelineStage[];
}

export type TaskPriority = "urgent" | "high" | "medium" | "low";
export type TaskStatus = "pending" | "completed" | "overdue";
export type TaskRecurrence = "none" | "daily" | "weekly" | "monthly";

export interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  title: string;
  description: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:mm
  priority: TaskPriority;
  assignedTo: string;
  status: TaskStatus;
  recurrence: TaskRecurrence;
  channel: "call" | "whatsapp" | "email" | "meeting" | "task";
  completedAt?: string;
}

export type MessageChannel = "whatsapp" | "email" | "sms" | "internal";
export type MessageDeliveryStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed";

export interface MessageItem {
  id: string;
  conversationId: string;
  channel: MessageChannel;
  direction: "inbound" | "outbound" | "internal";
  body: string;
  senderName: string;
  createdAt: string;
  status: MessageDeliveryStatus;
  isSimulated: boolean;
  attachmentName?: string;
}

export interface Conversation {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  channel: Exclude<MessageChannel, "internal">;
  assignedTo: string;
  unreadCount: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  messages: MessageItem[];
}

export type CampaignStatus =
  | "draft"
  | "scheduled"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export interface Campaign {
  id: string;
  name: string;
  channel: "whatsapp" | "email" | "sms";
  audienceName: string;
  audienceCount: number;
  optedInCount: number;
  status: CampaignStatus;
  scheduledAt: string | null;
  sentCount: number;
  deliveryRate: number;
  replyRate: number;
  estimatedCost: number;
  createdBy: string;
  createdAt: string;
  templateId?: string;
  messagePreview: string;
  isSimulated: boolean;
}

export type TemplateCategory =
  | "Introduction"
  | "Follow-up"
  | "Product enquiry"
  | "Quotation"
  | "Meeting confirmation"
  | "Payment reminder"
  | "Customer retention"
  | "Custom";

export type WhatsAppApprovalStatus =
  | "approved_simulated"
  | "pending_simulated"
  | "rejected_simulated";

export interface MessageTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  channel: "whatsapp" | "email" | "sms";
  subject?: string;
  body: string;
  placeholders: string[];
  whatsappStatus?: WhatsAppApprovalStatus;
  whatsappCategory?: "UTILITY" | "MARKETING" | "AUTHENTICATION";
  updatedAt: string;
}

export type ContentType =
  | "document"
  | "brochure"
  | "image"
  | "video"
  | "sales_page"
  | "link";

export interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  folder: string;
  sizeLabel: string;
  url: string;
  views: number;
  shares: number;
  avgReadTime: string;
  updatedAt: string;
  previewText?: string;
}

export type FormFieldType =
  | "full_name"
  | "email"
  | "phone"
  | "text"
  | "long_text"
  | "number"
  | "dropdown"
  | "multiple_choice"
  | "checkbox"
  | "date"
  | "consent";

export interface FormFieldConfig {
  id: string;
  type: FormFieldType;
  label: string;
  placeholder: string;
  required: boolean;
  options?: string[];
  step?: number;
}

export interface LeadForm {
  id: string;
  name: string;
  description: string;
  brandColor: string;
  isMultiStep: boolean;
  successMessage: string;
  redirectUrl: string;
  submissions: number;
  conversionRate: number;
  fields: FormFieldConfig[];
  createdAt: string;
}

export type WorkflowNodeCategory = "trigger" | "condition" | "action";

export interface WorkflowNode {
  id: string;
  category: WorkflowNodeCategory;
  kind: string;
  label: string;
  config: Record<string, string>;
  branch?: "all" | "yes" | "no";
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  leadName: string;
  status: "simulated_success" | "simulated_skipped" | "simulated_failed";
  summary: string;
  executedAt: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  nodes: WorkflowNode[];
  runsCount: number;
  lastRunAt: string | null;
  executions: WorkflowExecution[];
}

export type DistributionStrategy =
  | "round_robin"
  | "manual"
  | "source_based"
  | "location_based"
  | "team_based"
  | "priority_based";

export interface DistributionRule {
  id: string;
  name: string;
  strategy: DistributionStrategy;
  enabled: boolean;
  conditions: {
    field: "source" | "city" | "priority" | "tag";
    operator: "equals" | "contains";
    value: string;
  }[];
  assignToTeam: string;
  assignToMemberIds: string[];
  assignedCount: number;
}

export interface SequenceStep {
  id: string;
  type: "send_message" | "schedule_call" | "send_email" | "create_task" | "share_content" | "wait";
  title: string;
  delayDays: number;
  delayHours: number;
  description: string;
}

export interface Sequence {
  id: string;
  name: string;
  description: string;
  stopOnReply: boolean;
  active: boolean;
  enrolledCount: number;
  completionRate: number;
  replyRate: number;
  steps: SequenceStep[];
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Sales Manager" | "Sales Rep";
  team: string;
  available: boolean;
  avatarColor: string;
  leadsAssigned: number;
  dealsWon: number;
  revenueWon: number;
  avgResponseMins: number;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: "Lead Sources" | "Messaging" | "Calendar & Email" | "Automation & Webhooks";
  description: string;
  connected: boolean;
  statusLabel: string;
  lastSyncedAt: string | null;
  isSimulated: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  plan: "Growth" | "Enterprise";
  currency: string;
}
