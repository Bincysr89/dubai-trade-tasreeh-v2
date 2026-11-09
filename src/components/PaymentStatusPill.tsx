import React from 'react';

const font = "'Dubai', sans-serif";

/** The tints every payment status is shown in, listings and detail pages alike. */
export const PAY_STATUS: Record<string, { bg: string; color: string }> = {
  'Success':   { bg: '#e6f4ec',               color: '#1b6c3a' },
  'Initiated': { bg: '#e8f0ff',               color: '#1360d2' },
  'Unpaid':    { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Failed':    { bg: 'rgba(192,57,43,0.10)',  color: '#c0392b' },
};

/** The status pill the listings' Status column uses, wherever a status is shown. */
export default function StatusPill({ status }: { status: string }) {
  const st = PAY_STATUS[status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
  return (
    <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
      style={{ background: st.bg, color: st.color, fontFamily: font }}>{status}</span>
  );
}
