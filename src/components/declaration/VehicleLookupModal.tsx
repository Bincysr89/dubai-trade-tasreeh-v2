import React, { useState } from 'react';
import DeclarationModal from './DeclarationModal';
import { font } from './DeclarationUI';

export type VehicleLookupKind = 'brand' | 'model' | 'manufacturer';

type Config = {
  title: string;
  /** Optional sub-heading above the search row. */
  heading?: string;
  inputs: string[];
  columns: string[];
  rows: string[][];
  maxWidth: number;
};

/* Figma 19159:72371 (Brand), 19159:73100 (Model), 2650:86191 (Manufacture / Exporter). */
const CONFIG: Record<VehicleLookupKind, Config> = {
  brand: {
    title: 'Search Vehicle Brand Name',
    heading: 'Brand Name',
    inputs: ['Brand'],
    columns: ['Brand Code', 'Brand Name'],
    rows: [['44', 'Toyota'], ['45', 'Honda']],
    maxWidth: 545,
  },
  model: {
    // The design titles this "Modal"; kept verbatim.
    title: 'Search Vehicle Modal',
    inputs: ['Brand', 'Model'],
    columns: ['Brand Code', 'Brand Name', 'Model Code', 'Model Name', 'Vehicle Class'],
    rows: [
      ['44', 'Toyota', '73', '4RUNNER', 'Heavy Vehicle'],
      ['45', 'Honda', '74', '4RUNNER', 'Light Vehicle'],
    ],
    maxWidth: 570,
  },
  manufacturer: {
    title: 'Manufacture / Exporter',
    inputs: ['Search Manufacture / Exporter'],
    columns: ['Customs Code', 'Manufacture / Exporter Code', 'Manufacture / Exporter Name'],
    rows: [
      ['AE-1000087', 'Maersk Shipping', 'Shipping line Agent'],
      ['AE-1000255', 'STAR SAEED TECHNOLOGY MIDDLE EAST', 'Free zone'],
      ['AE-1000375', '87654321', 'Light vehicle fog light kit'],
      ['AE-1000507', '87654321', 'Armored vehicle'],
    ],
    maxWidth: 710,
  },
};

type Props = {
  kind: VehicleLookupKind;
  onClose: () => void;
  onSelect?: (row: string[]) => void;
};

export default function VehicleLookupModal({ kind, onClose, onSelect }: Props) {
  const cfg = CONFIG[kind];
  const [values, setValues] = useState<string[]>(cfg.inputs.map(() => ''));

  return (
    <DeclarationModal title={cfg.title} onClose={onClose} maxWidth={cfg.maxWidth}>
      {cfg.heading && <p className="text-[17px] text-[#0e1b3d] mb-[18px]" style={{ fontWeight: 600 }}>{cfg.heading}</p>}

      <div className="flex flex-wrap items-center gap-[14px] mb-[22px]">
        {cfg.inputs.map((ph, i) => (
          <input
            key={ph}
            value={values[i]}
            onChange={(e) => setValues((v) => v.map((x, j) => (j === i ? e.target.value : x)))}
            placeholder={ph}
            className="h-[48px] flex-1 min-w-[150px] rounded-[4px] border border-[#d5ddfb] px-[14px] text-[16px] text-[#0e1b3d] placeholder:text-[#697498] focus:outline-none focus:border-[#1360d2] transition-colors bg-white"
            style={{ fontFamily: font }}
          />
        ))}
        <button
          type="button"
          className="h-[48px] px-[30px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex-shrink-0"
          style={{ background: '#1360d2', fontWeight: 500 }}
        >Search</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#a6c2e9' }}>
              {cfg.columns.map((c) => (
                <th key={c} className="text-left text-[16px]" style={{ padding: '12px', color: '#051937', fontWeight: 500, whiteSpace: 'nowrap' }}>{c}</th>
              ))}
              <th className="text-left text-[14px]" style={{ padding: '12px', color: '#455174', fontWeight: 500, width: 80 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {cfg.rows.map((r, i) => (
              <tr key={i}>
                {r.map((cell, j) => (
                  <td key={j} className="text-[16px] text-[#051937]" style={{ padding: '16px 12px' }}>{cell}</td>
                ))}
                <td style={{ padding: '14px 12px' }}>
                  <button
                    type="button"
                    onClick={() => { onSelect?.(r); onClose(); }}
                    className="text-[16px] text-[#1360d2] hover:underline"
                    style={{ fontWeight: 500 }}
                  >Select</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DeclarationModal>
  );
}
