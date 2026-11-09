import React, { useState } from 'react';
import ClaimStepper, { VALIDITY_EXT_STEPS } from './ClaimStepper';
import Dh from './Dh';
import type { Row } from './EligibleDeclarationsPage';
import { useTableBehaviors, DragDots, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', 'Segoe UI', sans-serif";

const IMPORTER_CODE_NAMES: Record<string, string> = {
  'A180': 'IMPORTER SONY GULF UAE',
  'A220': 'SW LOGISTICS LLC',
  'A350': 'FREIGHT FORWARDER CO.',
};
const codeWithName = (code: string) => IMPORTER_CODE_NAMES[code] ? `${code} - ${IMPORTER_CODE_NAMES[code]}` : code;

const EXTENSION_ROWS: Row[] = [
  { declarationNo: '105-01426431-24', declarationDate: '09/10/2024', depositType: 'Alternative Duty Deposit', declarationCategory: 'Import for Re Export', depositAmount: 'Dh 1,000', depositMethod: 'Standing Guarantee', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-100234', brokerCode: 'AE-9106286', brokerName: 'SW Logistics LLC' },
  // Same declaration as above, different charge type — demonstrates that multiple charge types
  // under one declaration can be selected together (see the same-declaration validation below).
  { declarationNo: '105-01426431-24', declarationDate: '09/10/2024', depositType: 'Anti Dumping Deposit',     declarationCategory: 'Import for Re Export', depositAmount: 'Dh 800',   depositMethod: 'Standing Guarantee', claimExpiry: '04/03/2025', exportExpiry: '03/08/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-100234', brokerCode: 'AE-9106286', brokerName: 'SW Logistics LLC' },
  { declarationNo: '404-09988123-24', declarationDate: '07/02/2024', depositType: 'Alternative Duty Deposit', declarationCategory: 'Temporary Admission',  depositAmount: 'Dh 5,000', depositMethod: 'Standing Guarantee', claimExpiry: '07/01/2025', exportExpiry: '05/15/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-100567', brokerCode: 'AE-9106286', brokerName: 'SW Logistics LLC' },
  { declarationNo: '112-06617204-24', declarationDate: '09/29/2024', depositType: 'Anti Dumping Deposit',     declarationCategory: 'Import for Re Export', depositAmount: 'Dh 2,600', depositMethod: 'Standing Guarantee', claimExpiry: '05/10/2025', exportExpiry: '04/12/2025', remarks: '—', kind: 'requestExt', importerCode: 'A180', accountNumber: 'ACC-101390', brokerCode: 'AE-9106286', brokerName: 'SW Logistics LLC' },
  { declarationNo: '116-07721390-24', declarationDate: '10/02/2024', depositType: 'Safeguard Deposit',        declarationCategory: 'Import for Re Export', depositAmount: 'Dh 3,400', depositMethod: 'Standing Guarantee', claimExpiry: '05/22/2025', exportExpiry: '04/25/2025', remarks: '—', kind: 'requestExt', importerCode: 'A350', accountNumber: 'ACC-101422', brokerCode: 'AE-9106286', brokerName: 'SW Logistics LLC' },
  { declarationNo: '108-05512790-24', declarationDate: '11/02/2024', depositType: 'Duty Deposit',             declarationCategory: 'Import',               depositAmount: 'Dh 3,200', depositMethod: 'Standing Guarantee', claimExpiry: '05/01/2025', exportExpiry: '04/01/2025', remarks: '—', kind: 'requestExt', importerCode: 'A350', accountNumber: 'ACC-101045', brokerCode: 'AE-9106286', brokerName: 'SW Logistics LLC' },
];
// Declaration Number alone isn't a unique row key once a declaration has multiple charge types —
// combine with Charge Type for selection/keying purposes.
const rowKey = (row: Row) => `${row.declarationNo}__${row.depositType}`;

// Movable columns — Claim Expiry / Export Expiry stay pinned at the right (see STATIC_COLS below).
const MOVABLE_COLS: { key: string; label: string; w: number }[] = [
  { key: 'declarationNo',       label: 'Declaration Number', w: 190 },
  { key: 'declarationDate',     label: 'Declaration Date',   w: 150 },
  { key: 'declarationCategory', label: 'Declaration Type',   w: 190 },
  { key: 'owner',               label: 'Owner',              w: 240 },
  { key: 'broker',              label: 'Broker',             w: 220 },
  { key: 'depositType',         label: 'Charge Type',        w: 210 },
  { key: 'depositAmount',       label: 'Amount',             w: 140 },
];
const STATIC_COLS: { key: string; label: string; w: number }[] = [
  { key: 'claimExpiry',  label: 'Claim Expiry',  w: 150 },
  { key: 'exportExpiry', label: 'Export Expiry', w: 150 },
];
const staticColW = (col: { key: string; w: number }) => col.w;

type Props = {
  onBack: () => void;
  onBackToListing: () => void;
  onProceed: (rows: Row[]) => void;
  onDeclarationOpen?: (declNo: string) => void;
};

export default function ValidityExtensionEligiblePage({ onBack, onBackToListing, onProceed, onDeclarationOpen }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [declNoQuery, setDeclNoQuery] = useState('');
  const [selectionError, setSelectionError] = useState(false);
  const filteredRows = declNoQuery.trim()
    ? EXTENSION_ROWS.filter(r => r.declarationNo.toLowerCase().includes(declNoQuery.trim().toLowerCase()))
    : EXTENSION_ROWS;
  const selectedRows = EXTENSION_ROWS.filter(r => selected.has(rowKey(r)));
  // Different charge types under the SAME declaration number may be selected together, but
  // declarations with different Declaration Numbers cannot be mixed into one selection.
  const anchorDeclarationNo = selectedRows[0]?.declarationNo ?? null;
  const toggleRow = (row: Row) => {
    const key = rowKey(row);
    if (selected.has(key)) {
      setSelected(prev => { const next = new Set(prev); next.delete(key); return next; });
      setSelectionError(false);
      return;
    }
    if (anchorDeclarationNo !== null && row.declarationNo !== anchorDeclarationNo) {
      setSelectionError(true);
      return;
    }
    setSelected(prev => new Set(prev).add(key));
    setSelectionError(false);
  };
  const allFilteredSelected = filteredRows.length > 0 && filteredRows.every(r => selected.has(rowKey(r)));
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelected(prev => {
        const next = new Set(prev);
        filteredRows.forEach(r => next.delete(rowKey(r)));
        return next;
      });
      setSelectionError(false);
      return;
    }
    const uniqueDeclNos = new Set(filteredRows.map(r => r.declarationNo));
    if (uniqueDeclNos.size > 1 || (anchorDeclarationNo !== null && !uniqueDeclNos.has(anchorDeclarationNo))) {
      setSelectionError(true);
      return;
    }
    setSelected(prev => {
      const next = new Set(prev);
      filteredRows.forEach(r => next.add(rowKey(r)));
      return next;
    });
    setSelectionError(false);
  };

  const {
    tableRef, scrollRef, hoveredColKey, resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  } = useTableBehaviors();
  const [colOrder, setColOrder] = useState<string[]>(() => MOVABLE_COLS.map(c => c.key));
  const orderedMovable = colOrder.length === MOVABLE_COLS.length
    ? (colOrder.map(key => MOVABLE_COLS.find(c => c.key === key)).filter(Boolean) as typeof MOVABLE_COLS)
    : MOVABLE_COLS;
  const staticStickyWidth = STATIC_COLS.reduce((s, c) => s + staticColW(c), 0);
  const tableMinWidth = orderedMovable.reduce((s, c) => s + getW(c.key, c.w), 0) + staticStickyWidth + 48 + 24;

  const cellValue = (row: Row, key: string): React.ReactNode => {
    switch (key) {
      case 'declarationNo':
        return onDeclarationOpen ? (
          <button type="button" onClick={(e) => { e.stopPropagation(); onDeclarationOpen(row.declarationNo); }}
            className="text-[16px] whitespace-nowrap hover:underline" style={{ color: '#1360d2', fontWeight: 500 }}>
            {row.declarationNo}
          </button>
        ) : <span className="text-[16px] whitespace-nowrap" style={{ color: '#1360d2', fontWeight: 500 }}>{row.declarationNo}</span>;
      case 'declarationDate':
        return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.declarationDate}</span>;
      case 'declarationCategory':
        return <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.declarationCategory ?? '—'}</span>;
      case 'owner':
        return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.importerCode ? codeWithName(row.importerCode) : '—'}</span>;
      case 'broker':
        return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.brokerCode ? `${row.brokerCode} - ${row.brokerName}` : '—'}</span>;
      case 'depositType':
        return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.depositType}</span>;
      case 'depositAmount':
        return (
          <span className="inline-flex items-center gap-[4px] text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
            <Dh style={{ fontSize: 14 }} />{row.depositAmount.replace('Dh ', '')}
          </span>
        );
      default:
        return '—';
    }
  };

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      <div className="flex items-start px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim — Claim Time Validity Extension</h1>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={0} steps={VALIDITY_EXT_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="px-[24px] pt-[20px] pb-[12px] border-b border-[#eef1f6] flex items-center justify-between flex-wrap gap-[8px]">
              <div>
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Eligible Declarations</p>
              </div>
            </div>

            <div className="px-[24px] pt-[16px] pb-[4px]">
              <div className="relative" style={{ minWidth: 260, flex: '1 1 260px', maxWidth: 380 }}>
                <div className="flex items-center bg-white rounded-[4px] h-[48px]" style={{ border: '1px solid #d5ddfb' }}>
                  <input
                    value={declNoQuery}
                    onChange={(e) => { setDeclNoQuery(e.target.value); setSelectionError(false); }}
                    placeholder="Search Declaration Number"
                    className="flex-1 px-[14px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                    style={{ fontFamily: font }}
                  />
                  {declNoQuery && (
                    <button
                      type="button"
                      onClick={() => setDeclNoQuery('')}
                      className="mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0"
                    >
                      <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                    </button>
                  )}
                  <span className="pr-[12px] text-[#8f94ae] flex-shrink-0 pointer-events-none">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" /></svg>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-[16px] mt-[12px]">
                <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>
                  Available: <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{filteredRows.length}</span>
                </span>
              </div>
              <div className="flex items-center gap-[8px] rounded-[6px] px-[14px] py-[8px] mt-[12px]" style={{ background: '#e2ebf9', border: '1px solid #d5ddfb' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" strokeLinecap="round" /></svg>
                <p className="text-[16px] text-[#1360d2]">Only multiple charge types of same declaration can be selected.</p>
              </div>
              {selectionError && (
                <div className="flex items-center gap-[8px] rounded-[6px] px-[14px] py-[8px] mt-[12px]" style={{ background: '#fff4f4', border: '1px solid #f5c6cb' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc3545" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" strokeLinecap="round" /></svg>
                  <p className="text-[16px] text-[#dc3545]">Only charge types under the same Declaration Number can be selected together. Deselect your current selection to choose a different declaration.</p>
                </div>
              )}
            </div>

            <div className="px-[16px] py-[16px]" style={{ position: 'relative' }}>
              <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={staticStickyWidth} />
              <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto" style={{ position: 'relative' }}>
                {resizeIndicatorLeft !== null && (
                  <div style={{ position: 'absolute', top: 0, bottom: 0, left: resizeIndicatorLeft, width: 3, background: '#1360d2', borderRadius: 2, pointerEvents: 'none', zIndex: 100 }} />
                )}
              <table
                ref={tableRef}
                onMouseMove={handleTableMouseMove}
                onMouseLeave={handleTableMouseLeave}
                onMouseDown={handleTableMouseDown}
                style={{ minWidth: tableMinWidth, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font, cursor: isNearResize ? 'col-resize' : undefined }}
                className="w-full"
              >
                <thead>
                  <tr>
                    <th style={{ width: 48, minWidth: 48, background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                      <button type="button" role="checkbox" aria-checked={allFilteredSelected} aria-label="Select all" onClick={toggleSelectAll}
                        className="size-[18px] rounded-[4px] inline-flex items-center justify-center flex-shrink-0"
                        style={{ border: `2px solid ${allFilteredSelected ? '#1360d2' : '#a7abb2'}`, background: allFilteredSelected ? '#1360d2' : '#fff' }}>
                        {allFilteredSelected && <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                      </button>
                    </th>
                    {orderedMovable.map((col) => (
                      <th key={col.key} data-col-key={col.key}
                        style={{ width: getW(col.key, col.w), minWidth: getW(col.key, col.w), padding: '10px 12px', textAlign: 'left', fontWeight: 500, position: 'relative', ...getThStyle(col.key) }}
                        onDragOver={(e) => onDragOver(col.key, e)}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(col.key, e, colOrder, setColOrder)}
                      >
                        <div
                          draggable
                          onDragStart={(e) => onDragStart(col.key, e)}
                          onDragEnd={onDragEnd}
                          style={{ display: hoveredColKey === col.key ? 'flex' : 'none', position: 'absolute', top: 3, left: '50%', transform: 'translateX(-50%)', cursor: 'grab', alignItems: 'center', justifyContent: 'center', zIndex: 4 }}
                        >
                          <DragDots />
                        </div>
                        <span className="text-[16px] font-medium text-[#0e1b3d] whitespace-nowrap">{col.label}</span>
                      </th>
                    ))}
                    {STATIC_COLS.map((col, li) => {
                      const right = STATIC_COLS.slice(li + 1).reduce((s, c) => s + staticColW(c), 0);
                      const isLast = li === STATIC_COLS.length - 1;
                      return (
                        <th key={col.key} style={{
                          position: 'sticky', right, width: staticColW(col), minWidth: staticColW(col),
                          background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, whiteSpace: 'nowrap',
                          boxShadow: li === 0 ? '-3px 0 6px rgba(0,0,0,0.06)' : undefined,
                          borderTopRightRadius: isLast ? 8 : 0, borderBottomRightRadius: isLast ? 8 : 0, zIndex: 2,
                        }}>
                          <span className="text-[16px] font-medium text-[#0e1b3d]">{col.label}</span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr><td colSpan={orderedMovable.length + STATIC_COLS.length + 1} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                      <span className="text-[16px] text-[#697498]">No matching declarations found.</span>
                    </td></tr>
                  ) : filteredRows.map(row => {
                    const active = selected.has(rowKey(row));
                    return (
                      <tr key={rowKey(row)} onClick={() => toggleRow(row)} style={{ cursor: 'pointer' }}>
                        <td style={{ background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: 48 }}>
                          <button type="button" role="checkbox" aria-checked={active} aria-label={`Select ${row.declarationNo} ${row.depositType}`}
                            onClick={(e) => { e.stopPropagation(); toggleRow(row); }}
                            className="size-[18px] rounded-[4px] inline-flex items-center justify-center flex-shrink-0"
                            style={{ border: `2px solid ${active ? '#1360d2' : '#a7abb2'}`, background: active ? '#1360d2' : '#fff' }}>
                            {active && <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                          </button>
                        </td>
                        {orderedMovable.map(col => (
                          <td key={col.key} data-col-key={col.key} style={{ background: getTdBg(col.key) ?? '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: getW(col.key, col.w) }}>
                            {cellValue(row, col.key)}
                          </td>
                        ))}
                        {STATIC_COLS.map((col, li) => {
                          const right = STATIC_COLS.slice(li + 1).reduce((s, c) => s + staticColW(c), 0);
                          return (
                            <td key={col.key} style={{ position: 'sticky', right, background: '#f6f9fe', padding: '0 12px', height: 60, verticalAlign: 'middle', width: staticColW(col), boxShadow: li === 0 ? '-3px 0 6px rgba(0,0,0,0.06)' : undefined }}>
                              <span className="text-[16px] whitespace-nowrap" style={{ color: '#dc3545' }}>{col.key === 'claimExpiry' ? row.claimExpiry : row.exportExpiry}</span>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-white px-4 sm:px-10 py-[16px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '0px -2px 8px rgba(0,0,0,0.08)' }}>
        <button data-secondary-btn
          onClick={onBackToListing}
          className="h-[48px] px-[28px] rounded-[4px] border text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
        >
          Back To Listing
        </button>
        <button
          onClick={() => selectedRows.length > 0 && onProceed(selectedRows)}
          disabled={selectedRows.length === 0}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white transition-colors"
          style={{ background: selectedRows.length > 0 ? '#1360d2' : '#a7c3eb', cursor: selectedRows.length > 0 ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500, boxShadow: selectedRows.length > 0 ? '0px 0px 8px rgba(28,72,191,0.16)' : 'none' }}
        >
          Proceed{selectedRows.length > 0 ? ` (${selectedRows.length})` : ''}
        </button>
      </div>
    </div>
  );
}
