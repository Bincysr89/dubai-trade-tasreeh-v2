import React from 'react';

/**
 * The row-action "three dots", shared by every table and card in the app so the control
 * reads the same everywhere. Sized and coloured for legibility: the listing's glyph,
 * a little larger and in the darker navy rather than the muted grey.
 */
export default function MoreIcon({ color = '#0e1b3d' }: { color?: string }) {
  return (
    <svg viewBox="0 0 4 18" width="5" height="22" fill={color} className="flex-shrink-0">
      <circle cx="2" cy="2" r="2" />
      <circle cx="2" cy="9" r="2" />
      <circle cx="2" cy="16" r="2" />
    </svg>
  );
}
