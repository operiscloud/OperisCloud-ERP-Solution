import { headers } from 'next/headers';
import { auth } from '@clerk/nextjs/server';
import { prisma } from './prisma';

/**
 * Get current tenant ID from either subdomain or user's tenant association
 */
export async function getCurrentTenantId(): Promise<string | null> {
  // Try to get from subdomain first
  const headersList = await headers();
  const host = headersList.get('host') || '';
  const subdomain = getSubdomainFromHost(host);

  if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
      select: { id: true },
    });
    return tenant?.id || null;
  }

  // Fallback to user's tenant association
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { tenantId: true },
  });

  return user?.tenantId || null;
}

/**
 * Get current tenant with all data
 */
export async function getCurrentTenant() {
  const tenantId = await getCurrentTenantId();
  if (!tenantId) {
    return null;
  }

  return prisma.tenant.findUnique({
    where: { id: tenantId },
  });
}

/**
 * Extract subdomain from host
 * Example: "mybusiness.businesshub.app" -> "mybusiness"
 */
export function getSubdomainFromHost(host: string): string | null {
  const parts = host.split('.');

  // localhost:3000 or IP
  if (parts.length <= 1 || host.includes('localhost') || host.includes('127.0.0.1')) {
    return null;
  }

  // subdomain.domain.com -> return subdomain
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}

/**
 * Verify user belongs to tenant
 */
export async function verifyTenantAccess(userId: string, tenantId: string): Promise<boolean> {
  const user = await prisma.user.findFirst({
    where: {
      clerkId: userId,
      tenantId: tenantId,
    },
  });

  return !!user;
}

/**
 * Get or create user for tenant
 */
export async function getOrCreateUser(
  clerkId: string,
  email: string,
  tenantId: string,
  data?: {
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  }
) {
  // Check if user exists in this tenant
  let user = await prisma.user.findFirst({
    where: {
      clerkId,
      tenantId,
    },
  });

  if (!user) {
    // Create user in tenant
    user = await prisma.user.create({
      data: {
        clerkId,
        email,
        tenantId,
        role: 'OWNER', // First user is owner
        firstName: data?.firstName,
        lastName: data?.lastName,
        imageUrl: data?.imageUrl,
      },
    });
  }

  return user;
}

/**
 * Check if subdomain is available
 */
export async function isSubdomainAvailable(subdomain: string): Promise<boolean> {
  const normalizedSubdomain = subdomain.toLowerCase().trim();

  // Reserved subdomains
  const reserved = ['www', 'app', 'api', 'admin', 'dashboard', 'auth', 'login', 'signup'];
  if (reserved.includes(normalizedSubdomain)) {
    return false;
  }

  const existing = await prisma.tenant.findUnique({
    where: { subdomain: normalizedSubdomain },
  });

  return !existing;
}

/**
 * Generate unique subdomain from business name
 */
export function generateSubdomain(businessName: string): string {
  return businessName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 30);
}

/**
 * Get user's tenant plan (server-side)
 */
export async function getUserTenantPlan(): Promise<'FREE' | 'PRO' | 'BUSINESS' | null> {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      tenant: {
        select: {
          plan: true,
        },
      },
    },
  });

  return user?.tenant?.plan || null;
}
