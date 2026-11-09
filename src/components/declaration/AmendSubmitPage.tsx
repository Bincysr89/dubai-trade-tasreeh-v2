import React from 'react';
import { AMEND_STEPS, JourneyStepper, Readout, SectionCard, SectionTitle, font } from './DeclarationUI';

type Props = { onViewDeclaration?: () => void; requestNumber?: string };

function Band({ title, pairs, cols = 4 }: { title: string; pairs: [string, string][]; cols?: number }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <SectionTitle>{title}</SectionTitle>
      <SectionCard className="!py-[24px]">
        <div className={`grid gap-x-[24px] gap-y-[28px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols === 3 ? '3' : '4'}`}>
          {pairs.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
        </div>
      </SectionCard>
    </div>
  );
}

/** Amendment review before submission — Figma 2650:52302. */
export default function AmendSubmitPage({ onViewDeclaration, requestNumber = '1213243' }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={5} steps={AMEND_STEPS} />

      <div className="flex items-center justify-between gap-[16px] flex-wrap">
        <div className="flex items-center gap-[10px] rounded-[4px] px-[16px] py-[12px] flex-1 min-w-[300px]"
          style={{ background: '#e8f0ff', border: '1px solid #b3caff' }}>
          <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.6" className="flex-shrink-0">
            <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6h.01" strokeLinecap="round" />
          </svg>
          <span className="text-[16px] text-[#0e1b3d]">
            Your Request For Customs Declaration Amendment Will Be Sent For Approval.{' '}
            <span style={{ fontWeight: 600 }}>Request Number: {requestNumber}</span>
          </span>
        </div>
        <button data-secondary-btn type="button" onClick={onViewDeclaration}
          className="h-[48px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors flex-shrink-0"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >View Declaration</button>
      </div>

      <Band title="Submission Details" cols={3} pairs={[
        ['Submission Date', '22-11-2024'],
        ['Customer Name', 'Mr Shah'],
        ['Reason for Amendment', 'Exit Point wrongly declared'],
      ]} />

      <Band title="Declaration Details" pairs={[
        ['Customer Name', 'Muhammed'],
        ['Declaration Type', 'Import to local from ROW'],
        ["Client's Decl. Ref. No.", 'JOB12233435'],
        ['Inbound MABW/MBOL', 'BA122345677i'],
        ['No. of Packages', '3'],
        ['Importer VAT TRN', '1234546'],
      ]} />

      <Band title="Payment Summary" cols={3} pairs={[
        ['Payable From Vikram', 'AED105'],
        ['Payment reference', 'Credit/Debit Account'],
        ['Total Amount Payable', 'AED 105'],
      ]} />

      <Band title="Request Details" cols={3} pairs={[
        ['Submission Date', '20/12/2024'],
        ['Total No. of Invoice Line Items', '3'],
      ]} />
    </div>
  );
}
