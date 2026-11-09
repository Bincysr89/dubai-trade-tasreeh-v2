import React, { useEffect, useRef, useState } from 'react';
import SaveExitModal from './SaveExitModal';
import ReactDOM from 'react-dom';
import BackToListingBar from './BackToListingBar';
import FloatingField from './FloatingField';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import ClaimStepper, { REFUND_DEPOSIT_STEPS } from './ClaimStepper';
import type { Row } from './EligibleDeclarationsPage';
import DTSelect from './DTSelect';
import Dh, { DhAmount } from './Dh';
import { DateInput } from './DatePicker';

/* ───────── Shared types ───────── */
export type RefundType = 'full' | 'partial' | 'no' | 'fullImport' | 'partialImport' | 'refund' | 'noRefund';
export type DepositMethod = 'standing' | 'cash' | 'epayment';

const DEPOSIT_METHOD_LABEL: Record<DepositMethod, string> = {
  standing: 'Standing Guarantee',
  cash: 'Cash',
  epayment: 'e-Payment',
};

const ALL_REFUND_OPTIONS: { id: RefundType; title: string; sub: string }[] = [
  { id: 'full',         title: 'Full Export',    sub: 'All goods have been re-exported.' },
  { id: 'partial',      title: 'Partial Export', sub: 'Some goods have been re-exported.' },
  { id: 'no',           title: 'No Export',      sub: 'Goods have not been exported.' },
  { id: 'fullImport',   title: 'Full Import',    sub: 'All goods have been fully imported.' },
  { id: 'partialImport',title: 'Partial Import', sub: 'Some goods have been imported.' },
];

export const REFUND_TYPE_LABEL: Record<RefundType, string> = {
  full:         'Full Export',
  partial:      'Partial Export',
  no:           'No Export',
  fullImport:   'Full Import',
  partialImport:'Partial Import',
  refund:       'Refund',
  noRefund:     'No Refund',
};

/* ───────── Common DT page shell ───────── */
const PageShell: React.FC<{
  title: string;
  children: React.ReactNode;
  onBack?: () => void;
  onBackToListing?: () => void;
  rightContent: React.ReactNode;
  activeIndex?: number;
  steps?: { id: string; label: string }[];
}> = ({ title, children, onBack, onBackToListing, rightContent, activeIndex = 0, steps }) => (
  <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
    {/* Sticky breadcrumb / agent banner — content below scrolls under it. */}
    <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
      <div className="flex items-center gap-[6px]">
        <span className="text-[16px] text-[#8f94ae]">Home</span>
        <span className="text-[16px] text-[#dc3545]">/</span>
        <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
        <span className="text-[16px] text-[#dc3545]">/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
      </div>
    </div>

    {/* Title + stepper + body all scroll together below the breadcrumb. */}
    <div className="flex-1 overflow-y-auto">
      <h1 className="px-4 sm:px-10 text-2xl sm:text-3xl lg:text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>{title}</h1>

      <div className="px-4 sm:px-10">
        <ClaimStepper activeIndex={activeIndex} steps={steps} />
      </div>

      <div className="px-4 sm:px-10 py-[24px] flex flex-col gap-[20px]">
        {children}
        <ClaimantBrokerDetail />
      </div>
    </div>

    <BackToListingBar onBack={onBack} onBackToListing={onBackToListing} rightContent={rightContent} />
  </div>
);

const SectionHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-[12px]">
    <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{children}</p>
  </div>
);

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-white rounded-[8px] px-[24px] py-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
    {children}
  </div>
);

const PrimaryBtn = (
  { children, disabled, onClick }: { children: React.ReactNode; disabled?: boolean; onClick: () => void }
) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
    style={{
      background: disabled ? '#a7c3eb' : '#1360d2',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontWeight: 500,
      boxShadow: disabled ? 'none' : '0px 0px 8px rgba(28,72,191,0.16)',
    }}
  >
    {children}
  </button>
);

const SaveExitBtn = ({ onBackToListing }: { onBackToListing?: () => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button data-secondary-btn
        onClick={() => setOpen(true)}
        className="h-[48px] px-[28px] rounded-[4px] text-[16px] bg-white transition-colors"
        style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontWeight: 500, fontFamily: "'Dubai', sans-serif" }}
      >
        Save &amp; Exit
      </button>
      {open && <SaveExitModal onCancel={() => setOpen(false)} onBackToListing={onBackToListing} />}
    </>
  );
};

/* ───────── Sample outbound declarations (inline picker) ───────── */
type OutboundRow = {
  id: string;
  declarationNo: string;
  exportType: string;
  exitPoint: string;
  reExportTo: string;
  reExportFlag: string;
  departureDate: string;
  weight: string;
  statQty: string;
  customsAuthority: string;
};

const SAMPLE_OUTBOUND: OutboundRow[] = [
  { id: 'ob1', declarationNo: 'E: 2080004915824', exportType: 'Re-Export', exitPoint: 'Jebel Ali Port', reExportTo: 'Saudi Arabia', reExportFlag: '🌍', departureDate: '15 Jan 2025', weight: '1,250 Kg', statQty: '50',  customsAuthority: 'Dubai Customs' },
  { id: 'ob2', declarationNo: 'E: 2080004915825', exportType: 'Re-Export', exitPoint: 'Port Rashid',    reExportTo: 'Oman',         reExportFlag: '🌍', departureDate: '22 Jan 2025', weight: '880 Kg',   statQty: '32', customsAuthority: 'Dubai Customs' },
];

/* ───────── Refund Type page (with inline Partial Invoice picker) ───────── */
export function RefundTypePage({
  onBack, onBackToListing, onContinue, declaration, onViewDeclaration, allowedTypes,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (type: RefundType, partial?: PartialExportSelection) => void;
  declaration?: { claimType: string; declarationNo: string; depositType: string; declarationCategory?: string | null };
  onViewDeclaration?: () => void;
  allowedTypes?: RefundType[];
}) {
  const [selected, setSelected] = useState<RefundType | null>(null);
  type CustomsAuthority = 'dubai' | 'other' | 'gcc';
  const [customsAuthority, setCustomsAuthority] = useState<CustomsAuthority | ''>('');
  const [outboundRows, setOutboundRows] = useState<OutboundRow[]>([]);
  const [outboundSearch, setOutboundSearch] = useState('');
  const [outboundSearched, setOutboundSearched] = useState(false);
  type ManualOutbound = { declarationNo: string; exportType: string; exitPoint: string; reExportTo: string; departureDate: string; weight: string; statQty: string };
  const blankManual: ManualOutbound = { declarationNo: '', exportType: '', exitPoint: '', reExportTo: '', departureDate: '', weight: '', statQty: '' };
  const [manualOutbound, setManualOutbound] = useState<ManualOutbound>(blankManual);
  const [invoiceFilter, setInvoiceFilter] = useState<string>(SAMPLE_INVOICES[0]?.id ?? '');
  const [hsModalOpen, setHsModalOpen] = useState(false);
  type AllocationMethod = 'multiple' | 'single';
  type HsEntry = { invoiceId: string; code: string; description: string; weight: string; statQty: string; suppQty: string; importPrice: string; allocation: AllocationMethod; exportValue: string; claimAmount: string };
  const [hsEntries, setHsEntries] = useState<HsEntry[]>([]);
  const [draftEntry, setDraftEntry] = useState<HsEntry>({ invoiceId: SAMPLE_INVOICES[0]?.id ?? '', code: '', description: '', weight: '', statQty: '', suppQty: '', importPrice: '', allocation: 'single', exportValue: '', claimAmount: '' });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hsSearch, setHsSearch] = useState('');
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [selectedHs, setSelectedHs] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleInvoice = (id: string) => {
    const next = new Set(selectedInvoices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedInvoices(next);
    if (!expanded.has(id) && next.has(id)) { const e = new Set(expanded); e.add(id); setExpanded(e); }
  };
  const toggleHs = (invId: string, code: string) => {
    const key = `${invId}::${code}`;
    const next = new Set(selectedHs);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelectedHs(next);
  };
  const toggleExpanded = (id: string) => {
    const e = new Set(expanded);
    if (e.has(id)) e.delete(id); else e.add(id);
    setExpanded(e);
  };

  const refundOptions = allowedTypes
    ? allowedTypes.map((id) => ALL_REFUND_OPTIONS.find((o) => o.id === id)!).filter(Boolean)
    : ALL_REFUND_OPTIONS.filter((o) => o.id === 'full' || o.id === 'partial' || o.id === 'no');

  // Auto-populate eligible HS codes (intersection of inbound invoices + outbound)
  // when an outbound row is added for a partial-export claim.
  useEffect(() => {
    if (selected !== 'partial' || outboundRows.length === 0) return;
    if (hsEntries.length > 0) return;
    const eligible: HsEntry[] = [];
    SAMPLE_INVOICES.forEach((inv) => {
      inv.hsCodes.slice(0, 3).forEach((hs, hsIdx) => {
        const importPrice = 50;
        const statQty = 10;
        const exportValue = importPrice * statQty;
        const claimAmount = Math.round(exportValue * 0.05);
        eligible.push({
          invoiceId: inv.id,
          code: hs.code,
          description: hs.description,
          weight: '100',
          statQty: String(statQty),
          suppQty: '10',
          importPrice: String(importPrice),
          allocation: hsIdx === 0 ? 'multiple' : 'single',
          exportValue: exportValue.toLocaleString(),
          claimAmount: claimAmount.toLocaleString(),
        });
      });
    });
    setHsEntries(eligible);
    setSelectedHs(new Set(eligible.map((e) => `${e.invoiceId}::${e.code}`)));
  }, [selected, outboundRows.length]);

  return (
    <PageShell
      title="Select Refund Type"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={
        <PrimaryBtn
          onClick={() => {
            const rt = selected ?? 'no';
            if (rt === 'partial') {
              const chosen = hsEntries.filter((e) => selectedHs.has(`${e.invoiceId}::${e.code}`));
              onContinue(rt, {
                invoiceIds: Array.from(new Set(chosen.map((e) => e.invoiceId))),
                hsCodes: chosen.map((e) => ({ invoiceId: e.invoiceId, code: e.code })),
              });
            } else {
              onContinue(rt);
            }
          }}
        >
          Continue
        </PrimaryBtn>
      }
    >
      {declaration && (
        <>
          <SectionHeader>Declaration Details</SectionHeader>
          <Card>
            <div
              className="grid items-start"
              style={{ gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}
            >
              {[
                { k: 'Declaration Number',   v: declaration.declarationNo, accent: true },
                { k: 'Declaration Date',     v: '12-May-24' },
                { k: 'Deposit Type',         v: declaration.depositType },
                ...(declaration.declarationCategory ? [{ k: 'Declaration Category', v: declaration.declarationCategory }] : []),
                { k: 'Deposit Amount',       v: <DhAmount value="1,000" /> },
                { k: 'Deposit Method',       v: 'Cash (ePayment)' },
                { k: 'Claim Expiry',         v: '04-Mar-25' },
                { k: 'Export Expiry',        v: '15-Apr-25' },
              ].map((f) => (
                <div key={f.k} className="flex flex-col gap-[4px] min-w-0">
                  <span className="text-[12px] text-[#697498]">{f.k}</span>
                  <span className="text-[16px] truncate" style={{ color: f.accent ? '#1360d2' : '#0e1b3d', fontWeight: 500 }}>{f.v}</span>
                </div>
              ))}
            </div>
            {onViewDeclaration && (
              <div className="mt-[20px]">
                <button data-secondary-btn
                  onClick={onViewDeclaration}
                  className="h-[40px] px-[18px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors inline-flex items-center gap-[8px]"
                  style={{ fontWeight: 500 }}
                >
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                    <circle cx="10" cy="10" r="2.5" />
                  </svg>
                  View Declaration
                </button>
              </div>
            )}
          </Card>
        </>
      )}

      <SectionHeader>Refund Type</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[16px]">Please choose the refund type to begin your claim.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          {refundOptions.map((opt) => {
            const active = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="flex items-start gap-[14px] px-[18px] py-[18px] rounded-[10px] text-left transition-colors h-full"
                style={{ background: active ? '#f6f9fe' : '#fff', border: `1.5px solid ${active ? '#1360d2' : '#e0e6ef'}` }}
              >
                <span className="size-[22px] rounded-full inline-flex items-center justify-center flex-shrink-0 mt-[2px]" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                  {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
                </span>
                <span className="flex flex-col gap-[6px]">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{opt.title}</span>
                  <span className="text-[16px] text-[#696f83]" style={{ lineHeight: 1.4 }}>{opt.sub}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Card>

      {(selected === 'full' || selected === 'partial') && (() => {
        const q = outboundSearch.trim().toLowerCase();
        const alreadyAdded = (no: string) => outboundRows.some((r) => r.declarationNo === no);
        const suggestions = SAMPLE_OUTBOUND.filter((r) => r.declarationNo.toLowerCase().includes(q) && !alreadyAdded(r.declarationNo));
        const showSuggestions = customsAuthority === 'dubai' && q !== '';
        const manualValid = manualOutbound.declarationNo.trim() !== '' && manualOutbound.exportType.trim() !== '' && manualOutbound.exitPoint.trim() !== '' && manualOutbound.reExportTo.trim() !== '' && manualOutbound.departureDate.trim() !== '' && manualOutbound.weight.trim() !== '' && manualOutbound.statQty.trim() !== '';
        const authorityLabel: Record<CustomsAuthority, string> = { dubai: 'Dubai Customs', other: 'Other Emirates', gcc: 'GCC' };
        const addManualRow = () => {
          if (!manualValid || !customsAuthority) return;
          setOutboundRows([
            ...outboundRows,
            {
              id: `m-${Date.now()}`,
              declarationNo: manualOutbound.declarationNo.trim(),
              exportType: manualOutbound.exportType.trim(),
              exitPoint: manualOutbound.exitPoint.trim(),
              reExportTo: manualOutbound.reExportTo.trim(),
              reExportFlag: '🌍',
              departureDate: manualOutbound.departureDate.trim(),
              weight: manualOutbound.weight.trim(),
              statQty: manualOutbound.statQty.trim(),
              customsAuthority: authorityLabel[customsAuthority as CustomsAuthority],
            },
          ]);
          setManualOutbound(blankManual);
        };
        return (
        <>
          <SectionHeader>Outbound Declaration</SectionHeader>
          <Card>
            {/* Customs Authority + (Dubai search) OR (manual fields) — single grid, 4 per row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[12px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
              {/* Customs Authority dropdown */}
              <DTSelect
                label="Customs Authority"
                required
                value={customsAuthority}
                onChange={(v) => { setCustomsAuthority(v as CustomsAuthority | ''); setOutboundSearch(''); setManualOutbound(blankManual); }}
                options={[
                  { value: 'dubai', label: 'Dubai Customs' },
                  { value: 'other', label: 'Other Emirates' },
                  { value: 'gcc', label: 'GCC' },
                ]}
              />

              {customsAuthority === 'dubai' && (
                <div className="relative">
                  <FloatingField
                    label="Outbound Declaration Number"
                    required
                    placeholder="e.g. 2080004915824"
                    value={outboundSearch}
                    onChange={setOutboundSearch}
                    trailingIcon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" /></svg>}
                  />
                  {showSuggestions && (
                    <div className="absolute left-0 right-0 mt-[4px] bg-white border border-[#d5ddfb] rounded-[4px] z-10 max-h-[260px] overflow-auto" style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.08)' }}>
                      {suggestions.length === 0 ? (
                        <div className="px-[16px] py-[12px] text-[16px] text-[#697498]">No matches.</div>
                      ) : suggestions.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => { setOutboundRows([...outboundRows, { ...r, customsAuthority: 'Dubai Customs' }]); setOutboundSearch(''); }}
                          className="block w-full text-left px-[16px] py-[10px] hover:bg-[#f4f7fc]"
                        >
                          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{r.declarationNo}</span>
                          <span className="text-[12px] text-[#697498] ml-[8px]">{r.exportType} · {r.exitPoint} → {r.reExportTo} · {r.departureDate}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(customsAuthority === 'other' || customsAuthority === 'gcc') && (['declarationNo', 'exportType', 'exitPoint', 'reExportTo', 'departureDate', 'weight', 'statQty'] as const).map((key) => {
                const labels: Record<typeof key, string> = {
                  declarationNo: 'Outbound Declaration No.',
                  exportType: 'Export Declaration Type',
                  exitPoint: 'Exit Point',
                  reExportTo: 'Re-Export To',
                  departureDate: 'Actual Departure Date',
                  weight: 'Weight (Kg)',
                  statQty: 'Statistical Quantity',
                };
                return (
                  <FloatingField
                    key={key}
                    label={labels[key]}
                    required
                    placeholder={`Enter ${labels[key]}`}
                    value={manualOutbound[key]}
                    onChange={(val) => setManualOutbound({ ...manualOutbound, [key]: val })}
                    type={key === 'departureDate' ? 'date' : (key === 'weight' || key === 'statQty') ? 'number' : 'text'}
                  />
                );
              })}
            </div>

            {(customsAuthority === 'other' || customsAuthority === 'gcc') && (
              <div className="flex justify-end mb-[20px]">
                <button
                  onClick={addManualRow}
                  disabled={!manualValid}
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px] text-white inline-flex items-center gap-[8px]"
                  style={{ background: manualValid ? '#1360d2' : '#a7c3eb', cursor: manualValid ? 'pointer' : 'not-allowed', fontWeight: 500 }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 5v14M5 12h14" strokeLinecap="round" /></svg>
                  Add to Table
                </button>
              </div>
            )}

            {customsAuthority === 'dubai' && (
              <p className="text-[16px] text-[#697498] mb-[20px]">Search the outbound declaration number — system will fetch and add the details automatically.</p>
            )}
            {(customsAuthority === 'other' || customsAuthority === 'gcc') && (
              <p className="text-[16px] text-[#697498] mb-[20px] hidden">Manual entry copy.</p>
            )}

            {outboundRows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="dt-table" style={{ minWidth: 1100 }}>
                  <thead>
                    <tr>
                      <th className="text-[16px]">Outbound Declaration No.</th>
                      <th className="text-[16px]">Export Declaration Type</th>
                      <th className="text-[16px]">Exit Point</th>
                      <th className="text-[16px]">Re-Export To</th>
                      <th className="text-[16px]">Actual Departure Date</th>
                      <th className="text-[16px]">Weight</th>
                      <th className="text-[16px]">Statistical Quantity</th>
                      <th className="text-[16px]">Customs Authority</th>
                      <th style={{ width: 60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {outboundRows.map((r, idx) => (
                      <tr key={r.id}>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{r.declarationNo}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.exportType}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.exitPoint}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.reExportTo}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.departureDate}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.weight}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.statQty}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{r.customsAuthority}</td>
                        <td>
                          <button
                            onClick={() => setOutboundRows(outboundRows.filter((_, i) => i !== idx))}
                            aria-label="Remove"
                            className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#fef2f2]"
                            style={{ color: '#dc3545' }}
                          >
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
        );
      })()}

      {selected === 'partial' && (
        <>
          <SectionHeader>Invoices &amp; HS Codes</SectionHeader>
          <Card>
            <div className="flex items-start justify-between gap-[16px] mb-[16px] flex-wrap">
              <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[10px] flex-1 min-w-[280px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '18px' }}>
                  Eligible HS codes are auto-populated by matching the inbound declaration with the outbound declaration. Select the HS codes you want to include in this claim — you can edit any line-item details.
                  {hsEntries.length > 0 && (
                    <> &nbsp;<span style={{ fontWeight: 500 }}>{selectedHs.size}</span> of <span style={{ fontWeight: 500 }}>{hsEntries.length}</span> selected.</>
                  )}
                </p>
              </div>
            </div>

            {hsEntries.length === 0 ? (
              <div className="border border-dashed border-[#d5ddfb] rounded-[8px] py-[40px] flex flex-col items-center gap-[8px]">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#a7c3eb" strokeWidth="1.5"><path d="M3 6h18M6 6v12a2 2 0 002 2h8a2 2 0 002-2V6M9 11l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <p className="text-[16px] text-[#697498]">No eligible HS codes yet</p>
                <p className="text-[16px] text-[#a7abb2]">Add an outbound declaration above to auto-populate the eligible HS codes.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="dt-table" style={{ minWidth: 1300 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 44 }}>
                        <button
                          aria-label="Select all"
                          onClick={() => {
                            if (selectedHs.size === hsEntries.length) setSelectedHs(new Set());
                            else setSelectedHs(new Set(hsEntries.map((e) => `${e.invoiceId}::${e.code}`)));
                          }}
                          className="size-[18px] rounded-[3px] inline-flex items-center justify-center"
                          style={{ border: `2px solid ${selectedHs.size > 0 ? '#1360d2' : '#a7abb2'}`, background: selectedHs.size === hsEntries.length && hsEntries.length > 0 ? '#1360d2' : '#fff' }}
                        >
                          {selectedHs.size === hsEntries.length && hsEntries.length > 0 && (
                            <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>
                          )}
                          {selectedHs.size > 0 && selectedHs.size < hsEntries.length && (
                            <span className="block w-[10px] h-[2px] bg-[#1360d2]" />
                          )}
                        </button>
                      </th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Invoice</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>HS Code</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500 }}>Goods Description</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Weight (Kg)</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Stat./Exported Qty</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Supp. Qty</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Import Unit Price (Dh)</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Allocation Method</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Export Value (Dh)</th>
                      <th className="text-left text-[16px] text-[#455174]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Claim Amount (Dh)</th>
                      <th style={{ padding: '12px', width: 60 }} />
                    </tr>
                  </thead>
                  <tbody>
                    {hsEntries.map((e, idx) => {
                      const inv = SAMPLE_INVOICES.find((i) => i.id === e.invoiceId);
                      const key = `${e.invoiceId}::${e.code}`;
                      const isSelected = selectedHs.has(key);
                      return (
                        <tr key={idx} className={isSelected ? 'is-selected' : ''}>
                          <td>
                            <button
                              onClick={() => {
                                const next = new Set(selectedHs);
                                if (next.has(key)) next.delete(key); else next.add(key);
                                setSelectedHs(next);
                              }}
                              aria-label="Toggle"
                              className="size-[18px] rounded-[3px] inline-flex items-center justify-center"
                              style={{ border: `2px solid ${isSelected ? '#1360d2' : '#a7abb2'}`, background: isSelected ? '#1360d2' : '#fff' }}
                            >
                              {isSelected && <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                            </button>
                          </td>
                          <td className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{inv?.invoiceNo}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap', fontWeight: 500 }}>{e.code}</td>
                          <td className="text-[16px] text-[#051937]">{e.description}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.weight}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.statQty}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.suppQty}</td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap' }}>{e.importPrice}</td>
                          <td style={{ whiteSpace: 'nowrap' }}>
                            <span
                              className="inline-flex items-center px-[10px] py-[3px] rounded-[12px] text-[12px]"
                              style={{
                                background: e.allocation === 'multiple' ? 'rgba(19,96,210,0.10)' : 'rgba(40,167,69,0.10)',
                                color: e.allocation === 'multiple' ? '#1360d2' : '#1b6c3a',
                                fontWeight: 500,
                                textTransform: 'capitalize',
                              }}
                            >
                              {e.allocation}
                            </span>
                          </td>
                          <td className="text-[16px] text-[#051937]" style={{ whiteSpace: 'nowrap', fontWeight: 500 }}><DhAmount value={e.exportValue} /></td>
                          <td className="text-[16px] text-[#1360d2]" style={{ whiteSpace: 'nowrap', fontWeight: 600 }}><DhAmount value={e.claimAmount} /></td>
                          <td>
                            <button
                              onClick={() => { setEditingIndex(idx); setDraftEntry(e); setHsSearch(''); setHsModalOpen(true); }}
                              aria-label="Edit"
                              className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#e2ebf9]"
                              style={{ color: '#1360d2' }}
                            >
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4l11-11-4-4L4 16v4z" strokeLinecap="round" strokeLinejoin="round" /><path d="M14 6l4 4" strokeLinecap="round" /></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
      {hsModalOpen && (() => {
        const activeInvoice = SAMPLE_INVOICES.find((i) => i.id === draftEntry.invoiceId) ?? SAMPLE_INVOICES[0];
        const q = hsSearch.trim().toLowerCase();
        const matches = activeInvoice.hsCodes.filter((hs) => q === '' || hs.code.toLowerCase().includes(q) || hs.description.toLowerCase().includes(q));
        const formValid = !!draftEntry.code && !!draftEntry.weight.trim() && !!draftEntry.statQty.trim() && !!draftEntry.suppQty.trim() && !!draftEntry.importPrice.trim();
        const numField = (label: string, key: 'weight' | 'statQty' | 'suppQty' | 'importPrice', placeholder: string) => (
          <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <div className="bg-white rounded-[4px] flex items-center px-[16px]" style={{ border: '1px solid #d5ddfb', height: 56 }}>
              <input
                type="number"
                value={draftEntry[key]}
                onChange={(e) => setDraftEntry({ ...draftEntry, [key]: e.target.value })}
                placeholder={placeholder}
                className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
              />
            </div>
            <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d' }}>
              <span style={{ color: '#dc3545' }}>*</span> {label}
            </label>
          </div>
        );

        return (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-[24px]" style={{ background: 'rgba(11,21,52,0.45)' }} onClick={() => setHsModalOpen(false)}>
            <div onClick={(e) => e.stopPropagation()} className="bg-white rounded-[10px] w-full max-w-[820px] max-h-[88vh] flex flex-col" style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)' }}>
              <div className="flex items-center justify-between px-[24px] py-[18px] border-b border-[#eef1f6]">
                <div>
                  <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{editingIndex !== null ? 'Edit HS Code Details' : 'Add HS Code Details'}</p>
                  <p className="text-[16px] text-[#697498]">Pick an invoice, search the HS code, and enter the line-item details.</p>
                </div>
                <button onClick={() => setHsModalOpen(false)} aria-label="Close" className="size-[32px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#f4f7fc] text-[#697498]">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6l-12 12" strokeLinecap="round" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-auto px-[24px] py-[24px] flex flex-col gap-[20px]">
                {/* Invoice Number dropdown */}
                <DTSelect
                  label="Invoice Number"
                  required
                  value={draftEntry.invoiceId}
                  onChange={(v) => setDraftEntry({ ...draftEntry, invoiceId: v, code: '', description: '' })}
                  options={SAMPLE_INVOICES.map((inv) => ({ value: inv.id, label: `${inv.invoiceNo} — ${inv.lineItemsCount} items` }))}
                />

                {/* HS Code search */}
                <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
                  <div className="bg-white rounded-[4px] flex items-center px-[16px]" style={{ border: '1px solid #d5ddfb', height: 56 }}>
                    <input
                      value={draftEntry.code || hsSearch}
                      onChange={(e) => { setHsSearch(e.target.value); setDraftEntry({ ...draftEntry, code: '', description: '' }); }}
                      placeholder="Enter HS code or goods description"
                      className="flex-1 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]"
                    />
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" /></svg>
                  </div>
                  <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d' }}>
                    <span style={{ color: '#dc3545' }}>*</span> HS Code
                  </label>

                  {!draftEntry.code && hsSearch.trim() !== '' && (
                    <div className="absolute left-0 right-0 mt-[4px] bg-white border border-[#d5ddfb] rounded-[4px] z-10 max-h-[220px] overflow-auto" style={{ boxShadow: '0px 8px 24px rgba(0,0,0,0.08)' }}>
                      {matches.length === 0 ? (
                        <div className="px-[16px] py-[12px] text-[16px] text-[#697498]">No matches.</div>
                      ) : matches.map((hs) => (
                        <button
                          key={hs.code}
                          onClick={() => { setDraftEntry({ ...draftEntry, code: hs.code, description: hs.description }); setHsSearch(''); }}
                          className="block w-full text-left px-[16px] py-[10px] hover:bg-[#f4f7fc]"
                        >
                          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{hs.code}</span>
                          <span className="text-[16px] text-[#697498] ml-[8px]">{hs.description}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Goods description chip */}
                {draftEntry.description && (
                  <div className="bg-[#e2ebf9] rounded-[4px] px-[12px] py-[8px]">
                    <p className="text-[12px] text-[#697498] mb-[2px]">Goods Description</p>
                    <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '20px' }}>{draftEntry.description}</p>
                  </div>
                )}

                {/* Numeric form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
                  {numField('Weight (Kg)', 'weight', 'Enter weight')}
                  {numField('Stat. / Exported Qty', 'statQty', 'Enter quantity')}
                  {numField('Supp. Qty', 'suppQty', 'Enter quantity')}
                  {numField('Import Unit Price (Dh)', 'importPrice', 'Enter price')}
                  {/* Allocation Method dropdown */}
                  <DTSelect
                    label="Allocation Method"
                    required
                    value={draftEntry.allocation}
                    onChange={(v) => setDraftEntry({ ...draftEntry, allocation: v as AllocationMethod })}
                    options={[
                      { value: 'single', label: 'Single' },
                      { value: 'multiple', label: 'Multiple' },
                    ]}
                  />
                </div>

                <div className="flex items-start gap-[10px] rounded-[6px] px-[14px] py-[12px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[1px]"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                  <p className="text-[16px] text-[#0e1b3d]" style={{ lineHeight: '18px' }}>Export Value and Claim Amount will be auto-calculated from unit price × exported qty × duty rate.</p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] border-t border-[#eef1f6]">
                <button
                  onClick={() => setHsModalOpen(false)}
                  className="h-[40px] px-[20px] rounded-[4px] border text-[16px] text-[#1360d2] bg-white"
                  style={{ borderColor: '#1360d2', fontWeight: 500 }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const price = parseFloat(draftEntry.importPrice) || 0;
                    const qty = parseFloat(draftEntry.statQty) || 0;
                    const exportVal = price * qty;
                    const claim = Math.round(exportVal * 0.05);
                    const computed: HsEntry = {
                      ...draftEntry,
                      exportValue: exportVal.toLocaleString(),
                      claimAmount: claim.toLocaleString(),
                    };
                    if (editingIndex !== null) {
                      const next = [...hsEntries];
                      next[editingIndex] = computed;
                      setHsEntries(next);
                    } else {
                      setHsEntries([...hsEntries, computed]);
                    }
                    setHsModalOpen(false);
                    setEditingIndex(null);
                  }}
                  disabled={!formValid}
                  className="h-[40px] px-[20px] rounded-[4px] text-[16px] text-white"
                  style={{ background: !formValid ? '#a7c3eb' : '#1360d2', cursor: !formValid ? 'not-allowed' : 'pointer', fontWeight: 500 }}
                >
                  {editingIndex !== null ? 'Update Line Item' : 'Add Line Item'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </PageShell>
  );
}

/* ───────── Outbound Declaration page (Full Export) ───────── */
export type OutboundDetails = {
  outboundDeclNumber: string;
  outboundDate: string;
  portOfDischarge: string;
  totalQuantity: string;
  weight: string;
  remarks: string;
};

export function OutboundDeclarationPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (d: OutboundDetails) => void;
}) {
  const [v, setV] = useState<OutboundDetails>({ outboundDeclNumber: '', outboundDate: '', portOfDischarge: '', totalQuantity: '', weight: '', remarks: '' });
  const set = <K extends keyof OutboundDetails>(k: K, val: string) => setV((s) => ({ ...s, [k]: val }));
  return (
    <PageShell
      title="Outbound Declaration Details"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn onClick={() => onContinue(v)}>Continue</PrimaryBtn>}
    >
      <SectionHeader>Outbound Declaration</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[20px]">For a full re-export refund, provide the outbound declaration number and supporting details so the claim can be matched to the export shipment.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <FloatingField label="Outbound Declaration Number" required placeholder="Enter Declaration Number" value={v.outboundDeclNumber} onChange={(val) => set('outboundDeclNumber', val)} searchable />
          <DateInput label="Outbound Declaration Date" required value={v.outboundDate} onChange={(val) => set('outboundDate', val)} />
          <FloatingField label="Port of Discharge" placeholder="Choose Port" value={v.portOfDischarge} onChange={(val) => set('portOfDischarge', val)} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />
          <FloatingField label="Total Quantity" placeholder="Enter Quantity" value={v.totalQuantity} onChange={(val) => set('totalQuantity', val)} />
          <FloatingField label="Weight (Kg)" placeholder="Enter Weight" value={v.weight} onChange={(val) => set('weight', val)} />
          <div className="md:col-span-2 lg:col-span-3">
            <FloatingField label="Remarks" placeholder="Enter Remarks" value={v.remarks} onChange={(val) => set('remarks', val)} height={88} />
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

/* ───────── Partial Export — Invoice / HS-code page ───────── */
type HsRow = {
  code: string;
  description: string;
  condition: string;
  countryOfOrigin: string;
  weight: string;
  valueOfGoods: string;
  statisticalQty: string;
  supplementaryQty: string;
  itemQty: string;
  itemVolume: string;
  classification: string;
  exemptionType: string;
  exemptionRef: string;
  declarationNo: string;
  manufacturer: string;
  antiDumping: string;
};

type Invoice = {
  id: string;
  invoiceNo: string;
  date: string;
  termsOfDelivery: string;
  lineItemsCount: number;
  invoiceValue: string;
  hsCodes: HsRow[];
};

const makeHs = (code: string): HsRow => ({
  code,
  description: 'Spare parts',
  condition: 'New',
  countryOfOrigin: 'India',
  weight: '100 kg',
  valueOfGoods: 'Dh 1500',
  statisticalQty: '100 - Unit',
  supplementaryQty: '100',
  itemQty: '100 - Unit',
  itemVolume: '100 Unit',
  classification: 'Quantity',
  exemptionType: 'Quantity',
  exemptionRef: 'EX-887621',
  declarationNo: 'DN-554301',
  manufacturer: 'OV12132',
  antiDumping: 'Yes',
});

const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'inv1', invoiceNo: 'TD 2403', date: '09/11/2024', termsOfDelivery: 'Cost & Fright', lineItemsCount: 100, invoiceValue: 'USD 6400.00',
    hsCodes: ['AX1234567','BX1234567','CX1234567','DX1234567','EX1234567','FX1234567','GX1234567','HX1234567'].map(makeHs),
  },
  {
    id: 'inv2', invoiceNo: 'TD 2404', date: '10/11/2024', termsOfDelivery: 'FOB', lineItemsCount: 60, invoiceValue: 'USD 3120.00',
    hsCodes: ['IX1234567','JX1234567','KX1234567','LX1234567','MX1234567','NX1234567'].map(makeHs),
  },
];

const HS_COLUMNS: { key: keyof HsRow; label: string; width: number }[] = [
  { key: 'code',             label: 'HS Code',                       width: 130 },
  { key: 'description',      label: 'Goods Description',             width: 150 },
  { key: 'condition',        label: 'Condition',                     width: 110 },
  { key: 'countryOfOrigin',  label: 'Country of origin',             width: 140 },
  { key: 'weight',           label: 'Weight',                        width: 110 },
  { key: 'valueOfGoods',     label: 'Value of Goods',                width: 140 },
  { key: 'statisticalQty',   label: 'Statistical Quantity - Unit',   width: 170 },
  { key: 'supplementaryQty', label: 'Supplementary Quantity/Units',  width: 200 },
  { key: 'itemQty',          label: 'Item Quantity - Unit',          width: 160 },
  { key: 'itemVolume',       label: 'Item Volume - Units',           width: 160 },
  { key: 'classification',   label: 'Classification of Goods',       width: 180 },
  { key: 'exemptionType',    label: 'Exemption Type',                width: 160 },
  { key: 'exemptionRef',     label: 'Exemption Reference Number',    width: 210 },
  { key: 'declarationNo',    label: 'Declaration Number',            width: 170 },
  { key: 'manufacturer',     label: 'Manufacturer/Exporter',         width: 180 },
  { key: 'antiDumping',      label: 'Anti dumping Applicability',    width: 200 },
];

export type PartialExportSelection = { invoiceIds: string[]; hsCodes: { invoiceId: string; code: string }[] };

export function PartialExportPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (s: PartialExportSelection) => void;
}) {
  const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
  const [selectedHs, setSelectedHs] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleInvoice = (id: string) => {
    const next = new Set(selectedInvoices);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedInvoices(next);
    if (!expanded.has(id) && next.has(id)) { const e = new Set(expanded); e.add(id); setExpanded(e); }
  };
  const toggleHs = (invId: string, code: string) => {
    const key = `${invId}::${code}`;
    const next = new Set(selectedHs);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelectedHs(next);
  };
  const toggleExpanded = (id: string) => {
    const e = new Set(expanded);
    if (e.has(id)) e.delete(id); else e.add(id);
    setExpanded(e);
  };

  return (
    <PageShell
      title="Partial Export — Select Invoices &amp; HS Codes"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn onClick={() => onContinue({ invoiceIds: Array.from(selectedInvoices), hsCodes: Array.from(selectedHs).map((k) => { const [invoiceId, code] = k.split('::'); return { invoiceId, code }; }) })}>Continue</PrimaryBtn>}
    >
      <SectionHeader>Invoices &amp; HS Codes</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[16px]">Choose the invoices that contain the partially exported goods, then select the HS codes within each invoice that were re-exported.</p>
        <div className="flex flex-col gap-[12px]">
          {SAMPLE_INVOICES.map((inv) => {
            const invSelected = selectedInvoices.has(inv.id);
            const isExpanded  = expanded.has(inv.id);
            return (
              <div key={inv.id} className="border rounded-[8px]" style={{ borderColor: invSelected ? '#1360d2' : '#e0e6ef', background: invSelected ? '#f6f9fe' : '#fff' }}>
                <div className="flex items-center gap-[12px] px-[16px] py-[14px] cursor-pointer" onClick={() => toggleExpanded(inv.id)}>
                  <button
                    role="checkbox"
                    aria-checked={invSelected}
                    onClick={(e) => { e.stopPropagation(); toggleInvoice(inv.id); }}
                    className="size-[20px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center"
                    style={{ border: `2px solid ${invSelected ? '#1360d2' : '#a7abb2'}`, background: invSelected ? '#1360d2' : '#fff' }}
                  >
                    {invSelected && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                  </button>
                  <div className="flex-1 flex items-center gap-[16px]">
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{inv.invoiceNo}</span>
                    <span className="text-[16px] text-[#697498]">Date: {inv.date}</span>
                    <span className="text-[16px] text-[#697498]">{inv.hsCodes.length} HS code{inv.hsCodes.length !== 1 ? 's' : ''}</span>
                  </div>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 120ms' }}>
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
                {isExpanded && (
                  <div className="px-[16px] pb-[14px]">
                    <div className="overflow-x-auto rounded-[6px] border border-[#eef1f6]">
                      <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f4f7fc' }}>
                            <th style={{ padding: '8px 12px', width: 36 }} />
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>HS Code</th>
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>Description</th>
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>Quantity</th>
                            <th className="text-left text-[16px] text-[#455174]" style={{ padding: '8px 12px', fontWeight: 600 }}>Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inv.hsCodes.map((hs) => {
                            const key = `${inv.id}::${hs.code}`;
                            const hsSelected = selectedHs.has(key);
                            return (
                              <tr key={hs.code} style={{ background: hsSelected ? '#f6f9fe' : '#fff' }}>
                                <td style={{ padding: '8px 12px' }}>
                                  <button
                                    role="checkbox"
                                    aria-checked={hsSelected}
                                    onClick={() => toggleHs(inv.id, hs.code)}
                                    disabled={!invSelected}
                                    className="size-[18px] rounded-[3px] flex-shrink-0 inline-flex items-center justify-center"
                                    style={{ border: `2px solid ${hsSelected ? '#1360d2' : '#a7abb2'}`, background: hsSelected ? '#1360d2' : '#fff', cursor: invSelected ? 'pointer' : 'not-allowed', opacity: invSelected ? 1 : 0.5 }}
                                  >
                                    {hsSelected && <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
                                  </button>
                                </td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px', fontWeight: 500 }}>{hs.code}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>{hs.description}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>{hs.itemQty}</td>
                                <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '8px 12px' }}>{hs.valueOfGoods}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </PageShell>
  );
}

/* ───────── Missing Document Deposit — Refund Details page ───────── */
/* ───────── Document Upload page ───────── */
export type UploadedDoc = { id: string; fileName: string; sizeMb: string; uploadedOn: string; docType: string; authority: string };

const REQUIRED_DOC_TYPES: { id: string; label: string; required?: boolean; authority: string }[] = [
  { id: 'bill-of-entry',   label: 'Bill of Entry',                  required: true, authority: 'Dubai Customs' },
  { id: 'bill-of-lading',  label: 'Bill of Lading / AWB / Manifest',                authority: 'Dubai Customs' },
  { id: 'packing-list',    label: 'Packing List',                                   authority: 'Dubai Customs' },
  { id: 'invoice',         label: 'Invoice',                                        authority: 'Dubai Customs' },
  { id: 'cert-of-origin',  label: 'Certificate of Origin',                          authority: 'Dubai Customs' },
];

export function DocumentUploadPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (docs: UploadedDoc[]) => void;
}) {
  const [selectedDocType, setSelectedDocType] = useState<string>(REQUIRED_DOC_TYPES[0].id);
  const [docs, setDocs] = useState<UploadedDoc[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeType = REQUIRED_DOC_TYPES.find((t) => t.id === selectedDocType) ?? REQUIRED_DOC_TYPES[0];
  const countByType = (id: string) => docs.filter((d) => d.docType === id).length;

  const today = new Date();
  const today_dd_mm_yyyy = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const next: UploadedDoc[] = [];
    Array.from(files).forEach((f, i) => {
      next.push({
        id: `${Date.now()}-${i}`,
        fileName: f.name,
        sizeMb: `${Math.max(1, Math.round((f.size / (1024 * 1024)) * 10) / 10)} MB`,
        uploadedOn: today_dd_mm_yyyy,
        docType: activeType.label,
        authority: activeType.authority,
      });
    });
    setDocs((prev) => [...prev, ...next]);
  };

  return (
    <PageShell
      title="Upload Documents"
      activeIndex={2}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<div className="flex items-center gap-[12px]"><SaveExitBtn onBackToListing={onBackToListing} /><PrimaryBtn onClick={() => onContinue(docs)}>Continue</PrimaryBtn></div>}
    >
      {/* Mandatory Documents table */}
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
        <div className="px-[20px] py-[14px]" style={{ borderBottom: '1px solid #eef1f6' }}>
          <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Mandatory Documents</p>
        </div>
        <div className="overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#a6c2e9' }}>
                {['Charge Type', 'Mandatory', 'Doc. Name', 'Doc. Nature', 'Current Status'].map(h => (
                  <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MANDATORY_DOCS.default.map((doc, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                  <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.chargeType}</td>
                  <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.mandatory}</td>
                  <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.docName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.docNature}</td>
                  <td style={{ padding: '12px 16px', fontSize: 15, color: '#dc3545', fontWeight: 500 }}>Not Submitted</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
          {/* Left — doc type selection */}
          <div className="flex flex-col gap-[16px]">
            <p className="text-[20px] text-[#060c28]" style={{ fontWeight: 500 }}>Upload Documents</p>
            <p className="text-[16px] text-[#455174]">Select the document type and upload the file. We will share the documents with the relevant authorities.</p>

            <p className="text-[16px] text-[#060c28] mt-[8px]" style={{ fontWeight: 500 }}>Dubai Customs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[24px] gap-y-[14px]">
              {REQUIRED_DOC_TYPES.map((t) => {
                const active = selectedDocType === t.id;
                const cnt = countByType(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedDocType(t.id)}
                    className="flex items-center gap-[10px] text-left"
                  >
                    <span className="size-[18px] rounded-full inline-flex items-center justify-center flex-shrink-0" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}` }}>
                      {active && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}
                    </span>
                    <span className="text-[16px] text-[#060c28]">
                      {t.required && <span style={{ color: '#dc3545' }}>*</span>}
                      {t.label}
                    </span>
                    {cnt > 0 && (
                      <span className="inline-flex items-center justify-center text-[12px] text-[#060c28] rounded-[4px] px-[8px] h-[20px]" style={{ background: '#c8f4d2', fontWeight: 500 }}>{cnt}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — upload zone */}
          <div className="rounded-[8px] p-[20px]" style={{ background: '#fff', border: '1px solid #eef1f6' }}>
            <p className="text-[20px] text-[#060c28] mb-[12px]" style={{ fontWeight: 500 }}>Upload File</p>
            <p className="text-[16px] text-[#455174] mb-[4px]">*Supported file type: .pdf, .jpg etc, max file size 50 MB</p>
            <p className="text-[16px] text-[#455174] mb-[16px]">*Only 5 files allowed per document type</p>
            <div className="text-[16px] text-[#455174] mb-[16px] inline-flex items-center gap-[8px]">
              *Number in <span className="inline-block size-[16px] rounded-[4px]" style={{ background: '#c8f4d2' }} /> indicates the number of documents uploaded
            </div>

            <div
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={(e) => { e.preventDefault(); setDragActive(false); handleFiles(e.dataTransfer.files); }}
              className="rounded-[4px] flex flex-col items-center justify-center gap-[12px] py-[28px]"
              style={{ background: '#f8fafd', border: `1px dashed ${dragActive ? '#1360d2' : '#8f94ae'}` }}
            >
              <div className="size-[60px] rounded-full inline-flex items-center justify-center" style={{ background: '#dfe5e9' }}>
                <svg viewBox="0 0 32 32" width="30" height="30" fill="none" stroke="#697498" strokeWidth="1.6"><path d="M9 22a5 5 0 110-10 7 7 0 0113.65 1.5A5 5 0 0123 22" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 14v9M12 18l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </div>
              <p className="text-[16px] text-[#6d707e]" style={{ fontWeight: 500 }}>Drag and drop or</p>
              <input ref={fileInputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="h-[44px] px-[20px] rounded-[4px] border text-[16px] text-[#1360d2] bg-white"
                style={{ borderColor: '#1360d2', fontWeight: 500 }}
              >
                Choose File
              </button>
              <p className="text-[12px] text-[#697498]">Uploading as: <span style={{ color: '#0e1b3d', fontWeight: 500 }}>{activeType.label}</span></p>
            </div>
          </div>
        </div>
      </Card>

      <SectionHeader>Documents Uploaded</SectionHeader>
      <Card>
        {docs.length === 0 ? (
          <p className="text-[16px] text-[#697498] text-center py-[24px]">No documents uploaded yet.</p>
        ) : (
          <div className="border border-[#d5ddfb] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Document Name</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Authority Name</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Document Type</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Uploaded Size</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>Uploaded On</th>
                  <th className="text-left text-[16px] text-[#696f83]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap', width: 120 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {docs.map((d) => (
                  <tr key={d.id} style={{ borderTop: '1px solid #eef1f6' }}>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px' }}>{d.fileName}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.authority}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.docType}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.sizeMb}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{d.uploadedOn}</td>
                    <td style={{ padding: '12px' }}>
                      <div className="inline-flex items-center gap-[12px]">
                        <button
                          onClick={() => setDocs(docs.filter((x) => x.id !== d.id))}
                          aria-label="Delete"
                          className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#fef2f2]"
                          style={{ color: '#dc3545' }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-9 0v14a2 2 0 002 2h6a2 2 0 002-2V6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                        <button
                          aria-label="Download"
                          className="size-[28px] rounded-[4px] inline-flex items-center justify-center hover:bg-[#e2ebf9]"
                          style={{ color: '#1360d2' }}
                        >
                          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  );
}

/* ───────── Payment Details page ───────── */
export type ClaimSummary = {
  declarationNo: string;
  depositType: string;
  depositAmount: string;
  depositMethod: string;
  refundType: string;
  hsCount: number;
  outboundDeclarationNo: string;
  totalRefundAmount: string;
};

export type PaymentDetails = { mode: string; accountNo: string };

export function PaymentDetailsPage({
  summary, onBack, onBackToListing, onContinue,
}: {
  summary: ClaimSummary;
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (p: PaymentDetails) => void;
}) {
  const [mode, setMode] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [depositMethodChoice, setDepositMethodChoice] = useState('');

  const depositMethodField = (
    <div className="max-w-[240px]">
      <DTSelect
        label="Deposit Method"
        required
        value={depositMethodChoice}
        onChange={setDepositMethodChoice}
        options={[
          { value: 'standing', label: 'Standing Guarantee' },
          { value: 'epayment', label: 'e-Payment' },
        ]}
        height={44}
      />
    </div>
  );

  const fields: { k: string; v: React.ReactNode }[] = [
    { k: 'Declaration No.',       v: summary.declarationNo },
    { k: 'Deposit Type',          v: summary.depositType },
    { k: 'Deposit Amount',        v: <span className="inline-flex items-baseline gap-[4px]"><Dh /> {String(summary.depositAmount).replace(/^Dh\s*/, '')}</span> },
    { k: 'Deposit Method',        v: depositMethodField },
    { k: 'Refund Type',           v: <span>{summary.refundType}{summary.refundType.toLowerCase().includes('partial') && <span className="text-[16px] text-[#696f83] ml-[8px]">No. of HS Codes — {summary.hsCount}</span>}</span> },
    { k: 'Outbound Declaration',  v: summary.outboundDeclarationNo },
    { k: 'Total Refund Amount',   v: <span className="inline-flex items-baseline gap-[4px]" style={{ color: '#1360d2', fontWeight: 600 }}><Dh /> {String(summary.totalRefundAmount).replace(/^Dh\s*/, '')}</span> },
  ];

  return (
    <PageShell
      title="Claim Payment Details"
      activeIndex={3}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<div className="flex items-center gap-[12px]"><SaveExitBtn onBackToListing={onBackToListing} /><PrimaryBtn onClick={() => onContinue({ mode, accountNo })}>Submit Claim</PrimaryBtn></div>}
    >
      <SectionHeader>Claim Summary</SectionHeader>
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[20px]">
          {fields.map((f) => (
            <div key={f.k} className="flex flex-col gap-[6px]">
              <span className="text-[16px] text-[#696f83]">{f.k}</span>
              <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{f.v}</span>
            </div>
          ))}
        </div>
      </Card>

      <SectionHeader>Claim Payment Details</SectionHeader>
      <Card>
        <div className="overflow-hidden rounded-[8px]">
          <div className="grid" style={{ gridTemplateColumns: 'minmax(360px, 1fr) minmax(220px, 1fr) minmax(240px, 1fr)', background: '#a6c2e9' }}>
            <div className="text-left text-[16px] text-[#455174]" style={{ padding: '12px 20px', fontWeight: 500 }}>Charges</div>
            <div className="text-left text-[16px] text-[#455174]" style={{ padding: '12px 16px', fontWeight: 500 }}>Payment Mode</div>
            <div className="text-left text-[16px] text-[#455174]" style={{ padding: '12px 16px', fontWeight: 500 }}>Credit / Debit Account No.</div>
          </div>
          <div className="grid items-start" style={{ gridTemplateColumns: 'minmax(360px, 1fr) minmax(220px, 1fr) minmax(240px, 1fr)', gap: 20, padding: 20, background: '#fff', boxShadow: '1px 2px 12px 0 rgba(0,0,0,0.06)' }}>
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center gap-[12px]" style={{ background: '#eff2f7', height: 49, padding: '0 12px' }}>
                <span className="text-[16px]" style={{ color: '#696f83', fontWeight: 500, flex: 1 }}>Total Charges</span>
                <span className="text-[20px]" style={{ color: '#051937', fontWeight: 700 }}><DhAmount value="70" /></span>
              </div>
              <div className="flex items-start gap-[12px]" style={{ padding: '0 12px' }}>
                <span className="text-[16px]" style={{ color: '#696f83', fontWeight: 500, flex: 1 }}>Claim Registration Charge</span>
                <span className="text-[16px]" style={{ color: '#051937', fontWeight: 700, minWidth: 80 }}><DhAmount value="50" /></span>
              </div>
              <div className="flex items-start gap-[12px]" style={{ padding: '0 12px' }}>
                <span className="text-[16px]" style={{ color: '#696f83', fontWeight: 500, flex: 1 }}>Knowledge-Innovation Dirham</span>
                <span className="text-[16px]" style={{ color: '#051937', fontWeight: 700, minWidth: 80 }}><DhAmount value="20" /></span>
              </div>
            </div>
            <div>
              <DTSelect
                label="Payment Mode"
                required
                value={mode}
                onChange={setMode}
                options={[
                  { value: 'credit-card', label: 'Credit Card' },
                  { value: 'debit-card', label: 'Debit Card' },
                  { value: 'epayment', label: 'e-Payment' },
                  { value: 'standing-guarantee', label: 'Standing Guarantee' },
                ]}
              />
            </div>
            <div>
              <FloatingField
                label="Account Number"
                required
                placeholder="Enter Account Number"
                value={accountNo}
                onChange={setAccountNo}
              />
            </div>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

export type MissingDocDetails = { refundAmount: string; currency: string; depositMethod: DepositMethod; remarks: string };

export function MissingDocDepositPage({
  onBack, onBackToListing, onContinue,
}: {
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (d: MissingDocDetails) => void;
}) {
  // Refund Amount is auto-calculated by the system based on the declaration.
  const [refundAmount] = useState('1,000');
  const [currency, setCurrency] = useState('AED');
  const [depositMethod, setDepositMethod] = useState<DepositMethod | ''>('');
  const [remarks, setRemarks] = useState('');
  const [open2, setOpen2] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open2) return;
    const onDoc = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen2(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open2]);

  return (
    <PageShell
      title="Refund Details"
      activeIndex={1}
      onBack={onBack}
      onBackToListing={onBackToListing}
      rightContent={<PrimaryBtn onClick={() => onContinue({ refundAmount, currency, depositMethod: (depositMethod || 'cash') as DepositMethod, remarks })}>Continue</PrimaryBtn>}
    >
      <SectionHeader>Refund &amp; Deposit Method</SectionHeader>
      <Card>
        <p className="text-[16px] text-[#455174] mb-[20px]">Provide the refund amount and the original deposit method used for this declaration.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[20px]">
          <div className="relative" style={{ fontFamily: "'Dubai', sans-serif" }}>
            <div
              className="h-[56px] rounded-[4px] flex items-center px-[16px]"
              style={{ border: '1px solid #d5ddfb', background: '#f5f6f8' }}
            >
              <span className="flex-1 text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{refundAmount}</span>
              <span className="text-[12px] text-[#697498] ml-[8px]">Auto</span>
            </div>
            <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d' }}>
              Refund Amount
            </label>
          </div>
          <FloatingField label="Currency" placeholder="AED" value={currency} onChange={setCurrency} trailingIcon={<svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>} />

          <div className="relative" ref={dropRef}>
            <div
              tabIndex={0}
              onClick={() => setOpen2(!open2)}
              className={`h-[56px] border rounded-[4px] flex items-center px-[14px] cursor-pointer transition-colors bg-white ${open2 ? 'border-[#1360d2]' : 'border-[#d5ddfb] hover:border-[#1360d2]'}`}
            >
              <span className="text-[16px] flex-1" style={{ color: depositMethod ? '#0e1b3d' : '#697498' }}>
                {depositMethod ? DEPOSIT_METHOD_LABEL[depositMethod] : 'Select'}
              </span>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
            </div>
            <span className="absolute pointer-events-none" style={{
              left: 10, top: -9, background: '#fff', padding: '0 4px',
              fontSize: 12, color: open2 ? '#1360d2' : '#0e1b3d',
              fontFamily: "'Dubai', sans-serif",
            }}>
              <span style={{ color: '#dc3545' }}>*</span>Deposit Method
            </span>
            {open2 && (
              <div className="absolute z-[10] left-0 right-0 mt-[6px] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                {(['standing', 'cash', 'epayment'] as DepositMethod[]).map((m) => (
                  <button
                    key={m}
                    className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                    onClick={() => { setDepositMethod(m); setOpen2(false); }}
                  >
                    <span className="text-[#1360d2] group-hover:text-white">
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        {m === 'cash'     && <><rect x="3" y="6" width="14" height="9" rx="1.5" /><circle cx="10" cy="10.5" r="2" /></>}
                        {m === 'standing' && <><path d="M4 8l6-4 6 4v5a6 6 0 01-6 6 6 6 0 01-6-6V8z" /><path d="M7 11l2 2 4-4" /></>}
                        {m === 'epayment' && <><rect x="3" y="6" width="14" height="9" rx="1.5" /><path d="M3 10h14" /><path d="M6 13h3" /></>}
                      </svg>
                    </span>
                    <span className="text-[16px] text-[#111838] group-hover:text-white">{DEPOSIT_METHOD_LABEL[m]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <FloatingField label="Remarks" placeholder="Enter Remarks" value={remarks} onChange={setRemarks} height={88} />
          </div>
        </div>
      </Card>
    </PageShell>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * ChargeDetailsPage — Step 2 of the Refund of Deposits flow.
 * ───────────────────────────────────────────────────────────────────────────── */

export type OutboundDetail = {
  customsAuthority: string;
  declarationNo: string;
  declarationType: string;
  exitPoint: string;
  actualDepartureDate: string;
  statQty: string;
  weight: string;
  suppQty: string;
  reExportTo: string;
};

const BLANK_OUTBOUND: OutboundDetail = {
  customsAuthority: 'Dubai Customs',
  declarationNo: '',
  declarationType: '',
  exitPoint: '',
  actualDepartureDate: '',
  statQty: '',
  weight: '',
  suppQty: '',
  reExportTo: '',
};

const CUSTOMS_AUTHORITIES = ['Dubai Customs', 'Abu Dhabi Customs', 'Sharjah Customs'];
const DECLARATION_TYPES = ['Export', 'Re-Export', 'Transit'];
const EXIT_POINTS = ['Jebel Ali Port', 'Dubai International Airport', 'Port Rashid', 'Al Maktoum Airport'];
const RE_EXPORT_DESTINATIONS = ['United States', 'United Kingdom', 'Germany', 'India', 'China', 'Saudi Arabia', 'Kuwait', 'Oman'];

function OutboundModal({
  open,
  initialData,
  onSave,
  onSaveNew,
  onClose,
}: {
  open: boolean;
  initialData?: OutboundDetail;
  onSave: (d: OutboundDetail) => void;
  onSaveNew: (d: OutboundDetail) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<OutboundDetail>(initialData ?? { ...BLANK_OUTBOUND });
  useEffect(() => { if (open) setForm(initialData ?? { ...BLANK_OUTBOUND }); }, [open]);

  const set = (k: keyof OutboundDetail, v: string) => setForm(f => ({ ...f, [k]: v }));
  const isValid = form.declarationNo.trim() !== '' && form.declarationType !== '' && form.exitPoint !== '' && form.actualDepartureDate !== '' && form.statQty.trim() !== '' && form.weight.trim() !== '' && form.reExportTo !== '';

  if (!open) return null;

  const font = "'Dubai', 'Segoe UI', sans-serif";

  const LabelInput = ({ label, required, field, type = 'text', placeholder = '' }: { label: string; required?: boolean; field: keyof OutboundDetail; type?: string; placeholder?: string }) => (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>
        {required && <span className="text-[#dc3545] mr-[2px]">*</span>}{label}
      </label>
      <input
        type={type}
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        placeholder={placeholder}
        className="h-[40px] rounded-[4px] px-[12px] text-[15px] focus:outline-none"
        style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d', background: '#fff' }}
      />
    </div>
  );

  const LabelSelect = ({ label, required, field, options }: { label: string; required?: boolean; field: keyof OutboundDetail; options: string[] }) => (
    <div className="flex flex-col gap-[6px]">
      <label className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>
        {required && <span className="text-[#dc3545] mr-[2px]">*</span>}{label}
      </label>
      <select
        value={form[field]}
        onChange={e => set(field, e.target.value)}
        className="h-[40px] rounded-[4px] px-[12px] text-[15px] focus:outline-none appearance-none"
        style={{ border: '1px solid #d5ddfb', fontFamily: font, color: form[field] ? '#0e1b3d' : '#697498', background: '#fff' }}
      >
        <option value="">Please Select</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="bg-white rounded-[8px] w-full max-w-[600px] mx-[16px] flex flex-col overflow-hidden" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.22)', maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-[24px] py-[16px] flex-shrink-0" style={{ background: '#1360d2' }}>
          <p className="text-[18px] text-white" style={{ fontWeight: 600, fontFamily: font }}>Add Outbound Declaration Details</p>
          <button type="button" onClick={onClose} className="size-[28px] inline-flex items-center justify-center rounded hover:bg-white/20 transition-colors">
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[16px]">
          <p className="text-[15px] text-[#1360d2]" style={{ fontWeight: 600, fontFamily: font }}>Outbound Declaration Detail</p>

          <div className="grid grid-cols-2 gap-x-[20px] gap-y-[14px]">
            <LabelSelect label="Customs Authority" required field="customsAuthority" options={CUSTOMS_AUTHORITIES} />
            <div className="flex flex-col gap-[6px]">
              <label className="text-[14px]" style={{ color: '#697498', fontFamily: font }}><span className="text-[#dc3545] mr-[2px]">*</span>Declaration No.</label>
              <div className="flex gap-[8px]">
                <input
                  value={form.declarationNo}
                  onChange={e => set('declarationNo', e.target.value)}
                  placeholder="Enter declaration no."
                  className="flex-1 h-[40px] rounded-[4px] px-[12px] text-[15px] focus:outline-none"
                  style={{ border: '1px solid #d5ddfb', fontFamily: font, color: '#0e1b3d' }}
                />
                <button type="button" title="Search"
                  className="size-[40px] flex-shrink-0 inline-flex items-center justify-center rounded-[4px] transition-colors hover:bg-[#0f4fb5]"
                  style={{ background: '#1360d2' }}>
                  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="9" r="5.5"/><path d="M14 14l4 4"/></svg>
                </button>
              </div>
            </div>

            <LabelSelect label="Declaration Type" required field="declarationType" options={DECLARATION_TYPES} />
            <LabelSelect label="Exit Point" required field="exitPoint" options={EXIT_POINTS} />

            <LabelInput label="Actual Departure Date" required field="actualDepartureDate" type="date" />
            <LabelInput label="Stat. Qty" required field="statQty" type="number" placeholder="Enter quantity" />

            <LabelInput label="Weight" required field="weight" type="number" placeholder="Enter weight (kg)" />
            <LabelInput label="Supp. Qty" field="suppQty" type="number" placeholder="Enter supp. qty" />

            <div className="col-span-2">
              <LabelSelect label="Re-Export To" required field="reExportTo" options={RE_EXPORT_DESTINATIONS} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-[12px] px-[24px] py-[16px] flex-shrink-0" style={{ borderTop: '1px solid #eef1f6' }}>
          <button data-secondary-btn type="button" onClick={onClose}
            className="h-[40px] px-[20px] rounded-[4px] border text-[15px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
            Close
          </button>
          <button type="button" onClick={() => onSaveNew(form)}
            className="h-[40px] px-[20px] rounded-[4px] border text-[15px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500, cursor: 'pointer' }}>
            Save &amp; Create New
          </button>
          <button type="button" onClick={() => onSave(form)}
            className="h-[40px] px-[24px] rounded-[4px] text-[15px] text-white transition-colors"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, cursor: 'pointer' }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export type ChargeDetail = {
  declarationNo: string;
  chargeType: string;
  depositAmount: string;
  refundType: RefundType | '';
  outboundDeclNo: string;
  claimAmount: string;
};

const REFUND_OPTIONS_ALL: { value: RefundType; label: string }[] = [
  { value: 'full',          label: 'Full Export' },
  { value: 'fullImport',    label: 'Full Import' },
  { value: 'partial',       label: 'Partial Export' },
  { value: 'partialImport', label: 'Partial Import' },
  { value: 'no',            label: 'No Export' },
];

function needsOutbound(rt: RefundType | ''): boolean {
  return rt === 'full' || rt === 'fullImport' || rt === 'partial' || rt === 'partialImport';
}

function parseAED(amt: string): number {
  return parseFloat(amt.replace(/[^0-9.]/g, '').replace(/,/g, '')) || 0;
}

function autoClaimAmount(rt: RefundType | '', depositAmount: string): string {
  if (!rt) return '';
  if (rt === 'no') return '0';
  if (rt === 'full' || rt === 'fullImport') return String(parseAED(depositAmount));
  return '';
}

export function ChargeDetailsPage({
  rows,
  onBack,
  onBackToListing,
  onContinue,
}: {
  rows: Row[];
  onBack: () => void;
  onBackToListing?: () => void;
  onContinue: (details: ChargeDetail[]) => void;
}) {
  const [details, setDetails] = useState<ChargeDetail[]>(() =>
    rows.map(r => ({
      declarationNo: r.declarationNo,
      chargeType: r.depositType,
      depositAmount: r.depositAmount,
      refundType: '' as RefundType | '',
      outboundDeclNo: '',
      claimAmount: '',
    }))
  );
  const [outboundModal, setOutboundModal] = useState<{ rowIndex: number } | null>(null);
  const [outboundDetails, setOutboundDetails] = useState<Record<number, OutboundDetail>>({});

  const update = (i: number, patch: Partial<ChargeDetail>) =>
    setDetails(prev => prev.map((d, idx) => idx === i ? { ...d, ...patch } : d));

  const saveOutbound = (i: number, d: OutboundDetail, closeModal: boolean) => {
    setOutboundDetails(prev => ({ ...prev, [i]: d }));
    update(i, { outboundDeclNo: d.declarationNo });
    if (closeModal) setOutboundModal(null);
  };

  const allValid = details.every(d =>
    d.refundType &&
    d.claimAmount.trim() !== '' &&
    (!needsOutbound(d.refundType) || d.outboundDeclNo.trim() !== '')
  );

  return (
    <PageShell
      title="Raise New Claim - Refund of Deposits"
      onBack={onBack}
      activeIndex={1}
      steps={REFUND_DEPOSIT_STEPS}
      rightContent={
        <div className="flex items-center gap-[12px]"><SaveExitBtn onBackToListing={onBackToListing} /><PrimaryBtn onClick={() => onContinue(details)}>Next</PrimaryBtn></div>
      }
    >
      <Card>
        <p className="text-[18px] text-[#0e1b3d] mb-[20px]" style={{ fontWeight: 500 }}>Declaration Details</p>
        <div>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 10px', fontFamily: "'Dubai', sans-serif" }}>
            <thead>
              <tr>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', background: '#a6c2e9', borderRadius: '8px 0 0 8px', whiteSpace: 'nowrap' }}>Declaration No.</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', background: '#a6c2e9', whiteSpace: 'nowrap' }}>Charge Type</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', background: '#a6c2e9', whiteSpace: 'nowrap' }}>Amount (AED)</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', background: '#a6c2e9', whiteSpace: 'nowrap', minWidth: 200 }}>Refund Type</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', background: '#a6c2e9', whiteSpace: 'nowrap', minWidth: 160 }}>Claim Amount (AED)</th>
                <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 16, fontWeight: 600, color: '#051937', background: '#a6c2e9', borderRadius: '0 8px 8px 0', whiteSpace: 'nowrap' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {details.map((d, i) => (
                <React.Fragment key={d.declarationNo}>
                  <tr style={{ background: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '14px', fontSize: 16, color: '#1360d2', fontWeight: 500, borderRadius: '8px 0 0 8px', whiteSpace: 'nowrap', border: '1px solid #eef1f6', borderRight: 'none' }}>{d.declarationNo}</td>
                    <td style={{ padding: '14px', fontSize: 16, color: '#0e1b3d', border: '1px solid #eef1f6', borderLeft: 'none', borderRight: 'none' }}>{d.chargeType}</td>
                    <td style={{ padding: '14px', fontSize: 16, color: '#0e1b3d', fontWeight: 500, whiteSpace: 'nowrap', border: '1px solid #eef1f6', borderLeft: 'none', borderRight: 'none' }}>
                      {d.depositAmount === 'N/A' ? '—' : d.depositAmount.replace(/^Dh\s*/, '')}
                    </td>
                    <td style={{ padding: '10px 14px', minWidth: 200, border: '1px solid #eef1f6', borderLeft: 'none', borderRight: 'none' }}>
                      <RefundTypeInlineSelect
                        value={d.refundType}
                        onChange={rt => update(i, { refundType: rt, outboundDeclNo: '', claimAmount: autoClaimAmount(rt, d.depositAmount) })}
                      />
                    </td>
                    <td style={{ padding: '10px 14px', minWidth: 160, border: '1px solid #eef1f6', borderLeft: 'none', borderRight: 'none' }}>
                      <input
                        type="number"
                        min={0}
                        value={d.claimAmount}
                        onChange={e => update(i, { claimAmount: e.target.value })}
                        placeholder="Enter Amount"
                        readOnly={d.refundType === 'no' || d.refundType === 'full' || d.refundType === 'fullImport'}
                        className="w-full h-[44px] rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none"
                        style={{ border: '1px solid #d5ddfb', fontFamily: "'Dubai', sans-serif", background: (d.refundType === 'no' || d.refundType === 'full' || d.refundType === 'fullImport') ? '#f8fafd' : '#fff' }}
                      />
                    </td>
                    <td style={{ padding: '10px 14px', borderRadius: '0 8px 8px 0', border: '1px solid #eef1f6', borderLeft: 'none', whiteSpace: 'nowrap' }}>
                      {needsOutbound(d.refundType) ? (
                        d.outboundDeclNo.trim() ? (
                          <div className="flex items-center gap-[6px]">
                            <span className="inline-flex items-center gap-[4px] text-[14px] px-[10px] py-[4px] rounded-[4px]" style={{ background: '#e6f7ee', color: '#1a7a42', fontWeight: 500 }}>
                              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7"/></svg>
                              Added
                            </span>
                            <button type="button" onClick={() => setOutboundModal({ rowIndex: i })}
                              className="text-[13px] hover:underline" style={{ color: '#1360d2' }}>Edit</button>
                          </div>
                        ) : (
                          <button type="button" onClick={() => setOutboundModal({ rowIndex: i })}
                            className="inline-flex items-center gap-[6px] h-[36px] px-[14px] rounded-[4px] text-[14px] transition-colors hover:bg-[#e8f0ff]"
                            style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500, background: '#fff' }}>
                            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
                            Add Outbound Declaration
                          </button>
                        )
                      ) : (
                        <span className="text-[14px] text-[#b0b8cc]">—</span>
                      )}
                    </td>
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <OutboundModal
        open={outboundModal !== null}
        initialData={outboundModal !== null ? (outboundDetails[outboundModal.rowIndex] ?? undefined) : undefined}
        onSave={d => saveOutbound(outboundModal!.rowIndex, d, true)}
        onSaveNew={d => { saveOutbound(outboundModal!.rowIndex, d, false); setOutboundModal({ rowIndex: outboundModal!.rowIndex }); }}
        onClose={() => setOutboundModal(null)}
      />
    </PageShell>
  );
}

function RefundTypeInlineSelect({ value, onChange }: { value: RefundType | ''; onChange: (v: RefundType) => void }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const handleOpen = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    setOpen(o => !o);
  };

  const selected = REFUND_OPTIONS_ALL.find(o => o.value === value);
  return (
    <div className="relative">
      <button ref={btnRef} type="button" onClick={handleOpen}
        className="w-full h-[44px] flex items-center justify-between px-[12px] rounded-[4px] bg-white transition-colors"
        style={{ border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: "'Dubai', sans-serif" }}>
        <span className="text-[16px]" style={{ color: selected ? '#0e1b3d' : '#697498' }}>{selected ? selected.label : 'Please Select'}</span>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && rect && ReactDOM.createPortal(
        <div ref={ref} className="bg-white rounded-[8px] py-[4px]"
          style={{ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 2000, boxShadow: '0px 4px 20px rgba(0,0,0,0.12)', border: '1px solid #e0e6ef', minWidth: 180 }}>
          {REFUND_OPTIONS_ALL.map(opt => (
            <button key={opt.value} type="button" onMouseDown={e => { e.preventDefault(); onChange(opt.value); setOpen(false); }}
              className="group flex items-center justify-between w-full px-[14px] py-[10px] hover:bg-[#1360d2] transition-colors">
              <span className={`text-[16px] group-hover:text-white ${opt.value === value ? 'text-[#1360d2]' : 'text-[#111838]'}`}
                style={{ fontFamily: "'Dubai', sans-serif", fontWeight: opt.value === value ? 500 : 400 }}>{opt.label}</span>
              {opt.value === value && <svg className="group-hover:stroke-white" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.5"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

function OutboundDeclInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [search, setSearch] = useState('');
  const [pickerOpen, setPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pickerOpen) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setPickerOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [pickerOpen]);

  const selectedRecord = SAMPLE_OUTBOUND.find(ob => ob.declarationNo === value);
  const filtered = SAMPLE_OUTBOUND.filter(ob =>
    !search || ob.declarationNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="flex flex-col gap-[10px]">
      {/* Search field */}
      <div className="flex items-center gap-[8px] h-[48px] rounded-[4px] bg-white px-[14px]"
        style={{ border: `1px solid ${pickerOpen ? '#1360d2' : '#d5ddfb'}`, position: 'relative', maxWidth: 540 }}>
        <input
          value={pickerOpen ? search : value}
          onChange={e => { setSearch(e.target.value); if (!pickerOpen) setPickerOpen(true); }}
          onFocus={() => { setPickerOpen(true); setSearch(''); }}
          placeholder="Search outbound declaration no."
          className="flex-1 text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
          style={{ fontFamily: "'Dubai', sans-serif" }}
        />
        {value && !pickerOpen
          ? <button type="button" onMouseDown={e => { e.preventDefault(); onChange(''); setSearch(''); }}
              className="flex-shrink-0 size-[20px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff]">
              <svg viewBox="0 0 16 16" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
            </button>
          : <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 pointer-events-none">
              <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
            </svg>
        }

        {/* Declaration number dropdown */}
        {pickerOpen && (
          <div className="absolute z-[200] left-0 right-0 bg-white rounded-[8px] overflow-hidden"
            style={{ top: 'calc(100% + 4px)', boxShadow: '0px 4px 20px rgba(0,0,0,0.14)', border: '1px solid #e0e6ef', maxHeight: 220, overflowY: 'auto' }}>
            {filtered.length === 0
              ? <p className="px-[14px] py-[10px] text-[14px] text-[#697498]" style={{ fontFamily: "'Dubai', sans-serif" }}>No matching declarations</p>
              : filtered.map(ob => (
                <button key={ob.id} type="button"
                  onMouseDown={e => { e.preventDefault(); onChange(ob.declarationNo); setPickerOpen(false); setSearch(''); }}
                  className="group w-full flex items-center justify-between px-[14px] py-[11px] text-left hover:bg-[#1360d2] transition-colors"
                  style={{ borderBottom: '1px solid #f0f0f5' }}>
                  <span className={`text-[15px] group-hover:text-white ${ob.declarationNo === value ? 'text-[#1360d2]' : 'text-[#0e1b3d]'}`}
                    style={{ fontFamily: "'Dubai', sans-serif", fontWeight: ob.declarationNo === value ? 500 : 400 }}>
                    {ob.declarationNo}
                  </span>
                  {ob.declarationNo === value && (
                    <svg className="group-hover:stroke-white" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.5">
                      <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              ))
            }
          </div>
        )}
      </div>

      {/* Selected record details */}
      {selectedRecord && (
        <div className="rounded-[6px] px-[16px] py-[12px] flex items-start"
          style={{ background: '#f0f5ff', border: '1px solid #c7d9f7', fontFamily: "'Dubai', sans-serif" }}>
          {[
            { label: 'Export Type',    val: selectedRecord.exportType },
            { label: 'Exit Point',     val: selectedRecord.exitPoint },
            { label: 'Re-export To',   val: selectedRecord.reExportTo },
            { label: 'Departure Date', val: selectedRecord.departureDate },
            { label: 'Weight',         val: selectedRecord.weight },
            { label: 'Stat. Qty',      val: selectedRecord.statQty },
          ].map(({ label, val }, idx, arr) => (
            <div key={label} className="flex flex-col gap-[2px] flex-shrink-0"
              style={{ paddingRight: idx < arr.length - 1 ? 24 : 0, marginRight: idx < arr.length - 1 ? 24 : 0, borderRight: idx < arr.length - 1 ? '1px solid #c7d9f7' : 'none' }}>
              <span className="text-[16px] text-[#697498] whitespace-nowrap">{label}</span>
              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>{val}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * RDDocumentsPage — Step 3: Upload Documents (Refund of Deposits flow)
 * ───────────────────────────────────────────────────────────────────────────── */

const CLOUD_UPLOAD_ICON = 'https://www.figma.com/api/mcp/asset/9e722d4d-9a2d-4d15-bb37-70e5aba612d5';
const MAX_DOC_SIZE_MB = 50;

type RDUploadedDoc = { id: string; declNo: string; fileName: string; fileSize: number; uploadedOn: string; remarks?: string };

function fmtBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const MANDATORY_DOCS: Record<string, { chargeType: string; mandatory: string; docName: string; docNature: string }[]> = {
  default: [
    { chargeType: 'Deposit Alternative duty rate', mandatory: 'Yes', docName: 'Export Bill', docNature: 'Copy' },
    { chargeType: '', mandatory: 'Yes', docName: 'Bill of Entry', docNature: 'Consignee Claim Copy' },
    { chargeType: '', mandatory: 'Yes', docName: 'Export Declaration', docNature: 'Copy' },
    { chargeType: '', mandatory: 'Yes', docName: 'Exit / Entry Certificate', docNature: 'Original' },
    { chargeType: '', mandatory: 'No',  docName: 'Export Manifest', docNature: 'Copy' },
  ],
};

export function RDDocumentsPage({
  rows, onBack, onContinue, onBackToListing,
}: {
  rows: Row[];
  onBack: () => void;
  onContinue: (remarks: string) => void;
  onBackToListing?: () => void;
}) {
  const [selectedDecl, setSelectedDecl] = useState<string>(rows[0]?.declarationNo ?? '');
  const [uploadedDocs, setUploadedDocs] = useState<RDUploadedDoc[]>([]);
  const [remarks, setRemarks] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  let docCounter = 0;

  const today = new Date().toLocaleDateString('en-GB');

  const handleFile = (f: File) => {
    if (!selectedDecl || f.size > MAX_DOC_SIZE_MB * 1024 * 1024) return;
    docCounter += 1;
    const capturedRemarks = remarks;
    setUploadedDocs(prev => [...prev, { id: `${f.name}-${f.size}-${docCounter}`, declNo: selectedDecl, fileName: f.name, fileSize: f.size, uploadedOn: today, remarks: capturedRemarks || undefined }]);
    setRemarks('');
  };

  const removeDoc = (id: string) => setUploadedDocs(prev => prev.filter(d => d.id !== id));
  const countForDecl = (declNo: string) => uploadedDocs.filter(d => d.declNo === declNo).length;
  const allHaveDocs = rows.every(r => uploadedDocs.some(d => d.declNo === r.declarationNo));

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h1 className="px-4 sm:px-10 text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim - Refund of Deposits</h1>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={2} steps={REFUND_DEPOSIT_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Mandatory Documents for selected declaration */}
          {selectedDecl && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[20px] py-[14px]" style={{ borderBottom: '1px solid #eef1f6' }}>
                <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Mandatory Documents — <span style={{ color: '#1360d2' }}>{selectedDecl}</span></p>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      {['Charge Type', 'Mandatory', 'Doc. Name', 'Doc. Nature', 'Current Status'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {(MANDATORY_DOCS[selectedDecl] ?? MANDATORY_DOCS.default).map((doc, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.chargeType}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.mandatory}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.docName}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{doc.docNature}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#dc3545', fontWeight: 500 }}>Not Submitted</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Top cards */}
          <div className="flex gap-[16px] flex-wrap lg:flex-nowrap items-stretch">
            {/* Declaration list */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]" style={{ flex: '0 0 calc(66% - 8px)', minWidth: 260, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload Documents</p>
                <p className="text-[14px] text-[#697498]" style={{ lineHeight: 1.5 }}>Select a declaration and upload its supporting file. Supported: .pdf, .jpg, .png, .xlsx — max 50 MB each.</p>
              </div>
              <div className="grid gap-[2px]" style={{ gridTemplateColumns: rows.length > 5 ? '1fr 1fr' : '1fr' }}>
                {rows.map(row => {
                  const active = selectedDecl === row.declarationNo;
                  const count = countForDecl(row.declarationNo);
                  return (
                    <label key={row.declarationNo} className="flex items-center gap-[12px] px-[14px] py-[12px] rounded-[6px] cursor-pointer transition-colors"
                      style={{ background: active ? '#f0f5ff' : 'transparent', border: `1px solid ${active ? '#1360d2' : 'transparent'}` }}>
                      <span className="size-[18px] rounded-full flex-shrink-0 inline-flex items-center justify-center" style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
                        {active && <span className="size-[8px] rounded-full" style={{ background: '#1360d2' }} />}
                      </span>
                      <input type="radio" className="sr-only" name="rd-decl-select" value={row.declarationNo} checked={active} onChange={() => setSelectedDecl(row.declarationNo)} />
                      <span className="text-[15px] flex-1" style={{ color: active ? '#0e1b3d' : '#455174', fontWeight: active ? 500 : 400 }}>{row.declarationNo}</span>
                      {count > 0 && <span className="text-[12px] px-[8px] py-[2px] rounded-[10px]" style={{ background: 'rgba(26,172,114,0.12)', color: '#1aac72', fontWeight: 600 }}>{count}</span>}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Upload zone */}
            <div className="bg-white rounded-[8px] px-[24px] py-[22px] flex flex-col gap-[16px]" style={{ flex: '0 0 calc(28% - 8px)', minWidth: 220, boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Upload File</p>
                <p className="text-[13px] text-[#697498]">* Supported: .pdf, .jpg, .png, .xlsx — max 50 MB</p>
              </div>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
                className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors"
                style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#f8fafd', cursor: selectedDecl ? 'default' : 'not-allowed', opacity: selectedDecl ? 1 : 0.6 }}>
                <div className="size-[56px] rounded-full inline-flex items-center justify-center" style={{ background: dragging ? '#d8e8ff' : '#e2ebf9' }}>
                  <img src={CLOUD_UPLOAD_ICON} alt="" style={{ width: 26, height: 24 }} />
                </div>
                <p className="text-[14px] text-[#697498] text-center" style={{ lineHeight: 1.5 }}>Drag and drop or</p>
                <button type="button" disabled={!selectedDecl} onClick={() => selectedDecl && fileInputRef.current?.click()}
                  className="h-[40px] px-[20px] rounded-[4px] text-[15px] transition-colors"
                  style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontWeight: 500, background: '#fff', cursor: selectedDecl ? 'pointer' : 'not-allowed' }}>
                  Choose File
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,.xlsx" className="hidden"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
            </div>
          </div>

          {/* Uploaded docs table */}
          {uploadedDocs.length > 0 && (
            <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <div className="px-[20px] py-[14px]" style={{ borderBottom: '1px solid #eef1f6' }}>
                <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Documents Uploaded</p>
              </div>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      {['Declaration Number', 'Document Name', 'Uploaded On', 'Remarks', 'Action'].map(h => (
                        <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 15, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadedDocs.map(doc => (
                      <tr key={doc.id} style={{ borderBottom: '1px solid #f0f3fa' }}>
                        <td style={{ padding: '12px 16px' }}><span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{doc.declNo}</span></td>
                        <td style={{ padding: '12px 16px' }}>
                          <div className="flex items-center gap-[8px]">
                            <div className="size-[30px] rounded-[4px] flex-shrink-0 inline-flex items-center justify-center" style={{ background: '#e8f0ff' }}>
                              <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round"><path d="M5 2h7l3 3v12H5z" /><path d="M12 2v3h3" /></svg>
                            </div>
                            <div>
                              <p className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{doc.fileName}</p>
                              <p className="text-[12px] text-[#697498]">{fmtBytes(doc.fileSize)}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px' }}><span className="text-[14px] text-[#697498]">{doc.uploadedOn}</span></td>
                        <td style={{ padding: '12px 16px' }}><span className="text-[14px] text-[#0e1b3d]">{doc.remarks ?? '—'}</span></td>
                        <td style={{ padding: '12px 16px' }}>
                          <div className="flex items-center gap-[6px]">
                            <button type="button" title="Delete" onClick={() => removeDoc(doc.id)} className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors" style={{ color: '#dc3545' }}>
                              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Remarks — only shown when a declaration is selected */}
          {selectedDecl && (
            <div className="bg-white rounded-[8px] px-[24px] py-[20px] flex flex-col gap-[12px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Remarks <span className="text-[14px] text-[#697498]" style={{ fontWeight: 400 }}>(optional)</span></p>
              <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
                placeholder="Enter any remarks for this declaration…" rows={3}
                className="w-full rounded-[4px] text-[15px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[14px] py-[10px] resize-none focus:outline-none focus:border-[#1360d2] transition-colors"
                style={{ border: '1px solid #d5ddfb', fontFamily: "'Dubai', sans-serif", lineHeight: '22px' }} />
            </div>
          )}
        </div>
      </div>

      <BackToListingBar onBack={onBack} rightContent={
        <div className="flex items-center gap-[12px]"><SaveExitBtn onBackToListing={onBackToListing ?? onBack} /><button onClick={() => onContinue(remarks)}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
          style={{ background: '#1360d2', cursor: 'pointer', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
          Next
        </button></div>
      } />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * RDPaymentPage — Step 4: Payment Details (Refund of Deposits flow)
 * ───────────────────────────────────────────────────────────────────────────── */

const RD_SUB_CHARGES = [
  { key: 'reg', label: 'Registration Fee',                   amount: 80 },
  { key: 'ki',  label: 'Knowledge-Innovation Dirham Charge', amount: 20 },
];
const RD_TOTAL = RD_SUB_CHARGES.reduce((s, c) => s + c.amount, 0);
const RD_PAYMENT_MODES = ['Credit/Debit Account', 'E-Payment'];
const RD_PAYMENT_REFS  = ['Account Number', 'Reference No'];

function RDDirhamIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color} />
    </svg>
  );
}

function RDPlainSelect({ value, onChange, options, disabled }: { value: string; onChange: (v: string) => void; options: string[]; disabled?: boolean }) {
  const [open, setOpen] = useState(false);
  const f = "'Dubai', sans-serif";
  return (
    <div className="relative">
      <button type="button" onClick={() => !disabled && setOpen(o => !o)}
        className="w-full flex items-center px-[12px]"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: f, background: disabled ? '#f4f6fb' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <span className="flex-1 text-left text-[16px]" style={{ color: disabled ? '#b0b8cc' : value ? '#051937' : '#697498' }}>{value || 'Select'}</span>
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
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: f }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export type RDPaymentInfo = { charges: { key: string; mode: string; account: string }[]; remarks: string };

export function RDPaymentPage({
  onBack, onContinue, onBackToListing, steps, activeIndex = 3,
}: {
  onBack: () => void;
  onContinue: (info: RDPaymentInfo) => void;
  onBackToListing?: () => void;
  steps?: { id: string; label: string }[];
  activeIndex?: number;
}) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef,  setPaymentRef]  = useState('Account Number');
  const [remarks, setRemarks] = useState('');
  const f = "'Dubai', sans-serif";
  const rdIsEPayment = paymentMode === 'E-Payment';
  const handleRDPaymentMode = (v: string) => { setPaymentMode(v); if (v === 'E-Payment') setPaymentRef('Reference No'); else setPaymentRef('Account Number'); };

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: f }}>
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <h1 className="px-4 sm:px-10 text-[32px] text-[#111838] mb-[8px]" style={{ fontWeight: 500 }}>Raise New Claim - Refund of Deposits</h1>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? REFUND_DEPOSIT_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[24px]">
          {/* Payment card */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: f, fontWeight: 500 }}>Payment Details</h2>
            <div className="rounded-[8px]" style={{ border: '1px solid #c4d8f5' }}>
              {/* Header */}
              <div className="flex" style={{ background: '#a6c2e9', borderRadius: '8px 8px 0 0' }}>
                <div className="h-[44px] flex items-center pl-[20px]" style={{ flex: '0 0 50%' }}>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: f, fontWeight: 500 }}>Charges</span>
                </div>
                <div className="h-[44px] flex items-center pl-[8px] flex-1">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: f, fontWeight: 500 }}>Payment Mode</span>
                </div>
                <div className="h-[44px] flex items-center pl-[8px] flex-1">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: f, fontWeight: 500 }}>Payment Reference</span>
                </div>
              </div>
              {/* Other Charges row */}
              <div className="flex flex-col lg:flex-row gap-[20px] py-[20px] bg-white">
                <div className="flex flex-col gap-[10px] w-full lg:w-[calc(50%-10px)]">
                  <div className="flex items-center h-[49px] gap-[12px] px-[12px]" style={{ background: '#eff2f7' }}>
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: f, fontWeight: 600, width: 320 }}>Total Charges</span>
                    <span className="flex items-center gap-[4px] text-[20px] text-[#051937]" style={{ fontFamily: f, fontWeight: 700 }}>
                      <RDDirhamIcon size={16} color="#051937" />{RD_TOTAL}
                    </span>
                  </div>
                  {RD_SUB_CHARGES.map((c, i) => (
                    <div key={i} className="flex items-start gap-[12px] px-[12px]">
                      <span className="text-[16px] text-[#696f83]" style={{ fontFamily: f, fontWeight: 500, width: 320, whiteSpace: 'nowrap' }}>{c.label}</span>
                      <span className="flex items-center gap-[4px] text-[16px] text-[#051937]" style={{ fontFamily: f, fontWeight: 700 }}>
                        <RDDirhamIcon size={13} color="#051937" />{c.amount}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex-1">
                  <RDPlainSelect value={paymentMode} onChange={handleRDPaymentMode} options={RD_PAYMENT_MODES} />
                </div>
                <div className="flex-1">
                  <RDPlainSelect value={paymentRef} onChange={setPaymentRef} options={RD_PAYMENT_REFS} disabled={rdIsEPayment} />
                </div>
              </div>
            </div>
          </div>

          {/* Remarks */}
          <div className="bg-white rounded-[8px] px-[24px] py-[20px] flex flex-col gap-[12px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Remarks <span className="text-[14px] text-[#697498]" style={{ fontWeight: 400 }}>(optional)</span></p>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter payment remarks…" rows={3}
              className="w-full rounded-[4px] text-[15px] text-[#0e1b3d] placeholder:text-[#b0b8d0] px-[14px] py-[10px] resize-none focus:outline-none focus:border-[#1360d2] transition-colors"
              style={{ border: '1px solid #d5ddfb', fontFamily: f, lineHeight: '22px' }} />
          </div>
        </div>
      </div>

      <BackToListingBar onBack={onBack} rightContent={
        <div className="flex items-center gap-[12px]">
          <SaveExitBtn onBackToListing={onBackToListing ?? onBack} />
          <button onClick={() => onContinue({ charges: RD_SUB_CHARGES.map(c => ({ key: c.key, mode: paymentMode, account: paymentRef })), remarks })}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Next
          </button>
        </div>
      } />
    </div>
  );
}

function RDDropdown({ value, options, open, onToggle, onSelect, placeholder }: { value: string; options: string[]; open: boolean; onToggle: () => void; onSelect: (v: string) => void; placeholder: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (btnRef.current?.contains(e.target as Node)) return;
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) onToggle();
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const handleToggle = () => {
    if (btnRef.current) setRect(btnRef.current.getBoundingClientRect());
    onToggle();
  };

  return (
    <div style={{ minWidth: 180 }}>
      <button ref={btnRef} type="button" onClick={handleToggle}
        className="w-full flex items-center justify-between px-[12px] h-[44px] rounded-[4px] bg-white transition-colors"
        style={{ border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: "'Dubai', sans-serif" }}>
        <span className="text-[16px] flex-1 truncate text-left" style={{ color: value ? '#051937' : '#697498' }}>{value || placeholder}</span>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#455174" strokeWidth="2" style={{ flexShrink: 0, marginLeft: 6, transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && rect && ReactDOM.createPortal(
        <div ref={menuRef} className="bg-white rounded-[8px] overflow-hidden"
          style={{ position: 'fixed', top: rect.bottom + 4, left: rect.left, width: rect.width, zIndex: 2000, boxShadow: '0px 8px 24px rgba(0,0,0,0.14)', border: '1px solid #e0e6ef' }}>
          {options.map(opt => (
            <button key={opt} type="button" onMouseDown={e => { e.preventDefault(); onSelect(opt); }}
              className="group w-full flex items-center justify-between px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors">
              <span className={`text-[16px] group-hover:text-white ${opt === value ? 'text-[#1360d2]' : 'text-[#111838]'}`} style={{ fontFamily: "'Dubai', sans-serif", fontWeight: opt === value ? 500 : 400 }}>{opt}</span>
              {opt === value && <svg className="group-hover:stroke-white" viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.5"><path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * RDReviewPage — Step 5: Review & Submit (Refund of Deposits flow)
 * ───────────────────────────────────────────────────────────────────────────── */

export function RDReviewPage({
  chargeDetails, docRemarks, paymentInfo, onBack, onSubmit, onViewClaim,
}: {
  chargeDetails: ChargeDetail[];
  docRemarks: string;
  paymentInfo: RDPaymentInfo;
  onBack: () => void;
  onSubmit: () => void;
  onViewClaim?: () => void;
}) {
  const REFUND_LABEL: Record<string, string> = {
    full: 'Full Export', fullImport: 'Full Import', partial: 'Partial Export', partialImport: 'Partial Import', no: 'No Export',
    refund: 'Refund', noRefund: 'No Refund',
  };
  const [declared, setDeclared] = useState(false);
  const total = chargeDetails.reduce((s, d) => s + (parseFloat(d.claimAmount) || 0), 0);

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: "'Dubai', sans-serif" }}>
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
        <div className="px-4 sm:px-10 mb-[8px] flex items-center justify-between flex-wrap gap-[12px]">
          <div className="flex items-center gap-[16px] flex-wrap">
            <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim - Refund of Deposits</h1>
            <span className="text-[14px] px-[10px] py-[3px] rounded-[4px]" style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap' }}>Refund of Deposits</span>
          </div>
          <button data-secondary-btn
            onClick={() => onViewClaim?.()}
            className="h-[40px] px-[20px] rounded-[4px] border text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
          >
            View Claim
          </button>
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          {/* Charge details summary */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px] flex items-center justify-between" style={{ borderBottom: '1px solid #eef1f6' }}>
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Claim Summary</p>
              <span className="text-[14px] px-[10px] py-[3px] rounded-[4px]" style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}>Refund of Deposits</span>
            </div>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#a6c2e9' }}>
                    {['Declaration No.', 'Charge Type', 'Deposit Amount (AED)', 'Refund Type', 'Outbound Decl. No.', 'Claim Amount (AED)'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {chargeDetails.map(d => (
                    <tr key={d.declarationNo} style={{ borderBottom: '1px solid #f0f3fa' }}>
                      <td style={{ padding: '12px 16px', fontSize: 15, color: '#1360d2', fontWeight: 500 }}>{d.declarationNo}</td>
                      <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{d.chargeType}</td>
                      <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d', fontWeight: 500 }}>{d.depositAmount === 'N/A' ? '—' : d.depositAmount.replace(/^Dh\s*/, '')}</td>
                      <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{REFUND_LABEL[d.refundType] ?? '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{d.outboundDeclNo || '—'}</td>
                      <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d', fontWeight: 600 }}>{d.claimAmount ? parseFloat(d.claimAmount).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '—'}</td>
                    </tr>
                  ))}
                  <tr style={{ background: '#f4f7fc' }}>
                    <td colSpan={5} style={{ padding: '12px 16px', fontSize: 15, fontWeight: 600, color: '#455174' }}>Total Claim Amount</td>
                    <td style={{ padding: '12px 16px', fontSize: 16, fontWeight: 700, color: '#0e1b3d' }}>{total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment summary */}
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] py-[16px]" style={{ borderBottom: '1px solid #eef1f6' }}>
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Payment Details</p>
            </div>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#a6c2e9' }}>
                    {['Charge Description', 'Amount (AED)', 'Payment Mode', 'Account No.'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 14, fontWeight: 600, color: '#000', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paymentInfo.charges.map((pc, i) => {
                    const def = RD_SUB_CHARGES.find(c => c.key === pc.key);
                    return (
                      <tr key={pc.key} style={{ borderBottom: '1px solid #f0f3fa' }}>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d', fontWeight: 500 }}>{def?.label}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>AED {def?.amount}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{pc.mode}</td>
                        <td style={{ padding: '12px 16px', fontSize: 15, color: '#0e1b3d' }}>{pc.account || '—'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {paymentInfo.remarks && (
              <div className="px-[24px] py-[14px]" style={{ borderTop: '1px solid #eef1f6' }}>
                <p className="text-[14px] text-[#697498]">Remarks</p>
                <p className="text-[15px] text-[#0e1b3d] mt-[4px]">{paymentInfo.remarks}</p>
              </div>
            )}
          </div>

          {/* Declaration remarks */}
          {docRemarks && (
            <div className="bg-white rounded-[8px] px-[24px] py-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
              <p className="text-[14px] text-[#697498] mb-[4px]">Document Remarks</p>
              <p className="text-[15px] text-[#0e1b3d]">{docRemarks}</p>
            </div>
          )}

          {/* Declaration checkbox — required before submit */}
          <div className="bg-white rounded-[8px] px-[24px] py-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <label className="flex items-start gap-[16px] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={declared}
                onChange={e => setDeclared(e.target.checked)}
                className="size-[20px] rounded cursor-pointer flex-shrink-0 mt-[2px]"
                style={{ accentColor: '#1360d2' }}
              />
              <span className="text-[16px] text-[#0e1b3d]">
                I, hereby, declare that all the information entered and stated in the Request is true and correct and shall bear full responsibility for entering incorrect statement and all the consequences arising thereof.
              </span>
            </label>
          </div>

        </div>
      </div>

      <BackToListingBar onBack={onBack} rightContent={
        <button onClick={() => onSubmit()}
          className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white transition-colors hover:opacity-90"
          style={{ background: '#1360d2', fontWeight: 500, cursor: 'pointer',
            boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
          Submit Claim
        </button>
      } />
    </div>
  );
}
