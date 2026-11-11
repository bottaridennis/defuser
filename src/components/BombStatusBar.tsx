import React from 'react';
import { BatteryMedium, Settings2 } from 'lucide-react';
import { useBombContext } from '../context/BombContext';

/** Riepilogo compatto dei dati bomba. Su mobile apre il pannello di configurazione. */
export const BombStatusBar: React.FC = () => {
  const { serial, batteries, strikes, indicators, setConfigOpen } = useBombContext();

  return (
    <button
      type="button"
      onClick={() => setConfigOpen(true)}
      className="flex h-10 items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-850 pl-3 pr-2 font-mono text-xs text-ink-300 transition-colors hover:border-ink-500 lg:pointer-events-none lg:pr-3"
      aria-label="Modifica dati bomba"
    >
      <span className={serial ? 'font-bold tracking-wider text-ink-100' : 'text-ink-500'}>{serial || 'SERIALE?'}</span>
      <span className="h-4 w-px bg-ink-700" />
      <span className="flex items-center gap-1">
        <BatteryMedium size={14} className="text-ink-500" />
        {batteries ?? '?'}
      </span>
      <span className="hidden items-center gap-1 sm:flex">
        <span className="h-4 w-px bg-ink-700" />
        <span className={strikes ? 'text-stop' : ''}>{strikes ? '✕'.repeat(strikes) : '0✕'}</span>
      </span>
      {indicators.length > 0 && (
        <span className="hidden text-signal md:inline">
          {indicators.slice(0, 2).join(' ')}
          {indicators.length > 2 && '…'}
        </span>
      )}
      <span className="grid h-7 w-7 place-items-center rounded-lg bg-signal text-ink-950 lg:hidden">
        <Settings2 size={15} />
      </span>
    </button>
  );
};
