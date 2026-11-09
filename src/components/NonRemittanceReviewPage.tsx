import React, { useEffect, useRef, useState } from 'react';
import Dh from './Dh';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';
import { type ChargeDetail, type OutboundState } from './RDChargeFlowPage';
import { UploadedDocsByDeclaration, type UploadedDoc } from './NonRemittanceDocumentsPage';
import { DeclarationDetailsSection } from './RefundDepositsClaimViewPage';
import FloatingField from './FloatingField';

const font = "'Dubai', 'Segoe UI', sans-serif";

const AMEND_REASONS = ['Wrong Details Entered', 'Other'];

/* DTSelect-style dropdown with a fixed-position menu (amendment reason). */
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

/* Floating-label dropdown matching FloatingField's visual language (e.g. Refund Mode). */
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

const REFUND_MODES = ['Bank Transfer', 'Cheque'];

const BENEFICIARIES = [
  { code: 'AE-9106286', name: 'SW Logistics LLC' },
  { code: 'AE-1019056', name: 'Consolidated Shipping Services LLC' },
];
const BENEFICIARY_OPTIONS = BENEFICIARIES.map(b => `${b.code} - ${b.name}`);

const BANK_ACCOUNTS = [
  { no: '1002345678', bankName: 'Emirates NBD', iban: 'AE07 0331 2345 6789 0123 456' },
  { no: '2003456789', bankName: 'Abu Dhabi Commercial Bank', iban: 'AE86 0030 0123 4567 8901 234' },
];

/* Read-only, non-interactive counterpart to FloatingField — for values auto-derived from another
   selection (e.g. Bank Name / IBAN once a Bank Account No. is picked) rather than typed in. */
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
  onViewClaim?: () => void;
  selectedRows: Row[];
  paymentMode?: string;
  accountNo?: string;
  /** Overrides for reuse outside the NR flow (e.g. missing-doc refund of deposits). */
  title?: string;
  steps?: { id: string; label: string }[];
  activeIndex?: number;
  claimType?: string;
  /** Amend mode: show an editable Amendment Detail card at the top. */
  showAmendment?: boolean;
  /** Refund of Deposits flow: declaration + outbound details entered on the Charge Details step, shown read-only. */
  chargeDetails?: ChargeDetail[];
  outbounds?: OutboundState;
  /** Documents uploaded on the Upload Documents step, shown read-only grouped by declaration. */
  uploadedDocs?: UploadedDoc[];
  /** Validity Extension flow: the declaration being extended and the number of days requested —
      renders a read-only Current vs New Expiry comparison card when both are set. */
  extensionEntries?: { row: Row; days: string }[];
  extensionReason?: string;
  extensionDocuments?: { name: string; sizeKb: string }[];
};

const IMPORTER_CODE_NAMES: Record<string, string> = {
  'A180': 'IMPORTER SONY GULF UAE',
  'A220': 'SW LOGISTICS LLC',
  'A350': 'FREIGHT FORWARDER CO.',
};

/** "MM/DD/YYYY" + N days -> "MM/DD/YYYY", matching the date format used across this app's mock data. */
function addDaysToDate(dateStr: string, days: number): string {
  const [m, d, y] = dateStr.split('/').map(Number);
  if (!m || !d || !y) return dateStr;
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + days);
  return `${String(dt.getMonth() + 1).padStart(2, '0')}/${String(dt.getDate()).padStart(2, '0')}/${dt.getFullYear()}`;
}

export default function NonRemittanceReviewPage({ onBack, onSubmit, onSaveAndPreview, onViewClaim, selectedRows, paymentMode = 'Credit/Debit Account', accountNo = '1223193-SW LOGISTICS LLC', title, steps, activeIndex = 3, claimType = 'Non Remittance Claim', showAmendment = false, chargeDetails, outbounds, uploadedDocs, extensionEntries, extensionReason, extensionDocuments }: Props) {
  const [declared, setDeclared] = useState(false);
  const [amendReason, setAmendReason] = useState('');
  const [amendReasonDesc, setAmendReasonDesc] = useState('');
  const [beneficiaryCodeName, setBeneficiaryCodeName] = useState('');
  const [refundMode, setRefundMode] = useState('');
  const [bankAccountNo, setBankAccountNo] = useState('');
  const selectedBankAccount = BANK_ACCOUNTS.find(a => a.no === bankAccountNo);
  const isCash = paymentMode === 'Cash';
  const parseAED = (s: string) => parseFloat((s || '').replace(/[^0-9.]/g, '')) || 0;
  const totalClaimAmount = chargeDetails && chargeDetails.length > 0
    ? chargeDetails.reduce((sum, d) => sum + parseAED(d.claimAmount), 0)
    : null;
  const depositMethods = chargeDetails ? Array.from(new Set(chargeDetails.map(d => d.depositMethod).filter(Boolean))) : [];
  // Falls back to the payment mode actually selected on the Payment Details step (e.g. "Cash")
  // whenever there's no per-declaration deposit method to read from (Validity Extension, etc.),
  // so this field always reflects the user's selection instead of sticking at "—".
  const depositMethodDisplay = depositMethods.length === 0 ? (paymentMode || '—') : depositMethods.length === 1 ? depositMethods[0] : 'Multiple';

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
          <div className="flex items-center gap-[16px] flex-wrap">
            <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Non Remittance'}</h1>
          </div>
        </div>

        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? NR_CLAIM_STEPS} />
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

          {extensionEntries && extensionEntries.length > 0 ? (
            <>
              {/* Declaration Details — Validity Extension flow, one card per unique declaration */}
              {Array.from(new Map(extensionEntries.map((e) => [e.row.declarationNo, e])).values()).map(({ row: extensionRow }) => (
                <div key={extensionRow.declarationNo} className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                  <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                    <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Declaration Details — {extensionRow.declarationNo}</p>
                  </div>
                  <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
                    {[
                      { label: 'Declaration No.',   value: extensionRow.declarationNo as React.ReactNode },
                      { label: 'Declaration Type',  value: (extensionRow.declarationCategory ?? '—') as React.ReactNode },
                      { label: 'Declaration Date',  value: extensionRow.declarationDate as React.ReactNode },
                      { label: 'Declaration Owner', value: (extensionRow.importerCode
                          ? `${extensionRow.importerCode}${IMPORTER_CODE_NAMES[extensionRow.importerCode] ? ` - ${IMPORTER_CODE_NAMES[extensionRow.importerCode]}` : ''}`
                          : '—') as React.ReactNode },
                      { label: 'Total Charges',     value: <span className="inline-flex items-baseline gap-[3px]"><Dh style={{ fontSize: 15 }} />{extensionRow.depositAmount.replace(/^Dh\s*/, '')}</span> },
                    ].map((f) => (
                      <div key={f.label} className="flex flex-col gap-[4px]">
                        <span className="text-[16px] text-[#697498]">{f.label}</span>
                        <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Extension Reason */}
              <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Extension Reason</p>
                </div>
                <div className="px-[24px] py-[20px]">
                  <span className="text-[16px] text-[#051937]">{extensionReason || '—'}</span>
                </div>
              </div>

              {/* Extension Details */}
              <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Extension Details</p>
                </div>
                <div className="px-[24px] py-[20px] overflow-x-auto">
                  <table style={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                    <thead>
                      <tr>
                        <th rowSpan={2} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRadius: '8px 0 0 0', borderRight: '1px solid #fff' }}>Declaration No.</th>
                        <th rowSpan={2} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff' }}>Charge Type</th>
                        <th rowSpan={2} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff' }}>Amount (AED)</th>
                        <th rowSpan={2} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff' }}>Extension Required (in days)</th>
                        <th colSpan={2} style={{ background: '#a6c2e9', padding: '8px 12px', textAlign: 'center', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff', borderBottom: '1px solid #fff' }}>Current Expiry</th>
                        <th colSpan={2} style={{ background: '#a6c2e9', padding: '8px 12px', textAlign: 'center', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRadius: '0 8px 0 0', borderBottom: '1px solid #fff' }}>New Expected Expiry(subject for approval)</th>
                      </tr>
                      <tr>
                        <th style={{ background: '#a6c2e9', padding: '8px 12px', textAlign: 'left', fontWeight: 500, fontSize: 14, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff' }}>Claim Expiry</th>
                        <th style={{ background: '#a6c2e9', padding: '8px 12px', textAlign: 'left', fontWeight: 500, fontSize: 14, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff' }}>Export Expiry</th>
                        <th style={{ background: '#a6c2e9', padding: '8px 12px', textAlign: 'left', fontWeight: 500, fontSize: 14, color: '#051937', whiteSpace: 'nowrap', borderRight: '1px solid #fff' }}>Claim Expiry</th>
                        <th style={{ background: '#a6c2e9', padding: '8px 12px', textAlign: 'left', fontWeight: 500, fontSize: 14, color: '#051937', whiteSpace: 'nowrap' }}>Export Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      {extensionEntries.map(({ row: extensionRow, days: extensionDays }) => (
                        <tr key={`${extensionRow.declarationNo}__${extensionRow.depositType}`}>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{extensionRow.declarationNo}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px] text-[#051937]">{extensionRow.depositType}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="inline-flex items-baseline gap-[3px] text-[16px] text-[#051937]"><Dh style={{ fontSize: 14 }} />{extensionRow.depositAmount.replace(/^Dh\s*/, '')}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px] text-[#051937]">{extensionDays}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px]" style={{ color: '#dc3545' }}>{extensionRow.claimExpiry}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px]" style={{ color: '#dc3545' }}>{extensionRow.exportExpiry}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px]" style={{ color: '#1aac72', fontWeight: 500 }}>{addDaysToDate(extensionRow.claimExpiry, parseInt(extensionDays, 10) || 0)}</span>
                          </td>
                          <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                            <span className="text-[16px]" style={{ color: '#1aac72', fontWeight: 500 }}>{extensionRow.exportExpiry === 'N/A' ? 'N/A' : addDaysToDate(extensionRow.exportExpiry, parseInt(extensionDays, 10) || 0)}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Documents Uploaded */}
              <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Documents Uploaded</p>
                </div>
                <div className="px-[24px] py-[20px]">
                  {extensionDocuments && extensionDocuments.length > 0 ? (
                    <div className="flex flex-col gap-[10px]">
                      {extensionDocuments.map((doc, i) => (
                        <div key={`${doc.name}-${i}`} className="flex items-center gap-[10px] rounded-[6px] px-[14px] py-[10px]" style={{ border: '1px solid #eef1f6' }}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                          <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{doc.name}</span>
                          <span className="text-[14px] text-[#697498]">({doc.sizeKb} KB)</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-[16px] text-[#697498]">No documents uploaded</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Claimant Details */}
              <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Claimant Details</p>
                </div>
                <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
                  {[
                    { label: 'Claimant Type',  value: 'Business' },
                    { label: 'Claimant Code',  value: 'AE-9106286' },
                    { label: 'Claimant Name',  value: 'SW Logistics LLC' },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-[4px]">
                      <span className="text-[16px] text-[#697498]">{f.label}</span>
                      <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
                <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Request Details</p>
                </div>
                <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[32px] gap-y-[20px]">
                  {[
                    { label: 'Request No.',                         value: '2588017' as React.ReactNode },
                    { label: 'Claim Type',                          value: claimType as React.ReactNode },
                    { label: 'Total No. of Sub Claims in the Claim', value: String(selectedRows.length || 1) as React.ReactNode },
                    { label: 'Deposit Method',                      value: depositMethodDisplay as React.ReactNode },
                    { label: 'Total Claim Amount (AED)',            value: totalClaimAmount !== null
                        ? <span className="inline-flex items-baseline gap-[3px]"><Dh style={{ fontSize: 15 }} />{totalClaimAmount.toFixed(2)}</span>
                        : '—' },
                  ].map((f) => (
                    <div key={f.label} className="flex flex-col gap-[4px]">
                      <span className="text-[16px] text-[#697498]">{f.label}</span>
                      <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Additional Details — Cash payment only */}
          {isCash && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[24px] py-[16px] border-b border-[#eef1f6]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Refund Mode Details</p>
                <p className="text-[14px] text-[#697498] mt-[2px]">Cash payment requires the following details.</p>
              </div>
              <div className="px-[24px] py-[20px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[20px]">
                <FloatingSelect label="Beneficiary Code And Name" required value={beneficiaryCodeName} onChange={setBeneficiaryCodeName} options={BENEFICIARY_OPTIONS} />
                <FloatingSelect label="Refund Mode" required value={refundMode} onChange={setRefundMode} options={REFUND_MODES} />
                <FloatingSelect label="Bank Account No." required value={bankAccountNo} onChange={setBankAccountNo} options={BANK_ACCOUNTS.map(a => a.no)} />
                <ReadOnlyField label="Bank Name" value={selectedBankAccount?.bankName ?? ''} />
                <ReadOnlyField label="IBAN Account" value={selectedBankAccount?.iban ?? ''} />
              </div>
            </div>
          )}

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
