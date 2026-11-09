import React from 'react';
import BackToListingBar from './BackToListingBar';

type Props = { declarationNo: string; onBack: () => void; onServiceCatalogue?: () => void; onHome?: () => void };

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>{children}</p>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-[8px] px-[20px] py-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.12)' }}>
    {children}
  </div>
);

const Field = ({ k, v }: { k: string; v: React.ReactNode }) => (
  <div className="flex flex-col gap-[4px]">
    <span className="text-[12px] text-[#697498]">{k}</span>
    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{v}</span>
  </div>
);

const Th = ({ children }: { children?: React.ReactNode }) => (
  <th className="text-left text-[16px] text-[#455174]" style={{ padding: '10px 12px', fontWeight: 500, whiteSpace: 'nowrap', background: '#a6c2e9' }}>{children}</th>
);
const Td = ({ children }: { children: React.ReactNode }) => (
  <td className="text-[16px] text-[#0e1b3d]" style={{ padding: '12px', whiteSpace: 'nowrap' }}>{children}</td>
);

export default function CustomsDeclarationViewPage({ declarationNo, onBack, onServiceCatalogue, onHome }: Props) {
  return (
    <div className="flex flex-col bg-[#f8fafd] h-full">
      {/* Sticky breadcrumb / agent banner — title + body scroll under it. */}
      <div className="flex items-start justify-between px-4 sm:px-10 pt-[24px] pb-[12px] flex-wrap gap-[12px] flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px]" style={{ fontFamily: "'Dubai', sans-serif" }}>
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline">VCC Listing</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>Customs Declaration</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif" }}>AE-1019056 — Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto" style={{ fontFamily: "'Dubai', sans-serif" }}>
        <h1 className="px-4 sm:px-10 mb-[8px] text-xl sm:text-2xl lg:text-[28px] text-[#111838]" style={{ fontWeight: 500 }}>
          Customs Declaration Number ({declarationNo}) <span className="text-[16px] text-[#697498]">(Version 1)</span>
        </h1>

        <div className="px-4 sm:px-10 pb-[24px] flex flex-col gap-[20px]">
        {/* Customs BIP */}
        <SectionTitle>Customs BIP</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[24px] gap-y-[16px]">
            <Field k="Type" v="Export Statistical" />
            <Field k="Declaration Type" v="New Customs Clearance Request" />
            <Field k="Declaration Number" v={declarationNo} />
            <Field k="Cargo Channel" v="Sea" />
            <Field k="Regime Type" v="Re-Export to ROW" />
            <Field k="Permit" v="Yes" />
            <Field k="Declaration Status" v={<span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[12px]" style={{ background: 'rgba(40,167,69,0.10)', color: '#1b6c3a', fontWeight: 500 }}>Completed</span>} />
            <Field k="Declaration Date" v="05-Dec-24" />
            <Field k="Carrier Registration No." v="PGH658916794" />
            <Field k="Customer Type" v="Importer" />
            <Field k="Customer Code / Name" v="AE-1019056 / Dubai Customs Test LLC" />
            <Field k="Importer Code" v="AE-9106286" />
          </div>
        </Card>

        {/* Goods Package Details */}
        <SectionTitle>Goods Package Details</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-[24px] gap-y-[16px]">
            <Field k="Total Quantity" v="50" />
            <Field k="Total Weight" v="2,500 Kg" />
            <Field k="Volume" v="34 m³" />
            <Field k="Total Packages" v="10" />
          </div>
        </Card>

        {/* Container Details */}
        <SectionTitle>Container Details</SectionTitle>
        <Card>
          <div className="overflow-x-auto rounded-[6px] border border-[#eef1f6]">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead><tr><Th>Container No.</Th><Th>Container Type</Th><Th>Seal No.</Th><Th>Loading Status</Th></tr></thead>
              <tbody>
                {[
                  ['MSCU1234567', '40 HC', 'SL-09877', 'FCL'],
                  ['MSCU1234568', '20 GP', 'SL-09878', 'FCL'],
                  ['MSCU1234569', '40 HC', 'SL-09879', 'LCL'],
                ].map((r) => (
                  <tr key={r[0]} style={{ borderTop: '1px solid #eef1f6' }}>
                    {r.map((c, i) => <Td key={i}>{c}</Td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Invoice Details */}
        <SectionTitle>Invoice Details</SectionTitle>
        <Card>
          <p className="text-[16px] text-[#697498] mb-[12px]">Invoice 1 of 3 · INV-202412001</p>
          <div className="overflow-x-auto rounded-[6px] border border-[#eef1f6]">
            <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 1100 }}>
              <thead>
                <tr>
                  <Th>HS Code</Th>
                  <Th>Goods Description</Th>
                  <Th>Country of Origin</Th>
                  <Th>Weight (Kg)</Th>
                  <Th>Stat. Qty</Th>
                  <Th>Supp. Qty</Th>
                  <Th>Unit Price (Dh)</Th>
                  <Th>Customs Value</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['8703.21.10', 'Passenger vehicles, 1500cc', 'Japan', '1,200', '5', '5', '85,000', '425,000'],
                  ['8708.99.00', 'Auto parts and accessories', 'Germany', '320', '50', '50', '120',    '6,000'],
                  ['8716.40.00', 'Trailer for transport', 'UAE', '900', '2', '2', '38,000', '76,000'],
                ].map((r) => (
                  <tr key={r[0]} style={{ borderTop: '1px solid #eef1f6' }}>
                    {r.map((c, i) => <Td key={i}>{c}</Td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Permit & Purpose Details */}
        <SectionTitle>Permit & Purpose Details</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[24px] gap-y-[16px]">
            <Field k="Permit Number" v="PRM-2024-00891" />
            <Field k="Permit Type" v="Re-Export Permit" />
            <Field k="Issue Date" v="01-Dec-24" />
            <Field k="Expiry Date" v="31-Mar-25" />
            <Field k="Purpose" v="Re-Export to ROW (after import for re-export)" />
            <Field k="Issuing Authority" v="Dubai Customs" />
          </div>
        </Card>

        {/* Trader & Other Details */}
        <SectionTitle>Trader Details</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[24px] gap-y-[16px]">
            <Field k="Trader Code" v="AE-1019056" />
            <Field k="Trader Name" v="Dubai Customs Test LLC" />
            <Field k="Trader Type" v="Business" />
            <Field k="Address" v="Office 12, Jumeirah Lakes Towers, Dubai" />
            <Field k="Phone" v="+971 4 555 8888" />
            <Field k="Email" v="ops@dctestllc.ae" />
          </div>
        </Card>

        <SectionTitle>Other Details</SectionTitle>
        <Card>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-[24px] gap-y-[16px]">
            <Field k="Mode of Transport" v="Sea" />
            <Field k="Loading Port" v="Jebel Ali Port" />
            <Field k="Discharge Port" v="Dammam Port" />
            <Field k="Departure Date" v="15-Jan-25" />
            <Field k="Arrival Date" v="22-Jan-25" />
            <Field k="MAWB / MBOL" v="MAWB-22458790" />
            <Field k="HAWB / HBOL" v="HAWB-09812355" />
            <Field k="DO Number" v="DO-123456" />
          </div>
        </Card>

        {/* Documents Uploaded */}
        <SectionTitle>Documents Uploaded</SectionTitle>
        <Card>
          <div className="overflow-x-auto rounded-[6px] border border-[#eef1f6]">
            <table className="w-full" style={{ borderCollapse: 'collapse' }}>
              <thead><tr><Th>Document Type</Th><Th>File Name</Th><Th>Uploaded On</Th><Th>Size</Th><Th /></tr></thead>
              <tbody>
                {[
                  ['Commercial Invoice',  'Invoice_2024_0091.pdf',  '04-Dec-24', '128 KB'],
                  ['Packing List',        'Packing_List_0091.pdf',  '04-Dec-24', '96 KB'],
                  ['Bill of Lading',      'BoL_2024_0091.pdf',      '05-Dec-24', '184 KB'],
                  ['Certificate of Origin','CoO_2024_0091.pdf',     '05-Dec-24', '74 KB'],
                ].map((r) => (
                  <tr key={r[1]} style={{ borderTop: '1px solid #eef1f6' }}>
                    {r.map((c, i) => <Td key={i}>{c}</Td>)}
                    <td style={{ padding: '12px', whiteSpace: 'nowrap' }}>
                      <button className="text-[#1360d2] hover:underline text-[16px]" style={{ fontWeight: 500 }}>Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        </div>
      </div>

      <BackToListingBar onBack={onBack} />
    </div>
  );
}
