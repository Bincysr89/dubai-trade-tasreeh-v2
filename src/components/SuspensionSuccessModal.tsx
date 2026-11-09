import React from 'react';

const font = "'Dubai', sans-serif";

type Props = {
  onClose: () => void;
  onBackToListing: () => void;
};

export default function SuspensionSuccessModal({ onClose, onBackToListing }: Props) {
  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(14,27,61,0.53)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[8px] overflow-hidden flex flex-col items-center py-[48px] px-[48px]"
        style={{ width: 520, boxShadow: '0 4px 32px rgba(0,0,0,0.16)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green checkmark */}
        <div
          className="flex items-center justify-center rounded-full mb-[32px]"
          style={{ width: 100, height: 100, background: '#28a745' }}
        >
          <svg viewBox="0 0 52 52" width="52" height="52" fill="none">
            <polyline points="12,26 22,36 40,18" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2
          className="text-[24px] font-medium text-center mb-[12px]"
          style={{ color: '#111838', fontFamily: font }}
        >
          Response Submitted Successfully
        </h2>

        <p
          className="text-[20px] font-medium text-center mb-[32px]"
          style={{ color: '#111838', fontFamily: font }}
        >
          Request Number: 54689678
        </p>

        <div className="flex items-center gap-[20px]">
          <button
            onClick={onClose}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] uppercase text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font, minWidth: 128 }}
          >
            Close
          </button>
          <button
            onClick={onBackToListing}
            className="h-[48px] px-[20px] rounded-[3px] text-[16px] text-white hover:opacity-90 transition-opacity"
            style={{ background: '#1360d2', fontFamily: font, minWidth: 163 }}
          >
            Back To Listing
          </button>
        </div>
      </div>
    </div>
  );
}
