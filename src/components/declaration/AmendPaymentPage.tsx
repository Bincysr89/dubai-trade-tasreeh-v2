import React, { useState } from 'react';
import { AMEND_STEPS, JourneyStepper, PartyInformation, SectionTitle, chevronSrc, font } from './DeclarationUI';

const CHARGES = [
  { label: 'Declaration Amendment Charge:', amount: 'AED 25', refundable: true },
  { label: 'Declaration Amendment Charge:', amount: 'AED 25', refundable: false },
];

function Select({ value }: { value: string }) {
  return (
    <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px] cursor-pointer">
      <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{value}</span>
      <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
    </div>
  );
}

/** Payment Details for an amendment — Figma 2650:56715. */
export default function AmendPaymentPage() {
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={5} steps={AMEND_STEPS} />

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Payment Details</SectionTitle>

        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_280px] gap-[20px] px-[20px] py-[14px]" style={{ background: '#a6c2e9' }}>
            {['Charges', 'Payment Mode', 'Payment Reference'].map((h) => (
              <span key={h} className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>{h}</span>
            ))}
          </div>

          {CHARGES.map((c, i) => (
            <div key={i} className="grid grid-cols-1 lg:grid-cols-[1fr_280px_280px] gap-[20px] px-[20px] py-[16px] items-center"
              style={{ borderTop: i > 0 ? '1px solid #eef1f6' : undefined }}>
              <div className="flex items-center gap-[20px] px-[12px] py-[14px] rounded-[4px] flex-wrap" style={{ background: '#f1f3f7' }}>
                <span className="text-[16px] text-[#455174]">{c.label}</span>
                <span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{c.amount}</span>
                {c.refundable && (
                  <span className="text-[14px] px-[10px] py-[3px] rounded-[4px]"
                    style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}>Refundable</span>
                )}
              </div>
              <Select value="Standard Guarantee" />
              <Select value="Account Number" />
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[8px] px-[20px] py-[18px] flex items-start gap-[12px]"
          style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
            className="mt-[3px] size-[18px] rounded-[2px] flex-shrink-0" style={{ accentColor: '#1360d2' }} />
          <span className="text-[14px] text-[#455174]" style={{ lineHeight: 1.6 }}>
            I, the undersigned Muhammed Rowmahs Being authorized by CONSOLIDATED SHIPPING SERVICES L.L.C and for the
            purposes of using the electronic services provided by Dubai Customs; and after perusing the terms and
            conditions of using Mirsal (2), declare and undertake to comply with the terms and conditions referred
            hereinafter without prejudice to any obligations and provisions provided for in the customs law, policies
            and decisions thereof, laws in force and customs broker policy.
            <br />
            I, the Authorized Person, have carefully read and fully understood the{' '}
            <span className="text-[#1360d2] cursor-pointer hover:underline">Terms and Conditions</span> and accept them.
          </span>
        </div>
      </div>

      <PartyInformation />
    </div>
  );
}
