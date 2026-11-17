'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import ApiKeyDialog from '@/components/modals/ApiKeyDialog';
import {
  Upload,
  FileText,
  CheckSquare,
  Square,
  Sparkles,
  ArrowRight,
  X,
  Key,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AttachedImage } from '@/lib/types';

const SAMPLE_COPY = `A smarter way to manage your team is not about adding more tools, but connecting existing conversations.

In today's fast-paced digital world, content velocity has skyrocketed thanks to generative artificial intelligence. But velocity without clarity introduces organizational debt.

Our customers save 40% of their time every week through automated triage and smart workflow orchestration. When team members no longer have to manually sync updates across platforms, they can focus on high-impact strategic initiatives.

Acme Studio is the only platform with end-to-end encryption that satisfies all standard enterprise protocols without plugins. We guarantee zero friction integration across your tech stack with complete visibility.

Teams that adopt integrated workflows reduce context switching by half within ninety days. With automated checkpoints, every piece of collateral is audited for authenticity, factual accuracy, and brand alignment before reaching customer touchpoints.`;

export default function NewAuditPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [title, setTitle] = useState('A smarter way to manage your team');
  const [contentType, setContentType] = useState('Landing page');
  const [content, setContent] = useState(SAMPLE_COPY);
  const [aiModel, setAiModel] = useState<'ZeroGPT' | 'Claude 3.5' | 'GPT-4o' | 'Gemini 1.5' | 'Human authored'>('ZeroGPT');

  // Attached Images State
  const [images, setImages] = useState<AttachedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // AI Key State
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(false);
  const [aiProvider, setAiProvider] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings/key')
      .then(res => res.json())
      .then(data => {
        if (data.configured) {
          setAiConfigured(true);
          setAiProvider(data.provider);
        }
      })
      .catch(() => {});
  }, []);

  // Checklist State (What should we check?)
  const [checks, setChecks] = useState({
    factualAccuracy: true,
    originality: true,
    brandAlignment: true,
    safetyCompliance: true,
  });

  // Audit In-Progress state (Node 5:605)
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(1);
  const [auditProgress, setAuditProgress] = useState(0);

  // Word count
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  const handleUseSample = () => {
    setTitle('A smarter way to manage your team');
    setContentType('Landing page');
    setContent(SAMPLE_COPY);
  };

  const handleClear = () => {
    setContent('');
    setTitle('');
  };

  // Image upload handling
  const processFiles = (fileList: FileList) => {
    const newImages: AttachedImage[] = [];

    Array.from(fileList).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
        const sizeDisplay = file.size > 1024 * 1024 ? `${sizeMb} MB` : `${Math.round(file.size / 1024)} KB`;

        setImages(prev => [
          ...prev,
          {
            id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            dataUrl,
            size: sizeDisplay
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  const handleStartAudit = async () => {
    if (!content.trim() && images.length === 0) return;

    setIsAuditing(true);
    setAuditStep(1);
    setAuditProgress(15);

    // Step 1: Text & images prepared
    setTimeout(() => {
      setAuditStep(2);
      setAuditProgress(40);
    }, 700);

    // Step 2: Quality & accuracy
    setTimeout(() => {
      setAuditStep(3);
      setAuditProgress(70);
    }, 1500);

    // Step 3: Originality & AI Plagiarism scan
    setTimeout(() => {
      setAuditStep(4);
      setAuditProgress(90);
    }, 2300);

    try {
      const res = await fetch('/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          contentType,
          content,
          images,
          aiModel,
          checksConfig: checks
        })
      });

      const data = await res.json();

      setTimeout(() => {
        setAuditProgress(100);
        if (data.audit?.id) {
          router.push(`/dashboard/audits/${data.audit.id}`);
        } else {
          router.push('/dashboard/audits');
        }
      }, 3100);
    } catch (err) {
      console.error(err);
      setIsAuditing(false);
    }
  };

  return (
    <>
      <Header
        breadcrumb={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Content audits', href: '/dashboard/audits' },
          { label: 'New audit' }
        ]}
      />

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full pb-28">
        {/* If in progress, show Live Scanner */}
        {isAuditing ? (
          <div className="py-12 px-6 max-w-xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-300">
            <div className="space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1E5642]/10 text-[#1E5642] mb-2">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h2 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Running your content audit
              </h2>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                Scanning draft text {images.length > 0 ? `and ${images.length} attached image(s)` : ''} for quality, originality, and risk.
              </p>
            </div>

            {/* Progress Bar Container */}
            <div className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm space-y-6 text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-[#0F172A]">Audit Progress</span>
                  <span className="text-[#1E5642]">{auditProgress}%</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1E5642] h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${auditProgress}%` }}
                  />
                </div>
              </div>

              {/* Steps Checklist */}
              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    auditStep > 1 ? 'bg-[#DEF7EC] text-[#03543F]' : 'bg-[#1E5642] text-white animate-spin'
                  }`}>
                    {auditStep > 1 ? '✓' : '⭘'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Text & visual assets prepared</p>
                    <p className="text-[11px] text-[#64748B]">
                      {wordCount} words · {images.length} images · {contentType}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    auditStep > 2 ? 'bg-[#DEF7EC] text-[#03543F]' : auditStep === 2 ? 'bg-[#1E5642] text-white animate-pulse' : 'bg-[#E2E8F0] text-[#94A3B8]'
                  }`}>
                    {auditStep > 2 ? '✓' : '⭘'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Checking quality and accuracy</p>
                    <p className="text-[11px] text-[#64748B]">
                      Reviewing claims, statistics, and image consistency
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    auditStep > 3 ? 'bg-[#DEF7EC] text-[#03543F]' : auditStep === 3 ? 'bg-[#1E5642] text-white animate-pulse' : 'bg-[#E2E8F0] text-[#94A3B8]'
                  }`}>
                    {auditStep > 3 ? '✓' : '⭘'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">AI Originality & plagiarism scan</p>
                    <p className="text-[11px] text-[#64748B]">
                      Scanning web corpora, Wikipedia, and published benchmarks
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    auditStep > 4 || auditProgress === 100 ? 'bg-[#DEF7EC] text-[#03543F]' : auditStep === 4 ? 'bg-[#1E5642] text-white animate-pulse' : 'bg-[#E2E8F0] text-[#94A3B8]'
                  }`}>
                    {auditStep > 4 || auditProgress === 100 ? '✓' : '⭘'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#0F172A]">Preparing your report</p>
                    <p className="text-[11px] text-[#64748B]">
                      Compiling interactive evidence cards and reviewer recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal Form Screen */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                  Upload content & images
                </h1>
                <p className="text-xs text-[#64748B] mt-1">
                  Audit text copy, attached images, originality, factual claims, and tone with AI.
                </p>
              </div>

              {/* AI Key Status Button */}
              <button
                type="button"
                onClick={() => setShowKeyModal(true)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all self-start sm:self-auto ${
                  aiConfigured
                    ? 'bg-[#DEF7EC] border-[#BBF7D0] text-[#03543F]'
                    : 'bg-white border-[#CBD5E1] text-[#334155] hover:bg-[#F8FAFC]'
                }`}
              >
                {aiConfigured ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                    <span>AI Connected ({aiProvider?.split(' ')[0]})</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>Configure AI API Key</span>
                  </>
                )}
              </button>
            </div>

            {/* Content Input Card */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Audit Name / Document Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. A smarter way to manage your team"
                    className="w-full px-3.5 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#1E5642] focus:bg-white transition-all font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#334155] uppercase tracking-wider mb-1">
                    Content Type
                  </label>
                  <select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] focus:outline-none focus:border-[#1E5642] focus:bg-white transition-all"
                  >
                    <option value="Landing page">Landing page</option>
                    <option value="Blog post">Blog post</option>
                    <option value="Whitepaper">Whitepaper</option>
                    <option value="Product guide">Product guide</option>
                    <option value="Social copy">Social copy</option>
                  </select>
                </div>
              </div>

              {/* Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Content Text
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleUseSample}
                      className="text-xs text-[#1E5642] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Use sample landing page</span>
                    </button>
                    {content && (
                      <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs text-[#64748B] hover:text-[#DC2626]"
                      >
                        Clear text
                      </button>
                    )}
                  </div>
                </div>

                <textarea
                  rows={7}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your text or marketing copy here..."
                  className="w-full p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl text-xs text-[#0F172A] leading-relaxed focus:outline-none focus:border-[#1E5642] focus:bg-white transition-all resize-y"
                />

                <div className="flex items-center justify-between mt-1 text-[11px] text-[#64748B]">
                  <span>
                    <strong className="text-[#0F172A]">{wordCount}</strong> words
                  </span>
                  <span>Up to 10,000 words per audit</span>
                </div>
              </div>

              {/* Interactive Image Uploader with Previews */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wider">
                    Attached Images & Visual Assets ({images.length} / 5)
                  </label>
                  <span className="text-[11px] text-[#64748B]">PNG, JPG, WebP, GIF · Max 10 MB each</span>
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer group ${
                    isDragging
                      ? 'border-[#1E5642] bg-[#F0FDF4]'
                      : 'border-[#CBD5E1] hover:border-[#1E5642] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="w-10 h-10 rounded-full bg-[#F1F5F9] text-[#64748B] group-hover:text-[#1E5642] group-hover:bg-[#E8F5E9] flex items-center justify-center mx-auto mb-2 transition-colors">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-[#0F172A]">
                    Click to browse images or drag and drop files here
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mt-0.5">
                    Images are analyzed by the multimodal AI engine alongside your text copy.
                  </p>
                </div>

                {/* Image Previews Grid */}
                {images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-3">
                    {images.map(img => (
                      <div
                        key={img.id}
                        className="relative rounded-xl border border-[#E2E8F0] overflow-hidden bg-white shadow-2xs group"
                      >
                        <img
                          src={img.dataUrl}
                          alt={img.name}
                          className="w-full h-24 object-cover"
                        />
                        <div className="p-2">
                          <p className="text-[11px] font-semibold text-[#0F172A] truncate" title={img.name}>
                            {img.name}
                          </p>
                          <p className="text-[10px] text-[#64748B]">{img.size}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(img.id);
                          }}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center opacity-80 group-hover:opacity-100 hover:bg-red-600 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A]">
                    What should we check?
                  </h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Configure the intelligence layers to apply to this draft.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#64748B]">Source AI Model:</span>
                  <select
                    value={aiModel}
                    onChange={(e: any) => setAiModel(e.target.value)}
                    className="p-1.5 px-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#0F172A]"
                  >
                    <option value="ZeroGPT">ZeroGPT (DeepAnalyze)</option>
                    <option value="Claude 3.5">Claude 3.5</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="Gemini 1.5">Gemini 1.5</option>
                    <option value="Human authored">Human authored</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] flex items-start gap-3">
                  <div className="mt-0.5 text-[#166534]">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#14532d]">Factual accuracy</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#166534] bg-white/70 px-1.5 py-0.2 rounded border border-[#BBF7D0]">
                        Required
                      </span>
                    </div>
                    <p className="text-[11px] text-[#166534] mt-0.5">
                      Claims, sources, benchmark statistics, and reliability.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setChecks({ ...checks, originality: !checks.originality })}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    checks.originality
                      ? 'border-[#1E5642] bg-[#1E5642]/5'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className={`mt-0.5 ${checks.originality ? 'text-[#1E5642]' : 'text-[#94A3B8]'}`}>
                    {checks.originality ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A]">Originality & Plagiarism</span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Reused or unoriginal content, duplicated phrasing, and web similarity.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setChecks({ ...checks, brandAlignment: !checks.brandAlignment })}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    checks.brandAlignment
                      ? 'border-[#1E5642] bg-[#1E5642]/5'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className={`mt-0.5 ${checks.brandAlignment ? 'text-[#1E5642]' : 'text-[#94A3B8]'}`}>
                    {checks.brandAlignment ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A]">Brand alignment</span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Tone, clarity, enterprise voice, and corporate consistency.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setChecks({ ...checks, safetyCompliance: !checks.safetyCompliance })}
                  className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    checks.safetyCompliance
                      ? 'border-[#1E5642] bg-[#1E5642]/5'
                      : 'border-[#E2E8F0] bg-white hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className={`mt-0.5 ${checks.safetyCompliance ? 'text-[#1E5642]' : 'text-[#94A3B8]'}`}>
                    {checks.safetyCompliance ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0F172A]">Safety & compliance</span>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      Harmful, sensitive, or regulatory compliance risks.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Footer */}
            <div className="p-4 px-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#1E5642]/10 text-[#1E5642] flex items-center justify-center font-bold text-xs">
                  ✓
                </div>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">Your content is ready</p>
                  <p className="text-[11px] text-[#64748B]">
                    {wordCount} words {images.length > 0 ? `+ ${images.length} image(s)` : ''} configured for verification.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => router.push('/dashboard/audits')}
                  className="px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white text-xs font-semibold text-[#475569] hover:bg-[#F8FAFC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartAudit}
                  disabled={!content.trim() && images.length === 0}
                  className="px-5 py-2.5 rounded-xl bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
                >
                  <span>Run audit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* API Key Modal */}
      <ApiKeyDialog
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onKeySaved={(provider) => {
          setAiConfigured(true);
          setAiProvider(provider);
        }}
      />
    </>
  );
}
