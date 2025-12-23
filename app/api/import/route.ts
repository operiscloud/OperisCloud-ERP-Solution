import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';
import { rateLimit, RATE_LIMIT_CONFIGS } from '@/lib/rate-limit';
import { hasPermission } from '@/lib/permissions';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/csv',
];

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Rate limiting for bulk operations
    const rateLimitResult = rateLimit(`import:${userId}`, RATE_LIMIT_CONFIGS.bulk);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Trop d\'imports. Réessayez plus tard.' },
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

    // Check permissions
    if (!hasPermission(user.role, 'manageBulkImport')) {
      return NextResponse.json({ error: 'Permissions insuffisantes' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Fichier manquant' }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop grand. Maximum 10MB' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez Excel ou CSV' },
        { status: 400 }
      );
    }

    if (!['products', 'variants', 'customers', 'orders'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    // Read file
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let workbook;
    try {
      workbook = XLSX.read(buffer, { type: 'buffer' });
    } catch {
      return NextResponse.json(
        { error: 'Fichier Excel invalide' },
        { status: 400 }
      );
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (data.length === 0) {
      return NextResponse.json({ error: 'Le fichier est vide' }, { status: 400 });
    }

    let imported = 0;
    let errors: string[] = [];

    // Import based on type
    switch (type) {
      case 'products':
        const productsResult = await importProducts(data, user.tenantId);
        imported = productsResult.imported;
        errors = productsResult.errors;
        break;
      case 'variants':
        const variantsResult = await importVariants(data, user.tenantId);
        imported = variantsResult.imported;
        errors = variantsResult.errors;
        break;
      case 'customers':
        const customersResult = await importCustomers(data, user.tenantId);
        imported = customersResult.imported;
        errors = customersResult.errors;
        break;
      case 'orders':
        const ordersResult = await importOrders(data, user.tenantId);
        imported = ordersResult.imported;
        errors = ordersResult.errors;
        break;
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          error: 'Import terminé avec des erreurs',
          imported,
          errors: errors.slice(0, 10), // Limit to first 10 errors
        },
        { status: 207 }
      );
    }

    return NextResponse.json({
      message: 'Import réussi',
      imported,
    });
  } catch (error) {
    console.error('Error importing:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'import' },
      { status: 500 }
    );
  }
}

async function importProducts(data: any[], tenantId: string) {
  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Validate required fields
      if (!row.name) {
        errors.push(`Ligne ${i + 2}: Le nom du produit est requis`);
        continue;
      }

      // Check if product has variants
      const hasVariants = row.hasVariants &&
        (row.hasVariants.toString().toUpperCase() === 'OUI' ||
         row.hasVariants.toString().toUpperCase() === 'YES' ||
         row.hasVariants.toString().toUpperCase() === 'TRUE' ||
         row.hasVariants === true ||
         row.hasVariants === 1);

      await prisma.product.create({
        data: {
          tenantId,
          name: row.name,
          sku: row.sku || null,
          description: row.description || null,
          price: row.price ? parseFloat(row.price.toString()) : 0,
          costPrice: row.costPrice ? parseFloat(row.costPrice.toString()) : null,
          stockQuantity: row.stock ? parseInt(row.stock.toString()) : 0,
          lowStockAlert: row.minStock ? parseInt(row.minStock.toString()) : null,
          hasVariants: hasVariants,
        },
      });
      imported++;
    } catch (error: any) {
      errors.push(`Ligne ${i + 2}: ${error.message}`);
    }
  }

  return { imported, errors };
}

async function importVariants(data: any[], tenantId: string) {
  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Normalize column names (trim spaces and handle various casings)
      const normalizedRow: any = {};
      for (const key in row) {
        normalizedRow[key.trim()] = row[key];
      }

      // Validate required fields
      if (!normalizedRow.productSku) {
        errors.push(`Ligne ${i + 2}: Le SKU du produit est requis`);
        continue;
      }

      if (!normalizedRow.variantName) {
        errors.push(`Ligne ${i + 2}: Le nom de la variante est requis`);
        continue;
      }

      // Convert productSku to string (in case Excel converted it to number)
      const productSku = normalizedRow.productSku.toString();

      // Find product by SKU
      const product = await prisma.product.findFirst({
        where: {
          tenantId,
          sku: productSku,
        },
      });

      if (!product) {
        errors.push(`Ligne ${i + 2}: Produit avec SKU "${productSku}" non trouvé`);
        continue;
      }

      await prisma.productVariant.create({
        data: {
          productId: product.id,
          name: normalizedRow.variantName,
          sku: normalizedRow.variantSku ? normalizedRow.variantSku.toString() : null,
          attributes: normalizedRow.attributes ? (typeof normalizedRow.attributes === 'string' ? JSON.parse(normalizedRow.attributes) : normalizedRow.attributes) : {},
          price: normalizedRow.price ? parseFloat(normalizedRow.price.toString()) : null,
          costPrice: normalizedRow.costPrice ? parseFloat(normalizedRow.costPrice.toString()) : null,
          stockQuantity: normalizedRow.stock ? parseInt(normalizedRow.stock.toString()) : 0,
        },
      });
      imported++;
    } catch (error: any) {
      errors.push(`Ligne ${i + 2}: ${error.message}`);
    }
  }

  return { imported, errors };
}

async function importCustomers(data: any[], tenantId: string) {
  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Validate required fields
      if (!row.email && !row.firstName && !row.lastName) {
        errors.push(`Ligne ${i + 2}: Au moins un email ou un nom est requis`);
        continue;
      }

      await prisma.customer.create({
        data: {
          tenantId,
          firstName: row.firstName || null,
          lastName: row.lastName || null,
          email: row.email || null,
          phone: row.phone || null,
          address: row.address || null,
          city: row.city || null,
          postalCode: row.postalCode || null,
          country: row.country || null,
        },
      });
      imported++;
    } catch (error: any) {
      errors.push(`Ligne ${i + 2}: ${error.message}`);
    }
  }

  return { imported, errors };
}

async function importOrders(data: any[], tenantId: string) {
  let imported = 0;
  const errors: string[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    try {
      // Validate required fields
      if (!row.customerEmail && !row.guestName) {
        errors.push(`Ligne ${i + 2}: Email du client ou nom invité requis`);
        continue;
      }

      if (!row.productSku) {
        errors.push(`Ligne ${i + 2}: SKU du produit requis`);
        continue;
      }

      // Find customer by email if provided
      let customerId = null;
      if (row.customerEmail) {
        const customer = await prisma.customer.findFirst({
          where: {
            tenantId,
            email: row.customerEmail,
          },
        });
        customerId = customer?.id || null;
      }

      // Find product by SKU
      const product = await prisma.product.findFirst({
        where: {
          tenantId,
          sku: row.productSku,
        },
      });

      if (!product) {
        errors.push(`Ligne ${i + 2}: Produit avec SKU "${row.productSku}" non trouvé`);
        continue;
      }

      const quantity = row.quantity ? parseInt(row.quantity.toString()) : 1;
      const unitPrice = row.unitPrice ? parseFloat(row.unitPrice.toString()) : parseFloat(product.price.toString());
      const taxRate = row.taxRate ? parseFloat(row.taxRate.toString()) : 8.1;
      const discount = row.discount ? parseFloat(row.discount.toString()) : 0;

      const subtotal = quantity * unitPrice;
      const taxAmount = (subtotal - discount) * (taxRate / 100);
      const total = subtotal - discount + taxAmount;

      // Generate order number
      const orderNumber = `IMP-${Date.now()}-${i}`;

      // Create order
      const order = await prisma.order.create({
        data: {
          tenantId,
          orderNumber,
          customerId,
          guestName: row.guestName || null,
          guestEmail: row.guestEmail || null,
          guestPhone: row.guestPhone || null,
          status: row.status || 'DRAFT',
          type: row.type || 'ORDER',
          paymentMethod: row.paymentMethod || null,
          paymentStatus: row.paymentStatus || 'PENDING',
          subtotal,
          taxAmount,
          taxRate,
          discount,
          total,
          notes: row.notes || null,
        },
      });

      // Create order item
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          name: product.name,
          sku: product.sku,
          quantity,
          unitPrice,
        },
      });

      imported++;
    } catch (error: any) {
      errors.push(`Ligne ${i + 2}: ${error.message}`);
    }
  }

  return { imported, errors };
}
