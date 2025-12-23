import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listProductSkus() {
  try {
    console.log('📦 Liste des produits et leurs SKU:\n');

    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
      },
      orderBy: { name: 'asc' },
    });

    if (products.length === 0) {
      console.log('Aucun produit trouvé.');
      return;
    }

    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   SKU: ${product.sku || '❌ PAS DE SKU'}`);
      console.log(`   ID: ${product.id}\n`);
    });

    console.log(`\n✨ Total: ${products.length} produit(s)`);

    const productsWithoutSku = products.filter(p => !p.sku);
    if (productsWithoutSku.length > 0) {
      console.log(`\n⚠️  ${productsWithoutSku.length} produit(s) sans SKU - les variantes ne pourront pas être liées !`);
    }
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listProductSkus();
