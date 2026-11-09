import { useEffect, useMemo, useRef, useState } from 'react';
import Header from './Header';
import SeaDetailModal, { SEA_COLUMNS, ITEM_PAGE_MAP as SEA_PAGES } from './SeaDetailModal';
import AirDetailModal, { AIR_COLUMNS, AIR_ITEM_PAGE_MAP } from './AirDetailModal';
import SupplierDetailModal, { SUPPLIER_COLUMNS, liveServices, hiddenForPersona } from './SupplierDetailModal';

/* ──────────────────────────────────────────────────────────────
   Header search — "Search by Service Name". Searches every
   service in the Service Catalogue (Sea, Air, Supplier) and opens
   a result exactly as the catalogue would.
   ────────────────────────────────────────────────────────────── */
type Mode = 'Sea' | 'Air' | 'Supplier';
type Entry = { name: string; mode: Mode; group: string; live: boolean };

const font = "'Dubai', sans-serif";

/* Built on open (not at module load) — the catalogue modules and Header import each other */
function buildIndex(): Entry[] {
  const supplierLive = liveServices();
  const from = (mode: Mode, cols: { title: string; items: string[] }[], isLive: (i: string) => boolean) =>
    cols.flatMap(c => c.items.map(name => ({ name, mode, group: c.title, live: isLive(name) })));
  return [
    ...from('Supplier', SUPPLIER_COLUMNS, i => supplierLive.has(i)).filter(e => !hiddenForPersona(e.name)),
    ...from('Sea', SEA_COLUMNS, i => i in SEA_PAGES),
    ...from('Air', AIR_COLUMNS, i => i in AIR_ITEM_PAGE_MAP),
  ];
}

const Star = ({ on }: { on: boolean }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill={on ? '#f5b400' : 'none'} stroke="#f5b400" strokeWidth="1.6" strokeLinejoin="round">
    <path d="M12 2.8l2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9z" />
  </svg>
);

export default function ServiceSearchPage({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('');
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Entry | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const index = useMemo(buildIndex, []);

  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' && !open) onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose, open]);

  const q = query.trim().toLowerCase();
  const results = q
    ? index.filter(e => e.name.toLowerCase().includes(q))
        .sort((a, b) => Number(b.live) - Number(a.live))
    : [];

  /* A result opens its catalogue section straight on that service */
  if (open) {
    const back = () => setOpen(null);
    if (open.mode === 'Supplier') return <SupplierDetailModal initialItem={open.name} onClose={back} />;
    if (open.mode === 'Sea') return <SeaDetailModal initialItem={open.name} onClose={back} />;
    return <AirDetailModal initialItem={open.name} onClose={back} onHome={onClose} />;
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col overflow-hidden" style={{ fontFamily: font }}>
      <div className="flex-shrink-0"><Header onHome={onClose} onSearch={() => inputRef.current?.focus()} /></div>
      <div className="flex-1 overflow-y-auto relative px-4">
        <button onClick={onClose} aria-label="Close search" className="absolute right-[24px] sm:right-[44px] top-[24px] text-[#0e1b3d] hover:opacity-70">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
        </button>

        <div className="max-w-[960px] mx-auto pt-[48px] pb-[48px]">
          <h1 className="text-[30px] sm:text-[36px] font-medium text-[#1a1a1a] text-center mb-[56px]">Search by Service Name</h1>

          <form role="search" onSubmit={e => e.preventDefault()}
            className="h-[57px] rounded-[4px] flex items-center gap-[10px] pl-[16px] pr-[16px] bg-white"
            style={{ border: '2px solid #1360d2' }}>
            <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)} aria-label="Search services"
              placeholder="Type a service name"
              className="flex-1 min-w-0 h-full text-[18px] text-[#0e1b3d] placeholder-[#9aa3b8] focus:outline-none bg-transparent" />
            {query && (
              <button type="button" onClick={() => { setQuery(''); inputRef.current?.focus(); }} aria-label="Clear search"
                className="size-[24px] rounded-full bg-[#1360d2] flex items-center justify-center hover:opacity-85">
                <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2.2"><path d="M4 4l8 8M12 4l-8 8" strokeLinecap="round" /></svg>
              </button>
            )}
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#1360d2" strokeWidth="2.4" aria-hidden="true">
              <circle cx="10.5" cy="10.5" r="6.5" /><path d="M20 20l-4.5-4.5" strokeLinecap="round" />
            </svg>
          </form>

          {q && (
            <p className="text-[18px] text-[#1360d2] text-center mt-[24px] mb-[14px]" aria-live="polite">
              {results.length} Result{results.length === 1 ? '' : 's'} Found
            </p>
          )}

          <ul className="flex flex-col">
            {results.map(r => {
              const key = `${r.mode}|${r.group}|${r.name}`;
              return (
                <li key={key} className="flex items-center justify-between gap-[16px] py-[10px] pl-[10px] pr-[10px]">
                  <span className="flex items-center gap-[18px] min-w-0">
                    {r.live ? (
                      <button onClick={() => setOpen(r)} className="text-[18px] text-[#1a1a1a] text-left hover:text-[#1360d2] hover:underline truncate">
                        {r.name}
                      </button>
                    ) : (
                      <span className="text-[18px] text-[#1a1a1a] truncate" title="Not available in this demo">{r.name}</span>
                    )}
                    <button onClick={() => setFavs(f => { const n = new Set(f); if (n.has(key)) n.delete(key); else n.add(key); return n; })}
                      aria-label={favs.has(key) ? `Remove ${r.name} from favourites` : `Add ${r.name} to favourites`} aria-pressed={favs.has(key)}
                      className="flex-shrink-0 hover:scale-110 transition-transform">
                      <Star on={favs.has(key)} />
                    </button>
                  </span>
                  <button onClick={r.live ? () => setOpen(r) : undefined}
                    className={`flex-shrink-0 rounded-full px-[14px] py-[12px] text-[17px] text-[#1a1a1a] whitespace-nowrap ${r.live ? 'hover:bg-[#bcd6fb]' : 'cursor-default'}`}
                    style={{ background: '#cfe0fb' }}>
                    {r.group} - {r.mode}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
