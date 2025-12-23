import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteAllProducts() {
  try {
    console.log('🗑️  Suppression de tous les produits et variantes...');

    // Supprimer tous les produits (les variantes seront supprimées automatiquement grâce à onDelete: Cascade)
    const result = await prisma.product.deleteMany({});

    console.log(`✅ ${result.count} produit(s) supprimé(s) (variantes incluses)`);
    console.log('✨ Base de données nettoyée !');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteAllProducts();
