import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { hasPermission } from '@/lib/permissions';
import { rateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';

const companySettingsSchema = z.object({
  companyAddress: z.string().max(200).optional().nullable(),
  companyCity: z.string().max(100).optional().nullable(),
  companyPostalCode: z.string().max(20).optional().nullable(),
  companyCountry: z.string().max(100).optional().nullable(),
  companyPhone: z.string().max(30).optional().nullable(),
  companyEmail: z.string().email().max(100).optional().nullable(),
  companyWebsite: z.string().url().max(200).optional().nullable(),
  taxNumber: z.string().max(50).optional().nullable(),
  registrationNumber: z.string().max(50).optional().nullable(),
  invoiceFooter: z.string().max(500).optional().nullable(),
  bankName: z.string().max(100).optional().nullable(),
  bankIBAN: z.string().max(50).optional().nullable(),
  bankBIC: z.string().max(20).optional().nullable(),
  bankAccountHolder: z.string().max(100).optional().nullable(),
});

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Rate limiting
    const rateLimitResult = rateLimit(`company_settings:${userId}`, RATE_LIMIT_CONFIGS.api);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop de requêtes. Veuillez réessayer.' },
        { status: 429 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Check permission
    if (!hasPermission(user.role, 'manageCompanySettings')) {
      return NextResponse.json(
        { error: 'Vous n\'avez pas la permission de modifier les paramètres' },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Validate input
    const validatedData = companySettingsSchema.parse(body);

    const updatedTenant = await prisma.tenant.update({
      where: { id: user.tenantId },
      data: {
        companyAddress: validatedData.companyAddress || null,
        companyCity: validatedData.companyCity || null,
        companyPostalCode: validatedData.companyPostalCode || null,
        companyCountry: validatedData.companyCountry || null,
        companyPhone: validatedData.companyPhone || null,
        companyEmail: validatedData.companyEmail || null,
        companyWebsite: validatedData.companyWebsite || null,
        taxNumber: validatedData.taxNumber || null,
        registrationNumber: validatedData.registrationNumber || null,
        invoiceFooter: validatedData.invoiceFooter || null,
        bankName: validatedData.bankName || null,
        bankIBAN: validatedData.bankIBAN || null,
        bankBIC: validatedData.bankBIC || null,
        bankAccountHolder: validatedData.bankAccountHolder || null,
      },
    });

    return NextResponse.json(updatedTenant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating company settings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
