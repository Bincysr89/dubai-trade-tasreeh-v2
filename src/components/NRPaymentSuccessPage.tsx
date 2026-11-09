import React from 'react';
import HappinessMeterBar from './HappinessMeterBar';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onBackToListing: () => void;
  onDownloadAck?: () => void;
  onViewClaim?: () => void;
  requestNumber?: string;
  title?: string;
};

export default function NRPaymentSuccessPage({
  onBackToListing,
  onDownloadAck,
  onViewClaim,
  requestNumber = '2588017',
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
          {/* Green checkmark */}
          <div className="relative" aria-hidden>
            <svg viewBox="0 0 96 96" fill="none" style={{ width: 80, height: 80, display: 'block' }}>
              <circle cx="48" cy="48" r="42" stroke="#28a745" strokeWidth="7" fill="none" />
              <path d="M28 50l14 14 26-28" stroke="#28a745" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 0 8px rgba(40,167,69,0.10)' }} />
          </div>

          <p className="text-center text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700, lineHeight: 1.3 }}>
            Claim Submitted - Payment Successful
          </p>

          <div className="text-center text-[#0e1b3d] max-w-[640px]" style={{ lineHeight: 1.9 }}>
            <span style={{ fontSize: 16 }}>
              Your Non-Remittance claim has been successfully submitted and payment has been received.
            </span>
            <br />
            <span style={{ fontSize: 20, fontWeight: 700 }}>
              Request Number: {requestNumber}
            </span>
            <br />
            <span style={{ fontSize: 16 }}>
              You can track the status of your claim from the listing page.
            </span>
          </div>

          <div className="flex flex-wrap gap-[14px] justify-center pt-[8px]">
            <button data-secondary-btn
              onClick={onBackToListing}
              className="h-[52px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Back to Listing
            </button>
            {onDownloadAck && (
              <button data-secondary-btn
                onClick={onDownloadAck}
                className="h-[52px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
              >
                Download Acknowledgment Receipt
              </button>
            )}
            {onViewClaim && (
              <button
                onClick={onViewClaim}
                className="h-[52px] px-[32px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
                style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
              >
                View Claim
              </button>
            )}
          </div>
        </div>
      </div>
      <HappinessMeterBar />
    </div>
  );
}
