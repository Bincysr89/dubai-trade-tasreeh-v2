import React from 'react';
import { font } from './DeclarationUI';

type Props = { onViewDeclaration?: () => void; requestNumber?: string };

/** Amendment request created — Figma 2650:55884. */
export default function AmendSuccessPage({ onViewDeclaration, requestNumber = '560010545' }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <div className="rounded-[4px] px-[16px] py-[14px]" style={{ background: '#e8f0ff' }}>
        <span className="text-[16px] text-[#1360d2]">This Declaration does not require physical document submission</span>
      </div>

      <div className="flex flex-col items-center gap-[20px] py-[40px]">
        <div className="size-[64px] rounded-full inline-flex items-center justify-center" style={{ background: '#1aac72' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </div>
        <p className="text-[22px] text-[#1aac72]" style={{ fontWeight: 600 }}>Declaration Amendment Request Created Successfully !</p>

        <div className="bg-white rounded-[8px] px-[32px] py-[28px] w-full max-w-[620px] text-center flex flex-col gap-[8px]"
          style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-[16px] text-[#455174]">Dear Customer Thank You For Using Service Request Web Application.</p>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>
            Your Request For Customs Declaration Amendment Will Be Sent For Approval.
          </p>
          <p className="text-[16px] text-[#455174]">Please Find Below Details For Future Reference</p>
          <p className="text-[16px] text-[#0e1b3d] mt-[8px]" style={{ fontWeight: 700 }}>Request Number: {requestNumber}</p>
        </div>

        <div className="flex items-center gap-[16px] flex-wrap justify-center">
          <button data-secondary-btn type="button"
            className="h-[46px] px-[24px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[10px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            Download
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3v10M6 9l4 4 4-4" /><path d="M4 16h12" />
            </svg>
          </button>
          <button data-secondary-btn type="button"
            className="h-[46px] px-[24px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[10px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            Share
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="15" cy="5" r="2" /><circle cx="5" cy="10" r="2" /><circle cx="15" cy="15" r="2" />
              <path d="M6.8 9L13.2 6M6.8 11l6.4 3" />
            </svg>
          </button>
          <button data-secondary-btn type="button" onClick={onViewDeclaration}
            className="h-[46px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>View Declaration</button>
        </div>
      </div>
    </div>
  );
}
