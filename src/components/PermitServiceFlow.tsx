import { useState } from 'react';
import MoreIcon from './MoreIcon';
import Header from './Header';

const font = "'Dubai', 'Segoe UI', sans-serif";

/* ─────────────────────────  Config types  ───────────────────────── */
export type PermitBadge = 'Submitted' | 'Pending' | 'Rejected' | 'Draft' | 'Approved';
export type ProceedField = { label: string; value?: string; required?: boolean; type?: 'text' | 'select' | 'date' | 'search' };
export type ProceedSection = { title: string; manualEntry?: boolean; fields: ProceedField[]; note?: string };

export type PermitServiceConfig = {
  title: string;
  searchLabel: string;          // e.g. 'Application Number'
  columns: string[];            // table headers (excluding Actions)
  rows: (string | PermitBadge)[][];
  filters: { label: string; type?: 'text' | 'select' | 'search' }[];
  flyout: string[];
  applicationTypes: string[];
  proceed: ProceedSection[];
  success: { heading: string; message: string[] };
};

/* ─────────────────────────  Shared bits  ───────────────────────── */
const BADGE_STYLE: Record<PermitBadge, { bg: string; color: string }> = {
  Submitted: { bg: '#e2ebf9', color: '#1360d2' },
  Pending:   { bg: '#fff3d6', color: '#b7791f' },
  Rejected:  { bg: '#fde2e2', color: '#dc3545' },
  Draft:     { bg: '#eef0f4', color: '#5a6478' },
  Approved:  { bg: '#dcf5e4', color: '#1e874b' },
};
const isBadge = (v: string): v is PermitBadge => v in BADGE_STYLE;

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-[8px] ${className}`} style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>{children}</div>
);

/* Floating-label field */
function Field({ label, value = '', required, type = 'text', onChange, readOnly }: {
  label: string; value?: string; required?: boolean; type?: 'text' | 'select' | 'date' | 'search'; onChange?: (v: string) => void; readOnly?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const editable = !readOnly && !!onChange;
  const floated = focused || !!value;
  return (
    <div className="relative rounded-[4px] border min-w-0" style={{ height: 54, borderColor: focused ? '#1360d2' : '#d5ddfb', background: readOnly ? '#f4f6fa' : '#fff' }}>
      {label && (
        <span className="absolute pointer-events-none whitespace-nowrap transition-all" style={{
          left: floated ? 10 : 14, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? (readOnly ? '#f4f6fa' : '#fff') : 'transparent', padding: floated ? '0 4px' : 0,
          fontSize: floated ? 12 : 15, color: focused ? '#1360d2' : floated ? '#5a6282' : '#8f94ae', fontFamily: font, transitionDuration: '120ms', zIndex: 1,
        }}>{required && <span style={{ color: '#ea2428' }}>* </span>}{label}</span>
      )}
      <div className="flex items-center h-full px-[14px] gap-[6px]">
        {editable ? (
          <input value={value} onChange={(e) => onChange!(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
            className="text-[15px] text-[#0e1b3d] w-full focus:outline-none bg-transparent" style={{ fontFamily: font }} />
        ) : (
          <span className="text-[15px] truncate flex-1" style={{ color: value ? '#0e1b3d' : '#a7abbd', fontFamily: font }}>{value}</span>
        )}
        {type === 'select' && <svg viewBox="0 0 24 24" className="size-[18px] flex-shrink-0 text-[#697498]" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>}
        {type === 'search' && <svg viewBox="0 0 18 18" width="18" height="18" className="flex-shrink-0" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>}
        {type === 'date' && <svg viewBox="0 0 24 24" className="size-[18px] flex-shrink-0 text-[#697498]" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" /></svg>}
      </div>
    </div>
  );
}

/* ─────────────────────────  Main flow  ───────────────────────── */
type Step = 'list' | 'form' | 'proceed' | 'success';

export default function PermitServiceFlow({ config, onClose, onBackToPermits }: {
  config: PermitServiceConfig; onClose: () => void; onBackToPermits: () => void;
}) {
  const [step, setStep] = useState<Step>('list');

  return (
    <div className="fixed inset-0 flex flex-col bg-[#f8fafd]" style={{ fontFamily: font, zIndex: 210 }}>
      <div className="flex-shrink-0"><Header onHome={onClose} /></div>

      {/* Breadcrumb + agent banner */}
      <div className="flex items-center justify-between px-4 md:px-10 pt-[14px] pb-[6px] flex-wrap gap-y-[6px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[#8f94ae] text-[15px] cursor-pointer hover:text-[#1360d2]" onClick={onClose}>Home</span>
          <span className="text-[#dc3545] text-[14px]">/</span>
          <span className="text-[#8f94ae] text-[15px]">Service Catalog</span>
          <span className="text-[#dc3545] text-[14px]">/</span>
          <span className="text-[#111838] text-[15px] font-medium">{config.title}</span>
        </div>
        <div className="px-[16px] py-[4px] rounded-[4px] text-[15px] text-[#0e1b3d]" style={{ background: '#e2ebf9' }}>AE-1019056- Business Unit - Test LLC</div>
      </div>

      {step === 'list' && <ListStep config={config} onClose={onClose} onStart={() => setStep('form')} />}
      {step === 'form' && <FormStep config={config} onBack={() => setStep('list')} onProceed={() => setStep('proceed')} />}
      {step === 'proceed' && <ProceedStep config={config} onBack={() => setStep('form')} onSubmit={() => setStep('success')} onBackToListing={() => setStep('list')} />}
      {step === 'success' && <SuccessStep config={config} onBackToPermits={onBackToPermits} onBackToListing={() => setStep('list')} onBack={() => setStep('proceed')} />}
    </div>
  );
}

/* ── Listing ── */
function ListStep({ config, onClose, onStart }: { config: PermitServiceConfig; onClose: () => void; onStart: () => void }) {
  const [showFilters, setShowFilters] = useState(false);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  return (
    <>
      <div className="flex items-center gap-[10px] px-4 md:px-10 pb-[14px] flex-shrink-0">
        <h1 className="text-[28px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{config.title}</h1>
        <span className="flex items-center gap-[4px] text-[#1360d2] text-[15px] cursor-pointer">Need Help
          <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 115 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" strokeLinecap="round" /></svg>
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-[12px] flex-wrap mb-[12px]">
          <div className="flex items-center gap-[12px] flex-wrap">
            <button onClick={() => setShowFilters((s) => !s)} className={`flex items-center gap-[8px] h-[48px] px-[16px] rounded-[4px] border text-[15px] transition-colors ${showFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#0e1b3d]'}`}>
              Advanced Filter
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg>
            </button>
            <div className="flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] min-w-[300px]">
              <button className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full text-[15px] text-[#1360d2] font-medium">
                {config.searchLabel}
                <svg viewBox="0 0 24 24" className="size-[16px]" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <input placeholder={config.searchLabel} className="flex-1 px-[12px] text-[15px] focus:outline-none bg-transparent" style={{ fontFamily: font }} />
              <svg viewBox="0 0 18 18" width="20" height="20" className="mr-[12px]" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <button className="flex items-center gap-[8px] h-[48px] px-[16px] rounded-[4px] border border-[#d4dcfa] bg-white text-[15px] text-[#0e1b3d]">
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M9 4v16M15 4v16" /></svg>
              Columns
            </button>
            <button onClick={onStart} className="h-[48px] px-[24px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5] transition-colors" style={{ background: '#1360d2', fontWeight: 500 }}>Start Journey</button>
          </div>
        </div>

        {/* Advanced filters panel */}
        {showFilters && (
          <Card className="p-[20px] mb-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Advanced Filters</p>
              <button onClick={() => setShowFilters(false)} className="size-[26px] rounded-full border border-[#d5ddfb] flex items-center justify-center text-[#8f94ae] hover:text-[#0e1b3d]">
                <svg viewBox="0 0 24 24" className="size-[13px]" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[14px] mb-[16px]">
              {config.filters.map((f) => (<Field key={f.label} label={f.label} type={f.type ?? 'select'} onChange={() => {}} value="" />))}
            </div>
            <div className="flex items-center justify-end gap-[12px]">
              <button data-secondary-btn className="h-[44px] px-[26px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Reset</button>
              <button className="h-[44px] px-[30px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Apply</button>
            </div>
          </Card>
        )}

        {/* Table */}
        <Card className="overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse" style={{ minWidth: 900 }}>
              <thead>
                <tr style={{ background: '#c9def7' }}>
                  {config.columns.map((c) => (
                    <th key={c} className="text-left text-[14px] text-[#0e1b3d] px-[16px] py-[14px] whitespace-nowrap" style={{ fontWeight: 600 }}>
                      <span className="inline-flex items-center gap-[6px]">{c}<svg viewBox="0 0 24 24" className="size-[14px] text-[#697498]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M8 9h8M6 12h12M9 15h6" strokeLinecap="round" /></svg></span>
                    </th>
                  ))}
                  <th className="text-left text-[14px] text-[#0e1b3d] px-[16px] py-[14px]" style={{ fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {config.rows.map((row, ri) => (
                  <tr key={ri} className="border-t border-[#eef1f6]">
                    {row.map((cell, ci) => (
                      <td key={ci} className="text-[14px] px-[16px] py-[15px] whitespace-nowrap">
                        {isBadge(cell as string) ? (
                          <span className="inline-block px-[12px] py-[3px] rounded-full text-[13px]" style={{ ...BADGE_STYLE[cell as PermitBadge], fontWeight: 500 }}>{cell}</span>
                        ) : (<span className="text-[#0e1b3d]">{cell}</span>)}
                      </td>
                    ))}
                    <td className="px-[16px] py-[15px] relative">
                      <button onClick={() => setOpenFlyout(openFlyout === ri ? null : ri)} className="size-[28px] rounded flex items-center justify-center hover:bg-[#f0f4ff]">
                        <MoreIcon />
                      </button>
                      {openFlyout === ri && (
                        <>
                          <div className="fixed inset-0 z-[40]" onClick={() => setOpenFlyout(null)} />
                          <div className="absolute right-[40px] top-[10px] z-[50] bg-white rounded-[8px] py-[4px] min-w-[220px]" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.14)', border: '1px solid #f0f0f5' }}>
                            {config.flyout.map((item) => (
                              <button key={item} onClick={() => setOpenFlyout(null)} className="flex items-center gap-[10px] w-full px-[14px] py-[9px] text-left hover:bg-[#1360d2] group transition-colors">
                                <span className="size-[18px] rounded-full border border-current text-[#697498] group-hover:text-white flex-shrink-0" />
                                <span className="text-[15px] text-[#111838] group-hover:text-white">{item}</span>
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-end gap-[10px] px-[16px] py-[14px] flex-wrap">
            <span className="text-[14px] text-[#5a6282]">Result</span>
            <span className="h-[34px] px-[14px] border border-[#d5ddfb] rounded-[4px] flex items-center text-[14px] text-[#0e1b3d]">1 - 8</span>
            <span className="h-[34px] px-[10px] border border-[#d5ddfb] rounded-[4px] flex items-center gap-[6px] text-[14px]">8 <svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg></span>
            {['‹', '1', '2', '3', '4', '5', '6', '7', '›'].map((p, i) => (
              <button key={i} className="size-[30px] rounded-full flex items-center justify-center text-[14px]" style={p === '4' ? { background: '#1360d2', color: '#fff' } : { color: '#5a6282' }}>{p}</button>
            ))}
          </div>
        </Card>
      </div>

      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onClose} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back</button>
      </div>
    </>
  );
}

/* ── Form (start journey) ── */
const PROCEDURE_STEPS = [
  ['Request Submission', 'Fill the request information like regime type, declaration Type, cargo channel etc'],
  ['Invoice Details', 'Upload or add manually the invoice and HS code details of the cargo.'],
  ['Document Upload', 'Upload all the relevant documents required for customs and permit documents'],
  ['Proceed to Declaration / Proceed to Permit', 'Proceed to apply for permit if applicable for HS Codes provided or continue to submit for Declaration'],
  ['Declaration - General Information', 'Fill the form with other information details'],
  ['Declaration - Pay & Submit', 'Review the details and complete the declaration payment.'],
];
function FormStep({ config, onBack, onProceed }: { config: PermitServiceConfig; onBack: () => void; onProceed: () => void }) {
  const [appType, setAppType] = useState(config.applicationTypes[0] ?? 'Business');
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0">
        <h1 className="text-[28px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{config.title}</h1>
        <p className="text-[15px] text-[#5a6282]">Complete the form below and click ‘Submit’, Fields marked with asterisks (*) are required. Please fill the form in English.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="p-[24px] mb-[24px]">
          <p className="text-[16px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Application Information</p>
          <div className="flex items-center gap-[16px] flex-wrap">
            <div className="w-full sm:w-[320px]"><Field label="Application Type" required type="select" value={appType} onChange={setAppType} /></div>
            <button onClick={onProceed} className="h-[54px] px-[40px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Proceed</button>
          </div>
        </Card>

        <div className="flex items-center gap-[10px] mb-[14px]">
          <svg viewBox="0 0 24 24" className="size-[22px] text-[#0e1b3d]" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" /></svg>
          <h2 className="text-[22px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Help and Guides</h2>
        </div>
        <div className="flex items-center gap-[24px] border-b border-[#e6eaf2] mb-[20px] overflow-x-auto">
          {['Information', 'Tutorials', "Common FAQ's", 'Updates', 'Downloads'].map((t, i) => (
            <span key={t} className={`text-[15px] pb-[10px] whitespace-nowrap ${i === 0 ? 'text-[#1360d2] border-b-2 border-[#1360d2]' : 'text-[#5a6282]'}`}>{t}</span>
          ))}
        </div>

        <p className="text-[17px] text-[#0e1b3d] mb-[8px]" style={{ fontWeight: 600 }}>About the Service</p>
        <p className="text-[15px] text-[#5a6282] mb-[2px]">Integrated Clearance is a service that enables customers to complete the entire customs clearance process, including obtaining permits from the relevant issuing authorities.</p>
        <p className="text-[15px] text-[#5a6282] mb-[24px]">View the declaration assistant. <span className="text-[#1360d2] cursor-pointer">Click here</span></p>

        <p className="text-[17px] text-[#0e1b3d] mb-[14px]" style={{ fontWeight: 600 }}>Service Delivery Procedure</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] mb-[24px]">
          {PROCEDURE_STEPS.map(([t, d], i) => (
            <Card key={i} className="p-[18px]">
              <div className="size-[26px] rounded-full bg-[#28a745] text-white text-[13px] flex items-center justify-center mb-[10px]" style={{ fontWeight: 600 }}>{i + 1}</div>
              <p className="text-[15px] text-[#0e1b3d] mb-[4px]" style={{ fontWeight: 600 }}>{t}</p>
              <p className="text-[13px] text-[#5a6282] leading-snug">{d}</p>
            </Card>
          ))}
        </div>

        {['Services Details', 'Service Fee', 'Required Documents'].map((s) => (
          <div key={s} className="flex items-center justify-between border-b border-[#e6eaf2] py-[16px]">
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{s}</p>
            <span className="size-[24px] rounded-full bg-[#e9edf4] flex items-center justify-center text-[#697498]"><svg viewBox="0 0 24 24" className="size-[14px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg></span>
          </div>
        ))}
      </div>

      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onBack} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back</button>
      </div>
    </>
  );
}

/* ── Proceed (long multi-section form) ── */
function ProceedStep({ config, onBack, onSubmit }: { config: PermitServiceConfig; onBack: () => void; onSubmit: () => void; onBackToListing: () => void }) {
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0">
        <h1 className="text-[28px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{config.title}</h1>
        <p className="text-[15px] text-[#5a6282]">Complete the form below and click ‘Submit’, Fields marked with asterisks (*) are required. Please fill the form in English.</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px] flex flex-col gap-[20px]">
        {config.proceed.map((section) => (
          <Card key={section.title} className="p-[22px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              <p className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{section.title}</p>
              {section.manualEntry && (
                <label className="flex items-center gap-[6px] text-[14px] text-[#0e1b3d] cursor-pointer ml-[4px]">
                  <span className="size-[18px] rounded-[4px] bg-[#1360d2] flex items-center justify-center"><svg viewBox="0 0 16 16" className="size-[11px]" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 8l3.5 3.5L13 5" /></svg></span>
                  Manual Entry
                </label>
              )}
            </div>
            {section.note && <p className="text-[13px] text-[#8f94ae] mb-[12px]">{section.note}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px]">
              {section.fields.map((f, i) => (<Field key={i} label={f.label} value={f.value} required={f.required} type={f.type ?? 'text'} onChange={() => {}} />))}
            </div>
          </Card>
        ))}

        <Card className="p-[22px]">
          <p className="text-[17px] text-[#0e1b3d] mb-[12px]" style={{ fontWeight: 700 }}>Terms and Conditions</p>
          {['I agree to Dubai Municipality Terms & Conditions and I have read the Privacy Policy',
            'I have read the details of this service in DM portal and understood the same'].map((t) => (
            <label key={t} className="flex items-start gap-[10px] mb-[10px] cursor-pointer">
              <span className="size-[18px] mt-[2px] rounded-[4px] bg-[#1360d2] flex items-center justify-center flex-shrink-0"><svg viewBox="0 0 16 16" className="size-[11px]" fill="none" stroke="#fff" strokeWidth="2.4"><path d="M3 8l3.5 3.5L13 5" /></svg></span>
              <span className="text-[14px] text-[#0e1b3d]">{t} <span className="text-[#ea2428]">*</span></span>
            </label>
          ))}
        </Card>
      </div>

      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onBack} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back to Listing</button>
        <div className="flex items-center gap-[12px]">
          <button data-secondary-btn className="h-[46px] px-[24px] rounded-[4px] border text-[15px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save as Drafts</button>
          <button onClick={onSubmit} className="h-[46px] px-[36px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Submit</button>
        </div>
      </div>
    </>
  );
}

/* ── Success ── */
function SuccessStep({ config, onBackToPermits, onBackToListing, onBack }: { config: PermitServiceConfig; onBackToPermits: () => void; onBackToListing: () => void; onBack: () => void }) {
  return (
    <>
      <div className="px-4 md:px-10 pb-[8px] flex-shrink-0">
        <h1 className="text-[26px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>{config.title}</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 md:px-10 pb-[20px]">
        <Card className="flex flex-col items-center gap-[20px] px-[24px] py-[48px]">
          <div className="size-[96px] rounded-full flex items-center justify-center" style={{ background: '#b7e6c8' }}>
            <div className="size-[62px] rounded-full bg-[#28a745] flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="size-[32px]" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
          <p className="text-[22px] text-[#0e1b3d] text-center" style={{ fontWeight: 600 }}>{config.success.heading}</p>
          <div className="text-center text-[15px] text-[#5a6282] max-w-[620px]">
            {config.success.message.map((m, i) => <p key={i}>{m}</p>)}
          </div>
          <div className="flex items-center gap-[8px]">
            <span className="text-[15px] text-[#5a6282]">Permit Status:</span>
            <span className="px-[12px] py-[3px] rounded-full text-[13px]" style={{ ...BADGE_STYLE.Pending, fontWeight: 500 }}>Submitted</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-[12px]">
            <span className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[9px] text-[14px] text-[#5a6282]">DM Reference number: <span className="text-[#1360d2] font-medium">12345678</span></span>
            <span className="border border-[#ebebeb] rounded-[6px] px-[16px] py-[9px] text-[14px] text-[#5a6282]">DT Reference number: <span className="text-[#1360d2] font-medium">12345678</span></span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-[14px] mt-[6px]">
            <button onClick={onBackToPermits} data-secondary-btn className="h-[48px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back To Permits</button>
            <button onClick={onBackToListing} className="h-[48px] px-[32px] rounded-[4px] text-[15px] text-white hover:bg-[#0f4fb5]" style={{ background: '#1360d2', fontWeight: 500 }}>Back To Listing</button>
          </div>
        </Card>
      </div>
      <div className="flex-shrink-0 bg-white px-4 md:px-10 py-[16px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.06)' }}>
        <button onClick={onBack} data-secondary-btn className="h-[46px] px-[28px] rounded-[4px] border text-[15px]" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Back</button>
      </div>
    </>
  );
}
