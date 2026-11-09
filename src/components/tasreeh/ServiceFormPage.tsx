import { useRef, useState } from 'react';
import {
  font, GatePage, GSection, GSubHead, Divider, GAgree, GTag, GValue, GAmount, ResetBtn, IconBtn, GUploader, UploadGrid,
  PrimaryBtn, SecondaryBtn, NeedHelp,
} from '../gatepass/GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import ServiceField, { SPAN, spanOf, displayValue } from './ServiceField';
import type { ServiceConfig, SectionDef, FieldDef, FormValues, RowValues } from './serviceTypes';

type Props = {
  config: ServiceConfig;
  initial: FormValues;
  /** Renew mode: "Renew Request - 121324" title, no drafts, renew-hidden fields removed. */
  renewOf?: string;
  /** Page title override (e.g. "Amend NOC - 7725068610"). */
  titleOverride?: string;
  onHome: () => void;
  onBackToListing: () => void;
  onSubmit: (v: FormValues) => void;
  onSaveDraft: (v: FormValues) => void;
};

/* Figma (all Tasreeh services): png/jpg/gif/pdf, max 5MB per document */
const HINT_5MB = '*Supported file type of .PDF .JPG .PNG .GIF , max file size up to 5MB';

/* 4-per-row field grid; textareas / datetime span two columns */
function FieldGrid({ fields, get, set }: { fields: FieldDef[]; get: (k: string) => string; set: (k: string, v: string) => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[24px]">
      {fields.map(f => (
        <div key={f.key} className={`min-w-0 ${SPAN[spanOf(f)]}`}>
          <ServiceField def={f} value={get(f.key)} onChange={v => set(f.key, v)} />
          {f.hint && <p className="text-[13px] text-[#5a6478] mt-[6px]" style={{ fontFamily: font }}>{f.hint}</p>}
        </div>
      ))}
    </div>
  );
}

function Uploads({ list }: { list: { label: string; required?: boolean }[] }) {
  return (
    <UploadGrid>
      {list.map(u => <GUploader key={u.label} title={u.label} required={u.required} hint={HINT_5MB} />)}
    </UploadGrid>
  );
}

/* ── entryTable: entry panel → "… Added" table (like Visitors) ── */
function EntryTable({ s, rows, onChange }: { s: SectionDef; rows: RowValues[]; onChange: (r: RowValues[]) => void }) {
  const fields = s.fields ?? [];
  const blank = () => Object.fromEntries(fields.map(f => [f.key, f.value ?? '']));
  const [entry, setEntry] = useState<RowValues>(blank);
  const [editing, setEditing] = useState<string | null>(null);
  const docsKey = useRef(0);
  const clear = () => { setEntry(blank()); setEditing(null); docsKey.current += 1; };
  const save = () => {
    const row = { ...entry, _id: editing ?? `${s.id}-${Date.now()}` };
    onChange(editing ? rows.map(r => (r._id === editing ? row : r)) : [...rows, row]);
    clear();
  };
  const cols = s.columns ?? fields.filter(f => f.type !== 'textarea').slice(0, 6).map(f => ({ label: f.label, keys: [f.key] }));
  const cell = (r: RowValues, keys: string[]) =>
    keys.map(k => displayValue(fields.find(f => f.key === k), r[k])).filter(x => x !== '-').join(' ') || '-';
  return (
    <>
      <div className="rounded-[8px] p-[20px]" style={{ background: '#f8fafd', border: '1px solid #e6eaf5' }}>
        <FieldGrid fields={fields} get={k => entry[k] ?? ''} set={(k, v) => setEntry(p => ({ ...p, [k]: v }))} />
        {s.uploads?.length ? (
          <div className="mt-[28px]" key={`docs-${docsKey.current}`}>
            <GSubHead>{s.uploadsTitle ?? 'Required Documents'}</GSubHead>
            <Uploads list={s.uploads} />
          </div>
        ) : null}
        <div className="flex justify-end gap-[16px] mt-[20px]">
          <ResetBtn onClick={clear} />
          <PrimaryBtn onClick={save}>{editing ? 'Update' : (s.saveLabel ?? 'Save')}</PrimaryBtn>
        </div>
      </div>
      <Divider />
      <GSubHead right={
        <span className="text-[14px] px-[10px] py-[3px] rounded-[12px]" style={{ background: '#e2ebf9', color: '#1360d2', fontWeight: 500, fontFamily: font }}>
          {rows.length} added
        </span>
      }>{s.tableTitle ?? `${s.title} Added`}</GSubHead>
      <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
        <JourneyTable minWidth={Math.max(700, cols.length * 170 + 110)}>
          <JourneyThead columns={[...cols.map(c => ({ label: c.label })), { label: 'Action', w: 110, filter: false, sticky: true }]} />
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={cols.length + 1} className="text-center text-[16px] text-[#8f94ae] bg-white" style={{ padding: '26px 16px', fontFamily: font }}>
                {s.emptyText ?? 'No records added'}
              </td></tr>
            ) : rows.map(r => (
              <tr key={r._id} style={{ background: editing === r._id ? '#f0f5ff' : undefined }}>
                {cols.map((c, i) => <JourneyTd key={c.label} first={i === 0}>{cell(r, c.keys)}</JourneyTd>)}
                <JourneyTd sticky width={110}>
                  <span className="flex items-center gap-[10px]">
                    <IconBtn kind="edit" label="Edit" onClick={() => { const { _id, ...rest } = r; setEntry(rest); setEditing(_id); docsKey.current += 1; }} />
                    <IconBtn kind="delete" label="Remove" onClick={() => { onChange(rows.filter(x => x._id !== r._id)); if (editing === r._id) clear(); }} />
                  </span>
                </JourneyTd>
              </tr>
            ))}
          </tbody>
        </JourneyTable>
      </div>
    </>
  );
}

/* ── repeatRows: inline rows + delete + Add More (like Vehicles) ── */
function RepeatRows({ s, rows, onChange }: { s: SectionDef; rows: RowValues[]; onChange: (r: RowValues[]) => void }) {
  const fields = s.fields ?? [];
  const setCell = (id: string, k: string, v: string) => onChange(rows.map(r => (r._id === id ? { ...r, [k]: v } : r)));
  return (
    <>
      <div className="flex flex-col gap-[16px]">
        {rows.map(r => (
          <div key={r._id} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-[20px] gap-y-[24px]">
            {fields.map(f => <div key={f.key} className="min-w-0"><ServiceField def={f} value={r[f.key] ?? ''} onChange={v => setCell(r._id, f.key, v)} /></div>)}
            <div className="flex items-center">
              <IconBtn kind="delete" label="Remove row" onClick={() => onChange(rows.length > 1 ? rows.filter(x => x._id !== r._id) : [{ _id: `${s.id}-0` }])} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" data-secondary-btn onClick={() => onChange([...rows, { _id: `${s.id}-${Date.now()}` }])}
        className="mt-[18px] h-[44px] px-[18px] rounded-[4px] border border-[#1360d2] text-[16px] text-[#1360d2] bg-white hover:bg-[#f0f4ff]"
        style={{ fontFamily: font, fontWeight: 500 }}>
        {s.addMoreLabel ?? '+ Add More'}
      </button>
    </>
  );
}

/* Info banner (blue) used by fields / agreements sections */
export function InfoBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-[10px] rounded-[8px] px-[16px] py-[12px] mb-[20px]" style={{ background: '#e8f0fd', border: '1px solid #b9cff5' }}>
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#1360d2" strokeWidth="1.8" className="flex-shrink-0">
        <circle cx="12" cy="12" r="9.5" /><path d="M12 11v6M12 7.5v.01" strokeLinecap="round" />
      </svg>
      <p className="text-[15px] text-[#0e1b3d]" style={{ fontFamily: font }}>{text}</p>
    </div>
  );
}

/* ── agreements: download the template, sign, upload it back (Vessel — General Agreements) ── */
function Agreements({ s }: { s: SectionDef }) {
  return (
    <>
      {s.alert && <InfoBanner text={s.alert} />}
      <div className="flex flex-col gap-[20px]">
        {(s.agreements ?? []).map(doc => (
          <div key={doc} className="grid grid-cols-1 lg:grid-cols-2 gap-[20px] items-start">
            <div className="bg-white rounded-[8px] p-[20px] flex items-center justify-between gap-[12px]" style={{ boxShadow: '1px 2px 12px 0px rgba(0,0,0,0.06)' }}>
              <div className="flex items-center gap-[12px] min-w-0">
                <span className="size-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0" style={{ border: '1px solid #7681ab' }}>
                  <svg width="18" height="22" viewBox="0 0 18 22" fill="none"><path d="M11 2H3C1.9 2 1 2.9 1 4V20C1 21.1 1.9 22 3 22H15C16.1 22 17 21.1 17 20V8L11 2Z" stroke="#7681AB" strokeWidth="1.5" strokeLinejoin="round" /><path d="M11 2V8H17" stroke="#7681AB" strokeWidth="1.5" strokeLinejoin="round" /><path d="M5 13H13M5 17H9" stroke="#7681AB" strokeWidth="1.5" strokeLinecap="round" /></svg>
                </span>
                <div className="min-w-0">
                  <p className="text-[16px] text-[#060c28] truncate" style={{ fontFamily: font, fontWeight: 500 }}>{doc}</p>
                  <p className="text-[14px] text-[#919191]" style={{ fontFamily: font }}>Download, sign and upload back</p>
                </div>
              </div>
              <button type="button" className="flex items-center gap-[8px] text-[14px] text-[#1360d2] hover:underline whitespace-nowrap" style={{ fontFamily: font, fontWeight: 500 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2V10M8 10L5 7M8 10L11 7" stroke="#1360D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M2 14H14" stroke="#1360D2" strokeWidth="1.5" strokeLinecap="round" /></svg>
                Download
              </button>
            </div>
            <GUploader title={`Upload Signed ${doc}`} required template={false} hint={HINT_5MB} />
          </div>
        ))}
      </div>
    </>
  );
}

/** Generic Tasreeh service form — SIRA card layout, 4 fields per row, library uploaders. */
export default function ServiceFormPage({ config: cfg, initial, renewOf, titleOverride, onHome, onBackToListing, onSubmit, onSaveDraft }: Props) {
  const [v, setV] = useState<FormValues>(initial);
  const [agree, setAgree] = useState(false);
  const setField = (k: string, val: string) => setV(p => ({ ...p, fields: { ...p.fields, [k]: val } }));
  const setList = (id: string, rows: RowValues[]) => setV(p => ({ ...p, lists: { ...p.lists, [id]: rows } }));

  return (
    <GatePage
      title={titleOverride ?? (renewOf ? `Renew Request - ${renewOf}` : cfg.title)}
      crumb={cfg.title}
      titleExtra={renewOf ? undefined : <NeedHelp />}
      onHome={onHome}
      onListing={onBackToListing}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
      footerRight={
        <>
          {!renewOf && <SecondaryBtn onClick={() => onSaveDraft(v)}>Save As Drafts</SecondaryBtn>}
          {/* No blocking validation — the prototype always moves forward. */}
          <PrimaryBtn onClick={() => onSubmit(v)}>Submit</PrimaryBtn>
        </>
      }
    >
      {cfg.sections.map(s => (
        <GSection key={s.id} title={s.title} right={s.badge ? (
          <div className="flex items-center gap-[8px]">
            <span className="text-[14px] text-[#1a1a1a]" style={{ fontFamily: font }}>{s.badge.label}:</span>
            <GTag label={s.badge.value} tone={s.badge.tone} />
          </div>
        ) : undefined}>
          {s.info && <InfoBanner text={s.info} />}
          {s.kind === 'payment' && <GValue label="Total Payment Amount"><GAmount value={s.amount ?? '0.00'} /></GValue>}
          {s.kind === 'fields' && (
            <>
              <FieldGrid fields={(s.fields ?? []).filter(f => !(renewOf && cfg.renew?.hideFields?.includes(f.key)))} get={k => v.fields[k] ?? ''} set={setField} />
              {s.uploads?.length ? (
                <div className="mt-[28px]">
                  <GSubHead>Documents</GSubHead>
                  <Uploads list={s.uploads} />
                </div>
              ) : null}
            </>
          )}
          {s.kind === 'uploads' && <Uploads list={s.uploads ?? []} />}
          {s.kind === 'entryTable' && <EntryTable s={s} rows={v.lists[s.id] ?? []} onChange={r => setList(s.id, r)} />}
          {s.kind === 'repeatRows' && <RepeatRows s={s} rows={v.lists[s.id] ?? [{ _id: `${s.id}-0` }]} onChange={r => setList(s.id, r)} />}
          {s.kind === 'agreements' && <Agreements s={s} />}
        </GSection>
      ))}

      <GAgree checked={agree} onChange={setAgree}>{cfg.agreement}</GAgree>
    </GatePage>
  );
}
