'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import {
  FileCheck,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Clock,
  Layers,
  History,
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { AuditItem, WorkspaceStats } from '@/lib/types';
import { useUser } from '@/lib/user-context';

export default function WorkspaceOverview() {
  const { user } = useUser();
  const [stats, setStats] = useState<WorkspaceStats | null>(null);
  const [audits, setAudits] = useState<AuditItem[]>([]);
  const [searchHistory, setSearchHistory] = useState('');
  const [historyFilter, setHistoryFilter] = useState<'All' | 'Passed' | 'Needs review' | 'Flagged'>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, auditsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/audits')
        ]);
        const statsData = await statsRes.json();
        const auditsData = await auditsRes.json();

        setStats(statsData.stats);
        setAudits(auditsData.audits || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Passed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#DEF7EC] text-[#03543F]">
            Passed
          </span>
        );
      case 'Needs review':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]/50">
            Needs review
          </span>
        );
      case 'Flagged':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B] border border-[#FCA5A5]/50">
            Flagged
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569]">
            {status}
          </span>
        );
    }
  };

  const filteredHistory = audits.filter(item => {
    const matchesFilter = historyFilter === 'All' || item.status === historyFilter;
    const matchesSearch = !searchHistory || (
      item.title.toLowerCase().includes(searchHistory.toLowerCase()) ||
      item.contentType.toLowerCase().includes(searchHistory.toLowerCase()) ||
      item.content.toLowerCase().includes(searchHistory.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <Header
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Dashboard & History' }]}
        onSearchChange={(q) => setSearchHistory(q)}
      />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Welcome Section with Google User Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name || 'User'}
                  referrerPolicy="no-referrer"
                  className="w-13 h-13 rounded-full object-cover border-2 border-[#1E5642]/20 shadow-xs"
                />
              ) : (
                <div className="w-13 h-13 rounded-full bg-[#1E5642] text-white flex items-center justify-center font-bold text-lg shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
              )}
              {/* Google Brand badge */}
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full p-0.5 shadow-2xs border border-[#E2E8F0] flex items-center justify-center">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                  Welcome back{user?.name ? `, ${user.name}` : ''}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#DEF7EC] text-[#03543F] border border-[#BBF7D0]">
                  Google Account
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                <span className="font-medium text-[#334155]">{user?.email || 'admin@acmestudio.com'}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/audits"
              className="px-4 py-2 rounded-lg bg-white border border-[#CBD5E1] text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] transition-colors"
            >
              Content audits table
            </Link>
            <Link
              href="/dashboard/new"
              className="px-4 py-2 rounded-lg bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-xs flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start an audit</span>
            </Link>
          </div>
        </div>

        {/* Primary Metric Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Audits run */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Total Audits Run
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] text-[#1E5642] flex items-center justify-center">
                <FileCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F172A]">
                {stats?.auditsRun.toLocaleString() || '1,284'}
              </span>
              <span className="text-xs font-medium text-[#1E5642] flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this mo
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Total historical scans performed
            </p>
          </div>

          {/* Card 2: Originality Average */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Originality Index
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#F5F3FF] text-[#7C3AED] flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F172A]">
                {stats?.originalityAverage || '88'}%
              </span>
              <span className="text-xs font-medium text-[#1E5642]">
                Target: &gt;85%
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Average originality across all documents
            </p>
          </div>

          {/* Card 3: Flagged Content */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Flagged for Review
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F172A]">
                {stats?.flaggedItems || '96'}
              </span>
              <span className="text-xs font-medium text-[#D97706]">
                Requires edit
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Contains duplicate phrasing or unverified claims
            </p>
          </div>

          {/* Card 4: Accuracy Score */}
          <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Factual Accuracy
              </span>
              <div className="w-8 h-8 rounded-lg bg-[#DEF7EC] text-[#03543F] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-[#0F172A]">
                {stats?.accuracyAverage || '91'}%
              </span>
              <span className="text-xs font-medium text-[#1E5642]">
                Verified
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] mt-1">
              Benchmark citations & claims checked
            </p>
          </div>
        </div>

        {/* Feature Banner: Start a new audit */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1E5642] to-[#164E3B] text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold tracking-wide backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-emerald-300" />
              <span>Verity Intelligent Guardrails</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              From first draft to publish-ready
            </h2>
            <p className="text-xs text-white/80 leading-relaxed">
              Run a new audit on draft text or marketing copy to scan for duplicate phrasing, unverified claims, and brand compliance.
            </p>
          </div>
          <Link
            href="/dashboard/new"
            className="flex-shrink-0 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-[#1E5642] text-xs font-bold shadow-md transition-all active:scale-[0.98] flex items-center gap-2 self-start md:self-auto"
          >
            <span>Start an audit</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Comprehensive Audit History Section */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden space-y-4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
            <div>
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#1E5642]" />
                <h3 className="text-base font-bold text-[#0F172A]">
                  Whole Details of Audit History
                </h3>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Detailed timeline log of all content audits, originality findings, and reviewer actions.
              </p>
            </div>

            {/* History Filter Pills & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg p-0.5 text-xs">
                {(['All', 'Needs review', 'Flagged', 'Passed'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setHistoryFilter(tab)}
                    className={`px-3 py-1 rounded-md font-semibold transition-all ${
                      historyFilter === tab
                        ? 'bg-white text-[#1E5642] shadow-2xs'
                        : 'text-[#64748B] hover:text-[#0F172A]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-48">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchHistory}
                  onChange={(e) => setSearchHistory(e.target.value)}
                  placeholder="Search history..."
                  className="w-full text-xs pl-8 pr-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg focus:outline-none focus:border-[#1E5642]"
                />
              </div>
            </div>
          </div>

          {/* Chronological Detailed History Cards */}
          <div className="space-y-4 pt-2">
            {filteredHistory.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] hover:shadow-xs transition-all bg-[#FAFAFA]/50 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-bold text-[#64748B] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {item.auditedAt}
                      </span>
                      <span className="text-[#CBD5E1]">•</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-white border border-[#E2E8F0] text-[#334155]">
                        {item.contentType}
                      </span>
                      <span className="text-[#CBD5E1]">•</span>
                      <span className="text-[11px] text-[#64748B]">
                        {item.wordCount} words
                      </span>
                      <span className="text-[#CBD5E1]">•</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                        Model: {item.aiModel}
                      </span>
                    </div>

                    <Link href={`/dashboard/audits/${item.id}`} className="block">
                      <h4 className="text-sm font-bold text-[#0F172A] group-hover:text-[#1E5642] transition-colors mt-1">
                        {item.title}
                      </h4>
                    </Link>

                    <p className="text-xs text-[#475569] line-clamp-2 max-w-3xl leading-relaxed mt-0.5">
                      {item.content}
                    </p>
                  </div>

                  {/* Right side scores & action */}
                  <div className="flex items-center gap-4 lg:self-center pt-2 lg:pt-0 border-t lg:border-t-0 border-[#F1F5F9]">
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="text-xs text-[#64748B]">Score:</span>
                        <strong className="text-sm font-extrabold text-[#0F172A]">
                          {item.qualityScore} / 100
                        </strong>
                      </div>
                      <div className="mt-1">
                        {getStatusBadge(item.status)}
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/audits/${item.id}`}
                      className="px-3.5 py-2 rounded-xl bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-all"
                    >
                      <span>View details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Findings summary pills if any issues found */}
                {item.findings.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[#E2E8F0] flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider">
                      Detected Findings ({item.findings.length}):
                    </span>
                    {item.findings.map(f => (
                      <span
                        key={f.id}
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${
                          f.category === 'originality'
                            ? 'bg-[#FEF3C7] text-[#B45309] border border-[#FCD34D]/50'
                            : 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]'
                        }`}
                      >
                        {f.title} ({f.similarityScore ? `${f.similarityScore}% match` : f.severity})
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
