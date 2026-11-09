import React, { useEffect, useRef, useState } from 'react';
import Dh from './Dh';
import ClaimStepper, { REFUND_AUCTION_STEPS } from './ClaimStepper';
import FloatingField from './FloatingField';
import type { SearchPickerRow } from './SearchPickerModal';
import type { AuctionLotRow } from './AuctionLotDetailsPage';
import type { AuctionClaimDetail } from './AuctionClaimDetailsPage';
import type { UploadedDoc } from './NonRemittanceDocumentsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const CLAIMANT_TYPES = ['Business Customer', 'Personal Customer', 'Courier Personal Customer', 'Others'];
const REFUND_MODES = ['Bank Transfer', 'Cheque'];

const BANK_ACCOUNTS = [
  { no: '1002345678', bankName: 'Emirates NBD', iban: 'AE07 0331 2345 6789 0123 456' },
  { no: '2003456789', bankName: 'Abu Dhabi Commercial Bank', iban: 'AE86 0030 0123 4567 8901 234' },
];

/** Mock "Personal Customer Search LOV" dataset — used for both Claimant Code and
    Beneficiary Code and Name lookups (Business/Personal Customer branch). */
const PERSONAL_CUSTOMERS: SearchPickerRow[] = [
  { code: 'PC-100234', name: 'Ahmed Al Mansoori', mobile: '+971 50 123 4567', idDocNo: 'P1234567',  nationalId: '784-1985-1234567-1', combined: 'PC-100234 - Ahmed Al Mansoori' },
  { code: 'PC-100587', name: 'Fatima Al Zaabi',   mobile: '+971 55 987 6543', idDocNo: 'P7654321',  nationalId: '784-1990-7654321-2', combined: 'PC-100587 - Fatima Al Zaabi' },
  { code: 'PC-101092', name: 'Rashid Khan',        mobile: '+971 52 456 7890', idDocNo: 'P4567890',  nationalId: '784-1988-4567890-3', combined: 'PC-101092 - Rashid Khan' },
  { code: 'PC-101345', name: 'Sara Al Suwaidi',    mobile: '+971 56 321 0987', idDocNo: 'P3210987',  nationalId: '784-1992-3210987-4', combined: 'PC-101345 - Sara Al Suwaidi' },
];
const CLAIMANT_CODE_COLUMNS = [
  { key: 'code', label: 'Personal Customer Code' },
  { key: 'name', label: 'Personal Customer Name' },
  { key: 'mobile', label: 'Mobile No.' },
  { key: 'idDocNo', label: 'Identification Doc No.' },
  { key: 'nationalId', label: 'National Id' },
];

/* Floating-label dropdown matching FloatingField's visual language (Claimant Type / Refund Mode). */
function FloatingSelect({ label, required, value, onChange, options }: { label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const toggle = () => {
    if (btnRef.current) { const r = btnRef.current.getBoundingClientRect(); setPos({ top: r.bottom + 2, left: r.left, width: r.width }); }
    setOpen(o => !o);
  };
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle} aria-haspopup="listbox" aria-expanded={open}
        className="bg-white rounded-[4px] flex items-center px-[16px] gap-[8px] text-left transition-colors relative w-full"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="absolute pointer-events-none transition-all"
          style={{ left: (open || value) ? 10 : 16, top: (open || value) ? -9 : '50%', transform: (open || value) ? 'none' : 'translateY(-50%)',
            background: (open || value) ? '#fff' : 'transparent', padding: (open || value) ? '0 4px' : 0,
            fontSize: (open || value) ? 12 : 16, color: open ? '#1360d2' : '#697498', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>
          {required && <span style={{ color: '#ea2428' }}>* </span>}{label}
        </span>
        <span className="flex-1 text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d' }}>{value}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <div className="py-[4px]" role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
            background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', overflow: 'hidden', fontFamily: font }}>
          {options.map(o => {
            const isSel = o === value;
            return (
              <button key={o} type="button" role="option" aria-selected={isSel}
                onMouseDown={e => { e.preventDefault(); onChange(o); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
                style={{ background: isSel ? '#e2ebf9' : 'transparent', color: isSel ? '#1360d2' : '#0e1b3d', fontWeight: isSel ? 500 : 400, fontFamily: font }}>
                {o}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  const floated = value.length > 0;
  return (
    <div className="relative" style={{ height: 56 }}>
      <div className="h-full flex items-center px-[16px] rounded-[4px]" style={{ border: '1px solid #e6eaf5', background: '#f8fafd' }}>
        <span className="text-[16px] whitespace-nowrap overflow-hidden text-ellipsis" style={{ color: value ? '#0e1b3d' : '#b0b8d0', fontFamily: font }}>{value || '—'}</span>
      </div>
      <span className="absolute pointer-events-none"
        style={{ left: 10, top: floated ? -9 : 18, background: floated ? '#f8fafd' : 'transparent', padding: floated ? '0 4px' : 0,
          fontSize: floated ? 12 : 16, color: '#697498', fontFamily: font, transitionDuration: '120ms' }}>
        {label}
      </span>
    </div>
  );
}

type Props = {
  onBack: () => void;
  onSubmit: () => void;
  onSaveAndPreview?: () => void;
  selectedLots: AuctionLotRow[];
  claimDetails: AuctionClaimDetail[];
  paymentMode?: string;
  accountNo?: string;
  uploadedDocs?: UploadedDoc[];
  requestNo?: string;
  /** Overrides for reuse outside the new-claim flow (e.g. amend). */
  title?: string;
  steps?: { id: string; label: string }[];
  activeIndex?: number;
  /** Amend mode: show an editable Amendment Detail card at the top. */
  showAmendment?: boolean;
};

const AMEND_REASONS = ['Wrong Details Entered', 'Other'];

/* Floating-label dropdown matching FloatingSelect's visual language (Amendment Reason). */
function AmendReasonSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);
  const toggle = () => {
    if (btnRef.current) { const r = btnRef.current.getBoundingClientRect(); setPos({ top: r.bottom + 2, left: r.left, width: r.width }); }
    setOpen(o => !o);
  };
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (btnRef.current && !btnRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [open]);
  return (
    <>
      <button ref={btnRef} type="button" onClick={toggle} aria-haspopup="listbox" aria-expanded={open}
        className="bg-white rounded-[4px] flex items-center px-[16px] gap-[8px] text-left transition-colors relative"
        style={{ width: 390, maxWidth: '100%', height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="absolute pointer-events-none transition-all"
          style={{ left: (open || value) ? 10 : 16, top: (open || value) ? -9 : '50%', transform: (open || value) ? 'none' : 'translateY(-50%)',
            background: (open || value) ? '#fff' : 'transparent', padding: (open || value) ? '0 4px' : 0,
            fontSize: (open || value) ? 12 : 16, color: open ? '#1360d2' : '#697498', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>
          <span style={{ color: '#ea2428' }}>* </span>Amendment Reason
        </span>
        <span className="flex-1 text-[16px] whitespace-nowrap" style={{ color: '#0e1b3d' }}>{value}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <div className="py-[4px]" role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
            background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', overflow: 'hidden', fontFamily: font }}>
          {AMEND_REASONS.map(o => {
            const isSel = o === value;
            return (
              <button key={o} type="button" role="option" aria-selected={isSel}
                onMouseDown={e => { e.preventDefault(); onChange(o); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
                style={{ background: isSel ? '#e2ebf9' : 'transparent', color: isSel ? '#1360d2' : '#0e1b3d', fontWeight: isSel ? 500 : 400, fontFamily: font }}>
                {o}
              </button>
            );
          })}
        </div>
      )}
    </>
  );
}

export default function AuctionClaimReviewPage({ onBack, onSubmit, onSaveAndPreview, selectedLots, claimDetails, paymentMode = 'Credit/Debit Account', accountNo = '1223193-SW LOGISTICS LLC', uploadedDocs, requestNo = '2588017', title, steps, activeIndex = 4, showAmendment = false }: Props) {
  const [declared, setDeclared] = useState(false);
  const [amendReason, setAmendReason] = useState('');
  const [amendReasonDesc, setAmendReasonDesc] = useState('');
  const [claimantType, setClaimantType] = useState('Business Customer');
  const [claimantCode, setClaimantCode] = useState('');
  const [claimantName, setClaimantName] = useState('');
  const [beneficiary, setBeneficiary] = useState('');
  const [refundMode, setRefundMode] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const selectedBankAccount = BANK_ACCOUNTS.find(a => a.no === bankAccountNo);

  const isBusinessOrPersonal = claimantType === 'Business Customer' || claimantType === 'Personal Customer';

  const parseAED = (s: string) => parseFloat((s || '').replace(/[^0-9.]/g, '')) || 0;
  const totalClaimAmount = claimDetails.reduce((sum, d) => sum + parseAED(d.claimAmount), 0);

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 mb-[8px] flex items-center justify-between flex-wrap gap-[12px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Refund on Auction Proceed'}</h1>
        </div>

        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? REFUND_AUCTION_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Amendment Detail — amend mode only */}
          {showAmendment && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Amendment Detail</p>
              </div>
              <div className="px-[24px] py-[20px] flex flex-col gap-[20px]">
                <AmendReasonSelect value={amendReason} onChange={setAmendReason} />
                {amendReason === 'Other' && (
                  <div className="relative" style={{ width: '50%', minWidth: 300 }}>
                    <p className="text-[14px] mb-[6px]" style={{ color: '#697498' }}>Amendment Reason Description</p>
                    <textarea
                      value={amendReasonDesc}
                      onChange={e => setAmendReasonDesc(e.target.value)}
                      rows={2}
                      className="w-full rounded-[4px] px-[16px] py-[12px] text-[16px] resize-none focus:outline-none"
                      style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: 'white' }}
                      placeholder='Enter reason if "Other" option is selected'
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Claimant Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Claimant Details</p>
            </div>
            <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[20px]">
              <FloatingSelect label="Claimant Type" required value={claimantType} onChange={(v) => { setClaimantType(v); setClaimantCode(''); setClaimantName(''); }} options={CLAIMANT_TYPES} />

              {isBusinessOrPersonal ? (
                <>
                  <FloatingField
                    label="Claimant Code" required searchable
                    value={claimantCode} onChange={setClaimantCode}
                    pickerColumns={CLAIMANT_CODE_COLUMNS} pickerRows={PERSONAL_CUSTOMERS} pickerSelectKey="code"
                  />
                  <FloatingField label="Claimant Name" required value={claimantName} onChange={setClaimantName} placeholder="Enter claimant name" />
                </>
              ) : (
                <FloatingField label="Claimant Name" required value={claimantName} onChange={setClaimantName} placeholder="Enter claimant name" />
              )}

              <FloatingField
                label="Beneficiary Code and Name" required searchable
                value={beneficiary} onChange={setBeneficiary}
                pickerColumns={CLAIMANT_CODE_COLUMNS} pickerRows={PERSONAL_CUSTOMERS} pickerSelectKey="combined"
              />
            </div>
          </div>

          {/* Refund Mode Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Refund Mode Details</p>
            </div>
            <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[20px]">
              <FloatingSelect label="Refund Mode" required value={refundMode} onChange={setRefundMode} options={REFUND_MODES} />
              <FloatingSelect label="Bank Account No." required value={bankAccountNo} onChange={setBankAccountNo} options={BANK_ACCOUNTS.map(a => a.no)} />
              <ReadOnlyField label="Bank Name" value={selectedBankAccount?.bankName ?? ''} />
              <ReadOnlyField label="IBAN Account" value={selectedBankAccount?.iban ?? ''} />
            </div>
          </div>

          {/* Request Details */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Request Details</p>
            </div>
            <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
              {[
                { label: 'Request No.', value: requestNo as React.ReactNode },
                { label: 'Claim Type', value: 'Refund on Auction Proceed' as React.ReactNode },
                { label: 'Total No. of Sub Claims', value: String(selectedLots.length || 1) as React.ReactNode },
                { label: 'Total Claim Amount (AED)', value: <span className="inline-flex items-baseline gap-[3px]"><Dh style={{ fontSize: 15 }} />{totalClaimAmount.toFixed(2)}</span> },
              ].map((f) => (
                <div key={f.label} className="flex flex-col gap-[4px]">
                  <span className="text-[16px] text-[#697498]">{f.label}</span>
                  <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Declaration checkbox */}
          <div
            className="flex items-start gap-[14px] rounded-[8px] px-[20px] py-[16px]"
            style={{ background: '#fff', border: `1.5px solid ${declared ? '#1360d2' : '#d5ddfb'}`, boxShadow: '0px 2px 8px rgba(143,155,186,0.10)', cursor: 'pointer' }}
            onClick={() => setDeclared((v) => !v)}
          >
            <button
              type="button"
              role="checkbox"
              aria-checked={declared}
              onClick={(e) => { e.stopPropagation(); setDeclared((v) => !v); }}
              className="size-[20px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
              style={{ border: `2px solid ${declared ? '#1360d2' : '#a7abb2'}`, background: declared ? '#1360d2' : '#fff' }}
            >
              {declared && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
            </button>
            <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: 1.5 }}>
              I, hereby, declare that all the information entered and stated in the Request is true and correct and shall bear full responsibility for entering incorrect statement and all the consequences arising thereof.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Previous
        </button>
        <div className="flex items-center gap-[12px]">
          {onSaveAndPreview && (
            <button data-secondary-btn
              onClick={onSaveAndPreview}
              className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              Save &amp; Preview Claim
            </button>
          )}
          <button
            onClick={onSubmit}
            className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{
              background: '#1360d2',
              cursor: 'pointer',
              fontFamily: font,
              fontWeight: 500,
              boxShadow: '0px 0px 8px rgba(28,72,191,0.16)',
            }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
