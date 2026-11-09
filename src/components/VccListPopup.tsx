import React from 'react';
import type { VccRow } from './VccTable';

type VccDetailRow = {
  vccNo: string;
  chassis: string;
  engine: string;
  brand: string;
  make: string;
  year: string;
  vccDate: string;
  status: 'Generated' | 'Printed/Downloaded';
};

const STATUS_STYLE: Record<VccDetailRow['status'], { bg: string; color: string }> = {
  'Generated':            { bg: 'rgba(19,96,210,0.10)', color: '#1360d2' },
  'Printed/Downloaded':   { bg: 'rgba(40,167,69,0.10)', color: '#28a745' },
};

function buildRows(count: number): VccDetailRow[] {
  const out: VccDetailRow[] = [];
  for (let i = 0; i < count; i++) {
    out.push({
      vccNo: `VCC-${String(1001 + i).padStart(6, '0')}`,
      chassis: `CH-${String(20240000 + i)}`,
      engine: `EN-${String(880000 + i)}`,
      brand: i % 2 === 0 ? 'Toyota' : 'Nissan',
      make: i % 2 === 0 ? 'Land Cruiser' : 'Patrol',
      year: '2024',
      vccDate: '12-Apr-25',
      status: i % 2 === 0 ? 'Generated' : 'Printed/Downloaded',
    });
  }
  return out;
}

type Props = { row: VccRow; onClose: () => void };

export default function VccListPopup({ row, onClose }: Props) {
  const rows = buildRows(row.vccCount);
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-w-[1100px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: "'Dubai', sans-serif" }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px]">
          <div>
            <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>VCC Details</p>
            <p className="text-[12px] text-[#a7c3eb]">Request {row.reqNo} · Declaration {row.declNo} · {rows.length} VCC{rows.length === 1 ? '' : 's'}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="border border-[#eef1f6] rounded-[8px] overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 980 }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {['VCC No.', 'Chassis No.', 'Engine No.', 'Brand', 'Make', 'Year', 'VCC Date', 'Status', 'Action'].map((h) => (
                    <th key={h} className="text-left text-[16px] text-[#000]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap', textAlign: h === 'Action' ? 'center' : 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const st = STATUS_STYLE[r.status];
                  return (
                    <tr key={r.vccNo} style={{ borderTop: '1px solid #eef1f6' }}>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', fontWeight: 500, whiteSpace: 'nowrap' }}>{r.vccNo}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{r.chassis}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{r.engine}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{r.brand}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{r.make}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{r.year}</td>
                      <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{r.vccDate}</td>
                      <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                        <span className="text-[16px] font-medium inline-flex items-center" style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: 4 }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center' }}>
                        <button
                          type="button"
                          title="Download VCC Certificate"
                          onClick={() => console.log('Download VCC', r.vccNo)}
                          className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#e2ebf9] transition-colors text-[#1360d2]"
                        >
                          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end px-[24px] py-[16px]" style={{ borderTop: '1px solid #e2ebf9' }}>
          <button data-secondary-btn
            onClick={onClose}
            className="h-[44px] px-[22px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
            style={{ fontWeight: 500, fontSize: 14 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
