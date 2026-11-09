import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoreIcon from './MoreIcon';
import Pagination from './Pagination';
import StatusFilterHeader from './StatusFilterHeader';
import { ColumnFilter } from './ColumnFilter';
import ManageColumnsModal, { ColDef } from './ManageColumnsModal';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

type Status = 'Accepted' | 'Pending' | 'Declined';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Accepted': { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Pending':  { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Declined': { bg: 'rgba(220,53,69,0.10)',   color: '#dc3545' },
};

type ReqType = 'New' | 'Amended' | 'Cancelled';

type FlyoutId = 'view' | 'accept' | 'decline' | 'history' | 'regenerate';

const ICONS: Record<FlyoutId, React.ReactNode> = {
  view:       <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  accept:     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 10l2.5 2.5 4.5-5" /></svg>,
  decline:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="10" r="7.5" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" /></svg>,
  history:    <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="12" height="14" rx="1.5" /><path d="M7 7h6M7 10h6M7 13h4" /></svg>,
  regenerate: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M16 10a6 6 0 1 1-1.8-4.3" /><path d="M16 3v3.5h-3.5" /></svg>,
};

const LABELS: Record<FlyoutId, string> = {
  view: 'View Declaration',
  accept: 'Accept',
  decline: 'Decline',
  history: 'History',
  regenerate: 'Regenerate',
};

function getFlyoutItems(status: Status): { id: FlyoutId; disabled: boolean }[] {
  if (status === 'Pending') {
    return [
      { id: 'view',       disabled: false },
      { id: 'accept',     disabled: false },
      { id: 'decline',    disabled: false },
      { id: 'history',    disabled: false },
      { id: 'regenerate', disabled: false },
    ];
  }
  // Accepted / Declined
  return [
    { id: 'view',    disabled: false },
    { id: 'accept',  disabled: true  },
    { id: 'decline', disabled: true  },
    { id: 'history', disabled: false },
  ];
}

type Row = {
  declaration: string;
  reqType: ReqType;
  clearanceDate: string;
  importer: string;
  importerTags?: ('Ack' | 'Owner')[];
  exporter: string;
  broker: string;
  value: string;
  decReason: string;
  ackDate: string;
  ackStatus: Status;
};

export const ACK_ROWS: Row[] = [
  { declaration: '502100666777', reqType: 'New',       clearanceDate: '12-Dec-25', importer: 'AE-11565432-ALT Ex…', importerTags: ['Ack', 'Owner'], exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'Supp. Quantity',    ackDate: '25-Aug-25', ackStatus: 'Accepted' },
  { declaration: '501777333222', reqType: 'New',       clearanceDate: '12-Dec-25', importer: 'AE - 11293837 - GTE…', importerTags: ['Ack', 'Owner'], exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'HS Code is Wro…',   ackDate: '25-Aug-25', ackStatus: 'Pending'  },
  { declaration: '306999444111', reqType: 'Amended',   clearanceDate: '12-Dec-25', importer: 'AE - 11293837 - GTE…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'Supp. Quantity',    ackDate: '25-Aug-25', ackStatus: 'Accepted' },
  { declaration: '209222666888', reqType: 'Amended',   clearanceDate: '12-Dec-25', importer: 'AE-11565432-ALT Ex…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'HS Code is Wro…',   ackDate: '25-Aug-25', ackStatus: 'Pending'  },
  { declaration: '202333555111', reqType: 'Amended',   clearanceDate: '12-Dec-25', importer: 'AE - 11293837 - GTE…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'Supp. Quantity',    ackDate: '25-Aug-25', ackStatus: 'Pending'  },
  { declaration: '502100666777', reqType: 'Cancelled', clearanceDate: '12-Dec-25', importer: 'AE-11565432-ALT Ex…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'HS Code is Wro…',   ackDate: '25-Aug-25', ackStatus: 'Declined' },
  { declaration: '501777333222', reqType: 'Cancelled', clearanceDate: '12-Dec-25', importer: 'AE - 11293837 - GTE…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'Supp. Quantity',    ackDate: '25-Aug-25', ackStatus: 'Declined' },
  { declaration: '306999444111', reqType: 'New',       clearanceDate: '12-Dec-25', importer: 'AE - 11293837 - GTE…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'Supp. Quantity',    ackDate: '25-Aug-25', ackStatus: 'Declined' },
  { declaration: '209222666888', reqType: 'New',       clearanceDate: '12-Dec-25', importer: 'AE-11565432-ALT Ex…', exporter: 'AE - 1001913 - Conso…', broker: 'AE - 1001913 - Conso…', value: '1009.92', decReason: 'Supp. Quantity',    ackDate: '25-Aug-25', ackStatus: 'Accepted' },
];

type Props = {
  onView?: () => void;
  onAccept?: () => void;
  onDecline?: (rowIndex: number) => void;
  onHistory?: () => void;
  onRegenerate?: () => void;
  selected?: Set<number>;
  onSelectedChange?: (s: Set<number>) => void;
  showColModal?: boolean;
  onCloseColModal?: () => void;
};

export default function AcknowledgementTable({ onView, onAccept, onDecline, onHistory, onRegenerate, selected: selectedProp, onSelectedChange, showColModal, onCloseColModal }: Props = {}) {
  const [openFlyout, setOpenFlyout] = useState<number | null>(null);
  const flyoutRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [statusFilter, setStatusFilter] = useState<Status | null>(null);
  const STATUS_COLOR: Record<Status, string> = { Accepted: '#28a745', Pending: '#b45309', Declined: '#dc3545' };
  const filteredRows = useMemo(
    () => statusFilter
      ? ACK_ROWS.map((r, i) => ({ r, i })).filter(({ r }) => r.ackStatus === statusFilter)
      : ACK_ROWS.map((r, i) => ({ r, i })),
    [statusFilter]
  );
  const [selectedInternal, setSelectedInternal] = useState<Set<number>>(new Set());
  const selected = selectedProp ?? selectedInternal;
  const setSelected = (s: Set<number>) => {
    if (onSelectedChange) onSelectedChange(s);
    else setSelectedInternal(s);
  };

  useEffect(() => {
    if (openFlyout === null) return;
    const onDoc = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openFlyout]);

  const allChecked = selected.size === ACK_ROWS.length;
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(ACK_ROWS.map((_, i) => i)));
  const toggleOne = (i: number) => {
    const next = new Set(selected);
    if (next.has(i)) next.delete(i); else next.add(i);
    setSelected(next);
  };

  const ACK_COL_DEFS: (ColDef & { w: number })[] = [
    { key: 'declaration',   label: 'Declaration',    w: 140 },
    { key: 'reqType',       label: 'Req. Type',      w: 110 },
    { key: 'clearanceDate', label: 'Clearance Date', w: 130 },
    { key: 'importer',      label: 'Importer',       w: 220 },
    { key: 'exporter',      label: 'Exporter',       w: 200 },
    { key: 'broker',        label: 'Broker',         w: 200 },
    { key: 'value',         label: 'Value (Dh)',     w: 120 },
    { key: 'decReason',     label: 'Dec. Reason',    w: 150 },
    { key: 'ackDate',       label: 'Ack. Date',      w: 110 },
  ];
  const [visibleCols, setVisibleCols] = useState<string[]>(ACK_COL_DEFS.map((c) => c.key));
  const vis = (key: string) => visibleCols.includes(key);
  const visibleHeaders = visibleCols.map((k) => ACK_COL_DEFS.find((c) => c.key === k)!).filter(Boolean);

  const {
    tableRef, scrollRef,
    hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();

  const Checkbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button onClick={onChange} role="checkbox" aria-checked={checked} className="size-[18px] rounded-[3px] flex-shrink-0 inline-flex items-center justify-center" style={{ border: `1.5px solid ${checked ? '#1360d2' : '#a7abb2'}`, background: checked ? '#1360d2' : '#fff' }}>
      {checked && <svg viewBox="0 0 14 14" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>}
    </button>
  );

  const tableMinWidth = visibleHeaders.reduce((s, c) => s + getW(c.key, c.w), 0) + 267;

  return (
    <>
    {showColModal && (
      <ManageColumnsModal
        columns={ACK_COL_DEFS}
        visible={visibleCols}
        lockedColumns={[{ key: '_status', label: 'Ack. Status' }, { key: '_action', label: 'Actions' }]}
        onSave={setVisibleCols}
        onClose={() => onCloseColModal?.()}
      />
    )}
    <div style={{ position: 'relative' }}>
      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={219} />
    <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto pb-[20px]" style={{ position: 'relative' }}>
      {resizeIndicatorLeft !== null && (
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3, background: '#1360D2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
      )}
      <table
        ref={tableRef}
        onMouseMove={handleTableMouseMove}
        onMouseLeave={handleTableMouseLeave}
        onMouseDown={handleTableMouseDown}
        style={{ minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: "'Dubai', sans-serif", cursor: isNearResize ? 'col-resize' : undefined }}
        className="w-full"
      >
        <thead>
          <tr>
            <th style={{ width: 48, minWidth: 48, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingLeft: 16 }}>
              <Checkbox checked={allChecked} onChange={toggleAll} />
            </th>
            {visibleHeaders.map((col) => (
              <th
                key={col.label}
                data-col-key={col.key}
                style={{ position: 'relative', width: getW(col.key, col.w), minWidth: getW(col.key, col.w), padding: '18px 12px 10px', textAlign: 'left', fontWeight: 500, ...getThStyle(col.key) }}
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
                <ColumnFilter label={col.label} labelClass="text-[16px] font-medium text-[#051937]" />
              </th>
            ))}
            <th style={{ position: 'sticky', right: 79, width: 140, minWidth: 140, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2 }}>
              <StatusFilterHeader
                label="Ack. Status"
                options={Object.keys(STATUS_STYLE)}
                value={statusFilter}
                onChange={(v) => setStatusFilter(v as Status | null)}
                colorMap={STATUS_COLOR}
              />
            </th>
            <th style={{ position: 'sticky', right: 0, width: 79, minWidth: 79, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, zIndex: 2, borderTopRightRadius: 8, borderBottomRightRadius: 8 }}>
              <span className="text-[16px] text-[#051937]" style={{ letterSpacing: '0.07px' }}>Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(({ r: row, i }) => {
            const st = STATUS_STYLE[row.ackStatus];
            const cell = (content: React.ReactNode, colKey: string, w: number) => (
              <td data-col-key={colKey} style={{ background: getTdBg(colKey) ?? '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: w }}>{content}</td>
            );
            const txt = (v: React.ReactNode) => <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{v}</span>;
            return (
              <tr key={i}>
                <td style={{ background: '#fff', padding: '0 12px 0 16px', height: 60, verticalAlign: 'middle', width: 48, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                  <Checkbox checked={selected.has(i)} onChange={() => toggleOne(i)} />
                </td>
                {vis('declaration') && cell(<a href="#" className="text-[16px] text-[#1360d2] hover:underline whitespace-nowrap" style={{ fontWeight: 500 }}>{row.declaration}</a>, 'declaration', 140)}
                {vis('reqType') && cell(txt(row.reqType), 'reqType', 110)}
                {vis('clearanceDate') && cell(txt(row.clearanceDate), 'clearanceDate', 130)}
                {vis('importer') && cell(
                  <div className="flex flex-col gap-[4px]">
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200, display: 'inline-block' }}>{row.importer}</span>
                    {row.importerTags && row.importerTags.length > 0 && (
                      <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[12px] self-start" style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}>
                        {row.importerTags.join(', ')}
                      </span>
                    )}
                  </div>, 'importer', 220
                )}
                {vis('exporter') && cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, display: 'inline-block' }}>{row.exporter}</span>, 'exporter', 200)}
                {vis('broker') && cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 180, display: 'inline-block' }}>{row.broker}</span>, 'broker', 200)}
                {vis('value') && cell(txt(row.value), 'value', 120)}
                {vis('decReason') && cell(<span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 140, display: 'inline-block' }}>{row.decReason}</span>, 'decReason', 150)}
                {vis('ackDate') && cell(txt(row.ackDate), 'ackDate', 110)}
                <td style={{ position: 'sticky', right: 79, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 140, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 49 : 1 }}>
                  <span className="text-[16px] font-medium whitespace-nowrap inline-flex items-center justify-center" style={{ background: st.bg, color: st.color, padding: '4px 12px', borderRadius: 4, lineHeight: '20px' }}>
                    {row.ackStatus}
                  </span>
                </td>
                <td style={{ position: 'sticky', right: 0, background: '#fff', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 79, textAlign: 'center', borderBottom: '1px solid #f8f8f8', zIndex: openFlyout === i ? 50 : 1 }}>
                  <div className="relative inline-block" ref={openFlyout === i ? flyoutRef : undefined}>
                    <button
                      className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors"
                      aria-label="More actions"
                      onClick={() => setOpenFlyout(openFlyout === i ? null : i)}
                    >
                      <MoreIcon />
                    </button>
                    {openFlyout === i && (
                      <div className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ right: '100%', top: 0, marginRight: 6, width: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {getFlyoutItems(row.ackStatus).map((item) => (
                          <button
                            key={item.id}
                            disabled={item.disabled}
                            className={`group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left transition-colors ${item.disabled ? 'cursor-not-allowed' : 'hover:bg-[#1360d2]'}`}
                            onClick={() => {
                              if (item.disabled) return;
                              setOpenFlyout(null);
                              if (item.id === 'view')       onView?.();
                              if (item.id === 'accept')     onAccept?.();
                              if (item.id === 'decline')    onDecline?.(i);
                              if (item.id === 'history')    onHistory?.();
                              if (item.id === 'regenerate') onRegenerate?.();
                            }}
                          >
                            <span className={`flex-shrink-0 inline-flex items-center justify-center ${item.disabled ? 'text-[#c9cdd6]' : 'text-[#1360d2] group-hover:text-white'}`}>{ICONS[item.id]}</span>
                            <span className={`text-[16px] leading-[20px] ${item.disabled ? 'text-[#c9cdd6]' : 'text-[#111838] group-hover:text-white'}`} style={{ fontFamily: "'Dubai', sans-serif" }}>{LABELS[item.id]}</span>
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
      <div className="pt-[16px]">
        <Pagination page={page} totalPages={7} pageSize={pageSize} totalItems={7 * pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
      </div>
    </div>
    </div>
    </>
  );
}
