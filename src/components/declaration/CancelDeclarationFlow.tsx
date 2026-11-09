import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ActionPage, { PrimaryButton, SecondaryButton } from './ActionPage';
import DocumentUploadSection from './DocumentUploadSection';
import { Readout, SectionCard, SectionTitle, chevronSrc, font } from './DeclarationUI';

type Step = 'details' | 'documents' | 'payment' | 'summary';

type Props = {
  declarationNo: string;
  onClose: () => void;
  onViewDeclaration?: () => void;
};

const DECLARATION_DETAILS: [string, string][] = [
  ['Declaration Number', '12335678'],
  ['Declaration Type', '101-Import to local from ROW'],
  ['Business/Personal Customer Code', 'AE-102345 Madina AL Malabys General Trading LLC'],
  ['Declaration Date', '20/Dec/2024'],
  ['Broker Code & Name', 'AE- Consolidated Shipping Services LLC'],
  ['Cargo Channel', 'Sea'],
  ['Inbound MAWB/MBOL No.', 'COSU23455765678768'],
  ['Inbound HAWB/HBOL No.', '-'],
  ['Outbound MAWB/MBOL No.', '-'],
  ['Outbound HAWB/HBOL No.', '-'],
  ["Client's Dec. Ref. No.", 'SFCL/0274/2024'],
];

const CANCEL_DOC_TYPES = [
  { label: 'Doc 1', required: true },
  { label: 'Doc 2' }, { label: 'Doc 3' }, { label: 'Doc 4' },
  { label: 'Doc 5', isNew: true }, { label: 'Doc 6', isNew: true },
];

const SEEDED_DOCS = [
  { fileName: 'Invoice 12124.PDF', docType: 'Invoice', uploadedOn: '12-12-2024' },
  { fileName: 'Invoice 898486.xls', docType: 'Invoice', uploadedOn: '12-12-2024' },
  { fileName: 'Invoice 189777.pdf', docType: 'Invoice', uploadedOn: '08-12-2024' },
].map((d, i) => ({
  id: `cancel-doc-${i}`, authority: 'Dubai Customs', fileSize: 0, ...d,
}));

const CHARGES = [
  { label: 'Duty', amount: 'AED 1124.45', refundable: true, mode: 'Credit/Debit Account', modeLocked: true, reference: '' },
  { label: 'E- Archive Service fee', amount: 'AED 1124.45', mode: 'E-Payment', reference: 'Standard Guarantee' },
  { label: 'Registration Fee', amount: 'AED 1124.45', mode: 'Credit/Debit', reference: 'Standard Guarantee' },
  { label: 'Knowledge Innovation Dhiram', amount: 'AED 1124.45', mode: 'Standard Guarantee', reference: 'Standard Guarantee' },
];

const REQUEST_DETAILS: [string, string][] = [
  ['Request Number', 'REQ12345'],
  ['Declaration Type', 'Import to local from ROW'],
  ['Submission Date', '20/2/2024'],
  ['Business Code Name', 'AE-98777'],
  ['Broker Code and Name', 'AE-122434 Vikram'],
  ['Reason for Cancelation', 'Business code wrongly declared'],
];

const SUMMARY_DECLARATION: [string, string][] = [
  ['Declaration Number', '12335678'],
  ['Declaration Date', '20/Dec/2024'],
  ["Client's Decl. Ref. No.", 'JOB12233435'],
  ['Declaration Type', 'Import to local from ROW'],
  ['Cargo Channel', 'Sea'],
  ['Customer Name', 'Muhammed'],
  ['Inbound MABW/MBOL', 'BA122345677i'],
  ['No. of Packages', '3'],
  ['Importer VAT TRN', '1234546'],
];

function Select({ value, locked }: { value: string; locked?: boolean }) {
  return (
    <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] px-[16px]"
      style={{ background: locked ? '#f1f3f7' : '#fff', cursor: locked ? 'default' : 'pointer' }}>
      <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
      {!locked && <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />}
    </div>
  );
}

function SubmittedModal({ requestNumber, onBackToListing }: { requestNumber: string; onBackToListing: () => void }) {
  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-[24px]"
      role="dialog" aria-modal="true" aria-label="Cancelation Request Submitted"
      style={{ background: 'rgba(11,21,52,0.45)', fontFamily: font }}>
      <div className="bg-white rounded-[6px] w-full max-w-[620px] px-[32px] py-[40px] flex flex-col items-center gap-[16px]"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)' }}>
        <div className="size-[64px] rounded-full inline-flex items-center justify-center" style={{ background: '#1aac72' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Cancelation Request Submitted Sussefully!</p>
        <p className="text-[16px] text-[#455174]">Your Request has been sent for approval.</p>
        <p className="text-[16px] text-[#455174]">Request Number: {requestNumber}</p>
        <button type="button" onClick={onBackToListing}
          className="mt-[8px] h-[44px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Back To Listing</button>
      </div>
    </div>,
    document.body,
  );
}

/**
 * Cancel a declaration — Figma 2650:78041 → 2650:78817 → 2650:78583 → 2650:78166,
 * finishing on the confirmation popup (2650:78373).
 */
export default function CancelDeclarationFlow({ declarationNo, onClose, onViewDeclaration }: Props) {
  const [step, setStep] = useState<Step>('details');
  const [submitted, setSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const title = `Cancel Request - Import to Local from ROW-${declarationNo}`;
  const viewDeclarationButton = (
    <button data-secondary-btn type="button" onClick={onViewDeclaration}
      className="h-[44px] px-[22px] rounded-[4px] border bg-white text-[16px] transition-colors"
      style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
    >View Declaration</button>
  );

  if (step === 'details') {
    return (
      <ActionPage title={title} onHome={onClose} onBack={onClose}
        footerRight={<PrimaryButton onClick={() => setStep('documents')}>Proceed</PrimaryButton>}>
        <SectionCard className="!py-[24px] mb-[24px]">
          <p className="text-[20px] text-[#0e1b3d] mb-[28px]" style={{ fontWeight: 600 }}>Cancelation Details</p>
          <div className="flex flex-wrap gap-[24px] mb-[28px]">
            <div className="relative w-full sm:w-[290px]">
              <Select value="Reason of Cancelation - Other" />
              <span className="absolute bg-white px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
                style={{ left: 12, top: -8, lineHeight: '16px' }}><span style={{ color: '#dc3545' }}>*</span>Reason of Cancelation</span>
            </div>
            <div className="relative w-full sm:w-[290px]">
              <Select value="Cargo Status" />
              <span className="absolute bg-white px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
                style={{ left: 12, top: -8, lineHeight: '16px' }}><span style={{ color: '#dc3545' }}>*</span>Cargo Status</span>
            </div>
          </div>
          <div className="relative">
            <textarea rows={2}
              className="w-full rounded-[4px] border border-[#d5ddfb] px-[16px] py-[12px] text-[16px] text-[#0e1b3d] resize-y focus:outline-none focus:border-[#1360d2] transition-colors"
              style={{ fontFamily: font }} />
            <span className="absolute bg-white px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
              style={{ left: 12, top: -8, lineHeight: '16px' }}><span style={{ color: '#dc3545' }}>*</span>Remarks</span>
          </div>
        </SectionCard>

        <div className="flex items-center justify-between gap-[16px] flex-wrap mb-[16px]">
          <SectionTitle>Declaration Details</SectionTitle>
          {viewDeclarationButton}
        </div>
        <SectionCard className="!py-[28px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[36px]">
            {DECLARATION_DETAILS.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
          </div>
        </SectionCard>
      </ActionPage>
    );
  }

  if (step === 'documents') {
    return (
      <ActionPage title="Documents Upload" crumb="Clearance" onHome={onClose} onBack={() => setStep('details')}
        footerRight={<PrimaryButton onClick={() => setStep('payment')}>Proceed</PrimaryButton>}>
        <DocumentUploadSection
          docTypes={CANCEL_DOC_TYPES}
          authority="Dubai Customs"
          description="Select the document type and upload the file, we will share the documents with authorities"
          initialDocs={SEEDED_DOCS}
          numbered
        />
      </ActionPage>
    );
  }

  if (step === 'payment') {
    return (
      <ActionPage title={title} crumb="Clearance" onHome={onClose} titleAction={viewDeclarationButton}
        onBack={() => setStep('documents')}
        footerRight={<>
          <SecondaryButton onClick={onClose}>Save &amp; Exit</SecondaryButton>
          <PrimaryButton onClick={() => setStep('summary')}>Proceed</PrimaryButton>
        </>}>
        <SectionTitle>Payment Details</SectionTitle>
        <div className="bg-white rounded-[8px] overflow-hidden mt-[16px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px_280px] gap-[20px] px-[20px] py-[14px]" style={{ background: '#a6c2e9' }}>
            {['Charges', 'Amount', 'Payment Mode', 'Payment Reference'].map((h) => (
              <span key={h} className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>{h}</span>
            ))}
          </div>
          {CHARGES.map((c, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_280px_280px] gap-[20px] px-[20px] py-[14px] items-center"
              style={{ borderTop: i > 0 ? '1px solid #eef1f6' : undefined }}>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{c.label}</span>
              <span className="flex items-center gap-[10px] flex-wrap">
                <span className="text-[16px] text-[#0e1b3d]">{c.amount}</span>
                {c.refundable && (
                  <span className="text-[14px] px-[10px] py-[3px] rounded-[4px]"
                    style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}>Refundable</span>
                )}
              </span>
              <Select value={c.mode} locked={c.modeLocked} />
              {c.reference ? <Select value={c.reference} /> : <span />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[8px] px-[20px] py-[18px] flex items-start gap-[12px] mt-[20px]"
          style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
            className="mt-[3px] size-[18px] rounded-[2px] flex-shrink-0" style={{ accentColor: '#1360d2' }} />
          <span className="text-[14px] text-[#455174]" style={{ lineHeight: 1.7 }}>
            I, AE-1048909-Vikram companies amended PLANET TRAVEL TOURS AND CARGO LLC ALI JUMA BASHIR CLEARING &amp;
            FORWARDING ALI , hereby declare that, particulars provided in this declaration are true and correct, confirm
            availability of all related permits/approvals in dealing with the declared goods and also authorise Dubai
            Customs to deduct the required customs duties/deposit, other applicable charges and fines through my account.
          </span>
        </div>
      </ActionPage>
    );
  }

  return (
    <>
      <ActionPage
        title={`Cancellation Summary - Import to Local from ROW-${declarationNo}`}
        crumb="Clearance" onHome={onClose} titleAction={viewDeclarationButton}
        onBack={() => setStep('payment')}
        footerRight={<>
          <SecondaryButton>Print</SecondaryButton>
          <PrimaryButton onClick={() => setSubmitted(true)}>Submit</PrimaryButton>
        </>}>
        <div className="flex flex-col gap-[16px] mb-[24px]">
          <SectionTitle>Request Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[36px]">
              {REQUEST_DETAILS.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-[16px]">
          <SectionTitle>Declaration Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[36px]">
              {SUMMARY_DECLARATION.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
            </div>
          </SectionCard>
        </div>
      </ActionPage>
      {submitted && <SubmittedModal requestNumber="REQ123456" onBackToListing={onClose} />}
    </>
  );
}
