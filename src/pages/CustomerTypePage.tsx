import { setPersona } from '../persona';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthenticated } from '../auth';
import { AgentProfilePanel, rememberAgentProfile, type AgentProfile } from '../components/AgentProfilePicker';

/* ──────────────────────────────────────────────────────────────
   After-login "Select Agent Profile" popup. Each agent profile
   keeps its Tasreeh persona flow:
   1298 Tasreeh → Visitor Company · Air Clearing Agent → Visitor Company ·
   DCAA Member → Host Company · Other Agent Type → Other
   ────────────────────────────────────────────────────────────── */
export default function CustomerTypePage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string>('trader');
  const go = (persona: AgentProfile['persona'], route: string, profileId: string) => {
    setPersona(persona);
    rememberAgentProfile(profileId);
    setTimeout(() => navigate(route), 150);
  };

  const close = () => {
    setAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      <AgentProfilePanel
        selected={selected}
        onClose={close}
        onPick={p => {
          setSelected(p.id);
          go(p.persona, p.route, p.id);
        }}
      />
    </div>
  );
}
