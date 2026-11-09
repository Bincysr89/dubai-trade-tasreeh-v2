import React from 'react';
import HappinessMeterBar from './HappinessMeterBar';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onBack: () => void;
  onViewAck: () => void;
  onViewClaim?: () => void;
  onViewDocs?: () => void;
  /** Overrides for reuse outside the NR flow (e.g. missing-doc refund of deposits). */
  title?: string;
  heading?: string;
  message?: string;
  /** Overrides for reuse outside claim flows (e.g. Validity Extension, which has no claim). */
  requestNumberLabel?: string;
  registrationNumberLabel?: string;
  /** Hides the "View Claim" button — set when the request being confirmed isn't a claim. */
  hideViewClaim?: boolean;
};

export default function NonRemittanceSuccessPage({ onBack, onViewAck, onViewClaim, onViewDocs, title, heading, message, requestNumberLabel = 'Claim Request Number:', registrationNumberLabel = 'Claim No.:', hideViewClaim = false }: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <div className="mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Non Remittance'}</h1>
        </div>

        {/* Success card */}
        <div className="bg-white rounded-[8px] flex flex-col items-center gap-[32px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          {/* Green checkmark */}
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" fill="#28A745" />
            <path d="M30 51 l13 13 27-29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontWeight: 500 }}>
            {heading ?? 'Non Remittance Claim Submitted Successfully'}
          </p>

          <p className="text-[16px] text-[#696f83] text-center max-w-[640px]" style={{ lineHeight: 1.5 }}>
            {message ?? 'Your Non Remittance Claim has been submitted successfully and is currently under processing. Please click on View Claim button for the details.'}
          </p>

          {/* Info banners */}
          <div className="w-full max-w-[640px] flex flex-col gap-[12px]">
            <div className="flex items-start gap-[12px] rounded-[6px] px-[16px] py-[14px]" style={{ background: '#fff8e1', border: '1px solid #f5c842' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                <circle cx="11" cy="11" r="10" fill="#f5c842" />
                <text x="11" y="16" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">i</text>
              </svg>
              <p className="text-[15px] text-[#b45309]" style={{ lineHeight: 1.5 }}>
                All email messages, related to submission, suspension, approval or rejection of this claim, will be sent to <strong>infogain.sandeepk@dubaicustoms.ae</strong> for <strong>AE-9106286</strong>.
              </p>
            </div>
          </div>

          {/* Reference chips */}
          <div className="flex flex-col sm:flex-row items-center gap-[12px]">
            <div className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[10px] flex items-center gap-[8px]">
              <span className="text-[16px] text-[#696f83]">{requestNumberLabel}</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 600 }}>2588017</span>
            </div>
            <div className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[10px] flex items-center gap-[8px]">
              <span className="text-[16px] text-[#696f83]">{registrationNumberLabel}</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 600 }}>2420390 (Under Processing)</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-[14px]">
            <button data-secondary-btn
              onClick={onBack}
              className="h-[52px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Back to Listing
            </button>
            <button data-secondary-btn
              onClick={onViewAck}
              className="h-[52px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Print Claim Acknowledgement Receipt
            </button>
            {!hideViewClaim && (
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
