import React from 'react';
import DocumentUploadSection from './DocumentUploadSection';
import { JourneyStepper, SectionCard, font } from './DeclarationUI';

const AVAILABILITY = [
  { label: 'Invoice', required: true, value: 'Select' },
  { label: 'Packaging List', required: true, value: 'Select' },
  { label: 'AWB/BOL', required: true, value: 'Select' },
  { label: 'Certificate of Origin', required: true, value: 'Not Required' },
];

const DOC_OPTIONS = [
  { label: 'Passport Copy', required: true, count: '2/5' },
  { label: 'Trade License copy' },
  { label: 'Certificate Of Origin issued by the Ministry' },
  { label: 'Organizational Structure/Profile Copy', isNew: true },
  { label: 'Invoice Consumption Request Letter' },
  { label: 'Letter of Undertaking for Shipping Agent', isNew: true },
];

function Dropdown({ label, required, value }: { label: string; required?: boolean; value: string }) {
  return (
    <div className="relative" style={{ fontFamily: font }}>
      <div className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px]">
        <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#697498" strokeWidth="2" className="flex-shrink-0"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px' }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

/** Document Upload step — Figma 2650:50767, with the Refund & Claims uploader layout. */
type Props = {
  /** The amend journey runs a longer stepper, so the labels and active index are overridable. */
  steps?: string[];
  stepIndex?: number;
  /** Amend pre-loads the files already on the declaration; those rows cannot be deleted. */
  existingDocs?: { fileName: string; authority: string; docType: string; size: string; uploadedOn: string }[];
};

export default function DeclarationDocumentUploadPage({ steps, stepIndex, existingDocs }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={stepIndex ?? 3} steps={steps} />

      {/* ── Availability of Documents ── */}
      <SectionCard>
        <p className="text-[20px] text-[#0e1b3d] mb-[24px]" style={{ fontWeight: 600 }}>Availability of Documents</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-x-[20px] gap-y-[32px]">
          {AVAILABILITY.map((a) => <Dropdown key={a.label} label={a.label} required={a.required} value={a.value} />)}
          <div className="relative">
            <div className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px]">
              <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">Reason for not required</span>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#697498" strokeWidth="2" className="flex-shrink-0"><path d="M6 9l6 6 6-6" /></svg>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Upload Documents — same two-card layout as the Refund & Claims document step ── */}
      <DocumentUploadSection
        docTypes={DOC_OPTIONS}
        authority="Dubai Customs"
        initialDocs={existingDocs?.map((d, i) => ({
          id: `existing-${i}`, docType: d.docType, authority: d.authority,
          fileName: d.fileName, fileSize: 0, uploadedOn: d.uploadedOn, locked: true,
        }))}
      />
    </div>
  );
}
