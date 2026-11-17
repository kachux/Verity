'use client';

import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface ApiKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: (provider: string) => void;
}

export default function ApiKeyDialog({ isOpen, onClose, onKeySaved }: ApiKeyDialogProps) {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ configured: boolean; maskedKey?: string; provider?: string } | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/settings/key')
        .then(res => res.json())
        .then(data => setStatus(data))
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch('/api/settings/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save key');

      setMessage(data.message);
      setStatus({ configured: true, maskedKey: `${apiKey.slice(0, 6)}••••••••`, provider: data.provider });
      if (onKeySaved) onKeySaved(data.provider);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#F1F5F9]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1E5642]/10 text-[#1E5642] flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">AI Engine & API Key</h3>
              <p className="text-[11px] text-[#64748B]">Power audits with ZeroGPT, Gemini, or OpenAI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#94A3B8] hover:text-[#0F172A]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {status?.configured && (
          <div className="p-3 rounded-xl bg-[#DEF7EC] border border-[#BBF7D0] flex items-center gap-2.5 text-xs text-[#03543F]">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-[#16a34a]" />
            <div>
              <p className="font-semibold">AI Audit Active ({status.provider})</p>
              <p className="text-[11px] opacity-80">Key: {status.maskedKey}</p>
            </div>
          </div>
        )}

        {message && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#334155] mb-1.5">
              Enter ZeroGPT, Gemini, or OpenAI API Key
            </label>
            <input
              type="password"
              required
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="e.g. your-key-... or AIzaSy... or sk-..."
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#1E5642] focus:bg-white font-mono"
            />
            <p className="text-[11px] text-[#94A3B8] mt-1">
              ZeroGPT DeepAnalyze provides state-of-the-art AI detection with sentence-level probability scoring.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 border border-[#CBD5E1] text-xs font-semibold text-[#475569] rounded-xl hover:bg-[#F8FAFC]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="px-4 py-2 bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Save & Connect AI</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
