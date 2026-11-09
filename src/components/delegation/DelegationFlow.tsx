import { useCallback, useState } from 'react';
import DelegationListingPage from './DelegationListingPage';
import DelegationStartPage from './DelegationStartPage';
import DelegationFormPage from './DelegationFormPage';
import DelegationViewPage from './DelegationViewPage';
import GatePassSuccessPage, { GatePassDraftSavedPage } from '../gatepass/GatePassSuccessPage';
import { CancelRequestModal, Toast } from '../gatepass/GatePassModals';
import {
  DELEGATION_ROWS, DRAFT_ROWS, DELEGATION_TITLE, EMPTY_FORM,
  type DelegationRow, type DelegationForm, type DelegationAction,
} from './delegationData';

type Props = { onClose: () => void };

type Step =
  | { kind: 'listing'; drafts?: boolean }
  | { kind: 'start' }
  | { kind: 'form'; initial: DelegationForm }
  | { kind: 'success'; row: DelegationRow }
  | { kind: 'draftSaved'; row: DelegationRow }
  | { kind: 'view'; row: DelegationRow };

const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
const today = () => fmt(new Date());
const inOneMonth = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return fmt(d); };

/**
 * Tasreeh — Delegation Visits. Same structure, layout and components as the Gate Pass flow:
 * Listing → Create (start page) → Form → Submit → Success → View Request,
 * Save As Drafts → Draft Saved, and the View / Cancel Request row actions.
 */
export default function DelegationFlow({ onClose }: Props) {
  const [step, setStep] = useState<Step>({ kind: 'listing' });
  const [rows, setRows] = useState<DelegationRow[]>(DELEGATION_ROWS);
  const [drafts, setDrafts] = useState<DelegationRow[]>(DRAFT_ROWS);
  const [cancelRow, setCancelRow] = useState<DelegationRow | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const clearToast = useCallback(() => setToast(null), []);

  const toListing = (showDrafts = false) => setStep({ kind: 'listing', drafts: showDrafts });

  const submit = (form: DelegationForm) => {
    const row: DelegationRow = { applicationNo: `123545648${900 + rows.length}`, createdOn: today(), status: 'Under Review', form };
    setRows(prev => [row, ...prev]);
    setStep({ kind: 'success', row });
  };
  const saveDraft = (form: DelegationForm) => {
    const row: DelegationRow = { applicationNo: `123545648${700 + drafts.length}`, createdOn: today(), status: 'Draft', form };
    setDrafts(prev => [row, ...prev]);
    setStep({ kind: 'draftSaved', row });
  };
  const cancel = (row: DelegationRow) => {
    setRows(prev => prev.map(r => (r.applicationNo === row.applicationNo ? { ...r, status: 'Cancelled' } : r)));
    setToast(`Request ${row.applicationNo} cancelled`);
    setCancelRow(null);
    if (step.kind === 'view') setStep({ kind: 'view', row: { ...row, status: 'Cancelled' } });
  };

  const onAction = (a: DelegationAction, row: DelegationRow) => {
    if (a === 'View Request') setStep({ kind: 'view', row });
    else setCancelRow(row);
  };

  let page: JSX.Element;
  switch (step.kind) {
    case 'start':
      page = <DelegationStartPage onHome={onClose} onBackToListing={() => toListing()} onProceed={() => setStep({ kind: 'form', initial: EMPTY_FORM })} />;
      break;
    case 'form':
      page = (
        <DelegationFormPage
          initial={step.initial}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onSubmit={submit}
          onSaveDraft={saveDraft}
        />
      );
      break;
    case 'success': {
      const s = step;
      page = (
        <GatePassSuccessPage
          title={DELEGATION_TITLE}
          crumb={DELEGATION_TITLE}
          applicationNo={s.row.applicationNo}
          createdDate={s.row.createdOn}
          showPrint={false}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onViewRequest={() => setStep({ kind: 'view', row: s.row })}
        />
      );
      break;
    }
    case 'draftSaved': {
      const s = step;
      page = (
        <GatePassDraftSavedPage
          title={DELEGATION_TITLE}
          crumb={DELEGATION_TITLE}
          backLabel="Back to Listing"
          draftNo={s.row.applicationNo}
          createdDate={s.row.createdOn}
          validTill={inOneMonth()}
          onHome={onClose}
          onBackToPasses={() => toListing()}
          onViewDrafts={() => toListing(true)}
          onEdit={() => setStep({ kind: 'form', initial: s.row.form })}
        />
      );
      break;
    }
    case 'view': {
      const s = step;
      page = (
        <DelegationViewPage
          row={s.row}
          onHome={onClose}
          onBackToListing={() => toListing()}
          onCancelRequest={() => setCancelRow(s.row)}
        />
      );
      break;
    }
    default:
      page = (
        <DelegationListingPage
          key={step.drafts ? 'drafts' : 'list'}
          rows={rows}
          drafts={drafts}
          initialShowDrafts={step.drafts}
          onClose={onClose}
          onCreate={() => setStep({ kind: 'start' })}
          onAction={onAction}
          onOpenDraft={row => setStep({ kind: 'form', initial: row.form })}
        />
      );
  }

  return (
    <>
      {page}
      {cancelRow && (
        <CancelRequestModal
          appNo={cancelRow.applicationNo}
          subject="Delegation visit request"
          note="PCFC Security will be notified that the visit will not take place."
          onClose={() => setCancelRow(null)}
          onConfirm={() => cancel(cancelRow)}
        />
      )}
      {toast && <Toast message={toast} onDone={clearToast} />}
    </>
  );
}
