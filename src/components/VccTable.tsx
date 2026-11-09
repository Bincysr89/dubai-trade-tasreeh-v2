import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoreIcon from './MoreIcon';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';
import { ColumnFilter } from './ColumnFilter';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

// Inline data URIs — no external dependency
const wlpLogoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAICAYAAAD9aA/QAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAg5JREFUeAF9kUFoE0EUht+bnd2ERjezAUniKkStFcVDqKAgovWgN6GQiooXrVBQUYp4yMWzIkhPggc9SEGsKXpViojiwSBiUUqUiklBhdCSrNX0sJuZ8U1qKwHpW5Zl3r753vv/h+B5yR25q1Xbjnknjg8E924PbanVagFQ5PMgnj3AGWTxnsOFdTubTXtRSon1en0pl8snz128W50ovRCUA8uyQEqttYp+fJq7tYvBGjE9DcG2ven80bPX8OSZpxXPH/0mspc/C5FL/qvSwBhThcGDDWIDIPZAQyDvRiG9iXgq1eu6bpu1Wom4559+F7YdlyE9jAGzLOy+wkBGYTB248h2v684ixTgNWF1YhIB3OLu8IX7Fb93ZG74fKk6WhyvcM6zCBKVUp0a0KqLqylPNogrxalZbjleJuOjB95fMBoFAFEUscnHL0UYKTH55JVQUgtEjYb339DmHpoPe13+mkqnfTrqJUSm+TKXZpIKJkrPQdIEts0hDEN4+GiKzqSEW6tGmTCbZYu/lYFms5tAKWma0PBR/WP55p5G48uvruW1CR6LOXqoMBA4jqMNlIwFkmcWBBmCZDduhg12Is7W24mVVhaz4NCBvp8f3lzvn5+fqRstHJr0e+tygYEOHtv//c7Yqf6RS+Pvy29rftSWHbkrE1MDd/e+YsViaPJJ47mmBVJfECJqLSxAx7g/Hi/Gz6+U/BcAAAAASUVORK5CYII=';
const aeoLogoSrc = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAHCAYAAAAf6f3xAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAOdEVYdFNvZnR3YXJlAEZpZ21hnrGWYwAAAs9JREFUeAElUltIVF0U/tbeR8+oUxrq/zc2DQZTUlB0oRvR/SmiogcDzXqIkO49REQUPhTdiS4PRZQmRFAIPXShoIKgokgt6iEpI6OZ0KmEzImZM+fsvVrHXs4+e+39fev7vrXpfWTS5RLSrRNyPZ0ATBwoeRSZuJ+ZO5u8Tw+6AR9JuGie1wAU9aLz6Ut0wMhdFYvFZhDsFrDVIGVIFfchuTCnkjP6U63tt2pr/6hgc8dGkNlN1iag1UcLHPt2/fRtR4PXFYDHS4CuJ8I2Ttgt0SoH8AaBhwgb71tSjV/5wyA/g6ZNS9HRNix1oqLSCI2bPJa0ewdzG10a/V8daVVmmT+g/pUxs/btAgcHtcUVQ2QUY7UCLsWb9rpOqJzAJEwk//gxsgpcanLIqKkpxVB+f1hVrMZTX2qpqcc9cU20/UZMBXYZXDqlWXna59eBYk5fm921fP33il4O9gjNSeMgoyzWMsOTfQUxtzgseJLPqLBJqCJceUQElwMWB2qnqRytJPg7qwp7houD8S3Rxefe9nRMSWEEIIgCPzBsWJKC9QtZ9FdO/Dy6K4rhn2Ms2xfk81RWaoBha4gpL6NJiinKSOOZaeBuM2blzpd71al8Ia6J0t319bbYK8SrzLZ2JyhfIapKmfSC7PDvQ0gmm2FD0YGjyK2Lljo53xvSqiTCiMXyff6YoTgPZhzFK4NRFcfo99AEsdFPyv7P0APUG6nb5IPPivabBNUn76tBhJioN7B8+tlnVW42e0Vb9eXfICQGxVGxuUxbXsNElUxok4TecZgOqfCGoG17qmX+tcTx7gY2/kUxd1vcvlNMiyzxnCIn0kgrAPdMSXIVsdqKkAj8vLKMjlT/jP5IHL3QaC1n7YXt95XKjIwiXVbmJDZcbbC6aDDwTE+xtmtEkyOE/0YVhkD6+9e29e1wXU5sbF3MBjtguVYOexjOmfSbE11/AVP+QMCmcxkpAAAAAElFTkSuQmCC';

type BadgeType = 'both' | 'aeo' | 'wlp' | 'none';
type VccStatus = 'Submitted' | 'Payment Pending' | 'Payment Failed' | 'Under Processing' | 'Completed';

const VCC_STATUS_STYLE: Record<VccStatus, { bg: string; color: string }> = {
  'Submitted':        { bg: 'rgba(19,96,210,0.08)',  color: '#1360d2' },
  'Payment Pending':  { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Payment Failed':   { bg: 'rgba(192,57,43,0.08)',  color: '#c0392b' },
  'Under Processing': { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
  'Completed':        { bg: 'rgba(40,167,69,0.08)',  color: '#28a745' },
};

type FlyoutAction = 'amend' | 'view' | 'download' | 'audit' | 'recheck';

const FLYOUT_ITEMS: { id: FlyoutAction; label: string; icon: React.ReactNode }[] = [
  {
    id: 'view',
    label: 'View Request',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
        <circle cx="10" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'download',
    label: "Download All VCC's",
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 3v10" />
        <path d="M5 9l5 5 5-5" />
        <path d="M3 17h14" />
      </svg>
    ),
  },
  {
    id: 'audit',
    label: 'Request History',
    icon: (
      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="7.5" />
        <path d="M10 6v4l2.5 2" />
      </svg>
    ),
  },
];

export type VccRow = {
  reqNo: string;
  declNo: string;
  badge: BadgeType;
  reqDate: string;
  requestedFor: string;
  requestType: string;
  subType: string;
  vccCount: number;
  remarks: string;
  declType: string;
  declOwner: string;
  status: VccStatus;
};

// Source: Figma node 152:40881 — VCC Request List
const VCC_REQUESTS: VccRow[] = [
  { reqNo: '25345', declNo: '1012132132', badge: 'both', reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 3, remarks: '', declType: 'Export from Local',                              declOwner: 'code + name', status: 'Completed' },
  { reqNo: '25346', declNo: '1012132133', badge: 'aeo',  reqDate: '05-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 1, remarks: '', declType: 'Export Statistical',                             declOwner: 'code + name', status: 'Submitted' },
  { reqNo: '25347', declNo: '1012132134', badge: 'wlp',  reqDate: '04-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 2, remarks: '', declType: 'Re Export to ROW (after import for re export)',  declOwner: 'code + name', status: 'Under Processing' },
  { reqNo: '25348', declNo: '1012132135', badge: 'wlp',  reqDate: '03-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056',  requestType: 'New', subType: 'New', vccCount: 4, remarks: '', declType: 'Re Export to ROW (after import for re export)',  declOwner: 'code + name', status: 'Payment Failed' },
  { reqNo: '25365', declNo: '1012132136', badge: 'none', reqDate: '02-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056', requestType: 'New', subType: 'New', vccCount: 1, remarks: '', declType: 'Export from Local', declOwner: 'code + name', status: 'Payment Pending' },
  { reqNo: '25366', declNo: '1012132137', badge: 'aeo',  reqDate: '01-Dec-24', requestedFor: 'CONSOLIDATED SHIPPING SERVICES L.L.C — AE-1019056', requestType: 'New', subType: 'New', vccCount: 2, remarks: '', declType: 'Import from ROW',    declOwner: 'code + name', status: 'Payment Pending' },
];

type Props = {
  onView?: (status?: string) => void;
  onAmend?: () => void;
  onDownload?: () => void;
  onAudit?: () => void;
  onDeclarationOpen?: (declNo: string) => void;
  onVccCountOpen?: (row: VccRow) => void;
  /** Optional status filter driven from the parent toolbar. When provided, takes precedence over the column-header filter. */
  externalStatus?: string | null;
  onMakePayment?: (reqNo: string) => void;
  onChangePaymentMode?: () => void;
  onUpdatePaymentMode?: () => void;
  onCheckEPaymentStatus?: () => void;
  onRetry?: (reqNo: string) => void;
  onMakePaymentReview?: (reqNo: string) => void;
  onRecheckStatus?: () => void;
  showColModal?: boolean;
  onCloseColModal?: () => void;
};

export default function VccTable({ onView, onAmend, onDownload, onAudit, onDeclarationOpen, onVccCountOpen, externalStatus, onMakePayment, onChangePaymentMode, onUpdatePaymentMode, onCheckEPaymentStatus, onRetry, onMakePaymentReview, onRecheckStatus, showColModal, onCloseColModal }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<VccStatus | null>(null);
  const VCC_STATUS_COLOR: Record<VccStatus, string> = {
    'Submitted': '#1360d2', 'Payment Pending': '#b45309', 'Payment Failed': '#c0392b', 'Under Processing': '#b45309', 'Completed': '#28a745',
  };
  const effectiveStatus = (externalStatus as VccStatus | null | undefined) ?? statusFilter;
  const filteredRows = useMemo(
    () => {
      return effectiveStatus ? VCC_REQUESTS.filter((r) => r.status === effectiveStatus) : VCC_REQUESTS;
    },
    [effectiveStatus],
  );

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const VCC_COL_DEFS: (ColDef & { w: number })[] = [
    { key: 'reqNo',        label: 'Request No.',     w: 110 },
    { key: 'vccCount',     label: 'No. of Vehicles', w: 130 },
    { key: 'declNo',       label: 'Declaration No.', w: 170 },
    { key: 'reqDate',      label: 'Request Date',    w: 130 },
    { key: 'requestedFor', label: 'Requested For',   w: 280 },
    { key: 'remarks',      label: 'Remarks',         w: 320 },
  ];
  const [visibleCols, setVisibleCols] = useState<string[]>(VCC_COL_DEFS.map((c) => c.key));
  const vis = (key: string) => visibleCols.includes(key);
  const visibleHeaders = visibleCols.map((k) => VCC_COL_DEFS.find((c) => c.key === k)!).filter(Boolean);
  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  /** Status-driven default remark — overrides the row's stored remarks. */
  const remarkFor = (status: VccStatus): string => {
    if (status === 'Completed')        return 'Your Request VCCs have been processed and downloaded.';
    if (status === 'Under Processing') return 'Request is being reviewed. Please check back shortly.';
    if (status === 'Payment Failed')    return 'Payment failed. Please retry or update the payment mode.';
    return 'Request submitted. Awaiting processing.';
  };

  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + 242;

  return (
    <>
    {showColModal && (
      <ManageColumnsModal
        columns={VCC_COL_DEFS}
        visible={visibleCols}
        lockedColumns={[{ key: '_status', label: 'Request Status' }, { key: '_action', label: 'Actions' }]}
        onSave={setVisibleCols}
        onClose={() => onCloseColModal?.()}
      />
    )}
    <div style={{ position: 'relative' }}>
      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={242} />
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
          minWidth: tableMinWidth,
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontFamily: "'Dubai', sans-serif",
          cursor: isNearResize ? 'col-resize' : undefined,
        }}
        className="w-full"
      >
        <thead>
          <tr>
            {visibleHeaders.map((col, idx) => (
              <th
                key={col.key}
                data-col-key={col.key}
                style={{
                  position: 'relative',
                  width: getW(col.key, col.w), minWidth: getW(col.key, col.w),
                  padding: '18px 8px 10px', textAlign: 'left', fontWeight: 500,
                  borderRadius: idx === 0 ? '8px 0 0 0' : undefined,
                  paddingLeft: idx === 0 ? 16 : 8,
                  ...getThStyle(col.key),
                }}
                onDragOver={(e) => onDragOver(col.key, e)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(col.key, e, visibleCols, setVisibleCols)}
              >
                {/* Draggable dot handle — shown on column hover */}
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
                  <DragDots visible={true} />
                </div>
                <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
              </th>
            ))}
            {/* STICKY: Request Status */}
            <th style={{
              position: 'sticky', right: 79, width: 163, minWidth: 163,
              background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500,
              boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
            }}>
              <StatusFilterHeader
                label="Request Status"
                options={Object.keys(VCC_STATUS_STYLE)}
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as VccStatus | null)}
                colorMap={VCC_STATUS_COLOR}
              />
            </th>
            {/* STICKY: Actions */}
            <th style={{
              position: 'sticky', right: 0, width: 79, minWidth: 79,
              background: '#a6c2e9', padding: '10px 8px', textAlign: 'left', fontWeight: 500, zIndex: 2,
              borderTopRightRadius: 8, borderBottomRightRadius: 8,
            }}>
              <span className="text-[16px] text-[#051937]" style={{ letterSpacing: '0.07px' }}>Actions</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredRows.map((row, i) => {
            const st = VCC_STATUS_STYLE[row.status];
            const txt = (v: React.ReactNode) => <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
            const cell = (content: React.ReactNode, colKey: string, extra?: React.CSSProperties) => {
              const def = VCC_COL_DEFS.find(c => c.key === colKey)!;
              return (
                <td data-col-key={colKey} style={{ background: getTdBg(colKey) ?? '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: getW(colKey, def.w), ...extra }}>{content}</td>
              );
            };
            return (
              <tr key={i}>
                {vis('reqNo') && cell(txt(row.reqNo), 'reqNo', { paddingLeft: 16 })}
                {/* No. of Vehicles — clickable */}
                {vis('vccCount') && (
                <td data-col-key="vccCount" style={{ background: getTdBg('vccCount') ?? '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: getW('vccCount', 130), textAlign: 'center' }}>
                  {(
                    <button
                      onClick={() => onVccCountOpen?.(row)}
                      className="text-[16px] font-medium inline-flex items-center justify-center hover:opacity-80 transition-opacity"
                      style={{ background: 'rgba(19,96,210,0.08)', color: '#1360d2', minWidth: 32, height: 24, padding: '0 8px', borderRadius: 12, textDecoration: 'underline' }}
                      aria-label="View VCC details"
                    >
                      {row.vccCount}
                    </button>
                  )}
                </td>
                )}
                {/* Declaration No. — hyperlink to Customs Declaration page */}
                {vis('declNo') && (
                <td data-col-key="declNo" style={{ background: getTdBg('declNo') ?? '#fff', padding: '0 8px', height: 54, verticalAlign: 'middle', width: getW('declNo', 170) }}>
                  <div className="flex items-center gap-[10px]">
                    <div className="flex items-center gap-[6px] flex-shrink-0" style={{ minWidth: 58 }}>
                      {(row.badge === 'both' || row.badge === 'wlp') && (
                        <img src={wlpLogoSrc} alt="WLP" style={{ height: 8, width: 22 }} />
                      )}
                      {(row.badge === 'both' || row.badge === 'aeo') && (
                        <img src={aeoLogoSrc} alt="AEO" style={{ height: 7, width: 30 }} />
                      )}
                    </div>
                    <button
                      onClick={() => onDeclarationOpen?.(row.declNo)}
                      className="text-[16px] text-[#1360d2] whitespace-nowrap hover:underline"
                      style={{ fontWeight: 500 }}
                    >
                      {row.declNo}
                    </button>
                  </div>
                </td>
                )}
                {vis('reqDate') && cell(txt(row.reqDate), 'reqDate')}
                {vis('requestedFor') && cell(txt(row.requestedFor), 'requestedFor')}
                {vis('remarks') && cell(
                  <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>
                    {remarkFor(row.status)}
                  </span>,
                  'remarks',
                )}

                {/* STICKY: Request Status */}
                <td style={{
                  position: 'sticky', right: 79, background: '#fff',
                  padding: '0 8px', height: 54, verticalAlign: 'middle', width: 163,
                  boxShadow: '-3px 0 6px rgba(0,0,0,0.06)',
                  borderBottom: '1px solid #f8f8f8',
                  zIndex: openFlyout === i ? 49 : 1,
                }}>
                  <span
                    className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center"
                    style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px' }}
                  >
                    {row.status}
                  </span>
                </td>

                {/* STICKY: Actions (kebab + flyout) */}
                <td style={{
                  position: 'sticky', right: 0, background: '#fff',
                  padding: '0 12px', height: 54, verticalAlign: 'middle', width: 79,
                  textAlign: 'center',
                  borderBottom: '1px solid #f8f8f8',
                  zIndex: openFlyout === i ? 50 : 1,
                }}>
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
                        style={{
                          right: '100%',
                          top: 0,
                          marginRight: 6,
                          width: 220,
                          boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)',
                          border: '1px solid #f0f0f5',
                        }}
                      >
                        {row.status === 'Payment Failed' ? (
                          <>
                            {/* View Request */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onView?.(row.status); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                                  <circle cx="10" cy="10" r="2.5" />
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                View Request
                              </span>
                            </button>
                            {/* Retry Payment */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onRetry?.(row.reqNo); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjQwMzEgMy4wMDE1NEM4LjMxMzEgMi44NjE1NCA0LjE0MzEgNi45NTE1NCA0LjE0MzEgMTIuMDAxNUgyLjM1MzFDMS45MDMxIDEyLjAwMTUgMS42ODMxIDEyLjU0MTUgMi4wMDMxIDEyLjg1MTVMNC43OTMxIDE1LjY1MTVDNC45OTMxIDE1Ljg1MTUgNS4zMDMxIDE1Ljg1MTUgNS41MDMxIDE1LjY1MTVMOC4yOTMxIDEyLjg1MTVDOC42MDMxIDEyLjU0MTUgOC4zODMxIDEyLjAwMTUgNy45MzMxIDEyLjAwMTVINi4xNDMxQzYuMTQzMSA4LjEwMTU0IDkuMzIzMSA0Ljk1MTU0IDEzLjI0MzEgNS4wMDE1NEMxNi45NjMxIDUuMDUxNTQgMjAuMDkzMSA4LjE4MTU0IDIwLjE0MzEgMTEuOTAxNUMyMC4xOTMxIDE1LjgxMTUgMTcuMDQzMSAxOS4wMDE1IDEzLjE0MzEgMTkuMDAxNUMxMS41MzMxIDE5LjAwMTUgMTAuMDQzMSAxOC40NTE1IDguODYzMSAxNy41MjE1QzguNDYzMSAxNy4yMTE1IDcuOTAzMSAxNy4yNDE1IDcuNTQzMSAxNy42MDE1QzcuMTIzMSAxOC4wMjE1IDcuMTUzMSAxOC43MzE1IDcuNjIzMSAxOS4wOTE1QzkuMTQzMSAyMC4yOTE1IDExLjA1MzEgMjEuMDAxNSAxMy4xNDMxIDIxLjAwMTVDMTguMTkzMSAyMS4wMDE1IDIyLjI4MzEgMTYuODMxNSAyMi4xNDMxIDExLjc0MTVDMjIuMDEzMSA3LjA1MTU0IDE4LjA5MzEgMy4xMzE1NCAxMy40MDMxIDMuMDAxNTRaIiBmaWxsPSIjNjk2RjgzIi8+Cjwvc3ZnPgo=" alt="" width="18" height="18" style={{filter:'brightness(0) saturate(100%) invert(46%) sepia(9%) saturate(600%) hue-rotate(190deg) brightness(95%) contrast(86%)'}} className="group-hover:invert group-hover:brightness-200" />
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                Retry Payment
                              </span>
                            </button>
                          </>
                        ) : row.status === 'Payment Pending' ? (
                          <>
                            {/* View Request */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onView?.(row.status); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                                  <circle cx="10" cy="10" r="2.5" />
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                View Request
                              </span>
                            </button>
                            {/* Make ePayment — navigates to ePayment tab under Declaration */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onMakePayment?.(row.reqNo); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="2" y="5" width="16" height="12" rx="2"/>
                                  <path d="M2 9h16"/><path d="M6 13h2"/><path d="M10 13h4"/>
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                Make ePayment
                              </span>
                            </button>
                            {/* Update Payment Mode */}
                            <button
                              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                              onClick={() => { setOpenFlyout(null); onUpdatePaymentMode?.(); }}
                            >
                              <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M4 8l3-3-3-3"/><path d="M7 5H3"/>
                                  <path d="M16 12l-3 3 3 3"/><path d="M13 15h4"/>
                                  <path d="M3 12h10a3 3 0 003-3V8"/>
                                </svg>
                              </span>
                              <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                Update Payment Mode
                              </span>
                            </button>
                          </>
                        ) : (
                          <>
                            {/* Recheck Payment Status — only for Under Processing rows */}
                            {row.status === 'Under Processing' && (
                              <button
                                className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => { setOpenFlyout(null); onRecheckStatus?.(); }}
                              >
                                <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4a7 7 0 1 1 0 12" />
                                    <path d="M1 4h3v3" />
                                  </svg>
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                  Recheck Payment Status
                                </span>
                              </button>
                            )}
                            {FLYOUT_ITEMS.map((item) => (
                              <button
                                key={item.id}
                                className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                                onClick={() => {
                                  setOpenFlyout(null);
                                  if (item.id === 'view')     onView?.(row.status);
                                  if (item.id === 'amend')    onAmend?.();
                                  if (item.id === 'download') onDownload?.();
                                  if (item.id === 'audit')    onAudit?.();
                                }}
                              >
                                <span className="text-[#7a7a7a] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                                  {item.icon}
                                </span>
                                <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
                                  {item.label}
                                </span>
                              </button>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pt-[16px]">
        <Pagination
          page={page}
          totalPages={5}
          pageSize={pageSize}
          totalItems={5 * pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
    </div>
    </>
  );
}
