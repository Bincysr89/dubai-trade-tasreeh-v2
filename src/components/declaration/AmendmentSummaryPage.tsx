import React from 'react';
import { AMEND_STEPS, JourneyStepper, JourneyTable, JourneyTd, JourneyThead, SectionCard, chevronSrc, font } from './DeclarationUI';

/** Attribute changes this amendment carries — Figma 2650:54013. */
const CHANGES: [string, string, string][] = [
  ['Invoice', 'Available in Electronics', 'Not Available'],
  ['Certificate of Origin', 'Available in original (Paper)', 'Not Available'],
  ['Change in Container Details', '', ''],
  ['Change in Invoice Header Details', '', ''],
  ['Change in Invoice Line Item Details', '', ''],
];

const OLD_CHARGES: [string, string, string][] = [
  ['Duty', '1124.45', 'NA'],
  ['E- Archive Service fee', '1124.45', 'NA'],
];
const NEW_CHARGES: [string, string][] = [
  ['Duty', '1124.45'],
  ['E- Archive Service fee', '1124.45'],
];

const VERSIONS = ['Version 1', 'Version 2', 'Version 3', 'Version 4'].map((v) => ({
  version: v, submitted: '19/06/2024, 19:40', cleared: '19/06/2024, 19:40',
}));

function Dropdown({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative w-full sm:w-[240px]">
      <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
        <span className="flex-1 min-w-0 text-[16px] text-[#697498] truncate">{value}</span>
        <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
      </div>
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px' }}>
        <span style={{ color: '#dc3545' }}>*</span>{label}
      </span>
    </div>
  );
}

type Props = { onViewVersion?: (version: string) => void };

/** Amendment Summary step — Figma 2650:54013. */
export default function AmendmentSummaryPage({ onViewVersion }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={4} steps={AMEND_STEPS} />

      <SectionCard className="!py-[24px]">
        <p className="text-[20px] text-[#0e1b3d] mb-[28px]" style={{ fontWeight: 600 }}>Amendment Updates</p>
        <div className="flex flex-wrap gap-[24px]">
          <Dropdown label="Amendment Reason" value="Amendment Reason" />
          <Dropdown label="Cargo Status" value="Cargo Status" />
        </div>
      </SectionCard>

      {/* What changed */}
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <JourneyTable minWidth={760}>
          <JourneyThead columns={[
            { label: 'Attribute Name', filter: false },
            { label: 'Old Value', filter: false },
            { label: 'New Value', filter: false },
          ]} />
          <tbody>
            {CHANGES.map(([attr, oldV, newV]) => (
              <tr key={attr}>
                <JourneyTd first>{attr}</JourneyTd>
                <JourneyTd>{oldV}</JourneyTd>
                <JourneyTd>{newV}</JourneyTd>
              </tr>
            ))}
          </tbody>
        </JourneyTable>
      </div>

      {/* Charges before and after, side by side */}
      <div className="flex flex-wrap lg:flex-nowrap gap-[20px] items-stretch">
        <div className="flex-1 min-w-[280px] bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-[16px] text-[#051937] px-[16px] py-[12px]" style={{ background: '#a6c2e9', fontWeight: 600 }}>Old Charges</p>
          <JourneyTable minWidth={360}>
            <JourneyThead columns={[
              { label: 'Charges', filter: false }, { label: 'Amount', filter: false }, { label: 'Status', filter: false },
            ]} />
            <tbody>
              {OLD_CHARGES.map(([c, a, st]) => (
                <tr key={c}>
                  <JourneyTd first>{c}</JourneyTd><JourneyTd>{a}</JourneyTd><JourneyTd>{st}</JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
        <div className="flex-1 min-w-[280px] bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-[16px] text-[#051937] px-[16px] py-[12px]" style={{ background: '#a6c2e9', fontWeight: 600 }}>New Charges</p>
          <JourneyTable minWidth={300}>
            <JourneyThead columns={[{ label: 'Charges', filter: false }, { label: 'Amount', filter: false }]} />
            <tbody>
              {NEW_CHARGES.map(([c, a]) => (
                <tr key={c}><JourneyTd first>{c}</JourneyTd><JourneyTd>{a}</JourneyTd></tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </div>

      {/* Declaration Versions */}
      <div className="flex flex-col gap-[16px]">
        <p className="text-[24px] text-[#051937]" style={{ fontWeight: 500 }}>Declaration Versions</p>
        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <JourneyTable minWidth={760}>
            <JourneyThead columns={[
              { label: 'Version' }, { label: 'Submitted Date' }, { label: 'Cleared Date' },
              { label: 'Action', w: 110, filter: false },
            ]} />
            <tbody>
              {VERSIONS.map((v) => (
                <tr key={v.version}>
                  <JourneyTd first>{v.version}</JourneyTd>
                  <JourneyTd>{v.submitted}</JourneyTd>
                  <JourneyTd>{v.cleared}</JourneyTd>
                  <JourneyTd>
                    <button type="button" onClick={() => onViewVersion?.(v.version)}
                      className="text-[16px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>View</button>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </div>
    </div>
  );
}
