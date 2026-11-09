import React, { useEffect } from 'react';

type Props = {
  open: boolean;
  requestNumber?: string;
  vccCount?: number;
  onClose: () => void;
};

export default function VccRecheckSuccessModal({ open, requestNumber = '25347', vccCount = 2, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const font = "'Dubai', sans-serif";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      style={{ background: 'rgba(5,25,55,0.45)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white rounded-[12px] flex flex-col items-center gap-[24px] px-[40px] py-[48px] mx-[16px]"
        style={{ width: '100%', maxWidth: 520, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
      >
        {/* Green check icon */}
        <div className="relative" aria-hidden>
          <svg viewBox="0 0 96 96" fill="none" style={{ width: 72, height: 72, display: 'block' }}>
            <circle cx="48" cy="48" r="42" fill="#28A745" />
            <path
              d="M30 49 l13 13 23 -27"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 8px rgba(40,167,69,0.10)' }} />
        </div>

        <p
          className="text-center text-[22px] text-[#0e1b3d]"
          style={{ fontFamily: font, fontWeight: 700, lineHeight: 1.3 }}
        >
          VCC Request Created - Payment Confirmation
        </p>

        <div
          className="text-center text-[#0e1b3d] w-full"
          style={{ fontFamily: font, fontWeight: 400, lineHeight: 1.9 }}
        >
          <span style={{ fontSize: 16 }}>
            Your VCC request is accepted and {vccCount} VCC&apos;s generated successfully.
          </span>
          <br />
          <span style={{ fontSize: 20, fontWeight: 700 }}>
            Request Number: {requestNumber}
          </span>
          <br />
          <span style={{ fontSize: 16 }}>
            Please download the digital VCC from listing page. In case VCC&apos;s are not found, please try after sometime by searching with your request number.
          </span>
        </div>

        <div className="flex flex-wrap gap-[12px] justify-center pt-[4px]">
          <button data-secondary-btn
            onClick={onClose}
            className="h-[48px] px-[24px] inline-flex items-center justify-center gap-[8px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
            style={{ fontFamily: font, fontWeight: 500, fontSize: 16, minWidth: 150 }}
          >
            Download VCC&apos;s
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="h-[48px] px-[24px] rounded-[4px] bg-[#1360d2] text-white hover:bg-[#0E4DB8] transition-colors"
            style={{ fontFamily: font, fontWeight: 500, fontSize: 16, minWidth: 160 }}
          >
            Back to Listing
          </button>
        </div>
      </div>
    </div>
  );
}
