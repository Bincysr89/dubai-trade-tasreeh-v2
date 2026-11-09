import type { ReactNode } from 'react';
import type { Persona } from '../persona';

/* ──────────────────────────────────────────────────────────────
   "Select Agent Profile" cards — shared by the after-login popup
   (CustomerTypePage) and the landing page's profile switcher.
   Each agent profile keeps its Tasreeh persona flow.
   ────────────────────────────────────────────────────────────── */
export type AgentProfile = {
  id: string; label: string; company: string; persona: Persona; route: string;
};

export const AGENT_PROFILES: AgentProfile[] = [
  { id: 'trader',   label: '1298 - Tasreeh - Company Name',                                  company: 'Company Name',              persona: 'visitor-company', route: '/landing/shipping-agent' },
  { id: 'shipping', label: '16545641654 - Air - Clearing Agent - SWBRO01 M&M Private L.L.C', company: 'SWBRO01 M&M Private L.L.C', persona: 'visitor-company', route: '/landing/shipping-agent' },
  { id: 'airline',  label: '32704 - DCAA Member - Sandbox Company no 1',                      company: 'Sandbox Company no 1',      persona: 'host-company',    route: '/landing/airline-agent' },
  { id: 'other',    label: 'Select Other Agent Type',                                         company: 'Company Name',              persona: 'other',           route: '/other-agent-type' },
];

/* Remember which card was picked (two profiles share the Visitor Company flow) */
const KEY = 'dt-agent-profile';
export function rememberAgentProfile(id: string) { try { sessionStorage.setItem(KEY, id); } catch { /* ignore */ } }
export function rememberedAgentProfile(): string | null { try { return sessionStorage.getItem(KEY); } catch { return null; } }

/* Agent profile icon — building grid over a person, inside an open circle */
export const AgentProfileIcon = () => (
  <svg viewBox="0 0 72 72" width="72" height="72" fill="none" aria-hidden="true">
    <path d="M10 58A34 34 0 1 1 62 58" stroke="#1a1a1a" strokeWidth="1.3" />
    {([[22, 16, '#1a1a1a'], [32, 16, '#ea2428'], [42, 16, '#1a1a1a'], [22, 27, '#ea2428'], [42, 27, '#ea2428']] as const).map(([x, y, c], i) => (
      <rect key={i} x={x} y={y} width="8" height="8" stroke={c} strokeWidth="1.4" />
    ))}
    <circle cx="36" cy="32" r="5" stroke="#1a1a1a" strokeWidth="1.4" />
    <path d="M24 58v-8c0-5 4-9 9-9h6c5 0 9 4 9 9v8M33 41l3 5 3-5M36 46v9" stroke="#1a1a1a" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
);

export function AgentCard({ label, selected, onClick, hoverClass = 'hover:border-[#0e1b3d]', icon }: {
  label: string; selected?: boolean; onClick: () => void; hoverClass?: string; icon?: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`relative bg-white rounded-[12px] w-full max-w-[228px] h-[294px] flex flex-col overflow-hidden transition-all
        ${selected ? 'border-2 border-[#1360d2] shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]' : `border-2 border-[#ddd] ${hoverClass}`}`}
    >
      {/* thin red corner curve */}
      <span className="absolute top-0 right-0 w-[78px] h-[56px] overflow-hidden pointer-events-none">
        <span className="absolute -top-[56px] -right-[78px] w-[156px] h-[112px] rounded-full border border-[#ea2428]" />
      </span>
      <span className="flex-1 flex items-end justify-center pb-[24px]">
        {icon ?? <AgentProfileIcon />}
      </span>
      <span className="w-full min-h-[100px] bg-[#f9f9f9] flex items-center justify-center px-[14px] py-[12px] text-center">
        <span className="text-[#0e1b3d] font-medium text-[17px] leading-[24px] line-clamp-3">{label}</span>
      </span>
      <span className="h-[20px] flex-shrink-0" />
    </button>
  );
}

/* Popup shell: navy title bar with a circled close, then the body */
function PanelShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="bg-white w-full max-w-[1260px] rounded-lg overflow-hidden shadow-2xl" role="dialog" aria-label={title}>
      <div className="bg-[#0e1b3d] px-[16px] h-[62px] flex items-center justify-between">
        <h2 className="text-white font-bold text-[22px]">{title}</h2>
        <button onClick={onClose} aria-label="Close" className="text-white hover:opacity-70">
          <svg viewBox="0 0 28 28" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="14" cy="14" r="12" /><path d="M10 10l8 8M18 10l-8 8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <div className="px-6 sm:px-12 pt-[60px] pb-[64px]">{children}</div>
    </div>
  );
}

/* The popup body: navy title bar, heading and the four cards */
export function AgentProfilePanel({ selected, onPick, onClose, hoverClass }: {
  selected: string; onPick: (p: AgentProfile) => void; onClose: () => void; hoverClass?: string;
}) {
  return (
    <PanelShell title="Select Agent Profile" onClose={onClose}>
      <h3 className="text-[#0e1b3d] text-[24px] sm:text-[26px] font-medium text-center mb-[56px]">
        Hi User, Please select agent profile to access services
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-[44px] max-w-[1040px] mx-auto place-items-center">
        {AGENT_PROFILES.map(p => (
          <AgentCard key={p.id} label={p.label} selected={selected === p.id} hoverClass={hoverClass} onClick={() => onPick(p)} />
        ))}
      </div>
    </PanelShell>
  );
}

/* Gate Pass → Company: choose which Tasreeh flow to simulate (design walkthrough only) */
export const SIMULATE_FLOWS: { id: string; label: string; persona: Persona; route: string }[] = [
  { id: 'sim-visitor', label: 'Simulate the Visitor Company Flow', persona: 'visitor-company', route: '/landing/shipping-agent' },
  { id: 'sim-host',    label: 'Simulate Host Company Flow',        persona: 'host-company',    route: '/landing/airline-agent' },
];

/* Kept deliberately plain — a prototype switch, not part of the product design */
export function SimulateFlowPanel({ onPick, onClose }: {
  onPick: (f: typeof SIMULATE_FLOWS[number]) => void; onClose: () => void;
}) {
  return (
    <div className="bg-white w-full max-w-[480px] mx-auto rounded-[8px] p-[28px] relative shadow-2xl" role="dialog" aria-label="Simulate flow">
      <button onClick={onClose} aria-label="Close" className="absolute right-[16px] top-[16px] text-[#5a6478] hover:text-[#0e1b3d]">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
      </button>
      <p className="text-[18px] font-medium text-[#0e1b3d] pr-[28px] mb-[20px] leading-[26px]">
        This is only to simulate the flow from a design perspective, not for development.
      </p>
      <div className="flex flex-col gap-[10px]">
        {SIMULATE_FLOWS.map(f => (
          <button key={f.id} onClick={() => onPick(f)}
            className="h-[44px] rounded-[4px] border border-[#c9d2e3] text-[15px] text-[#0e1b3d] hover:border-[#1360d2] hover:text-[#1360d2]">
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}
