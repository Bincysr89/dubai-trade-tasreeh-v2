import React from 'react';
import { createPortal } from 'react-dom';
import { font } from './DeclarationUI';

export type FlyoutItem = { label: string; icon: React.ReactNode };

export const flyoutIcons = {
  view: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  vehicle: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 12h14v3H3zM5 12l1.5-4h7L15 12" /><circle cx="6.5" cy="15.5" r="1.2" /><circle cx="13.5" cy="15.5" r="1.2" /></svg>,
  permit: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 3h7l3 3v11H5z" /><path d="M12 3v3h3M7 10h6M7 13h4" /></svg>,
  amend: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13.5V17h3.5L16 7.5 12.5 4 3 13.5z" /><path d="M11.5 5L15 8.5" /></svg>,
  delete: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 5h14M8 5V3h4v2M16 5l-1 12H5L4 5" /><path d="M8 9v5M12 9v5" /></svg>,
};

/** The row menus on the non-stepper invoice page — Figma 2650:62069. */
export const INVOICE_HEADER_MENU: FlyoutItem[] = [
  { label: 'Amend', icon: flyoutIcons.amend },
  { label: 'Delete', icon: flyoutIcons.delete },
];
export const LINE_ITEM_MENU: FlyoutItem[] = [
  { label: 'Amend', icon: flyoutIcons.amend },
  { label: 'Vehicle Details', icon: flyoutIcons.vehicle },
  { label: 'Permit Details', icon: flyoutIcons.permit },
  { label: 'Delete', icon: flyoutIcons.delete },
];

/** The stepper's read-only equivalents — Figma 2650:52579. */
export const STEPPER_INVOICE_MENU: FlyoutItem[] = [{ label: 'View Details', icon: flyoutIcons.view }];
export const STEPPER_LINE_ITEM_MENU: FlyoutItem[] = [
  { label: 'View Details', icon: flyoutIcons.view },
  { label: 'Vehicle Details', icon: flyoutIcons.vehicle },
  { label: 'Permit Details', icon: flyoutIcons.permit },
];

export type FlyoutAnchor = { top: number; left: number };

/** Positions a menu from a button's rect, clamped inside the viewport. */
export function anchorFrom(e: React.MouseEvent, itemCount: number, width = 200): FlyoutAnchor {
  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
  const height = itemCount * 42 + 8;
  return {
    top: Math.min(r.bottom + 4, window.innerHeight - height - 8),
    left: Math.max(8, Math.min(r.left - width + 28, window.innerWidth - width - 8)),
  };
}

/**
 * Row menu rendered as a fixed portal, so a table's scroll box can never clip it.
 */
export default function RowFlyout({ items, at, onPick, onClose, width = 200 }: {
  items: FlyoutItem[];
  at: FlyoutAnchor;
  onPick?: (label: string) => void;
  onClose: () => void;
  width?: number;
}) {
  React.useEffect(() => {
    const close = () => onClose();
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    return () => { document.removeEventListener('mousedown', close); window.removeEventListener('scroll', close, true); };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed z-[1000] bg-white rounded-[8px] py-[4px] overflow-hidden"
      style={{ top: at.top, left: at.left, width, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', fontFamily: font }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          onClick={() => { onPick?.(it.label); onClose(); }}
          className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors"
        >
          <span className="text-[#697498] group-hover:text-white flex-shrink-0">{it.icon}</span>
          <span className="text-[16px] text-[#111838] group-hover:text-white">{it.label}</span>
        </button>
      ))}
    </div>,
    document.body,
  );
}
