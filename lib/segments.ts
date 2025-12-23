import { prisma } from './prisma';

/**
 * Find and assign the best matching segment for a customer
 * This should be called whenever a customer is created or updated
 */
export async function assignCustomerToSegment(customerId: string, tenantId: string) {
  try {
    // Get the customer data
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      console.log(`[Segments] Customer ${customerId} not found`);
      return;
    }

    console.log(`[Segments] Assigning customer ${customer.firstName} ${customer.lastName} (spent: ${customer.totalSpent}, orders: ${customer.totalOrders}, city: ${customer.city})`);

    // Get all segments for this tenant
    const segments = await prisma.segment.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' }, // Most recent first
    });

    console.log(`[Segments] Found ${segments.length} segments to check`);

    // Find the first segment that matches the customer criteria
    for (const segment of segments) {
      const criteria = segment.criteria as any;
      console.log(`[Segments] Checking segment "${segment.name}" with criteria:`, criteria);
      let matches = true;

      // Check totalSpent criteria
      if (criteria.totalSpent) {
        if (criteria.totalSpent.min !== undefined && Number(customer.totalSpent) < criteria.totalSpent.min) {
          matches = false;
        }
        if (criteria.totalSpent.max !== undefined && Number(customer.totalSpent) > criteria.totalSpent.max) {
          matches = false;
        }
      }

      // Check orderCount criteria
      if (criteria.orderCount) {
        if (criteria.orderCount.min !== undefined && customer.totalOrders < criteria.orderCount.min) {
          matches = false;
        }
        if (criteria.orderCount.max !== undefined && customer.totalOrders > criteria.orderCount.max) {
          matches = false;
        }
      }

      // Check tags criteria
      if (criteria.tags && criteria.tags.length > 0) {
        const hasMatchingTag = criteria.tags.some((tag: string) => customer.tags.includes(tag));
        if (!hasMatchingTag) {
          matches = false;
        }
      }

      // Check city criteria
      if (criteria.city && criteria.city.length > 0) {
        if (!customer.city || !criteria.city.includes(customer.city)) {
          matches = false;
        }
      }

      // If this segment matches, assign the customer to it
      if (matches) {
        console.log(`[Segments] ✓ Customer matches segment "${segment.name}"! Assigning...`);
        await prisma.customer.update({
          where: { id: customerId },
          data: { segmentId: segment.id },
        });

        // Update segment customer count
        await updateSegmentCustomerCount(segment.id, tenantId);
        console.log(`[Segments] Customer successfully assigned to segment "${segment.name}"`);
        return;
      } else {
        console.log(`[Segments] ✗ Customer does not match segment "${segment.name}"`);
      }
    }

    // If no segment matches, remove segment assignment
    console.log(`[Segments] No matching segment found for customer`);
    if (customer.segmentId) {
      const oldSegmentId = customer.segmentId;
      console.log(`[Segments] Removing customer from previous segment`);
      await prisma.customer.update({
        where: { id: customerId },
        data: { segmentId: null },
      });

      // Update old segment customer count
      await updateSegmentCustomerCount(oldSegmentId, tenantId);
    }
  } catch (error) {
    console.error('Error assigning customer to segment:', error);
  }
}

/**
 * Update the customer count for a segment
 */
export async function updateSegmentCustomerCount(segmentId: string, tenantId: string) {
  try {
    const count = await prisma.customer.count({
      where: {
        tenantId,
        segmentId,
      },
    });

    await prisma.segment.update({
      where: { id: segmentId },
      data: { customerCount: count },
    });
  } catch (error) {
    console.error('Error updating segment customer count:', error);
  }
}

/**
 * Recalculate all segments for a tenant
 * Useful when segment criteria are updated
 */
export async function recalculateAllSegments(tenantId: string) {
  try {
    // Get all customers for this tenant
    const customers = await prisma.customer.findMany({
      where: { tenantId },
    });

    // Reassign each customer to the appropriate segment
    for (const customer of customers) {
      await assignCustomerToSegment(customer.id, tenantId);
    }
  } catch (error) {
    console.error('Error recalculating segments:', error);
  }
}
