'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Gift,
  BarChart3,
  Settings,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

interface DashboardNavProps {
  tenant: {
    name: string;
    logo: string | null;
  };
  enabledModules: string[];
  plan: string;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
}

const moduleIcons: Record<string, any> = {
  inventory: Package,
  crm: Users,
  sales: ShoppingCart,
  finance: FileText,
  giftcards: Gift,
  analytics: BarChart3,
};

const moduleLabels: Record<string, string> = {
  inventory: 'Produits',
  crm: 'Clients',
  sales: 'Ventes',
  finance: 'Finances',
  giftcards: 'Bons cadeaux',
  analytics: 'Rapports',
};

// Define the desired order of modules
const moduleOrder = ['inventory', 'sales', 'crm', 'finance', 'giftcards', 'analytics'];

export function DashboardNav({ tenant, enabledModules, plan, isMobileMenuOpen, onCloseMobileMenu }: DashboardNavProps) {
  const pathname = usePathname();

  // Close mobile menu on route change (only if menu is open)
  useEffect(() => {
    if (isMobileMenuOpen) {
      onCloseMobileMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Sort modules according to the defined order
  const sortedModules = enabledModules.sort((a, b) => {
    const indexA = moduleOrder.indexOf(a);
    const indexB = moduleOrder.indexOf(b);
    // If module not in order list, put it at the end
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, enabled: true },
    ...sortedModules.map((module) => ({
      name: moduleLabels[module] || module,
      href: `/${module}`,
      icon: moduleIcons[module] || Package,
      enabled: true,
    })),
    { name: 'Paramètres', href: '/settings', icon: Settings, enabled: true },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow bg-white border-r border-gray-200 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center flex-shrink-0 px-4 h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2 flex-1">
          {tenant.logo ? (
            <img src={tenant.logo} alt={tenant.name} className="w-8 h-8 rounded" />
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {tenant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="text-lg font-semibold text-gray-900 truncate">
            {tenant.name}
          </span>
        </div>
        {/* Close button for mobile */}
        <button
          type="button"
          className="lg:hidden ml-2 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
          onClick={onCloseMobileMenu}
        >
          <span className="sr-only">Fermer le menu</span>
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0',
                  isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Plan Badge */}
      <div className="flex-shrink-0 px-4 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Plan actuel</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
            plan === 'ENTERPRISE' ? 'bg-purple-100 text-purple-800' :
            plan === 'BUSINESS' ? 'bg-blue-100 text-blue-800' :
            plan === 'PRO' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {plan}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile menu overlay - full screen */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 transition-opacity duration-300"
            onClick={onCloseMobileMenu}
          />
          {/* Full screen sidebar */}
          <div className="fixed inset-0 bg-white flex flex-col animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent />
      </div>
    </>
  );
}
