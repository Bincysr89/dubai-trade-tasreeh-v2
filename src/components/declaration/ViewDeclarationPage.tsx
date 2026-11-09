import React from 'react';
import DeclarationInvoiceDetailsPage from './DeclarationInvoiceDetailsPage';
import {
  JourneyTable, JourneyTd, JourneyThead, Readout, SectionTitle, StatusChip,
  TABLE_HEAD_BG, font,
} from './DeclarationUI';

/** A band of read-out pairs, separated by the hairline rules used on the Customs Bill card. */
function Band({ pairs, cols = 5, last }: { pairs: [string, React.ReactNode][]; cols?: number; last?: boolean }) {
  return (
    <div
      className={`grid gap-x-[24px] gap-y-[24px] py-[24px] px-[24px] grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols === 4 ? '4' : '5'}`}
      style={{ borderBottom: last ? undefined : '1px solid #eef1f6' }}
    >
      {pairs.map(([l, v]) => (
        <Readout key={l} label={l} value={typeof v === 'string' ? v : undefined}>
          {typeof v === 'string' ? undefined : v}
        </Readout>
      ))}
    </div>
  );
}

function DocCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-[16px]">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

const PACKAGE_ROWS = Array.from({ length: 7 }, () => ['1000 Packaged Goods', 'Based on BOL no. from Manifest Data']);

const CONTAINER_ROWS = [
  ['1', 'N/A', 'N/A', 'A12345677', '2345678'],
  ['2', 'N/A', 'N/A', 'A12345677', '2345678'],
  ['3', 'N/A', 'N/A', 'A12345677', '2345678'],
  ['4', 'N/A', 'N/A', 'A12345677', '2345678'],
];

const CHARGES = [
  ['E-Archive Service Fee', '50', 'E-Payment', '1233456', '-', '-', '-'],
  ['Registration Fee', '70', 'E-Payment', '1233456', '-', '-', '-'],
  ['Knowledge Innovation Dhiram', '20', 'E-Payment', '1233456', '-', '-', '-'],
];

const VERSIONS = Array.from({ length: 6 }, (_, i) => ({
  version: `Version ${i + 1}`, submitted: '19/06/2024, 19:40', cleared: '19/06/2024, 19:40', current: i === 0,
}));

const UPLOADED = [
  ['Invoice 12124.PDF', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Invoice 898486.xls', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['Invoice 189777.pdf', 'Dubai Customs', 'Invoice', '50 MB', '08-12-2024'],
  ['BOL123.pdf', 'Dubai Customs', 'AWB/BOL', '50 MB', '08-12-2024'],
  ['Cert. of Origin1213.pdf', 'Dubai Municipality', 'Cert. of Origin', '50 MB', '08-12-2024'],
  ['Laboratory 123234.pdf', 'Dubai Municipality', 'Laboratory Results', '50 MB', '08-12-2024'],
];

/** Small chip standing in for the party logo shown against some Customs Bill entries. */
function LogoChip() {
  return (
    <span className="inline-flex items-center px-[6px] py-[1px] rounded-[3px] text-[11px] mr-[6px] align-middle"
      style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 600 }}>Logo</span>
  );
}

type Props = {
  /** Which version is on screen — named in the title. */
  version?: number;
  status?: string;
  onViewVersion?: (version: string) => void;
};

/** View Declaration — Figma 2835:99130. A read-only record of the submitted declaration. */
export default function ViewDeclarationPage({ version = 1, status = 'Submitted', onViewVersion }: Props) {
  return (
    <div className="flex flex-col gap-[24px]" style={{ fontFamily: font }}>
      {/* ── Title, actions and the customer-care notice ── */}
      <div className="flex items-center justify-between gap-[16px] flex-wrap">
        <div className="flex items-center gap-[16px] flex-wrap">
          <h2 className="text-[28px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>
            Customs Declaration ( Version {version} )
          </h2>
          <StatusChip status={status} />
        </div>
        <div className="flex items-center gap-[12px] flex-shrink-0">
          <button data-secondary-btn type="button"
            className="h-[44px] px-[22px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[8px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="15" cy="5" r="2" /><circle cx="5" cy="10" r="2" /><circle cx="15" cy="15" r="2" />
              <path d="M6.8 9L13.2 6M6.8 11l6.4 3" />
            </svg>
            Share
          </button>
          <button data-secondary-btn type="button"
            className="h-[44px] px-[22px] rounded-[4px] border bg-white text-[16px] inline-flex items-center gap-[8px] transition-colors"
            style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
            <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="flex items-center gap-[10px] rounded-[4px] px-[16px] py-[12px]"
        style={{ background: '#eef4ff', border: '1px solid #1360d2' }}>
        <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.6" className="flex-shrink-0">
          <circle cx="10" cy="10" r="8" /><path d="M10 9v5M10 6h.01" strokeLinecap="round" />
        </svg>
        <span className="text-[16px] text-[#1360d2]">
          Please Contact Customer Care If Declaration Number Is Not Displayed Within 30 Minutes Of Declaration Submission
        </span>
      </div>

      {/* ── Customs Bill ── */}
      <Section title="Customs Bill">
        <DocCard>
          <Band pairs={[
            ['Regime Type', 'Import'], ['Trade Type', 'Non E-commerce'],
            ['Transaction Type', 'New Declaration Request'], ['Total No. of Consolidated HAWs', '--'],
          ]} cols={4} />
          <Band pairs={[
            ['Cargo Channel', 'Sea'], ['Declaration Type', '101-Import to local from ROW'],
            ['Declaration Date', '20/Dec/2024'], ['Request No.', '636354321'],
            ['Declaration/Customs Clearance No.', '--'],
          ]} />
          <Band pairs={[
            ['Consignee/Importer/Buyer/Transferee', <span key="c" className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}><LogoChip />UATReport.LLC AE-1049640</span>],
            ['Consignor/Exporter/Seller/Transferor', 'shaheer 36933'],
          ]} cols={4} />
          <Band pairs={[['Cargo Ownership', 'NA'], ['Associated Owner', 'NA']]} cols={4} />
          <Band pairs={[
            ['Importer VAT TRN', '1011234567890'],
            ['Broker', <span key="b" className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}><LogoChip />Consolidated Shipping Services LLC-102923746</span>],
            ['Passenger', 'NA'], ['Agent', 'Maersk Shipping AE-1000087'], ['Notify Party', 'NA'],
          ]} />
          <Band pairs={[
            ['MAWB/MBOL', 'LKUB8233031'], ['HAWB/HBOL', 'NA'], ['Carrier Registration No.', 'NA'],
            ['Carrier Name', 'MAERSK ALABAMA'], ['Schedule Date', '24/Jun/2024'],
          ]} />
          <Band pairs={[
            ['Original Load Port', 'INCOK, Cochin'], ['Port of Load', 'INCOK, Cochin'],
            ['Load Port Country', 'India'], ['Port of Discharge', 'AEJEA, Jebel Ali'],
            ['Port of Discharge Country', 'United Arab Emirates'],
          ]} />
          <Band pairs={[['Destination Country', 'United Arab Emirates'], ['Response Type', '--']]} cols={5} last />
        </DocCard>
      </Section>

      {/* ── Goods/Package Details ── */}
      <Section title="Goods/Package Details">
        <DocCard>
          <Band pairs={[['Goods Location', 'Jebel Ali'], ['Cargo Handler', 'PR-01398 / DPW']]} cols={4} />
          <Band pairs={[
            ['Net Weight', '120KG'], ['Gross Weight', '120kg'],
            ['Measurement', '1'], ['Cargo Type', 'FCL'],
          ]} cols={4} last />
        </DocCard>
      </Section>

      {/* ── Package Details ── */}
      <Section title="Package Details">
        <DocCard>
          <JourneyTable minWidth={760}>
            <JourneyThead columns={[{ label: 'Number of Packages', w: 520 }, { label: 'Marks & Numbers' }]} />
            <tbody>
              {PACKAGE_ROWS.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </DocCard>
      </Section>

      {/* ── Container Details ── */}
      <Section title="Container Details">
        <DocCard>
          <JourneyTable minWidth={860}>
            <JourneyThead columns={[
              { label: 'Serial Number', w: 180, filter: false }, { label: 'Container Type' },
              { label: 'Container Size' }, { label: 'Container Number' }, { label: 'Seal Number' },
            ]} />
            <tbody>
              {CONTAINER_ROWS.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </DocCard>
      </Section>

      {/* ── Invoice Details — the journey's accordion, rendered read-only ── */}
      <DeclarationInvoiceDetailsPage view />

      {/* ── Document Availability ── */}
      <Section title="Document Availability">
        <DocCard>
          <Band pairs={[
            ['Invoice', 'Available in Electronics'], ['AWB/BOL', 'Available in Electronics'],
            ['Packaging list', 'Available in Electronics'], ['Certificate of Origin', 'Not Required'],
            ['Reason for not required', 'Reason'],
          ]} last />
        </DocCard>
      </Section>

      {/* ── Custom Charge Details ── */}
      <Section title="Custom Charge Details">
        <DocCard>
          <div className="overflow-x-auto">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 1000, fontFamily: font }}>
              <thead>
                {/* Two header rows: the charge columns sit under "Total Customs Charge Details",
                    the settlement columns under "Collection Details". */}
                <tr>
                  <th colSpan={2} style={{ background: TABLE_HEAD_BG, padding: '12px 16px', textAlign: 'left' }}>
                    <span className="text-[16px] text-[#051937]" style={{ fontWeight: 600 }}>Total Customs Charge Details</span>
                  </th>
                  <th colSpan={5} style={{ background: TABLE_HEAD_BG, padding: '12px 16px', textAlign: 'left' }}>
                    <span className="text-[16px] text-[#051937]" style={{ fontWeight: 600 }}>Collection Details</span>
                  </th>
                </tr>
                <tr>
                  {['Charge Type', 'Amount', 'Payment Mode', 'Receipt Number', 'Account/Cheque Number', 'Bank/Branch', 'Status'].map((c) => (
                    <th key={c} style={{ background: '#e4edf9', padding: '12px 16px', textAlign: 'left', whiteSpace: 'nowrap' }}>
                      <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{c}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CHARGES.map((r, i) => (
                  <tr key={i}>
                    {r.map((cell, j) => (
                      <td key={j} className="text-[16px] text-[#051937]"
                        style={{ background: '#fff', padding: 16, whiteSpace: 'nowrap', borderBottom: '1px solid #f0f3fa', fontWeight: j === 0 ? 500 : 400 }}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td style={{ background: '#e4edf9', padding: 16 }}>
                    <span className="text-[16px] text-[#051937]" style={{ fontWeight: 600 }}>Total</span>
                  </td>
                  <td colSpan={6} style={{ background: '#e4edf9', padding: 16 }}>
                    <span className="text-[16px] text-[#051937]" style={{ fontWeight: 600 }}>AED: 12890</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DocCard>
      </Section>

      {/* ── Transit Details / Other Remarks ── */}
      <Section title="Transit Details / Other Remarks">
        <DocCard>
          <Band pairs={[
            ['Carrier Name', 'Carrier Name'], ['Outbound MAWB/MBOL', 'Outbound MAWB/MBOL'],
            ['Outbound HAWB/HBOL', 'Outbound HAWB/HBOL'], ['Carrier Registration No.', 'Carrier Number'],
          ]} cols={4} />
          <Band pairs={[
            ['Point of Exit', 'Point of Exit'], ['Outbound Cargo Channel', 'OutBound Cargo Channel'],
            ['Outbound schedule date', '20-Aug-2023'],
          ]} cols={4} />
          <Band pairs={[
            ['Importing Warehouse/FZ Code', 'Importing W/H Code'],
            ['Exporting Warehouse/FZ Code', 'Exporting W/H Code'],
            ['Broker ID', 'AE-1019056'], ['Client Declaration No.', 'SFCL/0243/2024'],
          ]} cols={4} />
          <Band pairs={[['Other Remarks', '-']]} cols={4} last />
        </DocCard>
      </Section>

      {/* ── Declaration Versions ── */}
      <Section title="Declaration Versions">
        <DocCard>
          <JourneyTable minWidth={860}>
            <JourneyThead columns={[
              { label: 'Version' }, { label: 'Submitted Date' }, { label: 'Cleared Date' },
              { label: 'Action', w: 120, filter: false },
            ]} />
            <tbody>
              {VERSIONS.map((v) => (
                <tr key={v.version}>
                  <JourneyTd first>
                    <span className="flex items-center gap-[10px]">
                      <span className="text-[16px] text-[#051937]">{v.version}</span>
                      {v.current && (
                        <span className="text-[14px] px-[10px] py-[3px] rounded-[4px] whitespace-nowrap"
                          style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2', fontWeight: 500 }}>Currently Viewing</span>
                      )}
                    </span>
                  </JourneyTd>
                  <JourneyTd>{v.submitted}</JourneyTd>
                  <JourneyTd>{v.cleared}</JourneyTd>
                  <JourneyTd>
                    {v.current
                      ? <span className="text-[16px] text-[#a7b0c6]" style={{ fontWeight: 500 }}>View</span>
                      : (
                        <button type="button" onClick={() => onViewVersion?.(v.version)}
                          className="text-[16px] text-[#1360d2] underline" style={{ fontWeight: 500 }}>View</button>
                      )}
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </DocCard>
      </Section>

      {/* ── Documents Uploaded ── */}
      <Section title="Documents Uploaded">
        <DocCard>
          <JourneyTable minWidth={960}>
            <JourneyThead columns={[
              { label: 'Document Name' }, { label: 'Authority Name' }, { label: 'Document Type' },
              { label: 'Uploaded size' }, { label: 'Uploaded on' }, { label: 'Action', w: 110, filter: false },
            ]} />
            <tbody>
              {UPLOADED.map((r, i) => (
                <tr key={i}>
                  {r.map((cell, j) => <JourneyTd key={j} first={j === 0}>{cell}</JourneyTd>)}
                  <JourneyTd>
                    <button type="button" aria-label={`Download ${r[0]}`}
                      className="inline-flex items-center justify-center hover:opacity-70 transition-opacity" style={{ color: '#1360d2' }}>
                      <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 3v10M5 9l5 5 5-5M3 17h14" />
                      </svg>
                    </button>
                  </JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </DocCard>
      </Section>
    </div>
  );
}
