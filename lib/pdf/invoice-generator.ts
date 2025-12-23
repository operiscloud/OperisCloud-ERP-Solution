import { PDFDocument, rgb, StandardFonts, RGB } from 'pdf-lib';

// Helper function to convert hex color to RGB
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return rgb(0, 0, 0); // Default to black if invalid
  }
  return rgb(
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255
  );
}

interface InvoiceData {
  // Order info
  orderNumber: string;
  orderDate: Date;
  dueDate?: Date;
  status: string;

  // Company info
  companyName: string;
  companyAddress?: string;
  companyCity?: string;
  companyPostalCode?: string;
  companyCountry?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  taxNumber?: string;
  registrationNumber?: string;

  // Customer info
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;

  // Items
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;

  // Totals
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  shippingCost: number;
  giftCardAmount?: number;
  total: number;
  currency: string;

  // Notes
  notes?: string;
  invoiceFooter?: string;

  // Bank info
  bankName?: string;
  bankIBAN?: string;
  bankBIC?: string;
  bankAccountHolder?: string;

  // Template config
  templateConfig?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
    headerStyle?: 'modern' | 'classic' | 'minimal';
    fontStyle?: 'helvetica' | 'times' | 'courier';
    showLogo?: boolean;
    showCompanyInfo?: boolean;
    showBankInfo?: boolean;
  };
}

export async function generateInvoicePDF(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  // Get template config with defaults
  const config = data.templateConfig || {};
  const primaryColor = config.primaryColor ? hexToRgb(config.primaryColor) : rgb(0.15, 0.39, 0.92);
  const secondaryColor = config.secondaryColor ? hexToRgb(config.secondaryColor) : rgb(0.95, 0.95, 0.95);
  const accentColor = config.accentColor ? hexToRgb(config.accentColor) : rgb(0.93, 0.28, 0.60);
  const showCompanyInfo = config.showCompanyInfo !== false; // Default true
  const showBankInfo = config.showBankInfo !== false; // Default true

  // Select font based on config
  let font, fontBold;
  if (config.fontStyle === 'times') {
    font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  } else if (config.fontStyle === 'courier') {
    font = await pdfDoc.embedFont(StandardFonts.Courier);
    fontBold = await pdfDoc.embedFont(StandardFonts.CourierBold);
  } else {
    font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  }

  let yPos = height - 50;

  // Company header
  if (showCompanyInfo) {
    page.drawText(data.companyName, {
      x: 50,
      y: yPos,
      size: 20,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPos -= 20;

    page.setFont(font);
    page.setFontSize(10);

    if (data.companyAddress) {
      page.drawText(data.companyAddress, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
      yPos -= 15;
    }
    if (data.companyCity && data.companyPostalCode) {
      page.drawText(`${data.companyPostalCode} ${data.companyCity}`, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
      yPos -= 15;
    }
    if (data.companyPhone) {
      page.drawText(`Tél: ${data.companyPhone}`, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
      yPos -= 15;
    }
    if (data.companyEmail) {
      page.drawText(`Email: ${data.companyEmail}`, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
      yPos -= 15;
    }
    if (data.taxNumber) {
      page.drawText(`TVA: ${data.taxNumber}`, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
      yPos -= 15;
    }
  }

  // Invoice title (right side)
  page.drawText('FACTURE', {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: fontBold,
    color: primaryColor,
  });

  page.drawText(`N° ${data.orderNumber}`, {
    x: width - 150,
    y: height - 80,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  page.drawText(`Date: ${formatDate(data.orderDate)}`, {
    x: width - 150,
    y: height - 95,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Customer info - with background box
  yPos = height - 200;

  // Calculate height needed for customer info
  let customerInfoLines = 2; // "Facturer à:" + name
  if (data.customerAddress) customerInfoLines++;
  if (data.customerEmail) customerInfoLines++;
  const customerBoxHeight = customerInfoLines * 15 + 15;

  // Draw background rectangle with primary color (light opacity)
  const bgColor = rgb(
    primaryColor.red * 0.9 + 0.1,
    primaryColor.green * 0.9 + 0.1,
    primaryColor.blue * 0.9 + 0.1
  );
  page.drawRectangle({
    x: 45,
    y: yPos - customerBoxHeight + 5,
    width: 250,
    height: customerBoxHeight,
    color: bgColor,
  });

  page.drawText('Facturer à:', { x: 50, y: yPos, size: 12, font: fontBold, color: rgb(0, 0, 0) });
  yPos -= 20;
  page.drawText(data.customerName, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
  yPos -= 15;

  if (data.customerAddress) {
    page.drawText(data.customerAddress, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    yPos -= 15;
  }
  if (data.customerEmail) {
    page.drawText(data.customerEmail, { x: 50, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    yPos -= 15;
  }

  // Items table
  yPos = height - 320;
  const tableTop = yPos;

  // Table header - with primary color background
  page.drawRectangle({
    x: 50,
    y: tableTop - 25,
    width: 495,
    height: 25,
    color: primaryColor,
  });

  page.drawText('Description', { x: 60, y: tableTop - 15, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Qté', { x: 350, y: tableTop - 15, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Prix Unit.', { x: 410, y: tableTop - 15, size: 10, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText('Total', { x: 490, y: tableTop - 15, size: 10, font: fontBold, color: rgb(1, 1, 1) });

  yPos = tableTop - 40;

  // Table rows with alternating background and borders
  data.items.forEach((item, index) => {
    const itemName = item.name.length > 40 ? item.name.substring(0, 37) + '...' : item.name;

    // Draw subtle border line
    page.drawLine({
      start: { x: 50, y: yPos - 5 },
      end: { x: 545, y: yPos - 5 },
      thickness: 0.5,
      color: rgb(
        secondaryColor.red * 0.3,
        secondaryColor.green * 0.3,
        secondaryColor.blue * 0.3
      ),
    });

    page.drawText(itemName, { x: 60, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    page.drawText(item.quantity.toString(), { x: 360, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    page.drawText(`${item.unitPrice.toFixed(2)}`, { x: 420, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    page.drawText(`${item.totalPrice.toFixed(2)}`, { x: 480, y: yPos, size: 10, font, color: rgb(0, 0, 0) });

    yPos -= 25;
  });

  // Totals section
  yPos -= 20;
  const totalsX = 350;

  page.drawText('Sous-total:', { x: totalsX, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
  page.drawText(`${data.subtotal.toFixed(2)} ${data.currency}`, { x: 480, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
  yPos -= 20;

  if (data.discount > 0) {
    page.drawText('Remise:', { x: totalsX, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    page.drawText(`-${data.discount.toFixed(2)} ${data.currency}`, { x: 480, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    yPos -= 20;
  }

  if (data.shippingCost > 0) {
    page.drawText('Livraison:', { x: totalsX, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    page.drawText(`${data.shippingCost.toFixed(2)} ${data.currency}`, { x: 480, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
    yPos -= 20;
  }

  page.drawText(`TVA (${data.taxRate}%):`, { x: totalsX, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
  page.drawText(`${data.taxAmount.toFixed(2)} ${data.currency}`, { x: 480, y: yPos, size: 10, font, color: rgb(0, 0, 0) });
  yPos -= 20;

  if (data.giftCardAmount && data.giftCardAmount > 0) {
    page.drawText('Bon cadeau:', { x: totalsX, y: yPos, size: 10, font, color: accentColor });
    page.drawText(`-${data.giftCardAmount.toFixed(2)} ${data.currency}`, { x: 480, y: yPos, size: 10, font, color: accentColor });
    yPos -= 20;
  }

  // Total
  page.drawRectangle({
    x: totalsX - 10,
    y: yPos - 10,
    width: 205,
    height: 30,
    color: primaryColor,
  });

  page.drawText('TOTAL:', { x: totalsX, y: yPos, size: 12, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText(`${data.total.toFixed(2)} ${data.currency}`, { x: 480, y: yPos, size: 12, font: fontBold, color: rgb(1, 1, 1) });

  // Bank Information - with background box
  if (showBankInfo && data.bankIBAN) {
    yPos -= 50;

    // Calculate height needed for bank info
    let bankInfoLines = 1; // "Informations bancaires:"
    if (data.bankName) bankInfoLines++;
    if (data.bankAccountHolder) bankInfoLines++;
    if (data.bankIBAN) bankInfoLines++;
    if (data.bankBIC) bankInfoLines++;
    const bankBoxHeight = bankInfoLines * 12 + 10;

    // Draw background with secondary color
    const bankBgColor = rgb(
      secondaryColor.red * 0.9 + 0.1,
      secondaryColor.green * 0.9 + 0.1,
      secondaryColor.blue * 0.9 + 0.1
    );
    page.drawRectangle({
      x: 45,
      y: yPos - bankBoxHeight + 10,
      width: 250,
      height: bankBoxHeight,
      color: bankBgColor,
    });

    page.drawText('Informations bancaires:', { x: 50, y: yPos, size: 10, font: fontBold, color: rgb(0, 0, 0) });
    yPos -= 15;

    if (data.bankName) {
      page.drawText(`Banque: ${data.bankName}`, { x: 50, y: yPos, size: 9, font, color: rgb(0, 0, 0) });
      yPos -= 12;
    }
    if (data.bankAccountHolder) {
      page.drawText(`Titulaire: ${data.bankAccountHolder}`, { x: 50, y: yPos, size: 9, font, color: rgb(0, 0, 0) });
      yPos -= 12;
    }
    if (data.bankIBAN) {
      page.drawText(`IBAN: ${data.bankIBAN}`, { x: 50, y: yPos, size: 9, font, color: rgb(0, 0, 0) });
      yPos -= 12;
    }
    if (data.bankBIC) {
      page.drawText(`BIC/SWIFT: ${data.bankBIC}`, { x: 50, y: yPos, size: 9, font, color: rgb(0, 0, 0) });
    }
  }

  // Footer
  if (data.invoiceFooter) {
    page.drawText(data.invoiceFooter, {
      x: 50,
      y: 50,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
      maxWidth: 495,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
