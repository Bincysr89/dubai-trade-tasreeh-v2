import { GatePage, GSection, Grid4, GValue, GTag, toneFor, PrimaryBtn, SecondaryBtn, font } from '../gatepass/GateFields';
import { help } from './serviceConfigs';
import type { ServiceConfig, ServiceRow } from './serviceTypes';

/* ──────────────────────────────────────────────────────────────
   My NOC's — second tab on Security Companies / Security
   Personnel (Tasreeh New Services Figma 1:9592 table · 1:12679
   NOC view). Same master listing template as the requests tab.
   ────────────────────────────────────────────────────────────── */

export const NOC_TYPES = ['Security Company NOC', 'Security Personnel NOC', 'Vessel Service', 'ISPS Service'];
export const NOC_STATUSES = ['Valid', 'Amended', 'Expired', 'Cancelled'];

export const NOC_CONFIG: ServiceConfig = {
  key: 'my-nocs',
  title: "My NOC's",
  intro: 'No Objection Certificates issued to your company by PCFC Security.',
  help: help("My NOC's", 'View, download and amend the NOCs issued to your company.', 'Trade licence and the issued NOC.'),
  columns: [
    { key: 'applicationNo', label: 'Approval No', w: 190 },
    { key: 'nocType',       label: 'Service Type', w: 240 },
    { key: 'createdOn',     label: 'Start Date', w: 160 },
    { key: 'endDate',       label: 'End Date', w: 160 },
    { key: 'tradeLicense',  label: 'Trade License Number', w: 210 },
  ],
  defaultVisible: ['applicationNo', 'nocType', 'createdOn', 'endDate'],
  statusLabel: 'Status',
  statuses: NOC_STATUSES,
  actions: ['View'],
  searchFields: ['Certificate Number'],
  filters: [
    { key: 'applicationNo', label: 'Approval No', type: 'text' },
    { key: 'nocType', label: 'Service Type', type: 'select', options: NOC_TYPES },
    { key: 'endDate', label: 'End Date', type: 'date' },
  ],
  sections: [{
    id: 'noc', title: 'NOC Information', kind: 'fields', fields: [
      { key: 'nocType', label: 'Service Type', type: 'select', options: NOC_TYPES },
      { key: 'endDate', label: 'End Date', type: 'date' },
      { key: 'tradeLicense', label: 'Trade License Number', type: 'text' },
      { key: 'tradeLicenseSource', label: 'Trade license source', type: 'text' },
      { key: 'licenseActivities', label: 'License Activities', type: 'text' },
    ],
  }],
  agreement: '',
  sample: () => ({ fields: {}, lists: {} }),
};

/* Sample NOCs (Figma 1:9592) */
const APPROVALS = ['7725068610', '2377471239', '5205896212', '7111924081', '1565015004', '1883798829', '5101345246', '1641617565', '0500042814', '6072232892'];
const TYPES = [0, 1, 1, 1, 1, 1, 2, 3, 2, 3];
const STATUS = ['Amended', 'Valid', 'Expired', 'Valid', 'Cancelled', 'Amended', 'Amended', 'Valid', 'Expired', 'Valid'];

export const NOC_ROWS: ServiceRow[] = APPROVALS.map((no, i) => ({
  applicationNo: no,
  createdOn: '01-Jan-2024',
  status: STATUS[i],
  values: {
    fields: {
      nocType: NOC_TYPES[TYPES[i]], endDate: '2025-01-01',
      tradeLicense: `98655713264${50 + i}`, tradeLicenseSource: 'DED - Dubai', licenseActivities: 'Security Guarding Services',
    },
    lists: {},
  },
}));

/* ── View NOC (Figma 1:12679) ── */
export function NocViewPage({ row, crumb, onHome, onBack, onAmend }: {
  row: ServiceRow; crumb: string; onHome: () => void; onBack: () => void; onAmend: () => void;
}) {
  const f = row.values.fields;
  const end = row.status === 'Valid' || row.status === 'Amended' ? '21-Jan-2025' : '01-Jan-2024';
  return (
    <GatePage
      title={`View NOC - ${row.applicationNo}`}
      crumb={crumb}
      onHome={onHome}
      onListing={onBack}
      footerLeft={<SecondaryBtn onClick={onBack}>Back</SecondaryBtn>}
      footerRight={<PrimaryBtn onClick={onAmend}>Amend</PrimaryBtn>}
    >
      <GSection title="NOC Information" right={
        <div className="flex items-center gap-[8px]">
          <span className="text-[14px] text-[#1a1a1a]" style={{ fontFamily: font }}>Status:</span>
          <GTag label={row.status} tone={row.status === 'Valid' ? 'green' : row.status === 'Amended' ? 'blue' : toneFor(row.status)} />
        </div>
      }>
        <Grid4>
          <GValue label="NOC Number" value={row.applicationNo} />
          <GValue label="NOC Type" value={f.nocType} />
          <GValue label="NOC Start Date" value={row.createdOn} />
          <GValue label="NOC End Date" value={end} />
          <GValue label="Action">
            <a href="#" onClick={e => e.preventDefault()} className="text-[16px] font-medium text-[#1360d2] underline hover:opacity-80" style={{ fontFamily: font }}>
              Download NOC
            </a>
          </GValue>
          <GValue label="Trade License Number" value={f.tradeLicense} />
          <GValue label="Trade license source" value={f.tradeLicenseSource} />
          <GValue label="License Activities" value={f.licenseActivities} />
        </Grid4>
      </GSection>
    </GatePage>
  );
}
