import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';
import { BigText, Choice, Hint, Panel, QuickFacts, Result, ResetButton, cx } from '../components/ui';

type Color = 'red' | 'white' | 'blue' | 'yellow' | 'black';

const COLORS: { id: Color; label: string; swatch: string }[] = [
  { id: 'red', label: 'Rosso', swatch: 'bg-red-500' },
  { id: 'white', label: 'Bianco', swatch: 'bg-white' },
  { id: 'blue', label: 'Blu', swatch: 'bg-blue-500' },
  { id: 'yellow', label: 'Giallo', swatch: 'bg-yellow-400' },
  { id: 'black', label: 'Nero', swatch: 'bg-zinc-950 ring-1 ring-inset ring-zinc-500' },
];

const ORD = ['primo', 'secondo', 'terzo', 'quarto', 'quinto', 'sesto'];

class NeedSerial extends Error {}

/** Regole del manuale (Sezione "Cavi"). Restituisce l'indice 1-based del cavo da tagliare. */
function solve(w: Color[], isEven: boolean | undefined): number {
  const n = w.length;
  const count = (c: Color) => w.filter((x) => x === c).length;
  const last = w[n - 1];
  const odd = () => {
    if (isEven === undefined) throw new NeedSerial();
    return !isEven;
  };

  if (n === 3) {
    if (count('red') === 0) return 2;
    if (last === 'white') return 3;
    if (count('blue') > 1) return w.lastIndexOf('blue') + 1;
    return 3;
  }
  if (n === 4) {
    if (count('red') > 1 && odd()) return w.lastIndexOf('red') + 1;
    if (last === 'yellow' && count('red') === 0) return 1;
    if (count('blue') === 1) return 1;
    if (count('yellow') > 1) return 4;
    return 2;
  }
  if (n === 5) {
    if (last === 'black' && odd()) return 4;
    if (count('red') === 1 && count('yellow') > 1) return 1;
    if (count('black') === 0) return 2;
    return 1;
  }
  // 6 cavi
  if (count('yellow') === 0 && odd()) return 3;
  if (count('yellow') === 1 && count('white') > 1) return 4;
  if (count('red') === 0) return 6;
  return 4;
}

export const Wires: React.FC = () => {
  const { isEven } = useBombContext();
  const [wires, setWires] = useState<(Color | null)[]>([null, null, null]);

  const setCount = (n: number) =>
    setWires((prev) => (prev.length < n ? [...prev, ...Array(n - prev.length).fill(null)] : prev.slice(0, n)));

  const setWire = (i: number, c: Color) =>
    setWires((prev) => {
      const next = [...prev];
      next[i] = c;
      return next;
    });

  const complete = wires.every(Boolean);
  let cut: number | null = null;
  let needSerial = false;
  if (complete) {
    try {
      cut = solve(wires as Color[], isEven);
    } catch (e) {
      if (e instanceof NeedSerial) needSerial = true;
      else throw e;
    }
  }
  const cutColor = cut ? COLORS.find((c) => c.id === wires[cut! - 1]) : undefined;

  return (
    <div className="space-y-4">
      <Panel title="Quanti cavi ci sono?" step={1}>
        <div className="grid grid-cols-4 gap-2">
          {[3, 4, 5, 6].map((n) => (
            <Choice key={n} active={wires.length === n} onClick={() => setCount(n)} className="font-mono text-lg">
              {n}
            </Choice>
          ))}
        </div>
      </Panel>

      <Panel
        title="Colori dall'alto verso il basso"
        step={2}
        right={<ResetButton onClick={() => setWires(Array(wires.length).fill(null))} disabled={!wires.some(Boolean)} />}
      >
        <ol className="space-y-2">
          {wires.map((w, i) => (
            <li
              key={i}
              className={cx(
                'flex items-center gap-2 rounded-xl p-1 transition-colors',
                cut === i + 1 && 'bg-go/10 ring-1 ring-go/60',
              )}
            >
              <span className="grid h-11 w-8 shrink-0 place-items-center font-mono text-sm font-bold text-ink-400">{i + 1}</span>
              <div className="grid flex-1 grid-cols-5 gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    aria-label={`Cavo ${i + 1}: ${c.label}`}
                    aria-pressed={w === c.id}
                    onClick={() => setWire(i, c.id)}
                    className={cx(
                      'relative h-11 rounded-lg transition-[opacity,transform] active:scale-95',
                      c.swatch,
                      w === c.id ? 'ring-2 ring-signal ring-offset-2 ring-offset-ink-900' : w ? 'opacity-25' : 'opacity-80 hover:opacity-100',
                    )}
                  >
                    <span className="sr-only">{c.label}</span>
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-2 flex justify-between px-11 text-[10px] uppercase tracking-wider text-ink-500 sm:px-12">
          {COLORS.map((c) => (
            <span key={c.id}>{c.label}</span>
          ))}
        </div>
      </Panel>

      {!complete ? (
        <Result tone="idle">
          <p className="text-sm text-ink-400">Indica il colore di tutti i cavi ({wires.filter(Boolean).length}/{wires.length}).</p>
        </Result>
      ) : needSerial ? (
        <>
          <Result tone="warn" label="Serve l'ultima cifra del seriale">
            <Hint className="text-ink-300">Con questa combinazione la regola dipende dal numero seriale.</Hint>
          </Result>
          <QuickFacts facts={['serial']} highlight={['serial']} />
        </>
      ) : (
        <Result tone="go" label="Azione">
          <BigText>
            Taglia il <span className="text-signal">{ORD[cut! - 1]}</span> cavo
          </BigText>
          <p className="mt-1 text-sm text-ink-300">
            n° {cut} dall'alto · {cutColor?.label.toLowerCase()}
          </p>
        </Result>
      )}
    </div>
  );
};
