'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Crown, Shield, Briefcase, ShoppingBag, Eye } from 'lucide-react';
import { useToast } from '@/contexts/ToastContext';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface TeamMember {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  createdAt: Date;
}

interface TeamMembersListProps {
  members: TeamMember[];
  currentUserId: string;
  currentUserRole: string;
}

const roleIcons = {
  OWNER: Crown,
  ADMIN: Shield,
  MANAGER: Briefcase,
  SELLER: ShoppingBag,
  VIEWER: Eye,
};

const roleColors = {
  OWNER: 'text-yellow-600 bg-yellow-100',
  ADMIN: 'text-red-600 bg-red-100',
  MANAGER: 'text-blue-600 bg-blue-100',
  SELLER: 'text-green-600 bg-green-100',
  VIEWER: 'text-gray-600 bg-gray-100',
};

export default function TeamMembersList({ members, currentUserId, currentUserRole }: TeamMembersListProps) {
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleRoleChange = async (memberId: string, newRole: string) => {
    setLoading(memberId);
    try {
      const response = await fetch(`/api/team/members/${memberId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de mise à jour', data.error || 'Impossible de mettre à jour le rôle');
        throw new Error('Failed to update role');
      }

      toast.success('Rôle mis à jour', 'Le rôle du membre a été mis à jour avec succès');
      router.refresh();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDeleteClick = (member: TeamMember) => {
    setMemberToDelete(member);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!memberToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/team/members/${memberToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        toast.error('Erreur de suppression', data.error || 'Impossible de supprimer le membre');
        throw new Error('Failed to delete member');
      }

      toast.success('Membre supprimé', `${memberToDelete.email} a été retiré de l'équipe avec succès`);
      router.refresh();
    } catch (error) {
      console.error('Error deleting member:', error);
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
    }
  };

  const canModify = (memberRole: string) => {
    if (currentUserRole === 'OWNER') return memberRole !== 'OWNER';
    return false;
  };

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const RoleIcon = roleIcons[member.role as keyof typeof roleIcons] || Eye;
        const isCurrentUser = member.id === currentUserId;

        return (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-2 rounded-lg ${roleColors[member.role as keyof typeof roleColors]}`}>
                <RoleIcon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-gray-900">
                    {member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : member.email}
                  </p>
                  {isCurrentUser && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Vous
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {canModify(member.role) && !isCurrentUser ? (
                <>
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value)}
                    disabled={loading === member.id}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SELLER">Vendeur</option>
                    <option value="VIEWER">Lecture seule</option>
                  </select>
                  <button
                    onClick={() => handleDeleteClick(member)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <span className={`px-3 py-1 rounded-lg text-sm font-medium ${roleColors[member.role as keyof typeof roleColors]}`}>
                  {member.role}
                </span>
              )}
            </div>
          </div>
        );
      })}

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setMemberToDelete(null);
        }}
        onConfirm={handleDelete}
        title="Retirer le membre de l'équipe"
        message={`Êtes-vous sûr de vouloir retirer ${memberToDelete?.email} de l'équipe ? Cette action est irréversible.`}
        confirmText="Retirer"
        cancelText="Annuler"
        type="danger"
        loading={deleting}
      />
    </div>
  );
}
