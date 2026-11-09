import React, { useState, useRef, useEffect } from 'react';

const FONT = "'Dubai', 'Segoe UI', sans-serif";
const MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const p2 = (n: number) => String(n).padStart(2, '0');

/** Format YYYY-MM-DD → "05-06-2026" */
export function fmtDate(iso: string): string {
  if (!iso) return '';
  const datePart = iso.split('T')[0].split(' ')[0]; // handle both ISO and "YYYY-MM-DD HH:mm"
  const [y, m, d] = datePart.split('-').map(Number);
  return `${p2(d)}-${p2(m)}-${y}`;
}

/** Parse what the user typed — "05-06-2026", "05/06/2026" or "5-6-26" — back to YYYY-MM-DD.
    Returns '' when it is not a date yet, so a half-typed field is simply not committed. */
export function parseTypedDate(text: string): string {
  const m = text.trim().match(/^(\d{1,2})[-/. ](\d{1,2})[-/. ](\d{2}|\d{4})$/);
  if (!m) return '';
  const day = +m[1], month = +m[2];
  const year = m[3].length === 2 ? 2000 + +m[3] : +m[3];
  if (month < 1 || month > 12 || day < 1) return '';
  if (day > new Date(year, month, 0).getDate()) return '';
  return `${year}-${p2(month)}-${p2(day)}`;
}

/** Format "YYYY-MM-DD HH:mm" → "05-06-2026 14:30" */
export function fmtDateTime(val: string): string {
  if (!val) return '';
  const [datePart, timePart] = val.split(' ');
  return timePart ? `${fmtDate(datePart)} ${timePart}` : fmtDate(datePart);
}

/* ── Calendar picker ──────────────────────────────────────────────────────── */
export function DateTimePicker({
  value,
  onConfirm,
  showTime = false,
}: {
  value: string;
  onConfirm: (v: string) => void;
  showTime?: boolean;
}) {
  const today = new Date();
  const datePart = value ? value.split(' ')[0] : '';
  const timePart = value ? (value.split(' ')[1] ?? '') : '';
  const init = datePart ? new Date(datePart + 'T00:00') : today;
  const safe = isNaN(init.getTime()) ? today : init;

  const [viewYear,  setViewYear]  = useState(safe.getFullYear());
  const [viewMonth, setViewMonth] = useState(safe.getMonth());
  const [selDay,    setSelDay]    = useState<number | null>(datePart ? safe.getDate() : null);
  const [mode,      setMode]      = useState<'day' | 'month' | 'year'>('day');
  const [yrStart,   setYrStart]   = useState(safe.getFullYear() - 10);
  const [hour,      setHour]      = useState(timePart ? parseInt(timePart.split(':')[0]) : 0);
  const [minute,    setMinute]    = useState(timePart ? parseInt(timePart.split(':')[1] ?? '0') : 0);

  /* Hands the current selection back as soon as it is complete. */
  const emit = (day: number | null, h: number, m: number) => {
    if (!day) return;
    const dateStr = `${viewYear}-${p2(viewMonth + 1)}-${p2(day)}`;
    onConfirm(showTime ? `${dateStr} ${p2(h)}:${p2(m)}` : dateStr);
  };

  const daysInMo   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow   = new Date(viewYear, viewMonth, 1).getDay();
  const prevMoDays = new Date(viewYear, viewMonth, 0).getDate();
  const cells: { day: number; t: 'p' | 'c' | 'n' }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevMoDays - i, t: 'p' });
  for (let d = 1; d <= daysInMo; d++)     cells.push({ day: d, t: 'c' });
  for (let nd = 1; cells.length < 42; nd++) cells.push({ day: nd, t: 'n' });

  const navMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
  };

  const ChevSvg = ({ dir }: { dir: 'l' | 'r' }) => (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none">
      <path d={dir === 'l' ? 'M13 4l-6 6 6 6' : 'M7 4l6 6-6 6'} stroke="#0e1b3d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  const TriUp = () => (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="#697498"><polygon points="5,2 9,8 1,8" /></svg>
  );
  const TriDown = () => (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="#697498"><polygon points="1,2 9,2 5,8" /></svg>
  );
  const NavBtn = ({ onClick, ch }: { onClick: () => void; ch: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
               border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4, flexShrink: 0 }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f0f4ff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
      {ch}
    </button>
  );

  const pillBtn = (label: string | number, isActive: boolean, activeBg: string, onClick: () => void) => (
    <button type="button" onClick={onClick}
      style={{
        padding: '10px 0', borderRadius: 20, border: 'none', width: '100%',
        background: isActive ? activeBg : 'transparent',
        color: isActive ? '#fff' : '#0e1b3d',
        fontWeight: isActive ? 700 : 400,
        fontSize: 14, cursor: 'pointer', transition: 'background 0.1s', fontFamily: FONT,
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#e8f0ff'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
      {label}
    </button>
  );

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y - 21) : navMonth(-1)} ch={<ChevSvg dir="l" />} />
        <button type="button"
          onClick={() => setMode(m => m === 'month' ? 'day' : 'month')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'none', cursor: 'pointer',
                   borderRadius: 16, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0e1b3d',
                   background: mode === 'month' ? '#e8ecf4' : 'transparent' }}>
          {MS[viewMonth]}{mode === 'month' ? <TriUp /> : <TriDown />}
        </button>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y + 21) : navMonth(1)} ch={<ChevSvg dir="r" />} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y - 21) : setViewYear(y => y - 1)} ch={<ChevSvg dir="l" />} />
        <button type="button"
          onClick={() => setMode(m => m === 'year' ? 'day' : 'year')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'none', cursor: 'pointer',
                   borderRadius: 16, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0e1b3d',
                   background: mode === 'year' ? '#e8ecf4' : 'transparent' }}>
          {viewYear}{mode === 'year' ? <TriUp /> : <TriDown />}
        </button>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y + 21) : setViewYear(y => y + 1)} ch={<ChevSvg dir="r" />} />
      </div>
    </div>
  );

  const monthGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px 12px' }}>
      {MS.map((m, i) => pillBtn(m, i === viewMonth, '#3a4a6b', () => { setViewMonth(i); setMode('day'); }))}
    </div>
  );

  const years = Array.from({ length: 21 }, (_, i) => yrStart + i);
  const yearGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px 8px' }}>
      {years.map(y => pillBtn(y, y === viewYear, '#5b7de8', () => { setViewYear(y); setMode('day'); }))}
    </div>
  );

  const dayGrid = (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#697498', paddingBottom: 6 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {cells.map((cell, i) => {
          const isCur = cell.t === 'c';
          const isSel = isCur && selDay === cell.day;
          return (
            <button key={i} type="button"
              onClick={() => {
                if (!isCur) return;
                setSelDay(cell.day);
                /* The pick itself is the answer — no Confirm. With a time alongside, the
                   value keeps updating as the hours and minutes are set. */
                emit(cell.day, hour, minute);
              }}
              style={{
                height: 36, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, borderRadius: '50%', border: 'none',
                background: isSel ? '#1360d2' : 'transparent',
                color: isSel ? '#fff' : isCur ? '#0e1b3d' : '#c8d0e0',
                fontWeight: isSel ? 700 : 400,
                cursor: isCur ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (isCur && !isSel) e.currentTarget.style.background = '#e8f0ff'; }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </>
  );

  const ChevDown = () => (
    <svg viewBox="0 0 20 20" width="11" height="11" fill="none">
      <path d="M5 8l5 5 5-5" stroke="#697498" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );

  const TimeSelect = ({ val, max, onChange: onChg }: { val: number; max: number; onChange: (v: number) => void }) => (
    <div style={{ position: 'relative', flex: 1 }}>
      <div style={{ border: '1px solid #d5ddfb', borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: '#0e1b3d', fontFamily: FONT }}>{p2(val)}</span>
        <ChevDown />
      </div>
      <select value={val} onChange={e => onChg(+e.target.value)}
        style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}>
        {Array.from({ length: max }, (_, i) => <option key={i} value={i}>{p2(i)}</option>)}
      </select>
    </div>
  );

  const BigTimeSelect = ({ val, max, label: tLabel, onChg }: { val: number; max: number; label: string; onChg: (v: number) => void }) => (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: '#0e1b3d', fontFamily: FONT, marginBottom: 10 }}>{tLabel}</div>
      <div style={{ position: 'relative' }}>
        <div style={{ border: '1px solid #d5ddfb', borderRadius: 8, padding: '14px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
          <span style={{ fontSize: 26, fontWeight: 700, color: '#0e1b3d', fontFamily: FONT }}>{p2(val)}</span>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none"><path d="M6 9l6 6 6-6" stroke="#697498" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <select value={val} onChange={e => onChg(+e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, width: '100%', height: '100%', cursor: 'pointer' }}>
          {Array.from({ length: max }, (_, i) => <option key={i} value={i}>{p2(i)}</option>)}
        </select>
      </div>
    </div>
  );

  if (showTime) {
    return (
      <div style={{ display: 'flex', gap: 0, fontFamily: FONT, alignItems: 'stretch' }}>
        {/* Calendar */}
        <div style={{ width: 300, flexShrink: 0 }}>
          {header}
          {mode === 'month' ? monthGrid : mode === 'year' ? yearGrid : dayGrid}
        </div>
        {/* Divider */}
        <div style={{ width: 1, background: '#e8edf5', margin: '0 24px', flexShrink: 0 }} />
        {/* Time — the value updates as it is set */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <BigTimeSelect val={hour}   max={24} label="Hours"   onChg={h => { setHour(h); emit(selDay, h, minute); }} />
            <span style={{ fontSize: 28, fontWeight: 700, color: '#0e1b3d', paddingBottom: 14, flexShrink: 0 }}>:</span>
            <BigTimeSelect val={minute} max={60} label="Minutes" onChg={m => { setMinute(m); emit(selDay, hour, m); }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: 300, fontFamily: FONT }}>
      {header}
      {mode === 'month' ? monthGrid : mode === 'year' ? yearGrid : dayGrid}
    </div>
  );
}

/* ── Reusable DateInput field ─────────────────────────────────────────────── */

const CalIcon = ({ color = '#0e1b3d' }: { color?: string }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

/**
 * DateInput — floating-label style date field that opens the custom calendar.
 * value / onChange use "YYYY-MM-DD" (date) or "YYYY-MM-DD HH:mm" (datetime) format.
 */
const XIcon = ({ onClear }: { onClear: (e: React.MouseEvent) => void }) => (
  <button
    type="button"
    onClick={onClear}
    style={{
      width: 22, height: 22, borderRadius: '50%', border: 'none',
      background: '#b0b8d0', display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', flexShrink: 0, padding: 0,
    }}>
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
      <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  </button>
);

export function DateInput({
  label,
  value,
  onChange,
  required,
  showTime = false,
  style,
  className,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  showTime?: boolean;
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  const hasVal = !!value;
  const displayVal = hasVal ? (showTime ? fmtDateTime(value) : fmtDate(value)) : '';

  /* What the user is typing, until it parses into a date. */
  const [typed, setTyped] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const shown = typed ?? displayVal;

  const commit = (text: string) => {
    if (!text.trim()) { onChange(''); setTyped(null); return; }
    const iso = parseTypedDate(text);
    if (iso) { onChange(showTime && value.includes(' ') ? `${iso} ${value.split(' ')[1]}` : iso); setTyped(null); }
    else setTyped(displayVal);   /* not a date — put the field back */
  };

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  /* floating label — sits on the border line when active, centred in field when empty */
  const floated = hasVal || open || focused || !!typed;
  const labelStyle: React.CSSProperties = {
    position: 'absolute',
    left: 10,
    top: floated ? -9 : '50%',
    transform: floated ? 'none' : 'translateY(-50%)',
    fontSize: floated ? 12 : 16,
    color: '#0e1b3d',
    pointerEvents: 'none',
    transition: 'all 0.15s',
    fontFamily: FONT,
    fontWeight: floated ? 500 : 400,
    lineHeight: 1,
    background: floated ? '#fff' : 'transparent',
    padding: floated ? '0 4px' : '0',
    zIndex: 1,
  };

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`} style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      {/* Trigger field */}
      <div
        style={{
          height: 56, border: `1px solid ${open || focused ? '#1360d2' : '#d5ddfb'}`,
          borderRadius: 4, background: disabled ? '#f2f4f8' : '#fff', display: 'flex', alignItems: 'center',
          paddingLeft: 12, paddingRight: 12, cursor: disabled ? 'not-allowed' : 'text',
          justifyContent: 'space-between', boxSizing: 'border-box',
          transition: 'border-color 0.15s', opacity: disabled ? 0.65 : 1,
        }}>
        {/* Typable — the calendar is one way in, the keyboard is the other */}
        <input
          type="text"
          value={shown}
          disabled={disabled}
          placeholder={focused ? (showTime ? 'DD-MM-YYYY HH:mm' : 'DD-MM-YYYY') : ''}
          onChange={e => setTyped(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={e => { setFocused(false); commit(e.target.value); }}
          onKeyDown={e => {
            if (e.key === 'Enter') { commit((e.target as HTMLInputElement).value); setOpen(false); }
            if (e.key === 'Escape') { setTyped(null); setOpen(false); }
          }}
          style={{
            fontSize: 16, color: '#0e1b3d', fontFamily: FONT, flex: 1, minWidth: 0,
            border: 'none', outline: 'none', background: 'transparent', padding: 0,
            cursor: disabled ? 'not-allowed' : 'text',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingBottom: 0 }}>
          {hasVal && hovered && !disabled && (
            <XIcon onClear={e => { e.stopPropagation(); onChange(''); setTyped(null); }} />
          )}
          <button type="button" aria-label={`Open ${label} calendar`} disabled={disabled}
            onClick={() => { if (!disabled) setOpen(o => !o); }}
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', cursor: disabled ? 'not-allowed' : 'pointer' }}>
            <CalIcon />
          </button>
        </div>
      </div>
      {/* Floating label */}
      <span style={labelStyle}>
        {required && <span style={{ color: '#e8212e' }}>*</span>}{label}
      </span>
      {/* Calendar popup */}
      {open && !disabled && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 600,
          background: '#fff', borderRadius: 12, border: '1px solid #e0e8f5',
          padding: 20, minWidth: showTime ? 620 : 340,
          boxShadow: '0 8px 32px rgba(14,27,61,0.16)',
        }}>
          <DateTimePicker
            value={value}
            onConfirm={v => { onChange(v); setTyped(null); if (!showTime) setOpen(false); }}
            showTime={showTime}
          />
          {hasVal && (
            <button type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                marginTop: 8, width: '100%', background: 'none', border: 'none',
                color: '#1360d2', fontSize: 13, cursor: 'pointer', fontFamily: FONT,
              }}>
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * DateInputOutlined — outlined-at-top label style (label sits on the border line).
 * Matches the CargoTransfer / inline-bordered pattern.
 */
export function DateInputOutlined({
  label,
  value,
  onChange,
  style,
  className,
  labelColor,
  font: fontOverride,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  style?: React.CSSProperties;
  className?: string;
  labelColor?: string;
  font?: string;
}) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [typed, setTyped] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const f = fontOverride ?? FONT;

  const commit = (text: string) => {
    if (!text.trim()) { onChange(''); setTyped(null); return; }
    const iso = parseTypedDate(text);
    if (iso) { onChange(iso); setTyped(null); } else setTyped(fmtDate(value));
  };

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    <div ref={wrapRef} className={`relative ${className ?? ''}`} style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div style={{
        height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`,
        borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center',
        paddingLeft: 16, paddingRight: 0, cursor: 'text', boxSizing: 'border-box',
        transition: 'border-color 0.15s',
      }}>
        <input
          type="text"
          value={typed ?? (value ? fmtDate(value) : '')}
          placeholder={focused ? 'DD-MM-YYYY' : ''}
          onChange={e => setTyped(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={e => { setFocused(false); commit(e.target.value); }}
          onKeyDown={e => {
            if (e.key === 'Enter') { commit((e.target as HTMLInputElement).value); setOpen(false); }
            if (e.key === 'Escape') { setTyped(null); setOpen(false); }
          }}
          style={{ flex: 1, minWidth: 0, fontSize: 16, color: '#051937', fontFamily: f, border: 'none', outline: 'none', background: 'transparent', padding: 0 }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingRight: 12, flexShrink: 0 }}>
          {value && hovered && (
            <XIcon onClear={e => { e.stopPropagation(); onChange(''); setTyped(null); }} />
          )}
          <button type="button" aria-label={`Open ${label} calendar`}
            onClick={() => setOpen(o => !o)}
            style={{ background: 'none', border: 'none', padding: 0, display: 'flex', cursor: 'pointer' }}>
            <CalIcon />
          </button>
        </div>
      </div>
      <label style={{
        position: 'absolute', left: 13, top: -8, background: '#fff', padding: '0 4px',
        fontSize: 12, color: labelColor ?? '#060c28', fontFamily: f, pointerEvents: 'none',
      }}>
        {label}
      </label>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 600,
          background: '#fff', borderRadius: 12, border: '1px solid #e0e8f5',
          padding: 20, minWidth: 340,
          boxShadow: '0 8px 32px rgba(14,27,61,0.16)',
        }}>
          <DateTimePicker
            value={value}
            onConfirm={v => { onChange(v); setTyped(null); setOpen(false); }}
          />
          {value && (
            <button type="button"
              onClick={() => { onChange(''); setOpen(false); }}
              style={{
                marginTop: 8, width: '100%', background: 'none', border: 'none',
                color: '#1360d2', fontSize: 13, cursor: 'pointer', fontFamily: f,
              }}>
              Clear date
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Date-range calendar (two-click range selection) ──────────────────────── */
export function DateRangeCalendar({
  fromValue,
  toValue,
  onApply,
}: {
  fromValue: string; // 'YYYY-MM-DD'
  toValue: string;   // 'YYYY-MM-DD'
  onApply: (from: string, to: string) => void;
}) {
  const today = new Date();
  const initBase = toValue ? new Date(toValue + 'T00:00') : (fromValue ? new Date(fromValue + 'T00:00') : today);
  const safeBase = isNaN(initBase.getTime()) ? today : initBase;

  const [viewYear, setViewYear] = useState(safeBase.getFullYear());
  const [viewMonth, setViewMonth] = useState(safeBase.getMonth());
  const [mode, setMode] = useState<'day' | 'month' | 'year'>('day');
  const [yrStart, setYrStart] = useState(safeBase.getFullYear() - 10);
  const [rangeStart, setRangeStart] = useState(fromValue);
  const [rangeEnd, setRangeEnd] = useState(toValue);

  const daysInMo   = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow   = new Date(viewYear, viewMonth, 1).getDay();
  const prevMoDays = new Date(viewYear, viewMonth, 0).getDate();
  const cells: { day: number; t: 'p' | 'c' | 'n' }[] = [];
  for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevMoDays - i, t: 'p' });
  for (let d = 1; d <= daysInMo; d++)     cells.push({ day: d, t: 'c' });
  for (let nd = 1; cells.length < 42; nd++) cells.push({ day: nd, t: 'n' });

  const navMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1);
    setViewMonth(d.getMonth());
    setViewYear(d.getFullYear());
  };
  const isoOf = (day: number) => `${viewYear}-${p2(viewMonth + 1)}-${p2(day)}`;

  const handleDayClick = (day: number) => {
    const iso = isoOf(day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(iso); setRangeEnd('');
    } else if (iso < rangeStart) {
      setRangeStart(iso); setRangeEnd('');
    } else {
      setRangeEnd(iso);
    }
  };

  const ChevSvg = ({ dir }: { dir: 'l' | 'r' }) => (
    <svg viewBox="0 0 20 20" width="12" height="12" fill="none">
      <path d={dir === 'l' ? 'M13 4l-6 6 6 6' : 'M7 4l6 6-6 6'} stroke="#0e1b3d" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
  const TriUp = () => (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="#697498"><polygon points="5,2 9,8 1,8" /></svg>
  );
  const TriDown = () => (
    <svg viewBox="0 0 10 10" width="9" height="9" fill="#697498"><polygon points="1,2 9,2 5,8" /></svg>
  );
  const NavBtn = ({ onClick, ch }: { onClick: () => void; ch: React.ReactNode }) => (
    <button type="button" onClick={onClick}
      style={{ width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
               border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 4, flexShrink: 0 }}
      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#f0f4ff'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
      {ch}
    </button>
  );

  const pillBtn = (label: string | number, isActive: boolean, activeBg: string, onClick: () => void) => (
    <button type="button" onClick={onClick}
      style={{
        padding: '10px 0', borderRadius: 20, border: 'none', width: '100%',
        background: isActive ? activeBg : 'transparent',
        color: isActive ? '#fff' : '#0e1b3d',
        fontWeight: isActive ? 700 : 400,
        fontSize: 14, cursor: 'pointer', transition: 'background 0.1s', fontFamily: FONT,
      }}
      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#e8f0ff'; }}
      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
      {label}
    </button>
  );

  const header = (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y - 21) : navMonth(-1)} ch={<ChevSvg dir="l" />} />
        <button type="button"
          onClick={() => setMode(m => m === 'month' ? 'day' : 'month')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'none', cursor: 'pointer',
                   borderRadius: 16, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0e1b3d',
                   background: mode === 'month' ? '#e8ecf4' : 'transparent' }}>
          {MS[viewMonth]}{mode === 'month' ? <TriUp /> : <TriDown />}
        </button>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y + 21) : navMonth(1)} ch={<ChevSvg dir="r" />} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y - 21) : setViewYear(y => y - 1)} ch={<ChevSvg dir="l" />} />
        <button type="button"
          onClick={() => setMode(m => m === 'year' ? 'day' : 'year')}
          style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', border: 'none', cursor: 'pointer',
                   borderRadius: 16, fontFamily: FONT, fontSize: 14, fontWeight: 700, color: '#0e1b3d',
                   background: mode === 'year' ? '#e8ecf4' : 'transparent' }}>
          {viewYear}{mode === 'year' ? <TriUp /> : <TriDown />}
        </button>
        <NavBtn onClick={() => mode === 'year' ? setYrStart(y => y + 21) : setViewYear(y => y + 1)} ch={<ChevSvg dir="r" />} />
      </div>
    </div>
  );

  const monthGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '4px 12px' }}>
      {MS.map((m, i) => pillBtn(m, i === viewMonth, '#3a4a6b', () => { setViewMonth(i); setMode('day'); }))}
    </div>
  );

  const years = Array.from({ length: 21 }, (_, i) => yrStart + i);
  const yearGrid = (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '4px 8px' }}>
      {years.map(y => pillBtn(y, y === viewYear, '#5b7de8', () => { setViewYear(y); setMode('day'); }))}
    </div>
  );

  const dayGrid = (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 6 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#697498', paddingBottom: 6 }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {cells.map((cell, i) => {
          const isCur = cell.t === 'c';
          const iso = isCur ? isoOf(cell.day) : '';
          const inRange = isCur && !!rangeStart && iso >= rangeStart && iso <= (rangeEnd || rangeStart);
          return (
            <button key={i} type="button"
              onClick={() => { if (isCur) handleDayClick(cell.day); }}
              style={{
                height: 36, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, borderRadius: '50%', border: 'none',
                background: inRange ? '#0e1b3d' : 'transparent',
                color: inRange ? '#fff' : isCur ? '#0e1b3d' : '#c8d0e0',
                fontWeight: inRange ? 700 : 400,
                cursor: isCur ? 'pointer' : 'default',
                transition: 'background 0.1s',
              }}
              onMouseEnter={e => { if (isCur && !inRange) e.currentTarget.style.background = '#e8f0ff'; }}
              onMouseLeave={e => { if (!inRange) e.currentTarget.style.background = 'transparent'; }}>
              {cell.day}
            </button>
          );
        })}
      </div>
    </>
  );

  const applyBtn = (
    <button type="button"
      onClick={() => { if (rangeStart && rangeEnd) onApply(rangeStart, rangeEnd); }}
      style={{
        width: '100%', padding: '14px 0', borderRadius: 8, marginTop: 16,
        fontSize: 15, fontWeight: 600, color: 'white', border: 'none',
        background: rangeStart && rangeEnd ? '#3a5fd9' : '#a6c2e9',
        cursor: rangeStart && rangeEnd ? 'pointer' : 'not-allowed',
        fontFamily: FONT,
      }}>
      Apply
    </button>
  );

  return (
    <div style={{ width: 300, fontFamily: FONT }}>
      {header}
      {mode === 'month' ? monthGrid : mode === 'year' ? yearGrid : dayGrid}
      {applyBtn}
    </div>
  );
}

/**
 * StatusAsOnBadge — the "Status As On {from} To {to} [Modify]" pill used across
 * several listing pages. Clicking Modify opens a DateRangeCalendar popover;
 * picking a range and hitting Apply calls onApply with the new from/to dates.
 */
export function StatusAsOnBadge({
  fromValue,
  toValue,
  onApply,
  label = 'Status',
  disabled = false,
}: {
  fromValue: string; // 'YYYY-MM-DD'
  toValue: string;   // 'YYYY-MM-DD'
  onApply: (from: string, to: string) => void;
  label?: string;
  /** Greyed out and inert — used while the Advanced Filters panel owns the filtering. */
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  return (
    /* flexShrink:0 keeps the pill at its natural width so neighbouring controls wrap to the
       next line before it is squeezed; maxWidth caps it on very narrow screens, where the
       card grows in height (min-h, not a fixed h) so the text always stays inside it. */
    <div ref={wrapRef} style={{ position: 'relative', display: 'inline-flex', flexShrink: 0, maxWidth: '100%', opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : undefined }}>
      <div className="inline-flex items-center justify-center gap-[12px] min-h-[44px] py-[8px] px-[28px] rounded-[10px] border border-[#e2e8f5] bg-white text-[16px] text-[#0e1b3d]" style={{ fontFamily: FONT }}>
        <span style={{ fontWeight: 500 }}>{label} As On {fmtDate(fromValue)} To {fmtDate(toValue)}</span>
        <button type="button" onClick={() => setOpen(o => !o)}
          className="text-[#1360d2] font-medium hover:opacity-70 flex items-center gap-[8px] flex-shrink-0 whitespace-nowrap">
          Modify
          {/* Calendar — trailing the label, in place of the old pencil. */}
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#5b8def" strokeWidth="1.7" style={{ flexShrink: 0 }}>
            <rect x="2.5" y="4" width="15" height="13.5" rx="2.5" />
            <path d="M2.5 8.5h15M6.5 2v3.5M13.5 2v3.5" strokeLinecap="round" />
            <rect x="12" y="12" width="3" height="3" rx="0.6" fill="#5b8def" stroke="none" />
          </svg>
        </button>
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)', zIndex: 600,
          background: '#fff', borderRadius: 12, border: '1px solid #e0e8f5',
          padding: 20, boxShadow: '0 8px 32px rgba(14,27,61,0.16)',
        }}>
          <DateRangeCalendar
            fromValue={fromValue}
            toValue={toValue}
            onApply={(from, to) => { onApply(from, to); setOpen(false); }}
          />
        </div>
      )}
    </div>
  );
}
