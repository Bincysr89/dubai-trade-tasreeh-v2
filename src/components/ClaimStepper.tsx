import React from 'react';

export const REFUND_DEPOSIT_STEPS: { id: string; label: string }[] = [
  { id: 'eligible',  label: 'Select Declarations' },
  { id: 'charge',    label: 'Refund Details' },
  { id: 'documents', label: 'Upload Documents' },
  { id: 'payment',   label: 'Payment Details' },
  { id: 'review',    label: 'Review & Submit' },
];

/* Missing/Document Deposit claims have no document upload step. */
export const REFUND_DEPOSIT_STEPS_NO_DOCS: { id: string; label: string }[] =
  REFUND_DEPOSIT_STEPS.filter(s => s.id !== 'documents');

/* Amend flow has no payment step, and its first step reviews the existing
   declarations (read-only-ish, with remove) rather than searching for new ones. */
export const REFUND_DEPOSIT_AMEND_STEPS: { id: string; label: string }[] =
  REFUND_DEPOSIT_STEPS.filter(s => s.id !== 'payment').map(s => s.id === 'eligible' ? { ...s, label: 'Declaration Details' } : s);

export const CLAIM_STEPS: { id: string; label: string }[] = [
  { id: 'claim',     label: 'Claim Details' },
  { id: 'invoice',   label: 'Invoice & HS Code Details' },
  { id: 'documents', label: 'Document Details' },
  { id: 'payment',   label: 'Claim Payment Details' },
];

export const NR_CLAIM_STEPS: { id: string; label: string }[] = [
  { id: 'claim',     label: 'Claim Details' },
  { id: 'documents', label: 'Document Details' },
  { id: 'payment',   label: 'Claim Payment Details' },
  { id: 'review',    label: 'Review & Submit' },
];

/* Refund on Auction Proceed — Auction Lot Details replaces Eligible Declarations, and a
   dedicated Claim Details step (claim amount/remarks + transport & container per lot)
   sits between it and Upload Documents. */
export const REFUND_AUCTION_STEPS: { id: string; label: string }[] = [
  { id: 'auctionLots',  label: 'Auction Lot Details' },
  { id: 'claimDetails', label: 'Claim Details' },
  { id: 'documents',    label: 'Upload Documents' },
  { id: 'payment',      label: 'Payment Details' },
  { id: 'review',       label: 'Review & Submit' },
];

/* Amend flow has no payment step — the first step reviews the already-selected auction lots
   (with remove) rather than searching for new ones. */
export const REFUND_AUCTION_AMEND_STEPS: { id: string; label: string }[] =
  REFUND_AUCTION_STEPS.filter(s => s.id !== 'payment');

export const VALIDITY_EXT_STEPS: { id: string; label: string }[] = [
  { id: 'eligible', label: 'Eligible Declarations' },
  { id: 'details',  label: 'Extension Details' },
  { id: 'payment',  label: 'Payment Details' },
  { id: 'review',   label: 'Review & Submit' },
];

export default function ClaimStepper({ activeIndex, steps }: { activeIndex: number; steps?: { id: string; label: string }[] }) {
  const list = steps ?? CLAIM_STEPS;
  const trailColor = (i: number) => {
    if (i < activeIndex) return '#28a745';
    if (i === activeIndex) return '#0162dd';
    return '#a1aebe';
  };
  return (
    <div className="bg-white flex items-center justify-center px-[20px] py-[16px] rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
      <div className="flex items-center gap-[8px] flex-wrap">
        {list.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          const labelColor = done ? '#219653' : active ? '#1360d2' : '#697498';
          return (
            <React.Fragment key={s.id}>
              <div className="flex items-center gap-[6px]">
                {done ? (
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none">
                    <circle cx="12" cy="12" r="11" fill="#219653" />
                    <path d="M7 12l3.5 3.5L17 9" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : active ? (
                  <div className="size-[24px] rounded-full inline-flex items-center justify-center text-[12px] text-white" style={{ background: '#1360d2', fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>
                    {i + 1}
                  </div>
                ) : (
                  <div className="size-[24px] rounded-full inline-flex items-center justify-center text-[12px]" style={{ background: '#fff', color: '#697498', border: '1.5px solid #a1aebe', fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
                    {i + 1}
                  </div>
                )}
                <span className="text-[16px] whitespace-nowrap" style={{ color: labelColor, fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>{s.label}</span>
              </div>
              {i < list.length - 1 && (
                <div className="h-[2px] w-[80px]" style={{ background: trailColor(i) }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
