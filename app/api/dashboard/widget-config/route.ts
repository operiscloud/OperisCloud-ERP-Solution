import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const widgetConfigSchema = z.object({
  widgets: z.array(z.object({
    id: z.string(),
    visible: z.boolean(),
    order: z.number(),
    size: z.enum(['small', 'medium', 'large']),
    section: z.enum(['stats', 'charts', 'advanced-charts', 'tables', 'actions']),
  })),
  layout: z.object({
    version: z.number(),
    lastUpdated: z.string(),
  }),
});

// GET - Fetch widget configuration
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        tenantId: true,
        tenant: {
          select: {
            dashboardWidgetConfig: true,
            plan: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    return NextResponse.json({
      config: user.tenant.dashboardWidgetConfig,
      plan: user.tenant.plan,
    });
  } catch (error) {
    console.error('Error fetching widget config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
}

// POST - Save widget configuration
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const body = await request.json();
    const { config } = body;

    // Validate config
    const validatedConfig = widgetConfigSchema.parse(config);

    // Update tenant with widget config
    await prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        dashboardWidgetConfig: validatedConfig,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Configuration invalide', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error saving widget config:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la sauvegarde' },
      { status: 500 }
    );
  }
}
