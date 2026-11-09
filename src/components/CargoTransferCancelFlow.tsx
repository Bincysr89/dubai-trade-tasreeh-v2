import React, { useState } from 'react';
import CargoTransferViewPage from './CargoTransferViewPage';

const font = "'Dubai', sans-serif";

// ── shared helpers ────────────────────────────────────────────────────────────

function SelectDropdown({ label, value, options, onChange, required }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div className="relative flex-shrink-0" style={{ minWidth: 220 }}>
      <div
        className="bg-white rounded-[4px] h-[56px] relative flex items-center px-[16px] gap-[8px] cursor-pointer"
        style={{ border: '1px solid #d5ddfb' }}
      >
        <span className="flex-1 text-[16px]" style={{ fontFamily: font, color: '#0e1b3d' }}>
          {required && <span style={{ color: '#ea2428' }}>*  </span>}{value || label}
        </span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
          <path d="M6 9l6 6 6-6" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function PartyInfoCard({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center flex-wrap gap-y-[12px]">
        {items.map((item, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col gap-[4px] px-[12px] py-[4px]">
              <span style={{ fontSize: 14, color: '#696f83', fontFamily: font, fontWeight: 400, whiteSpace: 'nowrap' }}>{item.label}</span>
              <span style={{ fontSize: 18, color: '#051937', fontFamily: font, fontWeight: 500 }}>{item.value}</span>
            </div>
            {i < items.length - 1 && (
              <div style={{ width: 1, height: 40, background: '#e8edf5', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string; light?: boolean }) {
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

// ── Step 1: Reason for Cancellation ──────────────────────────────────────────

const CANCEL_REASONS = ['Business code wrongly declared', 'Wrong cargo details', 'Duplicate request', 'Other'];
const CARGO_STATUSES = ['Available', 'Not available', 'Partially available'];

const REQUEST_DETAILS = [
  { label: 'Cargo Transfer No.',                       value: '6010000397426' },
  { label: 'Cargo Transfer Date',                      value: '27-04-2026' },
  { label: 'Cargo Transfer Type',                      value: 'Cargo Transfer from CTO to CH (Same Location)' },
  { label: 'Transferor Business Code-Name',            value: 'AE-1000137-Dnata & DPW Business' },
  { label: 'Transferor Premises Code-Name',            value: 'PR-00015-DPWorld' },
  { label: 'Transferee Business Code-Name',            value: 'AE-1000143-Al Cargo' },
  { label: 'Transferee Premises Code-Name',            value: 'PR-00029-Al rolla' },
  { label: 'Broker Business Code-Name',                value: 'AE-9106286-SW Logistics LLC' },
  { label: "Client's Dec. Ref. No.",                   value: 'TET202020' },
  { label: 'Inbound Cargo Channel',                    value: 'Sea' },
  { label: 'Inbound Carrier Registration Number',      value: '825456' },
  { label: 'Inbound Carrier Name',                     value: 'ALBERT MAERSK' },
  { label: 'Arrival Date',                             value: '29-04-2026' },
  { label: 'Inbound MAWB/MBOL',                        value: 'REF205020' },
  { label: 'Outbound Cargo Channel',                   value: '—' },
];

function Step1({ onBack, onProceed, onViewRequest }: { onBack: () => void; onProceed: () => void; onViewRequest: () => void }) {
  const [reason, setReason] = useState('Reason of Cancelation - Other');
  const [cargoStatus, setCargoStatus] = useState('');
  const [remarks, setRemarks] = useState('');

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        {/* Title */}
        <div className="mb-[8px]">
          <PageTitle>
            Cancel - Cargo Transfer from CTO to CH (Same Location) - 601001745352
          </PageTitle>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Cancellation Details */}
          <Card className="p-[20px]">
            <p className="text-[20px] mb-[20px]" style={{ fontFamily: font, fontWeight: 500 }}>Cancellation Details</p>
            <div className="flex flex-col gap-[20px]">
              <div className="flex gap-[20px] flex-wrap">
                {/* Reason of Cancellation dropdown */}
                <div className="relative" style={{ width: 390 }}>
                  <div
                    className="bg-white rounded-[4px] h-[56px] flex items-center px-[16px] gap-[8px] cursor-pointer"
                    style={{ border: '1px solid #d5ddfb' }}
                  >
                    <span className="flex-1 text-[16px] whitespace-nowrap" style={{ fontFamily: font, color: '#0e1b3d' }}>
                      <span style={{ color: '#ea2428' }}>*  </span>
                      {reason}
                    </span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
                {/* Cargo Status dropdown */}
                <div className="relative" style={{ width: 280 }}>
                  <div
                    className="bg-white rounded-[4px] h-[56px] flex items-center px-[16px] gap-[8px] cursor-pointer"
                    style={{ border: '1px solid #d5ddfb' }}
                  >
                    <span className="flex-1 text-[16px]" style={{ fontFamily: font, color: '#0e1b3d' }}>
                      <span style={{ color: '#ea2428' }}>*</span>
                      {'  '}{cargoStatus || 'Cargo Status'}
                    </span>
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="#697498" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              {/* Reason text field — half width */}
              <div className="relative" style={{ width: '50%', minWidth: 300 }}>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  rows={2}
                  className="w-full rounded-[4px] px-[16px] py-[12px] text-[16px] resize-none focus:outline-none"
                  style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: 'white' }}
                  placeholder="Reason"
                />
              </div>
            </div>
          </Card>

          {/* Cargo Transfer Request Details */}
          <div className="flex flex-col gap-[12px]">
            <div className="flex items-center justify-between">
              <SectionLabel>Cargo Transfer Request Details</SectionLabel>
              <OutlineBtn onClick={onViewRequest}>
                <span className="whitespace-nowrap">View Cargo Transfer Details</span>
              </OutlineBtn>
            </div>
            <Card className="p-[20px]">
              <div className="flex flex-wrap gap-[20px]">
                {REQUEST_DETAILS.map(f => (
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
  { name: 'Invoice 12124.PDF',  authority: 'Dubai Customs', type: 'Invoice',  size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 898486.xls', authority: 'Dubai Customs', type: 'Invoice',  size: '50 MB', date: '12-12-2024' },
  { name: 'Invoice 189777.pdf', authority: 'Dubai Customs', type: 'Invoice',  size: '50 MB', date: '08-12-2024' },
  { name: 'BOL123.pdf',         authority: 'Dubai Customs', type: 'AWB/BOL', size: '50 MB', date: '08-12-2024' },
];

function Step2({ onBack, onProceed }: { onBack: () => void; onProceed: () => void }) {
  const [dragging, setDragging] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        <div className="mb-[8px]">
          <PageTitle>Documents Upload</PageTitle>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Upload card */}
          <Card className="p-[24px]">
            <div className="flex gap-[24px]">
              {/* Left: doc type selection */}
              <div className="flex-1">
                <p className="text-[24px] mb-[8px]" style={{ fontFamily: font, fontWeight: 500, color: '#060c28' }}>Upload Documents</p>
                <p className="text-[18px] mb-[20px]" style={{ fontFamily: font, color: '#323c64' }}>
                  Select the document type and upload the file, we will share the documents with authorities
                </p>
                <label className="flex items-center gap-[17px] cursor-pointer select-none">
                  <div className="flex-shrink-0 size-[18px] rounded-full border-[2px] flex items-center justify-center" style={{ borderColor: '#1360d2' }}>
                    <div className="size-[9px] rounded-full bg-[#1360d2]" />
                  </div>
                  <span className="text-[18px]" style={{ fontFamily: font, color: '#060c28' }}>Supporting Documents</span>
                </label>
              </div>

              {/* Right: file upload */}
              <div className="bg-white rounded-[8px] overflow-hidden p-[20px] flex flex-col gap-[12px]" style={{ width: 516, border: '1px solid #f0f0f5' }}>
                <p className="text-[20px]" style={{ fontFamily: font, fontWeight: 500, color: '#060c28' }}>Upload File</p>
                <p className="text-[16px]" style={{ fontFamily: font, color: '#323c64' }}>
                  *Supported file type of .pdf, .jpg etc, max file size up to 50MB
                </p>
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false); }}
                  className="flex-1 min-h-[200px] flex flex-col items-center justify-center gap-[12px] rounded-[4px] transition-colors"
                  style={{
                    background: dragging ? '#e2ebf9' : '#f8fafd',
                    border: `1px dashed ${dragging ? '#1360d2' : '#8f94ae'}`,
                  }}
                >
                  <div className="size-[60px] rounded-full bg-[#dfe5e9] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                    </svg>
                  </div>
                  <p className="text-[16px]" style={{ fontFamily: font, color: '#6d707e' }}>Drag and drop or</p>
                  <button data-secondary-btn
                    className="h-[48px] px-[20px] rounded-[4px] text-[16px] transition-colors"
                    style={{ border: '1px solid #1360d2', color: '#1360d2', fontFamily: font }}
                  >
                    Choose File
                  </button>
                </div>
              </div>
            </div>
          </Card>

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
                        {h && (
                          <div className="flex items-center gap-[4px]">
                            <span>{h}</span>
                            {h !== 'Action' && (
                              <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
                                <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
                              </svg>
                            )}
                          </div>
                        )}
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
                          <button className="text-[#dc3545] hover:opacity-70 transition-opacity">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4h6v2" />
                            </svg>
                          </button>
                          <button className="text-[#1360d2] hover:opacity-70 transition-opacity">
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

function Step3({ onBack, onProceed, onViewRequest }: { onBack: () => void; onProceed: () => void; onViewRequest: () => void }) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef, setPaymentRef]   = useState('Standard Guarantee');
  const [agreed, setAgreed] = useState(true);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        {/* Title + View Request */}
        <div className="flex items-start justify-between gap-[16px] mb-[8px]">
          <PageTitle>
            Cancel - Cargo Transfer from CTO to CH (Same Location) - 601001745352
          </PageTitle>
          <OutlineBtn onClick={onViewRequest}>
            <span className="whitespace-nowrap">View Cargo Transfer Details</span>
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
                      Declaration Cancellation Charge:
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div className="flex items-center gap-[12px]">
                        <span className="text-[18px]" style={{ fontFamily: font, color: '#051937' }}>AED 1124.45</span>
                        <span
                          className="text-[16px] px-[12px] py-[4px] rounded-[4px]"
                          style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
                        >
                          Collect
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div className="relative" style={{ width: 260 }}>
                        <select
                          value={paymentMode}
                          onChange={e => setPaymentMode(e.target.value)}
                          className="appearance-none w-full h-[48px] pl-[12px] pr-[36px] rounded-[4px] text-[16px] cursor-pointer focus:outline-none"
                          style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d' }}
                        >
                          {PAYMENT_MODES.map(m => <option key={m}>{m}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="#455174" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </td>
                    <td style={{ padding: '16px 8px' }}>
                      <div className="relative" style={{ width: 260 }}>
                        <select
                          value={paymentRef}
                          onChange={e => setPaymentRef(e.target.value)}
                          className="appearance-none w-full h-[48px] pl-[12px] pr-[36px] rounded-[4px] text-[16px] cursor-pointer focus:outline-none"
                          style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d' }}
                        >
                          {PAYMENT_REFS.map(r => <option key={r}>{r}</option>)}
                        </select>
                        <svg className="pointer-events-none absolute right-[10px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="#455174" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </div>

          {/* Declaration checkbox */}
          <Card className="px-[20px] py-[16px]">
            <label className="flex items-center gap-[16px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="size-[20px] rounded cursor-pointer"
                style={{ accentColor: '#1360d2' }}
              />
              <span className="text-[16px]" style={{ fontFamily: font, color: '#0e1b3d' }}>
                We hereby request you to cancel this cargo transfer request as the cargo is no longer required to be transferred/cargo is not available for transfer.
              </span>
            </label>
          </Card>

          {/* Party Information */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[24px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Party Information</h2>
            <div className="flex gap-[20px]">
              <div className="flex-1">
                <PartyInfoCard items={[
                  { label: 'Transferor Business Code & Name', value: 'AE-1000137-Dnata & DPW Business' },
                  { label: 'Transferor Premises Code & Name', value: 'PR-00015-DPWorld' },
                  { label: 'License Expires on', value: '20-11-2036' },
                ]} />
              </div>
              <div className="flex-1">
                <PartyInfoCard items={[
                  { label: 'Transferee Business Code & Name', value: 'AE-1000143-Al Cargo' },
                  { label: 'Transferee Premises Code & Name', value: 'PR-00029-Al rolla' },
                  { label: 'License Expires on', value: '20-11-2036' },
                  { label: 'VAT TRN', value: '20-11-2036' },
                ]} />
              </div>
            </div>
            <PartyInfoCard items={[
              { label: 'Broker Business Code & Name', value: 'AE-9106286-SW Logistics LLC' },
              { label: 'License Expires on', value: '15-11-2029' },
            ]} />
          </div>
        </div>
      </div>

      <BottomNav onBack={onBack} onProceed={onProceed} />
    </div>
  );
}

// ── Step 4: Summary / Submit ──────────────────────────────────────────────────

const CARGO_TRANSFER_SUMMARY = [
  { label: 'Cargo Transfer No.',                       value: '6010000397426' },
  { label: 'Cargo Transfer Date',                      value: '27-04-2026' },
  { label: 'Cargo Transfer Type',                      value: 'Cargo Transfer from CTO to CH (Same Location)' },
  { label: 'Transferor Business Code-Name',            value: 'AE-1000137-Dnata & DPW Business' },
  { label: 'Transferor Premises Code-Name',            value: 'PR-00015-DPWorld' },
  { label: 'Transferee Business Code-Name',            value: 'AE-1000143-Al Cargo' },
  { label: 'Transferee Premises Code-Name',            value: 'PR-00029-Al rolla' },
  { label: 'Broker Business Code-Name',                value: 'AE-9106286-SW Logistics LLC' },
  { label: "Client's Dec. Ref. No.",                   value: 'TET202020' },
  { label: 'Inbound Cargo Channel',                    value: 'Sea' },
  { label: 'Inbound Carrier Registration Number',      value: '825456' },
  { label: 'Inbound Carrier Name',                     value: 'ALBERT MAERSK' },
  { label: 'Arrival Date',                             value: '29-04-2026' },
  { label: 'Inbound MAWB/MBOL',                        value: 'REF205020' },
  { label: 'Outbound Cargo Channel',                   value: '—' },
];

function Step4({ onBack, onSubmit, onViewRequest }: { onBack: () => void; onSubmit: () => void; onViewRequest: () => void }) {
  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-[40px] pt-[24px] pb-[8px] flex-shrink-0 flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-[40px] pb-[24px]">
        {/* Title + View Request */}
        <div className="flex items-start justify-between gap-[16px] mb-[8px]">
          <PageTitle>
            Cancel - Cargo Transfer from CTO to CH (Same Location) - 601001745352
          </PageTitle>
          <OutlineBtn onClick={onViewRequest}>
            <span className="whitespace-nowrap">View Cargo Transfer Details</span>
          </OutlineBtn>
        </div>
        <div className="flex flex-col gap-[24px]">

          {/* Cancellation Details summary */}
          <div className="flex flex-col gap-[8px]">
            <SectionLabel>Cancellation Details</SectionLabel>
            <Card className="px-[20px] py-[32px]">
              <div className="flex flex-wrap gap-[20px]">
                <InfoCard label="Request Number"         value="REQ12345" light />
                <InfoCard label="Submission Date"        value="20/2/2024" light />
                <InfoCard label="Reason for Cancelation" value="Business code wrongly declared" light />
              </div>
            </Card>
          </div>

          {/* Cargo Transfer Details summary */}
          <div className="flex flex-col gap-[8px]">
            <SectionLabel>Cargo Transfer Details</SectionLabel>
            <Card className="px-[20px] py-[32px]">
              <div className="flex flex-wrap gap-[20px]">
                {CARGO_TRANSFER_SUMMARY.map(f => (
                  <InfoCard key={f.label} label={f.label} value={f.value} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <BottomNav
        onBack={onBack}
        onProceed={onSubmit}
        proceedLabel="Submit"
        extraBtn={
          <OutlineBtn onClick={() => window.print()}>Print Cargo Transfer</OutlineBtn>
        }
      />
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
          Cargo Transfer Cancellation Request Submitted Successfully
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
            <span className="text-[16px] text-[#696f83]">Cargo Transfer Number:</span>
            <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>CT-6010000397426</span>
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

type Props = { onBack: () => void };

export default function CargoTransferCancelFlow({ onBack }: Props) {
  const [step, setStep] = useState<Step>(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showViewRequest, setShowViewRequest] = useState(false);

  const handleSuccess    = () => setShowSuccess(true);
  const handleClose      = () => { setShowSuccess(false); onBack(); };
  const openViewRequest  = () => setShowViewRequest(true);
  const closeViewRequest = () => setShowViewRequest(false);

  if (showViewRequest) {
    return (
      <div className="flex flex-col h-full">
        <CargoTransferViewPage onBack={closeViewRequest} />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {step === 1 && <Step1 onBack={onBack}           onProceed={() => setStep(2)} onViewRequest={openViewRequest} />}
        {step === 2 && <Step2 onBack={() => setStep(1)} onProceed={() => setStep(3)} />}
        {step === 3 && <Step3 onBack={() => setStep(2)} onProceed={() => setStep(4)} onViewRequest={openViewRequest} />}
        {step === 4 && <Step4 onBack={() => setStep(3)} onSubmit={handleSuccess}     onViewRequest={openViewRequest} />}
      </div>

      {showSuccess && <SuccessPopup onClose={handleClose} />}
    </>
  );
}
