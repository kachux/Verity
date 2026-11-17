import { AuditItem, User, WorkspaceStats } from './types';

// In-memory / persistent mock database with rich initial state matching the Figma mockups
let users: User[] = [
  {
    id: 'user-1',
    name: 'Kasim Rahees',
    email: 'kasimraheeskzr@gmail.com',
    workspaceName: 'Acme Studio Workspace',
    role: 'Lead Content Architect',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

let audits: AuditItem[] = [
  {
    id: 'audit-7-1588',
    title: 'A smarter way to manage your team',
    contentType: 'Landing page',
    wordCount: 680,
    aiModel: 'Claude 3.5',
    qualityScore: 72,
    originalityScore: 78,
    accuracyScore: 68,
    status: 'Needs review',
    createdAt: new Date(Date.now() - 16 * 60 * 1000).toISOString(),
    auditedAt: '16 min ago',
    riskLevel: 'high',
    assignedTo: 'Kasim Rahees',
    checksConfig: {
      factualAccuracy: true,
      originality: true,
      brandAlignment: true,
      safetyCompliance: true,
    },
    content: `A smarter way to manage your team is not about adding more tools, but connecting existing conversations.

In today's fast-paced digital world, content velocity has skyrocketed thanks to generative artificial intelligence. But velocity without clarity introduces organizational debt.

Our customers save 40% of their time every week through automated triage and smart workflow orchestration. When team members no longer have to manually sync updates across platforms, they can focus on high-impact strategic initiatives.

Acme Studio is the only platform with end-to-end encryption that satisfies all standard enterprise protocols without plugins. We guarantee zero friction integration across your tech stack with complete visibility.

Teams that adopt integrated workflows reduce context switching by half within ninety days. With automated checkpoints, every piece of collateral is audited for authenticity, factual accuracy, and brand alignment before reaching customer touchpoints.`,
    findings: [
      {
        id: 'finding-1',
        category: 'accuracy',
        severity: 'high',
        title: 'Unverified performance claim',
        description: 'The 40% time-saving claim has no source attached. Add evidence or qualify the statement.',
        matchedText: 'Our customers save 40% of their time every week through automated triage and smart workflow orchestration.',
        sourceTitle: 'SaaStr 2024 Workflow Benchmarks',
        sourceUrl: 'https://saastr.com/guides/team-efficiency-reports',
        similarityScore: 88,
        suggestion: 'Add an attribution footnote referencing the internal customer survey, or adjust copy to "Teams report up to 40% time savings in pilot studies."'
      },
      {
        id: 'finding-2',
        category: 'accuracy',
        severity: 'medium',
        title: 'Absolute comparison',
        description: 'The "only platform" claim requires a verifiable comparison. Use a specific, supportable statement.',
        matchedText: 'Acme Studio is the only platform with end-to-end encryption that satisfies all standard enterprise protocols without plugins.',
        sourceTitle: 'Cloud Security Alliance Architecture Standards',
        sourceUrl: 'https://cloudsecurityalliance.org/research/artifacts/architecture-standards',
        similarityScore: 92,
        suggestion: 'Reframe to "One of the few enterprise platforms offering built-in end-to-end encryption compliant with SOC2 and ISO27001."'
      },
      {
        id: 'finding-3',
        category: 'originality',
        severity: 'medium',
        title: 'Duplicate phrasing detected',
        description: 'Matches published phrasing from SaaStr efficiency reports with 74% similarity.',
        matchedText: 'Teams that adopt integrated workflows reduce context switching by half within ninety days.',
        sourceTitle: 'Modern Team Efficiency and Workflow Automation - SaaStr Review',
        sourceUrl: 'https://saastr.com/guides/team-efficiency-reports',
        similarityScore: 74,
        suggestion: 'Paraphrase phrasing into proprietary company terminology to avoid direct similarity flags.'
      }
    ]
  },
  {
    id: 'audit-7-1089',
    title: 'Getting started with Acme Studio',
    contentType: 'Product guide',
    wordCount: 540,
    aiModel: 'Gemini 1.5',
    qualityScore: 98,
    originalityScore: 99,
    accuracyScore: 97,
    status: 'Passed',
    createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    auditedAt: '42 min ago',
    riskLevel: 'low',
    assignedTo: 'Kasim Rahees',
    checksConfig: {
      factualAccuracy: true,
      originality: true,
      brandAlignment: true,
      safetyCompliance: true,
    },
    content: `Welcome to Acme Studio. This onboarding manual walks you through your first 15 minutes in the dashboard.

Setting up your workspace begins with defining your editorial guidelines. By uploading your brand voice handbook and setting threshold alerts for claim verification, your entire team stays aligned effortlessly.

Invite your collaborators by navigating to Workspace Settings > Members. Each editor can run pre-publish audits, review flagged sentences, and submit revisions directly within the editor interface.`,
    findings: []
  },
  {
    id: 'audit-5-339',
    title: 'Enterprise Cloud Security Architecture Whitepaper',
    contentType: 'Whitepaper',
    wordCount: 1420,
    aiModel: 'GPT-4o',
    qualityScore: 64,
    originalityScore: 61,
    accuracyScore: 70,
    status: 'Flagged',
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    auditedAt: '3 hours ago',
    riskLevel: 'high',
    assignedTo: 'Sarah Jenkins',
    checksConfig: {
      factualAccuracy: true,
      originality: true,
      brandAlignment: false,
      safetyCompliance: true,
    },
    content: `Zero trust network architectures require verified identity verification before data access. Comprehensive audit trails ensure regulatory compliance and granular operational visibility across distributed infrastructure.

Synchronizing updates across multiple platforms reduces repetitive manual data entry. Acme provides guaranteed 100% security against perimeter intrusion.`,
    findings: [
      {
        id: 'finding-4',
        category: 'originality',
        severity: 'high',
        title: 'Verbatim text match from CSA standards',
        description: '32 consecutive words matched verbatim with Cloud Security Alliance publication.',
        matchedText: 'Zero trust network architectures require verified identity verification before data access. Comprehensive audit trails ensure regulatory compliance and granular operational visibility across distributed infrastructure.',
        sourceTitle: 'Cloud Security Alliance Architecture Standards 2025',
        sourceUrl: 'https://cloudsecurityalliance.org/research/artifacts/architecture-standards',
        similarityScore: 96,
        suggestion: 'Rewrite standard architecture definitions in your own words with proper academic citations.'
      },
      {
        id: 'finding-5',
        category: 'accuracy',
        severity: 'high',
        title: 'Unqualified absolute assurance',
        description: 'Guaranteeing 100% security is legally and technically inaccurate.',
        matchedText: 'Acme provides guaranteed 100% security against perimeter intrusion.',
        sourceTitle: 'Compliance Verification',
        similarityScore: 90,
        suggestion: 'Replace with "industry-standard zero-trust defence in depth".'
      }
    ]
  },
  {
    id: 'audit-5-340',
    title: 'Q3 Product Announcement & Roadmap',
    contentType: 'Blog post',
    wordCount: 910,
    aiModel: 'Claude 3.5',
    qualityScore: 89,
    originalityScore: 92,
    accuracyScore: 86,
    status: 'Needs review',
    createdAt: new Date(Date.now() - 7 * 3600 * 1000).toISOString(),
    auditedAt: '7 hours ago',
    riskLevel: 'medium',
    assignedTo: 'Alex Chen',
    checksConfig: {
      factualAccuracy: true,
      originality: true,
      brandAlignment: true,
      safetyCompliance: true,
    },
    content: `Today we are thrilled to unveil our next generation collaborative workspace features. Designed for modern distributed teams, our new release simplifies project tracking and cross-functional communication.`,
    findings: [
      {
        id: 'finding-6',
        category: 'brand',
        severity: 'low',
        title: 'Cliché corporate opening',
        description: '"We are thrilled to unveil" is overused marketing copy.',
        matchedText: 'Today we are thrilled to unveil our next generation collaborative workspace features.',
        suggestion: 'Lead with the tangible user benefit or problem solved rather than corporate sentiment.'
      }
    ]
  }
];

export const DB = {
  getUsers: () => users,
  getUserByEmail: (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  createUser: (user: User) => {
    users.push(user);
    return user;
  },

  getAudits: () => [...audits].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  getAuditById: (id: string) => audits.find(a => a.id === id),
  createAudit: (audit: AuditItem) => {
    audits.unshift(audit);
    return audit;
  },
  updateAudit: (id: string, updates: Partial<AuditItem>) => {
    const index = audits.findIndex(a => a.id === id);
    if (index === -1) return null;
    audits[index] = { ...audits[index], ...updates };
    return audits[index];
  },
  deleteAudit: (id: string) => {
    const index = audits.findIndex(a => a.id === id);
    if (index === -1) return false;
    audits.splice(index, 1);
    return true;
  },

  getStats: (): WorkspaceStats => {
    const total = audits.length;
    const flagged = audits.filter(a => a.status === 'Flagged').length;
    const needsReview = audits.filter(a => a.status === 'Needs review').length;
    const avgAcc = Math.round(audits.reduce((acc, a) => acc + a.accuracyScore, 0) / (total || 1));
    const avgOrig = Math.round(audits.reduce((acc, a) => acc + a.originalityScore, 0) / (total || 1));

    return {
      auditsRun: 1284 + audits.length - 4,
      auditsQuota: 2000,
      flaggedItems: 96 + flagged - 1,
      needsReviewItems: 24 + needsReview - 2,
      accuracyAverage: avgAcc || 88,
      originalityAverage: avgOrig || 86,
      systemStatus: 'operational'
    };
  }
};
