/**
 * Core CRM data types
 * Corresponds to backend models defined in API specification
 */

export enum UserRole {
  Admin = "admin",
  SalesManager = "sales_manager",
  SalesRep = "sales_rep",
  Customer = "customer",
}

export enum DealStage {
  Prospect = "prospect",
  Qualified = "qualified",
  Proposal = "proposal",
  Negotiation = "negotiation",
  ClosedWon = "closed_won",
  ClosedLost = "closed_lost",
}

export enum TaskStatus {
  Open = "open",
  InProgress = "in_progress",
  Completed = "completed",
  Cancelled = "cancelled",
}

export enum TaskType {
  Call = "call",
  Email = "email",
  Meeting = "meeting",
  FollowUp = "follow_up",
  Other = "other",
}

export enum ActivityType {
  ContactCreated = "contact_created",
  ContactUpdated = "contact_updated",
  DealCreated = "deal_created",
  DealStageChanged = "deal_stage_changed",
  DealValueChanged = "deal_value_changed",
  TaskAssigned = "task_assigned",
  TaskCompleted = "task_completed",
  NoteAdded = "note_added",
  EmailSent = "email_sent",
  CallLogged = "call_logged",
  MeetingScheduled = "meeting_scheduled",
}

/**
 * User entity
 */
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
  createdAt: string;
  updatedAt: string;
}

export interface Permission {
  action: string;
  resource: string;
  condition?: Record<string, any>;
}

/**
 * Address entity
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Contact entity
 */
export interface Contact {
  id: string;
  type: "individual" | "company";
  firstName: string;
  lastName?: string;
  companyName?: string;
  email: string;
  phone?: string;
  website?: string;
  address?: Address;
  tags?: string[];
  customFields?: Record<string, any>;
  owner: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Deal entity
 */
export interface Deal {
  id: string;
  title: string;
  description?: string;
  value: number;
  currency: string;
  stage: DealStage;
  probability: number;
  contact: Contact;
  owner: User;
  expectedCloseDate?: string;
  closedDate?: string;
  closedReason?: "won" | "lost" | "abandoned";
  customFields?: Record<string, any>;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

/**
 * Task entity
 */
export interface Task {
  id: string;
  title: string;
  description?: string;
  type: TaskType;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignedTo: User;
  relatedTo?: {
    contact?: Contact;
    deal?: Deal;
  };
  dueDate?: string;
  completedAt?: string;
  reminder?: Reminder;
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Reminder {
  type: "email" | "notification";
  minutesBefore: number;
}

/**
 * Activity entity
 */
export interface Activity {
  id: string;
  type: ActivityType;
  description: string;
  actor: User;
  relatedTo?: {
    contact?: Contact;
    deal?: Deal;
    task?: Task;
  };
  metadata?: Record<string, any>;
  createdAt: string;
}

/**
 * Note entity
 */
export interface Note {
  id: string;
  content: string;
  author: User;
  relatedTo?: {
    contact?: Contact;
    deal?: Deal;
    task?: Task;
  };
  attachments?: Attachment[];
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
}

/**
 * Pagination response wrapper
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * API error response
 */
export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

/**
 * Auth response
 */
export interface AuthResponse {
  user: User;
  token: string;
  expiresIn: number;
}

/**
 * UI State - Filters
 */
export interface ContactFilters {
  search?: string;
  tags?: string[];
  owner?: string;
  type?: "individual" | "company";
}

export interface DealFilters {
  search?: string;
  stage?: DealStage[];
  owner?: string;
  minValue?: number;
  maxValue?: number;
}

export interface TaskFilters {
  search?: string;
  status?: TaskStatus[];
  assignedTo?: string;
  priority?: string[];
  dueDateRange?: DateRange;
}

export interface DateRange {
  start: string;
  end: string;
}

/**
 * UI State - Notification
 */
export interface Notification {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}

/**
 * Dashboard metrics
 */
export interface DashboardMetrics {
  summary: {
    totalContacts: number;
    activeDeals: number;
    totalPipelineValue: number;
    closedThisMonth: number;
    winRate: number;
  };
  byStage: Record<
    string,
    {
      count: number;
      value: number;
    }
  >;
  topDeals: Deal[];
  recentActivities: Activity[];
}
