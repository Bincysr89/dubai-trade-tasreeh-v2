import React, { useState } from 'react';
import Pagination from '../Pagination';
import DeclarationModal from './DeclarationModal';
import { Readout, SectionCard, SectionTitle, StatusChip, font } from './DeclarationUI';

const filterSrc = new URL('../../assets/declaration/filter-list.svg', import.meta.url).href;

const VEHICLE_COLUMNS = [
  'Vehicle Type', 'Value Brand', 'Model', 'Condition', 'Chassis Number', 'Specification std.',
  'Color', 'Drive', 'Year Build', 'Engine Capacity', 'Engine No.',
];
const VEHICLE_ROWS = [
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '4 Ltr', 'C15785678'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2023', '4 Ltr', 'C15785678'],
  ['4WD', 'Honda', 'Civix', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '4 Ltr', 'C15785678'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2024', '6 ltr', 'C15785678'],
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2024', '6 ltr', 'C15785678'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Right Hand Drive', '2023', '6 ltr', 'C15785678'],
  ['4WD', 'Honda', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2023', '6 ltr', 'C15785678'],
  ['4WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'Right Hand Drive', '2023', '6 ltr', 'C15785678'],
];

/** Vehicle Details read-back — Figma 2650:51577. */
export function VehicleDetailsModal({ row, onClose }: { row: string[]; onClose: () => void }) {
  const pairs: [string, string][] = [
    ['Type', row[0]], ['Vehicle Brand', row[1]], ['Model', row[2]], ['Condition', row[3]],
    ['Specification std', row[5]], ['Color', row[6]], ['Drive', row[7]], ['Chassis No.', row[4]],
    ['Engine No.', row[10]], ['Engine Capacity', row[9]], ['Year Build', row[8]], ['Passenger Capacity', '5'],
    ['Carriage Capacity', '5'],
  ];
  return (
    <DeclarationModal title="Vehicle Details" onClose={onClose} maxWidth={800}>
      <div className="rounded-[6px] px-[20px] py-[24px]" style={{ background: '#f8fafd' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[24px] gap-y-[28px]">
          {pairs.map(([l, v]) => <Readout key={l} label={l} value={v} />)}
        </div>
      </div>
      <div className="flex justify-end mt-[28px]">
        <button type="button" onClick={onClose}
          className="h-[46px] px-[44px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Close</button>
      </div>
    </DeclarationModal>
  );
}

/** Line Item Details — Figma 2650:49982, the read-only view behind "View Details". */
export default function LineItemDetailsPage() {
  const [vehicle, setVehicle] = useState<string[] | null>(null);
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(8);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>

      <SectionCard className="!py-[20px]">
        <div className="flex items-center gap-[10px] mb-[16px]">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.7">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18M7 13h4M7 16h8" />
          </svg>
          <span className="text-[17px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Invoice Details</span>
        </div>
        <div className="flex flex-wrap gap-x-[56px] gap-y-[16px]">
          {[['Invoice Number', 'TD 2403'], ['Invoice Date', '09/11/2024'], ['Terms of Delivery', 'Cost & Fright'],
            ['No. of Line Items', '1 Line Item'], ['Invoice Value', 'USD 6400.00']].map(([l, v]) => (
            <Readout key={l} label={l} value={v} />
          ))}
        </div>
      </SectionCard>

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Enter Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-[24px] gap-y-[28px]">
            <Readout label="HS Code" value="07089090" />
            <div className="sm:col-span-1 lg:col-span-4"><Readout label="Goods Description" value="Core sand shooting cone" /></div>
          </div>
          <div className="mt-[16px] px-[16px] py-[10px] rounded-[4px]" style={{ background: '#e8ecff' }}>
            <span className="text-[14px] text-[#0e1b3d]">
              Leguminous vegetables, shelled or unshelled, fresh or chilled, excluding peas &amp; beans
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-[24px] gap-y-[28px] mt-[28px]">
            <Readout label="Condition" value="New" />
            <Readout label="Country of Origin" value="New Zealand" />
            <Readout label="Value of Goods" value="2000.90" />
            <Readout label="Weight" value="200" />
            <Readout label="Weight Units" value="kg" />
            <Readout label="Supplementary Quantity" value="200" />
            <Readout label="Supplementary Quantity Units" value="Supplementary Quantity Units" />
            <Readout label="Statistical Quantity" value="200" />
            <Readout label="Statistical Quantity Unit" value="Statistical Quantity Unit" />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>IHC Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-[24px] gap-y-[28px]">
            <Readout label="Item Quantity" value="Quantity" />
            <Readout label="Item Quantity Units" value="Quantity" />
            <Readout label="Item Volume" value="Volume" />
            <Readout label="Item Volume Units" value="Volume" />
            <Readout label="Classification of Goods" value="Quantity" />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Exemption/Reference Declaration</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-[24px] gap-y-[28px]">
            <Readout label="Exemption Type" value="Aircraft" />
            <Readout label="Exemption reference No." value="R12344667798989" />
            <Readout label="Previous Declaration No." value="D12243545" />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Anti Dumping Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-x-[24px] gap-y-[28px]">
            <Readout label="Manufacturer/Exporter" value="Exporter Name" />
            <Readout label="Anti Dumping Applicability" value="Not Applicable" />
            <Readout label="Reason for Not Applicable" value="Not Applicable" />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[16px]">
        <div className="flex items-center justify-between gap-[16px] flex-wrap">
          <SectionTitle>Vehicle Details</SectionTitle>
          <button type="button" className="inline-flex items-center gap-[8px] text-[15px] text-[#1360d2] hover:opacity-80 transition-opacity" style={{ fontWeight: 500 }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
            </svg>
            Download Vehicle List
          </button>
        </div>
        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1400 }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {VEHICLE_COLUMNS.map((c) => (
                    <th key={c} style={{ padding: 12, textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <span className="inline-flex items-center gap-[4px]">
                        <span className="text-[16px]" style={{ color: '#051937', fontWeight: 500, letterSpacing: '0.07px' }}>{c}</span>
                        <img src={filterSrc} alt="" width={16} height={16} />
                      </span>
                    </th>
                  ))}
                  <th style={{ padding: 12, textAlign: 'left', width: 80 }}>
                    <span className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>Action</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {VEHICLE_ROWS.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    {r.map((cell, j) => (
                      <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 12px', whiteSpace: 'nowrap' }}>{cell}</td>
                    ))}
                    <td style={{ padding: 12 }}>
                      <button type="button" onClick={() => setVehicle(r)}
                        className="text-[16px] text-[#1360d2] hover:underline" style={{ fontWeight: 500 }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-[20px] py-[16px]">
            <Pagination page={page} totalPages={7} pageSize={pageSize} pageSizeOptions={[8, 16, 32]}
              totalItems={56} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        <SectionTitle>Permit Details</SectionTitle>
        <p className="text-[15px] text-[#455174] mb-[6px]">
          As per your HS code we have found below required permits required for Declaration.
        </p>
        <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 760 }}>
              <thead>
                <tr style={{ background: '#a6c2e9' }}>
                  {['Permit Authority', 'Permit Reference No.', 'Permit Not Required', 'Permit Granted'].map((c) => (
                    <th key={c} style={{ padding: '14px 20px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <span className="inline-flex items-center gap-[4px]">
                        <span className="text-[16px]" style={{ color: '#051937', fontWeight: 500 }}>{c}</span>
                        <img src={filterSrc} alt="" width={16} height={16} />
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[['Dubai Municipality', 'P12345678', 'Yes'], ['TDRA', 'P12345678', 'No']].map((r) => (
                  <tr key={r[0]} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px' }}>{r[0]}</td>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px' }}>{r[1]}</td>
                    <td style={{ padding: '16px 20px' }}>
                      <input type="checkbox" readOnly className="size-[18px]" style={{ accentColor: '#1360d2' }} />
                    </td>
                    <td style={{ padding: '16px 20px' }}><StatusChip status={r[2]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {vehicle && <VehicleDetailsModal row={vehicle} onClose={() => setVehicle(null)} />}
    </div>
  );
}
