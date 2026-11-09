import type { ClaimRow } from './ClaimsTable';

const font = "'Dubai', 'Segoe UI', sans-serif";

type Props = {
  row: ClaimRow;
  onBack: () => void;
};

const Field = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col gap-[4px]">
    <span className="text-[16px] text-[#697498]">{label}</span>
    <span className="text-[16px] text-[#051937]" style={{ fontWeight: 500 }}>{value || '—'}</span>
  </div>
);

export default function ValidityExtensionViewRequestPage({ row, onBack }: Props) {
  const decl = row.declarations[0];

  return (
    <div className="flex flex-col h-full bg-[#f8fafd]" style={{ fontFamily: font }}>
      <div className="flex-shrink-0 bg-[#f8fafd]">
        <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[16px] pb-[8px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline">Home</button>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#8f94ae]">Refund &amp; Claims</span>
          <span className="text-[16px] text-[#dc3545]">/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontWeight: 500 }}>View Request — {row.reqNo}</span>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-4 sm:px-10 pb-[32px]">
        <h1 className="text-[32px] text-[#111838] mb-[20px]" style={{ fontWeight: 500 }}>View Request — {row.reqNo}</h1>

        <div className="flex flex-col gap-[24px]">
          {/* Request Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Request Details</h2>
            <div className="bg-white rounded-[8px] px-[24px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[32px] gap-y-[20px]">
                <Field label="Request No." value={row.reqNo} />
                <Field label="Status" value={row.status} />
                <Field label="Claim Time Validity Extension Registration No." value={row.registrationNo} />
                <Field label="Registration Date" value={row.submissionDate} />
                <Field label="Declaration No." value={decl?.declNo} />
                <Field label="Declaration Owner" value={row.declarationOwnerName} />
                <Field label="Declaration Date" value={decl?.date} />
                <Field label="Declaration Type" value={row.declarationType} />
                <Field label="Customs Broker" value={row.customsBroker} />
                <Field label="Reason" value={row.extReason} />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Attachments</h2>
            <div className="bg-white rounded-[8px] px-[14px] pt-[16px] pb-[16px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 500, fontFamily: font }}>
                  <thead>
                    <tr>
                      {['File', 'File Type', 'Size'].map((h, i) => (
                        <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRadius: i === 0 ? '8px 0 0 0' : i === 2 ? '0 8px 0 0' : 0 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {!row.attachments || row.attachments.length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: '20px 12px', textAlign: 'center' }}><span className="text-[16px] text-[#697498]">No attachments found.</span></td></tr>
                    ) : row.attachments.map((a, i) => (
                      <tr key={i}>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px]" style={{ color: '#dc3545' }}>{a.file}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px] text-[#051937]">{a.fileType}</span>
                        </td>
                        <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                          <span className="text-[16px] text-[#051937]">{a.size}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Claim Time Validity Extension Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Claim Time Validity Extension Details</h2>
            <div className="bg-white rounded-[8px] px-[14px] pt-[16px] pb-[16px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, minWidth: 700, fontFamily: font }}>
                  <thead>
                    <tr>
                      {['Charge Type', 'Amount(AED)', 'No Of Days for Extension', 'No Of Days Approved', 'Status'].map((h, i) => (
                        <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, fontSize: 16, color: '#051937', whiteSpace: 'nowrap', borderRadius: i === 0 ? '8px 0 0 0' : i === 4 ? '0 8px 0 0' : 0 }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                        <span className="text-[16px] text-[#051937]">{row.extChargeType}</span>
                      </td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                        <span className="text-[16px] text-[#051937]">{row.extAmount}</span>
                      </td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                        <span className="text-[16px] text-[#051937]">{row.extDaysRequested}</span>
                      </td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                        <span className="text-[16px] text-[#051937]">{row.extDaysApproved}</span>
                      </td>
                      <td style={{ padding: '14px 12px', borderBottom: '1px solid #eef1f6' }}>
                        <span className="text-[16px]" style={{ color: '#b45309', fontWeight: 500 }}>Registered</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Charges & Payment Details */}
          <div className="flex flex-col gap-[14px]">
            <h2 className="text-[24px] font-medium text-[#051937]" style={{ fontFamily: font }}>Charges &amp; Payment Details</h2>
            <div className="bg-white rounded-[8px] px-[24px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
              <span className="text-[16px] text-[#697498]">No Payment and Charge details found</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white flex-shrink-0" style={{ boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', height: 88 }}>
        <div className="h-full flex items-center px-[40px]">
          <button
            onClick={onBack}
            data-secondary-btn className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-[#1360d2] border border-[#1360d2] transition-colors"
            style={{ fontFamily: font }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
