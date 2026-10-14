export type YearOfStudy = 1 | 2 | 3 | 4;
export type Residency = 'local' | 'non_local';
export type Faculty =
  | 'Arts'
  | 'Business'
  | 'Education'
  | 'Engineering'
  | 'Law'
  | 'Medicine'
  | 'Science'
  | 'Social Science';

export type ActivityTag =
  | 'community_service'
  | 'leadership'
  | 'sports'
  | 'arts'
  | 'research'
  | 'entrepreneurship'
  | 'exchange';

export interface StudentProfile {
  id: string;
  displayName: string;
  yearOfStudy: YearOfStudy;
  faculty: Faculty;
  programme: string;
  gpa: number | null;
  residency: Residency;
  financialNeedDeclared: boolean;
  activities: ActivityTag[];
  languages: string[];
  firstGenerationStudent: boolean | null;
  updatedAt: string;
}

export type AwardType =
  | 'merit'
  | 'need_based'
  | 'leadership'
  | 'community'
  | 'sports'
  | 'arts';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  awardType: AwardType;
  amountHKD: number;
  renewable: boolean;
  places: number | null;
  summary: string;
  description: string;
  eligibilityRuleIds: string[];
  requiredDocumentIds: string[];
  deadlineIds: string[];
  isFictional: true;
}

export type RuleField =
  | 'yearOfStudy'
  | 'faculty'
  | 'gpa'
  | 'residency'
  | 'financialNeedDeclared'
  | 'activities'
  | 'languages'
  | 'firstGenerationStudent';

export type RuleOperator =
  | 'in'
  | 'gte'
  | 'lte'
  | 'equals'
  | 'includesAny'
  | 'includesAll';

export interface EligibilityRule {
  id: string;
  scholarshipId: string;
  field: RuleField;
  operator: RuleOperator;
  value: string | number | boolean | Array<string | number>;
  label: string;
  requiresManualCheck: boolean;
}

export type RuleOutcome = 'met' | 'not_met' | 'check';

export interface RuleResult {
  ruleId: string;
  outcome: RuleOutcome;
  explanation: string;
}

export type MatchGroup = 'eligible' | 'partial' | 'not_eligible';

export interface MatchResult {
  scholarshipId: string;
  group: MatchGroup;
  metCount: number;
  totalCount: number;
  results: RuleResult[];
}

export type DocumentCategory =
  | 'academic'
  | 'identity'
  | 'financial'
  | 'reference'
  | 'written'
  | 'activity_evidence'
  | 'language';

export interface DocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  description: string;
  guidance: string;
}

export type DocumentStatus = 'not_started' | 'in_progress' | 'ready';

export interface DocumentProgress {
  studentId: string;
  documentId: string;
  status: DocumentStatus;
  evidenceNote: string;
  updatedAt: string;
}

export type DeadlineType =
  | 'application_close'
  | 'reference_due'
  | 'interview'
  | 'result_release';

export interface Deadline {
  id: string;
  scholarshipId: string;
  type: DeadlineType;
  label: string;
  offsetDays: number;
  date: string;
}

export interface SavedScholarship {
  studentId: string;
  scholarshipId: string;
  savedAt: string;
}
