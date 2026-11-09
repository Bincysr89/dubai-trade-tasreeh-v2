import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';
import FloatingField from './FloatingField';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import type { ClaimType } from './ClaimTypeSelectionPage';
import ClaimStepper from './ClaimStepper';
import Dh from './Dh';

const CLAIM_TYPE_LABEL: Record<ClaimType, string> = {
  refundDeposit: 'Refund of Deposits',
  refundDuty:    'Refund of Duty',
  nonRemittance: 'Non Remittance',
  // Refund on Auction Proceed never reaches this page — it has its own dedicated flow.
  refundAuction: 'Refund on Auction Proceed',
};

type StepId = 'claim' | 'payment' | 'review';

const STEPS: { id: StepId; label: string }[] = [
  { id: 'claim',   label: 'Claim Details' },
  { id: 'payment', label: 'Payment Details' },
  { id: 'review',  label: 'Review Details' },
];

type Props = {
  claimType: ClaimType;
  declarationNo: string;
  refundType?: 'full' | 'partial' | 'no';
  onBack: () => void;
  onSubmit: () => void;
};

// Stepper now provided by shared ClaimStepper component.

/* ───────── Helpers ───────── */
const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-[12px]">
    <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{children}</p>
  </div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-[8px] px-[24px] py-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
    {children}
  </div>
);

const Field = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex flex-col gap-[4px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
    <span className="text-[16px] text-[#696f83]">{k}</span>
    <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{v}</span>
  </div>
);

/* ───────── Step 1: Claim Details ───────── */
function ClaimDetailsStep({
  values, setValues, claimType, declarationNo,
}: {
  values: any; setValues: (v: any) => void; claimType: ClaimType; declarationNo: string;
}) {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader>Declaration &amp; Claim Information</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[16px]">
          <Field k="Claim Type" v={CLAIM_TYPE_LABEL[claimType]} />
          <Field k="Declaration Number" v={declarationNo} />
          <Field k="Declaration Date" v="12/05/2024" />
          <Field k="Deposit Amount" v={<><Dh /> 1,000</>} />
          <Field k="Deposit Method" v="Cash" />
          <Field k="Claim Expiry" v="04/03/2025" />
        </div>
      </Card>

      <SectionHeader>Claim Amount Details</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Claim Amount" required value={values.claimAmount} onChange={(v) => setValues({ ...values, claimAmount: v })} placeholder="Enter Amount" />
          <FloatingField label="Currency" placeholder="AED" value={values.currency} onChange={(v) => setValues({ ...values, currency: v })} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Claim Reason" required placeholder="Choose Reason" value={values.claimReason} onChange={(v) => setValues({ ...values, claimReason: v })} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Reference No." placeholder="Enter Reference" value={values.referenceNo} onChange={(v) => setValues({ ...values, referenceNo: v })} />
          <div className="md:col-span-2 lg:col-span-4">
            <FloatingField label="Remarks" placeholder="Enter Remarks" value={values.remarks} onChange={(v) => setValues({ ...values, remarks: v })} height={88} />
          </div>
        </div>
      </Card>

      <SectionHeader>Supporting Documents</SectionHeader>
      <Card>
        <div className="border border-dashed border-[#d5ddfb] rounded-[8px] py-[28px] flex flex-col items-center gap-[10px]" style={{ background: '#f8fafd' }}>
          <svg viewBox="0 0 32 32" width="36" height="36" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 5h13l5 5v17H8z" />
            <path d="M21 5v5h5" />
            <path d="M14 18l2-2 2 2M16 16v6" />
          </svg>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Drag &amp; drop files or <span className="text-[#1360d2] underline cursor-pointer">browse</span></p>
          <p className="text-[12px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>PDF, JPG, PNG up to 10 MB</p>
        </div>
      </Card>
    </div>
  );
}

/* ───────── Step 2: Payment Details ───────── */
function PaymentDetailsStep({ values, setValues }: { values: any; setValues: (v: any) => void }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader>Refund Beneficiary</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Beneficiary Name" required placeholder="Enter Name" value={values.beneficiaryName} onChange={(v) => setValues({ ...values, beneficiaryName: v })} />
          <FloatingField label="Bank Name" required placeholder="Choose Bank" value={values.bankName} onChange={(v) => setValues({ ...values, bankName: v })} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="IBAN" required placeholder="Enter IBAN" value={values.iban} onChange={(v) => setValues({ ...values, iban: v })} />
          <FloatingField label="Branch" placeholder="Enter Branch" value={values.branch} onChange={(v) => setValues({ ...values, branch: v })} />
          <FloatingField label="SWIFT Code" placeholder="Enter SWIFT" value={values.swift} onChange={(v) => setValues({ ...values, swift: v })} />
          <FloatingField label="Currency" placeholder="AED" value={values.payCurrency} onChange={(v) => setValues({ ...values, payCurrency: v })} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
        </div>
      </Card>

      <SectionHeader>Charges</SectionHeader>
      <Card>
        <div className="flex flex-col gap-[12px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
          {[
            { k: 'Refund Amount',       v: '1,000.00' },
            { k: 'Processing Fee',      v: '25.00' },
            { k: 'Net Refund Payable',  v: '975.00', total: true },
          ].map((row) => (
            <div key={row.k} className="flex items-center justify-between border-b border-[#eef1f6] last:border-0 pb-[10px] last:pb-0">
              <span className={`text-[16px] ${row.total ? 'text-[#0e1b3d]' : 'text-[#696f83]'}`} style={{ fontWeight: row.total ? 600 : 400 }}>{row.k}</span>
              <span className={`text-[16px] inline-flex items-baseline gap-[4px] ${row.total ? 'text-[#1360d2]' : 'text-[#051937]'}`} style={{ fontWeight: row.total ? 700 : 500 }}><Dh /> {row.v}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ───────── Step 3: Review ───────── */
function ReviewStep({
  values, payment, claimType, declarationNo,
}: {
  values: any; payment: any; claimType: ClaimType; declarationNo: string;
}) {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionHeader>Claim Summary</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[16px]">
          <Field k="Claim Type" v={CLAIM_TYPE_LABEL[claimType]} />
          <Field k="Declaration Number" v={declarationNo} />
          <Field k="Claim Amount" v={values.claimAmount ? `${values.currency || 'AED'} ${values.claimAmount}` : '—'} />
          <Field k="Claim Reason" v={values.claimReason || '—'} />
          <Field k="Reference No." v={values.referenceNo || '—'} />
          <Field k="Remarks" v={values.remarks || '—'} />
        </div>
      </Card>

      <SectionHeader>Payment Summary</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[16px]">
          <Field k="Beneficiary Name" v={payment.beneficiaryName || '—'} />
          <Field k="Bank Name" v={payment.bankName || '—'} />
          <Field k="IBAN" v={payment.iban || '—'} />
          <Field k="Branch" v={payment.branch || '—'} />
          <Field k="SWIFT Code" v={payment.swift || '—'} />
          <Field k="Currency" v={payment.payCurrency || 'AED'} />
        </div>
      </Card>

      <Card>
        <div className="flex items-start gap-[10px]">
          <button role="checkbox" aria-checked className="size-[20px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]" style={{ background: '#1360d2', border: '2px solid #1360d2' }}>
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>
          </button>
          <span className="text-[16px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif" }}>I confirm that the information provided is true and complete to the best of my knowledge.</span>
        </div>
      </Card>
    </div>
  );
}

/* ───────── Page ───────── */
export default function RaiseClaimRequestPage({ claimType, declarationNo, onBack, onSubmit }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [claimValues, setClaimValues] = useState({ claimAmount: '', currency: 'AED', claimReason: '', referenceNo: '', remarks: '' });
  const [paymentValues, setPaymentValues] = useState({ beneficiaryName: '', bankName: '', iban: '', branch: '', swift: '', payCurrency: 'AED' });
  const step = STEPS[stepIndex];

  const next = () => stepIndex < STEPS.length - 1 ? setStepIndex(stepIndex + 1) : onSubmit();
  const prev = () => stepIndex > 0 ? setStepIndex(stepIndex - 1) : onBack();

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Step body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px] flex flex-col gap-[20px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim</h1>

        {/* Stepper */}
        <div>
          <ClaimStepper activeIndex={stepIndex} />
        </div>
        {step.id === 'claim'   && <ClaimDetailsStep values={claimValues} setValues={setClaimValues} claimType={claimType} declarationNo={declarationNo} />}
        {step.id === 'payment' && <PaymentDetailsStep values={paymentValues} setValues={setPaymentValues} />}
        {step.id === 'review'  && <ReviewStep values={claimValues} payment={paymentValues} claimType={claimType} declarationNo={declarationNo} />}

        <ClaimantBrokerDetail />
      </div>

      <BackToListingBar
        onBack={prev}
        rightContent={
          <button
            onClick={next}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors hover:bg-[#0E4DB8]"
            style={{ background: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
          >
            {stepIndex === STEPS.length - 1 ? 'Submit Claim' : 'Next'}
          </button>
        }
      />
    </div>
  );
}
