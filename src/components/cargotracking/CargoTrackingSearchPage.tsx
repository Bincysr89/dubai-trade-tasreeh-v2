import Header from '../Header';
import DTSelect from '../DTSelect';
import FloatingField from '../FloatingField';
import type { Channel, Movement, CargoSearchResult } from './cargoTrackingData';

const font = "'Dubai', sans-serif";

export type SearchBy = 'declaration' | 'bolAwb';

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Cleared:   { bg: 'rgba(40,167,69,0.10)',  color: '#28a745' },
  Cancelled: { bg: 'rgba(255,169,26,0.16)', color: '#b45309' },
};

type Props = {
  onBack: () => void;
  searchBy: SearchBy;
  setSearchBy: (v: SearchBy) => void;
  declarationNo: string;
  setDeclarationNo: (v: string) => void;
  channel: Channel;
  setChannel: (v: Channel) => void;
  movement: Movement;
  setMovement: (v: Movement) => void;
  bolNo: string;
  setBolNo: (v: string) => void;
  rotationNo: string;
  setRotationNo: (v: string) => void;
  results: CargoSearchResult[] | null;
  hasSearched: boolean;
  onSearch: () => void;
  onReset: () => void;
  onViewCargoStatus: (result: CargoSearchResult) => void;
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="currentColor" /></svg>
);

export default function CargoTrackingSearchPage({
  onBack, searchBy, setSearchBy, declarationNo, setDeclarationNo,
  channel, setChannel, movement, setMovement, bolNo, setBolNo, rotationNo, setRotationNo,
  results, hasSearched, onSearch, onReset, onViewCargoStatus,
}: Props) {
  const canSearch = searchBy === 'declaration' ? declarationNo.trim().length > 0 : bolNo.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafd] flex flex-col overflow-hidden">
      <div className="flex-shrink-0"><Header onServiceCatalogue={onBack} /></div>

      <div className="flex-1 overflow-y-auto px-4 sm:px-10 pb-8">
        {/* Breadcrumb + agent banner */}
        <div className="flex items-center justify-between mt-[16px] mb-[8px] flex-wrap gap-[10px]">
          <div className="flex items-center gap-[4px] text-[16px]" style={{ fontFamily: font }}>
            <span className="text-[#8f94ae] cursor-pointer hover:text-[#1360d2] transition-colors" onClick={onBack}>Home</span>
            <span className="text-[#dc3545] px-[4px]">/</span>
            <span className="text-[#111838] font-medium">Cargo Tracking</span>
          </div>
          <div className="px-[16px] py-[5px] rounded-[4px] text-[16px] text-[#0e1b3d]" style={{ background: '#e2ebf9', fontFamily: font }}>
            AE-1019056- Dubai Customs - Test LLC
          </div>
        </div>

        <h1 className="text-[28px] font-bold text-[#0e1b3d] mb-[4px]" style={{ fontFamily: font }}>Cargo Tracking</h1>
        <p className="text-[16px] text-[#697498] mb-[24px]" style={{ fontFamily: font }}>
          Search by declaration or transport document number to view real-time cargo status
        </p>

        {/* Search card */}
        <div className="bg-white rounded-[8px] mb-[24px]" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
          <div className="flex items-center gap-[8px] px-[24px] py-[16px] rounded-t-[8px]" style={{ borderBottom: '1px solid #eef1f6' }}>
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none" style={{ color: '#1360d2' }}><path fillRule="evenodd" clipRule="evenodd" d="M11.76 10.27L17.49 16L16 17.49L10.27 11.76C9.2 12.53 7.91 13 6.5 13C2.91 13 0 10.09 0 6.5C0 2.91 2.91 0 6.5 0C10.09 0 13 2.91 13 6.5C13 7.91 12.53 9.2 11.76 10.27ZM6.5 2C4.01 2 2 4.01 2 6.5C2 8.99 4.01 11 6.5 11C8.99 11 11 8.99 11 6.5C11 4.01 8.99 2 6.5 2Z" fill="currentColor" /></svg>
            <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>Search Criteria</span>
          </div>

          <div className="p-[24px]">
          {searchBy === 'declaration' ? (
            <div className="flex flex-nowrap items-end gap-[16px] overflow-x-auto pt-[10px]">
              <div className="w-[220px] flex-shrink-0">
                <DTSelect
                  label="Search By"
                  value={searchBy}
                  onChange={v => setSearchBy(v as SearchBy)}
                  options={[{ value: 'declaration', label: 'Declaration No.' }, { value: 'bolAwb', label: 'BOL / AWB No.' }]}
                  required
                />
              </div>
              <div className="w-[300px] flex-shrink-0">
                <FloatingField
                  label="Declaration Number"
                  required
                  placeholder="e.g. 2026100856123"
                  value={declarationNo}
                  onChange={setDeclarationNo}
                />
              </div>
              <button
                onClick={onSearch}
                disabled={!canSearch}
                className="h-[56px] px-[28px] rounded-[4px] text-[16px] text-white inline-flex items-center gap-[8px] transition-colors disabled:cursor-not-allowed flex-shrink-0"
                style={{ background: canSearch ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500 }}
              >
                <SearchIcon />
                Search
              </button>
              <button data-secondary-btn
                onClick={onReset}
                className="h-[56px] px-[28px] rounded-[4px] border text-[16px] bg-white inline-flex items-center gap-[8px] transition-colors flex-shrink-0"
                style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
              >
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                Reset
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-[20px]">
              <div className="flex flex-nowrap items-end gap-[16px] overflow-x-auto pt-[10px]">
                <div className="w-[220px] flex-shrink-0">
                  <DTSelect
                    label="Search By"
                    value={searchBy}
                    onChange={v => setSearchBy(v as SearchBy)}
                    options={[{ value: 'declaration', label: 'Declaration No.' }, { value: 'bolAwb', label: 'BOL / AWB No.' }]}
                    required
                  />
                </div>
                <div className="w-[200px] flex-shrink-0">
                  <DTSelect
                    label="Channel"
                    value={channel}
                    onChange={v => setChannel(v as Channel)}
                    options={[{ value: 'Sea', label: 'Sea' }, { value: 'Air', label: 'Air' }]}
                    required
                  />
                </div>
                <div className="w-[200px] flex-shrink-0">
                  <DTSelect
                    label="Movement Type"
                    value={movement}
                    onChange={v => setMovement(v as Movement)}
                    options={[{ value: 'Inbound', label: 'Inbound' }, { value: 'Outbound', label: 'Outbound' }]}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-nowrap items-end gap-[16px] overflow-x-auto pt-[10px]">
                <div className="w-[260px] flex-shrink-0">
                  <FloatingField
                    label="Bill of Lading / AWB Number"
                    required
                    placeholder="e.g. NAV9100030225"
                    value={bolNo}
                    onChange={setBolNo}
                  />
                </div>
                <div className="w-[260px] flex-shrink-0">
                  <FloatingField
                    label="Rotation Number"
                    placeholder="e.g. 820489 (optional)"
                    value={rotationNo}
                    onChange={setRotationNo}
                  />
                </div>
                <button
                  onClick={onSearch}
                  disabled={!canSearch}
                  className="h-[56px] px-[28px] rounded-[4px] text-[16px] text-white inline-flex items-center gap-[8px] transition-colors disabled:cursor-not-allowed flex-shrink-0"
                  style={{ background: canSearch ? '#1360d2' : '#a7c3eb', fontFamily: font, fontWeight: 500 }}
                >
                  <SearchIcon />
                  Search
                </button>
                <button data-secondary-btn
                  onClick={onReset}
                  className="h-[56px] px-[28px] rounded-[4px] border text-[16px] bg-white inline-flex items-center gap-[8px] transition-colors flex-shrink-0"
                  style={{ borderColor: '#1360d2', color: '#1360d2', fontFamily: font, fontWeight: 500 }}
                >
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" /></svg>
                  Reset
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Results */}
        {hasSearched && (
          <div className="bg-white rounded-[8px] overflow-hidden" style={{ boxShadow: '0px 5px 32px rgba(143,155,186,0.16)' }}>
            <div className="flex items-center justify-between px-[24px] py-[16px]" style={{ borderBottom: '1px solid #eef1f6' }}>
              <span className="text-[16px] text-[#0e1b3d]" style={{ fontFamily: font, fontWeight: 600 }}>Search Results</span>
              <span className="text-[14px] text-[#8f94ae]" style={{ fontFamily: font }}>
                {results ? `${results.length} record${results.length === 1 ? '' : 's'} found` : ''}
              </span>
            </div>

            {(!results || results.length === 0) ? (
              <div className="py-[40px] text-center text-[16px] text-[#8f94ae]" style={{ fontFamily: font }}>
                No results found. Please check the details and try again.
              </div>
            ) : (
              <div className="overflow-x-auto px-[16px] pt-[8px] pb-[8px]">
                <table style={{ width: '100%', minWidth: 900, borderCollapse: 'separate', borderSpacing: '0 8px', fontFamily: font }}>
                  <thead>
                    <tr>
                      {['Transport Document No. (BOL/AWB)', 'Declaration Number', 'Type', 'Declaration Status', 'Submission Date', 'Clearance Date', 'Cargo Status'].map((h, i) => (
                        <th key={h} className="text-left px-[16px] py-[10px] text-[16px] text-[#051937] whitespace-nowrap"
                          style={{ fontWeight: 500, background: '#a6c2e9', paddingLeft: i === 0 ? 16 : 16, borderRadius: i === 0 ? '8px 0 0 8px' : i === 6 ? '0 8px 8px 0' : undefined }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map(r => {
                      const st = STATUS_STYLE[r.status];
                      return (
                        <tr key={r.id} style={{ boxShadow: '0px 2px 8px rgba(143,155,186,0.14)' }}>
                          <td className="px-[16px] py-[14px] text-[16px] whitespace-nowrap" style={{ color: '#1360d2', fontWeight: 600, background: '#fff', borderRadius: '8px 0 0 8px' }}>{r.transportDocNo}</td>
                          <td className="px-[16px] py-[14px] text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ background: '#fff' }}>{r.declarationNo}</td>
                          <td className="px-[16px] py-[14px] whitespace-nowrap" style={{ background: '#fff' }}>
                            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium" style={{ background: '#e2ebf9', color: '#1360d2', fontFamily: font }}>
                              {r.channel === 'Sea'
                                ? <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 17l1.5-4h15L21 17M6 13V8h12v5M12 3v5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                : <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12l18-7-7 18-2-8-8-3z" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                              {r.channel} {r.movement}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] whitespace-nowrap" style={{ background: '#fff' }}>
                            <span className="inline-flex items-center gap-[5px] px-[10px] py-[3px] rounded-[4px] text-[16px] font-medium" style={{ background: st.bg, color: st.color, fontFamily: font }}>
                              <span className="size-[6px] rounded-full flex-shrink-0" style={{ background: st.color }} />
                              {r.status}
                            </span>
                          </td>
                          <td className="px-[16px] py-[14px] text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ background: '#fff' }}>{r.submissionDate}</td>
                          <td className="px-[16px] py-[14px] text-[16px] text-[#0e1b3d] whitespace-nowrap" style={{ background: '#fff' }}>{r.clearanceDate}</td>
                          <td className="px-[16px] py-[14px] whitespace-nowrap" style={{ background: '#fff', borderRadius: '0 8px 8px 0' }}>
                            <button onClick={() => onViewCargoStatus(r)} className="h-[36px] px-[14px] rounded-[4px] text-[16px] text-white inline-flex items-center gap-[6px] hover:opacity-90 transition-opacity" style={{ background: '#1360d2', fontFamily: font, fontWeight: 500 }}>
                              View Cargo Status
                              <svg viewBox="0 0 20 20" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 4l6 6-6 6" /></svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
