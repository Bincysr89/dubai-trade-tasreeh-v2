export type InvoiceStatus = 'Created' | 'Paid' | 'Cancelled';

export type InvoiceLineItem = { description: string; amount: number };

export type ChargeInvoice = {
  invoiceNo: string;
  rotationNo: string;
  referenceNo: string;
  invoiceType: string;
  createdDate: string;
  invoiceDate: string;
  paymentDueDate: string;
  paymentAmount: number;
  status: InvoiceStatus;
  agentBusinessCode: string;
  agentBusinessName: string;
  contactNumber: string;
  lineItems: InvoiceLineItem[];
};

export const INVOICE_TYPE_OPTIONS = [
  'Import Manifest Discrepancy Fines',
  'SEA Export Late Manifest Fine',
  'SEA Export Manifest Discrepancy Fine',
  'SEA Export Manifest Service Charges',
];

export const INVOICE_TYPE_TITLES: Record<string, string> = {
  'Import Manifest Discrepancy Fines': 'Import Manifest Discrepancy Fine Invoice',
  'SEA Export Late Manifest Fine': 'Sea Export Late Manifest Submission Invoice',
  'SEA Export Manifest Discrepancy Fine': 'Sea Export Manifest Discrepancy Fine Invoice',
  'SEA Export Manifest Service Charges': 'Sea Export Manifest Service Charges Invoice',
};

export const INVOICE_STATUS_OPTIONS: InvoiceStatus[] = ['Created', 'Paid', 'Cancelled'];

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, { bg: string; color: string }> = {
  Created:   { bg: '#e2ebf9', color: '#1360d2' },
  Paid:      { bg: '#d1f5df', color: '#28a745' },
  Cancelled: { bg: '#fde2e2', color: '#dc3545' },
};

export const INVOICE_DATE_TYPE_OPTIONS = ['Created Date', 'Payment Due Date'];

export const INVOICE_SEARCH_TYPE_LABELS: Record<string, string> = {
  invoiceNo: 'Invoice No',
  rotationNo: 'Rotation No',
  referenceNo: 'Reference No',
};

const AGENT_BUSINESS_CODE = 'AE-1051144';
const AGENT_BUSINESS_NAME = 'xcrn business new01';
const AGENT_CONTACT_NUMBER = '971-5-0157252';

export const CHARGE_INVOICES: ChargeInvoice[] = [
  { invoiceNo: '1000004868', rotationNo: '900147', referenceNo: 'REF-100447', invoiceType: 'SEA Export Late Manifest Fine', createdDate: '21-May-26', invoiceDate: '21-May-26', paymentDueDate: '29-May-26', paymentAmount: 520, status: 'Created', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Export Late Manifest Fine', amount: 500 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004869', rotationNo: '900148', referenceNo: 'REF-100448', invoiceType: 'SEA Export Late Manifest Fine', createdDate: '12-Aug-26', invoiceDate: '12-Aug-26', paymentDueDate: '20-Aug-26', paymentAmount: 220, status: 'Paid', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Export Late Manifest Fine', amount: 200 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004870', rotationNo: '900134', referenceNo: 'REF-100434', invoiceType: 'SEA Export Manifest Discrepancy Fine', createdDate: '12-Aug-26', invoiceDate: '12-Aug-26', paymentDueDate: '20-Aug-26', paymentAmount: 520, status: 'Created', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Export Manifest Discrepancy Fine', amount: 500 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004871', rotationNo: '900147', referenceNo: 'REF-100447', invoiceType: 'SEA Export Manifest Discrepancy Fine', createdDate: '13-Aug-26', invoiceDate: '13-Aug-26', paymentDueDate: '21-Aug-26', paymentAmount: 720, status: 'Created', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Export Manifest Discrepancy Fine', amount: 700 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004872', rotationNo: '900147', referenceNo: 'REF-100447', invoiceType: 'SEA Export Manifest Service Charges', createdDate: '14-Aug-26', invoiceDate: '14-Aug-26', paymentDueDate: '22-Aug-26', paymentAmount: 360, status: 'Cancelled', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Manifest Service Charge', amount: 340 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004873', rotationNo: '900201', referenceNo: 'REF-100501', invoiceType: 'Import Manifest Discrepancy Fines', createdDate: '10-Aug-26', invoiceDate: '10-Aug-26', paymentDueDate: '18-Aug-26', paymentAmount: 320, status: 'Created', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Import Manifest Discrepancy Fine', amount: 300 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004874', rotationNo: '900202', referenceNo: 'REF-100502', invoiceType: 'Import Manifest Discrepancy Fines', createdDate: '05-Aug-26', invoiceDate: '05-Aug-26', paymentDueDate: '13-Aug-26', paymentAmount: 520, status: 'Paid', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Import Manifest Discrepancy Fine', amount: 500 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004875', rotationNo: '900156', referenceNo: 'REF-100456', invoiceType: 'SEA Export Manifest Service Charges', createdDate: '02-Aug-26', invoiceDate: '02-Aug-26', paymentDueDate: '10-Aug-26', paymentAmount: 120, status: 'Paid', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Manifest Service Charge', amount: 100 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004876', rotationNo: '900160', referenceNo: 'REF-100460', invoiceType: 'SEA Export Late Manifest Fine', createdDate: '30-Jul-26', invoiceDate: '30-Jul-26', paymentDueDate: '07-Aug-26', paymentAmount: 1020, status: 'Cancelled', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Export Late Manifest Fine', amount: 1000 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
  { invoiceNo: '1000004877', rotationNo: '900211', referenceNo: 'REF-100511', invoiceType: 'SEA Export Manifest Discrepancy Fine', createdDate: '15-Aug-26', invoiceDate: '15-Aug-26', paymentDueDate: '23-Aug-26', paymentAmount: 220, status: 'Created', agentBusinessCode: AGENT_BUSINESS_CODE, agentBusinessName: AGENT_BUSINESS_NAME, contactNumber: AGENT_CONTACT_NUMBER, lineItems: [{ description: 'Export Manifest Discrepancy Fine', amount: 200 }, { description: 'Knowledge Dirham', amount: 10 }, { description: 'Innovation Dirham', amount: 10 }] },
];

/* ── Amount-in-words (AED), matching the reference's number-to-words formatting ── */
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function chunkToWords(n: number): string {
  const parts: string[] = [];
  if (n >= 100) { parts.push(`${ONES[Math.floor(n / 100)]} Hundred`); n %= 100; }
  if (n >= 20) { parts.push(TENS[Math.floor(n / 10)]); n %= 10; }
  if (n > 0) parts.push(ONES[n]);
  return parts.join(' ');
}

export function amountInWords(amount: number): string {
  const n = Math.round(amount);
  if (n === 0) return 'Dirhams Zero only';
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;
  const words = [thousands > 0 ? `${chunkToWords(thousands)} Thousand` : '', rest > 0 ? chunkToWords(rest) : ''].filter(Boolean).join(' ');
  return `Dirhams ${words} only`;
}
