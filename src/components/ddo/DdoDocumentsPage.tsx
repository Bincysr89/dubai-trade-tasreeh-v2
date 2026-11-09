import { useState } from 'react';

const DOCUMENTS = [
  { id: 'auth', label: 'Authorization Letter', required: true },
  { id: 'bl', label: 'B/L Copy', required: false },
  { id: 'eid', label: 'Emirates ID', required: false },
  { id: 'other', label: 'Other Documents', required: false },
];

interface Props {
  onSave: () => void;
  onCancel: () => void;
}

export default function DdoDocumentsPage({ onSave, onCancel }: Props) {
  const [uploaded, setUploaded] = useState<Record<string, string>>({});

  const handleUpload = (id: string) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.png,.jpg,.jpeg,.gif,.pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) setUploaded(prev => ({ ...prev, [id]: file.name }));
    };
    input.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f9fafb] flex flex-col">
      <div className="bg-[#1e2d4d] flex items-center gap-4 px-6 py-4 flex-shrink-0 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]">
        <button
          onClick={onCancel}
          className="bg-white rounded-full size-11 flex items-center justify-center flex-shrink-0 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)]"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-[#1e2d4d]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div>
          <h1 className="text-white font-dubai font-bold text-[20px] leading-tight">Documents</h1>
          <p className="text-white font-dubai text-[12px] opacity-80">Upload Required Documents</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[560px] mx-auto px-6 py-6 flex flex-col gap-4">

          {DOCUMENTS.map(doc => (
            <button
              key={doc.id}
              onClick={() => handleUpload(doc.id)}
              className="bg-white border border-[#e5e7eb] rounded-[16px] shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] flex items-center gap-4 p-5 w-full text-left hover:shadow-md transition-shadow"
            >
              <div className="bg-[#eff6ff] rounded-[14px] size-12 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" className="size-6 text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-[#1e2939] font-dubai font-medium text-[16px]">{doc.label}</p>
                  {doc.required && <span className="text-[#fb2c36] font-dubai font-bold text-[16px]">*</span>}
                </div>
                <p className="text-[#99a1af] font-dubai text-[12px] truncate">
                  {uploaded[doc.id] ? uploaded[doc.id] : 'Tap to upload file'}
                </p>
              </div>
              <div
                className={`size-10 rounded-full border-2 border-dashed flex items-center justify-center flex-shrink-0 transition-all ${
                  uploaded[doc.id] ? 'bg-[#d1fae5] border-[#10b981]' : 'bg-[#eff6ff] border-[#51a2ff]'
                }`}
              >
                {uploaded[doc.id] ? (
                  <svg viewBox="0 0 24 24" className="size-5 text-[#10b981]" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="size-5 text-[#1360d2]" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                )}
              </div>
            </button>
          ))}

          {/* File format info */}
          <div
            className="border border-[#bedbff] rounded-[16px] p-5 shadow-[0px_1px_1.5px_rgba(0,0,0,0.1)] flex gap-3"
            style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ecfeff 100%)' }}
          >
            <div className="bg-[#2b7fff] rounded-[14px] size-10 flex items-center justify-center flex-shrink-0 shadow-[0px_4px_3px_rgba(0,0,0,0.1)]">
              <svg viewBox="0 0 24 24" className="size-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-[#1e2939] font-dubai font-bold text-[18px] mb-1">Supported File Formats</p>
              <p className="text-[#364153] font-dubai text-[16px] leading-[22px]">
                Upload Document Only Of File Type{' '}
                <strong>(PNG/JPG/GIF/PDF)</strong> And Maximum File Size{' '}
                <strong>1 MB</strong>
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="size-2 rounded-full bg-[#fb2c36] flex-shrink-0" />
                <p className="text-[#e7000b] font-dubai font-bold text-[16px]">* Mandatory Files</p>
              </div>
            </div>
          </div>

          <button
            onClick={onSave}
            className="w-full bg-[#1360d2] text-white rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] hover:bg-[#1150b8] transition-colors"
          >
            Save and Return
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-white text-[#1360d2] rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1)] hover:bg-[#f0f7ff] transition-colors mb-6"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
