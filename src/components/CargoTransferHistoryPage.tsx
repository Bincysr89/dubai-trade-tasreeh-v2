import React, { useState, useRef, useEffect } from 'react';
import MoreIcon from './MoreIcon';
import { ColumnFilter } from './ColumnFilter';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

type HistoryStatus = 'Suspended' | 'Cleared';

const STATUS_STYLE: Record<HistoryStatus, { bg: string; color: string }> = {
  Suspended: { bg: 'rgba(220,53,69,0.10)', color: '#dc3545' },
  Cleared:   { bg: 'rgba(40,167,69,0.08)',  color: '#28a745' },
};

type HistoryRow = {
  requestDate: string;
  requestNo: string;
  requestType: string;
  transferorCode: string;
  transfereeCode: string;
  broker: string;
  remarks: string;
  assignedDate: string;
  status: HistoryStatus;
};

const ROWS: HistoryRow[] = [
  { requestDate: '24/02/24, 09:30', requestNo: '123456', requestType: 'Cancel',    transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', broker: 'AE-1048909-Broker LLC', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Suspended' },
  { requestDate: '24/02/24, 09:30', requestNo: '597897', requestType: 'Amendment', transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', broker: 'AE-1048909-Broker LLC', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Cleared' },
  { requestDate: '24/02/24, 09:30', requestNo: '748979', requestType: 'New',       transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', broker: 'AE-1048909-Broker LLC', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Cleared' },
  { requestDate: '24/02/24, 09:30', requestNo: '748979', requestType: 'New',       transferorCode: 'AE-09876234-Dubai amm', transfereeCode: 'AE-09876234-Dubai amm', broker: 'AE-1048909-Broker LLC', remarks: 'Lorum ipsum', assignedDate: '24/02/24, 09:30', status: 'Suspended' },
];

type FlyoutItemId = 'viewRequest' | 'amend' | 'cancel' | 'suspensionResponse' | 'print' | 'suspensionHistory';

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 10s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" /><circle cx="10" cy="10" r="2.5" />
    </svg>
  );
}
function EditIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" />
    </svg>
  );
}
function CancelIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" />
    </svg>
  );
}
function HistoryIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 10a8 8 0 1 0 1.5-4.7" /><path d="M2 4.5V10h5.5" /><path d="M10 6v4l2.5 2" />
    </svg>
  );
}
function PrintIcon() {
  return (
    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 7V2h10v5" /><rect x="2" y="7" width="16" height="8" rx="1" />
      <path d="M5 15v3h10v-3" /><circle cx="15" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}

const FLYOUT_ITEMS: { id: FlyoutItemId; label: string; Icon: React.FC }[] = [
  { id: 'viewRequest',        label: 'View Request',       Icon: EyeIcon },
  { id: 'amend',              label: 'Amend',              Icon: EditIcon },
  { id: 'cancel',             label: 'Cancel',             Icon: CancelIcon },
  { id: 'suspensionResponse', label: 'Suspension Response',Icon: HistoryIcon },
  { id: 'print',              label: 'Print Declaration',  Icon: PrintIcon },
  { id: 'suspensionHistory',  label: 'Suspension History', Icon: HistoryIcon },
];

type Props = {
  onBack: () => void;
  onBackToListing?: () => void;
  onSuspensionHistory: () => void;
  onSuspensionResponse: () => void;
  onViewRequest?: () => void;
  onAmend?: () => void;
  onCancel?: () => void;
};

export default function CargoTransferHistoryPage({ onBack, onBackToListing, onSuspensionHistory, onSuspensionResponse }: Props) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const headers: { label: string; w: number }[] = [
    { label: 'Request Date',          w: 140 },
    { label: 'Request No.',           w: 120 },
    { label: 'Request Type',          w: 120 },
    { label: 'Transferor Code & Name',w: 210 },
    { label: 'Transferee Code & Name',w: 210 },
    { label: 'Broker',                w: 180 },
    { label: 'Remarks',               w: 180 },
    { label: 'Status Date',            w: 150 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]">
      {/* Breadcrumb — sticky */}
      <div className="flex-shrink-0 bg-[#f8fafd]">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[16px] pb-[8px] flex-wrap gap-[12px]">
          <div className="flex items-center gap-[6px]">
            <button
              onClick={onBackToListing ?? onBack}
              className="text-[16px] text-[#8f94ae] hover:underline"
              style={{ fontFamily: font }}
            >
              Home
            </button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Integrated Clearance</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Cargo Transfer</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Transfer History</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[100px]">
        {/* Page title */}
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#0e1b3d', fontFamily: font, marginBottom: 8 }}>
          Cargo Transfer History
        </h1>
        <div style={{ position: 'relative' }}>
          <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={186} />
          <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
          <table style={{ minWidth: 1500, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }} className="w-full">
            <thead>
              <tr>
                {headers.map((col, idx) => (
                  <th
                    key={col.label}
                    style={{
                      width: col.w,
                      minWidth: col.w,
                      background: '#a6c2e9',
                      padding: '10px 8px',
                      textAlign: 'left',
                      fontWeight: 500,
                      borderRadius: idx === 0 ? '8px 0 0 0' : undefined,
                      paddingLeft: idx === 0 ? 16 : 8,
                    }}
                  >
                    <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
                  </th>
                ))}
                {/* Sticky: Status */}
                <th style={{ position: 'sticky', right: 66, width: 120, minWidth: 120, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
                  <ColumnFilter label="Status" labelClass="text-[16px] font-medium text-[#051937]" />
                </th>
                {/* Sticky: Actions */}
                <th style={{ position: 'sticky', right: 0, width: 66, minWidth: 66, background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderRadius: '0 8px 0 0' }}>
                  <span className="text-[16px] text-[#051937]">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row, i) => {
                const st = STATUS_STYLE[row.status];
                const cell = (content: React.ReactNode, w: number, extra?: React.CSSProperties) => (
                  <td style={{ background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f8f8f8', ...extra }}>{content}</td>
                );
                const txt = (v: string) => (
                  <span className="text-[16px] text-[#051937] whitespace-nowrap" style={{ fontFamily: font }}>{v}</span>
                );
                return (
                  <tr key={i}>
                    {cell(txt(row.requestDate), 140, { paddingLeft: 16 })}
                    {cell(txt(row.requestNo), 120)}
                    {cell(txt(row.requestType), 120)}
                    {cell(txt(row.transferorCode), 210)}
                    {cell(txt(row.transfereeCode), 210)}
                    {cell(txt(row.broker), 180)}
                    {cell(txt(row.remarks), 180)}
                    {cell(txt(row.assignedDate), 150)}

                    {/* Sticky: Status */}
                    <td style={{ position: 'sticky', right: 66, background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 120, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
                      <span className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px', fontFamily: font }}>
                        {row.status}
                      </span>
                    </td>

                    {/* Sticky: Actions */}
                    <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: 66, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
                      <div className="relative inline-block" ref={openFlyout === i ? flyoutRef : undefined}>
                        <button
                          className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                          aria-label="More actions"
                          onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                        >
                          <MoreIcon />
                        </button>

                        {openFlyout === i && (
                          <div
                            className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden"
                            style={{ right: '100%', top: 0, marginRight: 6, width: 210, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                          >
                            {FLYOUT_ITEMS.map((item) => (
                              <button
                                key={item.id}
                                className="group flex items-center gap-[10px] w-full px-[14px] h-[42px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => {
                                  setOpenFlyout(null);
                                  if (item.id === 'suspensionHistory')  onSuspensionHistory();
                                  if (item.id === 'suspensionResponse') onSuspensionResponse();
                                }}
                              >
                                <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  <item.Icon />
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px] whitespace-nowrap" style={{ fontFamily: font }}>
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* Bottom navigation — sticky */}
      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center px-[40px]">
          <button
            onClick={onBack}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
