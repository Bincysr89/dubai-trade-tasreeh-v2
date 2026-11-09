import { useState } from 'react';
import DdoSearchFlyout from './DdoSearchFlyout';
import DdoRequestPage from './DdoRequestPage';
import DdoPartyForm from './DdoPartyForm';
import DdoDocumentsPage from './DdoDocumentsPage';
import DdoPaymentPage from './DdoPaymentPage';
import DdoSuccessPage from './DdoSuccessPage';

export interface DdoPartyData {
  partyName: string;
  representative: string;
  email: string;
  phone: string;
}

type Step = 'search' | 'request' | 'bl-party' | 'ddo-party' | 'documents' | 'payment' | 'success';

interface Props {
  onClose: () => void;
}

export default function DdoFlow({ onClose }: Props) {
  const [step, setStep] = useState<Step>('search');
  const [bol, setBol] = useState('BOL324565477');
  const [shippingAgent, setShippingAgent] = useState('Msk T180 s12345');
  const [blParty, setBlParty] = useState<DdoPartyData>({ partyName: '', representative: '', email: '', phone: '' });
  const [ddoParty, setDdoParty] = useState<DdoPartyData>({ partyName: '', representative: '', email: '', phone: '' });
  const [blPartyDone, setBlPartyDone] = useState(false);
  const [ddoPartyDone, setDdoPartyDone] = useState(false);
  const [documentsDone, setDocumentsDone] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('10 - 11 AM');
  const [remarks, setRemarks] = useState('');

  const requestingParty = 'MAERSK KANOO LLC UNITED DUBAI';

  return (
    <>
      {step === 'search' && (
        <DdoSearchFlyout
          bol={bol}
          setBol={setBol}
          shippingAgent={shippingAgent}
          setShippingAgent={setShippingAgent}
          onClose={onClose}
          onSearch={() => setStep('request')}
        />
      )}
      {step === 'request' && (
        <DdoRequestPage
          bol={bol}
          requestingParty={requestingParty}
          blParty={blPartyDone ? blParty : null}
          ddoParty={ddoPartyDone ? ddoParty : null}
          documentsDone={documentsDone}
          selectedSlot={selectedSlot}
          setSelectedSlot={setSelectedSlot}
          remarks={remarks}
          setRemarks={setRemarks}
          onBack={onClose}
          onBLParty={() => setStep('bl-party')}
          onDDOParty={() => setStep('ddo-party')}
          onDocuments={() => setStep('documents')}
          onPay={() => setStep('payment')}
        />
      )}
      {step === 'bl-party' && (
        <DdoPartyForm
          partyType="bl"
          requestingParty={requestingParty}
          data={blParty}
          onSave={(data) => {
            setBlParty(data);
            setBlPartyDone(true);
            setStep('request');
          }}
          onCancel={() => setStep('request')}
        />
      )}
      {step === 'ddo-party' && (
        <DdoPartyForm
          partyType="ddo"
          requestingParty={requestingParty}
          blParty={blParty}
          data={ddoParty}
          onSave={(data) => {
            setDdoParty(data);
            setDdoPartyDone(true);
            setStep('request');
          }}
          onCancel={() => setStep('request')}
        />
      )}
      {step === 'documents' && (
        <DdoDocumentsPage
          onSave={() => {
            setDocumentsDone(true);
            setStep('request');
          }}
          onCancel={() => setStep('request')}
        />
      )}
      {step === 'payment' && (
        <DdoPaymentPage
          amount={301.67}
          onBack={() => setStep('request')}
          onConfirm={() => setStep('success')}
        />
      )}
      {step === 'success' && (
        <DdoSuccessPage
          bol={bol}
          onDone={onClose}
        />
      )}
    </>
  );
}
