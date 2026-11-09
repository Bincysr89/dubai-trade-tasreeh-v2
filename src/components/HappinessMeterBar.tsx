import { useState } from 'react';
import happinessMeterPopupImg from '../assets/happiness-meter-popup.png';

const SmileyIcon = ({ size = 28 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M23.3907 4.47896C32.5054 3.43382 41.1491 8.06838 45.3223 16.2387C46.3874 18.329 46.8236 19.5488 47.295 21.8657C47.941 25.071 47.7319 29.3913 46.7716 32.3354C44.8159 38.2759 40.6772 42.997 35.0548 45.645C25.8179 50.0002 14.7476 47.1433 8.53132 38.7641C7.43134 37.2834 5.96432 34.5484 5.42292 32.9282C3.65933 27.7716 4.061 21.3775 6.4532 16.6215C7.93743 13.6426 10.5217 10.559 13.1583 8.60787C15.9172 6.53485 20.0906 4.86222 23.3907 4.47896ZM25.6602 8.31197C20.4744 8.7301 17.0345 10.1764 13.7169 13.3296C11.4995 15.4374 9.91062 18.0851 8.95027 21.2729C8.51373 22.7188 8.46101 23.0853 8.46101 25.8901C8.46101 28.2939 8.51345 29.1823 8.75788 30.0708C10.6612 36.9869 15.4635 41.6728 22.2559 43.2407C24.1592 43.6935 27.8253 43.6935 29.7286 43.2407C36.521 41.6728 41.3234 36.9869 43.2266 30.0708C43.4711 29.1824 43.5235 28.2939 43.5235 25.8901C43.5235 23.0853 43.4708 22.7188 43.0343 21.2729C42.0739 18.0851 40.485 15.4374 38.2676 13.3296C35.2643 10.4725 31.8416 8.90472 27.7208 8.4692C26.743 8.3821 25.8174 8.31197 25.6602 8.31197ZM17.3106 30.1401C19.4408 32.3002 21.5533 33.3458 24.5216 33.7465C28.3281 34.2517 32.5371 32.6661 34.9991 29.809C35.4529 29.2866 35.8894 28.851 35.9766 28.851C36.187 28.8518 38.1933 30.3139 38.1944 30.4887C38.2293 30.8023 36.3953 32.701 35.1905 33.6069C29.6902 37.8053 22.3738 37.8055 16.7862 33.6245C15.6511 32.7881 13.4866 30.4715 13.6612 30.2973C13.6965 30.2448 14.2201 29.8793 14.8135 29.4614L15.8956 28.6948L17.3106 30.1401Z" fill="#1360D2" />
  </svg>
);

type Rating = 'sad' | 'neutral' | 'happy';

/* Hotspot rects, as percentages of the screenshot's own box — matches the 3 face
   circles' actual position in happiness-meter-popup.png (676×558) so clicks land on
   the real image instead of a redrawn one. */
const HOTSPOTS: { rating: Rating; left: string; top: string; size: string }[] = [
  { rating: 'sad', left: '6.5%', top: '41%', size: '27%' },
  { rating: 'neutral', left: '36.5%', top: '41%', size: '27%' },
  { rating: 'happy', left: '66.5%', top: '41%', size: '27%' },
];

type Props = {
  /**
   * 'bar' (default) — renders its own fixed white bottom bar (mirrors BackToListingBar's
   * styling) with the launcher icon inside it, for pages with no existing bottom bar.
   * 'inline' — renders just the launcher button, for embedding inside a page's own
   * existing sticky bottom bar (e.g. alongside a "Back to Listing" button).
   */
  variant?: 'bar' | 'inline';
};

/**
 * "Happiness Meter" feedback widget — the launcher icon sits inside a bottom bar (its own
 * fixed white bar by default, matching BackToListingBar's look, or embedded inline into an
 * existing one). Clicking it opens the standard UAE government happiness-meter rating popup
 * (3 faces, no further detail requested — purely a satisfaction pulse-check).
 */
export default function HappinessMeterBar({ variant = 'bar' }: Props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);

  const close = () => { setOpen(false); setRating(null); };
  const choose = (r: Rating) => {
    setRating(r);
    setTimeout(close, 1400);
  };

  const launcher = (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label="Rate your experience"
      title="Rate your experience"
      className="size-[48px] rounded-full inline-flex items-center justify-center hover:bg-[#f0f4ff] transition-colors"
      style={{ border: '1px solid #d5ddfb' }}
    >
      <SmileyIcon />
    </button>
  );

  return (
    <>
      {/* Launcher */}
      {variant === 'inline' ? launcher : (
        <div
          className="bg-white px-4 sm:px-10 py-[16px] flex items-center flex-shrink-0"
          style={{ position: 'fixed', left: 0, right: 0, bottom: 0, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)', zIndex: 401 }}
        >
          {launcher}
        </div>
      )}

      {/* Rating popup — the happiness-meter screenshot itself, with invisible clickable
          hotspots laid over its 3 face circles so it stays pixel-identical to the source
          image (no redrawn logo/faces). */}
      {open && (
        <div
          onClick={close}
          style={{ position: 'fixed', inset: 0, zIndex: 900, background: 'rgba(14,27,61,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'relative', width: '100%', maxWidth: 420, lineHeight: 0, borderRadius: 8, overflow: 'hidden', boxShadow: '0px 20px 60px rgba(14,27,61,0.24)' }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="size-[30px] inline-flex items-center justify-center rounded-full bg-white hover:bg-[#f0f4ff] transition-colors"
              style={{ position: 'absolute', top: -12, right: -12, color: '#697498', boxShadow: '0px 2px 8px rgba(0,0,0,0.18)', zIndex: 2 }}
            >
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
            </button>

            <img src={happinessMeterPopupImg} alt="Happiness Meter — How was your experience?" style={{ display: 'block', width: '100%', height: 'auto' }} />

            {!rating && HOTSPOTS.map(h => (
              <button
                key={h.rating}
                type="button"
                onClick={() => choose(h.rating)}
                aria-label={h.rating}
                style={{ position: 'absolute', left: h.left, top: h.top, width: h.size, height: h.size, borderRadius: '50%', border: 'none', background: 'transparent', cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
