export type AuditStatus = 'Needs review' | 'Flagged' | 'Passed' | 'In progress' | 'Draft';
export type FlagSeverity = 'high' | 'medium' | 'low';
export type FlagCategory = 'originality' | 'accuracy' | 'brand' | 'compliance';

export interface Finding {
  id: string;
  category: FlagCategory;
  severity: FlagSeverity;
  title: string;
  description: string;
  matchedText: string;
  startOffset?: number;
  endOffset?: number;
  sourceUrl?: string;
  sourceTitle?: string;
  similarityScore?: number; // e.g., 94%
  suggestion: string;
  reviewed?: boolean;
}

export interface AttachedImage {
  id: string;
  name: string;
  dataUrl: string;
  size?: string;
}

export interface AuditItem {
  id: string;
  title: string;
  contentType: string; // e.g., 'Landing page', 'Blog post', 'Whitepaper'
  wordCount: number;
  aiModel: 'ZeroGPT' | 'Claude 3.5' | 'GPT-4o' | 'Gemini 1.5' | 'Human authored' | 'Custom';
  qualityScore: number; // 0 - 100
  originalityScore: number; // 0 - 100
  accuracyScore: number; // 0 - 100
  status: AuditStatus;
  createdAt: string; // ISO string
  auditedAt: string;
  content: string;
  images?: AttachedImage[];
  findings: Finding[];
  aiAnalysisSummary?: string;
  sourceEngine?: string;
  checksConfig: {
    factualAccuracy: boolean;
    originality: boolean;
    brandAlignment: boolean;
    safetyCompliance: boolean;
  };
  decision?: {
    action: 'approved' | 'rejected' | 'changes_requested';
    note?: string;
    decidedBy: string;
    decidedAt: string;
  };
  assignedTo?: string;
  riskLevel?: 'low' | 'medium' | 'high';
}

export interface User {
  id: string;
  name: string;
  email: string;
  workspaceName: string;
  role: string;
  avatarUrl?: string;
}

export interface WorkspaceStats {
  auditsRun: number;
  auditsQuota: number;
  flaggedItems: number;
  needsReviewItems: number;
  accuracyAverage: number;
  originalityAverage: number;
  systemStatus: 'operational' | 'degraded' | 'maintenance';
}
