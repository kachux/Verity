'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Plus, Key, LogOut, ChevronDown } from 'lucide-react';
import ApiKeyDialog from '@/components/modals/ApiKeyDialog';
import { useUser } from '@/lib/user-context';
import { User } from '@/lib/types';

interface HeaderProps {
  breadcrumb?: { label: string; href?: string }[];
  user?: Partial<User> | null;
  onSearchChange?: (val: string) => void;
}

export default function Header({
  breadcrumb = [{ label: 'Dashboard' }],
  user: propUser,
  onSearchChange
}: HeaderProps) {
  const { user: contextUser, logout } = useUser();
  const activeUser = propUser?.email ? propUser : contextUser;

  const [searchVal, setSearchVal] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; provider?: string }>({ configured: false });

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/settings/key')
      .then(res => res.json())
      .then(data => {
        if (data.configured) {
          setAiStatus({ configured: true, provider: data.provider });
        }
      })
      .catch(() => {});
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(e.target.value);
    if (onSearchChange) onSearchChange(e.target.value);
  };

  const displayName = activeUser?.name || 'Kasim Rahees';
  const displayEmail = activeUser?.email || 'admin@acmestudio.com';
  const displayAvatar = activeUser?.avatarUrl;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'G';

  return (
    <header className="h-16 border-b border-[#E2E8F0] bg-white sticky top-0 z-20 px-8 flex items-center justify-between">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        {breadcrumb.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && <span className="text-[#94A3B8]">/</span>}
            {crumb.href ? (
              <Link
                href={crumb.href}
                className="text-[#64748B] hover:text-[#0F172A] transition-colors font-medium"
              >
                {crumb.label}
              </Link>
            ) : (
              <span className={`font-semibold ${idx === breadcrumb.length - 1 ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchVal}
            onChange={handleSearch}
            placeholder="Search audits..."
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] text-xs text-[#0F172A] rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#1E5642] focus:bg-white transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Google User Profile Dropdown Button */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2.5 pl-2.5 pr-2 py-1 rounded-xl hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer group"
          >
            <div className="relative flex-shrink-0">
              {displayAvatar && !imageError ? (
                <img
                  src={displayAvatar}
                  alt={displayName}
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1] shadow-2xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-[#1E5642] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                  {initial}
                </div>
              )}
              {/* Google Brand badge on avatar */}
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full p-0.5 shadow-2xs border border-[#E2E8F0] flex items-center justify-center">
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              </div>
            </div>

            <div className="hidden lg:block text-left max-w-[150px]">
              <p className="text-xs font-bold text-[#0F172A] leading-tight truncate">
                {displayName}
              </p>
              <p className="text-[10px] text-[#64748B] leading-tight truncate font-medium">
                {displayEmail}
              </p>
            </div>

            <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] group-hover:text-[#475569] transition-colors ml-0.5" />
          </button>

          {/* Profile Dropdown Card */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-[#E2E8F0] rounded-2xl shadow-xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center gap-3 pb-3 border-b border-[#F1F5F9]">
                {displayAvatar && !imageError ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#1E5642]/20 shadow-xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-[#1E5642] text-white flex items-center justify-center font-extrabold text-base shadow-xs">
                    {initial}
                  </div>
                )}
                <div className="overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#0F172A] truncate">
                      {displayName}
                    </p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Active" />
                  </div>
                  <p className="text-[11px] text-[#64748B] truncate mt-0.5">
                    {displayEmail}
                  </p>
                </div>
              </div>

              {/* Google Verified Account Badge */}
              <div className="my-3 p-2.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-[11px] font-semibold text-[#334155]">Google Account</span>
                </div>
                <span className="text-[10px] font-bold text-[#1E5642] bg-[#DEF7EC] px-2 py-0.5 rounded-md">
                  Connected
                </span>
              </div>

              {/* API Key Settings */}
              <div className="pt-2 mt-2 border-t border-[#F1F5F9]">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowApiKeyModal(true);
                  }}
                  className="w-full flex items-center justify-between py-2 px-2.5 rounded-xl text-xs font-semibold text-[#334155] hover:bg-[#F8FAFC] border border-transparent hover:border-[#E2E8F0] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-[#64748B]" />
                    <span>API Key Settings</span>
                  </div>
                  {aiStatus.configured && (
                    <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                      Active
                    </span>
                  )}
                </button>
              </div>

              {/* Sign out */}
              <div className="pt-2 mt-1">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold text-[#DC2626] hover:bg-red-50 border border-transparent hover:border-red-100 transition-all cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Primary CTA: New Content Audit */}
        <Link
          href="/dashboard/new"
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#1E5642] hover:bg-[#164E3B] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>New audit</span>
        </Link>
      </div>

      {/* API Key Modal */}
      <ApiKeyDialog
        isOpen={showApiKeyModal}
        onClose={() => setShowApiKeyModal(false)}
        onKeySaved={(provider) => setAiStatus({ configured: true, provider })}
      />
    </header>
  );
}
