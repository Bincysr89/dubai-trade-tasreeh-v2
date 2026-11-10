/* ──────────────────────────────────────────────────────────────
   Pass Management (Visitor) — sample data for the Figma
   "Tasreeh-Dev" screens: Pass Management listing, View / Apply /
   Amend / Renew / Report Lost Pass, and the My Workspace pages
   (Drafts, Approved Passes, Requests, Payment Receipts).
   ────────────────────────────────────────────────────────────── */

export type PassStatus = 'Pending' | 'Approved' | 'Rejected' | 'Draft' | 'Expired' | 'Completed' | 'Under Review' | 'Return for Update' | 'Returned';

export type PassRow = {
  passRefNo: string;
  applicationNo: string;
  portName: string;
  passType: string;
  passDuration: string;
  visitorName: string;
  status: PassStatus;
  approver: string;
  hostCompany: string;
  createdOn: string;
};

export type DraftRow = { id: string; refId: string; serviceType: DraftService; createdOn: string; expiresOn: string; form?: PassForm; companyForm?: CompanyForm };
export type DraftService = 'Gate Pass' | 'Report Lost Pass' | 'Return Pass for Amendment';
export type ReceiptRow = { receiptNo: string; applicationNo: string; amount: string; createdOn: string };

export type PassForm = {
  portName: string; passType: string; entryGate: string; passDuration: string; purpose: string;
  dateOfVisit: string; hostCompany: string; vehicleNo: string;
  /* amend / renew only */
  dob: string; visaType: string; eidExpiry: string; visaExpiry: string;
};

export const EMPTY_FORM: PassForm = {
  portName: '', passType: '', entryGate: '', passDuration: '', purpose: '', dateOfVisit: '', hostCompany: '', vehicleNo: '',
  dob: '', visaType: '', eidExpiry: '', visaExpiry: '',
};

export const PORTS = ['Jebel Ali', 'Marfa Deira', 'JAFZA', 'Mina Rashid'];
export const PASS_TYPES = ['Permanent', 'Temporary', 'Maintenance'];
export const ENTRY_GATES = ['Gate 1', 'Gate 2', 'Gate 3', 'Gate 4'];
export const DURATIONS = ['One Day', 'One Week', 'One Month', 'One Year'];
export const PURPOSES = ['Maintenance', 'Business Meeting', 'Delivery', 'Inspection'];
export const VISA_TYPES = ['Resident', 'Visit', 'Employment'];
export const STATUSES: PassStatus[] = ['Pending', 'Approved', 'Rejected', 'Draft', 'Expired'];

export const PASS_FEE = '256.00';
export const REISSUE_FEE = '260.00';

/* Signed-in visitor — prefilled into every form (Figma sample values) */
export const VISITOR = {
  title: 'Mr', firstName: 'Azan', lastName: 'Ahmed', nationality: 'Indian', mobile: '+971-555-555-55',
  email: 'azan.ahmed@example.com', dob: '01-Jan-1990', designation: 'Site Engineer', visaType: 'Resident',
  gender: 'Male', emiratesId: '784-1990-1234567-1', eidExpiry: '01-Jan-2026', passportNo: '12345',
  passportExpiry: '01-Jan-2026', visaNo: '12345', visaExpiry: '01-Jan-2026', companyName: 'Al Noor Contracting',
  vehicleNo: 'D 45821', drivingLicense: 'DL-2209381',
};

const REFS = ['7725068610', '2377471239', '5205896212', '7111924081', '1565015004', '1883798829', '5101345246', '1641617565', '0500042814', '6072232892'];
const PAGE_PORTS = ['Jebel Ali', 'Jebel Ali', 'Marfa Deira', 'Jebel Ali', 'Marfa Deira', 'JAFZA', 'Jebel Ali', 'Marfa Deira', 'JAFZA', 'Mina Rashid'];
const PAGE_TYPES = ['Permanent', 'Temporary'];
const PAGE_DURATIONS = ['One Day', 'One Year', 'One Day', 'One Week', 'One Year', 'One Month', 'One Week', 'One Day', 'One Year', 'One Month'];
const PAGE_STATUS: PassStatus[] = ['Pending', 'Approved', 'Rejected', 'Pending', 'Draft', 'Expired', 'Approved', 'Rejected', 'Draft', 'Expired'];

/* Five pages of passes — page 1 is exactly the Figma table, later pages vary the reference numbers */
const shift = (ref: string, page: number) => page === 0 ? ref : String((Number(ref) + page * 104729) % 1e10).padStart(10, '0');
export const PASS_ROWS: PassRow[] = Array.from({ length: 46 }, (_, i) => {
  const page = Math.floor(i / 10), k = i % 10;
  const status = PAGE_STATUS[(k + page) % 10];
  const ref = shift(REFS[k], page);
  return {
    passRefNo: ref, applicationNo: ref,
    portName: PAGE_PORTS[(k + page * 3) % 10], passType: PAGE_TYPES[k % 2], passDuration: PAGE_DURATIONS[(k + page) % 10],
    visitorName: 'Azan Ahmed', status,
    approver: status === 'Draft' || status === 'Expired' ? '--' : 'John Doe',
    hostCompany: 'Host Company', createdOn: '01-Jan-2024',
  };
});

/* My Approved Passes (Figma 1125:22940) — every row Completed */
export const APPROVED_ROWS: PassRow[] = PASS_ROWS.map(r => ({ ...r, status: 'Completed' as PassStatus }));

const DRAFT_TYPES: DraftService[] = ['Gate Pass', 'Report Lost Pass', 'Return Pass for Amendment', 'Gate Pass', 'Report Lost Pass', 'Return Pass for Amendment', 'Report Lost Pass', 'Gate Pass', 'Return Pass for Amendment', 'Report Lost Pass'];
export const DRAFT_ROWS: DraftRow[] = Array.from({ length: 23 }, (_, i) => ({
  id: `d${i}`, refId: `DFT${String(10231 + i)}`, serviceType: DRAFT_TYPES[i % 10], createdOn: '01-Jan-2024', expiresOn: '01-Feb-2024',
}));

export const RECEIPT_ROWS: ReceiptRow[] = PASS_ROWS.map(r => ({ receiptNo: r.passRefNo, applicationNo: r.applicationNo, amount: '25.0', createdOn: '01-Jan-2024' }));

export const APPROVAL_HISTORY = [
  { date: '21-Sep-2023 11:30 PM', status: 'Return for Update' as PassStatus, by: 'Jebel Ali Helpdesk', reason: 'Please modify the date of visit' },
  { date: '21-Sep-2023 11:30 PM', status: 'Return for Update' as PassStatus, by: 'Jebel Ali Helpdesk', reason: 'Please modify the date of visit' },
];

/* Pass detail used by View / Amend / Lost (Figma sample) */
export type PassDetail = {
  applicationNo: string; passRefNo: string; port: string; entryGate: string; passType: string; passDuration: string;
  purpose: string; dateOfVisit: string; hostCompany: string; amount: string; status: PassStatus;
};

const PORT_FULL: Record<string, string> = { 'Jebel Ali': 'Jebel Ali Port', 'Marfa Deira': 'Marfa Deira', JAFZA: 'JAFZA', 'Mina Rashid': 'Mina Rashid' };

export const SAMPLE_PASS: PassDetail = {
  applicationNo: '123545648687', passRefNo: '123545648687', port: 'Jebel Ali Port', entryGate: 'Gate 3', passType: 'Maintenance',
  passDuration: '1 Month', purpose: 'Maintenance', dateOfVisit: '21-Jan-2023', hostCompany: 'Dubai Trade', amount: PASS_FEE, status: 'Completed',
};

export const detailFromRow = (r: PassRow): PassDetail => ({
  ...SAMPLE_PASS, applicationNo: r.applicationNo, passRefNo: r.passRefNo, port: PORT_FULL[r.portName] ?? r.portName,
  passType: r.passType, passDuration: r.passDuration, hostCompany: r.hostCompany === 'Host Company' ? 'Dubai Trade' : r.hostCompany,
  status: r.status === 'Approved' ? 'Completed' : r.status,
});

export const formFromDetail = (d: PassDetail): PassForm => ({
  ...EMPTY_FORM,
  portName: PORTS.find(p => d.port.startsWith(p)) ?? 'Jebel Ali',
  passType: PASS_TYPES.includes(d.passType) ? d.passType : 'Maintenance',
  entryGate: d.entryGate, passDuration: DURATIONS.find(x => x.toLowerCase().includes(d.passDuration.split(' ').pop()!.toLowerCase())) ?? 'One Month',
  purpose: d.purpose, hostCompany: d.hostCompany, vehicleNo: VISITOR.vehicleNo,
});

const fmt = (d: Date) => `${String(d.getDate()).padStart(2, '0')}-${d.toLocaleString('en-GB', { month: 'short' })}-${d.getFullYear()}`;
export const today = () => fmt(new Date());
export const inOneMonth = () => { const d = new Date(); d.setMonth(d.getMonth() + 1); return fmt(d); };
export const isoToDisplay = (iso: string) => (iso ? fmt(new Date(`${iso}T00:00:00`)) : '');
export const newAppNo = () => `1235456${Math.floor(10000 + Math.random() * 89999)}`;

/* ══════════════ Company (Host / Visitor company) — Figma 1248:50444 onwards ══════════════ */

export const COMPANY_PASS_TYPES = ['Visitor', 'Permanent', 'Temporary', 'Maintenance', 'Photography/Video'];
export const COMPANY_PURPOSES = ['Training', ...PURPOSES];
export const GENDERS = ['Male', 'Female'];
export const SHOOTING_METHODS = ['Ground Shooting', 'Aerial Shooting (Drone)', 'Aerial Shooting (Helicopter)'];
export const REJECT_REASONS = ['Incomplete visitor details', 'Invalid documents', 'Security concern', 'Duplicate request'];
export const NATIONALITIES = ['Emirati', 'Indian', 'Pakistani', 'Egyptian', 'British', 'Filipino'];

export const ZONES: Record<string, string> = {
  'Zone 1': 'Jebel Ali Port, JAFZA, Rashid Port, Dubai Maritime City, Drydocks World, Dubai Auto Zone, Dry Port, JADAF, Hamriya Port, Marfa Deira and Creek',
  'Zone 2': 'Mina Rashid, Jebel Ali',
};

const PER_PASS: Record<string, number> = { 'One Day': 107, 'One Week': 256, 'One Month': 512, 'One Year': 1024 };
export const perPass = (duration: string) => (PER_PASS[duration] ?? 107).toFixed(1);
export const money = (n: number) => n.toFixed(2);

export type CompanyVisitor = {
  id: string; visaType: string; emiratesId: string; dob: string; gender: string;
  title: string; firstName: string; lastName: string; companyName: string; companyAddress: string; vehicleNo: string;
};
/* What the Emirates ID lookup "fetches" (Figma Confirm Visitor Details) */
export const FETCHED_VISITOR = { title: 'Mr', firstName: 'Azan', lastName: 'Ahmed' };

export type CompanyForm = {
  access: 'port' | 'zone'; portName: string; zone: string; entryGate: string; passType: string; passDuration: string;
  purpose: string; dateOfVisit: string; hostCompany: string;
  studio: string; shootingDate: string; shootingMethod: string; shootingLocation: string;
  equipment: { id: string; name: string; qty: string }[];
  visitors: CompanyVisitor[];
};
export const EMPTY_COMPANY_FORM: CompanyForm = {
  access: 'port', portName: '', zone: '', entryGate: '', passType: '', passDuration: '', purpose: '', dateOfVisit: '', hostCompany: 'Host Company 1',
  studio: '', shootingDate: '', shootingMethod: '', shootingLocation: '', equipment: [{ id: 'e0', name: '', qty: '' }], visitors: [],
};

/* Company "Gate Passes" listing (Figma 1248:43213) */
const COMPANY_NAMES = ['Azan Ahmed', 'Kristin Watson', 'Jane Cooper', 'Esther Howard', 'Theresa Webb', 'Jenny Wilson', 'Darlene Robertson', 'Marvin McKinney', 'Guy Hawkins', 'Brooklyn Simmons'];
const COMPANY_PORTS = ['Jebel Ali, Mina Rashid', 'Mina Rashid', 'Jebel Ali, Mina Rashid', 'Jebel Ali', 'Jebel Ali, Mina Rashid', 'JAFZA', 'Jebel Ali, Mina Rashid', 'Marfa Deira', 'Jebel Ali, Mina Rashid', 'Mina Rashid'];
export const COMPANY_ROWS: PassRow[] = PASS_ROWS.map((r, i) => ({ ...r, visitorName: COMPANY_NAMES[i % 10], portName: COMPANY_PORTS[i % 10] }));

/* Pass Approvals (Figma 1347:50349) */
export type ApprovalRow = {
  passRefNo: string; passType: string; dateOfVisit: string; visitorName: string; visitorCompany: string;
  visitorEmail: string; createdDate: string; status: PassStatus;
};
const APPROVAL_STATUS: PassStatus[] = ['Pending', 'Pending', 'Pending', 'Pending', 'Approved', 'Rejected', 'Approved', 'Rejected', 'Expired', 'Expired'];
const VISITOR_COMPANIES = ['Galaxy', 'Al Noor Contracting', 'Emirates Logistics', 'Gulf Marine', 'Galaxy', 'Blue Wave Trading', 'Desert Star', 'Galaxy', 'Prime Movers', 'Sealine'];
export const APPROVAL_ROWS: ApprovalRow[] = PASS_ROWS.map((r, i) => ({
  passRefNo: r.passRefNo, passType: r.passType, dateOfVisit: '31-Jan-2024', visitorName: COMPANY_NAMES[i % 10],
  visitorCompany: VISITOR_COMPANIES[i % 10],
  visitorEmail: `${COMPANY_NAMES[i % 10].toLowerCase().replace(/\s+/g, '.')}@${VISITOR_COMPANIES[i % 10].toLowerCase().replace(/\s+/g, '')}.ae`,
  createdDate: '31-Jan-2024', status: APPROVAL_STATUS[(i + Math.floor(i / 10)) % 10],
}));
