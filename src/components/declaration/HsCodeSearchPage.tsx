import React, { useState } from 'react';
import { font } from './DeclarationUI';

const ROWS = [
  ['K1273648o354', '87654321', 'Light vehicle fog light kit'],
  ['K1273648o354', '87654321', 'Armored vehicle'],
  ['K1273648o354', '87654321', 'Light vehicle fog light kit'],
  ['K1273648o354', '87654321', 'Armored vehicle'],
  ['K1273648o354', '87654321', 'Armored vehicle'],
  ['K1273648o354', '87654321', 'Armored vehicle'],
  ['K1273648o354', '87654321', 'Armored vehicle'],
];

type Props = { onSelect?: (hsCode: string, description: string) => void };

/** Search HS Code — Figma 2650:47160. A full page, not a popup. */
export default function HsCodeSearchPage({ onSelect }: Props) {
  const [code, setCode] = useState('HS87654');
  const [desc, setDesc] = useState('B87654');

  const field = (label: string, value: string, set: (v: string) => void) => (
    <div className="relative flex-1 min-w-[220px]">
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        className="h-[56px] w-full rounded-[4px] border border-[#d5ddfb] px-[16px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] transition-colors bg-white"
        style={{ fontFamily: font }}
      />
      <span className="absolute bg-white flex items-center px-[4px] text-[12px] text-[#060c28] whitespace-nowrap"
        style={{ left: 12, top: -8, lineHeight: '16px' }}>{label}</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-[20px]" style={{ fontFamily: font }}>
      <p className="text-[20px] text-[#0e1b3d]" style={{ fontWeight: 600 }}>Add item description to find the HS code</p>

      <div className="bg-white rounded-[8px] px-[20px] py-[24px]" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="flex flex-wrap items-center gap-[20px]">
          {field('HS Code', code, setCode)}
          <div className="flex-[2] min-w-[260px]">{field('Description', desc, setDesc)}</div>
          <button
            type="button"
            className="h-[52px] px-[48px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
            style={{ background: '#1360d2', fontWeight: 500 }}
          >Search</button>
        </div>
      </div>

      <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '1px 2px 12px rgba(0,0,0,0.06)' }}>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 860 }}>
            <thead>
              <tr style={{ background: '#a6c2e9' }}>
                {['Product Key', 'HS Code', 'Product Description'].map((c) => (
                  <th key={c} className="text-left text-[16px]" style={{ padding: '12px 20px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
                ))}
                <th className="text-left text-[16px]" style={{ padding: '12px 20px', color: '#051937', fontWeight: 500, width: 160 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f3fa' }}>
                  {r.map((cell, j) => (
                    <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>{cell}</td>
                  ))}
                  <td style={{ padding: '16px 20px' }}>
                    <button
                      type="button"
                      onClick={() => onSelect?.(r[1], r[2])}
                      className="text-[16px] text-[#1360d2] hover:underline"
                      style={{ fontWeight: 500 }}
                    >Select HS Code</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
