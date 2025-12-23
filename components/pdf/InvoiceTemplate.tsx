import React from 'react';

interface InvoiceTemplateProps {
  // Order info
  orderNumber: string;
  orderDate: Date;
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

export default function InvoiceTemplate(props: InvoiceTemplateProps) {
  const config = props.templateConfig || {};
  const primaryColor = config.primaryColor || '#3b82f6';
  const secondaryColor = config.secondaryColor || '#64748b';
  const accentColor = config.accentColor || '#10b981';
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

  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <title>Facture {props.orderNumber}</title>
        <style>{`
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
          .invoice-title {
            text-align: right;
          }
          .invoice-title h1 {
            font-size: 24px;
            font-weight: bold;
            color: ${primaryColor};
            margin-bottom: 10px;
          }
          .invoice-title p {
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
          thead th:nth-child(4) {
            text-align: right;
          }
          tbody td {
            padding: 8px;
            font-size: 10px;
            border-bottom: 1px solid ${secondaryColor}30;
          }
          tbody td:nth-child(2),
          tbody td:nth-child(3),
          tbody td:nth-child(4) {
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
          .footer {
            margin-top: 40px;
            padding-top: 16px;
            border-top: 1px solid ${secondaryColor}30;
            text-align: center;
            font-size: 8px;
            color: ${secondaryColor};
          }
          @media print {
            body {
              padding: 0;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="header">
          <div className="company-info">
            {showCompanyInfo && (
              <>
                <h1>{props.companyName}</h1>
                {props.companyAddress && <p>{props.companyAddress}</p>}
                {props.companyPostalCode && props.companyCity && (
                  <p>{props.companyPostalCode} {props.companyCity}</p>
                )}
                {props.companyPhone && <p>Tél: {props.companyPhone}</p>}
                {props.companyEmail && <p>Email: {props.companyEmail}</p>}
                {props.taxNumber && <p>TVA: {props.taxNumber}</p>}
              </>
            )}
          </div>
          <div className="invoice-title">
            <h1>FACTURE</h1>
            <p>N° {props.orderNumber}</p>
            <p>Date: {formatDate(props.orderDate)}</p>
          </div>
        </div>

        <div className="customer-box">
          <div className="label">Facturer à:</div>
          <div className="content">
            <div style={{ fontWeight: '500' }}>{props.customerName}</div>
            {props.customerAddress && <div>{props.customerAddress}</div>}
            {props.customerEmail && <div>{props.customerEmail}</div>}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qté</th>
              <th>Prix unit.</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {props.items.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unitPrice.toFixed(2)} {props.currency}</td>
                <td>{item.totalPrice.toFixed(2)} {props.currency}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="totals">
          <div className="totals-content">
            <div className="totals-row">
              <span>Sous-total:</span>
              <span>{props.subtotal.toFixed(2)} {props.currency}</span>
            </div>
            {props.discount > 0 && (
              <div className="totals-row">
                <span>Remise:</span>
                <span>-{props.discount.toFixed(2)} {props.currency}</span>
              </div>
            )}
            {props.shippingCost > 0 && (
              <div className="totals-row">
                <span>Livraison:</span>
                <span>{props.shippingCost.toFixed(2)} {props.currency}</span>
              </div>
            )}
            <div className="totals-row">
              <span>TVA ({props.taxRate}%):</span>
              <span>{props.taxAmount.toFixed(2)} {props.currency}</span>
            </div>
            {props.giftCardAmount && props.giftCardAmount > 0 && (
              <div className="totals-row" style={{ color: accentColor }}>
                <span>Bon cadeau:</span>
                <span>-{props.giftCardAmount.toFixed(2)} {props.currency}</span>
              </div>
            )}
            <div className="totals-row total">
              <span>TOTAL:</span>
              <span>{props.total.toFixed(2)} {props.currency}</span>
            </div>
          </div>
        </div>

        {showBankInfo && props.bankIBAN && (
          <div className="bank-box">
            <div className="label">Coordonnées bancaires:</div>
            <div className="content">
              {props.bankName && <div>Banque: {props.bankName}</div>}
              {props.bankAccountHolder && <div>Titulaire: {props.bankAccountHolder}</div>}
              <div>IBAN: {props.bankIBAN}</div>
              {props.bankBIC && <div>BIC/SWIFT: {props.bankBIC}</div>}
            </div>
          </div>
        )}

        {props.invoiceFooter && (
          <div className="footer">
            {props.invoiceFooter}
          </div>
        )}
      </body>
    </html>
  );
}
