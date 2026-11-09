import React from 'react';
import HappinessMeterBar from './HappinessMeterBar';

type Props = {
  onBackToListing: () => void;
  onRecheckStatus: () => void;
  onPaymentFailed?: () => void;
  requestNumber?: string;
};

export default function VccEPaymentSuccessPage({
  onBackToListing,
  onRecheckStatus,
  onPaymentFailed,
  requestNumber = '12345',
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
          {/* Processing icon */}
          <div aria-hidden>
            <div style={{ display: 'inline-block' }}>
              <svg width="96" height="96" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M49.6656 32.3052C47.7559 32.3052 46.1935 30.7427 46.1935 28.8331L46.1935 14.9447C46.1935 13.0351 47.7559 11.4727 49.6656 11.4727C51.5752 11.4727 53.1377 13.0351 53.1377 14.9447L53.1377 28.8331C53.1377 30.7427 51.5752 32.3052 49.6656 32.3052ZM49.6656 87.8585C47.7559 87.8585 46.1935 86.2961 46.1935 84.3864L46.1935 70.4981C46.1935 68.5884 47.7559 67.026 49.6656 67.026C51.5752 67.026 53.1377 68.5884 53.1377 70.4981L53.1377 84.3864C53.1377 86.2961 51.5752 87.8585 49.6656 87.8585ZM84.3864 53.1377L70.4981 53.1377C68.5884 53.1377 67.026 51.5752 67.026 49.6656C67.026 47.7559 68.5884 46.1935 70.4981 46.1935L84.3864 46.1935C86.2961 46.1935 87.8585 47.7559 87.8585 49.6656C87.8585 51.5752 86.2961 53.1377 84.3864 53.1377ZM28.8331 53.1377L14.9447 53.1377C13.0351 53.1377 11.4727 51.5752 11.4727 49.6656C11.4727 47.7559 13.0351 46.1935 14.9447 46.1935L28.8331 46.1935C30.7427 46.1935 32.3052 47.7559 32.3052 49.6656C32.3052 51.5752 30.7427 53.1377 28.8331 53.1377ZM74.2132 77.6853C73.3105 77.6853 72.4424 77.3381 71.748 76.6784L61.922 66.8524C61.6006 66.5309 61.3456 66.1493 61.1716 65.7293C60.9977 65.3093 60.9081 64.8592 60.9081 64.4046C60.9081 63.95 60.9977 63.4998 61.1716 63.0798C61.3456 62.6598 61.6006 62.2782 61.922 61.9567C62.2435 61.6353 62.6251 61.3803 63.0451 61.2063C63.4651 61.0324 63.9152 60.9428 64.3698 60.9428C64.8245 60.9428 65.2746 61.0324 65.6946 61.2063C66.1146 61.3803 66.4962 61.6353 66.8177 61.9567L76.6437 71.7827C77.1282 72.2676 77.4577 72.8856 77.5903 73.5581C77.7229 74.2306 77.6527 74.9274 77.3885 75.5599C77.1243 76.1924 76.6781 76.7322 76.1066 77.1106C75.5351 77.489 74.8639 77.689 74.1785 77.6853H74.2132ZM34.9439 38.416C34.0412 38.416 33.1732 38.0688 32.4788 37.4091L22.6528 27.5831C22.3313 27.2617 22.0763 26.8801 21.9024 26.4601C21.7284 26.0401 21.6388 25.5899 21.6388 25.1353C21.6388 24.6807 21.7284 24.2306 21.9024 23.8106C22.0763 23.3906 22.3313 23.0089 22.6528 22.6875C22.9742 22.366 23.3558 22.111 23.7758 21.9371C24.1958 21.7631 24.646 21.6736 25.1006 21.6736C25.5552 21.6736 26.0053 21.7631 26.4253 21.9371C26.8453 22.111 27.227 22.366 27.5484 22.6875L37.3744 32.5135C37.8589 32.9984 38.1884 33.6163 38.321 34.2888C38.4536 34.9613 38.3834 35.6581 38.1192 36.2906C37.8551 36.9231 37.4089 37.4629 36.8373 37.8413C36.2658 38.2197 35.5947 38.4198 34.9092 38.416H34.9439ZM25.1179 77.6853C24.2152 77.6853 23.3472 77.3381 22.6528 76.6784C22.3309 76.3572 22.0755 75.9756 21.9013 75.5556C21.7271 75.1356 21.6374 74.6853 21.6374 74.2306C21.6374 73.7758 21.7271 73.3256 21.9013 72.9055C22.0755 72.4855 22.3309 72.104 22.6528 71.7827L32.4788 61.9567C32.8002 61.6353 33.1818 61.3803 33.6018 61.2063C34.0218 61.0324 34.472 60.9428 34.9266 60.9428C35.3812 60.9428 35.8313 61.0324 36.2513 61.2063C36.6713 61.3803 37.0529 61.6353 37.3744 61.9567C37.6959 62.2782 37.9508 62.6598 38.1248 63.0798C38.2988 63.4998 38.3883 63.95 38.3883 64.4046C38.3883 64.8592 38.2988 65.3093 38.1248 65.7293C37.9508 66.1493 37.6959 66.5309 37.3744 66.8524L27.5484 76.6784C26.854 77.3728 25.986 77.6853 25.0832 77.6853H25.1179ZM64.3872 38.416C63.4845 38.416 62.6164 38.0688 61.922 37.4091C61.6002 37.0879 61.3448 36.7064 61.1706 36.2863C60.9963 35.8663 60.9066 35.416 60.9066 34.9613C60.9066 34.5066 60.9963 34.0563 61.1706 33.6363C61.3448 33.2162 61.6002 32.8347 61.922 32.5135L71.748 22.6875C72.0695 22.366 72.4511 22.111 72.8711 21.9371C73.2911 21.7631 73.7412 21.6736 74.1958 21.6736C74.6504 21.6736 75.1006 21.7631 75.5206 21.9371C75.9406 22.111 76.3222 22.366 76.6437 22.6875C76.9651 23.0089 77.2201 23.3906 77.3941 23.8106C77.568 24.2306 77.6576 24.6807 77.6576 25.1353C77.6576 25.5899 77.568 26.0401 77.3941 26.4601C77.2201 26.8801 76.9651 27.2617 76.6437 27.5831L66.8177 37.4091C66.1232 38.1035 65.2552 38.416 64.3525 38.416H64.3872Z" fill="#375EF9"/>
              </svg>
            </div>
          </div>

          <p
            className="text-center text-[26px] text-[#0e1b3d]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700, lineHeight: 1.3 }}
          >
            VCC Request Received - ePayment Processing
          </p>

          {/* Content block — same style as credit/debit success */}
          <div
            className="text-center text-[#0e1b3d] max-w-[640px]"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, lineHeight: 1.9 }}
          >
            <span style={{ fontSize: 16 }}>
              Your request has been received. Your ePayment transaction is under processing and will be completed shortly.
            </span>
            <br />
            <span style={{ fontSize: 20, fontWeight: 700 }}>
              Request Number: {requestNumber}
            </span>
            <br />
            <span style={{ fontSize: 16 }}>
              You can download digital VCC from the listing page with request number after successful ePayment processing.
            </span>
          </div>

          {/* Action buttons — Scenario 3: Payment In Progress */}
          <div className="flex flex-col items-center gap-[16px] pt-[8px]">
            <div className="flex flex-wrap gap-[16px] justify-center">
              <button
                onClick={onRecheckStatus}
                className="h-[48px] px-[20px] inline-flex items-center justify-center gap-[8px] rounded-[4px] bg-[#1360d2] text-white hover:bg-[#0E4DB8] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16, minWidth: 200 }}
              >
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4a7 7 0 1 1 0 12" /><path d="M1 4h3v3" />
                </svg>
                Check e-Payment Status
              </button>
              <button data-secondary-btn
                onClick={onBackToListing}
                className="h-[48px] px-[20px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16, minWidth: 160 }}
              >
                Back to Listing
              </button>
            </div>
            {onPaymentFailed && (
              <button
                onClick={onPaymentFailed}
                className="text-[16px] text-[#c0392b] underline hover:opacity-80 transition-opacity"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                Simulate Payment Failed
              </button>
            )}
          </div>
        </div>
      </div>
      <HappinessMeterBar />
    </div>
  );
}
