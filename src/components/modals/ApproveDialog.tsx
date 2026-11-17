'use client';

import React, { useState } from 'react';
import { X, CheckCircle, Send } from 'lucide-react';

interface ApproveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: string) => void;
  auditTitle: string;
}

export default function ApproveDialog({
  isOpen,
  onClose,
  onConfirm,
  auditTitle
}: ApproveDialogProps) {
  const [note, setNote] = useState('Reviewed all flagged sentences and verified with marketing leadership.');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b border-[#F1F5F9] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#DEF7EC] text-[#03543F] flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Approve audit with note
              </h3>
              <p className="text-xs text-[#64748B] mt-0.5 truncate max-w-xs">
                {auditTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-[#475569]">
            Approving this audit marks the content as <span className="font-semibold text-[#03543F]">Passed</span> and ready for publication. Provide a sign-off note for your team's compliance audit trail.
          </p>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Reviewer Sign-off Note
            </label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Legal verified customer quotes, approved for launch..."
              className="w-full p-3 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E5642] focus:ring-1 focus:ring-[#1E5642] transition-all resize-none"
            />
          </div>
        </div>

        <div className="p-4 px-6 border-t border-[#F1F5F9] bg-[#FAFAFA] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-[#E2E8F0] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(note);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Confirm & Approve</span>
          </button>
        </div>
      </div>
    </div>
  );
}
