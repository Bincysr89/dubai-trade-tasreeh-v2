import React, { useEffect, useRef, useState } from 'react';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

type Props = {
  onBackToListing: () => void;
  onSubmit: (mode: 'creditDebit' | 'epayment') => void;
  onCreditDebitFailed?: () => void;
  requestNumber?: string;
};

// ── shared sample data (mirrors VccSearchResultPage) ────────────────────────
const SAMPLE_BRANDS  = ['Aston Martin', 'Ferrari', 'Porsche', 'Bentley', 'Lamborghini', 'McLaren', 'Maserati', 'Bugatti'];
const SAMPLE_COLORS  = ['Red', 'Black', 'White', 'Silver', 'Blue', 'Green', 'Grey', 'Yellow'];
const SAMPLE_YEARS   = ['2010', '2012', '2022', '2018', '2020', '2024', '2015', '2023'];
const SAMPLE_ENGINES = ['EN-9381472', 'EN-2284917', 'EN-7190334', 'EN-5572819', 'EN-3098471', 'EN-6411238', 'EN-8823746', 'EN-1107592'];

type Vehicle = { id: string; chassis: string; make: string; brand: string; color: string; model: string };
const VEHICLES: Vehicle[] = Array.from({ length: 56 }, (_, i) => ({
  id: `v${i}`,
  chassis: `BHASSIS${String(i + 1).padStart(3, '0')}`,
  make: 'ACURAA',
  brand: SAMPLE_BRANDS[i % SAMPLE_BRANDS.length],
  engineNumber: `${SAMPLE_ENGINES[i % SAMPLE_ENGINES.length]}-${String(i + 1).padStart(2, '0')}`,
  color: SAMPLE_COLORS[i % SAMPLE_COLORS.length],
  model: SAMPLE_YEARS[i % SAMPLE_YEARS.length],
}));

// Pre-selected vehicles — same as those locked in the existing request
const PRE_SELECTED = new Set(['v0', 'v2', 'v4']);
const VCC_PER_VEHICLE = 50;
const KNOWLEDGE_FEES  = 5;

const PAYMENT_MODES = [
  { value: 'creditDebit', label: 'Credit/Debit Account' },
  { value: 'epayment',    label: 'ePayment' },
];
const CREDIT_ACCOUNTS = [
  { value: '1011146', label: '1011146' },
  { value: '102343',  label: '102343' },
];

// ── sub-components ───────────────────────────────────────────────────────────
function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div
      className="flex flex-col gap-[2px] min-w-0 first:pl-0 [&:not(:first-child)]:pl-[28px]"
      style={wide ? { flex: '1 1 280px' } : { flex: '0 0 auto' }}
    >
      <span className="text-[16px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font }}>{label}</span>
      <span
        className="text-[16px] text-[#111838]"
        style={{ fontFamily: font, fontWeight: 600, whiteSpace: wide ? 'normal' : 'nowrap' }}
      >
        {value}
      </span>
    </div>
  );
}

const SummaryRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between py-[10px]" style={{ borderBottom: '1px dashed #e2ebf9' }}>
    <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{label}</span>
    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500, fontSize: 14 }}>{value}</span>
  </div>
);

function StyledDropdown({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  const selected = options.find((m) => m.value === value);

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between w-full h-[44px] bg-white border border-[#d5ddfb] rounded-[4px] px-[14px] cursor-pointer hover:border-[#1360d2] transition-colors"
      >
        <span className="text-[16px] font-medium whitespace-nowrap" style={{ fontFamily: font, color: selected ? '#1360d2' : '#697498' }}>
          {selected ? selected.label : placeholder}
        </span>
        <svg viewBox="0 0 24 24" width="18" height="18" className={`text-[#1360d2] transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div
          className="absolute z-[80] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden"
          style={{ top: 48, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
        >
          {options.map((m) => {
            const active  = m.value === value;
            const isHover = hovered === m.value;
            return (
              <button
                key={m.value}
                onMouseEnter={() => setHovered(m.value)}
                onMouseLeave={() => setHovered((h) => (h === m.value ? null : h))}
                onClick={() => { onChange(m.value); setOpen(false); }}
                className="block w-full text-left px-[14px] py-[10px] text-[16px] transition-colors"
                style={{ background: active || isHover ? '#e2ebf9' : 'transparent', color: active || isHover ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: active || isHover ? 500 : 400 }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── main component ───────────────────────────────────────────────────────────
export default function VccUpdatePaymentModePage({
  onBackToListing,
  onSubmit,
  onCreditDebitFailed,
  requestNumber = '25365',
}: Props) {
  const [paymentMode, setPaymentMode] = useState('');
  const [creditAccount, setCreditAccount] = useState('');
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [insufficientAccount, setInsufficientAccount] = useState<string | null>(null);

  const selectedVehicles = VEHICLES.filter((v) => PRE_SELECTED.has(v.id));
  const count       = selectedVehicles.length;
  const vccCharges  = count * VCC_PER_VEHICLE;
  const total       = vccCharges + KNOWLEDGE_FEES;
  const fmt         = (n: number) => `Dh ${n.toLocaleString()}`;

  const canSubmit = paymentMode === 'epayment' || (paymentMode === 'creditDebit' && !!creditAccount);

  const handleSubmit = () => {
    if (paymentMode === 'epayment') { onSubmit('epayment'); return; }
    if (paymentMode === 'creditDebit') {
      if (insufficientAccount !== null && creditAccount !== insufficientAccount) {
        onSubmit('creditDebit');
      } else {
        setInsufficientAccount(creditAccount);
        setShowInsufficientModal(true);
      }
    }
  };

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Breadcrumb + agent badge */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>VCC</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Update Payment Mode</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {/* Page title */}
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>
          Update Payment Mode - {requestNumber}
        </h1>

        {/* Two-column layout: left details | right payment summary */}
        <div className="grid gap-[24px] items-start grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px]">

          {/* LEFT column */}
          <div className="flex flex-col gap-[24px] min-w-0">

            {/* Declaration Details */}
            <div className="bg-white rounded-[8px] px-[24px] py-[16px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <p className="text-[20px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font, fontWeight: 700 }}>
                Declaration Details
              </p>
              <div className="flex flex-wrap items-start gap-x-[28px] gap-y-[12px] divide-x divide-[#e2ebf9]">
                <Field label="Declaration Number" value="103-00011064425-3" />
                <Field label="Declaration Date"   value="09/11/2024" />
                <Field label="Declaration Type"   value="IM3 - Import to Local from CW" />
                <Field label="Declaration Owner"  value="AE-8123187 VIKRAM SINGH CTO GULF DENIM LIMITED (LLC)" wide />
              </div>
            </div>

            {/* Selected Vehicles — read-only */}
            <div className="bg-white rounded-[8px] px-[24px] py-[20px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>
                Selected Vehicles
              </p>
              <p className="text-[16px] text-[#697498] mt-[4px] mb-[4px]" style={{ fontFamily: font }}>
                Review the chassis numbers included in this request.
              </p>
              <p className="text-[16px] text-[#455174] mb-[16px]" style={{ fontFamily: font }}>
                <span style={{ color: '#1360d2', fontWeight: 600 }}>{count}</span> vehicles selected
              </p>

              <div style={{ maxHeight: 400, overflowY: 'auto', overflowX: 'auto', border: '1px solid #e8edf5', borderRadius: 6 }}>
                <table className="dt-table" style={{ fontFamily: font, minWidth: '100%' }}>
                  <thead style={{ position: 'sticky', top: 0, zIndex: 1, background: '#a6c2e9' }}>
                    <tr>
                      <th className="text-[16px]" style={{ width: 60 }}>#</th>
                      <th className="text-[16px]" style={{ width: 160 }}>Chassis Number</th>
                      <th className="text-[16px]" style={{ width: 140 }}>Vehicle Make</th>
                      <th className="text-[16px]" style={{ width: 160 }}>Model</th>
                      <th className="text-[16px]" style={{ width: 110 }}>Color</th>
                      <th className="text-[16px]" style={{ width: 90 }}>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedVehicles.map((v, i) => (
                      <tr key={v.id}>
                        <td className="text-[16px] text-[#697498]" style={{ whiteSpace: 'nowrap' }}>{i + 1}</td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <span className="text-[16px] text-[#455174] inline-flex items-center justify-center px-[8px] py-[3px] rounded-[4px] bg-[#e2ebf9]" style={{ minWidth: 86 }}>{v.chassis}</span>
                        </td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{v.make}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{v.brand}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{v.color}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{v.model}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT column — Payment Summary */}
          <div className="bg-white rounded-[8px] px-[20px] py-[16px]" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <p className="text-[18px] text-[#0e1b3d] mb-[12px]" style={{ fontFamily: font, fontWeight: 700 }}>
              Payment Summary
            </p>

            <SummaryRow label="No. of Vehicles Selected" value={count} />
            <SummaryRow label="VCC Charges"    value={fmt(vccCharges)} />
            <SummaryRow label="Knowledge Fees" value={fmt(KNOWLEDGE_FEES)} />
            <div className="flex items-center justify-between py-[14px] mt-[6px]" style={{ borderTop: '1px solid #e2ebf9' }}>
              <span className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>Total Amount</span>
              <span className="text-[18px] text-[#1360d2]" style={{ fontFamily: font, fontWeight: 700 }}>{fmt(total)}</span>
            </div>

            {/* Payment Mode */}
            <div className="mt-[10px]">
              <label className="block text-[16px] text-[#455174] mb-[6px]" style={{ fontFamily: font }}>Payment Mode</label>
              <StyledDropdown
                value={paymentMode}
                onChange={(v) => { setPaymentMode(v); if (v !== 'creditDebit') setCreditAccount(''); }}
                options={PAYMENT_MODES}
                placeholder="Select payment mode"
              />
            </div>

            {paymentMode === 'creditDebit' && (
              <div className="mt-[12px]">
                <label className="block text-[16px] text-[#455174] mb-[6px]" style={{ fontFamily: font }}>Credit Account Number</label>
                <StyledDropdown
                  value={creditAccount}
                  onChange={setCreditAccount}
                  options={CREDIT_ACCOUNTS}
                  placeholder="Select account number"
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              className="mt-[16px] w-full h-[48px] rounded-[4px] text-[16px] text-white"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}
            >
              Submit
            </button>

            {/* Insufficient Balance Modal */}
            {showInsufficientModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.45)' }}>
                <div className="bg-white rounded-[12px] shadow-xl p-[32px] w-full max-w-[420px] flex flex-col items-center gap-[20px]">
                  <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: 'rgba(220,53,69,0.10)' }}>
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 9v4M12 17h.01" />
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0-3.42 0z" />
                    </svg>
                  </div>
                  <p className="text-[20px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Insufficient Balance</p>
                  <p className="text-[15px] text-[#455174] text-center" style={{ fontFamily: font, lineHeight: 1.6 }}>
                    The selected account <strong style={{ color: '#0e1b3d' }}>{insufficientAccount}</strong> does not have sufficient balance to complete this transaction.
                  </p>
                  <div className="flex gap-[12px] w-full mt-[4px]">
                    <button
                      onClick={() => setShowInsufficientModal(false)}
                      className="flex-1 h-[44px] rounded-[4px] border border-[#1360d2] text-[#1360d2] text-[15px] hover:bg-[#f0f5ff] transition-colors"
                      style={{ fontFamily: font, fontWeight: 500 }}
                    >
                      Go Back
                    </button>
                    <button
                      onClick={() => { setShowInsufficientModal(false); onCreditDebitFailed?.(); }}
                      className="flex-1 h-[44px] rounded-[4px] text-white text-[15px] hover:bg-[#0E4DB8] transition-colors"
                      style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
                    >
                      Top Up Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BackToListingBar onBackToListing={onBackToListing} />
    </div>
  );
}
