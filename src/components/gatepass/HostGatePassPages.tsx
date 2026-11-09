import { useState, type ReactNode } from 'react';
import {
  font, GatePage, GSection, Grid4, GValue, GAmount, GTag, toneFor, GSelect, GTextArea, GAgree,
  PrimaryBtn, SecondaryBtn,
} from './GateFields';
import { PassInfoFields, VisitorInfoFields, DocumentFields, StatusRight } from './GatePassViewPages';
import { Dialog } from './GatePassModals';
import { PASS_FEE, REJECTION_REASONS, HOST_APPROVALS_TITLE, HOST_ACTIONS, GATE_PASS_TITLE, shortRef, type GateRow } from './gatePassData';
import type { ListingVariant } from './GatePassListingPage';

/* ──────────────────────────────────────────────────────────────
   Host Company persona — Pass Approvals (Tasreeh-Dev Figma
   1347:50697 details · 9319:211219 approve alert · 1347:51606 reject
   · 1347:51638 return · 1347:50997 / 51042 / 51087 confirmations
   · 1357:49262 view pass). Same template/components as the Visitor
   Company flow; only the content comes from Figma.
   ────────────────────────────────────────────────────────────── */

const HOST_AGREEMENT =
  'I confirm that all the information provided to the Security Department is accurate, and I take full responsibility for it. ' +
  'I also acknowledge that the Security Department has the right to impose fines if any incorrect information is submitted.';

/* Coloured action buttons (Reject / Approve) in the portal's button shape */
function ToneBtn({ tone, children, onClick, disabled }: { tone: 'red' | 'green'; children: ReactNode; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="h-[48px] px-[26px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      style={{ background: tone === 'red' ? '#dc3545' : '#28a745', fontFamily: font, fontWeight: 500 }}>
      {children}
    </button>
  );
}

/* One card per section — same layout as the Visitor Company forms */
const DetailCards = ({ row }: { row: GateRow }) => (
  <>
    <GSection title="Pass Information" right={<StatusRight row={row} />}>
      <PassInfoFields row={row} />
    </GSection>
    <GSection title="Visitor Information">
      <VisitorInfoFields row={row} />
    </GSection>
    <GSection title="Document Details">
      <DocumentFields />
    </GSection>
  </>
);

const PaymentSection = () => (
  <GSection title="Payment Information">
    <Grid4>
      <GValue label="Payment Method" value="ROSOOM" />
      <GValue label="Total Pass Amount"><GAmount value={PASS_FEE} /></GValue>
    </Grid4>
  </GSection>
);

/* ── Pass Details — review a visitor-company request (Figma 1347:50697) ── */
export function HostPassDetailsPage({ row, reviewable, onHome, onBack, onReturn, onReject, onApprove }: {
  row: GateRow; reviewable: boolean;
  onHome: () => void; onBack: () => void; onReturn: () => void; onReject: () => void; onApprove: () => void;
}) {
  const [agree, setAgree] = useState(true);
  const shown = reviewable ? { ...row, status: 'Under Review' as const } : row;
  return (
    <GatePage
      title={`Pass Details - ${shortRef(row)}`}
      crumb={HOST_APPROVALS_TITLE}
      onHome={onHome}
      onListing={onBack}
      footerLeft={<SecondaryBtn onClick={onBack}>Back</SecondaryBtn>}
      footerRight={reviewable ? (
        <>
          <SecondaryBtn onClick={onReturn}>Return</SecondaryBtn>
          <ToneBtn tone="red" onClick={onReject}>Reject</ToneBtn>
          <ToneBtn tone="green" onClick={onApprove} disabled={!agree}>Approve</ToneBtn>
        </>
      ) : undefined}
    >
      <DetailCards row={shown} />
      <PaymentSection />
      {reviewable && <GAgree checked={agree} onChange={setAgree}>{HOST_AGREEMENT}</GAgree>}
    </GatePage>
  );
}

/* ── View Pass — from the All Requests flyout (Figma 1357:49262) ── */
export function HostViewPassPage({ row, onHome, onBack, onReuse, onPrint }: {
  row: GateRow; onHome: () => void; onBack: () => void; onReuse: () => void; onPrint: () => void;
}) {
  return (
    <GatePage
      title={`View Pass - ${shortRef(row)}`}
      crumb={GATE_PASS_TITLE}
      onHome={onHome}
      onListing={onBack}
      footerLeft={<SecondaryBtn onClick={onBack}>Back</SecondaryBtn>}
      footerRight={<>
        <SecondaryBtn onClick={onReuse}>Reuse this Pass Details</SecondaryBtn>
        <PrimaryBtn onClick={onPrint}>Print Pass</PrimaryBtn>
      </>}
    >
      <DetailCards row={row} />
      <PaymentSection />
    </GatePage>
  );
}

/* ── Decision confirmation (Figma 1347:50997 approved · 51042 rejected · 51087 returned) ── */
export type Decision = 'Approved' | 'Rejected' | 'Returned';
const DECISION = {
  Approved: { heading: 'Pass Approved Successfully', color: '#3ca865', circle: '#3cc35a', dateLabel: 'Approved Date', byLabel: 'Approved By' },
  Rejected: { heading: 'Pass has been Rejected Successfully', color: '#dc3545', circle: '#ef5a3c', dateLabel: 'Rejected Date', byLabel: 'Rejected By' },
  Returned: { heading: 'Pass Returned for Amendment Successfully', color: '#0e1b3d', circle: '#dfe3ea', dateLabel: 'Returned Date', byLabel: 'Returned By' },
} as const;

export function HostDecisionPage({ row, decision, date, onHome, onBackToApprovals }: {
  row: GateRow; decision: Decision; date: string; onHome: () => void; onBackToApprovals: () => void;
}) {
  const d = DECISION[decision];
  const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="grid grid-cols-[210px_1fr] items-center gap-[8px]">
      <span className="text-[18px] text-[#575757]" style={{ fontFamily: font }}>{label} :</span>
      <span className="text-[18px] text-[#1a1a1a]" style={{ fontFamily: font }}>{children}</span>
    </div>
  );
  return (
    <GatePage title="Pass Details" crumb={HOST_APPROVALS_TITLE} onHome={onHome} onListing={onBackToApprovals}>
      <div className="bg-white rounded-[8px] py-[64px] px-[24px] flex flex-col items-center" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <span className="size-[75px] rounded-full flex items-center justify-center mb-[30px]" style={{ background: d.circle }}>
          {decision === 'Approved' && (
            <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
          {decision === 'Rejected' && (
            <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#fff" strokeWidth="2.2"><circle cx="12" cy="12" r="8" /><path d="M6.5 6.5l11 11" strokeLinecap="round" /></svg>
          )}
          {decision === 'Returned' && (
            <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#455174" strokeWidth="2.2"><path d="M4 12a8 8 0 108-8 8 8 0 00-5.7 2.3L4 8.5M4 4v4.5h4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          )}
        </span>
        <h2 className="text-[30px] font-medium mb-[18px] text-center" style={{ fontFamily: font, color: d.color }}>{d.heading}</h2>
        <div className="flex flex-col gap-[12px] mb-[30px]">
          <Row label="Pass Reference Number">{row.passRefNo}</Row>
          <Row label={d.dateLabel}>{date}</Row>
          <Row label={d.byLabel}>John Doe</Row>
          <Row label="Status"><GTag label={decision} tone={toneFor(decision === 'Approved' ? 'Successful' : decision === 'Rejected' ? 'Rejected' : 'Draft')} /></Row>
          <Row label="Visitor Name">{row.visitorName}</Row>
          <Row label="Visitor Company">{row.visitorCompany ?? '-'}</Row>
        </div>
        <SecondaryBtn onClick={onBackToApprovals}>Back to Pass Approvals</SecondaryBtn>
      </div>
    </GatePage>
  );
}

/* ── Popups ── */
function DialogShell({ title, onClose, children, footer, width = 800 }: {
  title: string; onClose: () => void; children: ReactNode; footer: ReactNode; width?: number;
}) {
  return (
    <Dialog onClose={onClose} width={width}>
      <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
        <h3 className="text-[18px] text-white font-medium" style={{ fontFamily: font }}>{title}</h3>
        <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="px-[24px] py-[24px]">{children}</div>
      <div className="flex justify-end gap-[16px] px-[24px] py-[18px]" style={{ borderTop: '1px solid #e8edf5' }}>{footer}</div>
    </Dialog>
  );
}

/* Approve → Alert / Confirm Details (Figma 9319:211219) */
export function ApproveConfirmModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <DialogShell title="Alert" onClose={onClose} width={640} footer={<>
      <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
      <PrimaryBtn onClick={onConfirm}>Yes, Confirm and Approve</PrimaryBtn>
    </>}>
      <p className="text-[20px] font-bold text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font }}>Confirm Details</p>
      <p className="text-[16px] text-[#3f4d66] leading-[26px]" style={{ fontFamily: font }}>
        It is the customer's responsibility to review and ensure the accuracy of all submitted data. PCFC Security reserves the
        right to issue fines for any incorrect details provided.
      </p>
    </DialogShell>
  );
}

/* Reject → Reason of Rejection (Figma 1347:51606) */
export function RejectModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  return (
    <DialogShell title="Reason of Rejection" onClose={onClose} footer={<>
      <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
      <ToneBtn tone="red" onClick={onConfirm}>Reject</ToneBtn>
    </>}>
      <div className="flex flex-col gap-[24px]">
        <div className="w-full sm:w-[340px]"><GSelect label="Reason for Rejection" value={reason} options={REJECTION_REASONS} onChange={setReason} required /></div>
        <GTextArea label="Remarks" value={remarks} onChange={setRemarks} required />
      </div>
    </DialogShell>
  );
}

/* Return → Reason for Update (Figma 1347:51638) */
export function ReturnModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [remarks, setRemarks] = useState('');
  return (
    <DialogShell title="Reason for Update" onClose={onClose} footer={<>
      <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
      <PrimaryBtn onClick={onConfirm}>Return for Update</PrimaryBtn>
    </>}>
      <GTextArea label="Remarks" value={remarks} onChange={setRemarks} required />
    </DialogShell>
  );
}

/* ── Listing variants — same master listing template, Figma content ── */
/* All Requests (Figma 1347:49911) */
export const HOST_ALL_VARIANT: ListingVariant = {
  title: GATE_PASS_TITLE,
  columns: [
    { key: 'passRefNo',     label: 'Pass Reference No.', w: 185 },
    { key: 'accessType',    label: 'Access Type',        w: 140 },
    { key: 'portName',      label: 'Port Name',          w: 200 },
    { key: 'passType',      label: 'Pass Type',          w: 150 },
    { key: 'passDuration',  label: 'Pass Duration',      w: 150 },
    { key: 'visitorName',   label: 'Visitor Name',       w: 175 },
    { key: 'approver',      label: 'Approver',           w: 150 },
    { key: 'applicationNo', label: 'Application No.',    w: 170 },
    { key: 'dateOfVisit',   label: 'Date of Visit',      w: 150 },
    { key: 'entryGate',     label: 'Entry Gate',         w: 130 },
    { key: 'submittedDate', label: 'Submitted Date',     w: 160 },
  ],
  defaultVisible: ['passRefNo', 'accessType', 'portName', 'passType', 'passDuration', 'visitorName', 'approver'],
  actions: HOST_ACTIONS,
  statuses: ['Pending', 'Approved', 'Rejected', 'Draft', 'Expired'],
  createLabel: 'Apply New Pass',
  searchFields: ['Pass Reference No.', 'Visitor Name', 'Application No.', 'Passport No.'],
};

/* Pass Approvals (Figma 1347:50349) */
export const HOST_APPROVALS_VARIANT: ListingVariant = {
  title: GATE_PASS_TITLE,
  columns: [
    { key: 'passRefNo',      label: 'Pass Reference No.', w: 185 },
    { key: 'passType',       label: 'Pass Type',          w: 150 },
    { key: 'dateOfVisit',    label: 'Date of Visit',      w: 150 },
    { key: 'visitorName',    label: 'Visitor Name',       w: 175 },
    { key: 'visitorCompany', label: 'Visitor Company',    w: 200 },
    { key: 'visitorEmail',   label: 'Visitor Email',      w: 260 },
    { key: 'submittedDate',  label: 'Created Date',       w: 150 },
    { key: 'portName',       label: 'Port Name',          w: 180 },
    { key: 'passDuration',   label: 'Pass Duration',      w: 150 },
  ],
  defaultVisible: ['passRefNo', 'passType', 'dateOfVisit', 'visitorName', 'visitorCompany', 'visitorEmail', 'submittedDate'],
  actions: [],
  statuses: ['Pending', 'Approved', 'Rejected', 'Returned', 'Expired'],
  createLabel: 'Apply New Pass',
  searchFields: ['Pass Reference No.', 'Visitor Name', 'Visitor Company'],
  actionMode: 'approval',
  hideDrafts: true,
  hideCreate: true,
};
