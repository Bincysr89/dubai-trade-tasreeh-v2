import { useState } from 'react';
import CargoTrackingSearchPage, { type SearchBy } from './CargoTrackingSearchPage';
import CargoTrackingDetailPage from './CargoTrackingDetailPage';
import { searchByDeclaration, searchByBolAwb, type Channel, type Movement, type CargoSearchResult } from './cargoTrackingData';

type Props = { onBack: () => void };

/**
 * Holds all search-form and results state so it survives navigating into the
 * Cargo Status detail page and back ("Back to Search Results" preserves the
 * previously entered search).
 */
export default function CargoTrackingContainer({ onBack }: Props) {
  const [searchBy, setSearchBy] = useState<SearchBy>('declaration');
  const [declarationNo, setDeclarationNo] = useState('');
  const [channel, setChannel] = useState<Channel>('Sea');
  const [movement, setMovement] = useState<Movement>('Inbound');
  const [bolNo, setBolNo] = useState('');
  const [rotationNo, setRotationNo] = useState('');
  const [results, setResults] = useState<CargoSearchResult[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedResult, setSelectedResult] = useState<CargoSearchResult | null>(null);

  const handleSearch = () => {
    const found = searchBy === 'declaration'
      ? searchByDeclaration(declarationNo)
      : searchByBolAwb(bolNo, channel, movement, rotationNo);
    setResults(found);
    setHasSearched(true);
  };

  const handleReset = () => {
    setSearchBy('declaration');
    setDeclarationNo('');
    setChannel('Sea');
    setMovement('Inbound');
    setBolNo('');
    setRotationNo('');
    setResults(null);
    setHasSearched(false);
  };

  if (selectedResult) {
    return <CargoTrackingDetailPage result={selectedResult} onBack={() => setSelectedResult(null)} onBackToListing={onBack} />;
  }

  return (
    <CargoTrackingSearchPage
      onBack={onBack}
      searchBy={searchBy}
      setSearchBy={setSearchBy}
      declarationNo={declarationNo}
      setDeclarationNo={setDeclarationNo}
      channel={channel}
      setChannel={setChannel}
      movement={movement}
      setMovement={setMovement}
      bolNo={bolNo}
      setBolNo={setBolNo}
      rotationNo={rotationNo}
      setRotationNo={setRotationNo}
      results={results}
      hasSearched={hasSearched}
      onSearch={handleSearch}
      onReset={handleReset}
      onViewCargoStatus={setSelectedResult}
    />
  );
}
