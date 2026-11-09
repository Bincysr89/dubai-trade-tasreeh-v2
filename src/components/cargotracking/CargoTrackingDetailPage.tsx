import { useState } from 'react';
import Header from '../Header';
import BackToListingBar from '../BackToListingBar';
import { JOURNEY_STAGES, type CargoSearchResult } from './cargoTrackingData';

const font = "'Dubai', sans-serif";

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Cleared:   { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  Cancelled: { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

type Props = {
  result: CargoSearchResult;
  onBack: () => void;
  onBackToListing: () => void;
};

/* ── Milestone icons — one per journey stage, shown inside the timeline node ── */
const STAGE_ICONS: ((color: string) => React.ReactNode)[] = [
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l1.5-4h15L21 17M6 13V8h12v5M12 3v5" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3h9l3 3v15H6z" /><path d="M9 10h6M9 14h6" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="18" height="9" rx="1" /><path d="M7 9V6a2 2 0 012-2h6a2 2 0 012 2v3" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16v11H4z" /><path d="M4 7l8 6 8-6" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M9 12l2 2 4-4" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M8 2v4M16 2v4M3 10h18" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="18" height="9" rx="1" /><path d="M7 18v2M17 18v2" /></svg>,
  c => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.5 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.5-1.5z" /></svg>,
];

function FieldStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-[4px]">
      <span className="text-[13px] text-[#8f94ae] whitespace-nowrap" style={{ fontFamily: font }}>{label}</span>
      <span className="text-[15px] text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font, fontWeight: 600 }}>{value}</span>
    </div>
  );
}

export default function CargoTrackingDetailPage({ result, onBack, onBackToListing }: Props) {
  const st = STATUS_STYLE[result.status];
  const d = result.detail;
  const [containersOpen, setContainersOpen] = useState(false);

  const stages: { label: string; fields: { label: string; value: string }[]; containers?: { containerNo: string; releasedDate: string }[] }[] = [
    { label: JOURNEY_STAGES[0], fields: [
      { label: 'Rotation Number', value: d.vessel.rotationNumber },
      { label: 'Expected Time Of Arrival', value: d.vessel.eta },
      { label: 'Actual Time of Arrival', value: d.vessel.ata },
    ] },
    { label: JOURNEY_STAGES[1], fields: [
      { label: 'BOL Number', value: d.manifest.bolNumber },
      { label: 'BOL Submission Agent', value: d.manifest.submissionAgent },
      { label: 'BOL Submission Date', value: d.manifest.submissionDate },
    ] },
    { label: JOURNEY_STAGES[2], fields: [
      { label: 'Container Category Status', value: d.discharge.containerCategoryStatus },
      { label: 'No. Of Containers', value: d.discharge.noOfContainers },
    ] },
    { label: JOURNEY_STAGES[3], fields: [
      { label: 'Issue Date', value: d.delivery.issueDate },
      { label: 'Consignee', value: d.delivery.consignee },
      { label: 'Expiry Date', value: d.delivery.expiryDate },
    ] },
    { label: JOURNEY_STAGES[4], fields: [
      { label: 'Declaration Number', value: result.declarationNo },
      { label: 'Submission Date', value: result.submissionDate },
      { label: 'Clearance Date', value: result.clearanceDate },
    ] },
    { label: JOURNEY_STAGES[5], fields: [
      { label: 'Booking Date', value: d.inspectionBooking.bookingDate },
      { label: 'Booking Status', value: d.inspectionBooking.bookingStatus },
    ] },
    { label: JOURNEY_STAGES[6], fields: [
      { label: 'Cargo Released', value: d.cargoRelease.released },
      { label: 'Last Release Date', value: d.cargoRelease.lastReleaseDate },
    ], containers: d.cargoRelease.containers },
    { label: JOURNEY_STAGES[7], fields: [
      { label: 'Inspection Status', value: d.inspectionResult.inspectionStatus },
      { label: 'Inspection Approval Date', value: d.inspectionResult.approvalDate },
      { label: 'Declaration Status', value: result.status },
    ] },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBackToListing} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-[32px]">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[16px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBackToListing}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">Cargo Tracking</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        {/* Cargo summary header */}
        <div className="bg-white rounded-[8px] p-[24px] mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-center gap-[14px] flex-wrap mb-[10px]">
            <div className="size-[44px] rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#e2ebf9' }}>
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="5" r="2" /><path d="M12 7v11M8 12H5a7 7 0 007 7 7 7 0 007-7h-3" />
              </svg>
            </div>
            <h1 className="text-[24px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>{result.transportDocNo}</h1>
            <span className="px-[12px] py-[4px] rounded-[4px] text-[16px] font-medium" style={{ background: '#e2ebf9', color: '#1360d2', fontFamily: font }}>
              {result.channel} {result.movement}
            </span>
            <span className="inline-flex items-center gap-[5px] px-[12px] py-[4px] rounded-[4px] text-[16px] font-medium" style={{ background: st.bg, color: st.color, fontFamily: font }}>
              <span className="size-[6px] rounded-full flex-shrink-0" style={{ background: st.color }} />
              {result.status}
            </span>
          </div>
          <div className="flex items-center gap-[20px] flex-wrap text-[14px] text-[#697498]" style={{ fontFamily: font, paddingLeft: 58 }}>
            <span>Declaration: <b style={{ color: '#0e1b3d' }}>{result.declarationNo}</b></span>
            <span>Submitted: <b style={{ color: '#0e1b3d' }}>{result.submissionDate}</b></span>
            <span>Cleared: <b style={{ color: '#0e1b3d' }}>{result.clearanceDate}</b></span>
          </div>
        </div>

        {/* Cargo journey — vertical milestone tracker */}
        <div className="bg-white rounded-[8px] p-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <p className="text-[18px] text-[#0e1b3d] mb-[24px]" style={{ fontFamily: font, fontWeight: 700 }}>Cargo Journey</p>

          {stages.map((stage, i) => {
            const done = i < d.currentStageIndex;
            const current = i === d.currentStageIndex;
            const isLast = i === stages.length - 1;
            const nodeColor = done ? '#28a745' : current ? '#1360d2' : '#fff';
            const ringColor = done ? '#28a745' : current ? '#1360d2' : '#d5ddfb';
            const iconColor = done || current ? '#fff' : '#a1aebe';
            const labelColor = done ? '#219653' : current ? '#1360d2' : '#8f94ae';

            return (
              <div key={stage.label} className="flex gap-[16px]">
                {/* Node + connecting line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className="size-[36px] rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: nodeColor,
                      border: `2px solid ${ringColor}`,
                      boxShadow: current ? '0 0 0 4px rgba(19,96,210,0.14)' : 'none',
                    }}
                  >
                    {STAGE_ICONS[i](iconColor)}
                  </div>
                  {!isLast && (
                    <div className="flex-1 w-[2px] min-h-[28px]" style={{ background: done ? '#28a745' : '#e0e6f5' }} />
                  )}
                </div>

                {/* Stage content */}
                <div className={isLast ? 'flex-1 min-w-0' : 'flex-1 min-w-0 pb-[24px]'}>
                  <div className="flex items-center gap-[10px] flex-wrap" style={{ paddingTop: 6, marginBottom: stage.fields.length ? 10 : 0 }}>
                    <span className="text-[16px]" style={{ fontFamily: font, fontWeight: 700, color: labelColor }}>{stage.label}</span>
                    {current && (
                      <span className="px-[10px] py-[2px] rounded-[12px] text-[13px] font-medium" style={{ background: '#e2ebf9', color: '#1360d2', fontFamily: font }}>
                        In Progress
                      </span>
                    )}
                  </div>
                  {stage.fields.length > 0 && (done || current) && (
                    <div className="rounded-[6px] p-[14px]" style={{ background: '#f8fafd', border: '1px solid #eef1f6' }}>
                      <div className="flex flex-wrap gap-x-[36px] gap-y-[12px]">
                        {stage.fields.map(f => <FieldStat key={f.label} label={f.label} value={f.value} />)}
                      </div>

                      {stage.containers && stage.containers.length > 0 && (
                        <div className="mt-[14px] pt-[12px]" style={{ borderTop: '1px solid #eef1f6' }}>
                          <button
                            type="button"
                            onClick={() => setContainersOpen(v => !v)}
                            className="inline-flex items-center gap-[6px] text-[14px] hover:underline"
                            style={{ fontFamily: font, fontWeight: 500, color: '#1360d2' }}
                          >
                            List of containers released
                            <svg
                              viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                              style={{ transform: containersOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
                            >
                              <path d="M5 7.5l5 5 5-5" />
                            </svg>
                          </button>

                          {containersOpen && (
                            <div className="mt-[10px] rounded-[6px] overflow-hidden bg-white" style={{ border: '1px solid #eef1f6', maxWidth: 480 }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                                <thead>
                                  <tr style={{ background: '#a6c2e9' }}>
                                    <th className="text-left px-[14px] py-[9px] text-[14px] text-[#051937]" style={{ fontWeight: 500 }}>Container Number</th>
                                    <th className="text-left px-[14px] py-[9px] text-[14px] text-[#051937]" style={{ fontWeight: 500 }}>Released Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {stage.containers.map(c => (
                                    <tr key={c.containerNo} style={{ borderTop: '1px solid #f0f4ff' }}>
                                      <td className="px-[14px] py-[9px] text-[14px] text-[#0e1b3d]">{c.containerNo}</td>
                                      <td className="px-[14px] py-[9px] text-[14px] text-[#0e1b3d]">{c.releasedDate}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <BackToListingBar onBack={onBack} onBackToListing={onBackToListing} />
    </div>
  );
}
