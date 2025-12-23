interface QuoteData {
  quoteNumber: string;
  quoteDate: Date;
  validUntil: Date;
  companyName: string;
  companyAddress?: string;
  companyCity?: string;
  companyPostalCode?: string;
  companyCountry?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
  taxNumber?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  customerAddress?: string;
  items: Array<{
    name: string;
    sku?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  shippingCost: number;
  total: number;
  currency: string;
  notes?: string;
  invoiceFooter?: string;
  bankName?: string;
  bankIBAN?: string;
  bankBIC?: string;
  bankAccountHolder?: string;
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

export function generateQuoteHTML(data: QuoteData): string {
  const config = data.templateConfig || {};
  const primaryColor = config.primaryColor || '#10b981';
  const secondaryColor = config.secondaryColor || '#64748b';
  const accentColor = config.accentColor || '#dc2626';
  const showCompanyInfo = config.showCompanyInfo !== false;
  const showBankInfo = config.showBankInfo !== false;

  const fontFamily =
    config.fontStyle === 'times' ? 'Times New Roman, serif' :
    config.fontStyle === 'courier' ? 'Courier New, monospace' :
    'Arial, sans-serif';

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const itemsHTML = data.items.map(item => `
    <tr>
      <td>${item.sku || '-'}</td>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>${item.unitPrice.toFixed(2)} ${data.currency}</td>
      <td>${item.totalPrice.toFixed(2)} ${data.currency}</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Devis ${data.quoteNumber}</title>
    <style>
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
      body {
        font-family: ${fontFamily};
        padding: 50px;
        color: #000;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: start;
        margin-bottom: 40px;
      }
      .company-info h1 {
        font-size: 20px;
        font-weight: bold;
        margin-bottom: 10px;
      }
      .company-info p {
        font-size: 10px;
        line-height: 1.5;
      }
      .quote-title {
        text-align: right;
      }
      .quote-title h1 {
        font-size: 24px;
        font-weight: bold;
        color: ${primaryColor};
        margin-bottom: 10px;
      }
      .quote-title p {
        font-size: 10px;
        margin-bottom: 5px;
      }
      .customer-box {
        background-color: ${primaryColor}10;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        max-width: 400px;
      }
      .customer-box .label {
        font-size: 12px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .customer-box .content {
        font-size: 10px;
      }
      .customer-box .content div {
        margin-bottom: 4px;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 24px;
      }
      thead {
        background-color: ${primaryColor};
        color: white;
      }
      thead th {
        padding: 8px;
        font-size: 10px;
        font-weight: bold;
        text-align: left;
      }
      thead th:nth-child(2),
      thead th:nth-child(3),
      thead th:nth-child(4),
      thead th:nth-child(5) {
        text-align: right;
      }
      tbody td {
        padding: 8px;
        font-size: 10px;
        border-bottom: 1px solid ${secondaryColor}30;
      }
      tbody td:nth-child(2),
      tbody td:nth-child(3),
      tbody td:nth-child(4),
      tbody td:nth-child(5) {
        text-align: right;
      }
      .totals {
        display: flex;
        justify-content: flex-end;
        margin-bottom: 24px;
      }
      .totals-content {
        width: 300px;
      }
      .totals-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        font-size: 10px;
      }
      .totals-row.total {
        background-color: ${primaryColor};
        color: white;
        padding: 12px 16px;
        margin-top: 8px;
        font-weight: bold;
        font-size: 12px;
      }
      .notes-box {
        margin-bottom: 24px;
      }
      .notes-box .label {
        font-size: 10px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .notes-box .content {
        font-size: 9px;
      }
      .bank-box {
        background-color: ${secondaryColor}10;
        padding: 16px;
        border-radius: 8px;
        margin-bottom: 24px;
        max-width: 400px;
      }
      .bank-box .label {
        font-size: 10px;
        font-weight: 600;
        margin-bottom: 8px;
      }
      .bank-box .content {
        font-size: 9px;
      }
      .bank-box .content div {
        margin-bottom: 4px;
      }
      .validity-notice {
        font-size: 9px;
        font-weight: 600;
        color: ${accentColor};
        margin-bottom: 24px;
      }
      .footer {
        margin-top: 40px;
        padding-top: 16px;
        border-top: 1px solid ${secondaryColor}30;
        text-align: center;
        font-size: 8px;
        color: ${secondaryColor};
      }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="company-info">
        ${showCompanyInfo ? `
          <h1>${data.companyName}</h1>
          ${data.companyAddress ? `<p>${data.companyAddress}</p>` : ''}
          ${data.companyPostalCode && data.companyCity ? `<p>${data.companyPostalCode} ${data.companyCity}</p>` : ''}
          ${data.companyCountry ? `<p>${data.companyCountry}</p>` : ''}
          ${data.companyPhone ? `<p>Tél: ${data.companyPhone}</p>` : ''}
          ${data.companyEmail ? `<p>Email: ${data.companyEmail}</p>` : ''}
          ${data.companyWebsite ? `<p>Web: ${data.companyWebsite}</p>` : ''}
          ${data.taxNumber ? `<p>TVA: ${data.taxNumber}</p>` : ''}
        ` : ''}
      </div>
      <div class="quote-title">
        <h1>DEVIS</h1>
        <p>N° ${data.quoteNumber}</p>
        <p>Date: ${formatDate(data.quoteDate)}</p>
        <p>Valide jusqu'au: ${formatDate(data.validUntil)}</p>
      </div>
    </div>

    <div class="customer-box">
      <div class="label">Devis pour:</div>
      <div class="content">
        <div style="font-weight: 500">${data.customerName}</div>
        ${data.customerAddress ? `<div>${data.customerAddress}</div>` : ''}
        ${data.customerEmail ? `<div>${data.customerEmail}</div>` : ''}
        ${data.customerPhone ? `<div>${data.customerPhone}</div>` : ''}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Code</th>
          <th>Description</th>
          <th>Qté</th>
          <th>Prix unit.</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHTML}
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-content">
        <div class="totals-row">
          <span>Sous-total:</span>
          <span>${data.subtotal.toFixed(2)} ${data.currency}</span>
        </div>
        ${data.discount > 0 ? `
          <div class="totals-row">
            <span>Remise:</span>
            <span>-${data.discount.toFixed(2)} ${data.currency}</span>
          </div>
        ` : ''}
        ${data.shippingCost > 0 ? `
          <div class="totals-row">
            <span>Livraison:</span>
            <span>${data.shippingCost.toFixed(2)} ${data.currency}</span>
          </div>
        ` : ''}
        <div class="totals-row">
          <span>TVA (${data.taxRate}%):</span>
          <span>${data.taxAmount.toFixed(2)} ${data.currency}</span>
        </div>
        <div class="totals-row total">
          <span>TOTAL:</span>
          <span>${data.total.toFixed(2)} ${data.currency}</span>
        </div>
      </div>
    </div>

    ${data.notes ? `
      <div class="notes-box">
        <div class="label">Notes:</div>
        <div class="content">${data.notes}</div>
      </div>
    ` : ''}

    ${showBankInfo && data.bankIBAN ? `
      <div class="bank-box">
        <div class="label">Informations bancaires:</div>
        <div class="content">
          ${data.bankName ? `<div>Banque: ${data.bankName}</div>` : ''}
          ${data.bankAccountHolder ? `<div>Titulaire: ${data.bankAccountHolder}</div>` : ''}
          <div>IBAN: ${data.bankIBAN}</div>
          ${data.bankBIC ? `<div>BIC/SWIFT: ${data.bankBIC}</div>` : ''}
        </div>
      </div>
    ` : ''}

    <div class="validity-notice">
      Ce devis est valide jusqu'au ${formatDate(data.validUntil)}
    </div>

    ${data.invoiceFooter ? `
      <div class="footer">
        ${data.invoiceFooter}
      </div>
    ` : ''}
  </body>
</html>`;
}
