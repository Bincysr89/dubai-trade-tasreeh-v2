import React, { useState } from 'react';
import ActionPage from './ActionPage';
import { JourneyTable, JourneyTd, JourneyThead, Readout, SectionCard, SectionTitle, font } from './DeclarationUI';

const ROWS = [
  { suspended: '24/02/24, 09:30', comment: 'Please upload required documents', responded: '24/02/24, 09:30', response: 'Please upload required documents' },
  { suspended: '24/02/24, 09:30', comment: 'Document Uploaded', responded: '24/02/24, 09:30', response: 'Document Uploaded' },
  { suspended: '24/02/24, 09:30', comment: 'Charges Paid', responded: '24/02/24, 09:30', response: 'Charges Paid' },
];

const VIEW_DOCS = [
  ['Invoice 12124.PDF', 'Certificate of Origin', '50 MB', '12-12-2024'],
  ['Invoice 898486.xls', 'Certificate of Origin', '50 MB', '12-12-2024'],
  ['Invoice 189777.xls', 'Invoice', '50 MB', '08-12-2024'],
  ['Invoice.xls', 'Invoice', '50 MB', '08-12-2024'],
];

type Props = { declarationNo?: string; onHome?: () => void; onBack?: () => void };

/** Suspension History — Figma 2650:79156, with the View page from 6072:131637. */
export default function SuspensionHistoryPage({ declarationNo = '123456', onHome, onBack }: Props) {
  const [viewing, setViewing] = useState(false);

  if (viewing) {
    return (
      <ActionPage title="Suspension History - View" subtitle={`Declaration No: ${declarationNo}`}
        onHome={onHome} onBack={() => setViewing(false)}>
        <div className="flex flex-col gap-[16px] mb-[24px]">
          <SectionTitle>Request Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[28px]">
              <Readout label="To" value="AE123 Companies" />
              <Readout label="CDM Comments" value="Please upload Documents" />
              <Readout label="Customer Response" value="Lorum Ispum" />
            </div>
          </SectionCard>
        </div>

        <div className="bg-white rounded-[8px] overflow-hidden mb-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-[20px] text-[#0e1b3d] px-[24px] pt-[24px] pb-[16px]" style={{ fontWeight: 600 }}>Documents Uploaded</p>
          <JourneyTable minWidth={860}>
            <JourneyThead columns={[
              { label: '', w: 56, filter: false }, { label: 'Document Name' }, { label: 'Document Type' },
              { label: 'Uploaded size' }, { label: 'Uploaded on' }, { label: 'Action', w: 110, filter: false },
            ]} />
            <tbody>
              {VIEW_DOCS.map((d, i) => (
                <tr key={i}>
                  <JourneyTd first width={56}>{i + 1}</JourneyTd>
                  {d.map((cell, j) => <JourneyTd key={j}>{cell}</JourneyTd>)}
                  <JourneyTd>
                    <button type="button" aria-label={`Download ${d[0]}`}
                      className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#1360d2' }}>
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
                      </svg>
                    </button>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>

        <div className="flex flex-col gap-[16px]">
          <SectionTitle>Payment Details</SectionTitle>
          <SectionCard className="!py-[28px]">
            <label className="flex items-center gap-[10px] mb-[24px] select-none">
              <input type="checkbox" checked readOnly disabled className="size-[18px] rounded-[2px]" style={{ accentColor: '#697498' }} />
              <span className="text-[16px] text-[#697498]">I disagree to Pay</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[28px]">
              <Readout label="CDM Demanded Deposit" value="AED 500" />
              <Readout label="Reason" value="Pending Customs Decision" />
              <Readout label="Payment Mode" value="e-Payment" />
              <Readout label="Payment Reference" value="Payment Reference" />
            </div>
          </SectionCard>
        </div>
      </ActionPage>
    );
  }

  return (
    <ActionPage title="Suspension History" onHome={onHome} onBack={onBack}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)', fontFamily: font }}>
        <JourneyTable minWidth={960}>
          <JourneyThead columns={[
            { label: 'Suspension Date' }, { label: 'CDM Comments' },
            { label: 'Response Date' }, { label: 'Customer Response' },
            { label: 'Action', w: 110, filter: false },
          ]} />
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i}>
                <JourneyTd first>{r.suspended}</JourneyTd>
                <JourneyTd>{r.comment}</JourneyTd>
                <JourneyTd>{r.responded}</JourneyTd>
                <JourneyTd>{r.response}</JourneyTd>
                <JourneyTd>
                  <button type="button" onClick={() => setViewing(true)}
                    className="text-[16px] text-[#1360d2] underline" style={{ fontWeight: 500 }}>View</button>
                </JourneyTd>
              </tr>
            ))}
          </tbody>
        </JourneyTable>
      </div>
    </ActionPage>
  );
}
