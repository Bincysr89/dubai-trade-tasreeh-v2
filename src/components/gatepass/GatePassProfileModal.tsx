import { useEffect, useState } from 'react';
import { font } from './GateFields';
import Header from '../Header';
import { SimulateFlowPanel } from '../AgentProfilePicker';
import type { Persona } from '../../persona';

/* ──────────────────────────────────────────────────────────────
   Company users opening Tasreeh - Gate Passes choose who the
   passes are for: themselves (Individual) or the company
   (Host / Visitor company flow).
   ────────────────────────────────────────────────────────────── */
export type GatePassProfile = 'individual' | 'company';

const OPTIONS: { id: GatePassProfile; label: string; sub: string; icon: JSX.Element }[] = [
  {
    id: 'individual', label: 'Visitor', sub: 'Apply and manage gate passes for yourself',
    icon: (
      <svg viewBox="0 0 48 48" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="24" cy="16" r="7.5" /><path d="M9.5 41c1.4-8 7.3-12.5 14.5-12.5S37.1 33 38.5 41" />
      </svg>
    ),
  },
  {
    id: 'company', label: 'Company (Host/Visitor)', sub: 'Apply, approve and manage gate passes for your company',
    icon: (
      <svg viewBox="0 0 48 48" width="52" height="52" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 42h36M10 42V14l14-6v34M24 42V18l14 5v19" /><path d="M15 18h4M15 25h4M15 32h4M29 27h4M29 34h4" />
      </svg>
    ),
  },
];

/* Shown on its own page: website header over a plain white background, the popup centred on it */
export default function GatePassProfileModal({ onClose, onHome, onPick }: {
  onClose: () => void; onHome: () => void;
  /** individual, or the company flow chosen in the simulate popup */
  onPick: (p: Extract<Persona, 'individual' | 'visitor-company' | 'host-company'>) => void;
}) {
  const [picked, setPicked] = useState<GatePassProfile | null>(null);
  /* Company → simulate the Visitor Company or Host Company flow (design walkthrough only) */
  const [simulate, setSimulate] = useState(false);
  const choose = (p: GatePassProfile) => {
    setPicked(p);
    setTimeout(() => (p === 'company' ? setSimulate(true) : onPick('individual')), 150);
  };

  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key !== 'Escape') return; if (simulate) { setSimulate(false); setPicked(null); } else onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, simulate]);

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onHome={onHome} /></div>
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
    {simulate ? (
      <SimulateFlowPanel onClose={() => { setSimulate(false); setPicked(null); }}
        onPick={f => onPick(f.persona as 'visitor-company' | 'host-company')} />
    ) : (
    <div role="dialog" aria-modal="true" aria-label="Choose Profile Type"
      className="bg-white rounded-[10px] w-full max-w-[720px] overflow-hidden"
      style={{ boxShadow: '0 12px 40px rgba(14,27,61,0.16)', border: '1px solid #e8edf5' }}>
      <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ background: '#0e1b3d' }}>
        <h3 className="text-[18px] text-white font-medium" style={{ fontFamily: font }}>Choose Profile Type</h3>
        <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>
      </div>
      <div className="px-[24px] sm:px-[36px] pt-[28px] pb-[36px]" style={{ fontFamily: font }}>
        <p className="text-[20px] font-bold text-[#0e1b3d] text-center">Choose the profile type for Gate Pass services</p>
        <p className="text-[15px] text-[#5a6478] text-center mt-[6px] mb-[28px]">Tasreeh - Gate Passes</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]" role="radiogroup" aria-label="Gate pass profile type">
          {OPTIONS.map(o => {
            const on = picked === o.id;
            return (
              <button key={o.id} role="radio" aria-checked={on} onClick={() => choose(o.id)}
                className="group relative flex flex-col items-center text-center gap-[14px] rounded-[10px] px-[20px] pt-[30px] pb-[26px] transition-all hover:-translate-y-[2px]"
                style={{
                  border: `1.5px solid ${on ? '#1360d2' : '#d5ddfb'}`,
                  background: on ? '#eef4ff' : '#fff',
                  boxShadow: on ? '0 6px 20px rgba(19,96,210,0.16)' : '0 2px 10px rgba(143,155,186,0.12)',
                }}>
                <span className="size-[88px] rounded-full flex items-center justify-center transition-colors group-hover:text-[#1360d2]"
                  style={{ background: on ? '#dce9ff' : '#f3f6fc', color: on ? '#1360d2' : '#0e1b3d' }}>
                  {o.icon}
                </span>
                <span className="text-[18px] font-medium text-[#0e1b3d]">{o.label}</span>
                <span className="w-6 h-[2px] bg-[#ea2428] rounded-full" />
                <span className="text-[14px] text-[#5a6478] leading-[20px]">{o.sub}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
    )}
      </div>
    </div>
  );
}
