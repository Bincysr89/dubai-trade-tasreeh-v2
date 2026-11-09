import React, { useState, useRef } from 'react';
import Header from './Header';
import Dh from './Dh';
import '../dc-form.css';

const font = "'Dubai', sans-serif";

function DirhamIcon({ size = 14, color = '#0e1b3d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 17 / 20)} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <g clipPath="url(#drhm)">
        <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="drhm"><rect width="20" height="17" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const ACTIVITY_DATA = [
  { id: 'ACT001', desc: 'Storage of goods' },
  { id: 'ACT002', desc: 'Distribution of goods' },
  { id: 'ACT003', desc: 'Consolidation of goods' },
  { id: 'ACT004', desc: 'Deconsolidation of goods' },
  { id: 'ACT005', desc: 'Cross docking' },
  { id: 'ACT006', desc: 'Value added services' },
  { id: 'ACT007', desc: 'Bonded warehousing' },
  { id: 'ACT008', desc: 'Cold storage' },
];

const HS_DATA = [
  { code: '10059010', desc: 'Golden corn, excluding seed.' },
  { code: '10059090', desc: 'Maize (corn (other than golden, white & brown corn)), excluding seed.' },
  { code: '12149090', desc: 'Swedes, mangolds, fodder roots, hay, clover, sainfoin, forage kale & similar forage products.' },
  { code: '28431000', desc: 'Colloidal precious metals (for example, gold, platinum, silver).' },
  { code: '28433000', desc: 'Gold compounds.' },
  { code: '42060000', desc: 'Articles of gut (other than silk-worm gut), of goldbeaters skin, of bladders or of tendons.' },
  { code: '71069190', desc: 'Unwrought silver (including silver plated with gold or platinum), excluding ingots.' },
  { code: '71069200', desc: 'Semi-manufactured silver (including silver plated with gold or platinum).' },
  { code: '71081100', desc: 'Non-monetary gold in powder form.' },
  { code: '71081210', desc: 'Ingots of gold, non-monetary in unwrought forms.' },
];

const BUILDING_TYPES = [
  'Multi Storey Warehouse',
  'Single Storey Warehouse',
  'Cold Storage Warehouse',
  'Bonded Warehouse',
  'Open Yard',
];

const SECURITY_TYPES = ['Physical Security', 'Civil Defense', 'Fire and Safety'];

// ─── Stepper ──────────────────────────────────────────────────────────────────
function CheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7 5.5 10.5 12 3.5" />
    </svg>
  );
}

function Stepper({ step }: { step: number }) {
  const steps = ['Company Information', 'Warehouse', 'Upload Documents'];
  const current = step - 1;
  return (
    <div className="bg-white rounded-[8px] px-4 sm:px-8 py-[16px] flex items-center flex-shrink-0 overflow-x-auto"
      style={{ boxShadow: '0px 2px 8px rgba(143,155,186,0.16)' }}>
      {steps.map((label, i) => {
        const done = i < current;
        const active = i === current;
        const circleStyle = done
          ? { background: '#219653', border: 'none' }
          : active
            ? { background: '#fff', border: '2px solid #1360d2' }
            : { background: '#fff', border: '2px solid #a1aebe' };
        const labelColor = done ? '#219653' : active ? '#1360d2' : '#a1aebe';
        const trailColor = i < current ? '#219653' : '#d5ddfb';
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-[8px] flex-shrink-0">
              <div className="size-[24px] rounded-full flex items-center justify-center flex-shrink-0" style={circleStyle}>
                <CheckIcon color={done ? '#fff' : active ? '#1360d2' : '#a1aebe'} />
              </div>
              <span className="text-[16px] whitespace-nowrap hidden sm:inline" style={{ fontFamily: font, fontWeight: 600, color: labelColor }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-[12px]" style={{ minWidth: 16, background: trailColor }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── File Upload Row ──────────────────────────────────────────────────────────
function FileUploadRow() {
  const ref = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<string[]>([]);
  const [dragging, setDragging] = useState(false);
  const add = (fl: FileList) => setFiles(p => [...p, ...Array.from(fl).map(f => f.name)]);
  const rm = (i: number) => setFiles(p => p.filter((_, j) => j !== i));
  return (
    <div>
      {files.length > 0 && (
        <div className="dc-file-grid" style={{ marginBottom: 10 }}>
          {files.map((f, i) => (
            <div key={i} className="dc-file-input-wrap">
              <svg className="dc-file-type-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1360D2" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="dc-file-input-text">{f}</span>
              <div className="dc-file-input-trail">
                <button className="dc-file-tag__remove" type="button" onClick={() => rm(i)}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        className={`dc-dropzone${dragging ? ' dc-dropzone--active' : ''}`}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); if (e.dataTransfer.files.length) add(e.dataTransfer.files); }}
      >
        <div className="dc-dropzone__icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
            <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        </div>
        <span className="dc-dropzone__text">Drag and drop files here</span>
        <span className="dc-dropzone__or">-Or-</span>
        <button className="dc-dropzone__browse" type="button" onClick={() => ref.current?.click()}>Browse File</button>
        <input ref={ref} type="file" multiple style={{ display: 'none' }}
          onChange={e => { if (e.target.files?.length) { add(e.target.files); e.target.value = ''; } }} />
      </div>
    </div>
  );
}

// ─── Shared field helper ──────────────────────────────────────────────────────
function FloatField({ label, required, value, onChange, readOnly, style }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; readOnly?: boolean; style?: React.CSSProperties;
}) {
  return (
    <div className="dc-float-wrapper dc-field--half" style={style}>
      <div className="dc-float-field">
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => onChange(e.target.value)}
          readOnly={readOnly}
          style={readOnly ? { background: '#f5f7fa', cursor: 'default', color: '#697498' } : undefined}
        />
        <label className="dc-float-label">{label}{required && <span className="dc-req"> *</span>}</label>
      </div>
    </div>
  );
}

// ─── Float Select (custom dropdown matching FloatField design) ────────────────
function FloatSelect({ label, required, value, onChange, options, style }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[]; style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);
  const hasValue = !!value;
  const active = hasValue || open;
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ ...style, position: 'relative' }}>
      <div
        className="dc-float-field"
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        tabIndex={0}
        style={{
          cursor: 'pointer', outline: 'none', boxSizing: 'border-box' as const,
          height: 56, border: `1px solid ${open ? '#1360D2' : '#D5DDFB'}`, borderRadius: 6, background: '#fff',
          boxShadow: open ? '0 0 0 2px rgba(19,96,210,0.10)' : undefined,
        }}
      >
        <div style={{ height: '100%', display: 'flex', alignItems: 'center', fontSize: 16, fontFamily: font, color: hasValue ? '#0e1b3d' : 'transparent', paddingLeft: 14, paddingRight: 36, boxSizing: 'border-box' as const }}>
          {value || ' '}
        </div>
        <label className="dc-float-label" style={active ? { pointerEvents: 'none', top: 0, transform: 'translateY(-50%)', fontSize: '12px', color: open ? '#1360D2' : '#697498', fontWeight: 500, background: '#fff', padding: '0 4px' } : { pointerEvents: 'none' }}>
          {label}{required && <span className="dc-req"> *</span>}
        </label>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none">
            <path d={open ? 'M5 12l5-5 5 5' : 'M5 8l5 5 5-5'} stroke="#697498" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300, background: '#fff', border: '1px solid #d5ddfb', borderRadius: 4, boxShadow: '0 4px 12px rgba(0,0,0,0.12)' }}>
          {options.map(opt => (
            <div key={opt} onMouseDown={() => { onChange(opt); setOpen(false); }}
              style={{ padding: '10px 14px', cursor: 'pointer', fontSize: 16, fontFamily: font, color: '#0e1b3d', borderBottom: '1px solid #f0f4ff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2ebf9')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Search Field with autocomplete ──────────────────────────────────────────
function SearchField({ label, required, value, onChange, suggestions, onSelect }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  suggestions: { id: string; desc: string }[]; onSelect: (id: string, desc: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const filtered = value
    ? suggestions.filter(s =>
        s.id.toLowerCase().includes(value.toLowerCase()) ||
        s.desc.toLowerCase().includes(value.toLowerCase())
      )
    : suggestions.slice(0, 5);
  return (
    <div className="dc-float-wrapper dc-field--half" style={{ position: 'relative' }}>
      <div className="dc-float-field" style={{ position: 'relative' }}>
        <input
          className="dc-float-input"
          placeholder=" "
          value={value}
          onChange={e => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 180)}
          style={{ paddingRight: 36 }}
        />
        <label className="dc-float-label">{label}{required && <span className="dc-req"> *</span>}</label>
        <div style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" /><path d="M17 17l4 4" strokeLinecap="round" />
          </svg>
        </div>
      </div>
      {open && filtered.length > 0 && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300,
          background: '#fff', border: '1px solid #d5ddfb', borderRadius: 4,
          boxShadow: '0 4px 12px rgba(0,0,0,0.12)', maxHeight: 220, overflowY: 'auto',
        }}>
          {filtered.map(s => (
            <div
              key={s.id}
              onMouseDown={() => { onSelect(s.id, s.desc); setOpen(false); }}
              style={{ padding: '9px 12px', cursor: 'pointer', borderBottom: '1px solid #f0f4ff', display: 'flex', gap: 10, alignItems: 'center' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2ebf9')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              <span style={{ color: '#1360D2', fontWeight: 600, fontSize: 16, minWidth: 80 }}>{s.id}</span>
              <span style={{ color: '#697498', fontSize: 16 }}>{s.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Delete icon ──────────────────────────────────────────────────────────────
function DeleteBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#697498', padding: 4 }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#697498" strokeWidth="2">
        <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      </svg>
    </button>
  );
}

// ─── Add button (same height as input fields = 56px) ─────────────────────────
function AddBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      background: '#1360D2', color: '#fff', border: 'none', borderRadius: 8,
      height: 56, padding: '0 20px', cursor: 'pointer', fontSize: 15, fontWeight: 600,
      display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
    }}>
      <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add
    </button>
  );
}

// ─── Three-dot flyout menu ───────────────────────────────────────────────────
function ThreeDotMenu({ onDelete }: { onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        onBlur={() => setTimeout(() => setOpen(false), 160)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: '50%' }}
      >
        <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
          <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
        </svg>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 30, zIndex: 200,
          background: '#fff', border: '1px solid #f0f0f5', borderRadius: 8,
          boxShadow: '0 2px 16px rgba(0,0,0,0.12)', width: 120, overflow: 'hidden',
        }}>
          {[{ label: 'Edit', action: () => setOpen(false) }, { label: 'Delete', action: onDelete }].map(item => (
            <button
              key={item.label}
              type="button"
              onMouseDown={() => { item.action(); setOpen(false); }}
              style={{ width: '100%', textAlign: 'left', padding: '9px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 15, color: '#111838', fontFamily: font }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e2ebf9')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Table head row ───────────────────────────────────────────────────────────
function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ background: '#a6c2e9' }}>
        {cols.map((c, i) => (
          <th key={i} style={{ padding: '10px 12px', textAlign: i === cols.length - 1 && c === 'Action' ? 'center' : 'left', fontWeight: 500, width: c === 'Action' ? 70 : undefined }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// ─── Success field ────────────────────────────────────────────────────────────
function SField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="dc-success-field">
      <span className="dc-success-field__label">{label}</span>
      <span className="dc-success-field__value">{value}</span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CWLFormPage({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState(1); // 1, 2, 3
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Company Information
  const [importerCode, setImporterCode] = useState('C0021 - CONSOLIDATED SHIPPING SERVICES L.L.C');
  const [creditAccount, setCreditAccount] = useState('12522');
  const [applicantName, setApplicantName] = useState('rowmahs');
  const [designation, setDesignation] = useState('manager');
  const [phoneNo, setPhoneNo] = useState('971507483292');
  const [mobileNo, setMobileNo] = useState('971507483292');
  const [faxNo, setFaxNo] = useState('0422222');
  const [applicantEmail, setApplicantEmail] = useState('dubaitradetechnicalsupport@dubaitrade.ae');
  const [accredited, setAccredited] = useState(false);

  // Step 2 — Warehouse Details
  const [warehouseNo, setWarehouseNo] = useState('');
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseLocation, setWarehouseLocation] = useState('');
  const [address, setAddress] = useState('');
  const [warehousePhone, setWarehousePhone] = useState('');
  const [faxNoW, setFaxNoW] = useState('');
  const [buildingType, setBuildingType] = useState('Multi Storey Warehouse');
  const [totalArea, setTotalArea] = useState('');

  // Warehouse list (saved warehouses)
  const [savedWarehouses, setSavedWarehouses] = useState<{ no: string; name: string; location: string; building: string; area: string }[]>([]);
  const [warehouseListMode, setWarehouseListMode] = useState(false);

  // Types of Activities
  const [activityId, setActivityId] = useState('');
  const [activityDesc, setActivityDesc] = useState('');
  const [activities, setActivities] = useState<{ id: string; desc: string }[]>([]);

  // Commodities
  const [hsCode, setHsCode] = useState('');
  const [commodityDesc, setCommodityDesc] = useState('');
  const [commodities, setCommodities] = useState<{ code: string; desc: string }[]>([]);

  // Security
  const [securityType, setSecurityType] = useState('');
  const [securityList, setSecurityList] = useState<{ type: string }[]>([]);

  // Contact Details
  const [contactName, setContactName] = useState('');
  const [contactDesig, setContactDesig] = useState('');
  const [contactMobile, setContactMobile] = useState('');
  const [contacts, setContacts] = useState<{ name: string; desig: string; mobile: string }[]>([]);

  // Banner
  const [bannerOpen, setBannerOpen] = useState(true);

  // Breadcrumb segment per step
  const stepSegments: Record<number, string> = {
    1: 'Company Information',
    2: 'Warehouse',
    3: 'Upload Documents',
  };
  const currentSegment = submitted ? 'Request Submitted' : stepSegments[step];

  // ── Add handlers ─────────────────────────────────────────────────────────────
  const addActivity = () => {
    if (!activityId && !activityDesc) return;
    setActivities(p => [...p, { id: activityId || '—', desc: activityDesc || '—' }]);
    setActivityId(''); setActivityDesc('');
  };

  const addCommodity = () => {
    if (!hsCode && !commodityDesc) return;
    setCommodities(p => [...p, { code: hsCode || '—', desc: commodityDesc || '—' }]);
    setHsCode(''); setCommodityDesc('');
  };

  const addSecurity = () => {
    if (!securityType) return;
    setSecurityList(p => [...p, { type: securityType }]);
    setSecurityType('');
  };

  const addContact = () => {
    if (!contactName && !contactDesig && !contactMobile) return;
    setContacts(p => [...p, { name: contactName || '—', desig: contactDesig || '—', mobile: contactMobile || '—' }]);
    setContactName(''); setContactDesig(''); setContactMobile('');
  };

  // ── Service Details card (step 1 only) ───────────────────────────────────────
  const ServiceDetailsCard = () => (
    <div className="dc-form-section dc-basic-info-section">
      <div className="dc-basic-info-header">
        <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Service Details</h4>
      </div>
      <div className="dc-basic-info-cards">
        <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--blue">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
                <line x1="7" y1="7" x2="7.01" y2="7" />
              </svg>
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Service Name</span>
              <span className="dc-basic-info-card__value">Custom Warehouse License</span>
            </div>
          </div>
          <div className="dc-basic-info-card" style={{ flex: 1, alignItems: 'center' }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--green">
              <Dh style={{ width: 18, height: 18 }} />
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Charges</span>
              <span className="dc-basic-info-card__value dc-basic-info-card__value--charge">25000.00</span>
            </div>
          </div>
        </div>
        <div style={{ width: '100%', display: 'flex', gap: 12, alignItems: 'stretch' }}>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--indigo">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Service Description</span>
              <span className="dc-basic-info-card__value">This service allows clients to submit a request for enrollment in Dubai Customs Client Accreditation Program.</span>
            </div>
          </div>
          <div className="dc-basic-info-card" style={{ flex: 1 }}>
            <div className="dc-basic-info-card__icon dc-basic-info-card__icon--teal">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
              </svg>
            </div>
            <div className="dc-basic-info-card__body">
              <span className="dc-basic-info-card__label">Requirements</span>
              <span className="dc-basic-info-card__value">Copy of trade license</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Step 1 content ────────────────────────────────────────────────────────────
  const Step1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="dc-form-card">
        <ServiceDetailsCard />

        {/* Company Information */}
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Company Information</h4>
          <div className="dc-form-row">
            <FloatField label="Importer Code" value={importerCode} onChange={setImporterCode} />
            <FloatField label="Credit Account Number" value={creditAccount} onChange={setCreditAccount} />
          </div>
        </div>

        {/* Particulars of Applicant */}
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Particulars of Applicant</h4>
          <div className="dc-form-row">
            <FloatField label="Name" required value={applicantName} onChange={setApplicantName} style={{ minWidth: 0 }} />
            <FloatField label="Designation" required value={designation} onChange={setDesignation} style={{ minWidth: 0 }} />
            <FloatField label="Phone No." required value={phoneNo} onChange={setPhoneNo} style={{ minWidth: 0 }} />
            <FloatField label="Mobile No." required value={mobileNo} onChange={setMobileNo} style={{ minWidth: 0 }} />
          </div>
          <div className="dc-form-row">
            <FloatField label="Fax No." required value={faxNo} onChange={setFaxNo} style={{ minWidth: 0 }} />
            <FloatField label="Email" required value={applicantEmail} onChange={setApplicantEmail} style={{ minWidth: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <input type="checkbox" checked={accredited} onChange={e => setAccredited(e.target.checked)}
              style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1360D2' }} />
            <span style={{ fontSize: 16, color: '#0E1B3D' }}>Are you an accredited client of customs</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ── Add warehouse handler ─────────────────────────────────────────────────────
  const handleAddWarehouse = () => {
    setSavedWarehouses(prev => [...prev, {
      no: warehouseNo || '—',
      name: warehouseName || '—',
      location: warehouseLocation || '—',
      building: buildingType || '—',
      area: totalArea || '—',
    }]);
    setWarehouseListMode(true);
  };

  const handleAddNewWarehouse = () => {
    setWarehouseNo(''); setWarehouseName(''); setWarehouseLocation('');
    setAddress(''); setWarehousePhone(''); setFaxNoW('');
    setBuildingType('Multi Storey Warehouse'); setTotalArea('');
    setActivities([]);
    setCommodities([]);
    setSecurityList([]);
    setContacts([]);
    setWarehouseListMode(false);
  };

  // ── Step 2 content ────────────────────────────────────────────────────────────
  const Step2 = () => {
    if (warehouseListMode) {
      return (
        <div className="dc-form-card">
          <div className="dc-form-section">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <h4 className="dc-form-section__heading" style={{ margin: 0 }}>Warehouses</h4>
              <button
                type="button"
                className="dc-btn dc-btn--blue"
                style={{ fontSize: 14, padding: '7px 18px' }}
                onClick={handleAddNewWarehouse}
              >
                + Add New Warehouse
              </button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Warehouse No.', 'Warehouse Name', 'Location', 'Action']} />
              <tbody>
                {savedWarehouses.map((w, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px' }}>{w.no}</td>
                    <td style={{ padding: '10px 12px' }}>{w.name}</td>
                    <td style={{ padding: '10px 12px' }}>{w.location}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setSavedWarehouses(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {/* Warehouse Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Warehouse Details</h4>
            <div className="dc-form-row">
              <FloatField label="Warehouse No." required value={warehouseNo} onChange={setWarehouseNo} style={{ minWidth: 0 }} />
              <FloatField label="Warehouse Name" required value={warehouseName} onChange={setWarehouseName} style={{ minWidth: 0 }} />
              <FloatField label="Warehouse Location" required value={warehouseLocation} onChange={setWarehouseLocation} style={{ minWidth: 0 }} />
              <FloatField label="Address" required value={address} onChange={setAddress} style={{ minWidth: 0 }} />
            </div>
            <div className="dc-form-row">
              <FloatField label="Phone No." required value={warehousePhone} onChange={setWarehousePhone} style={{ minWidth: 0 }} />
              <FloatField label="Fax No." required value={faxNoW} onChange={setFaxNoW} style={{ minWidth: 0 }} />
              <FloatSelect label="Building Type" required value={buildingType} onChange={setBuildingType} options={BUILDING_TYPES} style={{ minWidth: 0 }} />
              <FloatField label="Total Area (in sq ft.)" value={totalArea} onChange={setTotalArea} style={{ minWidth: 0 }} />
            </div>
          </div>
        </div>

        {/* Types of Activities */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Types of Activities</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <SearchField
                label="Activity ID"
                required
                value={activityId}
                onChange={v => { setActivityId(v); setActivityDesc(''); }}
                suggestions={ACTIVITY_DATA}
                onSelect={(id, desc) => { setActivityId(id); setActivityDesc(desc); }}
              />
              <FloatField label="Activity Description" value={activityDesc} onChange={setActivityDesc} readOnly />
              <AddBtn onClick={addActivity} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Activity ID', 'Activity Description', 'Action']} />
              <tbody>
                {activities.map((a, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{a.id}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{a.desc}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setActivities(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commodities */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Commodities</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <SearchField
                label="HS Code"
                required
                value={hsCode}
                onChange={v => { setHsCode(v); setCommodityDesc(''); }}
                suggestions={HS_DATA.map(h => ({ id: h.code, desc: h.desc }))}
                onSelect={(id, desc) => { setHsCode(id); setCommodityDesc(desc); }}
              />
              <FloatField label="Description" value={commodityDesc} onChange={setCommodityDesc} readOnly />
              <AddBtn onClick={addCommodity} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['HS Code', 'Description', 'Action']} />
              <tbody>
                {commodities.map((c, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.code}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.desc}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setCommodities(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Security & Safety Information */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Security &amp; Safety Information</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <FloatSelect
                label="Type of Security"
                required
                value={securityType}
                onChange={setSecurityType}
                options={SECURITY_TYPES}
                style={{ maxWidth: '48%', minWidth: 0 }}
              />
              <AddBtn onClick={addSecurity} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Type of Security', 'Action']} />
              <tbody>
                {securityList.map((s, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{s.type}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setSecurityList(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Details */}
        <div className="dc-form-card">
          <div className="dc-form-section">
            <h4 className="dc-form-section__heading">Contact Details</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
              <FloatField label="Name" required value={contactName} onChange={setContactName} style={{ minWidth: 0 }} />
              <FloatField label="Designation" required value={contactDesig} onChange={setContactDesig} style={{ minWidth: 0 }} />
              <FloatField label="Mobile No." required value={contactMobile} onChange={setContactMobile} style={{ minWidth: 0 }} />
              <AddBtn onClick={addContact} />
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 15 }}>
              <THead cols={['Name', 'Designation', 'Mobile No.', 'Action']} />
              <tbody>
                {contacts.map((c, i) => (
                  <tr key={i} style={{ background: '#fff', borderBottom: '1px solid #f0f4ff' }}>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.name}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.desig}</td>
                    <td style={{ padding: '10px 12px', fontSize: 15 }}>{c.mobile}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <ThreeDotMenu onDelete={() => setContacts(prev => prev.filter((_, j) => j !== i))} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ── Step 3 content ────────────────────────────────────────────────────────────
  const Step3 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="dc-form-card">
        <div className="dc-form-section">
          <h4 className="dc-form-section__heading">Attachments</h4>
          <div className="dc-field-hint" style={{ marginBottom: 12, marginTop: 0 }}>
            <svg width="15" height="15" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0 }}>
              <path d="M9.9974 13.3327V9.99935M9.9974 6.66602H10.0057M18.3307 9.99935C18.3307 14.6017 14.5998 18.3327 9.9974 18.3327C5.39502 18.3327 1.66406 14.6017 1.66406 9.99935C1.66406 5.39698 5.39502 1.66602 9.9974 1.66602C14.5998 1.66602 18.3307 5.39698 18.3307 9.99935Z"
                stroke="#5E6B7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Only .rtf .doc .docx .pdf .jpg .jpeg .gif .png .bmp .tiff allowed, max 5MB per file</span>
          </div>
          <FileUploadRow />
        </div>
      </div>
    </div>
  );

  // ── Success state (Figma node 186-7781) ──────────────────────────────────────
  const SuccessView = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '60px 40px', textAlign: 'center',
      fontFamily: font,
    }}>
      {/* Green checkmark circle */}
      <div style={{
        width: 84, height: 84, borderRadius: '50%', background: '#27AE60',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Title */}
      <h2 style={{ color: '#27AE60', fontSize: 22, fontWeight: 700, marginBottom: 32, fontFamily: font }}>
        Customs warehouse License Request submitted Successfully
      </h2>

      {/* Info card */}
      <div style={{
        background: '#fff', borderRadius: 12, padding: '32px 48px',
        maxWidth: 640, width: '100%',
        border: '1px solid #e2e8f0',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        marginBottom: 40,
      }}>
        <p style={{ color: '#697498', fontSize: 15, marginBottom: 12, fontFamily: font }}>
          Dear Customer Thank You For Using&nbsp; Service Request Web Application.
        </p>
        <p style={{ color: '#0E1B3D', fontSize: 15, fontWeight: 700, marginBottom: 12, fontFamily: font }}>
          Your Request For Customs Warehouse License Will Be Sent For Approval.
        </p>
        <p style={{ color: '#697498', fontSize: 15, marginBottom: 24, fontFamily: font }}>
          Please Find Below Details For Future Reference
        </p>
        <p style={{ color: '#0E1B3D', fontSize: 16, fontWeight: 700, fontFamily: font }}>
          Request Number: 560010545
        </p>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 20 }}>
        <button
          type="button"
          className="dc-btn dc-btn--outline"
          style={{ minWidth: 140 }}
          onClick={() => window.print()}
        >
          Print
        </button>
        <button
          type="button"
          className="dc-btn dc-btn--outline"
          style={{ minWidth: 140, color: '#1360D2', borderColor: '#1360D2', fontWeight: 700 }}
        >
          View Request
        </button>
      </div>
    </div>
  );

  // ── Bottom bars ───────────────────────────────────────────────────────────────
  const BottomBar = () => {
    if (submitted) {
      return (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center',
          padding: '14px 40px',
        }}>
          <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Listing
          </button>
        </div>
      );
    }
    if (step === 1) {
      return (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 40px',
        }}>
          <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Listing
          </button>
          <button type="button" className="dc-btn dc-btn--outline">Clear</button>
          <div style={{ flex: 1 }} />
          <button type="button" className="dc-btn dc-btn--blue" onClick={() => setStep(2)}>Proceed</button>
        </div>
      );
    }
    if (step === 2) {
      if (warehouseListMode) {
        return (
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: '#fff', borderTop: '1px solid #e2e8f0',
            boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 40px',
          }}>
            <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m19 12H5m7-7-7 7 7 7" />
              </svg>
              Back to Listing
            </button>
            <button type="button" className="dc-btn dc-btn--blue" onClick={() => setStep(3)}>Proceed</button>
          </div>
        );
      }
      return (
        <div style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          background: '#fff', borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '14px 40px',
        }}>
          <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m19 12H5m7-7-7 7 7 7" />
            </svg>
            Back to Listing
          </button>
          <button type="button" className="dc-btn dc-btn--outline">Reset</button>
          <div style={{ flex: 1 }} />
          <button type="button" className="dc-btn dc-btn--blue" onClick={handleAddWarehouse}>Add Warehouse</button>
        </div>
      );
    }
    // step === 3
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
        background: '#fff', borderTop: '1px solid #e2e8f0',
        boxShadow: '0 -2px 12px rgba(0,0,0,0.08)',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 40px',
      }}>
        <button type="button" className="dc-btn dc-btn--outline" onClick={onBack}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 12H5m7-7-7 7 7 7" />
          </svg>
          Back to Listing
        </button>
        <button type="button" className="dc-btn dc-btn--outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
          onClick={() => setStep(2)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m19 12H5m7-7-7 7 7 7" />
          </svg>
          Back
        </button>
        <div style={{ flex: 1 }} />
        <button type="button" className="dc-btn dc-btn--blue" onClick={() => setSubmitted(true)}>Submit</button>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden" style={{ background: '#f8fafd', fontFamily: font }}>
      {/* Header */}
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-10 pb-[90px]">

        {/* Breadcrumb */}
        <nav className="dc-breadcrumb">
          <span className="dc-breadcrumb__item">
            <button className="dc-breadcrumb__link" onClick={onBack}>Home</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Service Catalog</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <button className="dc-breadcrumb__link" onClick={onBack}>Custom Warehouse License</button>
          </span>
          <span className="dc-breadcrumb__item">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6" /></svg>
            <span className="dc-breadcrumb__current">{currentSegment}</span>
          </span>
        </nav>

        {/* Title */}
        <div className="dc-info-header">
          <h2 className="dc-info-header__title">Custom Warehouse License</h2>
        </div>

        {/* Stepper card */}
        {!submitted && (
          <div className="dc-form-card" style={{ marginBottom: 12 }}>
            <div className="dc-form-section" style={{ padding: '0 16px' }}>
              <Stepper step={step} />
            </div>
          </div>
        )}

        {/* Step content */}
        {submitted ? (
          <SuccessView />
        ) : step === 1 ? (
          <Step1 />
        ) : step === 2 ? (
          <Step2 />
        ) : (
          <Step3 />
        )}
      </div>

      {/* Floating bottom bar */}
      <BottomBar />
    </div>
  );
}
