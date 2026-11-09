export type DdoRecordStatus = 'nearing-expiry' | 'submitted' | 'pending' | 'completed';

export interface DdoRecord {
  bolNumber: string;
  referenceNumber: string;
  status: DdoRecordStatus;
  doValidityDate: string;
}

const STATUS_CONFIG: Record<DdoRecordStatus, { label: string; color: string; bg: string }> = {
  'nearing-expiry': { label: 'Nearing Expiry', color: '#d67e74', bg: '#fff5f5' },
  'submitted':      { label: 'Submitted',      color: '#6a7bc7', bg: '#eef2ff' },
  'pending':        { label: 'Pending',         color: '#d3ab40', bg: '#fffbeb' },
  'completed':      { label: 'Completed',       color: '#5cb78f', bg: '#f0fdf4' },
};

const TITLE_MAP: Record<DdoRecordStatus, string> = {
  'nearing-expiry': 'Nearing Expiry',
  'submitted':      'Submitted',
  'pending':        'Pending',
  'completed':      'Completed',
};

const MOCK_RECORDS: DdoRecord[] = [
  { bolNumber: 'BOL324565477', referenceNumber: 'REF-12345678', status: 'nearing-expiry', doValidityDate: '15-12-2023' },
  { bolNumber: 'BOL987654321', referenceNumber: 'REF-87654321', status: 'nearing-expiry', doValidityDate: '18-12-2023' },
  { bolNumber: 'BOL112233445', referenceNumber: 'REF-11223344', status: 'nearing-expiry', doValidityDate: '19-12-2023' },
  { bolNumber: 'BOL445588221', referenceNumber: 'REF-44558822', status: 'nearing-expiry', doValidityDate: '20-12-2023' },
  { bolNumber: 'BOL776655443', referenceNumber: 'REF-77665544', status: 'nearing-expiry', doValidityDate: '21-12-2023' },
  { bolNumber: 'BOL556677889', referenceNumber: 'REF-55667788', status: 'submitted',      doValidityDate: '22-12-2023' },
  { bolNumber: 'BOL667788990', referenceNumber: 'REF-66778899', status: 'submitted',      doValidityDate: '23-12-2023' },
  { bolNumber: 'BOL778899001', referenceNumber: 'REF-77889900', status: 'submitted',      doValidityDate: '24-12-2023' },
  { bolNumber: 'BOL889900112', referenceNumber: 'REF-88990011', status: 'submitted',      doValidityDate: '25-12-2023' },
  { bolNumber: 'BOL990011223', referenceNumber: 'REF-99001122', status: 'submitted',      doValidityDate: '26-12-2023' },
  { bolNumber: 'BOL001122334', referenceNumber: 'REF-00112233', status: 'submitted',      doValidityDate: '27-12-2023' },
  { bolNumber: 'BOL112233446', referenceNumber: 'REF-11223345', status: 'submitted',      doValidityDate: '28-12-2023' },
  { bolNumber: 'BOL223344557', referenceNumber: 'REF-22334456', status: 'submitted',      doValidityDate: '29-12-2023' },
  { bolNumber: 'BOL334455668', referenceNumber: 'REF-33445567', status: 'submitted',      doValidityDate: '30-12-2023' },
  { bolNumber: 'BOL445566779', referenceNumber: 'REF-44556678', status: 'submitted',      doValidityDate: '31-12-2023' },
  { bolNumber: 'BOL556677880', referenceNumber: 'REF-55667789', status: 'submitted',      doValidityDate: '01-01-2024' },
  { bolNumber: 'BOL667788991', referenceNumber: 'REF-66778800', status: 'submitted',      doValidityDate: '02-01-2024' },
  { bolNumber: 'BOL223344556', referenceNumber: 'REF-22334455', status: 'pending',        doValidityDate: '05-01-2024' },
  { bolNumber: 'BOL334455667', referenceNumber: 'REF-33445566', status: 'pending',        doValidityDate: '06-01-2024' },
  { bolNumber: 'BOL445566778', referenceNumber: 'REF-44556677', status: 'pending',        doValidityDate: '07-01-2024' },
  { bolNumber: 'BOL556677001', referenceNumber: 'REF-55667700', status: 'completed',      doValidityDate: '10-01-2024' },
  { bolNumber: 'BOL667788112', referenceNumber: 'REF-66778811', status: 'completed',      doValidityDate: '11-01-2024' },
  { bolNumber: 'BOL778899223', referenceNumber: 'REF-77889922', status: 'completed',      doValidityDate: '12-01-2024' },
  { bolNumber: 'BOL889900334', referenceNumber: 'REF-88990033', status: 'completed',      doValidityDate: '13-01-2024' },
  { bolNumber: 'BOL990011445', referenceNumber: 'REF-99001144', status: 'completed',      doValidityDate: '14-01-2024' },
];

interface Props {
  status: DdoRecordStatus;
  onClose: () => void;
}

export default function DdoRecordsPage({ status, onClose }: Props) {
  const records = MOCK_RECORDS.filter(r => r.status === status);
  const cfg = STATUS_CONFIG[status];

  return (
    <div className="fixed inset-0 z-50 bg-[#f9fafb] flex flex-col">
      <div className="bg-[#1e2d4d] flex items-center gap-4 px-6 py-4 flex-shrink-0 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]">
        <button
          onClick={onClose}
          className="bg-white rounded-full size-10 flex items-center justify-center flex-shrink-0 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-[#1e2d4d]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-dubai font-bold text-[20px]">DDO Records</h1>
          <p className="text-white font-dubai text-[12px] opacity-80">{TITLE_MAP[status]}</p>
        </div>
        <div className="ml-auto">
          <span
            className="px-3 py-1 rounded-full font-dubai font-bold text-[16px]"
            style={{ backgroundColor: cfg.bg, color: cfg.color }}
          >
            {records.length} records
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-6 py-6 flex flex-col gap-3">
          {records.length === 0 ? (
            <div className="text-center py-16">
              <div className="size-16 rounded-full bg-[#f3f4f6] flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="size-8 text-[#99a1af]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="text-[#6a7282] font-dubai font-medium text-[16px]">No records found</p>
            </div>
          ) : (
            records.map((record, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#f3f4f6] rounded-[16px] p-5 shadow-[0px_4px_7px_rgba(17,24,39,0.06)] hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[#1e2939] font-dubai font-bold text-[16px]">{record.bolNumber}</p>
                    <p className="text-[#6a7282] font-dubai text-[12px] mt-0.5">{record.referenceNumber}</p>
                  </div>
                  <span
                    className="rounded-full px-3 py-1 font-dubai font-bold text-[12px] flex-shrink-0"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-[#f3f4f6]">
                  <svg viewBox="0 0 24 24" className="size-4 text-[#99a1af]" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span className="text-[#364153] font-dubai text-[16px]">
                    DO Validity:{' '}
                    <span className="font-bold text-[#1e2939]">{record.doValidityDate}</span>
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
