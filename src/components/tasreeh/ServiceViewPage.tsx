import {
  font, GatePage, GSection, GSubHead, Grid4, GValue, GTag, toneFor, GFileChip, GAmount, Divider, PrimaryBtn, SecondaryBtn,
} from '../gatepass/GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import { displayValue, SPAN, spanOf } from './ServiceField';
import type { ServiceConfig, ServiceRow, SectionDef, RowValues } from './serviceTypes';

type Props = {
  config: ServiceConfig;
  row: ServiceRow;
  onHome: () => void;
  onBackToListing: () => void;
  onCancelRequest: () => void;
};

const Files = ({ labels }: { labels: string[] }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
    {labels.map(l => <GFileChip key={l} label={l} file="filename.png" />)}
  </div>
);

function ListTable({ s, rows }: { s: SectionDef; rows: RowValues[] }) {
  const fields = s.fields ?? [];
  const cols = s.columns ?? fields.filter(f => f.type !== 'textarea').map(f => ({ label: f.label, keys: [f.key] }));
  const filled = rows.filter(r => Object.entries(r).some(([k, v]) => k !== '_id' && v));
  return (
    <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
      <JourneyTable minWidth={Math.max(600, cols.length * 160)}>
        <JourneyThead columns={cols.map(c => ({ label: c.label }))} />
        <tbody>
          {filled.length === 0 ? (
            <tr><td colSpan={cols.length} className="text-center text-[16px] text-[#8f94ae] bg-white" style={{ padding: '26px 16px', fontFamily: font }}>
              {s.emptyText ?? 'No records added'}
            </td></tr>
          ) : filled.map((r, i) => (
            <tr key={r._id ?? i}>
              {cols.map((c, ci) => (
                <JourneyTd key={c.label} first={ci === 0}>
                  {c.keys.map(k => displayValue(fields.find(f => f.key === k), r[k])).filter(x => x !== '-').join(' ') || '-'}
                </JourneyTd>
              ))}
            </tr>
          ))}
        </tbody>
      </JourneyTable>
    </div>
  );
}

/** Generic Tasreeh View Request — same cards as the form, read-only; Status is the third field. */
export default function ServiceViewPage({ config: cfg, row, onHome, onBackToListing, onCancelRequest }: Props) {
  const canCancel = row.status !== 'Cancelled' && row.status !== 'Rejected';
  let firstFields = true;

  return (
    <GatePage
      title={`View Request - ${row.applicationNo.slice(-6)}`}
      crumb={cfg.title}
      onHome={onHome}
      onListing={onBackToListing}
      actions={canCancel ? <PrimaryBtn onClick={onCancelRequest}>Cancel Request</PrimaryBtn> : undefined}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
    >
      {cfg.sections.map(s => {
        const isFirst = s.kind === 'fields' && firstFields;
        if (isFirst) firstFields = false;
        return (
          <GSection key={s.id} title={s.title} right={s.badge ? (
            <div className="flex items-center gap-[8px]">
              <span className="text-[14px] text-[#1a1a1a]" style={{ fontFamily: font }}>{s.badge.label}:</span>
              <GTag label={s.badge.value} tone={s.badge.tone} />
            </div>
          ) : undefined}>
            {s.kind === 'fields' && (
              <>
                <Grid4>
                  {isFirst && (
                    <>
                      <GValue label="Application Number:" value={row.applicationNo} />
                      <GValue label="Creation Date" value={row.createdOn} />
                      {/* Status sits as the third field, after the date */}
                      <GValue label="Status:"><span><GTag label={row.status} tone={toneFor(row.status)} /></span></GValue>
                    </>
                  )}
                  {(s.fields ?? []).map(f => (
                    <div key={f.key} className={`min-w-0 ${f.type === 'textarea' || f.type === 'datetime' ? SPAN[spanOf(f)] : ''}`}>
                      {f.type === 'amount'
                        ? <GValue label={f.label}><GAmount value={row.values.fields[f.key] || f.value || '0.00'} /></GValue>
                        : <GValue label={f.label} value={displayValue(f, row.values.fields[f.key] ?? f.value)} />}
                    </div>
                  ))}
                </Grid4>
                {s.uploads?.length ? (<><Divider /><GSubHead>Document Details</GSubHead><Files labels={s.uploads.map(u => u.label)} /></>) : null}
              </>
            )}
            {s.kind === 'payment' && <GValue label="Total Payment Amount"><GAmount value={s.amount ?? '0.00'} /></GValue>}
            {s.kind === 'uploads' && <Files labels={(s.uploads ?? []).map(u => u.label)} />}
            {s.kind === 'agreements' && <Files labels={(s.agreements ?? []).flatMap(d => [d, `${d} (Signed)`])} />}
            {(s.kind === 'entryTable' || s.kind === 'repeatRows') && (
              <>
                <ListTable s={s} rows={row.values.lists[s.id] ?? []} />
                {s.kind === 'entryTable' && s.uploads?.length ? (
                  <><Divider /><GSubHead>Document Details</GSubHead><Files labels={s.uploads.map(u => u.label)} /></>
                ) : null}
              </>
            )}
          </GSection>
        );
      })}
    </GatePage>
  );
}
