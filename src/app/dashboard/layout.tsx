'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import InfoDialog from '@/components/modals/InfoDialog';
import { UserProvider, useUser } from '@/lib/user-context';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const { user } = useUser();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Fixed Left Sidebar with Google User Details */}
      <Sidebar
        onOpenInfoModal={() => setIsInfoModalOpen(true)}
        user={user}
      />

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {children}
      </div>

      {/* Info Dialog */}
      <InfoDialog
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </UserProvider>
  );
}
