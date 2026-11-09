import React, { useRef, useState } from 'react';
import { chevronSrc, font } from './DeclarationUI';

export type InvoiceEntryMode = 'upload' | 'manual';

type Props = {
  mode: InvoiceEntryMode;
  onClose: () => void;
  /** Saving the manual form / finishing an upload hands control back to the invoice list. */
  onSaved?: () => void;
  onAddLineItem?: () => void;
};

function LabelledInput({ label, required, value, placeholder, select, onChange }: {
  label: string; required?: boolean; value?: string; placeholder?: string; select?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div className="relative">
      <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] bg-white px-[16px]">
        {select ? (
          <>
            <span className="flex-1 min-w-0 text-[16px] truncate" style={{ color: value ? '#0e1b3d' : '#697498' }}>
              {value || placeholder || 'Select'}
            </span>
            <img src={chevronSrc} alt="" width={24} height={24} className="flex-shrink-0" />
          </>
        ) : (
          <input
            value={value ?? ''}
            onChange={(e) => onChange?.(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] placeholder:text-[#697498] bg-transparent focus:outline-none"
            style={{ fontFamily: font }}
          />
        )}
      </div>
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>
        {required && <span style={{ color: '#dc3545' }}>*</span>}{label}
      </span>
    </div>
  );
}

/**
 * The panel the "Upload Text File" / "Add Manually" buttons open above the invoice list —
 * either the text-file uploader or the invoice header form, so more invoices can be added
 * without leaving the Invoice Details step.
 */
export default function InvoiceEntryPanel({ mode, onClose, onSaved, onAddLineItem }: Props) {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className={`bg-white rounded-[8px] px-[24px] py-[22px] ${mode === 'upload' ? 'max-w-[560px]' : ''}`}
      style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)', fontFamily: font }}>

      <div className="flex items-start justify-between gap-[16px] mb-[20px]">
        <div className="flex flex-col gap-[4px]">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontWeight: 500 }}>
            {mode === 'upload' ? 'Upload Text File' : 'Add Invoice Header'}
          </p>
          <p className="text-[16px] text-[#697498]">
            {mode === 'upload'
              ? '* Supported file type of .TXT — max file size up to 150 KB'
              : 'Fill in the invoice header, then save it or go straight on to its line items.'}
          </p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close"
          className="size-[32px] inline-flex items-center justify-center rounded-full hover:bg-[#f0f4ff] transition-colors flex-shrink-0">
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#697498" strokeWidth="2.2" strokeLinecap="round">
            <path d="M5 5l10 10M15 5l-10 10" />
          </svg>
        </button>
      </div>

      {mode === 'upload' ? (
        <>
          <div className="flex justify-end mb-[10px]">
            <button type="button" className="flex items-center gap-[6px] text-[#1360d2] text-[16px] hover:opacity-80 transition-opacity">
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
              </svg>
              Download Template
            </button>
          </div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault(); setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) { setFileName(f.name); onSaved?.(); }
            }}
            className="flex flex-col items-center justify-center gap-[12px] rounded-[8px] py-[32px] px-[16px] transition-colors"
            style={{ border: `1.5px dashed ${dragging ? '#1360d2' : '#b5c8e8'}`, background: dragging ? '#edf3ff' : '#f8fafd' }}
          >
            <div className="size-[56px] rounded-full inline-flex items-center justify-center" style={{ background: '#e2ebf9' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#1360d2" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
                <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
              </svg>
            </div>
            <p className="text-[16px] text-[#697498]">{fileName ?? 'Drag and drop or'}</p>
            <button type="button" data-secondary-btn onClick={() => fileRef.current?.click()}
              className="h-[42px] px-[22px] rounded-[4px] border text-[16px] bg-white transition-colors"
              style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
              {fileName ? 'Replace File' : 'Upload File'}
            </button>
            <input ref={fileRef} type="file" accept=".txt,text/plain" className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setFileName(f.name); onSaved?.(); }
                e.target.value = '';
              }} />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-[20px] gap-y-[32px]">
            <LabelledInput label="Invoice Number" required placeholder="Invoice number" />
            <LabelledInput label="Invoice Date" required value="08/17/2023" />
            <LabelledInput label="Seller" required placeholder="Seller Name" />
            <LabelledInput label="Number of Pages" required value="12" />
            <LabelledInput label="Invoice Type" required select placeholder="Commercial" />
            <LabelledInput label="Terms of Delivery" required select placeholder="Cost & Fright" />
            <LabelledInput label="Payment Term" required select placeholder="12 Months" />
            <LabelledInput label="Freight Cost" required placeholder="Freight Cost" />
            <LabelledInput label="Freight Cost Currency" required select placeholder="AED" />
            <LabelledInput label="Insurance Cost" required placeholder="Enter Value" />
            <LabelledInput label="Insurance Cost Currency" required select placeholder="AED" />
            <LabelledInput label="Invoice Value" required placeholder="Enter Value" />
            <LabelledInput label="Invoice Currency" required select placeholder="AED" />
          </div>

          <div className="flex items-center justify-between flex-wrap gap-[12px] mt-[28px]">
            <p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>CIF Value</p>
            <div className="flex items-center gap-[12px] flex-wrap">
              <button data-secondary-btn type="button" onClick={onClose}
                className="h-[44px] px-[22px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Close</button>
              {onAddLineItem && (
                <button data-secondary-btn type="button" onClick={onAddLineItem}
                  className="h-[44px] px-[22px] rounded-[4px] border text-[16px] bg-white transition-colors"
                  style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Add Line Item</button>
              )}
              <button data-secondary-btn type="button" onClick={() => onSaved?.()}
                className="h-[44px] px-[22px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>Save &amp; Add Another Invoice</button>
              <button type="button" onClick={() => { onSaved?.(); onClose(); }}
                className="h-[44px] px-[30px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                style={{ background: '#1360d2', fontWeight: 500 }}>Save</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/** The paired "Upload Text File" / "Add Manually" buttons that open the panel above the list. */
export function InvoiceEntryButtons({ mode, onChange, disabled = false }: {
  mode: InvoiceEntryMode | null; onChange: (m: InvoiceEntryMode | null) => void;
  /** Amending an existing declaration leaves both routes visible but inert. */
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center gap-[12px] flex-wrap" style={{ fontFamily: font }}>
      {(['upload', 'manual'] as const).map((m) => {
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            data-secondary-btn={disabled ? undefined : ''}
            disabled={disabled}
            aria-pressed={active}
            onClick={() => onChange(active ? null : m)}
            className="h-[44px] px-[22px] rounded-[4px] bg-white text-[16px] transition-colors"
            style={{
              border: `${active && !disabled ? 2 : 1}px solid ${disabled ? '#c7d2e8' : '#1360d2'}`,
              color: disabled ? '#9aa6c0' : '#1360d2',
              fontWeight: 500,
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
          >
            {m === 'upload' ? 'Upload Text File' : 'Add Manually'}
          </button>
        );
      })}
    </div>
  );
}
