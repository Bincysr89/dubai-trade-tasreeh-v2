import React, { useEffect, useState } from 'react';
import MoreIcon from '../MoreIcon';
import { createPortal } from 'react-dom';
import ActionPage from './ActionPage';
import { JourneyTable, JourneyTd, JourneyThead, StatusChip, font } from './DeclarationUI';

export type HistoryAction =
  | 'viewDeclaration' | 'amend' | 'cancel'
  | 'declarantResponse' | 'printDeclaration' | 'suspensionHistory';

const MENU: { id: HistoryAction; label: string; icon: React.ReactNode }[] = [
  { id: 'viewDeclaration', label: 'View Declaration', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg> },
  { id: 'amend', label: 'Amend', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17h3.5L16 7.5 12.5 4 3 13.5V17z" /><path d="M11.5 5l3.5 3.5" /></svg> },
  { id: 'cancel', label: 'Cancel', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><circle cx="10" cy="10" r="8" /><path d="M6.5 6.5l7 7M13.5 6.5l-7 7" /></svg> },
  { id: 'declarantResponse', label: "Declarant's Suspension Response", icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10a8 8 0 1 0 1.5-4.7" /><path d="M2 4.5V10h5.5" /><path d="M10 6v4l2.5 2" /></svg> },
  { id: 'printDeclaration', label: 'Print Declaration', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 4h8v4H6zM4 8h12v6h-3v3H7v-3H4z" /><path d="M8 12h4" /></svg> },
  { id: 'suspensionHistory', label: 'Suspension History', icon: <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10a8 8 0 1 0 1.5-4.7" /><path d="M2 4.5V10h5.5" /><path d="M10 6v4l2.5 2" /></svg> },
];

const ROWS = [
  { date: '24/02/24, 09:30', no: '123456', type: 'Cancel',    code: 'AE-09876234-Dubai amm', broker: '101-Broker', remarks: 'Lorum ipsum', assigned: '24/02/24, 09:30', status: 'Suspended' },
  { date: '24/02/24, 09:30', no: '597897', type: 'Amendment', code: 'AE-09876234-Dubai amm', broker: '101-Broker', remarks: 'Lorum ipsum', assigned: '24/02/24, 09:30', status: 'Cleared' },
  { date: '24/02/24, 09:30', no: '748979', type: 'New',       code: 'AE-09876234-Dubai amm', broker: '101-Broker', remarks: 'Lorum ipsum', assigned: '24/02/24, 09:30', status: 'Cleared' },
];

type Props = { onHome?: () => void; onBack?: () => void; onAction?: (action: HistoryAction, requestNo: string) => void };

/** Declaration History — Figma 2650:78997, with the row menu from 2650:79970. */
export default function DeclarationHistoryPage({ onHome, onBack, onAction }: Props) {
  /* The menu is taller than the table's scroll box, so it is portalled to the body
     and positioned from the button rather than clipped inside the card. */
  const [menu, setMenu] = useState<{ row: number; top: number; left: number } | null>(null);

  useEffect(() => {
    if (!menu) return;
    const close = () => setMenu(null);
    document.addEventListener('mousedown', close);
    window.addEventListener('scroll', close, true);
    return () => { document.removeEventListener('mousedown', close); window.removeEventListener('scroll', close, true); };
  }, [menu]);

  const openMenu = (row: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const height = MENU.length * 44 + 8;
    setMenu({
      row,
      top: Math.min(r.bottom + 4, window.innerHeight - height - 8),
      left: Math.max(8, r.right - 250),
    });
  };

  return (
    <ActionPage title="Declaration History" onHome={onHome} onBack={onBack}>
      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)', fontFamily: font }}>
        <JourneyTable minWidth={1100}>
          <JourneyThead columns={[
            { label: 'Request Date' }, { label: 'Request No.' }, { label: 'Request Type' },
            { label: 'Business Code & Name' }, { label: 'Broker' }, { label: 'Remarks' },
            { label: 'Assigned Date' }, { label: 'Status' }, { label: 'Actions', w: 90, filter: false },
          ]} />
          <tbody>
            {ROWS.map((r, i) => (
              <tr key={i}>
                <JourneyTd first>{r.date}</JourneyTd>
                <JourneyTd>{r.no}</JourneyTd>
                <JourneyTd>{r.type}</JourneyTd>
                <JourneyTd>{r.code}</JourneyTd>
                <JourneyTd>{r.broker}</JourneyTd>
                <JourneyTd>{r.remarks}</JourneyTd>
                <JourneyTd>{r.assigned}</JourneyTd>
                <JourneyTd><StatusChip status={r.status} /></JourneyTd>
                <JourneyTd width={90}>
                  <button type="button" aria-label={`Request ${r.no} actions`}
                    onClick={openMenu(i)}
                    className="size-[28px] inline-flex items-center justify-center rounded hover:bg-[#f0f4ff]">
                    <MoreIcon />
                  </button>
                </JourneyTd>
              </tr>
            ))}
          </tbody>
        </JourneyTable>
      </div>

      {menu && createPortal(
        <div
          className="fixed z-[1000] bg-white rounded-[8px] py-[4px] overflow-hidden"
          style={{ top: menu.top, left: menu.left, width: 250, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5', fontFamily: font }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          {MENU.map((m) => (
            <button key={m.id} type="button"
              onClick={() => { const no = ROWS[menu.row].no; setMenu(null); onAction?.(m.id, no); }}
              className="group flex items-center gap-[10px] w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors">
              <span className="text-[#697498] group-hover:text-white flex-shrink-0">{m.icon}</span>
              <span className="text-[16px] text-[#111838] group-hover:text-white">{m.label}</span>
            </button>
          ))}
        </div>,
        document.body,
      )}
    </ActionPage>
  );
}
