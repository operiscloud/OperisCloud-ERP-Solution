'use client';

import { UserButton } from '@clerk/nextjs';
import { Bell, Menu } from 'lucide-react';
import RestartTutorialButton from '@/components/tutorial/RestartTutorialButton';
import BarcodeScannerButton from '@/components/barcode/BarcodeScannerButton';
import { Plan } from '@prisma/client';

interface DashboardHeaderProps {
  user: {
    firstName: string | null;
    lastName: string | null;
  };
  tenant: {
    name: string;
    plan: string;
  };
  onMenuClick: () => void;
}

export function DashboardHeader({ user, tenant, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="flex flex-1 justify-between px-4 sm:px-6">
        <div className="flex flex-1 items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden -ml-2 mr-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={onMenuClick}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <Menu className="h-6 w-6" />
          </button>

          {/* Tenant name on mobile */}
          <span className="lg:hidden text-lg font-semibold text-gray-900 truncate">
            {tenant.name}
          </span>
        </div>

        <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
          {/* Barcode Scanner (Mobile only, PRO/BUSINESS) */}
          <BarcodeScannerButton currentPlan={tenant.plan as Plan} />

          {/* Tutorial */}
          <RestartTutorialButton />

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <span className="sr-only">Voir les notifications</span>
            <Bell className="h-6 w-6" />
          </button>

          {/* User menu */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}
