import React, { useEffect, useRef, useState } from 'react';
import MoreIcon from '../MoreIcon';
import Pagination from '../Pagination';
import RowFlyout, { STEPPER_INVOICE_MENU, STEPPER_LINE_ITEM_MENU, anchorFrom } from './RowFlyout';
import { JourneyStepper, JourneyTable, JourneyTd, JourneyThead, SectionCard, SectionTitle, TABLE_HEAD_BG_NESTED, font } from './DeclarationUI';

const Chevron = ({ up }: { up?: boolean }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round"
    style={{ transform: up ? 'rotate(180deg)' : undefined }}><path d="M6 9l6 6 6-6" /></svg>
);

const LINE_ITEM_COLUMNS = [
  'HS Code', 'Goods Description', 'Condition', 'Country of origin', 'Weight', 'Value of Goods',
  'Statistical Quantity - Units', 'Supplementary Quantity - Units', 'Item Quantity - Units',
];
/* Amend reports the money side of each line instead of the quantities — Figma 2650:52579. */
const AMEND_LINE_ITEM_COLUMNS = [
  'HS Code', 'Goods Description', 'Condition', 'Country of origin', 'Weight',
  'Goods Value In Foreign Currency', 'Statistical Quantity - Units', 'Currency Rate', 'CIF Value',
];
const LINE_ITEMS = ['AX1234567', 'BX1234567', 'CX1234567', 'DX1234567', 'EX1234567', 'EX1234567'].map((hs) => ({
  hs, desc: 'Spare parts', condition: 'New', origin: 'India', weight: '100 kg',
  value: 'AED 1500', statQty: '100 unit', suppQty: '100 unit', itemQty: '100 unit',
  rate: '01', cif: '1000',
}));

const VEHICLE_COLUMNS = [
  'Vehicle Type', 'Value Brand', 'Model', 'Condition', 'Chassis Number', 'Specification std.',
  'Color', 'Drive', 'Year Build', 'Engine Capacity', 'Declaration Number', 'Manufacturer/Exporter',
  'Anti dumping Applicability',
];
const VEHICLE_ROWS = [
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '4 Ltr', 'C15785678', '05', '-'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2023', '4 Ltr', 'C15785678', '05', '-'],
  ['4WD', 'Honda', 'Civix', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '4 Ltr', 'C15785678', '05', '-'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '6 ltr', 'C15785678', '05', '-'],
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '6 ltr', 'C15785678', '05', '-'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2023', '6 ltr', 'C15785678', '05', '-'],
  ['4WD', 'Honda', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2023', '6 ltr', 'C15785678', '05', '-'],
  ['4WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2023', '6 ltr', 'C15785678', '05', '-'],
];

const INVOICES = [
  { id: 1, number: 'TD 2403', date: '09/11/2024', terms: 'Cost & Fright', lineItems: '1 Line Item', value: 'USD 6400.00' },
  { id: 2, number: 'TD 2403', date: '09/11/2024', terms: 'Cost & Fright', lineItems: '1 Line Item', value: 'USD 6400.00' },
  { id: 3, number: 'TD 2403', date: '09/11/2024', terms: 'Cost & Fright', lineItems: '1 Line Item', value: 'USD 6400.00' },
];

const invoiceIcon = (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.7">
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M7 13h4M7 16h8" />
  </svg>
);

type Props = {
  /** The amend journey runs a longer stepper, so the labels and active index are overridable. */
  steps?: string[];
  stepIndex?: number;
  /** Amend lists the goods value in foreign currency, the rate and the CIF value. */
  amend?: boolean;
  /** "View Details" on an invoice or line-item row opens the invoice view page. */
  onViewDetails?: () => void;
  /** "Edit Details" returns to the invoice upload page that precedes the stepper. */
  onEditDetails?: () => void;
  /** Read-only rendering for View Declaration — no stepper, no Edit Details, and the
      invoice cards carry their payment method (Figma 2835:99130). */
  view?: boolean;
};

/** Invoice Details step — Figma 2650:48551. */
export default function DeclarationInvoiceDetailsPage({ onViewDetails, onEditDetails, steps, stepIndex, amend, view = false }: Props) {
  const [openInvoice, setOpenInvoice] = useState<number | null>(1);
  const [openLineItem, setOpenLineItem] = useState<string | null>('AX1234567');
  const [flyout, setFlyout] = useState<{ kind: 'invoice' | 'line' | 'vehicle'; at: { top: number; left: number } } | null>(null);
  const lineColumns = amend ? AMEND_LINE_ITEM_COLUMNS : LINE_ITEM_COLUMNS;
  /* The nested vehicle table lives inside a table that scrolls sideways, so its block is
     pinned to the left edge and sized to the visible width — otherwise its own sticky
     Action column would pin off-screen, past the parent table's right edge. */
  const lineScrollRef = useRef<HTMLDivElement>(null);
  const [lineViewWidth, setLineViewWidth] = useState<number>();
  useEffect(() => {
    const el = lineScrollRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => setLineViewWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [openInvoice, openLineItem]);
  const [linePage, setLinePage] = useState(4);
  const [linePageSize, setLinePageSize] = useState(8);
  const [vehPage, setVehPage] = useState(4);
  const [vehPageSize, setVehPageSize] = useState(8);

  const openFlyout = (kind: 'invoice' | 'line' | 'vehicle') => (e: React.MouseEvent) => {
    e.stopPropagation();
    setFlyout({ kind, at: anchorFrom(e, kind === 'invoice' ? 1 : 3) });
  };

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      {!view && <JourneyStepper active={stepIndex ?? 2} steps={steps} />}
      {view && <SectionTitle>Invoice Details</SectionTitle>}

      <div className="flex items-center justify-between gap-[16px] flex-wrap">
        <div className="flex items-center gap-[40px] flex-wrap">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>03 Invoices Added</span>
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Grand Total: AED 25,000.00</span>
        </div>
        {/* Editing the invoices means going back to where they were added, before the stepper */}
        {!view && (
          <button data-secondary-btn type="button" onClick={onEditDetails}
            className="h-[44px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
          >Edit Details</button>
        )}
      </div>

      {INVOICES.map((inv) => {
        const expanded = openInvoice === inv.id;
        return (
          <SectionCard key={inv.id} className="!py-[20px]">
            <div className="flex items-center gap-[10px] mb-[16px]">
              {invoiceIcon}
              <span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Invoice {inv.id}</span>
            </div>

            {/* The actions sit on the same line as the read-outs, never wrapped below them */}
            <div className="flex items-center justify-between gap-[20px]">
              <div className="flex flex-wrap gap-x-[56px] gap-y-[16px] flex-1 min-w-0">
                {[['Invoice Number', inv.number], ['Invoice Date', inv.date], ['Terms of Delivery', inv.terms],
                  ['No. of Line Items', inv.lineItems], ['Invoice Value', inv.value],
                  ...(view ? [['Payment Method', 'Bank transfer']] : [])].map(([l, v]) => (
                  <div key={l} className="flex flex-col gap-[6px]">
                    <span className="text-[14px] text-[#697498]">{l}</span>
                    <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-[12px] flex-shrink-0">
                <button onClick={openFlyout('invoice')} aria-label={`Invoice ${inv.id} actions`}
                  className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreIcon /></button>
                <button onClick={() => setOpenInvoice(expanded ? null : inv.id)} aria-label={expanded ? 'Collapse invoice' : 'Expand invoice'}
                  className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><Chevron up={expanded} /></button>
              </div>
            </div>

            {expanded && (
              <div className="mt-[20px] pt-[20px] flex flex-col gap-[8px]" style={{ borderTop: '1px solid #e6ecf5' }}>
                <span className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Line Items</span>
                <span className="text-[14px] text-[#697498] mb-[8px]">{amend ? '200 HS Code Available' : '100 Items Available'}</span>

                <JourneyTable minWidth={1235} scrollRef={lineScrollRef}>
                    <JourneyThead columns={[
                      ...lineColumns.map((label) => ({ label })),
                      { label: 'Action', w: 90, filter: false, sticky: true },
                    ]} />
                    <tbody>
                      {LINE_ITEMS.map((li, i) => {
                        const open = openLineItem === li.hs && i === 0;
                        return (
                          <React.Fragment key={`${li.hs}-${i}`}>
                            <tr>
                              <JourneyTd first>{li.hs}</JourneyTd><JourneyTd>{li.desc}</JourneyTd><JourneyTd>{li.condition}</JourneyTd><JourneyTd>{li.origin}</JourneyTd>
                              <JourneyTd>{li.weight}</JourneyTd>
                              {amend ? (
                                <>
                                  <JourneyTd>{li.value}</JourneyTd><JourneyTd>{li.statQty}</JourneyTd>
                                  <JourneyTd>{li.rate}</JourneyTd><JourneyTd>{li.cif}</JourneyTd>
                                </>
                              ) : (
                                <>
                                  <JourneyTd>{li.value}</JourneyTd><JourneyTd>{li.statQty}</JourneyTd>
                                  <JourneyTd>{li.suppQty}</JourneyTd><JourneyTd>{li.itemQty}</JourneyTd>
                                </>
                              )}
                              <JourneyTd sticky width={90}>
                                <span className="flex items-center gap-[10px]">
                                  <button onClick={openFlyout('line')} aria-label="Line item actions"
                                    className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreIcon /></button>
                                  <button onClick={() => setOpenLineItem(open ? null : li.hs)} aria-label={open ? 'Collapse line item' : 'Expand line item'}
                                    className="size-[24px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><Chevron up={open} /></button>
                                </span>
                              </JourneyTd>
                            </tr>
                            {open && (
                              <tr>
                                <td colSpan={lineColumns.length + 1} style={{ padding: 0, background: '#f4f7fc', borderBottom: '1px solid #e6ecf5' }}>
                                  <div className="px-[16px] py-[20px] flex flex-col gap-[12px]"
                                    style={{ position: 'sticky', left: 0, width: lineViewWidth }}>
                                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Vehicle Details</span>
                                    <JourneyTable minWidth={1500}>
                                        <JourneyThead headBg={TABLE_HEAD_BG_NESTED} columns={[
                                          ...VEHICLE_COLUMNS.map((label) => ({ label })),
                                          { label: 'Action', w: 70, filter: false, sticky: true },
                                        ]} />
                                        <tbody>
                                          {VEHICLE_ROWS.map((r, ri) => (
                                            <tr key={ri}>
                                              {r.map((cell, ci) => <JourneyTd key={ci} first={ci === 0}>{cell}</JourneyTd>)}
                                              <JourneyTd sticky width={70}>
                                                <button onClick={openFlyout('vehicle')} aria-label="Vehicle actions"
                                                  className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]"><MoreIcon /></button>
                                              </JourneyTd>
                                            </tr>
                                          ))}
                                        </tbody>
                                    </JourneyTable>
                                    <Pagination
                                      page={vehPage} totalPages={7} pageSize={vehPageSize} pageSizeOptions={[8, 16, 32]}
                                      totalItems={56} onPageChange={setVehPage}
                                      onPageSizeChange={(s) => { setVehPageSize(s); setVehPage(1); }}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </tbody>
                </JourneyTable>

                <div className="pt-[8px]">
                  <Pagination
                    page={linePage} totalPages={7} pageSize={linePageSize} pageSizeOptions={[8, 16, 32]}
                    totalItems={56} onPageChange={setLinePage}
                    onPageSizeChange={(s) => { setLinePageSize(s); setLinePage(1); }}
                  />
                </div>
              </div>
            )}
          </SectionCard>
        );
      })}

      {flyout && (
        <RowFlyout
          at={flyout.at}
          onClose={() => setFlyout(null)}
          onPick={(label) => { if (label === 'View Details') onViewDetails?.(); }}
          items={flyout.kind === 'line' ? STEPPER_LINE_ITEM_MENU : STEPPER_INVOICE_MENU}
        />
      )}
    </div>
  );
}
