import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoreIcon from './MoreIcon';
import { createPortal } from 'react-dom';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';
import { ColumnFilter } from './ColumnFilter';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

type Status = 'Under Processing' | 'Completed' | 'Suspended' | 'Draft' | 'Submitted' | 'Payment Pending' | 'Registered' | 'Rejected';
type FlyoutId = 'view' | 'amend' | 'cancel' | 'print' | 'viewDocs' | 'history' | 'uploadDoc' | 'printReceipt' | 'continue' | 'suspensionResponse' | 'viewRequest' | 'createFromRejected' | 'makePayment';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Completed':        { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Suspended':        { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'Draft':            { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Payment Pending':  { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Registered':       { bg: 'rgba(124,58,237,0.10)',  color: '#7c3aed' },
  'Rejected':         { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
};

/* The Claim Status / Request Status dropdowns are restricted to the claim lifecycle values —
   Suspended / Payment Pending / Draft remain valid row states but aren't filter options. */
export const CLAIM_STATUS_OPTIONS: Status[] = ['Submitted', 'Registered', 'Under Processing', 'Rejected', 'Completed'];

const ICONS: Record<FlyoutId, React.ReactNode> = {
  view:         <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  amend:        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" /></svg>,
  cancel:       <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" /></svg>,
  print:        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" /></svg>,
  viewDocs:     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h7l3 3v11H5z" /><path d="M12 3v3h3M7 10h6M7 13h6" /></svg>,
  history:      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M10 6v4l2.5 2" /></svg>,
  uploadDoc:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10M5 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" /></svg>,
  printReceipt: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3h12v14l-2-1-2 1-2-1-2 1-2-1-2 1V3z" /><path d="M7 7h6M7 10h6M7 13h4" /></svg>,
  continue:     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  suspensionResponse: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M8 7v6M12 7v6" /></svg>,
  viewRequest:  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  createFromRejected: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 4v12M4 10h12" strokeLinecap="round" /></svg>,
  makePayment:  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/></svg>,
};

const LABELS: Record<FlyoutId, string> = {
  view:         'View Claim',
  amend:        'Amend Claim',
  cancel:       'Cancel Claim',
  print:        'Print Acknowledgement',
  viewDocs:     'View Documents to be Submitted',
  history:      'Audit History',
  uploadDoc:    'Upload Document',
  printReceipt: 'Print Claim Acknowledgment Receipt',
  continue:     'Continue',
  suspensionResponse: 'Suspension Response',
  viewRequest:  'View Request',
  createFromRejected: 'Create New Claim Request from rejected sub claim',
  makePayment:  'Make Payment',
};

function getFlyoutItems(status: Status, isDraft: boolean, isNonRemittance = false): FlyoutId[] {
  if (isDraft) return ['continue'];
  if (status === 'Payment Pending') return ['makePayment'];
  if (status === 'Completed') return ['viewDocs', 'history'];
  if (status === 'Suspended') return ['view', 'amend', 'cancel', 'suspensionResponse', 'history'];
  if (status === 'Submitted') {
    // Non Remittance claims get the full action set from the listing.
    return isNonRemittance
      ? ['view', 'amend', 'cancel', 'viewDocs', 'suspensionResponse', 'printReceipt', 'history']
      : ['view', 'uploadDoc', 'printReceipt', 'history'];
  }
  return ['view', 'amend', 'cancel'];
}

// True for any row whose remark reports a rejected sub claim (e.g. "1 sub claim rejected",
// "2 sub claim rejected") — these rows get the "Create New Claim Request from rejected sub
// claim" flyout action regardless of whether they're a plain claim or a non-claim request.
function hasRejectedSubClaim(remark: string): boolean {
  return /sub claim.*rejected/i.test(remark);
}

export type DeclDetail = {
  declNo: string;
  date: string;
  category: string;
  ownerCode: string;
  claimExpiry: string;
  exportExpiry: string;
};

export type ClaimRow = {
  reqNo: string;
  claimNo: string;
  ver: string;
  claimType: string;
  declarations: DeclDetail[];
  depositType: string;
  claimantName: string;
  claimantCode: string;
  submissionDate: string;
  status: Status;
  /** Status of the claim *request* itself — tracked separately from the claim status and
      rendered as its own static column ahead of Claim Status. */
  requestStatus: Status;
  remark: string;
  // Generic "request" fields — only populated for non-claim requests (e.g. Claim Time Validity Extension)
  // surfaced via a Request Number search on the main listing.
  transactionType?: string;
  requestedFor?: string;
  registrationNo?: string;
  declarationOwnerName?: string;
  declarationType?: string;
  customsBroker?: string;
  extReason?: string;
  extDaysRequested?: string;
  extDaysApproved?: string;
  extChargeType?: string;
  extAmount?: string;
  attachments?: { file: string; fileType: string; size: string }[];
};

const CLAIM_ROWS: ClaimRow[] = [
  {
    reqNo: '2588017', claimNo: '2420390', ver: '1', claimType: 'Non Remittance',
    declarations: [
      { declNo: '305-08812345-24', date: '11/12/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/12/2025', exportExpiry: '06/12/2025' },
      { declNo: '305-08812346-24', date: '11/14/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/14/2025', exportExpiry: '06/14/2025' },
      { declNo: '305-08812347-24', date: '11/20/2024', category: 'Freezone Export', ownerCode: 'A180 - IMPORTER SONY GULF UAE', claimExpiry: '07/20/2025', exportExpiry: '06/20/2025' },
    ],
    depositType: 'Non Remittance Claim', claimantName: 'SW Logistics LLC', claimantCode: 'AE-9106286', submissionDate: '29/06/2026', status: 'Submitted', requestStatus: 'Submitted', remark: '—',
  },
  {
    reqNo: '4701740', claimNo: '3842063', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '105-01426431-24', date: '09/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025' },
    ],
    depositType: 'Alternative Duty Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/01/2024', status: 'Under Processing', requestStatus: 'Under Processing', remark: '1 sub claim Settled / Approved',
  },
  {
    reqNo: '4701751', claimNo: '3842003', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '101-04498436-24', date: '12/05/2024', category: 'Missing Document Deposit', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '04/03/2025', exportExpiry: 'N/A' },
    ],
    depositType: 'Missing Document Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/04/2024', status: 'Submitted', requestStatus: 'Submitted', remark: '1 sub claim Settled / Approved',
  },
  {
    reqNo: '4701762', claimNo: '3842082', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '202-08812205-24', date: '08/14/2024', category: 'CDM Deposit', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '06/15/2025', exportExpiry: 'N/A' },
    ],
    depositType: 'CDM Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/06/2024', status: 'Under Processing', requestStatus: 'Under Processing', remark: '—',
  },
  {
    reqNo: '4701770', claimNo: '3842091', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '301-08821001-24', date: '10/21/2024', category: 'Cargo Transfer from CTO to CH', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '07/12/2025', exportExpiry: 'N/A' },
      { declNo: '302-04490111-24', date: '11/02/2024', category: 'Cargo Transfer from CH to CH',  ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '06/01/2025', exportExpiry: 'N/A' },
      { declNo: '303-07731209-24', date: '09/18/2024', category: 'Bonded Movement',                ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '05/20/2025', exportExpiry: 'N/A' },
    ],
    depositType: 'Cargo Transfer Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/02/2024', status: 'Completed', requestStatus: 'Completed', remark: '1 sub claim Settled / Approved',
  },
  {
    reqNo: '4701781', claimNo: '3842105', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '410-09912044-24', date: '07/15/2024', category: 'Declaration Amendment - Deposit', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '07/01/2025', exportExpiry: 'N/A' },
    ],
    depositType: 'Declaration Amendment - Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/08/2024', status: 'Suspended', requestStatus: 'Under Processing', remark: '—',
  },
  {
    reqNo: '4701799', claimNo: '3842118', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '510-03318821-24', date: '06/22/2024', category: 'Declaration Cancellation - Deposit', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '06/30/2025', exportExpiry: 'N/A' },
    ],
    depositType: 'Declaration Cancellation - Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '12/10/2024', status: 'Payment Pending', requestStatus: 'Under Processing', remark: '—',
  },
  {
    reqNo: '231626', claimNo: '—', ver: '1', claimType: 'Claim Time Validity Extension',
    declarations: [
      { declNo: '4010001887026', date: '03/08/2026', category: 'Temporary Admission from ROW to Local', ownerCode: "AE-8122451 - M&M's special holding private company", claimExpiry: '29/04/2027', exportExpiry: '29/01/2027' },
    ],
    depositType: 'Deposit Alternative duty rate', claimantName: "M&M's special holding private company associated with 1900 Waverly Co United arab emirates L.L.C", claimantCode: 'AE-8122451', submissionDate: '03/08/2026', status: 'Under Processing', requestStatus: 'Under Processing', remark: '—',
    transactionType: 'Claim Time Validity Extension', requestedFor: 'AE-8122451',
    registrationNo: '547', declarationOwnerName: "M&M's special holding private company associated with 1900 Waverly Co United arab emirates L.L.C ( Business )", declarationType: 'Temporary Admission from ROW to Local', customsBroker: 'AE-8122451', extReason: 'extension request',
    extDaysRequested: '100', extDaysApproved: '0', extChargeType: 'Deposit Alternative duty rate', extAmount: '2,000.00',
    attachments: [{ file: '33 Invoice Line item.txt', fileType: 'text/plain', size: '4150' }],
  },
  {
    reqNo: '4701820', claimNo: '3842140', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '105-01426501-24', date: '14/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '10/03/2025', exportExpiry: '09/08/2025' },
      { declNo: '105-01426502-24', date: '16/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '12/03/2025', exportExpiry: '11/08/2025' },
      { declNo: '105-01426503-24', date: '18/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '14/03/2025', exportExpiry: '13/08/2025' },
    ],
    depositType: 'Alternative Duty Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '18/12/2024', status: 'Completed', requestStatus: 'Completed', remark: '1 sub claim rejected',
    transactionType: 'New Claim', requestedFor: 'AE-1019056',
  },
  {
    reqNo: '4701835', claimNo: '3842160', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '105-01426601-24', date: '20/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '16/03/2025', exportExpiry: '15/08/2025' },
      { declNo: '105-01426602-24', date: '22/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '18/03/2025', exportExpiry: '17/08/2025' },
      { declNo: '105-01426603-24', date: '24/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '20/03/2025', exportExpiry: '19/08/2025' },
    ],
    depositType: 'Alternative Duty Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '24/12/2024', status: 'Completed', requestStatus: 'Rejected', remark: '2 sub claim rejected',
  },
  {
    reqNo: '4701850', claimNo: '3842200', ver: '1', claimType: 'Refund on Auction Proceed',
    declarations: [
      { declNo: 'LOT-000112', date: '14/03/2025', category: 'AUC-2025-0041', ownerCode: 'AE-9106286 - SW LOGISTICS LLC', claimExpiry: 'N/A', exportExpiry: 'N/A' },
      { declNo: 'LOT-000113', date: '14/03/2025', category: 'AUC-2025-0041', ownerCode: 'AE-9106286 - SW LOGISTICS LLC', claimExpiry: 'N/A', exportExpiry: 'N/A' },
    ],
    depositType: 'Refund on Auction Proceed', claimantName: 'SW LOGISTICS LLC', claimantCode: 'AE-9106286', submissionDate: '29/06/2026', status: 'Under Processing', requestStatus: 'Under Processing', remark: '—',
  },
];

const DRAFT_ROWS: ClaimRow[] = [
  {
    reqNo: '4701770', claimNo: '—', ver: '1', claimType: 'Refund of Deposits',
    declarations: [
      { declNo: '105-09977250-24', date: '09/10/2024', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025' },
      { declNo: '105-09977251-24', date: '09/15/2024', category: 'Import',               ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '05/15/2025', exportExpiry: 'N/A'         },
    ],
    depositType: 'Deposit Alternative Duty Rate', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '—', status: 'Draft', requestStatus: 'Draft', remark: '—',
  },
  {
    reqNo: '231699', claimNo: '—', ver: '1', claimType: 'Claim Time Validity Extension',
    declarations: [
      { declNo: '4010001887099', date: '15/03/2026', category: 'Import for Re Export', ownerCode: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C', claimExpiry: '20/05/2026', exportExpiry: '18/02/2026' },
    ],
    depositType: 'Alternative Duty Deposit', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', claimantCode: 'AE-1019056', submissionDate: '—', status: 'Draft', requestStatus: 'Draft', remark: '—',
    transactionType: 'Claim Time Validity Extension', requestedFor: 'AE-1019056',
  },
];

function DeclarationsModal({ declarations, chargeType, subClaimStatus, onClose, onDeclarationOpen }: { declarations: DeclDetail[]; chargeType: string; subClaimStatus: Status; onClose: () => void; onDeclarationOpen?: (declNo: string) => void }) {
  const st = STATUS_STYLE[subClaimStatus];
  const STATUS_W = 128;
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-w-[1100px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        {/* Dark navy header — same as VccListPopup */}
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px]">
          <div>
            <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>Declaration Details</p>
            <p className="text-[12px] text-[#a7c3eb]">{declarations.length} declaration{declarations.length === 1 ? '' : 's'}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        {/* Bordered inner table — Sub Claim Status is the sticky trailing column, everything
            else scrolls left/right, matching the master listing table pattern used elsewhere.
            There is no Action column: the Declaration No. link already opens the declaration. */}
        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="border border-[#eef1f6] rounded-[8px]" style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={STATUS_W} />
            <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 760, fontFamily: font }}>
                <thead>
                  <tr style={{ background: '#a6c2e9' }}>
                    {['#', 'Declaration No.', 'Declaration Clearance Date', 'Declaration Type', 'Charge Type', 'Owner Details'].map((h, i) => (
                      <th key={h} className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap', width: i === 0 ? 44 : undefined }}>
                        {h}
                      </th>
                    ))}
                    <th className="text-left text-[16px] text-[#000]" style={{ position: 'sticky', right: 0, width: STATUS_W, minWidth: STATUS_W, background: '#a6c2e9', padding: '12px 8px', fontWeight: 500, whiteSpace: 'nowrap', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                      Sub Claim Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {declarations.map((d, i) => (
                    <tr key={d.declNo} style={{ borderTop: '1px solid #eef1f6' }}>
                      <td className="text-[14px] text-[#697498]" style={{ padding: '12px' }}>{i + 1}</td>
                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <button
                          className="text-[16px] text-[#1360d2] hover:underline"
                          style={{ fontWeight: 500 }}
                          onClick={() => { onDeclarationOpen?.(d.declNo); onClose(); }}
                        >
                          {d.declNo}
                        </button>
                      </td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.date}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'normal', lineHeight: 1.3 }}>{d.category}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{chargeType}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'normal', lineHeight: 1.3, maxWidth: 200 }}>{d.ownerCode}</td>
                      <td style={{ position: 'sticky', right: 0, width: STATUS_W, minWidth: STATUS_W, background: '#fff', padding: '12px 8px', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                        <span className="text-[14px] whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: 4, fontWeight: 500, fontFamily: font }}>
                          {subClaimStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-[24px] py-[16px]" style={{ borderTop: '1px solid #e2ebf9' }}>
          <button data-secondary-btn
            onClick={onClose}
            className="h-[44px] px-[22px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
            style={{ fontWeight: 500, fontSize: 14, fontFamily: font }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

type Props = {
  onView?: (row: ClaimRow) => void;
  onAmend?: (claimType: string) => void;
  onCancel?: (claimType: string) => void;
  /** The receipt differs per claim type, so the printed row goes with it. */
  onPrint?: (row: ClaimRow) => void;
  onViewDocs?: () => void;
  onHistory?: () => void;
  onSuspensionResponse?: (row: ClaimRow) => void;
  onDeclarationOpen?: (declNo: string) => void;
  onViewRequest?: (row: ClaimRow) => void;
  onCreateFromRejected?: (row: ClaimRow) => void;
  onMakePayment?: (row: ClaimRow) => void;
  showDrafts?: boolean;
  showColModal?: boolean;
  onCloseColModal?: () => void;
  /** Set when the user searched using "Declaration Number" as the basic-search parameter —
      filters rows to that declaration and switches the table to the dynamic column set. */
  searchDeclNo?: string;
  /** Set when the user searched using "Request Number" — filters to that request and switches
      the table to the request-specific dynamic column set (see REQ_SEARCH_COLS below). */
  searchReqNo?: string;
  /** Dedicated "Claim Time Validity Extension" sidebar listing — shows all Claim Time Validity
      Extension requests by default, using the same column set as a Request Number search,
      instead of requiring the user to search first. searchReqNo still narrows it. */
  requestsOnly?: boolean;
};

const DECL_SEARCH_COLS = ['declNo', 'depositType', 'claimNo', 'reqNo', 'claimType', 'claimant', 'submissionDate', 'remark'];
const REQ_SEARCH_COLS = ['reqNo', 'transactionType', 'requestedFor', 'submissionDate', 'remark'];

export default function ClaimsTable({ onView, onAmend, onCancel, onPrint, onViewDocs, onHistory, onSuspensionResponse, onDeclarationOpen, onViewRequest, onCreateFromRejected, onMakePayment, showDrafts = false, showColModal, onCloseColModal, searchDeclNo, searchReqNo, requestsOnly = false }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const [declModal, setDeclModal] = useState<ClaimRow | null>(null);

  const STATUS_COLOR: Record<Status, string> = {
    'Under Processing': '#b45309', 'Completed': '#28a745', 'Suspended': '#dc3545', 'Draft': '#697498', 'Submitted': '#1360d2', 'Payment Pending': '#b45309',
    'Registered': '#7c3aed', 'Rejected': '#dc3545',
  };

  useEffect(() => {
    setPage(1);
    setStatusFilter(null);
    setOpenFlyout(null);
  }, [showDrafts]);

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    // The flyout is a fixed-position portal, so it won't track the table's own scroll —
    // close it instead of leaving it floating in a stale spot.
    const onScroll = () => setOpenFlyout(null);
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [openFlyout]);

  const declSearchActive = !!searchDeclNo && searchDeclNo.trim() !== '';
  const reqSearchActive = !!searchReqNo && searchReqNo.trim() !== '';

  const rows = useMemo(() => {
    const base = showDrafts ? DRAFT_ROWS : CLAIM_ROWS;
    if (requestsOnly) {
      const requestRows = base.filter((r) => r.transactionType === 'Claim Time Validity Extension');
      const statusFiltered = statusFilter ? requestRows.filter((r) => r.requestStatus === statusFilter) : requestRows;
      if (!reqSearchActive) return statusFiltered;
      const q = searchReqNo!.trim().toLowerCase();
      return statusFiltered.filter((r) => r.reqNo.toLowerCase().includes(q));
    }
    if (reqSearchActive) {
      const q = searchReqNo!.trim().toLowerCase();
      const statusFiltered = statusFilter ? base.filter((r) => r.requestStatus === statusFilter) : base;
      return statusFiltered.filter((r) => r.reqNo.toLowerCase().includes(q));
    }
    // Non-claim requests (e.g. Claim Time Validity Extension) only surface via Request Number search.
    const claimsOnly = base.filter((r) => !r.transactionType);
    const statusFiltered = statusFilter ? claimsOnly.filter((r) => r.status === statusFilter) : claimsOnly;
    if (!declSearchActive) return statusFiltered;
    const q = searchDeclNo!.trim().toLowerCase();
    return statusFiltered.filter((r) => r.declarations.some((d) => d.declNo.toLowerCase().includes(q)));
  }, [showDrafts, statusFilter, declSearchActive, searchDeclNo, reqSearchActive, searchReqNo, requestsOnly]);

  const matchedDeclNo = (row: ClaimRow) => {
    if (!declSearchActive) return row.declarations[0]?.declNo ?? '—';
    const q = searchDeclNo!.trim().toLowerCase();
    return row.declarations.find((d) => d.declNo.toLowerCase().includes(q))?.declNo ?? row.declarations[0]?.declNo ?? '—';
  };

  /* `configHidden` columns stay available to the dynamic search views (Declaration Number /
     Request Number results) but are not offered in the Columns configuration popup. */
  const CLAIMS_COL_DEFS: (ColDef & { w: number; draftsOnly?: boolean; claimsOnly?: boolean; configHidden?: boolean })[] = [
    { key: 'reqNo',           label: 'Request No.',           w: 150 },
    { key: 'claimNo',         label: 'Claim No.',             w: 120, claimsOnly: true },
    { key: 'claimType',       label: 'Claim Type',            w: 160 },
    { key: 'declarations',    label: 'No. of Declarations',   w: 150 },
    { key: 'declNo',          label: 'Declaration Number',    w: 180, configHidden: true },
    { key: 'depositType',     label: 'Charge Type',           w: 220, configHidden: true },
    { key: 'claimant',        label: 'Claimant Details',      w: 280 },
    { key: 'submissionDate',  label: showDrafts ? 'Claim Request Date' : 'Submission Date', w: 170 },
    { key: 'remark',          label: 'Remarks',               w: 200, claimsOnly: true },
    { key: 'transactionType', label: 'Transaction Type',      w: 200 },
    { key: 'requestedFor',    label: 'Requested For',         w: 160 },
  ];

  const applicableDefs = CLAIMS_COL_DEFS.filter((c) => showDrafts ? !c.claimsOnly : !c.draftsOnly);
  const configurableDefs = applicableDefs.filter((c) => !c.configHidden);
  /* Default listing hides Charge Type, the single-declaration-number column, and the request-only
     columns — those only surface once the user searches by Declaration Number or Request Number
     (see DECL_SEARCH_COLS / REQ_SEARCH_COLS below). */
  const [visibleCols, setVisibleCols] = useState<string[]>(
    CLAIMS_COL_DEFS.map((c) => c.key).filter((k) => !['depositType', 'declNo', 'transactionType', 'requestedFor'].includes(k)),
  );
  const showRequestCols = reqSearchActive || requestsOnly;
  const visibleHeaders = (showRequestCols ? REQ_SEARCH_COLS : declSearchActive ? DECL_SEARCH_COLS : visibleCols)
    .map((k) => applicableDefs.find((c) => c.key === k)!)
    .filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const cell = (content: React.ReactNode, colKey: string, w: number, extra?: React.CSSProperties) => (
    <td data-col-key={colKey} style={{ background: getTdBg(colKey) ?? '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: w, ...extra }}>{content}</td>
  );

  const txt = (v: React.ReactNode) => (
    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
  );

  const declLink = (row: ClaimRow) => (
    <button
      onClick={() => setDeclModal(row)}
      className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
      style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline', fontFamily: font }}
      aria-label="View declarations"
    >
      {row.declarations.length}
    </button>
  );

  const FLYOUT_W = 272;
  // Rendered via a fixed-position portal (not inline `absolute`) so it can never be clipped by
  // the table's scroll container — `overflow-x-auto` also computes overflow-y to `auto`, which
  // was cutting the flyout off above the pagination bar for rows near the bottom of the table.
  const flyoutItemsFor = (row: ClaimRow): FlyoutId[] =>
    hasRejectedSubClaim(row.remark)
      ? (row.transactionType ? ['viewRequest', 'createFromRejected'] : ['view', 'history', 'createFromRejected'])
      : row.transactionType
      ? ['viewRequest', 'suspensionResponse']
      : getFlyoutItems(row.status, showDrafts, row.claimType === 'Non Remittance');

  const renderFlyout = (i: number, row: ClaimRow) => (
    <div className="relative inline-block">
      <button
        className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
        aria-label="More actions"
        onClick={(e) => {
          if (openFlyout === i) { setOpenFlyout(null); return; }
          const r = e.currentTarget.getBoundingClientRect();
          // Keep the menu inside the viewport for rows near the bottom of the table.
          const menuH = flyoutItemsFor(row).length * 40 + 8;
          const top = Math.max(8, Math.min(r.top, window.innerHeight - menuH - 8));
          setFlyoutPos({ top, left: r.left - FLYOUT_W - 6 });
          setOpenFlyout(i);
        }}
      >
        <MoreIcon />
      </button>
      {openFlyout === i && flyoutPos && createPortal(
        <div ref={flyoutRef} className="fixed z-[1000] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ top: flyoutPos.top, left: flyoutPos.left, width: FLYOUT_W, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {flyoutItemsFor(row).map((id) => (
            <button
              key={id}
              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
              onClick={() => {
                setOpenFlyout(null);
                if (id === 'view')     onView?.(row);
                if (id === 'viewRequest') onViewRequest?.(row);
                if (id === 'amend')    onAmend?.(row.claimType);
                if (id === 'cancel')   onCancel?.(row.claimType);
                if (id === 'print')       onPrint?.(row);
                if (id === 'printReceipt') onPrint?.(row);
                if (id === 'viewDocs') onViewDocs?.();
                if (id === 'history')  onHistory?.();
                if (id === 'suspensionResponse') onSuspensionResponse?.(row);
                if (id === 'createFromRejected') onCreateFromRejected?.(row);
                if (id === 'makePayment') onMakePayment?.(row);
              }}
            >
              <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">{ICONS[id]}</span>
              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: font }}>{LABELS[id]}</span>
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );

  /* Static (sticky) trailing columns, right to left:
       Action | Claim Status | Request Status | [Sub Claim Status]
     "Request Status" always trails the scrolling columns and sits immediately before Claim
     Status. Request-only listings (Request Number search / Claim Time Validity Extension)
     have no claim behind them, so Claim Status is dropped there and the status filter moves
     onto Request Status. A Declaration Number search adds the per-declaration Sub Claim
     Status ahead of both. */
  const STICKY_STATUS_W = 160;
  const STICKY_ACTION_W = 79;
  /* Only the leftmost static column casts a shadow — it marks the boundary with the scrolling
     area. The remaining static columns (and Action) sit flush so the group reads as one block. */
  const STICKY_SHADOW = '-3px 0 6px rgba(0,0,0,0.06)';
  const dualStatus = declSearchActive;
  const showClaimStatus = !showRequestCols && !showDrafts;
  const reqStatusLabel = showDrafts ? 'Claim Request Status' : 'Request Status';
  const claimStatusRight = STICKY_ACTION_W;
  const reqStatusRight = STICKY_ACTION_W + (showClaimStatus ? STICKY_STATUS_W : 0);
  const subStatusRight = reqStatusRight + STICKY_STATUS_W;
  const stickyWidth = subStatusRight + (dualStatus ? STICKY_STATUS_W : 0);
  const subStatusShadow = dualStatus ? STICKY_SHADOW : undefined;
  const reqStatusShadow = dualStatus ? undefined : STICKY_SHADOW;

  const renderSubClaimStatusCell = (status: Status, i: number) => {
    const st = STATUS_STYLE[status];
    return (
      <td style={{ position: 'sticky', right: subStatusRight, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: STICKY_STATUS_W, boxShadow: subStatusShadow, borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
        <span className="text-[16px] whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontWeight: 500, fontFamily: font }}>
          {status}
        </span>
      </td>
    );
  };

  const renderStatusCell = (status: Status, i: number, right: number = claimStatusRight, boxShadow?: string) => {
    const st = STATUS_STYLE[status];
    return (
      <td style={{ position: 'sticky', right, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: STICKY_STATUS_W, boxShadow, borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
        <span className="text-[16px] whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontWeight: 500, fontFamily: font }}>
          {status}
        </span>
      </td>
    );
  };

  const renderActionCell = (i: number, row: ClaimRow) => (
    <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 79, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
      {renderFlyout(i, row)}
    </td>
  );

  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + stickyWidth;

  return (
    <>
    {showColModal && (
      <ManageColumnsModal
        columns={configurableDefs}
        visible={visibleCols.filter((k) => configurableDefs.some((c) => c.key === k))}
        lockedColumns={[
          { key: '_reqStatus', label: showDrafts ? 'Claim Request Status' : 'Request Status' },
          { key: '_status', label: 'Claim Status' },
          { key: '_action', label: 'Action' },
        ]}
        onSave={setVisibleCols}
        onClose={() => onCloseColModal?.()}
      />
    )}
    <div style={{ position: 'relative' }}>
      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={stickyWidth} />
      <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
        {resizeIndicatorLeft !== null && (
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3, background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
        )}
        <table
          ref={tableRef}
          onMouseMove={handleTableMouseMove}
          onMouseLeave={handleTableMouseLeave}
          onMouseDown={handleTableMouseDown}
          style={{ minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined }}
          className="w-full"
        >
          <thead>
            <tr>
              {visibleHeaders.map((col, idx) => (
                <th
                  key={col.label}
                  data-col-key={col.key}
                  style={{ position: 'relative', width: getW(col.key, col.w), minWidth: getW(col.key, col.w), padding: '18px 12px 10px', textAlign: 'left', fontWeight: 500, borderRadius: idx === 0 ? '8px 0 0 0' : undefined, paddingLeft: idx === 0 ? 16 : 12, ...getThStyle(col.key) }}
                  onDragOver={(e) => onDragOver(col.key, e)}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(col.key, e, visibleCols, setVisibleCols)}
                >
                  <div
                    draggable
                    onDragStart={(e) => onDragStart(col.key, e)}
                    onDragEnd={onDragEnd}
                    style={{
                      display: hoveredColKey === col.key ? 'flex' : 'none',
                      position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                      cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
                    }}
                  >
                    <DragDots />
                  </div>
                  <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                </th>
              ))}
              {dualStatus && (
                <th style={{ position: 'sticky', right: subStatusRight, width: STICKY_STATUS_W, minWidth: STICKY_STATUS_W, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: subStatusShadow, zIndex: 2 }}>
                  <span className="text-[16px] text-[#051937]">Sub Claim Status</span>
                </th>
              )}
              <th style={{ position: 'sticky', right: reqStatusRight, width: STICKY_STATUS_W, minWidth: STICKY_STATUS_W, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: reqStatusShadow, zIndex: 2 }}>
                {showClaimStatus ? (
                  <span className="text-[16px] text-[#051937]">{reqStatusLabel}</span>
                ) : (
                  <StatusFilterHeader
                    label={reqStatusLabel}
                    options={CLAIM_STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(v) => setStatusFilter(v as Status | null)}
                    colorMap={STATUS_COLOR}
                  />
                )}
              </th>
              {showClaimStatus && (
                <th style={{ position: 'sticky', right: claimStatusRight, width: STICKY_STATUS_W, minWidth: STICKY_STATUS_W, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2 }}>
                  <StatusFilterHeader
                    label="Claim Status"
                    options={CLAIM_STATUS_OPTIONS}
                    value={statusFilter}
                    onChange={(v) => setStatusFilter(v as Status | null)}
                    colorMap={STATUS_COLOR}
                  />
                </th>
              )}
              <th style={{ position: 'sticky', right: 0, width: 79, minWidth: 79, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8 }}>
                <span className="text-[16px] text-[#051937]">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const renderCellByKey = (key: string) => {
                switch (key) {
                  case 'reqNo':          return cell(txt(row.reqNo), 'reqNo', 150, { paddingLeft: 16 });
                  case 'claimNo':        return !showDrafts ? cell(txt(row.claimNo), 'claimNo', 120) : null;
                  case 'claimType':      return cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.claimType}</span>, 'claimType', 160);
                  case 'declarations':   return cell(row.claimType === 'Refund on Auction Proceed' ? txt('—') : declLink(row), 'declarations', 150);
                  case 'declNo':         return cell(txt(matchedDeclNo(row)), 'declNo', 180);
                  case 'depositType':    return cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.depositType}</span>, 'depositType', 220);
                  case 'transactionType': return cell(txt(row.transactionType ?? '—'), 'transactionType', 200);
                  case 'requestedFor':    return cell(txt(row.requestedFor ?? '—'), 'requestedFor', 160);
                  case 'claimant':       return cell(
                    <div className="flex flex-col" style={{ lineHeight: 1.3 }}>
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{row.claimantName}</span>
                      <span className="text-[12px] text-[#697498]" style={{ fontFamily: font }}>{row.claimantCode}</span>
                    </div>,
                    'claimant',
                    280,
                  );
                  case 'submissionDate': return cell(txt(row.submissionDate), 'submissionDate', 170);
                  case 'remark':         return cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.remark}</span>, 'remark', 200);
                  default:               return null;
                }
              };
              return (
                <tr key={i}>
                  {visibleHeaders.map((col) => <React.Fragment key={col.key}>{renderCellByKey(col.key)}</React.Fragment>)}
                  {dualStatus && renderSubClaimStatusCell(row.status, i)}
                  {renderStatusCell(row.requestStatus, i, reqStatusRight, reqStatusShadow)}
                  {showClaimStatus && renderStatusCell(row.status, i, claimStatusRight)}
                  {renderActionCell(i, row)}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pt-[16px]">
          <Pagination page={page} totalPages={Math.max(1, Math.ceil(rows.length / pageSize))} pageSize={pageSize} totalItems={rows.length} onPageChange={setPage} onPageSizeChange={setPageSize} />
        </div>
      </div>
    </div>
    {declModal && (
      <DeclarationsModal
        declarations={declModal.declarations}
        chargeType={declModal.depositType}
        subClaimStatus={declModal.status}
        onClose={() => setDeclModal(null)}
        onDeclarationOpen={onDeclarationOpen}
      />
    )}
    </>
  );
}
