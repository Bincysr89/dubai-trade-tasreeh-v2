import { useEffect, type ReactNode } from 'react';
import { font, GTag, toneFor, PrimaryBtn, SecondaryBtn } from './GateFields';
import { type GateRow } from './gatePassData';

/* Dimmed overlay + centred white dialog, closed on Escape / backdrop click. */
export function Dialog({ onClose, width, children }: { onClose: () => void; width: number; children: ReactNode }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.45)' }}
      onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div role="dialog" aria-modal="true" className="bg-white rounded-[10px] w-full overflow-hidden"
        style={{ maxWidth: width, boxShadow: '0 12px 40px rgba(0,0,0,0.2)' }}>
        {children}
      </div>
    </div>
  );
}

/* ── View Gate Pass / Print Pass ── */
export function GatePassPreviewModal({ row, onClose }: { row: GateRow; onClose: () => void }) {
  const status = row.status === 'Successful' ? 'Completed' : row.status;
  const Item = ({ label, value }: { label: string; value: string }) => (
    <div className="flex flex-col gap-[2px] min-w-0">
      <span className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
      <span className="text-[15px] text-[#0e1b3d] font-medium truncate" style={{ fontFamily: font }}>{value}</span>
    </div>
  );
  return (
    <Dialog onClose={onClose} width={620}>
      <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
        <h3 className="text-[18px] text-white font-medium" style={{ fontFamily: font }}>Gate Pass</h3>
        <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
      </div>

      <div className="p-[24px]">
        <div className="rounded-[10px] border border-[#d5ddfb] overflow-hidden">
          <div className="flex items-center justify-between px-[18px] py-[12px]" style={{ background: '#e0ecff' }}>
            <span className="text-[16px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>TASREEH · {row.portName}</span>
            <GTag label={status} tone={toneFor(status)} />
          </div>
          <div className="flex gap-[20px] p-[18px]">
            <div className="w-[96px] h-[116px] rounded-[6px] bg-[#eef1f7] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#a3abc2" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" strokeLinecap="round" />
              </svg>
            </div>
            <div className="grid grid-cols-2 gap-x-[18px] gap-y-[10px] flex-1 min-w-0">
              <Item label="Visitor" value={`${row.visitorTitle} ${row.visitorName}`} />
              <Item label="Pass Reference No." value={row.passRefNo} />
              <Item label="Pass Type" value={row.passType} />
              <Item label="Entry Gate" value={row.entryGate} />
              <Item label="Date of Visit" value={row.dateOfVisit} />
              <Item label="Valid Till" value={row.validTill} />
            </div>
          </div>
          {/* Barcode strip */}
          <div className="px-[18px] pb-[16px] flex flex-col items-center gap-[4px]">
            <div className="flex items-end h-[44px] gap-[2px]" aria-hidden>
              {Array.from({ length: 56 }, (_, i) => (
                <span key={i} className="bg-[#0e1b3d]" style={{ width: (i * 7) % 3 + 1, height: 44 }} />
              ))}
            </div>
            <span className="text-[13px] text-[#697498] tracking-[3px]" style={{ fontFamily: font }}>{row.applicationNo}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-[12px] px-[24px] pb-[22px]">
        <SecondaryBtn onClick={onClose}>Close</SecondaryBtn>
        <PrimaryBtn onClick={() => window.print()}>Print Pass</PrimaryBtn>
      </div>
    </Dialog>
  );
}

/* ── Cancel Request confirmation ── */
export function CancelRequestModal({ appNo, subject, note = 'The amount paid for the pass is non-refundable.', onClose, onConfirm }: {
  appNo: string; subject: string; note?: string; onClose: () => void; onConfirm: () => void;
}) {
  return (
    <Dialog onClose={onClose} width={480}>
      <div className="p-[28px] flex flex-col items-center text-center">
        <span className="size-[64px] rounded-full flex items-center justify-center mb-[18px]" style={{ background: 'rgba(192,57,43,0.10)' }}>
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#c0392b" strokeWidth="1.8">
            <circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" strokeLinecap="round" />
          </svg>
        </span>
        <h3 className="text-[22px] font-bold text-[#0e1b3d] mb-[8px]" style={{ fontFamily: font }}>Cancel Request?</h3>
        <p className="text-[16px] text-[#5a6478] mb-[24px]" style={{ fontFamily: font }}>
          {subject} <span className="text-[#0e1b3d] font-medium">{appNo}</span> will be cancelled. {note}
        </p>
        <div className="flex gap-[12px]">
          <SecondaryBtn onClick={onClose}>Keep Request</SecondaryBtn>
          <button onClick={onConfirm}
            className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90"
            style={{ background: '#c0392b', fontFamily: font, fontWeight: 500 }}>
            Cancel Request
          </button>
        </div>
      </div>
    </Dialog>
  );
}

/* Small confirmation toast (draft saved / request cancelled) */
export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-[500] px-[20px] py-[12px] rounded-[8px] flex items-center gap-[10px]"
      style={{ background: '#0e1b3d', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#3cc35a" strokeWidth="2.4"><path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      <span className="text-[16px] text-white" style={{ fontFamily: font }}>{message}</span>
    </div>
  );
}

/* ── Visitor search result — Confirm Visitor Details (Figma 1005:30551) ── */
export function VisitorConfirmModal({ visaType, emiratesId, dob, gender, found, onClose, onManual, onConfirm }: {
  visaType: string; emiratesId: string; dob: string; gender: string;
  found: { title: string; firstName: string; lastName: string };
  onClose: () => void; onManual: () => void; onConfirm: () => void;
}) {
  const Box = ({ label, value, grey }: { label: string; value: string; grey?: boolean }) => (
    <div className="relative min-w-0">
      <div className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center text-[16px] text-[#0e1b3d]"
        style={{ border: '1px solid #d5ddfb', background: grey ? '#eef1f7' : '#fff', fontFamily: font }}>
        <span className="truncate">{value || '-'}</span>
      </div>
      <span className="absolute left-[12px] top-0 -translate-y-1/2 px-[4px] text-[12px] text-[#0e1b3d]"
        style={{ fontFamily: font, background: grey ? 'linear-gradient(#fff 50%, #eef1f7 50%)' : '#fff' }}>{label}</span>
    </div>
  );
  return (
    <Dialog onClose={onClose} width={800}>
      <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
        <h3 className="text-[18px] text-white font-medium" style={{ fontFamily: font }}>Visitor Details</h3>
        <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="px-[24px] pt-[22px] pb-[26px]">
        <p className="text-[20px] font-bold text-[#0e1b3d] mb-[4px]" style={{ fontFamily: font }}>Confirm Visitor Details</p>
        <p className="text-[16px] text-[#5a6478] mb-[26px]" style={{ fontFamily: font }}>
          Please confirm if the fetched details of the visitor is correct.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[20px] gap-y-[24px]">
          <Box label="Visa Type" value={visaType} />
          <Box label="Emirates ID *" value={emiratesId} />
          <Box label="Date of Birth *" value={dob} />
          <Box label="Gender" value={gender} />
          <div className="hidden sm:block" /><div className="hidden sm:block" />
          <Box label="Title *" value={found.title} grey />
          <Box label="First Name *" value={found.firstName} grey />
          <Box label="Last Name *" value={found.lastName} grey />
        </div>
      </div>
      <div className="flex justify-end gap-[16px] px-[24px] py-[18px]" style={{ borderTop: '1px solid #e8edf5' }}>
        <SecondaryBtn onClick={onManual}>Enter Manually</SecondaryBtn>
        <PrimaryBtn onClick={onConfirm}>Yes, Confirm Details</PrimaryBtn>
      </div>
    </Dialog>
  );
}
