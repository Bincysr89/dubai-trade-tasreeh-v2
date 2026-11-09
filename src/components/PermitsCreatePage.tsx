import { useState, useRef, useEffect } from 'react';
import Header from './Header';
import { IntegratedClearanceIcon } from './AgentIcons';
import seaIconSrc from '../assets/icon-sea.svg';
import airIconSrc from '../assets/icon-air.svg';
import truckIconSrc from '../assets/External Truck.svg';

type Props = {
  onClose: () => void;
  initialStep?: Step;
  /** Pre-answer earlier questions (shown as chat history) before the initial step.
   *  When `cargo` is given, the assistant lands straight on the services result. */
  prefill?: { activity?: string; mode?: string; cargo?: string };
  /** Open a specific permit service listing flow from a result row. */
  onOpenService?: (service: string) => void;
};
const font = "'Dubai', sans-serif";

/* ── Data ── */
const TRADE_OPTIONS = [
  { key: 'import',   label: 'Import',    desc: 'Bringing goods into Dubai',    color: '#1360d2',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>) },
  { key: 'export',   label: 'Export',    desc: 'Sending goods out of Dubai',   color: '#0e56c0',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V8M7 13l5-5 5 5"/><path d="M5 4h14"/></svg>) },
  { key: 'reexport', label: 'Re-Export', desc: 'Transit through Dubai',        color: '#1670e0',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9H3"/><path d="M3 7v5h5"/></svg>) },
  { key: 'transfer', label: 'Transfer',  desc: 'Between zones or ports',       color: '#0e4cad',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>) },
  { key: 'other',    label: 'Other',     desc: 'Other trade activities',       color: '#2a6dcc',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>) },
];

const MODE_OPTIONS = [
  { key: 'sea',  label: 'Sea',  desc: 'Vessel / container',    color: '#0e5fa8',
    icon: (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l2.5-7h13L21 17"/><path d="M3 17c2 2 4 3 9 3s7-1 9-3"/><path d="M8 10V6l4-2 4 2v4"/><path d="M12 4v2"/></svg>) },
  { key: 'air',  label: 'Air',  desc: 'Aircraft / airfreight', color: '#1a4ea8',
    icon: (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 00-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>) },
  { key: 'land', label: 'Land', desc: 'Truck / road transport',color: '#1458a8',
    icon: (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>) },
  { key: 'rail', label: 'Rail', desc: 'Train / railway',       color: '#0e4d99',
    icon: (<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="14" rx="2"/><path d="M4 11h16M12 3v8M8 17l-2 3m10-3l2 3"/></svg>) },
];

/* ── "Find with Assistant" top-level categories (DT Single Window structure) ── */
const ACTIVITY_OPTIONS = [
  { key: 'registration', label: 'Registration',     desc: 'Product & consignment registration', color: '#1360d2',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="3" width="12" height="18" rx="2"/><path d="M9 3v2h6V3"/><path d="M9 12l2 2 4-4"/></svg>) },
  { key: 'vessel',       label: 'Vessel Services',   desc: 'Anchorage, NOC & vessel permits',    color: '#0e56c0',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l2.5-7h13L21 17"/><path d="M3 17c2 2 4 3 9 3s7-1 9-3"/><path d="M8 10V6l4-2 4 2v4"/><path d="M12 4v2"/></svg>) },
  { key: 'cargo',        label: 'Cargo Clearance',   desc: 'Import, export & customs permits',   color: '#1670e0',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/></svg>) },
  { key: 'other',        label: 'Others',            desc: 'ATA Carnet & other services',        color: '#2a6dcc', mapKey: 'ATA Carnet',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>) },
];

/* Registration → Veterinary Services / Food Services */
const REGISTRATION_OPTIONS = [
  { key: 'vet',  label: 'Veterinary Services', desc: 'Animal food label assessment', color: '#0e56c0', mapKey: 'Veterinary Services',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>) },
  { key: 'food', label: 'Food Services',       desc: 'Food registration & label assessment', color: '#1360d2', mapKey: 'Food Services',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>) },
];

/* Vessel Services → DMA / DPA */
const VESSEL_OPTIONS = [
  { key: 'dma', label: 'DMA', desc: 'Dubai Maritime Authority services', color: '#0e5fa8', mapKey: 'DMA',
    icon: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="5" r="2"/><path d="M12 7v14M5 12H2a10 10 0 0020 0h-3"/></svg>) },
  { key: 'dpa', label: 'DPA', desc: 'Dubai Ports Authority services',    color: '#1a4ea8', mapKey: 'DPA',
    icon: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V10l9-6 9 6v11"/><path d="M3 21h18M9 21v-6h6v6"/></svg>) },
];

/* Cargo Clearance → activity type (6 options per chart) */
const CC_TYPE_OPTIONS = [
  { key: 'import',    label: 'Import',    desc: 'Bringing goods into Dubai',    color: '#1360d2',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v13M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>) },
  { key: 'export',    label: 'Export',    desc: 'Sending goods out of Dubai',   color: '#0e56c0',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21V8M7 13l5-5 5 5"/><path d="M5 4h14"/></svg>) },
  { key: 'reexport',  label: 'Re-Export', desc: 'Transit through Dubai',        color: '#1670e0',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 109-9H3"/><path d="M3 7v5h5"/></svg>) },
  { key: 'transfer',  label: 'Transfer',  desc: 'Between zones or ports',       color: '#0e4cad',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>) },
  { key: 'transit',   label: 'Transit',   desc: 'Passing through Dubai',        color: '#0e5fa8',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h9a3 3 0 003-3v-1M16 5H7a3 3 0 00-3 3v1"/></svg>) },
  { key: 'transport', label: 'Transport', desc: 'Moving cargo within Dubai',    color: '#1458a8',
    icon: (<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>) },
];

/* Cargo Clearance → Permits / Certificates */
const CC_CATEGORY_OPTIONS = [
  { key: 'permits',      label: 'Permits',                       desc: 'Consumer, Food & Veterinary permits',   color: '#1360d2',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>) },
  { key: 'certificates', label: 'Certificates',                  desc: 'Food, Veterinary, Vessel & Hazardous Cargo certificates', color: '#0e56c0',
    icon: (<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M9 13l-2 8 5-3 5 3-2-8"/></svg>) },
];

/* Cargo Clearance → Permits → sub-category */
const CC_PERMITS_SUBCAT = [
  { key: 'consumer',   label: 'Consumer',   desc: 'Consumer goods permits',   color: '#1670e0', mapKey: 'CC Permits – Consumer',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>) },
  { key: 'food',       label: 'Food',       desc: 'Food consignment permits', color: '#1360d2', mapKey: 'CC Permits – Food',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>) },
  { key: 'veterinary', label: 'Veterinary', desc: 'Veterinary consignment permits', color: '#0e56c0', mapKey: 'CC Permits – Veterinary',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>) },
];

/* Cargo Clearance → Certificates → sub-category */
const CC_CERT_SUBCAT = [
  { key: 'food',       label: 'Food',       desc: 'Food export certificates',       color: '#1360d2', mapKey: 'CC Certificates – Food',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>) },
  { key: 'veterinary', label: 'Veterinary', desc: 'Animal health certificates',      color: '#0e56c0', mapKey: 'CC Certificates – Veterinary',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>) },
  { key: 'vessel',     label: 'Vessel',     desc: 'Ship sanitation certificates',    color: '#0e5fa8', mapKey: 'CC Certificates – Vessel',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l2.5-7h13L21 17"/><path d="M3 17c2 2 4 3 9 3s7-1 9-3"/><path d="M8 10V6l4-2 4 2v4"/><path d="M12 4v2"/></svg>) },
  { key: 'goods',      label: 'Dangerous Goods',   desc: 'NOCs for dangerous goods',      color: '#c0392b', mapKey: 'CC Dangerous – Dangerous Goods',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 20h20L12 2z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none"/></svg>) },
  { key: 'firearms',   label: 'Firearms',          desc: 'NOC for firearms & ammunition', color: '#0e4cad', mapKey: 'CC Dangerous – Firearms',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M4 12l3-3m-3 3l3 3m10-3v3l2 2"/></svg>) },
  { key: 'suspicious', label: 'Suspicious Goods',  desc: 'Inspecting suspicious goods',    color: '#a83232', mapKey: 'CC Dangerous – Suspicious Goods',
    icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M11 8v3M11 14h.01"/></svg>) },
];

const CARGO_OPTIONS = [
  { key: 'food',      label: 'Food Consignment',        color: '#1360d2', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>) },
  { key: 'vet',       label: 'Veterinary Consignments', color: '#0e56c0', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><path d="M9 22V12h6v10"/></svg>) },
  { key: 'consumer',  label: 'Consumer Goods',          color: '#1670e0', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>) },
  { key: 'firearms',  label: 'Fire Arms',               color: '#0e4cad', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12h16M4 12l3-3m-3 3l3 3m10-3v3l2 2"/></svg>) },
  { key: 'chemicals', label: 'Chemicals & Hazardous',   color: '#1565d4', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3h6v11l3.5 6H5.5L9 14V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>) },
  { key: 'livestock', label: 'Live Animals',            color: '#0e60cb', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M8 12c-4 1-6 4-6 6h20c0-2-2-5-6-6"/></svg>) },
  { key: 'pharma',    label: 'Pharmaceuticals',         color: '#1878ea', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>) },
  { key: 'other',     label: 'Other Goods',             color: '#2a6dcc', icon: (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg>) },
];

const PERMITS_MAP: Record<string, { label: string; authority: string; prerequisite?: boolean }[]> = {
  'Food Consignment': [
    { label: 'Product Registration',                                     authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Register and Access a Food Item',                          authority: 'Dubai Municipality' },
    { label: 'Request to Transfer Food Consignment from and to Dubai',   authority: 'Dubai Municipality' },
    { label: 'Release of Importer Food Consignments for Local Market',   authority: 'Dubai Municipality' },
    { label: 'Request for Food Export / Food Health Certificate',        authority: 'Dubai Municipality' },
  ],
  'Veterinary Consignments': [
    { label: 'Approval of Animal Food Identification Label',             authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Permit to Release Importer Veterinary Consignments',      authority: 'Dubai Municipality' },
  ],
  // Export via air — Dangerous Goods + Firearms consignments (DCAA services)
  'Dangerous Goods & Firearms': [
    { label: 'DCAA - NOC - Dangerous Goods by Air',                authority: 'DCAA', prerequisite: true },
    { label: 'DCAA - Inspect Suspicious Goods',                    authority: 'DCAA' },
    { label: 'DCAA - NOC - Firearms and Ammunition by Air',        authority: 'DCAA' },
  ],
  // Combined multi-consignment (Food + Hazardous) shown when entering permits from the journey
  'Food & Hazardous Goods Consignment': [
    { label: 'Product Registration',                                                 authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Register and Access a Food Item',                                      authority: 'Dubai Municipality' },
    { label: 'Request to Transfer Food Consignment from and to Dubai',              authority: 'Dubai Municipality' },
    { label: 'Release of Importer Food Consignments for Local Market',              authority: 'Dubai Municipality' },
    { label: 'Hazardous Goods - Chemical Materials - Import NOC Request from Authority SIRA', authority: 'SIRA' },
  ],
  'Consumer Goods': [
    { label: 'Product Conformity Certificate',                           authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Release of Importer Consignments for Local Market',        authority: 'Dubai Customs' },
  ],
  'Fire Arms': [
    { label: 'Controlled Goods Import Approval',                         authority: 'Ministry of Economy', prerequisite: true },
    { label: 'Firearm Import / Export Permit',                           authority: 'Dubai Police' },
  ],
  'Chemicals & Hazardous': [
    { label: 'Hazardous Material Safety Assessment',                     authority: 'Civil Defence', prerequisite: true },
    { label: 'Hazardous Material Certificate',                           authority: 'Civil Defence' },
    { label: 'Dangerous Goods Declaration',                              authority: 'DCAA' },
  ],
  'Live Animals': [
    { label: 'CITES Import / Export Permit',                             authority: 'MOCCAE', prerequisite: true },
    { label: 'Veterinary Health Certificate',                            authority: 'MOCCAE' },
    { label: 'Quarantine Clearance Certificate',                         authority: 'MOCCAE' },
  ],
  'Pharmaceuticals': [
    { label: 'Product Registration with Health Authority',               authority: 'DCAA', prerequisite: true },
    { label: 'Pharmaceutical Import Permit',                             authority: 'DCAA' },
    { label: 'Health Certificate for Medical Products',                  authority: 'Dubai Municipality' },
  ],
  'Other Goods': [
    { label: 'Trade Documentation Check',                                authority: 'Dubai Customs' },
    { label: 'General Trade Clearance',                                  authority: 'Dubai Customs' },
  ],

  /* ── DT Single Window structure — Find with Assistant ── */
  // Registration → Veterinary Services
  'Veterinary Services': [
    { label: 'Animal Food Label Assessment',                             authority: 'Dubai Municipality', prerequisite: true },
  ],
  // Registration → Food Services
  'Food Services': [
    { label: 'Food Registration',                                        authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Label Assessment',                                         authority: 'Dubai Municipality' },
    { label: 'Food Registration & Label Assessment',                     authority: 'Dubai Municipality' },
  ],
  // Vessel Services → DMA
  'DMA': [
    { label: "Vessel Anchorage Permit in the Emirate's Waters",          authority: 'PCFC', prerequisite: true },
    { label: 'NOC Certificates',                                         authority: 'PCFC' },
    { label: 'Provider Registration',                                    authority: 'PCFC' },
    { label: 'Operating Permit',                                         authority: 'PCFC' },
  ],
  // Vessel Services → DPA
  'DPA': [
    { label: 'NOC Certificates',                                         authority: 'PCFC', prerequisite: true },
    { label: 'PAN, PDN, PC',                                             authority: 'PCFC' },
    { label: 'ePermit',                                                  authority: 'PCFC' },
    { label: 'License Activity Approval',                                authority: 'PCFC' },
    { label: 'Prequalification',                                         authority: 'PCFC' },
  ],
  // Cargo Clearance → Permits → Consumer
  'CC Permits – Consumer': [
    { label: 'Release for Local Market',                                 authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Transfer From and To Dubai',                               authority: 'Dubai Municipality' },
    { label: 'Release of Food for Re-Export',                            authority: 'Dubai Municipality' },
  ],
  // Cargo Clearance → Permits → Food
  'CC Permits – Food': [
    { label: 'Release for Local Market',                                 authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Transfer From and To Dubai',                               authority: 'Dubai Municipality' },
    { label: 'Release of Food for Re-Export',                            authority: 'Dubai Municipality' },
  ],
  // Cargo Clearance → Permits → Veterinary
  'CC Permits – Veterinary': [
    { label: 'Release Veterinary Consignments',                          authority: 'Dubai Municipality', prerequisite: true },
    { label: 'Admit Animal / Veterinary Consignments',                   authority: 'Dubai Municipality' },
  ],
  // Cargo Clearance → Certificates → Food
  'CC Certificates – Food': [
    { label: 'Certificate to Export Food',                               authority: 'Dubai Municipality', prerequisite: true },
  ],
  // Cargo Clearance → Certificates → Veterinary
  'CC Certificates – Veterinary': [
    { label: 'Health Certificate for Animals and Veterinary Products',   authority: 'Dubai Municipality', prerequisite: true },
  ],
  // Cargo Clearance → Certificates → Vessel
  'CC Certificates – Vessel': [
    { label: 'Ship Sanitation Certificate',                              authority: 'Dubai Municipality', prerequisite: true },
  ],
  // Cargo Clearance → Certificates → Dangerous / Hazardous Cargo → Dangerous Goods
  'CC Dangerous – Dangerous Goods': [
    { label: 'Dangerous / Hazardous Cargo NOC',                          authority: 'DCAA', prerequisite: true },
    { label: 'No Objection Certificate to Transport Dangerous Goods by Air', authority: 'DCAA' },
    { label: 'Hazardous Goods - Chemical Materials - NOC',               authority: 'DCAA' },
  ],
  // Cargo Clearance → Certificates → Dangerous / Hazardous Cargo → Firearms
  'CC Dangerous – Firearms': [
    { label: 'No Objection Certificate to Transport Firearms and Ammunition', authority: 'DCAA', prerequisite: true },
  ],
  // Cargo Clearance → Certificates → Dangerous / Hazardous Cargo → Suspicious Goods
  'CC Dangerous – Suspicious Goods': [
    { label: 'Inspecting Suspicious Goods',                              authority: 'DCAA', prerequisite: true },
  ],
  // Others → ATA Carnet
  'ATA Carnet': [
    { label: 'ATA Carnet',                                               authority: 'Dubai Chambers', prerequisite: true },
  ],
};

const FREQUENT_COMBOS = [
  { activity: 'Import', mode: 'Sea',  cargo: 'Food Consignment',  count: 14, lastUsed: '3 days ago' },
  { activity: 'Export', mode: 'Air',  cargo: 'Pharmaceuticals',   count: 7,  lastUsed: '2 weeks ago' },
  { activity: 'Import', mode: 'Air',  cargo: 'Consumer Goods',    count: 3,  lastUsed: '1 month ago' },
];

const AUTHORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Dubai Municipality': { bg: '#e8f5ee', text: '#1a7a45', border: '#b6dfc8' },
  'DCAA':               { bg: '#fff3e0', text: '#b45309', border: '#f5c88a' },
  'Dubai Chambers':     { bg: '#ede9fe', text: '#6d28d9', border: '#c4b5fd' },
  'SIRA':               { bg: '#fff0f0', text: '#c0392b', border: '#f5b8b8' },
  'Dubai Police':       { bg: '#e8f0fb', text: '#1360d2', border: '#b8d0f5' },
  'MOCCAE':             { bg: '#e8faf3', text: '#0f7960', border: '#a8dfc8' },
  'Civil Defence':      { bg: '#fef2f2', text: '#b91c1c', border: '#fca5a5' },
  'Ministry of Economy':{ bg: '#f0f9ff', text: '#0369a1', border: '#bae6fd' },
  'Dubai Customs':      { bg: '#f8faff', text: '#334155', border: '#cbd5e1' },
  'PCFC':               { bg: '#e6f3fb', text: '#0e6ba8', border: '#a8d4ee' },
};
const authorityStyle = (a: string) => AUTHORITY_COLORS[a] ?? { bg: '#eef4ff', text: '#1360d2', border: '#c0d4f8' };

/* Agent codes offered on the "Select Agent Code" gate shown before Start Journey / View Requests. */
const AGENT_CODES = ['A121324', 'M132432', 'A118765', 'M129981', 'A104532'];

type Step = 'welcome' | 'recent' | 'search' | 'activity' | 'mode' | 'cargo' | 'done' | 'prepare' | 'p-activity' | 'p-mode' | 'p-cargo' | 'p-info' | 'p-steps'
  | 'reg-sub' | 'vessel-sub' | 'cc-type' | 'cc-mode' | 'cc-category' | 'cc-subcat';
const STEP_META: Record<string, { question: string }> = {
  welcome:    { question: "Hi! How would you like to find a permit or certificate today?" },
  recent:     { question: "Here are your recently applied services. Re-apply or start fresh." },
  search:     { question: "What service are you looking for? I'll search for it." },
  activity:   { question: 'What are you looking to do?' },
  mode:       { question: 'How will your cargo travel?' },
  cargo:      { question: 'What type of cargo are you shipping?' },
  prepare:    { question: 'Great! Let\'s prepare your permits in advance to speed up clearance.' },
  'p-activity': { question: 'What are you looking to do?' },
  'p-mode':     { question: 'How will your cargo travel?' },
  'p-cargo':    { question: 'What type of cargo are you shipping?' },
  'p-info':     { question: 'Here\'s what you\'ll need to prepare in advance.' },
  'reg-sub':    { question: 'Which registration service do you need?' },
  'vessel-sub': { question: 'Which authority handles your vessel service?' },
  'cc-type':    { question: 'What are you looking to do?' },
  'cc-mode':    { question: 'How will your cargo travel?' },
  'cc-category':{ question: 'Are you looking for a permit or a certificate?' },
  'cc-subcat':  { question: 'What type of cargo or consignment?' },
};

/* ── Animations ── */
const STYLES = `
  @keyframes float      { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
  @keyframes orbGlow    { 0%,100%{box-shadow:0 0 16px rgba(99,102,241,0.4),0 0 32px rgba(19,96,210,0.18)} 50%{box-shadow:0 0 28px rgba(99,102,241,0.7),0 0 56px rgba(6,182,212,0.22)} }
  @keyframes ripple     { 0%{transform:scale(1);opacity:0.4} 100%{transform:scale(2.6);opacity:0} }
  @keyframes msgIn      { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }
  @keyframes pillIn     { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:none} }
  @keyframes chipIn     { from{opacity:0;transform:translateY(8px) scale(0.96)} to{opacity:1;transform:none} }
  @keyframes slideUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:none} }
  @keyframes dot        { 0%,80%,100%{transform:translateY(0);opacity:0.35} 40%{transform:translateY(-5px);opacity:1} }
  @keyframes particleUp { 0%{transform:translateY(0) scale(1);opacity:0.6} 100%{transform:translateY(-44px) scale(0);opacity:0} }
  @keyframes panelIn    { from{opacity:0;transform:translateY(12px) scale(0.98)} to{opacity:1;transform:none} }
  @keyframes spinCW     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes spinCCW    { from{transform:rotate(0deg)} to{transform:rotate(-360deg)} }
  @keyframes coreGlow   { 0%,100%{opacity:0.7} 50%{opacity:1} }
  @keyframes welcomeIn  { from{opacity:0;transform:translateY(24px) scale(0.97)} to{opacity:1;transform:none} }
  @keyframes fadeSlide  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
  .chat-scroll::-webkit-scrollbar{width:4px}
  .chat-scroll::-webkit-scrollbar-thumb{background:#c8d8f0;border-radius:4px}
  .chat-scroll::-webkit-scrollbar-track{background:transparent}
`;

/* ── Bot avatar — plain circle with bot icon ── */
function AiOrb({ size = 36, thinking = false }: { size?: number; thinking?: boolean }) {
  const iconSize = Math.round(size * 0.52);
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      {thinking && [0,1,2].map(i => (
        <div key={i} style={{ position:'absolute', inset:-(size*0.22), borderRadius:'50%', border:'1.5px solid rgba(19,96,210,0.18)', animation:'ripple 2s ease-out infinite', animationDelay:`${i*0.6}s`, pointerEvents:'none' }} />
      ))}
      <div style={{
        width:size, height:size, borderRadius:'50%',
        background:'#1360d2',
        display:'flex', alignItems:'center', justifyContent:'center',
        flexShrink:0,
        boxShadow:`0 ${size*0.08}px ${size*0.22}px rgba(19,96,210,0.32)`,
      }}>
        <svg viewBox="0 0 24 24" width={iconSize} height={iconSize} fill="none" stroke="rgba(255,255,255,0.95)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="12" rx="3"/>
          <path d="M9 12h.01M15 12h.01"/>
          <path d="M9 16h6"/>
          <path d="M12 8V5"/>
          <circle cx="12" cy="4" r="1.2" fill="rgba(255,255,255,0.95)" stroke="none"/>
          <path d="M6 8V7a2 2 0 012-2h8a2 2 0 012 2v1"/>
        </svg>
      </div>
    </div>
  );
}

/* ── Floating particles ── */
function Particles({ color = '#818cf8' }: { color?: string }) {
  return (
    <>{[...Array(5)].map((_, i) => (
      <div key={i} style={{ position:'absolute', width:4+(i%2)*2, height:4+(i%2)*2, borderRadius:'50%', background:['#818cf8','#1360d2','#06b6d4','#a78bfa','#60a5fa'][i], left:`${18+i*14}%`, bottom:'65%', animation:'particleUp 1.8s ease-out infinite', animationDelay:`${i*0.3}s`, opacity:0, pointerEvents:'none' }} />
    ))}</>
  );
}

/* ── AI message bubble ── */
function AiMessage({ text, isNew = true }: { text: string; isNew?: boolean }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, animation:isNew?'msgIn 0.4s ease':'none' }}>
      <AiOrb size={36} />
      <div style={{ background:'#fff', border:'1px solid #eef0f6', borderRadius:'4px 18px 18px 18px', padding:'14px 20px', maxWidth:'72%', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
        <p style={{ fontFamily:font, fontSize:16, fontWeight:400, color:'#111838', margin:0, lineHeight:1.65 }}>{text}</p>
      </div>
    </div>
  );
}

/* ── User answer pill ── */
function UserPill({ label }: { label: string }) {
  return (
    <div style={{ display:'flex', justifyContent:'flex-end', animation:'pillIn 0.35s ease' }}>
      <div style={{ background:'linear-gradient(135deg, #0e1b3d 0%, #1360d2 65%, #2080e8 100%)', color:'#fff', borderRadius:'18px 4px 18px 18px', padding:'11px 20px', fontFamily:font, fontSize:15, fontWeight:600, display:'inline-flex', alignItems:'center', gap:7, boxShadow:'0 4px 16px rgba(19,96,210,0.42)', maxWidth:'68%' }}>
        <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 5"/></svg>
        {label}
      </div>
    </div>
  );
}

/* ── Thinking ── */
function ThinkingState() {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:12, animation:'msgIn 0.3s ease', position:'relative' }}>
      <div style={{ position:'relative' }}><AiOrb size={36} thinking /><Particles /></div>
      <div style={{ background:'#fff', border:'1px solid #eef0f6', borderRadius:'4px 18px 18px 18px', padding:'14px 20px', display:'flex', alignItems:'center', gap:8, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation:'float 2s ease infinite' }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/>
        </svg>
        <span style={{ fontFamily:font, fontSize:13, color:'#8fa8c8', letterSpacing:0.3 }}>Analyzing your request</span>
        {[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'#818cf8', animation:'dot 1.4s ease infinite', animationDelay:`${i*0.2}s` }} />)}
      </div>
    </div>
  );
}

/* ── Welcome choice cards (dark gradient) ── */
const WELCOME_CHOICES = [
  {
    key: 'recent',
    label: 'Previously Applied',
    desc: 'Quickly re-apply from your history',
    grad: 'linear-gradient(145deg, #1e3a8a 0%, #1360d2 100%)',
    glow: 'rgba(19,96,210,0.45)',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4l3 3"/><circle cx="12" cy="12" r="9"/></svg>),
  },
  {
    key: 'activity',
    label: 'Find with Assistant',
    desc: 'Answer a few questions and I\'ll find the right permits',
    grad: 'linear-gradient(145deg, #1560a8 0%, #0ea5e9 100%)',
    glow: 'rgba(14,165,233,0.45)',
    icon: (<svg viewBox="0 0 24 12" width="30" height="15" fill="none"><circle cx="1.5" cy="9" r="1.8" fill="rgba(255,255,255,0.9)"/><circle cx="5.5" cy="4" r="1.8" fill="rgba(255,255,255,0.9)"/><circle cx="9.5" cy="1.5" r="1.8" fill="rgba(255,255,255,0.9)"/><circle cx="13.5" cy="4" r="1.8" fill="rgba(255,255,255,0.9)"/><circle cx="17.5" cy="9" r="1.8" fill="rgba(255,255,255,0.9)"/><circle cx="21.5" cy="4" r="1.8" fill="rgba(255,255,255,0.9)"/><polyline points="1.5,9 5.5,4 9.5,1.5 13.5,4 17.5,9 21.5,4" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.9" strokeDasharray="1.5 2"/></svg>),
  },
  {
    key: 'search',
    label: 'Search by Name',
    desc: 'Know the exact service? Search it directly',
    grad: 'linear-gradient(145deg, #0c4a6e 0%, #0369a1 100%)',
    glow: 'rgba(3,105,161,0.45)',
    icon: (<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>),
  },
];

function WelcomeChoiceCards({ onSelect }: { onSelect: (key: string, label: string) => void }) {
  const [hov, setHov] = useState('');
  return (
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:10, maxWidth:680, margin:'0 auto' }}>
      {WELCOME_CHOICES.map((c, idx) => {
        const isH = hov === c.key;
        return (
          <button key={c.key} onClick={() => onSelect(c.key, c.label)}
            onMouseEnter={() => setHov(c.key)} onMouseLeave={() => setHov('')}
            style={{
              animation:`chipIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both`,
              animationDelay:`${idx*80}ms`,
              display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
              gap:10, width:'100%', minHeight:130,
              background: c.grad,
              border:'none',
              borderRadius:18, padding:'18px 12px',
              cursor:'pointer', transition:'all 0.22s cubic-bezier(0.34,1.4,0.64,1)',
              boxShadow: isH
                ? `0 12px 36px ${c.glow}, 0 4px 12px ${c.glow}`
                : `0 4px 20px ${c.glow.replace('0.45','0.25')}`,
              transform: isH ? 'translateY(-5px) scale(1.03)' : 'none',
            }}>
            <div style={{ width:44, height:44, borderRadius:12, background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.22s', boxShadow: isH?'0 0 20px rgba(255,255,255,0.2)':'none' }}>
              {c.icon}
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#fff', lineHeight:1.3, marginBottom:4 }}>{c.label}</div>
              <div style={{ fontFamily:font, fontSize:11, color:'rgba(255,255,255,0.72)', lineHeight:1.4 }}>{c.desc}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}


/* ── Option cards (Import / Export / Sea / Air etc) — solid blue gradient style ── */
function OptionCards({ options, onSelect }: { options: any[]; onSelect: (o: any) => void }) {
  const [hov, setHov] = useState('');
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
      {options.map((o, idx) => {
        const isH = hov === o.key;
        return (
          <button key={o.key} onClick={() => onSelect(o)}
            onMouseEnter={() => setHov(o.key)} onMouseLeave={() => setHov('')}
            style={{
              animation:`chipIn 0.32s cubic-bezier(0.34,1.4,0.64,1) both`,
              animationDelay:`${idx*50}ms`,
              display:'flex', alignItems:'center', gap:14,
              width:'100%', padding:'11px 16px',
              background: isH ? '#eef4ff' : '#fff',
              border: isH ? '1.5px solid #1360d2' : '1.5px solid #e2eaf8',
              borderRadius:12,
              cursor:'pointer', transition:'all 0.18s',
              boxShadow: isH ? '0 4px 16px rgba(19,96,210,0.12)' : '0 1px 4px rgba(0,0,0,0.05)',
              transform: isH ? 'translateX(3px)' : 'none',
              textAlign:'left',
            }}>
            <div style={{ width:38, height:38, borderRadius:10, background: isH ? '#1360d2' : 'linear-gradient(145deg,rgb(21,96,168),#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.18s' }}>
              <div style={{ color:'#fff', filter:'brightness(10)', display:'flex' }}>{o.icon}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:font, fontSize:13, fontWeight:700, color: isH ? '#1360d2' : '#111838', lineHeight:1.2 }}>{o.label}</div>
              {o.desc && <div style={{ fontFamily:font, fontSize:11, color:'#8494a8', marginTop:2, lineHeight:1.3 }}>{o.desc}</div>}
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={isH ? '#1360d2' : '#b0bcd8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        );
      })}
    </div>
  );
}

/* ── Cargo list — WhatsApp-style horizontal rows, 2 per row ── */
function CargoCards({ onSelect }: { onSelect: (o: any) => void }) {
  const [hov, setHov] = useState('');
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
      {CARGO_OPTIONS.map((o, idx) => {
        const isH = hov === o.key;
        return (
          <button key={o.key} onClick={() => onSelect(o)}
            onMouseEnter={()=>setHov(o.key)} onMouseLeave={()=>setHov('')}
            style={{ animation:`chipIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both`, animationDelay:`${idx*35}ms`, display:'flex', alignItems:'center', gap:14, width:'100%', padding:'11px 16px', background: isH ? '#eef4ff' : '#fff', border: isH ? '1.5px solid #1360d2' : '1.5px solid #e2eaf8', borderRadius:12, cursor:'pointer', transition:'all 0.18s', boxShadow: isH ? '0 4px 16px rgba(19,96,210,0.12)' : '0 1px 4px rgba(0,0,0,0.05)', transform: isH ? 'translateX(3px)' : 'none', textAlign:'left' }}>
            <div style={{ width:38, height:38, borderRadius:10, background: isH ? '#1360d2' : 'linear-gradient(145deg,rgb(21,96,168),#0ea5e9)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.18s' }}>
              <div style={{ color:'#fff', filter:'brightness(10)', display:'flex' }}>{o.icon}</div>
            </div>
            <div style={{ flex:1 }}>
              <span style={{ fontFamily:font, fontSize:13, fontWeight:700, color: isH ? '#1360d2' : '#111838' }}>{o.label}</span>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={isH ? '#1360d2' : '#b0bcd8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        );
      })}
    </div>
  );
}

/* ── Prepare in Advance card (Figma design) ── */
const PREPARE_STEPS_MAP: Record<string, { step: string; label: string; authority: string }[]> = {
  'Food Consignment': [
    { step:'1', label:'Product Registration',                              authority:'Dubai Municipality' },
    { step:'2', label:'Register and Access a Food Item',                   authority:'Dubai Municipality' },
    { step:'3', label:'Request to Transfer Food Consignment',              authority:'Dubai Municipality' },
    { step:'4', label:'Release of Imported Food Consignments',             authority:'Dubai Municipality' },
    { step:'5', label:'Apply for Food Health Certificate',                 authority:'Dubai Municipality' },
  ],
  'Veterinary Consignments': [
    { step:'1', label:'Veterinary Import Permit',                          authority:'MOCCAE' },
    { step:'2', label:'Veterinary Health Certificate',                     authority:'MOCCAE' },
    { step:'3', label:'Release of Imported Consignments for Re-Export',    authority:'Dubai Municipality' },
  ],
  'Consumer Goods': [
    { step:'1', label:'Product Conformity Certificate',                    authority:'Dubai Municipality' },
    { step:'2', label:'Release of Importer Consignments for Local Market', authority:'Dubai Customs' },
  ],
  'Pharmaceuticals': [
    { step:'1', label:'Product Registration with Health Authority',        authority:'DCAA' },
    { step:'2', label:'Pharmaceutical Import Permit',                      authority:'DCAA' },
    { step:'3', label:'Health Certificate for Medical Products',           authority:'Dubai Municipality' },
  ],
  'Live Animals': [
    { step:'1', label:'CITES Import / Export Permit',                      authority:'MOCCAE' },
    { step:'2', label:'Veterinary Health Certificate',                     authority:'MOCCAE' },
    { step:'3', label:'Quarantine Clearance Certificate',                  authority:'MOCCAE' },
  ],
  'Chemicals & Hazardous': [
    { step:'1', label:'Hazardous Material Safety Assessment',              authority:'Civil Defence' },
    { step:'2', label:'Hazardous Material Certificate',                    authority:'Civil Defence' },
    { step:'3', label:'Dangerous Goods Declaration',                       authority:'DCAA' },
  ],
  'Fire Arms': [
    { step:'1', label:'Controlled Goods Import Approval',                  authority:'Ministry of Economy' },
    { step:'2', label:'Firearm Import / Export Permit',                    authority:'Dubai Police' },
  ],
  'Other Goods': [
    { step:'1', label:'Trade Documentation Check',                         authority:'Dubai Customs' },
    { step:'2', label:'General Trade Clearance',                           authority:'Dubai Customs' },
  ],
};

function PrepareInfoPanel({ answers, onKnow, onShowSteps, onStart }: {
  answers: Record<string, string>;
  onKnow: () => void;
  onShowSteps: () => void;
  onStart: () => void;
  showSteps?: boolean;
}) {
  const cargo = answers['p-cargo'] ?? 'Other Goods';
  const steps = PREPARE_STEPS_MAP[cargo] ?? PREPARE_STEPS_MAP['Other Goods'];
  const authorities = Array.from(new Set(steps.map(s => s.authority)));
  const [showSteps, setShowSteps] = useState(false);

  return (
    <div style={{ background:'#fff', border:'1.5px solid #e9edf3', borderRadius:16, padding:'20px 22px', boxShadow:'0 4px 16px rgba(10,37,64,0.06)' }}>
      <div style={{ fontSize:14, fontWeight:600, color:'#0a2540', lineHeight:1.65, marginBottom:8 }}>
        To help expedite your shipment clearance, you can submit the required permit applications in advance to reduce processing time.
      </div>
      <div style={{ fontSize:13, color:'#697498', lineHeight:1.65, marginBottom:16 }}>
        To get started faster, select the government entity if you already know which one issues your required permit or certificate. Otherwise, click <strong>Show the Steps</strong> and we'll guide you to the right service.
      </div>

      <div style={{ display:'flex', flexWrap:'wrap', gap:7, marginBottom:18 }}>
        {authorities.map(a => {
          const s = authorityStyle(a);
          return (
            <span key={a} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'5px 11px', borderRadius:8, background:s.bg, border:`1px solid ${s.border}`, fontSize:12, fontWeight:600, color:s.text }}>
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke={s.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {a}
            </span>
          );
        })}
      </div>

      {!showSteps ? (
        <div style={{ display:'flex', gap:10 }}>
          <button onClick={onKnow}
            style={{ background:'#fff', color:'#1360d2', border:'1.5px solid #1360d2', borderRadius:8, padding:'10px 22px', fontFamily:font, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.18s' }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#eef4ff'}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='#fff'}>
            I Know
          </button>
          <button onClick={()=>{ setShowSteps(true); onShowSteps(); }}
            style={{ background:'#0e1b3d', color:'#fff', border:'none', borderRadius:8, padding:'10px 22px', fontFamily:font, fontSize:13, fontWeight:600, cursor:'pointer', transition:'all 0.18s', display:'flex', alignItems:'center', gap:6 }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#1a2a50'}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='#0e1b3d'}>
            Show the Steps
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      ) : (
        <div style={{ animation:'slideUp 0.3s ease' }}>
          <div style={{ fontSize:13, fontWeight:700, color:'#0a2540', marginBottom:14 }}>Required steps for {cargo}</div>
          {steps.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:14, alignItems:'flex-start', paddingBottom:14 }}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:'#1360d2', color:'#fff', fontSize:13, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{s.step}</div>
                {i < steps.length-1 && <div style={{ width:2, flex:1, minHeight:18, background:'#dde8f8', marginTop:4 }} />}
              </div>
              <div style={{ paddingTop:4 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#0a2540', marginBottom:4 }}>{s.label}</div>
                <span style={{ ...authorityStyle(s.authority), display:'inline-flex', alignItems:'center', gap:4, borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:600, border:`1px solid ${authorityStyle(s.authority).border}` }}>
                  {s.authority}
                </span>
              </div>
            </div>
          ))}
          <button onClick={onStart}
            style={{ marginTop:4, background:'#1360d2', color:'#fff', border:'none', borderRadius:8, padding:'11px 28px', fontFamily:font, fontSize:13, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all 0.18s' }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#0e4bbd'}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='#1360d2'}>
            Start Application
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Recent services in chat ── */
function RecentServicesInChat({ onQuickStart, onStartNew, readonly }: { onQuickStart: (c: typeof FREQUENT_COMBOS[0]) => void; onStartNew: () => void; readonly?: boolean }) {
  const [hov, setHov] = useState('');
  const ACTION_BTNS = [
    { label:'Start Journey', bg:'#1360d2', color:'#fff', border:'none', shadow:'0 2px 8px rgba(19,96,210,0.22)',
      icon:<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg> },
    { label:'View Requests', bg:'#fff', color:'#1360d2', border:'1.5px solid #1360d2', shadow:'none',
      icon:<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
    { label:'', bg:'#fff', color:'#5a6478', border:'1.5px solid #e2eaf8', shadow:'none',
      icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5a6478" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Service Info</title><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v4"/></svg> },
  ];
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      {FREQUENT_COMBOS.map((combo, idx) => {
        const isH = hov === String(idx);
        const permits = PERMITS_MAP[combo.cargo] ?? [];
        const s = authorityStyle(permits[0]?.authority ?? '');
        return (
          <div key={idx} onMouseEnter={()=>setHov(String(idx))} onMouseLeave={()=>setHov('')}
            style={{ background: isH?'#f8fbff':'#fff', border:`1.5px solid ${isH?'#1360d2':'#eef0f6'}`, borderRadius:14, padding:'14px 18px', transition:'all 0.18s', animation:`chipIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both`, animationDelay:`${idx*70}ms`, boxShadow: isH?'0 4px 16px rgba(19,96,210,0.1)':'0 1px 6px rgba(0,0,0,0.04)', transform: isH?'translateY(-1px)':'none' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:12, flexWrap:'wrap' }}>
              <div style={{ flex:1, minWidth:220 }}>
                <p style={{ fontFamily:font, fontSize:15, fontWeight:600, color:'#111838', margin:'0 0 5px' }}>
                  {permits[0]?.label}
                </p>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:s.bg, border:`1px solid ${s.border}`, borderRadius:20, padding:'2px 9px', fontSize:10, fontWeight:700, color:s.text }}>
                    <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke={s.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    {permits[0]?.authority}
                  </span>
                  <span style={{ fontFamily:font, fontSize:13, color:'#697498' }}>Last applied {combo.lastUsed}</span>
                </div>
              </div>
              {!readonly && (
                <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                  {ACTION_BTNS.map(a => (
                    <button key={a.label}
                      onClick={() => { if (a.label === 'Start Journey') onQuickStart(combo); }}
                      style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:6, background:a.bg, border:a.border, color:a.color, fontFamily:font, fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', boxShadow:a.shadow, transition:'opacity 0.15s' }}
                      onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity='0.8'}
                      onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity='1'}>
                      {a.icon}{a.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
      {!readonly && (
        <button onClick={onStartNew}
          style={{ alignSelf:'flex-start', display:'inline-flex', alignItems:'center', gap:7, background:'#fff', border:'1.5px solid #1360d2', borderRadius:20, padding:'9px 20px', fontFamily:font, fontSize:13, fontWeight:600, color:'#1360d2', cursor:'pointer', animation:`chipIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both`, animationDelay:`${FREQUENT_COMBOS.length*70}ms`, transition:'all 0.18s' }}
          onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#1360d2';(e.currentTarget as HTMLButtonElement).style.color='#fff';}}
          onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='#fff';(e.currentTarget as HTMLButtonElement).style.color='#1360d2';}}>
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Start a new application
        </button>
      )}
    </div>
  );
}

/* ── Search result service card with 3 actions ── */
function SearchServiceCard({ permit, onRestart }: { permit: { label: string; authority: string }; onRestart: () => void }) {
  const s = authorityStyle(permit.authority);
  const actions = [
    {
      key: 'journey',
      label: 'Start Journey',
      desc: 'Begin the application process step by step',
      icon: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>),
      bg: '#1360d2', color: '#fff', border: 'none',
    },
    {
      key: 'requests',
      label: 'Service Requests',
      desc: 'View and track your existing requests',
      icon: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>),
      bg: '#fff', color: '#1360d2', border: '1.5px solid #1360d2',
    },
    {
      key: 'info',
      label: '',
      desc: 'Learn about requirements and eligibility',
      icon: (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#5a6478" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><title>Service Info</title><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v4"/></svg>),
      bg: '#fff', color: '#5a6478', border: '1.5px solid #e2eaf8',
    },
  ];

  return (
    <div style={{ animation:'slideUp 0.35s ease', display:'flex', flexDirection:'column', gap:14 }}>
      {/* Service card */}
      <div style={{ background:'#fff', border:'1.5px solid #1360d2', borderRadius:16, padding:'18px 22px', boxShadow:'0 2px 10px rgba(19,96,210,0.07)' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'#eaf1ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#111838', marginBottom:6 }}>{permit.label}</div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:5, background:s.bg, border:`1px solid ${s.border}`, borderRadius:20, padding:'3px 10px 3px 8px' }}>
              <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke={s.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              <span style={{ fontFamily:font, fontSize:11, fontWeight:700, color:s.text }}>{permit.authority}</span>
            </div>
          </div>
          <button onClick={onRestart}
            style={{ flexShrink:0, background:'#fff', border:'1px solid #dce8ff', borderRadius:20, padding:'6px 14px', fontFamily:font, fontSize:12, color:'#1360d2', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'all 0.18s' }}
            onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#eef4ff'}
            onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='#fff'}>
            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
            Search again
          </button>
        </div>
      </div>

      {/* 3 action buttons — all in one row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8 }}>
        {actions.map((a, idx) => (
          <button key={a.key}
            style={{ animation:`chipIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both`, animationDelay:`${idx*60}ms`, display:'flex', alignItems:'center', gap:14, width:'100%', padding:'12px 16px', borderRadius:12, background: a.key==='journey' ? '#1360d2' : '#fff', border: a.key==='journey' ? 'none' : (a.key==='requests' ? '1.5px solid #1360d2' : '1.5px solid #e2eaf8'), fontFamily:font, cursor:'pointer', transition:'all 0.18s', textAlign:'left', boxShadow: a.key==='journey' ? '0 4px 14px rgba(19,96,210,0.28)' : '0 1px 4px rgba(0,0,0,0.05)' }}
            onMouseEnter={e=>{ const el = e.currentTarget as HTMLButtonElement; el.style.transform='translateX(3px)'; el.style.boxShadow = a.key==='journey' ? '0 8px 24px rgba(19,96,210,0.38)' : '0 4px 16px rgba(19,96,210,0.12)'; }}
            onMouseLeave={e=>{ const el = e.currentTarget as HTMLButtonElement; el.style.transform='none'; el.style.boxShadow = a.key==='journey' ? '0 4px 14px rgba(19,96,210,0.28)' : '0 1px 4px rgba(0,0,0,0.05)'; }}>
            <div style={{ width:38, height:38, borderRadius:10, background: a.key==='journey' ? 'rgba(255,255,255,0.18)' : '#eef4ff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, color: a.key==='journey' ? '#fff' : '#1360d2' }}>
              {a.icon}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color: a.key==='journey' ? '#fff' : (a.key==='requests' ? '#1360d2' : '#111838'), marginBottom:2 }}>{a.label}</div>
              <div style={{ fontSize:11, color: a.key==='journey' ? 'rgba(255,255,255,0.72)' : '#8494a8', lineHeight:1.4 }}>{a.desc}</div>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke={a.key==='journey' ? 'rgba(255,255,255,0.7)' : '#b0bcd8'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink:0 }}><path d="M9 18l6-6-6-6"/></svg>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Search results panel (driven by bottom bar input) ── */
function SearchResults({ q, onSelect }: { q: string; onSelect: (label: string) => void }) {
  const ALL_PERMITS = Object.values(PERMITS_MAP).flat();
  const results = q.length > 1
    ? ALL_PERMITS.filter(p => p.label.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];
  if (!q || q.length < 2) return (
    <div style={{ textAlign:'center', fontFamily:font, fontSize:13, color:'#97a3b8', padding:'8px 0' }}>Start typing in the search bar below to find a service…</div>
  );
  if (results.length === 0) return (
    <div style={{ textAlign:'center', fontFamily:font, fontSize:13, color:'#97a3b8', padding:'8px 0' }}>No services matched. Try a different keyword.</div>
  );
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:6, maxWidth:640, margin:'0 auto', width:'100%' }}>
      {results.map((p, i) => {
        const s = authorityStyle(p.authority);
        return (
          <button key={i} onClick={() => onSelect(p.label)}
            style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(255,255,255,0.9)', border:'1.5px solid #eef0f6', borderRadius:14, padding:'12px 16px', cursor:'pointer', textAlign:'left', transition:'all 0.16s', animation:`chipIn 0.25s ease both`, animationDelay:`${i*30}ms` }}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#1360d2';(e.currentTarget as HTMLButtonElement).style.background='#f0f5ff';}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.borderColor='#eef0f6';(e.currentTarget as HTMLButtonElement).style.background='rgba(255,255,255,0.9)';}}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#111838' }}>{p.label}</div>
              <div style={{ display:'inline-flex', alignItems:'center', gap:4, marginTop:3, background:s.bg, border:`1px solid ${s.border}`, borderRadius:10, padding:'2px 8px' }}>
                <span style={{ fontFamily:font, fontSize:11, color:s.text, fontWeight:600 }}>{p.authority}</span>
              </div>
            </div>
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#97a3b8" strokeWidth="2" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        );
      })}
    </div>
  );
}

/* ── Unified journey steps: numbered list with prerequisite chips + action buttons ── */
function DoneWithPrepare({ cargoLabel, cargoKey, onRestart, onOpenService }: { cargoLabel: string; cargoKey: string; onRestart: () => void; onOpenService?: (service: string) => void }) {
  const cargo = cargoLabel;
  const permits = PERMITS_MAP[cargoKey] ?? [];
  /* Start Journey / View Requests both gate through an Agent Code selection popup first. */
  const [agentGate, setAgentGate] = useState<{ service: string; action: string } | null>(null);
  const [pickedAgentCode, setPickedAgentCode] = useState('');
  const openAgentGate = (service: string, action: string) => { setPickedAgentCode(''); setAgentGate({ service, action }); };
  const confirmAgentGate = () => {
    if (!agentGate) return;
    onOpenService?.(agentGate.service);
    setAgentGate(null);
  };
  const ACTION_BTNS = [
    { label:'Start Journey', bg:'#1360d2', color:'#fff', border:'none', shadow:'0 2px 8px rgba(19,96,210,0.22)',
      icon:<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg> },
    { label:'View Requests', bg:'#fff', color:'#1360d2', border:'1.5px solid #1360d2', shadow:'none',
      icon:<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg> },
    { label:'', bg:'#fff', color:'#5a6478', border:'1.5px solid #e2eaf8', shadow:'none',
      icon:<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#5a6478" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><title>Service Info</title><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v4"/></svg> },
  ];
  return (
    <>
    <div style={{ display:'flex', flexDirection:'column', gap:10, animation:'msgIn 0.35s ease' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'#fff', border:'1.5px solid #1360d2', borderRadius:14, padding:'16px 20px', boxShadow:'0 2px 10px rgba(19,96,210,0.08)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ textAlign:'center', minWidth:38 }}>
            <p style={{ fontFamily:font, fontSize:28, fontWeight:800, color:'#1360d2', margin:0, lineHeight:1 }}>{permits.length}</p>
            <p style={{ fontFamily:font, fontSize:10, color:'#697498', margin:'2px 0 0', textTransform:'uppercase', letterSpacing:'0.5px' }}>Steps</p>
          </div>
          <div style={{ width:1, height:32, background:'#dde8f8', flexShrink:0 }} />
          <div>
            <p style={{ fontFamily:font, fontSize:14, fontWeight:700, color:'#111838', margin:'0 0 2px' }}>Your permit journey for {cargo}</p>
            <p style={{ fontFamily:font, fontSize:12, color:'#697498', margin:0 }}>Complete each step in order to clear your shipment</p>
          </div>
        </div>
        <button onClick={onRestart} style={{ flexShrink:0, background:'#f5f8ff', border:'1.5px solid #dce8ff', borderRadius:20, padding:'6px 14px', fontFamily:font, fontSize:12, color:'#1360d2', fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:4, transition:'all 0.18s' }}
          onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.background='#eef4ff'}
          onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.background='#f5f8ff'}>
          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
          Start over
        </button>
      </div>

      {/* Numbered step rows */}
      {permits.map((p, idx) => {
        const s = authorityStyle(p.authority);
        return (
          <div key={idx} style={{ display:'flex', gap:12, alignItems:'stretch', animation:`chipIn 0.3s cubic-bezier(0.34,1.4,0.64,1) both`, animationDelay:`${idx*60}ms` }}>
            {/* Step icon + connector */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0, paddingTop:14 }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:'#1360d2', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                {[
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 5v4h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>,
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 12h6M9 16h4"/></svg>,
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>,
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v4"/></svg>,
                ][idx] ?? <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M12 12v4"/></svg>}
              </div>
              {idx < permits.length-1 && <div style={{ width:2, flex:1, minHeight:12, background:'#dde8f8', marginTop:4 }} />}
            </div>
            {/* Card */}
            <div style={{ flex:1, background:'#fff', border:'1px solid #eef0f6', borderRadius:12, padding:'11px 14px', boxShadow:'0 1px 6px rgba(0,0,0,0.04)', display:'flex', alignItems:'center', gap:12 }}>
              {/* Left: name + badge + prerequisite */}
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:5 }}>
                  <span onClick={() => onOpenService?.(p.label)} style={{ fontFamily:font, fontSize:13, fontWeight:700, color:'#111838', cursor: onOpenService ? 'pointer' : 'default' }}>{p.label}</span>
                </div>
                <span style={{ display:'inline-flex', alignItems:'center', gap:4, background:s.bg, border:`1px solid ${s.border}`, borderRadius:20, padding:'2px 9px', fontSize:10, fontWeight:700, color:s.text }}>
                  <svg viewBox="0 0 24 24" width="9" height="9" fill="none" stroke={s.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  {p.authority}
                </span>
              </div>
              {/* Right: action buttons */}
              <div style={{ display:'flex', gap:6, flexShrink:0 }}>
                {ACTION_BTNS.map(a => (
                  <button key={a.label}
                    onClick={() => { if (a.label === 'Start Journey' || a.label === 'View Requests') openAgentGate(p.label, a.label); }}
                    style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', borderRadius:6, background:a.bg, border:a.border, color:a.color, fontFamily:font, fontSize:11, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap', boxShadow:a.shadow, transition:'opacity 0.15s' }}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.opacity='0.8'}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.opacity='1'}>
                    {a.icon}{a.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {agentGate && (
      <div style={{ position:'fixed', inset:0, zIndex:300, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(14,27,61,0.45)' }}
        onClick={() => setAgentGate(null)}>
        <div style={{ background:'#fff', borderRadius:16, width:420, maxWidth:'90vw', boxShadow:'0 10px 40px rgba(0,0,0,0.2)', overflow:'hidden' }}
          onClick={e => e.stopPropagation()}>
          <div style={{ padding:'20px 24px', borderBottom:'1px solid #eef0f6', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <p style={{ fontFamily:font, fontSize:18, fontWeight:700, color:'#111838', margin:0 }}>Select Agent Code</p>
              <p style={{ fontFamily:font, fontSize:12, color:'#697498', margin:'3px 0 0' }}>{agentGate.action} — {agentGate.service}</p>
            </div>
            <button onClick={() => setAgentGate(null)}
              style={{ width:32, height:32, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', background:'transparent', border:'none', cursor:'pointer', color:'#697498' }}>
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" /></svg>
            </button>
          </div>
          <div style={{ padding:'20px 24px' }}>
            <label style={{ fontFamily:font, fontSize:13, fontWeight:600, color:'#111838', display:'block', marginBottom:8 }}>Agent Code</label>
            <select value={pickedAgentCode} onChange={e => setPickedAgentCode(e.target.value)}
              style={{ width:'100%', height:44, borderRadius:8, border:'1.5px solid #d5ddfb', padding:'0 12px', fontFamily:font, fontSize:14, color:'#111838', background:'#fff' }}>
              <option value="">Select an agent code…</option>
              {AGENT_CODES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ padding:'16px 24px', borderTop:'1px solid #eef0f6', display:'flex', justifyContent:'flex-end', gap:10 }}>
            <button onClick={() => setAgentGate(null)}
              style={{ height:42, padding:'0 18px', borderRadius:8, border:'1.5px solid #1360d2', background:'#fff', color:'#1360d2', fontFamily:font, fontSize:14, fontWeight:600, cursor:'pointer' }}>
              Cancel
            </button>
            <button onClick={confirmAgentGate} disabled={!pickedAgentCode}
              style={{ height:42, padding:'0 18px', borderRadius:8, border:'none', background: pickedAgentCode ? '#1360d2' : '#a9c2f0', color:'#fff', fontFamily:font, fontSize:14, fontWeight:600, cursor: pickedAgentCode ? 'pointer' : 'not-allowed' }}>
              Proceed
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
}

/* ── Main ── */
export default function PermitsCreatePage({ onClose, initialStep, prefill, onOpenService }: Props) {
  const buildPrefillHistory = (): { step: Step; answer: string; opt: any }[] => {
    if (!prefill) return [];
    const h: { step: Step; answer: string; opt: any }[] = [];
    if (prefill.activity) h.push({ step: 'activity', answer: prefill.activity, opt: TRADE_OPTIONS.find(o => o.label === prefill.activity) });
    if (prefill.mode) h.push({ step: 'mode', answer: prefill.mode, opt: MODE_OPTIONS.find(o => o.label === prefill.mode) });
    if (prefill.cargo) h.push({ step: 'cargo', answer: prefill.cargo, opt: CARGO_OPTIONS.find(o => o.label === prefill.cargo) });
    return h;
  };
  const [step, setStep] = useState<Step>(initialStep ?? 'welcome');
  const [history, setHistory] = useState<{ step: Step; answer: string; opt: any }[]>(buildPrefillHistory());
  const [isTyping, setIsTyping] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isInputStep = step === 'cargo' || step === 'search';
  const hasChatted = history.length > 0 || step !== 'welcome';
  const answers: Record<string,string> = Object.fromEntries(history.map(h=>[h.step,h.answer]));
  /* The permit-lookup key for the current journey — the last-picked option's `mapKey` when set
     (used by the new category-tree steps whose display label doesn't match its PERMITS_MAP key),
     falling back to the plain answer label (the old activity→mode→cargo flow's convention). */
  const lastHist = history[history.length - 1];
  const cargoLabel = lastHist?.answer ?? 'Other Goods';
  const cargoKey = lastHist?.opt?.mapKey ?? cargoLabel;

  useEffect(() => { setTimeout(()=>setMounted(true), 40); }, []);
  const scrollDown = () => setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:'smooth',block:'end'}), 60);

  const showStep = (s: Step) => {
    setIsTyping(true); setShowOptions(false); setStep(s); setInputVal('');
    setTimeout(()=>{ setIsTyping(false); scrollDown(); if (s==='cargo'||s==='search') setTimeout(()=>inputRef.current?.focus(),100); }, 900);
    setTimeout(()=>{ setShowOptions(true); scrollDown(); }, 1350);
  };

  const submitInput = () => {
    const val = inputVal.trim();
    if (step === 'search') pickSearch(val);
    else if (step === 'cargo') {
      const match = CARGO_OPTIONS.find(o => o.label.toLowerCase().includes(val.toLowerCase()));
      const opt = match ?? CARGO_OPTIONS.find(o => o.key === 'other')!;
      pick('cargo', 'done', { ...opt, label: match ? opt.label : val });
    }
  };

  useEffect(()=>{
    if (prefill?.cargo) { setIsTyping(false); setStep('done'); scrollDown(); return; }
    showStep(initialStep ?? 'welcome');
  },[]);

  const pick = (curr: Step, next: Step, opt: any) => {
    setShowOptions(false);
    setHistory(h=>[...h,{step:curr,answer:opt.label,opt}]);
    scrollDown();
    if (next==='done') { setTimeout(()=>{setStep('done'); scrollDown();},400); }
    else showStep(next);
  };

  /* "Find with Assistant" category tree — where an option leads depends on which one was picked. */
  const nextStepForActivity = (o: any): Step => {
    if (o.key === 'registration') return 'reg-sub';
    if (o.key === 'vessel')       return 'vessel-sub';
    if (o.key === 'cargo')        return 'cc-type';
    return 'done'; // Others → straight to ATA Carnet
  };
  const ccSubOptionsFor = (categoryLabel: string | undefined) => categoryLabel === 'Certificates' ? CC_CERT_SUBCAT : CC_PERMITS_SUBCAT;

  const pickWelcome = (key: string, label: string) => {
    setShowOptions(false);
    setHistory(h=>[...h,{step:'welcome' as Step, answer:label, opt:{key,label}}]);
    scrollDown();
    if (key === 'prepare') {
      showStep('p-activity');
    } else {
      showStep(key as Step);
    }
  };

  const restart = () => { setHistory([]); showStep('welcome'); };

  const quickStart = (combo: typeof FREQUENT_COMBOS[0]) => {
    const actOpt  = TRADE_OPTIONS.find(o=>o.label===combo.activity)!;
    const modeOpt = MODE_OPTIONS.find(o=>o.label===combo.mode)!;
    const cargoOpt= CARGO_OPTIONS.find(o=>o.label===combo.cargo)!;
    setHistory(h=>[...h,
      {step:'welcome'  as Step, answer:'Previously Applied', opt:{key:'recent'}},
      {step:'recent'   as Step, answer:`Re-apply — ${combo.activity} / ${combo.mode} / ${combo.cargo}`, opt:null},
      {step:'activity' as Step, answer:combo.activity, opt:actOpt},
      {step:'mode'     as Step, answer:combo.mode,     opt:modeOpt},
      {step:'cargo'    as Step, answer:combo.cargo,    opt:cargoOpt},
    ]);
    setShowOptions(false); setStep('done'); scrollDown();
  };

  const startNew = () => {
    setHistory(h=>[...h,{step:'recent' as Step, answer:'Start a new application', opt:null}]);
    showStep('activity');
  };

  const pickSearch = (label: string) => {
    const ALL_PERMITS = Object.values(PERMITS_MAP).flat();
    const permit = ALL_PERMITS.find(p => p.label === label) ?? { label, authority: 'Dubai Customs' };
    setShowOptions(false);
    setHistory(h=>[...h,{step:'search' as Step, answer:label, opt:{ permit }}]);
    setStep('done'); scrollDown();
  };

  /* Re-pick from a past history position — restart flow from that point */
  const rePickAt = (histIdx: number, curr: Step, next: Step, opt: any) => {
    setHistory(h => [...h.slice(0, histIdx), {step:curr, answer:opt.label, opt}]);
    scrollDown();
    if (next==='done') setTimeout(()=>{setStep('done'); scrollDown();},400);
    else showStep(next);
  };

  /* Render the option panel for a history item (always visible, clickable to restart) */
  const renderHistoryOpts = (histStep: Step, histIdx: number) => {
    const op = (curr: Step, next: Step, o: any) => rePickAt(histIdx, curr, next, o);
    switch (histStep) {
      case 'welcome':     return <WelcomeChoiceCards onSelect={(k,l)=>{ setHistory(h=>h.slice(0,histIdx)); pickWelcome(k,l); }} />;
      case 'recent':      return <RecentServicesInChat onQuickStart={c=>{setHistory(h=>h.slice(0,histIdx));quickStart(c);}} onStartNew={()=>{setHistory(h=>h.slice(0,histIdx));startNew();}} />;
      case 'activity':    return <OptionCards options={ACTIVITY_OPTIONS} onSelect={o=>op('activity',nextStepForActivity(o),o)} />;
      case 'mode':        return <OptionCards options={MODE_OPTIONS}  onSelect={o=>op('mode','cargo',o)} />;
      case 'cargo':       return <CargoCards onSelect={o=>op('cargo','done',o)} />;
      case 'reg-sub':     return <OptionCards options={REGISTRATION_OPTIONS} onSelect={o=>op('reg-sub','done',o)} />;
      case 'vessel-sub':  return <OptionCards options={VESSEL_OPTIONS} onSelect={o=>op('vessel-sub','done',o)} />;
      case 'cc-type':     return <OptionCards options={CC_TYPE_OPTIONS} onSelect={o=>op('cc-type','cc-mode',o)} />;
      case 'cc-mode':     return <OptionCards options={MODE_OPTIONS} onSelect={o=>op('cc-mode','cc-category',o)} />;
      case 'cc-category': return <OptionCards options={CC_CATEGORY_OPTIONS} onSelect={o=>op('cc-category','cc-subcat',o)} />;
      case 'cc-subcat':   return <OptionCards options={ccSubOptionsFor(history[histIdx-1]?.answer)} onSelect={o=>op('cc-subcat','done',o)} />;
      case 'p-activity':  return <OptionCards options={TRADE_OPTIONS} onSelect={o=>op('p-activity','p-mode',o)} />;
      case 'p-mode':      return <OptionCards options={MODE_OPTIONS}  onSelect={o=>op('p-mode','p-cargo',o)} />;
      case 'p-cargo':     return <CargoCards onSelect={o=>op('p-cargo','p-info',o)} />;
      case 'p-info': {
        const histAnswers = Object.fromEntries(history.slice(0,histIdx+1).map(h=>[h.step,h.answer]));
        return <PrepareInfoPanel answers={histAnswers} onKnow={()=>op('p-info','done',{key:'know',label:'I Know'})} onShowSteps={()=>{}} onStart={()=>op('p-info','done',{key:'start',label:'Start Application'})} />;
      }
      default:            return null;
    }
  };

  const searchPermit = history.find(h => h.step === 'search')?.opt?.permit as { label: string; authority: string } | undefined;

  return (
    <div style={{ position:'fixed', inset:0, zIndex:200, display:'flex', flexDirection:'column', background:'#fff', overflow:'hidden' }}>
      <style>{STYLES}</style>

      <div style={{ position:'relative', zIndex:10 }}><Header /></div>

      {/* Main content */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, position:'relative', zIndex:5, opacity:mounted?1:0, transform:mounted?'none':'translateY(10px)', transition:'opacity 0.4s ease, transform 0.4s ease' }}>

        {/* Breadcrumb + BU — white strip */}
        <div style={{ background:'#fff', borderBottom:'1px solid #e8eef8', padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:8, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:4, fontFamily:font, fontSize:13 }}>
            <span style={{ color:'#8f94ae', cursor:'pointer' }}>Home</span>
            <span style={{ color:'#dc3545', margin:'0 3px' }}>/</span>
            <span style={{ color:'#8f94ae', cursor:'pointer' }}>Service Catalog</span>
            <span style={{ color:'#dc3545', margin:'0 3px' }}>/</span>
            <span style={{ color:'#111838', fontWeight:500 }}>Find Permits & Certificates</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:7, background:'#f5f8ff', border:'1px solid #dce8ff', borderRadius:8, padding:'6px 14px', fontFamily:font, fontSize:13, color:'#0e1b3d' }}>
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="#1360d2" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span style={{ color:'#697498', fontSize:12 }}>BU:</span>
            AE-1019056 — Business Unit - Test LLC
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', padding:'14px 24px 0' }}>

          {/* Chat window */}
          <div style={{ flex:1, minHeight:0, display:'flex', flexDirection:'column', background:'rgba(255,255,255,0.85)', border:'1px solid #e8eef8', borderRadius:'20px 20px 0 0', overflow:'hidden', boxShadow:'0 -4px 32px rgba(19,96,210,0.06)', animation:'panelIn 0.45s cubic-bezier(0.34,1.4,0.64,1)' }}>

            {/* Chat header */}
            <div style={{ background:'#fff', borderBottom:'1px solid #eef0f6', padding:'15px 28px', display:'flex', alignItems:'center', gap:13, flexShrink:0 }}>
              <AiOrb size={40} />
              <div>
                <p style={{ fontFamily:font, fontSize:15, fontWeight:700, color:'#111838', margin:0 }}>Permit / Certificate Assistant</p>
                <p style={{ fontFamily:font, fontSize:12, color:'#97a3b8', margin:'2px 0 0' }}>Answer a few questions to find exactly what to apply for</p>
              </div>
            </div>

            {/* Messages — scrollable with fixed overflow */}
            <div className="chat-scroll" style={{ flex:1, minHeight:0, overflowY:'auto', background:'linear-gradient(175deg, #eef4ff 0%, #f4f8ff 50%, #e8f0fb 100%)', display:'flex', flexDirection:'column' }}>

              {/* Spacer — pushes content to bottom when short, collapses when content overflows */}
              <div style={{ flex:1, minHeight:32 }} />

              {/* ── Welcome centered mode ── */}
              {!hasChatted ? (
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:24, padding:'32px 28px 28px', animation:'welcomeIn 0.55s cubic-bezier(0.34,1.4,0.64,1)' }}>
                  <AiOrb size={80} thinking={isTyping} />
                  {isTyping ? (
                    <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(255,255,255,0.92)', border:'1px solid #eef0f6', borderRadius:20, padding:'14px 28px', boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
                      <span style={{ fontFamily:font, fontSize:14, color:'#8fa8c8' }}>Getting ready</span>
                      {[0,1,2].map(i => <div key={i} style={{ width:5, height:5, borderRadius:'50%', background:'#1360d2', animation:'dot 1.4s ease infinite', animationDelay:`${i*0.2}s` }} />)}
                    </div>
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20, maxWidth:700, width:'100%' }}>
                      <div style={{ background:'rgba(255,255,255,0.95)', border:'1px solid #eef0f6', borderRadius:'4px 20px 20px 20px', padding:'18px 28px', boxShadow:'0 2px 14px rgba(0,0,0,0.07)', textAlign:'center' }}>
                        <p style={{ fontFamily:font, fontSize:17, fontWeight:400, color:'#111838', margin:0, lineHeight:1.65 }}>{STEP_META.welcome.question}</p>
                      </div>
                      {showOptions && (
                        <div style={{ animation:'slideUp 0.35s cubic-bezier(0.34,1.4,0.64,1)', width:'100%' }}>
                          <WelcomeChoiceCards onSelect={pickWelcome} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                /* ── Chat L/R mode ── */
                <div style={{ padding:'20px 32px 20px', maxWidth:960, width:'100%', margin:'0 auto', alignSelf:'center', display:'flex', flexDirection:'column', gap:18, animation:'fadeSlide 0.4s ease' }}>

                  {/* History: each item = AI question + its options (inline, dimmed) + user answer pill */}
                  {history.map((h, i) => {
                    const q = STEP_META[h.step as keyof typeof STEP_META]?.question ?? '';
                    const opts = renderHistoryOpts(h.step, i);
                    return (
                      <div key={i} style={{ display:'flex', flexDirection:'column', gap:8 }}>
                        {q && <AiMessage text={q} isNew={false} />}
                        {opts && (
                          <div style={{ paddingLeft:44, opacity:0.65, transition:'opacity 0.18s' }}
                            onMouseEnter={e=>(e.currentTarget as HTMLDivElement).style.opacity='1'}
                            onMouseLeave={e=>(e.currentTarget as HTMLDivElement).style.opacity='0.65'}>
                            {opts}
                          </div>
                        )}
                        <UserPill label={h.answer} />
                      </div>
                    );
                  })}

                  {/* Current active step — only show question, options go to bottom panel */}
                  {step === 'done' ? (
                    searchPermit
                      ? <SearchServiceCard permit={searchPermit} onRestart={restart} />
                      : <DoneWithPrepare cargoLabel={cargoLabel} cargoKey={cargoKey} onRestart={restart} onOpenService={onOpenService} />
                  ) : isTyping ? (
                    <ThinkingState />
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                      <AiMessage text={STEP_META[step].question} />
                    </div>
                  )}
                </div>
              )}

              {/* Scroll anchor always at the very bottom */}
              <div ref={bottomRef} style={{ height:1, flexShrink:0 }} />
            </div>

            {/* ── Current step options panel (white bg, pinned above input) ── */}
            {hasChatted && !isTyping && step !== 'done' && showOptions && (
              <div style={{ flexShrink:0, background:'#fff', borderTop:'1px solid #eef0f6', animation:'slideUp 0.32s cubic-bezier(0.34,1.4,0.64,1)', padding:'14px 24px', maxWidth:960, width:'100%', margin:'0 auto', boxSizing:'border-box' }}>
                {step==='welcome'     && <WelcomeChoiceCards onSelect={pickWelcome} />}
                {step==='recent'      && <RecentServicesInChat onQuickStart={quickStart} onStartNew={startNew} />}
                {step==='activity'    && <OptionCards options={ACTIVITY_OPTIONS} onSelect={o=>pick('activity',nextStepForActivity(o),o)} />}
                {step==='mode'        && <OptionCards options={MODE_OPTIONS}  onSelect={o=>pick('mode','cargo',o)} />}
                {step==='cargo'       && <CargoCards onSelect={o=>pick('cargo','done',o)} />}
                {step==='reg-sub'     && <OptionCards options={REGISTRATION_OPTIONS} onSelect={o=>pick('reg-sub','done',o)} />}
                {step==='vessel-sub'  && <OptionCards options={VESSEL_OPTIONS} onSelect={o=>pick('vessel-sub','done',o)} />}
                {step==='cc-type'     && <OptionCards options={CC_TYPE_OPTIONS} onSelect={o=>pick('cc-type','cc-mode',o)} />}
                {step==='cc-mode'     && <OptionCards options={MODE_OPTIONS} onSelect={o=>pick('cc-mode','cc-category',o)} />}
                {step==='cc-category' && <OptionCards options={CC_CATEGORY_OPTIONS} onSelect={o=>pick('cc-category','cc-subcat',o)} />}
                {step==='cc-subcat'   && <OptionCards options={ccSubOptionsFor(answers['cc-category'])} onSelect={o=>pick('cc-subcat','done',o)} />}
                {step==='search'      && <SearchResults q={inputVal} onSelect={pickSearch} />}
                {step==='p-activity'  && <OptionCards options={TRADE_OPTIONS} onSelect={o=>pick('p-activity','p-mode',o)} />}
                {step==='p-mode'      && <OptionCards options={MODE_OPTIONS}  onSelect={o=>pick('p-mode','p-cargo',o)} />}
                {step==='p-cargo'     && <CargoCards onSelect={o=>pick('p-cargo','p-info',o)} />}
                {step==='p-info'      && <PrepareInfoPanel answers={answers} onKnow={()=>pick('p-info','done',{key:'know',label:'I Know'})} onShowSteps={()=>{}} onStart={()=>pick('p-info','done',{key:'start',label:'Start Application'})} />}
              </div>
            )}

            {/* ── Bottom bar (input + back to listing) ── */}
            <div style={{ flexShrink:0, borderTop:'1px solid rgba(19,96,210,0.07)', background:'rgba(255,255,255,0.97)', padding:'10px 20px', display:'flex', alignItems:'center', gap:10 }}>
              <button onClick={onClose}
                style={{ border:'1.5px solid #1360d2', borderRadius:8, padding:'9px 18px', fontFamily:font, fontSize:13, fontWeight:500, color:'#1360d2', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', gap:6, transition:'all 0.18s', whiteSpace:'nowrap', flexShrink:0 }}
                onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background='#eef4ff';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background='#fff';}}>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                Back to Listing
              </button>
              <div style={{ flex:1, display:'flex', alignItems:'center', gap:0, background: isInputStep ? '#fff' : 'rgba(237,238,255,0.4)', border:`1.5px solid ${isInputStep ? '#1360d2' : 'rgba(19,96,210,0.1)'}`, borderRadius:26, overflow:'hidden', transition:'all 0.2s', boxShadow: isInputStep ? '0 0 0 3px rgba(19,96,210,0.08)' : 'none' }}>
                <input ref={inputRef}
                  type="text"
                  placeholder={step==='cargo' ? 'Type cargo type and press Enter…' : step==='search' ? 'Type service name and press Enter…' : 'Select an option above…'}
                  disabled={!isInputStep}
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && submitInput()}
                  style={{ flex:1, height:42, background:'transparent', border:'none', padding:'0 16px', fontFamily:font, fontSize:13, color: isInputStep ? '#111838' : '#b0b8d4', outline:'none', cursor: isInputStep ? 'text' : 'default' }} />
                {isInputStep && (
                  <button onClick={submitInput}
                    style={{ height:42, width:46, display:'flex', alignItems:'center', justifyContent:'center', background: '#1360d2', border:'none', cursor: 'pointer', transition:'all 0.18s', flexShrink:0 }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

