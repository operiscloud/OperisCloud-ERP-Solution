'use client';

import { DashboardNav } from '@/components/layout/DashboardNav';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useState } from 'react';

interface DashboardLayoutClientProps {
  user: {
    firstName: string | null;
    lastName: string | null;
  };
  tenant: {
    id: string;
    name: string;
    logo: string | null;
    plan: string;
    enabledModules: string[];
    currency: string;
  };
  children: React.ReactNode;
}

export function DashboardLayoutClient({ user, tenant, children }: DashboardLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuClick = () => {
    console.log('Menu clicked, opening:', !isMobileMenuOpen);
    setIsMobileMenuOpen(true);
  };

  const handleCloseMenu = () => {
    console.log('Closing menu');
    setIsMobileMenuOpen(false);
  };

  console.log('Menu state:', isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav
        tenant={tenant}
        enabledModules={tenant.enabledModules}
        plan={tenant.plan}
        isMobileMenuOpen={isMobileMenuOpen}
        onCloseMobileMenu={handleCloseMenu}
      />
      <div className="lg:pl-64">
        <DashboardHeader
          user={user}
          tenant={tenant}
          onMenuClick={handleMenuClick}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
