import { useState } from 'react';
import Header from './Header';
import SeaDetailModal from './SeaDetailModal';
import AirDetailModal from './AirDetailModal';
import SupplierDetailModal from './SupplierDetailModal';
import paymentsImg from '../assets/payments 1.jpg';
import airImg from '../assets/air.jpg';
import seaImg from '../assets/sea.jpg';
import supplierImg from '../assets/supplier.webp';
import freezonesImg from '../assets/freezones.jpg';
// @ts-ignore
import planeIconSrc from '../assets/Plane (5).svg';
// @ts-ignore
import shipIconSrc from '../assets/Ship (12).svg';
import supplierIconSrc from '../assets/icon-supplier.svg';
import freezonesIconSrc from '../assets/freezones.svg';
// @ts-ignore
import paymentIconSrc from '../assets/secure-payment-svgrepo-com 1.svg';

type Props = { onClose: () => void };

// Figma asset URLs for card backgrounds (used as overlay textures)
const ELLIPSE_DECOR = 'https://www.figma.com/api/mcp/asset/1c6e32bc-358a-473e-a1a5-1fcc5f65e398';

const ITEMS = [
  { label: 'Payments', bg: paymentsImg,  icon: paymentIconSrc,  bgPos: 'center center', bgSize: 'cover' },
  { label: 'Air',      bg: airImg,       icon: planeIconSrc,    bgPos: 'center 65%', bgSize: 'cover' },
  // Supplier replaces Land and takes the centre slot Sea used to hold
  { label: 'Supplier', bg: supplierImg,  icon: supplierIconSrc, bgPos: 'center bottom', bgSize: 'cover' },
  { label: 'Sea',      bg: seaImg,       icon: shipIconSrc,     bgPos: 'center 65%', bgSize: 'cover' },
  { label: 'Freezones',bg: freezonesImg, icon: freezonesIconSrc,bgPos: 'center 55%', bgSize: 'cover' },
];

// Per-position config: x offset, rotateY, width, height, opacity, zIndex
// Equal step of 310px between each card, tilt increases toward outer cards
const POSITIONS: Record<number, { x: number; rotY: number; w: number; h: number; opacity: number; z: number; shadow: string }> = {
  [-2]: { x: -570, rotY: 42,  w: 200, h: 415, opacity: 0.80, z: 0, shadow: '0 20px 40px rgba(0,0,0,0.18)' },
  [-1]: { x: -310, rotY: 26,  w: 256, h: 428, opacity: 0.92, z: 1, shadow: '0 20px 40px rgba(0,0,0,0.18)' },
  [0]:  { x: 0,    rotY: 0,   w: 300, h: 445, opacity: 1,    z: 2, shadow: '0 30px 70px rgba(0,0,0,0.22)' },
  [1]:  { x: 310,  rotY: -26, w: 256, h: 428, opacity: 0.92, z: 1, shadow: '0 20px 40px rgba(0,0,0,0.18)' },
  [2]:  { x: 570,  rotY: -42, w: 200, h: 415, opacity: 0.80, z: 0, shadow: '0 20px 40px rgba(0,0,0,0.18)' },
};

export default function ServiceCatalogueModal({ onClose }: Props) {
  const [active, setActive] = useState(2); // Supplier by default (centre)
  const [showSeaDetail, setShowSeaDetail] = useState(false);
  const [showAirDetail, setShowAirDetail] = useState(false);
  const [showSupplierDetail, setShowSupplierDetail] = useState(false);
  /* Tasreeh: the catalogue opens straight on the Supplier services (no Air / Sea / … cards) */
  const SUPPLIER_ONLY = true;

  const prev = () => setActive(i => (i - 1 + ITEMS.length) % ITEMS.length);
  const next = () => setActive(i => (i + 1) % ITEMS.length);

  if (SUPPLIER_ONLY) return <SupplierDetailModal onClose={onClose} />;

  if (showSeaDetail) {
    return <SeaDetailModal onClose={() => setShowSeaDetail(false)} />;
  }
  if (showSupplierDetail) {
    return <SupplierDetailModal onClose={() => setShowSupplierDetail(false)} />;
  }
  if (showAirDetail) {
    return <AirDetailModal onClose={() => setShowAirDetail(false)} onHome={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden">

      {/* Navigation header */}
      <div className="relative z-10 flex-shrink-0">
        <Header onServiceCatalogue={onClose} catalogueClosesOnClick onHome={onClose} />
      </div>

      {/* Page title */}
      <div className="relative flex items-center justify-center w-full pt-5 pb-3 flex-shrink-0">
        <h2
          className="text-[#060c28] text-[32px]"
          style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500 }}
        >
          Service Catalogue
        </h2>
        <button
          onClick={onClose}
          className="absolute right-[60px] size-[44px] flex items-center justify-center text-[#0e1b3d] hover:opacity-60 transition-opacity"
          aria-label="Close"
        >
          <svg viewBox="0 0 24 24" className="size-[28px]" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Carousel */}
      <div className="relative flex-1 flex items-start justify-center pt-4">
        {/* Left arrow */}
        <button
          onClick={prev}
          className="absolute left-[10px] top-1/2 -translate-y-1/2 z-20 size-[60px] rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
        >
          <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Cards */}
        <div
          className="relative flex items-center justify-center"
          style={{ width: '100%', height: 520, perspective: '1000px', perspectiveOrigin: '50% 40%' }}
        >
          {ITEMS.map((item, idx) => {
            const raw = (idx - active + ITEMS.length) % ITEMS.length;
            const offset = raw > ITEMS.length / 2 ? raw - ITEMS.length : raw;
            const p = POSITIONS[offset];
            if (!p) return null;

            const isActive = offset === 0;

            return (
              <div
                key={item.label}
                onClick={() => {
                  if (item.label === 'Air') { setShowAirDetail(true); }
                  else if (!isActive) { setActive(idx); }
                  else if (item.label === 'Sea') { setShowSeaDetail(true); }
                  else if (item.label === 'Supplier') { setShowSupplierDetail(true); }
                }}
                style={{
                  position: 'absolute',
                  width: p.w,
                  height: p.h,
                  transform: `translateX(${p.x}px) rotateY(${p.rotY}deg)`,
                  opacity: p.opacity,
                  zIndex: p.z,
                  transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
                  cursor: 'pointer',
                }}
              >
                <div
                  className="relative w-full h-full rounded-[12px] overflow-hidden"
                  style={{
                    border: '2px solid white',
                    boxShadow: p.shadow,
                    background: '#c8dcef',
                  }}
                >
                  {/* Background image — fills full card, bgSize controls zoom */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundImage: `url(${item.bg})`,
                    backgroundSize: item.bgSize,
                    backgroundPosition: item.bgPos,
                    backgroundRepeat: 'no-repeat',
                  }} />
                  {/* Seamless top fade */}
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '40%', background: 'linear-gradient(180deg, rgba(180,210,235,0.5) 0%, transparent 100%)', pointerEvents: 'none' }} />

                  {/* Red diagonal arc — active only */}
                  {isActive && (
                    <svg
                      className="absolute inset-0 w-full h-full pointer-events-none"
                      viewBox={`0 0 300 442`}
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M 205 0 Q 340 200 215 442"
                        fill="none"
                        stroke="rgba(220,50,50,0.85)"
                        strokeWidth="2.5"
                      />
                    </svg>
                  )}

                  {/* Ellipse decoration — active only */}
                  {isActive && (
                    <img
                      src={ELLIPSE_DECOR}
                      alt=""
                      className="absolute pointer-events-none"
                      style={{ left: -269, top: -68, width: 570, height: 570, opacity: 0.7 }}
                    />
                  )}

                  {/* Icon + Label centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-[14px] z-10">
                    <div
                      className="bg-[#0e1b3d] border border-white flex items-center justify-center flex-shrink-0"
                      style={{
                        width: 92,
                        height: 92,
                        borderRadius: 22,
                        backdropFilter: 'blur(11px)',
                      }}
                    >
                      <img src={item.icon} alt={item.label} style={{ width: 60, height: 60, filter: 'brightness(0) invert(1)' }} />
                    </div>
                    <span
                      className="text-[#060c28] capitalize"
                      style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 500, fontSize: 28, lineHeight: 1 }}
                    >
                      {item.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={next}
          className="absolute right-[10px] top-1/2 -translate-y-1/2 z-20 size-[60px] rounded-full flex items-center justify-center text-white hover:opacity-80 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(2px)' }}
        >
          <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
