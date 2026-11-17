'use client';

import React from 'react';
import { X, ExternalLink, AlertTriangle, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react';
import { Finding } from '@/lib/types';

interface EvidenceDialogProps {
  finding: Finding | null;
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestion?: (finding: Finding) => void;
}

export default function EvidenceDialog({
  finding,
  isOpen,
  onClose,
  onApplySuggestion
}: EvidenceDialogProps) {
  if (!isOpen || !finding) return null;

  const isAccuracy = finding.category === 'accuracy';
  const isOriginality = finding.category === 'originality';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#F1F5F9] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              finding.severity === 'high' 
                ? 'bg-[#FEF3C7] text-[#D97706]' 
                : 'bg-[#EFF6FF] text-[#2563EB]'
            }`}>
              {isOriginality ? <ShieldAlert className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  finding.severity === 'high'
                    ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]/50'
                    : 'bg-[#E2E8F0] text-[#475569]'
                }`}>
                  {finding.severity} priority · {finding.category}
                </span>
                {finding.similarityScore && (
                  <span className="text-[10px] font-semibold text-[#1E5642] bg-[#DEF7EC] px-2 py-0.5 rounded-full">
                    {finding.similarityScore}% match confidence
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-[#0F172A] mt-1">
                {finding.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Matched sentence in audited document */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
              Flagged Content in Draft
            </label>
            <div className="p-3.5 rounded-xl bg-[#FFFBEB] border border-[#FCD34D]/60 text-xs font-medium text-[#0F172A] leading-relaxed">
              "{finding.matchedText}"
            </div>
          </div>

          {/* Finding Explanation */}
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1.5">
              Audit Analysis
            </label>
            <p className="text-xs text-[#475569] leading-relaxed">
              {finding.description}
            </p>
          </div>

          {/* Source Attribution or Benchmark if available */}
          {finding.sourceTitle && (
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-semibold text-[#64748B] block">
                  Reference Source / Benchmark
                </span>
                <p className="text-xs font-semibold text-[#0F172A] mt-0.5">
                  {finding.sourceTitle}
                </p>
              </div>
              {finding.sourceUrl && (
                <a
                  href={finding.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-[#1E5642] font-semibold hover:underline"
                >
                  Inspect source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}

          {/* Editorial Recommendation / Suggestion */}
          <div className="p-4 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#15803D] mb-1">
              <CheckCircle className="w-4 h-4" />
              <span>Recommended Revision</span>
            </div>
            <p className="text-xs text-[#166534] leading-relaxed">
              {finding.suggestion}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Dismiss
          </button>
          {onApplySuggestion && (
            <button
              onClick={() => {
                onApplySuggestion(finding);
                onClose();
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-xs transition-all"
            >
              <span>Accept suggestion</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
