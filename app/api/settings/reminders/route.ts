import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getCurrentTenantId } from '@/lib/tenant';
import { prisma } from '@/lib/prisma';

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

    // Get or create reminder settings
    let settings = await prisma.reminderSettings.findUnique({
      where: { tenantId },
    });

    if (!settings) {
      // Create default settings
      settings = await prisma.reminderSettings.create({
        data: {
          tenantId,
          enabled: true,
          firstReminderDays: 7,
          secondReminderDays: 14,
          finalReminderDays: 30,
          sendToAdmin: true,
          sendToCustomer: true,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching reminder settings:', error);
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
    const {
      enabled,
      firstReminderDays,
      secondReminderDays,
      finalReminderDays,
      sendToAdmin,
      sendToCustomer,
      adminEmail,
      emailTemplate,
    } = body;

    // Upsert reminder settings
    const settings = await prisma.reminderSettings.upsert({
      where: { tenantId },
      create: {
        tenantId,
        enabled: enabled ?? true,
        firstReminderDays: firstReminderDays ?? 7,
        secondReminderDays: secondReminderDays ?? 14,
        finalReminderDays: finalReminderDays ?? 30,
        sendToAdmin: sendToAdmin ?? true,
        sendToCustomer: sendToCustomer ?? true,
        adminEmail,
        emailTemplate,
      },
      update: {
        enabled,
        firstReminderDays,
        secondReminderDays,
        finalReminderDays,
        sendToAdmin,
        sendToCustomer,
        adminEmail,
        emailTemplate,
      },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error updating reminder settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour des paramètres' },
      { status: 500 }
    );
  }
}
