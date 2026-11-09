import React, { useEffect } from 'react';

type Row = {
  actionDate: string;
  actionType: string;
  actionReason: string;
};

const EVENT_STYLE: Record<string, { bg: string; color: string }> = {
  'Generated':           { bg: 'rgba(40,167,69,0.10)', color: '#28a745' },
  'Printed/Downloaded':  { bg: 'rgba(19,96,210,0.10)', color: '#1360d2' },
  'Submitted':           { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

const SAMPLE_ROWS: Row[] = [
  { actionDate: '04-May-2026 10:42', actionType: 'Printed/Downloaded', actionReason: '' },
  { actionDate: '04-May-2026 09:18', actionType: 'Generated',          actionReason: 'VCC Generated' },
  { actionDate: '03-May-2026 16:50', actionType: 'Submitted',          actionReason: 'Customer submitted request' },
];

type Props = {
  open: boolean;
  vccNo?: string;
  rows?: Row[];
  onClose: () => void;
};

export default function VccAuditHistoryModal({ open, vccNo, rows = SAMPLE_ROWS, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-w-[900px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: "'Dubai', sans-serif" }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px]">
          <div>
            <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>Audit History</p>
            <p className="text-[12px] text-[#a7c3eb]">VCC #{vccNo}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-auto px-[24px] py-[20px]">
          <div className="overflow-x-auto">
            <table className="dt-table">
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
