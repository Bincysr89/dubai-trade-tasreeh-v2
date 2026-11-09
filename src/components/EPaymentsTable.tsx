import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Pagination from './Pagination';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

function DirhamIcon({ size = 14, color = '#0e1b3d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 17 / 20)} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <g clipPath="url(#drhm-ep)">
        <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="drhm-ep"><rect width="20" height="17" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

type EPayStatus = 'Success' | 'Payment Pending' | 'Failed';
type EPayModule = 'Declaration' | 'VCC' | 'Cargo Transfer' | 'Refund & Claims' | 'Acknowledgement';

const STATUS_STYLE: Record<EPayStatus, { bg: string; color: string }> = {
  'Success':         { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Payment Pending': { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Failed':          { bg: 'rgba(192,57,43,0.10)',  color: '#c0392b' },
};

const MODULE_STYLE: Record<EPayModule, { bg: string; color: string }> = {
  'Declaration':      { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'VCC':              { bg: 'rgba(139,92,246,0.10)',  color: '#7c3aed' },
  'Cargo Transfer':   { bg: 'rgba(20,184,166,0.10)',  color: '#0d9488' },
  'Refund & Claims':  { bg: 'rgba(249,115,22,0.10)',  color: '#ea580c' },
  'Acknowledgement':  { bg: 'rgba(234,179,8,0.10)',   color: '#a16207' },
};

type EPayRow = {
  module: EPayModule;
  reqDate: string;
  declNo: string;
  approvalDate: string;
  reqNo: string;
  reqType: string;
  clientDecRef: string;
  /** Claim type behind the payment — only meaningful for Refund & Claims requests. */
  claimType: string;
  amount: string;
  status: EPayStatus;
};

const ROWS: EPayRow[] = [
  /* Declaration */
  { module: 'Declaration',     reqDate: '05-Feb-26', declNo: '1080000003626', approvalDate: '2026-02-05T14:15:48', reqNo: '1101545031', reqType: 'New Declaration',    claimType: '—', clientDecRef: 'sreevani',     amount: '93.00',  status: 'Payment Pending'   },
  { module: 'Declaration',     reqDate: '05-Feb-26', declNo: '1080000003526', approvalDate: '2026-02-05T14:12:17', reqNo: '1101545029', reqType: 'New Declaration',    claimType: '—', clientDecRef: 'SREEVANI',     amount: '93.00',  status: 'Payment Pending'   },
  { module: 'Declaration',     reqDate: '04-Feb-26', declNo: '1080000003412', approvalDate: '2026-02-04T09:30:00', reqNo: '1101544987', reqType: 'Amendment',          claimType: '—', clientDecRef: 'JOB-20240205', amount: '115.00', status: 'Success'   },
  { module: 'Declaration',     reqDate: '03-Feb-26', declNo: '1080000003301', approvalDate: '2026-02-03T11:45:22', reqNo: '1101544856', reqType: 'New Declaration',    claimType: '—', clientDecRef: 'REF-450123',   amount: '93.00',  status: 'Failed'    },
  { module: 'Declaration',     reqDate: '03-Feb-26', declNo: '1080000003298', approvalDate: '2026-02-03T08:20:11', reqNo: '1101544812', reqType: 'Amendment',          claimType: '—', clientDecRef: 'PGH-658916',   amount: '78.00',  status: 'Payment Pending'   },
  /* VCC */
  { module: 'VCC',             reqDate: '02-Feb-26', declNo: '1080000003201', approvalDate: '2026-02-02T10:05:33', reqNo: '1101544750', reqType: 'VCC Request',        claimType: '—', clientDecRef: '25365',        amount: '155.00', status: 'Payment Pending'   },
  { module: 'VCC',             reqDate: '01-Feb-26', declNo: '1080000003178', approvalDate: '2026-02-01T13:40:00', reqNo: '1101544698', reqType: 'VCC Request',        claimType: '—', clientDecRef: '25366',        amount: '155.00', status: 'Success'   },
  { module: 'VCC',             reqDate: '30-Jan-26', declNo: '1080000003054', approvalDate: '2026-01-30T09:00:00', reqNo: '1101544600', reqType: 'VCC Amendment',      claimType: '—', clientDecRef: '25370',        amount: '80.00',  status: 'Failed'    },
  /* Cargo Transfer */
  { module: 'Cargo Transfer',  reqDate: '06-Feb-26', declNo: '601001745352',  approvalDate: '2026-02-06T08:30:00', reqNo: '1201600411', reqType: 'New Cargo Transfer', claimType: '—', clientDecRef: 'CT-2024-00112', amount: '220.00', status: 'Payment Pending'   },
  { module: 'Cargo Transfer',  reqDate: '04-Feb-26', declNo: '601001745200',  approvalDate: '2026-02-04T11:20:00', reqNo: '1201600380', reqType: 'New Cargo Transfer', claimType: '—', clientDecRef: 'CT-2024-00099', amount: '220.00', status: 'Success'   },
  { module: 'Cargo Transfer',  reqDate: '02-Feb-26', declNo: '601001745051',  approvalDate: '2026-02-02T14:55:00', reqNo: '1201600342', reqType: 'Amend Transfer',     claimType: '—', clientDecRef: 'CT-2024-00087', amount: '110.00', status: 'Failed'    },
  /* Refund & Claims */
  { module: 'Refund & Claims', reqDate: '07-Feb-26', declNo: '1080000003700', approvalDate: '2026-02-07T10:10:00', reqNo: '1301700200', reqType: 'Refund Request',     claimType: 'Refund of Deposits', clientDecRef: 'RF-2024-0881',  amount: '450.00', status: 'Payment Pending'   },
  { module: 'Refund & Claims', reqDate: '05-Feb-26', declNo: '1080000003650', approvalDate: '2026-02-05T09:45:00', reqNo: '1301700185', reqType: 'Deposit Claim',      claimType: 'Non Remittance', clientDecRef: 'RF-2024-0874',  amount: '1200.00',status: 'Success'   },
  { module: 'Refund & Claims', reqDate: '03-Feb-26', declNo: '1080000003580', approvalDate: '2026-02-03T13:30:00', reqNo: '1301700160', reqType: 'Refund Request',     claimType: 'Refund of Deposits', clientDecRef: 'RF-2024-0862',  amount: '330.00', status: 'Failed'    },
  /* Acknowledgement */
  { module: 'Acknowledgement', reqDate: '08-Feb-26', declNo: '1080000003750', approvalDate: '2026-02-08T08:00:00', reqNo: '1401800050', reqType: 'Ack. Fee',           claimType: '—', clientDecRef: 'ACK-2024-0091', amount: '50.00',  status: 'Payment Pending'   },
  { module: 'Acknowledgement', reqDate: '06-Feb-26', declNo: '1080000003690', approvalDate: '2026-02-06T10:30:00', reqNo: '1401800039', reqType: 'Ack. Fee',           claimType: '—', clientDecRef: 'ACK-2024-0088', amount: '50.00',  status: 'Success'   },
];

const SCROLL_COLUMNS: (ColDef & { w: number })[] = [
  { key: 'reqNo',     label: 'Request No.',   w: 150 },
  { key: 'reqType',   label: 'Request Type',  w: 190 },
  { key: 'reqDate',   label: 'Request Date',  w: 150 },
  { key: 'claimType', label: 'Claim Type',    w: 200 },
  { key: 'amount',    label: 'Amount (AED)',  w: 140 },
];

/* Every ePayment row exposes the same action set. */
const FLYOUT_W = 230;

const EPAY_ACTIONS: { label: string; icon: React.ReactNode }[] = [
  { label: 'Make Payment',           icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/></svg> },
  { label: 'Recheck Payment Status', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 10a7 7 0 1 1-2.05-4.95"/><path d="M17 3v4h-4"/></svg> },
  { label: 'Payment History',        icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5"/><path d="M10 6v4l2.5 2"/></svg> },
  { label: 'View',                   icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/></svg> },
  { label: 'Download',               icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10"/><path d="M5 9l5 5 5-5"/><path d="M3 17h14"/></svg> },
];

export default function EPaymentsTable({
  filterReqNo,
  module,
  searchDeclNo,
  searchReqNo,
  searchReqType,
  externalStatus,
  showColModal,
  onCloseColModal,
}: {
  filterReqNo?: string;
  module?: string;
  searchDeclNo?: string;
  searchReqNo?: string;
  searchReqType?: string;
  /** Payment Status picked in the page toolbar. */
  externalStatus?: string | null;
  showColModal?: boolean;
  onCloseColModal?: () => void;
}) {
  const [page, setPage]           = useState(1);
  const [pageSize, setPageSize]   = useState(8);
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const [flyoutPos, setFlyoutPos] = useState<{ top: number; left: number } | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);

  /* The flyout is a fixed-position portal rather than an inline `absolute` box: the table's
     `overflow-x-auto` wrapper also computes overflow-y to `auto`, which clipped the menu
     against the pagination bar for rows near the bottom. */
  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    const onScroll = () => setOpenFlyout(null);
    document.addEventListener('mousedown', onDoc);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [openFlyout]);
  const [visibleCols, setVisibleCols] = useState<string[]>(SCROLL_COLUMNS.map((c) => c.key));
  const vis = (key: string) => visibleCols.includes(key);
  const visibleHeaders = visibleCols.map((k) => SCROLL_COLUMNS.find((c) => c.key === k)!).filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const visibleRows = ROWS.filter(r =>
    (!module || r.module === module) &&
    (!filterReqNo || r.clientDecRef === filterReqNo) &&
    (!searchDeclNo || r.declNo.includes(searchDeclNo)) &&
    (!searchReqNo || r.reqNo.includes(searchReqNo)) &&
    (!searchReqType || r.reqType === searchReqType) &&
    (!externalStatus || r.status === externalStatus)
  );
  const paginated = visibleRows.slice((page - 1) * pageSize, page * pageSize);

  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + 230;

  return (
    <>
    {showColModal && (
      <ManageColumnsModal
        columns={SCROLL_COLUMNS}
        visible={visibleCols}
        lockedColumns={[{ key: '_status', label: 'Payment Status' }, { key: '_action', label: 'Action' }]}
        onSave={setVisibleCols}
        onClose={() => onCloseColModal?.()}
      />
    )}
    <div style={{ position: 'relative' }}>
      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={230} />
    <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
      {resizeIndicatorLeft !== null && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3, background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
      )}
      <table
        ref={tableRef}
        onMouseMove={handleTableMouseMove}
        onMouseLeave={handleTableMouseLeave}
        onMouseDown={handleTableMouseDown}
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontFamily: font,
          minWidth: tableMinWidth,
          cursor: isNearResize ? 'col-resize' : undefined,
        }}
      >
        {/* ── HEADER ── */}
        <thead>
          <tr>
            {visibleHeaders.map((col, i) => (
              <th
                key={col.label}
                data-col-key={col.key}
                style={{
                  position: 'relative',
                  padding: '18px 12px 10px',
                  textAlign: 'left',
                  fontWeight: 500,
                  width: getW(col.key, col.w),
                  minWidth: getW(col.key, col.w),
                  borderTopLeftRadius:    i === 0 ? 8 : 0,
                  borderBottomLeftRadius: i === 0 ? 8 : 0,
                  paddingLeft: i === 0 ? 16 : 12,
                  ...getThStyle(col.key),
                }}
                onDragOver={(e) => onDragOver(col.key, e)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(col.key, e, visibleCols, setVisibleCols)}
              >
                <div
                  draggable
                  onDragStart={(e) => onDragStart(col.key, e)}
                  onDragEnd={onDragEnd}
                  style={{
                    display: hoveredColKey === col.key ? 'flex' : 'none',
                    position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)',
                    cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4,
                  }}
                >
                  <DragDots />
                </div>
                <span className="text-[16px] font-medium text-[#051937]">{col.label}</span>
              </th>
            ))}
            {/* Sticky: Payment Status */}
            <th style={{ position: 'sticky', right: 80, width: 150, minWidth: 150, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
              <span className="text-[16px] font-medium text-[#051937]">Payment Status</span>
            </th>
            {/* Sticky: Actions */}
            <th style={{ position: 'sticky', right: 0, width: 80, minWidth: 80, background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
              <span className="text-[16px] font-medium text-[#051937]">Action</span>
            </th>
          </tr>
        </thead>

        {/* ── BODY ── */}
        <tbody>
          {paginated.map((row, i) => {
            const st = STATUS_STYLE[row.status];
            const cell = (content: React.ReactNode, colKey: string, w?: number, extra?: React.CSSProperties) => (
              <td data-col-key={colKey} style={{ background: getTdBg(colKey) ?? '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: w, borderBottom: '1px solid #f0f4ff', ...extra }}>
                {content}
              </td>
            );
            const txt = (v: string) => (
              <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>
            );

            return (
              <tr key={i}>
                {vis('reqNo')     && cell(txt(row.reqNo),     'reqNo',     150, { paddingLeft: 16 })}
                {vis('reqType')   && cell(txt(row.reqType),   'reqType',   190)}
                {vis('reqDate')   && cell(txt(row.reqDate),   'reqDate',   150)}
                {vis('claimType') && cell(txt(row.claimType), 'claimType', 200)}
                {vis('amount')    && cell(<span className="flex items-center gap-[4px] text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />{row.amount}</span>, 'amount', 140)}
                {/* Sticky: Payment Status */}
                <td style={{ position: 'sticky', right: 80, background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: 150, borderBottom: '1px solid #f0f4ff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: openFlyout === i ? 49 : 1 }}>
                  <span
                    className="inline-flex items-center justify-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                    style={{ background: st.bg, color: st.color, fontFamily: font }}
                  >
                    {row.status}
                  </span>
                </td>
                {/* Sticky: Actions */}
                <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 54, verticalAlign: 'middle', width: 80, borderBottom: '1px solid #f0f4ff', textAlign: 'center', zIndex: openFlyout === i ? 50 : 1 }}>
                  <div className="relative inline-block">
                    <button
                      onClick={(e) => {
                        if (openFlyout === i) { setOpenFlyout(null); return; }
                        const r = e.currentTarget.getBoundingClientRect();
                        // Keep the menu inside the viewport for rows near the bottom of the table.
                        const menuH = EPAY_ACTIONS.length * 40 + 8;
                        const top = Math.max(8, Math.min(r.top, window.innerHeight - menuH - 8));
                        setFlyoutPos({ top, left: r.left - FLYOUT_W - 6 });
                        setOpenFlyout(i);
                      }}
                      className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors"
                    >
                      <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                        <circle cx="10" cy="4"  r="1.7" />
                        <circle cx="10" cy="10" r="1.7" />
                        <circle cx="10" cy="16" r="1.7" />
                      </svg>
                    </button>

                    {openFlyout === i && flyoutPos && createPortal(
                      <div
                        ref={flyoutRef}
                        className="fixed z-[1000] bg-white rounded-[8px] py-[4px] overflow-hidden"
                        style={{ top: flyoutPos.top, left: flyoutPos.left, width: FLYOUT_W, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                      >
                        {EPAY_ACTIONS.map((item) => (
                          <button
                            key={item.label}
                            className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                            onClick={() => setOpenFlyout(null)}
                          >
                            <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0">{item.icon}</span>
                            <span className="text-[16px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{item.label}</span>
                          </button>
                        ))}
                      </div>,
                      document.body
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

    <Pagination
      page={page}
      totalPages={Math.max(1, Math.ceil(visibleRows.length / pageSize))}
      pageSize={pageSize}
      totalItems={visibleRows.length}
      onPageChange={setPage}
      onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
    />
    </>
  );
}
