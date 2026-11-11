import React, { useMemo, useState } from 'react';
import { BigText, Hint, Panel, Result, ResetButton, cx } from '../components/ui';

// Le 35 password del manuale ufficiale italiano (versione 1-it)
const WORDS = [
  'abaco', 'aceto', 'adoro', 'balzo', 'capra',
  'dacci', 'danno', 'danza', 'detto', 'dieci',
  'dieta', 'entro', 'festa', 'fiera', 'gnomo',
  'hotel', 'largo', 'latte', 'nuoto', 'opera',
  'pizza', 'posto', 'pozzo', 'radio', 'salve',
  'salvi', 'scudo', 'secco', 'sigla', 'tanto',
  'tempo', 'tetro', 'tetto', 'tosse', 'tozzo',
];

export const Password: React.FC = () => {
  const [cols, setCols] = useState(['', '', '', '', '']);

  const set = (i: number, v: string) =>
    setCols((c) => {
      const n = [...c];
      n[i] = [...new Set(v.toLowerCase().replace(/[^a-z]/g, ''))].join('').slice(0, 6);
      return n;
    });

  const matches = useMemo(
    () => WORDS.filter((w) => cols.every((letters, i) => !letters || letters.includes(w[i]))),
    [cols],
  );

  // Lettere "utili" per colonna: quelle che compaiono nelle password ancora possibili
  const useful = (i: number) => new Set(matches.map((w) => w[i]));

  return (
    <div className="space-y-4">
      <Panel title="Lettere disponibili per colonna" right={<ResetButton onClick={() => setCols(['', '', '', '', ''])} disabled={cols.every((c) => !c)} />}>
        <Hint className="mb-3 text-xs">
          Scrivi di seguito le 6 lettere che scorrono in ogni colonna. Di solito bastano le prime due o tre colonne.
        </Hint>
        <div className="grid grid-cols-5 gap-1.5 sm:gap-3">
          {cols.map((v, i) => (
            <label key={i} className="flex min-w-0 flex-col gap-1.5">
              <span className="text-center font-mono text-[11px] font-bold text-ink-500">{i + 1}</span>
              <input
                value={v.toUpperCase()}
                onChange={(e) => set(i, e.target.value)}
                autoCapitalize="characters"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                inputMode="text"
                aria-label={`Lettere della colonna ${i + 1}`}
                className={cx(
                  'h-12 w-full rounded-xl border bg-ink-850 px-1 text-center font-mono text-base font-bold uppercase text-ink-100 outline-none focus:border-signal sm:h-14 sm:text-lg sm:tracking-[0.15em]',
                  v ? 'border-ink-500' : 'border-ink-700',
                )}
              />
              {v && (
                <span className="flex flex-wrap justify-center gap-0.5 font-mono text-[11px] font-bold uppercase">
                  {v.split('').map((l) => (
                    <span key={l} className={useful(i).has(l) ? 'text-signal' : 'text-ink-600 line-through'}>
                      {l}
                    </span>
                  ))}
                </span>
              )}
            </label>
          ))}
        </div>
      </Panel>

      {matches.length === 1 ? (
        <Result tone="go" label="La password è">
          <BigText className="uppercase tracking-[0.3em]">{matches[0]}</BigText>
        </Result>
      ) : matches.length === 0 ? (
        <Result tone="stop" label="Nessuna password">
          <p className="text-ink-300">Nessuna parola compatibile: ricontrolla le lettere.</p>
        </Result>
      ) : (
        <Panel title={`Password possibili (${matches.length})`}>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
            {matches.map((w) => (
              <span key={w} className="rounded-lg border border-ink-700 bg-ink-850 py-2 text-center font-mono text-sm font-bold uppercase tracking-widest text-ink-100">
                {w}
              </span>
            ))}
          </div>
        </Panel>
      )}
    </div>
  );
};
