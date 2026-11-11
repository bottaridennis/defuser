import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';
import { BigText, Choice, Fact, Panel, QuickFacts, Result, cx } from '../components/ui';

type Color = 'blue' | 'white' | 'yellow' | 'red';
type Label = 'Annulla' | 'Detona' | 'Tieni premuto' | 'Premi';

const COLORS: { id: Color; label: string; cls: string }[] = [
  { id: 'red', label: 'Rosso', cls: 'bg-red-600 text-white' },
  { id: 'blue', label: 'Blu', cls: 'bg-blue-600 text-white' },
  { id: 'yellow', label: 'Giallo', cls: 'bg-yellow-400 text-ink-950' },
  { id: 'white', label: 'Bianco', cls: 'bg-white text-ink-950' },
];

// Il gioco può mostrare la scritta in italiano o in inglese
const LABELS: { id: Label; en: string }[] = [
  { id: 'Annulla', en: 'Abort' },
  { id: 'Detona', en: 'Detonate' },
  { id: 'Tieni premuto', en: 'Hold' },
  { id: 'Premi', en: 'Press' },
];

const STRIPS = [
  { swatch: 'bg-blue-500', name: 'Blu', digit: 4 },
  { swatch: 'bg-white', name: 'Bianca', digit: 1 },
  { swatch: 'bg-yellow-400', name: 'Gialla', digit: 5 },
  { swatch: 'bg-[conic-gradient(#ef4444,#22c55e,#a855f7,#ef4444)]', name: 'Altro colore', digit: 1 },
];

type Outcome = { action: 'HOLD' | 'PRESS'; rule: string } | { action: 'NEED'; need: Fact[] };

/** Regole del manuale (Sezione "Il Pulsante"), applicate in ordine. */
function solve(color: Color, label: Label, batteries: number | undefined, car: boolean, frk: boolean): Outcome {
  if (color === 'blue' && label === 'Annulla') return { action: 'HOLD', rule: 'Pulsante blu con scritta "Annulla"' };
  if (label === 'Detona') {
    if (batteries === undefined) return { action: 'NEED', need: ['batteries'] };
    if (batteries > 1) return { action: 'PRESS', rule: 'Più di una batteria e scritta "Detona"' };
  }
  if (color === 'white' && car) return { action: 'HOLD', rule: 'Pulsante bianco e indicatore CAR acceso' };
  if (frk) {
    if (batteries === undefined) return { action: 'NEED', need: ['batteries'] };
    if (batteries > 2) return { action: 'PRESS', rule: 'Più di due batterie e indicatore FRK acceso' };
  }
  if (color === 'yellow') return { action: 'HOLD', rule: 'Pulsante giallo' };
  if (color === 'red' && label === 'Tieni premuto') return { action: 'PRESS', rule: 'Pulsante rosso con scritta "Tieni premuto"' };
  return { action: 'HOLD', rule: 'Nessuna regola precedente applicabile' };
}

export const ButtonModule: React.FC = () => {
  const { batteries, indicators } = useBombContext();
  const [color, setColor] = useState<Color | null>(null);
  const [label, setLabel] = useState<Label | null>(null);

  const res = color && label ? solve(color, label, batteries, indicators.includes('CAR'), indicators.includes('FRK')) : null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Panel title="Colore del pulsante" step={1}>
          <div className="grid grid-cols-2 gap-2">
            {COLORS.map((c) => (
              <button
                key={c.id}
                type="button"
                aria-pressed={color === c.id}
                onClick={() => setColor(c.id)}
                className={cx(
                  'h-14 rounded-xl text-sm font-bold transition-[opacity,transform] active:scale-[0.97]',
                  c.cls,
                  color === c.id ? 'ring-2 ring-signal ring-offset-2 ring-offset-ink-900' : color ? 'opacity-30' : 'opacity-90',
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
        </Panel>

        <Panel title="Scritta sul pulsante" step={2}>
          <div className="grid grid-cols-2 gap-2">
            {LABELS.map((l) => (
              <Choice key={l.id} active={label === l.id} onClick={() => setLabel(l.id)} className="h-14 leading-tight">
                <span className="block uppercase">{l.id}</span>
                <span className="block text-[10px] font-normal opacity-60">{l.en}</span>
              </Choice>
            ))}
          </div>
        </Panel>
      </div>

      <QuickFacts facts={['batteries', 'CAR', 'FRK']} highlight={res?.action === 'NEED' ? res.need : []} />

      {!res ? (
        <Result tone="idle">
          <p className="text-sm text-ink-400">Scegli colore e scritta del pulsante.</p>
        </Result>
      ) : res.action === 'NEED' ? (
        <Result tone="warn" label="Dato mancante">
          <p className="text-ink-300">Indica il numero di batterie per continuare.</p>
        </Result>
      ) : res.action === 'PRESS' ? (
        <Result tone="go" label="Azione">
          <BigText>Premi e rilascia subito</BigText>
          <p className="mt-1 text-xs text-ink-400">{res.rule}</p>
        </Result>
      ) : (
        <Result tone="info" label="Azione">
          <BigText>Tieni premuto</BigText>
          <p className="mt-1 text-xs text-ink-400">{res.rule}</p>
          <div className="mt-4 text-left">
            <p className="mb-2 text-center text-sm text-ink-300">Guarda la striscia colorata a destra del pulsante:</p>
            <ul className="grid gap-2 sm:grid-cols-2">
              {STRIPS.map((s) => (
                <li key={s.name} className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-900 p-2.5">
                  <span className={cx('h-9 w-3 shrink-0 rounded-full', s.swatch)} />
                  <span className="flex-1 text-sm text-ink-300">Striscia {s.name.toLowerCase()}</span>
                  <span className="text-right text-[11px] leading-tight text-ink-400">
                    rilascia con un
                    <span className="ml-1 font-mono text-2xl font-bold text-signal">{s.digit}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-center text-xs text-ink-500">…in qualsiasi posizione del timer.</p>
          </div>
        </Result>
      )}
    </div>
  );
};
