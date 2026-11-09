import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';
import SaveExitModal from './SaveExitModal';
import ClaimStepper, { REFUND_AUCTION_STEPS } from './ClaimStepper';
import Dh from './Dh';
import type { AuctionLotRow } from './AuctionLotDetailsPage';

const font = "'Dubai', 'Segoe UI', sans-serif";

/* Grid column template — mirrors RDChargeFlowPage's DeclRow (COLS/TBL_MIN) so the Claim Details
   step reads as the same table design used across the rest of the Refund & Claims module. */
const COLS = '56px 140px 150px minmax(220px,1.4fr) 200px 220px 72px';
const TBL_MIN = 1180;

export type TransportEntry = { id: string; value: string };
export type ContainerEntry = { id: string; value: string };

export type AuctionClaimDetail = {
  auctionLotNo: string;
  claimAmount: string;
  remarks: string;
  transportDocs: TransportEntry[];
  containerNos: ContainerEntry[];
};

type Props = {
  rows: AuctionLotRow[];
  onBack: () => void;
  onBackToListing: () => void;
  onProceed: (details: AuctionClaimDetail[]) => void;
  initialDetails?: AuctionClaimDetail[];
  /** Overrides for reuse outside the new-claim flow (e.g. amend). */
  title?: string;
  steps?: { id: string; label: string }[];
  activeIndex?: number;
  hideSaveExit?: boolean;
};

function makeEmpty(rows: AuctionLotRow[]): AuctionClaimDetail[] {
  return rows.map(r => ({ auctionLotNo: r.auctionLotNo, claimAmount: '', remarks: '', transportDocs: [], containerNos: [] }));
}

/* Floating-label input — same visual convention as RDChargeFlowPage's FInput (CDM Additional
   Reference Details), with an optional leading Dirham glyph for amount fields. */
function FInput({ label, value, onChange, req, dhPrefix, placeholder = '', onKeyDown }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; dhPrefix?: boolean; placeholder?: string; onKeyDown?: (e: React.KeyboardEvent) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      {dhPrefix && <Dh style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#0e1b3d', pointerEvents: 'none', zIndex: 1 }} />}
      <input
        type={dhPrefix ? 'number' : 'text'}
        min={dhPrefix ? 0 : undefined}
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        placeholder={floated ? placeholder : ''}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 48, border: `1px solid ${focused ? '#1360d2' : (req && !value.trim() ? '#dc3545' : '#d5ddfb')}`, padding: dhPrefix ? '0 12px 0 28px' : '0 12px', fontFamily: font, color: '#0e1b3d', outline: 'none', background: '#fff', transition: 'border-color 120ms' }}
      />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : (dhPrefix ? 28 : 12), top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: floated ? (focused ? '#1360d2' : '#0e1b3d') : '#697498',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

export default function AuctionClaimDetailsPage({ rows, onBack, onBackToListing, onProceed, initialDetails, title, steps, activeIndex = 1, hideSaveExit = false }: Props) {
  const [details, setDetails] = useState<AuctionClaimDetail[]>(() => initialDetails ?? makeEmpty(rows));
  const [openLot, setOpenLot] = useState<string | null>(rows[0]?.auctionLotNo ?? null);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const patch = (lotNo: string, patch: Partial<AuctionClaimDetail>) =>
    setDetails(prev => prev.map(d => d.auctionLotNo === lotNo ? { ...d, ...patch } : d));

  const addTransport = (lotNo: string, value: string) =>
    setDetails(prev => prev.map(d => d.auctionLotNo === lotNo ? { ...d, transportDocs: [...d.transportDocs, { id: `${lotNo}-t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, value }] } : d));
  const removeTransport = (lotNo: string, id: string) =>
    setDetails(prev => prev.map(d => d.auctionLotNo === lotNo ? { ...d, transportDocs: d.transportDocs.filter(e => e.id !== id) } : d));
  const addContainer = (lotNo: string, value: string) =>
    setDetails(prev => prev.map(d => d.auctionLotNo === lotNo ? { ...d, containerNos: [...d.containerNos, { id: `${lotNo}-c-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, value }] } : d));
  const removeContainer = (lotNo: string, id: string) =>
    setDetails(prev => prev.map(d => d.auctionLotNo === lotNo ? { ...d, containerNos: d.containerNos.filter(e => e.id !== id) } : d));

  const canProceed = details.every(d => d.claimAmount.trim().length > 0);

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
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 flex items-center gap-[16px] flex-wrap mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>{title ?? 'Raise New Claim - Refund on Auction Proceed'}</h1>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={activeIndex} steps={steps ?? REFUND_AUCTION_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[16px]">
          <p className="text-[16px] text-[#697498]">Enter the claim amount and remarks for each selected auction lot, and add transport &amp; container details where applicable.</p>

          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: TBL_MIN, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Table header card */}
              <div style={{ display: 'grid', gridTemplateColumns: COLS, background: '#a7c2e9', borderRadius: 8, padding: '10px 16px', gap: 0 }}>
                {['#', 'Auction No.', 'Auction Lot No.', 'Description', 'Claim Amount (AED)', 'Remarks', 'Action'].map(h => (
                  <div key={h} className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap', paddingRight: 8, fontFamily: font }}>{h}</div>
                ))}
              </div>

              {rows.map((row, idx) => {
                const d = details.find(x => x.auctionLotNo === row.auctionLotNo)!;
                const open = openLot === row.auctionLotNo;
                return (
                  <AuctionLotCard
                    key={row.auctionLotNo}
                    idx={idx}
                    row={row}
                    detail={d}
                    open={open}
                    onToggle={() => setOpenLot(prev => prev === row.auctionLotNo ? null : row.auctionLotNo)}
                    onPatch={(p) => patch(row.auctionLotNo, p)}
                    onAddTransport={(v) => addTransport(row.auctionLotNo, v)}
                    onRemoveTransport={(id) => removeTransport(row.auctionLotNo, id)}
                    onAddContainer={(v) => addContainer(row.auctionLotNo, v)}
                    onRemoveContainer={(id) => removeContainer(row.auctionLotNo, id)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing}
        rightContent={
          <div className="flex items-center gap-[12px]">
            {!hideSaveExit && (
              <button data-secondary-btn onClick={() => setShowSaveModal(true)}
                className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                Save &amp; Exit
              </button>
            )}
            <button
              onClick={() => canProceed && onProceed(details)}
              disabled={!canProceed}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Proceed
            </button>
          </div>
        }
      />
      {showSaveModal && <SaveExitModal onCancel={() => setShowSaveModal(false)} onBackToListing={onBackToListing} />}
    </div>
  );
}

function AuctionLotCard({ idx, row, detail, open, onToggle, onPatch, onAddTransport, onRemoveTransport, onAddContainer, onRemoveContainer }: {
  idx: number; row: AuctionLotRow; detail: AuctionClaimDetail; open: boolean; onToggle: () => void;
  onPatch: (p: Partial<AuctionClaimDetail>) => void;
  onAddTransport: (value: string) => void;
  onRemoveTransport: (id: string) => void;
  onAddContainer: (value: string) => void;
  onRemoveContainer: (id: string) => void;
}) {
  const [draftTransport, setDraftTransport] = useState('');
  const [draftContainer, setDraftContainer] = useState('');

  const handleAddTransport = () => { if (draftTransport.trim()) { onAddTransport(draftTransport.trim()); setDraftTransport(''); } };
  const handleAddContainer = () => { if (draftContainer.trim()) { onAddContainer(draftContainer.trim()); setDraftContainer(''); } };

  return (
    <div className="bg-white rounded-[8px] transition-colors"
      style={{ boxShadow: open ? '0px 5px 32px rgba(19,96,210,0.18)' : '0px 5px 32px rgba(143,155,186,0.16)', border: `1.5px solid ${open ? '#1360d2' : 'transparent'}`, minWidth: 0 }}>
      {/* Main data row */}
      <div style={{ display: 'grid', gridTemplateColumns: COLS, minWidth: TBL_MIN, padding: '14px 16px', alignItems: 'center', gap: 0 }}>
        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{idx + 1}</span>
        </div>
        <div style={{ paddingRight: 8 }}>
          <p className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.auctionNo}</p>
        </div>
        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', display: 'block', textOverflow: 'ellipsis' }}>{row.auctionLotNo}</span>
        </div>
        <div style={{ paddingRight: 8 }}>
          <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.description}</span>
        </div>
        <div style={{ paddingRight: 8 }}>
          <FInput label="Claim Amount" req dhPrefix value={detail.claimAmount} onChange={v => onPatch({ claimAmount: v })} placeholder="Enter amount" />
        </div>
        <div style={{ paddingRight: 8 }}>
          <FInput label="Remarks" value={detail.remarks} onChange={v => onPatch({ remarks: v })} placeholder="Enter remarks" />
        </div>
        <div className="flex items-center justify-center">
          <button type="button" onClick={onToggle} aria-label={open ? 'Collapse transport & container details' : 'Expand transport & container details'}
            className="size-[36px] rounded-full inline-flex items-center justify-center transition-colors"
            style={{ background: '#fff', border: '1px solid #e0e6ef', color: '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Transport & Container Details toggle bar */}
      <div style={{ borderTop: '1px solid #eef1f6' }}>
        <button type="button" onClick={onToggle}
          className={`w-full flex items-center gap-[10px] px-[20px] py-[12px] text-left transition-colors ${open ? '' : 'hover:bg-[#f8fafd]'}`}
          style={{ border: 'none', background: open ? '#e2ebf9' : 'transparent', cursor: 'pointer', fontFamily: font, minWidth: TBL_MIN }}>
          <svg viewBox="0 0 14 14" width="13" height="13" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round"
            style={{ transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
            <path d="M5 3l4 4-4 4" />
          </svg>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Transport &amp; Container Details</span>
          <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: open ? '#fff' : '#e2ebf9', color: '#1360d2', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: font }}>
            {detail.transportDocs.length + detail.containerNos.length} entr{detail.transportDocs.length + detail.containerNos.length !== 1 ? 'ies' : 'y'}
          </span>
          <span className="text-[14px] text-[#697498] ml-auto" style={{ fontFamily: font, flexShrink: 0 }}>{open ? 'Collapse' : 'Expand'}</span>
        </button>
      </div>

      {open && (
        <div className="px-[20px] pb-[20px] pt-[16px]" style={{ borderTop: '1px solid #f5f7fc', minWidth: TBL_MIN }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px]">
            {/* Left — Transport Doc. No. Details */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Transport Doc. No. Details</p>
              <div className="flex items-end gap-[10px]">
                <div className="flex-1">
                  <FInput label="Transport Doc. No." value={draftTransport} onChange={setDraftTransport} placeholder="Enter transport document number"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddTransport(); }} />
                </div>
                <button type="button" onClick={handleAddTransport} disabled={!draftTransport.trim()}
                  className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  + Add
                </button>
              </div>
              {detail.transportDocs.length > 0 ? (
                <div className="overflow-hidden rounded-[8px]" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: font }}>
                    <thead>
                      <tr>
                        {['Transport Doc. No.', 'Action'].map(h => (
                          <th key={h} className="text-left text-[16px]" style={{ background: '#e2ebf9', color: '#0e1b3d', fontWeight: 500, padding: '10px 16px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.transportDocs.map(e => (
                        <tr key={e.id} style={{ borderTop: '1px solid #eef1f6' }}>
                          <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '10px 16px' }}>{e.value}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <button type="button" onClick={() => onRemoveTransport(e.id)} aria-label="Remove"
                              className="inline-flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#fdecec] transition-colors">
                              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[15px] text-[#b0b8d0]">No transport document entries added yet.</p>
              )}
            </div>

            {/* Right — Container No. Details */}
            <div className="flex flex-col gap-[12px]">
              <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Container No. Details</p>
              <div className="flex items-end gap-[10px]">
                <div className="flex-1">
                  <FInput label="Container No." value={draftContainer} onChange={setDraftContainer} placeholder="Enter container number"
                    onKeyDown={e => { if (e.key === 'Enter') handleAddContainer(); }} />
                </div>
                <button type="button" onClick={handleAddContainer} disabled={!draftContainer.trim()}
                  className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                  + Add
                </button>
              </div>
              {detail.containerNos.length > 0 ? (
                <div className="overflow-hidden rounded-[8px]" style={{ border: '1px solid #eef1f6' }}>
                  <table className="w-full" style={{ borderCollapse: 'collapse', fontFamily: font }}>
                    <thead>
                      <tr>
                        {['Container No.', 'Action'].map(h => (
                          <th key={h} className="text-left text-[16px]" style={{ background: '#e2ebf9', color: '#0e1b3d', fontWeight: 500, padding: '10px 16px' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {detail.containerNos.map(e => (
                        <tr key={e.id} style={{ borderTop: '1px solid #eef1f6' }}>
                          <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '10px 16px' }}>{e.value}</td>
                          <td style={{ padding: '10px 16px' }}>
                            <button type="button" onClick={() => onRemoveContainer(e.id)} aria-label="Remove"
                              className="inline-flex items-center justify-center size-[32px] rounded-[4px] hover:bg-[#fdecec] transition-colors">
                              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#dc3545" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-[15px] text-[#b0b8d0]">No container entries added yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
