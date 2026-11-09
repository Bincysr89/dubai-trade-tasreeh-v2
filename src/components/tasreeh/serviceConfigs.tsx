import type { HelpContent } from '../gatepass/HelpGuides';
import type { ServiceConfig, FieldDef, ListingColumn, FormValues } from './serviceTypes';

/* ──────────────────────────────────────────────────────────────
   Tasreeh service configs — fields, uploads and texts taken from
   Figma SW--Tasreeh (listing / start / form / success / view /
   flyout frames per service).
   ────────────────────────────────────────────────────────────── */

const PORTS = ['Jebel Ali', 'Mina Rashid', 'Al Hamriya Port', 'Dubai Creek', 'Drydocks World'];
const COMPANY = 'Galaxy';
const LICENSE_NO = '9865571326454';
const LICENSE_SOURCE = 'Dubai Economy & Tourism';
const STATUSES = ['Successful', 'Rejected', 'Submitted', 'Under Review', 'Cancelled'];
const ACTIONS = ['View Request', 'Cancel Request'];

const AGREE_SERVICE =
  'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. ' +
  'I also agree that Security Department has the full rights to reject any service request for security reasons and the ' +
  'money paid for the pass is non-refundable in all cases.';
const AGREE_GENERAL =
  'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. ' +
  'I also agree that Security Department has the full rights to reject any request for security reasons and the money ' +
  'paid is non-refundable in all cases.';
const AGREE_PASS =
  'I agree that all the information provide to the Security Department is correct and I am fully responsible for that. ' +
  'I also agree that Security Department has the full rights to reject any gate pass request for security reasons and ' +
  'the money paid for the pass is non-refundable in all cases.';

/* Listing (Figma): Application No. / Created on visible; service-specific columns available via Columns */
const cols = (...extra: ListingColumn[]): ListingColumn[] => [
  { key: 'applicationNo', label: 'Application No.', w: 420 },
  { key: 'createdOn', label: 'Created on', w: 420 },
  ...extra,
];
const filters = (...extra: FieldDef[]): FieldDef[] => [
  { key: 'applicationNo', label: 'Application Number', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: STATUSES },
  ...extra,
];

export function help(name: string, about: string, docs: string): HelpContent {
  return {
    about: <>{about}</>,
    accordions: [
      { title: 'Services Details', body: <>{about}</> },
      { title: 'Service Fee', body: <>Fees, where applicable, are calculated on submission and shown before payment.</> },
      { title: 'Required Documents', body: <>{docs} Files must be png/jpg/gif/pdf and no larger than 5MB each.</> },
    ],
    faqs: [
      { q: `Who can apply for ${name}?`, a: 'Companies registered with PCFC Security with an active Dubai Trade account.' },
      { q: 'Can I save a request and finish it later?', a: 'Yes. Use "Save As Drafts" on the form. Drafts are kept for 1 month and listed under the Drafts toggle.' },
      { q: 'Can I cancel a request?', a: 'Use "Cancel Request" from the listing actions or the View Request page while the request is under review.' },
    ],
    updates: [
      { date: '12 Oct 2026', text: `${name} requests now show live status on the listing.` },
      { date: '25 Aug 2026', text: 'Documents can be uploaded with the new individual uploader.' },
    ],
    downloads: [`${name} — User Manual (PDF)`, 'Required documents checklist (PDF)'],
    tutorials: [`Submitting a ${name} request`, 'Uploading the required documents', 'Tracking and cancelling a request'],
  };
}

const iso = (i: number, base = 21) => `2024-0${1 + (i % 9)}-${String(base - (i % 9)).padStart(2, '0')}`;
const val = (fields: Record<string, string>, lists: FormValues['lists'] = {}): FormValues => ({ fields, lists });

/* ── 1. Security Companies (Figma 1:7567 · 2:15284 · 2:15624 · 2:16319 · 2:16852 · renew 3:3165) ── */
export const SECURITY_COMPANIES: ServiceConfig = {
  key: 'security-companies',
  title: 'Tasreeh - Security Companies',
  intro: 'The Security Company Registration service enables licensed security companies to register, renew, or amend their approved security activities, allowing them to provide security solutions within areas governed by the Ports, Customs, and Free Zone Corporation (PCFC).',
  help: help('Security Company Registration',
    'Licensed security companies register, renew or amend their approved security activities to provide security solutions within PCFC areas.',
    'Trade licence and, for active projects, the contract with the host company.'),
  columns: cols({ key: 'activities', label: 'License Activities', w: 240 }),
  defaultVisible: ['applicationNo', 'createdOn'],
  createLabel: 'Start Journey',
  statuses: STATUSES,
  actions: ['View Request', 'Renew Request', 'Cancel Request'],
  searchFields: ['Application No.', 'License Activities'],
  filters: filters({ key: 'activities', label: 'License Activities', type: 'select', options: ['Activity 1', 'Activity 2', 'Activity 3', 'Other'] }),
  renew: { hideFields: ['currentActivities'] },
  sections: [
    {
      id: 'registration', title: 'Registration Information', kind: 'fields',
      info: 'If you have active projects now in any port, please upload the contract with the host company.',
      fields: [
        { key: 'company', label: 'Company Name', type: 'readonly', value: COMPANY },
        { key: 'licenseNo', label: 'Trade License Number', type: 'readonly', value: LICENSE_NO },
        { key: 'licenseSource', label: 'Trade license source', type: 'readonly', value: LICENSE_SOURCE },
        { key: 'activities', label: 'License Activities', type: 'multiselect', required: true, options: ['Activity 1', 'Activity 2', 'Activity 3', 'Other'] },
        { key: 'other', label: 'Other', type: 'textarea', required: true, placeholder: 'Enter Other Activities' },
        { key: 'remarks', label: 'Company Remarks', type: 'textarea', placeholder: 'Remarks' },
        { key: 'currentActivities', label: 'Current Activities', type: 'readonly', value: 'Activity 1, Activity 2' },
      ],
      uploads: [{ label: 'Trade License' }, { label: 'Document' }],
    },
    {
      id: 'noc', title: 'Current NOC', kind: 'fields',
      badge: { label: 'NOC Status', value: 'Valid', tone: 'green' },
      fields: [
        { key: 'nocNo', label: 'NOC Number', type: 'readonly', value: 'GLXY222444888' },
        { key: 'nocType', label: 'NOC Type', type: 'readonly', value: 'Registration Company' },
        { key: 'nocStart', label: 'NOC Start Date', type: 'readonly', value: '21-Jan-2024' },
        { key: 'nocEnd', label: 'NOC End Date', type: 'readonly', value: '21-Jan-2025' },
        { key: 'nocActivities', label: 'License Activities', type: 'readonly', value: 'Activity 1, Activity 2' },
      ],
    },
  ],
  agreement: AGREE_GENERAL,
  sample: i => val({
    company: COMPANY, licenseNo: LICENSE_NO, licenseSource: LICENSE_SOURCE,
    activities: ['Activity 1|Activity 2', 'Activity 3', 'Activity 1|Other'][i % 3], other: i % 3 === 2 ? 'Event security' : '',
    remarks: 'Company Remarks added will be here', currentActivities: 'Activity 1, Activity 2',
    nocNo: 'GLXY222444888', nocType: 'Registration Company', nocStart: '21-Jan-2024', nocEnd: '21-Jan-2025', nocActivities: 'Activity 1, Activity 2',
  }),
};

/* ── 2. Security Personnel (Figma 1:8795 · 3:5097 · 3:5332 · 3:6341 · 3:5704) ── */
export const SECURITY_PERSONNEL: ServiceConfig = {
  key: 'security-personnel',
  title: 'Tasreeh - Security Personnel',
  intro: 'The Security Personnel Registration service allows registered companies with a valid security company approval to request authorization for their security personnel to perform security-related duties within areas governed by the Ports, Customs, and Free Zone Corporation (PCFC).',
  help: help('Security Personnel Registration',
    'Registered companies with a valid security company approval request authorization for their security personnel to work within PCFC areas.',
    'Personal photo, passport, Emirates ID, visa, SIRA licence and supporting documents for each person.'),
  columns: cols({ key: 'approvalNo', label: 'Security Company Approval Number', w: 260 }),
  defaultVisible: ['applicationNo', 'createdOn'],
  statuses: STATUSES,
  actions: ACTIONS,
  searchFields: ['Application No.'],
  filters: filters(),
  sections: [
    {
      id: 'basic', title: 'Basic Information', kind: 'fields',
      fields: [
        { key: 'company', label: 'Company Name', type: 'readonly', value: COMPANY },
        { key: 'licenseNo', label: 'Trade License Number', type: 'readonly', value: LICENSE_NO },
        { key: 'licenseSource', label: 'Trade License Source', type: 'readonly', value: LICENSE_SOURCE },
        { key: 'approvalNo', label: 'Security Company Approval Number', type: 'readonly', value: 'GLXY222444888' },
        { key: 'approvalStatus', label: 'Security Company Approval Status', type: 'readonly', value: 'Active' },
      ],
    },
    {
      id: 'personnel', title: 'Security Personnel Information', kind: 'entryTable',
      tableTitle: 'Personnel Added', saveLabel: 'Save Personnel', emptyText: 'No Personnel Added',
      fields: [
        { key: 'eid', label: 'Emirates ID', type: 'text', required: true, placeholder: 'Enter Emirates ID' },
        { key: 'dob', label: 'Date of Birth', type: 'date', required: true },
        { key: 'gender', label: 'Gender', type: 'select', options: ['Male', 'Female'] },
        { key: 'title', label: 'Title', type: 'select', required: true, options: ['Mr', 'Mrs', 'Ms'] },
        { key: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Enter first name' },
        { key: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Enter last name' },
        { key: 'email', label: 'Email', type: 'text', placeholder: 'Enter' },
        { key: 'mobile', label: 'Mobile', type: 'phone', required: true },
        { key: 'designation', label: 'Designation', type: 'select', required: true, options: ['Security Guard', 'Supervisor', 'Patrol Officer', 'CCTV Operator', 'Security Manager'] },
        { key: 'passportNo', label: 'Passport Number', type: 'text', required: true, placeholder: 'Enter' },
        { key: 'nationality', label: 'Nationality', type: 'text', required: true, placeholder: 'Enter' },
        { key: 'eidExpiry', label: 'Emirates ID Expiry Date', type: 'date' },
        { key: 'visaNo', label: 'Visa Number', type: 'text', placeholder: 'Enter Visa Number' },
        { key: 'visaExpiry', label: 'Visa Expiry Date', type: 'date' },
        { key: 'passportExpiry', label: 'Passport Expiry Date', type: 'date' },
        { key: 'vehicleNo', label: 'Vehicle Number', type: 'text', placeholder: 'Enter Vehicle Number' },
      ],
      columns: [
        { label: 'Personnel Name', keys: ['firstName', 'lastName'] },
        { label: 'Emirates ID', keys: ['eid'] },
        { label: 'Date of Birth', keys: ['dob'] },
        { label: 'Gender', keys: ['gender'] },
      ],
      uploads: [
        { label: 'Personal Photo', required: true }, { label: 'Passport' }, { label: 'Emirates ID' },
        { label: 'Visa' }, { label: 'SIRA License' }, { label: 'Supporting Documents' },
      ],
    },
  ],
  agreement: AGREE_PASS,
  sample: i => val(
    { company: COMPANY, licenseNo: LICENSE_NO, licenseSource: LICENSE_SOURCE, approvalNo: 'GLXY222444888', approvalStatus: 'Active' },
    { personnel: [
      { _id: `p-${i}-0`, eid: '784-1990-1234567-1', dob: iso(i, 20).replace('2024', '1990'), gender: 'Male', title: 'Mr', firstName: 'Azan', lastName: 'Ahmed', designation: 'Security Guard', mobile: '+971 501234567' },
      { _id: `p-${i}-1`, eid: '784-1988-7654321-2', dob: iso(i, 12).replace('2024', '1988'), gender: 'Male', title: 'Mr', firstName: 'Rahul', lastName: 'Menon', designation: 'Supervisor', mobile: '+971 509876543' },
    ] },
  ),
};

/* ── 3. Security Services (Figma 1:9409 · 3:6936 · 3:7171 · 3:8180 · 3:7543 · flyout 4:33863) ── */
export const SECURITY_SERVICES: ServiceConfig = {
  key: 'security-services',
  title: 'Tasreeh - Security Services',
  intro: 'Real-time monitoring and control for all facility vessels operations. Includes Guarding services, Escorting services, Crew Transportation to and from Vessel / Immigration.',
  help: help('Security Services',
    'Real-time monitoring and control for facility and vessel operations, including guarding, escorting and crew transportation to and from vessel / immigration.',
    'SERA certificate where applicable.'),
  columns: cols({ key: 'service', label: 'Requested Service', w: 220 }, { key: 'port', label: 'Port', w: 170 }),
  defaultVisible: ['applicationNo', 'createdOn'],
  statuses: STATUSES,
  actions: ACTIONS,
  searchFields: ['Application No.', 'Requested Service', 'Port'],
  filters: filters(
    { key: 'service', label: 'Requested Service', type: 'select', options: ['Guarding Services', 'Escorting Services', 'Crew Transportation', 'Mobile CCTV'] },
    { key: 'port', label: 'Port', type: 'select', options: PORTS },
  ),
  sections: [
    {
      id: 'basic', title: 'Basic Information', kind: 'fields',
      fields: [
        { key: 'company', label: 'Company Name', type: 'readonly', value: COMPANY },
        { key: 'email', label: 'Contact Email', type: 'text', required: true, placeholder: 'Enter email' },
        { key: 'mobile', label: 'Contact Mobile', type: 'phone', required: true, placeholder: 'Enter mobile number' },
        { key: 'remarks', label: 'Company Remarks', type: 'textarea', placeholder: 'Remarks' },
      ],
    },
    {
      id: 'service', title: 'Service Information', kind: 'fields',
      fields: [
        { key: 'service', label: 'Requested Service', type: 'select', required: true, value: 'Guarding Services',
          options: ['Guarding Services', 'Escorting Services', 'Crew Transportation', 'Mobile CCTV'], hint: 'Shift clarification & payment calculation info' },
        { key: 'count', label: 'Requested Number of this service', type: 'number', required: true, value: '1', hint: 'ex: “2 security guards/ 3 mobile CCTV”' },
        { key: 'port', label: 'Port', type: 'select', required: true, options: PORTS },
        { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
        { key: 'from', label: 'From Date/Time', type: 'datetime', required: true },
        { key: 'to', label: 'To Date/Time', type: 'datetime', required: true },
        { key: 'days', label: 'Number of days', type: 'readonly', value: 'As per calculation' },
        { key: 'shifts', label: 'Number of shifts', type: 'readonly', value: 'As per calculation' },
        { key: 'fee', label: 'Service Fee', type: 'amount', value: '1200.00' },
        { key: 'comment', label: 'Comment', type: 'textarea', placeholder: 'Add Comments' },
      ],
      uploads: [{ label: 'SERA Certificate' }],
    },
  ],
  agreement: AGREE_SERVICE,
  sample: i => val({
    company: COMPANY, email: 'azanahmed@abc.com', mobile: '+971 501234567', remarks: 'Remark goes here',
    service: ['Guarding Services', 'Escorting Services', 'Crew Transportation'][i % 3], count: String(1 + (i % 3)),
    port: PORTS[i % PORTS.length], location: 'Berth 7', from: `${iso(i)} 10:00`, to: `${iso(i, 28)} 16:00`,
    days: '30', shifts: '30', fee: '1200.00', comment: '',
  }),
};

/* ── 4. ISPS Services (Figma 1:10023 · 3:8775 · 3:9010 · 3:10019 · 3:9382 · flyout 4:33878) ── */
export const ISPS_SERVICES: ServiceConfig = {
  key: 'isps-services',
  title: 'Tasreeh - ISPS Services',
  intro: 'Refers to compliance support for the International Ship and Port Facility Security (ISPS) Code. Involves global safety standards, port facility and vessel security assessments, ongoing monitoring, regulatory compliance, inspections, onboard monitoring, and crew training.',
  help: help('ISPS Services',
    'Compliance support for the ISPS Code: port facility and vessel security assessments, monitoring, inspections, onboard monitoring and crew training.',
    'Required documents plus each signed general agreement.'),
  columns: cols({ key: 'coordinator', label: 'Coordinator Name', w: 200 }, { key: 'port', label: 'Port', w: 170 }),
  defaultVisible: ['applicationNo', 'createdOn'],
  statuses: STATUSES,
  actions: ACTIONS,
  searchFields: ['Application No.', 'Coordinator Name', 'Port'],
  filters: filters({ key: 'port', label: 'Port', type: 'select', options: PORTS }),
  sections: [
    {
      id: 'basic', title: 'Basic Information', kind: 'fields',
      fields: [
        { key: 'company', label: 'Company Name', type: 'readonly', value: COMPANY },
        { key: 'coordinator', label: 'Coordinator Name', type: 'text', required: true, placeholder: 'Enter coordinator name' },
        { key: 'email', label: 'Coordinator Email', type: 'text', required: true, placeholder: 'Enter coordinator email' },
        { key: 'mobile', label: 'Coordinator Mobile', type: 'phone', required: true, placeholder: 'Enter coordinator number' },
        { key: 'port', label: 'Port', type: 'select', required: true, options: PORTS },
        { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter coordinator Location' },
        { key: 'services', label: 'ISPS Services', type: 'multiselect', required: true,
          options: ['Port Facility Security Assessment', 'Vessel Security Assessment', 'Onboard Monitoring', 'ISPS Inspection', 'Crew Training'] },
        { key: 'remarks', label: 'Company Remarks', type: 'textarea', placeholder: 'Remarks' },
      ],
      uploads: [{ label: 'Required Documents' }],
    },
    {
      id: 'agreements', title: 'General Agreements', kind: 'agreements',
      alert: 'Dear User, please download each agreement document, sign it, and then upload it back again.',
      agreements: ['Document 1', 'Document 2'],
    },
    { id: 'payment', title: 'Payment Information', kind: 'payment', amount: '256.00' },
  ],
  agreement: AGREE_SERVICE,
  sample: i => val({
    company: COMPANY, coordinator: ['Azan Ahmed', 'Sara Hussain', 'Omar Farouk'][i % 3], email: 'azanahmed@abc.com',
    mobile: '+971 501234567', port: PORTS[i % PORTS.length], location: 'Terminal 2',
    services: ['Port Facility Security Assessment|Onboard Monitoring', 'Vessel Security Assessment', 'Crew Training|ISPS Inspection'][i % 3],
    remarks: 'Remark goes here',
  }),
};

/* ── 5. Vessel Services (Figma 1:10637 · 3:10614 · 3:10849 · 3:11858 · 3:11221 · flyout 4:33893) ── */
export const VESSEL_SERVICES: ServiceConfig = {
  key: 'vessel-services',
  title: 'Tasreeh - Vessel Services',
  intro: 'Advanced vessel protection through tailored security assessments, onboard monitoring, crew training, and compliance with international regulations.',
  help: help('Vessel Services',
    'Vessel protection through tailored security assessments, onboard monitoring, crew training and compliance with international regulations.',
    'Required documents plus each signed general agreement.'),
  columns: cols({ key: 'vesselName', label: 'Vessel Name', w: 200 }, { key: 'vesselPort', label: 'Vessel Port', w: 170 }),
  defaultVisible: ['applicationNo', 'createdOn'],
  statuses: STATUSES,
  actions: ACTIONS,
  searchFields: ['Application No.', 'Vessel Name', 'Vessel Port'],
  filters: filters({ key: 'vesselName', label: 'Vessel Name', type: 'text' }, { key: 'vesselPort', label: 'Vessel Port', type: 'select', options: PORTS }),
  sections: [
    {
      id: 'basic', title: 'Basic Information', kind: 'fields',
      fields: [
        { key: 'company', label: 'Company Name', type: 'readonly', value: COMPANY },
        { key: 'email', label: 'Contact Email', type: 'text', required: true, placeholder: 'Enter contact email' },
        { key: 'mobile', label: 'Contact Mobile', type: 'phone', required: true },
        { key: 'vesselName', label: 'Vessel Name', type: 'text', required: true, placeholder: 'Enter Vessel name' },
        { key: 'vesselPort', label: 'Vessel Port', type: 'select', required: true, options: PORTS },
        { key: 'vesselType', label: 'Vessel Type', type: 'text', required: true, placeholder: 'Enter Vessel Type' },
        { key: 'tonnage', label: 'Vessel Gross Tonnage', type: 'text', required: true, placeholder: 'Enter Gross Tonnage' },
        { key: 'length', label: 'Vessel Length', type: 'text', placeholder: 'Enter Vessel length' },
        { key: 'services', label: "Vessel's Services", type: 'multiselect', required: true,
          options: ['Guarding', 'Escorting', 'Onboard Monitoring', 'Crew Transportation', 'Security Assessment'] },
        { key: 'arrival', label: 'Arrival Date', type: 'date', required: true },
        { key: 'departure', label: 'Departure /Sailing Date', type: 'date', required: true },
        { key: 'arms', label: 'Vessels Carrying Arms, Ammunitions & Security on Board Vessel?', type: 'select', options: ['Yes', 'No'] },
        { key: 'captain', label: 'Captain Name', type: 'text', required: true, placeholder: 'Enter Captain Name' },
        { key: 'imo', label: 'Imo Number', type: 'text', placeholder: 'Enter IMO number' },
        { key: 'remarks', label: 'Company Remarks', type: 'textarea', placeholder: 'Remarks' },
      ],
      uploads: [{ label: 'Required Documents' }],
    },
    {
      id: 'agreements', title: 'General Agreements', kind: 'agreements',
      alert: 'Dear User, please download each agreement document, sign it, and then upload it back again.',
      agreements: ['Document 1', 'Document 2'],
    },
  ],
  agreement: AGREE_SERVICE,
  sample: i => val({
    company: COMPANY, email: 'azanahmed@abc.com', mobile: '+971 501234567',
    vesselName: ['MSC Xiamen', 'Maersk Elba', 'CMA CGM Tage'][i % 3], vesselPort: PORTS[i % PORTS.length],
    vesselType: 'Container Ship', tonnage: '153000', length: '366 m', services: 'Guarding|Onboard Monitoring',
    arrival: iso(i), departure: iso(i, 28), arms: 'No', captain: 'John Doe', imo: `9${(703291 + i * 13)}`, remarks: 'Remark goes here',
  }),
};

/* ── 6. Media Services (Figma 1:11251 · 3:12453 · 3:12688 · 3:13697 · 3:13060 · flyout 4:33908) ── */
export const MEDIA_SERVICES: ServiceConfig = {
  key: 'media-services',
  title: 'Tasreeh - Media Services',
  intro: 'Secure approval from PCFC Security and other relevant authorities to enable companies to commence photography, video, and drone services within PCFC areas.',
  help: help('Media Services',
    'Approval from PCFC Security and other relevant authorities for photography, video and drone services within PCFC areas.',
    'Request letter, team IDs and passports, studio trade licence, equipment list, NOCs and approvals.'),
  columns: cols({ key: 'shootingType', label: 'Shooting Type', w: 180 }, { key: 'port', label: 'Port', w: 170 }),
  defaultVisible: ['applicationNo', 'createdOn'],
  statuses: STATUSES,
  actions: ACTIONS,
  searchFields: ['Application No.', 'Shooting Type', 'Port'],
  filters: filters(
    { key: 'shootingType', label: 'Shooting Type', type: 'select', options: ['Ground', 'Aerial (Drone)', 'Marine'] },
    { key: 'port', label: 'Port', type: 'select', options: PORTS },
  ),
  sections: [
    {
      id: 'basic', title: 'Basic Information', kind: 'fields',
      fields: [
        { key: 'port', label: 'Port', type: 'select', required: true, options: PORTS },
        { key: 'location', label: 'Location', type: 'text', required: true, placeholder: 'Enter location' },
        { key: 'dma', label: 'Require Approval from DMA for Maritime Activities?', type: 'radio', required: true, options: ['Yes', 'No'], value: 'Yes',
          span: 2, hint: 'Fee for DMA Approval will be added' },
        { key: 'shootingType', label: 'Shooting Type', type: 'select', required: true, value: 'Ground', options: ['Ground', 'Aerial (Drone)', 'Marine'] },
        { key: 'shootingCategory', label: 'Shooting Category', type: 'select', required: true, options: ['Still Images', 'Video', 'Still Images & Video', 'Live Broadcast'] },
        { key: 'from', label: 'From Date/Time', type: 'datetime', required: true },
        { key: 'to', label: 'To Date/Time', type: 'datetime', required: true },
        { key: 'email', label: 'Contact Email', type: 'text', required: true, placeholder: 'Enter Contact Email' },
        { key: 'mobile', label: 'Contact Number', type: 'phone', required: true },
        { key: 'scope', label: 'Scope of Shooting', type: 'textarea', required: true, placeholder: 'Enter Scope of Shooting' },
        { key: 'remarks', label: 'Applicant Remarks', type: 'textarea', placeholder: 'Enter Applicant Remarks' },
      ],
      uploads: [
        { label: 'Required Documents' },
        { label: 'Request letter from Host Company' },
        { label: 'Emirates ID and Passport Copy with Valid Visa/Entry Stamp of all Photography Team Members', required: true },
        { label: 'Trade license copy of Studio / Filming Company' },
        { label: "List of Accessories and Equipment's", required: true },
        { label: 'NOC from Dubai Film and TV Commission' },
        { label: 'State Security (SSD) Approval', required: true },
        { label: 'Dubai Police Permission' },
        { label: 'Port Entry & Tools & Equipment Pass' },
      ],
    },
  ],
  agreement: AGREE_GENERAL,
  sample: i => val({
    port: PORTS[i % PORTS.length], location: 'Location Added', dma: i % 2 ? 'No' : 'Yes',
    shootingType: ['Ground', 'Aerial (Drone)', 'Marine'][i % 3], shootingCategory: 'Still Images',
    from: `${iso(i)} 10:00`, to: `${iso(i, 25)} 16:00`, email: 'azanahmed@abc.com', mobile: '+971 555555555',
    scope: 'Corporate photo shoot of terminal operations.', remarks: '',
  }),
};

/* Catalogue label → config + seed (keeps application numbers unique per service) */
export const SERVICE_REGISTRY: Record<string, { config: ServiceConfig; seed: number }> = {
  'Tasreeh - Security Companies': { config: SECURITY_COMPANIES, seed: 1 },
  'Tasreeh - Security Personnel': { config: SECURITY_PERSONNEL, seed: 2 },
  'Tasreeh - Security Services':  { config: SECURITY_SERVICES, seed: 3 },
  'Tasreeh - ISPS Services':      { config: ISPS_SERVICES, seed: 4 },
  'Tasreeh - Vessel Services':    { config: VESSEL_SERVICES, seed: 5 },
  'Tasreeh - Media Services':     { config: MEDIA_SERVICES, seed: 6 },
};
