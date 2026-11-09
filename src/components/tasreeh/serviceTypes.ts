import type { HelpContent } from '../gatepass/HelpGuides';

/* ──────────────────────────────────────────────────────────────
   Config-driven Tasreeh service engine.
   One ServiceConfig per service (Security Companies, Security
   Personnel, Security Services, ISPS, Vessel, Media) renders the
   same listing → start → form → success / draft → view flow that
   Gate Passes and Delegation Visits use.
   ────────────────────────────────────────────────────────────── */

export type FieldType =
  | 'text' | 'number' | 'select' | 'multiselect' | 'date' | 'time' | 'datetime' | 'textarea'
  | 'phone' | 'readonly' | 'amount' | 'radio' | 'checkbox';

export type FieldDef = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  /** Prefilled value (e.g. company / trade licence from the account). */
  value?: string;
  /** Helper text under the field (e.g. examples, calculation info). */
  hint?: string;
  /** Grid columns to span on large screens (1–4). Textareas / datetime default to 2. */
  span?: 1 | 2 | 3 | 4;
};

export type UploadDef = { label: string; required?: boolean };

export type SectionDef = {
  id: string;
  title: string;
  /**
   * fields     — a 4-per-row grid of inputs
   * entryTable — entry panel whose rows are saved into an "… Added" table (like visitors)
   * repeatRows — inline rows with delete + "Add More" (like vehicles)
   * uploads    — a block of individual library uploaders
   * agreements — download each template, sign it, upload it back (General Agreements)
   */
  kind: 'fields' | 'entryTable' | 'repeatRows' | 'uploads' | 'agreements' | 'payment';
  /** Info banner at the top of the card (fields sections too). */
  info?: string;
  /** Tag in the card heading, e.g. NOC Status: Valid */
  badge?: { label: string; value: string; tone: 'green' | 'amber' | 'red' | 'grey' | 'blue' };
  /** payment: amount shown with the Dirham glyph */
  amount?: string;
  /** agreements: document names; alert: info banner above them */
  agreements?: string[];
  alert?: string;
  fields?: FieldDef[];
  uploads?: UploadDef[];
  /** entryTable */
  tableTitle?: string;
  saveLabel?: string;
  /** Table columns; each joins one or more field keys (e.g. Personnel Name = first + last). */
  columns?: { label: string; keys: string[] }[];
  emptyText?: string;
  /** Sub-heading above the entry uploaders (default "Required Documents"). */
  uploadsTitle?: string;
  /** repeatRows */
  addMoreLabel?: string;
};

export type ListingColumn = { key: string; label: string; w: number };

export type ServiceConfig = {
  key: string;
  title: string;
  intro: string;
  help: HelpContent;
  /** Listing columns — keys are 'applicationNo', 'createdOn' or a field key. */
  columns: ListingColumn[];
  defaultVisible: string[];
  statusLabel?: string;
  statuses: string[];
  actions: string[];
  searchFields: string[];
  filters: FieldDef[];
  sections: SectionDef[];
  agreement: string;
  /** Primary listing button (default "Create"). */
  createLabel?: string;
  /** Renew support (Security Companies): title prefix and fields hidden on renew. */
  renew?: { hideFields?: string[] };
  /** Builds the sample listing data. */
  sample: (i: number) => FormValues;
};

/* ── Runtime data ── */
export type RowValues = Record<string, string>;
export type FormValues = {
  fields: Record<string, string>;
  /** entryTable / repeatRows rows keyed by section id */
  lists: Record<string, RowValues[]>;
};

export type ServiceRow = {
  applicationNo: string;
  createdOn: string;
  status: string;
  values: FormValues;
};

export const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Successful':   { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Approved':     { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Completed':    { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Rejected':     { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Submitted':    { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Under Review': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Pending':      { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Expired':      { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Cancelled':    { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Draft':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  /* My NOC's / Payments */
  'Valid':           { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Amended':         { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'Pending Payment': { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Paid':            { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
};
export const statusStyle = (s: string) => STATUS_STYLE[s] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };

/** Every field across the sections, flattened (fields sections only). */
export const allFields = (cfg: ServiceConfig) =>
  cfg.sections.filter(s => s.kind === 'fields').flatMap(s => s.fields ?? []);

/** Empty form values, with prefilled fields and one blank row per repeatRows section. */
export function emptyValues(cfg: ServiceConfig): FormValues {
  const fields: Record<string, string> = {};
  allFields(cfg).forEach(f => { fields[f.key] = f.value ?? (f.type === 'phone' ? '' : ''); });
  const lists: Record<string, RowValues[]> = {};
  cfg.sections.forEach(s => {
    if (s.kind === 'entryTable') lists[s.id] = [];
    if (s.kind === 'repeatRows') lists[s.id] = [{ _id: `${s.id}-0` }];
  });
  return { fields, lists };
}
