import { NextResponse } from 'next/server';
import { DB } from '@/lib/store';
import { runAiAudit } from '@/lib/ai-service';
import { AuditItem, AuditStatus } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get('status');
  const query = searchParams.get('q')?.toLowerCase();

  let list = DB.getAudits();

  if (statusFilter && statusFilter !== 'All') {
    list = list.filter(item => item.status.toLowerCase() === statusFilter.toLowerCase());
  }

  if (query) {
    list = list.filter(item => 
      item.title.toLowerCase().includes(query) ||
      item.contentType.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query)
    );
  }

  return NextResponse.json({
    audits: list,
    total: list.length
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      contentType = 'Landing page',
      content,
      images = [],
      apiKey,
      aiModel = 'ZeroGPT',
      checksConfig = {
        factualAccuracy: true,
        originality: true,
        brandAlignment: true,
        safetyCompliance: true,
      }
    } = body;

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
    }

    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const auditTitle = title?.trim() || (content.slice(0, 40) + '...');

    // Run multimodal AI audit (with attached images if any and API key)
    const analysis = await runAiAudit(content, images, apiKey);

    let status: AuditStatus = 'Passed';
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    const highSeverityCount = analysis.findings.filter(f => f.severity === 'high').length;
    const totalFindings = analysis.findings.length;

    if (highSeverityCount > 0 || analysis.qualityScore < 70) {
      status = 'Flagged';
      riskLevel = 'high';
    } else if (totalFindings > 0 || analysis.qualityScore < 85) {
      status = 'Needs review';
      riskLevel = 'medium';
    }

    const newAudit: AuditItem = {
      id: `audit-${Date.now()}`,
      title: auditTitle,
      contentType,
      wordCount,
      aiModel,
      qualityScore: analysis.qualityScore,
      originalityScore: analysis.originalityScore,
      accuracyScore: analysis.accuracyScore,
      status,
      riskLevel,
      createdAt: new Date().toISOString(),
      auditedAt: 'Just now',
      content,
      images,
      findings: analysis.findings,
      aiAnalysisSummary: analysis.aiAnalysisSummary,
      sourceEngine: analysis.sourceEngine,
      checksConfig,
      assignedTo: 'Kasim Rahees'
    };

    const saved = DB.createAudit(newAudit);

    return NextResponse.json({
      success: true,
      audit: saved
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Audit analysis failed' }, { status: 500 });
  }
}
