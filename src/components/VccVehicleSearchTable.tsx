import React, { useEffect, useMemo, useRef, useState } from 'react';
import MoreIcon from './MoreIcon';
import VccDetailsModal, { type VccDetails } from './VccDetailsModal';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';

type Status = 'Generated' | 'Printed/Downloaded' | 'Cancelled';

const STATUS_STYLE: Record<Status, { bg: string; color: string }> = {
  'Generated':           { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  'Printed/Downloaded':  { bg: 'rgba(19,96,210,0.10)',  color: '#1360d2' },
  'Cancelled':           { bg: 'rgba(74,79,96,0.10)',   color: '#4a4f60' },
};

type VehicleRow = {
  reqNo: string;
  vccNo: string;
  chassis: string;
  reqDate: string;
  declNo: string;
  requestedFor: string;
  vccDate: string;
  status: Status;
};

const VEHICLE_ROWS: VehicleRow[] = [
  { reqNo: '25345', vccNo: '8026932', chassis: 'CHASSIS11',  reqDate: '04-May-26', declNo: '1030001766425', requestedFor: 'AE-1019056 — CONSOLIDATED SHIPPING SERVICES L.L.C', vccDate: '04-May-26', status: 'Generated' },
  { reqNo: '25345', vccNo: '8026931', chassis: 'CHASSIS10',  reqDate: '04-May-26', declNo: '1030001766425', requestedFor: 'AE-1019056 — CONSOLIDATED SHIPPING SERVICES L.L.C', vccDate: '04-May-26', status: 'Printed/Downloaded' },
  { reqNo: '25346', vccNo: '8026940', chassis: 'CHASSIS22',  reqDate: '03-May-26', declNo: '1030001766520', requestedFor: 'AE-9106286 — SW LOGISTICS LLC',                       vccDate: '03-May-26', status: 'Generated' },
  { reqNo: '25346', vccNo: '8026941', chassis: 'CHASSIS23',  reqDate: '03-May-26', declNo: '1030001766520', requestedFor: 'AE-9106286 — SW LOGISTICS LLC',                       vccDate: '03-May-26', status: 'Generated' },
  { reqNo: '25347', vccNo: '8026960', chassis: 'CHASSIS44',  reqDate: '01-May-26', declNo: '1030001768812', requestedFor: 'AE-1019056 — CONSOLIDATED SHIPPING SERVICES L.L.C', vccDate: '01-May-26', status: 'Printed/Downloaded' },
];

function buildDetails(row: VehicleRow): VccDetails {
  return {
    vccNo: row.vccNo,
    printDate: row.vccDate,
    chassis: row.chassis,
    engineNumber: `EN-${row.chassis.replace(/\D/g, '')}`,
    modelYear: '2024',
    vehicleDrive: 'Left Hand Drive',
    countryOfOrigin: 'Japan',
    color: 'White',
    color1: 'White',
    color2: '-',
    color3: '-',
    engineCapacity: '2500',
    carriageCapacity: '500',
    passengerCapacity: '5',
    vehicleModel: 'Land Cruiser',
    vehicleBrand: 'Toyota',
    vehicleType: '2WD',
    vccStatus: row.status,
    declarationNumber: row.declNo,
    declarationDate: row.reqDate,
    ownerCode: row.requestedFor.split('—')[0]?.trim() || '',
    ownerName: row.requestedFor.split('—')[1]?.trim() || '',
    printRemarks: 'GCC Standard',
    specificationStandardName: 'GCC Standard',
    shipmentReferenceNumber: '-',
  };
}

type Props = {
  searchTerm: string;
  searchType: 'VCC Number' | 'Chasis Number';
  onViewRequest?: (reqNo: string) => void;
};

export default function VccVehicleSearchTable({ searchTerm, searchType, onViewRequest }: Props) {
  const { scrollRef, atScrollStart, atScrollEnd, handleScroll, scrollToStart, scrollToEnd } = useTableBehaviors();
  const [openVcc, setOpenVcc] = useState<VehicleRow | null>(null);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuFor(null);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuFor]);

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return [];
    // Prototype: substring-match against the relevant column, but if nothing
    // matches we still return the full sample list so a 4-digit search always
    // demonstrates the table.
    const matches = VEHICLE_ROWS.filter((r) => {
      if (searchType === 'VCC Number') return r.vccNo.toLowerCase().includes(q);
      return r.chassis.toLowerCase().includes(q);
    });
    return matches.length > 0 ? matches : VEHICLE_ROWS;
  }, [searchTerm, searchType]);

  const downloadOne = (row: VehicleRow) => {
    // Stub — would invoke a real download endpoint.
    // eslint-disable-next-line no-console
    console.log('Download VCC certificate', row.vccNo);
  };

  // Sticky columns (Status + Action) sit on the right; remaining columns scroll horizontally.
  const STICKY_STATUS_W = 170;
  const STICKY_ACTION_W = 80;

  return (
    <div className="pb-[20px]" style={{ position: 'relative' }}>
      <ScrollArrows atStart={atScrollStart} atEnd={atScrollEnd} onLeft={scrollToStart} onRight={scrollToEnd} stickyWidth={STICKY_STATUS_W + STICKY_ACTION_W} />
      <div ref={scrollRef} onScroll={handleScroll} className="overflow-x-auto">
      <table
        style={{
          minWidth: 1400,
          borderCollapse: 'separate',
          borderSpacing: '0 8px',
          fontFamily: "'Dubai', sans-serif",
          width: '100%',
        }}
      >
        <thead>
          <tr>
            {['Request No.', 'VCC No.', 'Chassis No.', 'Request Date', 'Declaration No.', 'Requested For', 'VCC Date'].map((h, i, arr) => (
              <th
                key={h}
                className="text-[16px]"
                style={{
                  background: '#a6c2e9',
                  color: '#000',
                  fontWeight: 500,
                  textAlign: 'left',
                  padding: '10px 12px',
                  whiteSpace: 'nowrap',
                  letterSpacing: '0.07px',
                  borderTopLeftRadius: i === 0 ? 8 : 0,
                  borderBottomLeftRadius: i === 0 ? 8 : 0,
                }}
              >{h}</th>
            ))}
            <th
              className="text-[16px]"
              style={{
                position: 'sticky', right: STICKY_ACTION_W, width: STICKY_STATUS_W, minWidth: STICKY_STATUS_W,
                background: '#a6c2e9', color: '#000', fontWeight: 500, textAlign: 'left',
                padding: '10px 12px', whiteSpace: 'nowrap', letterSpacing: '0.07px',
                boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
              }}
            >VCC Status</th>
            <th
              className="text-[16px]"
              style={{
                position: 'sticky', right: 0, width: STICKY_ACTION_W, minWidth: STICKY_ACTION_W,
                background: '#a6c2e9', color: '#000', fontWeight: 500, textAlign: 'center',
                padding: '10px 12px', whiteSpace: 'nowrap', letterSpacing: '0.07px',
                borderTopRightRadius: 8, borderBottomRightRadius: 8, zIndex: 2,
              }}
            >Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={9} style={{ background: '#fff', padding: '40px 12px', textAlign: 'center' }}>
                <span className="text-[16px] text-[#697498]">No vehicles match &ldquo;{searchTerm}&rdquo;.</span>
              </td>
            </tr>
          ) : filtered.map((row) => {
            const st = STATUS_STYLE[row.status];
            const cellStyle: React.CSSProperties = { background: '#fff', padding: '14px 12px', verticalAlign: 'middle', whiteSpace: 'nowrap' };
            return (
              <tr key={row.vccNo}>
                <td className="text-[16px] text-[#0e1b3d]" style={cellStyle}>{row.reqNo}</td>
                <td style={cellStyle}>
                  <button
                    onClick={() => setOpenVcc(row)}
                    className="text-[16px] text-[#1360d2] hover:underline"
                    style={{ fontWeight: 500 }}
                  >
                    {row.vccNo}
                  </button>
                </td>
                <td className="text-[16px] text-[#0e1b3d]" style={cellStyle}>{row.chassis}</td>
                <td className="text-[16px] text-[#0e1b3d]" style={cellStyle}>{row.reqDate}</td>
                <td className="text-[16px] text-[#0e1b3d]" style={cellStyle}>{row.declNo}</td>
                <td className="text-[16px] text-[#0e1b3d]" style={{ ...cellStyle, whiteSpace: 'normal' }}>{row.requestedFor}</td>
                <td className="text-[16px] text-[#0e1b3d]" style={cellStyle}>{row.vccDate}</td>
                <td
                  style={{
                    ...cellStyle,
                    position: 'sticky', right: STICKY_ACTION_W, width: STICKY_STATUS_W, minWidth: STICKY_STATUS_W,
                    boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1,
                  }}
                >
                  <span className="text-[16px] font-medium inline-flex items-center" style={{ background: st.bg, color: st.color, padding: '4px 10px', borderRadius: 4 }}>
                    {row.status}
                  </span>
                </td>
                <td
                  style={{
                    ...cellStyle,
                    position: 'sticky', right: 0, width: STICKY_ACTION_W, minWidth: STICKY_ACTION_W,
                    textAlign: 'center', zIndex: menuFor === row.vccNo ? 50 : 1,
                  }}
                >
                  <div className="relative inline-block" ref={menuFor === row.vccNo ? menuRef : undefined}>
                    <button
                      onClick={() => setMenuFor(menuFor === row.vccNo ? null : row.vccNo)}
                      aria-label={`Actions for VCC ${row.vccNo}`}
                      className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors"
                    >
                      <MoreIcon />
                    </button>
                    {menuFor === row.vccNo && (
                      <div
                        className="absolute z-[100] bg-white rounded-[8px] py-[4px] overflow-hidden"
                        style={{ right: '100%', top: 0, marginRight: 6, width: 200, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}
                      >
                        <button
                          onClick={() => { setMenuFor(null); onViewRequest?.(row.reqNo); }}
                          className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                        >
                          <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" />
                              <circle cx="10" cy="10" r="2.5" />
                            </svg>
                          </span>
                          <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]">View Request</span>
                        </button>
                        <button
                          onClick={() => { setMenuFor(null); downloadOne(row); }}
                          className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
                        >
                          <span className="text-[#1360d2] group-hover:text-white flex-shrink-0 inline-flex items-center justify-center">
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
                            </svg>
                          </span>
                          <span className="text-[16px] text-[#111838] group-hover:text-white leading-[20px]">Download VCC</span>
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

      <VccDetailsModal
        open={openVcc !== null}
        details={openVcc ? buildDetails(openVcc) : undefined}
        onDownload={() => openVcc && downloadOne(openVcc)}
        onClose={() => setOpenVcc(null)}
      />
    </div>
  );
}
