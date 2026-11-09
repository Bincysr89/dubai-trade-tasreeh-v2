import React, { useState } from 'react';
import type { ClaimType } from './ClaimTypeSelectionPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const guideIcon = 'https://www.figma.com/api/mcp/asset/bf8c61a3-23ab-4f57-ae9d-3cd3204577b5';
const tabInfo   = 'https://www.figma.com/api/mcp/asset/de99475f-b87d-4996-8151-ef104430f818';
const tabVideo  = 'https://www.figma.com/api/mcp/asset/38f9b06b-633c-48f5-baf4-17c81f89f0fb';
const tabFaq    = 'https://www.figma.com/api/mcp/asset/a8cb12c4-cd63-4fdb-95e5-958d1a1fb6a2';
const tabUpdates= 'https://www.figma.com/api/mcp/asset/3147d413-f241-41be-8815-323fb28ee566';
const tabDownloads='https://www.figma.com/api/mcp/asset/f646c55d-ce4a-44e3-93f2-33bad3802861';
const stepArrow = 'https://www.figma.com/api/mcp/asset/8f5d38b1-54c1-4abd-b722-12a8fc3b4c5c';

type Tab = 'information' | 'tutorials' | 'faqs' | 'updates' | 'downloads';

const HELP_TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'information', label: 'Information',   icon: tabInfo },
  { id: 'tutorials',   label: 'Tutorials',      icon: tabVideo },
  { id: 'faqs',        label: "Common FAQ's",   icon: tabFaq },
  { id: 'updates',     label: 'Updates',         icon: tabUpdates },
  { id: 'downloads',   label: 'Downloads',       icon: tabDownloads },
];

const SERVICE_STEPS = [
  { num: '1', title: 'Select Claim Type',        desc: 'Choose Refund of Deposits, Refund of Duty, or Non Remittance and select eligible declarations.' },
  { num: '2', title: 'Upload Documents',          desc: 'Add remarks and attach supporting documents for each selected declaration.' },
  { num: '3', title: 'Payment & Submit',          desc: 'Review charges, select payment mode, and submit your claim.' },
];

const ACCORDION_ITEMS = [
  {
    id: 'details',
    label: 'Service Details',
    content: 'Refund & Claims allows registered traders to apply for refund of customs deposits, duty, or Non Remittance for eligible Free Zone export declarations.',
  },
  {
    id: 'fee',
    label: 'Service Fee',
    content: 'Claim Registration Charge: AED 50.00 | Knowledge-Innovation Dirham: AED 20.00 | Total: AED 70.00',
  },
  {
    id: 'docs',
    label: 'Required Documents',
    content: 'Supporting documents in PDF or TXT format, max 2 MB per file. One attachment per declaration.',
  },
];

const CLAIM_OPTIONS: { id: ClaimType; title: string; sub: string; icon: React.ReactNode }[] = [
  {
    id: 'refundDeposit',
    title: 'Refund of Deposits',
    sub: 'Duty deposit, Missing document deposit, Exemption deposits — any deposit labeled by Dubai Customs.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="9" width="22" height="15" rx="2" />
        <circle cx="16" cy="16.5" r="3.5" />
        <path d="M9 13h.01M23 20h.01" />
      </svg>
    ),
  },
  {
    id: 'refundDuty',
    title: 'Refund of Duty',
    sub: 'Cancelled or amended declarations and duty-exempted goods.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 5h13l5 5v17H8z" />
        <path d="M21 5v5h5" />
        <path d="M13 16h6M13 20h6M13 12h3" />
      </svg>
    ),
  },
  {
    id: 'nonRemittance',
    title: 'Non Remittance',
    sub: 'Applicable for Free Zone exports without any deposit.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="16" cy="16" r="11" />
        <path d="M11 16h10M16 11v10" />
      </svg>
    ),
  },
  {
    id: 'refundAuction',
    title: 'Refund on Auction Proceed',
    sub: 'Applicable for refunds against auctioned lots and their sale proceeds.',
    icon: (
      <svg viewBox="0 0 32 32" width="40" height="40" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6l7 7-11 11-7-7z" />
        <path d="M18 3l11 11" />
        <path d="M22 7l4-4" />
        <circle cx="7" cy="25" r="1.4" fill="#1360d2" stroke="none" />
      </svg>
    ),
  },
];

type Props = { onBack: () => void; onContinue: (claimType: ClaimType) => void };

export default function ClaimTypeEntryPage({ onBack, onContinue }: Props) {
  const [selected, setSelected] = useState<ClaimType | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('information');
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Claim type card — outside scroll so it's always visible */}
      <div className="px-4 sm:px-10 pb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838] mb-[16px]" style={{ fontWeight: 500 }}>Raise a New Claim - Claim Type</h1>
        <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[18px]" style={{ boxShadow: '0px 4px 16px rgba(0,0,0,0.08)' }}>
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Claim Type</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[14px]">
            {CLAIM_OPTIONS.map((opt) => {
              const active = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelected(opt.id);
                    onContinue(opt.id);
                  }}
                  className="flex items-start gap-[14px] px-[16px] py-[16px] rounded-[10px] text-left transition-colors h-full"
                  style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e0e6ef'}` }}
                >
                  <div className="size-[48px] rounded-[8px] inline-flex items-center justify-center flex-shrink-0" style={{ background: active ? '#e8f0ff' : '#f4f7fc' }}>
                    {opt.icon}
                  </div>
                  <div className="flex-1 flex flex-col gap-[4px] min-w-0">
                    <div className="flex items-center justify-between gap-[10px]">
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                      <span className="size-[20px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                        {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                      </span>
                    </div>
                    <span className="text-[13px] text-[#696f83]" style={{ lineHeight: 1.4 }}>{opt.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Help & Guides — scrollable */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[40px]">
        <div className="flex flex-col gap-[32px]">
          {/* Section title */}
          <div className="flex items-center gap-[16px]">
            <img src={guideIcon} alt="" style={{ width: 22, height: 22 }} />
            <h2 className="text-[24px] text-[#060c28]" style={{ fontWeight: 500 }}>Help and Guides</h2>
          </div>

          {/* Tab card */}
          <div className="bg-white rounded-[8px] px-[8px]" style={{ boxShadow: '0px 2px 12px rgba(0,0,0,0.06)' }}>
            <div className="flex items-center border-b border-[#ddd] overflow-x-auto">
              {HELP_TABS.map((tab) => {
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-[10px] px-[8px] py-[18px] whitespace-nowrap flex-shrink-0 transition-colors"
                    style={{ borderBottom: active ? '3px solid #1360d2' : '3px solid transparent', marginBottom: -1, minWidth: 140 }}
                  >
                    <img src={tab.icon} alt="" style={{ width: 18, height: 18, opacity: active ? 1 : 0.55 }} />
                    <span className="text-[16px]" style={{ fontWeight: 500, color: active ? '#1360d2' : '#051937', fontFamily: font }}>
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="px-[24px] py-[32px] flex flex-col gap-[40px]">
              {activeTab === 'information' && (
                <>
                  {/* About the Service */}
                  <div className="flex flex-col gap-[16px]">
                    <h3 className="text-[20px] text-[#060c28]" style={{ fontWeight: 500 }}>About the Service</h3>
                    <p className="text-[16px] text-black" style={{ fontFamily: font, lineHeight: 1.6 }}>
                      The Refund &amp; Claims service enables registered traders to submit claims for refund of customs deposits, customs duty, or Non Remittance for eligible Free Zone export declarations. Select the appropriate claim type to begin.
                    </p>
                  </div>

                  {/* Service Delivery Procedure */}
                  <div className="flex flex-col gap-[20px]">
                    <h3 className="text-[20px] text-[#060c28]" style={{ fontWeight: 500 }}>Service Delivery Procedure</h3>
                    <div className="flex items-start gap-[14px] flex-wrap justify-start">
                      {SERVICE_STEPS.map((step, i) => (
                        <React.Fragment key={step.num}>
                          <div
                            className="bg-white flex flex-col gap-[20px] px-[22px] py-[16px] rounded-[12px] flex-shrink-0 w-full sm:w-[200px] md:w-[230px]"
                            style={{ boxShadow: '0px 4px 12px rgba(217,217,217,0.53)' }}
                          >
                            <div className="size-[32px] rounded-full flex items-center justify-center text-[16px] text-white flex-shrink-0" style={{ background: '#1aac72', fontWeight: 500 }}>
                              {step.num}
                            </div>
                            <div className="flex flex-col gap-[8px]">
                              <p className="text-[16px] text-[#060c28]" style={{ fontWeight: 500 }}>{step.title}</p>
                              <p className="text-[16px] text-black" style={{ lineHeight: 1.5 }}>{step.desc}</p>
                            </div>
                          </div>
                          {i < SERVICE_STEPS.length - 1 && (
                            <img src={stepArrow} alt="" style={{ width: 80, height: 20, alignSelf: 'center', flexShrink: 0 }} />
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Accordion */}
                  <div className="flex flex-col gap-[16px]">
                    {ACCORDION_ITEMS.map((item) => {
                      const open = openAccordion === item.id;
                      return (
                        <div key={item.id} className="rounded-[4px] overflow-hidden" style={{ boxShadow: '0px 4px 0px rgba(212,212,212,0.25)' }}>
                          <button
                            onClick={() => setOpenAccordion(open ? null : item.id)}
                            className="w-full flex items-center justify-between px-[22px] py-[16px] transition-colors"
                            style={{ background: '#e8f2ff' }}
                          >
                            <span className="text-[20px] text-[#060c28]" style={{ fontWeight: 500 }}>{item.label}</span>
                            <div
                              className="size-[28px] rounded-full flex items-center justify-center transition-transform"
                              style={{ background: open ? '#1360d2' : '#a6a6a6', transform: open ? 'rotate(45deg)' : 'none' }}
                            >
                              <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
                                <path d="M7 2v10M2 7h10" />
                              </svg>
                            </div>
                          </button>
                          {open && (
                            <div className="bg-white px-[22px] py-[16px]">
                              <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{item.content}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
              {activeTab !== 'information' && (
                <div className="flex flex-col items-center justify-center py-[60px] gap-[12px]">
                  <svg viewBox="0 0 48 48" width="48" height="48" fill="none" stroke="#d5ddfb" strokeWidth="2">
                    <circle cx="24" cy="24" r="20" />
                    <path d="M24 16v8l4 4" strokeLinecap="round" />
                  </svg>
                  <p className="text-[16px] text-[#8f94ae]">Content coming soon</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar — selecting a claim type card above navigates immediately, so there's no Continue action left to take here. */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
