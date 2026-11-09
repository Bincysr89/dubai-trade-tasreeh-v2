import React, { useState } from 'react';
import BackToListingBar from './BackToListingBar';
import SaveExitModal from './SaveExitModal';
import ClaimStepper, { REFUND_AUCTION_STEPS } from './ClaimStepper';
import Pagination from './Pagination';
import Dh from './Dh';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', 'Segoe UI', sans-serif";

export type AuctionLotRow = {
  auctionNo: string;
  auctionLotNo: string;
  description: string;
  auctionDate: string;
  saleProceeds: string;
};

const AUCTION_LOTS: AuctionLotRow[] = [
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000112', description: 'Assorted Electronics — Mobile Accessories', auctionDate: '14/03/2025', saleProceeds: '18,500.00' },
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000113', description: 'Assorted Electronics — Home Appliances',   auctionDate: '14/03/2025', saleProceeds: '42,300.00' },
  { auctionNo: 'AUC-2025-0041', auctionLotNo: 'LOT-000114', description: 'Textile Rolls — Cotton Blend',              auctionDate: '14/03/2025', saleProceeds: '9,750.00' },
  { auctionNo: 'AUC-2025-0052', auctionLotNo: 'LOT-000201', description: 'Automotive Spare Parts — Mixed Batch',      auctionDate: '02/04/2025', saleProceeds: '27,120.00' },
  { auctionNo: 'AUC-2025-0052', auctionLotNo: 'LOT-000202', description: 'Automotive Spare Parts — Tyres',            auctionDate: '02/04/2025', saleProceeds: '15,900.00' },
  { auctionNo: 'AUC-2025-0067', auctionLotNo: 'LOT-000318', description: 'Furniture — Office Chairs (Bulk)',          auctionDate: '19/04/2025', saleProceeds: '33,400.00' },
  { auctionNo: 'AUC-2025-0067', auctionLotNo: 'LOT-000319', description: 'Furniture — Wooden Cabinets',               auctionDate: '19/04/2025', saleProceeds: '21,600.00' },
  { auctionNo: 'AUC-2025-0079', auctionLotNo: 'LOT-000405', description: 'Building Materials — Ceramic Tiles',        auctionDate: '05/05/2025', saleProceeds: '12,050.00' },
  { auctionNo: 'AUC-2025-0079', auctionLotNo: 'LOT-000406', description: 'Building Materials — Sanitary Fittings',    auctionDate: '05/05/2025', saleProceeds: '19,875.00' },
  { auctionNo: 'AUC-2025-0088', auctionLotNo: 'LOT-000512', description: 'Packaged Foodstuff — Non-Perishable',       auctionDate: '21/05/2025', saleProceeds: '6,420.00' },
  { auctionNo: 'AUC-2025-0088', auctionLotNo: 'LOT-000513', description: 'Packaged Foodstuff — Beverages',           auctionDate: '21/05/2025', saleProceeds: '8,930.00' },
  { auctionNo: 'AUC-2025-0093', auctionLotNo: 'LOT-000601', description: 'Industrial Machinery — Compressors',        auctionDate: '09/06/2025', saleProceeds: '58,000.00' },
];

const HEADERS = ['Auction No.', 'Auction Lot No.', 'Description', 'Sale Proceeds (AED)', 'Auction Date'];

type Props = {
  onBack: () => void;
  onBackToListing: () => void;
  onProceed: (rows: AuctionLotRow[]) => void;
};

export default function AuctionLotDetailsPage({ onBack, onBackToListing, onProceed }: Props) {
  const [auctionNoQuery, setAuctionNoQuery] = useState('');
  const [auctionLotNoQuery, setAuctionLotNoQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  const selectedPanelRef = React.useRef<HTMLDivElement>(null);
  const scrollToSelected = () => selectedPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const {
    scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd,
  } = useTableBehaviors();

  const filtered = AUCTION_LOTS.filter(r =>
    (!auctionNoQuery || r.auctionNo.toLowerCase().includes(auctionNoQuery.toLowerCase())) &&
    (!auctionLotNoQuery || r.auctionLotNo.toLowerCase().includes(auctionLotNoQuery.toLowerCase()))
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleRow = (lotNo: string) => setSelected(prev => {
    const next = new Set(prev);
    next.has(lotNo) ? next.delete(lotNo) : next.add(lotNo);
    return next;
  });

  const allSelected = pageRows.length > 0 && pageRows.every(r => selected.has(r.auctionLotNo));
  const someSelected = !allSelected && pageRows.some(r => selected.has(r.auctionLotNo));
  const toggleAll = () => {
    if (allSelected) {
      setSelected(prev => { const next = new Set(prev); pageRows.forEach(r => next.delete(r.auctionLotNo)); return next; });
    } else {
      setSelected(prev => { const next = new Set(prev); pageRows.forEach(r => next.add(r.auctionLotNo)); return next; });
    }
  };

  const selectedRows = AUCTION_LOTS.filter(r => selected.has(r.auctionLotNo));

  const cellValue = (row: AuctionLotRow, label: string): React.ReactNode => {
    switch (label) {
      case 'Auction No.':
        return <span className="text-[16px] text-[#1360d2] whitespace-nowrap" style={{ fontWeight: 500 }}>{row.auctionNo}</span>;
      case 'Auction Lot No.':
        return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ fontWeight: 500 }}>{row.auctionLotNo}</span>;
      case 'Description':
        return <span className="text-[16px] text-[#0e1b3d]" style={{ display: 'block', whiteSpace: 'normal', lineHeight: 1.3 }}>{row.description}</span>;
      case 'Sale Proceeds (AED)':
        return <span className="text-[16px] text-[#0e1b3d] inline-flex items-baseline gap-[4px] whitespace-nowrap"><Dh style={{ fontSize: 14 }} />{row.saleProceeds}</span>;
      case 'Auction Date':
        return <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.auctionDate}</span>;
      default:
        return '—';
    }
  };

  return (
    <div className="flex flex-col bg-[#f8fafd] h-full" style={{ fontFamily: font }}>
      {/* Breadcrumb */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <span className="text-[16px] text-[#8f94ae]">Home</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Import By Sea</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Integrated Clearance</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]">A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 sm:px-10 flex items-center gap-[16px] flex-wrap mb-[8px]">
          <h1 className="text-[32px] text-[#111838]" style={{ fontWeight: 500 }}>Raise New Claim - Refund on Auction Proceed</h1>
        </div>
        <div className="px-4 sm:px-10 mb-[24px]">
          <ClaimStepper activeIndex={0} steps={REFUND_AUCTION_STEPS} />
        </div>

        <div className="px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
          <div className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#eef1f6] flex-wrap gap-[12px]">
              <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Auction Lot Details</p>
            </div>

            {/* Search + info bar */}
            <div className="px-[24px] pt-[20px] pb-[8px] flex flex-col gap-[12px]">
              <div className="flex flex-wrap gap-[12px] items-start">
                {/* Auction Number — separate search field */}
                <div className="relative" style={{ minWidth: 260, flex: '1 1 260px', maxWidth: 380 }}>
                  <div className="flex items-center bg-white rounded-[4px] h-[48px]" style={{ border: '1px solid #d5ddfb' }}>
                    <input
                      value={auctionNoQuery}
                      onChange={(e) => { setAuctionNoQuery(e.target.value); setPage(1); }}
                      placeholder="Search Auction Number"
                      className="flex-1 px-[14px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                      style={{ fontFamily: font }}
                    />
                    {auctionNoQuery && (
                      <button type="button" onClick={() => { setAuctionNoQuery(''); setPage(1); }}
                        className="mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0">
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                      </button>
                    )}
                    <span className="pr-[12px] text-[#8f94ae] flex-shrink-0 pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" /></svg>
                    </span>
                  </div>
                </div>

                {/* Auction Lot Number — separate search field */}
                <div className="relative" style={{ minWidth: 260, flex: '1 1 260px', maxWidth: 380 }}>
                  <div className="flex items-center bg-white rounded-[4px] h-[48px]" style={{ border: '1px solid #d5ddfb' }}>
                    <input
                      value={auctionLotNoQuery}
                      onChange={(e) => { setAuctionLotNoQuery(e.target.value); setPage(1); }}
                      placeholder="Search Auction Lot Number"
                      className="flex-1 px-[14px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none bg-transparent"
                      style={{ fontFamily: font }}
                    />
                    {auctionLotNoQuery && (
                      <button type="button" onClick={() => { setAuctionLotNoQuery(''); setPage(1); }}
                        className="mr-[6px] size-[22px] inline-flex items-center justify-center rounded-full text-[#697498] hover:bg-[#f0f4ff] flex-shrink-0">
                        <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
                      </button>
                    )}
                    <span className="pr-[12px] text-[#8f94ae] flex-shrink-0 pointer-events-none">
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" /></svg>
                    </span>
                  </div>
                </div>
              </div>

              {/* Available / Selected */}
              <div className="flex items-center gap-[16px]">
                <span className="text-[16px] text-[#697498]">
                  Available: <span style={{ color: '#0e1b3d', fontWeight: 600 }}>{filtered.length}</span>
                </span>
                {selected.size > 0 && (
                  <>
                    <span className="text-[16px] text-[#697498]">
                      Selected: <span style={{ color: '#1360d2', fontWeight: 600 }}>{selected.size}</span>
                    </span>
                    <button data-secondary-btn type="button" onClick={scrollToSelected}
                      className="h-[32px] px-[14px] rounded-[4px] text-[14px] bg-white transition-colors"
                      style={{ border: '1.5px solid #1360d2', color: '#1360d2', fontWeight: 500, cursor: 'pointer' }}>
                      View Selected
                    </button>
                    <button type="button" onClick={() => setSelected(new Set())}
                      className="h-[32px] px-[14px] rounded-[4px] text-[14px] bg-white hover:bg-[#f0f4ff] transition-colors"
                      style={{ border: '1.5px solid #d5ddfb', color: '#455174', fontWeight: 500, cursor: 'pointer' }}>
                      Clear Selection
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Table */}
            <div className="px-[16px] pt-[8px] pb-[16px]" style={{ position: 'relative' }}>
              <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={0} />
              <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
                <table className="dt-table" style={{ minWidth: 980 }}>
                  <thead>
                    <tr>
                      <th style={{ width: 48 }}>
                        <button type="button" onClick={toggleAll} role="checkbox" aria-checked={allSelected}
                          className="size-[20px] rounded-[4px] inline-flex items-center justify-center"
                          style={{ border: `2px solid ${allSelected || someSelected ? '#1360d2' : '#a7abb2'}`, background: allSelected ? '#1360d2' : '#fff', cursor: 'pointer' }}>
                          {allSelected && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                          {someSelected && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2.5" strokeLinecap="round"><path d="M4 8h8" /></svg>}
                        </button>
                      </th>
                      {HEADERS.map(h => <th key={h}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.length === 0 ? (
                      <tr>
                        <td colSpan={HEADERS.length + 1} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                          <span className="text-[16px] text-[#697498]">No matching auction lots found.</span>
                        </td>
                      </tr>
                    ) : pageRows.map(row => {
                      const isSelected = selected.has(row.auctionLotNo);
                      return (
                        <tr key={row.auctionLotNo} className={isSelected ? 'is-selected' : ''} onClick={() => toggleRow(row.auctionLotNo)} style={{ cursor: 'pointer' }}>
                          <td>
                            <button type="button" onClick={(e) => { e.stopPropagation(); toggleRow(row.auctionLotNo); }}
                              role="checkbox" aria-checked={isSelected}
                              className="size-[20px] rounded-[4px] inline-flex items-center justify-center"
                              style={{ border: `2px solid ${isSelected ? '#1360d2' : '#a7abb2'}`, background: isSelected ? '#1360d2' : '#fff', cursor: 'pointer' }}>
                              {isSelected && <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3 3 7-7" /></svg>}
                            </button>
                          </td>
                          {HEADERS.map(h => <td key={h}>{cellValue(row, h)}</td>)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="px-[24px] pb-[20px]">
              <Pagination page={page} totalPages={totalPages} pageSize={pageSize} totalItems={filtered.length} onPageChange={setPage} onPageSizeChange={(n) => { setPageSize(n); setPage(1); }} />
            </div>
          </div>

          {/* Selected Auction Lots — view details together before proceeding */}
          {selected.size > 0 && (
            <div ref={selectedPanelRef} className="bg-white rounded-[8px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)', scrollMarginTop: 24 }}>
              <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-[#eef1f6] flex-wrap gap-[12px]">
                <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
                  Selected Auction Lots
                  <span className="ml-[8px] text-[14px] text-[#1360d2]" style={{ fontWeight: 500 }}>({selectedRows.length})</span>
                </p>
              </div>
              <div className="overflow-x-auto px-[16px] pt-[8px] pb-[16px]">
                <table className="dt-table" style={{ minWidth: 1040 }}>
                  <thead>
                    <tr>
                      {HEADERS.map(h => <th key={h}>{h}</th>)}
                      <th style={{ width: 64 }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRows.map(row => (
                      <tr key={row.auctionLotNo}>
                        {HEADERS.map(h => <td key={h}>{cellValue(row, h)}</td>)}
                        <td>
                          <button type="button" aria-label={`Remove ${row.auctionLotNo}`} onClick={() => setConfirmRemove(row.auctionLotNo)}
                            className="size-[24px] inline-flex items-center justify-center rounded hover:bg-[#fef2f2] transition-colors flex-shrink-0"
                            style={{ color: '#dc3545' }}>
                            <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
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
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <BackToListingBar
        onBack={onBack}
        onBackToListing={onBackToListing}
        rightContent={
          <div className="flex items-center gap-[12px]">
            {selected.size > 0 && (
              <span className="text-[16px] text-[#455174]">{selected.size} lot{selected.size !== 1 ? 's' : ''} selected</span>
            )}
            <button data-secondary-btn onClick={() => setShowSaveModal(true)}
              className="h-[48px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}>
              Save &amp; Exit
            </button>
            <button
              onClick={() => selectedRows.length > 0 && onProceed(selectedRows)}
              disabled={selectedRows.length === 0}
              className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Proceed
            </button>
          </div>
        }
      />
      {showSaveModal && <SaveExitModal onCancel={() => setShowSaveModal(false)} onBackToListing={onBackToListing} />}

      {/* Remove-lot confirmation */}
      {confirmRemove && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50" onClick={() => setConfirmRemove(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[460px] mx-[16px]"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#fff8e6' }}>
              <svg viewBox="0 0 96 96" fill="none" width="34" height="34">
                <circle cx="48" cy="48" r="42" fill="none" stroke="#FFC020" strokeWidth="7" />
                <rect x="44.5" y="22" width="7" height="32" rx="3.5" fill="#FFC020" />
                <circle cx="48" cy="68" r="4.5" fill="#FFC020" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-[8px]">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure to delete?</p>
              <p className="text-[16px] text-[#697498]" style={{ lineHeight: 1.4 }}>This auction lot will be removed from your selected list.</p>
            </div>
            <div className="flex gap-[12px]">
              <button data-secondary-btn onClick={() => setConfirmRemove(null)}
                className="h-[48px] px-[36px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
                No
              </button>
              <button onClick={() => { setSelected(prev => { const next = new Set(prev); next.delete(confirmRemove); return next; }); setConfirmRemove(null); }}
                className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', fontWeight: 500 }}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
