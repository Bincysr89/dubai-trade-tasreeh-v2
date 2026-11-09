import React from 'react';

const font = "'Dubai', 'Segoe UI', sans-serif";

export type ClaimVersionRow = {
  version: string;
  submittedDate: string;
  submittedBy: string;
  status: string;
  /** The version the page is showing — one row at most. */
  isCurrentlyViewing?: boolean;
};

const DEFAULT_ROWS: ClaimVersionRow[] = [
  { version: 'Version 1', submittedDate: '29/06/2026, 10:14', submittedBy: 'crnuser01', status: 'Under Processing', isCurrentlyViewing: true },
];

/**
 * Claim Request Versions — every submission of the claim and where each one stands.
 * Shared by the View Claim pages so all three claim types read identically.
 */
export default function ClaimRequestVersions({ rows = DEFAULT_ROWS }: { rows?: ClaimVersionRow[] }) {
  return (
    <div className="px-[16px] py-[12px] overflow-x-auto">
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontFamily: font, minWidth: 600 }}>
        <thead>
          <tr>
            {['Version', 'Submitted Date', 'Submitted By', 'Status', 'Currently Viewing'].map((h) => (
              <th key={h} style={{ background: '#a6c2e9', padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #e8edf5' }}>
                <span className="text-[16px]" style={{ color: '#000', fontFamily: font, fontWeight: 600 }}>{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.version} style={{ borderBottom: '1px solid #f0f3fa' }}>
              <td style={{ padding: '10px 14px' }}>
                <span className="text-[16px] underline" style={{ color: '#1360d2', cursor: 'pointer', fontFamily: font }}>{row.version}</span>
              </td>
              <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.submittedDate}</span></td>
              <td style={{ padding: '10px 14px' }}><span className="text-[16px]" style={{ color: '#051937', fontFamily: font }}>{row.submittedBy}</span></td>
              <td style={{ padding: '10px 14px' }}>
                <span className="inline-flex items-center px-[10px] py-[3px] rounded-[20px] text-[16px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
                  {row.status}
                </span>
              </td>
              <td style={{ padding: '10px 14px' }}>
                {row.isCurrentlyViewing
                  ? <span className="text-[16px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 500 }}>✓ Currently Viewing</span>
                  : <span className="text-[16px]" style={{ color: '#697498', fontFamily: font }}>—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
