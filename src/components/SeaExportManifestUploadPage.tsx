import { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

export type SeaExportManifestUploadRow = Record<string, string | boolean | undefined> & { manifestNo: string };

type Props = { row: SeaExportManifestUploadRow; onBack: () => void; onBackToListing: () => void };

export default function SeaExportManifestUploadPage({ row, onBack, onBackToListing }: Props) {
  const [fileName, setFileName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const bolNumber = String(row.manifestNo ?? row.bolNumber ?? '');
  const rotationNumber = String(row.rotationNumber ?? 'RT-2024-5581');

  const Breadcrumb = ({ trail }: { trail: string }) => (
    <div className="flex items-center gap-[6px] px-4 sm:px-10 pt-[24px] pb-[8px] flex-shrink-0">
      <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
      <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
      <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Export By Sea</span>
      <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
      <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{trail}</span>
    </div>
  );

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb trail="Sea Export Manifest" />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Uploading BOL</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[40px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>File Uploaded Successfully</p>
            <div className="rounded-[6px] px-[24px] py-[18px] w-full max-w-[640px]" style={{ background: '#eafaf0', border: '1px solid #c9f0d8' }}>
              <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>
                Your file has been successfully received. The file upload reference number is <b>{'UBR-' + bolNumber}</b>.
                Please check the processing status of the uploaded file using <b>&apos;Track Upload&apos;</b> service after <b>15</b> mins.
                The file tracking number is e-mailed to your <b>barakath.natchiya@dubaicustoms.ae</b> account.
                This acknowledges the receipt of export manifest file only, it does not imply correctness of content.
              </p>
            </div>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb trail="Upload BOLs" />
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Bill of Lading (BOL)</h1>
        <p className="text-[15px] text-[#697498] mt-[2px]" style={{ fontFamily: font }}>
          For manifest: <span className="text-[#1360d2] font-medium">{bolNumber || '—'}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="rounded-[8px] px-[20px] py-[16px] flex items-start gap-[12px]" style={{ background: '#e2ebf9', border: '1px solid #c7d9f7' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[2px]"><circle cx="12" cy="12" r="9.5" /><path d="M12 8v.01M12 11v5" strokeLinecap="round" /></svg>
          <div>
            <p className="text-[16px] text-[#0e1b3d] mb-[6px]" style={{ fontFamily: font, fontWeight: 500 }}>Upload Guidelines</p>
            <ul className="text-[15px] text-[#455174] flex flex-col gap-[3px]" style={{ fontFamily: font }}>
              <li>• Maximum file size: 0.3 MB</li>
              <li>• Only CSV format files are accepted</li>
              <li>• Ensure BOL records match the rotation number</li>
              <li>• Files uploaded more than 4 days ago cannot be re-tracked</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="max-w-[320px]">
            <div className="relative">
              <input value={rotationNumber} disabled readOnly className="w-full rounded-[4px] text-[16px]" style={{ height: 56, border: '1px solid #d5ddfb', padding: '0 12px', fontFamily: font, color: '#0e1b3d', background: '#f0f3fa' }} />
              <span className="absolute pointer-events-none" style={{ left: 10, top: -9, background: '#fff', padding: '0 4px', fontSize: 12, color: '#0e1b3d', fontFamily: font }}>
                <span style={{ color: '#dc3545' }}>*</span>Rotation Number
              </span>
            </div>
          </div>

          <label className="rounded-[8px] flex flex-col items-center justify-center gap-[12px] py-[48px] cursor-pointer" style={{ border: '1.5px dashed #c7d0e8' }}>
            <input type="file" accept=".csv" className="hidden" onChange={e => setFileName(e.target.files?.[0]?.name ?? '')} />
            <div className="size-[56px] rounded-full flex items-center justify-center" style={{ background: '#e2ebf9' }}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="1.8"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></svg>
            </div>
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{fileName || 'Click to select a CSV file'}</p>
            <p className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>CSV format only · Max 0.3 MB</p>
            <span className="h-[42px] px-[20px] rounded-[4px] flex items-center text-[15px] text-[#1360d2]" style={{ border: '1px solid #1360d2', fontFamily: font, fontWeight: 500 }}>Browse File</span>
          </label>
        </div>
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <button onClick={() => setSubmitted(true)}
            className="h-[48px] px-[24px] rounded-[4px] text-[16px] text-white flex items-center gap-[8px] transition-colors"
            style={{ background: '#1360d2', cursor: 'pointer', fontFamily: font, fontWeight: 500 }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Upload BOLs
          </button>
        }
      />
    </div>
  );
}
