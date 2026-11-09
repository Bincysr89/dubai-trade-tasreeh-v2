import React from 'react';
import HappinessMeterBar from './HappinessMeterBar';

type Props = {
  onBackToListing: () => void;
  onShowPaymentFailed?: () => void;
  requestNumber?: string;
  vccCount?: number;
};

export default function VccPaymentSuccessPage({
  onBackToListing,
  onShowPaymentFailed,
  requestNumber = '25365',
  vccCount = 2,
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
            className="text-center text-[26px] text-[#0e1b3d]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700, lineHeight: 1.3 }}
          >
            VCC Request Created - Payment Confirmation
          </p>

          {/* Content block — Request Number 20px, line-height 1.9 */}
          <div
            className="text-center text-[#0e1b3d] max-w-[640px]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, lineHeight: 1.9 }}
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

          {/* Action buttons */}
          <div className="flex flex-wrap gap-[16px] justify-center pt-[8px]">
            <button
              onClick={onBackToListing}
              className="h-[48px] px-[20px] rounded-[4px] bg-[#1360d2] text-white hover:bg-[#0E4DB8] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16, minWidth: 180 }}
            >
              Back to Listing
            </button>
          </div>

          {/* Demo shortcut */}
          {onShowPaymentFailed && (
            <button
              onClick={onShowPaymentFailed}
              className="text-[16px] text-[#697498] underline hover:text-[#1360d2] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif" }}
            >
              show if payment failed
            </button>
          )}
        </div>
      </div>
      <HappinessMeterBar />
    </div>
  );
}
