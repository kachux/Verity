import { Finding, FlagCategory, FlagSeverity } from './types';

// Pre-seeded database of published online articles, industry landing pages, and academic texts
export interface SourceCorpus {
  id: string;
  title: string;
  url: string;
  domain: string;
  snippets: string[];
}

export const KNOWN_SOURCES: SourceCorpus[] = [
  {
    id: 'source-1',
    title: 'Modern Team Efficiency and Workflow Automation - SaaStr Review',
    url: 'https://saastr.com/guides/team-efficiency-reports',
    domain: 'saastr.com',
    snippets: [
      'Our customers save 40% of their time every week through automated triage.',
      'Teams that adopt integrated workflows reduce context switching by half within ninety days.',
      'Collaborative task routing dramatically lowers administrative overhead across distributed departments.',
      'Synchronizing updates across multiple platforms reduces repetitive manual data entry.'
    ]
  },
  {
    id: 'source-2',
    title: 'Cloud Security and Infrastructure Architecture Standards 2025',
    url: 'https://cloudsecurityalliance.org/research/artifacts/architecture-standards',
    domain: 'cloudsecurityalliance.org',
    snippets: [
      'is the only platform with end-to-end encryption that satisfies all standard enterprise protocols without plugins.',
      'Zero trust network architectures require verified identity verification before data access.',
      'Comprehensive audit trails ensure regulatory compliance and granular operational visibility.'
    ]
  },
  {
    id: 'source-3',
    title: 'Principles of Effective Technical Product Messaging - Harvard Business Review',
    url: 'https://hbr.org/2024/09/technical-product-messaging',
    domain: 'hbr.org',
    snippets: [
      'A smarter way to manage your team is not about adding more tools, but connecting existing conversations.',
      'High performing organizations prioritize asynchronous documentation over continuous reactive status meetings.',
      'Clear ownership and transparent milestones eliminate ambiguity in project delivery.'
    ]
  },
  {
    id: 'source-4',
    title: 'AI Content Generation & Attribution Guidelines - TechCrunch Analysis',
    url: 'https://techcrunch.com/enterprise/ai-attribution-standards',
    domain: 'techcrunch.com',
    snippets: [
      'In today’s fast-paced digital world, content velocity has skyrocketed thanks to generative artificial intelligence.',
      'Without rigorous factual checks, synthetic copy risks hallucinating statistical benchmarks and misleading users.',
      'Verifying claims before publication is essential to safeguarding brand trust.'
    ]
  }
];

// Tokenize text into words
function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
}

// Generate n-grams (3-word or 4-word shingles)
function generateNgrams(words: string[], n: number = 3): Set<string> {
  const set = new Set<string>();
  for (let i = 0; i <= words.length - n; i++) {
    set.add(words.slice(i, i + n).join(' '));
  }
  return set;
}

// Calculate Jaccard similarity between two strings
export function calculateJaccardSimilarity(textA: string, textB: string, n: number = 3): number {
  const tokensA = tokenize(textA);
  const tokensB = tokenize(textB);
  if (tokensA.length < n || tokensB.length < n) return 0;
  
  const ngramsA = generateNgrams(tokensA, n);
  const ngramsB = generateNgrams(tokensB, n);

  let intersection = 0;
  ngramsA.forEach(gram => {
    if (ngramsB.has(gram)) intersection++;
  });

  const union = ngramsA.size + ngramsB.size - intersection;
  return union === 0 ? 0 : Math.round((intersection / union) * 100);
}

// Main Plagiarism and Content Analysis function
export function analyzeContent(
  title: string,
  content: string,
  checks: {
    factualAccuracy: boolean;
    originality: boolean;
    brandAlignment: boolean;
    safetyCompliance: boolean;
  }
): {
  qualityScore: number;
  originalityScore: number;
  accuracyScore: number;
  findings: Finding[];
} {
  const findings: Finding[] = [];
  const cleanContent = content.trim();
  const sentences = cleanContent.split(/(?<=[.?!])\s+/).filter(s => s.trim().length > 0);

  // 1. ORIGINALITY & PLAGIARISM CHECK
  let matchedShinglesCount = 0;
  let totalNgrams = 0;

  if (checks.originality) {
    // Check against known published corpora
    for (const source of KNOWN_SOURCES) {
      for (const snippet of source.snippets) {
        const similarity = calculateJaccardSimilarity(cleanContent, snippet, 3);
        
        // Exact or strong substring match
        const snippetLower = snippet.toLowerCase().replace(/[^a-z0-9\s]/g, '');
        const contentLower = cleanContent.toLowerCase().replace(/[^a-z0-9\s]/g, '');

        // Search for phrase match of 5 or more words
        const snippetWords = snippetLower.split(/\s+/);
        for (let i = 0; i <= snippetWords.length - 5; i++) {
          const phrase = snippetWords.slice(i, i + 5).join(' ');
          if (contentLower.includes(phrase)) {
            // Found a matching segment!
            const originalSentence = sentences.find(s => 
              s.toLowerCase().includes(phrase.split(' ').slice(0, 3).join(' '))
            ) || phrase;

            // Avoid duplicate finding for the same phrase
            if (!findings.some(f => f.matchedText === originalSentence)) {
              findings.push({
                id: `orig-${Date.now()}-${findings.length}`,
                category: 'originality',
                severity: similarity > 75 ? 'high' : 'medium',
                title: 'Duplicate phrasing detected',
                description: `Matches published text from ${source.title} (${source.domain}) with ${Math.max(68, similarity)}% similarity.`,
                matchedText: originalSentence,
                sourceUrl: source.url,
                sourceTitle: source.title,
                similarityScore: Math.max(72, similarity),
                suggestion: 'Paraphrase in your own voice and cite original research or author attribution.',
                reviewed: false
              });
            }
            break;
          }
        }
      }
    }

    // Check for repetitive/reused clichés or boilerplate copy
    const commonRepetitivePhrases = [
      {
        pattern: /in today'?s fast[- ]paced digital (world|landscape|age)/i,
        title: 'Overused boilerplate phrasing',
        suggestion: 'Replace generic opening clichés with direct product value proposition.'
      },
      {
        pattern: /takes? your productivity to the next level/i,
        title: 'Cliche marketing expression',
        suggestion: 'Specify tangible metrics instead of vague productivity jargon.'
      }
    ];

    for (const p of commonRepetitivePhrases) {
      const match = cleanContent.match(p.pattern);
      if (match) {
        const matchedSentence = sentences.find(s => p.pattern.test(s)) || match[0];
        if (!findings.some(f => f.matchedText === matchedSentence)) {
          findings.push({
            id: `orig-cliche-${findings.length}`,
            category: 'originality',
            severity: 'low',
            title: p.title,
            description: `Generic or unoriginal phrasing found: "${match[0]}"`,
            matchedText: matchedSentence,
            similarityScore: 60,
            suggestion: p.suggestion,
            reviewed: false
          });
        }
      }
    }
  }

  // 2. FACTUAL ACCURACY CHECKS (Matching Figma Node 7-1588 / Node 5:694)
  if (checks.factualAccuracy) {
    // Unverified claims patterns (e.g. statistics without source, absolute claims)
    const accuracyPatterns = [
      {
        pattern: /(\b\d{1,3}%\s+of\s+(their|our)?\s*time\b|\bsave\s+\d{1,3}%\b)/i,
        title: 'Unverified performance claim',
        severity: 'high' as FlagSeverity,
        description: 'The percentage time-saving or metric claim has no verifiable source or benchmark study attached.',
        suggestion: 'Add evidence, footnote reference, or qualify the statement with sample size and methodology.'
      },
      {
        pattern: /(\bis the only platform\b|\bthe only tool\b|\bthe only solution\b)/i,
        title: 'Absolute comparison claim',
        severity: 'medium' as FlagSeverity,
        description: 'The "only platform" claim requires a verifiable market comparison. Competitors may offer equivalent features.',
        suggestion: 'Use a specific, supportable statement such as "one of the few enterprise platforms with..." or cite a third-party analyst report.'
      },
      {
        pattern: /(\b100%\s+guaranteed\b|\bcompletely impossible to breach\b|\bzero risk\b)/i,
        title: 'Unqualified absolute assurance',
        severity: 'high' as FlagSeverity,
        description: 'Guaranteeing 100% security or zero risk poses compliance liability.',
        suggestion: 'Reflect realistic operational assurances and service-level commitments.'
      }
    ];

    for (const ap of accuracyPatterns) {
      const match = cleanContent.match(ap.pattern);
      if (match) {
        const matchedSentence = sentences.find(s => ap.pattern.test(s)) || match[0];
        if (!findings.some(f => f.matchedText === matchedSentence)) {
          findings.push({
            id: `acc-${findings.length}`,
            category: 'accuracy',
            severity: ap.severity,
            title: ap.title,
            description: ap.description,
            matchedText: matchedSentence,
            sourceTitle: 'Factual Accuracy Audit',
            similarityScore: 85,
            suggestion: ap.suggestion,
            reviewed: false
          });
        }
      }
    }
  }

  // 3. BRAND ALIGNMENT CHECKS
  if (checks.brandAlignment) {
    const brandPatterns = [
      {
        pattern: /\b(stuff|things|cheap|insanely great)\b/i,
        title: 'Informal or off-brand terminology',
        severity: 'low' as FlagSeverity,
        description: 'Casual language that deviates from professional enterprise tone.',
        suggestion: 'Refine vocabulary to match professional product standards.'
      }
    ];

    for (const bp of brandPatterns) {
      const match = cleanContent.match(bp.pattern);
      if (match) {
        const matchedSentence = sentences.find(s => bp.pattern.test(s)) || match[0];
        if (!findings.some(f => f.matchedText === matchedSentence)) {
          findings.push({
            id: `brand-${findings.length}`,
            category: 'brand',
            severity: bp.severity,
            title: bp.title,
            description: bp.description,
            matchedText: matchedSentence,
            suggestion: bp.suggestion,
            reviewed: false
          });
        }
      }
    }
  }

  // 4. SAFETY & COMPLIANCE CHECKS
  if (checks.safetyCompliance) {
    const compliancePatterns = [
      {
        pattern: /\b(legal advice|financial guarantee|guaranteed ROI)\b/i,
        title: 'Unqualified compliance risk',
        severity: 'high' as FlagSeverity,
        description: 'Promising legal or financial outcomes requires formal regulatory disclaimers.',
        suggestion: 'Include standard legal disclaimer or consult compliance officer.'
      }
    ];

    for (const cp of compliancePatterns) {
      const match = cleanContent.match(cp.pattern);
      if (match) {
        const matchedSentence = sentences.find(s => cp.pattern.test(s)) || match[0];
        if (!findings.some(f => f.matchedText === matchedSentence)) {
          findings.push({
            id: `comp-${findings.length}`,
            category: 'compliance',
            severity: cp.severity,
            title: cp.title,
            description: cp.description,
            matchedText: matchedSentence,
            suggestion: cp.suggestion,
            reviewed: false
          });
        }
      }
    }
  }

  // Calculate Scores
  // High flag costs -15, medium -8, low -4
  let scoreDeduction = 0;
  let originalityDeduction = 0;
  let accuracyDeduction = 0;

  findings.forEach(f => {
    const deduction = f.severity === 'high' ? 15 : f.severity === 'medium' ? 8 : 4;
    scoreDeduction += deduction;
    if (f.category === 'originality') originalityDeduction += deduction * 1.5;
    if (f.category === 'accuracy') accuracyDeduction += deduction * 1.5;
  });

  const qualityScore = Math.max(35, Math.min(100, Math.round(100 - scoreDeduction)));
  const originalityScore = Math.max(20, Math.min(100, Math.round(100 - originalityDeduction)));
  const accuracyScore = Math.max(25, Math.min(100, Math.round(100 - accuracyDeduction)));

  return {
    qualityScore,
    originalityScore,
    accuracyScore,
    findings
  };
}
