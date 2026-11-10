import { useCallback, useState } from 'react';
import { ConfirmDelete, Toast } from './PmUI';
import {
  PassListingPage, ViewPassPage, ApplyPassPage, AmendPassPage, RenewPassPage, ReportLostPage, SuccessPage, type RowMenuAction,
} from './PassPages';
import { DraftsPage, ApprovedPassesPage, MyRequestsPage, PaymentReceiptsPage } from './WorkspacePages';
import { CompanyApplyPage, CompanyListingPage, CompanyRequestPage, DraftSavedPage, type RequestVisitor } from './CompanyPages';
import { PassApprovalsPage, ApprovalDetailsPage, ApproveModal, RejectModal, ReturnModal, DecisionResultPage, type Decision } from './ApprovalPages';
import {
  PASS_ROWS, APPROVED_ROWS, DRAFT_ROWS, RECEIPT_ROWS, EMPTY_FORM, SAMPLE_PASS, PASS_FEE, REISSUE_FEE, VISITOR,
  detailFromRow, formFromDetail, inOneMonth, isoToDisplay, newAppNo, today,
  COMPANY_ROWS, APPROVAL_ROWS, EMPTY_COMPANY_FORM, perPass, money,
  type DraftRow, type PassDetail, type PassForm, type PassRow, type CompanyForm, type ApprovalRow,
} from './pmData';

/* ──────────────────────────────────────────────────────────────
   Tasreeh — Pass Management (Visitor). Figma "Tasreeh-Dev" flow
   re-themed to Dubai Trade. Entered from the Supplier catalogue:
     View All Passes (after the Visitor/Company popup) → listing
     Apply Gate Pass / Report Lost Pass / Return Pass for Amendment
     Drafts / My Gate Passes / My Request / My Payment Receipts
   ────────────────────────────────────────────────────────────── */

export type PassMgmtEntry = 'listing' | 'apply' | 'lost' | 'amend' | 'drafts' | 'approved' | 'requests' | 'receipts' | 'companyApply' | 'approvals' | 'company';

type Home = 'listing' | 'drafts' | 'approved' | 'requests' | 'receipts' | 'company' | 'approvals';
type Step =
  | { kind: Home }
  | { kind: 'view'; pass: PassDetail }
  | { kind: 'apply'; initial: PassForm; title?: string; draftId?: string }
  | { kind: 'amend'; pass: PassDetail; initial: PassForm; draftId?: string }
  | { kind: 'renew'; initial: PassForm }
  | { kind: 'lost'; pass: PassDetail; draftId?: string }
  | { kind: 'success'; appNo: string; amount: string; pass: PassDetail; crumb: string; visitors?: RequestVisitor[] }
  /* Company (Host / Visitor company) */
  | { kind: 'companyApply'; initial: CompanyForm; draftId?: string }
  | { kind: 'draftSaved'; draftNo: string; form: CompanyForm; draftId: string }
  | { kind: 'companyView'; pass: PassDetail; visitors: RequestVisitor[]; created: string }
  /* Pass Approvals */
  | { kind: 'approvalView'; row: ApprovalRow }
  | { kind: 'decision'; row: ApprovalRow; decision: Decision; date: string };

const HOME_LABEL: Record<Home, string> = {
  listing: 'Pass Management', drafts: 'My Drafts', approved: 'My Approved Passes', requests: 'My Requests', receipts: 'My Payment Receipts',
  company: 'Pass Management', approvals: 'Pass Approvals',
};

const SECOND_VISITOR: RequestVisitor = { passRefNo: '2377471239', port: 'Jebel Ali', passType: 'Temporary', passDuration: 'One Year', name: 'John Doe', visaType: 'Visitor', dob: '21-Jan-1996', gender: 'Male', company: 'EFG' };
const visitorsFromRow = (r: PassRow): RequestVisitor[] => [
  { passRefNo: r.passRefNo, port: r.portName, passType: r.passType, passDuration: r.passDuration, name: r.visitorName, visaType: 'Resident', dob: '21-Jan-1996', gender: 'Male', company: 'ABC' },
  SECOND_VISITOR,
];

export default function PassMgmtFlow({ entry = 'listing', onClose }: { entry?: PassMgmtEntry; onClose: () => void }) {
  /* Where Back / Cancel lands — the listing or workspace page the user started on */
  const home: Home = entry === 'apply' || entry === 'lost' || entry === 'amend' ? 'listing' : entry === 'companyApply' ? 'company' : entry;
  const [companyRows, setCompanyRows] = useState<PassRow[]>(COMPANY_ROWS);
  const [approvals, setApprovals] = useState<ApprovalRow[]>(APPROVAL_ROWS);
  const [decide, setDecide] = useState<{ row: ApprovalRow; decision: Decision } | null>(null);
  const [rows, setRows] = useState<PassRow[]>(PASS_ROWS);
  const [drafts, setDrafts] = useState<DraftRow[]>(DRAFT_ROWS);
  const [step, setStep] = useState<Step>(() => {
    if (entry === 'apply') return { kind: 'apply', initial: EMPTY_FORM };
    if (entry === 'lost') return { kind: 'lost', pass: SAMPLE_PASS };
    if (entry === 'amend') return { kind: 'amend', pass: SAMPLE_PASS, initial: EMPTY_FORM };
    if (entry === 'companyApply') return { kind: 'companyApply', initial: EMPTY_COMPANY_FORM };
    return { kind: entry };
  });
  const [toast, setToast] = useState<string | null>(null);
  const [delDraft, setDelDraft] = useState<DraftRow | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const toHome = () => setStep({ kind: home });
  const homeCrumb = { label: HOME_LABEL[home], onClick: toHome };
  const dropDraft = (id?: string) => { if (id) setDrafts(d => d.filter(x => x.id !== id)); };

  const submitted = (f: PassForm | null, base: PassDetail, crumb: string, amount = PASS_FEE, draftId?: string) => {
    const appNo = newAppNo();
    const pass: PassDetail = {
      ...base, applicationNo: appNo, passRefNo: '--', status: 'Under Review', amount,
      ...(f ? {
        port: f.portName ? `${f.portName}${f.portName === 'Jebel Ali' ? ' Port' : ''}` : base.port,
        entryGate: f.entryGate || base.entryGate, passType: f.passType || base.passType,
        passDuration: f.passDuration || base.passDuration, purpose: f.purpose || base.purpose,
        dateOfVisit: isoToDisplay(f.dateOfVisit) || base.dateOfVisit, hostCompany: f.hostCompany || base.hostCompany,
      } : {}),
    };
    setRows(prev => [{
      passRefNo: appNo, applicationNo: appNo, portName: (f?.portName || base.port).replace(' Port', ''),
      passType: f?.passType || 'Permanent', passDuration: f?.passDuration || 'One Month',
      visitorName: `${VISITOR.firstName} ${VISITOR.lastName}`, status: 'Pending', approver: '--', hostCompany: 'Host Company', createdOn: today(),
    }, ...prev]);
    dropDraft(draftId);
    setStep({ kind: 'success', appNo, amount, pass, crumb });
  };

  const saveDraft = (f: PassForm, draftId?: string) => {
    const refId = `DFT${10231 + drafts.length + 1}`;
    setDrafts(prev => [{ id: draftId ?? `n${Date.now()}`, refId, serviceType: 'Gate Pass', createdOn: today(), expiresOn: inOneMonth(), form: f },
      ...prev.filter(d => d.id !== draftId)]);
    setToast(`Saved as draft ${refId}`);
    toHome();
  };

  const fetchOld = (ref: string): PassForm => {
    const row = rows.find(r => r.passRefNo === ref || r.applicationNo === ref);
    setToast(`Pass details fetched from ${ref}`);
    return formFromDetail(row ? detailFromRow(row) : SAMPLE_PASS);
  };

  const onRowAction = (a: RowMenuAction, r: PassRow) => {
    const pass = detailFromRow(r);
    if (a === 'view') setStep({ kind: 'view', pass });
    else if (a === 'edit') setStep({ kind: 'apply', initial: formFromDetail(pass), title: 'Edit Pass' });
    else if (a === 'renew') setStep({ kind: 'renew', initial: { ...formFromDetail(pass), hostCompany: 'Host Company 1' } });
    else if (a === 'lost') setStep({ kind: 'lost', pass: { ...pass, status: 'Completed' } });
    else if (a === 'printPass') setToast(`Printing pass ${r.passRefNo}`);
    else setToast(`Receipt for ${r.applicationNo} downloaded`);
  };

  /* ── Company ── */
  const companySubmit = (f: CompanyForm, draftId?: string) => {
    const appNo = newAppNo();
    const vs = f.visitors.length ? f.visitors : [];
    const port = f.access === 'zone' ? (f.zone || 'Zone 1') : (f.portName || 'Jebel Ali');
    const visitors: RequestVisitor[] = vs.length
      ? vs.map((v, i) => ({ passRefNo: String(7725068610 + i * 13), port, passType: f.passType || 'Visitor', passDuration: f.passDuration || 'One Day',
          name: `${v.firstName} ${v.lastName}`, visaType: v.visaType, dob: isoToDisplay(v.dob) || v.dob || '21-Jan-1996', gender: v.gender || 'Male', company: v.companyName }))
      : visitorsFromRow(COMPANY_ROWS[0]);
    const amount = money(Number(perPass(f.passDuration)) * Math.max(1, vs.length));
    const pass: PassDetail = {
      ...SAMPLE_PASS, applicationNo: appNo, passRefNo: '--', status: 'Under Review', amount: f.passDuration ? amount : PASS_FEE,
      port, entryGate: f.entryGate || 'Gate 1', passType: f.passType || 'Visitor', passDuration: f.passDuration || 'One Day',
      purpose: f.purpose || 'Training', dateOfVisit: isoToDisplay(f.dateOfVisit) || today(), hostCompany: f.hostCompany || 'Host Company 1',
    };
    setCompanyRows(prev => [...visitors.map(v => ({
      passRefNo: appNo, applicationNo: appNo, portName: v.port, passType: v.passType, passDuration: v.passDuration, visitorName: v.name,
      status: 'Pending' as const, approver: '--', hostCompany: pass.hostCompany, createdOn: today(),
    })).slice(0, 1), ...prev]);
    dropDraft(draftId);
    setStep({ kind: 'success', appNo, amount: pass.amount, pass, crumb: 'Apply New Pass', visitors });
  };
  const companyDraft = (f: CompanyForm, draftId?: string) => {
    const id = draftId ?? `c${Date.now()}`;
    const draftNo = newAppNo();
    setDrafts(prev => [{ id, refId: `DFT${10231 + prev.length + 1}`, serviceType: 'Gate Pass', createdOn: today(), expiresOn: inOneMonth(), companyForm: f },
      ...prev.filter(d => d.id !== id)]);
    setStep({ kind: 'draftSaved', draftNo, form: f, draftId: id });
  };
  const onCompanyAction = (a: RowMenuAction, r: PassRow) => {
    if (a === 'view') setStep({ kind: 'companyView', pass: { ...detailFromRow(r), status: r.status === 'Approved' ? 'Completed' : r.status }, visitors: visitorsFromRow(r), created: r.createdOn });
    else if (a === 'edit') setStep({ kind: 'companyApply', initial: { ...EMPTY_COMPANY_FORM, portName: PASS_ROWS[0].portName, passType: r.passType, passDuration: r.passDuration } });
    else onRowAction(a, r);
  };

  const openDraft = (d: DraftRow) => {
    if (d.companyForm) { setStep({ kind: 'companyApply', initial: d.companyForm, draftId: d.id }); return; }
    if (d.serviceType === 'Report Lost Pass') setStep({ kind: 'lost', pass: SAMPLE_PASS, draftId: d.id });
    else if (d.serviceType === 'Return Pass for Amendment') setStep({ kind: 'amend', pass: SAMPLE_PASS, initial: formFromDetail(SAMPLE_PASS), draftId: d.id });
    else setStep({ kind: 'apply', initial: d.form ?? formFromDetail(SAMPLE_PASS), title: 'Apply New Pass', draftId: d.id });
  };

  const finishDecision = ({ row, decision }: { row: ApprovalRow; decision: Decision }) => {
    const status = decision === 'approve' ? 'Approved' : decision === 'reject' ? 'Rejected' : 'Returned';
    setApprovals(prev => prev.map(r => (r.passRefNo === row.passRefNo ? { ...r, status } : r)));
    setDecide(null);
    setStep({ kind: 'decision', row: { ...row, status }, decision, date: today() });
  };

  let page: JSX.Element;
  switch (step.kind) {
    case 'listing':
      page = <PassListingPage rows={rows} onHome={onClose} onApply={() => setStep({ kind: 'apply', initial: EMPTY_FORM })} onAction={onRowAction} />;
      break;
    case 'drafts':
      page = <DraftsPage rows={drafts} onHome={onClose} onEdit={openDraft} onDelete={setDelDraft} />;
      break;
    case 'approved':
      page = <ApprovedPassesPage rows={APPROVED_ROWS} onHome={onClose} onView={r => setStep({ kind: 'view', pass: { ...detailFromRow(r), status: 'Completed' } })} />;
      break;
    case 'requests':
      page = <MyRequestsPage rows={rows} onHome={onClose} onView={r => setStep({ kind: 'view', pass: detailFromRow(r) })} />;
      break;
    case 'receipts':
      page = <PaymentReceiptsPage rows={RECEIPT_ROWS} onHome={onClose} onDownload={r => setToast(`Receipt ${r.receiptNo} downloaded`)} />;
      break;
    case 'company':
      page = <CompanyListingPage rows={companyRows} onHome={onClose} onApply={() => setStep({ kind: 'companyApply', initial: EMPTY_COMPANY_FORM })} onAction={onCompanyAction} />;
      break;
    case 'companyApply':
      page = (
        <CompanyApplyPage key={step.draftId ?? 'new'} initial={step.initial} crumbs={[homeCrumb]} onHome={onClose} onCancel={toHome}
          onSaveDraft={f => companyDraft(f, step.draftId)} onSubmit={f => companySubmit(f, step.draftId)}
          onFetchOld={r => { setToast(`Pass details fetched from ${r}`); return { portName: 'Jebel Ali', entryGate: 'Gate 1', passType: 'Visitor', passDuration: 'One Day', purpose: 'Training', hostCompany: 'Host Company 1' }; }} />
      );
      break;
    case 'draftSaved':
      page = (
        <DraftSavedPage draftNo={step.draftNo} created={today()} validTill={inOneMonth()} crumbs={[homeCrumb]} onHome={onClose}
          onBackToPasses={toHome} onViewDrafts={() => setStep({ kind: 'drafts' })}
          onEdit={() => setStep({ kind: 'companyApply', initial: step.form, draftId: step.draftId })} />
      );
      break;
    case 'companyView':
      page = (
        <CompanyRequestPage pass={step.pass} visitors={step.visitors} created={step.created} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome}
          onPrintReceipt={() => setToast(`Receipt for ${step.pass.applicationNo} downloaded`)} />
      );
      break;
    case 'approvals':
      page = <PassApprovalsPage rows={approvals} onHome={onClose} onOpen={row => setStep({ kind: 'approvalView', row })} />;
      break;
    case 'approvalView':
      page = (
        <ApprovalDetailsPage row={step.row} pass={{ ...SAMPLE_PASS, passRefNo: step.row.passRefNo }} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome}
          onDecide={decision => setDecide({ row: step.row, decision })} />
      );
      break;
    case 'decision':
      page = <DecisionResultPage decision={step.decision} row={step.row} date={step.date} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome} />;
      break;
    case 'view':
      page = (
        <ViewPassPage pass={step.pass} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome}
          onReuse={() => setStep({ kind: 'apply', initial: formFromDetail(step.pass) })}
          onPrint={() => setToast(`Printing pass ${step.pass.passRefNo === '--' ? step.pass.applicationNo : step.pass.passRefNo}`)} />
      );
      break;
    case 'apply':
      page = (
        <ApplyPassPage key={JSON.stringify(step.initial) + (step.title ?? '')} initial={step.initial} title={step.title} crumbs={[homeCrumb]} onHome={onClose}
          onCancel={toHome} onSaveDraft={f => saveDraft(f, step.draftId)} onFetchOld={fetchOld}
          onSubmit={f => submitted(f, SAMPLE_PASS, step.title ?? 'Apply New Pass', PASS_FEE, step.draftId)} />
      );
      break;
    case 'amend':
      page = (
        <AmendPassPage pass={step.pass} initial={step.initial} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome}
          onSubmit={f => submitted(f, step.pass, 'Return Pass for Amendment', PASS_FEE, step.draftId)} />
      );
      break;
    case 'renew':
      page = <RenewPassPage initial={step.initial} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome} onSubmit={f => submitted(f, SAMPLE_PASS, 'Renew Pass')} />;
      break;
    case 'lost':
      page = <ReportLostPage pass={step.pass} crumbs={[homeCrumb]} onHome={onClose} onBack={toHome} onSubmit={() => submitted(null, step.pass, 'Report Lost Pass', REISSUE_FEE, step.draftId)} />;
      break;
    case 'success':
      page = (
        <SuccessPage appNo={step.appNo} created={today()} amount={step.amount} crumbs={[homeCrumb, { label: step.crumb }]} onHome={onClose}
          onView={() => setStep(step.visitors ? { kind: 'companyView', pass: step.pass, visitors: step.visitors, created: today() } : { kind: 'view', pass: step.pass })}
          onPrintReceipt={() => setToast(`Receipt for ${step.appNo} downloaded`)}
          onBackToPasses={() => setStep({ kind: step.visitors ? 'company' : 'listing' })} />
      );
      break;
  }

  return (
    <>
      {page}
      {delDraft && (
        <ConfirmDelete what={`draft ${delDraft.refId}`} onNo={() => setDelDraft(null)}
          onYes={() => { setDrafts(d => d.filter(x => x.id !== delDraft.id)); setToast(`Draft ${delDraft.refId} deleted`); setDelDraft(null); }} />
      )}
      {decide?.decision === 'approve' && <ApproveModal onClose={() => setDecide(null)} onConfirm={() => finishDecision(decide)} />}
      {decide?.decision === 'reject' && <RejectModal onClose={() => setDecide(null)} onConfirm={() => finishDecision(decide)} />}
      {decide?.decision === 'return' && <ReturnModal onClose={() => setDecide(null)} onConfirm={() => finishDecision(decide)} />}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </>
  );
}
