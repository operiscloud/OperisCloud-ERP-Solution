'use client';

import { useState, KeyboardEvent } from 'react';
import { X, Tag, Lock } from 'lucide-react';
import { usePlanFeature } from '@/lib/hooks/usePlanLimit';
import UpgradeModal from '@/components/paywall/UpgradeModal';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ tags, onChange }: TagsInputProps) {
  const { hasAccess, plan } = usePlanFeature('hasCustomerSegmentation');
  const [inputValue, setInputValue] = useState('');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!hasAccess) {
      e.preventDefault();
      setShowUpgradeModal(true);
      return;
    }

    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    if (!hasAccess) {
      setShowUpgradeModal(true);
      return;
    }

    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      onChange([...tags, trimmedValue]);
      setInputValue('');
    }
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (!hasAccess) {
      e.preventDefault();
      setShowUpgradeModal(true);
      return;
    }

    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const newTags = paste
      .split(/[,;\n]/)
      .map(tag => tag.trim())
      .filter(tag => tag && !tags.includes(tag));

    if (newTags.length > 0) {
      onChange([...tags, ...newTags]);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-700">
            Tags
            {!hasAccess && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                BUSINESS
              </span>
            )}
          </label>
        </div>

        <div
          className={`min-h-[42px] w-full px-3 py-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-600 focus-within:outline-none ${
            hasAccess
              ? 'border-gray-300 bg-white'
              : 'border-gray-200 bg-gray-50 cursor-not-allowed'
          }`}
          onClick={() => !hasAccess && setShowUpgradeModal(true)}
        >
          <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm"
              >
                <Tag className="h-3 w-3" />
                {tag}
                {hasAccess && (
                  <button
                    type="button"
                    onClick={() => removeTag(index)}
                    className="hover:text-blue-900"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </span>
            ))}
            {hasAccess ? (
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                onBlur={addTag}
                className="flex-1 min-w-[120px] outline-none bg-transparent"
                placeholder={tags.length === 0 ? 'Ajouter des tags (Entrée ou virgule pour séparer)' : ''}
              />
            ) : (
              <div className="flex-1 flex items-center gap-2 text-gray-500 text-sm">
                <Lock className="h-4 w-4" />
                <span>Disponible avec le plan Business</span>
              </div>
            )}
          </div>
        </div>

        {hasAccess && (
          <p className="text-xs text-gray-500">
            Appuyez sur Entrée ou utilisez une virgule pour ajouter plusieurs tags
          </p>
        )}
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature="tags clients"
        currentPlan={plan?.id || 'FREE'}
        suggestedPlan="BUSINESS"
      />
    </>
  );
}
