import React, { useState } from 'react';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onCancel: () => void;
  onBackToListing?: () => void;
  requestNumber?: string;
};

export default function SaveExitModal({ onCancel, onBackToListing, requestNumber = 'RC-2588017' }: Props) {
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
        <div className="bg-white rounded-[12px] flex flex-col items-center gap-[24px] px-[48px] py-[48px] max-w-[480px] w-full mx-[16px]"
          style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>

          {/* Green check badge */}
          <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full" style={{ background: '#e6f9ee' }}>
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="16" fill="#28a745" />
              <path d="M10 18l6 6 10-11" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <div className="text-center flex flex-col gap-[8px]">
            <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Draft Saved Successfully</p>
            <p className="text-[16px] text-[#697498]">Your claim details have been saved as a draft.</p>
            <p className="text-[16px] text-[#051937]" style={{ fontWeight: 600 }}>Claim Request Number: {requestNumber}</p>
          </div>

          <button onClick={onBackToListing}
            className="h-[48px] px-[32px] rounded-[4px] text-white text-[16px] transition-colors"
            style={{ background: '#1360d2', fontWeight: 500, minWidth: 180, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Back to Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-[12px] flex flex-col items-center gap-[28px] px-[48px] py-[40px] max-w-[440px] w-full mx-[16px]"
        style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>

        {/* Warning icon */}
        <div className="flex items-center justify-center w-[64px] h-[64px] rounded-full" style={{ background: '#fff8e6' }}>
          <svg viewBox="0 0 96 96" fill="none" width="36" height="36">
            <circle cx="48" cy="48" r="42" fill="none" stroke="#FFC020" strokeWidth="7" />
            <rect x="44.5" y="22" width="7" height="32" rx="3.5" fill="#FFC020" />
            <circle cx="48" cy="68" r="4.5" fill="#FFC020" />
          </svg>
        </div>

        <div className="text-center flex flex-col gap-[8px]">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Save &amp; Exit</p>
          <p className="text-[16px] text-[#697498]">Are you sure you want to save the details?</p>
          <p className="text-[14px] text-[#697498]">Your progress will be saved as a draft and can be resumed later.</p>
        </div>

        <div className="flex gap-[12px] w-full">
          <button data-secondary-btn onClick={onCancel}
            className="flex-1 h-[48px] rounded-[4px] border text-[16px] bg-white transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            No
          </button>
          <button onClick={() => setSaved(true)}
            className="flex-1 h-[48px] rounded-[4px] text-white text-[16px] transition-colors"
            style={{ background: '#1360d2', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
