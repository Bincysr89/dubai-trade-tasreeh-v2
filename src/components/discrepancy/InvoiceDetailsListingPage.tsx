import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import Header from '../Header';
import DTSelect from '../DTSelect';
import { DateInputOutlined, StatusAsOnBadge } from '../DatePicker';
import Pagination from '../Pagination';
import { DhAmount } from '../Dh';
import {
  CHARGE_INVOICES, INVOICE_TYPE_OPTIONS, INVOICE_TYPE_TITLES, INVOICE_STATUS_OPTIONS, INVOICE_STATUS_COLORS,
  INVOICE_DATE_TYPE_OPTIONS, INVOICE_SEARCH_TYPE_LABELS, amountInWords,
  type ChargeInvoice, type InvoiceStatus,
} from './invoiceDetailsData';

const font = "'Dubai', sans-serif";
const DEFAULT_FROM = '2026-05-01';
const DEFAULT_TO = '2026-08-18';
type SearchType = 'invoiceNo' | 'rotationNo' | 'referenceNo';

/** Parses "21-May-26" into a 'YYYY-MM-DD'-comparable string; returns '' if unparseable. */
function parseInvoiceDate(s: string): string {
  const months: Record<string, string> = { Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12' };
  const m = s.match(/^(\d{2})-([A-Za-z]{3})-(\d{2})$/);
  if (!m) return '';
  const [, dd, mon, yy] = m;
  const mm = months[mon];
  if (!mm) return '';
  return `20${yy}-${mm}-${dd}`;
}

type AppliedFilters = { invoiceType: string; status: string; dateType: string; fromDate: string; toDate: string };

function KeyValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-[8px]">
      <span className="text-[14px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font, minWidth: 150 }}>{label}</span>
      <span className="text-[14px] text-[#697498]">:</span>
      <span className="text-[14px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{value}</span>
    </div>
  );
}

type Props = { onBack: () => void; sidebar?: ReactNode };

export default function InvoiceDetailsListingPage({ onBack, sidebar }: Props) {
  const [afOpen, setAfOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>('invoiceNo');
  const [searchTypeOpen, setSearchTypeOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  const [statusOpen, setStatusOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | null>(null);

  const [openRowMenu, setOpenRowMenu] = useState<number | null>(null);
  const [viewInvoice, setViewInvoice] = useState<ChargeInvoice | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  // Advance-filter draft fields
  const [dfInvoiceType, setDfInvoiceType] = useState('');
  const [dfStatus, setDfStatus] = useState('');
  const [dfDateType, setDfDateType] = useState('');
  const [dfFromDate, setDfFromDate] = useState(DEFAULT_FROM);
  const [dfToDate, setDfToDate] = useState(DEFAULT_TO);
  // Applied advanced filters
  const [applied, setApplied] = useState<AppliedFilters>({ invoiceType: '', status: '', dateType: '', fromDate: DEFAULT_FROM, toDate: DEFAULT_TO });

  useEffect(() => {
    if (!searchTypeOpen) return;
    const close = (e: MouseEvent) => { if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchTypeOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [searchTypeOpen]);

  const resetFilters = () => {
    setDfInvoiceType(''); setDfStatus(''); setDfDateType(''); setDfFromDate(DEFAULT_FROM); setDfToDate(DEFAULT_TO);
    setApplied({ invoiceType: '', status: '', dateType: '', fromDate: DEFAULT_FROM, toDate: DEFAULT_TO });
    setPage(1);
  };
  const applyFilters = () => {
    setApplied({ invoiceType: dfInvoiceType, status: dfStatus, dateType: dfDateType, fromDate: dfFromDate, toDate: dfToDate });
    setPage(1);
  };
  const applyBadgeDates = (from: string, to: string) => {
    setDfFromDate(from); setDfToDate(to);
    setApplied(a => ({ ...a, fromDate: from, toDate: to }));
    setPage(1);
  };

  const filteredInvoices = useMemo(() => {
    return CHARGE_INVOICES.filter(inv => {
      if (statusFilter && inv.status !== statusFilter) return false;
      if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        const field = searchType === 'invoiceNo' ? inv.invoiceNo : searchType === 'rotationNo' ? inv.rotationNo : inv.referenceNo;
        if (!field.toLowerCase().includes(q)) return false;
      }
      if (applied.invoiceType && inv.invoiceType !== applied.invoiceType) return false;
      if (applied.status && inv.status !== applied.status) return false;
      if (applied.fromDate || applied.toDate) {
        const dateStr = applied.dateType === 'Payment Due Date' ? inv.paymentDueDate : inv.createdDate;
        const parsed = parseInvoiceDate(dateStr);
        if (applied.fromDate && (!parsed || parsed < applied.fromDate)) return false;
        if (applied.toDate && (!parsed || parsed > applied.toDate)) return false;
      }
      return true;
    });
  }, [statusFilter, searchText, searchType, applied]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
  const curPage = Math.min(page, totalPages);
  const pageRows = filteredInvoices.slice((curPage - 1) * pageSize, curPage * pageSize);

  const printInvoice = (inv: ChargeInvoice) => {
    setViewInvoice(inv);
    setTimeout(() => window.print(), 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Breadcrumb + agent banner + title — full width, above the sidebar/content split */}
        <div className="px-4 sm:px-10 pt-[14px] flex-shrink-0">
          <div className="flex items-center justify-between pb-[10px] flex-wrap gap-y-[6px] flex-shrink-0">
            <div className="flex items-center gap-[6px]">
              <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
              <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
              <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Service Catalog</button>
              <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
              <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Cargo Reconciliation</span>
            </div>
            <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056- Dubai Customs - Test LLC</span>
            </div>
          </div>

          <h1 className="text-[28px] text-[#111838] mb-[16px] flex-shrink-0" style={{ fontFamily: font, fontWeight: 500 }}>View Invoice Details</h1>
        </div>

        {/* Sidebar + content */}
        <div className="flex flex-1 overflow-hidden px-4 sm:px-10 pb-[20px] gap-[12px]">
          {sidebar}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col gap-[12px]">
            {/* Toolbar row 1 */}
            <div className="flex items-center gap-[12px] flex-wrap flex-shrink-0">
              <button onClick={() => setAfOpen(o => !o)}
                className={`flex items-center gap-[8px] h-[48px] px-[16px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${afOpen ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d4dcfa] text-[#000]'}`}
                style={{ fontFamily: font }}>
                Advanced Filters
                <svg viewBox="0 0 24 24" className="size-[20px]" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M7 12h10M11 18h2" strokeLinecap="round" /></svg>
              </button>

              <div ref={searchRef} className="relative flex items-center bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] flex-1 min-w-[220px] max-w-[440px]">
                <div className="flex items-center flex-1 min-w-0 h-full overflow-hidden">
                  <button type="button" onClick={() => setSearchTypeOpen(o => !o)}
                    className="flex items-center gap-[6px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer flex-shrink-0 max-w-[170px] hover:bg-[#f7faff] transition-colors">
                    <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: font }}>{INVOICE_SEARCH_TYPE_LABELS[searchType]}</span>
                    <svg viewBox="0 0 24 24" className={`size-[18px] text-[#1360d2] transition-transform flex-shrink-0 ${searchTypeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                  </button>
                  <div className="flex items-center flex-1 min-w-0 px-[12px]">
                    <input type="text" value={searchText} onChange={e => { setSearchText(e.target.value); setPage(1); }} placeholder={`Search ${INVOICE_SEARCH_TYPE_LABELS[searchType]}`}
                      className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] focus:outline-none bg-transparent placeholder:text-[#697498]" style={{ fontFamily: font }} />
                  </div>
                </div>
                {searchTypeOpen && (
                  <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 190, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                    {(['invoiceNo', 'rotationNo', 'referenceNo'] as SearchType[]).map(t => (
                      <button key={t} onClick={() => { setSearchType(t); setSearchTypeOpen(false); setSearchText(''); }}
                        className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                        style={{ color: t === searchType ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: t === searchType ? 500 : 400 }}>
                        {INVOICE_SEARCH_TYPE_LABELS[t]}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative flex-shrink-0">
                <button type="button" onClick={() => setStatusOpen(o => !o)} className="flex items-center gap-[8px] bg-white border border-[#d5ddfb] rounded-[4px] h-[48px] px-[16px] hover:bg-[#f7faff] transition-colors">
                  <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{statusFilter ?? 'Status'}</span>
                  <svg viewBox="0 0 24 24" className={`size-[22px] text-[#1360d2] transition-transform ${statusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
                </button>
                {statusOpen && (
                  <div className="absolute z-[80] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ minWidth: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                    <button onClick={() => { setStatusFilter(null); setStatusOpen(false); setPage(1); }} className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                      style={{ color: statusFilter === null ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: statusFilter === null ? 500 : 400 }}>All statuses</button>
                    {INVOICE_STATUS_OPTIONS.map(s => (
                      <button key={s} onClick={() => { setStatusFilter(s); setStatusOpen(false); setPage(1); }} className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
                        style={{ color: s === statusFilter ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: s === statusFilter ? 500 : 400 }}>{s}</button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1" />
              <button className="flex items-center gap-[6px] text-[16px] text-[#1360d2] flex-shrink-0" style={{ fontFamily: font }}>
                Need Help
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="1.7"><circle cx="10" cy="10" r="7.5" /><path d="M10 14v-1" strokeLinecap="round" /><path d="M10 7c0-1.1.9-2 2-2" strokeLinecap="round" /></svg>
              </button>
            </div>

            <div className="flex items-center justify-center flex-shrink-0">
              <StatusAsOnBadge fromValue={applied.fromDate} toValue={applied.toDate} onApply={applyBadgeDates} />
            </div>

            {/* Advanced filters panel */}
            {afOpen && (
              <div className="bg-white rounded-[8px] p-[20px] flex-shrink-0" style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
                <div className="flex items-center justify-between mb-[20px]">
                  <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Advanced Filters</span>
                  <button onClick={() => setAfOpen(false)} className="size-[28px] flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors text-[#697498] hover:text-[#0e1b3d]">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <DTSelect label="Invoice Type" value={dfInvoiceType} onChange={setDfInvoiceType} options={INVOICE_TYPE_OPTIONS.map(t => ({ value: t, label: t }))} />
                  <DTSelect label="Status" value={dfStatus} onChange={setDfStatus} options={INVOICE_STATUS_OPTIONS.map(s => ({ value: s, label: s }))} />
                  <DTSelect label="Date Type" value={dfDateType} onChange={setDfDateType} options={INVOICE_DATE_TYPE_OPTIONS.map(d => ({ value: d, label: d }))} placeholder="Created date / Payment due date" />
                  <DateInputOutlined label="From date" value={dfFromDate} onChange={setDfFromDate} />
                  <DateInputOutlined label="To date" value={dfToDate} onChange={setDfToDate} />
                  <div className="flex items-end gap-[10px]">
                    <button onClick={resetFilters} data-secondary-btn className="h-[44px] px-5 rounded-[4px] border border-[#1360d2] text-[15px] text-[#1360d2] bg-white flex-shrink-0" style={{ fontFamily: font }}>Reset</button>
                    <button onClick={applyFilters} className="h-[44px] px-5 rounded-[4px] text-[15px] text-white flex-shrink-0" style={{ background: '#1360d2', fontFamily: font }}>Apply</button>
                  </div>
                </div>
              </div>
            )}

            {/* Table — master listing template: row-gap grouping, sticky Actions column */}
            <div className="overflow-x-auto">
              <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: '0 8px', minWidth: 1140 }}>
                <thead>
                  <tr>
                    {['Invoice No', 'Rotation No', 'Invoice Type', 'Created Date', 'Payment Due Date', 'Payment Amount (AED)', 'Status'].map((h, i) => (
                      <th key={h} className="text-left text-[16px] text-[#051937]" style={{ padding: '10px 12px', paddingLeft: i === 0 ? 16 : 12, fontWeight: 500, whiteSpace: 'nowrap', background: '#a6c2e9', borderRadius: i === 0 ? '8px 0 0 8px' : undefined }}>{h}</th>
                    ))}
                    <th className="text-left text-[16px] text-[#051937]" style={{ padding: '10px 12px', fontWeight: 500, background: '#a6c2e9', position: 'sticky', right: 0, borderRadius: '0 8px 8px 0', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageRows.length === 0 ? (
                    <tr><td colSpan={8} style={{ padding: '40px 12px', textAlign: 'center', background: '#fff' }}><span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>No invoices found for the given search criteria.</span></td></tr>
                  ) : pageRows.map((inv, idx) => {
                    const st = INVOICE_STATUS_COLORS[inv.status];
                    return (
                      <tr key={`${inv.invoiceNo}-${inv.rotationNo}-${idx}`} style={{ boxShadow: '0px 2px 8px rgba(143,155,186,0.14)' }}>
                        <td style={{ padding: '14px 12px', paddingLeft: 16, whiteSpace: 'nowrap', background: '#fff', borderRadius: '8px 0 0 8px' }}>
                          <button onClick={() => setViewInvoice(inv)} className="text-[16px] hover:underline" style={{ color: '#1360d2', fontWeight: 500, fontFamily: font }}>{inv.invoiceNo}</button>
                        </td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 12px', whiteSpace: 'nowrap', background: '#fff' }}>{inv.rotationNo}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 12px', whiteSpace: 'nowrap', background: '#fff' }}>{inv.invoiceType}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 12px', whiteSpace: 'nowrap', background: '#fff' }}>{inv.createdDate}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 12px', whiteSpace: 'nowrap', background: '#fff' }}>{inv.paymentDueDate}</td>
                        <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '14px 12px', whiteSpace: 'nowrap', background: '#fff' }}><DhAmount value={inv.paymentAmount.toFixed(2)} /></td>
                        <td style={{ padding: '14px 12px', background: '#fff' }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[15px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>{inv.status}</span>
                        </td>
                        <td style={{ padding: '14px 12px', background: '#fff', position: 'sticky', right: 0, borderRadius: '0 8px 8px 0', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: openRowMenu === idx ? 49 : 1 }}>
                          <div className="relative inline-block">
                            <button onClick={() => setOpenRowMenu(openRowMenu === idx ? null : idx)} className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                              <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498"><circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" /></svg>
                            </button>
                            {openRowMenu === idx && (
                              <div className="absolute z-[100] right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ top: 36, width: 180, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                                <button className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors flex items-center gap-[10px]" onClick={() => { setOpenRowMenu(null); setViewInvoice(inv); }}>
                                  <span className="text-[#697498] group-hover:text-white flex-shrink-0 inline-flex">
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" /><circle cx="12" cy="12" r="3" /></svg>
                                  </span>
                                  <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>View</span>
                                </button>
                                <button className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors flex items-center gap-[10px]" onClick={() => { setOpenRowMenu(null); printInvoice(inv); }}>
                                  <span className="text-[#697498] group-hover:text-white flex-shrink-0 inline-flex">
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" /><rect x="6" y="14" width="12" height="7" /></svg>
                                  </span>
                                  <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>Print</span>
                                </button>
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
            {filteredInvoices.length > 0 && (
              <Pagination page={curPage} totalPages={totalPages} pageSize={pageSize} pageSizeOptions={[8, 25, 50]} totalItems={filteredInvoices.length}
                onPageChange={setPage} onPageSizeChange={n => { setPageSize(n); setPage(1); }} />
            )}
          </div>
          </div>
          </div>
        </div>
      </div>

      {/* Invoice detail / print modal */}
      {viewInvoice && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-black/50 p-4" onClick={() => setViewInvoice(null)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[8px] w-full flex flex-col max-h-[90vh]" style={{ maxWidth: 800, fontFamily: font }}>
            <div className="flex items-center justify-between px-[24px] py-[16px] rounded-t-[8px] flex-shrink-0" style={{ background: '#0e1b3d' }}>
              <span className="text-[18px] text-white" style={{ fontFamily: font, fontWeight: 500 }}>{INVOICE_TYPE_TITLES[viewInvoice.invoiceType]}</span>
              <button onClick={() => setViewInvoice(null)} className="size-[28px] flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white flex-shrink-0">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div className="overflow-y-auto px-[24px] py-[20px] flex flex-col gap-[20px]">
              <p className="text-[18px]" style={{ color: '#1360d2', fontWeight: 700 }}>Invoice Details</p>
              <div className="rounded-[6px] p-[16px] grid grid-cols-1 sm:grid-cols-2 gap-y-[10px] gap-x-[24px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
                <KeyValue label="Agent Business Code" value={viewInvoice.agentBusinessCode} />
                <KeyValue label="Rotation Number" value={viewInvoice.rotationNo} />
                <KeyValue label="Agent Business Name" value={viewInvoice.agentBusinessName} />
                <KeyValue label="Invoice Date" value={viewInvoice.invoiceDate} />
                <KeyValue label="Invoice Number" value={viewInvoice.invoiceNo} />
                <KeyValue label="Contact Number" value={viewInvoice.contactNumber} />
                <KeyValue label="Payment Due Date" value={viewInvoice.paymentDueDate} />
              </div>
              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#a6c2e9' }}>
                      {['S.No', 'Description', 'Amount (AED)'].map(h => (
                        <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.lineItems.map((li, i) => (
                      <tr key={li.description} style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{i + 1}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{li.description}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]"><DhAmount value={li.amount.toFixed(2)} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                <div className="flex items-center justify-between px-[16px] py-[10px]" style={{ background: '#f8fafd' }}>
                  <span className="text-[15px]" style={{ fontWeight: 700, color: '#1360d2' }}>Total Amount to be Paid</span>
                  <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 700 }}><DhAmount value={viewInvoice.paymentAmount.toFixed(2)} /></span>
                </div>
                <div className="flex items-center justify-between px-[16px] py-[10px]" style={{ borderTop: '1px solid #eef1f6' }}>
                  <span className="text-[15px]" style={{ fontWeight: 700, color: '#1360d2' }}>Total Amount in Words</span>
                  <span className="text-[15px] text-[#1360d2]" style={{ fontWeight: 500 }}>{amountInWords(viewInvoice.paymentAmount)}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-[12px] px-[24px] py-[16px] flex-shrink-0" style={{ borderTop: '1px solid #eef1f6' }}>
              <button onClick={() => window.print()} className="h-[44px] px-[24px] rounded-[4px] text-[15px] text-white flex items-center gap-[8px]" style={{ background: '#3a4a6b', fontFamily: font, fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2" /><rect x="6" y="14" width="12" height="7" /></svg>
                Print
              </button>
              <button onClick={() => setViewInvoice(null)} className="h-[44px] px-[24px] rounded-[4px] border text-[15px] bg-white hover:bg-[#f0f4ff] flex items-center gap-[8px]" style={{ borderColor: '#8f94ae', color: '#455174', fontFamily: font, fontWeight: 500 }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#455174" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
