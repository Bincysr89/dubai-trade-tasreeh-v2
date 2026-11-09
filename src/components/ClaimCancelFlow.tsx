import React, { useEffect, useRef, useState } from 'react';
import NonRemittanceClaimViewPage from './NonRemittanceClaimViewPage';
import RefundDepositsClaimViewPage from './RefundDepositsClaimViewPage';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';

const font = "'Dubai', sans-serif";

/* DTSelect-style dropdown with a fixed-position menu so it escapes
   overflow containers (payment table card). */
function PaySelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const [pos,  setPos]  = useState<{ top: number; left: number; width: number } | null>(null);
  const btnRef          = useRef<HTMLButtonElement>(null);

  const toggle = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 2, left: r.left, width: r.width });
    }
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
        className="w-full bg-white rounded-[4px] flex items-center px-[12px] text-left transition-colors"
        style={{ height: 48, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer' }}>
        <span className="flex-1 text-[16px]" style={{ color: '#0e1b3d' }}>{value}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"
          className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      {open && pos && (
        <div className="py-[4px]" role="listbox"
          style={{ position: 'fixed', top: pos.top, left: pos.left, width: Math.max(pos.width, 160), zIndex: 9999,
            background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
            overflow: 'hidden', fontFamily: font }}>
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

// ── shared helpers (mirrors CargoTransferCancelFlow) ─────────────────────────

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px] py-[12px] px-[12px]" style={{ minWidth: 240, flex: '0 0 280px' }}>
      <span className="text-[16px]" style={{ fontFamily: font, color: '#455174', whiteSpace: 'nowrap' }}>{label}</span>
      <span className="text-[18px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>{value || '—'}</span>
    </div>
  );
}

function PageTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-[28px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, color: '#0e1b3d' }}>
      {children}
    </h1>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[20px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>
      {children}
    </p>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`bg-white rounded-[8px] overflow-hidden ${className}`}
      style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}
    >
      {children}
    </div>
  );
}

function OutlineBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button data-secondary-btn
      onClick={onClick}
      className="h-[48px] px-[20px] rounded-[4px] flex items-center justify-center text-[16px] transition-colors"
      style={{ border: '1px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-[48px] px-[40px] rounded-[4px] flex items-center justify-center text-[16px] text-white hover:opacity-90 transition-opacity"
      style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
    >
      {children}
    </button>
  );
}

function BottomNav({ onBack, onProceed, proceedLabel = 'Proceed', extraBtn }: {
  onBack: () => void;
  onProceed?: () => void;
  proceedLabel?: string;
  extraBtn?: React.ReactNode;
}) {
  return (
    <div
      className="flex-shrink-0 bg-white flex items-center justify-between px-[40px] h-[88px]"
      style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}
    >
      <OutlineBtn onClick={onBack}>Back</OutlineBtn>
      <div className="flex items-center gap-[12px]">
        {extraBtn}
        {onProceed && <PrimaryBtn onClick={onProceed}>{proceedLabel}</PrimaryBtn>}
      </div>
    </div>
  );
}

function Breadcrumb({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Refund &amp; Claims</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cancel Claim</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-9106286 — SW Logistics LLC</span>
      </div>
    </div>
  );
}

// ── Claim data — sourced from the claim's actual type so the cancel flow shows
//    Refund of Deposits / Refund of Duty details instead of always Non Remittance ──

const CANCEL_REASONS = ['Wrong Declaration Claimed', 'Not Interested', 'Others'];

const isRdClaimType = (claimType: string) => claimType === 'Refund of Deposits' || claimType === 'Refund of Duty';

function getClaimTitle(claimType: string) {
  return isRdClaimType(claimType) ? `Cancel - ${claimType} - 3842063` : 'Cancel - Non Remittance Claim - 2420390';
}

/* Claim Details card — field set mirrors the legacy Cancel Claim screen. */
function getClaimDetails(claimType: string): { label: string; value: string }[] {
  if (isRdClaimType(claimType)) {
    return [
      { label: 'Claim No.',                     value: '3842063 (Version 1)' },
      { label: 'Claim Type',                    value: claimType },
      { label: 'Deposit Method',                value: 'Standing Guarantee' },
      { label: 'Claimant Code - Name (Type)',   value: 'AE-1019056 - CONSOLIDATED SHIPPING SERVICES L.L.C (Business)' },
      { label: 'Submission Date',               value: '29/06/2026' },
      { label: 'Registration Date',             value: '29/06/2026' },
      { label: 'Total No. of Sub Claims',       value: '1' },
    ];
  }
  return [
    { label: 'Claim No.',                     value: '2420390 (Version 1)' },
    { label: 'Claim Type',                    value: 'Non Remittance' },
    { label: 'Deposit Method',                value: 'Non Remittance Claim' },
    { label: 'Claimant Code - Name (Type)',   value: 'AE-9106286 - SW Logistics LLC (Business)' },
    { label: 'Submission Date',               value: '29/06/2026' },
    { label: 'Registration Date',             value: '29/06/2026' },
    { label: 'Total No. of Sub Claims',       value: '1' },
  ];
}

// ── Step 1: Reason for Cancellation ──────────────────────────────────────────

function Step1({ onBack, onProceed, onViewClaim, reason, setReason, reasonDesc, setReasonDesc, claimTitle, claimDetails }: {
  onBack: () => void; onProceed: () => void; onViewClaim: () => void;
  reason: string; setReason: (v: string) => void;
  reasonDesc: string; setReasonDesc: (v: string) => void;
  claimTitle: string; claimDetails: { label: string; value: string }[];
}) {
  const [reasonOpen, setReasonOpen] = useState(false);
  const [reasonPos, setReasonPos] = useState<{ top: number; left: number; width: number } | null>(null);
  const reasonBtnRef = useRef<HTMLButtonElement>(null);

  const toggleReason = () => {
    if (reasonBtnRef.current) {
      const r = reasonBtnRef.current.getBoundingClientRect();
      setReasonPos({ top: r.bottom + 4, left: r.left, width: r.width });
    }
    setReasonOpen(o => !o);
  };
  useEffect(() => {
    if (!reasonOpen) return;
    const close = (e: MouseEvent) => { if (reasonBtnRef.current && !reasonBtnRef.current.contains(e.target as Node)) setReasonOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [reasonOpen]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <Breadcrumb onBack={onBack} />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        <div className="mb-[8px]">
          <PageTitle>{claimTitle}</PageTitle>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Cancellation Details */}
          <Card className="p-[20px]">
            <p className="text-[20px] mb-[20px]" style={{ fontFamily: font, fontWeight: 500 }}>Cancellation Details</p>
            <div className="flex flex-col gap-[20px]">
              {/* Cancellation Reason dropdown */}
              <div style={{ width: 390 }}>
                <button
                  ref={reasonBtnRef}
                  type="button"
                  onClick={toggleReason}
                  className="w-full bg-white rounded-[4px] h-[56px] flex items-center px-[16px] gap-[8px] cursor-pointer text-left relative"
                  style={{ border: `1px solid ${reasonOpen ? '#1360d2' : '#d5ddfb'}` }}
                >
                  <span className="absolute pointer-events-none transition-all"
                    style={{ left: (reasonOpen || reason) ? 10 : 16, top: (reasonOpen || reason) ? -9 : '50%', transform: (reasonOpen || reason) ? 'none' : 'translateY(-50%)',
                      background: (reasonOpen || reason) ? '#fff' : 'transparent', padding: (reasonOpen || reason) ? '0 4px' : 0,
                      fontSize: (reasonOpen || reason) ? 12 : 16, color: reasonOpen ? '#1360d2' : '#697498', fontFamily: font, transitionDuration: '120ms', zIndex: 1 }}>
                    <span style={{ color: '#ea2428' }}>* </span>Cancellation Reason
                  </span>
                  <span className="flex-1 text-[16px] whitespace-nowrap" style={{ fontFamily: font, color: '#0e1b3d' }}>{reason}</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" className={`transition-transform ${reasonOpen ? 'rotate-180' : ''}`}>
                    <path d="M6 9l6 6 6-6" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {reasonOpen && reasonPos && (
                  <div className="py-[4px]" role="listbox"
                    style={{ position: 'fixed', top: reasonPos.top, left: reasonPos.left, width: reasonPos.width, zIndex: 9999,
                      background: '#fff', borderRadius: 8, border: '1px solid #f0f0f5', boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', overflow: 'hidden', fontFamily: font }}>
                    {CANCEL_REASONS.map(r => (
                      <button key={r} type="button"
                        onMouseDown={e => { e.preventDefault(); setReason(r); setReasonOpen(false); }}
                        className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors hover:bg-[#e2ebf9]"
                        style={{ background: r === reason ? '#e2ebf9' : 'transparent', color: r === reason ? '#1360d2' : '#0e1b3d', fontWeight: r === reason ? 500 : 400, fontFamily: font }}>
                        {r}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* Cancellation Reason Description — only when "Others" is selected */}
              {reason === 'Others' && (
                <div className="relative" style={{ width: '50%', minWidth: 300 }}>
                  <p className="text-[14px] mb-[6px]" style={{ fontFamily: font, color: '#697498' }}>Cancellation Reason Description</p>
                  <textarea
                    value={reasonDesc}
                    onChange={e => setReasonDesc(e.target.value)}
                    rows={2}
                    className="w-full rounded-[4px] px-[16px] py-[12px] text-[16px] resize-none focus:outline-none"
                    style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: 'white' }}
                    placeholder='Enter reason if "others" option is selected'
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Claim Details */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <SectionLabel>Claim Details</SectionLabel>
              <OutlineBtn onClick={onViewClaim}>
                <span className="whitespace-nowrap">View Claim</span>
              </OutlineBtn>
            </div>
            <Card className="p-[20px]">
              <div className="flex flex-wrap gap-[20px]">
                {claimDetails.map(f => (
                  <InfoCard key={f.label} label={f.label} value={f.value} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav onBack={onBack} onProceed={onProceed} />
    </div>
  );
}

// ── Step 2: Document Upload ───────────────────────────────────────────────────

const UPLOADED_DOCS = [
  { name: 'Invoice 12124.PDF',  type: 'Invoice',  size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 898486.xls', type: 'Invoice',  size: '50 MB', date: '12-12-2024' },
  { name: 'BOL123.pdf',         type: 'AWB/BOL',  size: '50 MB', date: '08-12-2024' },
];

const DOC_TYPES = [
  { docName: 'Other Documents', docNature: 'Any', mandatory: true },
];

function Step2({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  const [dragging, setDragging] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [otherDocType, setOtherDocType] = useState('');

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <Breadcrumb onBack={onBack} />

      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        <div className="mb-[8px]">
          <PageTitle>Documents Upload</PageTitle>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Upload Documents — same design as the suspension response upload */}
          <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">

            {/* Left card — Doc type selector */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[20px]"
              style={{ flex: '0 0 calc(66% - 8px)', minWidth: 280, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                <p className="text-[16px] text-[#697498]">Choose the document type and upload the supporting file.</p>
              </div>
              <div className="flex flex-col gap-[10px]">
                <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Select Document Type</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[12px] gap-y-[8px]">
                  {DOC_TYPES.map((doc, i) => {
                    const active = selectedDoc === i;
                    return (
                      <label key={doc.docName} onClick={() => setSelectedDoc(i)}
                        className="flex items-start gap-[10px] px-[12px] py-[10px] rounded-[6px] cursor-pointer transition-colors"
                        style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}>
                        <span className="size-[17px] rounded-full flex-shrink-0 inline-flex items-center justify-center mt-[2px]"
                          style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
                          {active && <span className="size-[7px] rounded-full" style={{ background: '#1360d2' }} />}
                        </span>
                        <div className="flex items-center flex-wrap gap-[5px]">
                          <span className="text-[16px] leading-snug" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>
                            {doc.mandatory && <span style={{ color: '#dc3545', marginRight: 2 }}>*</span>}{doc.docName}
                          </span>
                          <span className="text-[14px] px-[6px] py-[1px] rounded-[4px]"
                            style={{ background: active ? 'rgba(19,96,210,0.10)' : '#eef1f8', color: active ? '#1360d2' : '#697498', fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {doc.docNature}
                          </span>
                        </div>
                      </label>
                    );
                  })}
                </div>
                {/* Other Documents — enter custom type */}
                {selectedDoc === DOC_TYPES.length - 1 && (
                  <div className="flex flex-col gap-[6px] mt-[4px]" style={{ maxWidth: 420 }}>
                    <label className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                      <span className="text-[#ea2428]">* </span>Document Type
                    </label>
                    <input
                      type="text"
                      value={otherDocType}
                      onChange={(e) => setOtherDocType(e.target.value)}
                      placeholder="Enter document type"
                      className="h-[44px] w-full border rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] transition-colors"
                      style={{ borderColor: '#d5ddfb', fontFamily: font }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right card — File uploader */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]"
              style={{ flex: '0 0 calc(34% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                <p className="text-[16px] text-[#697498]">* Supported file types: .pdf, .jpg, .png, .xlsx — max file size up to 50 MB</p>
              </div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] flex-1 transition-colors"
                style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#f8fafd' }}
              >
                <div className="size-[56px] rounded-full inline-flex items-center justify-center" style={{ background: '#e2ebf9' }}>
                  <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </div>
                <p className="text-[16px] text-[#697498] text-center">Drag and drop or</p>
                <button type="button"
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px]"
                  style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, background: '#fff' }}>
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Documents uploaded table */}
          <Card className="p-[20px]">
            <p className="text-[24px] mb-[16px]" style={{ fontFamily: font, fontWeight: 500, color: '#051937' }}>Documents Uploaded</p>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font }}>
                <thead>
                  <tr>
                    {['', 'Document Name', 'Document Type', 'Uploaded size', 'Uploaded on', 'Action'].map((h, i) => (
                      <th
                        key={h + i}
                        style={{
                          background: '#a6c2e9', padding: '10px 12px', textAlign: 'left',
                          fontWeight: 500, fontSize: 14, color: '#696f83',
                          borderRadius: i === 0 ? '8px 0 0 8px' : i === 5 ? '0 8px 8px 0' : 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UPLOADED_DOCS.map((doc, i) => (
                    <tr key={i}>
                      <td style={{ padding: '12px', fontSize: 16, color: '#051937', textAlign: 'center' }}>{i + 1}</td>
                      <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.name}</td>
                      <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.type}</td>
                      <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.size}</td>
                      <td style={{ padding: '12px', fontSize: 16, color: '#051937' }}>{doc.date}</td>
                      <td style={{ padding: '12px' }}>
                        <div className="flex items-center gap-[16px]">
                          <button className="text-[#dc3545] hover:opacity-70 transition-opacity" aria-label="Delete">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                          <button className="text-[#1360d2] hover:opacity-70 transition-opacity" aria-label="Download">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      <BottomNav onBack={onBack} onProceed={onProceed} />
    </div>
  );
}

// ── Step 3: Payment ───────────────────────────────────────────────────────────

const PAYMENT_MODES = ['Credit/Debit Account', 'Cash', 'Cheque'];
const PAYMENT_REFS  = ['Standard Guarantee', 'Account Number', 'Transaction ID'];

function Step3({ onBack, onProceed, onViewClaim, claimTitle }: { onBack: () => void; onProceed: () => void; onViewClaim: () => void; claimTitle: string }) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef, setPaymentRef]   = useState('Standard Guarantee');

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <Breadcrumb onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        {/* Title + View Claim */}
        <div className="flex items-start justify-between gap-[16px] mb-[8px]">
          <PageTitle>{claimTitle}</PageTitle>
          <OutlineBtn onClick={onViewClaim}>
            <span className="whitespace-nowrap">View Claim Details</span>
          </OutlineBtn>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Payment Details table */}
          <div className="flex flex-col gap-[8px]">
            <SectionLabel>Payment Details</SectionLabel>
            <Card className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr style={{ background: '#a6c2e9' }}>
                    {['Charges', 'Amount', 'Payment Mode', 'Payment Reference'].map((h, i) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 8px', textAlign: 'left', fontSize: 16, fontWeight: 500, color: '#051937',
                          borderRadius: i === 0 ? '5px 0 0 5px' : i === 3 ? '0 5px 5px 0' : 0,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '16px 8px', fontSize: 18, fontWeight: 500, color: '#051937' }}>
                      Claim Cancellation Charge:
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div className="flex items-center gap-[12px]">
                        <span className="text-[18px]" style={{ fontFamily: font, color: '#051937' }}>AED 100.00</span>
                        <span
                          className="text-[16px] px-[12px] py-[4px] rounded-[4px]"
                          style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
                        >
                          Collect
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ width: 260 }}>
                        <PaySelect value={paymentMode} onChange={setPaymentMode} options={PAYMENT_MODES} />
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div style={{ width: 260 }}>
                        <PaySelect value={paymentRef} onChange={setPaymentRef} options={PAYMENT_REFS} />
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* Claimant and Broker Detail — same as Raise New Claim */}
          <ClaimantBrokerDetail />
        </div>
      </div>

      <BottomNav onBack={onBack} onProceed={onProceed} />
    </div>
  );
}

// ── Step 4: Summary / Submit ──────────────────────────────────────────────────

function Step4({ onBack, onSubmit, onViewClaim, reason, reasonDesc, claimTitle, claimDetails }: {
  onBack: () => void; onSubmit: () => void; onViewClaim: () => void;
  reason: string; reasonDesc: string;
  claimTitle: string; claimDetails: { label: string; value: string }[];
}) {
  const [declared, setDeclared] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <Breadcrumb onBack={onBack} />
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        {/* Title + View Claim */}
        <div className="flex items-start justify-between gap-[16px] mb-[8px]">
          <PageTitle>{claimTitle}</PageTitle>
          <OutlineBtn onClick={onViewClaim}>
            <span className="whitespace-nowrap">View Claim Details</span>
          </OutlineBtn>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Cancellation Details summary */}
          <div className="flex flex-col gap-[8px]">
            <SectionLabel>Cancellation Details</SectionLabel>
            <Card className="px-[20px] py-[32px]">
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="Cancellation Reason"    value={reason || '—'} />
                {reason === 'Others' && (
                  <InfoCard label="Cancellation Reason Description" value={reasonDesc || '—'} />
                )}
                <InfoCard label="Total No. of Sub Claims" value="1" />
                <InfoCard label="Total Charges"           value="100.00 AED" />
              </div>
            </Card>
          </div>

          {/* Claim Details summary */}
          <div className="flex flex-col gap-[8px]">
            <SectionLabel>Claim Details</SectionLabel>
            <Card className="px-[20px] py-[32px]">
              <div className="flex flex-wrap gap-[20px]">
                {claimDetails.map(f => (
                  <InfoCard key={f.label} label={f.label} value={f.value} />
                ))}
              </div>
            </Card>
          </div>

          {/* Declaration checkbox */}
          <Card className="px-[20px] py-[16px]">
            <label className="flex items-start gap-[16px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declared}
                onChange={e => setDeclared(e.target.checked)}
                className="size-[20px] rounded cursor-pointer flex-shrink-0 mt-[2px]"
                style={{ accentColor: '#1360d2' }}
              />
              <span className="text-[16px]" style={{ fontFamily: font, color: '#0e1b3d' }}>
                I, hereby, declare that all the information entered and stated in the Request is true and correct and shall bear full responsibility for entering incorrect statement and all the consequences arising thereof.
              </span>
            </label>
          </Card>
        </div>
      </div>

      <BottomNav
        onBack={onBack}
        onProceed={() => setConfirmCancel(true)}
        proceedLabel="Submit"
        extraBtn={<OutlineBtn onClick={onViewClaim}>View Claim</OutlineBtn>}
      />

      {/* Cancel confirmation dialog */}
      {confirmCancel && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50" onClick={() => setConfirmCancel(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[480px] mx-[16px]"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#fff8e6' }}>
              <svg viewBox="0 0 96 96" fill="none" width="34" height="34">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#FFC020" strokeWidth="7" />
                <rect x="44.5" y="22" width="7" height="32" rx="3.5" fill="#FFC020" />
                <circle cx="48" cy="68" r="4.5" fill="#FFC020" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-[8px]">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure to Cancel Claim?</p>
              <p className="text-[16px] text-[#697498]" style={{ lineHeight: 1.4 }}>Please note, the registration charges paid for this claim will not be refunded.</p>
            </div>
            <div className="flex gap-[12px]">
              <button data-secondary-btn onClick={() => setConfirmCancel(false)}
                className="h-[48px] px-[36px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
                No
              </button>
              <button onClick={() => { setConfirmCancel(false); onSubmit(); }}
                className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', fontWeight: 500 }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Success Popup ─────────────────────────────────────────────────────────────

function SuccessPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50">
      <div
        className="bg-white rounded-[8px] flex flex-col items-center justify-center gap-[16px] px-[60px] py-[60px]"
        style={{ minWidth: 520, maxWidth: 600, boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
      >
        {/* Green check */}
        <div
          className="size-[100px] rounded-full flex items-center justify-center"
          style={{ background: '#27ae60' }}
        >
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <p className="text-[24px] text-center" style={{ fontFamily: font, fontWeight: 500, color: '#111838' }}>
          Claim Cancellation Request Submitted Successfully
        </p>

        <div className="text-center flex flex-col gap-[8px]">
          <p className="text-[18px]" style={{ fontFamily: font, color: '#455174' }}>
            Your request has been sent for approval.
          </p>
          <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] inline-flex items-center gap-[6px]" style={{ fontFamily: font }}>
            <span className="text-[16px] text-[#696f83]">Request Number:</span>
            <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>REQ123456</span>
          </div>
          <div className="border border-[#ebebeb] rounded-[5px] px-[12px] py-[8px] inline-flex items-center gap-[6px]" style={{ fontFamily: font }}>
            <span className="text-[16px] text-[#696f83]">Claim Number:</span>
            <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>2420390</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="h-[48px] px-[24px] rounded-[3px] text-[16px] text-white capitalize hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back to Listing
        </button>
      </div>
    </div>
  );
}

// ── Main flow ─────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4;

type Props = { onBack: () => void; claimType?: string };

export default function ClaimCancelFlow({ onBack, claimType = 'Non Remittance' }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showViewClaim, setShowViewClaim] = useState(false);
  const [reason, setReason] = useState('');
  const [reasonDesc, setReasonDesc] = useState('');

  const claimTitle = getClaimTitle(claimType);
  const claimDetails = getClaimDetails(claimType);

  const handleSuccess  = () => setShowSuccess(true);
  const handleClose    = () => { setShowSuccess(false); onBack(); };
  const openViewClaim  = () => setShowViewClaim(true);
  const closeViewClaim = () => setShowViewClaim(false);

  if (showViewClaim) {
    return (
      <div className="flex flex-col h-full">
        {isRdClaimType(claimType)
          ? <RefundDepositsClaimViewPage claimType={claimType} onBack={closeViewClaim} />
          : <NonRemittanceClaimViewPage selectedRows={[]} uploadedDocs={[]} onBack={closeViewClaim} />}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {step === 1 && (
          <Step1 onBack={onBack} onProceed={() => setStep(2)} onViewClaim={openViewClaim}
            reason={reason} setReason={setReason} reasonDesc={reasonDesc} setReasonDesc={setReasonDesc}
            claimTitle={claimTitle} claimDetails={claimDetails} />
        )}
        {step === 2 && <Step2 onBack={() => setStep(1)} onProceed={() => setStep(4)} />}
        {step === 4 && (
          <Step4 onBack={() => setStep(2)} onSubmit={handleSuccess} onViewClaim={openViewClaim}
            reason={reason} reasonDesc={reasonDesc} claimTitle={claimTitle} claimDetails={claimDetails} />
        )}
      </div>

      {showSuccess && <SuccessPopup onClose={handleClose} />}
    </>
  );
}
