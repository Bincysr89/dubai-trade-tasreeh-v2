import { getPersona } from '../../persona';
/* ──────────────────────────────────────────────────────────────
   Tasreeh — Gate Passes (Supplier → Gate Management).
   Reference data, listing rows and status chrome shared by the
   listing, form, view, renew and report-lost screens.
   ────────────────────────────────────────────────────────────── */

export const GATE_PASS_TITLE = 'Tasreeh - Gate Passes';
export const GATE_PASS_FORM_TITLE = 'Tasreeh - Gate Pass';
export const AGENT_BANNER = 'A180-SHIPPING AGENT(A)-MAERSK KAKOO UAE LLC';
/* The individual (UAE PASS) account has no agent code — show the account holder instead */
/* A company user who picks "Individual" for gate passes sees the individual banner while in the flow */
let bannerProfile: string | null = null;
export const setBannerProfile = (p: string | null) => { bannerProfile = p; };
/* Inside the service the name carries the flow: "Tasreeh - Gate Passes - Visitor" etc. */
const PROFILE_SUFFIX: Record<string, string> = { individual: 'Visitor', 'visitor-company': 'Visitor Company', 'host-company': 'Host Company' };
export const serviceTitle = (title: string) => {
  const suffix = title === GATE_PASS_TITLE ? PROFILE_SUFFIX[bannerProfile ?? getPersona()] : undefined;
  return suffix ? `${title} - ${suffix}` : title;
};
export const agentBanner = () => ((bannerProfile ?? getPersona()) === 'individual' ? 'VISITOR - AHMED AL MARRI' : AGENT_BANNER);

/* Gate Management column of the Supplier catalogue (Figma 1:6268) */
export const TASREEH_SERVICES = [
  'Tasreeh - Gate Passes',
  'Tasreeh - Delegation Visits',
  'Tasreeh - Security Companies',
  'Tasreeh - Security Personnel',
  'Tasreeh - Security Services',
  'Tasreeh - ISPS Services',
  'Tasreeh - Vessel Services',
  'Tasreeh - Media Services',
  'Tasreeh - Payments',
];

export type GateStatus =
  | 'Successful' | 'Under Review' | 'Rejected' | 'Cancelled' | 'Expired' | 'Draft'
  /* Host Company approvals */
  | 'Pending' | 'Approved' | 'Returned';

export const GATE_STATUSES: GateStatus[] = ['Successful', 'Under Review', 'Rejected', 'Cancelled', 'Expired'];

export const STATUS_STYLE: Record<GateStatus, { bg: string; color: string }> = {
  'Successful':   { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Under Review': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Rejected':     { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Cancelled':    { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Expired':      { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Draft':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Pending':      { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Approved':     { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Returned':     { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
};

export const STATUS_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(STATUS_STYLE).map(([k, v]) => [k, v.color]),
);

/* Search-by field selector (Figma 115:9097) */
export const SEARCH_FIELDS = ['Application No.', 'Pass Reference No.', 'Visitor Name', 'Passport No.'];

/* Row action flyout (Figma 4:33476) */
export const ROW_ACTIONS = [
  'View Request',
  'Report Lost Pass',
  'Renew Pass',
  'Cancel Request',
  'View Gate Pass',
  'Print Pass',
] as const;
export type RowAction = typeof ROW_ACTIONS[number];

export const DOWNLOAD_OPTIONS = ['Download as Excel', 'Download as PDF', 'Download as CSV'];

/* ── Reference data (Tasreeh-Dev Figma 1248:50444 / 1005:22251) ── */
export const PORTS = ['Jebel Ali', 'Mina Rashid', 'Al Hamriya Port', 'Dubai Creek', 'Drydocks World'];
export const ZONE_PORTS: Record<string, string[]> = {
  'Zone 1': ['Mina Rashid', 'Jebel Ali'],
  'Zone 2': ['Al Hamriya Port', 'Dubai Creek'],
  'Zone 3': ['Drydocks World', 'Jebel Ali'],
};
export const ZONES = Object.keys(ZONE_PORTS);
export const ENTRY_GATES = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4', 'Gate 5'];
export const ANY_GATE = 'Any Gate';
export const PHOTOGRAPHY = 'Photography/Video';
export const MAINTENANCE = 'Maintenance';
export const PASS_TYPES = ['Visitor', MAINTENANCE, PHOTOGRAPHY, 'Permanent', 'Temporary', 'Contractor'];
export const PASS_DURATIONS = ['One Day', 'One Week', 'One Month', 'Three Months', 'One Year'];
export const PURPOSES = ['Training', 'Maintenance', 'Business Meeting', 'Delivery', 'Inspection', 'Installation'];
export const FACILITY_AREAS = ['Control Tower', 'Berth Operations', 'Container Yard', 'Reefer Area', 'Workshop', 'Fuel Station', 'Warehouse A'];
export const SHOOTING_METHODS = ['Ground Shooting', 'Aerial Shooting (Drone)', 'Aerial Shooting (Helicopter)', 'Studio'];
export const VISA_TYPES = ['Resident', 'Visitor', 'GCC National', 'UAE National'];
export const GENDERS = ['Male', 'Female'];
export const TITLES = ['Mr', 'Mrs', 'Ms', 'Dr'];
export const DESIGNATIONS = ['Engineer', 'Technician', 'Supervisor', 'Manager', 'Driver', 'Consultant'];
export const NATIONALITIES = [
  'United Arab Emirates', 'India', 'Pakistan', 'Philippines', 'Egypt', 'United Kingdom', 'Jordan',
];
export const GENERATED_BY = ['Self', 'Sub User', 'Host Company'];
export const HOST_SUBUSERS = ['Ahmed Saleh', 'Fatima Noor', 'John Mathew', 'Priya Nair'];

/* Per-pass fee by pass type (Figma shows 107.0 AED for a one-day visitor pass). */
export const PER_PASS_FEE: Record<string, number> = {
  'Visitor': 107, [MAINTENANCE]: 128, [PHOTOGRAPHY]: 256, 'Permanent': 520, 'Temporary': 107, 'Contractor': 150,
};
export const DURATION_FACTOR: Record<string, number> = {
  'One Day': 1, 'One Week': 1.5, 'One Month': 2, 'Three Months': 3, 'One Year': 5,
};
export const perPassAmount = (type: string, duration: string) =>
  type && duration ? (PER_PASS_FEE[type] ?? 107) * (DURATION_FACTOR[duration] ?? 1) : 0;
export const money = (n: number) => n.toFixed(2);

/* Fees (Figma 4:30450 / 4:31110) */
export const PASS_FEE = '256.00';
export const REISSUE_FEE = '260.00';

/* ── Listing rows ── */
export type GateRow = {
  applicationNo: string;
  passRefNo: string;
  portName: string;
  entryGate: string;
  passType: string;
  passDuration: string;
  purpose: string;
  dateOfVisit: string;
  visitorTitle: string;
  visitorFirst: string;
  visitorLast: string;
  visitorName: string;
  nationality: string;
  mobile: string;
  email: string;
  dob: string;
  designation: string;
  visaType: string;
  eidExpiry: string;
  visaExpiry: string;
  companyName: string;
  vehicleNo: string;
  drivingLicense: string;
  passportNo: string;
  hostCompany: string;
  approver: string;
  submittedDate: string;
  validTill: string;
  status: GateStatus;
  /* Host Company views */
  accessType?: string;
  visitorCompany?: string;
  visitorEmail?: string;
  /* My Drafts (individual) */
  serviceType?: string;
  expiresOn?: string;
};

const FIRST = ['Azan', 'Rahul', 'Omar', 'Maria', 'Khalid', 'Sara', 'Imran', 'Daniel', 'Layla', 'Vikram', 'Hassan', 'Grace'];
const LAST = ['Ahmed', 'Menon', 'Farouk', 'Santos', 'Rashid', 'Hussain', 'Qureshi', 'Brooks', 'Haddad', 'Iyer', 'Ali', 'Thomas'];
const NAT = ['United Arab Emirates', 'India', 'Egypt', 'Philippines', 'United Arab Emirates', 'Jordan', 'Pakistan', 'United Kingdom', 'Jordan', 'India', 'Egypt', 'Philippines'];
const APPROVERS = ['DP World Security', 'PCFC Security', 'Port Police', 'DP World Security'];
const ROW_STATUS: GateStatus[] = [
  'Successful', 'Rejected', 'Under Review', 'Successful', 'Expired', 'Successful',
  'Cancelled', 'Under Review', 'Successful', 'Rejected', 'Successful', 'Under Review',
];
const DATES = ['21-Jan-2023', '28-Dec-2022', '03-Jan-2023', '05-Jan-2023', '29-Dec-2022', '07-Jan-2023',
  '30-Dec-2022', '08-Jan-2023', '09-Jan-2023', '02-Jan-2023', '10-Jan-2023', '04-Jan-2023'];

function row(i: number, status: GateStatus): GateRow {
  const first = FIRST[i % FIRST.length];
  const last = LAST[i % LAST.length];
  return {
    applicationNo: `1235456486${String(87 + i).padStart(2, '0')}`,
    passRefNo: status === 'Draft' ? '-' : `GP-${121324 + i}`,
    portName: PORTS[i % PORTS.length],
    entryGate: ENTRY_GATES[(i + 2) % ENTRY_GATES.length],
    passType: PASS_TYPES[i % PASS_TYPES.length],
    passDuration: PASS_DURATIONS[(i + 2) % PASS_DURATIONS.length],
    purpose: PURPOSES[i % PURPOSES.length],
    dateOfVisit: DATES[i % DATES.length],
    visitorTitle: TITLES[i % 2 === 0 ? 0 : 2],
    visitorFirst: first,
    visitorLast: last,
    visitorName: `${first} ${last}`,
    nationality: NAT[i % NAT.length],
    mobile: `+971-55${i % 10}-555-5${i % 10}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@maersk.com`,
    dob: `0${(i % 9) + 1}-Jan-19${80 + (i % 20)}`,
    designation: DESIGNATIONS[i % DESIGNATIONS.length],
    visaType: 'Resident',
    eidExpiry: '01-Jan-2026',
    visaExpiry: '01-Jan-2026',
    companyName: 'Maersk Kakoo UAE LLC',
    vehicleNo: `DXB-${45210 + i * 7}`,
    drivingLicense: `DL-${880310 + i * 13}`,
    passportNo: `P${(4471230 + i * 97).toString()}`,
    hostCompany: 'Dubai Trade',
    approver: status === 'Draft' ? '-' : APPROVERS[i % APPROVERS.length],
    submittedDate: DATES[i % DATES.length],
    validTill: '21-Feb-2023',
    status,
  };
}

export const GATE_ROWS: GateRow[] = ROW_STATUS.map((s, i) => row(i, s));
export const DRAFT_ROWS: GateRow[] = Array.from({ length: 6 }, (_, i) => row(i + 20, 'Draft'));

/* ── Apply-pass form model (Figma 1248:50444) ── */
export type PassCategory = 'port' | 'zone';

export type Visitor = {
  id: string;
  visaType: string; emiratesId: string; dob: string; gender: string;
  title: string; firstName: string; lastName: string;
  companyName: string; companyAddress: string; vehicleNo: string;
};

export type Equipment = { id: string; name: string; qty: string };

export type GatePassForm = {
  category: PassCategory;
  portName: string; zone: string; entryGate: string; passType: string; passDuration: string;
  purpose: string; dateOfVisit: string; hostCompany: string;
  facilityAccess: '' | 'Yes' | 'No'; facilityAreas: string[];
  shootingCompany: string; shootingDate: string; shootingMethod: string; shootingLocation: string;
  equipment: Equipment[];
  visitors: Visitor[];
};

export const EMPTY_FORM: GatePassForm = {
  category: 'port',
  portName: '', zone: '', entryGate: '', passType: '', passDuration: '', purpose: '', dateOfVisit: '',
  hostCompany: 'Host Company 1',
  facilityAccess: '', facilityAreas: [],
  shootingCompany: '', shootingDate: '', shootingMethod: '', shootingLocation: '',
  equipment: [{ id: 'eq-0', name: '', qty: '' }],
  visitors: [],
};

/* "21-Jan-1996" → "1996-01-21" for the date fields */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export function toIso(d: string): string {
  const m = /^(\d{1,2})-([A-Za-z]{3})-(\d{4})$/.exec(d);
  if (!m) return '';
  return `${m[3]}-${String(MONTHS.indexOf(m[2]) + 1).padStart(2, '0')}-${m[1].padStart(2, '0')}`;
}
export function fromIso(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  return m ? `${m[3]}-${MONTHS[Number(m[2]) - 1]}-${m[1]}` : iso;
}

export function visitorFromRow(r: GateRow): Visitor {
  return {
    id: `v-${r.applicationNo}`,
    visaType: r.visaType, emiratesId: '784-1985-1234567-1', dob: toIso(r.dob), gender: r.visitorTitle === 'Mr' ? 'Male' : 'Female',
    title: r.visitorTitle, firstName: r.visitorFirst, lastName: r.visitorLast,
    companyName: r.companyName, companyAddress: 'Jebel Ali Free Zone, Dubai, UAE', vehicleNo: r.vehicleNo,
  };
}

/* Prefill from an old pass / draft: same pass details and visitor, a fresh date of visit. */
export function formFromRow(r: GateRow): GatePassForm {
  return {
    ...EMPTY_FORM,
    portName: PORTS.includes(r.portName) ? r.portName : PORTS[0],
    entryGate: r.entryGate,
    passType: PASS_TYPES.includes(r.passType) ? r.passType : 'Visitor',
    passDuration: PASS_DURATIONS.includes(r.passDuration) ? r.passDuration : 'One Day',
    purpose: PURPOSES.includes(r.purpose) ? r.purpose : 'Training',
    hostCompany: r.hostCompany,
    visitors: [visitorFromRow(r)],
  };
}

/* Mock Emirates ID lookup for the "Search" step (Figma 1005:30551). */
export function lookupVisitor(gender: string): Pick<Visitor, 'title' | 'firstName' | 'lastName'> {
  return gender === 'Female'
    ? { title: 'Ms', firstName: 'Sara', lastName: 'Hussain' }
    : { title: 'Mr', firstName: 'Azan', lastName: 'Ahmed' };
}

/* Short request number shown in page titles, e.g. "View Request - 121324". */
export const shortRef = (r: GateRow) => (r.passRefNo !== '-' ? r.passRefNo.replace('GP-', '') : r.applicationNo.slice(-6));

/* ──────────────────────────────────────────────────────────────
   Host Company persona (Tasreeh-Dev Figma 1347:49911 / 1347:50349)
   ────────────────────────────────────────────────────────────── */
export const HOST_TITLE = 'Pass Management';
export const HOST_APPROVALS_TITLE = 'Pass Approvals';

/* All Requests three-dot flyout (Figma 1347:50348) */
export const HOST_ACTIONS = ['View', 'Edit', 'Reuse Pass Details', 'Renew Pass', 'Print Pass', 'Print Receipt', 'Report Lost Pass'];

const HOST_NAMES = ['Azan Ahmed', 'Kristin Watson', 'Jane Cooper', 'Esther Howard', 'Theresa Webb', 'Jenny Wilson', 'Darlene Robertson', 'Marvin McKinney', 'Guy Hawkins', 'Brooklyn Simmons'];
const HOST_STATUS: GateStatus[] = ['Pending', 'Approved', 'Rejected', 'Pending', 'Draft', 'Expired', 'Approved', 'Rejected', 'Draft', 'Expired'];
const HOST_PORTS = ['Jebel Ali, Mina Rashid', 'Mina Rashid', 'Jebel Ali, Mina Rashid', 'Jebel Ali', 'Jebel Ali, Mina Rashid', 'JAFZA', 'Jebel Ali, Mina Rashid', 'Marfa Deira', 'Jebel Ali, Mina Rashid', 'Mina Rashid'];
const HOST_DURATIONS = ['One Day', 'One Year', 'One Day', 'One Week', 'One Year', 'One Month', 'One Week', 'One Day', 'One Year', 'One Month'];
const REFS = ['7725068610', '2377471239', '5205896212', '7111924081', '1565015004', '1883798829', '5101345246', '1641617565', '0500042814', '6072232892'];

/* All Requests tab — passes this host company applied for */
export const HOST_ROWS: GateRow[] = REFS.map((ref, i) => {
  const [first, last] = HOST_NAMES[i].split(' ');
  return {
    ...row(i, HOST_STATUS[i]),
    passRefNo: ref, accessType: i % 2 ? 'Port' : 'Zone', portName: HOST_PORTS[i],
    passType: i % 2 ? 'Temporary' : 'Permanent', passDuration: HOST_DURATIONS[i],
    visitorFirst: first, visitorLast: last, visitorName: HOST_NAMES[i],
    email: `${first.toLowerCase()}.${last.toLowerCase()}@maersk.com`,
    approver: HOST_STATUS[i] === 'Draft' || HOST_STATUS[i] === 'Expired' ? '--' : 'John Doe',
  };
});

/* Pass Approvals tab — visitor-company requests waiting on this host company */
const APPROVAL_STATUS: GateStatus[] = ['Pending', 'Pending', 'Pending', 'Pending', 'Approved', 'Rejected', 'Approved', 'Rejected', 'Expired', 'Expired'];
const VISITOR_COMPANIES = ['Galaxy', 'Maersk Kakoo UAE LLC', 'Al Futtaim Logistics', 'Galaxy', 'Gulf Marine Services', 'Galaxy', 'DP World Logistics', 'Emirates Shipping', 'Galaxy', 'Al Futtaim Logistics'];
const APPROVAL_VISITORS = ['Robert Fox', 'Kristin Watson', 'Floyd Miles', 'Brooklyn Simmons', 'Ronald Richards', 'Arlene McCoy', 'Annette Black', 'Guy Hawkins', 'Wade Warren', 'Bessie Cooper'];
export const APPROVAL_ROWS: GateRow[] = REFS.map((ref, i) => {
  const [first, last] = APPROVAL_VISITORS[i].split(' ');
  const email = `${first.toLowerCase()}.${last.toLowerCase()}@${VISITOR_COMPANIES[i].split(' ')[0].toLowerCase()}.com`;
  return {
    ...row(i + 40, APPROVAL_STATUS[i]),
    passRefNo: ref, applicationNo: `12354564${8700 + i}`,
    passType: i % 2 ? 'Temporary' : 'Permanent', dateOfVisit: '31-Jan-2024', submittedDate: '31-Jan-2024',
    visitorFirst: first, visitorLast: last, visitorName: APPROVAL_VISITORS[i],
    visitorCompany: VISITOR_COMPANIES[i], companyName: VISITOR_COMPANIES[i], visitorEmail: email, email,
    hostCompany: 'Dubai Trade', approver: 'John Doe',
  };
});

export const REJECTION_REASONS = ['Incomplete visitor information', 'Invalid or expired documents', 'Visit not authorised by host', 'Security clearance not granted', 'Other'];

/* ──────────────────────────────────────────────────────────────
   Individual persona — UAE PASS basic account (Tasreeh-Dev Figma
   972:34908 listing · 972:36193 flyout · 1087:16926 My Drafts)
   ────────────────────────────────────────────────────────────── */
/* Profile shared by UAE PASS: prefills the visitor block of every pass */
export const INDIVIDUAL_PROFILE = {
  title: 'Mr', firstName: 'Ahmed', lastName: 'Al Marri', email: 'ahmed.almarri@gmail.com', mobile: '+971-55-952-4462',
  designation: 'Engineer', visaType: 'Resident', gender: 'Male', dob: '1988-05-14', emiratesId: '784-1988-7654321-2',
  eidExpiry: '01-Jan-2026', passportNo: 'N8812345', passportExpiry: '01-Jan-2028', visaNo: '201/2023/7654321',
  visaExpiry: '01-Jan-2026', nationality: 'United Arab Emirates', companyName: '--', drivingLicense: 'DL-884120',
};

export const individualVisitor = (): Visitor => ({
  id: 'v-individual', visaType: INDIVIDUAL_PROFILE.visaType, emiratesId: INDIVIDUAL_PROFILE.emiratesId,
  dob: INDIVIDUAL_PROFILE.dob, gender: INDIVIDUAL_PROFILE.gender, title: INDIVIDUAL_PROFILE.title,
  firstName: INDIVIDUAL_PROFILE.firstName, lastName: INDIVIDUAL_PROFILE.lastName,
  companyName: INDIVIDUAL_PROFILE.companyName, companyAddress: '', vehicleNo: '',
});

/* Three-dot flyout (Figma 972:36193); returned passes can also be amended (Figma 972:35792) */
export const INDIVIDUAL_ACTIONS = ['View', 'Edit', 'Renew Pass', 'Print Pass', 'Print Receipt', 'Report Lost Pass'];
export const AMEND_ACTION = 'Amend Pass';
export const DRAFT_MENU = ['Edit', 'Delete'];

const IND_STATUS: GateStatus[] = ['Pending', 'Approved', 'Rejected', 'Returned', 'Draft', 'Expired', 'Approved', 'Rejected', 'Draft', 'Expired'];
const IND_PORTS = ['Jebel Ali', 'Jebel Ali', 'Marfa Deira', 'Jebel Ali', 'Marfa Deira', 'JAFZA', 'Jebel Ali', 'Marfa Deira', 'JAFZA', 'Mina Rashid'];
const IND_DURATIONS = ['One Day', 'One Year', 'One Day', 'One Week', 'One Year', 'One Month', 'One Week', 'One Day', 'One Year', 'One Month'];

const profileFields = (): Partial<GateRow> => ({
  visitorTitle: INDIVIDUAL_PROFILE.title, visitorFirst: INDIVIDUAL_PROFILE.firstName, visitorLast: INDIVIDUAL_PROFILE.lastName,
  visitorName: `${INDIVIDUAL_PROFILE.firstName} ${INDIVIDUAL_PROFILE.lastName}`, nationality: INDIVIDUAL_PROFILE.nationality,
  mobile: INDIVIDUAL_PROFILE.mobile, email: INDIVIDUAL_PROFILE.email, dob: fromIso(INDIVIDUAL_PROFILE.dob),
  designation: INDIVIDUAL_PROFILE.designation, visaType: INDIVIDUAL_PROFILE.visaType, eidExpiry: INDIVIDUAL_PROFILE.eidExpiry,
  visaExpiry: INDIVIDUAL_PROFILE.visaExpiry, companyName: INDIVIDUAL_PROFILE.companyName,
  drivingLicense: INDIVIDUAL_PROFILE.drivingLicense, passportNo: INDIVIDUAL_PROFILE.passportNo,
});

export const INDIVIDUAL_ROWS: GateRow[] = REFS.map((ref, i) => ({
  ...row(i + 60, IND_STATUS[i]),
  ...profileFields(),
  passRefNo: ref, portName: IND_PORTS[i], passType: i % 2 ? 'Temporary' : 'Permanent', passDuration: IND_DURATIONS[i],
  hostCompany: 'Dubai Trade',
  approver: IND_STATUS[i] === 'Draft' || IND_STATUS[i] === 'Expired' ? '--' : 'John Doe',
}));

/* My Drafts (Figma 1087:16926) */
const DRAFT_SERVICES = ['Gate Pass', 'Report Lost Pass', 'Return Pass for Amendment'];
export const INDIVIDUAL_DRAFTS: GateRow[] = Array.from({ length: 10 }, (_, i) => ({
  ...row(i + 80, 'Draft'),
  ...profileFields(),
  applicationNo: `DFT${String(100231 + i)}`, passRefNo: '-',
  serviceType: DRAFT_SERVICES[[0, 1, 2, 0, 1, 2, 1, 0, 2, 1][i]],
  submittedDate: '01-Jan-2024', expiresOn: '01-Feb-2024', hostCompany: 'Dubai Trade',
}));

/* Approval history on a returned pass (Figma 972:35792) */
export const AMEND_HISTORY = [
  { date: '21-Sep-2023 11:30 PM', status: 'Return for Update', by: 'Jebel Ali Helpdesk', reason: 'Please modify the date of visit' },
  { date: '21-Sep-2023 11:30 PM', status: 'Return for Update', by: 'Jebel Ali Helpdesk', reason: 'Please modify the date of visit' },
];
