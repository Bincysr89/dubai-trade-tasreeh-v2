import { useState } from 'react';
import PmListCard, { GreyIconBtn, type Col } from './PmTable';
import {
  Agree, Amount, Btn, C, DocCard, FootActions, FSelect, FTextArea, Grid3, Modal, PmPage, ResultCard, RV, Rule, Section, SubHead, Tag,
} from './PmUI';
import { REJECT_REASONS, STATUSES, VISITOR, type ApprovalRow, type PassDetail } from './pmData';

/* ──────────────────────────────────────────────────────────────
   Tasreeh — Pass Approvals (Host Company). Figma 1347:50349
   listing → 1347:50697 Pass Details → Approve (9319:211219) /
   Reject (1347:51606) / Return (1347:51638) → result pages
   1347:50997 / 1347:51042 / 1347:51087.
   ────────────────────────────────────────────────────────────── */

export type Decision = 'approve' | 'reject' | 'return';

const PencilIcon = () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" strokeLinejoin="round" /></svg>;
const EyeIcon = () => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>;

export function PassApprovalsPage({ rows, onHome, onOpen }: { rows: ApprovalRow[]; onHome: () => void; onOpen: (r: ApprovalRow) => void }) {
  const cols: Col<ApprovalRow>[] = [
    { key: 'passRefNo', label: 'Pass Reference No' },
    { key: 'passType', label: 'Pass Type' },
    { key: 'dateOfVisit', label: 'Date of Visit' },
    { key: 'visitorName', label: 'Visitor Name' },
    { key: 'visitorCompany', label: 'Visitor Company' },
    { key: 'visitorEmail', label: 'Visitor Email' },
    { key: 'createdDate', label: 'Created Date' },
    { key: 'status', label: 'Status', render: r => <Tag status={r.status} /> },
  ];
  return (
    <PmPage crumbs={[{ label: 'Pass Approvals' }]} onHome={onHome}>
      <PmListCard title="Pass Approvals" rows={rows} cols={cols} rowKey={r => r.passRefNo}
        search={r => `${r.passRefNo} ${r.visitorName} ${r.visitorCompany}`} searchPlaceholder="Search with application number"
        filters={[
          { label: 'Pass Type', options: ['Permanent', 'Temporary'], match: (r, v) => r.passType === v },
          { label: 'Status', options: [...STATUSES.filter(s => s !== 'Draft'), 'Returned'], match: (r, v) => r.status === v },
          { label: 'Visitor Company', options: [...new Set(rows.map(r => r.visitorCompany))], match: (r, v) => r.visitorCompany === v },
        ]}
        actionCol={{
          label: 'Action', width: '70px',
          render: r => r.status === 'Pending'
            ? <GreyIconBtn label={`Review ${r.passRefNo}`} onClick={() => onOpen(r)}><PencilIcon /></GreyIconBtn>
            : <GreyIconBtn label={`View ${r.passRefNo}`} onClick={() => onOpen(r)}><EyeIcon /></GreyIconBtn>,
        }}
      />
    </PmPage>
  );
}

export const CONFIRM_TEXT = 'I confirm that all the information provided to the Security Department is accurate, and I take full responsibility for it. I also acknowledge that the Security Department has the right to impose fines if any incorrect information is submitted.';

export function ApprovalDetailsPage({ row, pass, crumbs, onHome, onBack, onDecide }: {
  row: ApprovalRow; pass: PassDetail; crumbs: { label: string; onClick?: () => void }[];
  onHome: () => void; onBack: () => void; onDecide: (d: Decision) => void;
}) {
  const [agree, setAgree] = useState(true);
  const reviewable = row.status === 'Pending';
  const [first, ...rest] = row.visitorName.split(' ');
  return (
    <PmPage crumbs={[...crumbs, { label: 'Pass Details' }]} onHome={onHome}>
      <Section title="Pass Information" right={
        <div className="flex items-center gap-[8px]"><span className="text-[14px]" style={{ color: C.text }}>Status:</span>
          <Tag status={reviewable ? 'Under Review' : row.status} big /></div>
      }>
        <Grid3>
          <RV label="Application Number:" value={pass.applicationNo} /><RV label="Pass Reference Number:" value={row.passRefNo} /><RV label="Port:" value={pass.port} />
          <RV label="Entry Gate:" value={pass.entryGate} /><RV label="Pass Type:" value={row.passType} /><RV label="Pass Duration:" value={pass.passDuration} />
          <RV label="Purpose of Visit" value={pass.purpose} /><RV label="Date of Visit" value={row.dateOfVisit} /><RV label="Total Amount:"><Amount value={pass.amount} /></RV>
          <RV label="Host Company Name" value={pass.hostCompany} />
        </Grid3>
        <Rule />
        <SubHead>Visitor Information</SubHead>
        <Grid3>
          <RV label="Title" value="Mr" /><RV label="First Name" value={first} /><RV label="Last Name" value={rest.join(' ')} />
          <RV label="Nationality" value={VISITOR.nationality} /><RV label="Mobile" value={VISITOR.mobile} /><RV label="Email" value={row.visitorEmail} />
          <RV label="Date of Birth" value={VISITOR.dob} /><RV label="Designation" value={VISITOR.designation} /><RV label="Visa Type" value={VISITOR.visaType} />
          <RV label="Company Name" value={row.visitorCompany} /><RV label="Vehicle Number" value={VISITOR.vehicleNo} /><RV label="Driving License Number" value={VISITOR.drivingLicense} />
        </Grid3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] mt-[24px]"><DocCard title="Personal Photo" file="filename.png" /></div>
      </Section>
      <Section title="Payment Information">
        <Grid3><RV label="Payment Method" value="ROSOOM" /><RV label="Total Pass Amount"><Amount value={pass.amount} /></RV></Grid3>
      </Section>
      {reviewable && <Agree checked={agree} onChange={setAgree}>{CONFIRM_TEXT}</Agree>}
      <FootActions left={<Btn variant="outline" onClick={onBack}>Back</Btn>}
        right={reviewable ? <>
          <Btn variant="outline" onClick={() => onDecide('return')}>Return</Btn>
          <Btn variant="danger" onClick={() => onDecide('reject')}>Reject</Btn>
          <Btn variant="success" onClick={() => onDecide('approve')}>Approve</Btn>
        </> : undefined} />
    </PmPage>
  );
}

/* ── Decision popups ── */

export function ApproveModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Modal title="Alert" onClose={onClose}
      actions={<><Btn variant="outline" onClick={onClose}>Cancel</Btn><Btn onClick={onConfirm}>Yes, Confirm and Approve</Btn></>}>
      <p className="text-[18px] font-medium mb-[10px]" style={{ color: C.navy }}>Confirm Details</p>
      <p className="text-[15px] leading-[26px]" style={{ color: C.text }}>
        It is the customer's responsibility to review and ensure the accuracy of all submitted data. PCFC Security reserves the right to issue fines for any incorrect details provided.
      </p>
    </Modal>
  );
}

export function RejectModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [reason, setReason] = useState('');
  const [remarks, setRemarks] = useState('');
  return (
    <Modal title="Reason of Rejection" onClose={onClose}
      actions={<><Btn variant="outline" onClick={onClose}>Cancel</Btn><Btn variant="danger" onClick={onConfirm}>Reject</Btn></>}>
      <div className="w-full sm:w-[240px] mb-[22px]"><FSelect label="Reason for Rejection" required value={reason} options={REJECT_REASONS} onChange={setReason} /></div>
      <FTextArea label="Remarks" required value={remarks} onChange={setRemarks} />
      <div className="h-[120px]" />
    </Modal>
  );
}

export function ReturnModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  const [remarks, setRemarks] = useState('');
  return (
    <Modal title="Reason for Update" onClose={onClose}
      actions={<><Btn variant="outline" onClick={onClose}>Cancel</Btn><Btn onClick={onConfirm}>Return for Update</Btn></>}>
      <FTextArea label="Remarks" required value={remarks} onChange={setRemarks} />
      <div className="h-[200px]" />
    </Modal>
  );
}

/* ── Result pages ── */

const RESULT = {
  approve: { tone: 'success' as const, title: 'Pass Approved Successfully', verb: 'Approved', status: 'Approved' as const },
  reject:  { tone: 'danger' as const, title: 'Pass has been Rejected Successfully', verb: 'Rejected', status: 'Rejected' as const },
  return:  { tone: 'neutral' as const, title: 'Pass Returned for Amendment Successfully', verb: 'Returned', status: 'Returned' as const },
};

export function DecisionResultPage({ decision, row, date, crumbs, onHome, onBack }: {
  decision: Decision; row: ApprovalRow; date: string; crumbs: { label: string; onClick?: () => void }[]; onHome: () => void; onBack: () => void;
}) {
  const r = RESULT[decision];
  return (
    <PmPage crumbs={[...crumbs, { label: 'Pass Details' }]} onHome={onHome}>
      <ResultCard tone={r.tone} title={r.title}
        rows={[
          ['Pass Reference Number', row.passRefNo], [`${r.verb} Date`, date], [`${r.verb} By`, 'John Doe'],
          ['Status', <Tag key="s" status={r.status} />], ['Visitor Name', row.visitorName], ['Visitor Company', row.visitorCompany],
        ]}
        actions={<Btn variant="outline" onClick={onBack}>Back to Pass Approvals</Btn>} />
    </PmPage>
  );
}
