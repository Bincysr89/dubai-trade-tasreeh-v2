import React from 'react';
import HappinessMeterBar from './HappinessMeterBar';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  onBack: () => void;
  onCreateAnother?: () => void;
  onPrintAck?: () => void;
  onViewDocs?: () => void;
  claimRequestNo?: string;
  claimNo?: string;
  email?: string;
  code?: string;
};

export default function ClaimSubmittedSuccessPage({
  onBack,
  onCreateAnother,
  onPrintAck,
  onViewDocs,
  claimRequestNo = '4701751',
  claimNo = '3842003',
  email = 'trader@example.com',
  code = 'A180',
}: Props) {
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

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px] flex flex-col gap-[20px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>
          Claim Submission Confirmation
        </h1>

        {/* Green success banner */}
        <div className="flex items-start gap-[12px] rounded-[8px] px-[20px] py-[16px]" style={{ background: '#d4edda', border: '1px solid #c3e6cb' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#155724" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-[2px]">
            <circle cx="12" cy="12" r="9" />
            <path d="M9 12l2 2 4-4" />
          </svg>
          <p className="text-[16px] text-[#155724]" style={{ lineHeight: 1.5 }}>
            <strong>Success:</strong> Claim Submission request <strong>{claimRequestNo}</strong> has been processed. Claim No. <strong>{claimNo}</strong> has been submitted successfully.
          </p>
        </div>

        {/* Yellow info banner — email notification */}
        <div className="flex items-start gap-[12px] rounded-[8px] px-[20px] py-[14px]" style={{ background: '#fff8e1', border: '1px solid #ffe082' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#856404" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-[2px]">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          <p className="text-[16px] text-[#856404]" style={{ lineHeight: 1.5 }}>
            All email messages, related to submission, suspension, approval or rejection of this claim, will be sent to <strong>{email}</strong> for <strong>{code}</strong>.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-[12px] flex-wrap pt-[8px]">
          <button data-secondary-btn
            onClick={onCreateAnother ?? onBack}
            className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >
            Create New
          </button>
          <button
            onClick={onPrintAck ?? onBack}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fab] transition-colors"
            style={{ background: '#1360d2', fontWeight: 500 }}
          >
            Print Claim Acknowledgement Receipt
          </button>
        </div>
      </div>
      <HappinessMeterBar />
    </div>
  );
}
