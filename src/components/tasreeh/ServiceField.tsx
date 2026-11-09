import { font, GInput, GSelect, GDate, GTextArea, GMultiSelect, GAmountField } from '../gatepass/GateFields';
import { fromIso } from '../gatepass/gatePassData';
import type { FieldDef } from './serviceTypes';

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = ['00', '15', '30', '45'];
export const COUNTRY_CODES = ['+971', '+966', '+968', '+973', '+974', '+965', '+91', '+44'];

/* Phone values are stored as "+971 501234567" */
const splitPhone = (v: string) => {
  const i = v.indexOf(' ');
  return i > 0 ? [v.slice(0, i), v.slice(i + 1)] : ['+971', v];
};

/* Grid span classes — Tailwind needs the literal class names */
export const SPAN: Record<number, string> = { 1: '', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4' };
export const spanOf = (f: FieldDef) => f.span ?? (f.type === 'textarea' || f.type === 'datetime' ? 2 : 1);

/** One input, rendered with the shared Gate Pass field primitives. */
export default function ServiceField({ def, value, onChange }: { def: FieldDef; value: string; onChange: (v: string) => void }) {
  const { label, required, placeholder, options = [] } = def;
  switch (def.type) {
    case 'select':
      return <GSelect label={label} value={value} options={options} onChange={onChange} required={required} searchable={options.length > 8} />;
    case 'multiselect': {
      const vals = value ? value.split('|') : [];
      return <GMultiSelect label={label} values={vals} options={options} onChange={v => onChange(v.join('|'))} required={required} />;
    }
    case 'date':
      return <GDate label={label} value={value} onChange={onChange} required={required} />;
    case 'time': {
      const [h = '', m = ''] = value ? value.split(':') : [];
      return (
        <div className="grid grid-cols-2 gap-[12px] min-w-0">
          <GSelect label={`${label} (Hrs)`} value={h} options={HOURS} onChange={x => onChange(`${x}:${m || '00'}`)} required={required} />
          <GSelect label="Mins" value={m} options={MINUTES} onChange={x => onChange(`${h || '00'}:${x}`)} />
        </div>
      );
    }
    case 'datetime': {
      /* Stored as "YYYY-MM-DD HH:MM" — date picker + hrs + mins, as in Figma */
      const [d = '', t = ''] = value ? value.split(' ') : [];
      const [h = '', m = ''] = t ? t.split(':') : [];
      const put = (nd: string, nh: string, nm: string) => onChange(`${nd} ${nh || '00'}:${nm || '00'}`.trim());
      return (
        <div className="grid grid-cols-[2fr_1fr_1fr] gap-[12px] min-w-0">
          <GDate label={label} value={d} onChange={x => put(x, h, m)} required={required} />
          <GSelect label="Hrs" value={h} options={HOURS} onChange={x => put(d, x, m)} />
          <GSelect label="Mins" value={m} options={MINUTES} onChange={x => put(d, h, x)} />
        </div>
      );
    }
    case 'textarea':
      return <GTextArea label={label} value={value} onChange={onChange} required={required} />;
    case 'phone': {
      const [code, num] = splitPhone(value);
      return (
        <div className="flex gap-[8px] min-w-0">
          <div className="w-[118px] flex-shrink-0">
            <GSelect label="Code" value={code} options={COUNTRY_CODES} onChange={c => onChange(`${c} ${num}`)} />
          </div>
          <div className="flex-1 min-w-0">
            <GInput label={label} value={num} onChange={n => onChange(`${code} ${n.replace(/[^0-9]/g, '')}`)}
              placeholder={placeholder ?? 'mobile number'} required={required} />
          </div>
        </div>
      );
    }
    case 'number':
      return <GInput label={label} value={value} onChange={v => onChange(v.replace(/[^0-9.]/g, ''))} placeholder={placeholder} required={required} />;
    case 'readonly':
      return <GInput label={label} value={value} readOnly />;
    case 'amount':
      /* Read-only amount with the Dirham glyph */
      return <GAmountField label={label} value={value || '0.00'} />;
    case 'radio':
      return (
        <div className="flex flex-col justify-center gap-[8px] min-h-[56px]">
          <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font }}>
            {required && <span style={{ color: '#dc3545' }}>* </span>}{label}
          </span>
          <div className="flex items-center gap-[20px] flex-wrap">
            {options.map(o => (
              <label key={o} className="flex items-center gap-[8px] cursor-pointer">
                <input type="radio" checked={value === o} onChange={() => onChange(o)} className="size-[18px] cursor-pointer" style={{ accentColor: '#1360d2' }} />
                <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{o}</span>
              </label>
            ))}
          </div>
        </div>
      );
    case 'checkbox':
      return (
        <label className="flex items-center gap-[10px] cursor-pointer min-h-[56px]">
          <input type="checkbox" checked={value === 'Yes'} onChange={e => onChange(e.target.checked ? 'Yes' : '')}
            className="size-[20px] cursor-pointer" style={{ accentColor: '#1360d2' }} />
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{label}</span>
        </label>
      );
    default:
      return <GInput label={label} value={value} onChange={onChange} placeholder={placeholder} required={required} />;
  }
}

/** Display string for a stored value (view pages / tables / listing). */
export function displayValue(def: FieldDef | undefined, v: string | undefined): string {
  if (!v) return '-';
  if (!def) return v;
  if (def.type === 'date') return fromIso(v) || v;
  if (def.type === 'datetime') { const [d, t] = v.split(' '); return `${fromIso(d) || d}${t ? `, ${t}` : ''}`; }
  if (def.type === 'multiselect') return v.split('|').join(', ');
  if (def.type === 'phone') return v.trim().split(' ').length > 1 && !v.split(' ')[1] ? '-' : v;
  return v;
}
