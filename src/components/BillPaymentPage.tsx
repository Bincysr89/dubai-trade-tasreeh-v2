import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Pagination from './Pagination';
import infoIconSrc from '../assets/icon-info.svg';
import { DateTimePicker, DateInput, StatusAsOnBadge, fmtDate } from './DatePicker';
import { useTableBehaviors, ScrollArrows } from '../hooks/useTableBehaviors';
import PaymentHistoryPage, { type PaymentHistoryRow } from './PaymentHistoryPage';
import StatusPill, { PAY_STATUS } from './PaymentStatusPill';
import ActionPage from './declaration/ActionPage';

const font = "'Dubai', sans-serif";

/* ── Dirham icon ─────────────────────────────────────────────────────────────── */
function DirhamIcon({ size = 14, color = '#0e1b3d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={Math.round(size * 17 / 20)} viewBox="0 0 20 17" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'inline', verticalAlign: 'middle', flexShrink: 0 }}>
      <g clipPath="url(#drhm)">
        <path d="M1.766 0.0195402C1.774 0.0312644 1.818 0.084023 1.86 0.134828C2.166 0.49046 2.396 1.06885 2.52 1.7977C2.602 2.27644 2.606 2.4269 2.606 4.25195V5.95195H1.77C1.006 5.95195 0.918 5.94805 0.768 5.91874C0.532 5.86988 0.288 5.73897 0.124 5.57092C-0.006 5.43609 -0.002 5.42828 0.006 5.83667C0.016 6.17471 0.02 6.21184 0.07 6.39552C0.15 6.68667 0.26 6.90356 0.426 7.09701C0.652 7.36276 0.882 7.51126 1.21 7.61092C1.28 7.63046 1.428 7.63828 1.952 7.64218L2.606 7.65195V8.49805V9.34609L1.684 9.34023L0.758 9.33437L0.598 9.27184C0.408 9.19759 0.322 9.14287 0.136 8.98069L0 8.86149L0.008 9.23471C0.018 9.58057 0.02 9.61965 0.07 9.79552C0.244 10.4169 0.664 10.8605 1.218 11.0051C1.356 11.0422 1.41 11.0441 1.988 11.052L2.606 11.0598V12.8106C2.606 13.8677 2.6 14.6474 2.59 14.7802C2.58 14.9014 2.548 15.128 2.52 15.2863C2.39 16.0152 2.156 16.5643 1.82 16.9199L1.752 16.9922H5.134C7.156 16.9922 8.668 16.9844 8.89 16.9746C9.28 16.9551 10.15 16.871 10.346 16.83C10.408 16.8183 10.524 16.8007 10.6 16.789C10.762 16.7655 11.03 16.7108 11.416 16.6151C11.96 16.4822 12.456 16.3161 12.942 16.1051C13.094 16.0386 13.53 15.8217 13.646 15.7533C13.708 15.7182 13.782 15.6752 13.81 15.6615C13.888 15.6205 14.018 15.5384 14.208 15.4055C14.302 15.3391 14.396 15.2746 14.416 15.2609C14.5 15.2062 14.79 14.9698 14.922 14.8506C15.424 14.3992 15.844 13.897 16.17 13.3597C16.216 13.2815 16.276 13.1838 16.302 13.1428C16.368 13.0333 16.64 12.4862 16.666 12.4041C16.678 12.367 16.694 12.3279 16.702 12.3201C16.754 12.2537 17.054 11.3314 17.09 11.1301C17.102 11.0656 17.108 11.0559 17.158 11.0461C17.19 11.0402 17.656 11.0402 18.194 11.0441C19.27 11.052 19.27 11.052 19.508 11.1594C19.642 11.22 19.682 11.2474 19.83 11.3783C20.024 11.5483 20.006 11.5756 19.994 11.1497C19.986 10.8995 19.976 10.7452 19.958 10.6826C19.89 10.4423 19.874 10.3915 19.814 10.2703C19.618 9.85218 19.29 9.55322 18.87 9.41057L18.706 9.35195L18.038 9.34414L17.372 9.33437L17.38 9.10575C17.388 8.80483 17.388 8.20885 17.378 7.90207L17.37 7.65586L18.262 7.65195C19.026 7.64805 19.168 7.65195 19.252 7.67345C19.504 7.74184 19.674 7.83563 19.882 8.02126L19.998 8.12678V7.83759C19.998 7.49368 19.98 7.34126 19.908 7.1146C19.766 6.6554 19.486 6.31345 19.086 6.10241C18.826 5.96563 18.81 5.96172 17.916 5.95586C17.392 5.95195 17.118 5.94414 17.104 5.93241C17.092 5.92069 17.082 5.90115 17.082 5.88552C17.082 5.86989 17.052 5.74678 17.012 5.61391C16.544 3.99793 15.67 2.71414 14.392 1.76253C14.218 1.63161 13.792 1.35609 13.62 1.2623C13.554 1.22517 13.482 1.18609 13.464 1.17437C13.38 1.12943 12.898 0.898851 12.778 0.85C12.706 0.818736 12.612 0.779655 12.57 0.764023C11.864 0.465057 10.68 0.181724 9.776 0.0937931C9.628 0.0801149 9.432 0.0586207 9.342 0.0508046C8.934 0.00586207 8.368 0 5.154 0C2.438 0 1.756 0.00586207 1.766 0.0195402ZM8.38 0.865632C9.056 0.904713 9.472 0.955517 9.958 1.0708C11.442 1.41471 12.486 2.14161 13.244 3.35701C13.314 3.47034 13.61 4.06046 13.654 4.17966C13.864 4.73264 13.966 5.06092 14.056 5.49471C14.078 5.60023 14.108 5.74092 14.122 5.80736C14.136 5.87184 14.142 5.93241 14.136 5.93828C14.126 5.94609 12.118 5.95 9.67 5.94805L5.22 5.94414L5.214 3.43322C5.212 2.05368 5.214 0.906667 5.22 0.885172L5.228 0.848046H6.65C7.43 0.848046 8.21 0.855862 8.38 0.865632ZM14.33 7.71057C14.344 7.7946 14.344 9.22103 14.33 9.29138L14.318 9.34414L9.768 9.34023L5.22 9.33437L5.216 8.50586C5.212 8.05057 5.216 7.67149 5.22 7.66368C5.226 7.65391 7.164 7.64805 9.774 7.64805H14.318L14.33 7.71057ZM14.126 11.0656C14.136 11.0949 14.088 11.3353 13.99 11.7261C13.878 12.1657 13.726 12.6093 13.572 12.9376C13.496 13.1056 13.306 13.4691 13.26 13.5375C13.238 13.5687 13.174 13.6684 13.118 13.7563C12.758 14.3074 12.244 14.8095 11.658 15.1808C11.444 15.3137 11.004 15.5403 10.886 15.5755C10.862 15.5814 10.836 15.5931 10.826 15.6009C10.812 15.6126 10.63 15.6791 10.418 15.7533C10.028 15.8882 9.286 16.0347 8.69 16.0953C8.304 16.1324 8.242 16.1344 6.756 16.1344H5.218V13.6V11.0637L9.636 11.0559C12.066 11.052 14.068 11.0461 14.084 11.0422C14.102 11.0402 14.12 11.052 14.126 11.0656Z" fill={color}/>
      </g>
      <defs>
        <clipPath id="drhm"><rect width="20" height="17" fill="white"/></clipPath>
      </defs>
    </svg>
  );
}

/* ── Status styles ──────────────────────────────────────────────────────────── */
const INV_STATUS: Record<string, { bg: string; color: string }> = {
  'Unpaid':         { bg: 'rgba(255,169,26,0.16)',   color: '#b45309' },
  'Paid':           { bg: '#e6f4ec',                 color: '#1b6c3a' },
  'Initiated':      { bg: '#e8f0ff',                 color: '#1360d2' },
  'Partially Paid': { bg: 'rgba(249,115,22,0.10)',   color: '#ea580c' },
};


/** Shifts a "DD-MM-YYYY HH:mm[:ss]" stamp by whole minutes, for an attempt trail. */
function shiftMinutes(stamp: string, delta: number): string {
  const [datePart, timePart = '00:00'] = stamp.split(' ');
  const [d, m, y] = datePart.split('-').map(Number);
  const [hh, mm] = timePart.split(':').map(Number);
  const dt = new Date(y, m - 1, d, hh, mm + delta);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(dt.getDate())}-${p(dt.getMonth() + 1)}-${dt.getFullYear()} ${p(dt.getHours())}:${p(dt.getMinutes())}`;
}

/* ── Date helpers (mock-data dates only — never tied to real wall-clock time) ── */
const MONTH_ABBR: Record<string, number> = { Jan:0,Feb:1,Mar:2,Apr:3,May:4,Jun:5,Jul:6,Aug:7,Sep:8,Oct:9,Nov:10,Dec:11 };
/** 'DD-MMM-YY' e.g. '05-Jun-26' → sortable ordinal */
const parseInvDate = (s: string) => {
  const [d, mon, y] = s.split('-');
  return (2000 + parseInt(y, 10)) * 372 + MONTH_ABBR[mon] * 31 + parseInt(d, 10);
};
/** 'YYYY-MM-DD' (DateInput's internal ISO value) → sortable ordinal */
const parseIsoDate = (s: string) => {
  const [y, m, d] = s.split('-').map(Number);
  return y * 372 + (m - 1) * 31 + d;
};
/** 'DD-MM-YYYY[ HH:MM:SS]' e.g. '10-06-2026 11:57:00' → sortable ordinal */
const parseTxDate = (s: string) => {
  const [d, m, y] = s.split(' ')[0].split('-').map(Number);
  return y * 372 + (m - 1) * 31 + d;
};
/** "Today" inside this module's mock timeline — matches the Payments tab's latest activity. */
const DASHBOARD_TODAY_ORD = parseInvDate('10-Jun-26');

/* ── Dummy data ─────────────────────────────────────────────────────────────── */
const INVOICE_ROWS = [
  { type: 'Case Management Demand Notice',                    number: '70003764',   date: '05-Jun-26', dueDate: '09-Jun-26', amount: '5,520.00', settled: '0.00',     balance: '5520.00',  status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'CDR',   payMode: '—'         },
  { type: 'Case Management Demand Notice',                    number: '70003765',   date: '06-Jun-26', dueDate: '16-Jun-26', amount: '1,000.00', settled: '1,000.00', balance: '0.00',     status: 'Paid',      txNo: '13134', txDate: '06-06-2026', source: 'SGRCS', payMode: 'E-Payment' },
  { type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', number: '1000004567', date: '07-Jun-26', dueDate: '25-Jun-26', amount: '520.00',   settled: '0.00',     balance: '520.00',   status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'SAS',   payMode: '—'         },
  { type: 'Case Management Demand Notice',                    number: '70003820',   date: '08-Jun-26', dueDate: '08-Jun-26', amount: '5,490.00', settled: '2,000.00', balance: '3490.00',  status: 'Partially Paid', txNo: '13132', txDate: '10-06-2026', source: 'CDR', payMode: 'Debit A/C' },
  { type: 'Case Management Demand Notice',                    number: '70003819',   date: '08-Jun-26', dueDate: '18-Jun-26', amount: '1,000.00', settled: '0.00',     balance: '1000.00',  status: 'Initiated', txNo: '13131', txDate: '10-06-2026', source: 'CRNS',  payMode: 'E-Payment' },
  { type: 'Case Management Demand Notice',                    number: '70003816',   date: '09-Jun-26', dueDate: '19-Jun-26', amount: '220.00',   settled: '0.00',     balance: '220.00',   status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'CDR',   payMode: '—'         },
  { type: 'Case Management Demand Notice',                    number: '70003817',   date: '09-Jun-26', dueDate: '24-Jun-26', amount: '220.00',   settled: '0.00',     balance: '220.00',   status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'SGRCS', payMode: '—'         },
  // Low-value invoices generated today — the kind that shouldn't clutter a transaction list,
  // but should still roll up into the Recent Activity Summary counts/totals.
  { type: 'General Charge Invoice',                            number: '70003825',   date: '10-Jun-26', dueDate: '20-Jun-26', amount: '5.00',     settled: '0.00',     balance: '5.00',     status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'CDR',   payMode: '—'         },
  { type: 'General Charge Invoice',                            number: '70003826',   date: '10-Jun-26', dueDate: '20-Jun-26', amount: '10.00',    settled: '0.00',     balance: '10.00',    status: 'Unpaid',    txNo: '—',     txDate: '—',          source: 'CDR',   payMode: '—'         },
];

/* ── Row-action icons — the same glyph wherever an action appears ──────────── */
const ROW_ACTION_ICONS: Record<string, React.ReactNode> = {
  'View Payment Details': <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" /><circle cx="10" cy="10" r="2.5" /></svg>,
  'Download Invoice':     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3v10M5 9l5 5 5-5M3 17h14" /></svg>,
  'Initiate Payment':     <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="16" height="11" rx="2" /><path d="M2 9h16M5 13h3" /></svg>,
  'Recheck':              <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" /></svg>,
  'View & Print Receipt': <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M5 2.5h10v15l-2.5-1.5-2.5 1.5-2.5-1.5L5 17.5z" /><path d="M8 6.5h4M8 10h4" /></svg>,
  'Payment History':      <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10a8 8 0 1 0 1.5-4.7" /><path d="M2 4.5V10h5.5" /><path d="M10 6v4l2.5 2" /></svg>,
};

function RowActionItem({ label }: { label: string }) {
  return (
    <>
      <span className="text-[#1360d2] group-hover:text-white group-disabled:text-[#b0b8d0] flex-shrink-0">{ROW_ACTION_ICONS[label]}</span>
      <span className="text-[15px] text-[#111838] group-hover:text-white" style={{ fontFamily: font }}>{label}</span>
    </>
  );
}

const PAYMENT_ROWS = [
  { type: 'Case Management Demand Notice', txNo: '13136', txDate: '10-06-2026 11:57:00', invoiceNo: '70003787', status: 'Success',   amount: '200.00',   txDateFull: '10-06-2026', degTx: '590000237262582', ePayTx: '20021737', initiatedDate: '10-06-2026 11:58:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003786', amount: '5,520.00', receiptNo: 'Z-12645', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003786', status: 'Success' }] },
  { type: 'Multiple Bill Settlement',      txNo: '13133', txDate: '10-06-2026 11:48:00', invoiceNo: '',          status: 'Success',   amount: '5,540.00', txDateFull: '10-06-2026', degTx: '590000237262583', ePayTx: '20021738', initiatedDate: '10-06-2026 11:48:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003820', amount: '5,490.00', receiptNo: 'Z-12647', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003820', status: 'Success' }, { type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', invoiceNo: '1000004567', amount: '50.00', receiptNo: 'Z-12648', remarks: 'M1CS 1927055; BPS Transaction for CRN-1000004567', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13134', txDate: '01-06-2026 09:15:00', invoiceNo: '70003765', status: 'Success',   amount: '600.00',   txDateFull: '01-06-2026', degTx: '590000237132370', ePayTx: '20021570', initiatedDate: '01-06-2026 09:14:00', initiatedBy: 'crnuser01', mode: 'E-Payment',    payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003765', amount: '600.00', receiptNo: 'Z-12650', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003765', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13135', txDate: '06-06-2026 10:00:00', invoiceNo: '70003765', status: 'Success',   amount: '400.00',   txDateFull: '06-06-2026', degTx: '590000237132371', ePayTx: '20021571', initiatedDate: '06-06-2026 09:59:00', initiatedBy: 'crnuser01', mode: 'E-Payment',    payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003765', amount: '400.00', receiptNo: 'Z-12651', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003765', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13130', txDate: '05-06-2026 09:30:00', invoiceNo: '70003820', status: 'Success',   amount: '800.00',   txDateFull: '05-06-2026', degTx: '590000237132365', ePayTx: '20021568', initiatedDate: '05-06-2026 09:29:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003820', amount: '800.00', receiptNo: 'Z-12646', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003820', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13132', txDate: '10-06-2026 10:18:00', invoiceNo: '70003820', status: 'Success',   amount: '1,200.00', txDateFull: '10-06-2026', degTx: '590000237262584', ePayTx: '20021739', initiatedDate: '10-06-2026 10:18:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003820', amount: '1,200.00', receiptNo: 'Z-12647', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003820', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13131', txDate: '10-06-2026 10:11:00', invoiceNo: '70003819', status: 'Success',   amount: '1,000.00', txDateFull: '10-06-2026', degTx: '590000237262585', ePayTx: '20021740', initiatedDate: '10-06-2026 10:11:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003819', amount: '1,000.00', receiptNo: 'Z-12648', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003819', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13129', txDate: '10-06-2026 10:08:00', invoiceNo: '70003819', status: 'Failed', amount: '220.00',   txDateFull: '14-05-2026', degTx: '590000237132364', ePayTx: '20021566', initiatedDate: '14-05-2026 09:11:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: Transaction cancelled due to user did not complete the payment process', colMsg: 'Collection Status Remarks: DEG - Transaction cancelled due to user did not complete the payment process', details: [{ type: 'CRN SEA Discrepancy Export Manifest Fine Invoice', invoiceNo: '1000004567', amount: '520.00', receiptNo: '', remarks: '', status: 'Unpaid' }] },
  { type: 'Case Management Demand Notice', txNo: '13128', txDate: '10-06-2026 10:00:00', invoiceNo: '70003816', status: 'Success',   amount: '1,000.00', txDateFull: '10-06-2026', degTx: '590000237262586', ePayTx: '20021741', initiatedDate: '10-06-2026 10:00:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: SUCCESS', colMsg: 'Collection Status Remarks: Transaction has been processed successfully.', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003816', amount: '1,000.00', receiptNo: 'Z-12649', remarks: 'M1CS 1927055; BPS Transaction for ECM-70003816', status: 'Success' }] },
  { type: 'Case Management Demand Notice', txNo: '13127', txDate: '10-06-2026 09:55:00', invoiceNo: '70003817', status: 'Initiated', amount: '220.00',   txDateFull: '10-06-2026', degTx: '590000237262587', ePayTx: '20021742', initiatedDate: '10-06-2026 09:55:00', initiatedBy: 'crnuser01', mode: 'Credit Card', payMsg: 'Payment Status Remarks: INITIATED', colMsg: '', details: [{ type: 'Case Management Demand Notice', invoiceNo: '70003817', amount: '220.00', receiptNo: '', remarks: '', status: 'Initiated' }] },
];

/* ── Account data ───────────────────────────────────────────────────────────── */
const ACCOUNTS = [
  { type: 'Credit Account', account: '1222683 - AEOUAT1', totalLimit: '10,000,000,000.00', amountDue: '6,643.00',    dueDate: '05-Jun-26', currentLimit: '9,999,993,357.00', availableLimit: '9,999,993,357.00' },
  { type: 'Credit Account', account: '1222685 - AEOUAT1', totalLimit: '985,000,000.00',    amountDue: '6,510.00',    dueDate: '08-Jun-26', currentLimit: '984,993,490.00',   availableLimit: '984,993,490.00'   },
  { type: 'Credit Account', account: '1222839 - AEOUAT1', totalLimit: '8,570,000,000.00',  amountDue: '192,834.00',  dueDate: '15-Jun-26', currentLimit: '8,569,807,166.00', availableLimit: '8,569,807,166.00' },
  { type: 'Credit Account', account: '1222840 - AEOUAT1', totalLimit: '8,957,000,000.00',  amountDue: '159,588.00',  dueDate: '20-Jun-26', currentLimit: '8,956,840,412.00', availableLimit: '8,956,840,412.00' },
  { type: 'Credit Account', account: '1222843 - AEOUAT1', totalLimit: '897,000,000.00',    amountDue: '416,486.00',  dueDate: '03-Jun-26', currentLimit: '896,583,514.00',   availableLimit: '896,583,514.00'   },
  { type: 'Credit Account', account: '1222844 - AEOUAT1', totalLimit: '8,957,000,000.00',  amountDue: '194,563.00',  dueDate: '25-Jun-26', currentLimit: '8,956,805,437.00', availableLimit: '8,956,805,437.00' },
  { type: 'Credit Account', account: '1222889 - AEOUAT1', totalLimit: '31,500,000.00',     amountDue: '280,709.38',  dueDate: '30-Jun-26', currentLimit: '31,219,290.62',    availableLimit: '31,219,290.62'    },
  { type: 'Credit Account', account: '1222890 - AEOUAT1', totalLimit: '3,500,000.00',      amountDue: '43,029.00',   dueDate: '07-Jun-26', currentLimit: '3,456,971.00',     availableLimit: '3,456,971.00'     },
  { type: 'Credit Account', account: '1222964 - AEOUAT1', totalLimit: '100,000.00',        amountDue: '20,049.00',   dueDate: '18-Jun-26', currentLimit: '79,951.00',        availableLimit: '79,951.00'        },
  { type: 'Credit Account', account: '1222966 - AEOUAT1', totalLimit: '300,000.00',        amountDue: '49,140.00',   dueDate: '22-Jun-26', currentLimit: '250,860.00',       availableLimit: '250,860.00'       },
];

const DEBIT_ACCOUNTS = [
  { type: 'Debit Account', account: '9001234 - AEOUAT1', totalLimit: '20,000.00', amountDue: '5,461.00', currentLimit: '14,539.00', availableLimit: '14,539.00' },
  { type: 'Debit Account', account: '9001235 - AEOUAT1', totalLimit: '10,000.00', amountDue: '1,750.00', currentLimit: '8,250.00',  availableLimit: '8,250.00'  },
  { type: 'Debit Account', account: '9001236 - AEOUAT1', totalLimit: '25,000.00', amountDue: '2,900.00', currentLimit: '22,100.00', availableLimit: '22,100.00' },
];

const DEBIT_PAY_OPTIONS = [
  { value: '1050089', label: '1050089 - AEOUAT1',            balance: 99987596.50 },
  { value: '1050084', label: '1050084 - XCRN BUSINESS NEW01', balance: 14539.00   },
];

/* ── Pre-computed dashboard stats ──────────────────────────────────────────── */
const debitTotal     = DEBIT_ACCOUNTS.reduce((s, a) => s + parseFloat(a.availableLimit.replace(/,/g, '')), 0);

/* Overview tab — Payment Summary Cards.
   "Pending Invoices" = invoices still owed (Unpaid / Partially Paid). Whether this should
   include every unpaid invoice or only invoices eligible for online payment is a scope
   question for IT to confirm — currently modeled as "all unpaid / partially paid". */
const sumBalance = (rows: typeof INVOICE_ROWS) => rows.reduce((s, r) => s + parseFloat(r.balance.replace(/,/g, '')), 0);
const sumAmount  = (rows: typeof INVOICE_ROWS) => rows.reduce((s, r) => s + parseFloat(r.amount.replace(/,/g, '')), 0);
const sumPayAmount = (rows: typeof PAYMENT_ROWS) => rows.reduce((s, r) => s + parseFloat(r.amount.replace(/,/g, '')), 0);

const payableInvoiceRows = INVOICE_ROWS.filter(r => r.status === 'Unpaid' || r.status === 'Partially Paid');
const overdueInvoiceRows = payableInvoiceRows.filter(r => parseInvDate(r.dueDate) < DASHBOARD_TODAY_ORD);
const dueSoonInvoiceRows = payableInvoiceRows.filter(r => parseInvDate(r.dueDate) >= DASHBOARD_TODAY_ORD);

const pendingInvCount = payableInvoiceRows.length;
const pendingInvAmt   = sumBalance(payableInvoiceRows);
const overdueInvCount = overdueInvoiceRows.length;
const overdueInvAmt   = sumBalance(overdueInvoiceRows);
const dueSoonInvCount = dueSoonInvoiceRows.length;
const dueSoonInvAmt   = sumBalance(dueSoonInvoiceRows);

const failedPaymentRows = PAYMENT_ROWS.filter(r => r.status === 'Failed');
const failedPayCount    = failedPaymentRows.length;
const failedPayAmt      = sumPayAmount(failedPaymentRows);

/* CDR (Credit Account) aggregates — "usage" is the portion of each account's limit that's
   been drawn down (totalLimit - availableLimit), not the raw availableLimit figure itself. */
const cdrDueAmt      = ACCOUNTS.reduce((s, a) => s + parseFloat(a.amountDue.replace(/,/g, '')), 0);
const cdrUsageAmt    = ACCOUNTS.reduce((s, a) => s + (parseFloat(a.totalLimit.replace(/,/g, '')) - parseFloat(a.availableLimit.replace(/,/g, ''))), 0);
const cdrTotalLimit  = ACCOUNTS.reduce((s, a) => s + parseFloat(a.totalLimit.replace(/,/g, '')), 0);
const cdrAvailable   = ACCOUNTS.reduce((s, a) => s + parseFloat(a.availableLimit.replace(/,/g, '')), 0);
const cdrTotalToPay = cdrDueAmt;
const totalDueToDubaiCustoms = cdrTotalToPay + pendingInvAmt;

const cdrOverdueAccounts = ACCOUNTS.filter(a => parseInvDate(a.dueDate) < DASHBOARD_TODAY_ORD);
const cdrDueSoonAccounts = ACCOUNTS.filter(a => parseInvDate(a.dueDate) >= DASHBOARD_TODAY_ORD);
const cdrOverdueCount = cdrOverdueAccounts.length;
const cdrOverdueAmt   = cdrOverdueAccounts.reduce((s, a) => s + parseFloat(a.amountDue.replace(/,/g, '')), 0);
const cdrDueSoonCount = cdrDueSoonAccounts.length;
const cdrDueSoonAmt   = cdrDueSoonAccounts.reduce((s, a) => s + parseFloat(a.amountDue.replace(/,/g, '')), 0);

/* CDR Usage trend — last 6 months, trailing up to the current month's real usage figure. */
const CDR_USAGE_TREND = [
  { month: 'Jan', amt: 980000 },
  { month: 'Feb', amt: 1120000 },
  { month: 'Mar', amt: 1045000 },
  { month: 'Apr', amt: 1210000 },
  { month: 'May', amt: 1298000 },
  { month: 'Jun', amt: cdrUsageAmt },
];

/* Debit account top-ups — last 6 months, total amount added to the wallet each month. */
const DEBIT_TOPUP_TREND = [
  { month: 'Jan', amt: 12000 },
  { month: 'Feb', amt: 8500 },
  { month: 'Mar', amt: 21000 },
  { month: 'Apr', amt: 15500 },
  { month: 'May', amt: 9800 },
  { month: 'Jun', amt: 18200 },
];

/* Overview dashboard — status breakdowns for the Invoice / Payment donut charts. */
const INVOICE_STATUS_ORDER = ['Unpaid', 'Partially Paid', 'Initiated', 'Paid'] as const;
const INVOICE_STATUS_COLOR: Record<string, string> = { 'Unpaid': '#b45309', 'Partially Paid': '#ea580c', 'Initiated': '#1360d2', 'Paid': '#1b9841' };
const invoiceStatusBreakdown = INVOICE_STATUS_ORDER.map(status => {
  const rows = INVOICE_ROWS.filter(r => r.status === status);
  return { status, count: rows.length, amt: sumAmount(rows), color: INVOICE_STATUS_COLOR[status] };
}).filter(s => s.count > 0);

const PAYMENT_STATUS_ORDER = ['Success', 'Initiated', 'Failed'] as const;
/* Lighter red/amber/green traffic-light shades, per the requested donut styling. */
const PAYMENT_STATUS_COLOR: Record<string, string> = { 'Success': '#1B9841', 'Initiated': '#fbbf24', 'Failed': '#f87171' };

/* Payment Status, bucketed by the same Today / 7 Days / 30 Days window as Recent Activity,
   so the Payment Status card can carry its own period toggle. */
const PAYMENT_STATUS_BY_PERIOD: Record<'today' | 'last7' | 'last30', { status: string; count: number; amt: number; color: string }[]> = {
  today: [], last7: [], last30: [],
};
(['today', 'last7', 'last30'] as const).forEach(p => {
  PAYMENT_STATUS_BY_PERIOD[p] = PAYMENT_STATUS_ORDER.map(status => {
    const rows = PAYMENT_ROWS.filter(r => r.status === status && (
      p === 'today' ? parseTxDate(r.txDate) === DASHBOARD_TODAY_ORD :
      p === 'last7'  ? DASHBOARD_TODAY_ORD - parseTxDate(r.txDate) < 7 :
                        DASHBOARD_TODAY_ORD - parseTxDate(r.txDate) < 30
    ));
    return { status, count: rows.length, amt: sumPayAmount(rows), color: PAYMENT_STATUS_COLOR[status] };
  }).filter(s => s.count > 0);
});

/* Recent Activity Summary — Today / Last 7 Days / Last 30 Days, precomputed for both
   windows so the component can toggle between them without re-deriving on every render. */
const invGenToday  = INVOICE_ROWS.filter(r => parseInvDate(r.date) === DASHBOARD_TODAY_ORD);
const invGenLast7  = INVOICE_ROWS.filter(r => DASHBOARD_TODAY_ORD - parseInvDate(r.date) < 7);
const invGenLast30 = INVOICE_ROWS.filter(r => DASHBOARD_TODAY_ORD - parseInvDate(r.date) < 30);

const paySuccessRows   = PAYMENT_ROWS.filter(r => r.status === 'Success');
const paySuccessToday  = paySuccessRows.filter(r => parseTxDate(r.txDate) === DASHBOARD_TODAY_ORD);
const paySuccessLast7  = paySuccessRows.filter(r => DASHBOARD_TODAY_ORD - parseTxDate(r.txDate) < 7);
const paySuccessLast30 = paySuccessRows.filter(r => DASHBOARD_TODAY_ORD - parseTxDate(r.txDate) < 30);

const failedPayToday = failedPaymentRows.filter(r => parseTxDate(r.txDate) === DASHBOARD_TODAY_ORD);

const RECENT_ACTIVITY = {
  invoicesGenerated: {
    today:  { count: invGenToday.length,  amt: sumAmount(invGenToday) },
    last7:  { count: invGenLast7.length,  amt: sumAmount(invGenLast7) },
    last30: { count: invGenLast30.length, amt: sumAmount(invGenLast30) },
  },
  paymentsMade: {
    today:  { count: paySuccessToday.length,  amt: sumPayAmount(paySuccessToday) },
    last7:  { count: paySuccessLast7.length,  amt: sumPayAmount(paySuccessLast7) },
    last30: { count: paySuccessLast30.length, amt: sumPayAmount(paySuccessLast30) },
  },
  failedPayments: {
    today:  { count: failedPayToday.length, amt: sumPayAmount(failedPayToday) },
    last7:  { count: failedPayCount,        amt: failedPayAmt },
    last30: { count: failedPayCount,        amt: failedPayAmt },
  },
};

const fmtBalance = (n: number) =>
  'AED ' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* Compact currency — CDR limits run into the billions, too wide for a dashboard tile. */
const fmtCompact = (n: number) => {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

/* Transaction date timestamps carry seconds (DD-MM-YYYY HH:MM:SS) — display without them. */
const stripSeconds = (ts: string) => ts.replace(/(\d{2}:\d{2}):\d{2}\b/, '$1');

/* All accounts combined — debit accounts appear first, followed by credit accounts */
const ALL_ACCOUNTS = [
  ...DEBIT_ACCOUNTS,
  ...ACCOUNTS,
];

const ACC_PAGE_SIZE = 8;
const YEARS  = ['2024', '2025', '2026'];
/* Where the invoice was raised. Each location issues its numbers under its own
   prefix, which the invoice-number search shows once a location is picked. */
const LOCATIONS: { name: string; prefix: string }[] = [
  { name: 'Agent Office',          prefix: 'A' },
  { name: 'Airport Free Zone',     prefix: 'F' },
  { name: 'Airport Terminal 3',    prefix: 'T3' },
  { name: 'AL Maktoum Cargo',      prefix: 'MC' },
  { name: 'AL Maktoum Passenger',  prefix: 'MP' },
  { name: 'Aviation District',     prefix: 'AV' },
  { name: 'Jebel Ali Port',        prefix: 'JA' },
  { name: 'Port Rashid',           prefix: 'PR' },
];

const INVOICE_TYPES = [
  'Auction Receivable',
  'Berthing/Loading Fee Statement',
  'Case Management Demand Notice',
  'CRN SEA Discrepancy Export Manifest Fine Invoice',
  'CRN SEA Export Late Manifest Fine Invoice',
  'CRN SEA Export Manifest Service Charges Invoice',
  'CRN SEA Import Manifest Discrepancy Fine Invoice',
  'DA Deposit Forfeiture Demand Notice',
  'Declaration - Short Collection Demand Notice',
  'Departure Permit Invoice',
  'Deposit Claim Receivable - Cash',
  'Deposit Claim Receivable - DA',
  'Deposit Claim Receivable - SG',
  'Deposit Forfeiture Demand Notice',
  'Deposit Receivable Invoice (DIPS)',
  'Document Submission Invoice',
  'Duty Claim Receivable - Cash',
  'Freezone NR Claim Registration Charges Invoice',
  'General Charge Invoice',
];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

type Menu     = 'Overview' | 'Accounts' | 'Invoices' | 'Payments';
type InvStep  = 'list' | 'pay' | 'success' | 'receipt';
type AccStep  = 'main' | 'list';
type AccView  = 'list' | 'pay' | 'success';

/* ── Sidebar icons ──────────────────────────────────────────────────────────── */
const DashboardIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const AccountsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4 20c0-3.5 3.5-6.5 8-6.5s8 3 8 6.5" strokeLinecap="round" />
  </svg>
);
const InvoicesIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
  </svg>
);
const PaymentsIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="1.8">
    <rect x="2" y="6" width="20" height="13" rx="2" />
    <path d="M2 10h20" strokeLinecap="round" />
    <circle cx="7" cy="14.5" r="1.5" fill="#1360d2" stroke="none" />
  </svg>
);
const MENU_ITEMS: { label: Menu; Icon: () => JSX.Element }[] = [
  { label: 'Overview',  Icon: DashboardIcon },
  { label: 'Accounts',  Icon: AccountsIcon  },
  { label: 'Invoices',  Icon: InvoicesIcon  },
  { label: 'Payments',  Icon: PaymentsIcon  },
];

/* ── Shared breadcrumb ──────────────────────────────────────────────────────── */
function Breadcrumb({ onBack, extra }: { onBack: () => void; extra?: string }) {
  return (
    <div className="flex items-center justify-between mt-[16px] mb-[8px]">
      <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
        <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Home</span>
        <span className="text-[#dc3545] px-[4px]">/</span>
        <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Service Catalog</span>
        <span className="text-[#dc3545] px-[4px]">/</span>
        {extra ? (
          <>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Bill Payment</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">{extra}</span>
          </>
        ) : (
          <span className="text-[#111838] font-medium">Bill Payment</span>
        )}
      </div>
      <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
        AE-1019056- Dubai Customs - Test LLC
      </div>
    </div>
  );
}

/* ── Receipt modal (Bill Payment Settlement Receipt) ──────────────────────── */
function ReceiptModal({ onClose, rows }: { onClose: () => void; rows: typeof PAYMENT_ROWS[0]['details'] }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
      <div className="bg-white rounded-[12px] overflow-hidden w-[1100px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0e1b3d' }}>
          <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Bill Payment Settlement Receipt</span>
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 flex flex-col gap-5">

          {/* Business Details */}
          <div className="bg-[#f5f8ff] rounded-[8px] border border-[#e0e8f5] p-4 grid grid-cols-4 gap-4">
            {[
              ['Business Name', 'crnuser01'],
              ['Business Code', 'AE-1051144'],
              ['Date', '10-06-2026'],
              /* The receipt number is already listed per line in the table below */
              ['Username', 'crnuser01'],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Bill Details */}
          <div>
            <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Bill Details</p>
            <div className="rounded-[8px] border border-[#e0e8f5] overflow-hidden" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                <thead>
                  <tr>
                    {['Payment Type', 'Invoice / Account No.', 'Receipt No.', 'Amount', 'Status', 'Remarks'].map((h, i) => (
                      <th key={h} style={{
                        background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500,
                        paddingLeft: i === 0 ? 20 : 12,
                      }}>
                        <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                      <td style={{ background: '#fff', padding: '13px 12px', paddingLeft: 20, verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.type}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.invoiceNo}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.receiptNo || '—'}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d] flex items-center gap-[3px]"><DirhamIcon size={14} color="#0e1b3d" />{r.amount}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                        <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[16px] font-semibold whitespace-nowrap"
                          style={{ background: r.status === 'Success' ? 'rgba(40,167,69,0.12)' : 'rgba(192,57,43,0.10)', color: r.status === 'Success' ? '#28a745' : '#c0392b' }}>
                          {r.status}
                        </span>
                      </td>
                      <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle', maxWidth: 260 }}>
                        <span className="text-[16px] text-[#0e1b3d]">{r.remarks || '—'}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Settlement Details */}
          <div>
            <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Settlement Details</p>
            <div className="rounded-[12px] border border-[#e0e8f5] p-5" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
              <div className="grid grid-cols-5 gap-x-6 gap-y-5">
                {[
                  ['Payment Method',            'Credit Card'],
                  ['Transaction No.',           '13133'],
                  ['Transaction Date',          '10-06-2026'],
                  ['E-Payment Transaction No.', '20021737'],
                  ['Amount',                    '5,540.00'],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                    <p className="text-[16px] font-semibold text-[#0e1b3d] flex items-center gap-[3px]" style={{ fontFamily: font }}>
                      {label === 'Amount' && <DirhamIcon size={13} color="#0e1b3d" />}{value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer buttons — the same centred pair as the account top-up receipt */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              onClick={() => window.print()}
              className="h-[44px] px-8 rounded-[4px] text-[16px] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" />
                <rect x="6" y="14" width="12" height="8" rx="1" />
              </svg>
              Print
            </button>
            <button
              onClick={onClose}
              data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Payment Transaction Details modal ──────────────────────────────────────── *//* ── Payment Transaction Details modal ──────────────────────────────────────── */

type TxRow = typeof PAYMENT_ROWS[0];

/** Pill tabs, matching the All Records / E-Payment pair on the declaration listing.
    The strip scrolls once there are more transactions than fit, with chevrons either side. */
function TxTabs({ count, active, onChange }: { count: number; active: number; onChange: (i: number) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [arrows, setArrows] = useState({ left: false, right: false });

  const sync = () => {
    const el = scrollRef.current;
    if (!el) return;
    setArrows({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    sync();
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count]);

  /* Keep the selected tab in view when it is reached with the arrows. */
  useEffect(() => {
    scrollRef.current?.querySelectorAll('button')[active]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  }, [active]);

  const nudge = (dir: -1 | 1) => scrollRef.current?.scrollBy({ left: dir * 200, behavior: 'smooth' });

  const arrowBtn = (dir: -1 | 1, enabled: boolean) => (
    <button
      type="button"
      onClick={() => nudge(dir)}
      disabled={!enabled}
      aria-label={dir === -1 ? 'Scroll tabs left' : 'Scroll tabs right'}
      className="h-[32px] w-[32px] rounded-full inline-flex items-center justify-center flex-shrink-0 transition-colors"
      style={{
        border: `1px solid ${enabled ? '#1360d2' : '#e5efff'}`,
        color: enabled ? '#1360d2' : '#b0b8d0',
        background: 'white',
        cursor: enabled ? 'pointer' : 'not-allowed',
      }}
    >
      <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d={dir === -1 ? 'M12 5l-5 5 5 5' : 'M8 5l5 5-5 5'} />
      </svg>
    </button>
  );

  return (
    <div className="bg-white flex items-center gap-[12px] h-[48px] px-[16px] py-[8px] rounded-[6px] w-full"
      style={{ boxShadow: '0px 4px 10px rgba(0,0,0,0.08)' }}>
      {arrowBtn(-1, arrows.left)}
      <div
        ref={scrollRef}
        onScroll={sync}
        className="flex-1 min-w-0 flex items-center gap-[12px] overflow-x-auto no-scrollbar"
        style={{ scrollbarWidth: 'none' }}
      >
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`h-[40px] px-[16px] rounded-[4px] text-[16px] font-medium transition-colors whitespace-nowrap flex-shrink-0 ${
              active === i ? 'bg-[#1360d2] text-white' : 'bg-[#f7faff] text-[#697498] border border-[#e5efff]'
            }`}
            style={{ fontFamily: font }}
          >
            Transaction {i + 1}
          </button>
        ))}
      </div>
      {arrowBtn(1, arrows.right)}
    </div>
  );
}

/** The transaction's own fields, minus whatever the accordion header already shows. */
function TxFields({ tx, omit = [] }: { tx: TxRow; omit?: string[] }) {
  const pairs: [string, string][] = [
    ['Transaction No.', tx.txNo],
    ['Transaction Date', tx.txDateFull],
    ['DEG Transaction No.', tx.degTx],
    ['DEG Transaction Date', tx.txDate],
    ['EPayment Transaction No', tx.ePayTx],
    ['Initiated Date', tx.initiatedDate],
    ['Initiated By', tx.initiatedBy],
    ['Status', tx.status],
    ['Payment Mode', tx.mode],
  ];
  return (
    <div className="grid grid-cols-4 gap-x-8 gap-y-4">
      {pairs.filter(([l]) => !omit.includes(l)).map(([label, value]) => (
        <div key={label}>
          <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
          {label === 'Status' ? (
            <p className="mt-[2px]"><StatusPill status={value} /></p>
          ) : (
            <p className="text-[16px] font-semibold mt-[2px] text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function TxMessage({ tx }: { tx: TxRow }) {
  return (
    <div className="mt-4 pt-4 border-t border-[#d5ddfb]">
      <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Message</span>
      <p className="text-[16px] text-[#1360d2] mt-1" style={{ fontFamily: font }}>{tx.payMsg}</p>
      {tx.colMsg && <p className="text-[16px] text-[#dc3545] mt-1 font-medium" style={{ fontFamily: font }}>{tx.colMsg}</p>}
    </div>
  );
}

function TxPaymentTable({ tx }: { tx: TxRow }) {
  return (
    <div className="rounded-[8px] border border-[#d5ddfb] overflow-hidden">
      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
        <thead>
          <tr>
            {['Payment Type', 'Invoice / Account No.', 'Amount', 'Receipt No.', 'Remarks', 'Status'].map((h, i, arr) => (
              <th key={h} style={{
                background: '#a6c2e9', padding: '11px 14px', textAlign: 'left', fontWeight: 500,
                borderTopLeftRadius: i === 0 ? 8 : 0,
                borderTopRightRadius: i === arr.length - 1 ? 8 : 0,
              }}>
                <span className="text-[15px] font-medium text-[#051937]">{h}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tx.details.map((d, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #e8eef8' }}>
              <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.type}</td>
              <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.invoiceNo}</td>
              <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={13} color="#0e1b3d" />&nbsp;{d.amount}</td>
              <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.receiptNo}</td>
              <td className="py-3 px-[14px] text-[15px] text-[#0e1b3d]">{d.remarks}</td>
              <td className="py-3 px-[14px]"><StatusPill status={d.status} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Layout 2 — one accordion per transaction, a summary on the header and the rest inside. */
function TxAccordion({ tx, index, open, onToggle }: { tx: TxRow; index: number; open: boolean; onToggle: () => void }) {
  const headerPairs: [string, string][] = [
    ['Transaction No.', tx.txNo],
    ['Transaction Date', tx.txDateFull],
    ['Amount (AED)', tx.amount],
    ['Payment Mode', tx.mode],
    ['Status', tx.status],
  ];
  return (
    <div className="rounded-[8px] border border-[#d5ddfb] overflow-hidden mb-4" style={{ background: 'white' }}>
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center gap-6 px-5 py-4 text-left transition-colors hover:bg-[#f8fafd]"
        style={{ background: open ? '#f4f7fc' : 'white' }}
      >
        {/* The transaction's position, as a numbered badge rather than a worded label */}
        <span className="inline-flex items-center justify-center rounded-full text-white text-[16px] font-semibold flex-shrink-0"
          style={{ width: 32, height: 32, background: '#1360d2', fontFamily: font }}>
          {index + 1}
          <span className="sr-only">Transaction {index + 1}</span>
        </span>
        <span className="flex-1 min-w-0 grid grid-cols-5 gap-x-6">
          {headerPairs.map(([label, value]) => (
            <span key={label} className="flex flex-col gap-[2px] items-start">
              <span className="text-[14px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
              {label === 'Status' ? (
                <StatusPill status={value} />
              ) : (
                <span className="text-[16px] font-semibold text-[#0e1b3d] whitespace-nowrap" style={{ fontFamily: font }}>
                  {label === 'Amount (AED)' && <><DirhamIcon size={14} color="#0e1b3d" />&nbsp;</>}{value}
                </span>
              )}
            </span>
          ))}
        </span>
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1360d2" strokeWidth="2.2" strokeLinecap="round"
          className="flex-shrink-0" style={{ transform: open ? 'rotate(180deg)' : undefined, transition: 'transform 0.15s' }}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 pt-4" style={{ borderTop: '1px solid #d5ddfb' }}>
          <TxFields tx={tx} omit={['Transaction No.', 'Transaction Date', 'Amount (AED)', 'Payment Mode', 'Status']} />
          <TxMessage tx={tx} />
          <p className="text-[#0e1b3d] text-[20px] font-bold mt-5 mb-3" style={{ fontFamily: font }}>Payment Details</p>
          <TxPaymentTable tx={tx} />
        </div>
      )}
    </div>
  );
}

/**
 * Payment Details for one invoice — every transaction raised against it, each an
 * accordion whose header carries the amount alongside the transaction and its mode.
 */
function InvoicePaymentDetailsPage({ invoiceNo, rows, onHome, onBack }: {
  invoiceNo: string; rows: TxRow[]; onHome?: () => void; onBack?: () => void;
}) {
  const [openRows, setOpenRows] = useState<Set<number>>(() => new Set([0]));
  const toggle = (i: number) => setOpenRows(prev => {
    const next = new Set(prev);
    next.has(i) ? next.delete(i) : next.add(i);
    return next;
  });
  return (
    <ActionPage title="Payment Details" crumb="Bill Payment" onHome={onHome} onBack={onBack}
      subtitle={
        <span className="flex items-center gap-[10px] flex-wrap">
          Invoice No: {invoiceNo}
          {/* How many payments this invoice has behind it */}
          <span className="text-[15px] px-[12px] py-[3px] rounded-[14px]"
            style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
            {rows.length} transaction{rows.length !== 1 ? 's' : ''}
          </span>
        </span>
      }>
      {rows.length === 0 ? (
        <p className="text-[16px] text-[#697498] text-center bg-white rounded-[8px]" style={{ padding: '32px 16px', fontFamily: font }}>
          No payments recorded against this invoice yet.
        </p>
      ) : (
        rows.map((tx, i) => (
          <TxAccordion key={tx.txNo} tx={tx} index={i} open={openRows.has(i)} onToggle={() => toggle(i)} />
        ))
      )}
    </ActionPage>
  );
}

function TransactionModal({ row, rows, onClose, showTabs = false }: {
  row?: TxRow; rows?: typeof PAYMENT_ROWS; onClose: () => void;
  /* The listings' popups page through several transactions; the payment confirmation
     ones show the single transaction just made. */
  showTabs?: boolean;
}) {
  const list = rows && rows.length > 0 ? rows : (row ? [row] : []);
  const [activeIdx, setActiveIdx] = useState(0);
  const active = list[activeIdx] ?? list[0];
  if (!active) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
      <div className="bg-white rounded-[8px] overflow-hidden max-h-[90vh] overflow-y-auto shadow-2xl" style={{ width: 1100 }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6" style={{ background: '#0e1b3d', height: 65 }}>
          <span className="text-white text-[20px] font-semibold" style={{ fontFamily: font }}>Payment Transaction Details</span>
          <button onClick={onClose} className="text-white hover:opacity-70 transition-opacity">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {/* The listings' popups page through the transactions with the tab strip */}
          {showTabs && list.length > 1 && (
            <div className="mb-5">
              <TxTabs count={list.length} active={activeIdx} onChange={setActiveIdx} />
            </div>
          )}

          <div className="rounded-[8px] border border-[#d5ddfb] p-5 mb-5" style={{ background: 'white' }}>
            <TxFields tx={active} />
            <TxMessage tx={active} />
          </div>
          <p className="text-[#0e1b3d] text-[20px] font-bold mb-3" style={{ fontFamily: font }}>Payment Details</p>
          <TxPaymentTable tx={active} />

          {/* Footer buttons — same pair as the account top-up receipt */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => window.print()}
              className="h-[44px] px-8 rounded-[4px] text-[16px] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" />
                <rect x="6" y="14" width="12" height="8" rx="1" />
              </svg>
              Print
            </button>
            <button
              onClick={onClose}
              data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Floating-label helpers (matches Cargo Transfer module) ─────────────── */
function floatLabel(active: boolean, focused = false): React.CSSProperties {
  return {
    position: 'absolute',
    left: 12,
    top: active ? 0 : '50%',
    transform: 'translateY(-50%)',
    fontSize: active ? 12 : 16,
    color: '#0e1b3d',
    background: active ? 'white' : 'transparent',
    padding: active ? '0 4px' : 0,
    pointerEvents: 'none',
    transition: 'top 0.15s ease, font-size 0.15s ease, color 0.15s ease',
    fontFamily: font,
    whiteSpace: 'nowrap',
    zIndex: 1,
  };
}

const ClearXBtn = ({ onClear, right = 10 }: { onClear: (e: React.MouseEvent) => void; right?: number }) => (
  <button type="button" onClick={onClear}
    style={{ position: 'absolute', right, top: '50%', transform: 'translateY(-50%)',
      width: 22, height: 22, borderRadius: '50%', border: 'none', background: '#b0b8d0',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0, zIndex: 2 }}>
    <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
      <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
      <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  </button>
);

function FloatInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="relative" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-[56px] w-full rounded-[4px] px-[12px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white"
        style={{ fontFamily: font, paddingRight: (value && hovered) ? 40 : 12, border: `1px solid ${focused ? '#1360d2' : '#d5ddfb'}` }}
      />
      <span style={floatLabel(active, focused)}>{label}</span>
      {value && hovered && <ClearXBtn onClear={e => { e.preventDefault(); onChange(''); }} />}
    </div>
  );
}

/* Toolbar-height select with a floating label — the Invoices toolbar's own control. */
/* Applied filters, as the Refund & Claims listing shows them: one chip per field in
   play, kept visible once the panel is closed, with a Reset beside them. */
function FilterTags({ tags, onReset }: { tags: { label: string; value: string }[]; onReset: () => void }) {
  if (tags.length === 0) return null;
  return (
    <div className="flex items-center flex-wrap gap-[10px] mb-[12px]">
      {tags.map(t => (
        <span key={t.label} title={t.value}
          className="inline-flex items-center h-[36px] px-[14px] rounded-[4px] text-[15px] text-[#0e1b3d] whitespace-nowrap"
          style={{ background: '#cfe0f7', fontFamily: font }}>
          {t.label}
        </span>
      ))}
      <button type="button" onClick={onReset}
        className="inline-flex items-center gap-[6px] text-[16px] text-[#1360d2] font-medium hover:opacity-70 transition-opacity"
        style={{ fontFamily: font }}>
        Reset
        <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 10a7 7 0 1 1-2.05-4.95" /><path d="M17 3v4h-4" />
        </svg>
      </button>
    </div>
  );
}

function ToolbarSelect({ label, value, options, onChange, required = false }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; required?: boolean;
}) {
  const [open, setOpen] = useState(false);
  /* Typing narrows the list — long option lists are hard to pick from otherwise. */
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setQuery(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  const shown = options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()));
  const pick = (v: string) => { onChange(v); setOpen(false); setQuery(''); };
  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(o => !o)} title={value || undefined}
        className="h-[48px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-left bg-white hover:bg-[#f7faff] transition-colors cursor-pointer"
        style={{ border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}`, fontFamily: font }}>
        {open ? (
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={value || `Search ${label.toLowerCase()}…`}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Enter' && shown.length > 0) pick(shown[0]);
              if (e.key === 'Escape') { setOpen(false); setQuery(''); }
            }}
            className="flex-1 min-w-0 bg-transparent focus:outline-none text-[16px] text-[#0e1b3d] placeholder-[#8f94ae]"
            style={{ fontFamily: font }} />
        ) : (
          <span className="flex-1 truncate text-[16px]" style={{ color: '#1360d2', fontWeight: 500 }}>
            {value}
          </span>
        )}
        {value && !open && (
          <span role="button" aria-label={`Clear ${label}`}
            onClick={e => { e.stopPropagation(); onChange(''); setOpen(false); }}
            className="flex items-center justify-center flex-shrink-0 hover:opacity-80"
            style={{ width: 20, height: 20, borderRadius: '50%', background: '#b0b8d0', cursor: 'pointer' }}>
            <svg viewBox="0 0 10 10" width="9" height="9" fill="none">
              <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
              <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </span>
        )}
        <svg viewBox="0 0 24 24" className={`size-[16px] text-[#697498] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <span style={floatLabel(open || value !== '')}>
        {required && <span style={{ color: '#e8212e' }}>*</span>}{label}
      </span>
      {open && (
        <div className="absolute z-[90] top-[52px] left-0 bg-white rounded-[8px] py-[4px] overflow-y-auto"
          style={{ minWidth: '100%', width: 'max-content', maxWidth: 'min(560px, 80vw)', maxHeight: 300, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {!required && !query && (
            <button onClick={() => pick('')}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] whitespace-nowrap"
              style={{ color: value === '' ? '#1360d2' : '#697498', fontFamily: font }}>All</button>
          )}
          {shown.length === 0 ? (
            <p className="px-[14px] py-[10px] text-[15px] text-[#697498] whitespace-nowrap" style={{ fontFamily: font }}>No matches</p>
          ) : shown.map(opt => (
            <button key={opt} onClick={() => pick(opt)}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] whitespace-nowrap"
              style={{ color: opt === value ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === value ? 500 : 400 }}>{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function FloatDropdown({ label, value, options, onChange, allowAll = true }: { label: string; value: string; options: string[]; onChange: (v: string) => void; allowAll?: boolean }) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);
  /* Typing narrows the list — long option lists are hard to pick from otherwise. */
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) { setOpen(false); setFocused(false); setQuery(''); } };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);
  const active = open || focused || value !== '';
  const showX = !!(value && hovered);
  const shown = options.filter(o => o.toLowerCase().includes(query.trim().toLowerCase()));
  const pick = (v: string) => { onChange(v); setOpen(false); setFocused(false); setQuery(''); };
  return (
    <div className="relative" ref={ref} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div
        onClick={() => { setOpen(o => !o); setFocused(true); }}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] bg-white cursor-pointer"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}
      >
        {open ? (
          <input ref={inputRef} type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder={value || `Search ${label.toLowerCase()}…`}
            onClick={e => e.stopPropagation()}
            onKeyDown={e => {
              if (e.key === 'Enter' && shown.length > 0) pick(shown[0]);
              if (e.key === 'Escape') { setOpen(false); setQuery(''); }
            }}
            className="flex-1 min-w-0 bg-transparent focus:outline-none text-[16px] text-[#0e1b3d] placeholder-[#8f94ae]"
            style={{ fontFamily: font }} />
        ) : (
          <span className="flex-1 truncate">{value}</span>
        )}
        {showX && allowAll && !open && (
          <span onClick={e => { e.stopPropagation(); onChange(''); setOpen(false); setFocused(false); }}
            style={{ width: 22, height: 22, borderRadius: '50%', background: '#b0b8d0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer' }}>
            <svg viewBox="0 0 10 10" width="10" height="10" fill="none">
              <line x1="2" y1="2" x2="8" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
              <line x1="8" y1="2" x2="2" y2="8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
          </span>
        )}
        <svg viewBox="0 0 24 24" className={`size-[18px] text-[#697498] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      <span style={floatLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-y-auto" style={{ maxHeight: 280, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {allowAll && !query && (
            <button onClick={() => pick('')}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]"
              style={{ color: value === '' ? '#1360d2' : '#697498', fontFamily: font }}>All</button>
          )}
          {shown.length === 0 ? (
            <p className="px-[14px] py-[10px] text-[15px] text-[#697498]" style={{ fontFamily: font }}>No matches</p>
          ) : shown.map(opt => (
            <button key={opt} onClick={() => pick(opt)}
              className="block w-full text-left px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9]"
              style={{ color: opt === value ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: opt === value ? 500 : 400 }}
            >{opt}</button>
          ))}
        </div>
      )}
    </div>
  );
}

/* Multi-select dropdown — checkboxes so several statuses can be filtered at once. */
function StatusMultiDropdown({ label, values, options, onChange }: { label: string; values: Set<string>; options: string[]; onChange: (v: Set<string>) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const toggle = (opt: string) => {
    const n = new Set(values);
    n.has(opt) ? n.delete(opt) : n.add(opt);
    onChange(n);
  };
  const active = open || values.size > 0;
  const display = values.size === 0 ? '' : values.size === 1 ? [...values][0] : `${values.size} statuses selected`;
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="h-[56px] w-full rounded-[4px] px-[12px] flex items-center gap-[6px] text-[16px] text-[#0e1b3d] focus:outline-none bg-white text-left"
        style={{ fontFamily: font, border: `1px solid ${open ? '#1360d2' : '#d5ddfb'}` }}
      >
        <span className="flex-1 truncate">{display}</span>
        <svg viewBox="0 0 24 24" className={`size-[18px] text-[#697498] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      <span style={floatLabel(active, open)}>{label}</span>
      {open && (
        <div className="absolute z-[90] top-[60px] left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden" style={{ boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
          {options.map(opt => {
            const checked = values.has(opt);
            return (
              <label key={opt} className="flex items-center gap-[10px] px-[14px] py-[8px] text-[16px] hover:bg-[#e2ebf9] cursor-pointer"
                style={{ color: checked ? '#1360d2' : '#0e1b3d', fontFamily: font, fontWeight: checked ? 500 : 400 }}>
                <input type="checkbox" checked={checked} onChange={() => toggle(opt)} className="size-4 accent-[#1360d2] cursor-pointer flex-shrink-0" />
                {opt}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── E-Payment confirmation popup (Figma 2650:42899) ─────────────────────── */
function EPayConfirmModal({ amount, count, onConfirm, onClose, paymentMethod }: { amount: string; count: number; onConfirm: () => void; onClose: () => void; paymentMethod?: 'epayment' | 'debit' }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.50)' }} onClick={onClose}>
      <div className="bg-white rounded-[8px] overflow-hidden flex flex-col" style={{ width: 868, maxWidth: '94vw', boxShadow: '0px 8px 40px rgba(0,0,0,0.22)' }} onClick={e => e.stopPropagation()}>
        {/* Dark navy header */}
        <div className="flex items-center px-[20px]" style={{ background: '#0e1b3d', height: 65 }}>
          <span className="text-[20px] font-medium text-white" style={{ fontFamily: font }}>Bill Payment Confirmation</span>
        </div>
        {/* Body */}
        <div className="px-[40px] py-[48px]">
          <p className="text-[24px] text-[#0e1b3d] text-center" style={{ fontFamily: font, lineHeight: 1.55 }}>
            {paymentMethod === 'debit' ? (
              <>
                By clicking the confirm button, you are authorizing us to use your{' '}
                <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>Debit A/C</span>
                {' '}for payment of{' '}
                <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>{count} transaction(s)</span>
                {' '}of total amount{' '}
                <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }} className="inline-flex items-center gap-[3px]">
                  <DirhamIcon size={18} color="#0e1b3d" />{amount}
                </span>.
              </>
            ) : (
              <>
                By clicking the confirm button, you are authorizing us to redirect your request for payment of{' '}
                <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }}>{count} account(s)</span>
                {' '}of total{' '}
                <span style={{ fontFamily: "'Dubai', sans-serif", fontWeight: 600 }} className="inline-flex items-center gap-[3px]">
                  <DirhamIcon size={18} color="#0e1b3d" />{amount}
                </span>
                {' '}through Dubai E-Government payment site
              </>
            )}
          </p>
        </div>
        {/* Footer */}
        <div className="flex items-center justify-center gap-[12px] pb-[32px]">
          <button
            onClick={onClose}
            className="h-[48px] px-[20px] rounded-[3px] border text-[16px] flex items-center justify-center"
            style={{ background: 'white', border: '1px solid #1360d2', color: '#1360d2', fontFamily: font, width: 163 }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onClose(); onConfirm(); }}
            className="h-[48px] px-[20px] rounded-[3px] text-[16px] text-white flex items-center justify-center hover:opacity-90"
            style={{ background: '#1360d2', fontFamily: font, width: 163 }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Date Filter Card (above every table, matching Integrated Clearance) ─── */
function DateFilterCard({ from, to }: { from?: string; to?: string }) {
  return (
    <div className="flex items-center mb-[14px]">
      <div
        className="inline-flex items-center gap-[8px] h-[38px] px-[16px] rounded-[8px] border border-[#d5ddfb] bg-white text-[13px] text-[#0e1b3d]"
        style={{ fontFamily: "'Dubai', sans-serif" }}
      >
        <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#1360d2" strokeWidth="1.6">
          <rect x="3" y="4" width="14" height="13" rx="2" />
          <path d="M3 8h14M7 2v4M13 2v4" />
        </svg>
        <span>Status as {from || '01-Jan-26'} to {to || '14-Jun-26'}</span>
        <button className="text-[#1360d2] font-medium hover:opacity-70 ml-[2px]">Modify</button>
      </div>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────────────────────────── */
export default function BillPaymentPage({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { agent } = useParams<{ agent?: string }>();
  const handleHome = () => { onBack(); navigate(`/landing/${agent ?? 'trader'}`); };
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [activeMenu, setActiveMenu]         = useState<Menu>('Overview');
  const [step, setStep]                     = useState<InvStep>('list');
  /* Payment History — opened from the Payments row menu, for one transaction. */
  const [historyFor, setHistoryFor]         = useState<string | null>(null);
  const [showFilters, setShowFilters]       = useState(false);
  const [selectedRows, setSelectedRows]     = useState<Set<number>>(new Set());
  const [openFlyout, setOpenFlyout]         = useState<number | null>(null);
  const [flyoutPos, setFlyoutPos]           = useState<{ top?: number; bottom?: number; right: number } | null>(null);
  const [recheckOpen, setRecheckOpen]       = useState(false);
  const [recheckIdx, setRecheckIdx]         = useState(0);
  const [paymentMethod, setPaymentMethod]   = useState<'epayment' | 'debit'>('epayment');
  const [showReceipt, setShowReceipt]             = useState(false);
  const [showAccReceipt, setShowAccReceipt]       = useState(false);
  /* The account payment's own Payment Transaction Details popup. */
  const [showAccTxDetails, setShowAccTxDetails]   = useState(false);
  const [showEPayConfirm, setShowEPayConfirm]     = useState(false);
  const [showAccEPayConfirm, setShowAccEPayConfirm] = useState(false);
  const [showInvReceipt, setShowInvReceipt]       = useState(false);
  const [invReceiptRows, setInvReceiptRows]       = useState<typeof PAYMENT_ROWS[0]['details']>([]);
  const [showPayFlyoutReceipt, setShowPayFlyoutReceipt] = useState(false);
  const [payFlyoutReceiptRows, setPayFlyoutReceiptRows] = useState<typeof PAYMENT_ROWS[0]['details']>([]);
  const [showAccDetails, setShowAccDetails]       = useState(false);
  const [accDetailsAccount, setAccDetailsAccount] = useState<typeof ALL_ACCOUNTS[0] | null>(null);
  const [invPage, setInvPage]               = useState(1);
  const [payPage, setPayPage]               = useState(1);
  const PAGE_SIZE = 8;
  const [filterOpen, setFilterOpen] = useState<string | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [filterOrders, setFilterOrders] = useState<Record<string, 'oldest'|'newest'>>({});
  const filterRef = useRef<HTMLDivElement>(null);

  /* Account list / pay / success state */
  const [accView, setAccView]           = useState<AccView>('list');
  const [accPage, setAccPage]           = useState(1);
  const [selectedAccs, setSelectedAccs] = useState<Set<number>>(new Set());
  const [accPayAmounts, setAccPayAmounts] = useState<Record<number, string>>({});
  const [accPayMethod, setAccPayMethod] = useState<'epayment' | 'debit'>('epayment');
  const [accDebitAcc,  setAccDebitAcc]  = useState('');
  const [accDebitOpen, setAccDebitOpen] = useState(false);
  const [showAccInsufficient, setShowAccInsufficient] = useState(false);
  const accDebitRef = useRef<HTMLDivElement>(null);

  /* Account statement form state */
  const [accStep, setAccStep]           = useState<AccStep>('main');
  const [stmtType, setStmtType]         = useState<'summary' | 'detailed' | 'transaction'>('summary');
  const [stmtYear, setStmtYear]         = useState('2026');
  const [stmtMonth, setStmtMonth]       = useState('May');
  const [stmtFromDate, setStmtFromDate] = useState('2026-06-09');
  const [stmtToDate, setStmtToDate]     = useState('2026-06-10');
  const [stmtRangeError, setStmtRangeError] = useState(false);
  const [downloadFmt, setDownloadFmt]   = useState('');
  const [stmtAccount, setStmtAccount]   = useState('');
  const [stmtAccSearch, setStmtAccSearch] = useState('');
  const [stmtAccOpen, setStmtAccOpen]   = useState(false);
  const stmtAccRef = useRef<HTMLDivElement>(null);

  /* Advanced filter fields */
  const [fFromDate,  setFFromDate]  = useState('');
  const [fToDate,    setFToDate]    = useState('');
  const [fSource,    setFSource]    = useState('');
  const [fInvType,   setFInvType]   = useState('');
  const [fLocation,  setFLocation]  = useState('');
  const [fInvNumber, setFInvNumber] = useState('');
  /* Invoices tab defaults to showing Unpaid records; multi-select via checkboxes. */
  const [fStatuses,  setFStatuses]  = useState<Set<string>>(() => new Set(['Unpaid']));
  const [statusOpen, setStatusOpen] = useState(false);
  const [payStatusFilter, setPayStatusFilter] = useState('');
  /** Set from the Overview tab's Overdue / Current & Due Soon cards — narrows the Invoices
      tab by due-date bucket. Shown as a dismissible chip so it can be cleared like any other filter. */
  const [fDueFilter, setFDueFilter] = useState<'' | 'overdue' | 'dueSoon'>('');
  /** Recent Activity Summary window toggle (Overview tab). */
  const [recentPeriodDays, setRecentPeriodDays] = useState<'today' | 7 | 30>('today');
  /** Account-number picker for the Overview tab's CDR Usage / Debit Account Top-ups trend charts. */
  const [cdrChartAccount, setCdrChartAccount]     = useState(ACCOUNTS[0]?.account ?? '');
  const [cdrChartAccountOpen, setCdrChartAccountOpen] = useState(false);
  const [debitChartAccount, setDebitChartAccount] = useState(DEBIT_ACCOUNTS[0]?.account ?? '');
  const [debitChartAccountOpen, setDebitChartAccountOpen] = useState(false);

  /* Account & Payment bottom-bar search */
  const [accSearchType, setAccSearchType]         = useState('Account Number');
  const [accSearchTypeOpen, setAccSearchTypeOpen] = useState(false);
  const [accSearchValue, setAccSearchValue]       = useState('');
  const [accTypeFilter, setAccTypeFilter]         = useState('All');
  const [paySearchType, setPaySearchType]         = useState('Transaction No.');
  const [paySearchTypeOpen, setPaySearchTypeOpen] = useState(false);
  const [paySearchValue, setPaySearchValue]       = useState('');
  const [bottomStDateOpen, setBottomStDateOpen]   = useState(false);
  const [showStmtModal, setShowStmtModal]     = useState(false);
  const [payAdvFilters, setPayAdvFilters]     = useState(false);
  const [accAdvFilters, setAccAdvFilters]     = useState(false);
  const [accTypeOpen, setAccTypeOpen]         = useState(false);

  const [payStatusOpen,   setPayStatusOpen]   = useState(false);
  const [invPayDetails,   setInvPayDetails]   = useState<typeof PAYMENT_ROWS[0] | null>(null);
  const [invTxDetails,    setInvTxDetails]    = useState<typeof PAYMENT_ROWS | null>(null);
  /* The Invoices listing shows an invoice's payments on a page, not in a popup. */
  const [invPayPage,      setInvPayPage]      = useState<{ invoiceNo: string; rows: typeof PAYMENT_ROWS } | null>(null);
  /* The Advanced Filters' range and the "Transaction Date As On" badge are two separate
     controls — changing one leaves the other where the user put it. */
  const [payFromDate, setPayFromDate] = useState('');
  const [payToDate,   setPayToDate]   = useState('');
  const [payAsOnFrom, setPayAsOnFrom] = useState('2026-06-09');
  const [payAsOnTo,   setPayAsOnTo]   = useState('2026-06-10');
  /* The range always means one of two dates; transactions are the usual one. */
  const [payDateFilterType, setPayDateFilterType] = useState('Transaction Date');
  const [payExportOpen, setPayExportOpen] = useState(false);
  const payExportRef = useRef<HTMLDivElement>(null);
  const [expandedPayRow, setExpandedPayRow] = useState<number | null>(null);


  const flyoutRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (openFlyout === null) return;
    const h = (e: MouseEvent) => {
      if (flyoutRef.current && !flyoutRef.current.contains(e.target as Node)) setOpenFlyout(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [openFlyout]);

  useEffect(() => {
    if (!payExportOpen) return;
    const h = (e: MouseEvent) => {
      if (payExportRef.current && !payExportRef.current.contains(e.target as Node)) setPayExportOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [payExportOpen]);

  useEffect(() => {
    if (!accDebitOpen) return;
    const h = (e: MouseEvent) => {
      if (accDebitRef.current && !accDebitRef.current.contains(e.target as Node)) setAccDebitOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [accDebitOpen]);

  useEffect(() => {
    if (!stmtAccOpen) return;
    const h = (e: MouseEvent) => {
      if (stmtAccRef.current && !stmtAccRef.current.contains(e.target as Node)) setStmtAccOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [stmtAccOpen]);

  useEffect(() => {
    if (!filterOpen) return;
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setFilterOpen(null);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [filterOpen]);

  const DATE_COLS     = new Set(['Invoice Date', 'Transaction Date']);
  const DATETIME_COLS = new Set(['pay:Transaction Date']); // date + time picker
  const STATUS_OPTS: Record<string, string[]> = {
    inv: ['Unpaid', 'Paid', 'Partially Paid', 'Initiated'],
    pay: ['Success', 'Initiated'],
    acc: [],
  };

  const renderFilterHeader = (
    table: string,
    label: string,
    { align = 'left' as 'left' | 'right', tip, sticky, stickyRight, style = {} as React.CSSProperties }: {
      align?: 'left' | 'right'; tip?: string; sticky?: boolean; stickyRight?: number; style?: React.CSSProperties;
    } = {}
  ) => {
    const key = `${table}:${label}`;
    const isOpen = filterOpen === key;
    const isDate = DATE_COLS.has(label);
    const isDateTime = DATETIME_COLS.has(key);
    const isStatus = label === 'Status';
    const value = filterValues[key] ?? '';
    const order = filterOrders[key] ?? 'newest';
    const isActive = !!value;
    const ra = align === 'right';
    const statusOpts = STATUS_OPTS[table] ?? [];
    return (
      <th key={label} style={{
        background: '#a6c2e9', padding: '10px 12px',
        textAlign: ra ? 'right' : 'left', fontWeight: 500, whiteSpace: 'nowrap',
        position: sticky ? 'sticky' : 'relative',
        ...(sticky ? { right: stickyRight ?? 0, zIndex: 2 } : {}),
        ...style,
      }}>
        <div className="inline-flex items-center gap-[5px]">
          <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{label}</span>
          {tip && (
            <div className="group/tip relative cursor-help flex-shrink-0">
              <img src={infoIconSrc} alt="info" width="14" height="14" />
              <div className="absolute top-[calc(100%+6px)] z-[300] hidden group-hover/tip:block bg-[#0e1b3d] text-white rounded-[6px] px-[10px] py-[8px] shadow-lg pointer-events-none whitespace-nowrap"
                style={{ fontSize: 12, fontFamily: font, ...(ra ? { right: 0 } : { left: '50%', transform: 'translateX(-50%)' }) }}>
                {tip}
                <div className="absolute -top-[5px] w-[10px] h-[10px] bg-[#0e1b3d] rotate-45"
                  style={ra ? { right: 4 } : { left: '50%', transform: 'translateX(-50%) rotate(45deg)' }} />
              </div>
            </div>
          )}
          <button
            onClick={e => { e.stopPropagation(); setFilterOpen(isOpen ? null : key); }}
            className="flex-shrink-0 rounded-[3px] transition-colors hover:bg-[#b8d0ee]"
            style={{ padding: '1px 2px', background: isActive ? 'rgba(19,96,210,0.15)' : 'transparent' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z" fill={isActive ? '#1360d2' : '#0E1B3D'}/>
            </svg>
          </button>
        </div>
        {isOpen && (
          <div ref={filterRef} className="absolute z-[500] bg-white rounded-[12px] border border-[#e0e8f5] p-[20px]"
            style={{ top: 'calc(100% + 6px)', ...(ra ? { right: 0 } : { left: 0 }), minWidth: 260, boxShadow: '0 8px 32px rgba(14,27,61,0.16)', fontFamily: font }}
            onClick={e => e.stopPropagation()}>
            {isDate ? (
              <>
                <DateInput
                  label={isDateTime ? 'Select date & time' : 'Select date'}
                  value={value}
                  onChange={v => setFilterValues(p => ({ ...p, [key]: v }))}
                  showTime={isDateTime}
                  style={{ marginBottom: 16 }}
                />
                {(['oldest', 'newest'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-[12px] mb-[12px] cursor-pointer">
                    <div className="size-[20px] rounded-full border-[2px] flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: order === opt ? '#1360d2' : '#c0c8e0' }}>
                      {order === opt && <div className="size-[10px] rounded-full bg-[#1360d2]" />}
                    </div>
                    <input type="radio" className="sr-only" checked={order === opt}
                      onChange={() => setFilterOrders(p => ({ ...p, [key]: opt }))} />
                    <span className="text-[15px] text-[#0e1b3d]">{opt === 'oldest' ? 'Oldest First' : 'Newest First'}</span>
                  </label>
                ))}
                <div className="flex items-center gap-[10px]">
                  <button
                    onClick={() => { setFilterValues(p => { const n = { ...p }; delete n[key]; return n; }); setFilterOrders(p => { const n = { ...p }; delete n[key]; return n; }); }}
                    className="flex-1 h-[40px] rounded-[6px] border border-[#d5ddfb] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: font }}>Reset</button>
                  <button onClick={() => setFilterOpen(null)}
                    className="flex-1 h-[40px] rounded-[6px] text-[15px] text-white transition-colors"
                    style={{ background: '#1360d2', fontFamily: font }}>Apply</button>
                </div>
              </>
            ) : isStatus && statusOpts.length > 0 ? (
              <>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#697498', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10, fontFamily: font }}>Filter by Status</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                  {statusOpts.map(opt => {
                    const allStatuses: Record<string, { bg: string; color: string }> = {
                      'Unpaid':         { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
                      'Paid':           { bg: '#e6f4ec',               color: '#1b6c3a' },
                      'Initiated':      { bg: '#e8f0ff',               color: '#1360d2' },
                      'Partially Paid': { bg: 'rgba(249,115,22,0.10)', color: '#ea580c' },
                      'Success':        { bg: '#e6f4ec',               color: '#1b6c3a' },
                    };
                    const s = allStatuses[opt] ?? { bg: '#f0f4ff', color: '#0e1b3d' };
                    const isSelected = value === opt;
                    return (
                      <button key={opt} type="button"
                        onClick={() => setFilterValues(p => ({ ...p, [key]: isSelected ? '' : opt }))}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', textAlign: 'left',
                          background: isSelected ? s.bg : 'transparent',
                          outline: isSelected ? `2px solid ${s.color}` : '2px solid transparent',
                          transition: 'all 0.12s', fontFamily: font,
                        }}
                        onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = '#f5f7ff'; }}
                        onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                        {/* Selection dot */}
                        <div style={{
                          width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${isSelected ? s.color : '#c0c8e0'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {isSelected && <div style={{ width: 9, height: 9, borderRadius: '50%', background: s.color }} />}
                        </div>
                        {/* Status badge pill */}
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 13, fontWeight: 600,
                          background: s.bg, color: s.color,
                        }}>
                          {opt}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-[10px]">
                  <button
                    onClick={() => { setFilterValues(p => { const n = { ...p }; delete n[key]; return n; }); }}
                    className="flex-1 h-[40px] rounded-[6px] border border-[#d5ddfb] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: font }}>Reset</button>
                  <button onClick={() => setFilterOpen(null)}
                    className="flex-1 h-[40px] rounded-[6px] text-[15px] text-white transition-colors"
                    style={{ background: '#1360d2', fontFamily: font }}>Apply</button>
                </div>
              </>
            ) : (
              <>
                <div className="relative mb-[16px]">
                  <input type="text" value={value} onChange={e => setFilterValues(p => ({ ...p, [key]: e.target.value }))}
                    placeholder={`Search ${label}…`}
                    className="w-full h-[48px] border border-[#d5ddfb] rounded-[6px] pl-[12px] pr-[38px] text-[15px] text-[#0e1b3d] placeholder-[#8f94ae] focus:outline-none focus:border-[#1360d2]"
                    style={{ fontFamily: font }} autoFocus />
                  <svg className="absolute right-[12px] top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
                </div>
                {(['oldest', 'newest'] as const).map(opt => (
                  <label key={opt} className="flex items-center gap-[12px] mb-[12px] cursor-pointer">
                    <div className="size-[20px] rounded-full border-[2px] flex items-center justify-center flex-shrink-0"
                      style={{ borderColor: order === opt ? '#1360d2' : '#c0c8e0' }}>
                      {order === opt && <div className="size-[10px] rounded-full bg-[#1360d2]" />}
                    </div>
                    <input type="radio" className="sr-only" checked={order === opt}
                      onChange={() => setFilterOrders(p => ({ ...p, [key]: opt }))} />
                    <span className="text-[15px] text-[#0e1b3d]">{opt === 'oldest' ? 'Oldest First' : 'Newest First'}</span>
                  </label>
                ))}
                <div className="flex items-center gap-[10px]">
                  <button
                    onClick={() => { setFilterValues(p => { const n = { ...p }; delete n[key]; return n; }); setFilterOrders(p => { const n = { ...p }; delete n[key]; return n; }); }}
                    className="flex-1 h-[40px] rounded-[6px] border border-[#d5ddfb] text-[15px] text-[#1360d2] bg-white hover:bg-[#f0f4ff] transition-colors"
                    style={{ fontFamily: font }}>Reset</button>
                  <button onClick={() => setFilterOpen(null)}
                    className="flex-1 h-[40px] rounded-[6px] text-[15px] text-white transition-colors"
                    style={{ background: '#1360d2', fontFamily: font }}>Apply</button>
                </div>
              </>
            )}
          </div>
        )}
      </th>
    );
  };

  const selectedList = Array.from(selectedRows).map(i => INVOICE_ROWS[i]).filter(Boolean);
  const totalAmt     = selectedList.reduce((s, r) => s + parseFloat(r.balance.replace(',', '')), 0);

  /* What the invoices listing is currently filtered by — one chip per field. */
  const invFilterTags = [
    fInvType  && { label: 'Invoice Type',  value: fInvType },
    fLocation && { label: 'Location',      value: fLocation },
    fInvNumber && { label: 'Invoice Number', value: fInvNumber },
    fSource   && { label: 'Source',        value: fSource },
    fFromDate && { label: 'From Date',     value: fmtDate(fFromDate) },
    fToDate   && { label: 'To Date',       value: fmtDate(fToDate) },
    fStatuses.size > 0 && { label: 'Status', value: [...fStatuses].join(', ') },
    fDueFilter && { label: 'Due',          value: fDueFilter === 'overdue' ? 'Overdue' : 'Due Soon' },
  ].filter(Boolean) as { label: string; value: string }[];

  const resetInvFilters = () => {
    setFInvType(''); setFLocation(''); setFInvNumber(''); setFSource('');
    setFFromDate(''); setFToDate(''); setFStatuses(new Set()); setFDueFilter('');
  };

  /* The picked location gives the invoice numbers their prefix. */
  const invPrefix = LOCATIONS.find(l => l.name === fLocation)?.prefix ?? '';

  /* Invoices filtering — Invoice Type/Number (toolbar), Advanced Filters fields (incl. date
     range on the invoice's generation date), multi-select Status (defaults to Unpaid on
     first load), and the due-date bucket set from the Overview tab's summary cards. */
  const filteredInv = INVOICE_ROWS.filter(row => {
    if (fInvType && row.type !== fInvType) return false;
    if (fInvNumber && !row.number.toLowerCase().includes(fInvNumber.toLowerCase())) return false;
    if (fSource && row.source !== fSource) return false;
    if (fStatuses.size > 0 && !fStatuses.has(row.status)) return false;
    if (fFromDate && parseInvDate(row.date) < parseIsoDate(fFromDate)) return false;
    if (fToDate && parseInvDate(row.date) > parseIsoDate(fToDate)) return false;
    if (fDueFilter === 'overdue' && parseInvDate(row.dueDate) >= DASHBOARD_TODAY_ORD) return false;
    if (fDueFilter === 'dueSoon' && parseInvDate(row.dueDate) < DASHBOARD_TODAY_ORD) return false;
    return true;
  });
  const filteredInvIdxs = filteredInv.map(row => INVOICE_ROWS.indexOf(row));

  const toggleRow = (i: number) => setSelectedRows(prev => {
    const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n;
  });
  const toggleAll = () => setSelectedRows(prev => {
    const allSelected = filteredInvIdxs.length > 0 && filteredInvIdxs.every(i => prev.has(i));
    if (allSelected) return new Set([...prev].filter(i => !filteredInvIdxs.includes(i)));
    return new Set([...prev, ...filteredInvIdxs]);
  });

  /* ── An invoice's payment details, as a page ─────────────────────────────── */
  if (invPayPage) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
        <div className="flex-1 overflow-hidden">
          <InvoicePaymentDetailsPage
            invoiceNo={invPayPage.invoiceNo}
            rows={invPayPage.rows}
            onHome={handleHome}
            onBack={() => setInvPayPage(null)}
          />
        </div>
      </div>
    );
  }

  /* ── Payment History ─────────────────────────────────────────────────────── */
  if (historyFor !== null) {
    const tx = PAYMENT_ROWS.find(r => r.txNo === historyFor);
    /* A transaction's history is the trail it left: initiated first, then whatever
       came of it — a failed attempt before the one that went through. */
    const historyRows: PaymentHistoryRow[] = tx ? (() => {
      /* The attempts run in order, so each one is stamped a minute after the last and
         the final one carries the transaction's own date. */
      const statuses = tx.status === 'Success' ? ['Initiated', 'Failed', 'Success']
        : tx.status === 'Failed' ? ['Initiated', 'Failed']
        : ['Initiated'];
      /* A settlement is several bills paid at once, so it names the bills it paid
         rather than repeating "Multiple Bill Settlement". */
      const type = tx.type === 'Multiple Bill Settlement'
        ? tx.details.map(d => d.type)
        : tx.type;
      return statuses.map((status, i) => ({
        txDate: shiftMinutes(tx.txDate, i - (statuses.length - 1)),
        txType: type,
        amount: tx.amount,
        status,
      }));
    })() : [];
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
        <div className="flex-1 overflow-hidden">
          <PaymentHistoryPage
            subject={historyFor || undefined}
            rows={historyRows}
            onHome={handleHome}
            onBack={() => setHistoryFor(null)}
          />
        </div>
      </div>
    );
  }

  /* ── Pay screen ──────────────────────────────────────────────────────────── */
  if (step === 'pay') {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra={selectedList.length === 1 ? `Pay - ${selectedList[0].number}` : 'Pay - Multiple Invoices'} />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>
              {selectedList.length === 1 ? `Pay - ${selectedList[0].number}` : 'Pay - Multiple Invoices'}
            </h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10" style={{ paddingBottom: 80 }}>

            {/* Selected invoices card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]" style={{ background: '#f5f8ff' }}>
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Details</span>
                <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>
                  {selectedList.length} invoice{selectedList.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Payment Type</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Invoice No.</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'right', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Invoice Amount</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'right', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Settled Amount</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Amount</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'center', fontWeight: 500, width: 80 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedList.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{row.type}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{row.number}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.amount}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.settled}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div className="relative inline-block w-[120px]">
                          <span className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                            <DirhamIcon size={14} color="#697498" />
                          </span>
                          <input
                            defaultValue={row.balance}
                            className="w-full text-right pl-[30px] pr-3 py-2 border border-[#d5ddfb] rounded-[4px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                            style={{ fontFamily: font }}
                          />
                        </div>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          type="button"
                          title="Remove invoice"
                          onClick={() => toggleRow(INVOICE_ROWS.indexOf(row))}
                          className="size-[32px] inline-flex items-center justify-center rounded-[4px] border border-[#d5ddfb] text-[#dc3545] hover:bg-[#fdecea] transition-colors"
                        >
                          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t border-[#e0e8f5]" style={{ background: '#f5f8ff', fontFamily: font }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '16px 16px', width: '33%' }}>
                        <span className="text-[16px] font-semibold text-[#0e1b3d]">Total Selected Transactions: {selectedList.length}</span>
                      </td>
                      <td style={{ padding: '16px 12px' }} />
                      <td style={{ padding: '16px 12px' }} />
                      <td style={{ padding: '16px 12px' }} />
                      <td style={{ padding: '16px 16px', textAlign: 'right' }}>
                        <span className="text-[16px] font-bold text-[#0e1b3d] flex items-center justify-end gap-[4px]">Total <DirhamIcon size={14} color="#0e1b3d" /> {totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Method card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] p-6 mb-4"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <p className="text-[16px] font-semibold text-[#0e1b3d] mb-1" style={{ fontFamily: font }}>Payment Method</p>
              <p className="text-[16px] text-[#697498] mb-5" style={{ fontFamily: font }}>
                Note* Card payment has maximum limit of AED 1,000,000.00
              </p>
              <div className="flex items-center gap-8 flex-wrap">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="pm" checked={paymentMethod === 'epayment'} onChange={() => setPaymentMethod('epayment')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>E-Payment</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="pm" checked={paymentMethod === 'debit'} onChange={() => setPaymentMethod('debit')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Debit A/C</span>
                </label>
                {paymentMethod === 'debit' && (
                  <select
                    className="border border-[#d5ddfb] rounded-[4px] px-4 py-2 text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                    style={{ fontFamily: font, minWidth: 360 }}
                  >
                    <option>1050084 - XCRN BUSINESS NEW01 (BAL. AED 14539.00)</option>
                  </select>
                )}
              </div>
            </div>
          </div>

          {/* Bottom floating bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 border-t border-[#d5ddfb] bg-white"
            style={{ height: 68, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => setStep('list')}
              data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
              Back
            </button>
            <button
              onClick={() => setShowEPayConfirm(true)}
              className="h-[44px] px-10 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
              </svg>
              Proceed to Pay
            </button>
          </div>
        </div>
        {showEPayConfirm && (
          <EPayConfirmModal
            amount={totalAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            count={selectedRows.size}
            paymentMethod={paymentMethod}
            onConfirm={() => setStep('success')}
            onClose={() => setShowEPayConfirm(false)}
          />
        )}
      </div>
    );
  }

  /* ── Success / Transaction Details screen ───────────────────────────────── */
  if (step === 'success') {
    const tx = PAYMENT_ROWS[1];
    const detailRows = selectedList.length > 0
      ? selectedList.map((r, i) => ({ type: r.type, invoiceNo: r.number, amount: r.balance, receiptNo: `Z-${12645 + i}`, remarks: `M1CS 1927055; BPS Transaction for ECM-${r.number}`, status: 'Success' }))
      : tx.details;

    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra="Payment Confirmation" />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Payment Confirmation</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10 pb-10">

            {/* Green success banner card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] flex flex-col items-center py-8 mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full mb-4"
                style={{ background: '#34a853' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[24px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
                Invoice payment has been processed successfully.
              </p>
            </div>

            {/* Payment Transaction Details card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]">
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Transaction Details</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-[16px] font-semibold"
                  style={{ background: 'rgba(40,167,69,0.12)', color: '#28a745', fontFamily: font }}>
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#28a745" strokeWidth="2">
                    <circle cx="10" cy="10" r="8" /><path d="M6 10l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Success
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                  {[
                    ['Transaction No.',          '13133'],
                    ['Transaction Date',         '10-06-2026'],
                    ['Status',                   'Success'],
                    ['DEG Transaction No.',      '590000237262582'],
                    ['DEG Transaction Date',     '10-06-2026 11:47:57'],
                    ['EPayment Transaction No.', '20021737'],
                    ['Initiated Date',           '10-06-2026 11:48:00'],
                    ['Initiated By',             'crnuser01'],
                    ['Payment Mode',             'Credit Card'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[16px] text-[#697498] mb-[4px]" style={{ fontFamily: font }}>{label}</p>
                      <p className={`text-[16px] font-semibold ${label === 'Status' ? 'text-[#28a745]' : 'text-[#0e1b3d]'}`} style={{ fontFamily: font }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-[#f0f4ff]">
                  <p className="text-[16px] text-[#697498] mb-[6px]" style={{ fontFamily: font }}>Message</p>
                  <p className="text-[16px] text-[#1360d2] mb-1" style={{ fontFamily: font }}>Payment Status Remarks: Paid</p>
                  <p className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>
                    Collection Status Remarks: Transaction has been processed successfully.
                  </p>
                </div>
              </div>
            </div>

            {/* Centred actions — the payment breakdown lives in the View Payment Details popup */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => { setStep('list'); setSelectedRows(new Set()); }}
                data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
                style={{ fontFamily: font }}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
                Back to Listing
              </button>
              <button
                onClick={() => setInvPayDetails(tx)}
                className="h-[44px] px-6 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: '#1360d2', fontFamily: font }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 13h6M7 16h4" strokeLinecap="round" />
                </svg>
                View Payment Details
              </button>
              <button
                onClick={() => setShowReceipt(true)}
                className="h-[44px] px-6 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: '#1360d2', fontFamily: font }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                View &amp; Print Receipt
              </button>
            </div>
          </div>
        </div>

        {showReceipt && (
          <ReceiptModal
            onClose={() => setShowReceipt(false)}
            rows={detailRows}
          />
        )}
        {invPayDetails && <TransactionModal row={invPayDetails} onClose={() => setInvPayDetails(null)} />}
        {invTxDetails && <TransactionModal rows={invTxDetails} onClose={() => setInvTxDetails(null)} />}
      </div>
    );
  }

  /* ── Account Pay screen ─────────────────────────────────────────────────── */
  const selectedAccsList = Array.from(selectedAccs).sort((a, b) => a - b).map(idx => ({ idx, acc: ALL_ACCOUNTS[idx] }));
  const firstSelAcc = selectedAccsList.length > 0 ? selectedAccsList[0].idx : null;
  const selAccRow = firstSelAcc !== null ? ALL_ACCOUNTS[firstSelAcc] : null;
  const totalAccPayAmount = selectedAccsList.reduce((s, { idx }) => s + parseFloat(accPayAmounts[idx] || '0'), 0);
  /* ── Accounts Pay screen ────────────────────────────────────────────────── */
  if (activeMenu === 'Accounts' && accView === 'pay' && selAccRow) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra="Pay - Accounts" />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Pay - Accounts</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10" style={{ paddingBottom: 80 }}>

            {/* Payment Details card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]" style={{ background: '#f5f8ff' }}>
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Details</span>
                <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{selectedAccsList.length} account{selectedAccsList.length !== 1 ? 's' : ''} selected</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                <thead>
                  <tr>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Payment Type</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Account Number</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'right', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Amount Due</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'right', fontWeight: 500 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Pay Amount</span>
                    </th>
                    <th style={{ background: '#a6c2e9', padding: '12px 16px', textAlign: 'center', fontWeight: 500, width: 80 }}>
                      <span className="text-[16px] font-medium text-[#051937]">Action</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedAccsList.map(({ idx, acc }) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f0f4ff' }}>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{acc.type}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle' }}>
                        <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>{acc.account}</span>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 12px', verticalAlign: 'middle', textAlign: 'right' }}>
                        {acc.type === 'Debit Account' ? (
                          <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>-</span>
                        ) : (
                          <span className="text-[16px] text-[#0e1b3d] flex items-center justify-end gap-[4px]" style={{ fontFamily: font }}>
                            <DirhamIcon size={13} color="#0e1b3d" />{acc.amountDue}
                          </span>
                        )}
                      </td>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <div className="relative inline-block w-[130px]">
                          <span className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                            <DirhamIcon size={14} color="#697498" />
                          </span>
                          <input
                            value={accPayAmounts[idx] ?? ''}
                            onChange={e => setAccPayAmounts(prev => ({ ...prev, [idx]: e.target.value }))}
                            placeholder="0.00"
                            className="w-full text-right pl-[30px] pr-3 py-2 border border-[#d5ddfb] rounded-[4px] text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2]"
                            style={{ fontFamily: font }}
                          />
                        </div>
                      </td>
                      <td style={{ background: '#fff', padding: '14px 16px', verticalAlign: 'middle', textAlign: 'center' }}>
                        <button
                          type="button"
                          title="Remove account"
                          onClick={() => {
                            setSelectedAccs(prev => { const n = new Set(prev); n.delete(idx); return n; });
                            setAccPayAmounts(prev => { const n = { ...prev }; delete n[idx]; return n; });
                          }}
                          className="size-[32px] inline-flex items-center justify-center rounded-[4px] border border-[#d5ddfb] text-[#dc3545] hover:bg-[#fdecea] transition-colors"
                        >
                          <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                            <path d="M3 5h14M8 5V3h4v2M17 5l-1 13H4L3 5" /><path d="M8 9v5M12 9v5" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-[#e0e8f5] flex items-center justify-between" style={{ background: '#f5f8ff', fontFamily: font }}>
                <span className="text-[16px] text-[#697498]">Total Selected Accounts: {selectedAccsList.length}</span>
                <span className="text-[16px] font-bold text-[#0e1b3d] flex items-center gap-[4px]">Total <DirhamIcon size={14} color="#0e1b3d" /> {totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Payment Method card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] p-6 mb-4"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <p className="text-[16px] font-semibold text-[#0e1b3d] mb-1" style={{ fontFamily: font }}>Payment Method</p>
              <p className="text-[16px] text-[#697498] mb-5" style={{ fontFamily: font }}>
                Note* Card payment has maximum limit of AED 1,000,000.00
              </p>
              <div className="flex items-center gap-8 flex-wrap">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="acc-pm" checked={accPayMethod === 'epayment'} onChange={() => setAccPayMethod('epayment')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>E-Payment</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="acc-pm" checked={accPayMethod === 'debit'} onChange={() => setAccPayMethod('debit')} className="size-5 accent-[#1360d2]" />
                  <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font }}>Debit A/C</span>
                </label>
                {accPayMethod === 'debit' && (
                  <div ref={accDebitRef} className="relative" style={{ minWidth: 380 }}>
                    <button type="button" onClick={() => setAccDebitOpen(o => !o)}
                      className="flex items-center justify-between w-full bg-white border rounded-[4px] px-[14px] cursor-pointer hover:border-[#1360d2] transition-colors"
                      style={{ height: 44, borderColor: accDebitOpen ? '#1360d2' : '#d5ddfb' }}>
                      <span className="text-[16px] font-medium whitespace-nowrap truncate" style={{ color: accDebitAcc ? '#0e1b3d' : '#697498', fontFamily: font }}>
                        {accDebitAcc
                          ? (() => { const o = DEBIT_PAY_OPTIONS.find(x => x.value === accDebitAcc); return o ? `${o.label} (BAL. AED ${o.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })})` : accDebitAcc; })()
                          : 'Select Debit Account'}
                      </span>
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1360d2" strokeWidth="2"
                        style={{ flexShrink: 0, transform: accDebitOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {accDebitOpen && (
                      <div className="absolute left-0 right-0 bg-white rounded-[8px] py-[4px] overflow-hidden z-[80]"
                        style={{ top: 48, boxShadow: '0px 2px 16px 0px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                        {DEBIT_PAY_OPTIONS.map(opt => (
                          <button key={opt.value} type="button"
                            onClick={() => { setAccDebitAcc(opt.value); setAccDebitOpen(false); }}
                            className="w-full px-[14px] py-[11px] text-left hover:bg-[#f0f4ff] transition-colors flex items-center justify-between"
                            style={{ background: accDebitAcc === opt.value ? '#e8f0ff' : undefined }}>
                            <span className="text-[15px]" style={{ fontFamily: font, color: accDebitAcc === opt.value ? '#1360d2' : '#0e1b3d', fontWeight: accDebitAcc === opt.value ? 500 : 400 }}>
                              {opt.label}
                            </span>
                            <span className="text-[13px] text-[#697498] whitespace-nowrap ml-4" style={{ fontFamily: font }}>
                              BAL. AED {opt.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom floating bar */}
          <div className="flex-shrink-0 flex items-center justify-between px-10 border-t border-[#d5ddfb] bg-white"
            style={{ height: 68, boxShadow: '0px -4px 12px rgba(0,0,0,0.08)' }}>
            <button
              onClick={() => setAccView('list')}
              data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
              style={{ fontFamily: font }}
            >
              <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
              Back
            </button>
            <button
              onClick={() => {
                if (accPayMethod === 'debit') {
                  const opt = DEBIT_PAY_OPTIONS.find(x => x.value === accDebitAcc);
                  if (!opt || opt.balance < totalAccPayAmount) { setShowAccInsufficient(true); return; }
                }
                setShowAccEPayConfirm(true);
              }}
              className="h-[44px] px-8 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ background: '#1360d2', fontFamily: font }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
              </svg>
              Proceed to Pay
            </button>
          </div>
        </div>
        {showAccEPayConfirm && (
          <EPayConfirmModal
            amount={totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            count={selectedAccsList.length}
            paymentMethod={accPayMethod}
            onConfirm={() => setAccView('success')}
            onClose={() => setShowAccEPayConfirm(false)}
          />
        )}
        {showAccInsufficient && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.45)' }}>
            <div className="bg-white rounded-[12px] shadow-xl p-[32px] w-full max-w-[420px] flex flex-col items-center gap-[20px]">
              <div className="size-[64px] rounded-full flex items-center justify-center" style={{ background: 'rgba(220,53,69,0.10)' }}>
                <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="#dc3545" strokeWidth="1.8">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" strokeLinejoin="round" />
                  <line x1="12" y1="9" x2="12" y2="13" strokeLinecap="round" />
                  <line x1="12" y1="17" x2="12.01" y2="17" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-[20px] text-[#0e1b3d] text-center" style={{ fontFamily: font, fontWeight: 700 }}>Insufficient Balance</p>
              <p className="text-[15px] text-[#455174] text-center" style={{ fontFamily: font }}>
                The selected account <strong>{DEBIT_PAY_OPTIONS.find(x => x.value === accDebitAcc)?.label ?? accDebitAcc}</strong> does not have sufficient balance to complete this payment of <strong>AED {totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.
              </p>
              <div className="flex gap-[12px] w-full">
                <button onClick={() => setShowAccInsufficient(false)}
                  data-secondary-btn className="flex-1 h-[44px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors"
                  style={{ fontFamily: font }}>Go Back</button>
                <button onClick={() => setShowAccInsufficient(false)}
                  className="flex-1 h-[44px] rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity"
                  style={{ background: '#1360d2', fontFamily: font }}>Top Up Account</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ── Accounts Payment Confirmation screen ────────────────────────────────── */
  if (activeMenu === 'Accounts' && accView === 'success' && selAccRow) {
    return (
      <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
        <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 flex-shrink-0">
            <Breadcrumb onBack={onBack} extra="Payment Confirmation" />
            <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-5" style={{ fontFamily: font }}>Payment Confirmation</h1>
          </div>
          <div className="flex-1 overflow-y-auto px-10 pb-10">

            {/* Green success banner card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] flex flex-col items-center py-8 mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full mb-4"
                style={{ background: '#34a853' }}>
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[24px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>
                Payment has been processed successfully.
              </p>
            </div>

            {/* Payment Transaction Details card */}
            <div className="bg-white rounded-[12px] border border-[#e0e8f5] overflow-hidden mb-5"
              style={{ boxShadow: 'rgba(143, 155, 186, 0.16) 0px 5px 32px' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]">
                <span className="text-[20px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 500 }}>Payment Transaction Details</span>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-[6px] text-[16px] font-semibold"
                  style={{ background: 'rgba(40,167,69,0.12)', color: '#28a745', fontFamily: font }}>
                  <svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="#28a745" strokeWidth="2">
                    <circle cx="10" cy="10" r="8" /><path d="M6 10l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Success
                </span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-4 gap-x-8 gap-y-6">
                  {[
                    ['Transaction No.',          '13137'],
                    ['Transaction Date',         '10-06-2026'],
                    ['Status',                   'Success'],
                    ['DEG Transaction No.',      '590000237262664'],
                    ['DEG Transaction Date',     '10-06-2026 12:00:02'],
                    ['EPayment Transaction No.', '20021739'],
                    ['Initiated Date',           '10-06-2026 12:00:00'],
                    ['Initiated By',             'crnuser01'],
                    ['Payment Mode',             'Credit Card'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[16px] text-[#697498] mb-[4px]" style={{ fontFamily: font }}>{label}</p>
                      <p className={`text-[16px] font-semibold ${label === 'Status' ? 'text-[#28a745]' : 'text-[#0e1b3d]'}`} style={{ fontFamily: font }}>{value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-5 border-t border-[#f0f4ff]">
                  <p className="text-[16px] text-[#697498] mb-[6px]" style={{ fontFamily: font }}>Message</p>
                  <p className="text-[16px] text-[#1360d2] mb-1" style={{ fontFamily: font }}>Payment Status Remarks: Success</p>
                  <p className="text-[16px] text-[#dc3545]" style={{ fontFamily: font }}>
                    Collection Status Remarks: Transaction has been processed successfully.
                  </p>
                </div>
              </div>
            </div>

            {/* Centred actions — the payment breakdown lives in the View Payment Details popup */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => { setAccView('list'); setSelectedAccs(new Set()); setAccPayAmounts({}); }}
                data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
                style={{ fontFamily: font }}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5l-5 5 5 5" strokeLinecap="round" /></svg>
                Back to Listing
              </button>
              <button
                onClick={() => setShowAccTxDetails(true)}
                className="h-[44px] px-6 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: '#1360d2', fontFamily: font }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18M7 13h6M7 16h4" strokeLinecap="round" />
                </svg>
                View Payment Details
              </button>
              <button
                onClick={() => setShowAccReceipt(true)}
                className="h-[44px] px-6 rounded-[4px] text-[16px] text-white hover:opacity-90 transition-opacity flex items-center gap-2"
                style={{ background: '#1360d2', fontFamily: font }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
                View &amp; Print Receipt
              </button>
            </div>
          </div>
        </div>

        {/* Payment Transaction Details — the same popup the invoice confirmation opens */}
        {showAccTxDetails && (
          <TransactionModal
            row={{
              type: 'Account Top Up', txNo: '13137', txDate: '10-06-2026 12:00:02',
              invoiceNo: selAccRow.account, status: 'Success',
              amount: totalAccPayAmount.toFixed(2), txDateFull: '10-06-2026',
              degTx: '590000237262664', ePayTx: '20021739',
              initiatedDate: '10-06-2026 12:00:00', initiatedBy: 'crnuser01', mode: 'Credit Card',
              payMsg: 'Payment Status Remarks: Success',
              colMsg: 'Collection Status Remarks: Transaction has been processed successfully.',
              details: selectedAccsList.map(({ idx, acc }, i) => ({
                type: acc.type, invoiceNo: acc.account, amount: accPayAmounts[idx] || '0.00',
                receiptNo: `Z-${12648 + i}`,
                remarks: `M1CS 1927058; BPS Transaction for DDR-${acc.account.split(' - ')[0]}`,
                status: 'Success',
              })),
            }}
            onClose={() => setShowAccTxDetails(false)}
          />
        )}

        {/* Account Receipt Modal */}
        {showAccReceipt && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }}>
            <div className="bg-white rounded-[12px] overflow-hidden w-[1100px] max-h-[90vh] overflow-y-auto" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0e1b3d' }}>
                <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Bill Payment Settlement Receipt</span>
                <button onClick={() => setShowAccReceipt(false)} className="text-white hover:opacity-70 transition-opacity">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 flex flex-col gap-5">

                {/* Business Details — 4-column grid */}
                <div className="bg-[#f5f8ff] rounded-[8px] border border-[#e0e8f5] p-4 grid grid-cols-4 gap-4">
                  {[
                    ['Business Name', 'crnuser01'],
                    ['Business Code', 'AE-1051144'],
                    ['Date',          '10-06-2026'],
                    ['Receipt No.',   'Z-12648'],
                    ['Username',      'crnuser01'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                      <p className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>{value}</p>
                    </div>
                  ))}
                </div>

                {/* Bill Details — IC-style table */}
                <div>
                  <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Bill Details</p>
                  <div className="rounded-[8px] border border-[#e0e8f5] overflow-hidden" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
                    <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0', fontFamily: font }}>
                      <thead>
                        <tr>
                          {['Payment Type', 'Invoice / Account No.', 'Receipt No.', 'Amount', 'Status', 'Remarks'].map((h, i) => (
                            <th key={h} style={{ background: '#a6c2e9', padding: '12px 12px', textAlign: 'left', fontWeight: 500, paddingLeft: i === 0 ? 20 : 12 }}>
                              <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedAccsList.map(({ idx, acc }, i) => (
                          <tr key={idx} style={{ borderBottom: '1px solid #f0f4ff' }}>
                            <td style={{ background: '#fff', padding: '13px 12px', paddingLeft: 20, verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d]">{acc.type}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d]">{acc.account}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d]">Z-{12648 + i}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="text-[16px] text-[#0e1b3d] flex items-center gap-[3px]"><DirhamIcon size={14} color="#0e1b3d" />{accPayAmounts[idx] || '0.00'}</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle' }}>
                              <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] text-[16px] font-semibold"
                                style={{ background: 'rgba(40,167,69,0.12)', color: '#28a745' }}>Success</span>
                            </td>
                            <td style={{ background: '#fff', padding: '13px 12px', verticalAlign: 'middle', maxWidth: 260 }}>
                              <span className="text-[16px] text-[#0e1b3d]">M1CS 1927058; BPS Transaction for DDR-{acc.account.split(' - ')[0]}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Settlement Details — white card, 4 per row */}
                <div>
                  <p className="text-[20px] text-[#0e1b3d] mb-3" style={{ fontFamily: font, fontWeight: 500 }}>Settlement Details</p>
                  <div className="rounded-[12px] border border-[#e0e8f5] p-5" style={{ boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }}>
                    <div className="grid grid-cols-5 gap-x-6 gap-y-5">
                      {[
                        ['Payment Method',            accPayMethod === 'debit' ? 'Debit A/C' : 'Credit Card'],
                        ['Transaction No.',           '13137'],
                        ['Transaction Date',          '10-06-2026'],
                        ['E-Payment Transaction No.', '20021739'],
                        ['Amount',                    totalAccPayAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <p className="text-[16px] text-[#697498] mb-[3px]" style={{ fontFamily: font }}>{label}</p>
                          <p className="text-[16px] font-semibold text-[#0e1b3d] flex items-center gap-[3px]" style={{ fontFamily: font }}>
                            {label === 'Amount' && <DirhamIcon size={13} color="#0e1b3d" />}{value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-[13px] text-[#697498] text-center italic" style={{ fontFamily: font }}>
                </p>

                {/* Footer buttons */}
                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={() => window.print()}
                    className="h-[44px] px-8 rounded-[4px] text-[16px] text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
                    style={{ background: '#1360d2', fontFamily: font }}
                  >
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" strokeLinecap="round" />
                      <rect x="6" y="14" width="12" height="8" rx="1" />
                    </svg>
                    Print
                  </button>
                  <button
                    onClick={() => setShowAccReceipt(false)}
                    data-secondary-btn className="h-[44px] px-8 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors flex items-center gap-2"
                    style={{ fontFamily: font }}
                  >
                    ✕ Close
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  /* ── Invoices content ───────────────────────────────────────────────────── */
  const paginatedInv = filteredInv.slice((invPage - 1) * PAGE_SIZE, invPage * PAGE_SIZE);

  const InvoicesContent = () => {
    const { scrollRef: invScrollRef, atScrollStart: invAtScrollStart, atScrollEnd: invAtScrollEnd, handleScroll: invHandleScroll, scrollToStart: invScrollToStart, scrollToEnd: invScrollToEnd } = useTableBehaviors();
    return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Row 1 — Toolbar. The padding keeps the selects' floating labels from being clipped. */}
      <div className="flex items-center gap-[10px] mb-[10px] pt-[10px]">
        {/* Advanced Filters */}
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
            showFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
          }`}
          style={{ fontFamily: font }}
        >
          Advanced Filters
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 5h16M5 10h10M8 15h4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Invoice Type — required before an invoice number can be searched */}
        <div className="flex-shrink-0" style={{ width: 230 }}>
          <ToolbarSelect label="Invoice Type" required value={fInvType} options={INVOICE_TYPES}
            onChange={v => { setFInvType(v); if (!v) setFInvNumber(''); }} />
        </div>

        {/* Location — picks the prefix the invoice numbers carry */}
        <div className="flex-shrink-0" style={{ width: 190 }}>
          <ToolbarSelect label="Location" value={fLocation} options={LOCATIONS.map(l => l.name)}
            onChange={setFLocation} />
        </div>

        {/* Invoice Number search */}
        <div className="flex items-center h-[48px] rounded-[4px] border bg-white px-[12px] gap-[8px] flex-shrink-0"
          style={{ minWidth: 220, borderColor: '#d5ddfb', background: fInvType ? '#fff' : '#f2f4f8', opacity: fInvType ? 1 : 0.7 }}
          title={fInvType ? undefined : 'Select an invoice type first'}>
          {invPrefix && (
            <span className="text-[15px] flex-shrink-0 inline-flex items-center rounded-[4px]"
              style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 600, fontFamily: font, padding: '3px 8px' }}>
              {invPrefix} -
            </span>
          )}
          <input
            type="text"
            value={fInvNumber}
            onChange={e => setFInvNumber(e.target.value)}
            disabled={!fInvType}
            placeholder={fInvType ? 'Invoice number…' : 'Select invoice type'}
            className="flex-1 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none min-w-0"
            style={{ fontFamily: font }}
          />
          <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
        </div>

        {/* Status dropdown — checkboxes so several statuses can be selected at once */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setStatusOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#1360d2] font-medium hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}
          >
            {fStatuses.size === 0 ? 'Status' : fStatuses.size === 1 ? `Status: ${[...fStatuses][0]}` : `Status: ${fStatuses.size} selected`}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {statusOpen && (
            <div className="absolute z-20 top-[52px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[200px] py-1">
              {Object.keys(INV_STATUS).map(opt => {
                const checked = fStatuses.has(opt);
                return (
                  <label key={opt} className="flex items-center gap-[10px] px-4 py-2 text-[16px] hover:bg-[#e2ebf9] cursor-pointer"
                    style={{ fontFamily: font, color: checked ? '#1360d2' : '#0e1b3d', fontWeight: checked ? 500 : 400 }}>
                    <input type="checkbox" checked={checked}
                      onChange={() => setFStatuses(prev => { const n = new Set(prev); checked ? n.delete(opt) : n.add(opt); return n; })}
                      className="size-4 accent-[#1360d2] cursor-pointer flex-shrink-0" />
                    {opt}
                  </label>
                );
              })}
              <div className="border-t border-[#eef1f6] mt-1 pt-1 px-4 flex items-center justify-between">
                <button onClick={() => setFStatuses(new Set())} className="text-[14px] text-[#697498] hover:text-[#0e1b3d]" style={{ fontFamily: font }}>Clear</button>
                <button onClick={() => setStatusOpen(false)} className="text-[14px] text-[#1360d2] font-medium" style={{ fontFamily: font }}>Done</button>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Download selected invoices */}
        <button
          disabled={selectedRows.size === 0}
          className="h-[48px] px-[16px] rounded-[4px] text-[16px] flex items-center gap-2 flex-shrink-0 border transition-colors"
          style={{ borderColor: selectedRows.size > 0 ? '#1360d2' : '#d5ddfb', color: selectedRows.size > 0 ? '#1360d2' : '#a6c2e9', background: 'white', fontFamily: font, cursor: selectedRows.size > 0 ? 'pointer' : 'not-allowed' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 3v12M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
          </svg>
          Invoice Download
        </button>
        {/* Proceed to Pay */}
        <button
          disabled={selectedRows.size === 0}
          onClick={() => setStep('pay')}
          className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white flex items-center gap-2 flex-shrink-0"
          style={{ background: selectedRows.size > 0 ? '#1360d2' : '#a6c2e9', fontFamily: font, cursor: selectedRows.size > 0 ? 'pointer' : 'not-allowed' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
          </svg>
          Proceed to Pay{selectedRows.size > 0 ? ` (${selectedRows.size})` : ''}
        </button>
      </div>

      {/* Advanced Filters panel */}
      {showFilters && (
        <div className="bg-white rounded-[8px] p-[20px] mb-[10px]"
          style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
          {/* Titled header with its close, as the Refund & Claims panel carries */}
          <div className="flex items-center justify-between mb-[20px]">
            <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Advanced Filters</span>
            <button onClick={() => setShowFilters(false)} aria-label="Close advanced filters"
              className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors">
              <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 2l14 14M16 2L2 16" />
              </svg>
            </button>
          </div>
          {/* Four equal fields to a row, with the buttons in the cell after the last one */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
            <DateInput label="From Date" value={fFromDate} onChange={setFFromDate} />
            <DateInput label="To Date"   value={fToDate}   onChange={setFToDate}   />
            <FloatDropdown
              label="Source"
              value={fSource}
              options={['CDR', 'SGRCS', 'SAS', 'CRNS']}
              onChange={setFSource}
            />
            <FloatDropdown
              label="Invoice Type"
              value={fInvType}
              options={INVOICE_TYPES}
              onChange={setFInvType}
            />
            <StatusMultiDropdown
              label="Status"
              values={fStatuses}
              options={Object.keys(INV_STATUS)}
              onChange={setFStatuses}
            />
            <div className="flex items-center gap-3">
              <button className="h-[56px] px-6 rounded-[4px] text-[16px] text-white flex-1" style={{ background: '#1360d2', fontFamily: font }}>Search</button>
              <button onClick={resetInvFilters}
                data-secondary-btn className="h-[56px] px-6 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white flex-1" style={{ fontFamily: font }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Applied filters — kept outside the panel so they stay visible once it is closed */}
      <FilterTags tags={invFilterTags} onReset={resetInvFilters} />

      {/* Info bar — totals / selection summary */}
      <div className="flex items-center gap-[6px] mb-[8px] text-[15px]" style={{ fontFamily: font }}>
        <span className="text-[#697498]">Total Invoices: <span className="font-semibold text-[#0e1b3d]">{filteredInv.length}</span></span>
        <span className="text-[#d5ddfb]">|</span>
        <span className="text-[#697498]">Total of Balance Amount: <span className="font-semibold text-[#0e1b3d] inline-flex items-center gap-[3px]"><DirhamIcon size={13} color="#0e1b3d" />{filteredInv.reduce((s, r) => s + parseFloat(r.balance.replace(/,/g, '')), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
        <span className="text-[#d5ddfb]">|</span>
        <span className="text-[#697498]">Selected: <span className="font-semibold text-[#1360d2]">{selectedRows.size}</span></span>
        {selectedRows.size > 0 && (
          <>
            <span className="text-[#d5ddfb]">|</span>
            <span className="text-[#697498]">Total Amount Selected: <span className="font-semibold text-[#0e1b3d] inline-flex items-center gap-[3px]"><DirhamIcon size={13} color="#0e1b3d" />{[...selectedRows].reduce((s, i) => s + parseFloat(INVOICE_ROWS[i]?.balance ?? '0'), 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span></span>
          </>
        )}
        {fDueFilter && (
          <span className="inline-flex items-center gap-[6px] px-[10px] py-[3px] rounded-[14px] ml-[6px]" style={{ background: fDueFilter === 'overdue' ? 'rgba(220,53,69,0.10)' : 'rgba(19,96,210,0.10)', color: fDueFilter === 'overdue' ? '#dc3545' : '#1360d2' }}>
            {fDueFilter === 'overdue' ? 'Overdue only' : 'Current / due soon only'}
            <button onClick={() => setFDueFilter('')} className="hover:opacity-70 transition-opacity" title="Clear due-date filter">
              <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" /></svg>
            </button>
          </span>
        )}
      </div>

      {/* Table */}
      <div style={{ position: 'relative' }}>
        <ScrollArrows atStart={invAtScrollStart} atEnd={invAtScrollEnd} onLeft={invScrollToStart} onRight={invScrollToEnd} stickyWidth={240} />
        <div ref={invScrollRef} onScroll={invHandleScroll} className="overflow-x-auto">
        <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {/* Checkbox header */}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', width: 44, borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingLeft: 16 }}>
                <input type="checkbox" checked={filteredInvIdxs.length > 0 && filteredInvIdxs.every(i => selectedRows.has(i))} onChange={toggleAll}
                  className="size-4 accent-[#1360d2] cursor-pointer" />
              </th>
              {(['Invoice Type', 'Invoice Number', 'Invoice Date', 'Amount', 'Settled Amount', 'Balance Amount', 'Source'] as const).map(h =>
                renderFilterHeader('inv', h, { align: (h === 'Amount' || h === 'Settled Amount' || h === 'Balance Amount') ? 'right' : 'left' })
              )}
              {renderFilterHeader('inv', 'Status', { sticky: true, stickyRight: 80, style: { minWidth: 160 } })}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 80, borderTopRightRadius: 8, borderBottomRightRadius: 8, position: 'sticky', right: 0, zIndex: 2 }}>
                <span className="text-[16px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedInv.map((row, i) => {
              const absIdx = INVOICE_ROWS.indexOf(row);
              const isSelected = selectedRows.has(absIdx);
              const st = INV_STATUS[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
              const canViewPayments = row.status === 'Paid' || row.status === 'Partially Paid';
              /* Match by invoiceNo (multi-transaction invoices), by txNo (Multiple Bill Settlement
                 payments, whose own invoiceNo is blank), or via the settlement's line-item details. */
              const payRows = canViewPayments ? PAYMENT_ROWS.filter(r =>
                r.invoiceNo === row.number || r.txNo === row.txNo || r.details.some(d => d.invoiceNo === row.number)
              ) : [];
              return (
                <tr key={i} className={isSelected ? 'bg-[#dce8f8]' : 'bg-white hover:bg-[#dce8f8]'}>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', paddingLeft: 16, borderBottom: '1px solid #f0f4ff' }}>
                    <input type="checkbox" checked={isSelected} onChange={() => toggleRow(absIdx)} className="size-4 accent-[#1360d2] cursor-pointer" />
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', maxWidth: 280 }}>
                    <span className="text-[16px] text-[#0e1b3d]">{row.type}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.number}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.date}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.amount}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.settled}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.balance}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.source}</span>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', position: 'sticky', right: 80, zIndex: 1, background: isSelected ? '#dce8f8' : 'white' }}>
                    <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                      {row.status}
                    </span>
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center', position: 'sticky', right: 0, zIndex: openFlyout === absIdx ? 200 : 1, background: isSelected ? '#dce8f8' : 'white' }}>
                    <div className="relative inline-block" ref={openFlyout === absIdx ? flyoutRef : undefined}>
                      <button onClick={(e) => {
                          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                          const goUp = rect.bottom + 280 > window.innerHeight;
                          setFlyoutPos({ ...(goUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }), right: window.innerWidth - rect.right });
                          setOpenFlyout(openFlyout === absIdx ? null : absIdx);
                        }}
                        className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                        <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                          <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                        </svg>
                      </button>
                      {openFlyout === absIdx && (
                        <div className="fixed z-[9999] bg-white rounded-[8px] py-[4px] overflow-hidden"
                          style={{ top: flyoutPos?.top, bottom: flyoutPos?.bottom, right: flyoutPos?.right, width: 200, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                          {[
                            'View Payment Details',
                            'Download Invoice',
                            'Initiate Payment',
                            'Recheck',
                            'View & Print Receipt',
                          ].map(item => {
                            const disabled = item === 'View Payment Details' && payRows.length === 0;
                            return (
                              <button key={item} disabled={disabled}
                                className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors disabled:opacity-40 disabled:cursor-default flex items-center gap-[10px]"
                                onClick={() => {
                                  if (disabled) return;
                                  setOpenFlyout(null);
                                  if (item === 'Initiate Payment') { setSelectedRows(new Set([absIdx])); setStep('pay'); }
                                  else if (item === 'View Payment Details' && payRows.length > 0) { setInvPayPage({ invoiceNo: row.number, rows: payRows }); }
                                  else if (item === 'View & Print Receipt') {
                                    const rows = payRows[0]?.details ?? [{ type: row.type, invoiceNo: row.number, amount: row.balance, receiptNo: '—', remarks: '', status: row.status }];
                                    setInvReceiptRows(rows);
                                    setShowInvReceipt(true);
                                  }
                                }}>
                                <RowActionItem label={item} />
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white z-10 border-t border-[#f0f4ff] pt-[6px]">
        <Pagination
          page={invPage}
          totalPages={Math.max(1, Math.ceil(filteredInv.length / PAGE_SIZE))}
          pageSize={PAGE_SIZE}
          totalItems={filteredInv.length}
          onPageChange={setInvPage}
          onPageSizeChange={() => {}}
        />
      </div>
      {invTxDetails && <TransactionModal rows={invTxDetails} onClose={() => setInvTxDetails(null)} showTabs />}
      {showInvReceipt && <ReceiptModal onClose={() => setShowInvReceipt(false)} rows={invReceiptRows} />}
    </div>
    );
  };

  /* What the payments listing is currently filtered by. The date filter type always
     holds a value, so it is only worth a chip once a range is actually set. */
  const payFilterTags = [
    (payFromDate || payToDate) && { label: 'Date Filter Type', value: payDateFilterType },
    payFromDate && { label: 'From Date', value: fmtDate(payFromDate) },
    payToDate   && { label: 'To Date',   value: fmtDate(payToDate) },
    paySearchValue && { label: paySearchType, value: paySearchValue },
    payStatusFilter && { label: 'Status', value: payStatusFilter },
  ].filter(Boolean) as { label: string; value: string }[];

  const resetPayFilters = () => {
    setPayFromDate(''); setPayToDate(''); setPayDateFilterType('Transaction Date');
    setPayStatusFilter(''); setPaySearchValue('');
  };   /* The as-on badge keeps its own range — it is not part of these filters. */

  /* ── Payments content ───────────────────────────────────────────────────── */
  const filteredPayments = payStatusFilter ? PAYMENT_ROWS.filter(r => r.status === payStatusFilter) : PAYMENT_ROWS;
  const paginatedPay = filteredPayments.slice((payPage - 1) * PAGE_SIZE, payPage * PAGE_SIZE);

  const PaymentsContent = () => {
    const { scrollRef: payScrollRef, atScrollStart: payAtScrollStart, atScrollEnd: payAtScrollEnd, handleScroll: payHandleScroll, scrollToStart: payScrollToStart, scrollToEnd: payScrollToEnd } = useTableBehaviors();
    return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Row 1 — Toolbar */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        {/* Advanced Filters */}
        <button
          onClick={() => setPayAdvFilters(f => !f)}
          className={`h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border text-[16px] transition-colors flex-shrink-0 ${
            payAdvFilters ? 'bg-[#e2ebf9] border-[#1360d2] text-[#1360d2]' : 'bg-white border-[#d5ddfb] text-[#0e1b3d] hover:bg-[#f0f4ff]'
          }`}
          style={{ fontFamily: font }}
        >
          Advanced Filters
          <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M2 5h16M5 10h10M8 15h4" strokeLinecap="round" />
          </svg>
        </button>

        {/* Quick search */}
        {/* No overflow clipping — the type menu hangs below the box */}
        <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white relative" style={{ minWidth: 260 }}>
          <button
            type="button"
            onClick={() => setPaySearchTypeOpen(o => !o)}
            className="flex items-center gap-[5px] border-r border-[#d5ddfb] px-[12px] h-full cursor-pointer hover:bg-[#f7faff] transition-colors flex-shrink-0"
          >
            <span className="text-[16px] text-[#1360d2] font-medium whitespace-nowrap" style={{ fontFamily: font }}>{paySearchType}</span>
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none"><path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          {paySearchTypeOpen && (
            <div className="absolute z-[200] top-[50px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[180px] py-1">
              {['Transaction No.', 'Receipt Number', 'Transaction Type'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setPaySearchType(opt); setPaySearchValue(''); setPaySearchTypeOpen(false); }}>{opt}</button>
              ))}
            </div>
          )}
          {paySearchType === 'Transaction Type' ? (
            <div className="flex items-center px-[12px] gap-[8px] flex-1">
              <select
                value={paySearchValue}
                onChange={e => setPaySearchValue(e.target.value)}
                className="flex-1 text-[16px] text-[#0e1b3d] bg-transparent focus:outline-none min-w-0 border-none appearance-none cursor-pointer"
                style={{ fontFamily: font }}
              >
                <option value="">All types…</option>
                <option>Case Management Demand Notice</option>
                <option>Multiple Bill Settlement</option>
              </select>
            </div>
          ) : (
            <div className="flex items-center px-[12px] gap-[8px] flex-1">
              <input
                type="text"
                value={paySearchValue}
                onChange={e => setPaySearchValue(e.target.value)}
                placeholder={paySearchType === 'Receipt Number' ? 'Receipt number…' : 'Transaction no…'}
                className="flex-1 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none min-w-0"
                style={{ fontFamily: font }}
              />
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
            </div>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative flex-shrink-0">
          <button onClick={() => setPayStatusOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#1360d2] font-medium hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font }}>
            {payStatusFilter || 'Status'}
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {payStatusOpen && (
            <div className="absolute z-20 top-[52px] left-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[160px] py-1">
              {['All', 'Success', 'Initiated', 'Failed'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => { setPayStatusFilter(opt === 'All' ? '' : opt); setPayStatusOpen(false); }}>{opt}</button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1" />

        {/* Export payments (Excel / PDF) */}
        <div className="relative flex-shrink-0" ref={payExportRef}>
          <button
            onClick={() => setPayExportOpen(o => !o)}
            data-secondary-btn className="h-[48px] px-[16px] flex items-center gap-2 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white transition-colors"
            style={{ fontFamily: font }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3v12M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
            </svg>
            Export
            <svg viewBox="0 0 20 20" width="14" height="14" fill="none">
              <path d="M5 8l5 5 5-5" stroke="#1360d2" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
          {payExportOpen && (
            <div className="absolute z-[200] top-[52px] right-0 bg-white shadow-lg rounded border border-[#e0e8f5] w-[140px] py-1">
              {['Excel', 'PDF'].map(opt => (
                <button key={opt} className="w-full px-4 py-2 text-left text-[16px] text-[#0e1b3d] hover:bg-[#e2ebf9]" style={{ fontFamily: font }}
                  onClick={() => setPayExportOpen(false)}>{opt}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Advanced Filters panel */}
      {payAdvFilters && (
        <div className="bg-white rounded-[8px] p-[20px] mb-[10px]"
          style={{ boxShadow: '4px 4px 30px 0px rgba(0,0,0,0.12)' }}>
          {/* Titled header with its close, as the Refund & Claims panel carries */}
          <div className="flex items-center justify-between mb-[20px]">
            <span className="text-[16px] font-semibold text-[#0e1b3d]" style={{ fontFamily: font }}>Advanced Filters</span>
            <button onClick={() => setPayAdvFilters(false)} aria-label="Close advanced filters"
              className="size-[28px] flex items-center justify-center rounded hover:bg-[#f0f4ff] transition-colors">
              <svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="#697498" strokeWidth="1.8" strokeLinecap="round">
                <path d="M2 2l14 14M16 2L2 16" />
              </svg>
            </button>
          </div>
          {/* Four equal fields to a row, with the buttons in the cell after the last one.
              The date filter type leads — it says which dates the range means. */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
            <FloatDropdown
              label="Date Filter Type"
              value={payDateFilterType}
              options={['Transaction Date', 'Receipt Date']}
              allowAll={false}
              onChange={v => setPayDateFilterType(v || 'Transaction Date')}
            />
            <DateInput label="From Date" value={payFromDate} onChange={setPayFromDate} />
            <DateInput label="To Date" value={payToDate} onChange={setPayToDate} />
            <FloatDropdown
              label="Transaction Type"
              value={paySearchType === 'Transaction Type' ? paySearchValue : ''}
              options={['Case Management Demand Notice', 'Multiple Bill Settlement']}
              onChange={v => { setPaySearchType('Transaction Type'); setPaySearchValue(v); }}
            />
            <FloatInput
              label="Invoice / Account No."
              value={paySearchType === 'Transaction No.' ? paySearchValue : ''}
              onChange={v => { setPaySearchType('Transaction No.'); setPaySearchValue(v); }}
            />
            <FloatDropdown
              label="Status"
              value={payStatusFilter}
              options={['Success', 'Initiated', 'Failed']}
              onChange={setPayStatusFilter}
            />
            <div className="flex items-center gap-3">
              <button className="h-[56px] px-6 rounded-[4px] text-[16px] text-white flex-1" style={{ background: '#1360d2', fontFamily: font }}>Search</button>
              <button onClick={resetPayFilters}
                data-secondary-btn className="h-[56px] px-6 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white flex-1" style={{ fontFamily: font }}>Reset</button>
            </div>
          </div>
        </div>
      )}

      {/* Applied filters — kept outside the panel so they stay visible once it is closed */}
      <FilterTags tags={payFilterTags} onReset={resetPayFilters} />

      {/* Row 2 — Transaction Date As On badge */}
      <div className="flex justify-center mb-[10px]">
        <StatusAsOnBadge label="Transaction Date" fromValue={payAsOnFrom} toValue={payAsOnTo}
          onApply={(from, to) => { setPayAsOnFrom(from); setPayAsOnTo(to); }} />
      </div>

      {/* Info banner */}
      <div className="flex items-center gap-[8px] px-[14px] py-[10px] rounded-[8px] border border-[#b3caff] mb-[10px]" style={{ background: 'linear-gradient(135deg,#eef4ff,#f5f8ff)', fontFamily: font }}>
        <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="#1360d2" strokeWidth="1.6" className="flex-shrink-0">
          <circle cx="10" cy="10" r="8"/><path d="M10 9v5M10 7v.5" strokeLinecap="round"/>
        </svg>
        <span className="text-[14px] text-[#1360d2] font-medium">Only online payments are listed in the table.</span>
      </div>

      {/* Payments table */}
      <div style={{ position: 'relative' }}>
        <ScrollArrows atStart={payAtScrollStart} atEnd={payAtScrollEnd} onLeft={payScrollToStart} onRight={payScrollToEnd} stickyWidth={240} />
        <div ref={payScrollRef} onScroll={payHandleScroll} className="overflow-x-auto">
        <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {renderFilterHeader('pay', 'Transaction Type', { style: { borderTopLeftRadius: 8, borderBottomLeftRadius: 8, paddingLeft: 16 } })}
              {renderFilterHeader('pay', 'Transaction No.')}
              {renderFilterHeader('pay', 'Receipt No.')}
              {renderFilterHeader('pay', 'Transaction Date')}
              {renderFilterHeader('pay', 'Invoice / Account No.')}
              {renderFilterHeader('pay', 'Amount', { align: 'right' })}
              {renderFilterHeader('pay', 'Status', { sticky: true, stickyRight: 100, style: { minWidth: 140 } })}
              <th style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 100, borderTopRightRadius: 8, borderBottomRightRadius: 8, position: 'sticky', right: 0, zIndex: 2 }}>
                <span className="text-[16px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedPay.map((row, i) => {
              const absIdx = (payPage - 1) * PAGE_SIZE + i;
              const st = PAY_STATUS[row.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
              const isMultiple = row.type === 'Multiple Bill Settlement';
              const isExpanded = expandedPayRow === absIdx;
              return (
                <React.Fragment key={i}>
                  {/* Parent row — click anywhere except actions to expand */}
                  <tr
                    className={isExpanded ? 'bg-[#dce8f8]' : 'bg-white hover:bg-[#dce8f8]'}
                    style={{ cursor: isMultiple ? 'pointer' : 'default', outline: openFlyout === absIdx + 100 ? '2px solid #93c5fd' : 'none', outlineOffset: '-2px' }}
                    onClick={isMultiple ? () => setExpandedPayRow(isExpanded ? null : absIdx) : undefined}
                  >
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', paddingLeft: 16, borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.type}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.txNo}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{isMultiple ? '—' : (row.details[0]?.receiptNo || '—')}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{stripSeconds(row.txDate)}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{row.invoiceNo || '—'}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff', textAlign: 'right' }}>
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{row.amount}</span>
                    </td>
                    <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff', position: 'sticky', right: 100, zIndex: 1, background: isExpanded ? '#dce8f8' : 'white' }}>
                      <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: st.bg, color: st.color }}>
                        {row.status}
                      </span>
                    </td>
                    {/* Actions: expand chevron (Multiple only) + three-dot menu */}
                    <td style={{ padding: '0 8px', height: 54, verticalAlign: 'middle', borderBottom: isExpanded ? 'none' : '1px solid #f0f4ff', textAlign: 'center', position: 'sticky', right: 0, zIndex: openFlyout === absIdx + 100 ? 200 : 1, background: isExpanded ? '#dce8f8' : 'white' }} onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-[2px]">
                        {/* Three-dot menu */}
                        <div className="relative inline-block" ref={openFlyout === absIdx + 100 ? flyoutRef : undefined}>
                          <button onClick={(e) => {
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              const goUp = rect.bottom + 240 > window.innerHeight;
                              setFlyoutPos({ ...(goUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }), right: window.innerWidth - rect.right });
                              setOpenFlyout(openFlyout === absIdx + 100 ? null : absIdx + 100);
                            }}
                            className="size-[32px] rounded-full flex items-center justify-center hover:bg-[#e2ebf9] transition-colors">
                            <svg viewBox="0 0 20 20" width="18" height="18" fill="#697498">
                              <circle cx="10" cy="4" r="1.7" /><circle cx="10" cy="10" r="1.7" /><circle cx="10" cy="16" r="1.7" />
                            </svg>
                          </button>
                          {openFlyout === absIdx + 100 && (
                            <div className="fixed z-[9999] bg-white rounded-[8px] py-[4px] overflow-hidden"
                              style={{ top: flyoutPos?.top, bottom: flyoutPos?.bottom, right: flyoutPos?.right, width: 210, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
                              {['View Payment Details', 'View & Print Receipt', 'Recheck', 'Payment History'].map(item => (
                                <button key={item} className="group w-full px-[14px] py-[10px] text-left hover:bg-[#1360d2] transition-colors flex items-center gap-[10px]"
                                  onClick={() => {
                                    setOpenFlyout(null);
                                    if (item === 'View Payment Details') { setInvPayDetails(row); }
                                    else if (item === 'View & Print Receipt') { setPayFlyoutReceiptRows(row.details); setShowPayFlyoutReceipt(true); }
                                    else if (item === 'Recheck') { setRecheckIdx(absIdx); setRecheckOpen(true); }
                                    else if (item === 'Payment History') { setHistoryFor(row.txNo); }
                                  }}>
                                  <RowActionItem label={item} />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {/* Expand/collapse chevron — only for Multiple Bill Settlement, placed after three-dot */}
                        {isMultiple && (
                          <button
                            onClick={() => setExpandedPayRow(isExpanded ? null : absIdx)}
                            className="flex items-center justify-center transition-colors"
                            style={{ background: 'none', border: 'none', padding: 0 }}
                          >
                            {/* Figma u_angle-right icon — rotates 180° when expanded */}
                            <svg width="28" height="28" viewBox="0 0 49 49" fill="none"
                              style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s', filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.10))' }}>
                              <rect width="24" height="24" rx="12" transform="matrix(-4.37114e-08 1 1 4.37114e-08 12.18 12.19)" fill="white"/>
                              <path d="M23.47 27.02L19.23 22.78a1.87 1.87 0 010-2.85c.38-.38.89-.59 1.41-.59s1.03.21 1.41.59l3.54 3.54 3.54-3.54c.38-.38.89-.59 1.41-.59s1.03.21 1.41.59c.19.19.33.41.43.65.1.24.15.49.15.74s-.05.5-.15.73c-.1.24-.24.46-.43.65l-4.24 4.24a1.87 1.87 0 01-2.83 0z" fill="#8F94AE"/>
                            </svg>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Inner rows — rendered as sibling <tr>s in the same tbody, aligned to parent columns */}
                  {isMultiple && isExpanded && row.details.map((d, di) => {
                    const dst = PAY_STATUS[d.status] ?? { bg: 'rgba(105,116,152,0.10)', color: '#697498' };
                    const isLastDetail = di === row.details.length - 1;
                    return (
                      <tr key={`detail-${di}`} style={{ background: '#dce8f8' }}>
                        {/* Col 1: Serial no. + Invoice Type (indented) */}
                        <td style={{ padding: '0 12px 0 32px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <div className="flex items-center gap-[10px]">
                            <span className="inline-flex items-center justify-center size-[22px] rounded-full text-[12px] font-bold flex-shrink-0" style={{ background: '#1360d2', color: '#fff', fontFamily: font }}>{di + 1}</span>
                            <span className="text-[16px] text-[#0e1b3d]">{d.type}</span>
                          </div>
                        </td>
                        {/* Col 2: Transaction No. — blank (no tx column in inner rows) */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#697498]">—</span>
                        </td>
                        {/* Col 2b: Receipt No. — one per line item, since a Multiple Bill Settlement
                            spans several receipts that the parent row can't summarize as one value. */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{d.receiptNo || '—'}</span>
                        </td>
                        {/* Col 3: Transaction Date */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{stripSeconds(row.txDate)}</span>
                        </td>
                        {/* Col 4: Invoice No. */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap">{d.invoiceNo}</span>
                        </td>
                        {/* Col 5: Amount */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap"><DirhamIcon size={14} color="#0e1b3d" />&nbsp;{d.amount}</span>
                        </td>
                        {/* Col 6: Status */}
                        <td style={{ padding: '0 12px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }}>
                          <span className="inline-flex items-center px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium whitespace-nowrap" style={{ background: dst.bg, color: dst.color }}>{d.status}</span>
                        </td>
                        {/* Col 7: Actions — a line of a settlement carries no actions of its own */}
                        <td style={{ padding: '0 8px', height: 50, verticalAlign: 'middle', borderBottom: isLastDetail ? '1px solid #f0f4ff' : '1px solid #dce8f8' }} />
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white z-10 border-t border-[#f0f4ff] pt-[6px]">
        <Pagination
          page={payPage}
          totalPages={Math.max(1, Math.ceil(filteredPayments.length / PAGE_SIZE))}
          pageSize={PAGE_SIZE}
          totalItems={filteredPayments.length}
          onPageChange={setPayPage}
          onPageSizeChange={() => {}}
        />
      </div>
      {showPayFlyoutReceipt && <ReceiptModal onClose={() => setShowPayFlyoutReceipt(false)} rows={payFlyoutReceiptRows} />}
      {invPayDetails && <TransactionModal row={invPayDetails} onClose={() => setInvPayDetails(null)} showTabs />}
    </div>
    );
  };

  /* ── Accounts content ───────────────────────────────────────────────────── */
  const filteredAccounts = accTypeFilter === 'All' ? ALL_ACCOUNTS : ALL_ACCOUNTS.filter(a => a.type === accTypeFilter);
  const totalAccPages    = Math.ceil(filteredAccounts.length / ACC_PAGE_SIZE);
  const paginatedAcc     = filteredAccounts.slice((accPage - 1) * ACC_PAGE_SIZE, accPage * ACC_PAGE_SIZE);

  const AccountsContent = () => {
    const { scrollRef: accScrollRef, atScrollStart: accAtScrollStart, atScrollEnd: accAtScrollEnd, handleScroll: accHandleScroll, scrollToStart: accScrollToStart, scrollToEnd: accScrollToEnd } = useTableBehaviors();
    return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Row 1 — Toolbar */}
      <div className="flex items-center gap-[10px] mb-[10px]">
        {/* Account Type dropdown */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setAccTypeOpen(o => !o)}
            className="h-[48px] px-[14px] flex items-center gap-[8px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
            style={{ fontFamily: font, minWidth: 170 }}
          >
            <span className="flex-1 text-left">{accTypeFilter === 'All' ? 'Account Type' : accTypeFilter}</span>
            <svg viewBox="0 0 20 20" width="13" height="13" fill="none"><path d="M5 8l5 5 5-5" stroke="#0e1b3d" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </button>
          {accTypeOpen && (
            <div className="absolute z-[110] left-0 bg-white rounded-[8px] py-[4px] mt-1 overflow-hidden"
              style={{ top: '100%', minWidth: 170, boxShadow: '0px 2px 16px rgba(0,0,0,0.12)', border: '1px solid #f0f0f5' }}>
              {['All', 'Credit Account', 'Debit Account'].map(opt => (
                <button key={opt}
                  className={`w-full px-[14px] py-[10px] text-left text-[15px] hover:bg-[#e2ebf9] transition-colors ${accTypeFilter === opt ? 'text-[#1360d2] font-medium' : 'text-[#111838]'}`}
                  style={{ fontFamily: font }}
                  onClick={() => { setAccTypeFilter(opt); setAccTypeOpen(false); }}>
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Simple search — account number only */}
        <div className="flex h-[48px] rounded-[4px] border border-[#d5ddfb] bg-white overflow-hidden" style={{ minWidth: 280 }}>
          <div className="flex items-center px-[12px] gap-[8px] flex-1">
            <input
              type="text"
              value={accSearchValue}
              onChange={e => setAccSearchValue(e.target.value)}
              placeholder="Search by account number…"
              className="flex-1 text-[16px] text-[#0e1b3d] placeholder-[#8f94ae] bg-transparent focus:outline-none min-w-0"
              style={{ fontFamily: font }}
            />
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
          </div>
        </div>

        <div className="flex-1" />

        {/* Account Statement */}
        <button
          onClick={() => setShowStmtModal(true)}
          className="h-[48px] px-[16px] flex items-center gap-[6px] rounded-[4px] border border-[#d5ddfb] bg-white text-[16px] text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors flex-shrink-0"
          style={{ fontFamily: font }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
          </svg>
          Account Statement
        </button>

        {/* Proceed to Pay */}
        <button
          disabled={selectedAccs.size === 0}
          onClick={() => {
            const initial: Record<number, string> = {};
            selectedAccs.forEach(idx => {
              const acc = ALL_ACCOUNTS[idx];
              if (acc && acc.type !== 'Debit Account') initial[idx] = acc.amountDue;
            });
            setAccPayAmounts(initial);
            setAccView('pay');
          }}
          className="h-[48px] px-[20px] rounded-[4px] text-[16px] text-white flex items-center gap-2 flex-shrink-0"
          style={{ background: selectedAccs.size > 0 ? '#1360d2' : '#a6c2e9', fontFamily: font, cursor: selectedAccs.size > 0 ? 'pointer' : 'not-allowed' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" />
          </svg>
          Proceed to Pay
        </button>
      </div>

      {/* Accounts table */}
      <div style={{ position: 'relative' }}>
        <ScrollArrows atStart={accAtScrollStart} atEnd={accAtScrollEnd} onLeft={accScrollToStart} onRight={accScrollToEnd} stickyWidth={120} />
        <div ref={accScrollRef} onScroll={accHandleScroll} className="overflow-x-auto">
        <table style={{ width: '100%', minWidth: 1100, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
          <thead>
            <tr>
              {/* Checkbox */}
              <th style={{ background: '#a6c2e9', padding: '10px 16px', width: 44, borderTopLeftRadius: 8, borderBottomLeftRadius: 8 }}>
                <span />
              </th>
              {renderFilterHeader('acc', 'Account Type')}
              {renderFilterHeader('acc', 'Account Number')}
              {([
                { label: 'Total Limit',         tip: 'Total Guarantee / Limit available for the account' },
                { label: 'Amount Due to Pay',   tip: 'Outstanding balance from last statement' },
                { label: 'Current Month Usage', tip: undefined },
                { label: 'Available Balance',   tip: 'Limits available for new transactions' },
              ]).map(({ label, tip }) => (
                <th key={label} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'right', fontWeight: 500 }}>
                  <div className="inline-flex items-center gap-[5px]">
                    <span className="text-[16px] font-medium text-[#051937] whitespace-nowrap">{label}</span>
                    {tip && (
                      <div className="group/tip relative cursor-help flex-shrink-0">
                        <img src={infoIconSrc} alt="info" width="14" height="14" />
                        <div className="absolute top-[calc(100%+6px)] z-[300] hidden group-hover/tip:block bg-[#0e1b3d] text-white rounded-[6px] px-[10px] py-[8px] shadow-lg pointer-events-none whitespace-nowrap"
                          style={{ fontSize: 12, fontFamily: font, right: 0 }}>
                          {tip}
                          <div className="absolute -top-[5px] w-[10px] h-[10px] bg-[#0e1b3d] rotate-45" style={{ right: 4 }} />
                        </div>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th style={{
                background: '#a6c2e9', padding: '10px 12px', textAlign: 'center', width: 120, minWidth: 120,
                borderTopRightRadius: 8, borderBottomRightRadius: 8,
                position: 'sticky', right: 0, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 2,
              }}>
                <span className="text-[16px] font-medium text-[#051937]">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAcc.map((acc, i) => {
              const absIdx = (accPage - 1) * ACC_PAGE_SIZE + i;
              const isSelected = selectedAccs.has(absIdx);
              const isDebit = acc.type === 'Debit Account';
              return (
                <tr key={i} onClick={() => setSelectedAccs(prev => { const n = new Set(prev); n.has(absIdx) ? n.delete(absIdx) : n.add(absIdx); return n; })}
                  className={isSelected ? 'bg-[#dce8f8] cursor-pointer' : 'bg-white hover:bg-[#dce8f8] cursor-pointer'}>
                  <td style={{ padding: '0 16px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <input type="checkbox" readOnly checked={isSelected} className="size-4 accent-[#1360d2]" />
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <div className="flex items-center gap-[8px]">
                      <span className="text-[16px] text-[#0e1b3d]">{acc.type === 'Credit Account' ? 'Credit Account – CDR' : acc.type}</span>
                      {isDebit && (
                        <span className="inline-flex items-center gap-[3px] px-[7px] py-[2px] rounded-[4px] text-[13px] font-semibold"
                          style={{ background: 'rgba(19,96,210,0.10)', color: '#1360d2' }}>
                          <svg viewBox="0 0 20 20" width="12" height="12" fill="none" stroke="#1360d2" strokeWidth="2">
                            <rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16" strokeLinecap="round"/><circle cx="6" cy="13" r="1.2" fill="#1360d2" stroke="none"/>
                          </svg>
                          Wallet
                        </span>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff' }}>
                    <a href="#" onClick={e => { e.preventDefault(); e.stopPropagation(); setAccDetailsAccount(acc); setShowAccDetails(true); }} className="text-[16px] text-[#1360d2] underline hover:opacity-75 transition-opacity whitespace-nowrap">{acc.account}</a>
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    {isDebit ? (
                      <span className="text-[16px] text-[#697498]">-</span>
                    ) : (
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap flex items-center justify-end gap-[4px]">
                        <DirhamIcon size={14} color="#0e1b3d" /> {acc.totalLimit}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    {isDebit ? (
                      <span className="text-[16px] text-[#697498]">-</span>
                    ) : (
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap flex items-center justify-end gap-[4px]">
                        <DirhamIcon size={14} color="#0e1b3d" /> {acc.amountDue}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    {isDebit ? (
                      <span className="text-[16px] text-[#697498]">-</span>
                    ) : (
                      <span className="text-[16px] text-[#0e1b3d] whitespace-nowrap flex items-center justify-end gap-[4px]">
                        <DirhamIcon size={14} color="#0e1b3d" /> {acc.currentLimit}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'right' }}>
                    <span className="text-[16px] text-[#0e1b3d] font-medium whitespace-nowrap flex items-center justify-end gap-[4px]">
                      <DirhamIcon size={14} color="#0e1b3d" /> {acc.availableLimit}
                    </span>
                  </td>
                  <td style={{
                    padding: '0 12px', height: 54, verticalAlign: 'middle', borderBottom: '1px solid #f0f4ff', textAlign: 'center',
                    position: 'sticky', right: 0, boxShadow: '-3px 0 6px rgba(0,0,0,0.06)', zIndex: 1,
                    background: isSelected ? '#dce8f8' : '#fff',
                  }} onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => setShowStmtModal(true)}
                      title="Download Account Statement"
                      className="size-[34px] flex items-center justify-center rounded-[4px] border border-[#d5ddfb] bg-white text-[#1360d2] hover:bg-[#f0f4ff] transition-colors mx-auto"
                    >
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M12 3v12M8 11l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
      <div className="sticky bottom-0 bg-white z-10 border-t border-[#f0f4ff] pt-[6px]">
        <Pagination
          page={accPage}
          totalPages={Math.max(1, totalAccPages)}
          pageSize={ACC_PAGE_SIZE}
          totalItems={filteredAccounts.length}
          onPageChange={setAccPage}
          onPageSizeChange={() => {}}
        />
      </div>
      {showAccDetails && accDetailsAccount && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.5)' }} onClick={() => setShowAccDetails(false)}>
          <div className="bg-white rounded-[12px] overflow-hidden max-h-[90vh] overflow-y-auto" style={{ width: 1100, maxWidth: '96vw', boxShadow: 'rgba(143,155,186,0.16) 0px 5px 32px' }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ background: '#0e1b3d' }}>
              <span className="text-white text-[18px] font-medium" style={{ fontFamily: font }}>Account Details</span>
              <button onClick={() => setShowAccDetails(false)} className="text-white hover:opacity-70 transition-opacity">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-6 flex flex-col gap-5">
              {/* Account Details section */}
              <div className="rounded-[8px] border border-[#d5ddfb] p-5" style={{ background: 'white' }}>
                <div className="grid grid-cols-4 gap-x-8 gap-y-4">
                  {[
                    ['Account Type',    accDetailsAccount.type],
                    ['Account',         accDetailsAccount.account],
                    ['Business Code',   'AE-1050879'],
                    ['Consignee Code',  'I - 21358'],
                    ['Consignee Name',  'AEOUAT1'],
                    ['Contact Person',  'TEST'],
                    ['Mobile',          '2374623466'],
                    ['Email',           'esquire.induja@dubaicustoms.ae'],
                    ['Phone',           '971-4-4444444'],
                    ['Email 2',         'janice.torneo@dubaicustoms.ae'],
                    ['Phone 2',         ''],
                    ['Email 3',         'esquire.induja@dubaicustoms.ae'],
                    ['Phone 3',         ''],
                    ['Account Status',  'Inactive'],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>{label}</span>
                      <p className="text-[15px] font-semibold text-[#0e1b3d] mt-[2px]" style={{ fontFamily: font }}>{value || '—'}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Guarantee Details */}
              <div>
                <p className="text-[18px] font-semibold text-[#0e1b3d] mb-3" style={{ fontFamily: font }}>Guarantee Details</p>
                <div className="rounded-[8px] border border-[#e0e8f5] overflow-hidden">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                    <thead>
                      <tr>
                        {['Guarantee Type', 'Guarantee Ref. No.', 'Amount', 'Master Guarantee', 'Bank', 'Guarantee Status'].map((h, i) => (
                          <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, paddingLeft: i === 0 ? 16 : 12 }}>
                            <span className="text-[15px] font-medium text-[#051937] whitespace-nowrap">{h}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { gtype: 'Bank', ref: '54678787', amount: '8,569,711,119.00', master: 'Yes', bank: 'COMMERCIAL BANK INTL, R.A.K', gstatus: 'Inactive' },
                        { gtype: 'Cash', ref: 'Z11817',   amount: '10,000.00',         master: 'No',  bank: '',                         gstatus: 'Inactive' },
                        { gtype: 'Cash', ref: 'Z5621',    amount: '70,000.00',         master: 'No',  bank: '',                         gstatus: 'Inactive' },
                      ].map((g, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f0f4ff' }}>
                          <td style={{ padding: '11px 12px', paddingLeft: 16 }}><span className="text-[15px] text-[#0e1b3d]">{g.gtype}</span></td>
                          <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d]">{g.ref}</span></td>
                          <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d] flex items-center gap-[3px]"><DirhamIcon size={13} color="#0e1b3d" />{g.amount}</span></td>
                          <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d]">{g.master}</span></td>
                          <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d]">{g.bank || '—'}</span></td>
                          <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d]">{g.gstatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Virtual Account Details */}
              <div>
                <p className="text-[18px] font-semibold text-[#0e1b3d] mb-3" style={{ fontFamily: font }}>Virtual Account Details</p>
                <div className="rounded-[8px] border border-[#e0e8f5] overflow-hidden">
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: font }}>
                    <thead>
                      <tr>
                        {['Bank', 'Virtual Account No.', 'IBAN'].map((h, i) => (
                          <th key={h} style={{ background: '#a6c2e9', padding: '10px 12px', textAlign: 'left', fontWeight: 500, paddingLeft: i === 0 ? 16 : 12 }}>
                            <span className="text-[15px] font-medium text-[#051937]">{h}</span>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '11px 12px', paddingLeft: 16 }}><span className="text-[15px] text-[#0e1b3d] font-semibold">DUBAI ISLAMIC BANK</span></td>
                        <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d]">0017000007098406</span></td>
                        <td style={{ padding: '11px 12px' }}><span className="text-[15px] text-[#0e1b3d]">AE220240001700007098406</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex justify-center pt-2">
                <button onClick={() => setShowAccDetails(false)} className="px-10 py-2 rounded-[4px] text-[16px]" style={{ border: '1px solid #1360d2', color: '#1360d2', background: 'white', fontFamily: font }}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

  /* ── Main render ─────────────────────────────────────────────────────────── */
  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} onHome={handleHome} /></div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-4 md:px-10 flex-shrink-0">
          <Breadcrumb onBack={onBack} />
          <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[16px]" style={{ fontFamily: font }}>Bill Payment</h1>
        </div>

        {/* Main layout: left sidebar + content */}
        <div className="flex flex-1 overflow-hidden px-4 md:px-10 pt-[4px] gap-[12px]">

          {/* Left sidebar */}
          <div
            className="flex-shrink-0 rounded-[12px] overflow-hidden flex flex-col transition-all duration-300"
            style={{
              width: panelCollapsed ? 64 : 176,
              background: '#e4efff',
              border: '1px solid #a6c2e9',
              alignSelf: 'stretch',
            }}
          >
            {/* Collapse toggle */}
            <button
              onClick={() => setPanelCollapsed(c => !c)}
              className="flex items-center justify-center py-[12px] border-b border-[#a6c2e9] hover:bg-[#dde2f0] transition-colors w-full flex-shrink-0"
              title={panelCollapsed ? 'Expand' : 'Collapse'}
            >
              <svg viewBox="0 0 20 20" className="size-[17px] transition-transform duration-300" style={{ transform: panelCollapsed ? 'rotate(180deg)' : 'none' }} fill="none" stroke="#0e1b3d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 15l-5-5 5-5" /><path d="M8 15l-5-5 5-5" />
              </svg>
            </button>

            {MENU_ITEMS.map((item, i) => {
              const isActive = activeMenu === item.label;
              return (
                <button
                  key={item.label}
                  onClick={() => setActiveMenu(item.label)}
                  className="flex items-center w-full text-left transition-all hover:opacity-80"
                  style={{
                    gap: panelCollapsed ? 0 : 10,
                    padding: panelCollapsed ? '12px 12px' : '12px 14px',
                    justifyContent: panelCollapsed ? 'center' : 'flex-start',
                    ...(isActive
                      ? { background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }
                      : { background: 'transparent', borderTop: i === 0 ? 'none' : '1px solid #a6c2e9' }),
                  }}
                  title={panelCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center justify-center flex-shrink-0 rounded-[8px]"
                    style={{ width: 38, height: 38, background: '#ffffff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                    <item.Icon />
                  </div>
                  {!panelCollapsed && (
                    <span className="text-[16px] text-[#0e1b3d] leading-tight whitespace-nowrap overflow-hidden"
                      style={{ fontFamily: font, fontWeight: isActive ? 700 : 400 }}>
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Right content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="flex-1 overflow-y-auto pb-4">
          {activeMenu === 'Overview' && (() => {
            const openPending = () => { setActiveMenu('Invoices'); setFStatuses(new Set(['Unpaid', 'Partially Paid'])); setFDueFilter(''); };
            const openOverdue = () => { setActiveMenu('Invoices'); setFStatuses(new Set(['Unpaid', 'Partially Paid'])); setFDueFilter('overdue'); };
            const openDueSoon = () => { setActiveMenu('Invoices'); setFStatuses(new Set(['Unpaid', 'Partially Paid'])); setFDueFilter('dueSoon'); };
            const openFailed  = () => { setActiveMenu('Payments'); setPayStatusFilter('Failed'); };
            const openInvoicesInPeriod = () => {
              setActiveMenu('Invoices'); setFStatuses(new Set()); setFDueFilter('');
              setFFromDate(recentPeriodDays === 'today' ? '2026-06-10' : recentPeriodDays === 7 ? '2026-06-04' : '2026-05-11');
              setFToDate('2026-06-10');
            };
            const openPaymentsMade = () => { setActiveMenu('Payments'); setPayStatusFilter('Success'); };
            const openCdr = () => { setActiveMenu('Accounts'); setAccTypeFilter('Credit Account'); };
            const openPaymentStatus = (status: string) => { setActiveMenu('Payments'); setPayStatusFilter(status); };

            const period = recentPeriodDays === 'today' ? 'today' : recentPeriodDays === 7 ? 'last7' : 'last30';
            const ACTIVITY_ROWS = [
              { key: 'invGen', label: 'Invoices Generated', desc: 'New bills issued to your account', data: RECENT_ACTIVITY.invoicesGenerated, onClick: openInvoicesInPeriod,
                color: '#568BDB', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#568BDB" strokeWidth="1.8"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round"/></svg> },
              { key: 'payMade', label: 'Payments Made', desc: 'Successfully settled transactions', data: RECENT_ACTIVITY.paymentsMade, onClick: openPaymentsMade,
                color: '#1B9841', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#1B9841" strokeWidth="1.8"><path d="M5 13l4 4 10-10" strokeLinecap="round" strokeLinejoin="round"/></svg> },
              { key: 'payFailed', label: 'Pending Payments', desc: 'Attempts that need a retry', data: RECENT_ACTIVITY.failedPayments, onClick: openFailed,
                color: '#DC3545', icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#DC3545" strokeWidth="1.8"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round"/></svg> },
            ];

            const SUMMARY_CARDS = [
              { key: 'overdue', label: 'Overdue Invoices', count: overdueInvCount, amt: overdueInvAmt, color: '#dc3545', bg: 'linear-gradient(160deg,#fde3e3 0%,#ffffff 75%)', border: '#f5b8b8', onClick: openOverdue,
                icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#dc3545" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6" strokeLinecap="round"/><circle cx="12" cy="16.5" r="0.9" fill="#dc3545"/></svg> },
              { key: 'dueSoon', label: 'Current / Due Soon', count: dueSoonInvCount, amt: dueSoonInvAmt, color: '#b45309', bg: 'linear-gradient(160deg,#ffedd1 0%,#ffffff 75%)', border: '#fcd7a0', onClick: openDueSoon,
                icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#b45309" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            ];

            const CDR_SUMMARY_CARDS = [
              { key: 'cdrOverdue', label: 'Overdue Amount to Pay', count: cdrOverdueCount, amt: cdrOverdueAmt, color: '#dc3545', bg: 'linear-gradient(160deg,#fde3e3 0%,#ffffff 75%)', border: '#f5b8b8', onClick: openCdr,
                icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#dc3545" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v6" strokeLinecap="round"/><circle cx="12" cy="16.5" r="0.9" fill="#dc3545"/></svg> },
              { key: 'cdrDueSoon', label: 'Current / Due Soon to Pay', count: cdrDueSoonCount, amt: cdrDueSoonAmt, color: '#b45309', bg: 'linear-gradient(160deg,#ffedd1 0%,#ffffff 75%)', border: '#fcd7a0', onClick: openCdr,
                icon: <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#b45309" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            ];

            /* Total Due to Dubai Customs — CDR Total Amount to Pay + Pending Invoices, with a mini
               donut breaking out how much of that total is already overdue. */
            const dueOverduePct = totalDueToDubaiCustoms > 0 ? (overdueInvAmt / totalDueToDubaiCustoms) * 100 : 0;

            /* Shared donut-segment math — first segment starts at 12 o'clock, each subsequent
               segment picks up where the previous one left off. A small gap is trimmed from each
               segment's true span so adjacent slices read as visually distinct wedges. */
            const donutSegments = (parts: { pct: number; color: string }[], gap = 6) => {
              let cumulative = 0;
              return parts.map(p => {
                const seg = { ...p, pct: Math.max(0, p.pct - gap), offset: 25 - (cumulative + gap / 2) };
                cumulative += p.pct;
                return seg;
              });
            };
            const Donut = ({ size, segments, centerValue, centerLabel }: { size: number; segments: { pct: number; color: string; offset: number }[]; centerValue: React.ReactNode; centerLabel: string }) => {
              const shadowId = `donutShadow-${centerLabel.replace(/[^a-zA-Z0-9]/g, '')}`;
              return (
                <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
                  <svg viewBox="0 0 42 42" width={size} height={size}>
                    <defs>
                      <filter id={shadowId} x="-60%" y="-60%" width="220%" height="220%">
                        <feDropShadow dx="0" dy="0.5" stdDeviation="0.9" floodColor="#0e1b3d" floodOpacity="0.16" />
                      </filter>
                    </defs>
                    {segments.map((seg, i) => seg.pct > 0 && (
                      <circle key={i} cx="21" cy="21" r="15.915" fill="transparent" stroke={seg.color} strokeWidth="3" strokeLinecap="round"
                        strokeDasharray={`${seg.pct} ${100 - seg.pct}`} strokeDashoffset={seg.offset}
                        style={{ transition: 'stroke-dasharray 0.3s' }} />
                    ))}
                    <circle cx="21" cy="21" r="13" fill="#fff" filter={`url(#${shadowId})`} />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-[6px]">
                    <span className="text-[22px] font-extrabold text-[#0e1b3d] leading-none flex items-center gap-[3px]" style={{ fontFamily: font }}>{centerValue}</span>
                    <span className="text-[12px] text-[#8f94ae] mt-[5px]" style={{ fontFamily: font }}>{centerLabel}</span>
                  </div>
                </div>
              );
            };
            /* Dashed-tick circular utilisation ring — a full circle of short radial dashes,
               with the utilised-percentage arc (starting at 12 o'clock, clockwise) picked out
               in the zone color while the rest stay a neutral track color. */
            const DashRingGauge = ({ pct, size = 200, ticks = 60, color }: { pct: number; size?: number; ticks?: number; color: string }) => {
              const p = Math.min(100, Math.max(0, pct));
              const activeTicks = p > 0 ? Math.max(1, Math.round((p / 100) * ticks)) : 0;
              const cx = 100, cy = 100, outerR = 92, innerR = 78;
              return (
                <svg viewBox="0 0 200 200" width={size} height={size}>
                  {Array.from({ length: ticks }).map((_, i) => (
                    <line key={i} x1={cx} y1={cy - outerR} x2={cx} y2={cy - innerR}
                      stroke={i < activeTicks ? color : '#e7ebf3'} strokeWidth="2.2" strokeLinecap="round"
                      transform={`rotate(${(360 / ticks) * i},${cx},${cy})`} />
                  ))}
                </svg>
              );
            };
            const legendRow = (key: string, color: string, label: string, right: React.ReactNode, sub: React.ReactNode, onClick?: () => void) => (
              <button key={key} onClick={onClick} disabled={!onClick}
                className="flex items-center gap-[8px] py-[7px] px-[8px] rounded-[8px] hover:bg-[#fafbff] transition-colors text-left disabled:cursor-default w-full"
                style={{ fontFamily: font }}>
                <span className="size-[9px] rounded-full flex-shrink-0" style={{ background: color }} />
                <span className="min-w-0 text-[14px] text-[#4b5468] truncate">{label}</span>
                <span className="text-[16px] font-bold text-[#0e1b3d] leading-none flex-shrink-0">{right}</span>
                <div className="flex-1 min-w-[8px]" />
                {sub && <span className="text-[13px] font-medium text-[#4b5468] leading-none flex-shrink-0">{sub}</span>}
              </button>
            );

            const cdrDuePct = cdrTotalLimit > 0 ? (cdrDueAmt / cdrTotalLimit) * 100 : 0;
            const cdrUsagePct = cdrTotalLimit > 0 ? (cdrUsageAmt / cdrTotalLimit) * 100 : 0;
            const cdrAvailPct = Math.max(0, 100 - cdrDuePct - cdrUsagePct);
            const cdrSegs = donutSegments([
              { pct: cdrDuePct, color: '#b45309' },
              { pct: cdrUsagePct, color: '#7c3aed' },
              { pct: cdrAvailPct, color: '#93b4f7' },
            ]);
            /* Total limit utilised, as a % of the total CDR limit — drives the meter gauge below.
               Pinned to a fixed demo value so the gauge always reads as a meaningful, visible arc. */
            const cdrUtilPct = 15;
            const cdrZone = (pct: number) =>
              pct < 60 ? { color: '#1b9841', label: 'Healthy' } :
              pct < 85 ? { color: '#b45309', label: 'Moderate' } :
              { color: '#dc2626', label: 'Critical' };

            return (
            <div className="flex flex-col gap-[20px] w-full">

              {/* ── Above-the-fold — 3 vertical sections ────────────────────── */}
              <div className="grid grid-cols-3 gap-[16px] items-stretch">

                {/* Section 1: Total Due to Dubai Customs — with its calculation breakdown */}
                <div className="rounded-[16px] p-[22px] flex flex-col"
                  style={{ background: 'linear-gradient(160deg,#e2ebf9 0%,#ffffff 75%)', border: '1.5px solid #93b4f7', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                  <button onClick={openPending} className="text-left">
                    <span className="text-[15px] font-medium text-[#4b5468]" style={{ fontFamily: font }}>Total Due to Dubai Customs</span>
                    <span className="text-[30px] font-extrabold leading-none block mt-[10px] flex items-center gap-[6px]" style={{ color: '#1360d2', fontFamily: font, letterSpacing: '-1px' }}>
                      <DirhamIcon size={24} color="#1360d2" />{totalDueToDubaiCustoms.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </button>
                  {/* Calculation breakdown */}
                  <div className="flex flex-col gap-[10px] mt-[18px] pt-[16px] flex-1" style={{ borderTop: '1px solid #b3caff' }}>
                    <button onClick={openCdr} className="flex items-center justify-between text-left hover:opacity-75 transition-opacity">
                      <span className="text-[15px] text-[#4b5468]" style={{ fontFamily: font }}>Total Amount Pending to Pay – CDR</span>
                      <span className="text-[17px] font-bold text-[#0e1b3d] flex items-center gap-[4px]" style={{ fontFamily: font }}>
                        <DirhamIcon size={14} color="#0e1b3d" />{cdrTotalToPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </button>
                    <div className="text-center text-[13px] text-[#93b4f7]" style={{ fontFamily: font }}>+</div>
                    <button onClick={openPending} className="flex items-center justify-between text-left hover:opacity-75 transition-opacity">
                      <span className="text-[15px] text-[#4b5468]" style={{ fontFamily: font }}>Total Amount - Pending Invoices</span>
                      <span className="text-[17px] font-bold text-[#0e1b3d] flex items-center gap-[4px]" style={{ fontFamily: font }}>
                        <DirhamIcon size={14} color="#0e1b3d" />{pendingInvAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </button>
                    <div className="flex items-center justify-center gap-[10px] mt-auto pt-[6px]">
                      <button onClick={openCdr} className="text-[14px] font-bold text-[#1360d2] hover:underline" style={{ fontFamily: font }}>
                        View Accounts
                      </button>
                      <span className="text-[13px] text-[#93b4f7]">|</span>
                      <button onClick={openPending} className="text-[14px] font-bold text-[#1360d2] hover:underline" style={{ fontFamily: font }}>
                        View Invoices
                      </button>
                    </div>
                  </div>
                </div>

                {/* Section 2: CDR Account information + Wallet */}
                <div className="flex flex-col gap-[16px]">
                  <button onClick={openCdr}
                    className="rounded-[16px] p-[20px] text-left relative overflow-hidden hover:shadow-lg hover:-translate-y-[1px] transition-all flex-1"
                    style={{ background: 'linear-gradient(160deg,#ffedd1 0%,#ffffff 75%)', border: '1.5px solid #fcd7a0', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                    <div className="absolute top-[16px] right-[16px] size-[44px] rounded-[12px] flex items-center justify-center bg-white flex-shrink-0" style={{ boxShadow: '0 4px 10px rgba(14,27,61,0.10)' }}>
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#b45309" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <div style={{ paddingRight: 56 }}>
                      <p className="text-[15px] text-[#4b5468]" style={{ fontFamily: font }}>Amount Pending to Pay – CDR</p>
                      <p className="text-[24px] font-extrabold text-[#b45309] leading-none mt-[10px] flex items-center gap-[6px]" style={{ fontFamily: font, letterSpacing: '-1px' }}>
                        <DirhamIcon size={19} color="#b45309" />{cdrDueAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-[14px] pt-[10px]" style={{ borderTop: '1px solid #fcd7a0' }}>
                      <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{ACCOUNTS.length} CDR accounts</span>
                      <span className="text-[13px] text-white font-semibold flex items-center gap-1 rounded-[6px]" style={{ fontFamily: font, background: '#1360d2', padding: '7px 14px' }}>
                        Pay Now <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </button>

                  <button onClick={() => setActiveMenu('Accounts')}
                    className="rounded-[16px] p-[20px] text-left relative overflow-hidden hover:shadow-lg hover:-translate-y-[1px] transition-all flex-1"
                    style={{ background: '#fff', border: '1.5px solid #93b4f7', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                    <div className="absolute top-[16px] right-[16px] size-[44px] rounded-[12px] flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(160deg,#e8f0fe 0%,#ffffff 90%)', boxShadow: '0 4px 10px rgba(14,27,61,0.10)' }}>
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1e40af" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 10h20M6 14h4" strokeLinecap="round"/></svg>
                    </div>
                    <div style={{ paddingRight: 56 }}>
                      <p className="text-[15px] text-[#697498]" style={{ fontFamily: font }}>Debit Account (Wallet)</p>
                      <p className="text-[24px] font-extrabold text-[#1e40af] leading-none mt-[10px]" style={{ letterSpacing: '-1px' }}>{fmtBalance(debitTotal)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-[14px] pt-[10px]" style={{ borderTop: '1px solid #e0e8f5' }}>
                      <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>{DEBIT_ACCOUNTS.length} account{DEBIT_ACCOUNTS.length !== 1 ? 's' : ''}</span>
                      <span className="text-[13px] text-white font-semibold flex items-center gap-1 rounded-[6px]" style={{ fontFamily: font, background: '#1360d2', padding: '7px 14px' }}>
                        Topup <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </button>
                </div>

                {/* Section 3: CDR Limit Utilization — dashed-tick ring gauge */}
                <button onClick={openCdr}
                  className="rounded-[16px] p-[20px] text-center flex flex-col hover:shadow-lg hover:-translate-y-[1px] transition-all"
                  style={{ background: 'linear-gradient(160deg,#ffffff 0%,#dcfce7 100%)', border: '1.5px solid #16a34a', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                  <p className="text-[15px] font-semibold text-[#4b5468] text-left" style={{ fontFamily: font }}>CDR Limit Utilization – Current Month</p>
                  <div className="relative flex items-center justify-center flex-1 mt-[10px]">
                    <DashRingGauge pct={cdrUtilPct} size={168} color={cdrZone(cdrUtilPct).color} />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-[28px] font-extrabold leading-none" style={{ color: '#0e1b3d', fontFamily: font }}>{cdrUtilPct}%</span>
                    </div>
                  </div>
                  <p className="text-[16px] font-semibold text-[#0e1b3d] mt-[12px] flex items-center justify-center gap-[4px] flex-wrap" style={{ fontFamily: font }}>
                    <span className="font-extrabold flex items-center gap-[3px]"><DirhamIcon size={14} color="#0e1b3d" />{cdrUsageAmt.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                    <span className="text-[#4b5468] flex items-center gap-[3px]">out of <DirhamIcon size={12} color="#4b5468" />{fmtCompact(cdrTotalLimit)}</span>
                  </p>
                </button>
              </div>

              {/* ── CDR — total due + overdue/due-soon triage, styled like the Invoices row ── */}
              <div>
                <p className="text-[15px] font-bold text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font }}>CDR</p>
                <div className="grid grid-cols-3 gap-[16px] items-stretch">
                  <button onClick={openCdr}
                    className="rounded-[16px] p-[20px] text-left relative overflow-hidden hover:shadow-lg hover:-translate-y-[1px] transition-all flex flex-col"
                    style={{ background: 'linear-gradient(160deg,#dce9fc 0%,#ffffff 75%)', border: '1.5px solid #b3caff', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                    <div className="absolute top-[16px] right-[16px] size-[44px] rounded-[12px] flex items-center justify-center bg-white flex-shrink-0" style={{ boxShadow: '0 4px 10px rgba(14,27,61,0.10)' }}>
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" /></svg>
                    </div>
                    <div style={{ paddingRight: 56 }}>
                      <span className="text-[15px] font-medium text-[#4b5468]" style={{ fontFamily: font }}>Total Amount Due to Pay</span>
                      <span className="text-[24px] font-extrabold leading-none flex items-center gap-[6px] mt-[10px]" style={{ color: '#1360d2', fontFamily: font, letterSpacing: '-1px' }}>
                        <DirhamIcon size={19} color="#1360d2" />{cdrDueAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-[14px]" style={{ borderTop: '1px solid #b3caff' }}>
                      <span>
                        <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Count</span>
                        <span className="text-[16px] font-bold text-[#0e1b3d] ml-[8px]" style={{ fontFamily: font }}>{ACCOUNTS.length}</span>
                      </span>
                      <span className="text-[13px] text-white font-semibold flex items-center gap-1 rounded-[6px]" style={{ fontFamily: font, background: '#1360d2', padding: '7px 14px' }}>
                        Pay Now <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </button>

                  {CDR_SUMMARY_CARDS.map(({ key, label, count, amt, color, bg, border, icon, onClick }) => (
                    <button key={key} onClick={onClick}
                      className="rounded-[16px] p-[20px] text-left relative overflow-hidden hover:shadow-lg hover:-translate-y-[1px] transition-all flex flex-col"
                      style={{ background: bg, border: `1.5px solid ${border}`, boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                      <div className="absolute top-[16px] right-[16px] size-[44px] rounded-[12px] flex items-center justify-center bg-white flex-shrink-0" style={{ boxShadow: '0 4px 10px rgba(14,27,61,0.10)' }}>
                        {icon}
                      </div>
                      <div style={{ paddingRight: 56 }}>
                        <span className="text-[15px] font-medium text-[#4b5468]" style={{ fontFamily: font }}>{label}</span>
                        <span className="text-[24px] font-extrabold leading-none flex items-center gap-[6px] mt-[10px]" style={{ color, fontFamily: font, letterSpacing: '-1px' }}>
                          <DirhamIcon size={19} color={color} />{amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center mt-auto pt-[14px]" style={{ borderTop: `1px solid ${border}` }}>
                        <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Count</span>
                        <span className="text-[16px] font-bold text-[#0e1b3d] ml-[8px]" style={{ fontFamily: font }}>{count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Invoices — total available + pending/overdue/due-soon triage ── */}
              <div>
                <p className="text-[15px] font-bold text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font }}>Invoices</p>
                <div className="grid grid-cols-3 gap-[16px] items-stretch">
                  <button onClick={() => setActiveMenu('Invoices')}
                    className="rounded-[16px] p-[20px] text-left relative overflow-hidden hover:shadow-lg hover:-translate-y-[1px] transition-all flex flex-col"
                    style={{ background: 'linear-gradient(160deg,#dce9fc 0%,#ffffff 75%)', border: '1.5px solid #b3caff', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                    <div className="absolute top-[16px] right-[16px] size-[44px] rounded-[12px] flex items-center justify-center bg-white flex-shrink-0" style={{ boxShadow: '0 4px 10px rgba(14,27,61,0.10)' }}>
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8"><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M2 10h20" strokeLinecap="round" /></svg>
                    </div>
                    <div style={{ paddingRight: 56 }}>
                      <span className="text-[15px] font-medium text-[#4b5468]" style={{ fontFamily: font }}>Total Invoices Available</span>
                      <span className="text-[24px] font-extrabold leading-none flex items-center gap-[6px] mt-[10px]" style={{ color: '#1360d2', fontFamily: font, letterSpacing: '-1px' }}>
                        <DirhamIcon size={19} color="#1360d2" />{pendingInvAmt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-[14px]" style={{ borderTop: '1px solid #b3caff' }}>
                      <span>
                        <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Count</span>
                        <span className="text-[16px] font-bold text-[#0e1b3d] ml-[8px]" style={{ fontFamily: font }}>{pendingInvCount}</span>
                      </span>
                      <span className="text-[13px] text-white font-semibold flex items-center gap-1 rounded-[6px]" style={{ fontFamily: font, background: '#1360d2', padding: '7px 14px' }}>
                        Pay Now <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="#fff" strokeWidth="2"><path d="M6 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </span>
                    </div>
                  </button>

                  {SUMMARY_CARDS.map(({ key, label, count, amt, color, bg, border, icon, onClick }) => (
                    <button key={key} onClick={onClick}
                      className="rounded-[16px] p-[20px] text-left relative overflow-hidden hover:shadow-lg hover:-translate-y-[1px] transition-all flex flex-col"
                      style={{ background: bg, border: `1.5px solid ${border}`, boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                      <div className="absolute top-[16px] right-[16px] size-[44px] rounded-[12px] flex items-center justify-center bg-white flex-shrink-0" style={{ boxShadow: '0 4px 10px rgba(14,27,61,0.10)' }}>
                        {icon}
                      </div>
                      <div style={{ paddingRight: 56 }}>
                        <span className="text-[15px] font-medium text-[#4b5468]" style={{ fontFamily: font }}>{label}</span>
                        <span className="text-[24px] font-extrabold leading-none flex items-center gap-[6px] mt-[10px]" style={{ color, fontFamily: font, letterSpacing: '-1px' }}>
                          <DirhamIcon size={19} color={color} />{amt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                      <div className="flex items-center mt-auto pt-[14px]" style={{ borderTop: `1px solid ${border}` }}>
                        <span className="text-[16px] text-[#697498]" style={{ fontFamily: font }}>Count</span>
                        <span className="text-[16px] font-bold text-[#0e1b3d] ml-[8px]" style={{ fontFamily: font }}>{count}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* ── CDR Usage trend + Debit Account Top-ups ─────────────────── */}
              <div className="grid grid-cols-2 gap-[16px] items-stretch">
              <div className="rounded-[16px] p-[20px]" style={{ background: '#fff', border: '1.5px solid #e0e8f5', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                <div>
                  <p className="text-[16px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Total Due vs Overdue</p>
                  <p className="text-[13px] text-[#8f94ae] mt-[2px]" style={{ fontFamily: font }}>Share of your total due already overdue</p>
                </div>
                {(() => {
                  const bars = [
                    { label: 'Total Due', amt: totalDueToDubaiCustoms, color: '#1360d2' },
                    { label: 'Overdue', amt: overdueInvAmt, color: '#dc3545' },
                  ];
                  const W = 960, H = 260;
                  const x0 = 76, x1 = 930, y0 = 20, y1 = 188, labelY = 214;
                  const maxVal = Math.max(...bars.map(b => b.amt));
                  const niceMax = (maxVal || 1) * 1.25;
                  const gridSteps = [0, 0.25, 0.5, 0.75, 1];
                  const barW = 160;
                  const gap = (x1 - x0 - barW * bars.length) / (bars.length + 1);
                  const barX = (i: number) => x0 + gap * (i + 1) + barW * i;
                  const minBarH = 10; // keeps a small-but-nonzero value (e.g. Overdue) visible against a much larger bar
                  const barH = (v: number) => v > 0 ? Math.max((v / niceMax) * (y1 - y0), minBarH) : 0;

                  return (
                    <div className="mt-[10px]">
                      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={220}>
                        {/* Gridlines + Y labels */}
                        {gridSteps.map(g => {
                          const gy = y1 - g * (y1 - y0);
                          return (
                            <g key={g}>
                              <line x1={x0} y1={gy} x2={x1} y2={gy} stroke="#eef1f6" strokeWidth="1" strokeDasharray="4 4" />
                              <text x={x0 - 12} y={gy + 4} textAnchor="end" fontSize="16" fill="#4b5468" style={{ fontFamily: font }}>
                                {fmtCompact(g * niceMax)}
                              </text>
                            </g>
                          );
                        })}

                        {/* Bars */}
                        {bars.map((b, i) => {
                          const h = barH(b.amt);
                          const x = barX(i);
                          const y = y1 - h;
                          return (
                            <g key={b.label}>
                              <rect x={x} y={y} width={barW} height={h} rx={0} fill={b.color} />
                              <text x={x + barW / 2} y={y - 10} textAnchor="middle" fontSize="14" fontWeight="700" fill={b.color} style={{ fontFamily: font }}>
                                Dh{fmtCompact(b.amt)}
                              </text>
                              <text x={x + barW / 2} y={labelY} textAnchor="middle" fontSize="16" fill="#4b5468" style={{ fontFamily: font }}>
                                {b.label}
                              </text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  );
                })()}
              </div>

              {/* Debit Account Top-ups — bar chart, deliberately a different chart type from the
                  Total Due vs Overdue chart so the two read as distinct at a glance. */}
              <div className="rounded-[16px] p-[20px]" style={{ background: '#fff', border: '1.5px solid #e0e8f5', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                <div className="flex items-start justify-between gap-[10px]">
                  <div>
                    <p className="text-[16px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Debit Account Top-ups</p>
                    <p className="text-[13px] text-[#8f94ae] mt-[2px]" style={{ fontFamily: font }}>Amount added to your wallet over the last 6 months</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button onClick={() => setDebitChartAccountOpen(o => !o)}
                      className="flex items-center gap-[6px] h-[32px] px-[10px] rounded-[8px] border text-[13px] font-semibold text-[#0e1b3d] hover:bg-[#f0f4ff] transition-colors"
                      style={{ fontFamily: font, borderColor: '#d5ddfb' }}>
                      {debitChartAccount}
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#697498" strokeWidth="2"
                        style={{ transform: debitChartAccountOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    {debitChartAccountOpen && (
                      <div className="absolute right-0 z-20 rounded-[8px] bg-white overflow-y-auto" style={{ top: 38, width: 220, maxHeight: 220, border: '1px solid #e0e8f5', boxShadow: '0px 4px 20px rgba(0,0,0,0.14)' }}>
                        {DEBIT_ACCOUNTS.map(a => (
                          <button key={a.account} onClick={() => { setDebitChartAccount(a.account); setDebitChartAccountOpen(false); }}
                            className="w-full text-left px-[12px] py-[9px] text-[13px] hover:bg-[#f0f4ff] transition-colors"
                            style={{ fontFamily: font, color: a.account === debitChartAccount ? '#1360d2' : '#0e1b3d', fontWeight: a.account === debitChartAccount ? 700 : 400 }}>
                            {a.account}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {(() => {
                  const W = 960, H = 260;
                  const x0 = 76, x1 = 930, y0 = 20, y1 = 188, labelY = 214;
                  const n = DEBIT_TOPUP_TREND.length;
                  const slot = (x1 - x0) / n;
                  const barW = slot * 0.46;
                  const maxVal = Math.max(...DEBIT_TOPUP_TREND.map(d => d.amt));
                  const niceMax = maxVal * 1.25;
                  const py = (v: number) => y1 - (v / niceMax) * (y1 - y0);
                  const bars = DEBIT_TOPUP_TREND.map((d, i) => {
                    const cx = x0 + slot * i + slot / 2;
                    const y = py(d.amt);
                    return { ...d, x: cx - barW / 2, y, h: y1 - y, cx };
                  });
                  const gridSteps = [0, 0.25, 0.5, 0.75, 1];
                  const peak = bars[bars.length - 1];

                  return (
                    <div className="mt-[10px] overflow-x-auto">
                      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={220} style={{ minWidth: 560 }}>
                        <defs>
                          <linearGradient id="debitTopupFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1360d2" stopOpacity="0.95" />
                            <stop offset="100%" stopColor="#568BDB" stopOpacity="0.75" />
                          </linearGradient>
                        </defs>

                        {/* Y labels (no gridlines — bars carry their own baseline) */}
                        {gridSteps.map(g => {
                          const gy = y1 - g * (y1 - y0);
                          return (
                            <text key={g} x={x0 - 12} y={gy + 4} textAnchor="end" fontSize="16" fill="#4b5468" style={{ fontFamily: font }}>
                              {fmtCompact(g * niceMax)}
                            </text>
                          );
                        })}

                        {/* Bars */}
                        {bars.map((b, i) => (
                          <rect key={i} x={b.x} y={b.y} width={barW} height={b.h} rx={0}
                            fill={i === bars.length - 1 ? '#1360d2' : 'url(#debitTopupFill)'} />
                        ))}

                        {/* Peak tooltip pill — current month */}
                        <g>
                          <rect x={peak.cx - 52} y={peak.y - 44} width="104" height="28" rx="14" fill="#1360d2" />
                          <text x={peak.cx} y={peak.y - 25} textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" style={{ fontFamily: font }}>
                            Dh{fmtCompact(peak.amt)}
                          </text>
                          <line x1={peak.cx} y1={peak.y - 16} x2={peak.cx} y2={peak.y - 6} stroke="#1360d2" strokeWidth="1.5" />
                        </g>

                        {/* X-axis month labels */}
                        {bars.map((b, i) => (
                          <text key={i} x={b.cx} y={labelY} textAnchor="middle" fontSize="16" fill="#4b5468" style={{ fontFamily: font }}>
                            {b.month}
                          </text>
                        ))}
                      </svg>
                    </div>
                  );
                })()}
              </div>
              </div>

              {/* ── Analytics — Payment Status / Recent Activity ── */}
              <div>
                <p className="text-[15px] font-bold text-[#0e1b3d] mb-[10px]" style={{ fontFamily: font }}>Analytics</p>
                <div className="grid grid-cols-2 gap-[16px] items-stretch">
                  {/* Payment Status */}
                  <div className="rounded-[16px] p-[18px]" style={{ background: '#fff', border: '1.5px solid #e0e8f5', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                    <div className="flex items-center justify-between gap-[8px] flex-wrap">
                      <div>
                        <p className="text-[15px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Payment Status</p>
                        <p className="text-[12px] text-[#8f94ae] mt-[2px]" style={{ fontFamily: font }}>By count, all transactions</p>
                      </div>
                      <div className="inline-flex rounded-[8px] overflow-hidden border border-[#d5ddfb] flex-shrink-0">
                        {(['today', 7, 30] as const).map(d => (
                          <button key={d} onClick={() => setRecentPeriodDays(d)}
                            className="px-[8px] h-[26px] text-[11px] font-semibold transition-colors"
                            style={{ fontFamily: font, background: recentPeriodDays === d ? '#1360d2' : 'white', color: recentPeriodDays === d ? 'white' : '#697498' }}>
                            {d === 'today' ? 'Today' : `${d}D`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(() => {
                      const periodBreakdown = PAYMENT_STATUS_BY_PERIOD[period];
                      const periodTotal = periodBreakdown.reduce((s, r) => s + r.count, 0);
                      const periodSuccessCount = periodBreakdown.find(s => s.status === 'Success')?.count ?? 0;
                      const periodSuccessRate = periodTotal > 0 ? (periodSuccessCount / periodTotal) * 100 : 0;
                      const periodSegs = donutSegments(periodBreakdown.map(s => ({ pct: (s.count / (periodTotal || 1)) * 100, color: s.color })));

                      return (
                        <div className="flex items-center gap-[16px] mt-[16px]">
                          <Donut size={130} segments={periodSegs} centerValue={`${periodSuccessRate.toFixed(0)}%`} centerLabel="Success Rate" />
                          <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                            {periodTotal === 0 && <p className="text-[13px] text-[#8f94ae] px-[8px] py-[10px]" style={{ fontFamily: font }}>No transactions in this window</p>}
                            {periodBreakdown.map(s => legendRow(s.status, s.color, s.status, s.count,
                              <span className="flex items-center gap-[3px]"><DirhamIcon size={10} color="#4b5468" />{s.amt.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>,
                              () => openPaymentStatus(s.status)))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Recent Activity */}
                  <div className="rounded-[16px] p-[18px] flex flex-col" style={{ background: '#fff', border: '1.5px solid #e0e8f5', boxShadow: '0 1px 4px rgba(14,27,61,0.06)' }}>
                    <div className="flex items-center justify-between gap-[8px] flex-wrap">
                      <div>
                        <p className="text-[15px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Recent Activity</p>
                        <p className="text-[12px] text-[#8f94ae] mt-[2px]" style={{ fontFamily: font }}>Bill &amp; payment activity</p>
                      </div>
                      <div className="inline-flex rounded-[8px] overflow-hidden border border-[#d5ddfb] flex-shrink-0">
                        {(['today', 7, 30] as const).map(d => (
                          <button key={d} onClick={() => setRecentPeriodDays(d)}
                            className="px-[8px] h-[26px] text-[11px] font-semibold transition-colors"
                            style={{ fontFamily: font, background: recentPeriodDays === d ? '#1360d2' : 'white', color: recentPeriodDays === d ? 'white' : '#697498' }}>
                            {d === 'today' ? 'Today' : `${d}D`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {(() => {
                      const totalActivityCount = ACTIVITY_ROWS.reduce((s, r) => s + r.data[period].count, 0);
                      const activitySegs = donutSegments(ACTIVITY_ROWS.map(r => ({
                        pct: totalActivityCount > 0 ? (r.data[period].count / totalActivityCount) * 100 : 0,
                        color: r.color,
                      })));

                      return (
                        <div className="flex items-center gap-[16px] mt-[16px]">
                          <Donut size={130} segments={activitySegs} centerValue={totalActivityCount} centerLabel="Activities" />
                          <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                            {ACTIVITY_ROWS.map(r => legendRow(r.key, r.color, r.label, r.data[period].count,
                              <span className="flex items-center gap-[3px]"><DirhamIcon size={10} color="#4b5468" />{r.data[period].amt.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>,
                              r.onClick))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>

            </div>
            );
          })()}
            {activeMenu === 'Invoices' && <InvoicesContent />}
            {activeMenu === 'Payments' && <PaymentsContent />}
            {activeMenu === 'Accounts' && <AccountsContent />}
            </div>{/* end scrollable */}
          </div>{/* end right content wrapper */}
        </div>
      </div>

      {/* Account Statement Modal */}
      {showStmtModal && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center" style={{ background: 'rgba(14,27,61,0.45)' }}>
          <div className="bg-white rounded-[16px] w-full max-w-[560px] mx-4 shadow-2xl overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e0e8f5]">
              <div>
                <h3 className="text-[20px] font-bold text-[#0e1b3d]" style={{ fontFamily: font }}>Account Statement</h3>
                <p className="text-[13px] text-[#697498] mt-[2px]" style={{ fontFamily: font }}>Select statement type and date range</p>
              </div>
              <button onClick={() => setShowStmtModal(false)}
                className="size-[36px] rounded-full flex items-center justify-center hover:bg-[#f0f4ff] transition-colors">
                <svg viewBox="0 0 20 20" width="18" height="18" fill="none" stroke="#697498" strokeWidth="2">
                  <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {/* Modal body */}
            <div className="px-6 py-5">
              {/* Account Number searchable dropdown */}
              <p className="text-[16px] font-semibold text-[#697498] mb-2" style={{ fontFamily: font }}>Account Number</p>
              <div ref={stmtAccRef} className="relative mb-5">
                <div
                  className="flex items-center border rounded-[4px] overflow-hidden transition-colors"
                  style={{ borderColor: stmtAccOpen ? '#1360d2' : '#d5ddfb', background: 'white' }}
                >
                  <input
                    type="text"
                    value={stmtAccOpen ? stmtAccSearch : (stmtAccount || stmtAccSearch)}
                    onChange={e => { setStmtAccSearch(e.target.value); setStmtAccOpen(true); }}
                    onFocus={() => { setStmtAccOpen(true); setStmtAccSearch(''); }}
                    placeholder="Search account number…"
                    className="flex-1 h-[44px] px-3 text-[16px] placeholder-[#8f94ae] focus:outline-none bg-transparent"
                    style={{ fontFamily: font, color: '#0e1b3d' }}
                  />
                  <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="mr-2 flex-shrink-0"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="#0E1B3D"/></svg>
                  {stmtAccount && (
                    <button type="button" onClick={() => { setStmtAccount(''); setStmtAccSearch(''); }}
                      className="px-2 text-[#697498] hover:text-[#dc3545] transition-colors">
                      <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
                      </svg>
                    </button>
                  )}
                  <button type="button" onClick={() => setStmtAccOpen(o => !o)}
                    className="px-3 flex items-center text-[#1360d2]">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: stmtAccOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
                {stmtAccOpen && (() => {
                  const q = stmtAccSearch.toLowerCase();
                  const filtered = ALL_ACCOUNTS.filter(a =>
                    a.account.toLowerCase().includes(q) || a.type.toLowerCase().includes(q)
                  );
                  return (
                    <div className="absolute left-0 right-0 bg-white rounded-[8px] overflow-hidden z-[80]"
                      style={{ top: 48, maxHeight: 220, overflowY: 'auto', boxShadow: '0px 4px 20px rgba(0,0,0,0.14)', border: '1px solid #e0e8f5' }}>
                      {filtered.length === 0 ? (
                        <p className="px-4 py-3 text-[15px] text-[#697498]" style={{ fontFamily: font }}>No accounts found</p>
                      ) : filtered.map((a, idx) => (
                        <button key={idx} type="button"
                          onClick={() => { setStmtAccount(a.account); setStmtAccSearch(''); setStmtAccOpen(false); }}
                          className="w-full px-4 py-[10px] text-left hover:bg-[#f0f4ff] transition-colors flex items-center justify-between gap-3"
                          style={{ background: stmtAccount === a.account ? '#e8f0ff' : undefined }}>
                          <div>
                            <p className="text-[15px] font-medium" style={{ fontFamily: font, color: stmtAccount === a.account ? '#1360d2' : '#0e1b3d' }}>{a.account}</p>
                            <p className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>{a.type}</p>
                          </div>
                          {stmtAccount === a.account && (
                            <svg viewBox="0 0 20 20" width="14" height="14" fill="none" stroke="#1360d2" strokeWidth="2.2">
                              <path d="M4 10l4 4 8-8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>
              {/* Statement type radios */}
              <p className="text-[16px] font-semibold text-[#697498] mb-3" style={{ fontFamily: font }}>Statement Type</p>
              <div className="flex flex-col gap-3 mb-5">
                {([
                  ['summary',     'Monthly Statement (Summary)'],
                  ['detailed',    'Monthly Statement (Detailed)'],
                  ['transaction', 'Transaction List'],
                ] as const).map(([val, label]) => (
                  <label key={val} className="flex items-center gap-3 cursor-pointer p-3 rounded-[8px] border transition-colors"
                    style={{ borderColor: stmtType === val ? '#1360d2' : '#e0e8f5', background: stmtType === val ? '#f0f6ff' : 'white' }}>
                    <input type="radio" name="stmt-type-modal" checked={stmtType === val}
                      onChange={() => { setStmtType(val); setDownloadFmt(''); setStmtRangeError(false); }}
                      className="size-4 accent-[#1360d2]" />
                    <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: stmtType === val ? 600 : 400 }}>{label}</span>
                  </label>
                ))}
              </div>
              {stmtType === 'transaction' && (
                <p className="text-[13px] text-[#0e1b3d] mb-4 p-3 bg-[#fff8e6] rounded border border-[#fcd7a0]" style={{ fontFamily: font }}>
                  <strong>Note*</strong> Report available for 30 days only. For more, extract in batches or use monthly option.
                </p>
              )}
              {stmtRangeError && (
                <div className="flex items-center gap-[8px] rounded-[6px] px-[14px] py-[8px] mb-4" style={{ background: '#fff4f4', border: '1px solid #f5c6cb' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#dc3545" strokeWidth="2" className="flex-shrink-0"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" strokeLinecap="round" /></svg>
                  <p className="text-[14px] text-[#dc3545]" style={{ fontFamily: font }}>Reduce the duration to download statement</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4 mb-5">
                {stmtType !== 'transaction' ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Year *</label>
                      <select value={stmtYear} onChange={e => setStmtYear(e.target.value)}
                        className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white"
                        style={{ fontFamily: font }}>
                        {YEARS.map(y => <option key={y}>{y}</option>)}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[13px] text-[#697498]" style={{ fontFamily: font }}>Month *</label>
                      <select value={stmtMonth} onChange={e => setStmtMonth(e.target.value)}
                        className="w-full h-[42px] border border-[#d5ddfb] rounded-[4px] px-3 text-[16px] text-[#0e1b3d] focus:outline-none focus:border-[#1360d2] bg-white"
                        style={{ fontFamily: font }}>
                        {MONTHS.map(m => <option key={m}>{m}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <DateInput label="From Date" required value={stmtFromDate}
                      onChange={v => { setStmtFromDate(v); setStmtRangeError(false); }} />
                    <DateInput label="To Date" required value={stmtToDate}
                      onChange={v => { setStmtToDate(v); setStmtRangeError(false); }} />
                  </>
                )}
              </div>
              {/* Download format */}
              <p className="text-[16px] font-semibold text-[#697498] mb-3" style={{ fontFamily: font }}>Download Format</p>
              <div className="flex gap-3 mb-6">
                {(['PDF', 'Excel'] as const).map(fmt => (
                  <button key={fmt} onClick={() => setDownloadFmt(fmt)}
                    className="flex-1 h-[44px] rounded-[8px] border text-[16px] font-medium transition-colors"
                    style={{ borderColor: downloadFmt === fmt ? '#1360d2' : '#d5ddfb', background: downloadFmt === fmt ? '#1360d2' : 'white', color: downloadFmt === fmt ? 'white' : '#0e1b3d', fontFamily: font }}>
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#e0e8f5] bg-[#f8fafd]">
              <button onClick={() => { setShowStmtModal(false); setStmtAccount(''); setStmtAccSearch(''); setStmtRangeError(false); }}
                data-secondary-btn className="h-[44px] px-6 rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white" style={{ fontFamily: font }}>
                Cancel
              </button>
              <button
                className="h-[44px] px-6 rounded-[4px] text-[16px] text-white flex items-center gap-2"
                style={{ background: '#1360d2', fontFamily: font }}
                onClick={() => {
                  if (stmtType === 'transaction' && stmtFromDate && stmtToDate) {
                    const diffDays = (Date.parse(stmtToDate) - Date.parse(stmtFromDate)) / 86400000;
                    if (diffDays > 30 || diffDays < 0) { setStmtRangeError(true); return; }
                  }
                  setStmtRangeError(false);
                  setShowStmtModal(false);
                }}
              >
                <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M10 3v10M5 9l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download Statement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recheck modal */}
      {recheckOpen && (
        <TransactionModal
          row={PAYMENT_ROWS[recheckIdx] ?? PAYMENT_ROWS[0]}
          onClose={() => setRecheckOpen(false)}
        />
      )}
    </div>
  );
}
