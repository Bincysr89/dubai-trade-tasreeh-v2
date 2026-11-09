import React from 'react';

type Props = {
  onBackToListing: () => void;
  onMakePayment: () => void;
  onChangePaymentMode?: () => void;
  requestNumber?: string;
  totalCharges?: number;
};

export default function VccEPaymentPendingPage({
  onBackToListing,
  onMakePayment,
  onChangePaymentMode,
  requestNumber = '25365',
  totalCharges = 30,
}: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent badge */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>VCC Request</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          VCC Request
        </h1>
        <div
          className="bg-white rounded-[8px] flex flex-col items-center gap-[28px] px-[20px] py-[40px]"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
        >
          {/* Yellow pending / warning icon — circle with exclamation */}
          <div className="relative" aria-hidden>
            <svg viewBox="0 0 96 96" fill="none" style={{ width: 72, height: 72, display: 'block' }}>
              <circle cx="48" cy="48" r="42" fill="none" stroke="#FFC020" strokeWidth="7" />
              <rect x="44.5" y="24" width="7" height="34" rx="3.5" fill="#FFC020" />
              <circle cx="48" cy="70" r="4.5" fill="#FFC020" />
            </svg>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 8px rgba(255,192,32,0.14)' }} />
          </div>

          <p
            className="text-center text-[26px] text-[#0e1b3d]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700, lineHeight: 1.3 }}
          >
            VCC Request Submitted - Payment Pending
          </p>

          {/* Content block — same style as credit/debit success */}
          <div
            className="text-center text-[#0e1b3d] max-w-[640px]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, lineHeight: 1.9 }}
          >
            <span style={{ fontSize: 16 }}>
              Your VCC request has been processed. Please initiate the payment transaction.
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

          {/* Action buttons */}
          <div className="flex flex-wrap gap-[16px] justify-center pt-[8px]">
            <button
              onClick={onMakePayment}
              className="h-[48px] px-[24px] rounded-[4px] bg-[#1360d2] text-white hover:bg-[#0E4DB8] transition-colors inline-flex items-center gap-[8px]"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16, minWidth: 180, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="16" height="12" rx="2"/>
                <path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/>
              </svg>
              Make e-Payment
            </button>
            <button data-secondary-btn
              onClick={onChangePaymentMode ?? onBackToListing}
              className="h-[48px] px-[20px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16, minWidth: 180 }}
            >
              Change Payment Mode
            </button>
            <button data-secondary-btn
              onClick={onBackToListing}
              className="h-[48px] px-[20px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16, minWidth: 160 }}
            >
              Back to Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
