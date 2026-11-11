import React, { useMemo, useState } from 'react';
import { BigText, Hint, Panel, Result, ResetButton, cx } from '../components/ui';

type Sym = { id: string; char: string; desc: string };

// I 27 simboli del manuale, con un nome descrittivo per riconoscerli a voce.
const SYMBOLS: Sym[] = [
  { id: 'balloon', char: 'Ϙ', desc: 'Palloncino' },
  { id: 'at', char: 'Ѧ', desc: 'A con gambe' },
  { id: 'lambda', char: 'ƛ', desc: 'Lambda tagliata' },
  { id: 'lightning', char: 'Ϟ', desc: 'Saetta' },
  { id: 'squid', char: 'Ѭ', desc: 'Ragno / Calamaro' },
  { id: 'hookn', char: 'ϗ', desc: 'H con ricciolo' },
  { id: 'leftc', char: 'Ͽ', desc: 'C rovesciata col punto' },
  { id: 'euro', char: 'Ӭ', desc: 'Э con due punti' },
  { id: 'cursive', char: 'Ҩ', desc: 'Ricciolo / Q corsiva' },
  { id: 'hollowstar', char: '☆', desc: 'Stella vuota' },
  { id: 'question', char: '¿', desc: 'Punto di domanda girato' },
  { id: 'copyright', char: '©', desc: 'Copyright' },
  { id: 'pumpkin', char: 'Ѽ', desc: 'Sorriso con baffo (W)' },
  { id: 'doublek', char: 'Җ', desc: 'Ж (doppia K)' },
  { id: 'melt', char: 'Ԇ', desc: '3 sciolto / R' },
  { id: 'six', char: 'б', desc: '6 / b' },
  { id: 'paragraph', char: '¶', desc: 'Paragrafo (¶)' },
  { id: 'bt', char: 'Ѣ', desc: 'b con croce (Ѣ)' },
  { id: 'smiley', char: 'ټ', desc: 'Faccina sorridente' },
  { id: 'pitchfork', char: 'Ψ', desc: 'Tridente' },
  { id: 'rightc', char: 'Ͼ', desc: 'C col punto' },
  { id: 'dragon', char: 'Ѯ', desc: '3 con coda / Drago' },
  { id: 'filledstar', char: '★', desc: 'Stella piena' },
  { id: 'puzzle', char: '҂', desc: 'Pezzo di puzzle / X' },
  { id: 'ae', char: 'æ', desc: 'ae' },
  { id: 'nwithhat', char: 'Ҋ', desc: 'N/И con cappello' },
  { id: 'omega', char: 'Ω', desc: 'Omega' },
];
const BY_ID = Object.fromEntries(SYMBOLS.map((s) => [s.id, s]));

// Colonne del manuale, dall'alto verso il basso.
const COLS: string[][] = [
  ['balloon', 'at', 'lambda', 'lightning', 'squid', 'hookn', 'leftc'],
  ['euro', 'balloon', 'leftc', 'cursive', 'hollowstar', 'hookn', 'question'],
  ['copyright', 'pumpkin', 'cursive', 'doublek', 'melt', 'lambda', 'hollowstar'],
  ['six', 'paragraph', 'bt', 'squid', 'doublek', 'question', 'smiley'],
  ['pitchfork', 'smiley', 'bt', 'rightc', 'paragraph', 'dragon', 'filledstar'],
  ['six', 'euro', 'puzzle', 'ae', 'pitchfork', 'nwithhat', 'omega'],
];

export const Keypads: React.FC = () => {
  const [sel, setSel] = useState<string[]>([]);

  const toggle = (id: string) =>
    setSel((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length < 4 ? [...p, id] : p));

  // Colonne ancora compatibili con i simboli scelti
  const cols = useMemo(() => COLS.map((c, i) => ({ c, i })).filter(({ c }) => sel.every((s) => c.includes(s))), [sel]);
  const possible = useMemo(() => new Set(cols.flatMap(({ c }) => c)), [cols]);
  const solved = sel.length === 4 && cols.length === 1 ? cols[0] : null;
  const order = solved ? solved.c.filter((id) => sel.includes(id)) : [];

  return (
    <div className="space-y-4">
      <Panel
        title="Tocca i 4 simboli del tastierino"
        right={
          <>
            <span className="font-mono text-xs text-ink-400">{sel.length}/4</span>
            <ResetButton onClick={() => setSel([])} disabled={!sel.length} />
          </>
        }
      >
        <Hint className="mb-3 text-xs">I simboli non compatibili con quelli già scelti vengono attenuati.</Hint>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {SYMBOLS.map((s) => {
            const on = sel.includes(s.id);
            const dim = !on && (!possible.has(s.id) || sel.length === 4);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={on}
                aria-label={s.desc}
                onClick={() => toggle(s.id)}
                disabled={dim && sel.length === 4}
                className={cx(
                  'flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl border p-1 transition-[opacity,border-color,background,transform] active:scale-95',
                  on ? 'border-signal bg-signal/15' : 'border-ink-700 bg-ink-850 hover:border-ink-500',
                  dim && 'opacity-25',
                )}
              >
                <span className={cx('font-glyph text-3xl leading-none sm:text-[2rem]', on ? 'text-signal' : 'text-ink-100')}>
                  {s.char}
                </span>
                <span className="line-clamp-2 text-center text-[9px] leading-tight text-ink-500">{s.desc}</span>
              </button>
            );
          })}
        </div>
      </Panel>

      {sel.length > 0 && cols.length === 0 ? (
        <Result tone="stop" label="Combinazione impossibile">
          <p className="text-ink-300">Nessuna colonna contiene tutti questi simboli: ricontrolla.</p>
        </Result>
      ) : solved ? (
        <Result tone="go" label={`Premi in quest'ordine · colonna ${solved.i + 1}`}>
          <ol className="mt-2 grid grid-cols-4 gap-2">
            {order.map((id, i) => (
              <li key={id} className="flex flex-col items-center rounded-xl border border-go/30 bg-ink-900 py-3">
                <span className="font-mono text-xs font-bold text-go">{i + 1}°</span>
                <span className="font-glyph text-4xl leading-tight text-ink-100">{BY_ID[id].char}</span>
                <span className="px-1 text-center text-[10px] leading-tight text-ink-400">{BY_ID[id].desc}</span>
              </li>
            ))}
          </ol>
        </Result>
      ) : (
        <Result tone="idle">
          <p className="text-sm text-ink-400">
            {sel.length < 4 ? `Scegli ancora ${4 - sel.length} simbol${4 - sel.length === 1 ? 'o' : 'i'}.` : ''}
            {sel.length > 0 && cols.length > 0 && ` Colonne possibili: ${cols.map((c) => c.i + 1).join(', ')}.`}
          </p>
        </Result>
      )}

      {sel.length === 4 && cols.length > 1 && (
        <BigText className="text-center text-base">Più colonne possibili: ricontrolla i simboli.</BigText>
      )}
    </div>
  );
};
