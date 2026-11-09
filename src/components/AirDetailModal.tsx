import { useState } from 'react';
import Header from './Header';
// @ts-ignore
import planeIconSrc from '../assets/Plane (5).svg';
import catalogueBg from '../assets/catalogue background.jpg';
import CargoInformationPage from './CargoInformationPage';
import DiscrepancyFeedbackListingPage from './discrepancy/DiscrepancyFeedbackListingPage';
import CargoTrackingContainer from './cargotracking/CargoTrackingContainer';

type Props = { onClose: () => void; onHome?: () => void; /** Open straight on a service (header search). */ initialItem?: string };

export const AIR_COLUMNS: { title: string; items: string[] }[] = [
  {
    title: 'Registration',
    items: ['Bonded Warehouse', 'DC - Manage Services'],
  },
  {
    title: 'Carrier Management',
    items: ['Booking & Execution', 'EK - Tracking', 'Flight Schedule', 'dnata - Tracking'],
  },
  {
    title: 'Cargo Management',
    items: ['HAWB Capture'],
  },
  {
    title: 'Cargo Clearance',
    items: [
      'Submit Cargo Information',
      'Provide Discrepancy Feedback', 'Cargo Tracking',
      'Acknowledgement', 'Cargo Transfer Services', 'Claim Services',
      'DC - Inspection Services', 'DC - Letter & Certificates',
      'DC - Smart Workspace', 'DC-Courier Batch',
    ],
  },
  {
    title: 'Payments',
    items: ['DC - Account Services', 'Deposit Refund', 'Standing Guarantee', 'e-Payment'],
  },
  {
    title: 'Miscellaneous',
    items: [
      'CUS - To be checked', 'CUS - To be removed', 'DC - To be checked',
      'Dashboard', 'EmiratesSky - To be confirmed', 'P2 GATE - EToken', 'Schedule Job',
    ],
  },
];

// Carrier Management items shown as favourited (filled star) in the Figma design
const STARRED = new Set(['Booking & Execution', 'EK - Tracking', 'Flight Schedule', 'dnata - Tracking']);
const UNSTARRED = new Set(['HAWB Capture']);

function Star({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 20 20" width="15" height="15" fill={filled ? '#f5a623' : 'none'} stroke={filled ? '#f5a623' : '#c7cede'} strokeWidth="1.5" className="flex-shrink-0">
      <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.8L10 14.77l-5.21 2.75 1-5.8-4.21-4.1 5.82-.85z" strokeLinejoin="round" />
    </svg>
  );
}

type PageKey = 'cgi' | 'discrepancy' | 'tracking';
export const AIR_ITEM_PAGE_MAP: Record<string, PageKey> = {
  'Submit Cargo Information': 'cgi',
  'Provide Discrepancy Feedback': 'discrepancy',
  'Cargo Tracking': 'tracking',
};
const HIGHLIGHTED = new Set(['Submit Cargo Information', 'Provide Discrepancy Feedback', 'Cargo Tracking']);

export default function AirDetailModal({ onClose, onHome, initialItem }: Props) {
  const [search, setSearch] = useState('');
  const [activePage, setActivePage] = useState<PageKey | null>(initialItem ? AIR_ITEM_PAGE_MAP[initialItem] ?? null : null);

  const filtered = AIR_COLUMNS.map(col => ({
    ...col,
    items: search
      ? col.items.filter(i => i.toLowerCase().includes(search.toLowerCase()))
      : col.items,
  })).filter(col => !search || col.items.length > 0);

  if (activePage === 'cgi') {
    return <CargoInformationPage onBack={() => setActivePage(null)} onHome={onHome ?? onClose} />;
  }
  if (activePage === 'discrepancy') {
    return <DiscrepancyFeedbackListingPage onBack={() => setActivePage(null)} />;
  }
  if (activePage === 'tracking') {
    return <CargoTrackingContainer onBack={() => setActivePage(null)} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
      {/* Full-page catalogue background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${catalogueBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Navigation header */}
      <div className="relative z-10 flex-shrink-0">
        <Header onServiceCatalogue={onClose} onHome={onHome ?? onClose} />
      </div>

      {/* Close button — top right below header */}
      <button
        onClick={onClose}
        className="absolute right-[16px] top-[96px] z-20 size-[36px] flex items-center justify-center text-[#0e1b3d] hover:opacity-60 transition-opacity"
        aria-label="Close"
      >
        <svg viewBox="0 0 24 24" className="size-[24px]" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Spacer above the AIR section */}
      <div className="relative z-10 flex-shrink-0 h-[60px]" />

      {/* Sub-nav + title area */}
      <div className="relative z-10 flex-shrink-0">
        <div className="relative flex items-center justify-center px-10 py-5">
          {/* Left: SEA navigation */}
          <a className="absolute left-10 flex items-center gap-3 cursor-pointer hover:opacity-80">
            <div
              className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </div>
            <span
              className="text-[#0a1852] text-[20px] uppercase tracking-wider"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400 }}
            >
              Sea
            </span>
          </a>

          {/* Center: icon + AIR + subtitle */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-3">
              <div
                className="bg-[#0e1b3d] border border-white flex items-center justify-center flex-shrink-0 rounded-[10px]"
                style={{ width: 40, height: 40, padding: 4 }}
              >
                <img src={planeIconSrc} alt="Air" style={{ width: 32, height: 32, filter: 'brightness(0) invert(1)' }} />
              </div>
              <span
                className="text-[#0a1852] text-[24px] uppercase font-bold"
                style={{ fontFamily: "'Dubai', sans-serif" }}
              >
                Air
              </span>
            </div>
            <p
              className="text-[#060c28] text-[20px] text-center mt-1"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400, letterSpacing: '0.2px' }}
            >
              Select from a wide variety of Air-based service journeys below.
            </p>
          </div>

          {/* Right: PAYMENTS navigation */}
          <a className="absolute right-10 flex items-center gap-3 cursor-pointer hover:opacity-80">
            <span
              className="text-[#0a1852] text-[20px] uppercase tracking-wider"
              style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 400 }}
            >
              Payments
            </span>
            <div
              className="size-[40px] rounded-full flex items-center justify-center text-white flex-shrink-0"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
            >
              <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </a>
        </div>

        {/* Search bar */}
        <div className="flex justify-center pb-5">
          <div className="relative w-full sm:w-[440px]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Services"
              className="w-full h-[48px] border border-[#d0d5e8] rounded-[8px] pl-4 pr-12 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-white focus:outline-none focus:border-[#0e1b3d]"
              style={{ fontFamily: "'Dubai', sans-serif" }}
            />
            <svg
              viewBox="0 0 18 18"
              width="20" height="20"
              className="absolute right-4 top-1/2 -translate-y-1/2"
              fill="none"
            >
              <path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D" />
            </svg>
          </div>
        </div>
      </div>

      {/* Service columns — whole card scrolls */}
      <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-10 lg:px-[60px] pt-6 pb-6">
        {/* Gradient border wrapper */}
        <div
          className="rounded-[14px] p-[3px]"
          style={{
            background: 'linear-gradient(135deg, rgba(19,96,210,1) 0%, rgba(255,255,255,1) 50%, rgba(232,44,42,1) 100%)',
          }}
        >
          <div
            className="bg-white rounded-[12px] overflow-x-auto"
            style={{ boxShadow: '0 4px 15.5px rgba(0,0,0,0.08)' }}
          >
            <div className="flex divide-x divide-[#e8eaf0] w-full">
              {filtered.map(col => (
                <div key={col.title} className="flex-1 flex flex-col px-3 pt-6 pb-4">
                  {/* Column header */}
                  <div className="mb-5">
                    <p
                      className="text-[#0e1b3d] text-[16px] font-medium leading-6 whitespace-nowrap"
                      style={{ fontFamily: "'Dubai', sans-serif", letterSpacing: '0.18px' }}
                    >
                      {col.title}
                    </p>
                    <div className="w-6 h-[2px] bg-[#e8212e] mt-1" />
                  </div>
                  {/* Items */}
                  <div className="flex flex-col gap-[8px]">
                    {col.items.map(item => {
                      const pageKey = AIR_ITEM_PAGE_MAP[item];
                      const isHighlighted = HIGHLIGHTED.has(item);
                      const showStar = STARRED.has(item) || UNSTARRED.has(item);
                      return (
                        <button
                          key={item}
                          onClick={pageKey ? () => setActivePage(pageKey) : undefined}
                          className={`text-left px-[10px] rounded-[4px] text-[16px] transition-colors flex items-center justify-between gap-[8px] ${
                            isHighlighted
                              ? 'bg-[#dce9ff] border border-[#1360d2] text-[#1360d2] hover:bg-[#c5d9ff] font-medium'
                              : 'bg-[#f7faff] text-[#0e1b3d] hover:bg-[#d6e6ff]'
                          }`}
                          style={{
                            fontFamily: "'Dubai', sans-serif",
                            letterSpacing: '0.14px',
                            lineHeight: '24px',
                            cursor: pageKey ? 'pointer' : 'default',
                            minHeight: 40,
                          }}
                        >
                          <span>{item}</span>
                          {showStar && <Star filled={STARRED.has(item)} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
