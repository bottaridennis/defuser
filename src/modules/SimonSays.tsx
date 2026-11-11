import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { useBombContext } from '../context/BombContext';
import { GhostButton, Hint, Panel, QuickFacts, Result, ResetButton, cx } from '../components/ui';

type C = 'red' | 'blue' | 'green' | 'yellow';

const COLORS: Record<C, { label: string; cls: string; text: string }> = {
  red: { label: 'Rosso', cls: 'bg-red-500', text: 'text-white' },
  blue: { label: 'Blu', cls: 'bg-blue-500', text: 'text-white' },
  green: { label: 'Verde', cls: 'bg-green-500', text: 'text-ink-950' },
  yellow: { label: 'Giallo', cls: 'bg-yellow-400', text: 'text-ink-950' },
};
const ORDER: C[] = ['red', 'blue', 'green', 'yellow'];

// Tabelle del manuale: [errori][colore lampeggiato] -> colore da premere
const WITH_VOWEL: Record<C, C>[] = [
  { red: 'blue', blue: 'red', green: 'yellow', yellow: 'green' },
  { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' },
  { red: 'green', blue: 'red', green: 'yellow', yellow: 'blue' },
];
const NO_VOWEL: Record<C, C>[] = [
  { red: 'blue', blue: 'yellow', green: 'green', yellow: 'red' },
  { red: 'red', blue: 'blue', green: 'yellow', yellow: 'green' },
  { red: 'yellow', blue: 'green', green: 'blue', yellow: 'red' },
];

export const SimonSays: React.FC = () => {
  const { hasVowel, strikes } = useBombContext();
  const [seq, setSeq] = useState<C[]>([]);

  const table = hasVowel === undefined ? null : (hasVowel ? WITH_VOWEL : NO_VOWEL)[Math.min(strikes, 2)];

  return (
    <div className="space-y-4">
      <QuickFacts facts={['serial', 'strikes']} highlight={hasVowel === undefined ? ['serial'] : []} />

      {table && (
        <Panel title="Tabella attiva" right={<span className="font-mono text-[11px] text-ink-400">{hasVowel ? 'con vocale' : 'senza vocali'} · {strikes} err.</span>}>
          <div className="grid grid-cols-4 gap-1.5 text-center text-[11px]">
            {ORDER.map((c) => (
              <div key={c} className="overflow-hidden rounded-lg border border-ink-700">
                <div className={cx('py-1 font-semibold', COLORS[c].cls, COLORS[c].text)}>{COLORS[c].label}</div>
                <div className="py-0.5 text-ink-500">↓</div>
                <div className={cx('py-1 font-semibold', COLORS[table[c]].cls, COLORS[table[c]].text)}>{COLORS[table[c]].label}</div>
              </div>
            ))}
          </div>
        </Panel>
      )}

      <Panel
        title="Cosa lampeggia? (in ordine)"
        right={
          <>
            <GhostButton onClick={() => setSeq((s) => s.slice(0, -1))} disabled={!seq.length} aria-label="Annulla ultimo">
              <Delete size={14} />
            </GhostButton>
            <ResetButton onClick={() => setSeq([])} disabled={!seq.length} />
          </>
        }
      >
        <div className="mx-auto grid max-w-xs grid-cols-2 gap-3">
          {ORDER.map((c) => (
            <button
              key={c}
              type="button"
              disabled={!table}
              onClick={() => setSeq((s) => [...s, c])}
              className={cx(
                'h-20 rounded-2xl font-bold shadow-[inset_0_-6px_0_rgba(0,0,0,0.25)] transition-transform active:scale-95 active:brightness-125 disabled:opacity-30 disabled:grayscale sm:h-24',
                COLORS[c].cls,
                COLORS[c].text,
              )}
            >
              {COLORS[c].label}
            </button>
          ))}
        </div>
        <Hint className="mt-3 text-center text-xs">
          Aggiungi solo il nuovo colore a ogni giro: la sequenza da premere si aggiorna da sola (anche se cambiano gli errori).
        </Hint>
      </Panel>

      {!table ? (
        <Result tone="warn" label="Serve il numero seriale">
          <p className="text-ink-300">Bisogna sapere se il seriale contiene una vocale.</p>
        </Result>
      ) : seq.length === 0 ? (
        <Result tone="idle">
          <p className="text-sm text-ink-400">Tocca il primo colore che lampeggia.</p>
        </Result>
      ) : (
        <Result tone="go" label="Premi in quest'ordine">
          <ol className="mt-1 flex flex-wrap justify-center gap-2">
            {seq.map((c, i) => {
              const out = table[c];
              return (
                <li
                  key={i}
                  className={cx(
                    'flex h-12 min-w-12 items-center gap-1.5 rounded-xl px-3 text-sm font-bold',
                    COLORS[out].cls,
                    COLORS[out].text,
                    i === seq.length - 1 && 'ring-2 ring-white/80 ring-offset-2 ring-offset-ink-900',
                  )}
                >
                  <span className="font-mono text-[10px] opacity-70">{i + 1}</span>
                  {COLORS[out].label}
                </li>
              );
            })}
          </ol>
        </Result>
      )}
    </div>
  );
};
