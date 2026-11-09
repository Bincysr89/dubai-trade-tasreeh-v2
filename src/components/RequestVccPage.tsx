import React from 'react';
import BackToListingBar from './BackToListingBar';

type Props = { onBack: () => void; onSearch?: (declarationNumber: string) => void };

const STEPS: { num: number; title: string; body: string }[] = [
  { num: 1, title: 'Request Submission',  body: 'Fill the request information like, regime type, declaration Type, cargo channel etc' },
  { num: 2, title: 'Invoice Details',     body: 'Upload or add manually the invoice and HS code details of the cargo.' },
  { num: 3, title: 'Document Upload',     body: 'Upload all the relevant documents required for customs and permit documents' },
  { num: 4, title: 'Proceed to Declaration / Proceed to Permit', body: 'Proceed to apply for permit if applicable for HS Codes provided or continue to submit for Declaration' },
  { num: 5, title: 'Declaration - General Information', body: 'Fill the form with other information details' },
  { num: 6, title: 'Declaration - Pay & Submit',        body: 'Review the details and complete the declaration payment.' },
];

const HELP_TABS = ['Information', 'Tutorials', "Common FAQ’s", 'Updates', 'Downloads'];

const Section = ({ title }: { title: string }) => (
  <div className="bg-[#f9f9f9] flex items-center justify-between px-[22px] py-[16px] rounded-[4px] w-full">
    <p className="text-[20px] text-[#060c28] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{title}</p>
    <button className="size-[28px] rounded-full bg-[#a6a6a6] flex items-center justify-center" aria-label="Expand">
      <svg viewBox="0 0 12 14" width="6" height="14" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
        <path d="M3 2l5 5-5 5" />
      </svg>
    </button>
  </div>
);

export default function RequestVccPage({ onBack, onSearch }: Props) {
  const [declNumber, setDeclNumber] = React.useState('');
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent strip */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Main scroll area */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px] flex flex-col gap-[16px]">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[4px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
          Request VCC
        </h1>
        {/* Declaration Details card */}
        <div className="bg-white rounded-[8px] px-[24px] py-[20px] flex flex-col gap-[20px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
            Declaration Details
          </p>
          <div className="flex gap-[20px] items-center flex-wrap">
            {/* Floating-label input */}
            <div className="relative w-[397px] max-w-full">
              <input
                type="text"
                value={declNumber}
                onChange={(e) => setDeclNumber(e.target.value)}
                placeholder="Enter Declaration Number"
                className="dt-decl-input w-full h-[56px] rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                style={{ fontFamily: "'Dubai', sans-serif" }}
                onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.(declNumber); }}
              />
              <style>{`.dt-decl-input::placeholder { color: #455174; opacity: 1; }`}</style>
            </div>
            <button
              onClick={() => onSearch?.(declNumber)}
              className="h-[56px] px-[28px] rounded-[4px] text-[16px] text-white hover:bg-[#0E4DB8] transition-colors"
              style={{ background: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Help and Guides */}
        <div className="flex flex-col gap-[40px] mt-[44px]">
          <div className="flex items-center gap-[20px]">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 0-1.5 1-1.5 2" strokeLinecap="round" />
              <circle cx="12" cy="17" r="1" fill="#1360d2" />
            </svg>
            <h2 className="text-[24px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
              Help and Guides
            </h2>
          </div>

          {/* Tabs */}
          <div className="flex gap-[34px] items-center border-b border-[#ddd]">
            {HELP_TABS.map((tab, i) => {
              const active = i === 0;
              return (
                <button
                  key={tab}
                  className="flex flex-col items-start pb-[20px] pt-[16px] px-[6px] min-w-[140px]"
                  style={{ borderBottom: active ? '3px solid #1360d2' : 'none' }}
                >
                  <span className="text-[16px] whitespace-nowrap" style={{ color: active ? '#1360d2' : '#051937', fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                    {tab}
                  </span>
                </button>
              );
            })}
          </div>

          {/* About */}
          <div className="flex flex-col gap-[24px]">
            <p className="text-[20px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>About the Service</p>
            <p className="text-[16px] text-black" style={{ fontFamily: "'Dubai', sans-serif" }}>
              Integrated Clearance is a service that enables customers to complete the entire customs clearance process, including obtaining permits from the relevant issuing authorities.
            </p>
            <p className="text-[16px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
              <span className="text-black">View the declaration assistanct. </span>
              <a href="#" className="text-[#1360d2] hover:underline">Click here</a>
            </p>
          </div>

          {/* Service Delivery Procedure */}
          <div className="flex flex-col gap-[24px]">
            <p className="text-[20px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Service Delivery Procedure</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[14px]">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className="bg-white rounded-[12px] px-[22px] py-[20px] flex flex-col gap-[24px] min-h-[180px]"
                  style={{ boxShadow: '0px 4px 12px rgba(217,217,217,0.53)' }}
                >
                  <div className="size-[32px] bg-[#1aac72] rounded-full flex items-center justify-center text-white text-[16px]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                    {s.num}
                  </div>
                  <div className="flex flex-col gap-[8px]">
                    <p className="text-[16px] text-[#060c28]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>{s.title}</p>
                    <p className="text-[16px] text-black" style={{ fontFamily: "'Dubai', sans-serif" }}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Collapsed sections */}
          <div className="flex flex-col gap-[22px]">
            <Section title="Services Details" />
            <Section title="Service Fee" />
            <Section title="Required Documents" />
          </div>
        </div>
      </div>

      <BackToListingBar onBack={onBack} />
    </div>
  );
}
