import React, { useState } from 'react';
import { ColumnFilter } from './ColumnFilter';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

export type RejectedSubClaimRow = {
  declNo: string;
  declDate: string;
  declType: string;
  chargeType: string;
  depositMethod: string;
  accountNumber: string;
  ownerCode: string;
  exportExpiry: string;
  claimExpiry: string;
  subClaimStatus: 'Rejected' | 'Completed';
};

type Props = {
  requestNo: string;
  claimType: string;
  declarations: RejectedSubClaimRow[];
  onBack: () => void;
  onContinue: (selectedDeclNos: string[]) => void;
};

const SUB_CLAIM_STATUS_STYLE: Record<RejectedSubClaimRow['subClaimStatus'], { bg: string; color: string }> = {
  Rejected:  { bg: 'rgba(220,53,69,0.10)', color: '#dc3545' },
  Completed: { bg: 'rgba(40,167,69,0.10)', color: '#28a745' },
};

// Same column set as the RD Eligible Declarations table (Declaration Number through Claim
// Expiry). Sub Claim Status is rendered separately as a sticky trailing column (see STICKY_W
// below) so it stays visible while the rest of the row scrolls — matching the master listing
// table convention used elsewhere for sticky Status/Action columns.
const HEADERS: { label: string; w: number }[] = [
  { label: '',                          w: 44  },
  { label: '#',                         w: 44  },
  { label: 'Declaration Number',        w: 170 },
  { label: 'Declaration Clearance Date',w: 180 },
  { label: 'Declaration Type',          w: 190 },
  { label: 'Charge Type',               w: 200 },
  { label: 'Deposit Method',            w: 160 },
  { label: 'Account Number',            w: 150 },
  { label: 'Owner Code',                w: 220 },
  { label: 'Export Expiry',             w: 130 },
  { label: 'Claim Expiry',              w: 130 },
];

const STICKY_W = 160;

/** Multi-declaration selection list shown when the user picks "Create New Claim Request from
    rejected sub claim" off a claim's Action menu — styled after SuspensionResponseListPage, but
    with the same column set as the Eligible Declarations table plus a per-row Sub Claim Status
    and a checkbox so the user can select one or both Rejected records (Completed rows are
    informational only, not selectable) before continuing into a new claim request. */
export default function CreateClaimFromRejectedListPage({ requestNo, claimType, declarations, onBack, onContinue }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();

  const toggle = (declNo: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(declNo)) next.delete(declNo);
      else next.add(declNo);
      return next;
    });
  };

  const rejectedCount = declarations.filter((d) => d.subClaimStatus === 'Rejected').length;

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      <div className="flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Refund &amp; Claims</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Create New Claim Request</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <div className="flex items-center gap-[16px] mb-[8px]">
          <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font }}>
            Create New Claim Request — {claimType} — {requestNo}
          </h1>
        </div>
        <p className="text-[16px] text-[#697498] mb-[20px]" style={{ fontFamily: font }}>
          {rejectedCount} sub claim{rejectedCount !== 1 ? 's' : ''} under this request {rejectedCount !== 1 ? 'were' : 'was'} rejected. Select one or both rejected sub claims to continue creating a new claim request.
        </p>

        <div className="bg-white rounded-[8px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)', position: 'relative' }}>
          <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={STICKY_W} />
          <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto px-[16px] py-[16px]">
            <table style={{ width: '100%', minWidth: 1600, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
              <thead>
                <tr>
                  {HEADERS.map((h, i) => (
                    <th key={h.label || `col-${i}`} style={{ width: h.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', borderTopLeftRadius: i === 0 ? 8 : 0, borderBottomLeftRadius: i === 0 ? 8 : 0 }}>
                      {h.label === '' ? null : h.label === '#' ? <span className="text-[16px] font-medium text-[#051937]">#</span> : <ColumnFilter label={h.label} labelClass="text-[16px] font-medium text-[#051937]" />}
                    </th>
                  ))}
                  <th style={{ position: 'sticky', right: 0, width: STICKY_W, minWidth: STICKY_W, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', borderTopRightRadius: 8, borderBottomRightRadius: 8, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                    <ColumnFilter label="Sub Claim Status" labelClass="text-[16px] font-medium text-[#051937]" />
                  </th>
                </tr>
              </thead>
              <tbody>
                {declarations.map((d, i) => {
                  const selectable = d.subClaimStatus === 'Rejected';
                  const st = SUB_CLAIM_STATUS_STYLE[d.subClaimStatus];
                  return (
                    <tr key={d.declNo}>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                        <input
                          type="checkbox"
                          checked={selected.has(d.declNo)}
                          disabled={!selectable}
                          onChange={() => toggle(d.declNo)}
                          aria-label={`Select ${d.declNo}`}
                          className="size-[18px] accent-[#1360d2] disabled:opacity-30"
                        />
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{i + 1}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{d.declNo}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{d.declDate}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d.declType}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d.chargeType}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d.depositMethod}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{d.accountNumber}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{d.ownerCode}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{d.exportExpiry}</span>
                      </td>
                      <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle' }}>
                        <span className="text-[16px] whitespace-nowrap" style={{ fontFamily: font, color: '#dc3545' }}>{d.claimExpiry}</span>
                      </td>
                      <td style={{ position: 'sticky', right: 0, background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', borderTopRightRadius: 8, borderBottomRightRadius: 8, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1 }}>
                        <span className="text-[16px] whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, fontWeight: 500, fontFamily: font }}>
                          {d.subClaimStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center justify-between px-[40px]">
          <button
            onClick={onBack}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
          <button
            onClick={() => onContinue(Array.from(selected))}
            disabled={selected.size === 0}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
