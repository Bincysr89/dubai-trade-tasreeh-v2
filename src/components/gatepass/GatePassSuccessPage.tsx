import type { ReactNode } from 'react';
import { font, GatePage, GTag, NeedHelp, PrimaryBtn, SecondaryBtn } from './GateFields';
import { DhAmount } from '../Dh';
import { GATE_PASS_FORM_TITLE } from './gatePassData';

type Props = {
  /** Page title — defaults to the Gate Pass service. */
  title?: string;
  crumb?: string;
  heading?: string;
  applicationNo: string;
  createdDate: string;
  /** Omit for services without a fee (Delegation Visits). */
  amount?: string;
  showPrint?: boolean;
  onHome: () => void;
  onBackToListing: () => void;
  onViewRequest: () => void;
  /** Prototype hook — returns to the form with the PAYMENT FAILED banner. */
  onPaymentFailed?: () => void;
};

/* Submission confirmation (Figma 4:28349) */
export default function GatePassSuccessPage({
  title = GATE_PASS_FORM_TITLE, crumb, heading = 'Your Request Submitted Successfully',
  applicationNo, createdDate, amount, showPrint = true, onHome, onBackToListing, onViewRequest, onPaymentFailed,
}: Props) {
  const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="grid grid-cols-[182px_1fr] items-center gap-[8px]">
      <span className="text-[18px] text-[#575757]" style={{ fontFamily: font }}>{label} :</span>
      <span className="text-[18px] text-[#1a1a1a]" style={{ fontFamily: font }}>{children}</span>
    </div>
  );

  return (
    <GatePage title={title} crumb={crumb} titleExtra={<NeedHelp />} onHome={onHome} onListing={onBackToListing}>
      <div className="bg-white rounded-[8px] py-[100px] px-[24px] flex flex-col items-center"
        style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <span className="size-[75px] rounded-full flex items-center justify-center mb-[34px]" style={{ background: '#3cc35a' }}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#fff" strokeWidth="2.4">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>

        <h2 className="text-[30px] font-medium text-[#3ca865] mb-[18px] text-center" style={{ fontFamily: font }}>{heading}</h2>

        <div className="flex flex-col gap-[12px] mb-[30px]">
          <Row label="Application Number">{applicationNo}</Row>
          <Row label="Created Date">{createdDate}</Row>
          <Row label="Status"><GTag label="Under Review" tone="amber" /></Row>
          {amount && <Row label="Paid Amount"><DhAmount value={amount} className="font-bold" /></Row>}
        </div>

        <div className="flex items-center gap-[20px] flex-wrap justify-center">
          <SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>
          {showPrint ? <SecondaryBtn onClick={onViewRequest}>View Request</SecondaryBtn> : <PrimaryBtn onClick={onViewRequest}>View Request</PrimaryBtn>}
          {showPrint && <PrimaryBtn onClick={() => window.print()}>Print Receipt</PrimaryBtn>}
        </div>
        {onPaymentFailed && (
          <button onClick={onPaymentFailed} className="mt-[18px] text-[16px] text-[#c0392b] underline hover:opacity-80"
            style={{ fontFamily: font }}>
            Simulate Payment Failed
          </button>
        )}
      </div>
    </GatePage>
  );
}

/* ── Draft saved confirmation (Figma 1005:29549) ── */
export function GatePassDraftSavedPage({ title = GATE_PASS_FORM_TITLE, crumb, backLabel = 'Back to Passes', draftNo, createdDate, validTill, onHome, onBackToPasses, onViewDrafts, onEdit }: {
  title?: string; crumb?: string; backLabel?: string; draftNo: string; createdDate: string; validTill: string;
  onHome: () => void; onBackToPasses: () => void; onViewDrafts: () => void; onEdit: () => void;
}) {
  const Row = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="grid grid-cols-[150px_1fr] items-center gap-[8px]">
      <span className="text-[18px] text-[#575757]" style={{ fontFamily: font }}>{label} :</span>
      <span className="text-[18px] text-[#1a1a1a]" style={{ fontFamily: font }}>{children}</span>
    </div>
  );
  return (
    <GatePage title={title} crumb={crumb} titleExtra={<NeedHelp />} onHome={onHome} onListing={onBackToPasses}>
      <div className="bg-white rounded-[8px] py-[70px] px-[24px] flex flex-col items-center"
        style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <span className="size-[75px] rounded-full flex items-center justify-center mb-[30px]" style={{ background: '#3cc35a' }}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#fff" strokeWidth="2.4">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <h2 className="text-[30px] font-medium text-[#3ca865] mb-[16px] text-center" style={{ fontFamily: font }}>Draft Saved Successfully</h2>
        <div className="text-[16px] text-[#1a1a1a] text-center leading-[27px] mb-[18px] max-w-[880px]" style={{ fontFamily: font }}>
          <p>Kindly note that you are saving the request and PCFC security will not receive this request until complete all information and submit.</p>
          <p>The period for saving the request as draft is only 1 month, after that the draft version will be deleted automatic if not submitted.</p>
        </div>
        <div className="flex flex-col gap-[10px] mb-[28px]">
          <Row label="Draft Number">{draftNo}</Row>
          <Row label="Created Date">{createdDate}</Row>
          <Row label="Valid Till">{validTill}</Row>
        </div>
        <div className="flex items-center gap-[20px] flex-wrap justify-center">
          <SecondaryBtn onClick={onBackToPasses}>{backLabel}</SecondaryBtn>
          <PrimaryBtn onClick={onViewDrafts}>View All Drafts</PrimaryBtn>
        </div>
        <button onClick={onEdit} className="mt-[22px] text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 600 }}>
          Edit Pass
        </button>
      </div>
    </GatePage>
  );
}
