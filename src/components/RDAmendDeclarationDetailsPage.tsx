import React from 'react';
import type { Row } from './EligibleDeclarationsPage';
import ClaimStepper from './ClaimStepper';
import ClaimantBrokerDetail from './ClaimantBrokerDetail';
import BackToListingBar from './BackToListingBar';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

const IMPORTER_CODE_NAMES: Record<string, string> = {
  'A180': 'IMPORTER SONY GULF UAE',
  'A220': 'SW LOGISTICS LLC',
  'A350': 'FREIGHT FORWARDER CO.',
};
const codeWithName = (code?: string) =>
  code ? (IMPORTER_CODE_NAMES[code] ? `${code} - ${IMPORTER_CODE_NAMES[code]}` : code) : '—';

const COLUMNS: { key: string; label: string; w: number }[] = [
  { key: 'declarationNo',       label: 'Declaration Number',         w: 170 },
  { key: 'declarationDate',     label: 'Declaration Clearance Date', w: 180 },
  { key: 'declarationCategory', label: 'Declaration Type',           w: 190 },
  { key: 'depositType',         label: 'Charge Type',                w: 200 },
  { key: 'depositMethod',       label: 'Deposit Method',             w: 160 },
  { key: 'accountNumber',       label: 'Account Number',             w: 150 },
  { key: 'importerCode',        label: 'Owner Code',                 w: 240 },
  { key: 'exportExpiry',        label: 'Export Expiry',              w: 130 },
  { key: 'claimExpiry',         label: 'Claim Expiry',               w: 130 },
];

function cellValue(row: Row, key: string): React.ReactNode {
  switch (key) {
    case 'declarationNo':
      return <span className="text-[16px] text-[#1360d2] whitespace-nowrap" style={{ fontWeight: 500 }}>{row.declarationNo}</span>;
    case 'declarationDate':
      return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.declarationDate}</span>;
    case 'declarationCategory':
      return <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.declarationCategory ?? '—'}</span>;
    case 'depositType':
      return <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.depositType}</span>;
    case 'depositMethod':
      return <span className="text-[16px] whitespace-nowrap" style={{ color: row.depositMethod === 'N/A' ? '#697498' : '#0e1b3d' }}>{row.depositMethod}</span>;
    case 'accountNumber': {
      const has = row.depositMethod === 'Standing Guarantee' && row.accountNumber;
      return <span className="text-[16px] whitespace-nowrap" style={{ color: has ? '#0e1b3d' : '#697498' }}>{has ? row.accountNumber : '—'}</span>;
    }
    case 'importerCode':
      return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{codeWithName(row.importerCode)}</span>;
    case 'exportExpiry':
      return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.exportExpiry}</span>;
    case 'claimExpiry':
      return <span className="text-[16px] whitespace-nowrap" style={{ color: '#dc3545', fontWeight: 500 }}>{row.claimExpiry}</span>;
    default:
      return '—';
  }
}

type Props = {
  rows: Row[];
  onRowsChange: (rows: Row[]) => void;
  claimNo: string;
  claimLabel: string;
  steps: { id: string; label: string }[];
  onBack: () => void;
  onBackToListing: () => void;
  onProceed: () => void;
};

export default function RDAmendDeclarationDetailsPage({ rows, onRowsChange, claimNo, claimLabel, steps, onBack, onBackToListing, onProceed }: Props) {
  const removeRow = (declarationNo: string) => onRowsChange(rows.filter(r => r.declarationNo !== declarationNo));
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0 flex-wrap">
        {['Home', 'Refund & Claims', 'Amend Claim'].map((l, i, arr) => (
          <React.Fragment key={l}>
            <span className="text-[16px]" style={{ color: i === arr.length - 1 ? '#111838' : '#8f94ae', fontWeight: i === arr.length - 1 ? 500 : 400 }}>{l}</span>
            {i < arr.length - 1 && <span className="text-[16px] text-[#dc3545]">/</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Title */}
      <div className="px-4 sm:px-10 mb-[8px] flex-shrink-0">
        <h1 className="text-2xl sm:text-3xl lg:text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>
          Amend — {claimLabel} - {claimNo}
        </h1>
      </div>

      {/* Stepper */}
      <div className="px-4 sm:px-10 pb-[20px] flex-shrink-0">
        <ClaimStepper activeIndex={0} steps={steps} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[24px] flex flex-col gap-[20px]">
        <div className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#eef1f6] flex-wrap gap-[12px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
              Declaration Details
              <span className="ml-[8px] text-[14px] text-[#1360d2]" style={{ fontWeight: 500 }}>({rows.length})</span>
            </p>
          </div>

          <div className="px-[16px] pt-[8px] pb-[16px]" style={{ position: 'relative' }}>
            <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={72} />
            <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
            <table style={{ minWidth: COLUMNS.reduce((s, c) => s + c.w, 0) + 72, borderCollapse: 'separate', borderSpacing: '0 8px' }} className="w-full">
              <thead>
                <tr>
                  {COLUMNS.map((col, ci) => (
                    <th key={col.key} style={{
                      width: col.w, minWidth: col.w, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500,
                      ...(ci === 0 ? { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 } : {}),
                    }}>
                      <span className="text-[16px] text-[#000] whitespace-nowrap" style={{ letterSpacing: '0.07px' }}>{col.label}</span>
                    </th>
                  ))}
                  <th style={{ position: 'sticky', right: 0, width: 72, minWidth: 72, background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
                    <span className="text-[16px] text-[#000]">Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={COLUMNS.length + 1} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                      <span className="text-[16px] text-[#697498]">No declarations remaining on this claim.</span>
                    </td>
                  </tr>
                ) : rows.map(row => (
                  <tr key={row.declarationNo}>
                    {COLUMNS.map(col => (
                      <td key={col.key} style={{ background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: col.w }}>
                        {cellValue(row, col.key)}
                      </td>
                    ))}
                    <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 72, textAlign: 'center', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                      <button
                        type="button"
                        onClick={() => removeRow(row.declarationNo)}
                        aria-label={`Delete ${row.declarationNo}`}
                        className="size-[32px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors"
                        style={{ color: '#dc3545' }}
                      >
                        <svg viewBox="0 0 20 20" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                          <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        </div>

        <ClaimantBrokerDetail claimantCode="AE-1019056" claimantName="CONSOLIDATED SHIPPING SERVICES L.L.C" brokerCode="AE-1019056" brokerName="CONSOLIDATED SHIPPING SERVICES L.L.C" />
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing}
        rightContent={
          <button
            onClick={onProceed}
            disabled={rows.length === 0}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: rows.length === 0 ? '#a7c3eb' : '#1360d2', cursor: rows.length === 0 ? 'not-allowed' : 'pointer', fontWeight: 500, boxShadow: rows.length === 0 ? 'none' : '0px 0px 8px rgba(28,72,191,0.16)' }}
          >
            Proceed
          </button>
        }
      />
    </div>
  );
}
