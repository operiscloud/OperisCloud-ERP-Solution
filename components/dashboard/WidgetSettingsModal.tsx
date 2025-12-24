'use client';

import { useState } from 'react';
import { X, Eye, EyeOff, Lock } from 'lucide-react';
import { DashboardWidgetConfig } from '@/lib/dashboard/widget-config-helper';
import { WIDGET_REGISTRY } from '@/lib/dashboard/widget-registry';
import { Plan } from '@prisma/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface WidgetSettingsModalProps {
  config: DashboardWidgetConfig;
  plan: Plan;
  onClose: () => void;
  onSave: (config: DashboardWidgetConfig) => void;
}

export function WidgetSettingsModal({
  config,
  plan,
  onClose,
  onSave,
}: WidgetSettingsModalProps) {
  const [localConfig, setLocalConfig] = useState(config);

  const toggleVisibility = (widgetId: string) => {
    const newWidgets = localConfig.widgets.map(w =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    setLocalConfig({ ...localConfig, widgets: newWidgets });
  };

  const handleSave = () => {
    onSave({
      ...localConfig,
      layout: {
        ...localConfig.layout,
        lastUpdated: new Date().toISOString(),
      },
    });
  };

  const planHierarchy = { FREE: 0, PRO: 1, BUSINESS: 2 };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Configuration des widgets</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh]">
          <p className="text-sm text-gray-600 mb-4">
            Choisissez les widgets à afficher sur votre dashboard.
          </p>

          <div className="space-y-3">
            {localConfig.widgets.map((widget) => {
              const metadata = WIDGET_REGISTRY[widget.id];
              if (!metadata) return null;

              const isLocked = metadata.minPlanRequired &&
                planHierarchy[plan] < planHierarchy[metadata.minPlanRequired];

              return (
                <div
                  key={widget.id}
                  className={cn(
                    "flex items-center justify-between p-4 border rounded-lg transition-colors",
                    isLocked
                      ? "bg-gray-50 border-gray-200"
                      : "border-gray-300 hover:border-gray-400"
                  )}
                >
                  <div className="flex items-center gap-3 flex-1">
                    {metadata.icon && (
                      <div className={cn(
                        "p-2 rounded-lg",
                        isLocked ? "bg-gray-200" : "bg-blue-100"
                      )}>
                        <metadata.icon className={cn(
                          "h-5 w-5",
                          isLocked ? "text-gray-400" : "text-blue-600"
                        )} />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className={cn(
                        "font-medium",
                        isLocked ? "text-gray-500" : "text-gray-900"
                      )}>
                        {metadata.name}
                      </h3>
                      <p className="text-sm text-gray-600">{metadata.description}</p>
                      {isLocked && (
                        <div className="flex items-center gap-2 mt-1">
                          <Lock className="h-3 w-3 text-orange-600" />
                          <p className="text-xs text-orange-600">
                            Réservé au plan {metadata.minPlanRequired}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {isLocked ? (
                    <Link
                      href="/pricing"
                      className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      Passer à {metadata.minPlanRequired}
                    </Link>
                  ) : (
                    <button
                      onClick={() => toggleVisibility(widget.id)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      title={widget.visible ? 'Masquer' : 'Afficher'}
                    >
                      {widget.visible ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
