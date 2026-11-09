import React, { useEffect } from 'react';
import Dh from './Dh';

const font = "'Dubai', sans-serif";

type Props = {
  open: boolean;
  onClose: () => void;
  /** One row per declaration — or auction lot — the claim covers. */
  declarations?: string[];
  /** Heading for that first column; an auction claim lists lots, not declarations. */
  itemLabel?: string;
  /** Per-declaration charges; the totals are worked out from these. */
  registrationCharge?: number;
  knowledgeDirham?: number;
};

const SAMPLE_DECLARATIONS = [
  '1010021774726', '1010021775126', '1010021775026', '1010021774926',
  '1010021775326', '1010021774826', '1010021775226',
];

function Amount({ value, bold }: { value: number; bold?: boolean }) {
  return (
    <span className="text-[16px] inline-flex items-baseline gap-[3px]"
      style={{ color: '#051937', fontFamily: font, fontWeight: bold ? 700 : 400 }}>
      <Dh style={{ fontSize: 15 }} />{value.toFixed(2)}
    </span>
  );
}

/**
 * Claim Registration Charge Breakup — what the Total on the Charges And Payment
 * Details card is made of, one line per declaration in the claim.
 */
export default function ChargesBreakupModal({
  open, onClose, declarations = SAMPLE_DECLARATIONS, itemLabel = 'Declaration No.',
  registrationCharge = 50, knowledgeDirham = 20,
}: Props) {
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

  const list = declarations.length > 0 ? declarations : SAMPLE_DECLARATIONS;
  const regSubTotal = list.length * registrationCharge;
  const kidSubTotal = list.length * knowledgeDirham;

  const th: React.CSSProperties = {
    background: '#a6c2e9', padding: '10px 14px', textAlign: 'left',
    borderBottom: '1px solid #e8edf5', whiteSpace: 'nowrap',
  };
  const td: React.CSSProperties = { padding: '10px 14px' };

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center p-[24px]"
      style={{ background: 'rgba(11,21,52,0.45)' }}
      role="dialog" aria-modal="true" aria-label="Claim Registration Charge Breakup"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[10px] w-full max-w-[860px] max-h-[88vh] flex flex-col overflow-hidden"
        style={{ boxShadow: '0px 12px 40px rgba(0,0,0,0.18)', fontFamily: font }}
      >
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px] flex-shrink-0">
          <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>Claim Registration Charge Breakup</p>
          <button onClick={onClose} aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-[24px] py-[20px]">
          <p className="text-[18px] mb-[12px]" style={{ color: '#0e1b3d', fontWeight: 600 }}>Claim Registration Charge Detail</p>
          <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #e8edf5' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th style={th}><span className="text-[16px]" style={{ color: '#000', fontWeight: 600 }}>{itemLabel}</span></th>
                  <th style={{ ...th, textAlign: 'right' }}><span className="text-[16px]" style={{ color: '#000', fontWeight: 600 }}>Claim Registration Charge</span></th>
                  <th style={{ ...th, textAlign: 'right' }}><span className="text-[16px]" style={{ color: '#000', fontWeight: 600 }}>Knowledge and Innovation Dirham</span></th>
                </tr>
              </thead>
              <tbody>
                {list.map((no, i) => (
                  <tr key={`${no}-${i}`} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td style={td}><span className="text-[16px]" style={{ color: '#1360d2', fontWeight: 500 }}>{no}</span></td>
                    <td style={{ ...td, textAlign: 'right' }}><Amount value={registrationCharge} /></td>
                    <td style={{ ...td, textAlign: 'right' }}><Amount value={knowledgeDirham} /></td>
                  </tr>
                ))}
                <tr style={{ background: '#dce8f7' }}>
                  <td style={td}><span className="text-[16px]" style={{ color: '#051937', fontWeight: 700 }}>Sub Total</span></td>
                  <td style={{ ...td, textAlign: 'right' }}><Amount value={regSubTotal} bold /></td>
                  <td style={{ ...td, textAlign: 'right' }}><Amount value={kidSubTotal} bold /></td>
                </tr>
                <tr style={{ background: '#dce8f7' }}>
                  <td style={td} />
                  <td style={{ ...td, textAlign: 'right' }}><span className="text-[16px]" style={{ color: '#051937', fontWeight: 700 }}>Grand Total</span></td>
                  <td style={{ ...td, textAlign: 'right' }}><Amount value={regSubTotal + kidSubTotal} bold /></td>
                </tr>
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
