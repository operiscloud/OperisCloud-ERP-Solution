'use client';

import { UserButton } from '@clerk/nextjs';
import { Bell } from 'lucide-react';
import RestartTutorialButton from '@/components/tutorial/RestartTutorialButton';

interface DashboardHeaderProps {
  user: {
    firstName: string | null;
    lastName: string | null;
  };
  tenant: {
    name: string;
  };
}

export function DashboardHeader({ user, tenant }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white">
      <div className="flex flex-1 justify-between px-6">
        <div className="flex flex-1 items-center">
          {/* Mobile menu button would go here */}
        </div>

        <div className="ml-4 flex items-center space-x-4">
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
