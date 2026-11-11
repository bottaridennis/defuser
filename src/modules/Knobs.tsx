import React, { useMemo, useState } from 'react';
import { BigText, Hint, Panel, Result, ResetButton, cx } from '../components/ui';

const b = (s: string) => s.split('').map((x) => x === '1');

// Disposizione dei LED dal manuale: [riga superiore, riga inferiore], da sinistra a destra.
const CONFIGS: { pos: string; arrow: string; top: boolean[]; bottom: boolean[] }[] = [
  { pos: 'SU', arrow: '↑', top: b('001011'), bottom: b('111101') },
  { pos: 'SU', arrow: '↑', top: b('101010'), bottom: b('011011') },
  { pos: 'GIÙ', arrow: '↓', top: b('011001'), bottom: b('111101') },
  { pos: 'GIÙ', arrow: '↓', top: b('101010'), bottom: b('010001') },
  { pos: 'SINISTRA', arrow: '←', top: b('000010'), bottom: b('100111') },
  { pos: 'SINISTRA', arrow: '←', top: b('000010'), bottom: b('000110') },
  { pos: 'DESTRA', arrow: '→', top: b('101111'), bottom: b('111010') },
  { pos: 'DESTRA', arrow: '→', top: b('101100'), bottom: b('111010') },
];

const EMPTY = () => [Array(6).fill(false), Array(6).fill(false)] as boolean[][];

export const Knobs: React.FC = () => {
  const [leds, setLeds] = useState<boolean[][]>(EMPTY);
  const touched = leds.flat().some(Boolean);

  const toggle = (r: number, c: number) =>
    setLeds((p) => p.map((row, ri) => (ri === r ? row.map((v, ci) => (ci === c ? !v : v)) : row)));

  const ranked = useMemo(
    () =>
      CONFIGS.map((cfg) => ({
        cfg,
        diff: [cfg.top, cfg.bottom].reduce((acc, row, r) => acc + row.filter((v, c) => v !== leds[r][c]).length, 0),
      })).sort((a, b) => a.diff - b.diff),
    [leds],
  );
  const best = ranked[0];
  const bestPositions = new Set(ranked.filter((x) => x.diff === best.diff).map((x) => x.cfg.pos));
  const unique = bestPositions.size === 1;

  return (
    <div className="space-y-4">
      <Panel title="Quali LED sono accesi?" right={<ResetButton onClick={() => setLeds(EMPTY())} disabled={!touched} />}>
        <Hint className="mb-4 text-xs">Due file da 6 LED, sopra e sotto la manopola. Basta la fila superiore per quasi tutti i casi.</Hint>
        <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-ink-700 bg-ink-950 p-4">
          {leds.map((row, r) => (
            <div key={r} className="grid grid-cols-[repeat(3,1fr)_12px_repeat(3,1fr)] gap-2">
              {row.map((on, c) => (
                <React.Fragment key={c}>
                  {c === 3 && <span />}
                  <button
                    type="button"
                    aria-pressed={on}
                    aria-label={`LED fila ${r === 0 ? 'superiore' : 'inferiore'} ${c + 1}`}
                    onClick={() => toggle(r, c)}
                    className={cx(
                      'aspect-square rounded-full border-2 transition-[background,box-shadow,border-color] active:scale-90',
                      on ? 'border-amber-200 bg-signal shadow-[0_0_14px_var(--color-signal)]' : 'border-ink-600 bg-ink-850',
                    )}
                  />
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </Panel>

      {!touched ? (
        <Result tone="idle">
          <p className="text-sm text-ink-400">Accendi i LED come appaiono sulla bomba.</p>
        </Result>
      ) : best.diff === 0 || (unique && best.diff <= 2) ? (
        <Result tone={best.diff === 0 ? 'go' : 'warn'} label={best.diff === 0 ? 'Gira la manopola verso' : `Probabile (differenza di ${best.diff} LED)`}>
          <BigText className="text-5xl sm:text-6xl">
            <span className="text-signal">{best.cfg.arrow}</span> {best.cfg.pos}
          </BigText>
          <p className="mt-2 text-xs text-ink-400">Rispetto all'etichetta “UP”, che potrebbe essere ruotata.</p>
        </Result>
      ) : (
        <Result tone="idle" label="Nessuna corrispondenza esatta">
          <p className="text-sm text-ink-400">
            {unique ? 'Configurazione troppo diversa: ricontrolla i LED.' : `Possibili: ${[...bestPositions].join(', ')}. Controlla anche la fila inferiore.`}
          </p>
        </Result>
      )}
    </div>
  );
};
