import { useRef, useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

function formatSize(bytes: number) {
  return `${Math.max(0.1, bytes / 1024).toFixed(1)}`;
}

type ManifestFile = { id: string; name: string; sizeKb: string };

export type FlightManifestUploadRow = Record<string, string | boolean | undefined> & { flightNo: string };

type Props = {
  row: FlightManifestUploadRow;
  onBack: () => void;
  onBackToListing: () => void;
};

const str = (v: string | boolean | undefined) => typeof v === 'string' ? v : '';

const MANIFEST_TYPES = ['Inbound Manifest', 'FFM', 'FWB'];

function FSelect({ label, value, onChange, options, req }: {
  label: string; value: string; onChange: (v: string) => void; options: string[]; req?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const floated = open || value.length > 0;
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} aria-haspopup="listbox" aria-expanded={open}
        className="w-full rounded-[4px] flex items-center px-[12px] text-left"
        style={{ height: 56, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font, cursor: 'pointer', background: '#fff' }}>
        <span className="flex-1 text-[16px]" style={{ color: value ? '#0e1b3d' : 'transparent' }}>{value || ' '}</span>
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2" className={`transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`}>
          <path d="M5 8l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: floated ? (open ? '#1360d2' : '#0e1b3d') : '#697498',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {open && (
        <div className="absolute z-[80] top-[60px] left-0 w-full bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(o => (
            <button key={o} type="button" onClick={() => { onChange(o); setOpen(false); }}
              className="block w-full text-left px-[14px] py-[10px] text-[16px] hover:bg-[#e2ebf9] transition-colors"
              style={{ color: o === value ? '#1360d2' : '#0e1b3d', fontWeight: o === value ? 500 : 400, fontFamily: font }}>
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function FInput({ label, value, onChange, req, disabled, trailing }: {
  label: string; value: string; onChange: (v: string) => void; req?: boolean; disabled?: boolean; trailing?: () => void;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <input value={value} onChange={e => onChange(e.target.value)} disabled={disabled}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full rounded-[4px] text-[16px]"
        style={{ height: 56, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}`, padding: '0 12px', paddingRight: trailing ? 52 : 12, fontFamily: font, color: '#0e1b3d', outline: 'none', background: disabled ? '#f0f3fa' : '#fff', transition: 'border-color 120ms' }} />
      <span className="absolute pointer-events-none transition-all" style={{
        left: floated ? 10 : 12, top: floated ? -9 : '50%', transform: floated ? 'none' : 'translateY(-50%)',
        background: floated ? '#fff' : 'transparent', padding: floated ? '0 4px' : 0,
        fontSize: floated ? 12 : 16, color: floated ? (focused ? '#1360d2' : '#0e1b3d') : '#697498',
        transitionDuration: '120ms', fontFamily: font,
      }}>
        {req && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
      {trailing && (
        <button type="button" onClick={trailing} className="absolute right-[8px] top-[8px] size-[40px] rounded-[4px] flex items-center justify-center text-white" style={{ background: '#1360d2' }}>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2"><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" strokeLinecap="round" /></svg>
        </button>
      )}
    </div>
  );
}

export default function FlightManifestUploadPage({ row, onBack, onBackToListing }: Props) {
  const [manifestType, setManifestType] = useState('FFM');
  const [flightNo, setFlightNo] = useState(str(row.flightNo));
  const [files, setFiles] = useState<ManifestFile[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const scheduleDate = str(row.scheduleDate) || str(row.flightDate) || '—';
  const uploadRefNo = `266017${String(row.flightNo ?? '').replace(/\D/g, '').padStart(5, '0').slice(-5)}`;
  const fileName = files[0]?.name ?? `${flightNo}_${manifestType}_manifest.txt`;

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 20 - files.length).map((f, i) => ({ id: `f-${Date.now()}-${i}`, name: f.name, sizeKb: formatSize(f.size) }));
    setFiles(p => [...p, ...next]);
  };
  const removeFile = (id: string) => setFiles(p => p.filter(f => f.id !== id));

  const Breadcrumb = ({ trail }: { trail: string }) => (
    <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
      <div className="flex items-center gap-[6px]">
        <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Flight Manifest</span>
        <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
        <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>{trail}</span>
      </div>
      <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <Breadcrumb trail="Confirmation" />
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Confirmation</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[40px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>File(s) Received Successfully</p>
            <div className="rounded-[6px] px-[24px] py-[18px] flex flex-col gap-[8px] w-full max-w-[640px]" style={{ background: '#eafaf0', border: '1px solid #c9f0d8' }}>
              <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>
                The following file(s) has been received successfully. File Upload Reference Number is <b>{uploadRefNo}</b>.
              </p>
              <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>{fileName}</p>
              <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>
                Please login to the system after 4 mins to check the processing status of the uploaded file using &apos;Track Upload&apos; service.
                File Upload Reference Number has been emailed to your registered email ID <b>barakath.natchiya@dubaicustoms.ae</b>.
              </p>
              <p className="text-[14px] text-[#455174]" style={{ fontFamily: font, fontStyle: 'italic' }}>
                This acknowledges the receipt of Manifest file(s) only, it does not imply correctness of content.
              </p>
            </div>
            <button onClick={onBackToListing} className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              Click here to proceed to Track Upload
            </button>
          </div>
        </div>
        <BackToListingBar onBackToListing={onBackToListing} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
      <Breadcrumb trail="Upload Manifest" />
      <div className="px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Courier Manifest File Upload</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="rounded-[8px] px-[20px] py-[16px] flex items-start gap-[12px]" style={{ background: '#e2ebf9', border: '1px solid #c7d9f7' }}>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2" className="flex-shrink-0 mt-[2px]"><circle cx="12" cy="12" r="9.5" /><path d="M12 8v.01M12 11v5" strokeLinecap="round" /></svg>
          <div>
            <p className="text-[16px] text-[#0e1b3d] mb-[6px]" style={{ fontFamily: font, fontWeight: 500 }}>Information</p>
            <ul className="text-[15px] text-[#455174] flex flex-col gap-[3px]" style={{ fontFamily: font }}>
              <li>• Allowed individual file size is 10 KB</li>
              <li>• Allowed total file size is 10 MB</li>
              <li>• Allowed file extension type is .txt</li>
              <li>• Allowed maximum number of files per upload is 20</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Manifest File Details</p>
          <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="max-w-[320px]">
              <FSelect label="Manifest File Type" value={manifestType} onChange={setManifestType} options={MANIFEST_TYPES} req />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Flight Details</p>
          <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <FInput label="Flight Number" value={flightNo} onChange={setFlightNo} req trailing={() => {}} />
            <FInput label="Scheduled Date" value={scheduleDate} onChange={() => {}} disabled />
          </div>
        </div>

        <div className="flex flex-col gap-[16px]">
          <div className="flex items-center justify-between">
            <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Upload Manifest File</p>
            <button type="button" onClick={() => inputRef.current?.click()}
              className="h-[42px] px-[18px] rounded-[4px] text-[15px] text-white inline-flex items-center gap-[6px]"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
              <span>+</span>Add
            </button>
            <input ref={inputRef} type="file" multiple accept=".txt" className="hidden" onChange={e => addFiles(e.target.files)} />
          </div>

          <div className="bg-white rounded-[8px] p-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <p className="text-[15px] text-[#697498] mb-[12px]" style={{ fontFamily: font }}>No Of Files Added : <b style={{ color: '#0e1b3d' }}>{files.length}</b></p>
            <div className="rounded-[6px] overflow-hidden" style={{ border: '1px solid #eef1f6' }}>
              <table className="w-full" style={{ fontFamily: font, borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#e2ebf9' }}>
                    {['File Name', 'File Size (KB)', 'Action'].map(h => (
                      <th key={h} className="text-left px-[16px] py-[10px] text-[14px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {files.length === 0 ? (
                    <tr><td colSpan={3} className="text-center py-[28px] text-[15px] text-[#8f94ae]">No files added yet. Click &quot;Add&quot; to select a .txt file.</td></tr>
                  ) : files.map(f => (
                    <tr key={f.id} style={{ borderTop: '1px solid #f0f4ff' }}>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.name}</td>
                      <td className="px-[16px] py-[10px] text-[15px] text-[#0e1b3d]">{f.sizeKb}</td>
                      <td className="px-[16px] py-[10px]">
                        <button onClick={() => removeFile(f.id)} className="text-[#c0392b] hover:opacity-70">
                          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <BackToListingBar
        onBack={onBack}
        rightContent={
          <button onClick={() => files.length > 0 && setSubmitted(true)} disabled={files.length === 0}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white flex items-center gap-[8px] transition-colors"
            style={{ background: files.length > 0 ? '#1360d2' : '#a7c3eb', cursor: files.length > 0 ? 'pointer' : 'not-allowed', fontFamily: font, fontWeight: 500 }}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12M7 8l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" /><path d="M4 17v3h16v-3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Upload
          </button>
        }
      />
    </div>
  );
}
