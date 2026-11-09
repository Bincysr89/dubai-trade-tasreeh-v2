import { Fragment, useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';
import { UPLOAD_STATUS_STYLE, type FlightManifestUploadFile, type FlightManifestUploadRecord } from './CargoInformationPage';

const font = "'Dubai', sans-serif";

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col gap-[4px]">
    <span className="text-[14px]" style={{ color: '#697498', fontFamily: font }}>{label}</span>
    <span className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>{value || '—'}</span>
  </div>
);

/* Synthesized raw-file preview text for the "View File Content" popup — a plausible
   EDIFACT-style manifest line for the file's AWB, not a real customs message format. */
const buildFileContentPreview = (file: FlightManifestUploadFile, upload: FlightManifestUploadRecord): string => [
  `${upload.manifestFileType}/8`,
  `1/EK${upload.flightNo}/${upload.scheduledDate.replace(/[^0-9]/g, '').slice(0, 8) || '00000000'}`,
  `${upload.flightNo}DXB/${upload.scheduledDate}`,
  `${file.awbNo}MAADXB/T160K100MC3000/GENERAL CARGO`,
  "OCI/BC/TGH/AB/SUPPLEMENTARY CUSTOM'S INFO 1",
  'CONT',
].join('\n');

type Props = {
  row: FlightManifestUploadRecord;
  initialOpenErrorFileIds?: string[];
  onBack: () => void;
  onBackToListing: () => void;
};

export default function FlightManifestFileUploadDetailsPage({ row, initialOpenErrorFileIds, onBack, onBackToListing }: Props) {
  const [openErrorFileIds, setOpenErrorFileIds] = useState<Set<string>>(new Set(initialOpenErrorFileIds ?? []));
  const [viewFileContentRow, setViewFileContentRow] = useState<FlightManifestUploadFile | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae] hover:underline cursor-pointer" style={{ fontFamily: font }} onClick={onBackToListing}>Flight Manifest</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>File Upload Details</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <h1 className="text-[28px] font-bold text-[#0e1b3d] flex-shrink-0" style={{ fontFamily: font }}>File Upload Details</h1>

        <div className="bg-white rounded-[8px] p-[24px] flex-shrink-0" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px 20px' }}>
            <Field label="Upload Reference Number" value={row.uploadRefNo} />
            <Field label="Uploaded Date" value={row.uploadDate} />
            <Field label="No. Of Uploaded Files" value={String(row.files.length)} />
            <Field label="No. Of Files Successful" value={row.filesSuccessful} />
            <Field label="No. Of Files Failed" value={row.filesFailed} />
            <Field label="Manifest File Type" value={row.manifestFileType} />
          </div>
        </div>

        <div className="flex flex-col gap-[16px] flex-1">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>List Of Files</p>
          <div className="bg-white rounded-[8px] p-[20px] flex-1" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
            <div className="rounded-[6px] overflow-hidden overflow-x-auto" style={{ border: '1px solid #eef1f6' }}>
              <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse', minWidth: 780 }}>
                <thead>
                  <tr style={{ background: '#e2ebf9' }}>
                    {['File Name', 'Airway Bill Number', 'Status', 'Remarks', 'Actions'].map(h => (
                      <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {row.files.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No files found for this upload.</td></tr>
                  ) : row.files.map(f => {
                    const isFailure = f.status === 'Failure';
                    const isOpen = openErrorFileIds.has(f.id);
                    return (
                    <Fragment key={f.id}>
                      <tr style={{ borderTop: '1px solid #f0f4ff' }}>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{f.fileName}</td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]" style={{ whiteSpace: 'nowrap' }}>{f.awbNo}</td>
                        <td className="px-[16px] py-[10px]">
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap"
                            style={{ background: isFailure ? UPLOAD_STATUS_STYLE.Failure.bg : UPLOAD_STATUS_STYLE.Successful.bg, color: isFailure ? UPLOAD_STATUS_STYLE.Failure.color : UPLOAD_STATUS_STYLE.Successful.color, fontFamily: font }}>
                            {f.status === 'Success' ? 'Successful' : f.status}
                          </span>
                        </td>
                        <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.remarks || '—'}</td>
                        <td className="px-[16px] py-[10px]">
                          <div className="flex items-center gap-[8px]">
                            <button type="button" onClick={() => setViewFileContentRow(f)} aria-label={`View file content for ${f.fileName}`}
                              className="size-[32px] inline-flex items-center justify-center rounded-[4px] hover:bg-[#f0f4ff] transition-colors" style={{ border: '1px solid #d5ddfb', color: '#455174' }}>
                              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2h7l3 3v12H5z" /><path d="M12 2v3h3" /></svg>
                            </button>
                            {isFailure && (
                              <button type="button" onClick={() => setOpenErrorFileIds(prev => { const next = new Set(prev); next.has(f.id) ? next.delete(f.id) : next.add(f.id); return next; })}
                                aria-label={isOpen ? `Collapse error details for ${f.fileName}` : `View error details for ${f.fileName}`}
                                className="size-[32px] rounded-full inline-flex items-center justify-center transition-colors"
                                style={{ background: isOpen ? '#1360d2' : '#fff', border: `1px solid ${isOpen ? '#1360d2' : '#e0e6ef'}`, color: isOpen ? '#fff' : '#455174', boxShadow: '0px 1px 4px rgba(19,96,210,0.10)' }}>
                                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12z" /><circle cx="12" cy="12" r="3" /></svg>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isFailure && isOpen && (
                        <tr>
                          <td colSpan={5} style={{ padding: 0, background: '#fef2f2' }}>
                            <div className="px-[20px] py-[14px]">
                              <p className="text-[14px] mb-[8px]" style={{ color: '#455174', fontWeight: 600, fontFamily: font }}>Error Details — {f.fileName}</p>
                              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #f3c2c2', background: '#fff' }}>
                                <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                                  <thead>
                                    <tr style={{ background: '#fbdada' }}>
                                      <th className="text-left px-[14px] py-[8px] text-[13px] text-[#0e1b3d]" style={{ fontWeight: 500, width: 60 }}>S.No</th>
                                      <th className="text-left px-[14px] py-[8px] text-[13px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>Error</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(f.errors && f.errors.length > 0 ? f.errors : [f.remarks || 'No error details available.']).map((err, ei) => (
                                      <tr key={ei} style={{ borderTop: '1px solid #f5e0e0' }}>
                                        <td className="px-[14px] py-[8px] text-[14px] text-[#697498]">{ei + 1}</td>
                                        <td className="px-[14px] py-[8px] text-[14px] text-[#0e1b3d]">{err}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BackToListingBar onBackToListing={onBackToListing} />

      {viewFileContentRow && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center px-[20px]" style={{ background: 'rgba(14,27,61,0.55)' }} onClick={() => setViewFileContentRow(null)}>
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ width: 'min(640px, 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)', fontFamily: font }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
              <p className="text-[18px] text-white" style={{ fontWeight: 500 }}>View File Content</p>
              <button onClick={() => setViewFileContentRow(null)} className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/20" aria-label="Close">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
              </button>
            </div>
            <div className="px-[24px] py-[20px]">
              <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
                <div className="px-[10px] py-[8px]" style={{ background: '#f0f4ff' }}>
                  <span className="text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500, fontFamily: font }}>Received File</span>
                </div>
                <pre className="px-[16px] py-[14px] text-[14px] text-[#455174] overflow-auto" style={{ margin: 0, maxHeight: 320, fontFamily: "'SFMono-Regular', Consolas, monospace", whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                  {buildFileContentPreview(viewFileContentRow, row)}
                </pre>
              </div>
            </div>
            <div className="flex justify-center pb-[20px]">
              <button onClick={() => setViewFileContentRow(null)}
                className="h-[42px] px-[22px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[8px]" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l8 8M14 6l-8 8" /></svg>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
