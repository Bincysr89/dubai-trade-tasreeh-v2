import React from 'react';
import { ColumnFilter } from '../ColumnFilter';

export const editSrc = new URL('../../assets/declaration/fi-edit.svg', import.meta.url).href;
export const searchSrc = new URL('../../assets/declaration/search-24px.svg', import.meta.url).href;
export const chevronSrc = new URL('../../assets/declaration/keyboard-arrow-down.svg', import.meta.url).href;
export const helpSrc = new URL('../../assets/declaration/help-outline.svg', import.meta.url).href;
export const todaySrc = new URL('../../assets/declaration/today-24px.svg', import.meta.url).href;
const stepDoneSrc = new URL('../../assets/declaration/step-check.svg', import.meta.url).href;
const stepTodoSrc = new URL('../../assets/declaration/step-inactive.svg', import.meta.url).href;

export const font = "'Dubai', sans-serif";

export const JOURNEY_STEPS = [
  'General Information',
  'Shipment Details',
  'Invoice Details',
  'Document Upload',
  'Payment Details',
];

/** The amend journey adds Documents and an Amendment Summary — Figma 2650:45705. */
export const AMEND_STEPS = [
  'General Information',
  'Shipment Details',
  'Invoice Details',
  'Documents',
  'Amendment Summary',
  'Payment Details',
];

/**
 * Journey stepper. Steps up to and including `active` are green checks; the trail leaving
 * the active step is blue (the step being worked on next), earlier trails green, later grey.
 */
export function JourneyStepper({ active, steps = JOURNEY_STEPS }: { active: number; steps?: string[] }) {
  return (
    <div className="bg-white rounded-[8px] px-[20px] py-[20px] overflow-x-auto" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      <div className="flex items-center justify-center gap-[8px]" style={{ minWidth: 'max-content' }}>
        {steps.map((label, i) => {
          const done = i <= active;
          return (
            <React.Fragment key={label}>
              {i > 0 && (
                <div className="flex-shrink-0 flex items-center" style={{ width: 88, height: 32 }}>
                  <div style={{ width: '100%', height: 2, background: i <= active ? '#28a745' : i === active + 1 ? '#0162dd' : '#a1aebe' }} />
                </div>
              )}
              <div className="flex items-start gap-[4px] py-[4px] flex-shrink-0">
                <img src={done ? stepDoneSrc : stepTodoSrc} alt="" width={24} height={24} className="flex-shrink-0" />
                <span
                  className="text-[14px] text-center whitespace-nowrap"
                  style={{ color: done ? '#219653' : '#697498', fontWeight: done ? 700 : 500 }}
                >
                  {label}
                </span>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <span
      className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
      style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}
    >
      {required && <span style={{ color: '#dc3545' }}>*</span>}
      {text}
    </span>
  );
}

export type Trailing = 'chevron' | 'search' | 'edit' | 'today' | null;

export type FieldProps = {
  value: string;
  label?: string;
  labelRequired?: boolean;
  valueRequired?: boolean;
  disabled?: boolean;
  trailing?: Trailing;
  onTrailingClick?: () => void;
  trailingLabel?: string;
  /** Blue read-back chips rendered beneath the field. */
  chips?: string[];
  /** Trailing unit selector, e.g. the KG dropdown on the weight fields. */
  unit?: string;
  className?: string;
};

export function Field({
  value, label, labelRequired, valueRequired, disabled, trailing = null,
  onTrailingClick, trailingLabel, chips, unit, className = '',
}: FieldProps) {
  const icon = trailing === 'chevron' ? chevronSrc
    : trailing === 'search' ? searchSrc
    : trailing === 'edit' ? editSrc
    : trailing === 'today' ? todaySrc
    : null;
  const iconSize = trailing === 'edit' ? 20 : 24;
  return (
    <div className={`flex flex-col gap-[5px] ${className}`} style={{ fontFamily: font }}>
      <div className="relative">
        <div
          className="flex items-center h-[56px] rounded-[4px] border border-[#d5ddfb] overflow-hidden"
          style={{ background: disabled ? '#f4f4f4' : '#ffffff' }}
        >
          <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate pl-[16px]" style={{ lineHeight: '24px' }}>
            {valueRequired && <span style={{ color: '#dc3545' }}>*</span>}
            {value}
          </span>
          {unit && (
            <span
              className="flex items-center gap-[8px] flex-shrink-0 h-full px-[8px]"
              style={{ borderLeft: '1px solid #d5ddfb' }}
            >
              <span className="text-[16px] text-[#0e1b3d]">{unit}</span>
              <img src={chevronSrc} alt="" width={24} height={24} />
            </span>
          )}
          {icon && !unit && (
            onTrailingClick ? (
              <button
                type="button"
                onClick={onTrailingClick}
                aria-label={trailingLabel}
                className="flex-shrink-0 inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors mr-[8px]"
                style={{ width: 40, height: 40 }}
              >
                <img src={icon} alt="" width={iconSize} height={iconSize} />
              </button>
            ) : (
              <img src={icon} alt="" width={iconSize} height={iconSize} className="flex-shrink-0 mr-[16px]" />
            )
          )}
        </div>
        {label && <FieldLabel text={label} required={labelRequired} />}
      </div>
      {chips?.map((c) => (
        <div key={c} className="flex items-center px-[16px] py-[5px]" style={{ background: '#e8ecff' }}>
          <span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, lineHeight: '16px' }}>{c}</span>
        </div>
      ))}
    </div>
  );
}

export function Readout({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[6px]" style={{ fontFamily: font }}>
      <span className="text-[14px] text-[#697498]">{label}</span>
      {value && <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>{value}</span>}
      {children}
    </div>
  );
}

export function SectionCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-[8px] px-[20px] py-[32px] ${className}`} style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[24px] text-[#051937]" style={{ fontWeight: 500, fontFamily: font }}>{children}</p>;
}

/** Party Information read-back — repeated verbatim across the declaration steps. */
export function PartyInformation() {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle>Party Information</SectionTitle>
      <div className="flex flex-col gap-[20px]">
        {/* Each row fills the full width: the narrow cards flex, the detail-heavy ones take more of it */}
        <div className="flex flex-wrap lg:flex-nowrap gap-[20px] items-stretch">
          <SectionCard className="flex-1 min-w-[220px]">
            <div className="flex items-center h-full">
              <Readout label="Exporter Name" value="Shaheer" />
            </div>
          </SectionCard>
          <SectionCard className="flex-[3] min-w-[280px]">
            <div className="flex flex-wrap gap-x-[48px] gap-y-[20px] items-start">
              <Readout label="Importer Name" value="Shaheer" />
              <Readout label="Importer License Expires on" value="13-03-2024">
                <div className="rounded-[4px] px-[12px] py-[10px] max-w-[320px]" style={{ background: '#fdecee' }}>
                  <p className="text-[14px]" style={{ color: '#dc3545', lineHeight: 1.45 }}>
                    (Business Registration Code is Expired. Declaration submission will not be allowed
                    after the grace period of 60 days from expiry date)
                  </p>
                </div>
              </Readout>
              <Readout label="VAT TRN" value="V1425625265" />
            </div>
          </SectionCard>
        </div>
        <div className="flex flex-wrap lg:flex-nowrap gap-[20px] items-stretch">
          <SectionCard className="flex-[2] min-w-[280px]">
            <div className="flex flex-wrap gap-x-[48px] gap-y-[20px] items-start h-full">
              <Readout label="Broker Name" value="SWBR001 M&M Private L.L.C" />
              <Readout label="Broker License Expires on" value="13-03-2024" />
            </div>
          </SectionCard>
          <SectionCard className="flex-1 min-w-[200px]"><Readout label="Notify Party Name" value="SINOTRAN S Middle East FZ" /></SectionCard>
          <SectionCard className="flex-1 min-w-[160px]"><Readout label="Cargo Handler Name" value="DPW" /></SectionCard>
          <SectionCard className="flex-1 min-w-[160px]"><Readout label="Agent Name" value="Maersk Shipping" /></SectionCard>
        </div>
      </div>
    </div>
  );
}

/** Pill tab row used by the Shipment Details step. */
export function TabBar<T extends string>({ tabs, active, onChange }: { tabs: readonly T[]; active: T; onChange: (t: T) => void }) {
  return (
    <div className="bg-white rounded-[6px] inline-flex items-center gap-[12px] p-[4px]" style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)', fontFamily: font }}>
      {tabs.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onChange(t)}
          className={`h-[40px] px-[16px] rounded-[4px] text-[16px] transition-colors ${
            t === active ? 'bg-[#1360d2] text-white' : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
          }`}
          style={{ fontWeight: 500 }}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ── Tables ──────────────────────────────────────────────────────────────
   Every table in the declaration journey wears the same chrome as the
   Refund & Claims listings: an #a6c2e9 header band with per-column filter
   handles, 16px body text on a hairline rule, and tinted status chips. */

export const TABLE_HEAD_BG = '#a6c2e9';
export const TABLE_ROW_RULE = '1px solid #f0f3fa';
export const STICKY_COL_SHADOW = '-3px 0 6px rgba(0,0,0,0.06)';

export type JourneyColumn = {
  label: string;
  w?: number;
  /** Column-filter handle next to the label; on by default. */
  filter?: boolean;
  /** Pins the column to the right edge (used by the Action columns). */
  sticky?: boolean;
};

/** Nested tables (a line item's vehicles) sit on a lighter band than their parent. */
export const TABLE_HEAD_BG_NESTED = '#cbdef3';

export function JourneyThead({ columns, headBg = TABLE_HEAD_BG }: { columns: JourneyColumn[]; headBg?: string }) {
  return (
    <thead>
      <tr>
        {columns.map((c, i) => {
          const last = i === columns.length - 1;
          return (
            <th
              key={`${c.label}-${i}`}
              style={{
                background: headBg,
                padding: '12px 12px',
                paddingLeft: i === 0 ? 16 : 12,
                textAlign: 'left',
                fontWeight: 500,
                whiteSpace: 'nowrap',
                width: c.w, minWidth: c.w,
                borderTopLeftRadius: i === 0 ? 8 : undefined,
                borderTopRightRadius: last ? 8 : undefined,
                ...(c.sticky
                  ? { position: 'sticky' as const, right: 0, zIndex: 2, boxShadow: STICKY_COL_SHADOW }
                  : null),
              }}
            >
              {c.filter === false
                ? <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>{c.label}</span>
                : <ColumnFilter label={c.label} />}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}

export function JourneyTd({ children, first, sticky, width, style }: {
  children?: React.ReactNode; first?: boolean; sticky?: boolean; width?: number; style?: React.CSSProperties;
}) {
  return (
    <td
      style={{
        background: '#fff',
        padding: '0 12px',
        paddingLeft: first ? 16 : 12,
        height: 56,
        verticalAlign: 'middle',
        borderBottom: TABLE_ROW_RULE,
        whiteSpace: 'nowrap',
        width, minWidth: width,
        ...(sticky ? { position: 'sticky' as const, right: 0, zIndex: 1, boxShadow: STICKY_COL_SHADOW } : null),
        ...style,
      }}
    >
      {typeof children === 'string' || typeof children === 'number'
        ? <span className="text-[16px] text-[#051937]" style={{ fontFamily: font }}>{children}</span>
        : children}
    </td>
  );
}

/** Scroll box + table element with the journey's shared table metrics. */
export function JourneyTable({ minWidth, children, scrollRef, onScroll }: {
  minWidth?: number; children: React.ReactNode;
  scrollRef?: React.Ref<HTMLDivElement>; onScroll?: React.UIEventHandler<HTMLDivElement>;
}) {
  return (
    <div className="overflow-x-auto" ref={scrollRef} onScroll={onScroll}>
      <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth, fontFamily: font }}>
        {children}
      </table>
    </div>
  );
}

/* Status tints are shared with the Refund & Claims tables so one status reads
   the same colour wherever it appears. */
export const STATUS_TINTS: Record<string, { bg: string; color: string }> = {
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Completed':        { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Cleared':          { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Approved':         { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Yes':              { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Suspended':        { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'Rejected':         { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'No':               { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
  'Draft':            { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'New':              { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Payment Pending':  { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Pending':          { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Registered':       { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  /* Payment outcomes, tinted as the Bill Payment listings show them. */
  'Success':          { bg: '#e6f4ec',                color: '#1b6c3a' },
  'Initiated':        { bg: '#e8f0ff',                color: '#1360d2' },
  'Failed':           { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
};

export function StatusChip({ status }: { status: string }) {
  const st = STATUS_TINTS[status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
  return (
    <span
      className="text-[16px] whitespace-nowrap inline-flex items-center justify-center"
      style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontWeight: 500, fontFamily: font }}
    >
      {status}
    </span>
  );
}
