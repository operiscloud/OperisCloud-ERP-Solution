import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateHasVariants() {
  try {
    console.log('🔄 Mise à jour du champ hasVariants...');

    // Trouver tous les produits qui ont des variantes
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      },
    });

    let updated = 0;

    for (const product of products) {
      if (product.variants.length > 0 && !product.hasVariants) {
        await prisma.product.update({
          where: { id: product.id },
          data: { hasVariants: true },
        });
        console.log(`✅ Produit "${product.name}" mis à jour (${product.variants.length} variantes)`);
        updated++;
      }
    }

    console.log(`\n✨ Terminé ! ${updated} produit(s) mis à jour.`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateHasVariants();
