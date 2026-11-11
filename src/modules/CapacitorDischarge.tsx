import React from 'react';
import { BigText, Hint, Result } from '../components/ui';

export const CapacitorDischarge: React.FC = () => (
  <div className="space-y-4">
    <Result tone="warn" label="Istruzione">
      <div className="mx-auto mb-4 h-24 w-10 rounded-lg border-4 border-ink-600 bg-ink-950 p-1">
        <div className="h-full w-full origin-bottom animate-pulse rounded-sm bg-gradient-to-t from-red-600 to-amber-400" />
      </div>
      <BigText>Tieni abbassata la leva</BigText>
      <p className="mt-2 text-sm text-ink-300">
        Scarica il condensatore prima che si sovraccarichi, tirando e tenendo la leva verso il basso.
      </p>
    </Result>
    <Hint className="text-center text-xs">Rilasciala quando la carica è scesa, poi ricontrolla il modulo di tanto in tanto.</Hint>
  </div>
);
