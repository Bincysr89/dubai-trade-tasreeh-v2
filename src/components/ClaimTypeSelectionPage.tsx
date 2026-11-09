import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';

export type ClaimType = 'refundDeposit' | 'refundDuty' | 'nonRemittance' | 'refundAuction';

const OPTIONS: { id: ClaimType; title: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: 'refundDeposit',
    title: 'Refund of Deposits',
    sub: 'Duty deposit, Missing document deposit, Exemption deposits — any deposit labeled by Dubai Customs.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="9" width="22" height="15" rx="2" />
        <circle cx="16" cy="16.5" r="3.5" />
        <path d="M9 13h.01M23 20h.01" />
      </svg>
    ),
  },
  {
    id: 'refundDuty',
    title: 'Refund of Duty',
    sub: 'Cancelled or amended declarations and duty-exempted goods.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5h13l5 5v17H8z" />
        <path d="M21 5v5h5" />
        <path d="M13 16h6M13 20h6M13 12h3" />
      </svg>
    ),
  },
  {
    id: 'nonRemittance',
    title: 'Non Remittance',
    sub: 'Applicable for Free Zone exports without any deposit.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11" />
        <path d="M11 16h10M16 11v10" />
      </svg>
    ),
  },
  {
    id: 'refundAuction',
    title: 'Refund on Auction Proceed',
    sub: 'Applicable for refunds against auctioned lots and their sale proceeds.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l7 7-11 11-7-7z" />
        <path d="M18 3l11 11" />
        <path d="M22 7l4-4" />
        <circle cx="7" cy="25" r="1.4" fill="#1360d2" stroke="none" />
      </svg>
    ),
  },
];

type Props = {
  onBack: () => void;
  onContinue: (type: ClaimType) => void;
};

export default function ClaimTypeSelectionPage({ onBack, onContinue }: Props) {
  const [selected, setSelected] = useState<ClaimType | null>(null);

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline">Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim</h1>
        <div className="bg-white rounded-[8px] flex flex-col gap-[24px] px-[24px] py-[28px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-center gap-[12px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Claim Type</p>
          </div>
          <p className="text-[16px] text-[#455174]">Choose the type of claim you would like to raise. The list of eligible declarations will be filtered based on your selection.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
            {OPTIONS.map((opt) => {
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className="flex flex-col items-start gap-[14px] px-[20px] py-[20px] rounded-[10px] text-left transition-colors h-full"
                  style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e0e6ef'}` }}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="size-[56px] rounded-[10px] inline-flex items-center justify-center" style={{ background: active ? '#e8f0ff' : '#f4f7fc' }}>
                      {opt.icon}
                    </div>
                    <span className="size-[22px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                      {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                    </span>
                  </div>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                  <span className="text-[16px] text-[#696f83]" style={{ lineHeight: 1.4 }}>{opt.sub}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <button
            onClick={() => onContinue(selected!)}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', cursor: 'pointer', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
          >
            Continue
          </button>
        }
      />
    </div>
  );
}
