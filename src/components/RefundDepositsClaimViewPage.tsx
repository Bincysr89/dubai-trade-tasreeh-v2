import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import Dh from './Dh';
import ClaimHeaderDetails from './ClaimHeaderDetails';
import { claimHeaderDefaultsFor } from './claimHeaderDefaults';
import ChargesBreakupModal from './ChargesBreakupModal';
import ClaimRequestVersions from './ClaimRequestVersions';
import {
  hasFullRefundOptions, hasDutyRefundOptions, hasNaRefundType, getInvoices, obKey,
  type ChargeDetail, type OutboundState, type OutboundDetail,
} from './RDChargeFlowPage';
import { mergeDocsByBatch, type UploadedDoc } from './NonRemittanceDocumentsPage';
import type { Row } from './EligibleDeclarationsPage';
import PrivilegesBenefitsModal, { AeoLogo, WlpLogo } from './PrivilegesBenefitsModal';
import ClaimApprovalDetailsModal from './ClaimApprovalDetailsModal';
import ModalShell, { ModalTable, ModalTh, modalTd } from './ModalShell';
import WaiverDetailsModal from './WaiverDetailsModal';
import ViewDeclarationPage from './declaration/ViewDeclarationPage';
import MoreIcon from './MoreIcon';
import { StatusChip } from './declaration/DeclarationUI';
import RowFlyout, { anchorFrom, type FlyoutAnchor, type FlyoutItem } from './declaration/RowFlyout';

const font = "'Dubai', 'Segoe UI', sans-serif";

/* ─── Shared presentational helpers — mirror NonRemittanceClaimViewPage's look ─── */
/* A field's label and value occupy 24 + 4 + 24px inside FieldCell's 12px padding. A
   marker rendered beside the field matches that box, so it lines up with the text. */
function FieldMarker({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center flex-shrink-0" style={{ height: 52, marginTop: 12 }}>{children}</span>
  );
}

/** The one field cell the claim view uses — every label lines up with every other. */
function FieldCell({ label, tag, children }: { label: string; tag?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[16px]"
      style={tag ? { flex: '1 0 270px', minWidth: 250 } : { flex: '1 0 200px', minWidth: 180 }}>
      <span className="flex items-center gap-[8px]" style={{ whiteSpace: 'nowrap' }}>
        <span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{label}</span>
        {tag && (
          <span className="text-[13px] px-[8px] py-[1px] rounded-[10px] whitespace-nowrap"
            style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
            {tag}
          </span>
        )}
      </span>
      {children}
    </div>
  );
}
function FieldItem({ label, value }: { label: string; value: string }) {
  return (
    <FieldCell label={label}>
      <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{value || '—'}</span>
    </FieldCell>
  );
}
function Divider() {
  return <div className="mx-[16px]" style={{ height: 1, background: '#f0f3fa' }} />;
}
function Section({ title, badge, children }: { title: string; badge?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[8px]">
      <div className="flex items-center gap-[10px] px-[4px]">
        <h2 className="text-[20px]" style={{ fontFamily: font, fontWeight: 700, color: '#0e1b3d' }}>{title}</h2>
        {badge && (
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>{badge}</span>
        )}
      </div>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5', boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Declaration/invoice/outbound shapes — mirror RDChargeFlowPage's own types so the
       real per-declaration data captured during the flow (refund type, claim amount, added
       outbound declarations, CDM reference fields) can be rendered as-is, with no lossy
       re-mapping. ─── */
/** A quantity split off a line item at its own unit price — Partial Export, allocation "Multiple". */
type UnitPriceLine = { id: string; statQty: string; unitPrice: string };

type HsLine = {
  id: string; lineItemNo: number; hsCode: string; description: string;
  statQty: string; suppQty: string; weight: string; unit: string; outbound: OutboundDetail[];
  /* Partial Export only — how the exported quantity was priced. */
  allocationMethod?: string; unitPrice?: string; currency?: string; unitPrices?: UnitPriceLine[];
};
type InvoiceGroup = { invoiceNo: string; hsLines: HsLine[] };

type DeclLine = {
  declarationNo: string; actualDepartureDate: string; declarationType: string; chargeType: string;
  depositMethod: string; accountNumber: string; depositAmount: string;
  /* Where this declaration's refund is paid out — a declaration-level choice. */
  refundMode: string; refundAccountNo: string; refundAccountName: string;
  refundType: string; claimAmount: string; invoices: InvoiceGroup[];
  refType?: string; refCode?: string; refNo?: string;
};

type ViewDoc = { id: string; declNo: string; docType: string; fileName: string; uploadedOn: string; remarks: string; batchId?: string };

/* Only Alternative Duty Deposit (and Duty) declarations carry export/outbound linkage —
   every other charge type (Missing Document, CDM, Cargo Transfer, Declaration Amendment/
   Cancellation Deposit) is a plain Refund/No Refund with no Invoice & HS Code / Outbound
   Declaration Details section, mirroring the create/amend claim flow's RDChargeFlowPage. */
const hasOutboundLinkage = (chargeType: string) => hasFullRefundOptions(chargeType) || hasDutyRefundOptions(chargeType);

const REFUND_TYPE_LABELS: Record<string, string> = {
  full: 'Full Export', fullImport: 'Full Import', partial: 'Partial Export', partialImport: 'Partial Import',
  no: 'No Export', refund: 'Refund', noRefund: 'No Refund', na: 'NA',
};

/* Real Invoice/HS-Code skeleton (same mock content RDChargeFlowPage showed while the user
   built the claim), with the actual outbound declarations the user added attached per HS
   line via the same obKey(declNo, hsId) lookup the flow itself uses. */
function buildInvoiceGroups(declNo: string, outbounds?: OutboundState, partial = false): InvoiceGroup[] {
  return getInvoices(declNo).map(inv => ({
    invoiceNo: inv.invoiceNo,
    hsLines: inv.hsCodes.map((hs, i) => ({
      id: hs.id, lineItemNo: hs.lineItemNo, hsCode: hs.hsCode, description: hs.description,
      statQty: String(hs.statQty), suppQty: String(hs.suppQty), weight: String(hs.weight), unit: hs.unit,
      outbound: outbounds?.[obKey(declNo, hs.id)] ?? [],
      ...(partial ? partialPricing(hs.allocationMethod, hs.unitPrice, hs.currency, hs.statQty, i) : {}),
    })),
  }));
}

/* Partial Export carries the unit price the quantity was claimed at — one price for the
   line ("Single"), or a split across several ("Multiple"), exactly as the flow captures it.
   The line's own values are used where it has them, and demo values stand in where it does not. */
function partialPricing(allocation: string, unitPrice: string, currency: string, statQty: number, index: number) {
  const method = allocation === 'multiple' || (!allocation && index === 0) ? 'Multiple' : 'Single';
  const ccy = currency || 'AED';
  if (method === 'Single') {
    return { allocationMethod: method, unitPrice: unitPrice && unitPrice !== '0' ? unitPrice : '120.00', currency: ccy };
  }
  /* Split the line's quantity in two, so the parts add back up to what was exported. */
  const first = Math.max(1, Math.floor(statQty / 2));
  return {
    allocationMethod: method, currency: ccy,
    unitPrices: [
      { id: `up-${index}-1`, statQty: String(first), unitPrice: '120.00' },
      { id: `up-${index}-2`, statQty: String(Math.max(0, statQty - first)), unitPrice: '95.50' },
    ].filter(r => Number(r.statQty) > 0),
  };
}

/* Real flow path — one row per declaration the user actually selected, with the refund type,
   claim amount, deposit method and (for CDM Deposit) reference fields exactly as entered on
   the Refund Details step. */
function buildDeclLinesFromCharges(chargeDetails: ChargeDetail[], rows: Row[] | undefined, outbounds: OutboundState | undefined): DeclLine[] {
  return chargeDetails.map(d => {
    const row = rows?.find(r => r.declarationNo === d.declarationNo);
    const isCdm = d.chargeType === 'CDM Deposit';
    return {
      declarationNo: d.declarationNo,
      actualDepartureDate: outbounds?.[d.declarationNo]?.[0]?.actualDepartureDate ?? '15/01/2025',
      declarationType: row?.declarationCategory ?? '—',
      chargeType: d.chargeType,
      depositMethod: d.depositMethod,
      accountNumber: row?.accountNumber ?? '—',
      refundMode: REFUND_MODE, refundAccountNo: REFUND_ACCOUNT_NO, refundAccountName: REFUND_ACCOUNT_NAME,
      depositAmount: d.depositAmount === 'N/A' ? 'N/A' : d.depositAmount.replace(/^Dh\s*/, ''),
      refundType: REFUND_TYPE_LABELS[d.refundType] ?? (d.refundType || '—'),
      claimAmount: d.claimAmount || '0',
      invoices: buildInvoiceGroups(d.declarationNo, outbounds, d.refundType === 'partial'),
      ...(isCdm ? { refType: d.refType, refCode: d.refCode, refNo: d.refNo } : {}),
    };
  });
}

type IncomingDecl = { declNo: string; date: string; category: string; ownerCode: string; claimExpiry: string; exportExpiry: string };

/* Demo refund-mode values — in the real flow these come from the declaration's own
   refund details, which is why they are shown per declaration and not on the claim. */
const RD_HEADER = claimHeaderDefaultsFor('Refund of Deposits');
const REFUND_MODE = RD_HEADER.refundMode;
const REFUND_ACCOUNT_NO = RD_HEADER.refundAccountNo;
const REFUND_ACCOUNT_NAME = RD_HEADER.refundAccountName;

/* Default demo declaration — used when the page is opened without a specific claim's data
   (e.g. the "View Claim" link nested inside ClaimCancelFlow). */
const DEFAULT_DECLARATIONS: IncomingDecl[] = [
  { declNo: '105-01426431-24', date: '09/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025' },
];

/* Legacy demo outbound records — kept only so the main listing's "View Claim" (which has no
   live flow data to draw from, just a static demo declaration) still shows a populated
   Outbound Declaration Details table for its Alternative Duty Deposit example. */
const LEGACY_OUTBOUNDS: OutboundState = {
  [obKey('105-01426431-24', 'h1')]: [{ id: 'ob1', customsAuthority: 'Dubai Customs', declarationNo: 'EX-20800049-24', declarationType: 'Re-Export', exitPoint: 'Jebel Ali Port', actualDepartureDate: '15/01/2025', reExportTo: 'Saudi Arabia', statQty: '50', suppQty: '50', weight: '1250' }],
  [obKey('105-01426431-24', 'h2')]: [{ id: 'ob2', customsAuthority: 'Dubai Customs', declarationNo: 'EX-20800061-24', declarationType: 'Export',    exitPoint: 'Port Rashid',    actualDepartureDate: '22/02/2025', reExportTo: 'Oman',         statQty: '32', suppQty: '30', weight: '880'  }],
};

/* Generic/listing path — used only when no real chargeDetails are available. */
/* A declaration can be claimed against more than one deposit, so the demo claim carries
   a second and third charge type alongside the one asked for — enough to show the
   sub-claim grouping, and to cover the outbound-linked, plain and CDM variants. */
const DEMO_EXTRA_CHARGE_TYPES = ['Anti Dumping Deposit', 'Missing Document Deposit', 'CDM Deposit'];

/* Anti Dumping Deposit stands in for the partially exported claim, so the view shows what a
   Partial Export sub-claim carries: the unit prices the exported quantity was claimed at. */
const PARTIAL_EXPORT_CHARGE_TYPES = ['Anti Dumping Deposit'];
const isPartialExport = (chargeType: string) => PARTIAL_EXPORT_CHARGE_TYPES.includes(chargeType);

function buildDeclLine(d: IncomingDecl, chargeType: string): DeclLine {
  const outbound = hasOutboundLinkage(chargeType);
  const isNa = hasNaRefundType(chargeType);
  const partial = isPartialExport(chargeType);
  const isCdm = chargeType === 'CDM Deposit';
  return {
    declarationNo: d.declNo,
    actualDepartureDate: '15/01/2025',
    declarationType: d.category,
    chargeType,
    depositMethod: outbound ? 'Standing Guarantee' : 'N/A',
    accountNumber: outbound ? 'ACC-100234' : '—',
    refundMode: REFUND_MODE, refundAccountNo: REFUND_ACCOUNT_NO, refundAccountName: REFUND_ACCOUNT_NAME,
    depositAmount: '1,000.00',
    refundType: isNa ? 'NA' : partial ? 'Partial Export' : outbound ? 'Full Export' : 'Refund',
    claimAmount: '1,000.00',
    invoices: buildInvoiceGroups(d.declNo, outbound ? LEGACY_OUTBOUNDS : undefined, partial),
    ...(isCdm ? { refType: 'Exemption Type', refCode: 'EXM-001', refNo: 'REF-2025-0142' } : {}),
  };
}

function buildDeclLines(declarations: IncomingDecl[], chargeType: string): DeclLine[] {
  const types = [chargeType, ...DEMO_EXTRA_CHARGE_TYPES.filter(t => t !== chargeType)];
  return declarations.flatMap(d => types.map(t => buildDeclLine(d, t)));
}

function buildDefaultDocs(declNo: string, outbound: boolean): ViewDoc[] {
  return outbound
    ? [
        { id: 'vd-1', declNo, docType: 'Standing Guarantee Letter', fileName: `Guarantee-${declNo}.pdf`, uploadedOn: '15/07/2025', remarks: '' },
        { id: 'vd-2', declNo, docType: 'Outbound Declaration Copy', fileName: 'Outbound-EX20800049.pdf', uploadedOn: '15/07/2025', remarks: '' },
      ]
    : [
        { id: 'vd-1', declNo, docType: 'Supporting Document', fileName: `Support-${declNo}.pdf`, uploadedOn: '15/07/2025', remarks: '' },
      ];
}

const versionRows = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', submittedBy: 'crnuser01', status: 'Completed', isCurrentlyViewing: true },
];

/* ─── Outbound Declaration — read-only view popup ─── */
const OB_FIELDS: { label: string; get: (ob: OutboundDetail) => string; total?: boolean }[] = [
  { label: 'Customs Authority',     get: ob => ob.customsAuthority },
  { label: 'Outbound Declaration No.', get: ob => ob.declarationNo },
  { label: 'Declaration Type',      get: ob => ob.declarationType },
  { label: 'Exit Point',            get: ob => ob.exitPoint },
  { label: 'Actual Departure Date', get: ob => ob.actualDepartureDate },
  { label: 'Re-Export To',          get: ob => ob.reExportTo },
  { label: 'Statistical Qty',       get: ob => ob.statQty, total: true },
  { label: 'Supplementary Qty',     get: ob => ob.suppQty, total: true },
  { label: 'Weight (kg)',           get: ob => ob.weight,  total: true },
];

/** Adds up a column, keeping whole numbers whole. */
function sumColumn(values: (string | undefined)[]): string {
  const total = values.reduce<number>((sum, v) => sum + (parseFloat(v ?? '') || 0), 0);
  return Number.isInteger(total) ? String(total) : total.toFixed(2);
}
function OutboundViewPopup({ obs, onClose }: { obs: OutboundDetail[]; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: '100%', maxWidth: 1100, maxHeight: 'calc(100vh - 48px)', display: 'flex', flexDirection: 'column', boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[24px] py-[18px]" style={{ flexShrink: 0 }}>
          <div className="flex items-center gap-[12px] flex-wrap">
            <h2 className="text-[18px] text-[#f8fafd]" style={{ fontWeight: 500, margin: 0, fontFamily: font }}>Outbound Declaration Details</h2>
            <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: 'rgba(255,255,255,0.14)', color: '#f8fafd', fontWeight: 500, fontFamily: font }}>
              {obs.length} declaration{obs.length !== 1 ? 's' : ''}
            </span>
          </div>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M9 9l6 6M15 9l-6 6" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1000, fontFamily: font }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  <th className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, width: 44 }}>#</th>
                  {OB_FIELDS.map(c => (
                    <th key={c.label} className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {obs.map((ob, i) => (
                  <tr key={ob.id} style={{ borderTop: '1px solid #eef1f6' }}>
                    <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                    {OB_FIELDS.map(c => (
                      <td key={c.label} className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{c.get(ob) || '—'}</td>
                    ))}
                  </tr>
                ))}
                {/* What the outbound declarations add up to */}
                <tr style={{ borderTop: '1px solid #eef1f6', background: '#dce8f7' }}>
                  <td style={{ padding: '12px' }} />
                  {OB_FIELDS.map((c, i) => (
                    <td key={c.label} className="text-[16px]" style={{ padding: '12px', whiteSpace: 'nowrap', color: '#051937', fontWeight: 700 }}>
                      {c.total ? sumColumn(obs.map(c.get)) : i === OB_FIELDS.findIndex(f => f.total) - 1 ? 'Total' : ''}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div style={{ flexShrink: 0, padding: '12px 24px 20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #eef1f6' }}>
          <button onClick={onClose}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', border: 'none', fontFamily: font, fontWeight: 500, cursor: 'pointer', boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
/* ─── A declaration's charge-type claims, grouped under the declaration itself. One
       declaration can be claimed against several deposits (Alternative Duty, Duty,
       Missing Document …), and each of those is its own sub-claim. ─── */
type DeclarationGroup = {
  declarationNo: string;
  actualDepartureDate: string;
  declarationType: string;
  depositMethod: string;
  accountNumber: string;
  refundMode: string;
  refundAccountNo: string;
  refundAccountName: string;
  subClaims: DeclLine[];
};

function groupByDeclaration(lines: DeclLine[]): DeclarationGroup[] {
  const order: string[] = [];
  const byDecl = new Map<string, DeclLine[]>();
  lines.forEach(l => {
    if (!byDecl.has(l.declarationNo)) { order.push(l.declarationNo); byDecl.set(l.declarationNo, []); }
    byDecl.get(l.declarationNo)!.push(l);
  });
  return order.map(declarationNo => {
    const subClaims = byDecl.get(declarationNo)!;
    const first = subClaims[0];
    return {
      declarationNo,
      actualDepartureDate: first.actualDepartureDate,
      declarationType: first.declarationType,
      /* The deposit sits against the declaration, so the first sub-claim speaks for all. */
      depositMethod: first.depositMethod,
      accountNumber: first.accountNumber,
      refundMode: first.refundMode,
      refundAccountNo: first.refundAccountNo,
      refundAccountName: first.refundAccountName,
      subClaims,
    };
  });
}

/** The Invoice / HS Code table a sub-claim with outbound linkage expands to. */
function OutboundHsTable({ d, onViewOb }: { d: DeclLine; onViewOb: (obs: OutboundDetail[]) => void }) {
  const allHs = d.invoices.flatMap(inv => inv.hsLines.map(hs => ({ inv, hs })));
  /* Partial Export claims only part of the line, so it also carries the unit price the
     claimed quantity was valued at — one price, or a split across several. */
  const partial = d.refundType === 'Partial Export';
  const [priceCtx, setPriceCtx] = useState<HsLine | null>(null);
  /* Partial Export rows carry two views, so the eye gives way to the usual row menu. */
  const [rowMenu, setRowMenu] = useState<{ hs: HsLine; at: FlyoutAnchor; items: FlyoutItem[] } | null>(null);
  const openRowMenu = (hs: HsLine) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const items: FlyoutItem[] = [];
    if (hs.outbound.length > 0) items.push({ label: 'View Declaration', icon: lineMenuIcons.declaration });
    if ((hs.unitPrices ?? []).length > 0) items.push({ label: 'View Unit Price Details', icon: lineMenuIcons.unitPrice });
    if (items.length === 0) return;
    setRowMenu({ hs, at: anchorFrom(e, items.length, LINE_MENU_WIDTH), items });
  };
  const columns = [
    'Invoice Number', 'Invoice Line Item No.', 'HS Code', 'Goods Description', 'Outbound Declaration No.',
    'Statistical Qty', 'Supplementary Qty', 'Weight',
    ...(partial ? ['Allocation Method', 'Unit Price', 'Currency'] : []),
  ];
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: partial ? 1380 : 1080 }}>
        <thead>
          <tr>
            {columns.map(h => (
              <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
              </th>
            ))}
            <th style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'center', borderBottom: '1px solid #e8edf5', position: 'sticky', right: 0, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
              <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>Action</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {allHs.map(({ inv, hs }) => {
            const splits = hs.unitPrices ?? [];
            const isMultiple = partial && hs.allocationMethod === 'Multiple';
            return (
            <tr key={hs.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
              <td style={{ padding: '10px 14px' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#455174', fontFamily: font }}>{inv.invoiceNo}</span></td>
              <td style={{ padding: '10px 14px', textAlign: 'center' }}><span className="text-[16px]" style={{ color: '#455174', fontFamily: font }}>{hs.lineItemNo}</span></td>
              <td style={{ padding: '10px 14px' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{hs.hsCode}</span></td>
              <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.description}</span></td>
              <td style={{ padding: '10px 14px' }}>
                {hs.outbound.length > 0 ? (
                  hs.outbound.length === 1 ? (
                    <button type="button" onClick={() => onViewOb(hs.outbound)}
                      className="text-[16px] hover:underline text-left"
                      style={{ color: '#1360d2', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: font, padding: 0, whiteSpace: 'nowrap' }}>
                      {hs.outbound[0].declarationNo}
                    </button>
                  ) : (
                    <button type="button" title={`${hs.outbound.length} outbound declarations`} onClick={() => onViewOb(hs.outbound)}
                      className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline', border: 'none', cursor: 'pointer', fontFamily: font }}>
                      {hs.outbound.length}
                    </button>
                  )
                ) : (
                  <span className="text-[16px]" style={{ color: '#c0c8d8' }}>—</span>
                )}
              </td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.statQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></span></td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.suppQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></span></td>
              <td style={{ padding: '10px 14px', textAlign: 'right' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.weight} <span className="text-[14px] text-[#697498]">kg</span></span></td>
              {partial && (
                <>
                  <td style={{ padding: '10px 14px' }}>
                    <span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.allocationMethod ?? '—'}</span>
                  </td>
                  <td style={{ padding: '10px 14px', whiteSpace: 'nowrap' }}>
                    {isMultiple ? (
                      /* Same control the flow uses for a split line — it opens the breakdown */
                      <button type="button" onClick={() => setPriceCtx(hs)}
                        className="inline-flex items-center gap-[6px] h-[36px] px-[14px] rounded-[4px] text-[14px] transition-colors hover:bg-[#e8f0ff]"
                        style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff' }}>
                        <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M3 8l3 3 7-7" /></svg>
                        {splits.length} entr{splits.length !== 1 ? 'ies' : 'y'}
                      </button>
                    ) : hs.unitPrice ? (
                      <span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#0e1b3d', fontFamily: font }}><Dh style={{ fontSize: 15 }} />{hs.unitPrice}</span>
                    ) : (
                      <span className="text-[16px]" style={{ color: '#c0c8d8' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '10px 14px' }}><span className="text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d', fontFamily: font }}>{hs.currency ?? '—'}</span></td>
                </>
              )}
              <td style={{ padding: '10px 14px', textAlign: 'center', position: 'sticky', right: 0, background: '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                {partial ? (
                  <button type="button" aria-label={`Line item ${hs.lineItemNo} actions`}
                    onClick={openRowMenu(hs)}
                    disabled={hs.outbound.length === 0 && splits.length === 0}
                    className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                    style={{ cursor: hs.outbound.length === 0 && splits.length === 0 ? 'not-allowed' : 'pointer' }}>
                    <MoreIcon color={hs.outbound.length === 0 && splits.length === 0 ? '#c0c8d8' : '#0e1b3d'} />
                  </button>
                ) : (
                  <button type="button" title="View outbound declaration details" aria-label="View outbound declaration details"
                    onClick={() => onViewOb(hs.outbound)} disabled={hs.outbound.length === 0}
                    className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                    style={{ border: '1px solid #d5ddfb', color: hs.outbound.length === 0 ? '#c0c8d8' : '#1360d2', cursor: hs.outbound.length === 0 ? 'not-allowed' : 'pointer' }}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          );
          })}
          {/* The exported quantities this sub-claim adds up to */}
          <tr style={{ background: '#dce8f7' }}>
            <td style={{ padding: '10px 14px' }} />
            <td style={{ padding: '10px 14px' }} />
            <td style={{ padding: '10px 14px' }} />
            <td style={{ padding: '10px 14px' }} />
            <td style={{ padding: '10px 14px', textAlign: 'right' }}>
              <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Total</span>
            </td>
            {([
              sumColumn(allHs.map(({ hs }) => hs.statQty)),
              sumColumn(allHs.map(({ hs }) => hs.suppQty)),
              sumColumn(allHs.map(({ hs }) => hs.weight)),
            ]).map((total, i) => (
              <td key={i} style={{ padding: '10px 14px', textAlign: 'right' }}>
                <span className="text-[16px] whitespace-nowrap" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>
                  {total}{i === 2 && <span className="text-[14px] text-[#697498]"> kg</span>}
                </span>
              </td>
            ))}
            {partial && <><td style={{ padding: '10px 14px' }} /><td style={{ padding: '10px 14px' }} /><td style={{ padding: '10px 14px' }} /></>}
            <td style={{ padding: '10px 14px', position: 'sticky', right: 0, background: '#dce8f7', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }} />
          </tr>
        </tbody>
      </table>
      {rowMenu && (
        <RowFlyout items={rowMenu.items} at={rowMenu.at} width={LINE_MENU_WIDTH}
          onPick={(label) => {
            if (label === 'View Declaration') onViewOb(rowMenu.hs.outbound);
            else setPriceCtx(rowMenu.hs);
          }}
          onClose={() => setRowMenu(null)} />
      )}
      <UnitPriceDetailsModal hs={priceCtx} onClose={() => setPriceCtx(null)} />
    </div>
  );
}

/** Unit Price Details — the split a "Multiple" allocation was claimed under, as the
    create flow's Add Unit Price Details popup records it. */
function UnitPriceDetailsModal({ hs, onClose }: { hs: HsLine | null; onClose: () => void }) {
  const lines = hs?.unitPrices ?? [];
  const totalQty = lines.reduce((sum, l) => sum + (parseFloat(l.statQty) || 0), 0);
  const currency = hs?.currency ?? 'AED';
  return (
    <ModalShell open={!!hs} onClose={onClose} title="Unit Price Details" maxWidth={720}>
      {hs && (
        <>
          <div className="flex flex-wrap gap-y-[12px]">
            {([
              ['HS Code', hs.hsCode],
              ['Line Item', String(hs.lineItemNo)],
              ['Total Exported Statistical Quantity', `${hs.statQty} ${hs.unit}`],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex flex-col gap-[4px]" style={{ flex: '1 0 200px', minWidth: 180 }}>
                <span className="text-[15px]" style={{ color: '#697498', fontFamily: font }}>{label}</span>
                <span className="text-[16px]" style={{ color: '#0e1b3d', fontFamily: font, fontWeight: 500 }}>{value}</span>
              </div>
            ))}
          </div>

          <ModalTable>
            <thead>
              <tr>
                {['Statistical Quantity', 'Unit Price (As per the Import)', 'Currency'].map(h => <ModalTh key={h} label={h} />)}
              </tr>
            </thead>
            <tbody>
              {lines.map(l => (
                <tr key={l.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                  <td style={modalTd}><span className="text-[16px]" style={{ color: '#0e1b3d' }}>{l.statQty} <span className="text-[14px] text-[#697498]">{hs.unit}</span></span></td>
                  <td style={modalTd}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#0e1b3d' }}><Dh style={{ fontSize: 15 }} />{l.unitPrice}</span></td>
                  <td style={modalTd}><span className="text-[16px]" style={{ color: '#0e1b3d' }}>{currency}</span></td>
                </tr>
              ))}
            </tbody>
          </ModalTable>

          <p className="text-[15px]" style={{ color: '#697498', fontFamily: font }}>
            Total Entered Statistical Quantity: <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{totalQty} {hs.unit}</span>
          </p>
        </>
      )}
    </ModalShell>
  );
}

/** One sub-claim — a charge type claimed against the declaration, with whatever detail
    that charge type carries nested inside its own card so the nesting is unmistakable. */
function SubClaimBlock({ d, n, open, onToggle, onViewOb, onAction }: {
  d: DeclLine; n: number; open: boolean; onToggle: () => void; onViewOb: (obs: OutboundDetail[]) => void;
  onAction: (label: SubClaimMenuLabel, d: DeclLine) => void;
}) {
  const [menuAt, setMenuAt] = useState<FlyoutAnchor | null>(null);
  const allHs = d.invoices.flatMap(inv => inv.hsLines.map(hs => ({ inv, hs })));
  const outbound = hasOutboundLinkage(d.chargeType);
  const isCdm = d.chargeType === 'CDM Deposit';
  const expandable = outbound || isCdm;

  return (
    <div className="bg-white rounded-[8px] overflow-hidden"
      style={{ border: `1px solid ${open ? '#1360d2' : '#e3e9f3'}`, boxShadow: '0px 1px 3px rgba(143,155,186,0.10)' }}>

      {/* Sub-claim summary */}
      <div className="flex items-start gap-[10px] px-[14px] py-[10px]">
        <FieldMarker>
          <span className="inline-flex items-center justify-center size-[26px] rounded-full text-[14px]"
            style={{ background: '#1360d2', color: '#fff', fontWeight: 600, fontFamily: font }}>{n}</span>
        </FieldMarker>
        {/* The fields keep a column of their own, so a wrapped row lines up with the first */}
        <div className="flex flex-wrap items-center flex-1 min-w-0">
        <FieldItem label="Charge Type" value={d.chargeType} />
        <FieldItem label="Refund Type" value={d.refundType} />
        {([
          ['Amount (AED)', d.claimAmount],
          ['Claim Amount (AED)', d.claimAmount],
          ['Net Amount (AED)', d.claimAmount, 'Payable/Receivable'],
        ] as [string, string, string?][]).map(([label, amount, tag]) => (
          <FieldCell key={label} label={label} tag={tag}>
            <span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}><Dh style={{ fontSize: 15 }} />{amount}</span>
          </FieldCell>
        ))}
        {/* Status reads last, as the chip it is everywhere else */}
        <FieldCell label="Status">
          <span><StatusChip status="Registered" /></span>
        </FieldCell>
        </div>
        {/* What was approved, and any waiver — both decided on this charge type */}
        <button type="button" aria-label={`${d.chargeType} actions`}
          onClick={(e) => { e.stopPropagation(); setMenuAt(anchorFrom(e, SUB_CLAIM_MENU.length, MENU_WIDTH)); }}
          className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
          style={{ marginTop: 12 + (52 - 32) / 2, flexShrink: 0 }}>
          <MoreIcon />
        </button>
      </div>
      {menuAt && (
        <RowFlyout items={SUB_CLAIM_MENU} at={menuAt} width={MENU_WIDTH}
          onPick={(label) => onAction(label as SubClaimMenuLabel, d)} onClose={() => setMenuAt(null)} />
      )}

      {/* What this charge type carries. Export-linked types (Alternative Duty Deposit, Duty)
          get the Invoice/HS Code table; CDM Deposit a reference summary; the rest nothing. */}
      {expandable && (
        <div style={{ borderTop: '1px solid #eef1f6' }}>
          <button type="button" onClick={onToggle} aria-expanded={open}
            className="w-full flex items-center gap-[10px] pl-[52px] pr-[16px] py-[10px] text-left transition-colors"
            style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font }}>
            {/* The rail ties this strip back to the sub-claim above it */}
            <span aria-hidden className="flex-shrink-0" style={{ position: 'absolute', marginLeft: -26, width: 14, height: 1, background: '#c8d6ea' }} />
            <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round"
              style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
              <path d="M5 3l4 4-4 4" />
            </svg>
            <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
              {isCdm ? 'Additional Reference Details' : 'Outbound Declaration Details'}
            </span>
            {!isCdm && (
              <span className="text-[13px] px-[9px] py-[2px] rounded-[12px]"
                style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
                {allHs.length} HS Code{allHs.length !== 1 ? 's' : ''}
              </span>
            )}
            <span className="text-[13px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>{open ? 'Collapse' : 'Expand'}</span>
          </button>

          {open && (
            <div className="pl-[52px] pr-[16px] pb-[16px] pt-[14px]" style={{ borderTop: '1px solid #eef1f6', background: '#fff' }}>
              {isCdm ? (
                <div className="flex flex-wrap" style={{ margin: '0 -16px' }}>
                  <FieldItem label="Reference Type" value={d.refType ?? ''} />
                  <FieldItem label="Reference Code" value={d.refCode ?? ''} />
                  <FieldItem label="Reference No." value={d.refNo ?? ''} />
                </div>
              ) : (
                <OutboundHsTable d={d} onViewOb={onViewOb} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── The declaration card's row menu — everything the declaration can be viewed
       through, each opening its own popup (bar the declaration itself). ─── */
const MENU_WIDTH = 290;

const menuIcons = {
  declaration: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M7.5 10h5M7.5 13h3.5" /></svg>,
  privileges:  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="7.5" r="4.5" /><path d="M7 11.5L6 18l4-2 4 2-1-6.5" /></svg>,
  approval:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 10.2l2.4 2.4 4.6-4.9" /></svg>,
  waiver:      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3.5h8.5L16 7v9.5H4z" /><path d="M12.5 3.5V7H16" /><path d="M6.8 12.2l1.9 1.9 4-4.3" /></svg>,
};

/* ─── A Partial Export line item's row menu ─── */
const LINE_MENU_WIDTH = 240;
const lineMenuIcons = {
  declaration: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2.5h7l3.5 3.5v11.5H5z" /><path d="M12 2.5V6h3.5M7.5 10h5M7.5 13h3.5" /></svg>,
  unitPrice:   <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 4.5h13v11h-13z" /><path d="M3.5 8.5h13M8 8.5v7" /></svg>,
};

const DECLARATION_MENU: FlyoutItem[] = [
  { label: 'View Declaration',           icon: menuIcons.declaration },
  { label: 'View Privileges & Benefits', icon: menuIcons.privileges },
];

/* Approvals and waivers are decided per charge type, so they hang off the sub-claim. */
const SUB_CLAIM_MENU: FlyoutItem[] = [
  { label: 'View Claim Approval Details', icon: menuIcons.approval },
  { label: 'View Waiver Details',         icon: menuIcons.waiver },
];

type DeclarationMenuLabel = (typeof DECLARATION_MENU)[number]['label'];
type SubClaimMenuLabel = (typeof SUB_CLAIM_MENU)[number]['label'];

/* ─── Declaration Details — one card per declaration. The declaration's own particulars
       sit in the header; the charge types claimed against it are nested inside, each in
       its own card on a tinted tray so a sub-claim's detail cannot be mistaken for a
       sibling of the declaration. ─── */
function DeclarationCard({ g, idx, isOpen, onToggle, onViewOb, onAction, onSubClaimAction }: {
  g: DeclarationGroup; idx: number;
  isOpen: (key: string) => boolean; onToggle: (key: string) => void;
  onViewOb: (obs: OutboundDetail[]) => void;
  onAction: (label: DeclarationMenuLabel) => void;
  onSubClaimAction: (label: SubClaimMenuLabel, d: DeclLine) => void;
}) {
  const [menuAt, setMenuAt] = useState<FlyoutAnchor | null>(null);
  return (
    <div className="bg-white rounded-[8px] overflow-hidden" style={{ border: '1.5px solid #d9e3f2', boxShadow: '0px 2px 8px rgba(143,155,186,0.12)' }}>
      {/* The declaration itself — everything the sub-claims below share */}
      <div className="flex items-start gap-[10px] px-[16px] py-[14px]">
        <FieldMarker>
          <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{idx + 1}</span>
        </FieldMarker>
        <div className="flex flex-wrap items-center flex-1 min-w-0">
        {/* The declaration number carries the owner's privilege marks */}
        <FieldCell label="Declaration No.">
          <span className="flex items-center gap-[10px] flex-wrap">
            <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 500 }}>{g.declarationNo}</span>
            <AeoLogo />
            <WlpLogo />
          </span>
        </FieldCell>
        <FieldItem label="Actual Departure Date" value={g.actualDepartureDate} />
        <FieldItem label="Declaration Type" value={g.declarationType} />
        </div>
        {/* Everything this declaration can be looked at through, in one menu */}
        <button type="button" aria-label={`Declaration ${g.declarationNo} actions`}
          onClick={(e) => { e.stopPropagation(); setMenuAt(anchorFrom(e, DECLARATION_MENU.length, MENU_WIDTH)); }}
          className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
          style={{ marginTop: 12 + (52 - 32) / 2, flexShrink: 0 }}>
          <MoreIcon />
        </button>
      </div>
      {menuAt && (
        <RowFlyout items={DECLARATION_MENU} at={menuAt} width={MENU_WIDTH}
          onPick={(label) => onAction(label as DeclarationMenuLabel)} onClose={() => setMenuAt(null)} />
      )}

      {/* Sub-claims tray — indented and tinted, so the cards inside read as children */}
      <div className="px-[16px] py-[14px] flex flex-col gap-[12px]"
        style={{ background: '#f1f5fc', borderTop: '1px solid #e3e9f3' }}>
        <p className="text-[14px]" style={{ color: '#5a6b8c', fontFamily: font }}>
          <span style={{ fontWeight: 600 }}>{g.subClaims.length} sub-claim{g.subClaims.length !== 1 ? 's' : ''}</span>
          {' '}— one per charge type claimed against this declaration
        </p>
        {g.subClaims.map((d, i) => {
          const key = `${g.declarationNo}::${d.chargeType}`;
          return (
            <SubClaimBlock key={key} d={d} n={i + 1}
              open={isOpen(key)} onToggle={() => onToggle(key)} onViewOb={onViewOb}
              onAction={onSubClaimAction} />
          );
        })}
      </div>
    </div>
  );
}

/** The declaration itself, opened over the claim from a declaration card's "View Declaration". */
function DeclarationViewOverlay({ declNo, onClose }: { declNo: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[1000] overflow-y-auto" style={{ background: '#f4f7fc', fontFamily: font }}>
      <div className="sticky top-0 z-[2] bg-white flex items-center justify-between gap-[16px] px-[24px] py-[14px]"
        style={{ borderBottom: '1px solid #e3e9f3' }}>
        <p className="text-[16px]" style={{ color: '#455174' }}>
          Declaration <span style={{ color: '#051937', fontWeight: 600 }}>{declNo}</span>
        </p>
        <button type="button" onClick={onClose} data-secondary-btn
          className="h-[40px] px-[20px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[8px]"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4l-6 6 6 6" />
          </svg>
          Back to Claim
        </button>
      </div>
      <div className="px-[24px] py-[24px]">
        <ViewDeclarationPage />
      </div>
    </div>,
    document.body,
  );
}

/* ─── Declaration Details section — reusable as-is anywhere a claim's real (or generic demo)
       declaration data needs the same read-only card design: the View Claim page below, and
       the Review & Submit step (NonRemittanceReviewPage), so both show identical UI. ─── */
export function DeclarationDetailsSection({ chargeDetails, rows, outbounds, declarations, chargeType }: {
  chargeDetails?: ChargeDetail[]; rows?: Row[]; outbounds?: OutboundState;
  declarations?: IncomingDecl[]; chargeType?: string;
}) {
  const hasRealData = !!chargeDetails && chargeDetails.length > 0;
  const declLines = useMemo(
    () => hasRealData
      ? buildDeclLinesFromCharges(chargeDetails!, rows, outbounds)
      : buildDeclLines(declarations ?? DEFAULT_DECLARATIONS, chargeType ?? 'Alternative Duty Deposit'),
    [hasRealData, chargeDetails, rows, outbounds, declarations, chargeType]
  );
  const groups = useMemo(() => groupByDeclaration(declLines), [declLines]);
  /* Expansion is per sub-claim now, so the key carries the charge type too. */
  const [openSubClaims, setOpenSubClaims] = useState<Set<string>>(() => {
    const first = declLines[0];
    return new Set(first ? [`${first.declarationNo}::${first.chargeType}`] : []);
  });
  const toggleSubClaim = (key: string) => setOpenSubClaims(prev => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });
  const [viewOb, setViewOb] = useState<OutboundDetail[] | null>(null);
  /* Each menu item opens over the claim, so the claim is still there when it closes. */
  const [viewDecl, setViewDecl] = useState<string | null>(null);
  const [viewPrivileges, setViewPrivileges] = useState<string | null>(null);
  const [viewApproval, setViewApproval] = useState<string | null>(null);
  const [viewWaiver, setViewWaiver] = useState<string | null>(null);

  return (
    <>
      <Section title="Declaration Details" badge={`${groups.length} declaration${groups.length !== 1 ? 's' : ''}`}>
        <div className="flex flex-col gap-[16px]">
          {groups.map((g, i) => (
            <DeclarationCard key={g.declarationNo} g={g} idx={i}
              isOpen={(key) => openSubClaims.has(key)} onToggle={toggleSubClaim} onViewOb={setViewOb}
              onAction={(label) => {
                if (label === 'View Declaration') setViewDecl(g.declarationNo);
                else setViewPrivileges(g.declarationNo);
              }}
              onSubClaimAction={(label, d) => {
                const subject = `${g.declarationNo} — ${d.chargeType}`;
                if (label === 'View Claim Approval Details') setViewApproval(subject);
                else setViewWaiver(subject);
              }} />
          ))}
        </div>
      </Section>
      {viewOb && <OutboundViewPopup obs={viewOb} onClose={() => setViewOb(null)} />}
      {viewDecl && <DeclarationViewOverlay declNo={viewDecl} onClose={() => setViewDecl(null)} />}
      <PrivilegesBenefitsModal open={!!viewPrivileges} declarationNo={viewPrivileges ?? undefined}
        onClose={() => setViewPrivileges(null)} />
      <ClaimApprovalDetailsModal open={!!viewApproval} subject={viewApproval ?? undefined}
        onClose={() => setViewApproval(null)} />
      <WaiverDetailsModal open={!!viewWaiver} subject={viewWaiver ?? undefined}
        onClose={() => setViewWaiver(null)} />
    </>
  );
}

/* ─── Uploaded Documents — one accordion card per declaration, each holding a
       simple File Name / Download table (mirrors the Declaration Details accordion above). ─── */
function DocDeclarationCard({ declNo, docs, open, onToggle }: {
  declNo: string; docs: ViewDoc[]; open: boolean; onToggle: () => void;
}) {
  return (
    <div style={{ borderTop: '1px solid #eef1f6' }}>
      <button type="button" onClick={onToggle}
        className="w-full flex items-center gap-[10px] px-[20px] py-[14px] text-left transition-colors hover:bg-[#f8fafd]"
        style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font }}>
        <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
          style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M5 3l4 4-4 4" />
        </svg>
        <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, fontFamily: font }}>Declaration No. {declNo}</span>
        <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''}
        </span>
        <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>{open ? 'Collapse' : 'Expand'}</span>
      </button>
      {open && (
        <div className="px-[20px] pb-[16px] pt-[4px]" style={{ borderTop: '1px solid #f5f7fc' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
              <thead>
                <tr>
                  {['Document Type', 'File Name', 'Uploaded On', 'Remarks', 'Action'].map(h => (
                    <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap' }}>
                      <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docs.map(doc => (
                  <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.docType}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.fileName}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{doc.uploadedOn}</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#697498', fontFamily: font }}>{doc.remarks || '—'}</span></td>
                    <td style={{ padding: '10px 14px' }}>
                      <button
                        title="Download"
                        onClick={() => { const a = document.createElement('a'); a.href = '#'; a.download = doc.fileName; a.click(); }}
                        className="inline-flex items-center justify-center w-[34px] h-[34px] rounded-[4px] hover:bg-[#e8f0ff] transition-colors"
                        style={{ border: '1px solid #d5ddfb', color: '#1360d2' }}
                      >
                        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

type Props = {
  onBack: () => void;
  claimType?: string;
  /** Charge type of the claim being viewed (e.g. "Alternative Duty Deposit", "Missing Document
      Deposit") — determines whether the Invoice & HS Code / Outbound Declaration Details
      accordion is shown at all. Only used as a fallback when chargeDetails isn't provided. */
  chargeType?: string;
  declarations?: IncomingDecl[];
  claimNo?: string;
  claimStatus?: string;
  submissionDate?: string;
  /** Real data captured on the Refund Details / Upload Documents steps (Raise New Claim or
      Amend) — when chargeDetails is provided, it takes precedence over the generic
      declarations+chargeType path, so this page reflects exactly what the user selected and
      entered, per declaration, instead of demo/mock content. */
  rows?: Row[];
  chargeDetails?: ChargeDetail[];
  outbounds?: OutboundState;
  uploadedDocs?: UploadedDoc[];
};

export default function RefundDepositsClaimViewPage({
  onBack, claimType = 'Refund of Deposits', chargeType = 'Alternative Duty Deposit',
  declarations = DEFAULT_DECLARATIONS, claimNo = '3842063', claimStatus = 'Completed', submissionDate = '29/06/2026',
  rows, chargeDetails, outbounds, uploadedDocs,
}: Props) {
  const hasRealData = !!chargeDetails && chargeDetails.length > 0;
  const [breakupOpen, setBreakupOpen] = useState(false);
  const declLines = useMemo(
    () => hasRealData ? buildDeclLinesFromCharges(chargeDetails!, rows, outbounds) : buildDeclLines(declarations, chargeType),
    [hasRealData, chargeDetails, rows, outbounds, declarations, chargeType]
  );
  /* The card's amounts are the per-declaration charges totalled up, so they agree
     with the sub totals and grand total in the Charges breakup popup. */
  const breakupDeclarations = declLines.map(d => d.declarationNo);
  const breakupCount = Math.max(1, breakupDeclarations.length);
  const chargeRows = [
    { type: 'Claim Registration Charge', amt: (50 * breakupCount).toFixed(2), receipt: 'A-100650705' },
    { type: 'Knowledge & Innovation Dirham', amt: (20 * breakupCount).toFixed(2), receipt: 'A-100650706' },
  ];
  const chargeTotal = (70 * breakupCount).toFixed(2);
  const outbound = hasRealData ? declLines.some(d => hasOutboundLinkage(d.chargeType)) : hasOutboundLinkage(chargeType);
  const defaultDocs = useMemo(() => buildDefaultDocs(declLines[0]?.declarationNo ?? '—', outbound), [declLines, outbound]);
  const docsSource: ViewDoc[] = (uploadedDocs && uploadedDocs.length > 0)
    ? uploadedDocs.map(d => ({ id: d.id, declNo: d.declNo, docType: d.docType, fileName: d.fileName, uploadedOn: d.uploadedOn, remarks: d.remarks, batchId: d.batchId }))
    : defaultDocs;

  // Uploaded Documents — grouped by declaration, ordered to match the declaration cards above.
  // Merged by batch so a file uploaded against several document types shows as one row with
  // a comma-separated Document Type, not one row per type.
  const docsByDecl = useMemo(() => {
    const groups = new Map<string, ViewDoc[]>();
    docsSource.forEach(doc => {
      const list = groups.get(doc.declNo) ?? [];
      list.push(doc);
      groups.set(doc.declNo, list);
    });
    groups.forEach((list, declNo) => groups.set(declNo, mergeDocsByBatch(list)));
    return groups;
  }, [docsSource]);
  const docDeclNos = [
    ...declLines.map(d => d.declarationNo).filter(dn => docsByDecl.has(dn)),
    ...Array.from(docsByDecl.keys()).filter(dn => !declLines.some(d => d.declarationNo === dn)),
  ];
  const [openDocDecl, setOpenDocDecl] = useState<Set<string>>(() => new Set(docDeclNos.slice(0, 1)));
  const toggleDocDecl = (declNo: string) => setOpenDocDecl(prev => {
    const next = new Set(prev);
    next.has(declNo) ? next.delete(declNo) : next.add(declNo);
    return next;
  });

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056-CONSOLIDATED SHIPPING SERVICES L.L.C</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[28px] text-[#111838] mb-[20px] mt-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>
          View Claim
        </h1>

        <div className="flex flex-col gap-[24px]">
          {/* Claim Header Details */}
          <Section title="Claim Header Details">
            <ClaimHeaderDetails
              claimType={claimType}
              claimNo={claimNo}
              claimStatus={claimStatus}
              requestStatus={claimStatus}
              requestDate={submissionDate}
              submissionDate={submissionDate}
              registrationDate={submissionDate}
              claimant="CONSOLIDATED SHIPPING SERVICES L.L.C (Business - AE-1019056)"
              beneficiary="CONSOLIDATED SHIPPING SERVICES L.L.C (Business - AE-1019056)"
              {...claimHeaderDefaultsFor(claimType)}
              /* The refund mode is set per declaration, so it is shown on each
                 declaration card rather than once for the whole claim. */
              showRefundMode={false}
            />
          </Section>

          {/* Charges And Payment Details */}
          <Section title="Charges And Payment Details">
            <div className="px-[16px] py-[12px] overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 700 }}>
                <thead>
                  <tr>
                    {['Charge Type', 'Amount (AED)', 'Payment Mode', 'Receipt No.', 'Payment Reference Details'].map((h) => (
                      <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                        <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chargeRows.map((row) => (
                    <tr key={row.type} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.type}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font }}><Dh style={{ fontSize: 15 }} />{row.amt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>Credit/Debit Account</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.receipt}</span></td>
                      <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>1223193 CONSOLIDATED SHIPPING SERVICES L.L.C</span></td>
                    </tr>
                  ))}
                  <tr style={{ background: '#dce8f7' }}>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}>Total</span></td>
                    <td style={{ padding: '10px 14px' }}><span className="text-[16px] inline-flex items-baseline gap-[3px]" style={{ color: '#051937', fontFamily: font, fontWeight: 700 }}><Dh style={{ fontSize: 15 }} />{chargeTotal}</span></td>
                    <td colSpan={3} style={{ padding: '10px 14px' }}>
                      <button type="button" onClick={() => setBreakupOpen(true)}
                        className="text-[16px] underline hover:opacity-80 transition-opacity"
                        style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                        Charges breakup
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Section>

          {/* Declaration Details — merged with Invoice/HS Code + Outbound Declaration
              Details into one read-only accordion per declaration (mirrors the
              Refund Details step of the create/amend claim flow). */}
          <DeclarationDetailsSection chargeDetails={chargeDetails} rows={rows} outbounds={outbounds} declarations={declarations} chargeType={chargeType} />

          {/* Uploaded Documents — one accordion per declaration, first one open by default */}
          <Section title="Uploaded Documents" badge={`${docDeclNos.length} declaration${docDeclNos.length !== 1 ? 's' : ''}`}>
            <div className="flex flex-col">
              {docDeclNos.map(declNo => (
                <DocDeclarationCard key={declNo} declNo={declNo} docs={docsByDecl.get(declNo) ?? []}
                  open={openDocDecl.has(declNo)} onToggle={() => toggleDocDecl(declNo)} />
              ))}
            </div>
          </Section>

          {/* Claim Request Versions */}
          <Section title="Claim Request Versions">
            <ClaimRequestVersions rows={versionRows} />
          </Section>
        </div>
      </div>

      <ChargesBreakupModal open={breakupOpen} onClose={() => setBreakupOpen(false)}

        declarations={breakupDeclarations} />


      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[20px] flex items-center gap-[12px]" style={{ boxShadow: '0px -1px 20px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[24px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Close
        </button>
      </div>
    </div>
  );
}
