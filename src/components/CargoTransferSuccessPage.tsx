import React from 'react';
import HappinessMeterBar from './HappinessMeterBar';

type Props = { onBack: () => void; requestNumber?: string; cargoTransferNumber?: string; mode?: 'create' | 'amend' | 'cancel'; onViewDetails?: () => void; transferType?: string; transferNumber?: string };

function formatTransferTypeTitle(type: string): string {
  if (!type) return 'Cargo Transfer';
  const parts = type.split(' - ');
  if (parts.length === 2) {
    const main = parts[0].replace(/^From\s+/, 'from ');
    return `Cargo Transfer ${main} (${parts[1]})`;
  }
  return type;
}

export default function CargoTransferSuccessPage({ onBack, requestNumber = '12345678', cargoTransferNumber, mode = 'create', onViewDetails, transferType = '', transferNumber = '' }: Props) {
  const headline = mode === 'amend'
    ? 'Cargo Transfer Amendment Request Submitted Successfully'
    : mode === 'cancel'
      ? 'Cargo Transfer Cancellation Request Submitted Successfully'
      : 'Cargo Transfer Request Submitted Successfully';
  const body = mode === 'amend'
    ? 'Your cargo transfer amendment request has been submitted successfully and sent for approval.'
    : mode === 'cancel'
      ? 'Your cargo transfer cancellation request has been submitted successfully and sent for approval.'
      : 'Your cargo transfer request submitted successfully. Please click on view details button for the details.';
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[20px] pb-[6px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          {mode === 'amend'
            ? `Amend - ${formatTransferTypeTitle(transferType)}${transferNumber ? ` - ${transferNumber}` : ''}`
            : mode === 'cancel'
            ? 'Cancel Cargo Transfer Request'
            : 'Cargo Transfer - New Request'}
        </h1>
        {/* Important Update banner */}
        <div className="flex flex-col gap-[8px] p-[16px] rounded-[8px] mb-[24px]"
          style={{ background: '#fffbf0', border: '1px solid #fff2d1' }}>
          <div className="flex items-center gap-[8px]">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#cc9200" strokeWidth="1.8" />
              <line x1="12" y1="8" x2="12" y2="13" stroke="#cc9200" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="16.5" r="1" fill="#cc9200" />
            </svg>
            <span className="text-[16px] text-[#cc9200]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Important Update</span>
          </div>
          <p className="text-[16px] text-[#455174]" style={{ fontFamily: "'Dubai', sans-serif", lineHeight: 1.32 }}>
            Declaration and claim submissions, via Dubai Trade, may currently be authenticated using Digital Certificate based
            authentication is available for a temporary period only and will be discontinued at later date, to be announced
            by Dubai Customs in due course
          </p>
        </div>

        <div className="bg-white rounded-[8px] flex flex-col items-center gap-[40px] px-[24px] py-[60px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
            <circle cx="50" cy="50" r="44" fill="#28A745" />
            <path d="M30 51 l13 13 27 -29" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>

          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
            {headline}
          </p>

          <div className="text-center text-[16px] text-[#696f83] max-w-[776px]" style={{ fontFamily: "'Dubai', sans-serif", lineHeight: 1.3 }}>
            <p>{body}</p>
          </div>

          <div className="flex flex-col items-center gap-[8px]">
            <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] flex items-center gap-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
              <span className="text-[16px] text-[#696f83]">Request Number:</span>
              <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>{requestNumber}</span>
            </div>
            {(mode === 'amend' || mode === 'cancel' || cargoTransferNumber) && (
              <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] flex items-center gap-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                <span className="text-[16px] text-[#696f83]">Cargo Transfer Number:</span>
                <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>{cargoTransferNumber || 'CT-2024-00112'}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-[16px]">
            <button data-secondary-btn
              onClick={onBack}
              className="h-[52px] px-[40px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, textTransform: 'capitalize' }}
            >
              Back to Listing
            </button>
            <button
              onClick={() => onViewDetails?.()}
              className="h-[52px] px-[40px] rounded-[4px] bg-[#1360d2] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, textTransform: 'capitalize' }}
            >
              View Cargo Transfer Details
            </button>
          </div>
        </div>
      </div>
      <HappinessMeterBar />
    </div>
  );
}
