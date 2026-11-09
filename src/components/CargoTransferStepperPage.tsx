import React, { useState, useRef, useEffect } from 'react';
import { DateInputOutlined } from './DatePicker';

const font = "'Dubai', sans-serif";

function DirhamIcon({ size = 14, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size * 0.85} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color} />
    </svg>
  );
}

function FiEditIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M9.16797 3.33203H3.33464C2.89261 3.33203 2.46868 3.50763 2.15612 3.82019C1.84356 4.13275 1.66797 4.55667 1.66797 4.9987V16.6654C1.66797 17.1074 1.84356 17.5313 2.15612 17.8439C2.46868 18.1564 2.89261 18.332 3.33464 18.332H15.0013C15.4433 18.332 15.8673 18.1564 16.1798 17.8439C16.4924 17.5313 16.668 17.1074 16.668 16.6654V10.832" stroke="#0E1B3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15.418 2.08417C15.7495 1.75265 16.1991 1.56641 16.668 1.56641C17.1368 1.56641 17.5864 1.75265 17.918 2.08417C18.2495 2.41569 18.4357 2.86533 18.4357 3.33417C18.4357 3.80301 18.2495 4.25265 17.918 4.58417L10.0013 12.5008L6.66797 13.3342L7.5013 10.0008L15.418 2.08417Z" stroke="#0E1B3D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function PreFilledField({ label, value }: { label: string; value: string }) {
  return (
    <div className="relative">
      <div className="flex items-center px-[12px] gap-[10px]"
        style={{ height: 56, borderRadius: 4, border: '1px solid #d5ddfb', background: '#f4f4f4' }}>
        <span className="flex-1 text-[16px] text-[#0e1b3d] truncate" style={{ fontFamily: font }}>{value}</span>
        <FiEditIcon />
      </div>
      <label className="absolute pointer-events-none" style={{
        left: 12, top: -9, background: '#f4f4f4', padding: '0 4px',
        fontSize: 12, color: '#697498', fontFamily: font, whiteSpace: 'nowrap',
      }}>{label}</label>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Stepper — icon+label inline, no numbers
   ──────────────────────────────────────────────────────────── */
const CREATE_STEPS = [
  'Shipping Details',
  'Container / Package Details',
  'Documents',
  'Payment Details',
];

const AMEND_STEPS = [
  'Shipping Details',
  'Container / Package Details',
  'Documents',
  'Amendment Details',
  'Payment Details',
];

function CheckIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 14 14" width="10" height="10" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="2 7 5.5 10.5 12 3.5" />
    </svg>
  );
}

function Stepper({ current, steps }: { current: number; steps: string[] }) {
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
          <React.Fragment key={i}>
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

/* ────────────────────────────────────────────────────────────
   Shared UI helpers
   ──────────────────────────────────────────────────────────── */
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>{children}</h2>
  );
}

function GrossWeightInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <div style={{
        height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`,
        borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'stretch', overflow: 'hidden',
      }}>
        <input
          value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          type="number" min="0" placeholder=""
          className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent px-[12px]"
          style={{ fontFamily: font }}
        />
        <div style={{
          width: 64, background: '#eaeaea', borderLeft: '1px solid #eaeaea',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <span style={{ fontFamily: font, fontSize: 14, color: '#051a37', fontWeight: 400 }}>KG</span>
        </div>
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        <span style={{ color: '#dc3545' }}>*</span>{' '}Gross Weight
      </label>
    </div>
  );
}

function FloatInput({ label, required, value, onChange, readOnly, noEditIcon }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; readOnly?: boolean; noEditIcon?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  const bg = readOnly ? '#f4f4f4' : '#fff';
  return (
    <div className="relative">
      <div style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: bg, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
        <input value={value} onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          readOnly={readOnly}
          placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
        {readOnly && !noEditIcon && (
          <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M13.586 2.586a2 2 0 0 1 2.828 2.828l-9.9 9.9-4.243 1.415 1.415-4.243 9.9-9.9z" />
          </svg>
        )}
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? bg : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
    </div>
  );
}

function FloatSelect({ label, required, value, onChange, options }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center px-[12px] bg-white"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font }}>
        <span className="flex-1 text-left text-[16px]" style={{ color: value ? '#051937' : 'transparent' }}>{value || '_'}</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: open ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
      {open && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 52, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: font }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PlainSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)}
        className="w-full flex items-center px-[12px] bg-white"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font }}>
        <span className="flex-1 text-left text-[16px]" style={{ color: '#051937' }}>{value}</span>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" />
        </svg>
      </button>
      {open && (
        <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
          style={{ top: 52, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
              style={{ color: opt === value ? '#1360d2' : '#051937', fontWeight: opt === value ? 500 : 400, fontFamily: font }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DateInput({ label, required, value, onChange }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
}) {
  return (
    <DateInputOutlined
      label={required ? `* ${label}` : label}
      value={value}
      onChange={onChange}
      font={font}
    />
  );
}

function SearchInput({ label, required, value, onChange }: {
  label: string; required?: boolean; value: string; onChange?: (v: string) => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <div style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
        <input value={value} onChange={e => onChange?.(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
        <button type="button" className="flex-shrink-0 size-[22px] flex items-center justify-center">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" />
          </svg>
        </button>
      </div>
      <label className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
        fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
        transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
      }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
      </label>
    </div>
  );
}

const BIZ_SUGGESTIONS = [
  { code: 'AE1006',     name: 'Sony Gulf FZE',        expiryDate: '05-Aug-30', trnNumber: '100025424700001' },
  { code: 'AE1007',     name: 'Emirates Trading LLC', expiryDate: '12-Mar-28', trnNumber: '100025424700002' },
  { code: 'AE1008',     name: 'Dubai Cargo Co.',      expiryDate: '20-Jan-29', trnNumber: '100025424700003' },
  { code: 'AE-1019056', name: 'Dubai Trading Co. A',  expiryDate: '01-Dec-27', trnNumber: '100025424700004' },
  { code: 'AE-1019057', name: 'Dubai Trading Co. B',  expiryDate: '15-Nov-26', trnNumber: '100025424700005' },
  { code: 'AE-1019058', name: 'Dubai Trading Co. C',  expiryDate: '30-Sep-28', trnNumber: '100025424700006' },
  { code: 'AE-9106286', name: 'SW Logistics LLC',     expiryDate: '05-Aug-30', trnNumber: '100025424700009' },
  { code: 'AE-9105364', name: 'U1DETBUS',             expiryDate: '05-Aug-30', trnNumber: '100025424700009' },
];

const PREM_SUGGESTIONS = [
  { code: 'PR-00017', name: 'Raffiq premises' },
  { code: 'PR-00074', name: 'Al rafffiq' },
  { code: 'PR-00088', name: 'ALTHAFF' },
  { code: 'PR-00094', name: 'Arun Trades' },
  { code: 'PR-01522', name: 'dwc' },
  { code: 'PR-01525', name: 'freight8' },
  { code: 'PR-01581', name: 'Dubai Airport CARGO VILLAGE' },
  { code: 'PR-01582', name: 'Jebel Ali' },
];

const CARRIER_SUGGESTIONS = [
  { code: '623595', name: 'STK 1026' },
  { code: '623600', name: 'STK 1026 B' },
  { code: '623575', name: 'APL QINGDAO' },
  { code: '623608', name: 'MOL ASANTE' },
  { code: '623512', name: 'MSC DIANA' },
  { code: '623490', name: 'EVER GIVEN' },
  { code: '623455', name: 'MAERSK KENTUCKY' },
];

const PORT_SUGGESTIONS = [
  { code: 'AEDXB', name: 'Dubai International Airport' },
  { code: 'AEAUH', name: 'Abu Dhabi Airport' },
  { code: 'AESHJ', name: 'Sharjah Airport' },
  { code: 'AEJEA', name: 'Jebel Ali Port' },
  { code: 'AEKHF', name: 'Khalifa Port' },
  { code: 'SGSIN', name: 'Singapore Port' },
  { code: 'CNSHA', name: 'Shanghai Port' },
  { code: 'GBFXT', name: 'Felixstowe Port' },
];

function SearchWithNameInput({ label, required, value, onChange, suggestions, onModalOpen }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void;
  suggestions: { code: string; name: string; expiryDate?: string; trnNumber?: string }[];
  onModalOpen?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const floated = focused || value.length > 0;

  const selectedItem = suggestions.find(s => s.code === value);
  const filtered = value.length > 0 && !selectedItem
    ? suggestions.filter(s =>
        s.code.toLowerCase().includes(value.toLowerCase()) ||
        s.name.toLowerCase().includes(value.toLowerCase())
      )
    : [];

  return (
    <div className="flex flex-col gap-[4px]">
      <div className="relative">
        <div style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
          <input value={value}
            onChange={e => { onChange(e.target.value); setShowDropdown(true); }}
            onFocus={() => { setFocused(true); if (!selectedItem) setShowDropdown(true); }}
            onBlur={() => { setTimeout(() => { setFocused(false); setShowDropdown(false); }, 150); }}
            placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
          <button type="button" onClick={() => onModalOpen?.()} className="flex-shrink-0 size-[22px] flex items-center justify-center">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
              <circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" />
            </svg>
          </button>
        </div>
        <label className="absolute pointer-events-none transition-all" style={{
          left: floated ? 10 : 13, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
          background: floated ? '#fff' : 'transparent', padding: floated ? '0 3px' : '0',
          fontSize: floated ? 11 : 14, color: focused ? '#1360d2' : '#0e1b3d', fontFamily: font,
          transitionDuration: '120ms', transitionProperty: 'top, left, font-size, transform',
        }}>
          {required && <span style={{ color: '#dc3545' }}>*</span>}{required ? ' ' : ''}{label}
        </label>
        {showDropdown && filtered.length > 0 && (
          <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
            style={{ top: 52, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
            {filtered.map(item => (
              <li key={item.code}
                onMouseDown={() => { onChange(item.code); setShowDropdown(false); }}
                className="px-[12px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9] transition-colors"
                style={{ fontFamily: font }}>
                <span style={{ color: '#051937', fontWeight: 600 }}>{item.code}</span>
                <span style={{ color: '#697498' }}> — {item.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {selectedItem && (
        <div className="flex flex-col gap-[4px]">
          <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
            <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 600 }}>
              {selectedItem.name}
            </span>
          </div>
          {selectedItem.expiryDate && (
            <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
              <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 600 }}>
                Expiry Date: {selectedItem.expiryDate}
              </span>
            </div>
          )}
          {selectedItem.trnNumber && (
            <div className="px-[12px] py-[8px] rounded-[4px]" style={{ background: '#e2ebf9' }}>
              <span className="text-[16px]" style={{ color: '#051937', fontFamily: font, fontWeight: 600 }}>
                TRN Number: {selectedItem.trnNumber}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Search Modals
   ──────────────────────────────────────────────────────────── */
const BIZ_ROWS_MODAL = Array.from({ length: 8 }, (_, i) => ({
  code: `AE-${String(1019056 + i).padStart(7, '0')}`,
  name: `Dubai Trading Co. ${String.fromCharCode(65 + i)}`,
  type: 'Customs Agent',
  location: 'Jebel Ali',
  expiryDate: '01-Dec-27',
  trnNumber: `10002542470000${i + 4}`,
}));
BIZ_ROWS_MODAL.unshift({ code: 'AE1006',     name: 'Sony Gulf FZE',    type: 'Trader',          location: 'Dubai Airport', expiryDate: '05-Aug-30', trnNumber: '100025424700001' });
BIZ_ROWS_MODAL.unshift({ code: 'AE-9106286', name: 'SW Logistics LLC', type: 'Shipping Agent',  location: 'Jebel Ali',     expiryDate: '05-Aug-30', trnNumber: '100025424700009' });

const PREM_ROWS_MODAL = [
  { code: 'PR-00017', name: 'Raffiq premises',             location: 'DUBAI AIRPORT (CARGO VILLAGE)',   bizName: 'Al Raffiq Trading' },
  { code: 'PR-00074', name: 'Al rafffiq',                  location: 'DXB INTL AIRPORT PAX TERMINAL1',  bizName: 'Al Raffiq Trading' },
  { code: 'PR-00088', name: 'ALTHAFF',                     location: 'DXB INTL AIRPORT PAX TERMINAL1',  bizName: 'Al Raffiq Trading' },
  { code: 'PR-00094', name: 'Arun Trades',                 location: 'JEBEL ALI',                       bizName: 'Al Raffiq Trading' },
  { code: 'PR-01522', name: 'dwc',                         location: 'LOGISTICS DISTRICT',              bizName: 'Al Raffiq Trading' },
  { code: 'PR-01525', name: 'freight8',                    location: 'DWC AlMaktoum Cargo Terminal',    bizName: 'Al Raffiq Trading' },
  { code: 'PR-01581', name: 'Dubai Airport CARGO VILLAGE', location: 'Dubai Intl. Airport (FG 5)',      bizName: 'Al Raffiq Trading' },
  { code: 'PR-01582', name: 'Jebel Ali',                   location: 'JEBEL ALI',                      bizName: 'Al Raffiq Trading' },
];

const CARRIER_ROWS_MODAL = [
  { vesselName: 'STK 1026',        rotationNumber: '623595',    date: '20/11/2024' },
  { vesselName: 'STK 1026',        rotationNumber: '623600',    date: '20/10/2024' },
  { vesselName: 'APL QINGDAO',     rotationNumber: '623575',    date: '10/10/2024' },
  { vesselName: 'MOL ASANTE',      rotationNumber: '623608',    date: '10/09/2024' },
  { vesselName: 'MSC DIANA',       rotationNumber: '623512',    date: '05/09/2024' },
  { vesselName: 'EVER GIVEN',      rotationNumber: '623490',    date: '01/09/2024' },
  { vesselName: 'MAERSK KENTUCKY', rotationNumber: '623455',    date: '25/08/2024' },
  { vesselName: 'Al Raffiq Carrier', rotationNumber: 'AE-9876543', date: '15/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0365',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0863',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0331',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0826',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0008',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0503',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0748',    date: '18/06/2026' },
  { vesselName: 'Emirates',        rotationNumber: 'EK0720',    date: '18/06/2026' },
];

const PORT_ROWS_MODAL = [
  { code: 'AEDXB', name: 'Dubai International Airport', country: 'UAE',  type: 'Airport' },
  { code: 'AEAUH', name: 'Abu Dhabi Airport',           country: 'UAE',  type: 'Airport' },
  { code: 'AESHJ', name: 'Sharjah Airport',             country: 'UAE',  type: 'Airport' },
  { code: 'AEJEA', name: 'Jebel Ali Port',              country: 'UAE',  type: 'Seaport' },
  { code: 'AEKHF', name: 'Khalifa Port',                country: 'UAE',  type: 'Seaport' },
  { code: 'SGSIN', name: 'Singapore Port',              country: 'SGP',  type: 'Seaport' },
  { code: 'CNSHA', name: 'Shanghai Port',               country: 'CHN',  type: 'Seaport' },
  { code: 'GBFXT', name: 'Felixstowe Port',             country: 'GBR',  type: 'Seaport' },
];

function SearchModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] p-[24px] flex flex-col gap-[24px] overflow-hidden"
        style={{ width: 'min(820px,100%)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center text-[#697498] hover:text-[#0e1b3d]">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function BizSearchModal({ open, title, onClose, onSelect }: { open: boolean; title: string; onClose: () => void; onSelect: (code: string) => void }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const rows = query ? BIZ_ROWS_MODAL.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) : BIZ_ROWS_MODAL;
  const cols = ['Business Code', 'Business Name', 'Business Type', 'Location', 'Action'];
  const thS: React.CSSProperties = { background: '#a6c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' };
  return (
    <SearchModalShell title={title} onClose={onClose}>
      <div className="flex gap-[12px] flex-shrink-0">
        <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by code or name"
            className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent" style={{ fontFamily: font, opacity: query ? 1 : 0.5 }} />
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-[8px]">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
          <thead><tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                {[row.code, row.name, row.type, row.location].map((v, j) => (
                  <td key={j} style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 14, color: '#0e1b3d' }}>{v}</td>
                ))}
                <td style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                  <button onClick={() => { onSelect(row.code); onClose(); }} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SearchModalShell>
  );
}

function PremSearchModal({ open, title, onClose, onSelect }: { open: boolean; title: string; onClose: () => void; onSelect: (code: string) => void }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const rows = query ? PREM_ROWS_MODAL.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) : PREM_ROWS_MODAL;
  const cols = ['Premises Code', 'Premises Name', 'Customs Location', 'Business Name', 'Action'];
  const thS: React.CSSProperties = { background: '#a6c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' };
  return (
    <SearchModalShell title={title} onClose={onClose}>
      <div className="flex gap-[12px] flex-shrink-0">
        <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by code or name"
            className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent" style={{ fontFamily: font, opacity: query ? 1 : 0.5 }} />
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-[8px]">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
          <thead><tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                {[row.code, row.name, row.location, row.bizName].map((v, j) => (
                  <td key={j} style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 14, color: '#0e1b3d' }}>{v}</td>
                ))}
                <td style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                  <button onClick={() => { onSelect(row.code); onClose(); }} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SearchModalShell>
  );
}

const CALLING_PORTS = ['Jebel Ali Port', 'Dubai International Airport', 'Abu Dhabi Airport', 'Sharjah Airport', 'Khalifa Port'];

function CarrierSearchModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (rotationNumber: string, vesselName: string) => void }) {
  const [vesselName, setVesselName] = useState('');
  const [callingPort, setCallingPort] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [portOpen, setPortOpen] = useState(false);
  const filtered = CARRIER_ROWS_MODAL.filter(r =>
    (!vesselName || r.vesselName.toLowerCase().includes(vesselName.toLowerCase())) &&
    (!callingPort || true)
  );

  const handleReset = () => { setVesselName(''); setCallingPort(''); setFromDate(''); setToDate(''); };

  if (!open) return null;
  const thS: React.CSSProperties = { background: '#a6c2e9', padding: '12px 18px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' };
  const tdS: React.CSSProperties = { padding: '0 18px', height: 54, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 15, color: '#0e1b3d' };
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-[16px]">
      <div className="absolute inset-0" style={{ background: 'rgba(14,27,61,0.45)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: 'min(1080px,96vw)', maxHeight: '90vh', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        {/* Dark header */}
        <div className="flex items-center justify-between px-[20px] py-[20px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
          <p className="text-[20px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Search Vessel</p>
          <button onClick={onClose} className="size-[24px] flex items-center justify-center">
            <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
        {/* Filters */}
        <div className="px-[20px] pt-[20px] pb-[8px] flex-shrink-0">
          <div className="flex flex-wrap gap-[20px] items-end">
            {/* Vessel Name */}
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#fff', display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                <input value={vesselName} onChange={e => setVesselName(e.target.value)} placeholder="Enter Vessel Name"
                  className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
              </div>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: font }}>Vessel Name</label>
            </div>
            {/* Calling Port dropdown */}
            <div className="relative" style={{ flex: '1 1 260px', minWidth: 220 }}>
              <button type="button" onClick={() => setPortOpen(o => !o)}
                className="w-full flex items-center px-[16px] bg-white"
                style={{ height: 56, border: `1px solid ${portOpen ? '#1360d2' : '#d5ddfb'}`, borderRadius: 4, fontFamily: font }}>
                <span className="flex-1 text-left text-[16px]" style={{ color: callingPort ? '#051937' : '#051937', opacity: callingPort ? 1 : 0.7 }}>{callingPort || 'Select Calling Port'}</span>
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`flex-shrink-0 transition-transform ${portOpen ? 'rotate-180' : ''}`}><path d="M5 8l5 5 5-5" /></svg>
              </button>
              <label className="absolute pointer-events-none" style={{ left: 13, top: -8, background: '#fff', padding: '0 4px', fontSize: 12, color: '#060c28', fontFamily: font }}>Calling Port</label>
              {portOpen && (
                <ul className="absolute z-[50] left-0 right-0 bg-white rounded-[6px] py-[4px]"
                  style={{ top: 60, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                  {CALLING_PORTS.map(p => (
                    <li key={p} onMouseDown={() => { setCallingPort(p); setPortOpen(false); }}
                      className="px-[16px] py-[10px] text-[16px] cursor-pointer hover:bg-[#e2ebf9]"
                      style={{ color: p === callingPort ? '#1360d2' : '#051937', fontFamily: font }}>{p}</li>
                  ))}
                </ul>
              )}
            </div>
            {/* From Date */}
            <DateInputOutlined
              label="From Date (one month)"
              value={fromDate}
              onChange={setFromDate}
              font={font}
              style={{ flex: '1 1 260px', minWidth: 220 }}
            />
            {/* To Date */}
            <DateInputOutlined
              label="To Date"
              value={toDate}
              onChange={setToDate}
              font={font}
              style={{ flex: '1 1 260px', minWidth: 220 }}
            />
            {/* Buttons */}
            <div className="flex gap-[20px] items-center">
              <button type="button" onClick={handleReset}
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, border: '1px solid #1360d2', borderRadius: 3, background: '#fff', color: '#1360d2', fontFamily: font, fontWeight: 700, fontSize: 16, minWidth: 92 }}>
                Reset
              </button>
              <button type="button"
                className="flex items-center justify-center px-[20px]"
                style={{ height: 48, borderRadius: 3, background: '#1360d2', color: '#fff', fontFamily: font, fontWeight: 500, fontSize: 16, minWidth: 134 }}>
                Apply
              </button>
            </div>
          </div>
        </div>
        {/* Table */}
        <div className="flex-1 overflow-auto px-[20px] pb-[30px]">
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
            <thead>
              <tr>
                <th style={thS}>Vessel Name</th>
                <th style={thS}>Rotation Number</th>
                <th style={thS}>Date</th>
                <th style={{ ...thS, borderRadius: '0 8px 8px 0' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, i) => (
                <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                  <td style={tdS}>{row.vesselName}</td>
                  <td style={tdS}>{row.rotationNumber}</td>
                  <td style={tdS}>{row.date}</td>
                  <td style={{ ...tdS, paddingLeft: 18 }}>
                    <button onClick={() => { onSelect(row.rotationNumber, row.vesselName); onClose(); }}
                      className="text-[16px] hover:underline" style={{ color: '#1360d2', fontFamily: font, fontWeight: 500 }}>Select</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PortSearchModal({ open, onClose, onSelect }: { open: boolean; onClose: () => void; onSelect: (code: string) => void }) {
  const [query, setQuery] = useState('');
  if (!open) return null;
  const rows = query ? PORT_ROWS_MODAL.filter(r => r.code.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) : PORT_ROWS_MODAL;
  const cols = ['Port Code', 'Port Name', 'Country', 'Type', 'Action'];
  const thS: React.CSSProperties = { background: '#a6c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', whiteSpace: 'nowrap' };
  return (
    <SearchModalShell title="Search Port of Loading" onClose={onClose}>
      <div className="flex gap-[12px] flex-shrink-0">
        <div className="flex-1 flex items-center gap-[8px] border border-[#d5ddfb] rounded-[4px] px-[12px] py-[8px]">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round"><circle cx="10.5" cy="10.5" r="7" /><path d="M16.5 16.5l4 4" /></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by code or name"
            className="flex-1 text-[16px] text-[#0e1b3d] outline-none bg-transparent" style={{ fontFamily: font, opacity: query ? 1 : 0.5 }} />
        </div>
      </div>
      <div className="flex-1 overflow-auto rounded-[8px]">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
          <thead><tr>{cols.map(c => <th key={c} style={thS}>{c}</th>)}</tr></thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-[#f0f4ff] transition-colors">
                {[row.code, row.name, row.country, row.type].map((v, j) => (
                  <td key={j} style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', fontSize: 14, color: '#0e1b3d' }}>{v}</td>
                ))}
                <td style={{ padding: '0 12px', height: 48, background: '#fff', borderBottom: '1px solid #f0f3fa', textAlign: 'center' }}>
                  <button onClick={() => { onSelect(row.code); onClose(); }} className="text-[16px] text-[#1360d2] hover:underline" style={{ fontFamily: font, fontWeight: 500 }}>Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SearchModalShell>
  );
}

const SaveExitCtx = React.createContext<(() => void) | undefined>(undefined);

function NavBar({ onBack, backLabel = 'Back', onNext, nextLabel = 'Next', centerLabel, onCenter }: {
  onBack?: () => void; backLabel?: string;
  onNext?: () => void; nextLabel?: string;
  centerLabel?: string; onCenter?: () => void;
}) {
  const onSaveExit = React.useContext(SaveExitCtx);
  return (
    <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]"
      style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
      <button data-secondary-btn onClick={onBack}
        className="h-[48px] px-[28px] rounded-[4px] text-[16px] border transition-colors"
        style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
        {backLabel}
      </button>
      <div className="flex items-center gap-[12px]">
        {onSaveExit && (
          <button data-secondary-btn onClick={onSaveExit}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] border transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
            Save and Exit
          </button>
        )}
        {centerLabel && (
          <button data-secondary-btn onClick={onCenter}
            className="h-[48px] px-[20px] rounded-[4px] text-[16px] border transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
            {centerLabel}
          </button>
        )}
        <button onClick={onNext}
          className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Modals
   ──────────────────────────────────────────────────────────── */
function ModalOverlay({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(5,25,55,0.45)' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}>{children}</div>
    </div>
  );
}

function AddPackageModal({ onClose }: { onClose: () => void }) {
  const [count, setCount] = useState('');
  const [pkgType, setPkgType] = useState('');
  const [marks, setMarks] = useState('');
  const PKG_TYPES = ['Boxes', 'Pallets', 'Bags', 'Drums', 'Rolls', 'Bundles'];
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[95vw] sm:w-[520px]" style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Add / Edit Package</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-[24px] flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 gap-[16px]">
            <FloatInput label="No. of Packages" required value={count} onChange={setCount} />
            <FloatSelect label="Package Type" required value={pkgType} onChange={setPkgType} options={PKG_TYPES} />
          </div>
          <div className="relative">
            <textarea
              value={marks} onChange={e => setMarks(e.target.value)}
              rows={3}
              placeholder=""
              className="w-full text-[16px] text-[#051937] outline-none resize-none px-[12px] pt-[20px] pb-[8px] rounded-[4px]"
              style={{ fontFamily: font, border: '1px solid #d5ddfb', background: '#fff' }}
            />
            <label className="absolute pointer-events-none text-[12px]" style={{
              left: 12, top: 8, color: '#697498', fontFamily: font,
            }}>Shipping Marks</label>
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[4px]">
            <button data-secondary-btn onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] border text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Reset
            </button>
            <button
              className="h-[40px] px-[24px] rounded-[4px] text-white text-[16px] hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function AddContainerModal({ onClose }: { onClose: () => void }) {
  const [containerNo, setContainerNo] = useState('');
  const [sealNo, setSealNo] = useState('');
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[95vw] sm:w-[560px]" style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Add / Edit Container</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-[24px] flex flex-col gap-[20px]">
          <div className="grid grid-cols-2 gap-[16px]">
            <FloatInput label="Container Number" required value={containerNo} onChange={setContainerNo} readOnly />
            <FloatInput label="Seal Number" value={sealNo} onChange={setSealNo} readOnly />
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[4px]">
            <button data-secondary-btn onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] border text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Reset
            </button>
            <button
              className="h-[40px] px-[24px] rounded-[4px] text-white text-[16px] hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Save
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 1 — General Information
   ──────────────────────────────────────────────────────────── */
function Step1({ onBack, onNext, initTransferType = '', initTransferorBiz = '', initTransferorPrem = '', initTransfereeBiz = '', initTransfereePrem = '', initClientRef = '', isAmend = false, title, stepperEl }: {
  onBack: () => void; onNext: () => void;
  initTransferType?: string; initTransferorBiz?: string; initTransferorPrem?: string;
  initTransfereeBiz?: string; initTransfereePrem?: string; initClientRef?: string;
  isAmend?: boolean;
  title?: string;
  stepperEl?: React.ReactNode;
}) {
  const [transferType, setTransferType] = useState(initTransferType);
  const [transferorBiz, setTransferorBiz] = useState(initTransferorBiz);
  const [transferorPrem, setTransferorPrem] = useState(initTransferorPrem);
  const [transfereeBiz, setTransfereeBiz] = useState(initTransfereeBiz);
  const [transfereePrem, setTransfereePrem] = useState(initTransfereePrem);
  const [clientRef, setClientRef] = useState(initClientRef);
  const [bizModal, setBizModal] = useState<null | 'transferor' | 'transferee'>(null);
  const [premModal, setPremModal] = useState<null | 'transferor' | 'transferee'>(null);

  const TYPES = [
    'From CTO to CH - Same Location', 'From CTO to CH - Different Location',
    'From CH to CH - Same Location', 'From CH to CH - Different Location',
    'From CTO to CTO - Different Location',
  ];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <BizSearchModal open={bizModal !== null} title={`Search ${bizModal === 'transferor' ? 'Transferor' : 'Transferee'} Business Code`} onClose={() => setBizModal(null)} onSelect={code => { if (bizModal === 'transferor') setTransferorBiz(code); else setTransfereeBiz(code); }} />
      <PremSearchModal open={premModal !== null} title={`Search ${premModal === 'transferor' ? 'Transferor' : 'Transferee'} Premises Code`} onClose={() => setPremModal(null)} onSelect={code => { if (premModal === 'transferor') setTransferorPrem(code); else setTransfereePrem(code); }} />
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {title && <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</h1>}
        {stepperEl && <div className="pb-[16px]">{stepperEl}</div>}
        <div className="flex flex-col gap-[24px]">

          {/* Cargo Transfer Type */}
          <div>
            <SectionHeading>Cargo Transfer Type</SectionHeading>
            <div className="bg-white rounded-[8px] p-[24px] mt-[12px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
                {isAmend
                  ? <FloatInput label="Cargo Transfer Type" value={transferType} onChange={() => {}} readOnly noEditIcon />
                  : <FloatSelect label="Cargo Transfer Type" required value={transferType} onChange={setTransferType} options={TYPES} />
                }
              </div>
            </div>
          </div>

          {/* Transferor/Transferee Details */}
          <div>
            <SectionHeading>Transferor/Transferee Details</SectionHeading>
            <div className="bg-white rounded-[8px] p-[24px] mt-[12px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-start">
                <SearchWithNameInput label="Transferor Business Code" required value={transferorBiz} onChange={setTransferorBiz} suggestions={BIZ_SUGGESTIONS} onModalOpen={() => setBizModal('transferor')} />
                <SearchWithNameInput label="Transferor Premises Code" required value={transferorPrem} onChange={setTransferorPrem} suggestions={PREM_SUGGESTIONS} onModalOpen={() => setPremModal('transferor')} />
                <SearchWithNameInput label="Transferee Business Code" required value={transfereeBiz} onChange={setTransfereeBiz} suggestions={BIZ_SUGGESTIONS} onModalOpen={() => setBizModal('transferee')} />
                <SearchWithNameInput label="Transferee Premises Code" required value={transfereePrem} onChange={setTransfereePrem} suggestions={PREM_SUGGESTIONS} onModalOpen={() => setPremModal('transferee')} />
                <FloatInput label="Client's Dec. Ref. No." required value={clientRef} onChange={setClientRef} />
              </div>
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Next" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 2 — Shipping Details
   ──────────────────────────────────────────────────────────── */
function Step2({ onBack, onNext, initCargoChannel = '', initCarrierReg = '', initMasterDoc = '', shippingSummary, onEditShipping, isAmend = false, title, stepperEl }: {
  onBack: () => void; onNext: () => void;
  initCargoChannel?: string; initCarrierReg?: string; initMasterDoc?: string;
  shippingSummary?: { label: string; value: string }[];
  onEditShipping?: () => void;
  isAmend?: boolean;
  title?: string;
  stepperEl?: React.ReactNode;
}) {
  const [inCargoChannel, setInCargoChannel] = useState(initCargoChannel);
  const [carrierReg, setCarrierReg] = useState(initCarrierReg);
  const [carrierName, setCarrierName] = useState('');
  const [arrivalDate, setArrivalDate] = useState('');
  const [masterDoc, setMasterDoc] = useState(initMasterDoc);
  const [portOfLoading, setPortOfLoading] = useState('');
  const [manifestReg, setManifestReg] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [grossWeight, setGrossWeight] = useState('');
  const [customsSealNo, setCustomsSealNo] = useState('');
  const [outCargoChannel, setOutCargoChannel] = useState('Land');
  const [carrierNo, setCarrierNo] = useState('');
  const [courierRampTransfer, setCourierRampTransfer] = useState('No');
  const [precedingClearanceNo, setPrecedingClearanceNo] = useState('');
  const [showCarrierModal, setShowCarrierModal] = useState(false);
  const [showPortModal, setShowPortModal] = useState(false);

  useEffect(() => {
    const vessel = CARRIER_ROWS_MODAL.find(r => r.rotationNumber === carrierReg);
    if (vessel) {
      setCarrierName(vessel.vesselName);
      const parts = vessel.date.split('/');
      if (parts.length === 3) setArrivalDate(`${parts[2]}-${parts[1]}-${parts[0]}`);
    }
  }, [carrierReg]);

  const CHANNELS = ['Sea', 'Air', 'Land'];
  const CARGO_TYPES = ['FCL', 'LCL'];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <CarrierSearchModal open={showCarrierModal} onClose={() => setShowCarrierModal(false)} onSelect={(rotNum, vesselName) => { setCarrierReg(rotNum); setCarrierName(vesselName); setShowCarrierModal(false); }} />
      <PortSearchModal open={showPortModal} onClose={() => setShowPortModal(false)} onSelect={code => { setPortOfLoading(code); setShowPortModal(false); }} />
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {title && <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</h1>}
        {stepperEl && <div className="pb-[16px]">{stepperEl}</div>}
        <div className="flex flex-col gap-[24px]">

          {/* Inbound Details */}
          <div>
            <SectionHeading>Inbound Details</SectionHeading>
            <div className="bg-white rounded-[8px] p-[24px] mt-[12px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-start">
                <FloatSelect label="Cargo Channel (inbound)" required value={inCargoChannel} onChange={setInCargoChannel} options={CHANNELS} />
                {initCarrierReg
                  ? <PreFilledField label="Carrier Registration No. (Inbound)" value={initCarrierReg} />
                  : <SearchWithNameInput label="Carrier Registration No. (Inbound)" required value={carrierReg} onChange={setCarrierReg} suggestions={CARRIER_SUGGESTIONS} onModalOpen={() => setShowCarrierModal(true)} />
                }
                <FloatInput label="Carrier Name" value={carrierName} onChange={setCarrierName} readOnly noEditIcon />
                <div className="relative">
                  <div style={{ height: 56, border: '1px solid #d5ddfb', borderRadius: 4, background: '#f4f4f4', display: 'flex', alignItems: 'center', padding: '0 12px' }}>
                    <input readOnly value={arrivalDate ? arrivalDate.split('-').reverse().join('/') : ''} placeholder="" className="flex-1 text-[16px] text-[#051937] outline-none bg-transparent" style={{ fontFamily: font }} />
                  </div>
                  <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#f4f4f4', padding: '0 3px', fontSize: 11, color: '#0e1b3d', fontFamily: font }}>
                    Arrival Date
                  </label>
                </div>
                {initMasterDoc
                  ? <PreFilledField label="MAWB/MBOL No." value={initMasterDoc} />
                  : <FloatInput label="MAWB/MBOL No." required value={masterDoc} onChange={setMasterDoc} />
                }
                <SearchWithNameInput label="Port of Loading" required value={portOfLoading} onChange={setPortOfLoading} suggestions={PORT_SUGGESTIONS} onModalOpen={() => setShowPortModal(true)} />
                <FloatInput label="Manifest Registration No" value={manifestReg} onChange={setManifestReg} />
              </div>
            </div>
          </div>

          {/* Cargo Details */}
          <div>
            <SectionHeading>Cargo Details</SectionHeading>
            <div className="bg-white rounded-[8px] p-[24px] mt-[12px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px]">
                <FloatSelect label="Cargo Type" required value={cargoType} onChange={setCargoType} options={CARGO_TYPES} />
                <GrossWeightInput value={grossWeight} onChange={setGrossWeight} />
                <FloatInput label="Customs Seal No." value={customsSealNo} onChange={setCustomsSealNo} />
                <FloatInput label="Preceding Clearance No." value={precedingClearanceNo} onChange={setPrecedingClearanceNo} />
              </div>
            </div>
          </div>

          {/* Outbound Details */}
          <div>
            <SectionHeading>Outbound Details</SectionHeading>
            <div className="bg-white rounded-[8px] p-[24px] mt-[12px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[20px] items-center">
                <FloatInput label="Cargo Channel" value="Land" onChange={() => {}} readOnly noEditIcon />
                <FloatInput label="Carrier No." value={carrierNo} onChange={setCarrierNo} />
                <div className="flex flex-col gap-[8px]">
                  <span className="text-[12px]" style={{ color: '#697498', fontFamily: font }}>Courier Cargo Ramp Transfer</span>
                  <div className="flex items-center gap-[24px]">
                    {['Yes', 'No'].map(opt => (
                      <label key={opt} className="flex items-center gap-[8px] cursor-pointer">
                        <div
                          onClick={() => setCourierRampTransfer(opt)}
                          className="flex-shrink-0 size-[18px] rounded-full border-[2px] flex items-center justify-center cursor-pointer"
                          style={{ borderColor: courierRampTransfer === opt ? '#1360d2' : '#d5ddfb' }}
                        >
                          {courierRampTransfer === opt && <div className="size-[8px] rounded-full bg-[#1360d2]" />}
                        </div>
                        <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Next" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 3 — Container / Package Details
   ──────────────────────────────────────────────────────────── */
const PACKAGE_ROWS = Array.from({ length: 7 }, () => ({
  packages: '1000 Packaged Goods',
  marks: 'Based on BOL no. from Manifest Data',
}));

const CONTAINER_ROWS = [
  { no: 'LILI1303120', seal: 'NA', size: '--',  type: '--' },
  { no: 'LILI1303130', seal: 'NA', size: '20',  type: 'Reefer' },
  { no: 'LILI1303140', seal: 'NA', size: '--',  type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '40',  type: 'Reefer' },
  { no: 'LILI1303120', seal: 'NA', size: '40',  type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '20',  type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '--',  type: 'Reefer' },
];

const PARTY_CARDS = [
  {
    title: 'Transferor Details',
    rows: [
      { label: 'Transferor Business Code & Name', value: 'AE12345 - Al Raffiq Trading' },
      { label: 'Transferor Premises Code & Name', value: 'A324345 - Raffiq premises' },
      { label: 'License Expires on', value: '20-11-2036' },
      { label: 'VAT TRN', value: '100123456700003', newLine: true },
    ],
  },
  {
    title: 'Transferee Details',
    rows: [
      { label: 'Transferee Business Code & Name', value: 'A1223445 - Al Raffiq Trading' },
      { label: 'Transferee Premises Code & Name', value: 'A1223445 - Al Raffiq Trading' },
      { label: 'License Expires on', value: '20-11-2036' },
      { label: 'VAT TRN', value: '100987654300003', newLine: true },
    ],
  },
  {
    title: 'Broker Details',
    rows: [
      { label: 'Broker Business Code & Name', value: 'AE-9106286 - SW Logistics LLC' },
      { label: 'License Expires on', value: '15-11-2029' },
    ],
  },
];

function EditPencilIcon() {
  return (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="18" height="18" rx="3.5" stroke="#1360d2" strokeWidth="1.4" />
      <path d="M6 14h2.5l5.5-5.5L11.5 6 6 11.5V14z" stroke="#1360d2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 7.5l2 2" stroke="#1360d2" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function GrayedSummary({ fields, onEdit }: { fields: { label: string; value: string }[]; onEdit: () => void }) {
  return (
    <div className="bg-white rounded-[8px] px-[24px] py-[20px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)', border: '1px solid #e8edf5' }}>
      <div className="flex flex-wrap gap-[20px]">
        {fields.map((f, i) => (
          <div key={i} className="relative flex-shrink-0" style={{ minWidth: 180 }}>
            <button
              onClick={onEdit}
              className="w-full flex items-center justify-between px-[12px] rounded-[4px] hover:border-[#1360d2] transition-colors"
              style={{ height: 48, background: '#f4f7fd', border: '1px solid #e2ebf9' }}>
              <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{f.value || '—'}</span>
              <span className="flex-shrink-0 ml-[8px]"><EditPencilIcon /></span>
            </button>
            <label className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#f4f7fd', padding: '0 4px', fontSize: 11, color: '#8f94ae', fontFamily: font }}>
              {f.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartyInfoCard({ items }: { items: { label: string; value: string; newLine?: boolean }[] }) {
  const mainItems = items.filter(it => !it.newLine);
  const newLineItems = items.filter(it => it.newLine);
  return (
    <div className="bg-white rounded-[8px] p-[20px] w-full" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center flex-wrap gap-y-[12px]">
        {mainItems.map((item, i) => (
          <React.Fragment key={i}>
            <div className="flex flex-col gap-[4px] px-[12px] py-[4px]">
              <span style={{ fontSize: 14, color: '#696f83', fontFamily: font, fontWeight: 400, whiteSpace: 'nowrap' }}>{item.label}</span>
              <span style={{ fontSize: 18, color: '#051937', fontFamily: font, fontWeight: 500 }}>{item.value}</span>
            </div>
            {i < mainItems.length - 1 && (
              <div style={{ width: 1, height: 40, background: '#e8edf5', flexShrink: 0 }} />
            )}
          </React.Fragment>
        ))}
      </div>
      {newLineItems.map((item, i) => (
        <React.Fragment key={i}>
          <div style={{ height: 1, background: '#e8edf5', margin: '12px 0' }} />
          <div className="flex flex-col gap-[4px] px-[12px] py-[4px]">
            <span style={{ fontSize: 14, color: '#696f83', fontFamily: font, fontWeight: 400 }}>{item.label}</span>
            <span style={{ fontSize: 18, color: '#051937', fontFamily: font, fontWeight: 500 }}>{item.value}</span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function PartyInfoSection() {
  return (
    <div className="flex flex-col gap-[20px]">
      <h2 className="text-[24px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Party Information</h2>
      <div className="flex flex-col xl:flex-row gap-[20px]">
        <div className="flex-1"><PartyInfoCard items={PARTY_CARDS[0].rows} /></div>
        <div className="flex-1"><PartyInfoCard items={PARTY_CARDS[1].rows} /></div>
      </div>
      <div className="w-full">
        <PartyInfoCard items={PARTY_CARDS[2].rows} />
      </div>
    </div>
  );
}

function BulkUploadModal({ onClose }: { onClose: () => void }) {
  const [file, setFile] = useState<string>('');
  const [dragging, setDragging] = useState(false);
  return (
    <ModalOverlay onClose={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden w-[500px] max-w-[95vw]" style={{ boxShadow: '0px 8px 40px rgba(0,0,0,0.18)' }}>
        <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
          <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>Bulk Upload</span>
          <button onClick={onClose} className="size-[28px] flex items-center justify-center rounded hover:bg-white/10">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-[24px] flex flex-col gap-[16px]">
          <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
            Upload a file (.xlsx, .csv) to auto-fill the table. Download the template to see the required format.
          </p>
          <button className="self-start text-[16px] text-[#1360d2] underline hover:opacity-80" style={{ fontFamily: font }}>
            Download Template
          </button>
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setFile(f.name); }}
            className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[40px] transition-colors"
            style={{ background: dragging ? '#e2ebf9' : '#f8fafd', border: `2px dashed ${dragging ? '#1360d2' : '#8f94ae'}` }}
          >
            <div className="size-[52px] rounded-full bg-[#e2ebf9] flex items-center justify-center">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{file || 'Drag and drop your file here or'}</p>
            {!file ? (
              <label data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[20px] py-[8px] text-[16px] text-[#1360d2] transition-colors cursor-pointer" style={{ fontFamily: font }}>
                Choose File
                <input type="file" accept=".xlsx,.csv" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setFile(f.name); }} />
              </label>
            ) : (
              <button onClick={() => setFile('')} className="text-[16px] text-[#dc3545] hover:underline" style={{ fontFamily: font }}>Remove</button>
            )}
          </div>
          <div className="flex items-center justify-end gap-[12px] pt-[4px]">
            <button data-secondary-btn onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] border text-[16px]"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Cancel
            </button>
            <button onClick={onClose}
              className="h-[40px] px-[24px] rounded-[4px] text-white text-[16px] hover:opacity-90"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Upload &amp; Fill
            </button>
          </div>
        </div>
      </div>
    </ModalOverlay>
  );
}

function Step3({ onBack, onNext, shippingSummary, onEditShipping, title, stepperEl }: {
  onBack: () => void; onNext: () => void;
  shippingSummary?: { label: string; value: string }[];
  onEditShipping?: () => void;
  title?: string;
  stepperEl?: React.ReactNode;
}) {
  const [activeTab, setActiveTab] = useState<'package' | 'container'>('package');

  // Package state
  type PkgRow = { count: string; pkgType: string; marks: string };
  const [packages, setPackages] = useState<PkgRow[]>([
    { count: '5678', pkgType: 'BLOCKS', marks: '' },
  ]);
  const [pkgCount, setPkgCount] = useState('');
  const [pkgType, setPkgType] = useState('');
  const [pkgMarks, setPkgMarks] = useState('');
  const [editPkgIdx, setEditPkgIdx] = useState<number | null>(null);

  // Container state
  type ContRow = { no: string; seal: string; size: string; contType: string };
  const [containers, setContainers] = useState<ContRow[]>([
    { no: 'ADIT1111123', seal: '', size: '40', contType: 'Special container' },
  ]);
  const [containerMode, setContainerMode] = useState<'upload' | 'manual' | null>(null);
  const [uploadedFile, setUploadedFile] = useState('');
  const [dragging, setDragging] = useState(false);
  const [contNo, setContNo] = useState('');
  const [contSeal, setContSeal] = useState('');
  const [contSize, setContSize] = useState('');
  const [contType, setContType] = useState('');
  const [editContIdx, setEditContIdx] = useState<number | null>(null);

  const PKG_TYPES = ['Boxes', 'Pallets', 'Bags', 'Drums', 'Rolls', 'Bundles', 'BLOCKS'];
  const CONT_SIZES = ['20', '40', '45'];
  const CONT_TYPES = ['Standard', 'Reefer', 'Open Top', 'Flat Rack', 'Special container'];

  const thStyle = { background: '#a6c2e9', padding: '10px 12px', textAlign: 'left' as const, fontWeight: 500 };
  const tdStyle = { background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' };
  const SortIcon = () => (
    <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
      <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
    </svg>
  );
  const EditIcon = () => (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" />
    </svg>
  );
  const DeleteIcon = () => (
    <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#dc3545" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h14M8 6V3.5a1 1 0 011-1h2a1 1 0 011 1V6M5 6l1 11a1.5 1.5 0 001.5 1.4h5A1.5 1.5 0 0014 17l1-11" />
    </svg>
  );

  const handleSavePkg = () => {
    if (!pkgCount || !pkgType) return;
    if (editPkgIdx !== null) {
      setPackages(ps => ps.map((p, i) => i === editPkgIdx ? { ...p, count: pkgCount, pkgType, marks: pkgMarks } : p));
      setEditPkgIdx(null);
    } else {
      setPackages(ps => [...ps, { count: pkgCount, pkgType, marks: pkgMarks }]);
    }
    setPkgCount(''); setPkgType(''); setPkgMarks('');
  };

  const handleEditPkg = (i: number) => {
    const p = packages[i];
    setPkgCount(p.count); setPkgType(p.pkgType); setPkgMarks(p.marks);
    setEditPkgIdx(i);
  };

  const handleSaveCont = () => {
    if (!contNo) return;
    if (editContIdx !== null) {
      setContainers(cs => cs.map((c, i) => i === editContIdx ? { no: contNo, seal: contSeal, size: '', contType: '' } : c));
      setEditContIdx(null);
    } else {
      setContainers(cs => [...cs, { no: contNo, seal: contSeal, size: '', contType: '' }]);
    }
    setContNo(''); setContSeal('');
  };

  const handleEditCont = (i: number) => {
    const c = containers[i];
    setContNo(c.no); setContSeal(c.seal);
    setEditContIdx(i);
    setContainerMode('manual');
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {title && <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</h1>}
        {stepperEl && <div className="pb-[16px]">{stepperEl}</div>}
        <div className="flex flex-col gap-[24px]">


          {/* Tabs — Figma design: two separate pill buttons */}
          <div className="flex gap-[8px]">
            <button onClick={() => setActiveTab('package')}
              className="h-[48px] px-[24px] text-[16px] rounded-[4px] transition-colors"
              style={{
                fontFamily: font, fontWeight: 500,
                background: activeTab === 'package' ? '#1360d2' : '#fff',
                color: activeTab === 'package' ? '#fff' : '#696f83',
                border: `1px solid ${activeTab === 'package' ? '#1360d2' : '#d5ddfb'}`,
                boxShadow: activeTab === 'package' ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
              }}>
              Package Details
            </button>
            <button onClick={() => setActiveTab('container')}
              className="h-[48px] px-[24px] text-[16px] rounded-[4px] transition-colors"
              style={{
                fontFamily: font, fontWeight: 500,
                background: activeTab === 'container' ? '#1360d2' : '#fff',
                color: activeTab === 'container' ? '#fff' : '#696f83',
                border: `1px solid ${activeTab === 'container' ? '#1360d2' : '#d5ddfb'}`,
                boxShadow: activeTab === 'container' ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
              }}>
              Container Details
            </button>
          </div>

          {/* Package Tab — Box 1: Add/Edit form | Box 2: Table */}
          {activeTab === 'package' && (
            <>
              {/* Box 1: Add/Edit Package Details */}
              <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
                <SectionHeading>Add / Edit Package Details</SectionHeading>
                <div className="mt-[16px] flex flex-wrap items-end gap-[16px]">
                  <div style={{ width: 180, flexShrink: 0 }}>
                    <FloatInput label="No. of Packages" required value={pkgCount} onChange={setPkgCount} />
                  </div>
                  <div style={{ width: 180, flexShrink: 0 }}>
                    <FloatSelect label="Package Type" required value={pkgType} onChange={setPkgType} options={PKG_TYPES} />
                  </div>
                  <div style={{ width: 200, flexShrink: 0 }}>
                    <FloatInput label="Shipping Marks" value={pkgMarks} onChange={setPkgMarks} />
                  </div>
                  <button
                    onClick={handleSavePkg}
                    className="h-[48px] px-[28px] rounded-[4px] text-white text-[16px] hover:opacity-90 flex-shrink-0"
                    style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                    Save
                  </button>
                </div>
              </div>

              {/* Box 2: Package table */}
              <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
                <div className="overflow-x-auto">
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                    <thead>
                      <tr>
                        {['Number of Packages', 'Shipping Marks', 'Action'].map(col => (
                          <th key={col} style={thStyle}>
                            <div className="flex items-center gap-[4px]">
                              <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{col}</span>
                              {col !== 'Action' && <SortIcon />}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {packages.map((row, i) => (
                        <tr key={i}>
                          <td style={tdStyle}>
                            <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{row.count} - {row.pkgType}</span>
                          </td>
                          <td style={tdStyle}>
                            <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{row.marks}</span>
                          </td>
                          <td style={tdStyle}>
                            <div className="flex items-center gap-[8px]">
                              <button onClick={() => handleEditPkg(i)} className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff]">
                                <DeleteIcon />
                              </button>
                              <button onClick={() => { setPackages(ps => ps.filter((_, j) => j !== i)); }} className="size-[28px] flex items-center justify-center rounded hover:bg-[#fdf2f3]">
                                <EditIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-[12px] flex items-center justify-end gap-[8px]">
                  <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Results per page:</span>
                  <div className="flex items-center border border-[#d5ddfb] rounded-[4px] px-[8px] h-[28px] gap-[4px]">
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>10</span>
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#697498" strokeWidth="2"><path d="M5 8l5 5 5-5" /></svg>
                  </div>
                  <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>1 - {packages.length} of {packages.length}</span>
                  <button className="size-[28px] flex items-center justify-center rounded border border-[#d5ddfb]">
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#697498" strokeWidth="2"><path d="M12 5l-7 5 7 5" /></svg>
                  </button>
                  <button className="size-[28px] flex items-center justify-center rounded text-[16px] text-white" style={{ background: '#1360d2', fontFamily: font }}>1</button>
                  <button className="size-[28px] flex items-center justify-center rounded border border-[#d5ddfb]">
                    <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#697498" strokeWidth="2"><path d="M8 5l7 5-7 5" /></svg>
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Container Tab */}
          {activeTab === 'container' && (
            <>
              {/* Upload / Add Manually buttons — Figma design: separate pill buttons, 48px */}
              <div className="flex gap-[8px]">
                <button
                  onClick={() => setContainerMode(containerMode === 'upload' ? null : 'upload')}
                  className="h-[48px] px-[24px] text-[16px] rounded-[4px] transition-colors"
                  style={{
                    fontFamily: font, fontWeight: 500,
                    background: containerMode === 'upload' ? '#1360d2' : '#fff',
                    color: containerMode === 'upload' ? '#fff' : '#696f83',
                    border: `1px solid ${containerMode === 'upload' ? '#1360d2' : '#d5ddfb'}`,
                    boxShadow: containerMode === 'upload' ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
                  }}>
                  Upload Text File
                </button>
                <button
                  onClick={() => setContainerMode(containerMode === 'manual' ? null : 'manual')}
                  className="h-[48px] px-[24px] text-[16px] rounded-[4px] transition-colors"
                  style={{
                    fontFamily: font, fontWeight: 500,
                    background: containerMode === 'manual' ? '#1360d2' : '#fff',
                    color: containerMode === 'manual' ? '#fff' : '#696f83',
                    border: `1px solid ${containerMode === 'manual' ? '#1360d2' : '#d5ddfb'}`,
                    boxShadow: containerMode === 'manual' ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none',
                  }}>
                  Add Manually
                </button>
              </div>

              {/* Upload panel — separate box */}
              {containerMode === 'upload' && (
                <div className="bg-white rounded-[8px] p-[24px] w-[500px] max-w-full" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
                  <div className="flex items-center justify-between mb-[8px]">
                    <SectionHeading>Upload Text File</SectionHeading>
                    <button className="text-[16px] text-[#1360d2] flex items-center gap-[6px] hover:underline" style={{ fontFamily: font }}>
                      <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3v10M6 10l4 4 4-4" /><path d="M3 16h14" />
                      </svg>
                      Download Template
                    </button>
                  </div>
                  <p className="text-[16px] text-[#697498] mb-[16px]" style={{ fontFamily: font }}>*Supported file type of .TXT max file size up to 1MB</p>
                  <div
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) setUploadedFile(f.name); }}
                    className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[40px]"
                    style={{ background: dragging ? '#e2ebf9' : '#f8fafd', border: `1px dashed ${dragging ? '#1360d2' : '#8f94ae'}` }}>
                    <div className="size-[52px] rounded-full bg-[#e2ebf9] flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 15a6 6 0 0 0-6-6M6 15a6 6 0 0 1 6-6m0 0V3m-4 4l4-4 4 4" />
                      </svg>
                    </div>
                    <p className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{uploadedFile || 'Drag and Drop or'}</p>
                    {!uploadedFile && (
                      <label data-secondary-btn className="border border-[#1360d2] rounded-[4px] px-[20px] py-[8px] text-[16px] text-[#1360d2] cursor-pointer" style={{ fontFamily: font }}>
                        Choose File
                        <input type="file" accept=".txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) setUploadedFile(f.name); }} />
                      </label>
                    )}
                    {uploadedFile && (
                      <button onClick={() => setUploadedFile('')} className="text-[16px] text-[#dc3545] hover:underline" style={{ fontFamily: font }}>Remove</button>
                    )}
                  </div>
                </div>
              )}

              {/* Manual add form — separate box */}
              {containerMode === 'manual' && (
                <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
                  <SectionHeading>Add / Edit Container Details</SectionHeading>
                  <div className="mt-[16px] flex flex-wrap items-end gap-[16px]">
                    <div style={{ width: 200, flexShrink: 0 }}>
                      <FloatInput label="Container Number" required value={contNo} onChange={setContNo} />
                    </div>
                    <div style={{ width: 200, flexShrink: 0 }}>
                      <FloatInput label="Customs Seal Number" value={contSeal} onChange={setContSeal} />
                    </div>
                    <button
                      onClick={handleSaveCont}
                      className="h-[48px] px-[28px] rounded-[4px] text-white text-[16px] hover:opacity-90 flex-shrink-0"
                      style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Container table — separate box */}
              <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
                <SectionHeading>Container Details</SectionHeading>
                <div className="mt-[16px] overflow-x-auto">
                  <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                    <thead>
                      <tr>
                        {['Container No', 'Customs Seal Number', 'Action'].map(col => (
                          <th key={col} style={thStyle}>
                            <div className="flex items-center gap-[4px]">
                              <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{col}</span>
                              {col !== 'Action' && <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round"><path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" /></svg>}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {containers.map((row, i) => (
                        <tr key={i}>
                          <td style={tdStyle}><span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{row.no}</span></td>
                          <td style={tdStyle}><span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{row.seal}</span></td>
                          <td style={tdStyle}>
                            <div className="flex items-center gap-[8px]">
                              <button onClick={() => handleEditCont(i)} className="size-[28px] flex items-center justify-center rounded hover:bg-[#fdf2f3]">
                                <DeleteIcon />
                              </button>
                              <button onClick={() => setContainers(cs => cs.filter((_, j) => j !== i))} className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff]">
                                <EditIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

          <PartyInfoSection />
        </div>
      </div>
      <NavBar onBack={onBack}
        centerLabel={activeTab === 'package' ? 'Proceed to Container Details' : undefined}
        onCenter={() => setActiveTab('container')}
        onNext={onNext} nextLabel="Proceed to Documents" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 4 — Documents
   ──────────────────────────────────────────────────────────── */
const DOC_TYPES = [
  { label: 'Supporting Documents', count: 0 },
];

const UPLOADED_ROWS = [
  { name: 'Passport Copy',                        type: 'Invoice Consumption Requ..', size: '50 MB', date: '08-12-2024' },
  { name: 'Trade License copy',                   type: 'Trade License Copy',         size: '50 MB', date: '08-12-2024' },
  { name: 'Certificate Of Origin...',             type: 'Passport Copy',              size: '50 MB', date: '08-12-2024' },
  { name: 'Organizational Structure/Profile Copy',type: 'Passport Copy',              size: '50 MB', date: '08-12-2024' },
  { name: 'Invoice Consumption Request Letter',   type: 'Cert. of Origin',            size: '50 MB', date: '08-12-2024' },
  { name: 'Laboratory 123234.pdf',                type: 'Laboratory Results',         size: '50 MB', date: '08-12-2024' },
];

function Step4({ onBack, onNext, shippingSummary, onEditShipping, title, stepperEl }: {
  onBack: () => void; onNext: () => void;
  shippingSummary?: { label: string; value: string }[];
  onEditShipping?: () => void;
  title?: string;
  stepperEl?: React.ReactNode;
}) {
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [dragging, setDragging] = useState(false);
  const TABLE_COLS = ['Document Name', 'Document Type', 'Uploaded size', 'Uploaded on', 'Action'];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {title && <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</h1>}
        {stepperEl && <div className="pb-[16px]">{stepperEl}</div>}
        <div className="flex flex-col gap-[24px]">


          <div className="flex flex-col lg:flex-row gap-[24px]">
            {/* Document Types — 66% */}
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px] w-full lg:w-[66%]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <div>
                <h2 className="text-[20px] text-[#060c28] mb-[4px]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Documents</h2>
                <p className="text-[16px] text-[#323c64]" style={{ fontFamily: font }}>
                  Select the document type and upload the file, we will share the documents with authorities.
                </p>
              </div>
              <p className="text-[15px] text-[#051937]" style={{ fontFamily: font, fontWeight: 600 }}>Dubai Customs</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
                {DOC_TYPES.map((d, i) => (
                  <label key={i} className="flex items-center gap-[10px] cursor-pointer">
                    <div onClick={() => setSelectedDoc(i)} className="flex-shrink-0 size-[18px] rounded-full border-[2px] flex items-center justify-center"
                      style={{ borderColor: selectedDoc === i ? '#1360d2' : '#d5ddfb' }}>
                      {selectedDoc === i && <div className="size-[8px] rounded-full bg-[#1360d2]" />}
                    </div>
                    <span className="text-[16px] text-[#060c28] flex-1 flex items-center gap-[6px]" style={{ fontFamily: font }}>
                      <span>{d.label}</span>
                      {d.count > 0 && <span className="text-[11px] px-[6px] py-[1px] rounded-full flex-shrink-0" style={{ background: '#c8f4d2', color: '#219653', fontFamily: font, fontWeight: 600 }}>{d.count}</span>}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Upload File — 30% */}
            <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[12px] w-full lg:w-[28%]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
              <h2 className="text-[20px] text-[#060c28]" style={{ fontFamily: font, fontWeight: 500 }}>Upload File</h2>
              <p className="text-[12px] text-[#323c64]" style={{ fontFamily: font }}>*Supported file type of .pdf, .jpg etc, max file size up to 50MB</p>
              <p className="text-[12px] text-[#323c64]" style={{ fontFamily: font }}>*Only 05 number of files are allowed</p>
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); }}
                className="flex-1 flex flex-col items-center justify-center gap-[12px] rounded-[4px] py-[32px]"
                style={{ background: '#f8fafd', border: `1px dashed ${dragging ? '#1360d2' : '#8f94ae'}` }}>
                <div className="size-[60px] rounded-full bg-[#dfe5e9] flex items-center justify-center flex-shrink-0">
                  <img src="https://www.figma.com/api/mcp/asset/9b3444cd-50cf-433e-8a19-fe7a4183e5f5" alt="" style={{ width: 32, height: 30 }} />
                </div>
                <p className="text-[16px] text-[#6d707e]" style={{ fontFamily: font }}>Drag and drop or</p>
                <button data-secondary-btn className="bg-white border border-[#1360d2] rounded-[4px] text-[16px] text-[#1360d2] capitalize"
                  style={{ width: 120, height: 48, fontFamily: font, fontWeight: 500 }}>
                  Choose File
                </button>
              </div>
            </div>
          </div>

          {/* Documents Uploaded */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: font, fontWeight: 500 }}>Documents Uploaded</h2>
            <div className="overflow-x-auto">
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
                <thead>
                  <tr>
                    {TABLE_COLS.map(col => (
                      <th key={col} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500 }}>
                        <div className="flex items-center gap-[4px]">
                          <span className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>{col}</span>
                          {col !== 'Action' && (
                            <svg viewBox="0 0 10 14" width="9" height="12" fill="none" stroke="#8f94ae" strokeWidth="1.3" strokeLinecap="round">
                              <path d="M5 1v12M2 4l3-3 3 3M2 10l3 3 3-3" />
                            </svg>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {UPLOADED_ROWS.map((row, i) => (
                    <tr key={i}>
                      {[row.name, row.type, row.size, row.date].map((val, j) => (
                        <td key={j} style={{ background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' }}>
                          <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{val}</span>
                        </td>
                      ))}
                      <td style={{ background: '#fff', padding: '10px 12px', borderBottom: '1px solid #f0f4ff' }}>
                        <div className="flex gap-[4px]">
                          <button className="size-[32px] flex items-center justify-center rounded hover:bg-[#fdf2f3]" title="Delete">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#dc3545" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
                            </svg>
                          </button>
                          <button className="size-[32px] flex items-center justify-center rounded hover:bg-[#f0f4ff]" title="Download">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 3v13M7 11l5 5 5-5" /><path d="M3 20h18" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <PartyInfoSection />

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Proceed" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 5 — Payment Details
   ──────────────────────────────────────────────────────────── */
function Step5({ onBack, onSubmit, shippingSummary, onEditShipping, title, stepperEl, isAmend, amendReason }: {
  onBack: () => void; onSubmit: () => void;
  shippingSummary?: { label: string; value: string }[];
  onEditShipping?: () => void;
  title?: string;
  stepperEl?: React.ReactNode;
  isAmend?: boolean;
  amendReason?: string;
}) {
  const [paymentMode, setPaymentMode] = useState('Credit/Debit Account');
  const [paymentRef, setPaymentRef] = useState('Account Number');
  const [depositMode, setDepositMode] = useState('Credit/Debit Account');
  const [depositRef, setDepositRef] = useState('Account Number');
  const [declared, setDeclared] = useState(false);

  const CHARGES = [
    { label: 'Registration Fee', amount: 100 },
    { label: 'Knowledge & Innovation Fee', amount: 20 },
  ];
  const PAYMENT_MODES = ['Credit/Debit Account', 'Standard Guarantee', 'Cash', 'Bank Transfer'];
  const PAYMENT_REFS = ['Account Number', 'Reference No'];

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {title && <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</h1>}
        {stepperEl && <div className="pb-[16px]">{stepperEl}</div>}
        <div className="flex flex-col gap-[24px]">


          {/* Payment table */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <h2 className="text-[20px] text-[#051937] mb-[16px]" style={{ fontFamily: font, fontWeight: 500 }}>Payments Details</h2>

            {/* Single table */}
            <div className="rounded-[8px]" style={{ border: '1px solid #c4d8f5' }}>
              {/* Single header */}
              <div className="flex" style={{ background: '#a6c2e9', borderRadius: '8px 8px 0 0' }}>
                <div className="h-[44px] flex items-center pl-[20px]" style={{ flex: '0 0 50%' }}>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Charges</span>
                </div>
                <div className="h-[44px] flex items-center pl-[8px] flex-1">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Mode</span>
                </div>
                <div className="h-[44px] flex items-center pl-[8px] flex-1">
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Reference</span>
                </div>
              </div>

              {isAmend ? (
                /* Amend mode — single Amendment charges row */
                <div className="flex flex-col lg:flex-row gap-[20px] py-[20px] bg-white">
                  <div className="w-full lg:w-[calc(50%-10px)]">
                    <div className="flex items-center h-[49px] gap-[12px] px-[12px]" style={{ background: '#eff2f7' }}>
                      <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600, width: 220 }}>Amendment charges</span>
                      <span className="flex items-center gap-[4px] text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                        <DirhamIcon size={16} color="#051937" />25.00
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <PlainSelect value={paymentMode} onChange={setPaymentMode} options={PAYMENT_MODES} />
                  </div>
                  <div className="flex-1">
                    <PlainSelect value={paymentRef} onChange={setPaymentRef} options={PAYMENT_REFS} />
                  </div>
                </div>
              ) : (
                <>
                  {/* Deposit row */}
                  <div className="flex flex-col lg:flex-row gap-[20px] py-[20px] bg-white" style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <div className="flex flex-col gap-[10px] w-full lg:w-[calc(50%-10px)]">
                      <div className="flex items-center h-[49px] gap-[12px] px-[12px]" style={{ background: '#eff2f7' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600, width: 200 }}>Deposit</span>
                        <span className="flex items-center gap-[4px] text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                          <DirhamIcon size={16} color="#051937" />10,000
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <PlainSelect value={depositMode} onChange={setDepositMode} options={PAYMENT_MODES} />
                    </div>
                    <div className="flex-1">
                      <PlainSelect value={depositRef} onChange={setDepositRef} options={PAYMENT_REFS} />
                    </div>
                  </div>
                  {/* Other Charges row */}
                  <div className="flex flex-col lg:flex-row gap-[20px] py-[20px] bg-white">
                    <div className="flex flex-col gap-[10px] w-full lg:w-[calc(50%-10px)]">
                      <div className="flex items-center h-[49px] gap-[12px] px-[12px]" style={{ background: '#eff2f7' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600, width: 200 }}>Other Charges</span>
                        <span className="flex items-center gap-[4px] text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                          <DirhamIcon size={16} color="#051937" />120
                        </span>
                      </div>
                      {CHARGES.map((c, i) => (
                        <div key={i} className="flex items-start gap-[12px] px-[12px]">
                          <span className="text-[16px] text-[#696f83]" style={{ fontFamily: font, fontWeight: 500, width: 200 }}>{c.label}</span>
                          <span className="flex items-center gap-[4px] text-[16px] text-[#051937]" style={{ fontFamily: font, fontWeight: 700 }}>
                            <DirhamIcon size={13} color="#051937" />{c.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex-1">
                      <PlainSelect value={paymentMode} onChange={setPaymentMode} options={PAYMENT_MODES} />
                    </div>
                    <div className="flex-1">
                      <PlainSelect value={paymentRef} onChange={setPaymentRef} options={PAYMENT_REFS} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Declaration */}
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 2px 8px rgba(0,0,0,0.07)' }}>
            <label className="flex items-start gap-[12px] cursor-pointer">
              <button type="button" onClick={() => setDeclared(d => !d)}
                className="flex-shrink-0 size-[20px] rounded-[3px] flex items-center justify-center mt-[2px] transition-colors"
                style={{ background: declared ? '#1360d2' : '#fff', border: `2px solid ${declared ? '#1360d2' : '#d5ddfb'}` }}>
                {declared && (
                  <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="2 6 5 9 10 3" />
                  </svg>
                )}
              </button>
              <div className="flex flex-col gap-[8px]">
                <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>
                  We, the undersigned hereby declare that the particulars given on this request are true and complete and that all the particulars have been provided and agree with the original documents. We accept full responsibility for any errors or omissions.
                </p>
                <p className="text-[16px] text-[#455174]" style={{ fontFamily: font }}>
                  We further undertake to comply with all regulations and laws that are in force in the country. Any misrepresentation may lead to legal action being taken against us.
                </p>
              </div>
            </label>
          </div>

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onSubmit} nextLabel="Proceed" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Step 5A — Amendment Details (amend flow only)
   ──────────────────────────────────────────────────────────── */
const AMENDMENT_REASONS = ['Incorrect Declaration', 'Cargo Change', 'Party Information Change', 'Other'];
const CARGO_STATUSES = ['Arrived', 'In Transit', 'Delivered', 'Held'];

const AMENDED_SUMMARY_ROWS: { attribute: string; oldValue: string; newValue: string }[] = [];

const CHARGE_ROWS = [
  { charge: 'Registration Fee', oldAmount: '40.00', newAmount: '40.00' },
  { charge: 'Declaration Amendment Charges', oldAmount: '', newAmount: '25.00' },
];

function StepAmendment({ onBack, onNext, title, stepperEl, amendReason, onAmendReasonChange }: {
  onBack: () => void; onNext: () => void; title?: string; stepperEl?: React.ReactNode;
  amendReason: string; onAmendReasonChange: (v: string) => void;
}) {
  const [cargoStatus, setCargoStatus] = useState('');

  const thStyle: React.CSSProperties = { background: '#a6c2e9', padding: '12px', textAlign: 'left', fontSize: 14, fontWeight: 500, color: '#000', fontFamily: font };
  const tdStyle: React.CSSProperties = { background: '#fff', padding: '0 12px', height: 54, borderBottom: '1px solid #f0f4ff', fontSize: 15, color: '#0e1b3d', fontFamily: font };
  const tdAltStyle: React.CSSProperties = { ...tdStyle, background: '#f5f5f5' };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-[24px]">
        {title && <h1 className="text-2xl sm:text-3xl lg:text-[28px] text-[#111838] mb-[8px]" style={{ fontFamily: font, fontWeight: 500 }}>{title}</h1>}
        {stepperEl && <div className="pb-[16px]">{stepperEl}</div>}
        <div className="flex flex-col gap-[32px]">

          {/* Amendment Details card */}
          <div className="flex flex-col gap-[12px]">
            <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Amendment Details</h2>
            <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 1px 4px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[20px]">
                <FloatSelect label="Amendment Reason" required value={amendReason} onChange={onAmendReasonChange} options={AMENDMENT_REASONS} />
                <FloatSelect label="Cargo Status" required value={cargoStatus} onChange={setCargoStatus} options={CARGO_STATUSES} />
              </div>
            </div>
          </div>

          {/* Amended Summary */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Amended Summary</h2>
            <div className="rounded-[8px] overflow-x-auto bg-[#f8fafd]">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr>
                    {['Amended Attribute', 'Old Value', 'New Value'].map(col => (
                      <th key={col} style={thStyle}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {AMENDED_SUMMARY_ROWS.length === 0 ? (
                    <tr>
                      <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#8f94ae', height: 54 }}>—</td>
                    </tr>
                  ) : AMENDED_SUMMARY_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={tdStyle}>{row.attribute}</td>
                      <td style={tdStyle}>{row.oldValue}</td>
                      <td style={tdStyle}>{row.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Charge Details */}
          <div className="flex flex-col gap-[20px]">
            <h2 className="text-[20px] text-[#051937]" style={{ fontFamily: font, fontWeight: 500 }}>Charge Details</h2>
            <div className="rounded-[8px] overflow-x-auto bg-[#f8fafd]">
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                <thead>
                  <tr>
                    {['Charge', 'Old Amount', 'New Amount'].map(col => (
                      <th key={col} style={thStyle}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CHARGE_ROWS.map((row, i) => (
                    <tr key={i}>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>{row.charge}</td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>
                        {row.oldAmount && <span className="flex items-center gap-[3px]"><DirhamIcon size={13} color="#0e1b3d" /><span className="text-[16px]">{row.oldAmount}</span></span>}
                      </td>
                      <td style={i % 2 === 0 ? tdStyle : tdAltStyle}>
                        {row.newAmount && <span className="flex items-center gap-[3px]"><DirhamIcon size={13} color="#0e1b3d" /><span className="text-[16px]">{row.newAmount}</span></span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      <NavBar onBack={onBack} onNext={onNext} nextLabel="Next" />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   Main Stepper Page
   ──────────────────────────────────────────────────────────── */
type Props = {
  onBack: () => void;
  onSubmit: () => void;
  onSaveExit?: () => void;
  mode?: 'create' | 'amend';
  initialStep?: number;
  initTransferType?: string;
  initTransferNumber?: string;
  initTransferorBiz?: string;
  initTransferorPrem?: string;
  initTransfereeBiz?: string;
  initTransfereePrem?: string;
  initClientRef?: string;
  initCargoChannel?: string;
  initCarrierReg?: string;
  initMasterDoc?: string;
};

export default function CargoTransferStepperPage({ onBack, onSubmit, onSaveExit, mode = 'create', initialStep, initTransferType, initTransferNumber, initTransferorBiz, initTransferorPrem, initTransfereeBiz, initTransfereePrem, initClientRef, initCargoChannel, initCarrierReg, initMasterDoc }: Props) {
  const isAmend = mode === 'amend';
  const steps = isAmend ? AMEND_STEPS : CREATE_STEPS;
  const [step, setStep] = useState(initialStep ?? 0);
  const next = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prev = () => setStep(s => Math.max(s - 1, 0));
  const [amendReason, setAmendReason] = useState('');

  const shippingSummary = [
    { label: 'Cargo Transfer Type', value: initTransferType || '' },
    { label: 'Cargo Channel (inbound)', value: initCargoChannel || '' },
    { label: 'Client Doc. Ref. Number', value: initClientRef || '' },
    { label: 'Carrier Registration No.(inbound)', value: initCarrierReg || '' },
    { label: 'MAWB/MBOL No.', value: initMasterDoc || '' },
  ].filter(f => f.value);

  return (
    <div className="flex flex-col h-full bg-[#f8fafd] overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[20px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      {/* Step content */}
      <SaveExitCtx.Provider value={!isAmend ? onSaveExit : undefined}>
        <div className="flex-1 overflow-hidden flex flex-col">
          {(() => {
            const title = isAmend
              ? `Amend - ${initTransferType || 'Cargo Transfer'}${initTransferNumber ? ` - ${initTransferNumber}` : ''}`
              : `Cargo Transfer - ${initTransferType || 'New Request'}`;
            const stepperEl = <Stepper current={step} steps={steps} />;
            return (
              <>
                {step === 0 && <Step2 onBack={onBack} onNext={next} initCargoChannel={initCargoChannel} initCarrierReg={initCarrierReg} initMasterDoc={initMasterDoc} shippingSummary={shippingSummary} onEditShipping={onBack} isAmend={isAmend} title={title} stepperEl={stepperEl} />}
                {step === 1 && <Step3 onBack={prev} onNext={next} shippingSummary={shippingSummary} onEditShipping={() => setStep(0)} title={title} stepperEl={stepperEl} />}
                {step === 2 && <Step4 onBack={prev} onNext={next} shippingSummary={shippingSummary} onEditShipping={() => setStep(0)} title={title} stepperEl={stepperEl} />}
                {step === 3 && isAmend && <StepAmendment onBack={prev} onNext={next} title={title} stepperEl={stepperEl} amendReason={amendReason} onAmendReasonChange={setAmendReason} />}
                {step === 3 && !isAmend && <Step5 onBack={prev} onSubmit={onSubmit} shippingSummary={shippingSummary} onEditShipping={() => setStep(0)} title={title} stepperEl={stepperEl} />}
                {step === 4 && isAmend && <Step5 onBack={prev} onSubmit={onSubmit} shippingSummary={shippingSummary} onEditShipping={() => setStep(0)} title={title} stepperEl={stepperEl} isAmend amendReason={amendReason} />}
              </>
            );
          })()}
        </div>
      </SaveExitCtx.Provider>
    </div>
  );
}
