import React from 'react';
import { font } from './DeclarationUI';

const stepDoneSrc = new URL('../../assets/declaration/step-check.svg', import.meta.url).href;
const stepTodoSrc = new URL('../../assets/declaration/step-inactive.svg', import.meta.url).href;

type Props = {
  onContinueToOga?: () => void;
  onViewDeclaration?: () => void;
};

/** Declaration submitted — Figma 2650:54356. */
export default function DeclarationSuccessPage({ onContinueToOga, onViewDeclaration }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      {/* Completion banner with the two-step Custom Declaration → OGA tracker */}
      <div className="bg-white rounded-[8px] px-[24px] py-[20px] flex items-center justify-between gap-[24px] flex-wrap"
        style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex flex-col gap-[6px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Declaration Completed</p>
          <p className="text-[14px] text-[#697498]">Click on ‘Continue’ to move to the next step</p>
          <div className="flex items-center gap-[8px] mt-[8px]">
            <img src={stepDoneSrc} alt="" width={24} height={24} className="flex-shrink-0" />
            <span className="text-[14px]" style={{ color: '#219653', fontWeight: 700 }}>Custom Declaration</span>
            <span style={{ width: 88, height: 2, background: '#28a745' }} />
            <img src={stepTodoSrc} alt="" width={24} height={24} className="flex-shrink-0" />
            <span className="text-[14px]" style={{ color: '#697498', fontWeight: 500 }}>OGA</span>
          </div>
        </div>
        <button
          type="button"
          onClick={onContinueToOga}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white hover:bg-[#0f4fb5] transition-colors flex-shrink-0"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Continue To OGA</button>
      </div>

      <div className="flex flex-col items-center gap-[24px] py-[20px]">
        {/* Filled success mark */}
        <span className="inline-flex items-center justify-center rounded-full" style={{ width: 72, height: 72, background: '#219653' }}>
          <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>

        <p className="text-[20px] text-center" style={{ color: '#219653', fontWeight: 600 }}>Declaration Created Successfully !</p>

        <div className="bg-white rounded-[8px] w-full max-w-[720px] px-[32px] py-[28px] flex flex-col items-center gap-[20px]"
          style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-[15px] text-[#697498] text-center" style={{ lineHeight: 1.7 }}>
            Dear Customer Thank You For Using&nbsp; Service Request Web Application. Your Customs Declaration
            Has Been Sent For Approval, Please Find Below Details For Future Reference
          </p>
          <p className="text-[15px] text-[#0e1b3d]">
            <span className="text-[#697498]">Request No.</span>{' '}
            <span style={{ fontWeight: 700 }}>10023017</span>
          </p>
          <p className="text-[14px] text-[#0e1b3d] text-center" style={{ fontWeight: 700, lineHeight: 1.7 }}>
            Note: This Declaration Requires Physical Documents To Be Submitted To Customs Within 30days Of Clearance
            <br />
            Please Contact Care If Declaration Number Is Not Displayed Within 30 Minutes Of Declaration Submission
          </p>
        </div>

        <div className="flex items-center gap-[16px] flex-wrap justify-center">
          <button data-secondary-btn type="button"
            className="h-[48px] px-[24px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[10px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            Download
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
            </svg>
          </button>
          <button data-secondary-btn type="button"
            className="h-[48px] px-[24px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[10px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            Share
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="15" cy="5" r="2.2" /><circle cx="5" cy="10" r="2.2" /><circle cx="15" cy="15" r="2.2" />
              <path d="M6.9 8.9l6.2-3M6.9 11.1l6.2 3" />
            </svg>
          </button>
          <button data-secondary-btn type="button"
            onClick={onViewDeclaration}
            className="h-[48px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            View Declaration
          </button>
        </div>
      </div>
    </div>
  );
}
