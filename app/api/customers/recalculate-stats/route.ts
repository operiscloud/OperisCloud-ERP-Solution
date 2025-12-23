import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';
import { updateCustomerStats } from '@/lib/customerStats';

// POST /api/customers/recalculate-stats - Recalculate all customer statistics
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    // Get all customers for this tenant
    const customers = await prisma.customer.findMany({
      where: { tenantId },
      select: { id: true },
    });

    console.log(`[CustomerStats] Recalculating stats for ${customers.length} customers`);

    // Recalculate stats for each customer
    for (const customer of customers) {
      await updateCustomerStats(customer.id, tenantId);
    }

    console.log(`[CustomerStats] Successfully recalculated all customer stats`);

    return NextResponse.json({
      success: true,
      customersUpdated: customers.length,
    });
  } catch (error) {
    console.error('Error recalculating customer stats:', error);
    return NextResponse.json(
      { error: 'Erreur lors du recalcul des statistiques' },
      { status: 500 }
    );
  }
}
