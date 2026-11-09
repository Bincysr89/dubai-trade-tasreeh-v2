import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';

type Props = { onBack: () => void; requestNumber?: string };

type Row = {
  actionDate: string;
  actionType: string;
  actionReason: string;
};

type VccGroup = {
  vccNo: string;
  vccCreatedDate: string;
  rows: Row[];
};

const GROUPS: VccGroup[] = [
  {
    vccNo: '8026932',
    vccCreatedDate: '04-May-2026',
    rows: [
      { actionDate: '04-May-2026 10:42', actionType: 'Printed/Downloaded', actionReason: '' },
      { actionDate: '04-May-2026 09:18', actionType: 'Generated',          actionReason: 'VCC Generated' },
      { actionDate: '03-May-2026 16:50', actionType: 'Submitted',          actionReason: 'Customer submitted request' },
    ],
  },
  {
    vccNo: '8026931',
    vccCreatedDate: '03-May-2026',
    rows: [
      { actionDate: '03-May-2026 14:11', actionType: 'Generated',          actionReason: 'VCC Generated' },
      { actionDate: '03-May-2026 11:02', actionType: 'Submitted',          actionReason: 'Customer submitted request' },
    ],
  },
  {
    vccNo: '8026940',
    vccCreatedDate: '01-May-2026',
    rows: [
      { actionDate: '01-May-2026 17:30', actionType: 'Printed/Downloaded', actionReason: '' },
      { actionDate: '01-May-2026 09:05', actionType: 'Generated',          actionReason: 'VCC Generated' },
    ],
  },
];

const EVENT_STYLE: Record<string, { bg: string; color: string }> = {
  'Generated':           { bg: 'rgba(40,167,69,0.10)', color: '#28a745' },
  'Printed/Downloaded':  { bg: 'rgba(19,96,210,0.10)', color: '#1360d2' },
  'Submitted':           { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

function HistoryTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="dt-table" style={{ fontFamily: "'Dubai', sans-serif" }}>
        <thead>
          <tr>
            <th className="text-[16px]" style={{ width: 220 }}>Action Date</th>
            <th className="text-[16px]" style={{ width: 240 }}>Action Type</th>
            <th className="text-[16px]">Action Reason</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const ev = EVENT_STYLE[row.actionType] || { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
            return (
              <tr key={i}>
                <td className="text-[16px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{row.actionDate}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <span
                    className="text-[16px] inline-flex items-center justify-center whitespace-nowrap"
                    style={{ background: ev.bg, color: ev.color, padding: '4px 12px', borderRadius: 4, fontWeight: 500, lineHeight: '20px' }}
                  >
                    {row.actionType}
                  </span>
                </td>
                <td>
                  {row.actionReason
                    ? <span className="text-[16px] text-[#0e1b3d]">{row.actionReason}</span>
                    : <span className="text-[16px] text-[#8f94ae]">—</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function VccAuditHistoryPage({ onBack, requestNumber = '25365' }: Props) {
  // Default: open the first group only.
  // Default: open the first VCC's history.
  const [openSet, setOpenSet] = useState<Set<string>>(new Set([GROUPS[0]?.vccNo].filter(Boolean) as string[]));

  const toggle = (vccNo: string) => {
    setOpenSet((s) => {
      const next = new Set(s);
      if (next.has(vccNo)) next.delete(vccNo); else next.add(vccNo);
      return next;
    });
  };
  const expandAll = () => setOpenSet(new Set(GROUPS.map((g) => g.vccNo)));
  const collapseAll = () => setOpenSet(new Set());

  const allOpen = openSet.size === GROUPS.length;
  const allClosed = openSet.size === 0;

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Sticky breadcrumb / agent banner */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Home</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: "'Dubai', sans-serif" }}>Integrated Clearance</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: "'Dubai', sans-serif" }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>Audit History</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ fontFamily: "'Dubai', sans-serif" }}>
        <div className="px-4 sm:px-10 flex items-end justify-between flex-wrap gap-[12px] mb-[8px]">
          <div>
            <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 700 }}>Audit History</h1>
            <p className="text-[16px] text-[#455174]">Activity log for Request #{requestNumber}</p>
          </div>
          <div className="flex items-center gap-[8px]">
            <button data-secondary-btn
              onClick={expandAll}
              disabled={allOpen}
              className="h-[36px] px-[14px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-[6px]"
              style={{ fontWeight: 500 }}
            >
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8l4-4 4 4" />
                <path d="M6 12l4 4 4-4" />
              </svg>
              Expand All
            </button>
            <button data-secondary-btn
              onClick={collapseAll}
              disabled={allClosed}
              className="h-[36px] px-[14px] rounded-[4px] border border-[#1360d2] bg-white text-[16px] text-[#1360d2] transition-colors disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-[6px]"
              style={{ fontWeight: 500 }}
            >
              <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 12l4-4 4 4" />
                <path d="M6 4l4 4 4-4" />
              </svg>
              Collapse All
            </button>
          </div>
        </div>

        <div className="px-4 sm:px-10 py-[24px] flex flex-col gap-[12px]">
          {GROUPS.map((g) => {
            const open = openSet.has(g.vccNo);
            return (
              <div
                key={g.vccNo}
                className="bg-white rounded-[8px] overflow-hidden border border-[#d5ddfb]"
                style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
              >
                <button
                  onClick={() => toggle(g.vccNo)}
                  className="w-full flex items-center justify-between px-[20px] py-[14px] hover:bg-[#f4f7fc] transition-colors text-left"
                  aria-expanded={open}
                >
                  <div className="flex items-center gap-[14px] flex-wrap">
                    <svg
                      viewBox="0 0 20 20"
                      width="18"
                      height="18"
                      fill="none"
                      stroke="#1360d2"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform"
                      style={{ transform: open ? 'rotate(90deg)' : 'rotate(0deg)' }}
                    >
                      <path d="M7 5l6 5-6 5" />
                    </svg>
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>VCC #{g.vccNo}</span>
                    <span className="text-[16px] text-[#697498]">Created {g.vccCreatedDate}</span>
                    <span
                      className="text-[12px] inline-flex items-center px-[10px] py-[3px] rounded-[12px]"
                      style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}
                    >
                      {g.rows.length} {g.rows.length === 1 ? 'event' : 'events'}
                    </span>
                  </div>
                  <span className="text-[16px] text-[#1360d2]" style={{ fontWeight: 500 }}>
                    {open ? 'Hide' : 'Show'} history
                  </span>
                </button>
                {open && (
                  <div className="px-[16px] pb-[12px] pt-[4px] bg-[#f8fafd]">
                    <HistoryTable rows={g.rows} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BackToListingBar onBack={onBack} />
    </div>
  );
}
