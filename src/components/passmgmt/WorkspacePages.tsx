import { DhAmount } from '../Dh';
import PmListCard, { GreyIconBtn, type Col } from './PmTable';
import { PmPage, Tag, C } from './PmUI';
import { PORTS, STATUSES, type DraftRow, type PassRow, type ReceiptRow } from './pmData';

/* ──────────────────────────────────────────────────────────────
   My Workspace pages — Figma 1087:16926 (My Drafts),
   1125:22940 (My Approved Passes), 2258:38532 (My Requests),
   4826:68172 (My Payment Receipts).
   ────────────────────────────────────────────────────────────── */

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M1.5 12S5 5.5 12 5.5 22.5 12 22.5 12 19 18.5 12 18.5 1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const PencilIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" strokeLinejoin="round" />
  </svg>
);
const BinIcon = () => (
  <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <path d="M3 5h14M8 5V3h4v2M16 5l-1 12H5L4 5M8 9v5M12 9v5" />
  </svg>
);
const DownloadIcon = () => (
  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M10 3v10M5.5 8.5L10 13l4.5-4.5M3 14v3h14v-3" />
  </svg>
);

export function DraftsPage({ rows, onHome, onEdit, onDelete }: {
  rows: DraftRow[]; onHome: () => void; onEdit: (r: DraftRow) => void; onDelete: (r: DraftRow) => void;
}) {
  const cols: Col<DraftRow>[] = [
    { key: 'refId', label: 'Reference ID' },
    { key: 'serviceType', label: 'Service Type' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'expiresOn', label: 'Expires On' },
  ];
  return (
    <PmPage crumbs={[{ label: 'My Drafts' }]} onHome={onHome}>
      <PmListCard title="My Drafts" rows={rows} cols={cols} rowKey={r => r.id}
        search={r => `${r.refId} ${r.serviceType} ${r.createdOn} ${r.expiresOn}`}
        actionCol={{
          label: 'Action', width: '110px',
          render: r => (
            <div className="flex gap-[10px]">
              <GreyIconBtn label={`Edit ${r.refId}`} onClick={() => onEdit(r)}><PencilIcon /></GreyIconBtn>
              <GreyIconBtn label={`Delete ${r.refId}`} tone="red" onClick={() => onDelete(r)}><BinIcon /></GreyIconBtn>
            </div>
          ),
        }}
      />
    </PmPage>
  );
}

const passFilters = [
  { label: 'Port Name', options: PORTS, match: (r: PassRow, v: string) => r.portName === v },
  { label: 'Pass Type', options: ['Permanent', 'Temporary'], match: (r: PassRow, v: string) => r.passType === v },
];

export function ApprovedPassesPage({ rows, onHome, onView }: { rows: PassRow[]; onHome: () => void; onView: (r: PassRow) => void }) {
  const cols: Col<PassRow>[] = [
    { key: 'passRefNo', label: 'Pass Reference No.' },
    { key: 'applicationNo', label: 'Application No.' },
    { key: 'portName', label: 'Port Name' },
    { key: 'passType', label: 'Pass Type' },
    { key: 'passDuration', label: 'Pass Duration' },
    { key: 'hostCompany', label: 'Host Company' },
    { key: 'status', label: 'Status', render: r => <Tag status={r.status} /> },
  ];
  return (
    <PmPage crumbs={[{ label: 'My Approved Passes' }]} onHome={onHome}>
      <PmListCard title="My Approved Passes" rows={rows} cols={cols} rowKey={r => r.passRefNo}
        search={r => `${r.passRefNo} ${r.applicationNo}`} searchPlaceholder="Search with pass reference number or application number"
        filters={passFilters}
        actionCol={{ label: 'Action', width: '80px', render: r => <GreyIconBtn label={`View ${r.passRefNo}`} onClick={() => onView(r)}><EyeIcon /></GreyIconBtn> }}
      />
    </PmPage>
  );
}

export function MyRequestsPage({ rows, onHome, onView }: { rows: PassRow[]; onHome: () => void; onView: (r: PassRow) => void }) {
  const cols: Col<PassRow>[] = [
    { key: 'applicationNo', label: 'Application No' },
    { key: 'portName', label: 'Port Name' },
    { key: 'passType', label: 'Pass Type' },
    { key: 'passDuration', label: 'Pass Duration' },
    { key: 'createdOn', label: 'Created On' },
    { key: 'status', label: 'Status', render: r => <Tag status={r.status} /> },
  ];
  return (
    <PmPage crumbs={[{ label: 'My Requests' }]} onHome={onHome}>
      <PmListCard title="My Requests" rows={rows} cols={cols} rowKey={r => r.applicationNo}
        search={r => r.applicationNo} searchPlaceholder="Search with application number"
        filters={[...passFilters, { label: 'Status', options: STATUSES, match: (r, v) => r.status === v }]}
        actionCol={{ label: 'Action', width: '80px', render: r => <GreyIconBtn label={`View ${r.applicationNo}`} onClick={() => onView(r)}><EyeIcon /></GreyIconBtn> }}
      />
    </PmPage>
  );
}

export function PaymentReceiptsPage({ rows, onHome, onDownload }: { rows: ReceiptRow[]; onHome: () => void; onDownload: (r: ReceiptRow) => void }) {
  const cols: Col<ReceiptRow>[] = [
    { key: 'receiptNo', label: 'Receipt Number' },
    { key: 'applicationNo', label: 'Application Number' },
    { key: 'amount', label: 'Amount (In AED)', value: r => r.amount.padStart(8, '0'),
      render: r => <DhAmount value={r.amount} className="font-bold text-[15px]" style={{ color: C.text }} /> },
    { key: 'createdOn', label: 'Created On' },
  ];
  return (
    <PmPage crumbs={[{ label: 'My Payment Receipts' }]} onHome={onHome}>
      <PmListCard title="My Payment Receipts" rows={rows} cols={cols} rowKey={r => r.receiptNo}
        search={r => `${r.applicationNo} ${r.receiptNo}`} searchPlaceholder="Search with application number"
        filters={[{ label: 'Created On', options: ['01-Jan-2024'], match: (r, v) => r.createdOn === v }]}
        actionCol={{ label: 'Action', width: '80px', render: r => <GreyIconBtn label={`Download receipt ${r.receiptNo}`} onClick={() => onDownload(r)}><DownloadIcon /></GreyIconBtn> }}
      />
    </PmPage>
  );
}
