import React, { useState } from 'react';
import Header from './Header';
import BackToListingBar from './BackToListingBar';

const font = "'Dubai', sans-serif";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  'Submitted':        { bg: 'rgba(19,96,210,0.10)',   color: '#1360d2' },
  'Under Processing': { bg: 'rgba(255,169,26,0.16)',  color: '#b45309' },
  'Approved':         { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
  'Rejected':         { bg: 'rgba(192,57,43,0.10)',   color: '#c0392b' },
  'Cancelled':        { bg: 'rgba(105,116,152,0.10)', color: '#697498' },
  'Active':           { bg: 'rgba(40,167,69,0.10)',   color: '#28a745' },
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
      <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>{value || '—'}</span>
    </div>
  );
}

export type CarrierMovementRow = Record<string, string | boolean | undefined> & { flightNo: string; status: string };

type Props = {
  row: CarrierMovementRow;
  onBack: () => void;
  onBackToListing: () => void;
};

const str = (v: string | boolean | undefined) => typeof v === 'string' ? v : '';

export default function CarrierMovementViewPage({ row, onBack, onBackToListing }: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const status = cancelled ? 'Cancelled' : str(row.status);
  const st = STATUS_STYLE[status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
  const canCancel = !cancelled && status !== 'Rejected' && status !== 'Cancelled';

  if (cancelled) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col bg-[#f8fafd]">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>
        <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
          <div className="flex items-center gap-[6px]">
            <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Service Catalog</span>
            <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
            <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Submit Cargo Information</span>
          </div>
          <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>A180-IMPORTER SONY GULF UAE</span>
          </div>
        </div>
        <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
          <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Carrier Movement</h1>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
          <div className="bg-white rounded-[8px] flex flex-col items-center gap-[16px] py-[56px] px-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="size-[72px] rounded-full flex items-center justify-center" style={{ background: '#d1f5df' }}>
              <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#28a745" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l6 6L20 6" /></svg>
            </div>
            <p className="text-[22px]" style={{ color: '#28a745', fontFamily: font, fontWeight: 700 }}>Carrier Movement Cancelled Successfully</p>
            <div className="rounded-[6px] px-[24px] py-[16px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
              <p className="text-[16px] text-[#455174] text-center" style={{ fontFamily: font }}>Dear Customer Thank You For Using Carrier Movement Request Web Application.</p>
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
      <div className="flex items-center justify-between px-4 sm:px-10 pt-[24px] pb-[8px] flex-wrap gap-[12px] flex-shrink-0">
        <div className="flex items-center gap-[6px]">
          <button onClick={onBack} className="text-[16px] text-[#8f94ae] hover:underline" style={{ fontFamily: font }}>Home</button>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>Service Catalog</span>
          <span className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>/</span>
          <span className="text-[16px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Submit Cargo Information</span>
        </div>
        <div className="bg-[#e2ebf9] rounded-[4px] h-[28px] px-[12px] flex items-center">
          <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>AE-1019056- Dubai Customs - Test LLC</span>
        </div>
      </div>

      <div className="flex items-center gap-[10px] px-4 sm:px-10 mb-[16px] flex-shrink-0">
        <h1 className="text-[28px] text-[#111838]" style={{ fontFamily: font, fontWeight: 500 }}>Carrier Movement</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px] flex flex-col gap-[20px]">
        <div className="bg-white rounded-[8px] p-[24px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <Field label="Flight Number" value={str(row.flightNo)} />
          <div className="flex flex-col gap-[4px]">
            <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Request Status</span>
            <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium w-fit" style={{ background: st.bg, color: st.color, fontFamily: font }}>{status}</span>
          </div>
          <Field label="Arrival/ Departure" value={str(row.arrDep)} />
        </div>

        <div className="bg-white rounded-[8px] p-[24px] flex flex-col gap-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <p className="text-[18px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 700 }}>Flight Information</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[20px]">
            <Field label="Schedule Date of Arrival" value={str(row.scheduleDate)} />
            <Field label="Estimated Time of Arrival" value={str(row.eta)} />
            <Field label="Actual Time of Arrival" value={str(row.ata)} />
            <Field label="Airport of Loading" value={str(row.airportLoading)} />
            <Field label="Airport of Unloading" value={str(row.airportUnloading)} />
            <Field label="Aircraft Type" value={str(row.aircraftType)} />
          </div>
        </div>
      </div>

      <BackToListingBar
        onBackToListing={onBackToListing}
        rightContent={canCancel ? (
          <button onClick={() => setConfirmOpen(true)}
            className="h-[48px] px-[28px] rounded-[4px] text-[16px] text-white transition-colors"
            style={{ background: '#1360d2', fontFamily: font, fontWeight: 500, boxShadow: '0px 0px 8px rgba(28,72,191,0.16)' }}>
            Cancel Request
          </button>
        ) : undefined}
      />

      {confirmOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50" onClick={() => setConfirmOpen(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-[10px] flex flex-col items-center gap-[20px] px-[40px] py-[36px] max-w-[460px] mx-[16px]"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.18)', fontFamily: font }}>
            <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: '#dc3545' }}>
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" />
              </svg>
            </div>
            <div className="text-center flex flex-col gap-[8px]">
              <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 700 }}>Are you sure you want to delete the carrier movement?</p>
              <p className="text-[16px] text-[#455174]" style={{ lineHeight: 1.4 }}>Flight Number: {str(row.flightNo)}</p>
            </div>
            <div className="flex gap-[12px]">
              <button data-secondary-btn onClick={() => setConfirmOpen(false)}
                className="h-[48px] px-[36px] rounded-[4px] border text-[16px] bg-white transition-colors"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontWeight: 500 }}>
                Back
              </button>
              <button onClick={() => { setConfirmOpen(false); setCancelled(true); }}
                className="h-[48px] px-[36px] rounded-[4px] text-[16px] text-white transition-colors"
                style={{ background: '#1360d2', fontWeight: 500 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
