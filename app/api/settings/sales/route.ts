import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getCurrentTenantId } from '@/lib/tenant';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const tenantId = await getCurrentTenantId();
    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { industrySettings: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const industrySettings = tenant.industrySettings as any;
    const salesSettings = industrySettings?.salesSettings || {
      paymentMethods: ['Virement bancaire', 'TWINT', 'Cash'],
      salesChannels: ['Stand', 'Site web', 'Instagram', 'WhatsApp'],
      currency: 'CHF',
      taxEnabled: true,
      defaultTaxRate: 8.1,
      shippingEnabled: false,
      defaultShippingCost: 0,
    };

    return NextResponse.json({ settings: salesSettings });
  } catch (error) {
    console.error('Error fetching sales settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des paramètres' },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();
    const { paymentMethods, salesChannels, currency, taxEnabled, defaultTaxRate, shippingEnabled, defaultShippingCost, orderNumberPrefix } = body;

    // Validate payment methods
    if (!Array.isArray(paymentMethods) || paymentMethods.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un moyen de paiement est requis' },
        { status: 400 }
      );
    }

    // Validate sales channels
    if (!Array.isArray(salesChannels) || salesChannels.length === 0) {
      return NextResponse.json(
        { error: 'Au moins un canal de vente est requis' },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { id: tenantId },
      select: { industrySettings: true },
    });

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant non trouvé' }, { status: 404 });
    }

    const industrySettings = (tenant.industrySettings as any) || {};

    // Update sales settings
    industrySettings.salesSettings = {
      paymentMethods,
      salesChannels,
      currency,
      taxEnabled,
      defaultTaxRate,
      shippingEnabled,
      defaultShippingCost,
      orderNumberPrefix: orderNumberPrefix || '',
      orderCounters: industrySettings.salesSettings?.orderCounters || {},
    };

    // Update both industrySettings and currency field in tenant
    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        industrySettings,
        currency: currency || 'CHF',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating sales settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde des paramètres' },
      { status: 500 }
    );
  }
}
