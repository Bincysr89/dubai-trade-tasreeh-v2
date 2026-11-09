import React, { useState } from 'react';
import SaveExitModal from './SaveExitModal';
import ClaimStepper, { NR_CLAIM_STEPS } from './ClaimStepper';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import type { Row } from './EligibleDeclarationsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

const PAYMENT_MODES = ['Credit/Debit Account', 'E-Payment', 'Cash'];
const PAYMENT_REFS  = ['Account Number', 'Reference No'];
const CREDIT_DEBIT_ACCOUNTS = [
  { label: '1223193 - SW Logistics LLC', balance: 45 },
  { label: '4487210 - SW Logistics LLC', balance: 5000 },
];

const REG_FEE   = 80;
const KNOW_FEE  = 20;
const TOTAL_AED = REG_FEE + KNOW_FEE;

function DirhamIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color} />
    </svg>
  );
}

function PlainSelect({ value, onChange, options, disabled, placeholder = 'Select payment mode' }: { value: string; onChange: (v: string) => void; options: string[]; disabled?: boolean; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => !disabled && setOpen(o => !o)}
        className="w-full flex items-center px-[12px]"
        style={{ height: 48, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font, background: disabled ? '#f4f6fb' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <span className="flex-1 text-left text-[16px]" style={{ color: disabled ? '#b0b8cc' : value ? '#051937' : '#697498' }}>{value || placeholder}</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke={disabled ? '#b0b8cc' : '#697498'} strokeWidth="2" className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && !disabled && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 52, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: font }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const IMPORTER_CODE_NAMES: Record<string, string> = {
  'A180': 'IMPORTER SONY GULF UAE',
  'A220': 'SW LOGISTICS LLC',
  'A350': 'FREIGHT FORWARDER CO.',
};
const codeWithName = (code: string) =>
  IMPORTER_CODE_NAMES[code] ? `${code} - ${IMPORTER_CODE_NAMES[code]}` : code;

type Props = {
  onBack: () => void; onBackToListing: () => void; onContinue: (paymentMode: string, accountNo: string) => void;
  selectedRows: Row[]; onDeclarationOpen?: (declNo: string) => void;
  /** Overrides for reuse outside the NR flow (e.g. missing-doc refund of deposits). */
  title?: string; steps?: { id: string; label: string }[]; activeIndex?: number;
  /** When set, the "Declaration Type" column is relabelled and shows the deposit/charge type. */
  typeColumnLabel?: string; showChargeType?: boolean;
  /** Overrides the "Declaration No." column header — e.g. "Auction Lot Number" for the Refund on Auction Proceed flow. */
  declNoColumnLabel?: string;
  /** Overrides the "No. of Declarations applicable for registration fee" summary line. */
  declarationCountLabel?: string;
  /** Amend flow: hide the Save & Exit button. */
  hideSaveExit?: boolean;
  /** Amend flow: show an info bar and make the payment mode/reference read-only. */
  chargesNote?: string;
  /** Validity Extension flow: there's no separate claimant/broker to show. */
  hideClaimantBroker?: boolean;
  /** Validity Extension flow: declaration count is redundant with the table above. */
  hideDeclarationCount?: boolean;
};

export default function NonRemittanceChargesPage({ onBack, onBackToListing, onContinue, selectedRows, onDeclarationOpen, title, steps, activeIndex = 2, typeColumnLabel = 'Declaration Type', showChargeType = false, hideSaveExit = false, chargesNote, hideClaimantBroker = false, hideDeclarationCount = false, declNoColumnLabel = 'Declaration No.', declarationCountLabel = 'No. of Declarations applicable for registration fee' }: Props) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef,  setPaymentRef]  = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [insufficientOpen, setInsufficientOpen] = useState(false);
  const isEPayment = paymentMode === 'E-Payment';
  const isCash = paymentMode === 'Cash';
  const handlePaymentMode = (v: string) => { setPaymentMode(v); setPaymentRef(v === 'E-Payment' ? 'Reference No' : ''); };
  const handleAccountSelect = (v: string) => {
    setPaymentRef(v);
    const acc = CREDIT_DEBIT_ACCOUNTS.find(a => a.label === v);
    if (acc && acc.balance < TOTAL_AED * displayRows.length) setInsufficientOpen(true);
  };

  const displayRows = Array.from(new Map(selectedRows.map(r => [r.declarationNo, r])).values());

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Non Remittance'}</h1>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? NR_CLAIM_STEPS} />
        </div>

        {/* Info bar — charges not applicable (amend flow) */}
        {chargesNote && (
          <div className="px-4 sm:px-10 mb-[16px]">
            <div className="flex items-center gap-[10px] rounded-[6px] px-[16px] py-[12px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{chargesNote}</p>
            </div>
          </div>
        )}

        {/* Two-column layout — same grid as VCC */}
        <div className="px-4 sm:px-10 pb-[32px] grid gap-[24px] items-start grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* Left — Selected Declarations table */}
          <div className="min-w-0 bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] pt-[20px] pb-[12px] border-b border-[#eef1f6]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Selected Declarations</p>
              <p className="text-[14px] text-[#697498] mt-[4px]">
                {displayRows.length} declaration{displayRows.length !== 1 ? 's' : ''} selected for this claim
              </p>
            </div>
            <div className="overflow-x-auto px-[16px] py-[8px]">
              <table style={{ width: '100%', minWidth: 700, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
                <thead>
                  <tr>
                    {(showChargeType
                      ? [
                          { label: '#',                              w: 48  },
                          { label: declNoColumnLabel,                w: 170 },
                          { label: 'Declaration Clearance Date',     w: 180 },
                          { label: typeColumnLabel,                  w: 180 },
                          { label: 'Owner Code',                     w: 240 },
                          { label: 'Registration Charge',            w: 200 },
                          { label: 'Knowledge & Innovation Dirham',  w: 240 },
                        ]
                      : [
                          { label: '#',                              w: 48  },
                          { label: declNoColumnLabel,                w: 170 },
                          { label: typeColumnLabel,                  w: 180 },
                          { label: 'Owner Code',                     w: 240 },
                          { label: 'Registration Charge',            w: 200 },
                          { label: 'Knowledge & Innovation Dirham',  w: 240 },
                        ]
                    ).map((h, i) => (
                      <th key={h.label} style={{ width: h.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#0e1b3d', whiteSpace: 'nowrap', borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0 }}>
                        {h.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayRows.map((row, i) => (
                    <tr key={row.declarationNo}>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 48 }}>
                        <span className="text-[16px] text-[#697498]">{i + 1}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 170 }}>
                        <a href="#" onClick={(e) => { e.preventDefault(); onDeclarationOpen?.(row.declarationNo); }}
                          className="text-[16px] whitespace-nowrap hover:underline" style={{ color: '#1360d2', fontWeight: 500 }}>{row.declarationNo}</a>
                      </td>
                      {showChargeType && (
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 180 }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.declarationDate || '—'}</span>
                        </td>
                      )}
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 180 }}>
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{showChargeType ? (row.depositType || '—') : (row.declarationCategory ?? 'Freezone Export')}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 240 }}>
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.importerCode ? codeWithName(row.importerCode) : '—'}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 200 }}>
                        <span className="inline-flex items-center gap-[4px] text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>
                          <DirhamIcon size={13} color="#0e1b3d" />{REG_FEE}.00
                        </span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 240 }}>
                        <span className="inline-flex items-center gap-[4px] text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>
                          <DirhamIcon size={13} color="#0e1b3d" />{KNOW_FEE}.00
                        </span>
                      </td>
                    </tr>
                  ))}
                  {displayRows.length === 0 && (
                    <tr>
                      <td colSpan={showChargeType ? 7 : 6} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                        <span className="text-[16px] text-[#697498]">No declarations selected.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right — Payment Summary card (360px, same as VCC) */}
          <div className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[20px] pt-[20px] pb-[16px]" style={{ borderBottom: '1px solid #eef1f6' }}>
              <p className="text-[18px] text-[#051937]" style={{ fontWeight: 700 }}>Payment Summary</p>
            </div>
            <div className="px-[20px] py-[16px] flex flex-col gap-[12px]">
              {/* Line items — label left-aligned (60%), fee right-aligned (40%) */}
              {!hideDeclarationCount && (
                <div className="flex items-start">
                  <span className="text-[15px] text-[#697498] w-[60%] pr-[12px] text-left" style={{ fontFamily: font, lineHeight: 1.4 }}>{declarationCountLabel}</span>
                  <span className="text-[15px] text-[#051937] w-[40%] text-right" style={{ fontFamily: font, fontWeight: 500 }}>{displayRows.length}</span>
                </div>
              )}
              <div className="flex items-start">
                <span className="text-[15px] text-[#697498] w-[60%] pr-[12px] text-left" style={{ fontFamily: font, lineHeight: 1.4 }}>Sub Total of Registration Fee</span>
                <span className="flex items-center justify-end gap-[4px] text-[15px] text-[#051937] w-[40%]" style={{ fontFamily: font }}>
                  <DirhamIcon size={13} color="#051937" />{(REG_FEE * displayRows.length).toFixed(2)}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-[15px] text-[#697498] w-[60%] pr-[12px] text-left" style={{ fontFamily: font, lineHeight: 1.4 }}>Sub Total of Knowledge-Innovation Fee</span>
                <span className="flex items-center justify-end gap-[4px] text-[15px] text-[#051937] w-[40%]" style={{ fontFamily: font }}>
                  <DirhamIcon size={13} color="#051937" />{(KNOW_FEE * displayRows.length).toFixed(2)}
                </span>
              </div>
              <div className="flex items-start pt-[8px]" style={{ borderTop: '1px solid #eef1f6' }}>
                <span className="text-[16px] text-[#051937] w-[60%] pr-[12px] text-left" style={{ fontFamily: font, fontWeight: 700, lineHeight: 1.4 }}>Grand Total Amount</span>
                <span className="flex items-center justify-end gap-[4px] text-[18px] text-[#1360d2] w-[40%]" style={{ fontFamily: font, fontWeight: 700 }}>
                  <DirhamIcon size={15} color="#1360d2" />{(TOTAL_AED * displayRows.length).toFixed(2)}
                </span>
              </div>

              {/* Payment Mode */}
              <div className="flex flex-col gap-[6px] pt-[4px]">
                <label className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Payment Mode</label>
                <PlainSelect value={paymentMode} onChange={handlePaymentMode} options={PAYMENT_MODES} disabled={!!chargesNote} />
              </div>

              {/* Payment Reference — not applicable for Cash */}
              {!isCash && (
                <div className="flex flex-col gap-[6px]">
                  <label className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{isEPayment ? 'Payment Reference' : 'Account Number'}</label>
                  <PlainSelect value={paymentRef} onChange={isEPayment ? setPaymentRef : handleAccountSelect}
                    options={isEPayment ? PAYMENT_REFS : CREDIT_DEBIT_ACCOUNTS.map(a => a.label)} disabled={isEPayment || !!chargesNote}
                    placeholder={isEPayment ? 'Select reference' : 'Select account number'} />
                </div>
              )}
            </div>
          </div>

        </div>

        {!hideClaimantBroker && (
          <div className="px-4 sm:px-10 pb-[32px]">
            <ClaimantBrokerDetail />
          </div>
        )}
      </div>

      {/* Bottom bar */}
      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
          Back
        </button>
        <div className="flex items-center gap-[12px]">
          {!hideSaveExit && (
            <button data-secondary-btn onClick={() => setShowSaveModal(true)}
              className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Save &amp; Exit
            </button>
          )}
          <button onClick={() => onContinue(paymentMode, paymentRef)}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors hover:opacity-90"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Proceed
          </button>
        </div>
      </div>

      {showSaveModal && <SaveExitModal onCancel={() => setShowSaveModal(false)} onBackToListing={onBackToListing} />}

      {/* Insufficient balance on the selected Credit/Debit account */}
      {insufficientOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50" onClick={() => { setInsufficientOpen(false); setPaymentRef(''); }}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[460px] mx-[16px]"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#fdecec' }}>
              <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v5M12 16h.01" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-[8px]">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Insufficient Balance</p>
              <p className="text-[16px] text-[#697498]" style={{ lineHeight: 1.4 }}>
                The selected account does not have enough balance to complete this payment. Please select a different account or top up this one to proceed.
              </p>
            </div>
            <div className="flex gap-[12px]">
              <button data-secondary-btn onClick={() => { setInsufficientOpen(false); setPaymentRef(''); }}
                className="h-[48px] px-[28px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
                Go Back
              </button>
              <button onClick={() => { setInsufficientOpen(false); setPaymentRef(''); }}
                className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', fontWeight: 500 }}>
                Top Up Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
