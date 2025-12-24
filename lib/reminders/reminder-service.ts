import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { Order, ReminderSettings } from '@prisma/client';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ReminderResult {
  orderId: string;
  orderNumber: string;
  reminderType: string;
  sentTo: string[];
  success: boolean;
  error?: string;
}

/**
 * Check for overdue invoices and send reminders
 */
export async function checkOverdueInvoices(
  tenantId: string
): Promise<ReminderResult[]> {
  const results: ReminderResult[] = [];

  // Get reminder settings for this tenant
  const settings = await prisma.reminderSettings.findUnique({
    where: { tenantId },
  });

  // If reminders are disabled or settings don't exist, skip
  if (!settings || !settings.enabled) {
    return results;
  }

  const now = new Date();

  // Find all orders with due dates that are past and not fully paid
  const overdueOrders = await prisma.order.findMany({
    where: {
      tenantId,
      dueDate: {
        lte: now,
      },
      paymentStatus: {
        in: ['PENDING', 'PARTIAL'],
      },
    },
    include: {
      customer: true,
      reminders: true,
    },
  });

  // Process each overdue order
  for (const order of overdueOrders) {
    const reminderType = shouldSendReminder(order, settings);

    if (reminderType) {
      try {
        await sendReminderEmail(order, reminderType, settings);
        const sentTo = await createReminderRecord(order.id, reminderType, settings);

        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          reminderType,
          sentTo,
          success: true,
        });
      } catch (error) {
        results.push({
          orderId: order.id,
          orderNumber: order.orderNumber,
          reminderType,
          sentTo: [],
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  }

  return results;
}

/**
 * Determine if a reminder should be sent and which type
 */
export function shouldSendReminder(
  order: Order & { reminders: any[] },
  settings: ReminderSettings
): string | null {
  if (!order.dueDate) return null;

  const now = new Date();
  const daysPastDue = Math.floor(
    (now.getTime() - order.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Check what reminders have already been sent
  const sentReminderTypes = order.reminders.map((r) => r.reminderType);

  // Determine which reminder to send based on days past due
  if (
    daysPastDue >= settings.finalReminderDays &&
    !sentReminderTypes.includes('final')
  ) {
    return 'final';
  }

  if (
    daysPastDue >= settings.secondReminderDays &&
    !sentReminderTypes.includes('second')
  ) {
    return 'second';
  }

  if (
    daysPastDue >= settings.firstReminderDays &&
    !sentReminderTypes.includes('first')
  ) {
    return 'first';
  }

  return null;
}

/**
 * Send reminder email using Resend
 */
export async function sendReminderEmail(
  order: Order & { customer: any },
  reminderType: string,
  settings: ReminderSettings
): Promise<void> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: order.tenantId },
  });

  if (!tenant) {
    throw new Error('Tenant not found');
  }

  // Prepare email content
  const subject = getReminderSubject(reminderType, order);
  const htmlContent = getReminderEmailHTML(reminderType, order, tenant, settings);

  const recipients: string[] = [];

  // Add customer email
  if (settings.sendToCustomer) {
    if (order.customer?.email) {
      recipients.push(order.customer.email);
    } else if (order.guestEmail) {
      recipients.push(order.guestEmail);
    }
  }

  // Add admin email
  if (settings.sendToAdmin && settings.adminEmail) {
    recipients.push(settings.adminEmail);
  }

  if (recipients.length === 0) {
    throw new Error('No recipients configured for reminder email');
  }

  // Send email via Resend
  // Use onboarding@resend.dev for testing, or your verified domain in production
  const fromEmail = process.env.NODE_ENV === 'production'
    ? `${tenant.name} <noreply@operiscloud.com>`
    : 'Rappels OperisCloud <onboarding@resend.dev>';

  await resend.emails.send({
    from: fromEmail,
    to: recipients,
    subject,
    html: htmlContent,
  });
}

/**
 * Create reminder record in database
 */
export async function createReminderRecord(
  orderId: string,
  reminderType: string,
  settings: ReminderSettings
): Promise<string[]> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: true },
  });

  if (!order) {
    throw new Error('Order not found');
  }

  const sentTo: string[] = [];

  if (settings.sendToCustomer) {
    if (order.customer?.email) {
      sentTo.push(order.customer.email);
    } else if (order.guestEmail) {
      sentTo.push(order.guestEmail);
    }
  }

  if (settings.sendToAdmin && settings.adminEmail) {
    sentTo.push(settings.adminEmail);
  }

  await prisma.invoiceReminder.create({
    data: {
      orderId,
      tenantId: order.tenantId,
      reminderType,
      sentTo,
    },
  });

  return sentTo;
}

/**
 * Get email subject based on reminder type
 */
function getReminderSubject(reminderType: string, order: Order): string {
  switch (reminderType) {
    case 'first':
      return `Rappel: Facture ${order.orderNumber} en attente de paiement`;
    case 'second':
      return `2ème rappel: Facture ${order.orderNumber} impayée`;
    case 'final':
      return `Dernier rappel: Facture ${order.orderNumber} - Action requise`;
    default:
      return `Rappel de paiement - Facture ${order.orderNumber}`;
  }
}

/**
 * Generate HTML content for reminder email
 */
function getReminderEmailHTML(
  reminderType: string,
  order: Order & { customer: any },
  tenant: any,
  settings: ReminderSettings
): string {
  // Use custom template if provided
  if (settings.emailTemplate) {
    return settings.emailTemplate
      .replace('{{orderNumber}}', order.orderNumber)
      .replace('{{total}}', order.total.toString())
      .replace('{{currency}}', tenant.currency)
      .replace('{{dueDate}}', order.dueDate?.toLocaleDateString('fr-FR') || '')
      .replace('{{companyName}}', tenant.name);
  }

  // Default template
  const customerName = order.customer
    ? `${order.customer.firstName} ${order.customer.lastName || ''}`
    : order.guestName || 'Client';

  const urgencyMessage =
    reminderType === 'final'
      ? '<p style="color: #dc2626; font-weight: bold;">⚠️ Ceci est notre dernier rappel. Veuillez régulariser votre situation dans les plus brefs délais.</p>'
      : reminderType === 'second'
      ? '<p style="color: #f59e0b; font-weight: bold;">Ce paiement est maintenant en retard significatif.</p>'
      : '<p>Nous vous rappelons que le paiement de cette facture est échu.</p>';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
        <h2 style="color: ${tenant.primaryColor || '#3b82f6'}; margin-top: 0;">
          ${tenant.name}
        </h2>

        <h3>Rappel de paiement</h3>

        <p>Bonjour ${customerName},</p>

        ${urgencyMessage}

        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Facture N°:</strong> ${order.orderNumber}</p>
          <p style="margin: 5px 0;"><strong>Montant:</strong> ${order.total} ${tenant.currency}</p>
          <p style="margin: 5px 0;"><strong>Date d'échéance:</strong> ${order.dueDate?.toLocaleDateString('fr-FR') || 'N/A'}</p>
        </div>

        <p>Si vous avez déjà effectué ce paiement, veuillez ignorer ce message.</p>

        <p>Pour toute question, n'hésitez pas à nous contacter:</p>
        <ul style="list-style: none; padding: 0;">
          ${tenant.companyEmail ? `<li>📧 ${tenant.companyEmail}</li>` : ''}
          ${tenant.companyPhone ? `<li>📞 ${tenant.companyPhone}</li>` : ''}
        </ul>

        <p style="margin-top: 30px; font-size: 12px; color: #666;">
          Cordialement,<br>
          L'équipe ${tenant.name}
        </p>
      </div>
    </body>
    </html>
  `;
}
