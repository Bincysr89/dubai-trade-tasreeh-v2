import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import ActionPage, { PrimaryButton } from './ActionPage';
import DocumentUploadSection from './DocumentUploadSection';
import { Readout, SectionCard, SectionTitle, StatusChip, chevronSrc, font } from './DeclarationUI';

const DOC_TYPES = [
  { label: 'Doc 1', required: true }, { label: 'Doc 2' }, { label: 'Doc 3' }, { label: 'Doc 4' },
];

const SEEDED_DOCS = [
  { fileName: 'Invoice 12124.PDF', docType: 'Certificate of Origin', uploadedOn: '12-12-2024', locked: false },
  { fileName: 'Invoice 898486.xls', docType: 'Certificate of Origin', uploadedOn: '12-12-2024', locked: false },
  { fileName: 'Invoice 189777.xls', docType: 'Invoice', uploadedOn: '08-12-2024', locked: true },
  { fileName: 'Invoice.xls', docType: 'Invoice', uploadedOn: '08-12-2024', locked: true },
].map((d, i) => ({ id: `resp-doc-${i}`, authority: 'Dubai Customs', fileSize: 0, ...d }));

const CDM_CONTACT: [string, string][] = [
  ['Contact Section Name', 'Customs Declaration Management'],
  ['Phone Number', '04-34567890'],
  ['Fax Number', '04-5876888'],
  ['Contact Time', '08:00 - 14:00'],
  ['Contact Location', 'Dubai Customs HQ, Port Rashid, Dubai'],
  ['Contact Department', 'Customs Declaration Management'],
];

function Select({ value }: { value: string }) {
  return (
    <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
      <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">{value}</span>
      <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
    </div>
  );
}

function SubmittedModal({ declarationNumber, onClose, onBackToListing }: {
  declarationNumber: string; onClose: () => void; onBackToListing: () => void;
}) {
  return createPortal(
    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-[24px]"
      role="dialog" aria-modal="true" aria-label="Response Submitted"
      style={{ background: 'rgba(11,21,52,0.45)', fontFamily: font }}>
      <div className="bg-white rounded-[6px] w-full max-w-[620px] px-[32px] py-[40px] flex flex-col items-center gap-[16px]"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)' }}>
        <div className="size-[60px] rounded-full inline-flex items-center justify-center" style={{ background: '#1aac72' }}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Response Submitted Successfully</p>
        <p className="text-[16px] text-[#455174]">Declaration Number: {declarationNumber}</p>
        <div className="flex items-center gap-[16px] mt-[8px]">
          <button data-secondary-btn type="button" onClick={onClose}
            className="h-[44px] px-[28px] rounded-[4px] border bg-white text-[16px] uppercase transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >Close</button>
          <button type="button" onClick={onBackToListing}
            className="h-[44px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontWeight: 500 }}
          >Back To Listing</button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

type Props = {
  requestNo?: string;
  declarationNumber?: string;
  onHome?: () => void;
  onBack?: () => void;
  onBackToListing?: () => void;
};

/** Declarant's Suspension Response — Figma 2650:79264, popup 2650:79610. */
export default function DeclarantResponsePage({
  requestNo = '123456', declarationNumber = '54689678', onHome, onBack, onBackToListing,
}: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [disagree, setDisagree] = useState(false);

  return (
    <>
      <ActionPage
        title="Declarant's Suspension Response"
        subtitle={
          <span className="flex items-center gap-[16px] flex-wrap">
            <span>Request No:{requestNo}</span>
            <StatusChip status="Suspended" />
          </span>
        }
        onHome={onHome}
        onBack={onBack}
        footerRight={<PrimaryButton onClick={() => setSubmitted(true)}>Submit</PrimaryButton>}
      >
        <div className="flex flex-col gap-[16px] mb-[24px]">
          <SectionTitle>Request Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[28px] items-start">
              <Readout label="To" value="AE123 Companies" />
              <Readout label="Comments" value="Please upload Documents" />
              <div className="relative">
                <input placeholder="Enter Text"
                  className="h-[52px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] bg-white focus:outline-none focus:border-[#1360d2] transition-colors"
                  style={{ fontFamily: font }} />
                <span className="absolute bg-[#f8fafd] px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
                  style={{ left: 12, top: -8, lineHeight: '16px' }}>Response</span>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="mb-[24px]">
          <DocumentUploadSection
            docTypes={DOC_TYPES}
            authority="Dubai Customs"
            description="Select the document type and upload the file"
            initialDocs={SEEDED_DOCS}
            numbered
          />
        </div>

        <div className="flex flex-col gap-[16px] mb-[24px]">
          <SectionTitle>Payment Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <label className="flex items-center gap-[10px] mb-[24px] cursor-pointer select-none">
              <input type="checkbox" checked={disagree} onChange={(e) => setDisagree(e.target.checked)}
                className="size-[18px] rounded-[2px]" style={{ accentColor: '#1360d2' }} />
              <span className="text-[16px] text-[#0e1b3d]">I disagree to Pay</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[28px] items-end">
              <Readout label="CDM Demanded Deposit" value="AED 500" />
              <Readout label="Reason" value="Pending Customs Decision" />
              <div className="relative">
                <Select value="Select Mode" />
                <span className="absolute bg-white px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
                  style={{ left: 12, top: -8, lineHeight: '16px' }}>Payment Mode</span>
              </div>
              <div className="relative">
                <Select value="Select Reference" />
                <span className="absolute bg-white px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
                  style={{ left: 12, top: -8, lineHeight: '16px' }}>Payment Reference</span>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="flex flex-col gap-[16px]">
          <SectionTitle>CDM Contact Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[32px]">
              {CDM_CONTACT.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
            </div>
          </SectionCard>
        </div>
      </ActionPage>

      {submitted && (
        <SubmittedModal
          declarationNumber={declarationNumber}
          onClose={() => setSubmitted(false)}
          onBackToListing={() => { setSubmitted(false); onBackToListing?.(); }}
        />
      )}
    </>
  );
}
