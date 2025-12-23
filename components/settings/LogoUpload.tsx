'use client';

import { useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import { useRouter } from 'next/navigation';

interface LogoUploadProps {
  currentLogo?: string | null;
  tenantId: string;
}

export default function LogoUpload({ currentLogo, tenantId }: LogoUploadProps) {
  const router = useRouter();
  const toast = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogo || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Fichier invalide', 'Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Fichier trop volumineux', 'La taille maximale est de 2 MB');
      return;
    }

    setUploading(true);

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;
        setPreview(base64String);

        // Upload to server
        const response = await fetch('/api/settings/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logo: base64String }),
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        toast.success('Logo mis à jour', 'Votre logo a été téléchargé avec succès');
        router.refresh();
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Erreur', 'Impossible de télécharger le logo');
      setPreview(currentLogo || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = async () => {
    setUploading(true);

    try {
      const response = await fetch('/api/settings/logo', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setPreview(null);
      toast.success('Logo supprimé', 'Votre logo a été retiré');
      router.refresh();
    } catch (error) {
      toast.error('Erreur', 'Impossible de supprimer le logo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Logo de l'entreprise
      </label>

      <div className="flex items-start gap-4">
        {/* Preview */}
        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden">
          {preview ? (
            <img
              src={preview}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <ImageIcon className="h-12 w-12 text-gray-400" />
          )}
        </div>

        {/* Upload controls */}
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer disabled:opacity-50">
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Téléchargement...' : preview ? 'Changer le logo' : 'Télécharger un logo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {preview && (
              <button
                onClick={handleRemoveLogo}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50"
              >
                <X className="h-4 w-4 mr-2" />
                Supprimer
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500">
            PNG, JPG ou SVG. Taille maximale: 2 MB
          </p>
          <p className="text-sm text-gray-500">
            Le logo sera affiché sur vos factures et devis PDF
          </p>
        </div>
      </div>
    </div>
  );
}
