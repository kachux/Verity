'use client';

import React, { useState } from 'react';
import { X, AlertCircle, Send } from 'lucide-react';

interface RequestChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string, assignedTo: string) => void;
  auditTitle: string;
}

export default function RequestChangesDialog({
  isOpen,
  onClose,
  onConfirm,
  auditTitle
}: RequestChangesDialogProps) {
  const [reason, setReason] = useState('Please revise the flagged 40% performance metric and provide citation from the SaaStr survey.');
  const [assignedTo, setAssignedTo] = useState('Sarah Jenkins (Author)');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden transform animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 pb-4 border-b border-[#F1F5F9] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                Request changes
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

        <div className="p-6 space-y-4">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Assignee for Revision
            </label>
            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#1E5642]"
            >
              <option value="Sarah Jenkins (Author)">Sarah Jenkins (Author)</option>
              <option value="Alex Chen (Marketing)">Alex Chen (Marketing)</option>
              <option value="Kasim Rahees (Lead)">Kasim Rahees (Lead)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] block mb-1">
              Feedback & Required Edits
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Specify what needs to be changed..."
              className="w-full p-3 rounded-xl border border-[#CBD5E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#1E5642] transition-all resize-none"
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
              onConfirm(reason, assignedTo);
              onClose();
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send Request</span>
          </button>
        </div>
      </div>
    </div>
  );
}
