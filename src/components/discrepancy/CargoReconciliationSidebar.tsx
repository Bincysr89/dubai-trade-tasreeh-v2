const font = "'Dubai', sans-serif";

export type CargoReconMenuKey = 'discrepancy' | 'invoices';

export const CARGO_RECON_MENU: { key: CargoReconMenuKey; label: string }[] = [
  { key: 'discrepancy', label: 'Provide Discrepancy Feedback' },
  { key: 'invoices', label: 'View Invoice Details' },
];

function MenuIcon({ menu }: { menu: CargoReconMenuKey }) {
  const common = { width: 20, height: 20, fill: 'none', stroke: '#1360d2', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return menu === 'discrepancy' ? (
    <svg viewBox="0 0 24 24" {...common}>
      <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
      <path d="M14 3v6h6M9 13h6M9 17h6" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" {...common}>
      <rect x="4" y="3" width="16" height="18" rx="2" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

/**
 * Collapsible left navigation for the Cargo Reconciliation module — switches
 * between "Provide Discrepancy Feedback" and "View Invoice Details".
 */
export default function CargoReconciliationSidebar({ active, onSelect, collapsed, onToggleCollapsed }: {
  active: CargoReconMenuKey;
  onSelect: (key: CargoReconMenuKey) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <div className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300 max-md:!w-16"
      style={{ width: collapsed ? 64 : 180, background: '#e4efff', border: '1px solid #a6c2e9' }}>
      <button onClick={onToggleCollapsed} className="flex items-center justify-center py-[12px] border-b border-[#a6c2e9] w-full flex-shrink-0" title={collapsed ? 'Expand panel' : 'Collapse panel'}>
        <span className="size-[32px] rounded-full flex items-center justify-center bg-white transition-colors hover:bg-[#eef4ff]" style={{ border: '1.5px solid #a6c2e9' }}>
          <svg viewBox="0 0 20 20" className="size-[16px] transition-transform duration-300" style={{ transform: collapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 15l-5-5 5-5" /><path d="M8 15l-5-5 5-5" />
          </svg>
        </span>
      </button>
      {CARGO_RECON_MENU.map((item, i) => {
        const isActive = active === item.key;
        return (
          <button key={item.key} onClick={() => onSelect(item.key)}
            className="flex items-center w-full text-left transition-all hover:opacity-80"
            style={{
              gap: collapsed ? 0 : 10, padding: collapsed ? '12px 12px' : '12px 14px', justifyContent: collapsed ? 'center' : 'flex-start',
              ...(isActive ? { background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' } : { background: 'transparent', borderTop: i === 0 ? 'none' : '1px solid #a6c2e9' }),
            }}
            title={collapsed ? item.label : undefined}
          >
            <div className="flex items-center justify-center flex-shrink-0 rounded-[8px]" style={{ width: 38, height: 38, background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
              <MenuIcon menu={item.key} />
            </div>
            {!collapsed && (
              <span className="text-[16px] text-[#0e1b3d] leading-tight flex-1 min-w-0" style={{ fontFamily: font, fontWeight: isActive ? 700 : 400, wordBreak: 'break-word' }}>
                {item.label}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
