import React, { useEffect, useRef, useState } from 'react';
import { ColumnFilter } from './ColumnFilter';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

type HistoryStatus = 'Submitted' | 'Completed' | 'Suspended' | 'Under Processing';

const STATUS_STYLE: Record<HistoryStatus, { bg: string; color: string }> = {
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Completed':        { bg: 'rgba(40,167,69,0.08)',   color: '#28a745' },
  'Suspended':        { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
};

type HistoryRow = {
  requestDate: string;
  requestNo: string;
  requestType: string;
  claimType: string;
  claimantCode: string;
  claimantName: string;
  remarks: string;
  statusDate: string;
  status: HistoryStatus;
};

const ROWS: HistoryRow[] = [
  { requestDate: '29/06/2026, 09:30', requestNo: '2588017', requestType: 'New',   claimType: 'Non Remittance',     claimantCode: 'AE-9106286', claimantName: 'SW Logistics LLC',                     remarks: '—',                           statusDate: '29/06/2026, 10:00', status: 'Submitted'        },
  { requestDate: '12/04/2024, 08:15', requestNo: '4701751', requestType: 'New',   claimType: 'Refund of Deposits', claimantCode: 'AE-1019056', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', remarks: '1 sub claim Settled / Approved', statusDate: '12/04/2024, 09:30', status: 'Under Processing' },
  { requestDate: '12/01/2024, 11:45', requestNo: '4701740', requestType: 'Amend', claimType: 'Refund of Deposits', claimantCode: 'AE-1019056', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', remarks: '1 sub claim Settled / Approved', statusDate: '15/01/2024, 14:00', status: 'Completed'        },
  { requestDate: '12/02/2024, 14:20', requestNo: '4701770', requestType: 'New',   claimType: 'Refund of Deposits', claimantCode: 'AE-1019056', claimantName: 'CONSOLIDATED SHIPPING SERVICES L.L.C', remarks: '1 sub claim Settled / Approved', statusDate: '14/02/2024, 09:00', status: 'Suspended'        },
];

const HEADERS: { label: string; w: number }[] = [
  { label: 'Request Date',         w: 170 },
  { label: 'Request No.',          w: 130 },
  { label: 'Request Type',         w: 120 },
  { label: 'Claimant Code & Name', w: 300 },
  { label: 'Remarks',              w: 220 },
  { label: 'Status Date',          w: 170 },
];

type Props = { onBack: () => void };

export default function ClaimsAuditHistoryPage({ onBack }: Props) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Audit History</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        <h1 className="text-[32px] text-[#0e1b3d] mb-[16px]" style={{ fontWeight: 500 }}>Audit History</h1>

        <div style={{ position: 'relative' }}>
          <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={160} />
          <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
          <table style={{ minWidth: 1300, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
            <thead>
              <tr>
                {HEADERS.map((col, idx) => (
                  <th
                    key={col.label}
                    style={{
                      width: col.w,
                      minWidth: col.w,
                      background: '#a6c2e9',
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: 500,
                      borderRadius: idx === 0 ? '8px 0 0 0' : undefined,
                      paddingLeft: idx === 0 ? 16 : 12,
                    }}
                  >
                    <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                  </th>
                ))}
                {/* Sticky: Status */}
                <th style={{ position: 'sticky', right: 0, width: 160, minWidth: 160, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8 }}>
                  <ColumnFilter label="Status" labelClass="text-[16px] font-medium text-[#051937]" />
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const st = STATUS_STYLE[row.status];
                const cell = (content: React.ReactNode, w: number, extra?: React.CSSProperties) => (
                  <td style={{ background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f8f8f8', ...extra }}>{content}</td>
                );
                const txt = (v: string) => (
                  <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
                );
                return (
                  <tr key={i}>
                    {cell(txt(row.requestDate), 170, { paddingLeft: 16 })}
                    {cell(txt(row.requestNo),   130)}
                    {cell(txt(row.requestType), 120)}
                    {cell(
                      <div className="flex flex-col" style={{ lineHeight: 1.3 }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{row.claimantCode}</span>
                        <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>{row.claimantName}</span>
                      </div>,
                      300,
                    )}
                    {cell(<span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3, fontFamily: font }}>{row.remarks}</span>, 220)}
                    {cell(txt(row.statusDate), 170)}
                    {/* Sticky: Status */}
                    <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 160, borderBottom: '1px solid #f8f8f8', zIndex: 1 }}>
                      <span
                        className="text-[16px] whitespace-nowrap inline-flex items-center justify-center"
                        style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontWeight: 500, fontFamily: font }}
                      >
                        {row.status}
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

      {/* Bottom bar */}
      <div className="bg-white flex-shrink-0 px-4 sm:px-10 py-[20px]" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBack}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] border transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back
        </button>
      </div>
    </div>
  );
}
