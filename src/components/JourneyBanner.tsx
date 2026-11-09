import importBySeaSrc from '../assets/importbysea.svg';
// @ts-ignore
import tradePlusSrc from '../assets/trade+.svg';
import integratedClearanceSrc from '../assets/integratedclearance.svg';
import paymentsSrc from '../assets/payments.svg';
import cargoWavesSrc from '../assets/cargowaves.svg';

const font = "'Dubai', 'Segoe UI', sans-serif";
const IMPORT_STEPS = [
  { src: tradePlusSrc, label: 'Trade +' },
  { src: integratedClearanceSrc, label: 'Integrated Clearance' },
  { src: paymentsSrc, label: 'Payments' },
  { src: cargoWavesSrc, label: 'Cargo Waves' },
];
const EXPORT_STEPS = [
  { src: tradePlusSrc, label: 'Booking and Execution' },
  { src: integratedClearanceSrc, label: 'Integrated Clearance' },
];

/* Journey stepper with completed / active states. exportVariant → Export by Air (2 steps). */
export function JourneyStepper({ active, exportVariant }: { active: number; exportVariant?: boolean }) {
  const STEPS = exportVariant ? EXPORT_STEPS : IMPORT_STEPS;
  return (
    <div className="bg-white rounded-[8px] px-[16px] py-[10px] flex items-center gap-[6px] w-full mb-[16px]" style={{ boxShadow: '0px 5px 32px 0px rgba(143,155,186,0.16)' }}>
      <div className="flex-1 min-w-0 overflow-x-auto no-scrollbar">
        <div className="flex items-center w-max mx-auto">
          <div className="flex items-center gap-[10px] flex-shrink-0">
            <img src={importBySeaSrc} alt="" className="h-[28px] w-auto" />
            <span className="text-[15px] font-medium text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{exportVariant ? 'Export by Air' : 'Import by Sea'}</span>
          </div>
          <div className="flex items-center flex-shrink-0 mx-[10px]"><svg viewBox="0 0 14 46" width="13" height="42" fill="none"><path d="M 3 2 Q 13 23 3 44" stroke="#e8212e" strokeWidth="1.5" strokeLinecap="round" fill="none" /></svg></div>
          {STEPS.map((s, i) => {
            const done = i < active;
            const isActive = i === active;
            return (
              <div key={s.label} className="flex items-center flex-shrink-0">
                {isActive ? (
                  <div className="flex items-center gap-[8px] px-[10px] py-[4px] rounded-[22px]" style={{ border: '2px solid #28a745', boxShadow: '0 0 16px 0 rgba(40,167,69,0.22)', background: '#fff' }}>
                    <div className="size-[32px] rounded-full border-2 border-[#28a745] flex items-center justify-center bg-white"><img src={s.src} alt="" className="size-[17px] object-contain" /></div>
                    <span className="text-[16px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>{s.label}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-[8px]">
                    <div className="size-[30px] rounded-full border-[1.5px] flex items-center justify-center bg-white relative" style={{ borderColor: done ? '#28a745' : '#c5cef7' }}>
                      <img src={s.src} alt="" className="size-[16px] object-contain" style={{ filter: done ? 'none' : 'opacity(0.5)' }} />
                      {done && <span className="absolute -bottom-[3px] -right-[3px] size-[14px] rounded-full bg-[#28a745] flex items-center justify-center"><svg viewBox="0 0 16 16" className="size-[9px]" fill="none" stroke="#fff" strokeWidth="2.6"><path d="M3 8l3.5 3.5L13 5" /></svg></span>}
                    </div>
                    <span className="text-[13px] whitespace-nowrap" style={{ fontFamily: font, color: done ? '#28a745' : '#5a6282', fontWeight: done ? 500 : 400 }}>{s.label}</span>
                  </div>
                )}
                {i < STEPS.length - 1 && (
                  i < active
                    ? <div className="mx-[10px] h-[2px] rounded-full" style={{ background: '#28a745', width: 90 }} />
                    : <div className="mx-[10px] flex items-center" style={{ width: 90 }}><div className="h-[1.5px] w-full rounded-full" style={{ background: '#c5cef7', borderTop: '1.5px dashed #9fd6b0' }} /></div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* Circular % ring */
function Ring({ percent }: { percent: number }) {
  const r = 22, C = 2 * Math.PI * r, off = C * (1 - percent / 100);
  return (
    <div className="relative flex-shrink-0" style={{ width: 56, height: 56 }}>
      <svg viewBox="0 0 56 56" width="56" height="56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e6eaf2" strokeWidth="5" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="#28a745" strokeWidth="5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={off} transform="rotate(-90 28 28)" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[13px] text-[#28a745]" style={{ fontWeight: 600, fontFamily: font }}>{percent}%</span>
    </div>
  );
}

/* Combined stepper + ring banner shown at the top of every journey success screen */
export default function JourneyProgress({ active, percent, title, subtitle, button, exportVariant }: {
  active: number; percent: number; title: string; subtitle: string; button: React.ReactNode; exportVariant?: boolean;
}) {
  return (
    <div>
      <JourneyStepper active={active} exportVariant={exportVariant} />
      <div className="bg-white rounded-[8px] px-[24px] py-[16px] flex items-center justify-between gap-[16px] flex-wrap mb-[20px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.10)' }}>
        <div className="flex items-center gap-[16px]">
          <Ring percent={percent} />
          <div><p className="text-[16px] text-[#0e1b3d]" style={{ fontWeight: 700, fontFamily: font }}>{title}</p><p className="text-[13px] text-[#8f94ae]" style={{ fontFamily: font }}>{subtitle}</p></div>
        </div>
        {button}
      </div>
    </div>
  );
}
