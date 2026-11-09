import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TraderIcon, ShippingAgentIcon, AirlineAgentIcon, OtherAgentIcon } from '../components/AgentIcons';
import bannerBg from '../assets/banner.png';

const AGENT_OPTIONS = [
  'Clearing Agent',
  'Freight Forwarder',
  'Customs Broker',
  'Transporter',
  'Warehouse Operator',
  'Container Freight Station',
];

type CardProps = {
  label: string;
  icon: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

function CustomerCard({ label, icon, selected, onClick }: CardProps) {
  return (
    <button
      onClick={onClick}
      className={`relative bg-white rounded-[12px] w-full max-w-[230px] h-[220px] flex flex-col items-start justify-between overflow-hidden transition-all
        ${selected ? 'border-2 border-[#1360d2] shadow-[0_8px_24px_-4px_rgba(19,96,210,0.25)]' : 'border-2 border-[#ddd] hover:border-[#0e1b3d]'}`}
    >
      <div className="absolute top-0 right-0 w-[64px] h-[64px] overflow-hidden pointer-events-none">
        <div className="absolute -top-[32px] -right-[32px] w-[64px] h-[64px] rounded-full border-[3px] border-[#ea2428]" />
      </div>
      <div className="flex-1 flex items-center justify-center w-full pt-[20px]">{icon}</div>
      <div className="w-full bg-[#f9f9f9] flex items-center justify-center p-[10px] text-[#0e1b3d] font-medium text-[18px] leading-[20px] text-center capitalize">
        {label}
      </div>
    </button>
  );
}

export default function OtherAgentTypePage() {
  const [selected, setSelected] = useState<string>('');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-10 lg:px-[60px] py-12 bg-[#f8fafd]">
      <div className="bg-white w-full max-w-[1280px] rounded-lg overflow-hidden shadow-2xl">
        <div className="bg-[#0e1b3d] px-6 py-5 flex items-center justify-between">
          <h2 className="text-[#f8fafd] font-medium text-[20px]">Customer List</h2>
          <button onClick={() => navigate('/customer-type')} className="text-white text-[24px] hover:opacity-80">
            ✕
          </button>
        </div>
        <div className="px-12 py-12">
          <h3 className="text-[#0e1b3d] text-[24px] font-semibold text-center mb-10">
            Hi User, Select Your Customer Type to Access the Services
          </h3>
          <div className="max-w-[1080px] mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 place-items-center mb-12">
              <CustomerCard label="Trader" onClick={() => navigate('/landing/trader')} icon={<TraderIcon size={72} />} />
              <CustomerCard label="Shipping Agent" onClick={() => navigate('/landing/shipping-agent')} icon={<ShippingAgentIcon size={72} />} />
              <CustomerCard label="Airline Agent" onClick={() => navigate('/landing/airline-agent')} icon={<AirlineAgentIcon size={72} />} />
              <CustomerCard label="Select Other Agent Types" selected icon={<OtherAgentIcon size={72} />} />
            </div>

            <h4 className="text-[#0e1b3d] text-[18px] font-semibold mb-6">
              In case of other agent type, choose from the dropdown below,
            </h4>

            <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
              <div className="relative flex-1 w-full md:max-w-[469px]">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[12px] z-10">
                  <span className="text-[#dc3545]">*</span>
                  <span className="text-[#49454f]"> Select Customer</span>
                </label>
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="w-full h-[56px] border border-[#d5ddfb] rounded px-4 text-[16px] outline-none focus:border-[#0e1b3d] bg-white appearance-none"
                >
                  <option value="">Searchable Dropdown</option>
                  {AGENT_OPTIONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
                <svg viewBox="0 0 24 24" className="absolute right-4 top-1/2 -translate-y-1/2 size-[24px] pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>

              <div className="relative w-full md:w-[376px]">
                <label className="absolute -top-2 left-3 bg-white px-1 text-[12px] text-[#49454f] z-10">Customer</label>
                <div className="w-full h-[56px] border border-[#d5ddfb] rounded px-4 flex items-center text-[16px] bg-[#f8fafd] text-[#49454f]">
                  {selected || 'Agent type as selected'}
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/landing/other-agent')}
              disabled={!selected}
              className="bg-[#1360d2] disabled:bg-[#1360d2]/50 disabled:cursor-not-allowed text-white px-8 py-4 rounded font-medium text-[16px] capitalize w-[163px] hover:bg-[#0f4fb3] transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
