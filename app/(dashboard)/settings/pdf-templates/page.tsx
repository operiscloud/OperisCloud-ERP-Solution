import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PDFTemplateConfigClient from '@/components/settings/PDFTemplateConfigClient';

export default async function PDFTemplatesSettingsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: {
      tenantId: true,
      tenant: {
        select: {
          name: true,
          logo: true,
          primaryColor: true,
          companyAddress: true,
          companyCity: true,
          companyPostalCode: true,
          companyCountry: true,
          companyPhone: true,
          companyEmail: true,
          companyWebsite: true,
          taxNumber: true,
          invoiceFooter: true,
          pdfTemplateConfig: true,
          plan: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/onboarding');
  }

  // Check if user has PRO or BUSINESS plan
  const hasAccess = user.tenant.plan === 'PRO' || user.tenant.plan === 'BUSINESS';

  if (!hasAccess) {
    redirect('/settings?upgrade=business');
  }

  // Default template config if not set
  const defaultConfig = {
    templateType: 'retail' as const,
    primaryColor: user.tenant.primaryColor || '#3b82f6',
    secondaryColor: '#64748b',
    headerStyle: 'modern' as const,
    fontStyle: 'helvetica' as const,
    showLogo: true,
    showCompanyInfo: true,
    showBankInfo: true,
    accentColor: '#10b981',
  };

  const templateConfig = user.tenant.pdfTemplateConfig
    ? { ...defaultConfig, ...(user.tenant.pdfTemplateConfig as object) }
    : defaultConfig;

  return (
    <PDFTemplateConfigClient
      tenantId={user.tenantId}
      companyName={user.tenant.name}
      companyLogo={user.tenant.logo}
      initialConfig={templateConfig}
      companyInfo={{
        address: user.tenant.companyAddress,
        city: user.tenant.companyCity,
        postalCode: user.tenant.companyPostalCode,
        country: user.tenant.companyCountry,
        phone: user.tenant.companyPhone,
        email: user.tenant.companyEmail,
        website: user.tenant.companyWebsite,
        taxNumber: user.tenant.taxNumber,
        footer: user.tenant.invoiceFooter,
      }}
    />
  );
}
