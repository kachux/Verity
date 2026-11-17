'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  FileCheck,
  PlusCircle,
  LogOut,
} from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { User } from '@/lib/types';

interface SidebarProps {
  onOpenInfoModal?: () => void;
  user?: Partial<User> | null;
}

export default function Sidebar({ onOpenInfoModal, user: propUser }: SidebarProps) {
  const pathname = usePathname();
  const { user: contextUser, logout } = useUser();
  const activeUser = propUser?.email ? propUser : contextUser;

  const [imageError, setImageError] = useState(false);

  const navItems = [
    { label: 'Dashboard & History', href: '/dashboard', icon: LayoutGrid },
    { label: 'Content Audits', href: '/dashboard/audits', icon: FileCheck },
    { label: 'New Content Audit', href: '/dashboard/new', icon: PlusCircle },
  ];

  const handleLogout = async () => {
    if (logout) {
      await logout();
    } else {
      try {
        await fetch('/api/auth/logout', { method: 'POST' });
      } finally {
        window.location.href = '/login';
      }
    }
  };

  const displayName = activeUser?.name || 'Kasim Rahees';
  const displayEmail = activeUser?.email || 'admin@acmestudio.com';
  const displayAvatar = activeUser?.avatarUrl;
  const initial = displayName ? displayName.charAt(0).toUpperCase() : 'G';

  return (
    <aside className="w-64 bg-white border-r border-[#E2E8F0] flex flex-col h-screen fixed left-0 top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-5 pb-5 border-b border-[#F1F5F9]">
        <Link href="/dashboard" className="block group">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#1E5642] flex items-center justify-center text-white font-bold text-base shadow-sm">
              v
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-[#0F172A]">
              verity
            </span>
          </div>
          <span className="text-[10px] tracking-widest font-semibold text-[#64748B] block mt-1 uppercase">
            AI Content Intelligence
          </span>
        </Link>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <p className="px-3 text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase mb-2">
            Navigation
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#1E5642]/10 text-[#1E5642] font-semibold'
                      : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#1E5642]' : 'text-[#64748B]'}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile & Status Widget */}
      <div className="p-4 border-t border-[#E2E8F0] bg-[#FAFAFA] space-y-3">
        {/* Google User Details Card */}
        <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative flex-shrink-0">
                {displayAvatar && !imageError ? (
                  <img
                    src={displayAvatar}
                    alt={displayName}
                    referrerPolicy="no-referrer"
                    onError={() => setImageError(true)}
                    className="w-8 h-8 rounded-full object-cover border border-[#CBD5E1]"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#1E5642] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                    {initial}
                  </div>
                )}
                {/* Google logo badge */}
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-white rounded-full p-0.5 shadow-2xs border border-[#E2E8F0] flex items-center justify-center">
                  <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                </div>
              </div>

              <div className="truncate">
                <p className="text-xs font-bold text-[#0F172A] truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-[#64748B] truncate font-medium">
                  {displayEmail}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sign out"
              className="text-[#94A3B8] hover:text-[#DC2626] transition-colors p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-[10px]">
            <span className="text-[#64748B] font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Google Account
            </span>
            <span className="text-[#1E5642] font-semibold">Verified</span>
          </div>
        </div>

        {/* Operational Health indicator */}
        <div className="flex items-center gap-2 px-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] text-[#64748B] font-medium">All systems operational</span>
        </div>
      </div>
    </aside>
  );
}
