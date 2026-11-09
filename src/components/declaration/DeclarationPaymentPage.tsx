import React, { useState } from 'react';
import { JourneyStepper, PartyInformation, SectionCard, SectionTitle, font } from './DeclarationUI';

const CHARGE_BLOCKS = [
  {
    total: 'AED 100',
    lines: [['Registration Fee', 'AED 80'], ['Knowledge-Innovation Dirham Charge', 'AED 20']],
    mode: 'Standard Guarantee',
    reference: 'Account Number',
  },
  {
    total: 'AED 100',
    lines: [['Registration Fee', 'AED 80'], ['Knowledge-Innovation Dirham Charge', 'AED 20']],
    mode: 'Standard Guarantee',
    reference: 'Account Number',
  },
];

function Select({ value }: { value: string }) {
  return (
    <div className="flex items-center h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px]" style={{ fontFamily: font }}>
      <span className="flex-1 min-w-0 text-[15px] text-[#0e1b3d] truncate">{value}</span>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#697498" strokeWidth="2" className="flex-shrink-0"><path d="M6 9l6 6 6-6" /></svg>
    </div>
  );
}

/** Payment Details step — Figma 2650:56012. */
type Props = {
  /** The amend journey runs a longer stepper, so the labels and active index are overridable. */
  steps?: string[];
  stepIndex?: number;
};

export default function DeclarationPaymentPage({ steps, stepIndex }: Props) {
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={stepIndex ?? 4} steps={steps} />

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Payment Details</SectionTitle>

        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          {/* Column headings */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px_260px] gap-[20px] px-[20px] py-[14px]" style={{ background: '#a6c2e9' }}>
            {['Charges', 'Payment Mode', 'Payment Reference'].map((h) => (
              <span key={h} className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {CHARGE_BLOCKS.map((b, i) => (
            <div
              key={i}
              className="grid grid-cols-1 lg:grid-cols-[1fr_260px_260px] gap-[20px] px-[20px] py-[16px] items-start"
              style={{ borderTop: i > 0 ? '1px solid #eef1f6' : undefined }}
            >
              <div className="flex flex-col">
                <div className="flex items-center justify-between gap-[20px] px-[12px] py-[12px] rounded-[4px]" style={{ background: '#f1f3f7' }}>
                  <span className="text-[15px] text-[#455174]">Total Charges</span>
                  <span className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{b.total}</span>
                </div>
                {b.lines.map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between gap-[20px] px-[12px] py-[10px]">
                    <span className="text-[14px] text-[#455174]">{l}</span>
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
              </div>
              <Select value={b.mode} />
              <Select value={b.reference} />
            </div>
          ))}
        </div>
      </div>

      {/* Undertaking */}
      <SectionCard className="!py-[20px]">
        <label className="flex items-start gap-[12px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-[2px] size-[18px] flex-shrink-0 rounded-[2px]"
            style={{ accentColor: '#1360d2' }}
          />
          <span className="text-[14px] text-[#455174]" style={{ lineHeight: 1.6 }}>
            I, the undersigned Muhammed Rowmahs Being authorized by CONSOLIDATED SHIPPING SERVICES L.L.C and for the
            purposes of using the electronic services provided by Dubai Customs; and after perusing the terms and
            conditions of using Mirsal (2), declare and undertake to comply with the terms and conditions referred
            hereinafter without prejudice to any obligations and provisions provided for in the customs law, policies
            and decisions thereof, laws in force and customs broker policy.
            <br />
            I, the Authorized Person, have carefully read and fully understood the{' '}
            <a href="#terms" className="text-[#1360d2] hover:underline" onClick={(e) => e.preventDefault()}>Terms and Conditions</a>
            {' '}and accept them.
          </span>
        </label>
      </SectionCard>

      <PartyInformation />
    </div>
  );
}
