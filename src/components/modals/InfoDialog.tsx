'use client';

import React from 'react';
import { X, Sparkles } from 'lucide-react';

interface InfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InfoDialog({ isOpen, onClose }: InfoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-2 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E5642]/10 text-[#1E5642] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] tracking-tight">
                Prototype preview
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5">
                This flow uses sample data and prefilled controls.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body (Matching exact copy from Figma Node 7-1588) */}
        <div className="px-6 py-4">
          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#475569] leading-relaxed space-y-2">
            <p>
              This preview uses sample content and prefilled controls. Factual accuracy is required for the sample audit. Real sign-in, uploads, and downloads are not performed in the prototype view.
            </p>
            <p className="text-[11px] text-[#64748B]">
              In this live full-stack system, you can test live plagiarism and fact-checking audits, add new content, inspect highlighted sentences, and review audit decisions.
            </p>
          </div>
        </div>

        {/* Footer with primary Got it button */}
        <div className="p-6 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-[#1E5642] hover:bg-[#164E3B] text-white text-sm font-semibold shadow-sm transition-all active:scale-[0.99] text-center"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
