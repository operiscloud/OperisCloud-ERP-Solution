import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || !['products', 'variants', 'customers', 'orders'].includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 });
    }

    let template: any[] = [];
    let fileName = '';

    switch (type) {
      case 'products':
        template = [
          {
            name: 'Exemple Produit 1',
            sku: 'PROD-001',
            description: 'Description du produit',
            price: 99.99,
            costPrice: 50.00,
            stock: 50,
            minStock: 10,
            hasVariants: 'OUI',
          },
          {
            name: 'Exemple Produit 2',
            sku: 'PROD-002',
            description: 'Description du produit',
            price: 149.99,
            costPrice: 75.00,
            stock: 30,
            minStock: 5,
            hasVariants: 'NON',
          },
        ];
        fileName = 'template-produits.xlsx';
        break;

      case 'variants':
        template = [
          {
            productSku: 'PROD-001',
            variantName: 'Petite',
            variantSku: 'PROD-001-S',
            price: 89.99,
            costPrice: 45.00,
            stock: 25,
          },
          {
            productSku: 'PROD-001',
            variantName: 'Moyenne',
            variantSku: 'PROD-001-M',
            price: 99.99,
            costPrice: 50.00,
            stock: 30,
          },
          {
            productSku: 'PROD-001',
            variantName: 'Grande',
            variantSku: 'PROD-001-L',
            price: 109.99,
            costPrice: 55.00,
            stock: 20,
          },
        ];
        fileName = 'template-variantes.xlsx';
        break;

      case 'customers':
        template = [
          {
            firstName: 'Jean',
            lastName: 'Dupont',
            email: 'jean.dupont@example.com',
            phone: '+41 12 345 67 89',
            address: 'Rue de la Paix 123',
            city: 'Genève',
            postalCode: '1200',
            country: 'Suisse',
          },
          {
            firstName: 'Marie',
            lastName: 'Martin',
            email: 'marie.martin@example.com',
            phone: '+41 98 765 43 21',
            address: 'Avenue du Lac 45',
            city: 'Lausanne',
            postalCode: '1003',
            country: 'Suisse',
          },
        ];
        fileName = 'template-clients.xlsx';
        break;

      case 'orders':
        template = [
          {
            customerEmail: 'jean.dupont@example.com',
            guestName: '',
            guestEmail: '',
            guestPhone: '',
            productSku: 'PROD-001',
            quantity: 2,
            unitPrice: 99.99,
            status: 'CONFIRMED',
            type: 'ORDER',
            paymentMethod: 'Virement bancaire',
            paymentStatus: 'PAID',
            taxRate: 8.1,
            discount: 0,
            notes: 'Commande urgente',
          },
          {
            customerEmail: '',
            guestName: 'Client Invité',
            guestEmail: 'invite@example.com',
            guestPhone: '+41 11 222 33 44',
            productSku: 'PROD-002',
            quantity: 1,
            unitPrice: 149.99,
            status: 'DRAFT',
            type: 'ORDER',
            paymentMethod: 'TWINT',
            paymentStatus: 'PENDING',
            taxRate: 8.1,
            discount: 10,
            notes: '',
          },
        ];
        fileName = 'template-commandes.xlsx';
        break;
    }

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error generating template:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération du modèle' },
      { status: 500 }
    );
  }
}
