import React, { useState } from 'react';
import MoreIcon from '../MoreIcon';
import Pagination from '../Pagination';
import { Field, JourneyTable, JourneyTd, JourneyThead, SectionCard, SectionTitle, StatusChip, TabBar, font } from './DeclarationUI';

const VEHICLE_TABS = ['Upload Text File', 'Add Manually'] as const;
type VehicleTab = (typeof VEHICLE_TABS)[number];

/* Vehicle list — Figma 2650:72470. Rows appear once vehicles are added or a file is uploaded. */
const VEHICLE_COLUMNS = [
  'Vehicle Type', 'Value Brand', 'Model', 'Condition', 'Chassis Number',
  'Specification std.', 'Color', 'Color1', 'Color2', 'Color3', 'Drive',
];
const UPLOADED_VEHICLES: string[][] = [
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'White', 'White', 'White', 'Right Hand Drive'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Black', 'Black', 'Black', 'Right Hand Drive'],
  ['4WD', 'Honda', 'Civix', 'New', 'JX12344545', 'GCC Standard', 'White', 'White', 'White', 'White', 'Right Hand Drive'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'White', 'White', 'White', 'Right Hand Drive'],
  ['4WD', 'Toyota', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Black', 'Black', 'Black', 'Right Hand Drive'],
  ['2WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'Black', 'Black', 'Black', 'Black', 'Right Hand Drive'],
  ['4WD', 'Honda', 'Land Cruiser', 'New', 'JX12344545', 'GCC Standard', 'White', 'White', 'White', 'White', 'Right Hand Drive'],
  ['4WD', 'Honda', 'Civic', 'New', 'JX12344545', 'GCC Standard', 'White', 'White', 'White', 'White', 'Right Hand Drive'],
];
/* The manual form is a mock-up, so Save appends the row it is showing. */
const MANUAL_VEHICLE = ['2WD', 'Honda', 'D12243545', 'New', 'A2344657878', 'GCC Standard', 'White', 'White', 'White', 'White', 'Right Hand Drive'];

const PERMITS = [
  { authority: 'Dubai Municipality', ref: 'P12345678', notRequired: true, granted: 'Yes' },
  { authority: 'TDRA', ref: 'P12345678', notRequired: false, granted: 'No' },
];

type Props = {
  onHsCodeSearch?: () => void;
  onVehicleLookup?: (kind: 'brand' | 'model' | 'manufacturer') => void;
  /** Values picked from the HS Code search page. */
  hsCode?: string;
  goodsDescription?: string;
};

/** Add Line Item — Figma 2650:70571. */
export default function AddLineItemPage({
  onHsCodeSearch, onVehicleLookup, hsCode = '07089090',
  goodsDescription = 'Core sand shooting cone',
}: Props) {
  const [vehicleTab, setVehicleTab] = useState<VehicleTab>('Add Manually');
  const [vehicles, setVehicles] = useState<string[][]>([]);
  const [vehiclePage, setVehiclePage] = useState(1);
  const [vehiclePageSize, setVehiclePageSize] = useState(8);
  const [vehicleMenu, setVehicleMenu] = useState<number | null>(null);
  const addVehicle = () => setVehicles((v) => [...v, MANUAL_VEHICLE]);

  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>

      {/* Invoice summary strip */}
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
            <div key={l} className="flex flex-col gap-[6px]">
              <span className="text-[14px] text-[#697498]">{l}</span>
              <span className="text-[15px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ── Enter Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Enter Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-x-[20px] gap-y-[32px]">
            <Field value={hsCode} label="HS Code" labelRequired trailing="search"
              trailingLabel="Search HS Code" onTrailingClick={onHsCodeSearch} />
            <Field value={goodsDescription} label="Goods Description" labelRequired />
          </div>
          <div className="mt-[10px] px-[16px] py-[10px] rounded-[4px]" style={{ background: '#e8ecff' }}>
            <span className="text-[14px] text-[#0e1b3d]">
              Leguminous vegetables, shelled or unshelled, fresh or chilled, excluding peas &amp; beans
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px] mt-[32px]">
            <Field value="New" label="Condition" labelRequired trailing="chevron" />
            <Field value="New Zealand" label="Country of Origin" labelRequired trailing="chevron" />
            <Field value="200" label="Statistical Quantity" labelRequired unit="UNIT" />
            <Field value="2000.90" label="Value of Goods" labelRequired />
            <Field value="10000" label="Weight" labelRequired unit="KG" />
            <Field value="200" label="Supplementary Quantity" unit="UNIT" />
          </div>
        </SectionCard>
      </div>

      {/* ── IHC Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>IHC Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-[20px] gap-y-[32px]">
            <Field value="Quantity" label="Item quantity" labelRequired unit="UNIT" />
            <Field value="Volume" label="Item volume" labelRequired unit="UNIT" />
            <Field value="Quantity" label="Classification of goods" labelRequired trailing="chevron" />
          </div>
        </SectionCard>
      </div>

      {/* ── Exemption/Reference Declaration ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Exemption/Reference Declaration</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-[20px] gap-y-[32px]">
            <Field value="Aircraft" label="Exemption Type" labelRequired trailing="chevron" />
            <Field value="R12344667798989" label="Exemption reference No." labelRequired />
            <Field value="D12243545" label="Previous Declaration No." labelRequired />
          </div>
        </SectionCard>
      </div>

      {/* ── Anti Dumping Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Anti Dumping Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px] items-start">
            <Field value="OVZ12123 - " label="Manufacturer/Exporter" trailing="search"
              trailingLabel="Search Manufacturer/Exporter"
              onTrailingClick={() => onVehicleLookup?.('manufacturer')}
              chips={['Amana Raja Batteries Ltd']} />
            <Field value="Not Applicable" label="Anti Dumping Applicability" trailing="chevron" />
            <Field value="Reference No" label="Anti Dumping Exemption Reference No." labelRequired />
            <Field value="Reason for not- Applicable" label="" />
          </div>
        </SectionCard>
      </div>

      {/* ── Vehicle Details ── */}
      <div className="flex flex-col gap-[16px]">
        <SectionTitle>Vehicle Details</SectionTitle>
        <SectionCard>
          <div className="mb-[28px] flex items-center justify-between gap-[16px] flex-wrap">
            <TabBar tabs={VEHICLE_TABS} active={vehicleTab} onChange={setVehicleTab} />
            {vehicles.length > 0 && (
              <button type="button" className="flex items-center gap-[6px] text-[16px] text-[#1360d2] hover:opacity-80 transition-opacity">
                <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
                </svg>
                Download Vehicle List
              </button>
            )}
          </div>

          {vehicleTab === 'Add Manually' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
                <Field value="Honda" label="Vehicle Brand" labelRequired trailing="search"
                  trailingLabel="Search Vehicle Brand" onTrailingClick={() => onVehicleLookup?.('brand')} />
                <Field value="D12243545" label="Model" labelRequired trailing="search"
                  trailingLabel="Search Vehicle Model" onTrailingClick={() => onVehicleLookup?.('model')} />
                <Field value="2WD" label="Type" labelRequired trailing="chevron" />
                <Field value="Right Hand Drive" label="Drive" labelRequired trailing="chevron" />

                <Field value="White" label="Color 1" labelRequired trailing="chevron" />
                <Field value="White" label="Color 2" trailing="chevron" />
                <Field value="White" label="Color 3" trailing="chevron" />
                <Field value="White" label="Vehicle Color" labelRequired disabled />

                <Field value="GCC Standard" label="Specification std" labelRequired trailing="chevron" />
                <Field value="New" label="Condition" labelRequired trailing="chevron" />
                <Field value="A2344657878" label="Chassis No" labelRequired />
                <Field value="C2344657878" label="Engine No." />

                <Field value="Year" label="Year Build" labelRequired trailing="chevron" />
                <Field value="4 ltr" label="Engine Capacity" />
                <Field value="5" label="Passenger Capacity" />
                <Field value="5" label="Carriage Capacity" />
              </div>

              <div className="flex flex-wrap items-center gap-[16px] mt-[32px]">
                <button type="button" onClick={addVehicle}
                  className="h-[46px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#1360d2', fontWeight: 500 }}>Save</button>
                <button data-secondary-btn type="button" onClick={addVehicle}
                  className="h-[46px] px-[24px] rounded-[4px] border bg-white text-[16px] transition-colors"
                  style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Add Another Vehicle Item</button>
                <button data-secondary-btn type="button"
                  className="h-[46px] px-[28px] rounded-[4px] border bg-white text-[16px] transition-colors"
                  style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Cancel</button>
              </div>
            </>
          ) : (
            // Compact drop zone, the same size as the create flow's uploader.
            <div className="flex flex-col items-center justify-center gap-[14px] rounded-[6px] py-[36px] px-[16px] max-w-[420px]"
              style={{ border: '1.5px dashed #b5c8e8', background: '#fbfcfe' }}>
              <div className="size-[54px] rounded-full inline-flex items-center justify-center" style={{ background: '#eef1f6' }}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#6d707e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                  <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                </svg>
              </div>
              <p className="text-[16px] text-[#6d707e]">Drag and drop or</p>
              <button data-secondary-btn type="button" onClick={() => setVehicles(UPLOADED_VEHICLES)}
                className="h-[42px] px-[22px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Upload File</button>
            </div>
          )}

          {/* Vehicles added so far — Figma 2650:72470 */}
          {vehicles.length > 0 && (
            <div className="mt-[28px] flex flex-col gap-[12px]">
              <JourneyTable minWidth={1500}>
                <JourneyThead columns={[
                  ...VEHICLE_COLUMNS.map((label) => ({ label })),
                  { label: 'Action', w: 80, filter: false, sticky: true },
                ]} />
                <tbody>
                  {vehicles.map((v, i) => (
                    <tr key={i}>
                      {v.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
                      <JourneyTd sticky width={80}>
                        <span className="relative inline-flex">
                          <button type="button" aria-label={`Vehicle ${i + 1} actions`}
                            onClick={() => setVehicleMenu(vehicleMenu === i ? null : i)}
                            className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]">
                            <MoreIcon />
                          </button>
                          {vehicleMenu === i && (
                            <span className="absolute z-[40] bg-white rounded-[8px] py-[4px] overflow-hidden"
                              style={{ right: '100%', top: 0, marginRight: 6, width: 150, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                              <button type="button" onClick={() => setVehicleMenu(null)}
                                className="block w-full text-left px-[14px] py-[10px] text-[16px] text-[#111838] hover:bg-[#e2ebf9] transition-colors">Amend</button>
                              <button type="button"
                                onClick={() => { setVehicles((prev) => prev.filter((_, k) => k !== i)); setVehicleMenu(null); }}
                                className="block w-full text-left px-[14px] py-[10px] text-[16px] text-[#111838] hover:bg-[#e2ebf9] transition-colors">Delete</button>
                            </span>
                          )}
                        </span>
                      </JourneyTd>
                    </tr>
                  ))}
                </tbody>
              </JourneyTable>
              <Pagination
                page={vehiclePage} totalPages={Math.max(1, Math.ceil(vehicles.length / vehiclePageSize))}
                pageSize={vehiclePageSize} pageSizeOptions={[8, 16, 32]} totalItems={vehicles.length}
                onPageChange={setVehiclePage}
                onPageSizeChange={(s) => { setVehiclePageSize(s); setVehiclePage(1); }}
              />
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Permit Details ── */}
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
                    <th key={c} className="text-left text-[16px]" style={{ padding: '12px 20px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMITS.map((p) => (
                  <tr key={p.authority} style={{ borderBottom: '1px solid #f0f3fa' }}>
                    <td className="text-[16px] text-[#051937]" style={{ padding: '16px 20px' }}>{p.authority}</td>
                    <td style={{ padding: '12px 20px' }}>
                      <input
                        defaultValue={p.ref}
                        readOnly={p.notRequired}
                        className="h-[44px] w-[220px] rounded-[4px] border border-[#d5ddfb] px-[14px] text-[15px] text-[#0e1b3d] focus:outline-none"
                        style={{ fontFamily: font, background: p.notRequired ? '#f4f4f4' : '#fff' }}
                      />
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <input type="checkbox" defaultChecked={p.notRequired} disabled={p.notRequired}
                        className="size-[18px] rounded-[2px]" style={{ accentColor: '#1360d2' }} />
                    </td>
                    <td style={{ padding: '16px 20px' }}><StatusChip status={p.granted} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
