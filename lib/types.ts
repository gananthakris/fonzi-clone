// Schema type placeholder - actual schema is in amplify/data/resource.ts
export type Schema = any;

// ---------------------------------------------------------------------------
// Enums (mirroring GraphQL schema enums)
// ---------------------------------------------------------------------------

export enum UserRole {
  ADMIN = "ADMIN",
  COMPANY_ADMIN = "COMPANY_ADMIN",
  CANDIDATE = "CANDIDATE",
}

export enum CandidateStatus {
  ONBOARDING = "ONBOARDING",
  PROFILE_COMPLETE = "PROFILE_COMPLETE",
  READY_FOR_MATCH = "READY_FOR_MATCH",
  IN_MATCH_DAY = "IN_MATCH_DAY",
  INTERVIEWING = "INTERVIEWING",
  PLACED = "PLACED",
  INACTIVE = "INACTIVE",
}

export enum CompanyStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
  INACTIVE = "INACTIVE",
}

export enum MatchDayStatus {
  SCHEDULED = "SCHEDULED",
  MATCHING = "MATCHING",
  OFFERS_LIVE = "OFFERS_LIVE",
  INTERVIEWS_SCHEDULED = "INTERVIEWS_SCHEDULED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  EXPIRED = "EXPIRED",
  WITHDRAWN = "WITHDRAWN",
}

export enum InterviewStatus {
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  NO_SHOW = "NO_SHOW",
}

export enum InterviewType {
  PHONE_SCREEN = "PHONE_SCREEN",
  TECHNICAL = "TECHNICAL",
  BEHAVIORAL = "BEHAVIORAL",
  CULTURE_FIT = "CULTURE_FIT",
  FINAL_ROUND = "FINAL_ROUND",
  PANEL = "PANEL",
}

export enum IncentiveType {
  FIRST_MATCH_DAY = "FIRST_MATCH_DAY",
  COMPLETED_INTERVIEW = "COMPLETED_INTERVIEW",
  HIRE_BONUS = "HIRE_BONUS",
  REFERRAL_MATCH_DAY = "REFERRAL_MATCH_DAY",
  REFERRAL_HIRED = "REFERRAL_HIRED",
}

export enum IncentiveStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  PAID = "PAID",
  DENIED = "DENIED",
}

export enum FraudSignalSeverity {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum ContentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum RoleFocus {
  FRONTEND = "FRONTEND",
  BACKEND = "BACKEND",
  FULLSTACK = "FULLSTACK",
  DATA = "DATA",
  ML_AI = "ML_AI",
  DEVOPS = "DEVOPS",
  MOBILE = "MOBILE",
  SECURITY = "SECURITY",
  QA = "QA",
  DESIGN = "DESIGN",
}

export enum ExperienceLevel {
  JUNIOR = "JUNIOR",
  MID = "MID",
  SENIOR = "SENIOR",
  STAFF = "STAFF",
  PRINCIPAL = "PRINCIPAL",
  LEAD = "LEAD",
}

export enum WorkPreference {
  REMOTE = "REMOTE",
  HYBRID = "HYBRID",
  ONSITE = "ONSITE",
}

// ---------------------------------------------------------------------------
// Auth types
// ---------------------------------------------------------------------------

export interface AuthUser {
  id: string;
  email: string;
  role: "ADMIN" | "COMPANY_ADMIN" | "CANDIDATE" | null;
  groups: string[];
  companyId: string | null;
}

// ---------------------------------------------------------------------------
// Onboarding
// ---------------------------------------------------------------------------

export interface OnboardingStep {
  key: string;
  title: string;
  description: string;
  isComplete: boolean;
}

// ---------------------------------------------------------------------------
// Common API response types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  data: T | null;
  errors: ApiError[] | null;
}

export interface ApiError {
  message: string;
  errorType?: string;
  errorInfo?: Record<string, unknown>;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextToken: string | null;
}

export interface MutationResponse<T> {
  data: T | null;
  errors: ApiError[] | null;
}

// ---------------------------------------------------------------------------
// Countdown timer
// ---------------------------------------------------------------------------

export interface CountdownTime {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}
