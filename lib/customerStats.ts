import { prisma } from './prisma';
import { assignCustomerToSegment } from './segments';

/**
 * Recalculate and update customer statistics based on their orders
 * This should be called whenever orders are created, updated, or deleted
 */
export async function updateCustomerStats(customerId: string, tenantId: string) {
  try {
    // Get all orders for this customer
    const orders = await prisma.order.findMany({
      where: {
        customerId,
        tenantId,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0);
    const lastOrderAt = orders.length > 0 ? orders[0].createdAt : null;

    console.log(`[CustomerStats] Updating stats for customer ${customerId}: ${totalOrders} orders, ${totalSpent} CHF spent`);

    // Update customer record
    await prisma.customer.update({
      where: { id: customerId },
      data: {
        totalOrders,
        totalSpent,
        lastOrderAt,
      },
    });

    // Auto-reassign to matching segment based on updated stats
    await assignCustomerToSegment(customerId, tenantId);
  } catch (error) {
    console.error('Error updating customer stats:', error);
  }
}
