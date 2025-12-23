import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { generatePDFFromHTML } from '@/lib/pdf/puppeteer-generator';
import { generateQuoteHTML } from '@/lib/pdf/html-quote-template';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: { tenantId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    // Fetch order with all details including PDF template config
    const order = await prisma.order.findUnique({
      where: { id, tenantId: user.tenantId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        tenant: {
          select: {
            name: true,
            companyAddress: true,
            companyCity: true,
            companyPostalCode: true,
            companyCountry: true,
            companyPhone: true,
            companyEmail: true,
            companyWebsite: true,
            taxNumber: true,
            currency: true,
            invoiceFooter: true,
            bankName: true,
            bankIBAN: true,
            bankBIC: true,
            bankAccountHolder: true,
            pdfTemplateConfig: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    // Calculate valid until date (30 days from creation)
    const validUntil = new Date(order.createdAt);
    validUntil.setDate(validUntil.getDate() + 30);

    // Prepare quote data
    const quoteData = {
      quoteNumber: order.orderNumber,
      quoteDate: order.createdAt,
      validUntil,

      // Company info from tenant
      companyName: order.tenant.name,
      companyAddress: order.tenant.companyAddress || undefined,
      companyCity: order.tenant.companyCity || undefined,
      companyPostalCode: order.tenant.companyPostalCode || undefined,
      companyCountry: order.tenant.companyCountry || undefined,
      companyPhone: order.tenant.companyPhone || undefined,
      companyEmail: order.tenant.companyEmail || undefined,
      companyWebsite: order.tenant.companyWebsite || undefined,
      taxNumber: order.tenant.taxNumber || undefined,

      // Customer info
      customerName: order.customer
        ? `${order.customer.firstName} ${order.customer.lastName}`
        : order.guestName || 'Client',
      customerEmail: order.customer?.email || order.guestEmail || undefined,
      customerPhone: order.customer?.phone || order.guestPhone || undefined,
      customerAddress: order.customer?.address || order.shippingAddress || undefined,

      // Items
      items: order.items.map((item) => ({
        name: item.name,
        sku: item.sku || undefined,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),

      // Totals
      subtotal: Number(order.subtotal),
      taxRate: Number(order.taxRate),
      taxAmount: Number(order.taxAmount),
      discount: Number(order.discount),
      shippingCost: Number(order.shippingCost),
      total: Number(order.total),
      currency: order.tenant.currency,

      // Notes
      notes: order.notes || undefined,
      invoiceFooter: order.tenant.invoiceFooter || undefined,

      // Bank info
      bankName: order.tenant.bankName || undefined,
      bankIBAN: order.tenant.bankIBAN || undefined,
      bankBIC: order.tenant.bankBIC || undefined,
      bankAccountHolder: order.tenant.bankAccountHolder || undefined,

      // Template config
      templateConfig: order.tenant.pdfTemplateConfig as any || undefined,
    };

    // Generate PDF using Puppeteer
    const html = generateQuoteHTML(quoteData);
    const pdfBuffer = await generatePDFFromHTML(html);

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="devis-${order.orderNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du devis' },
      { status: 500 }
    );
  }
}
