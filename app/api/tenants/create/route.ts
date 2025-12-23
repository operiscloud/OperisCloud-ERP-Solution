import { NextRequest, NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { getIndustryTemplate } from '@/lib/industry-templates';
import { createTenantSchema } from '@/lib/validations';
import { isSubdomainAvailable } from '@/lib/tenant';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    const body = await request.json();

    // Validate input
    const validatedData = createTenantSchema.parse({
      name: body.businessName,
      subdomain: body.subdomain.toLowerCase().trim(),
      industryId: body.industryId,
      currency: body.currency,
      language: body.language,
    });

    // Check if subdomain is available
    const available = await isSubdomainAvailable(validatedData.subdomain);
    if (!available) {
      return NextResponse.json(
        { error: 'Ce sous-domaine est déjà pris ou réservé' },
        { status: 400 }
      );
    }

    // Get industry template
    const industryTemplate = getIndustryTemplate(validatedData.industryId);
    if (!industryTemplate) {
      return NextResponse.json(
        { error: 'Industrie invalide' },
        { status: 400 }
      );
    }

    // Create tenant with industry configuration
    const tenant = await prisma.tenant.create({
      data: {
        name: validatedData.name,
        subdomain: validatedData.subdomain,
        plan: 'FREE',
        currency: industryTemplate.defaultCurrency,
        language: industryTemplate.defaultLanguage,
        industryId: validatedData.industryId,
        enabledModules: industryTemplate.modules,
        industrySettings: {
          salesChannels: industryTemplate.salesChannels,
          expenseCategories: industryTemplate.expenseCategories,
          productTypes: industryTemplate.productTypes,
        },
      },
    });

    // Create user in tenant as OWNER
    await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        tenantId: tenant.id,
        role: 'OWNER',
      },
    });

    // Create default categories based on industry
    if (industryTemplate.productTypes.length > 0) {
      for (const productType of industryTemplate.productTypes) {
        await prisma.category.create({
          data: {
            name: productType.name,
            tenantId: tenant.id,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      tenant: {
        id: tenant.id,
        name: tenant.name,
        subdomain: tenant.subdomain,
      },
    });
  } catch (error: any) {
    console.error('Error creating tenant:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création du tenant' },
      { status: 500 }
    );
  }
}
