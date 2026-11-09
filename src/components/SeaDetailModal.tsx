import { useState } from 'react';
import Header from './Header';
// @ts-ignore
import shipIconSrc from '../assets/Ship (12).svg';
import catalogueBg from '../assets/catalogue background.jpg';
import ServiceListingPage, { ColConfig, RowData, AFFieldDef } from './ServiceListingPage';
import BillPaymentPage from './BillPaymentPage';
import DCCertificatesFormPage from './DCCertificatesFormPage';
import DCCertificatesViewPage from './DCCertificatesViewPage';
import GenericServiceFormPage, { GenericServiceConfig } from './GenericServiceFormPage';
import CTRFormPage from './CTRFormPage';
import CWLFormPage from './CWLFormPage';
import CWLViewPage from './CWLViewPage';
import CWLPaymentPage from './CWLPaymentPage';
import DCServiceChooserPage from './DCServiceChooserPage';
import JoinClientAccreditationPage from './JoinClientAccreditationPage';
import SubmitVoluntaryDisclosurePage from './SubmitVoluntaryDisclosurePage';
import GoodsLandingCertPage from './GoodsLandingCertPage';
import CargoInspectionPage from './CargoInspectionPage';
import DeclarationListPage from './DeclarationListPage';
import CargoReconciliationPage from './discrepancy/CargoReconciliationPage';
import CargoTrackingContainer from './cargotracking/CargoTrackingContainer';

type Props = { onClose: () => void; /** Open straight on a service (header search). */ initialItem?: string };

// DCAA/SIRA priority services shown first (and highlighted) in the Cargo Clearance column
const DCAA_SIRA_SERVICES = [
  'DCAA - NOC - Dangerous Goods',
  'DCAA - Inspect Suspicious Goods',
  'DCAA - NOC - Firearms and Ammunition by Air',
  'SIRA - Goods Control Permit',
];

// DM priority services shown first (and highlighted) in the Cargo Management column
const DM_CARGO_SERVICES = [
  'DM - Approval of Animal Food Identification Label',
  'DM - Permit to Release Importer Veterinary Consignments',
  'DM- Permit to Admit Animals or Veterinary Products to Market',
  'DM - Health Certificate for Animals and Veterinary Products',
  'DM - Permits to Release Imported Consumer Products Consignments',
  'DM - Register Consumer Products',
  'DM - Free Sale Certificate for Consumer Products',
  'DM - Health Certificate to Export Consumer Products',
  'DM - Permit to advertise Consumer Producst',
  'DM -Register and Access a Food Item',
  'DM - Request to Transfer food consignment from and to Dubai',
  'DM - Release of Importer Food Consignments for Local Market',
  'DM - Release of Imported Food Consignments for Re-Export',
  'DM - Request for Food Export/Food Health Certificate',
];

export const SEA_COLUMNS: { title: string; items: string[] }[] = [
  {
    title: 'Registration',
    items: [
      'AEO Program', 'Client Accreditation', 'DC - Manage Services',
      'Case Registration', 'Register shipping line', 'Shipping Line Master',
    ],
  },
  {
    title: 'Carrier Management',
    items: [
      'DPA - Pre-qualification', 'DPA - PAN,PDN,PC', 'DPA - NOC Certificates',
      'DPA - ePermit', 'DPA - License Activity Approval',
      'DMA- Provider Registration (3)', 'DMA- NOC Certificates',
      'DMA - Operating Permit (2)',
      'DMA- Vessel Anchorage Permit in the Emirates water',
      'Berth Booking', 'Tanker Berth Booking', 'Rotation Enquiry',
      'Shipping Service Schedule', 'Vessel Line Change',
      'Vessel Registration Request', 'Water Reading',
    ],
  },
  {
    title: 'Cargo Management',
    items: [
      ...DM_CARGO_SERVICES,
      'Bill of Lading', 'Container Request', 'DDO', 'Discharge /Load List',
      'DNOC', 'Export Manifest', 'Manage DDO/DNOC', 'Manifest',
      'NOC Linking', 'Trade +', 'Voyage', 'Voyage NOC',
      'CT Miscellaneous Services', 'Agent Event Notification',
      'Container Cleaning', 'Container Enquiry', 'Container Hold/Release',
      'Container Line Change', 'Delivery Order', 'Dit Hub Container',
      'EDI Management', 'Empty / Load Containers', 'Gang Crane',
      'GC Cargo Nomination', 'GC E-payment', 'GC Gate Advice',
      'GC Load List', 'GC Miscellaneous Services', 'GC Rollover',
      'GC Services', 'GC Transshipment', 'GC Vehicle List',
      'Haulier Nomination', 'HUB Services', 'Manifest Services',
      'MECRC Services', 'OTO Services', 'Purchase Order', 'Sea Air Cargo',
      'Standing Instruction', 'Stowage plan', 'Stuffing Tally Sheet',
      'VOR Report', 'Voyage Management', 'DMA',
    ],
  },
  {
    title: 'Cargo Clearance',
    items: [
      ...DCAA_SIRA_SERVICES,
      'Integrated Clearance',
      'Bill Payment',
      'DC - Service Request',
      'Request Goods Landing Certificate',
      'Request Customs Warehouse License',
      'Request Duty Account',
      'Cargo Inspection',
      'DC - landing Certificate', 'DC - Letter & Certificates', 'DM Permits',
      'DP World Work Permits', 'e-Certificates', 'IMDG NOC Management',
      'Marine NOC', 'Master Declaration', 'Cargo Reconciliation',
      'Cargo Tracking', 'DC - Export Manifest',
      'DC - Smart Workspace', 'Declaration Services', 'Digital Certificate',
      'Cargo Transfer Services', 'M1- Bill Clearance', 'VCC Services',
    ],
  },
  {
    title: 'Payments',
    items: [
      'Advance Deposit', 'Claim Services', 'Centralized Payments',
      'DC - Account Services', 'DP World Payments', 'e-Payment',
      'Invoice Payment', 'Prepaid Card', 'Refund Services',
      'Deposit Refund', 'TLUC Payment',
    ],
  },
  {
    title: 'Gate Management',
    items: [
      'Cargo Waves', 'E-Gate Pass', 'EGP Services', 'LGP Services',
      'Other Emirates Bill', 'Request', 'Token Services',
      'Truck Registration', 'VGM Certificate', 'Visitor Gate Pass - PCFC',
    ],
  },
  {
    title: 'Reports',
    items: [
      'Container Reports', 'Declaration Statement',
      'Discharge Load Operations', 'M1- Bill Clearance', 'Vessel reports',
    ],
  },
];

/* ── Page configs for service listing pages ─────────────────────────── */

// Shared statuses for all 3 main services
const SVC_STATUSES = ['Approved', 'Submitted', 'Cancelled', 'Payment Pending', 'Approved', 'Submitted', 'Cancelled'];

const STATUSES = ['Closed', 'Submitted', 'Submitted', 'Payment Pending', 'VAT Payment Pending', 'Declined', 'Cancelled'];
const SUBJECTS = ['Export from Local', 'Export Statistical', 'Re Export to ROW (after import for re export)'];

const GLC_VESSELS   = ['Testname', 'Al Salam', 'Dubai Star', 'Falcon Express', 'Gulf Carrier', 'Ocean Pride', 'Mariner'];
const GLC_COUNTRIES = ['China', 'India', 'USA', 'Germany', 'Japan', 'South Korea', 'UAE'];
const GLC_DATES     = ['12-01-2025', '03-03-2025', '18-04-2025', '27-05-2025', '09-06-2025', '14-07-2025', '22-08-2025'];

const DOC_ROWS: RowData[] = STATUSES.map((status, i) => ({
  requestNumber:    `R00723-51324${i}`,
  requestDate:      GLC_DATES[i],
  billOfEntryNo:    `101324545${i + 1}`,
  billDate:         GLC_DATES[i],
  billOfLadingNo:   `BOL121132${i + 1}`,
  vessel:           GLC_VESSELS[i],
  arrivedFrom:      GLC_COUNTRIES[i],
  arrivedOn:        GLC_DATES[i],
  paymentAccount:   `3674${6 + i}`,
  status,
}));

/* DC Service Request listing columns & rows */
const DCC_COLS: ColConfig[] = [
  { label: 'Request Number', key: 'requestNumber', width: 170 },
  { label: 'Request Date',   key: 'requestDate',   width: 160 },
  { label: 'Service Name',   key: 'serviceName',   width: 260 },
  { label: 'Service Type',   key: 'serviceType',   width: 260 },
];
const DCC_SERVICE_DATA = [
  { serviceName: 'Request Certificate',                 serviceType: 'Landing Certificate' },
  { serviceName: 'Join Client Accreditation',           serviceType: '-' },
  { serviceName: 'Request Customs Transaction Reports', serviceType: '-' },
  { serviceName: 'Submit Voluntary Disclosure',         serviceType: '-' },
  { serviceName: 'Request Certificate',                 serviceType: '-' },
  { serviceName: 'Join Client Accreditation',           serviceType: '-' },
  { serviceName: 'Request Customs Transaction Reports', serviceType: '-' },
];
const DCC_ROWS: RowData[] = SVC_STATUSES.map((status, i) => ({
  requestNumber: `R00723-51325${i}`,
  requestDate:   `${String(i + 1).padStart(2, '0')}-Jun-2025`,
  serviceName:   DCC_SERVICE_DATA[i].serviceName,
  serviceType:   DCC_SERVICE_DATA[i].serviceType,
  status,
}));

/* CTR listing columns & rows */
const CTR_COLS: ColConfig[] = [
  { label: 'Request Number', key: 'requestNumber', width: 180 },
  { label: 'Request Date',   key: 'requestDate',   width: 160 },
  { label: 'Request Type',   key: 'requestType',   width: 200 },
];
const CTR_ROWS: RowData[] = SVC_STATUSES.map((status, i) => ({
  requestNumber: `CTR-${2025100 + i}`,
  requestDate:   `${String(i + 1).padStart(2, '0')}-Jun-2025`,
  requestType:   'Customs Transaction Report',
  status,
}));

const REF_ROWS: RowData[] = STATUSES.map((status, i) => ({
  refNumber: '1012132132',
  subject: SUBJECTS[Math.min(i, 2)],
  submittedDate: '05-Dec-24',
  submittedBy: 'code + name',
  requestNo: '12345788',
  requestType: 'New',
  status,
}));

const ACC_ROWS: RowData[] = STATUSES.map(status => ({
  requestNumber: '1012132132',
  accountType: 'New',
  accountName: '12345788',
  accountHolder: '05-Dec-24',
  availableBalance: 'code + name',
  requestDate: 'code + name',
  remarks: 'code + name',
  status,
}));

const DOC_COLS: ColConfig[] = [
  { label: 'Request Number',      key: 'requestNumber',    width: 170 },
  { label: 'Request Date',        key: 'requestDate',      width: 140 },
  { label: 'Bill of Entry No.',   key: 'billOfEntryNo',    width: 160 },
  { label: 'Bill Date',           key: 'billDate',         width: 130 },
  { label: 'Bill of Lading No.',  key: 'billOfLadingNo',   width: 155 },
  { label: 'Vessel',              key: 'vessel',           width: 130 },
  { label: 'Arrived From',        key: 'arrivedFrom',      width: 130 },
  { label: 'Arrived On',          key: 'arrivedOn',        width: 130 },
  { label: 'Payment Account',     key: 'paymentAccount',   width: 150 },
];

const REF_COLS: ColConfig[] = [
  { label: 'Reference Number', key: 'refNumber',     width: 155 },
  { label: 'Subject',          key: 'subject',       width: 310 },
  { label: 'Submitted Date',   key: 'submittedDate', width: 130 },
  { label: 'Submitted by',     key: 'submittedBy',   width: 130 },
  { label: 'Request No.',      key: 'requestNo',     width: 120 },
  { label: 'Request Type',     key: 'requestType',   width: 120 },
];

const CWL_COLS: ColConfig[] = [
  { label: 'Request Number', key: 'requestNumber', width: 180 },
  { label: 'Request Date',   key: 'requestDate',   width: 160 },
  { label: 'Request Type',   key: 'requestType',   width: 200 },
];

const CWL_ROWS: RowData[] = SVC_STATUSES.map((status, i) => ({
  requestNumber: `REQ-CWL-${100 + i}`,
  requestDate:   `${String(i + 1).padStart(2, '0')}-Jun-2025`,
  requestType:   'New License',
  status,
}));

const ACC_COLS: ColConfig[] = [
  { label: 'Request Number',    key: 'requestNumber',    width: 145, isLink: true },
  { label: 'Account Type',      key: 'accountType',      width: 130 },
  { label: 'Account Name',      key: 'accountName',      width: 140 },
  { label: 'Account Holder',    key: 'accountHolder',    width: 145 },
  { label: 'Available Balance', key: 'availableBalance', width: 155 },
  { label: 'Request Date',      key: 'requestDate',      width: 130 },
  { label: 'Remarks',           key: 'remarks',          width: 120 },
];

/* ── Advanced filter field definitions ─────────────────────────────── */
const ALL_STATUSES = ['Closed', 'Submitted', 'Payment Pending', 'VAT Payment Pending', 'Declined', 'Cancelled', 'Approved'];

const GLC_FILTER_FIELDS: AFFieldDef[] = [
  { key: 'reqNo',    label: 'Request Number',    type: 'text' },
  { key: 'dateFrom', label: 'Request Date From', type: 'date' },
  { key: 'dateTo',   label: 'Request Date To',   type: 'date' },
  { key: 'bol',      label: 'BOL Number',        type: 'text' },
  { key: 'boe',      label: 'BOE Number',        type: 'text' },
  { key: 'status',   label: 'Status',            type: 'dropdown', options: ALL_STATUSES },
];

const DCC_SERVICE_NAMES = [
  'Request Certificate',
  'Join Client Accreditation',
  'Request Customs Transaction Reports',
  'Submit Voluntary Disclosure',
];
const DCC_SERVICE_TYPES = [
  'Landing Certificate',
  'New Enrollment',
  'Declaration Report',
  'Statistical Report',
  'Voluntary Disclosure',
];
const DCC_FILTER_FIELDS: AFFieldDef[] = [
  { key: 'serviceName', label: 'Service Name',      type: 'dropdown', options: DCC_SERVICE_NAMES },
  { key: 'serviceType', label: 'Service Type',      type: 'dropdown', options: DCC_SERVICE_TYPES },
  { key: 'status',      label: 'Status',            type: 'dropdown', options: ALL_STATUSES },
  { key: 'dateFrom',    label: 'Request Date From', type: 'date' },
  { key: 'dateTo',      label: 'Request Date To',   type: 'date' },
];

type PageKey = 'glc' | 'jap' | 'cwl' | 'ctr' | 'rda' | 'pbf' | 'dcc' | 'cargoInspection' | 'integratedClearance' | 'cargoReconciliation' | 'tracking';

const PAGE_CONFIGS: Record<Exclude<PageKey, 'pbf' | 'dcc' | 'cargoInspection' | 'integratedClearance' | 'cargoReconciliation' | 'tracking' | 'ctr' | 'cwl'> | 'ctr' | 'cwl', {
  title: string; breadcrumb: string; primaryLabel: string;
  searchLabel: string; searchPlaceholder: string; searchFields?: string[];
  advancedFilterFields?: AFFieldDef[];
  columns: ColConfig[]; rows: RowData[]; hasDraftsToggle?: boolean;
}> = {
  glc: {
    title: 'Goods Landing Certificate',
    breadcrumb: 'Goods Landing Certificate',
    primaryLabel: 'New Request',
    searchLabel: 'Request Number',
    searchPlaceholder: 'Search...',
    searchFields: ['Request Number', 'Bill of Entry Number'],
    advancedFilterFields: GLC_FILTER_FIELDS,
    columns: DOC_COLS,
    rows: DOC_ROWS,
  },
  jap: {
    title: 'Join Client Accreditation',
    breadcrumb: 'Join Client Accreditation',
    primaryLabel: 'New Request',
    searchLabel: 'Reference Number',
    searchPlaceholder: 'Declaration no.',
    columns: REF_COLS,
    rows: REF_ROWS,
    hasDraftsToggle: true,
  },
  cwl: {
    title: 'Custom Warehouse License',
    breadcrumb: 'Custom Warehouse License',
    primaryLabel: 'New Request',
    searchLabel: 'Request Number',
    searchPlaceholder: 'Request number',
    columns: CWL_COLS,
    rows: CWL_ROWS,
  },
  ctr: {
    title: 'Customs Transaction Report',
    breadcrumb: 'Customs Transaction Report',
    primaryLabel: 'New Request',
    searchLabel: 'Request Number',
    searchPlaceholder: 'Request number',
    columns: CTR_COLS,
    rows: CTR_ROWS,
  },
  rda: {
    title: 'Manage Accounts',
    breadcrumb: 'Manage Accounts',
    primaryLabel: 'New Account',
    searchLabel: 'Reference Number',
    searchPlaceholder: 'Reference no.',
    columns: ACC_COLS,
    rows: ACC_ROWS,
  },
};

export const ITEM_PAGE_MAP: Record<string, PageKey> = {
  'Request Goods Landing Certificate':    'glc',
  'Bill Payment':                         'pbf',
  'Join Accreditation Program':           'jap',
  'Request Customs Warehouse License':    'cwl',
  'Request Customs Transactions Report':  'ctr',
  'Request Duty Account':                 'rda',
  'DC - Service Request':                 'dcc',
  'Cargo Inspection':                     'cargoInspection',
  'Integrated Clearance':                 'integratedClearance',
  'Cargo Reconciliation':                 'cargoReconciliation',
  'Cargo Tracking':                       'tracking',
};
/* ── Generic Form Configs ────────────────────────────────────────────────── */
const CTR_CONFIG: GenericServiceConfig = {
  serviceName: 'Request Customs Transactions Report',
  serviceDescription: 'This service allows customers to request a comprehensive transactions report from Dubai Customs, providing detailed data on all customs transactions within a specified period.',
  charges: '200.00',
  requirements: 'Trade license, Emirates ID, Customs file number, Date range for report, Business code',
  breadcrumbLabel: 'Customs Transaction Report',
  serviceTypes: [
    { name: 'Statistical Report',     fees: '100.00', description: 'Provides aggregate statistical data on customs transactions over a specified period.', requirements: 'Business code, Date range, Trade license' },
    { name: 'Declaration Report',     fees: '200.00', description: 'Provides detailed information on individual customs declarations within the requested period.', requirements: 'Declaration numbers, Date range, Business code' },
    { name: 'Summary Transactions',   fees: '150.00', description: 'A summarized overview of all customs transactions grouped by category or type.', requirements: 'Business code, Date range' },
    { name: 'Detailed Transactions',  fees: '300.00', description: 'A full line-by-line breakdown of each customs transaction including duties, taxes, and fees.', requirements: 'Business code, Date range, Authorization letter' },
  ],
};

const CWL_CONFIG: GenericServiceConfig = {
  serviceName: 'Request Customs Warehouse License',
  serviceDescription: 'This service allows customers to obtain, renew, or modify a Customs Warehouse License, permitting the storage of goods under customs supervision without immediate duty payment.',
  charges: '1000.00',
  requirements: 'Trade license, Site plan, Warehouse lease agreement, Emirates ID, Fire safety certificate, Municipality approval',
  breadcrumbLabel: 'Customs Warehouse License',
  serviceTypes: [
    { name: 'New License',           fees: '1000.00', description: 'Application for a brand new Customs Warehouse License for storing goods under customs control.', requirements: 'Trade license, Site plan, Lease agreement, Fire safety certificate, Municipality NOC' },
    { name: 'License Renewal',       fees: '500.00',  description: 'Renewal of an existing Customs Warehouse License before its expiry date.', requirements: 'Current license copy, Trade license, Updated lease agreement' },
    { name: 'License Modification',  fees: '300.00',  description: 'Modification of license details such as warehouse area, location, or authorized goods.', requirements: 'Current license, Modification justification letter, Updated documents' },
    { name: 'License Cancellation',  fees: '200.00',  description: 'Cancellation of an existing Customs Warehouse License and clearance of all stored goods.', requirements: 'Current license, Clearance certificate for stored goods, Written cancellation request' },
  ],
};
/* ─────────────────────────────────────────────────────────────────────── */

export default function SeaDetailModal({ onClose, initialItem }: Props) {
  const [search, setSearch]         = useState('');
  const [activePage, setActivePage] = useState<PageKey | null>(initialItem ? ITEM_PAGE_MAP[initialItem] ?? null : null);
  // dccService: null=listing, 'chooser'=picker, then the actual service key
  const [dccService, setDccService] = useState<string | null>(null);
  const [dccViewRow, setDccViewRow] = useState<RowData | null>(null);
  const [dccPayRow, setDccPayRow]   = useState<RowData | null>(null);
  const [showGlcForm, setShowGlcForm] = useState(false);
  const [showCtrForm, setShowCtrForm] = useState(false);
  const [showCwlForm, setShowCwlForm] = useState(false);
  const [showJapForm, setShowJapForm] = useState(false);
  const [showRdaForm, setShowRdaForm] = useState(false);
  const [cwlViewRow, setCwlViewRow]   = useState<RowData | null>(null);
  const [cwlPayRow, setCwlPayRow]     = useState<RowData | null>(null);

  const filtered = SEA_COLUMNS.map(col => ({
    ...col,
    items: search
      ? col.items.filter(i => i.toLowerCase().includes(search.toLowerCase()))
      : col.items,
  })).filter(col => !search || col.items.length > 0);

  /* Render a listing page when one is active */
  if (activePage === 'pbf') {
    return <BillPaymentPage onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'cargoInspection') {
    return <CargoInspectionPage onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'integratedClearance') {
    return <DeclarationListPage onClose={() => setActivePage(null)} onServiceCatalogue={() => setActivePage(null)} />;
  }
  if (activePage === 'cargoReconciliation') {
    return <CargoReconciliationPage onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'tracking') {
    return <CargoTrackingContainer onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'dcc') {
    // Service form pages
    if (dccService === 'certificate') {
      return <DCCertificatesFormPage onBack={() => setDccService(null)} />;
    }
    if (dccService === 'accreditation') {
      return <JoinClientAccreditationPage onBack={() => setDccService(null)} />;
    }
    if (dccService === 'ctr') {
      return <CTRFormPage onBack={() => setDccService(null)} />;
    }
    if (dccService === 'disclosure') {
      return <SubmitVoluntaryDisclosurePage onBack={() => setDccService(null)} />;
    }
    if (dccService === 'chooser') {
      return (
        <DCServiceChooserPage
          onBack={() => setDccService(null)}
          onSelect={(svc) => setDccService(svc)}
        />
      );
    }
    // View / Pay detail pages
    if (dccViewRow) {
      return <DCCertificatesViewPage row={dccViewRow as any} onBack={() => setDccViewRow(null)} />;
    }
    if (dccPayRow) {
      return <CWLPaymentPage row={dccPayRow as any} onBack={() => setDccPayRow(null)} />;
    }
    // Listing
    return (
      <ServiceListingPage
        title="DC - Service Request"
        breadcrumb="DC - Service Request"
        primaryLabel="New Request"
        searchLabel="Request Number"
        searchPlaceholder="Search..."
        advancedFilterFields={DCC_FILTER_FIELDS}
        columns={DCC_COLS}
        rows={DCC_ROWS}
        onBack={() => setActivePage(null)}
        onNewRequest={() => setDccService('chooser')}
        onViewRequest={(row) => setDccViewRow(row)}
        onMakePayment={(row) => setDccPayRow(row)}
      />
    );
  }
  if (activePage === 'ctr') {
    if (showCtrForm) {
      return <CTRFormPage onBack={() => setShowCtrForm(false)} />;
    }
    const cfg = PAGE_CONFIGS['ctr'];
    return (
      <ServiceListingPage
        {...cfg}
        onBack={() => setActivePage(null)}
        onNewRequest={() => setShowCtrForm(true)}
      />
    );
  }
  if (activePage === 'cwl') {
    if (showCwlForm) {
      return <CWLFormPage onBack={() => setShowCwlForm(false)} />;
    }
    if (cwlViewRow) {
      return <CWLViewPage row={cwlViewRow as any} onBack={() => setCwlViewRow(null)} />;
    }
    if (cwlPayRow) {
      return <CWLPaymentPage row={cwlPayRow as any} onBack={() => setCwlPayRow(null)} />;
    }
    const cfg = PAGE_CONFIGS['cwl'];
    return (
      <ServiceListingPage
        {...cfg}
        onBack={() => setActivePage(null)}
        onNewRequest={() => setShowCwlForm(true)}
        onViewRequest={(row) => setCwlViewRow(row)}
        onMakePayment={(row) => setCwlPayRow(row)}
      />
    );
  }
  if (activePage === 'glc') {
    if (showGlcForm) {
      return <GoodsLandingCertPage onBack={() => setShowGlcForm(false)} />;
    }
    const cfg = PAGE_CONFIGS['glc'];
    return (
      <ServiceListingPage
        {...cfg}
        onBack={() => setActivePage(null)}
        onNewRequest={() => setShowGlcForm(true)}
      />
    );
  }
  if (activePage === 'jap') {
    if (showJapForm) {
      return <JoinClientAccreditationPage onBack={() => setShowJapForm(false)} />;
    }
    const cfg = PAGE_CONFIGS['jap'];
    return (
      <ServiceListingPage
        {...cfg}
        onBack={() => setActivePage(null)}
        onNewRequest={() => setShowJapForm(true)}
      />
    );
  }
  if (activePage === 'rda') {
    if (showRdaForm) {
      return <GenericServiceFormPage
        config={{ serviceName: 'Request Duty Account', serviceDescription: 'Apply to open or manage a duty account with Dubai Customs.', charges: '0.00', requirements: 'Trade license, Emirates ID, Customs file number', breadcrumbLabel: 'Manage Accounts', serviceTypes: [{ name: 'New Account', fees: '0.00', description: 'Open a new duty account with Dubai Customs.', requirements: 'Trade license, Emirates ID, Customs file number' }] }}
        onBack={() => setShowRdaForm(false)}
      />;
    }
    const cfg = PAGE_CONFIGS['rda'];
    return (
      <ServiceListingPage
        {...cfg}
        onBack={() => setActivePage(null)}
        onNewRequest={() => setShowRdaForm(true)}
      />
    );
  }
  if (activePage) {
    const cfg = PAGE_CONFIGS[activePage as 'glc'];
    if (!cfg) return null;
    return (
      <ServiceListingPage
        {...cfg}
        onBack={() => setActivePage(null)}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Full-page catalogue background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${catalogueBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Navigation header */}
      <div className="relative z-10 flex-shrink-0">
        <Header onServiceCatalogue={onClose} />
      </div>

      {/* Close button — top right below header */}
      <button
        onClick={onClose}
        className="absolute right-[16px] top-[96px] z-20 size-[36px] flex items-center justify-center text-[#0e1b3d] hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-[24px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Spacer above the SEA section */}
      <div className="relative z-10 flex-shrink-0 h-[60px]" />

      {/* Sub-nav + title area */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative flex items-center justify-center px-10 py-5">
          {/* Left: AIR navigation */}
          <a className="absolute left-10 flex items-center gap-3 cursor-pointer hover:opacity-80">
            <div
              className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            <span
              className="text-[#0a1852] text-[20px] uppercase tracking-wider"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400 }}
            >
              Air
            </span>
          </a>

          {/* Center: icon + SEA + subtitle */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div
                className="bg-[#0e1b3d] border border-white flex items-center justify-center flex-shrink-0 rounded-[10px]"
                style={{ width: 40, height: 40, padding: 4 }}
              >
                <img src={shipIconSrc} alt="Sea" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
              </div>
              <span
                className="text-[#0a1852] text-[24px] uppercase font-bold"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                Sea
              </span>
            </div>
            <p
              className="text-[#060c28] text-[20px] text-center mt-1"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, letterSpacing: '0.2px' }}
            >
              Explore extensive services offered for all of modes.
            </p>
          </div>

          {/* Right: FREEZONES navigation */}
          <a className="absolute right-10 flex items-center gap-3 cursor-pointer hover:opacity-80">
            <span
              className="text-[#0a1852] text-[20px] uppercase tracking-wider"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400 }}
            >
              Freezones
            </span>
            <div
              className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Search bar */}
        <div className="flex justify-center pb-5">
          <div className="relative w-full sm:w-[440px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Services"
              className="w-full h-[48px] border border-[#d0d5e8] rounded-[8px] pl-4 pr-12 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-white focus:outline-none focus:border-[#0e1b3d]"
              style={{ fontFamily: "'Dubai', sans-serif" }}
            />
            <svg
              viewBox="0 0 18 18"
              width="20" height="20"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              fill="none"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
            </svg>
          </div>
        </div>
      </div>

      {/* Service columns — whole card scrolls */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-10 lg:px-[60px] pt-6 pb-6">
        {/* Gradient border wrapper */}
        <div
          className="rounded-[14px] p-[3px]"
          style={{
            background: 'linear-gradient(135deg, rgba(19,96,210,1) 0%, rgba(255,255,255,1) 50%, rgba(232,44,42,1) 100%)',
          }}
        >
          <div
            className="bg-white rounded-[12px] overflow-x-auto"
            style={{ boxShadow: '0 4px 15.5px rgba(0,0,0,0.08)' }}
          >
            <div className="flex divide-x divide-[#e8eaf0] w-full">
              {filtered.map(col => (
                <div key={col.title} className="flex-1 flex flex-col px-3 pt-6 pb-4">
                  {/* Column header */}
                  <div className="mb-5">
                    <p
                      className="text-[#0e1b3d] text-[16px] font-medium leading-6 whitespace-nowrap"
                      style={{ fontFamily: "'Dubai', sans-serif", letterSpacing: '0.18px' }}
                    >
                      {col.title}
                    </p>
                    <div className="w-6 h-[2px] bg-[#e8212e] mt-1" />
                  </div>
                  {/* Items */}
                  <div className="flex flex-col gap-[8px]">
                    {col.items.map(item => {
                      const pageKey    = ITEM_PAGE_MAP[item];
                      const HIGHLIGHTED = new Set([
                        'Integrated Clearance',
                        'Request Goods Landing Certificate',
                        'Bill Payment',
                        'Request Duty Account',
                        'Request Customs Warehouse License',
                        'DC - Service Request',
                        'Cargo Inspection',
                        'Cargo Reconciliation',
                        'Cargo Tracking',
                      ]);
                      const TALL_ITEMS = new Set([
                        'Request Goods Landing Certificate',
                      ]);
                      // DPA/DMA priority services — pinned to the top and shown with a soft lighter tint
                      const DPA_DMA = new Set([
                        'DPA - Pre-qualification', 'DPA - PAN,PDN,PC', 'DPA - NOC Certificates',
                        'DPA - ePermit', 'DPA - License Activity Approval',
                        'DMA- Provider Registration (3)', 'DMA- NOC Certificates',
                        'DMA - Operating Permit (2)',
                        'DMA- Vessel Anchorage Permit in the Emirates water',
                      ]);
                      const isHighlighted = HIGHLIGHTED.has(item);
                      const isDpaDma      = DPA_DMA.has(item) || DM_CARGO_SERVICES.includes(item) || DCAA_SIRA_SERVICES.includes(item);
                      const isTall        = TALL_ITEMS.has(item);
                      return (
                        <button
                          key={item}
                          onClick={pageKey ? () => setActivePage(pageKey) : undefined}
                          className={`text-left px-[10px] rounded-[4px] text-[16px] transition-colors ${
                            isHighlighted
                              ? 'bg-[#dce9ff] border border-[#1360d2] text-[#1360d2] hover:bg-[#c5d9ff] font-medium'
                              : isDpaDma
                              ? 'bg-[#eef1fc] border border-[#c7d0f2] text-[#3a4a86] hover:bg-[#e2e7fb] font-medium'
                              : 'bg-[#f7faff] text-[#0e1b3d] hover:bg-[#d6e6ff]'
                          }`}
                          style={{
                            fontFamily: "'Dubai', sans-serif",
                            letterSpacing: '0.14px',
                            lineHeight: '24px',
                            cursor: pageKey ? 'pointer' : 'default',
                            minHeight: isTall ? 52 : 40,
                            paddingTop: isTall ? 6 : 0,
                            paddingBottom: isTall ? 6 : 0,
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
