import React, { useEffect } from 'react';

export type VccDetails = {
  vccNo: string;
  printDate: string;
  chassis: string;
  engineNumber: string;
  modelYear: string;
  vehicleDrive: string;
  countryOfOrigin: string;
  color: string;
  color1: string;
  color2: string;
  color3: string;
  engineCapacity: string;
  carriageCapacity: string;
  passengerCapacity: string;
  vehicleModel: string;
  vehicleBrand: string;
  vehicleType: string;
  vccStatus: string;
  declarationNumber: string;
  declarationDate: string;
  ownerCode: string;
  ownerName: string;
  printRemarks: string;
  specificationStandardName: string;
  shipmentReferenceNumber: string;
};

type Props = {
  open: boolean;
  details?: VccDetails;
  onClose: () => void;
  onDownload?: () => void;
};

const Field = ({ label, value }: { label: string; value: string }) => (
  <div className="grid items-baseline gap-[16px]" style={{ gridTemplateColumns: '180px 1fr' }}>
    <span className="text-[16px] text-[#455174] whitespace-nowrap" style={{ fontFamily: "'Dubai', sans-serif" }}>{label} :</span>
    <span
      className="text-[16px] text-[#0e1b3d]"
      style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600, wordBreak: 'break-word' }}
    >
      {value || '-'}
    </span>
  </div>
);

export default function VccDetailsModal({ open, details, onClose, onDownload }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open || !details) return null;

  const leftCol: { label: string; value: string }[] = [
    { label: 'VCC No',                value: details.vccNo },
    { label: 'Chassis No',            value: details.chassis },
    { label: 'Model Year',            value: details.modelYear },
    { label: 'Country of Origin',     value: details.countryOfOrigin },
    { label: 'Engine Capacity',       value: details.engineCapacity },
    { label: 'Passenger Capacity',    value: details.passengerCapacity },
    { label: 'Vehicle Brand Name',    value: details.vehicleBrand },
    { label: 'VCC Status',            value: details.vccStatus },
    { label: 'Declaration Date',      value: details.declarationDate },
    { label: 'Owner Name',            value: details.ownerName },
  ];

  const rightCol: { label: string; value: string }[] = [
    { label: 'VCC Print Date',        value: details.printDate },
    { label: 'Engine Number',         value: details.engineNumber },
    { label: 'Vehicle Drive',         value: details.vehicleDrive },
    { label: 'Color',                 value: details.color },
    { label: 'Color 1-Color 2-Color 3', value: `${details.color1}-${details.color2}-${details.color3}` },
    { label: 'Carriage Capacity',     value: details.carriageCapacity },
    { label: 'Vehicle Model',         value: details.vehicleModel },
    { label: 'Vehicle Type',          value: details.vehicleType },
    { label: 'Declaration Number',    value: details.declarationNumber },
    { label: 'Owner Code',            value: details.ownerCode },
    { label: 'Print Remarks',         value: details.printRemarks },
    { label: 'Specification Standard Name', value: details.specificationStandardName },
  ];

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center px-[16px] py-[24px]"
      role="dialog"
      aria-modal="true"
      aria-label="View VCC Details"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(14, 27, 61, 0.55)', backdropFilter: 'blur(2px)' }}
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        className="relative bg-white rounded-[8px] flex flex-col overflow-hidden"
        style={{ width: 'min(1040px, 100%)', maxHeight: 'calc(100vh - 48px)', boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
      >
        {/* Header — navy bar */}
        <div className="bg-[#0e1b3d] flex items-center justify-between px-[20px] py-[16px] flex-shrink-0">
          <p className="text-[20px] text-[#f8fafd]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}>
            View VCC Details
          </p>
          <button
            onClick={onClose}
            aria-label="Close"
            className="size-[28px] inline-flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        {/* Section heading */}
        <div className="px-[24px] pt-[16px] pb-[8px] flex-shrink-0">
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 700 }}>
            VCC / Vehicle Details
          </p>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[16px]">
          <div className="grid gap-x-[40px] gap-y-[12px] grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col gap-[12px]">
              {leftCol.map((f) => <Field key={f.label} label={f.label} value={f.value} />)}
            </div>
            <div className="flex flex-col gap-[12px]">
              {rightCol.map((f) => <Field key={f.label} label={f.label} value={f.value} />)}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="bg-white px-[24px] py-[16px] flex justify-end gap-[12px] flex-shrink-0"
          style={{ borderTop: '1px solid #e2ebf9' }}
        >
          <button data-secondary-btn
            onClick={onClose}
            className="h-[48px] px-[24px] rounded-[4px] border border-[#1360d2] bg-white text-[#1360d2] transition-colors"
            style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16 }}
          >
            Close
          </button>
          {onDownload && (
            <button
              onClick={() => { onDownload(); }}
              className="h-[48px] px-[24px] rounded-[4px] bg-[#1360d2] text-white inline-flex items-center gap-[8px] hover:bg-[#0f4fab] transition-colors"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 16 }}
            >
              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 3v10" /><path d="M5 9l5 5 5-5" /><path d="M3 17h14" />
              </svg>
              Download VCC
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
