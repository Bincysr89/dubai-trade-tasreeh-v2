import React from 'react';
import Dh from './Dh';
import ModalShell, { ModalTable, ModalTh, modalTd } from './ModalShell';

const font = "'Dubai', sans-serif";

export type ApprovalCharge = { chargeType: string; calculated: string; approved: string; total?: boolean };
export type ApprovalRemark = { remarkType: string; description: string };
export type SettlementInvoice = {
  invoiceType: string; invoiceNo: string; invoiceDate: string;
  receiptType: string; receiptNo: string; receiptDate: string;
};

const CHARGES: ApprovalCharge[] = [
  { chargeType: 'Correction Charge',           calculated: '0.00',     approved: '111.00' },
  { chargeType: 'Knowledge-Innovation Dirham', calculated: '0.00',     approved: '20.00' },
  { chargeType: 'Makasa To Be Collected',      calculated: '0.00',     approved: '0.00' },
  { chargeType: 'Makasa Already Collected',    calculated: '0.00',     approved: '0.00' },
  { chargeType: 'Refundable Deposit',          calculated: '2,500.00', approved: '1,200.00' },
  { chargeType: 'Duty',                        calculated: '0.00',     approved: '1,300.00' },
  { chargeType: 'Correction Charge',           calculated: '0.00',     approved: '111.00' },
  { chargeType: 'Knowledge-Innovation Dirham', calculated: '0.00',     approved: '20.00' },
  { chargeType: 'Total Charges',               calculated: '0.00',     approved: '1,431.00', total: true },
];

const REMARKS: ApprovalRemark[] = [
  { remarkType: 'Change of Amount',           description: 'dsaf' },
  { remarkType: "Approval with Add'l Charges", description: 'sfda' },
  { remarkType: 'Approval With Discrepancy',  description: 'fdsa' },
  { remarkType: 'Change of Amount',           description: 'dsaf' },
  { remarkType: "Approval with Add'l Charges", description: 'sfda' },
  { remarkType: 'Approval With Discrepancy',  description: 'fdsa' },
];

const INVOICES: SettlementInvoice[] = [
  { invoiceType: 'Receivable Invoice', invoiceNo: '47074', invoiceDate: '29/07/2026', receiptType: 'e-Revenue Receipt', receiptNo: 'R-1081704', receiptDate: '09/01/2026' },
];

function Amount({ value, bold }: { value: string; bold?: boolean }) {
  return (
    <span className="text-[16px] inline-flex items-baseline gap-[3px]"
      style={{ color: '#051937', fontFamily: font, fontWeight: bold ? 700 : 400 }}>
      <Dh style={{ fontSize: 15 }} />{value}
    </span>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  /** The sub-claim the approval belongs to — named in the title bar. */
  subject?: string;
  charges?: ApprovalCharge[];
  remarks?: ApprovalRemark[];
  invoices?: SettlementInvoice[];
};

/** Claim Approval Details — what was approved against what was calculated, the
    approver's remarks, and the invoice the settlement was raised on. */
export default function ClaimApprovalDetailsModal({
  open, onClose, subject, charges = CHARGES, remarks = REMARKS, invoices = INVOICES,
}: Props) {
  const cell = { ...modalTd };

  return (
    <ModalShell open={open} onClose={onClose} maxWidth={900}
      title={`Claim Approval Details${subject ? ` — ${subject}` : ''}`}>

      <ModalTable title="Claim Approval Details">
        <thead>
          <tr>
            <ModalTh label="Charge Type" />
            <ModalTh label="Calculated Amount (AED)" align="right" />
            <ModalTh label="Approved Amount (AED)" align="right" />
          </tr>
        </thead>
        <tbody>
          {charges.map((c, i) => (
            <tr key={`${c.chargeType}-${i}`} style={{ borderBottom: '1px solid #f0f3fa', background: c.total ? '#dce8f7' : undefined }}>
              <td style={cell}>
                <span className="text-[16px]" style={{ color: '#051937', fontWeight: c.total ? 700 : 400 }}>{c.chargeType}</span>
              </td>
              <td style={{ ...cell, textAlign: 'right' }}><Amount value={c.calculated} bold={c.total} /></td>
              <td style={{ ...cell, textAlign: 'right' }}><Amount value={c.approved} bold={c.total} /></td>
            </tr>
          ))}
        </tbody>
      </ModalTable>

      <ModalTable title="Remarks">
        <thead>
          <tr>
            <ModalTh label="Remark Type" />
            <ModalTh label="Description" />
          </tr>
        </thead>
        <tbody>
          {remarks.map((r, i) => (
            <tr key={`${r.remarkType}-${i}`} style={{ borderBottom: '1px solid #f0f3fa' }}>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{r.remarkType}</span></td>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{r.description}</span></td>
            </tr>
          ))}
        </tbody>
      </ModalTable>

      <ModalTable title="Settlement Details">
        <thead>
          <tr>
            {['Invoice Type', 'Invoice No.', 'Invoice Date', 'Settlement Receipt Type', 'Settlement Receipt No.', 'Settlement Receipt Date']
              .map((h) => <ModalTh key={h} label={h} />)}
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.invoiceNo} style={{ borderBottom: '1px solid #f0f3fa' }}>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{inv.invoiceType}</span></td>
              <td style={cell}><span className="text-[16px]" style={{ color: '#1360d2', fontWeight: 500 }}>{inv.invoiceNo}</span></td>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{inv.invoiceDate}</span></td>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{inv.receiptType}</span></td>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{inv.receiptNo}</span></td>
              <td style={cell}><span className="text-[16px]" style={{ color: '#051937' }}>{inv.receiptDate}</span></td>
            </tr>
          ))}
        </tbody>
      </ModalTable>
    </ModalShell>
  );
}
