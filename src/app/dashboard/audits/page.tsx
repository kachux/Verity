'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import {
  Search,
  ArrowRight,
  Plus,
  Trash2,
  Sparkles,
  FileCheck,
  History,
  Table as TableIcon,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { AuditItem } from '@/lib/types';

export default function ContentAuditsPage() {
  const [audits, setAudits] = useState<AuditItem[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Flagged' | 'Needs review' | 'Passed'>('All');
  const [viewMode, setViewMode] = useState<'table' | 'history'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/audits?status=${selectedFilter}&q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setAudits(data.audits || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, [selectedFilter, searchQuery]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this content audit?')) return;
    try {
      await fetch(`/api/audits/${id}`, { method: 'DELETE' });
      setAudits(audits.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

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

  return (
    <>
      <Header
        breadcrumb={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Content audits' }]}
        onSearchChange={(q) => setSearchQuery(q)}
      />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
              Content Audits & History
            </h1>
            <p className="text-xs text-[#64748B] mt-1">
              Search, filter, and inspect past originality and factual accuracy audit runs.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* View switcher */}
            <div className="flex items-center bg-white border border-[#CBD5E1] rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'table'
                    ? 'bg-[#1E5642] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Table view</span>
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'history'
                    ? 'bg-[#1E5642] text-white shadow-2xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>History view</span>
              </button>
            </div>

            <Link
              href="/dashboard/new"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>New content audit</span>
            </Link>
          </div>
        </div>

        {/* Filter Pills and Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          {/* Pills matching Figma Node 5:338 */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedFilter('All')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'All'
                  ? 'bg-[#1E5642] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
            >
              All content <span className="opacity-80">({audits.length})</span>
            </button>

            <button
              onClick={() => setSelectedFilter('Flagged')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'Flagged'
                  ? 'bg-[#1E5642] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
            >
              Flagged
            </button>

            <button
              onClick={() => setSelectedFilter('Needs review')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'Needs review'
                  ? 'bg-[#1E5642] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
            >
              Needs review
            </button>

            <button
              onClick={() => setSelectedFilter('Passed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedFilter === 'Passed'
                  ? 'bg-[#1E5642] text-white shadow-xs'
                  : 'bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
            >
              Passed
            </button>
          </div>

          {/* Search input in table */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title or keyword..."
              className="w-full bg-white border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-[#1E5642]"
            />
          </div>
        </div>

        {/* View Mode 1: Table View */}
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-5">Content</th>
                    <th className="py-3 px-4">AI Model</th>
                    <th className="py-3 px-4">Quality Score</th>
                    <th className="py-3 px-4">Findings</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Audited</th>
                    <th className="py-3 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9] text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#64748B]">
                        <div className="inline-block w-6 h-6 border-2 border-[#1E5642] border-t-transparent rounded-full animate-spin mb-2" />
                        <p>Loading audits...</p>
                      </td>
                    </tr>
                  ) : audits.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#64748B]">
                        <FileCheck className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
                        <p className="font-semibold text-[#0F172A]">No audits matching your filter</p>
                      </td>
                    </tr>
                  ) : (
                    audits.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-[#F8FAFC]/80 transition-colors group cursor-pointer"
                      >
                        <td className="py-3.5 px-5">
                          <Link href={`/dashboard/audits/${item.id}`} className="block">
                            <p className="font-semibold text-[#0F172A] group-hover:text-[#1E5642] transition-colors">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-[#64748B] mt-0.5">
                              {item.contentType} · {item.wordCount} words
                            </p>
                          </Link>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#475569]">
                            {item.aiModel}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-[#0F172A]">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center text-xs font-bold">
                              {item.qualityScore}
                            </div>
                            <span className="text-[10px] text-[#64748B]">/ 100</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          {item.findings.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {item.findings.slice(0, 2).map((f) => (
                                <span
                                  key={f.id}
                                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                                    f.category === 'originality'
                                      ? 'bg-[#FEF3C7] text-[#B45309]'
                                      : 'bg-[#EFF6FF] text-[#2563EB]'
                                  }`}
                                >
                                  {f.category}
                                </span>
                              ))}
                              {item.findings.length > 2 && (
                                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B]">
                                  +{item.findings.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#1E5642] font-semibold">
                              Passed (0 issues)
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {getStatusBadge(item.status)}
                        </td>

                        <td className="py-3.5 px-4 text-[#64748B] text-[11px]">
                          {item.auditedAt}
                        </td>

                        <td className="py-3.5 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/dashboard/audits/${item.id}`}
                              className="px-2.5 py-1 rounded-md bg-[#1E5642]/10 hover:bg-[#1E5642] text-[#1E5642] hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1"
                            >
                              Inspect <ArrowRight className="w-3 h-3" />
                            </Link>
                            <button
                              onClick={(e) => handleDelete(e, item.id)}
                              className="p-1 rounded text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* View Mode 2: Detailed History View */
          <div className="space-y-4">
            {audits.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-4 hover:border-[#CBD5E1] transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1F5F9]">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1E5642]/10 text-[#1E5642] flex items-center justify-center font-bold text-xs">
                      {item.contentType[0]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#0F172A]">{item.title}</h3>
                      <p className="text-xs text-[#64748B]">
                        {item.contentType} · {item.wordCount} words · AI Model: {item.aiModel}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#94A3B8]" /> Audited {item.auditedAt}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                </div>

                <div className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0]">
                  "{item.content.slice(0, 240)}..."
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-4 text-xs">
                    <div>
                      <span className="text-[#64748B]">Quality:</span>{' '}
                      <strong className="text-[#0F172A]">{item.qualityScore}/100</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Originality:</span>{' '}
                      <strong className="text-[#1E5642]">{item.originalityScore}%</strong>
                    </div>
                    <div>
                      <span className="text-[#64748B]">Findings:</span>{' '}
                      <strong className="text-[#D97706]">{item.findings.length} flagged</strong>
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/audits/${item.id}`}
                    className="px-4 py-2 bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all self-end sm:self-auto"
                  >
                    <span>View audit details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
