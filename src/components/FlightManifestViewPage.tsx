import { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

const font = "'Dubai', sans-serif";

export type FlightManifestViewRow = Record<string, string | boolean | undefined> & { flightNo: string };

/* Same shape as the New Manifest flow's AwbLine — this page mirrors that flow's
   master-detail "List of Airport of Unloading" template, just read-only. */
type Awb = {
  awbNo: string; originCode: string; destCode: string; weight: string; weightUnit: string;
  pieces: string; shipperName: string; consigneeName: string; goodsDescription: string; shipmentDescCode: string;
};
type UnloadingAirportRow = { id: string; airportCode: string; airportName: string; nilCargo: string; lines: Awb[] };

const AIRPORT_NAMES: Record<string, string> = {
  MAA: 'Chennai (ex Madras)', DXB: 'Dubai Cargo Village', AUH: 'Abu Dhabi International Airport',
  LHR: 'London Heathrow Airport', JFK: 'John F. Kennedy International Airport', SIN: 'Singapore Changi Airport',
};

const UNLOADING_ROWS: UnloadingAirportRow[] = [{
  id: 'ua-1', airportCode: 'DXB', airportName: AIRPORT_NAMES.DXB, nilCargo: 'No',
  lines: [
    { awbNo: '12341110914813', originCode: 'MAA', destCode: 'DXB', weight: '100', weightUnit: 'KG', pieces: '160', shipperName: '—', consigneeName: '—', goodsDescription: 'General Cargo', shipmentDescCode: 'Total Consignment' },
    { awbNo: '12341110914814', originCode: 'MAA', destCode: 'DXB', weight: '100', weightUnit: 'KG', pieces: '160', shipperName: '—', consigneeName: '—', goodsDescription: 'General Cargo', shipmentDescCode: 'Total Consignment' },
  ],
}];

const str = (v: string | boolean | undefined) => typeof v === 'string' ? v : '';

const awbWeightKg = (a: Awb) => {
  const w = parseFloat(a.weight) || 0;
  return a.weightUnit === 'LB' ? w * 0.453592 : w;
};

type Props = { row: FlightManifestViewRow; onBack: () => void; onBackToListing: () => void };

export default function FlightManifestViewPage({ row, onBack, onBackToListing }: Props) {
  const flightNo = str(row.flightNo);
  const airportLoading = str(row.airportLoading) || 'DXB';
  const scheduleDate = str(row.scheduleDate) || '—';
  const [selectedUnloadingId, setSelectedUnloadingId] = useState<string | null>(UNLOADING_ROWS[0]?.id ?? null);
  const [awbTablePage, setAwbTablePage] = useState(1);
  const AWB_TABLE_PAGE_SIZE = 5;
  const [viewingAwb, setViewingAwb] = useState<Awb | null>(null);
  const { scrollRef: awbScrollRef, atScrollStart: awbAtScrollStart, atScrollEnd: awbAtScrollEnd, handleScroll: awbHandleScroll, scrollToStart: awbScrollToStart, scrollToEnd: awbScrollToEnd } = useTableBehaviors();

  const selectedUnloadingRow = UNLOADING_ROWS.find(r => r.id === selectedUnloadingId) ?? UNLOADING_ROWS[0] ?? null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Flight Manifest</span>
      </div>
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>View Flight Manifest Courier</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest Details</p>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Flight Number</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{flightNo}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Scheduled Date</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{scheduleDate}</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Airport of Loading / Departure</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{airportLoading} ( {AIRPORT_NAMES[airportLoading] ?? airportLoading} )</span>
            </div>
            <div className="flex flex-col gap-[4px]">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>Flight Manifest Type</span>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Inbound Manifest</span>
            </div>
          </div>
        </div>

        {/* List of Airport of Unloading — same master-detail (sidebar + detail-pane) template as the
            New Manifest flow's "List of Airport of Unloading" step, just read-only. */}
        <div className="flex flex-col gap-[16px]">
          <div className="flex flex-col gap-[4px]">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List of Airport of Unloading</p>
            <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>
              {UNLOADING_ROWS.length} airport{UNLOADING_ROWS.length !== 1 ? 's' : ''} · {UNLOADING_ROWS.reduce((s, r) => s + r.lines.length, 0)} AWBs total
            </span>
          </div>

          <div className="bg-white rounded-[8px] overflow-hidden flex flex-col md:flex-row" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)', minHeight: 420 }}>
            {/* Sidebar — airports */}
            <div className="flex flex-col flex-shrink-0 md:w-[260px]" style={{ borderBottom: '1px solid #f3f4f6' }}>
              <div className="flex-1 overflow-y-auto" style={{ maxHeight: 480 }}>
                {UNLOADING_ROWS.map(r => {
                  const isSelected = selectedUnloadingRow?.id === r.id;
                  return (
                    <div key={r.id} onClick={() => { setSelectedUnloadingId(r.id); setAwbTablePage(1); }}
                      className="flex items-center gap-[10px] px-[14px] py-[12px] cursor-pointer transition-colors"
                      style={{ background: isSelected ? '#f0f4ff' : 'transparent', borderLeft: `3px solid ${isSelected ? '#1360d2' : 'transparent'}`, borderBottom: '1px solid #f8fafd' }}>
                      <div className="size-[36px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#1360d2' }}>
                        <span className="text-[12px] text-white" style={{ fontWeight: 700, fontFamily: font }}>{r.airportCode.slice(0, 3) || '—'}</span>
                      </div>
                      <div className="flex flex-col gap-[3px] min-w-0 flex-1">
                        <span className="text-[14px] text-[#051937] truncate" style={{ fontWeight: 500, fontFamily: font }}>{r.airportName || r.airportCode}</span>
                        <div className="flex items-center gap-[6px]">
                          <span className="size-[14px] rounded-[3px] inline-flex items-center justify-center flex-shrink-0"
                            style={{ border: `2px solid ${r.nilCargo === 'Yes' ? '#1360d2' : '#a7abb2'}`, background: r.nilCargo === 'Yes' ? '#1360d2' : '#fff' }}>
                            {r.nilCargo === 'Yes' && (
                              <svg viewBox="0 0 14 14" width="9" height="9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7l3 3 5-6" /></svg>
                            )}
                          </span>
                          <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>Nil Cargo</span>
                        </div>
                        <span className="text-[14px]" style={{ color: '#219653', fontFamily: font }}>{r.lines.length} AWB{r.lines.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail pane — selected airport's AWBs */}
            <div className="flex-1 flex flex-col min-w-0" style={{ borderLeft: '1px solid #f3f4f6' }}>
              {selectedUnloadingRow && (
                <>
                  <div className="flex items-center justify-between flex-wrap gap-[8px] px-[20px] py-[14px]" style={{ background: '#f8fafd', borderBottom: '1px solid #eef1f6' }}>
                    <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>List of Airway Bill of Unloading</p>
                  </div>

                  <div className="flex-1 overflow-auto">
                    {selectedUnloadingRow.lines.length === 0 ? (
                      <p className="text-[15px] text-[#697498] text-center" style={{ padding: '32px 16px', fontFamily: font }}>No airway bills added yet.</p>
                    ) : (
                      <div style={{ position: 'relative' }}>
                        <ScrollArrows atStart={awbAtScrollStart} atEnd={awbAtScrollEnd} onLeft={awbScrollToStart} onRight={awbScrollToEnd} stickyWidth={70} />
                        <div ref={awbScrollRef} onScroll={awbHandleScroll} className="overflow-x-auto">
                        <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 1180 }}>
                          <thead>
                            <tr style={{ background: '#e2ebf9' }}>
                              {['Sl. No.', 'AWB Number', 'Origin', 'Destination', 'Shipper', 'Consignee', 'Goods Description', 'Shipment Description Code', 'Pieces', 'Gross Wt (KG)', 'Actions'].map(h => (
                                <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]"
                                  style={h === 'Actions'
                                    ? { fontWeight: 500, whiteSpace: 'nowrap', background: '#e2ebf9', position: 'sticky', right: 0, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }
                                    : { fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {selectedUnloadingRow.lines.slice((awbTablePage - 1) * AWB_TABLE_PAGE_SIZE, awbTablePage * AWB_TABLE_PAGE_SIZE).map((a, idx) => (
                              <tr key={a.awbNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{(awbTablePage - 1) * AWB_TABLE_PAGE_SIZE + idx + 1}</td>
                                <td className="px-[16px] py-[10px] text-[14px]" style={{ color: '#1360d2', fontWeight: 500 }}>{a.awbNo}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.originCode || '—'}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.destCode || '—'}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.shipperName || '—'}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.consigneeName || '—'}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.goodsDescription || '—'}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.shipmentDescCode || '—'}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{a.pieces}</td>
                                <td className="px-[16px] py-[10px] text-[14px] text-[#0e1b3d]">{awbWeightKg(a).toFixed(1)}</td>
                                <td className="px-[16px] py-[10px]" style={{ position: 'sticky', right: 0, background: '#fff', boxShadow: '-3px 0 6px rgba(0,0,0,0.06)' }}>
                                  <button type="button" onClick={() => setViewingAwb(a)} aria-label={`View ${a.awbNo}`}
                                    className="size-[26px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors" style={{ color: '#455174' }}>
                                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {viewingAwb && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(14,27,61,0.45)', padding: 24 }}>
          <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[16px]" style={{ width: '100%', maxWidth: 960, boxShadow: '0px 20px 60px rgba(14,27,61,0.18)', fontFamily: font }}>
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>View Airway Bill</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
              {[
                ['Airway Bill No.', viewingAwb.awbNo], ['Goods Description', viewingAwb.goodsDescription],
                ['Weight', `${viewingAwb.weight} ${viewingAwb.weightUnit}`], ['Shipment Description Code', viewingAwb.shipmentDescCode],
                ['Shipper Name', viewingAwb.shipperName], ['Number of Pieces', viewingAwb.pieces],
                ['Consignee Name', viewingAwb.consigneeName],
                ['Airport/City of Origin', `${viewingAwb.originCode} — ${AIRPORT_NAMES[viewingAwb.originCode] ?? ''}`],
                ['Airport/City of Destination', `${viewingAwb.destCode} — ${AIRPORT_NAMES[viewingAwb.destCode] ?? ''}`],
              ].map(([label, value]) => (
                <div key={label} className="flex flex-col gap-[4px]">
                  <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={() => setViewingAwb(null)}
                data-secondary-btn className="h-[44px] px-[20px] rounded-[4px] border text-[16px] bg-white" style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500, fontFamily: font }}>Close</button>
            </div>
          </div>
        </div>
      )}

      <BackToListingBar onBackToListing={onBackToListing} />
    </div>
  );
}
