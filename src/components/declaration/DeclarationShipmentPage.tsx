import React, { useState } from 'react';
import Pagination from '../Pagination';
import {
  Field, JourneyStepper, JourneyTable, JourneyTd, JourneyThead, PartyInformation,
  SectionCard, SectionTitle, TabBar, editSrc, font,
} from './DeclarationUI';

export const SHIPMENT_TABS = ['General Shipping Details', 'Package Details', 'Container Details'] as const;
export type ShipmentTab = (typeof SHIPMENT_TABS)[number];

type Props = {
  /** The amend journey runs a longer stepper, so the labels and active index are overridable. */
  steps?: string[];
  stepIndex?: number;
  tab: ShipmentTab;
  onTabChange: (t: ShipmentTab) => void;
  /** Container row edit — opens the shipping-details popup. */
  onEditContainer?: (containerNo: string) => void;
};

/**
 * Shipment Details step — Figma 2650:46169 (General Shipping Details),
 * 2650:47573 (Package Details) and 2650:48087 (Container Details).
 */
export default function DeclarationShipmentPage({ tab, onTabChange, onEditContainer, steps, stepIndex }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      <JourneyStepper active={stepIndex ?? 1} steps={steps} />
      <TabBar tabs={SHIPMENT_TABS} active={tab} onChange={onTabChange} />

      {tab === 'General Shipping Details' && <GeneralShippingDetails />}
      {tab === 'Package Details' && <PackageDetails />}
      {tab === 'Container Details' && <ContainerDetails onEdit={onEditContainer} />}

      <PartyInformation />
    </div>
  );
}

function GeneralShippingDetails() {
  return (
    <>
      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Inbound - Shipping Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Carrier Registration No." valueRequired disabled trailing="edit"
              label="Carrier Registration Number" labelRequired />
            <Field value="20/12/2024" label="Scheduled Date" labelRequired disabled trailing="today" />
            <Field value="B87654" label="MAWB/BOL" labelRequired disabled trailing="edit" />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Port Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Original Load Port" valueRequired trailing="search" trailingLabel="Search Original Load Port" />
            <Field value="Port of Load" valueRequired trailing="search" trailingLabel="Search Port of Load" />
            <Field value="Port of Discharge" valueRequired trailing="search" trailingLabel="Search Port of Discharge" />
            <Field value="Custom's Exit Point" valueRequired trailing="chevron" />
            <Field value="Destination Country" valueRequired />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[20px]">
        <SectionTitle>Cargo Weight/Volume/Type</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="10000" label="Net Weight" labelRequired disabled unit="KG" />
            <Field value="10000" label="Gross Weight" labelRequired disabled unit="KG" />
            <Field value="LCL" label="Cargo Type" labelRequired disabled />
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col gap-[20px]">
        <SectionTitle>IHC Response Type Details</SectionTitle>
        <SectionCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <Field value="Response Type" valueRequired trailing="chevron" />
          </div>
        </SectionCard>
      </div>
    </>
  );
}

/* ── Package Details — Figma 2650:47573 ── */
function PackageDetails() {
  const [page, setPage] = useState(4);
  const [pageSize, setPageSize] = useState(8);
  const rows = Array.from({ length: 7 }, () => ['1000 Packaged Goods', 'Based on BOL no. from Manifest Data']);

  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle>Package Details</SectionTitle>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <JourneyTable minWidth={700}>
          <JourneyThead columns={[{ label: 'Number of Packages' }, { label: 'Shipping Marks' }]} />
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
              </tr>
            ))}
          </tbody>
        </JourneyTable>
        <div className="px-[20px] py-[16px]">
          <Pagination
            page={page}
            totalPages={7}
            pageSize={pageSize}
            pageSizeOptions={[8, 16, 32]}
            totalItems={56}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}

/* ── Container Details — Figma 2650:48087 ── */
const CONTAINER_ROWS = [
  { no: 'LILI1303120', seal: 'NA', size: '--', type: '--' },
  { no: 'LILI1303130', seal: 'NA', size: '20', type: 'Reefer' },
  { no: 'LILI1303140', seal: 'NA', size: '--', type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '40', type: 'Reefer' },
  { no: 'LILI1303120', seal: 'NA', size: '40', type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '20', type: '--' },
  { no: 'LILI1303120', seal: 'NA', size: '--', type: 'Reefer' },
];

function ContainerDetails({ onEdit }: { onEdit?: (containerNo: string) => void }) {
  return (
    <div className="flex flex-col gap-[20px]">
      <SectionTitle>Container Details</SectionTitle>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <JourneyTable minWidth={800}>
          <JourneyThead columns={[
            { label: 'Container No' }, { label: 'Seal No' },
            { label: 'Container Size' }, { label: 'Container Type' },
            { label: 'Action', w: 90, filter: false, sticky: true },
          ]} />
          <tbody>
            {CONTAINER_ROWS.map((r, i) => (
              <tr key={i}>
                <JourneyTd first>{r.no}</JourneyTd>
                <JourneyTd>{r.seal}</JourneyTd>
                <JourneyTd>{r.size}</JourneyTd>
                <JourneyTd>{r.type}</JourneyTd>
                <JourneyTd sticky width={90}>
                  <button
                    type="button"
                    onClick={() => onEdit?.(r.no)}
                    aria-label={`Edit container ${r.no}`}
                    className="inline-flex items-center justify-center hover:opacity-70 transition-opacity"
                  >
                    <img src={editSrc} alt="" width={20} height={20} />
                  </button>
                </JourneyTd>
              </tr>
            ))}
          </tbody>
        </JourneyTable>
      </div>
    </div>
  );
}
