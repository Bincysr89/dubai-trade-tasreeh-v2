import React, { useEffect, useMemo, useRef, useState } from 'react';
import Header from '../Header';
import { DhAmount } from '../Dh';
import arrowDownSrc from '../../assets/passmgmt/arrow-down.svg';
import closeSrc from '../../assets/passmgmt/close.svg';
import type { PassStatus } from './pmData';

/* ──────────────────────────────────────────────────────────────
   Pass Management primitives — Figma "Tasreeh-Dev" components
   (label-above fields, blue section bars, zebra tables, flyout)
   re-coloured to the Dubai Trade theme:
     Figma #177DB7 → DT blue #1360D2 · text #1A1A1A → DT navy #0E1B3D
     section bar #DBE8F0 → #E2EBF9 · page #EFF3F7 → #F8FAFD
   ────────────────────────────────────────────────────────────── */

export const font = "'Dubai', sans-serif";
export const C = {
  primary: '#1360d2', navy: '#0e1b3d', text: '#0e1b3d', sub: '#5a6478', muted: '#8f94ae',
  border: '#d5ddfb', bar: '#e2ebf9', zebra: '#f5f8ff', page: '#f8fafd', accent: '#dc3545',
};

/* ── Page shell: DT header, Figma breadcrumb, scrolling body ── */
export function PmPage({ crumbs, onHome, children }: {
  crumbs: { label: string; onClick?: () => void }[]; onHome: () => void; children: React.ReactNode;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => { scroller.current?.scrollTo(0, 0); }, [crumbs.map(c => c.label).join('/')]);
  return (
    <div className="fixed inset-0 z-[60] flex flex-col overflow-hidden" style={{ background: C.page, fontFamily: font }}>
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>
      <div ref={scroller} className="flex-1 overflow-y-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-[40px] lg:px-[64px] pt-[20px] pb-[48px]">
          <nav className="flex items-center gap-[8px] text-[14px] mb-[20px] flex-wrap" aria-label="Breadcrumb">
            <button className="hover:underline" style={{ color: C.muted }} onClick={onHome}>Dashboard</button>
            {crumbs.map((c, i) => (
              <React.Fragment key={c.label}>
                <span style={{ color: C.accent }}>/</span>
                {c.onClick && i < crumbs.length - 1
                  ? <button className="hover:underline" style={{ color: C.muted }} onClick={c.onClick}>{c.label}</button>
                  : <span className="font-medium" style={{ color: C.navy }}>{c.label}</span>}
              </React.Fragment>
            ))}
          </nav>
          {children}
        </div>
      </div>
    </div>
  );
}

/* ── White card + light-blue title bar (PASS INFORMATION …) ── */
export function Section({ title, right, children, flush }: { title: string; right?: React.ReactNode; children: React.ReactNode; flush?: boolean }) {
  return (
    <section className="bg-white mb-[20px] overflow-hidden rounded-[4px]">
      <div className="flex items-center justify-between gap-4 min-h-[58px] px-[20px] py-[10px]" style={{ background: C.bar }}>
        <h2 className="text-[16px] font-medium uppercase tracking-[0.2px]" style={{ color: C.navy }}>{title}</h2>
        {right}
      </div>
      <div className={flush ? '' : 'px-[20px] pt-[24px] pb-[24px]'}>{children}</div>
    </section>
  );
}

export const SubHead = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[14px] font-medium uppercase mb-[18px]" style={{ color: C.primary }}>{children}</p>
);
export const BlockHead = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[14px] font-medium uppercase mb-[16px]" style={{ color: C.navy }}>{children}</p>
);
export const Rule = () => <div className="h-px w-full my-[24px]" style={{ background: '#dfe5f2' }} />;

export function Grid3({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[24px] gap-y-[22px] ${className}`}>{children}</div>;
}

/* ── Read-only value (label over value) ── */
export function RV({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] mb-[8px]" style={{ color: C.sub }}>{label}</p>
      {children ?? <p className="text-[16px] break-words" style={{ color: C.text }}>{value || '--'}</p>}
    </div>
  );
}

export function Amount({ value, big = true }: { value: string; big?: boolean }) {
  return <DhAmount value={value} className={big ? 'text-[20px] font-bold' : 'text-[16px]'} style={{ color: C.text, fontFamily: font }} />;
}

/* ── Label-above form fields (Figma input/select/date) ── */
const Label = ({ text, required }: { text: string; required?: boolean }) => (
  <p className="text-[13px] mb-[6px]" style={{ color: C.sub }}>{text}{required && <span style={{ color: C.accent }}>*</span>}</p>
);
const boxCls = 'h-[44px] w-full rounded-[4px] px-[12px] text-[15px] bg-white focus:outline-none transition-colors';
const boxStyle = (focus: boolean, readOnly?: boolean): React.CSSProperties => ({
  border: `1px solid ${focus ? C.primary : C.border}`, color: C.text, fontFamily: font,
  background: readOnly ? '#eef1f7' : '#fff',
});

export function FText({ label, value, onChange, required, placeholder = 'Enter', readOnly }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; placeholder?: string; readOnly?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <div className="min-w-0">
      {label && <Label text={label} required={required} />}
      <input value={value} readOnly={readOnly} placeholder={placeholder} onChange={e => onChange?.(e.target.value)}
        onFocus={() => setF(true)} onBlur={() => setF(false)}
        className={`${boxCls} placeholder-[#8f94ae]`} style={boxStyle(f && !readOnly, readOnly)} />
    </div>
  );
}

export function FSelect({ label, value, options, onChange, required }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; required?: boolean;
}) {
  const [f, setF] = useState(false);
  return (
    <div className="min-w-0">
      {label && <Label text={label} required={required} />}
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
          className={`${boxCls} appearance-none pr-[36px] cursor-pointer`} style={{ ...boxStyle(f), color: value ? C.text : C.muted }}>
          <option value="">Select</option>
          {options.map(o => <option key={o} value={o} style={{ color: C.text }}>{o}</option>)}
        </select>
        <img src={arrowDownSrc} alt="" width={9.7166} height={6} className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
      </div>
    </div>
  );
}

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={C.sub} strokeWidth="1.4">
    <rect x="3" y="4.5" width="14" height="12.5" rx="1.5" /><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4" strokeLinecap="round" />
  </svg>
);

/** Date field shown as "Select" / dd-MMM-yyyy, opening the browser date picker. */
export function FDate({ label, value, onChange, required, readOnly }: {
  label: string; value: string; onChange?: (v: string) => void; required?: boolean; readOnly?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const shown = useMemo(() => {
    if (!value) return '';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
    const d = new Date(`${value}T00:00:00`);
    return `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
  }, [value]);
  const open = () => { if (readOnly) return; const el = ref.current; if (!el) return; try { el.showPicker(); } catch { el.focus(); } };
  return (
    <div className="min-w-0">
      {label && <Label text={label} required={required} />}
      <div className="relative">
        <button type="button" onClick={open} className={`${boxCls} text-left flex items-center justify-between`}
          style={{ ...boxStyle(false, readOnly), color: shown ? C.text : C.muted, cursor: readOnly ? 'default' : 'pointer' }}>
          <span>{shown || 'Select'}</span><CalendarIcon />
        </button>
        <input ref={ref} type="date" tabIndex={-1} aria-hidden className="absolute left-0 bottom-0 w-full h-0 opacity-0 pointer-events-none"
          onChange={e => onChange?.(e.target.value)} />
      </div>
    </div>
  );
}

/* ── Status tag (Figma tag: Pending / Approved / Rejected / Draft / Expired / Completed) ── */
const TAG: Record<string, { bg: string; bd: string; c: string }> = {
  Pending:            { bg: '#fff4e2', bd: '#f5a623', c: '#d97706' },
  'Under Review':     { bg: '#fff4e2', bd: '#f5a623', c: '#d97706' },
  Approved:           { bg: '#e6fef1', bd: '#45b275', c: '#2e9b5f' },
  Completed:          { bg: '#e6fef1', bd: '#45b275', c: '#2e9b5f' },
  Rejected:           { bg: '#fdecea', bd: '#e35d4f', c: '#c0392b' },
  Draft:              { bg: '#f3f5fa', bd: C.navy, c: C.navy },
  Expired:            { bg: '#eef0f4', bd: '#a3abc2', c: '#7a8299' },
  'Return for Update': { bg: '#e8f0fd', bd: C.primary, c: C.primary },
  Returned:           { bg: '#e8f0fd', bd: C.primary, c: C.primary },
};
export function Tag({ status, big }: { status: PassStatus; big?: boolean }) {
  const t = TAG[status] ?? TAG.Expired;
  return (
    <span className={`inline-flex items-center rounded-[4px] whitespace-nowrap ${big ? 'px-[8px] py-[3px] text-[18px]' : 'px-[7px] text-[13px] leading-[20px]'}`}
      style={{ background: t.bg, border: `1px solid ${t.bd}`, color: t.c }}>{status}</span>
  );
}

/* ── Buttons ── */
const SOLID = { primary: C.primary, success: '#3fa66a', danger: '#f2582f' };
export function Btn({ children, onClick, variant = 'primary', small }: {
  children: React.ReactNode; onClick?: () => void; variant?: 'primary' | 'outline' | 'success' | 'danger'; small?: boolean;
}) {
  const solid = variant !== 'outline' ? SOLID[variant] : null;
  return (
    <button type="button" onClick={onClick}
      className={`${small ? 'h-[36px] px-[18px] text-[15px]' : 'h-[48px] px-[24px] text-[16px]'} rounded-[8px] font-bold whitespace-nowrap transition ${solid ? 'hover:brightness-90' : 'hover:bg-[#eef4ff]'}`}
      style={{ background: solid ?? '#fff', color: solid ? '#fff' : C.primary, border: `1px solid ${solid ?? C.primary}`, fontFamily: font, letterSpacing: '0.1px' }}>
      {children}
    </button>
  );
}

/* ── Radio card (Pass Access Category: Port Access / Zone Access) ── */
export function Radio({ checked, onChange, label, hint }: { checked: boolean; onChange: () => void; label: string; hint?: string }) {
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={onChange} className="flex items-start gap-[10px] text-left">
      <span className="size-[20px] rounded-full flex items-center justify-center flex-shrink-0 mt-[2px]" style={{ border: `2px solid ${C.primary}` }}>
        {checked && <span className="size-[10px] rounded-full" style={{ background: C.primary }} />}
      </span>
      <span>
        <span className={`block text-[16px] ${checked ? 'font-bold' : ''}`} style={{ color: C.text }}>{label}</span>
        {hint && <span className="block text-[13px] mt-[6px]" style={{ color: C.sub }}>{hint}</span>}
      </span>
    </button>
  );
}

/* ── Multi-line field (Remarks) ── */
export function FTextArea({ label, value, onChange, required, placeholder = 'Remarks (if any)', rows = 2 }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; placeholder?: string; rows?: number;
}) {
  const [f, setF] = useState(false);
  return (
    <div className="min-w-0">
      {label && <Label text={label} required={required} />}
      <textarea value={value} rows={rows} placeholder={placeholder} onChange={e => onChange(e.target.value)} onFocus={() => setF(true)} onBlur={() => setF(false)}
        className="w-full rounded-[4px] px-[14px] py-[12px] text-[15px] resize-y focus:outline-none placeholder-[#8f94ae]"
        style={{ border: `1px solid ${f ? C.primary : C.border}`, color: C.text, fontFamily: font }} />
    </div>
  );
}

/* ── Read-only amount box (Per Pass Amount) ── */
export function FAmount({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <Label text={label} />
      <div className="h-[44px] rounded-[4px] px-[12px] flex items-center" style={{ background: '#eef1f7', border: `1px solid ${C.border}` }}>
        <DhAmount value={value} className="text-[15px] font-bold" style={{ color: C.text, fontFamily: font }} />
      </div>
    </div>
  );
}

/* ── Result card (submitted / draft saved / approved / rejected / returned) ── */
export function ResultCard({ tone = 'success', title, message, rows, actions, link }: {
  tone?: 'success' | 'danger' | 'neutral'; title: string; message?: React.ReactNode;
  rows: [string, React.ReactNode][]; actions: React.ReactNode; link?: { label: string; onClick: () => void };
}) {
  const t = {
    success: { bg: '#3ec25a', fg: '#2e9b5f', icon: <path d="M10 21l7 7 14-15" strokeLinecap="round" strokeLinejoin="round" /> },
    danger:  { bg: '#f2582f', fg: '#f2582f', icon: <><circle cx="20" cy="20" r="11" /><path d="M12.5 12.5l15 15" strokeLinecap="round" /></> },
    neutral: { bg: '#dfe3ea', fg: C.navy, icon: <><path d="M11 20a9 9 0 109-9 9.2 9.2 0 00-6.6 2.8L11 16.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 10.5v5.7h5.7" strokeLinecap="round" strokeLinejoin="round" /></> },
  }[tone];
  return (
    <div className="bg-white rounded-[4px] px-[20px] pt-[56px] pb-[60px] flex flex-col items-center text-center">
      <div className="size-[76px] rounded-full flex items-center justify-center" style={{ background: t.bg }}>
        <svg viewBox="0 0 40 40" width="40" height="40" fill="none" stroke={tone === 'neutral' ? '#5a6478' : '#fff'} strokeWidth="3.2">{t.icon}</svg>
      </div>
      <h1 className="text-[26px] sm:text-[30px] font-medium mt-[34px] mb-[14px]" style={{ color: t.fg }}>{title}</h1>
      {message && <div className="text-[16px] leading-[27px] mb-[10px] max-w-[880px]" style={{ color: C.text }}>{message}</div>}
      <div className="flex flex-col gap-[10px] text-left">
        {rows.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[200px_1fr] items-center gap-[6px] text-[18px]">
            <span style={{ color: C.sub }}>{k} :</span><span style={{ color: C.text }}>{v}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-[20px] mt-[32px] flex-wrap justify-center">{actions}</div>
      {link && <button onClick={link.onClick} className="mt-[30px] text-[16px] font-bold hover:underline" style={{ color: C.primary }}>{link.label}</button>}
    </div>
  );
}

/* ── Agreement checkbox (Figma blue square tick) ── */
export const AGREE_TEXT = 'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. I also agree that Security Department has the full rights to reject any gate pass request for security reasons and the money paid for the pass is non-refundable in all cases.';
export function Agree({ checked, onChange, children = AGREE_TEXT }: { checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode }) {
  return (
    <label className="flex items-start gap-[12px] cursor-pointer my-[24px]">
      <span role="checkbox" aria-checked={checked} tabIndex={0}
        onKeyDown={e => { if (e.key === ' ') { e.preventDefault(); onChange(!checked); } }}
        onClick={e => { e.preventDefault(); onChange(!checked); }}
        className="size-[24px] rounded-[2px] flex items-center justify-center flex-shrink-0 mt-[2px]"
        style={{ background: checked ? C.primary : '#fff', border: `1.5px solid ${C.primary}` }}>
        {checked && <svg viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 8.5l3.2 3L13 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
      </span>
      <span className="text-[15px] leading-[24px]" style={{ color: C.text }}>{children}</span>
    </label>
  );
}

export function FootActions({ left, right }: { left?: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-[16px] flex-wrap mt-[8px]">
      <div className="flex gap-[16px]">{left}</div>
      <div className="flex gap-[20px] flex-wrap">{right}</div>
    </div>
  );
}

/* ── Documents ── */
export function UploadNote() {
  return (
    <p className="flex items-center gap-[8px] text-[13px] mb-[14px]" style={{ color: C.text }}>
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke={C.text} strokeWidth="1.4"><circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6.2v.1" strokeLinecap="round" /></svg>
      <span><b className="font-medium">NOTE:</b> Upload Document only of File Type (png/jpg/gif/pdf) and maximum allowed file size is 2MB for each document</span>
    </p>
  );
}

/** Uploaded file card — grey box, title, blue file link, optional Delete. */
export function DocCard({ title, file, required, onDelete }: { title: string; file: string; required?: boolean; onDelete?: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[2px] px-[16px] py-[14px] min-h-[62px]" style={{ background: '#f5f7fb', border: '1px solid #dfe5f2' }}>
      <div className="min-w-0">
        <p className="text-[15px]" style={{ color: C.text }}>{title}{required && <span style={{ color: C.accent }}>*</span>}</p>
        <a href="#" onClick={e => e.preventDefault()} className="text-[13px] underline" style={{ color: C.primary }}>{file}</a>
      </div>
      {onDelete && (
        <button type="button" onClick={onDelete} className="flex items-center gap-[4px] text-[13px] underline flex-shrink-0" style={{ color: C.accent }}>
          <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 5h14M8 5V3h4v2M16 5l-1 12H5L4 5M8 9v5M12 9v5" /></svg>
          Delete
        </button>
      )}
    </div>
  );
}

/** Dashed drop zone — "Choose Or Drag & Drop File"; picking a file turns it into a DocCard. */
export function DropBox({ title, required }: { title: string; required?: boolean }) {
  const [file, setFile] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  if (file) return (
    <>
      <DocCard title={title} file={file} required={required} onDelete={() => setConfirm(true)} />
      {confirm && <ConfirmDelete what={`${title} document`} onNo={() => setConfirm(false)} onYes={() => { setFile(null); setConfirm(false); }} />}
    </>
  );
  return (
    <div className="flex items-center justify-between gap-3 rounded-[2px] px-[16px] py-[14px] min-h-[62px]"
      onDragOver={e => e.preventDefault()} onDrop={e => { e.preventDefault(); setFile(e.dataTransfer.files[0]?.name ?? 'document.pdf'); }}
      style={{ border: '1px dashed #c3cce3', background: '#fff' }}>
      <p className="text-[15px]" style={{ color: C.text }}>{title}{required && <span style={{ color: C.accent }}>*</span>}</p>
      <button type="button" onClick={() => input.current?.click()} className="text-[13px] underline flex-shrink-0" style={{ color: C.primary }}>
        Choose Or Drag &amp; Drop File
      </button>
      <input ref={input} type="file" accept=".png,.jpg,.jpeg,.gif,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0]?.name ?? 'document.pdf')} />
    </div>
  );
}

/* ── Modal chrome (Figma "Apply from Old Pass": gradient title bar, close, rule, actions) ── */
export function Modal({ title, onClose, children, actions, width = 800 }: {
  title: string; onClose: () => void; children: React.ReactNode; actions?: React.ReactNode; width?: number;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.45)', fontFamily: font }} onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={title} className="bg-white w-full rounded-[4px] overflow-hidden flex flex-col max-h-[92vh]" style={{ maxWidth: width }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-[10px] h-[56px] px-[16px]" style={{ background: 'linear-gradient(90deg, #e2ebf9 0%, #f5f8ff 100%)' }}>
          <p className="flex-1 text-[20px] font-medium uppercase tracking-[0.2px]" style={{ color: C.navy }}>{title}</p>
          <button onClick={onClose} aria-label="Close" className="hover:opacity-60"><img src={closeSrc} alt="" width={24} height={24} /></button>
        </div>
        <div className="px-[20px] pt-[20px] pb-[28px] overflow-y-auto">{children}</div>
        {actions && <div className="flex justify-end gap-[20px] px-[20px] py-[20px] flex-wrap" style={{ borderTop: '1px solid #d9d9d9' }}>{actions}</div>}
      </div>
    </div>
  );
}

/** Claims-style delete confirmation — "Are you sure to delete?" No / Yes. */
export function ConfirmDelete({ what, onNo, onYes }: { what: string; onNo: () => void; onYes: () => void }) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4" style={{ background: 'rgba(14,27,61,0.45)', fontFamily: font }} onClick={onNo}>
      <div role="alertdialog" aria-modal="true" className="bg-white rounded-[10px] w-full max-w-[440px] p-[28px] text-center" onClick={e => e.stopPropagation()}>
        <div className="mx-auto size-[56px] rounded-full flex items-center justify-center mb-[14px]" style={{ background: '#fff4e2' }}>
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="#f5a623" strokeWidth="2"><path d="M12 3l10 18H2L12 3z" strokeLinejoin="round" /><path d="M12 10v5M12 18v.1" strokeLinecap="round" /></svg>
        </div>
        <p className="text-[20px] font-bold" style={{ color: C.navy }}>Are you sure to delete?</p>
        <p className="text-[15px] mt-[6px] mb-[22px]" style={{ color: C.sub }}>The {what} will be removed permanently.</p>
        <div className="flex justify-center gap-[16px]"><Btn variant="outline" onClick={onNo}>No</Btn><Btn onClick={onYes}>Yes</Btn></div>
      </div>
    </div>
  );
}

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2600); return () => clearTimeout(t); }, [message, onDone]);
  return (
    <div role="status" className="fixed bottom-[28px] left-1/2 -translate-x-1/2 z-[95] flex items-center gap-[10px] rounded-[8px] px-[18px] py-[12px] text-[15px] text-white"
      style={{ background: C.navy, boxShadow: '0 10px 30px rgba(14,27,61,0.25)', fontFamily: font }}>
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#45d38a" strokeWidth="2"><path d="M4 10.5l4 4 8-9" strokeLinecap="round" strokeLinejoin="round" /></svg>
      {message}
    </div>
  );
}
