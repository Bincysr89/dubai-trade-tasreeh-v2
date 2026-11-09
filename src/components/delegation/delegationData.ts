/* ──────────────────────────────────────────────────────────────
   Tasreeh — Delegation Visits (Supplier → Gate Management).
   Figma SW--Tasreeh 1:8181 (listing) · 3:14292 (start) · 3:14527 (form)
   · 3:15536 (success) · 3:14899 (view) · 4:33519 (action flyout).
   ────────────────────────────────────────────────────────────── */

export const DELEGATION_TITLE = 'Tasreeh - Delegation Visits';

export type DelegationStatus = 'Successful' | 'Rejected' | 'Submitted' | 'Under Review' | 'Cancelled' | 'Draft';

export const DELEGATION_STATUSES: DelegationStatus[] = ['Successful', 'Rejected', 'Submitted', 'Under Review', 'Cancelled'];

export const STATUS_STYLE: Record<DelegationStatus, { bg: string; color: string }> = {
  'Successful':   { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Rejected':     { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Submitted':    { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Under Review': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Cancelled':    { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Draft':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
};
export const STATUS_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_STYLE).map(([k, v]) => [k, v.color]),
);

/* Action flyout (Figma 4:33519) */
export const ROW_ACTIONS = ['View Request', 'Cancel Request'] as const;
export type DelegationAction = typeof ROW_ACTIONS[number];

export const SEARCH_FIELDS = ['Application No.', 'Port', 'Contact Email'];
export const DOWNLOAD_OPTIONS = ['Download as Excel', 'Download as PDF', 'Download as CSV'];

/* ── Reference data ── */
export const PORTS = ['Jebel Ali', 'Mina Rashid', 'Al Hamriya Port', 'Dubai Creek', 'Drydocks World'];
export const GATES = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'];
export const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr', 'H.E.'];
export const VISITOR_CATEGORIES = ['Government Official', 'Diplomat', 'Corporate Executive', 'Media', 'Academic', 'Other'];
export const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah', 'Other'];
export const COUNTRY_CODES = ['+971', '+966', '+968', '+973', '+974', '+965', '+91', '+44'];

/* Company / trade licence come from the logged-in account (read-only on the form). */
export const COMPANY = {
  name: 'Maersk Kakoo UAE LLC',
  licenseNo: '9865571326454',
  licenseSource: 'Dubai Economy & Tourism',
  licenseExpiry: '31-Dec-2026',
};

/* ── Form model ── */
export type DelegationVisitor = { id: string; title: string; name: string; category: string; position: string };
export type DelegationVehicle = { id: string; emirate: string; other: string; plate: string };

export type DelegationForm = {
  remarks: string;
  visitDate: string; visitHrs: string; visitMins: string;
  port: string; gate: string;
  email: string; countryCode: string; mobile: string;
  reason: string; program: string; locations: string;
  visitors: DelegationVisitor[];
  vehicles: DelegationVehicle[];
};

export const EMPTY_FORM: DelegationForm = {
  remarks: '',
  visitDate: '', visitHrs: '', visitMins: '',
  port: '', gate: '',
  email: '', countryCode: '+971', mobile: '',
  reason: '', program: '', locations: '',
  visitors: [],
  vehicles: [{ id: 'veh-0', emirate: '', other: '', plate: '' }],
};

/* ── Listing rows (Figma 1:8181: Application No. / Created on / Application Status) ── */
export type DelegationRow = {
  applicationNo: string;
  createdOn: string;
  status: DelegationStatus;
  form: DelegationForm;
};

const VISIT_DATES = ['2023-01-21', '2023-01-05', '2023-01-08', '2022-12-30', '2023-01-10', '2023-01-03', '2023-01-09', '2023-01-02'];
const CREATED = ['14-Feb-2024', '02-Feb-2024', '28-Jan-2024', '20-Jan-2024', '11-Jan-2024', '05-Jan-2024', '29-Dec-2023', '18-Dec-2023'];
const ROW_STATUS: DelegationStatus[] = ['Successful', 'Rejected', 'Under Review', 'Submitted', 'Successful', 'Rejected', 'Successful', 'Submitted', 'Under Review', 'Cancelled'];
const VISITORS: [string, string, string, string][] = [
  ['H.E.', 'Khalid Al Mansoori', 'Government Official', 'Director General'],
  ['Mr', 'Azan Ahmed', 'Corporate Executive', 'Regional Manager'],
  ['Ms', 'Sara Hussain', 'Media', 'Correspondent'],
  ['Dr', 'Omar Farouk', 'Academic', 'Professor of Logistics'],
];

function sampleForm(i: number): DelegationForm {
  return {
    ...EMPTY_FORM,
    remarks: 'Official delegation visit to review port operations.',
    visitDate: VISIT_DATES[i % VISIT_DATES.length], visitHrs: String(9 + (i % 6)).padStart(2, '0'), visitMins: i % 2 ? '30' : '00',
    port: PORTS[i % PORTS.length], gate: GATES[(i + 2) % GATES.length],
    email: 'azanahmed@abc.com', countryCode: '+971', mobile: `50${(5551234 + i * 37).toString().slice(0, 7)}`,
    reason: 'Strategic partnership meeting with the terminal operator.',
    program: 'Welcome briefing, terminal tour, operations control room visit.',
    locations: 'Terminal 2, Control Tower, Berth 7',
    visitors: VISITORS.slice(0, 2 + (i % 3)).map(([title, name, category, position], k) => ({ id: `dv-${i}-${k}`, title, name, category, position })),
    vehicles: [{ id: `veh-${i}`, emirate: 'Dubai', other: '', plate: `A ${12345 + i * 11}` }],
  };
}

export const DELEGATION_ROWS: DelegationRow[] = ROW_STATUS.map((status, i) => ({
  applicationNo: `1235456486${String(87 + i).padStart(2, '0')}`,
  createdOn: CREATED[i % CREATED.length],
  status,
  form: sampleForm(i),
}));

export const DRAFT_ROWS: DelegationRow[] = Array.from({ length: 3 }, (_, i) => ({
  applicationNo: `1235456487${String(10 + i)}`,
  createdOn: CREATED[(i + 3) % CREATED.length],
  status: 'Draft' as DelegationStatus,
  form: { ...sampleForm(i + 4), visitors: [] },
}));

export const shortRef = (r: DelegationRow) => r.applicationNo.slice(-6);
