import { useCallback, useEffect, useState } from 'react';
import GatePassListingPage from './GatePassListingPage';
import GatePassStartPage from './GatePassStartPage';
import GatePassFormPage from './GatePassFormPage';
import { GatePassViewPage, GatePassPassPage, GatePassReportLostPage } from './GatePassViewPages';
import GatePassSuccessPage, { GatePassDraftSavedPage } from './GatePassSuccessPage';
import { GatePassPreviewModal, CancelRequestModal, Toast } from './GatePassModals';
import {
  HostPassDetailsPage, HostViewPassPage, HostDecisionPage, ApproveConfirmModal, RejectModal, ReturnModal,
  HOST_ALL_VARIANT, HOST_APPROVALS_VARIANT, type Decision,
} from './HostGatePassPages';
import { IndividualPassFormPage, AmendPassPage, DeleteDraftModal, INDIVIDUAL_VARIANT } from './IndividualGatePassPages';
import { getPersona, type Persona } from '../../persona';
import {
  setBannerProfile, GATE_ROWS, DRAFT_ROWS, HOST_ROWS, APPROVAL_ROWS, INDIVIDUAL_ROWS, INDIVIDUAL_DRAFTS, individualVisitor, GATE_PASS_FORM_TITLE, EMPTY_FORM, REISSUE_FEE, PASS_FEE, ZONE_PORTS,
  formFromRow, shortRef, fromIso, perPassAmount, money,
  type GateRow, type GateStatus, type GatePassForm, type RowAction, type Visitor, type PassCategory,
} from './gatePassData';

type Props = {
  /** Return to whatever opened the service (Supplier catalogue). */
  onClose: () => void;
  /** Gate pass profile chosen by a company user (Individual / Company); defaults to the signed-in persona. */
  profile?: Persona;
};

type Step =
  | { kind: 'listing'; drafts?: boolean }
  | { kind: 'start'; mode?: 'old' | 'new' }
  | { kind: 'form'; initial: GatePassForm; title?: string; paymentFailed?: boolean }
  | { kind: 'view'; row: GateRow }
  | { kind: 'pass'; row: GateRow; visitor?: Visitor; backToView: boolean }
  | { kind: 'lost'; row: GateRow }
  | { kind: 'success'; row: GateRow; amount: string; heading?: string; form?: GatePassForm }
  | { kind: 'draftSaved'; row: GateRow; form: GatePassForm }
  /* Host Company persona */
  | { kind: 'hostReview'; row: GateRow; reviewable: boolean }
  | { kind: 'hostDecision'; row: GateRow; decision: Decision; date: string }
  | { kind: 'hostPass'; row: GateRow }
  /* Individual persona */
  | { kind: 'amend'; row: GateRow };

type HostTab = 'all' | 'approvals';

const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
const today = () => fmt(new Date());
const inOneMonth = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return fmt(d); };

/**
 * Tasreeh — Gate Passes.
 * Listing → Create (old pass / new pass + pass category) → Apply Pass form (port or zone access,
 * visitor search → confirm → add) → Submit → Success | Payment Failed, Save as Draft → Draft Saved,
 * plus row actions: View Request, Report Lost Pass, Renew Pass, Cancel Request, View Gate Pass, Print Pass.
 */
export default function GatePassFlow({ onClose, profile }: Props) {
  const [persona] = useState<Persona>(() => { const p = profile ?? getPersona(); setBannerProfile(p); return p; });
  useEffect(() => { setBannerProfile(persona); return () => setBannerProfile(null); }, [persona]);
  const [step, setStep] = useState<Step>({ kind: 'listing' });
  const [rows, setRows] = useState<GateRow[]>(() => {
    const p = persona;
    return p === 'host-company' ? HOST_ROWS : p === 'individual' ? INDIVIDUAL_ROWS : GATE_ROWS;
  });
  const [drafts, setDrafts] = useState<GateRow[]>(() => (persona === 'individual' ? INDIVIDUAL_DRAFTS : DRAFT_ROWS));
  /* Visitors captured on the form, per application, for the View Pass table. */
  const [visitorsByApp, setVisitorsByApp] = useState<Record<string, Visitor[]>>({});
  const [formByDraft, setFormByDraft] = useState<Record<string, GatePassForm>>({});
  const [preview, setPreview] = useState<GateRow | null>(null);
  const [cancelRow, setCancelRow] = useState<GateRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  /* Host Company persona: All Requests + Pass Approvals tabs */
  const isHost = persona === 'host-company';
  /* Individual (UAE PASS basic account): applies for themselves, prefilled from the profile */
  const isIndividual = persona === 'individual';
  const [deleteDraft, setDeleteDraft] = useState<GateRow | null>(null);
  const [hostTab, setHostTab] = useState<HostTab>('all');
  const [approvalRows, setApprovalRows] = useState<GateRow[]>(APPROVAL_ROWS);
  const [modal, setModal] = useState<{ kind: 'approve' | 'reject' | 'return'; row: GateRow } | null>(null);

  const toListing = (showDrafts = false) => setStep({ kind: 'listing', drafts: showDrafts });
  const toApprovals = () => { setHostTab('approvals'); setStep({ kind: 'listing' }); };

  const decide = (row: GateRow, decision: Decision) => {
    setApprovalRows(prev => prev.map(r => r.passRefNo === row.passRefNo ? { ...r, status: decision } : r));
    setModal(null);
    setStep({ kind: 'hostDecision', row: { ...row, status: decision }, decision, date: today() });
  };

  /* Turn the form into a listing row (first visitor names the row). */
  const rowFromForm = (f: GatePassForm, status: GateStatus, seq: number): GateRow => {
    const v = f.visitors[0];
    const base = rows[0];
    return {
      ...base,
      applicationNo: `123545648${seq}`,
      passRefNo: status === 'Draft' ? '-' : `GP-${121324 + seq}`,
      portName: f.category === 'zone' ? (f.zone ? `${f.zone} (${(ZONE_PORTS[f.zone] ?? []).join(', ')})` : '-') : f.portName || '-',
      entryGate: f.entryGate || '-',
      passType: f.passType || '-',
      passDuration: f.passDuration || '-',
      purpose: f.purpose || '-',
      dateOfVisit: fromIso(f.dateOfVisit) || today(),
      /* No visitor added (validation is off) — keep the sample visitor so the views stay populated. */
      visitorTitle: v?.title || base.visitorTitle,
      visitorFirst: v?.firstName || base.visitorFirst,
      visitorLast: v?.lastName || base.visitorLast,
      visitorName: v ? `${v.firstName} ${v.lastName}`.trim() || base.visitorName : base.visitorName,
      visaType: v?.visaType || base.visaType,
      companyName: v?.companyName || base.companyName,
      vehicleNo: v?.vehicleNo || base.vehicleNo,
      hostCompany: f.hostCompany,
      submittedDate: today(),
      approver: status === 'Draft' ? '-' : 'DP World Security',
      status,
    };
  };

  const submitForm = (f: GatePassForm) => {
    const row = isHost || isIndividual
      ? { ...rowFromForm(f, 'Pending', 900 + rows.length), accessType: f.category === 'zone' ? 'Zone' : 'Port', approver: '--' }
      : rowFromForm(f, 'Under Review', 900 + rows.length);
    setRows(prev => [row, ...prev]);
    setVisitorsByApp(prev => ({ ...prev, [row.applicationNo]: f.visitors }));
    const total = perPassAmount(f.passType, f.passDuration) * Math.max(1, f.visitors.length);
    setStep({ kind: 'success', row, amount: money(total), form: f });
  };

  const saveDraft = (f: GatePassForm) => {
    const row = rowFromForm(f, 'Draft', 700 + drafts.length);
    setDrafts(prev => [row, ...prev]);
    setFormByDraft(prev => ({ ...prev, [row.applicationNo]: f }));
    setStep({ kind: 'draftSaved', row, form: f });
  };

  const newForm = (category: PassCategory): GatePassForm =>
    ({ ...EMPTY_FORM, category, entryGate: category === 'zone' ? 'Any Gate' : '', ...(isIndividual ? { hostCompany: '', visitors: [individualVisitor()] } : {}) });
  const isDraft = (row: GateRow) => drafts.some(d => d.applicationNo === row.applicationNo);
  const openDraft = (row: GateRow) => setStep({ kind: 'form', initial: formByDraft[row.applicationNo] ?? formFromRow(row) });

  const onAction = (a: string, row: GateRow) => {
    switch (a) {
      case 'View Request':     setStep({ kind: 'view', row }); break;
      case 'Report Lost Pass': setStep({ kind: 'lost', row }); break;
      case 'Renew Pass':       setStep({ kind: 'form', initial: formFromRow(row), title: `Renew Request - ${shortRef(row)}` }); break;
      case 'Cancel Request':   setCancelRow(row); break;
      case 'View Gate Pass':   setStep({ kind: 'pass', row, backToView: false }); break;
      case 'Print Pass':       setPreview(row); break;
      /* Host Company — All Requests flyout (Figma 1347:50348) + Pass Approvals icons */
      case 'View':               setStep(hostTab === 'approvals' ? { kind: 'hostReview', row, reviewable: false } : { kind: 'hostPass', row }); break;
      case 'Review':             setStep({ kind: 'hostReview', row, reviewable: true }); break;
      case 'Edit':
        if (isDraft(row)) openDraft(row);
        else setStep({ kind: 'form', initial: formFromRow(row), title: `Edit Request - ${shortRef(row)}` });
        break;
      case 'Delete':             setDeleteDraft(row); break;
      case 'Amend Pass':         setStep({ kind: 'amend', row }); break;
      case 'Reuse Pass Details': setStep({ kind: 'form', initial: formFromRow(row) }); break;
      case 'Print Receipt':      window.print(); break;
    }
  };

  const overlays = (
    <>
      {preview && <GatePassPreviewModal row={preview} onClose={() => setPreview(null)} />}
      {cancelRow && (
        <CancelRequestModal appNo={cancelRow.applicationNo} subject={`Gate pass request for ${cancelRow.visitorName}`} onClose={() => setCancelRow(null)}
          onConfirm={() => {
            setRows(prev => prev.map(r => r.applicationNo === cancelRow.applicationNo ? { ...r, status: 'Cancelled' } : r));
            setToast(`Request ${cancelRow.applicationNo} cancelled`);
            setCancelRow(null);
          }} />
      )}
      {modal?.kind === 'approve' && <ApproveConfirmModal onClose={() => setModal(null)} onConfirm={() => decide(modal.row, 'Approved')} />}
      {modal?.kind === 'reject' && <RejectModal onClose={() => setModal(null)} onConfirm={() => decide(modal.row, 'Rejected')} />}
      {modal?.kind === 'return' && <ReturnModal onClose={() => setModal(null)} onConfirm={() => decide(modal.row, 'Returned')} />}
      {deleteDraft && (
        <DeleteDraftModal draftNo={deleteDraft.applicationNo} onClose={() => setDeleteDraft(null)}
          onConfirm={() => {
            setDrafts(prev => prev.filter(d => d.applicationNo !== deleteDraft.applicationNo));
            setToast(`Draft ${deleteDraft.applicationNo} deleted`);
            setDeleteDraft(null);
          }} />
      )}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </>
  );

  let page: JSX.Element;
  switch (step.kind) {
    case 'start':
      page = (
        <GatePassStartPage
          key={step.mode ?? 'new'}
          initialMode={step.mode}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onApplyFromOld={row => setStep({ kind: 'form', initial: formFromRow(row) })}
          onCreateNew={c => setStep({ kind: 'form', initial: newForm(c) })}
        />
      );
      break;

    case 'form':
      if (isIndividual) {
        page = (
          <IndividualPassFormPage
            key={`${step.title ?? 'create'}-${step.initial.category}`}
            title={step.title ?? GATE_PASS_FORM_TITLE}
            initial={step.initial}
            onHome={onClose}
            onBackToListing={() => toListing()}
            onSaveDraft={saveDraft}
            onSubmit={submitForm}
          />
        );
        break;
      }
      page = (
        <GatePassFormPage
          key={`${step.title ?? 'create'}-${step.paymentFailed ? 'failed' : 'ok'}-${step.initial.category}`}
          title={step.title ?? GATE_PASS_FORM_TITLE}
          initial={step.initial}
          paymentFailed={step.paymentFailed}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onSaveDraft={saveDraft}
          onSubmit={submitForm}
        />
      );
      break;

    case 'view':
      page = (
        <GatePassViewPage
          row={step.row}
          visitors={visitorsByApp[step.row.applicationNo]}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onPrint={() => window.print()}
          onOpenPass={visitor => setStep({ kind: 'pass', row: step.row, visitor, backToView: true })}
        />
      );
      break;

    case 'pass': {
      const s = step;
      page = (
        <GatePassPassPage
          row={s.row}
          visitor={s.visitor}
          onHome={onClose}
          onBack={() => (s.backToView ? setStep({ kind: 'view', row: s.row }) : toListing())}
          onReuse={() => setStep({ kind: 'form', initial: formFromRow(s.row) })}
          onPrint={() => setPreview(s.row)}
        />
      );
      break;
    }

    case 'lost':
      page = (
        <GatePassReportLostPage
          row={step.row}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onSubmit={() => {
            const row = { ...step.row, applicationNo: `123545648${900 + rows.length}`, status: 'Under Review' as GateStatus, submittedDate: today() };
            setRows(prev => [row, ...prev]);
            setStep({ kind: 'success', row, amount: REISSUE_FEE, heading: 'Your Lost Pass Report Submitted Successfully' });
          }}
        />
      );
      break;

    case 'success': {
      const s = step;
      page = (
        <GatePassSuccessPage
          heading={s.heading}
          applicationNo={s.row.applicationNo}
          createdDate={today()}
          amount={s.amount}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onViewRequest={() => setStep({ kind: 'view', row: s.row })}
          onPaymentFailed={s.form ? () => {
            /* The payment did not go through — the request goes back to the form, unsubmitted. */
            setRows(prev => prev.filter(r => r.applicationNo !== s.row.applicationNo));
            setStep({ kind: 'form', initial: s.form!, paymentFailed: true });
          } : undefined}
        />
      );
      break;
    }

    case 'draftSaved':
      page = (
        <GatePassDraftSavedPage
          draftNo={step.row.applicationNo}
          createdDate={today()}
          validTill={inOneMonth()}
          onHome={onClose}
          onBackToPasses={() => toListing()}
          onViewDrafts={() => toListing(true)}
          onEdit={() => setStep({ kind: 'form', initial: step.form })}
        />
      );
      break;

    case 'hostReview': {
      const s = step;
      page = (
        <HostPassDetailsPage
          row={s.row}
          reviewable={s.reviewable}
          onHome={onClose}
          onBack={toApprovals}
          onReturn={() => setModal({ kind: 'return', row: s.row })}
          onReject={() => setModal({ kind: 'reject', row: s.row })}
          onApprove={() => setModal({ kind: 'approve', row: s.row })}
        />
      );
      break;
    }

    case 'amend': {
      const s = step;
      page = (
        <AmendPassPage
          row={s.row}
          onHome={onClose}
          onBack={() => toListing()}
          onSubmit={() => {
            const row = { ...s.row, status: 'Pending' as GateStatus, submittedDate: today() };
            setRows(prev => prev.map(r => (r.applicationNo === s.row.applicationNo ? row : r)));
            setStep({ kind: 'success', row, amount: PASS_FEE, heading: 'Your Amended Pass Submitted Successfully' });
          }}
        />
      );
      break;
    }

    case 'hostDecision':
      page = <HostDecisionPage row={step.row} decision={step.decision} date={step.date} onHome={onClose} onBackToApprovals={toApprovals} />;
      break;

    case 'hostPass': {
      const s = step;
      page = (
        <HostViewPassPage
          row={s.row}
          onHome={onClose}
          onBack={() => toListing()}
          onReuse={() => setStep({ kind: 'form', initial: formFromRow(s.row) })}
          onPrint={() => setPreview(s.row)}
        />
      );
      break;
    }

    default:
      if (isIndividual) {
        page = (
          <GatePassListingPage
            key={step.drafts ? 'ind-drafts' : 'ind-passes'}
            variant={INDIVIDUAL_VARIANT}
            rows={rows}
            drafts={drafts}
            initialShowDrafts={step.drafts}
            onClose={onClose}
            onCreate={() => setStep({ kind: 'start' })}
            onAction={onAction}
            onOpenDraft={openDraft}
          />
        );
        break;
      }
      if (isHost) {
        const approvals = hostTab === 'approvals';
        page = (
          <GatePassListingPage
            key={`host-${hostTab}-${step.drafts ? 'drafts' : 'passes'}`}
            variant={approvals ? HOST_APPROVALS_VARIANT : HOST_ALL_VARIANT}
            tabs={[
              { key: 'all', label: 'All Requests', count: rows.length },
              { key: 'approvals', label: 'Pass Approvals', count: approvalRows.filter(r => r.status === 'Pending').length },
            ]}
            activeTab={hostTab}
            onTabChange={k => setHostTab(k as HostTab)}
            rows={approvals ? approvalRows : rows}
            drafts={drafts}
            initialShowDrafts={!approvals && step.drafts}
            onClose={onClose}
            onCreate={() => setStep({ kind: 'start' })}
            onAction={onAction}
            onOpenDraft={row => setStep({ kind: 'form', initial: formByDraft[row.applicationNo] ?? formFromRow(row) })}
          />
        );
        break;
      }
      page = (
        <GatePassListingPage
          key={step.drafts ? 'drafts' : 'passes'}
          rows={rows}
          drafts={drafts}
          initialShowDrafts={step.drafts}
          onClose={onClose}
          onCreate={() => setStep({ kind: 'start' })}
          onAction={onAction}
          onOpenDraft={row => setStep({ kind: 'form', initial: formByDraft[row.applicationNo] ?? formFromRow(row) })}
        />
      );
  }

  return <>{page}{overlays}</>;
}
