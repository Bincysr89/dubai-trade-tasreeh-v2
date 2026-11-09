export type Channel = 'Sea' | 'Air';
export type Movement = 'Inbound' | 'Outbound';
export type DeclarationStatus = 'Cleared' | 'Cancelled';

export const JOURNEY_STAGES = [
  'Vessel Arrived',
  'Manifest Submitted',
  'Cargo Discharged',
  'DO Issued',
  'Declaration Cleared',
  'Inspection Booking Complete',
  'Cargo Released from Container Yard',
  'Inspection Complete',
] as const;

export type CargoDetail = {
  vessel: { rotationNumber: string; eta: string; ata: string };
  manifest: { bolNumber: string; submissionAgent: string; submissionDate: string };
  discharge: { containerCategoryStatus: string; noOfContainers: string };
  delivery: { issueDate: string; consignee: string; expiryDate: string };
  inspectionBooking: { bookingDate: string; bookingStatus: string };
  cargoRelease: { released: string; lastReleaseDate: string; containers: { containerNo: string; releasedDate: string }[] };
  inspectionResult: { inspectionStatus: string; approvalDate: string };
  currentStageIndex: number;
};

export type CargoSearchResult = {
  id: string;
  transportDocNo: string;
  declarationNo: string;
  channel: Channel;
  movement: Movement;
  status: DeclarationStatus;
  submissionDate: string;
  clearanceDate: string;
  detail: CargoDetail;
};

/* ── Scenario A — Declaration No. search ─────────────────────────────── */
const RESULT_A: CargoSearchResult = {
  id: 'cgo-a1',
  transportDocNo: 'MSC2026DXB008',
  declarationNo: '2026100856123',
  channel: 'Sea',
  movement: 'Inbound',
  status: 'Cleared',
  submissionDate: '22/04/26',
  clearanceDate: '23/04/26 11:40',
  detail: {
    vessel: { rotationNumber: '820512', eta: '21/04/26 09:15', ata: '22/04/26 06:40' },
    manifest: { bolNumber: 'MSC2026DXB008', submissionAgent: 'AE-1032210 (MSC GULF FZE...)', submissionDate: '22/04/26 07:10' },
    discharge: { containerCategoryStatus: 'FCL CONTAINER', noOfContainers: '3' },
    delivery: { issueDate: '22/04/26 12:00', consignee: 'AE-1041233 (GULF TRADING CO...)', expiryDate: '22/06/26 00:00' },
    inspectionBooking: { bookingDate: '23/04/26 09:53', bookingStatus: 'Booking Complete' },
    cargoRelease: { released: '3 of 3 Containers', lastReleaseDate: '23/04/26 14:02', containers: [
      { containerNo: 'MSCU4051767', releasedDate: '23/04/2026' },
      { containerNo: 'MSCU4213930', releasedDate: '23/04/2026' },
      { containerNo: 'MSCU4213931', releasedDate: '23/04/2026' },
    ] },
    inspectionResult: { inspectionStatus: 'Complete', approvalDate: '23/04/26 15:10' },
    currentStageIndex: 8,
  },
};

/* ── Scenario B — BOL / AWB search (Sea, Inbound, NAV9100030225) ────────
   Two records are returned, matching the same BOL. */
const RESULT_B1: CargoSearchResult = {
  id: 'cgo-b1',
  transportDocNo: 'NAV9100030225',
  declarationNo: '2010160123456',
  channel: 'Sea',
  movement: 'Inbound',
  status: 'Cleared',
  submissionDate: '10/06/21',
  clearanceDate: '10/06/21 18:17',
  detail: {
    vessel: { rotationNumber: '820489', eta: '19/06/21 13:42', ata: '10/06/21 00:02' },
    manifest: { bolNumber: 'NAV9100030225', submissionAgent: 'AE-1051144 (XCRN BUSINESS...)', submissionDate: '10/06/21 18:17' },
    discharge: { containerCategoryStatus: 'FCL CONTAINER', noOfContainers: '1' },
    delivery: { issueDate: '08/06/21 14:04', consignee: 'AE-1026467 (ALOKOZAY GENE...)', expiryDate: '15/07/25 00:00' },
    inspectionBooking: { bookingDate: '22/06/21 09:53', bookingStatus: 'Booking Complete' },
    cargoRelease: { released: '1 of 1 Container', lastReleaseDate: '23/06/21 14:02', containers: [
      { containerNo: 'NAVU9100322', releasedDate: '23/06/2021' },
    ] },
    inspectionResult: { inspectionStatus: 'Complete', approvalDate: '24/06/21 09:02' },
    currentStageIndex: 8,
  },
};

const RESULT_B2: CargoSearchResult = {
  id: 'cgo-b2',
  transportDocNo: 'NAV9100030225',
  declarationNo: '2010160123457',
  channel: 'Sea',
  movement: 'Inbound',
  status: 'Cancelled',
  submissionDate: '11/06/21',
  clearanceDate: '—',
  detail: {
    vessel: { rotationNumber: '820490', eta: '20/06/21 10:00', ata: '11/06/21 02:15' },
    manifest: { bolNumber: 'NAV9100030225', submissionAgent: 'AE-1051144 (XCRN BUSINESS...)', submissionDate: '11/06/21 09:00' },
    discharge: { containerCategoryStatus: 'LCL CONTAINER', noOfContainers: '2' },
    delivery: { issueDate: '—', consignee: '—', expiryDate: '—' },
    inspectionBooking: { bookingDate: '—', bookingStatus: '—' },
    cargoRelease: { released: '—', lastReleaseDate: '—', containers: [] },
    inspectionResult: { inspectionStatus: '—', approvalDate: '—' },
    currentStageIndex: 1,
  },
};

export function searchByDeclaration(declarationNo: string): CargoSearchResult[] {
  const q = declarationNo.trim();
  if (!q) return [];
  return q === '2026100856123' ? [RESULT_A] : [];
}

export function searchByBolAwb(bol: string, _channel: Channel, _movement: Movement, _rotationNo?: string): CargoSearchResult[] {
  const q = bol.trim().toUpperCase();
  if (!q) return [];
  return q === 'NAV9100030225' ? [RESULT_B1, RESULT_B2] : [];
}
