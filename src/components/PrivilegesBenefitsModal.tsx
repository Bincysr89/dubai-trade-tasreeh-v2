import React, { useEffect } from 'react';

const font = "'Dubai', sans-serif";

/** UAE AEO (Authorised Economic Operator) mark, as it sits beside a declaration number. */
export function AeoLogo({ height = 18 }: { height?: number }) {
  return (
    <svg viewBox="0 0 64 20" height={height} role="img" aria-label="AEO" className="flex-shrink-0">
      <text x="0" y="15.5" fontFamily={font} fontSize="15" fontWeight="700" fill="#1b3f94" letterSpacing="0.6">UAE</text>
      <circle cx="54" cy="10" r="7.2" fill="none" stroke="#1b3f94" strokeWidth="2" />
      <circle cx="54" cy="10" r="3.2" fill="#d2232a" />
    </svg>
  );
}

/** World Logistics Passport mark. */
export function WlpLogo({ height = 18 }: { height?: number }) {
  return (
    <svg viewBox="0 0 44 20" height={height} role="img" aria-label="WLP" className="flex-shrink-0">
      <text x="0" y="15.5" fontFamily={font} fontSize="15" fontWeight="700" fontStyle="italic" fill="#0e1b3d" letterSpacing="0.3">WLP</text>
    </svg>
  );
}

export type Privilege = {
  privilege: string;
  logo: 'AEO' | 'WLP';
  businessCode: string;
  businessType: string;
  benefits: string[];
};

const SAMPLE: Privilege[] = [
  { privilege: 'AEO', logo: 'AEO', businessCode: 'AE-8122451', businessType: 'Declaration Owner', benefits: ['Re Export Extension', 'Priority'] },
];

type Props = {
  open: boolean;
  onClose: () => void;
  /** Declaration the privileges are being viewed for — named in the dialog label. */
  declarationNo?: string;
  privileges?: Privilege[];
};

/**
 * View Privileges & Benefits — the privileges the declaration's owner holds, and what
 * each one entitles them to.
 */
export default function PrivilegesBenefitsModal({ open, onClose, declarationNo, privileges = SAMPLE }: Props) {
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

  const th: React.CSSProperties = {
    background: '#a6c2e9', padding: '10px 14px', textAlign: 'left',
    borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap',
  };
  const td: React.CSSProperties = { padding: '12px 14px', verticalAlign: 'middle' };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      role="dialog" aria-modal="true" aria-label="View Privileges & Benefits"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-w-[760px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px] flex-shrink-0">
          <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>
            View Privileges &amp; Benefits{declarationNo ? ` — ${declarationNo}` : ''}
          </p>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[24px] py-[20px]">
          <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  {['Privilege', 'Logo', 'Business Code', 'Business Type', 'Benefits'].map((h) => (
                    <th key={h} style={th}><span className="text-[16px]" style={{ color: '#000', fontWeight: 600 }}>{h}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {privileges.map((p, i) => (
                  <tr key={`${p.privilege}-${i}`} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td style={td}><span className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>{p.privilege}</span></td>
                    <td style={td}>{p.logo === 'AEO' ? <AeoLogo height={20} /> : <WlpLogo height={20} />}</td>
                    <td style={td}><span className="text-[16px]" style={{ color: '#051937' }}>{p.businessCode}</span></td>
                    <td style={td}><span className="text-[16px]" style={{ color: '#051937' }}>{p.businessType}</span></td>
                    <td style={td}>
                      <span className="flex flex-col items-start gap-[8px]">
                        {p.benefits.map((b) => (
                          <span key={b} className="text-[15px] px-[14px] py-[6px] rounded-[4px] whitespace-nowrap"
                            style={{ border: '1px solid #cdd8ea', background: '#f7f9fd', color: '#0e1b3d', fontWeight: 500 }}>
                            {b}
                          </span>
                        ))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-center px-[24px] py-[16px] flex-shrink-0" style={{ borderTop: '1px solid #e8edf5' }}>
          <button onClick={onClose} data-secondary-btn
            className="h-[44px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
