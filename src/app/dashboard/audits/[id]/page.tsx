'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import EvidenceDialog from '@/components/modals/EvidenceDialog';
import ApproveDialog from '@/components/modals/ApproveDialog';
import RequestChangesDialog from '@/components/modals/RequestChangesDialog';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  CheckCircle,
  Edit3,
  Check,
  Sparkles,
  FileText,
  Clock,
  ImageIcon,
  X,
  Eye
} from 'lucide-react';
import { AuditItem, Finding, AttachedImage } from '@/lib/types';

export default function AuditDetailPage() {
  const params = useParams();
  const router = useRouter();
  const auditId = params?.id as string;

  const [audit, setAudit] = useState<AuditItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFinding, setActiveFinding] = useState<Finding | null>(null);
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);

  // Modals
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Image Modal
  const [previewImage, setPreviewImage] = useState<AttachedImage | null>(null);

  // Editable draft mode
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editableContent, setEditableContent] = useState('');

  const loadAudit = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/audits/${auditId}`);
      if (!res.ok) throw new Error('Not found');
      const data = await res.json();
      setAudit(data.audit);
      setEditableContent(data.audit.content);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auditId) {
      loadAudit();
    }
  }, [auditId]);

  const handleOpenEvidence = (finding: Finding) => {
    setActiveFinding(finding);
    setSelectedFindingId(finding.id);
    setIsEvidenceModalOpen(true);
  };

  const handleApprove = async (note: string) => {
    try {
      const res = await fetch(`/api/audits/${auditId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Passed',
          qualityScore: 98,
          findings: [],
          decision: {
            action: 'approved',
            note,
            decidedBy: 'Kasim Rahees',
            decidedAt: new Date().toISOString()
          }
        })
      });
      const data = await res.json();
      if (data.audit) {
        setAudit(data.audit);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestChanges = async (reason: string, assignedTo: string) => {
    try {
      const res = await fetch(`/api/audits/${auditId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'Needs review',
          assignedTo,
          decision: {
            action: 'changes_requested',
            note: reason,
            decidedBy: 'Kasim Rahees',
            decidedAt: new Date().toISOString()
          }
        })
      });
      const data = await res.json();
      if (data.audit) {
        setAudit(data.audit);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEditedContent = async () => {
    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: audit?.title + ' (Revised)',
          contentType: audit?.contentType,
          content: editableContent,
          images: audit?.images,
          aiModel: audit?.aiModel,
          checksConfig: audit?.checksConfig
        })
      });
      const data = await res.json();
      if (data.audit) {
        setIsEditingDraft(false);
        router.push(`/dashboard/audits/${data.audit.id}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    window.print();
  };

  if (loading) {
    return (
      <>
        <Header breadcrumb={[{ label: 'Workspace', href: '/dashboard' }, { label: 'Audit results' }]} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-[#1E5642] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-[#64748B]">Loading audit details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!audit) {
    return (
      <>
        <Header breadcrumb={[{ label: 'Workspace', href: '/dashboard' }, { label: 'Audit results' }]} />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <h2 className="text-base font-bold text-[#0F172A]">Audit not found</h2>
            <p className="text-xs text-[#64748B] mt-1 mb-4">
              The requested audit could not be loaded.
            </p>
            <Link
              href="/dashboard/audits"
              className="px-4 py-2 bg-[#1E5642] text-white text-xs font-semibold rounded-lg"
            >
              Back to Content Audits
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Render paragraphs with highlighted sentences
  const renderHighlightedContent = () => {
    const paragraphs = audit.content.split('\n\n');

    return paragraphs.map((para, pIdx) => {
      let elements: React.ReactNode[] = [];
      let remaining = para;

      audit.findings.forEach((finding) => {
        if (remaining.includes(finding.matchedText)) {
          const parts = remaining.split(finding.matchedText);
          const isSelected = selectedFindingId === finding.id;

          elements.push(
            <span key={`p-${pIdx}-pre`}>{parts[0]}</span>
          );

          elements.push(
            <mark
              key={finding.id}
              onClick={() => handleOpenEvidence(finding)}
              className={`cursor-pointer transition-all rounded px-1 py-0.5 font-medium ${
                isSelected
                  ? 'bg-[#FDE68A] text-[#92400E] ring-2 ring-[#D97706]'
                  : 'bg-[#FEF3C7] text-[#92400E] hover:bg-[#FDE68A]'
              }`}
              title="Click to view evidence & source match"
            >
              {finding.matchedText}
              <span className="inline-block ml-1 px-1 text-[9px] font-bold rounded bg-[#D97706] text-white">
                {finding.category === 'originality' ? 'Plagiarism' : 'Unverified'}
              </span>
            </mark>
          );

          remaining = parts.slice(1).join(finding.matchedText);
        }
      });

      if (elements.length === 0) {
        return (
          <p key={pIdx} className="leading-relaxed text-[#334155] text-xs mb-4">
            {para}
          </p>
        );
      }

      elements.push(<span key={`p-${pIdx}-post`}>{remaining}</span>);

      return (
        <p key={pIdx} className="leading-relaxed text-[#334155] text-xs mb-4">
          {elements}
        </p>
      );
    });
  };

  return (
    <>
      <Header
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content audits', href: '/dashboard/audits' },
          { label: 'Audit results' }
        ]}
      />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6 pb-28">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/audits"
              className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-center text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  {audit.title}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                  {audit.aiModel}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  audit.status === 'Passed'
                    ? 'bg-[#DEF7EC] text-[#03543F]'
                    : audit.status === 'Needs review'
                    ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]/50'
                    : 'bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]/50'
                }`}>
                  {audit.status}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                {audit.contentType} · {audit.wordCount} words · {audit.images?.length || 0} images · Audited {audit.auditedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="px-3.5 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export report</span>
            </button>
            <Link
              href="/dashboard/new"
              className="px-3.5 py-2 rounded-xl bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>New audit</span>
            </Link>
          </div>
        </div>

        {/* AI Executive Summary Banner (if generated by AI) */}
        {audit.aiAnalysisSummary && (
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#16a34a] mt-0.5 flex-shrink-0" />
            <div className="text-xs text-[#166534]">
              <span className="font-bold">AI Intelligence Summary ({audit.sourceEngine || 'AI Engine'}):</span>{' '}
              {audit.aiAnalysisSummary}
            </div>
          </div>
        )}

        {/* 4-Metric Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Quality Score
            </span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className={`text-2xl font-black ${
                audit.qualityScore >= 85 ? 'text-[#03543F]' : audit.qualityScore >= 70 ? 'text-[#B45309]' : 'text-[#DC2626]'
              }`}>
                {audit.qualityScore}
              </span>
              <span className="text-xs text-[#94A3B8]">/ 100</span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              {audit.qualityScore >= 90
                ? 'Publish ready'
                : audit.qualityScore >= 70
                ? 'Improve before publishing'
                : 'High remediation needed'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Findings
            </span>
            <div className="mt-2">
              <span className="text-xl font-bold text-[#0F172A]">
                {audit.findings.length > 0 ? `${audit.findings.length} flags detected` : 'No issues'}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              {audit.findings.length > 0 ? 'Human review recommended' : 'All checks verified clean'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              AI Model / Engine
            </span>
            <div className="mt-2">
              <span className="text-xl font-bold text-[#0F172A] truncate block" title={audit.sourceEngine || audit.aiModel}>
                {audit.sourceEngine ? audit.sourceEngine.split(' ')[0] + ' AI' : audit.aiModel}
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              {audit.images && audit.images.length > 0 ? `Multimodal (${audit.images.length} imgs)` : 'Text scan'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-2xs">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Audit Status
            </span>
            <div className="mt-2">
              <span className="text-xl font-bold text-[#0F172A]">
                Completed
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] mt-1">
              {audit.auditedAt}
            </p>
          </div>
        </div>

        {/* Attached Visual Assets / Uploaded Images Gallery */}
        {audit.images && audit.images.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#1E5642]" />
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                  Attached Visual Assets ({audit.images.length})
                </h3>
              </div>
              <span className="text-[11px] text-[#64748B]">Audited for originality and visual safety</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-1">
              {audit.images.map((img) => (
                <div
                  key={img.id}
                  onClick={() => setPreviewImage(img)}
                  className="rounded-xl border border-[#E2E8F0] overflow-hidden bg-[#F8FAFC] group cursor-pointer hover:border-[#1E5642] transition-all relative"
                >
                  <img
                    src={img.dataUrl}
                    alt={img.name}
                    className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  <div className="p-2 bg-white">
                    <p className="text-[11px] font-semibold text-[#0F172A] truncate" title={img.name}>
                      {img.name}
                    </p>
                    <p className="text-[10px] text-[#64748B]">{img.size || 'Image'}</p>
                  </div>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-semibold gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Split-Pane Verification View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pane: Content with interactive highlights */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1E5642]" />
                <span className="text-xs font-bold text-[#0F172A]">
                  Audited Content
                </span>
                <span className="text-[10px] text-[#64748B]">
                  (Click highlighted sentences to inspect evidence)
                </span>
              </div>

              <button
                onClick={() => setIsEditingDraft(!isEditingDraft)}
                className="text-xs text-[#1E5642] font-semibold hover:underline flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingDraft ? 'Cancel editing' : 'Edit content'}</span>
              </button>
            </div>

            {isEditingDraft ? (
              <div className="space-y-4 flex-1">
                <textarea
                  rows={14}
                  value={editableContent}
                  onChange={(e) => setEditableContent(e.target.value)}
                  className="w-full p-4 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#1E5642]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setIsEditingDraft(false)}
                    className="px-3 py-1.5 rounded-lg border border-[#CBD5E1] text-xs text-[#475569]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEditedContent}
                    className="px-4 py-1.5 rounded-lg bg-[#1E5642] text-white text-xs font-semibold"
                  >
                    Re-run Audit on Revised Draft
                  </button>
                </div>
              </div>
            ) : (
              <div className="prose prose-sm max-w-none flex-1">
                {renderHighlightedContent()}
              </div>
            )}
          </div>

          {/* Right Pane: Findings Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-[#D97706]" />
                <span className="text-xs font-bold text-[#0F172A]">
                  Findings ({audit.findings.length})
                </span>
              </div>
              <span className="text-[11px] text-[#64748B]">
                Ranked by severity
              </span>
            </div>

            {audit.findings.length === 0 ? (
              <div className="p-8 bg-white rounded-2xl border border-[#BBF7D0] text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-[#1E5642] mx-auto" />
                <h4 className="text-xs font-bold text-[#0F172A]">All checks verified clean</h4>
                <p className="text-[11px] text-[#64748B]">No high priority plagiarism or factual risks detected.</p>
              </div>
            ) : (
              audit.findings.map((f) => {
                const isSelected = selectedFindingId === f.id;
                return (
                  <div
                    key={f.id}
                    onClick={() => setSelectedFindingId(f.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#D97706] bg-[#FFFBEB] shadow-sm'
                        : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        f.severity === 'high'
                          ? 'bg-[#FEF3C7] text-[#B45309]'
                          : 'bg-[#EFF6FF] text-[#2563EB]'
                      }`}>
                        {f.severity} priority · {f.category}
                      </span>
                      {f.similarityScore && (
                        <span className="text-[10px] font-semibold text-[#1E5642] bg-[#DEF7EC] px-1.5 py-0.5 rounded">
                          {f.similarityScore}% match
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-[#0F172A]">
                      {f.title}
                    </h4>

                    <p className="text-[11px] text-[#475569] leading-relaxed mt-1">
                      {f.description}
                    </p>

                    <div className="mt-3 pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                      <span className="text-[10px] text-[#94A3B8] truncate max-w-[180px]">
                        {f.sourceTitle || 'Fact check audit'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEvidence(f);
                        }}
                        className="text-xs font-semibold text-[#1E5642] hover:underline flex items-center gap-1"
                      >
                        Review finding →
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Sticky Decision Action Bar */}
        <div className="fixed bottom-0 left-64 right-0 p-4 px-8 bg-white/95 backdrop-blur-md border-t border-[#E2E8F0] shadow-lg flex items-center justify-between z-30">
          <div>
            <h4 className="text-xs font-bold text-[#0F172A]">
              Make the final call
            </h4>
            <p className="text-[11px] text-[#64748B]">
              All flags are suggestions. A reviewer decides what happens next.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditingDraft(true)}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              Edit content
            </button>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
            >
              Request changes
            </button>
            <button
              onClick={() => setIsApproveModalOpen(true)}
              className="px-5 py-2 rounded-xl bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Approve with note</span>
            </button>
          </div>
        </div>
      </main>

      {/* Evidence Dialog */}
      <EvidenceDialog
        finding={activeFinding}
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onApplySuggestion={(f) => {
          setEditableContent(editableContent.replace(f.matchedText, f.suggestion));
          setIsEditingDraft(true);
        }}
      />

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div 
            className="max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#F1F5F9]">
              <span className="text-xs font-bold text-[#0F172A]">{previewImage.name}</span>
              <button
                onClick={() => setPreviewImage(null)}
                className="text-[#94A3B8] hover:text-[#0F172A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={previewImage.dataUrl}
              alt={previewImage.name}
              className="max-w-full max-h-[70vh] object-contain mx-auto rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Approve Modal */}
      <ApproveDialog
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleApprove}
        auditTitle={audit.title}
      />

      {/* Request Changes Modal */}
      <RequestChangesDialog
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onConfirm={handleRequestChanges}
        auditTitle={audit.title}
      />
    </>
  );
}
