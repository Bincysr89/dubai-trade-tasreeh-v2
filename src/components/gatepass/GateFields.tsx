import React, { useEffect, useRef, useState } from 'react';
import Header from '../Header';
import { DateInput } from '../DatePicker';
import { DhAmount } from '../Dh';
import { agentBanner, serviceTitle, GATE_PASS_TITLE } from './gatePassData';

export const font = "'Dubai', sans-serif";

/* ──────────────────────────────────────────────────────────────
   Field + page primitives for the Tasreeh Gate Pass screens.
   Same visual language as the rest of the portal: 56px outlined
   box, label rides up into the border on focus / value.
   ────────────────────────────────────────────────────────────── */

function labelStyle(active: boolean): React.CSSProperties {
  return {
    position: 'absolute', left: 12,
    top: active ? 0 : '50%', transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16, color: '#0e1b3d',
    background: active ? '#fff' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none', transition: 'top 0.15s ease, font-size 0.15s ease',
    fontFamily: font, whiteSpace: 'nowrap', zIndex: 1,
  };
}

const Req = () => <span style={{ color: '#dc3545' }}>*</span>;

const XClear = ({ onClear }: { onClear: (e: React.MouseEvent) => void }) => (
  <button type="button" onClick={onClear} aria-label="Clear"
    style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
      width: 22, height: 22, borderRadius: '50%', border: 'none', background: '#b0b8d0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, zIndex: 2 }}>
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
      <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  </button>
);

/* ── Text input ── */
export function GInput({ label, value, onChange, required, readOnly, placeholder }: {
  label: string; value: string; onChange?: (v: string) => void;
  required?: boolean; readOnly?: boolean; placeholder?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = focused || value.length > 0 || !!placeholder;
  const showX = !!(value && hovered && onChange && !readOnly);
  return (
    <div className="relative min-w-0" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <input
        type="text" value={value} readOnly={readOnly} placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none placeholder-[#8f94ae]"
        style={{
          fontFamily: font,
          paddingRight: showX ? 40 : 12,
          border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
          background: readOnly ? '#eef1f7' : '#fff',
          cursor: readOnly ? 'default' : undefined,
        }}
      />
      <span style={{ ...labelStyle(active), background: active ? (readOnly ? 'linear-gradient(#fff 50%, #eef1f7 50%)' : '#fff') : 'transparent' }}>
        {required && <Req />}{required ? ' ' : ''}{label}
      </span>
      {showX && <XClear onClear={e => { e.preventDefault(); onChange?.(''); }} />}
    </div>
  );
}

/* ── Multi-line input (Company Address / Remarks) ── */
export function GTextArea({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative min-w-0">
      <textarea
        value={value} onChange={e => onChange(e.target.value)} rows={3}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-[4px] px-[12px] pt-[16px] pb-[8px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white resize-none"
        style={{ fontFamily: font, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, minHeight: 84 }}
      />
      <span style={{ ...labelStyle(active), top: active ? 0 : 28 }}>{required && <Req />}{required ? ' ' : ''}{label}</span>
    </div>
  );
}

/* ── Select / dropdown ── */
export function GSelect({ label, value, options, onChange, required, disabled, searchable }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
  required?: boolean; disabled?: boolean; searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const active = open || value !== '';

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const shown = searchable && q ? options.filter(o => o.toLowerCase().includes(q.toLowerCase())) : options;

  return (
    <div className="relative min-w-0" ref={ref}>
      <button
        type="button" disabled={disabled}
        onClick={() => { setOpen(o => !o); setQ(''); }}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] focus:outline-none text-left"
        style={{
          fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`,
          background: disabled ? '#eef1f7' : '#fff', cursor: disabled ? 'default' : 'pointer',
        }}
      >
        <span className="flex-1 truncate">{value}</span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <span style={{ ...labelStyle(active), background: active ? (disabled ? 'linear-gradient(#fff 50%, #eef1f7 50%)' : '#fff') : 'transparent' }}>
        {required && <Req />}{required ? ' ' : ''}{label}
      </span>
      {open && (
        <div className="absolute z-[300] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] max-h-[280px] overflow-y-auto"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {searchable && (
            <div className="px-[10px] pt-[6px] pb-[8px]">
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Search"
                className="w-full h-[38px] rounded-[4px] px-[10px] text-[15px] text-[#0e1b3d] focus:outline-none border border-[#d5ddfb] focus:border-[#1360d2]"
                style={{ fontFamily: font }} />
            </div>
          )}
          {shown.map(opt => {
            const selected = opt === value;
            return (
              <button key={opt} type="button"
                className={`w-full px-[14px] py-[10px] text-left text-[16px] transition-colors ${selected ? '' : 'hover:bg-[#e2ebf9]'}`}
                style={{
                  fontFamily: font,
                  background: selected ? '#1360d2' : undefined,
                  color: selected ? '#fff' : '#111838',
                  fontWeight: selected ? 600 : 400,
                }}
                onClick={() => { onChange(opt); setOpen(false); }}>
                {opt}
              </button>
            );
          })}
          {shown.length === 0 && (
            <p className="px-[14px] py-[10px] text-[15px] text-[#8f94ae]" style={{ fontFamily: font }}>No matches</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Date ── */
export function GDate({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return <DateInput label={required ? ` ${label}` : label} required={required} value={value} onChange={onChange} />;
}

/* ── Read-only label / value pair (View / Report Lost) ── */
export function GValue({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[4px] min-w-0">
      <span className="text-[14px] text-[#575757]" style={{ fontFamily: font }}>{label}</span>
      {children ?? (
        <span className="text-[16px] text-[#1a1a1a] break-words" style={{ fontFamily: font }}>{value || '-'}</span>
      )}
    </div>
  );
}

/* Bold amount with the Dirham glyph (portal-wide rule for every amount). */
export function GAmount({ value }: { value: string }) {
  return <DhAmount value={value} className="text-[20px] font-bold text-[#1a1a1a]" style={{ fontFamily: font }} />;
}

/* ── Status tag (Figma "Completed" / "Under Review" tags) ── */
export function GTag({ label, tone }: { label: string; tone: 'green' | 'amber' | 'red' | 'grey' | 'blue' }) {
  const t = {
    green: { bg: '#e6fef1', bd: '#45b275', c: '#2e9b5f' },
    amber: { bg: '#fff4e2', bd: '#f5a623', c: '#d97706' },
    red:   { bg: '#fdecea', bd: '#e35d4f', c: '#c0392b' },
    grey:  { bg: '#f1f3f8', bd: '#a3abc2', c: '#697498' },
    blue:  { bg: '#e8f0fd', bd: '#1360d2', c: '#1360d2' },
  }[tone];
  return (
    <span className="inline-flex items-center px-[8px] py-[1px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
      style={{ background: t.bg, border: `1px solid ${t.bd}`, color: t.c, fontFamily: font }}>
      {label}
    </span>
  );
}

export function toneFor(status: string): 'green' | 'amber' | 'red' | 'grey' | 'blue' {
  if (status === 'Successful' || status === 'Completed') return 'green';
  if (status === 'Under Review') return 'amber';
  if (status === 'Rejected') return 'red';
  if (status === 'Draft') return 'blue';
  return 'grey';
}

/* ── Section card — same chrome and heading as the SIRA / Integrated Clearance cards ── */
export function GSection({ title, right, children }: { title: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-[8px] p-[24px] mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
      <div className="flex items-center justify-between gap-4 flex-wrap mb-[24px]">
        <h2 className="text-[20px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>{title}</h2>
        {right}
      </div>
      {children}
    </section>
  );
}

/* Sub-heading inside a card (Visitors Added, Tools & Equipments …) */
export function GSubHead({ children, right }: { children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap mb-[16px]">
      <p className="text-[18px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{children}</p>
      {right}
    </div>
  );
}

export const Divider = () => <div className="h-px w-full bg-[#e2e8f5] my-[26px]" />;

/* 4-column responsive grid used by every field block */
export function Grid4({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[24px] ${className}`}>{children}</div>;
}

/* ── Radio cards (Pass Access Category, Apply from old / Create new) ── */
export function GRadioCards({ name, value, options, onChange }: {
  name: string; value: string;
  options: { value: string; label: string; sub?: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-[16px] flex-wrap">
      {options.map(o => {
        const active = value === o.value;
        return (
          <label key={o.value}
            className="flex items-start gap-[12px] px-[18px] py-[14px] rounded-[6px] cursor-pointer transition-colors flex-1 min-w-[260px] max-w-[520px]"
            style={{ background: active ? '#f0f5ff' : '#f8fafd', border: `1.5px solid ${active ? '#1360d2' : '#e6eaf5'}` }}>
            <span className="size-[20px] mt-[3px] rounded-full flex-shrink-0 inline-flex items-center justify-center"
              style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: '#fff' }}>
              {active && <span className="size-[10px] rounded-full" style={{ background: '#1360d2' }} />}
            </span>
            <input type="radio" name={name} className="sr-only" checked={active} onChange={() => onChange(o.value)} />
            <span className="flex flex-col gap-[2px]">
              <span className="text-[17px]" style={{ fontFamily: font, color: '#0e1b3d', fontWeight: active ? 600 : 500 }}>{o.label}</span>
              {o.sub && <span className="text-[14px] text-[#5a6478]" style={{ fontFamily: font }}>{o.sub}</span>}
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ── Inline Yes / No radios (Require access to facility areas?) ── */
export function GYesNo({ label, value, onChange, required }: {
  label: string; value: string; onChange: (v: 'Yes' | 'No') => void; required?: boolean;
}) {
  return (
    <div className="flex flex-col justify-center gap-[8px] min-h-[56px]">
      <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font }}>{required && <Req />}{required ? ' ' : ''}{label}</span>
      <div className="flex items-center gap-[24px]">
        {(['Yes', 'No'] as const).map(v => (
          <label key={v} className="flex items-center gap-[8px] cursor-pointer">
            <input type="radio" checked={value === v} onChange={() => onChange(v)}
              className="size-[18px] cursor-pointer" style={{ accentColor: '#1360d2' }} />
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{v}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

/* ── Multi-select dropdown (Facility Areas) ── */
export function GMultiSelect({ label, values, options, onChange, disabled, required }: {
  label: string; values: string[]; options: string[]; onChange: (v: string[]) => void;
  disabled?: boolean; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = open || values.length > 0;
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const toggle = (o: string) => onChange(values.includes(o) ? values.filter(v => v !== o) : [...values, o]);
  return (
    <div className="relative min-w-0" ref={ref}>
      <button type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] focus:outline-none text-left"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`,
          background: disabled ? '#eef1f7' : '#fff', cursor: disabled ? 'not-allowed' : 'pointer' }}>
        <span className="flex-1 truncate">
          {values.length > 2 ? `${values.slice(0, 2).join(', ')} +${values.length - 2}` : values.join(', ')}
        </span>
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2.5"
          className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <span style={{ ...labelStyle(active), background: active ? (disabled ? 'linear-gradient(#fff 50%, #eef1f7 50%)' : '#fff') : 'transparent' }}>
        {required && <Req />}{required ? ' ' : ''}{label}
      </span>
      {open && (
        <div className="absolute z-[300] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] max-h-[280px] overflow-y-auto"
          style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <label key={o} className="flex items-center gap-[10px] px-[14px] py-[10px] hover:bg-[#e2ebf9] cursor-pointer">
              <input type="checkbox" checked={values.includes(o)} onChange={() => toggle(o)}
                className="size-[17px] cursor-pointer" style={{ accentColor: '#1360d2' }} />
              <span className="text-[16px] text-[#111838]" style={{ fontFamily: font }}>{o}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

/* Read-only amount field (Per Pass Amount / Pass Amount) */
export function GAmountField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative min-w-0">
      <div className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center"
        style={{ border: '1px solid #d5ddfb', background: '#eef1f7' }}>
        <DhAmount value={value} className="text-[16px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }} />
      </div>
      <span style={{ ...labelStyle(true), background: 'linear-gradient(#fff 50%, #eef1f7 50%)' }}>{label}</span>
    </div>
  );
}

/* Reset — secondary (outlined) button, same as the other modules */
export function ResetBtn({ onClick, tall }: { onClick: () => void; tall?: boolean }) {
  return (
    <button type="button" onClick={onClick} data-secondary-btn
      className={`${tall ? 'h-[56px]' : 'h-[48px]'} px-[20px] flex items-center justify-center gap-[8px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors whitespace-nowrap`}
      style={{ fontFamily: font, fontWeight: 500 }}>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 12a8 8 0 01-14 5.3M4 12a8 8 0 0114-5.3M18 3v4h-4M6 21v-4h4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Reset
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Individual uploader — DT component library "Upload / Compact View"
   (upl-card): title + Download Template, hint, inline drop zone,
   then one card per uploaded file with delete / view / download.
   ────────────────────────────────────────────────────────────── */
type UpFile = { id: string; name: string; date: string };

export function GUploader({ title, required, hint = '*Supported file type of .PDF .JPG .PNG .GIF , max file size up to 2MB', template = true }: {
  title: string; required?: boolean; hint?: string; template?: boolean;
}) {
  const [files, setFiles] = useState<UpFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const add = (list: FileList | null | undefined) => {
    if (!list?.length) return;
    const d = new Date();
    const date = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    setFiles(p => [...p, ...Array.from(list).map((f, i) => ({ id: `${f.name}-${Date.now()}-${i}`, name: f.name, date }))]);
  };
  return (
    <div className="min-w-0" style={{ fontFamily: font }}>
      <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '1px 2px 12px 0px rgba(0,0,0,0.06)' }}>
        <div className="flex items-center justify-between gap-[12px] mb-[12px]">
          <span className="text-[16px] text-[#060c28]" style={{ fontWeight: 500 }}>
            {title}{required && <span style={{ color: '#ea2428' }}> *</span>}
          </span>
          {template && (
            <a href="#" onClick={e => e.preventDefault()}
              className="flex items-center gap-[8px] text-[14px] text-[#1360d2] hover:underline whitespace-nowrap" style={{ fontWeight: 500 }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="#1360D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 14H14" stroke="#1360D2" strokeWidth="1.5" strokeLinecap="round" /></svg>
              Download Template
            </a>
          )}
        </div>
        <p className="text-[14px] text-[#323c64] mb-[16px]">{hint}</p>
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); add(e.dataTransfer.files); }}
          className="rounded-[4px] flex items-center justify-center gap-[20px] px-[20px] py-[15px] flex-wrap"
          style={{ background: dragging ? '#ebf2ff' : '#f8fafd', border: `1px dashed ${dragging ? '#1360d2' : '#8f94ae'}` }}
        >
          <span className="size-[50px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#dfe5e9' }}>
            <svg width="27" height="24" viewBox="0 0 27 24" fill="none"><path d="M13.5 16V8M13.5 8L10.5 11M13.5 8L16.5 11" stroke="#6D707E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M9 20C6.24 20 4 17.76 4 15C4 12.5 5.8 10.38 8.2 10.06C8.63 7.22 11.07 5 14 5C17.31 5 20 7.69 20 11C22.21 11 24 12.79 24 15C24 17.21 22.21 19 20 19" stroke="#6D707E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </span>
          <span className="text-[16px] text-[#6d707e] whitespace-nowrap">Drag and drop files here &nbsp; -Or-</span>
          <button type="button" onClick={() => inputRef.current?.click()}
            className="h-[44px] px-[20px] rounded-[4px] text-[16px] text-white hover:opacity-90 whitespace-nowrap"
            style={{ background: '#1360d2', fontWeight: 600 }}>
            Browse File
          </button>
          <input ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.gif" className="hidden"
            onChange={e => { add(e.target.files); e.target.value = ''; }} />
        </div>
      </div>

      {files.length > 0 && (
        <div className="flex flex-col gap-[8px] mt-[12px]">
          {files.map(f => (
            <div key={f.id} className="bg-white rounded-[4px] h-[72px] px-[16px] flex items-center gap-[12px]"
              style={{ boxShadow: '0px 4px 5px rgba(0,0,0,0.06)' }}>
              <span className="size-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ border: '1px solid #7681ab' }}>
                <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M11 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H15C16.1 22 17 21.1 17 20V8L11 2Z" stroke="#7681AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M11 2V8H17" stroke="#7681AB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 13H13M5 17H9" stroke="#7681AB" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[16px] text-[#060c28] truncate" style={{ fontWeight: 500 }}>{f.name}</p>
                <p className="text-[14px] text-[#919191] mt-[2px]">Uploaded on - {f.date}</p>
              </div>
              <div className="flex items-center gap-[16px] flex-shrink-0">
                <button type="button" title="Delete" aria-label={`Delete ${f.name}`} onClick={() => setFiles(p => p.filter(x => x.id !== f.id))}
                  className="p-[4px] rounded-[4px] hover:bg-black/5">
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M1 4H3H17" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M15 4V18C15 19.1 14.1 20 13 20H5C3.9 20 3 19.1 3 18V4M6 4V2C6 0.9 6.9 0 8 0H10C11.1 0 12 0.9 12 2V4" stroke="#DC3545" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
                <button type="button" title="View" aria-label={`View ${f.name}`} className="p-[4px] rounded-[4px] hover:bg-black/5">
                  <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M1 8C1 8 4.5 1 11 1C17.5 1 21 8 21 8C21 8 17.5 15 11 15C4.5 15 1 8 1 8Z" stroke="#1360D2" strokeWidth="1.5" strokeLinejoin="round" /><circle cx="11" cy="8" r="3" stroke="#1360D2" strokeWidth="1.5" /></svg>
                </button>
                <button type="button" title="Download" aria-label={`Download ${f.name}`} className="p-[4px] rounded-[4px] hover:bg-black/5">
                  <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M9 2V13M9 13L5 9M9 13L13 9" stroke="#1360D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M1 18H17" stroke="#1360D2" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Two uploaders per row */
export function UploadGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-start">{children}</div>;
}

/* Square icon buttons used in the Visitors Added action column */
export function IconBtn({ kind, onClick, label }: { kind: 'edit' | 'delete' | 'open' | 'view' | 'download'; onClick: () => void; label: string }) {
  /* Delete matches Refund & Claims: plain red bin, light red tint on hover */
  if (kind === 'delete') {
    return (
      <button type="button" onClick={onClick} aria-label={label} title={label}
        className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors"
        style={{ color: '#dc3545' }}>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
        </svg>
      </button>
    );
  }
  const tone = { bg: '#e2ebf9', c: '#1360d2' };
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      className="size-[34px] rounded-[4px] inline-flex items-center justify-center hover:opacity-80"
      style={{ background: tone.bg, color: tone.c }}>
      {kind === 'edit' && (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" strokeLinejoin="round" />
        </svg>
      )}
      {kind === 'view' && (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" />
        </svg>
      )}
      {kind === 'download' && (
        <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
        </svg>
      )}
      {kind === 'open' && (
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}

/* Error / info banner (PAYMENT FAILED — Figma 1248:67726) */
export function GBanner({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex items-start gap-[12px] rounded-[8px] px-[18px] py-[14px] mb-[20px]"
      style={{ background: '#fdecea', border: '1px solid #f5b5ab' }} role="alert">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#dc3545" strokeWidth="1.8" className="flex-shrink-0">
        <circle cx="12" cy="12" r="9.5" /><path d="M12 7.5v5.5M12 16.5v.01" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col gap-[2px]">
        <p className="text-[16px] font-bold uppercase text-[#c0392b]" style={{ fontFamily: font }}>{title}</p>
        <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>{message}</p>
      </div>
    </div>
  );
}

/* Uploaded document chip (read-only) */
export function GFileChip({ label, file }: { label: string; file: string }) {
  return (
    <div className="h-[80px] rounded-[4px] flex flex-col justify-center gap-[3px] px-[16px] w-full max-w-[628px]"
      style={{ border: '1px solid #cbd5e1', background: '#f5f7f9' }}>
      <span className="text-[16px] text-[#1a1a1a]" style={{ fontFamily: font }}>{label}</span>
      <span className="text-[14px] text-[#177db7] underline cursor-pointer w-fit" style={{ fontFamily: font }}>{file}</span>
    </div>
  );
}

/* ── Declaration checkbox ── */
export const AGREEMENT_TEXT =
  'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. ' +
  'I also agree that Security Department has the full rights to reject any gate pass request for security reasons and ' +
  'the money paid for the pass is non-refundable in all cases.';

export function GAgree({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children?: React.ReactNode }) {
  return (
    <label className="flex items-start gap-[12px] cursor-pointer mb-[16px]">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)}
        className="size-[22px] mt-[3px] rounded-[2px] cursor-pointer flex-shrink-0" style={{ accentColor: '#1360d2' }} />
      <span className="text-[16px] text-[#1a1a1a]" style={{ fontFamily: font, lineHeight: '28px' }}>{children ?? AGREEMENT_TEXT}</span>
    </label>
  );
}

/* ── Buttons ── */
export function PrimaryBtn({ children, onClick, disabled }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
      style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
      {children}
    </button>
  );
}

export function SecondaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} data-secondary-btn
      className="h-[48px] px-[20px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors whitespace-nowrap"
      style={{ fontFamily: font, fontWeight: 500 }}>
      {children}
    </button>
  );
}

export function NeedHelp() {
  return (
    <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2] hover:opacity-80"
      style={{ fontFamily: font, fontWeight: 500 }}>
      Need Help
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 14.2v-.01M8.4 7.6a1.7 1.7 0 113 1.1c-.6.5-1.4.8-1.4 1.8" strokeLinecap="round" />
      </svg>
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────
   Page shell: header, breadcrumb + agent banner, title row,
   scrolling body and the sticky bottom bar.
   ────────────────────────────────────────────────────────────── */
export function GatePage({
  title, titleExtra, actions, onHome, onListing, footerLeft, footerRight, children, crumb = GATE_PASS_TITLE,
}: {
  title: string;
  /** Last breadcrumb — the service the page belongs to. */
  crumb?: string;
  titleExtra?: React.ReactNode;
  actions?: React.ReactNode;
  onHome: () => void;
  onListing: () => void;
  footerLeft?: React.ReactNode;
  footerRight?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[60] bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-8">
        <div className="flex items-center justify-between mt-[16px] mb-[10px] gap-4 flex-wrap">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onHome}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2]" onClick={onListing}>Service Catalog</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium cursor-pointer" onClick={onListing}>{serviceTitle(crumb)}</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            {agentBanner()}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 flex-wrap mb-[22px]">
          <div className="flex items-center gap-[20px] flex-wrap">
            <h1 className="text-[32px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>{title}</h1>
            {titleExtra}
          </div>
          {actions && <div className="flex items-center gap-[16px] flex-wrap">{actions}</div>}
        </div>

        {children}
      </div>

      {(footerLeft || footerRight) && (
        <div className="bg-white flex items-center justify-between px-4 sm:px-[40px] py-[16px] flex-shrink-0 gap-4"
          style={{ boxShadow: '0 -4px 20px rgba(14,27,61,0.08)' }}>
          <div className="flex items-center gap-[12px]">{footerLeft}</div>
          <div className="flex items-center gap-[12px]">{footerRight}</div>
        </div>
      )}
    </div>
  );
}
