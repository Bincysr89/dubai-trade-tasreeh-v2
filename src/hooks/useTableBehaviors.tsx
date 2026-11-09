import React, { useRef, useState, useCallback, useEffect } from 'react';

const RESIZE_ZONE = 10;

export function useTableBehaviors() {
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hoverResizeThRef = useRef<HTMLTableCellElement | null>(null);
  const resizeActiveRef = useRef<{ th: HTMLTableCellElement; key: string; startX: number; startW: number } | null>(null);

  const [hoveredColKey, setHoveredColKey] = useState<string | null>(null);
  const [draggingColKey, setDraggingColKey] = useState<string | null>(null);
  const [dragOverColKey, setDragOverColKey] = useState<string | null>(null);
  const [colWidths, setColWidths] = useState<Record<string, number>>({});
  const [resizeIndicatorLeft, setResizeIndicatorLeft] = useState<number | null>(null);
  const [isNearResize, setIsNearResize] = useState(false);
  const [atScrollStart, setAtScrollStart] = useState(true);
  const [atScrollEnd, setAtScrollEnd] = useState(false);

  const showIndicator = useCallback((th: HTMLTableCellElement) => {
    const scrollEl = scrollRef.current;
    if (!scrollEl) return;
    const thRect = th.getBoundingClientRect();
    const scrollRect = scrollEl.getBoundingClientRect();
    const left = thRect.right - scrollRect.left + scrollEl.scrollLeft - 2;
    setResizeIndicatorLeft(left);
  }, []);

  const hideIndicator = useCallback(() => {
    setResizeIndicatorLeft(null);
    hoverResizeThRef.current = null;
    setIsNearResize(false);
  }, []);

  const handleTableMouseMove = useCallback((e: React.MouseEvent<HTMLTableElement>) => {
    if (resizeActiveRef.current) return;

    // Column hover highlight
    const cell = (e.target as Element).closest('th, td');
    const key = cell?.getAttribute('data-col-key') ?? null;
    setHoveredColKey(key);

    // Resize proximity — scan every cell in the hovered row
    const row = (e.target as Element).closest('tr');
    if (row && tableRef.current?.contains(row)) {
      for (const c of Array.from((row as HTMLTableRowElement).cells) as HTMLTableCellElement[]) {
        const rect = c.getBoundingClientRect();
        if (Math.abs(rect.right - e.clientX) <= RESIZE_ZONE) {
          const colKey = c.getAttribute('data-col-key');
          const matchTh = colKey
            ? tableRef.current?.querySelector<HTMLTableCellElement>(`th[data-col-key="${colKey}"]`)
            : null;
          if (matchTh) {
            hoverResizeThRef.current = matchTh;
            setIsNearResize(true);
            showIndicator(matchTh);
            return;
          }
        }
      }
    }
    hoverResizeThRef.current = null;
    setIsNearResize(false);
    setResizeIndicatorLeft(null);
  }, [showIndicator]);

  const handleTableMouseLeave = useCallback(() => {
    if (resizeActiveRef.current) return;
    setHoveredColKey(null);
    hideIndicator();
  }, [hideIndicator]);

  const handleTableMouseDown = useCallback((e: React.MouseEvent<HTMLTableElement>) => {
    if (!hoverResizeThRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    const th = hoverResizeThRef.current;
    const key = th.getAttribute('data-col-key') ?? '';
    resizeActiveRef.current = { th, key, startX: e.clientX, startW: th.offsetWidth };
    showIndicator(th);
  }, [showIndicator]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!resizeActiveRef.current) return;
      const { th, key, startX, startW } = resizeActiveRef.current;
      const newW = Math.max(60, startW + e.clientX - startX);
      if (key) setColWidths(p => ({ ...p, [key]: newW }));
      showIndicator(th);
    };
    const onUp = () => {
      if (!resizeActiveRef.current) return;
      resizeActiveRef.current = null;
      hoverResizeThRef.current = null;
      setIsNearResize(false);
      setResizeIndicatorLeft(null);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, [showIndicator]);

  // --- Scroll arrows ---
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setAtScrollStart(el.scrollLeft <= 8);
    setAtScrollEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 8);
  }, []);

  const handleScroll = useCallback(() => { updateScrollState(); }, [updateScrollState]);

  const scrollToEnd = useCallback(() => {
    scrollRef.current?.scrollTo({ left: scrollRef.current.scrollWidth, behavior: 'smooth' });
  }, []);

  const scrollToStart = useCallback(() => {
    scrollRef.current?.scrollTo({ left: 0, behavior: 'smooth' });
  }, []);

  // Init scroll state after mount
  useEffect(() => {
    const t = setTimeout(updateScrollState, 80);
    return () => clearTimeout(t);
  }, [updateScrollState]);

  // --- Header drag-to-reorder handlers ---
  const onDragStart = useCallback((colKey: string, e: React.DragEvent) => {
    e.dataTransfer.setData('colKey', colKey);
    e.dataTransfer.effectAllowed = 'move';
    setDraggingColKey(colKey);
  }, []);

  const onDragEnd = useCallback(() => {
    setDraggingColKey(null);
    setDragOverColKey(null);
  }, []);

  const onDragOver = useCallback((colKey: string, e: React.DragEvent) => {
    e.preventDefault();
    setDragOverColKey(colKey);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOverColKey(null);
  }, []);

  const onDrop = useCallback((
    toKey: string,
    e: React.DragEvent,
    visibleCols: string[],
    setVisibleCols: (cols: string[]) => void,
  ) => {
    e.preventDefault();
    const fromKey = e.dataTransfer.getData('colKey');
    setDragOverColKey(null);
    setDraggingColKey(null);
    if (!fromKey || fromKey === toKey) return;
    const next = [...visibleCols];
    const fi = next.indexOf(fromKey);
    const ti = next.indexOf(toKey);
    if (fi < 0 || ti < 0) return;
    next.splice(fi, 1);
    next.splice(ti, 0, fromKey);
    setVisibleCols(next);
  }, []);

  // --- Style helpers ---
  const getThStyle = useCallback((colKey: string, defaultBg = '#a6c2e9'): React.CSSProperties => ({
    background:
      dragOverColKey === colKey ? '#b3cef0' :
      hoveredColKey  === colKey ? '#C6D9F5' :
      defaultBg,
    outline: dragOverColKey === colKey ? '2px solid #1360D2' : undefined,
    opacity: draggingColKey === colKey ? 0.5 : 1,
  }), [hoveredColKey, dragOverColKey, draggingColKey]);

  const getTdBg = useCallback((colKey: string): string | undefined =>
    hoveredColKey === colKey ? '#EBF2FD' : undefined,
  [hoveredColKey]);

  const getW = useCallback((key: string, def: number) => colWidths[key] ?? def, [colWidths]);

  return {
    tableRef, scrollRef,
    hoveredColKey, draggingColKey, dragOverColKey,
    colWidths, setColWidths,
    resizeIndicatorLeft, isNearResize,
    atScrollStart, atScrollEnd,
    handleScroll, scrollToStart, scrollToEnd,
    handleTableMouseMove, handleTableMouseLeave, handleTableMouseDown,
    onDragStart, onDragEnd, onDragOver, onDragLeave, onDrop,
    getThStyle, getTdBg, getW,
  };
}

/**
 * Left/right scroll arrow buttons — place inside a `position: relative` wrapper that also contains the scroll div.
 * stickyWidth = combined pixel width of sticky Status + Actions columns; the right-side fade sits
 * flush against `right: stickyWidth` so it (and its button) sit immediately before the sticky
 * columns, never on top of them, letting the user click there to scroll the non-sticky columns.
 * The fade spans the full height of the table — header row included — as a soft neutral shadow
 * (not a white wash) so it reads as one continuous edge instead of stopping short above the body.
 */
export function ScrollArrows({
  atStart, atEnd, onLeft, onRight, stickyWidth,
}: {
  atStart: boolean; atEnd: boolean;
  onLeft: () => void; onRight: () => void;
  stickyWidth: number;
}) {
  const btn: React.CSSProperties = {
    width: 32, height: 32, borderRadius: '50%',
    background: '#fff', border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', flexShrink: 0,
    padding: 0,
  };
  return (
    <>
      {!atStart && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: 80, maxWidth: `calc(100% - ${stickyWidth}px)`, zIndex: 20,
          background: 'linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex', alignItems: 'center', paddingLeft: 12,
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <button onClick={onLeft} style={{ ...btn, pointerEvents: 'auto' }} title="Scroll left">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="#1360D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
      {!atEnd && (
        <div style={{
          position: 'absolute', right: stickyWidth, top: 0, bottom: 0,
          width: 80, maxWidth: `calc(100% - ${stickyWidth}px)`, zIndex: 20,
          background: 'linear-gradient(to left, rgba(255,255,255,0.85) 0%, rgba(0,0,0,0) 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 12,
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <button onClick={onRight} style={{ ...btn, pointerEvents: 'auto' }} title="Scroll right">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="#1360D2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </>
  );
}

/**
 * Renders just the dot grid — embed inside an absolutely-positioned draggable div in each <th>.
 * Usage:
 *   <div draggable onDragStart={...} style={{ position:'absolute', top:3, left:'50%', transform:'translateX(-50%)', display: hovered ? 'flex' : 'none', cursor:'grab', zIndex:4 }}>
 *     <DragDots />
 *   </div>
 */
export function DragDots({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 3px)', gap: '2px',
      background: '#fff', borderRadius: 3, padding: 4,
      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} style={{ width: 3, height: 3, borderRadius: '50%', background: '#0E1B3D', display: 'block' }} />
      ))}
    </div>
  );
}
