import React from 'react';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onBackToListing: () => void;
  onRetryPayment: () => void;
  requestNumber?: string;
  totalCharges?: string;
  title?: string;
};

export default function NRPaymentRejectedPage({
  onBackToListing,
  onRetryPayment,
  requestNumber = '2588017',
  totalCharges = '120.00',
  title = 'Raise New Claim - Non Remittance',
}: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Refund &amp; Claims</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="mb-[24px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title}</h1>
        </div>
        <div
          className="bg-white rounded-[8px] flex flex-col items-center gap-[28px] px-[20px] py-[48px]"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
        >
          {/* Red X icon */}
          <div className="relative" aria-hidden>
            <svg viewBox="0 0 96 96" fill="none" style={{ width: 80, height: 80, display: 'block' }}>
              <circle cx="48" cy="48" r="42" stroke="#dc3545" strokeWidth="7" fill="none" />
              <path d="M32 32 L64 64 M64 32 L32 64" stroke="#dc3545" strokeWidth="7" strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 8px rgba(220,53,69,0.10)' }} />
          </div>

          <p className="text-center text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700, lineHeight: 1.3 }}>
            Claim Submitted - Payment Rejected
          </p>

          <div className="text-center text-[#0e1b3d] max-w-[640px]" style={{ lineHeight: 1.9 }}>
            <span style={{ fontSize: 16 }}>
              Your claim has been submitted but the payment was rejected. Please retry the payment to complete your claim.
            </span>
            <br />
            <span style={{ fontSize: 20, fontWeight: 700 }}>
              Request Number: {requestNumber}
            </span>
            <br />
            <span style={{ fontSize: 16 }}>
              Total Charges to pay - AED {totalCharges}
            </span>
          </div>

          <div className="flex flex-wrap gap-[16px] justify-center pt-[8px]">
            <button
              onClick={onRetryPayment}
              className="h-[48px] px-[24px] inline-flex items-center gap-[8px] rounded-[4px] bg-[#1360d2] text-white hover:bg-[#0E4DB8] transition-colors"
              style={{ fontFamily: font, fontWeight: 500, fontSize: 16, minWidth: 180 }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/>
              </svg>
              Retry e-Payment
            </button>
            <button data-secondary-btn
              onClick={onBackToListing}
              className="h-[48px] px-[20px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
              style={{ fontFamily: font, fontWeight: 500, fontSize: 16, minWidth: 160 }}
            >
              Back to Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
