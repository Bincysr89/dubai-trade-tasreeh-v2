import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { chevronSrc, font, todaySrc } from './DeclarationUI';

type Props = { onClose: () => void; customerCode?: string; onSubmit?: () => void };

type FieldSpec = {
  label: string;
  value: string;
  required?: boolean;
  /** 'select' shows a chevron, 'date' a calendar icon. */
  kind?: 'text' | 'select' | 'date';
  disabled?: boolean;
  /** Spans two grid columns, like Address. */
  wide?: boolean;
};

const CUSTOMER_FIELDS: FieldSpec[] = [
  { label: 'Name', value: "SINGH'VIKRAM DHALIWAL OMAN1", required: true },
  { label: 'Address', value: "Flat' 205\\ Building Silicon / Nadd Hessa Dubai Silicon Oasis", required: true, wide: true },
  { label: 'Country', value: 'OMAN', required: true, kind: 'select' },
  { label: 'City', value: 'MASIRAH', required: true, kind: 'select' },
  { label: 'Mobile Phone Number', value: '91341010102007', required: true },
  { label: 'Address in Country Of Residence', value: 'Flat 205 Building Silicon Nadd Hessa Dubai Silicon Oasis', wide: true },
  { label: 'Date of Berth', value: '23-12-1983', required: true, kind: 'date' },
  { label: 'E-mail id', value: 'vikramsingdha@gmail.com', required: true },
  { label: 'Occupation', value: 'Software' },
  { label: 'Nationality', value: 'INDIA' },
  { label: 'Country of Birth', value: 'Johndoe@gmail.com' },
];

const DOCUMENT_FIELDS: FieldSpec[] = [
  { label: 'ID Document Type', value: 'Passport', required: true, kind: 'select', disabled: true },
  { label: 'ID Issuing Country', value: 'Select', required: true, kind: 'select', disabled: true },
  { label: 'ID Document Number', value: 'Enter', required: true, disabled: true },
  { label: 'ID Document Expiration Date', value: '08/17/2025', kind: 'date' },
];

function Labelled({ spec }: { spec: FieldSpec }) {
  const icon = spec.kind === 'select' ? chevronSrc : spec.kind === 'date' ? todaySrc : null;
  return (
    <div className={`relative ${spec.wide ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center h-[52px] rounded-[4px] border border-[#d5ddfb] px-[16px]"
        style={{ background: spec.disabled ? '#f1f3f7' : '#fff' }}>
        <span className="flex-1 min-w-0 text-[16px] text-[#0e1b3d] truncate">{spec.value}</span>
        {icon && <img src={icon} alt="" width={24} height={24} className="flex-shrink-0" />}
      </div>
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px', fontFamily: font }}>
        {spec.required && <span style={{ color: '#dc3545' }}>*</span>}{spec.label}
      </span>
    </div>
  );
}

/** Edit Personal Customer — Figma 2806:130555. */
export default function EditPersonalCustomerModal({ onClose, customerCode = 'PC00038163', onSubmit }: Props) {
  const [undertaking, setUndertaking] = useState(false);

  return (
    <DeclarationModal title="Edit Personal Customer" onClose={onClose} maxWidth={860}>
      <p className="text-[18px] text-[#0e1b3d] mb-[28px]" style={{ fontWeight: 600 }}>Customer Code: {customerCode}</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        {CUSTOMER_FIELDS.map((f) => <Labelled key={f.label} spec={f} />)}
      </div>

      <p className="text-[18px] text-[#0e1b3d] mt-[36px] mb-[28px]" style={{ fontWeight: 600 }}>Document Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        {DOCUMENT_FIELDS.map((f) => <Labelled key={f.label} spec={f} />)}
      </div>

      <p className="text-[18px] text-[#0e1b3d] mt-[36px] mb-[28px]" style={{ fontWeight: 600 }}>UAE National ID Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled spec={{ label: 'ID Number', value: 'UAE-123456778', required: true, disabled: true }} />
      </div>

      <p className="text-[18px] text-[#0e1b3d] mt-[36px] mb-[28px]" style={{ fontWeight: 600 }}>Visa Details</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[24px] gap-y-[32px]">
        <Labelled spec={{ label: 'Visa Type', value: 'Passport', kind: 'select' }} />
      </div>

      <label className="flex items-start gap-[12px] mt-[32px] px-[16px] py-[16px] rounded-[4px] cursor-pointer select-none"
        style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
        <input type="checkbox" checked={undertaking} onChange={(e) => setUndertaking(e.target.checked)}
          className="mt-[3px] size-[18px] rounded-[2px] flex-shrink-0" style={{ accentColor: '#1360d2' }} />
        <span className="text-[14px] text-[#455174]" style={{ lineHeight: 1.7 }}>
          Lorem ipsum dolor sit amet consectetur. Et scelerisque montes turpis phasellus pulvinar dui vitae. Augue enim
          id nullam faucibus adipiscing venenatis. Ut cras ut enim morbi. Morbi nibh morbi sed id vitae accumsan id non
          adipiscing.
          <br />
          We undertake to retain the copies of the personal documents given in the above form.
        </span>
      </label>

      <div className="flex justify-end gap-[16px] mt-[32px]">
        <button data-secondary-btn type="button" onClick={onClose}
          className="h-[48px] px-[36px] rounded-[4px] border bg-white text-[16px] transition-colors"
          style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}
        >Reset</button>
        <button type="button" onClick={() => { onSubmit?.(); onClose(); }}
          className="h-[48px] px-[40px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Submit</button>
      </div>
    </DeclarationModal>
  );
}
