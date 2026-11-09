import React from 'react';
import { JourneyStepper, Readout, SectionCard, SectionTitle, font } from './DeclarationUI';

const DECLARATION_DETAILS = [
  ['Customer Name', 'Muhammed'],
  ['Declaration Type', '101-Import to local from ROW'],
  ['DO Number', 'DTD0624MSK10261'],
  ['Inbound MABW/MBOL', '337788'],
  ['No. of Packages', '3'],
  ['Importer VAT TRN', '1234546'],
];

const PAYMENT_ROWS = [
  ['Duty & Tax', 'AED 1000.00', 'Credit/Debit Account', '1098 -TIG'],
  ['Deposit', 'AED 2850.00', 'Credit/Debit Account', '1098 -TIG'],
  ['Additional Duty', 'AED 607.00', 'Credit/Debit Account', '1098 -TIG'],
  ['Other charges', 'AED 607.00', 'Credit/Debit Account', '1098 -TIG'],
];

type Props = {
  onViewDeclaration?: () => void;
  /** The amend journey runs a longer stepper, so the labels and active index are overridable. */
  steps?: string[];
  stepIndex?: number;
};

/** Review & Submit step — Figma 2650:52068. */
export default function DeclarationSubmitPage({ onViewDeclaration, steps, stepIndex }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={stepIndex ?? 4} steps={steps} />

      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between gap-[16px] flex-wrap">
          <SectionTitle>Declaration Details</SectionTitle>
          <button
            data-secondary-btn
            type="button"
            onClick={onViewDeclaration}
            className="h-[44px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >View Declaration</button>
        </div>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[24px] gap-y-[32px]">
            {DECLARATION_DETAILS.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Payment Summary</SectionTitle>
        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 860 }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {['Charge Group', 'Payable Amount', 'Payment Mode', 'Payment Reference (Account Number / Account Holder)'].map((h) => (
                    <th key={h} className="text-left text-[16px]" style={{ padding: '12px 20px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PAYMENT_ROWS.map((r) => (
                  <tr key={r[0]}>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r[0]}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px', whiteSpace: 'nowrap', fontWeight: 700 }}>{r[1]}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r[2]}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{r[3]}</td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} style={{ padding: '0 20px 20px' }}>
                    <div className="inline-flex items-center gap-[40px] px-[12px] py-[12px] rounded-[4px]" style={{ background: '#f1f3f7', minWidth: 300 }}>
                      <span className="text-[15px] text-[#455174]">Total Payable amount</span>
                      <span className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>AED 4,457.00</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Request Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[24px] gap-y-[32px]">
            <Readout label="Submission Date" value="20/12/2024" />
            <Readout label="Total No. of Invoice Line Items" value="3" />
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
