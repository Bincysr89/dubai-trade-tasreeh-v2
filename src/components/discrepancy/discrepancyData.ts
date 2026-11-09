export type ReconciliationType = 'Export' | 'Import';

/** Per-row workflow state — shown in the "Action Status" column. */
export type ActionStatus = 'Closed' | 'Submitted' | 'Info Requested' | 'Action Required';

export type CommentEntry = {
  createdBy: string;
  createdDate: string; // "29-Jul-26 10:05"
  comment: string;
};

export type DiscrepancyRow = {
  id: string;
  rotationNo: string;
  type: ReconciliationType;
  dischargeListContainer: string;
  inboundManifestContainer: string;
  bolNo: string;
  mrn: string;
  attribute: string;
  description: string;
  status: ActionStatus;
  conversation: CommentEntry[];
};

export type RotationGroup = {
  rotationNo: string;
  type: ReconciliationType;
  rows: DiscrepancyRow[];
};

export const ACTION_STATUS_COLORS: Record<ActionStatus, { bg: string; color: string }> = {
  Closed:            { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  Submitted:         { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'Info Requested':  { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Action Required': { bg: 'rgba(220,53,69,0.12)',  color: '#dc3545' },
};

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  Closed: 'Discrepancy Closed',
  Submitted: 'Feedback Submitted',
  'Info Requested': 'Info Requested',
  'Action Required': 'Action Required',
};

export const RECON_TYPE_LABELS: Record<ReconciliationType, string> = {
  Export: 'Load List - Export Manifest',
  Import: 'Discharge List - Import Manifest',
};

/** The first three reference-number columns are relabeled depending on Export vs Import. */
export function columnLabelsFor(type: ReconciliationType): { loaded: string; manifest: string; bol: string } {
  return type === 'Export'
    ? { loaded: 'Loaded Information Container No.', manifest: 'Export Manifest Container No.', bol: 'Export Manifest BOL No.' }
    : { loaded: 'Discharged Information Container No.', manifest: 'Import Manifest Container No.', bol: 'Import Manifest BOL No.' };
}

export const DISCREPANCY_STATUS_OPTIONS: ActionStatus[] = ['Action Required', 'Info Requested', 'Submitted', 'Closed'];

let seq = 0;
const row = (partial: Omit<DiscrepancyRow, 'id'>): DiscrepancyRow => ({ id: `disc-${++seq}`, ...partial });

export const ROTATION_GROUPS: RotationGroup[] = [
  {
    rotationNo: '900131',
    type: 'Import',
    rows: [
      row({ rotationNo: '900131', type: 'Import', dischargeListContainer: 'DLC9001311', inboundManifestContainer: 'MSCU7012341', bolNo: 'BOL9001311', mrn: 'MRN90013101', attribute: 'Container Number Mismatch', description: 'Container number on discharge list does not match inbound manifest.', status: 'Action Required', conversation: [] }),
      row({ rotationNo: '900131', type: 'Import', dischargeListContainer: 'DLC9001312', inboundManifestContainer: 'MSCU7012342', bolNo: 'BOL9001312', mrn: 'MRN90013102', attribute: 'Weight Mismatch', description: 'Gross weight declared exceeds manifest weight by 340 KG.', status: 'Action Required', conversation: [] }),
      row({ rotationNo: '900131', type: 'Import', dischargeListContainer: 'DLC9001313', inboundManifestContainer: 'MSCU7012343', bolNo: 'BOL9001313', mrn: 'MRN90013103', attribute: 'Package Count Discrepancy', description: 'Package count on BOL (24) differs from discharge list (22).', status: 'Info Requested', conversation: [{ createdBy: 'CUSTOMS02', createdDate: '29-Jul-26 10:05', comment: 'Please confirm the correct package count with the shipping line.' }] }),
      row({ rotationNo: '900131', type: 'Import', dischargeListContainer: 'DLC9001314', inboundManifestContainer: 'MSCU7012344', bolNo: 'BOL9001314', mrn: 'MRN90013104', attribute: 'HS Code Mismatch', description: 'HS code on declaration does not align with manifest description.', status: 'Submitted', conversation: [{ createdBy: 'AE-1019056', createdDate: '28-Jul-26 15:42', comment: 'HS code corrected to 8471.30 as per commercial invoice.' }] }),
      row({ rotationNo: '900131', type: 'Import', dischargeListContainer: 'DLC9001315', inboundManifestContainer: 'MSCU7012345', bolNo: 'BOL9001315', mrn: 'MRN90013105', attribute: 'Marks & Numbers Mismatch', description: 'Shipping marks on packages do not match manifest description.', status: 'Closed', conversation: [
        { createdBy: 'AE-1019056', createdDate: '25-Jul-26 09:12', comment: 'Marks verified against packing list — matches manifest.' },
        { createdBy: 'CUSTOMS01', createdDate: '25-Jul-26 14:30', comment: 'Reviewed and closed. No further action required.' },
      ] }),
    ],
  },
  {
    rotationNo: 'AF2026041',
    type: 'Export',
    rows: [
      row({ rotationNo: 'AF2026041', type: 'Export', dischargeListContainer: '—', inboundManifestContainer: '—', bolNo: 'AWB1760224410', mrn: 'MRNAF204101', attribute: 'Weight Mismatch', description: 'Weight listed on airway bill does not match export declaration.', status: 'Action Required', conversation: [{ createdBy: 'CUSTOMS01', createdDate: '31-Jul-26 08:10', comment: 'Verify the weight listed on the airway bill.' }] }),
    ],
  },
  {
    rotationNo: 'SEA2026118',
    type: 'Import',
    rows: [
      row({ rotationNo: 'SEA2026118', type: 'Import', dischargeListContainer: 'DLC2026181', inboundManifestContainer: 'TCLU9981231', bolNo: 'BOL2026181', mrn: 'MRNSEA26181', attribute: 'Container Seal Mismatch', description: 'Seal number on discharge list differs from inbound manifest record.', status: 'Submitted', conversation: [{ createdBy: 'AE-1019056', createdDate: '20-Jul-26 11:00', comment: 'Seal number confirmed with shipping line — updating manifest.' }] }),
      row({ rotationNo: 'SEA2026118', type: 'Import', dischargeListContainer: 'DLC2026182', inboundManifestContainer: 'TCLU9981232', bolNo: 'BOL2026182', mrn: 'MRNSEA26182', attribute: 'Package Count Discrepancy', description: 'Discharge list shows 10 packages; manifest declares 12.', status: 'Closed', conversation: [{ createdBy: 'CUSTOMS02', createdDate: '18-Jul-26 09:30', comment: 'Recount confirmed 12 packages. Closing discrepancy.' }] }),
      row({ rotationNo: 'SEA2026118', type: 'Import', dischargeListContainer: 'DLC2026183', inboundManifestContainer: 'TCLU9981233', bolNo: 'BOL2026183', mrn: 'MRNSEA26183', attribute: 'HS Code Mismatch', description: 'Declared HS code inconsistent with goods description on manifest.', status: 'Info Requested', conversation: [] }),
    ],
  },
  {
    rotationNo: 'DXB0092',
    type: 'Export',
    rows: [
      row({ rotationNo: 'DXB0092', type: 'Export', dischargeListContainer: '—', inboundManifestContainer: '—', bolNo: 'BOLDXB00921', mrn: 'MRNDXB00921', attribute: 'Consignee Details Mismatch', description: 'Consignee name on export declaration differs from bill of lading.', status: 'Info Requested', conversation: [{ createdBy: 'CUSTOMS01', createdDate: '15-Jul-26 13:20', comment: 'Please provide amended bill of lading with corrected consignee name.' }] }),
      row({ rotationNo: 'DXB0092', type: 'Export', dischargeListContainer: '—', inboundManifestContainer: '—', bolNo: 'BOLDXB00922', mrn: 'MRNDXB00922', attribute: 'Package Count Discrepancy', description: 'Package count on export declaration exceeds BOL by 3 units.', status: 'Submitted', conversation: [{ createdBy: 'AE-1019056', createdDate: '14-Jul-26 16:05', comment: 'Corrected package count submitted for review.' }] }),
    ],
  },
];

export const DISCREPANCY_ATTRIBUTE_OPTIONS = Array.from(new Set(ROTATION_GROUPS.flatMap(g => g.rows.map(r => r.attribute))));
