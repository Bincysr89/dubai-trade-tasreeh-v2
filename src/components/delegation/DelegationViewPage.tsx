import { font, GatePage, GSection, Grid4, GValue, GTag, toneFor, PrimaryBtn, SecondaryBtn } from '../gatepass/GateFields';
import { JourneyTable, JourneyThead, JourneyTd } from '../declaration/DeclarationUI';
import { fromIso } from '../gatepass/gatePassData';
import { DELEGATION_TITLE, COMPANY, shortRef, type DelegationRow } from './delegationData';

type Props = {
  row: DelegationRow;
  onHome: () => void;
  onBackToListing: () => void;
  onCancelRequest: () => void;
};

const Empty = ({ cols, text }: { cols: number; text: string }) => (
  <tr>
    <td colSpan={cols} className="text-center text-[16px] text-[#8f94ae] bg-white" style={{ padding: '26px 16px', fontFamily: font }}>{text}</td>
  </tr>
);

/* Delegation Visits — View Request (Figma 3:14899) */
export default function DelegationViewPage({ row, onHome, onBackToListing, onCancelRequest }: Props) {
  const f = row.form;
  const canCancel = row.status !== 'Cancelled' && row.status !== 'Rejected';
  const vehicles = f.vehicles.filter(v => v.emirate || v.plate);

  return (
    <GatePage
      title={`View Request - ${shortRef(row)}`}
      crumb={DELEGATION_TITLE}
      onHome={onHome}
      onListing={onBackToListing}
      actions={canCancel ? <PrimaryBtn onClick={onCancelRequest}>Cancel Request</PrimaryBtn> : undefined}
      footerLeft={<SecondaryBtn onClick={onBackToListing}>Back To Listing</SecondaryBtn>}
    >
      <GSection title="Basic Information">
        <Grid4>
          <GValue label="Application Number:" value={row.applicationNo} />
          <GValue label="Creation Date" value={row.createdOn} />
          {/* Status sits as the third field, after the date */}
          <GValue label="Status:"><span><GTag label={row.status} tone={toneFor(row.status)} /></span></GValue>
          <GValue label="Company Name" value={COMPANY.name} />
          <GValue label="Trade License Number" value={COMPANY.licenseNo} />
          <GValue label="Trade License Source" value={COMPANY.licenseSource} />
          <GValue label="Trade License Expiry Date" value={COMPANY.licenseExpiry} />
          <GValue label="Applicant Remarks" value={f.remarks} />
        </Grid4>
      </GSection>

      <GSection title="Visit Details">
        <Grid4>
          <GValue label="Visit Date/Time">
            <span className="text-[16px] text-[#1a1a1a] flex items-center gap-[10px]" style={{ fontFamily: font }}>
              {fromIso(f.visitDate) || '-'}
              <span className="w-px h-[16px] bg-[#cbd5e1]" />
              {f.visitHrs ? `${f.visitHrs}:${f.visitMins || '00'}` : '-'}
            </span>
          </GValue>
          <GValue label="Port" value={f.port} />
          <GValue label="Gate Number" value={f.gate} />
          <GValue label="Contact Email" value={f.email} />
          <GValue label="Contact Mobile" value={f.mobile ? `${f.countryCode} ${f.mobile}` : ''} />
          <GValue label="Reason of Visit" value={f.reason} />
          <GValue label="Visit Program" value={f.program} />
          <GValue label="Locations" value={f.locations} />
        </Grid4>
      </GSection>

      <GSection title="Visitors' Details">
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
          <JourneyTable minWidth={700}>
            <JourneyThead columns={[{ label: 'Title' }, { label: 'Visitor Name' }, { label: 'Visitor Category' }, { label: 'Position' }]} />
            <tbody>
              {f.visitors.length === 0 ? <Empty cols={4} text="No Visitors Added" /> : f.visitors.map(v => (
                <tr key={v.id}>
                  <JourneyTd first>{v.title || '-'}</JourneyTd>
                  <JourneyTd>{v.name || '-'}</JourneyTd>
                  <JourneyTd>{v.category || '-'}</JourneyTd>
                  <JourneyTd>{v.position || '-'}</JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>

      <GSection title="Vehicles Details">
        <div className="rounded-[8px] overflow-hidden" style={{ border: '1px solid #eef1f8' }}>
          <JourneyTable minWidth={600}>
            <JourneyThead columns={[{ label: 'Emirate' }, { label: 'Other' }, { label: 'Plate Number' }]} />
            <tbody>
              {vehicles.length === 0 ? <Empty cols={3} text="No Vehicles Added" /> : vehicles.map(v => (
                <tr key={v.id}>
                  <JourneyTd first>{v.emirate || '-'}</JourneyTd>
                  <JourneyTd>{v.other || '-'}</JourneyTd>
                  <JourneyTd>{v.plate || '-'}</JourneyTd>
                </tr>
              ))}
            </tbody>
          </JourneyTable>
        </div>
      </GSection>
    </GatePage>
  );
}
