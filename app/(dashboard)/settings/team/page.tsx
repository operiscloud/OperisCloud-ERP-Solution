import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Users } from 'lucide-react';
import TeamMembersList from '@/components/settings/TeamMembersList';
import InviteUserForm from '@/components/settings/InviteUserForm';

export default async function TeamPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const currentUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: { tenant: true },
  });

  if (!currentUser) redirect('/onboarding');

  // Only OWNER and ADMIN can access this page
  if (currentUser.role !== 'OWNER' && currentUser.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const teamMembers = await prisma.user.findMany({
    where: { tenantId: currentUser.tenantId },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestion de l'équipe</h1>
        <p className="text-gray-600">
          Gérez les membres de votre équipe et leurs permissions
        </p>
      </div>

      {/* Role Descriptions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Rôles disponibles:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li><strong>Owner:</strong> Accès complet, peut gérer les utilisateurs et les paramètres</li>
          <li><strong>Admin:</strong> Peut gérer les utilisateurs et la plupart des paramètres</li>
          <li><strong>Manager:</strong> Peut créer et gérer les commandes, clients et produits</li>
          <li><strong>Seller:</strong> Peut créer des commandes et gérer les clients</li>
          <li><strong>Viewer:</strong> Accès en lecture seule</li>
        </ul>
      </div>

      {/* Invite New User */}
      {currentUser.role === 'OWNER' && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <Users className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Inviter un nouveau membre
            </h2>
          </div>
          <InviteUserForm tenantId={currentUser.tenantId} currentUsersCount={teamMembers.length} />
        </div>
      )}

      {/* Team Members List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Membres de l'équipe ({teamMembers.length})
        </h2>
        <TeamMembersList
          members={teamMembers}
          currentUserId={currentUser.id}
          currentUserRole={currentUser.role}
        />
      </div>
    </div>
  );
}
