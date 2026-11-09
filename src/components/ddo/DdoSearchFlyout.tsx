interface Props {
  bol: string;
  setBol: (v: string) => void;
  shippingAgent: string;
  setShippingAgent: (v: string) => void;
  onClose: () => void;
  onSearch: () => void;
}

export default function DdoSearchFlyout({ bol, setBol, shippingAgent, setShippingAgent, onClose, onSearch }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-[rgba(14,27,61,0.7)]" onClick={onClose} />
      <div className="relative bg-white rounded-tl-[16px] rounded-tr-[16px] shadow-[0px_-20px_50px_rgba(0,0,0,0.15)]">
        <div className="border-b border-[#e5e7eb] flex items-center justify-between px-6 py-[22px]">
          <h2 className="text-[#1e2939] font-dubai font-bold text-[18px]">Search B/L</h2>
          <button onClick={onClose} className="text-[#6a7282] hover:text-[#1e2939] transition-colors">
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 pt-6 pb-8 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[#364153] font-dubai font-medium text-[16px]">Shipping Agent</label>
            <div className="relative">
              <svg viewBox="0 0 18 18" width="20" height="20" className="absolute right-3 top-1/2 -translate-y-1/2" fill="none">
                <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
              </svg>
              <input
                type="text"
                value={shippingAgent}
                onChange={e => setShippingAgent(e.target.value)}
                placeholder="Search shipping agent"
                className="w-full border border-[#d1d5dc] rounded-[10px] pl-4 pr-10 py-3 text-[16px] text-[#1e2939] placeholder-[#99a1af] outline-none focus:border-[#1360d2] font-dubai transition-colors"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#364153] font-dubai font-medium text-[16px]">B/L Number</label>
            <input
              type="text"
              value={bol}
              onChange={e => setBol(e.target.value)}
              placeholder="Enter B/L number"
              className="w-full border border-[#d1d5dc] rounded-[10px] px-4 py-3 text-[16px] text-[#1e2939] placeholder-[#99a1af] outline-none focus:border-[#1360d2] font-dubai transition-colors"
            />
          </div>
          <p className="text-[#6a7282] font-dubai text-[16px] text-center">2 requests available</p>
          <button
            onClick={onSearch}
            className="w-full bg-[#1360d2] text-white rounded-[14px] py-4 text-[16px] uppercase font-dubai font-bold shadow-[0px_10px_7.5px_rgba(0,0,0,0.1),0px_4px_3px_rgba(0,0,0,0.1)] hover:bg-[#1150b8] transition-colors"
          >
            Search &amp; Request
          </button>
        </div>
      </div>
    </div>
  );
}
