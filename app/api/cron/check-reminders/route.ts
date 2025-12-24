import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkOverdueInvoices } from '@/lib/reminders/reminder-service';

/**
 * Cron job endpoint to check for overdue invoices and send reminders
 * This should be called daily by an external cron service
 */
export async function GET(request: NextRequest) {
  try {
    // Verify the cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!process.env.CRON_SECRET || token !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all tenants with reminder settings enabled
    const tenantsWithReminders = await prisma.reminderSettings.findMany({
      where: {
        enabled: true,
      },
      select: {
        tenantId: true,
      },
    });

    console.log(`[Cron] Checking reminders for ${tenantsWithReminders.length} tenants`);

    const results = {
      totalTenants: tenantsWithReminders.length,
      totalReminders: 0,
      successfulReminders: 0,
      failedReminders: 0,
      tenantResults: [] as any[],
    };

    // Process each tenant
    for (const { tenantId } of tenantsWithReminders) {
      try {
        const reminderResults = await checkOverdueInvoices(tenantId);

        const successful = reminderResults.filter((r) => r.success).length;
        const failed = reminderResults.filter((r) => !r.success).length;

        results.totalReminders += reminderResults.length;
        results.successfulReminders += successful;
        results.failedReminders += failed;

        if (reminderResults.length > 0) {
          results.tenantResults.push({
            tenantId,
            reminders: reminderResults.length,
            successful,
            failed,
          });
        }
      } catch (error) {
        console.error(`[Cron] Error processing tenant ${tenantId}:`, error);
        results.tenantResults.push({
          tenantId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    console.log('[Cron] Reminder check complete:', results);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('[Cron] Fatal error in check-reminders:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * Also support POST method for manual testing
 */
export async function POST(request: NextRequest) {
  return GET(request);
}
