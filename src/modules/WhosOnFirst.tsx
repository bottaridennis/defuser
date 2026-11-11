import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { BigText, GhostButton, Hint, Panel, Result, cx } from '../components/ui';

type Pos = 'TL' | 'TR' | 'ML' | 'MR' | 'BL' | 'BR';

const POS_LABEL: Record<Pos, string> = {
  TL: 'In alto a sinistra',
  TR: 'In alto a destra',
  ML: 'Al centro a sinistra',
  MR: 'Al centro a destra',
  BL: 'In basso a sinistra',
  BR: 'In basso a destra',
};

/** Step 1 — parola sul DISPLAY -> etichetta da leggere (manuale ufficiale italiano). */
const STEP1: Record<string, Pos> = {
  'SI': 'ML',
  'PRIMO': 'TR',
  'DISPLAY': 'BR',
  'SCHERMO': 'TR',
  'SCHERNO': 'BR',
  'NULLA': 'ML',
  '': 'BL', // display completamente vuoto
  'VUOTO': 'MR',
  'NO': 'BR',
  'SCHERZO': 'ML',
  'FERMO': 'BR',
  'STOP': 'MR',
  'SPINGI': 'MR',
  'AH AH': 'BL',
  'TERZO': 'BL',
  'ASPETTA': 'BR',
  'OK': 'MR',
  'NO NO': 'BR',
  'SII': 'MR',
  'SI SI': 'MR',
  'COME?': 'TL',
  'SOPRA': 'BR',
  'IN ALTO': 'BL',
  'SOTTO': 'MR',
  'IN BASSO': 'ML',
  'AH': 'BR',
  'A': 'TR',
  'HA': 'BR',
};

/** Step 2 — etichetta letta -> premi la PRIMA parola di questa lista presente sul modulo. */
const STEP2: Record<string, string[]> = {
  "PRONTO": ["SI", "OKAY", "COSA", "IN MEZZO", "SINISTRA", "OK", "DESTRA", "VUOTO", "PRONTO", "NO", "PRIMO", "EH", "NULLA", "FERMO"],
  "PRIMO": ["SINISTRA", "OKAY", "SI", "IN MEZZO", "NO", "DESTRA", "NULLA", "EH", "FERMO", "PRONTO", "VUOTO", "COSA", "OK", "PRIMO"],
  "NO": ["VUOTO", "EH", "FERMO", "PRIMO", "COSA", "PRONTO", "DESTRA", "SI", "NULLA", "SINISTRA", "OK", "OKAY", "NO", "IN MEZZO"],
  "VUOTO": ["FERMO", "DESTRA", "OKAY", "IN MEZZO", "VUOTO", "OK", "PRONTO", "NULLA", "NO", "COSA", "SINISTRA", "EH", "SI", "PRIMO"],
  "NULLA": ["EH", "DESTRA", "OKAY", "IN MEZZO", "SI", "VUOTO", "NO", "OK", "SINISTRA", "COSA", "FERMO", "PRIMO", "NULLA", "PRONTO"],
  "SI": ["OKAY", "DESTRA", "EH", "IN MEZZO", "PRIMO", "COSA", "OK", "PRONTO", "NULLA", "SI", "SINISTRA", "VUOTO", "NO", "FERMO"],
  "COSA": ["EH", "COSA", "SINISTRA", "NULLA", "PRONTO", "VUOTO", "IN MEZZO", "NO", "OKAY", "PRIMO", "FERMO", "SI", "OK", "DESTRA"],
  "EH": ["PRONTO", "NULLA", "SINISTRA", "COSA", "OKAY", "SI", "DESTRA", "NO", "OK", "VUOTO", "EH", "IN MEZZO", "FERMO", "PRIMO"],
  "SINISTRA": ["DESTRA", "SINISTRA", "PRIMO", "NO", "IN MEZZO", "SI", "VUOTO", "COSA", "EH", "FERMO", "OK", "PRONTO", "OKAY", "NULLA"],
  "DESTRA": ["SI", "NULLA", "PRONTO", "OK", "NO", "FERMO", "COSA", "DESTRA", "IN MEZZO", "SINISTRA", "EH", "VUOTO", "OKAY", "PRIMO"],
  "IN MEZZO": ["VUOTO", "PRONTO", "OKAY", "COSA", "NULLA", "OK", "NO", "FERMO", "SINISTRA", "IN MEZZO", "DESTRA", "PRIMO", "EH", "SI"],
  "OKAY": ["IN MEZZO", "NO", "PRIMO", "SI", "EH", "NULLA", "FERMO", "OKAY", "SINISTRA", "PRONTO", "VUOTO", "OK", "COSA", "DESTRA"],
  "FERMO": ["EH", "NO", "VUOTO", "OKAY", "SI", "SINISTRA", "PRIMO", "OK", "COSA", "FERMO", "NULLA", "PRONTO", "DESTRA", "IN MEZZO"],
  "OK": ["DESTRA", "IN MEZZO", "SI", "PRONTO", "OK", "OKAY", "NULLA", "EH", "VUOTO", "SINISTRA", "PRIMO", "COSA", "NO", "FERMO"],
  "PREMI": ["CERTO", "NO NO", "SII", "SI SI", "DOPO", "EH?", "COME?", "ALT", "COSA?", "PREMI", "E?", "COME", "FATTO", "NOO"],
  "NO NO": ["SII", "DOPO", "COME", "EH?", "COSA?", "FATTO", "E?", "ALT", "PREMI", "NOO", "SI SI", "CERTO", "COME?", "NO NO"],
  "SII": ["E?", "NO NO", "EH?", "SII", "DOPO", "COME?", "CERTO", "NOO", "SI SI", "PREMI", "COSA?", "ALT", "COME", "FATTO"],
  "SI SI": ["PREMI", "SI SI", "COME?", "DOPO", "E?", "NO NO", "NOO", "SII", "COSA?", "EH?", "CERTO", "FATTO", "COME", "ALT"],
  "COME?": ["FATTO", "NOO", "COME?", "EH?", "COSA?", "CERTO", "SII", "ALT", "SI SI", "COME", "DOPO", "E?", "NO NO", "PREMI"],
  "NOO": ["EH?", "CERTO", "DOPO", "COSA?", "SI SI", "COME?", "E?", "FATTO", "NOO", "PREMI", "COME", "ALT", "NO NO", "SII"],
  "EH?": ["EH?", "SII", "NO NO", "PREMI", "FATTO", "ALT", "E?", "DOPO", "CERTO", "COME", "SI SI", "COME?", "NOO", "COSA?"],
  "E?": ["COME?", "NOO", "NO NO", "SI SI", "DOPO", "E?", "FATTO", "PREMI", "EH?", "COME", "SII", "CERTO", "ALT", "COSA?"],
  "COSA?": ["PREMI", "ALT", "SI SI", "SII", "NOO", "FATTO", "E?", "COME", "NO NO", "EH?", "COME?", "DOPO", "COSA?", "CERTO"],
  "FATTO": ["CERTO", "EH?", "DOPO", "COSA?", "SII", "COME?", "SI SI", "ALT", "COME", "PREMI", "NOO", "NO NO", "E?", "FATTO"],
  "DOPO": ["COSA?", "EH?", "E?", "SII", "ALT", "CERTO", "DOPO", "COME", "FATTO", "NO NO", "COME?", "SI SI", "NOO", "PREMI"],
  "ALT": ["NO NO", "NOO", "FATTO", "E?", "PREMI", "COME?", "CERTO", "COSA?", "SI SI", "DOPO", "ALT", "EH?", "SII", "COME"],
  "CERTO": ["NO NO", "FATTO", "COME", "SI SI", "PREMI", "ALT", "EH?", "COME?", "CERTO", "NOO", "COSA?", "DOPO", "SII", "E?"],
  "COME": ["SI SI", "DOPO", "NOO", "COME?", "ALT", "FATTO", "E?", "COSA?", "EH?", "PREMI", "COME", "CERTO", "NO NO", "SII"],
};

const byAlpha = (a: string, b: string) => a.localeCompare(b, 'it');
const STEP1_WORDS = Object.keys(STEP1).sort(byAlpha);
const STEP2_WORDS = Object.keys(STEP2).sort(byAlpha);

const WordGrid: React.FC<{ words: string[]; onPick: (w: string) => void; render?: (w: string) => React.ReactNode }> = ({
  words,
  onPick,
  render,
}) => (
  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
    {words.map((w) => (
      <button
        key={w || '__empty'}
        type="button"
        onClick={() => onPick(w)}
        className="min-h-12 rounded-xl border border-ink-700 bg-ink-850 px-1 font-mono text-[13px] font-bold uppercase leading-tight text-ink-100 transition-[border-color,transform] hover:border-signal active:scale-95"
      >
        {render ? render(w) : w}
      </button>
    ))}
  </div>
);

const filterWords = (words: string[], q: string) => {
  const n = q.trim().toUpperCase();
  return n ? words.filter((w) => w.includes(n)) : words;
};

const SearchBox: React.FC<{ value: string; onChange: (v: string) => void; placeholder: string }> = ({ value, onChange, placeholder }) => (
  <label className="mb-3 flex h-11 items-center gap-2 rounded-xl border border-ink-700 bg-ink-850 px-3 focus-within:border-signal">
    <Search size={16} className="text-ink-500" />
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoCapitalize="characters"
      autoCorrect="off"
      autoComplete="off"
      spellCheck={false}
      className="h-full w-full bg-transparent font-mono uppercase text-ink-100 outline-none placeholder:normal-case placeholder:text-ink-500"
    />
  </label>
);

const PositionMap: React.FC<{ pos: Pos }> = ({ pos }) => (
  <div className="mx-auto w-40 rounded-xl border border-ink-600 bg-ink-950 p-2">
    <div className="mb-2 grid h-7 place-items-center rounded bg-ink-800 font-mono text-[10px] text-ink-500">DISPLAY</div>
    <div className="grid grid-cols-2 gap-1.5">
      {(['TL', 'TR', 'ML', 'MR', 'BL', 'BR'] as Pos[]).map((p) => (
        <span key={p} className={cx('h-6 rounded', p === pos ? 'bg-signal shadow-[0_0_12px_var(--color-signal)]' : 'bg-ink-800')} />
      ))}
    </div>
  </div>
);

export const WhosOnFirst: React.FC = () => {
  const [display, setDisplay] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [stage, setStage] = useState(1);
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');

  const words1 = useMemo(() => filterWords(STEP1_WORDS, q1), [q1]);
  const words2 = useMemo(() => filterWords(STEP2_WORDS, q2), [q2]);

  const resetStep = () => {
    setDisplay(null);
    setLabel(null);
    setQ1('');
    setQ2('');
  };
  const nextStage = () => {
    resetStep();
    setStage((s) => (s >= 3 ? 1 : s + 1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-ink-400">Fase</span>
        <div className="flex gap-1.5">
          {[1, 2, 3].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                resetStep();
                setStage(i);
              }}
              className={cx(
                'h-8 w-8 rounded-lg border font-mono text-sm font-bold',
                stage === i ? 'border-signal bg-signal text-ink-950' : stage > i ? 'border-go/50 text-go' : 'border-ink-700 text-ink-500',
              )}
            >
              {i}
            </button>
          ))}
        </div>
        <GhostButton className="ml-auto" onClick={resetStep} disabled={display === null}>
          Ricomincia fase
        </GhostButton>
      </div>

      {display === null ? (
        <Panel title="Cosa c'è scritto sul display?" step={1}>
          <SearchBox value={q1} onChange={setQ1} placeholder="Cerca parola…" />
          <WordGrid
            words={words1}
            onPick={(w) => setDisplay(w)}
            render={(w) => (w === '' ? <span className="font-sans text-xs font-normal italic text-ink-400">(display vuoto)</span> : w)}
          />
        </Panel>
      ) : label === null ? (
        <>
          <Result tone="info" label={`Display: ${display === '' ? '(vuoto)' : display}`}>
            <p className="mb-3 text-sm text-ink-300">Leggi la parola sul pulsante</p>
            <BigText className="mb-3 text-2xl sm:text-3xl">{POS_LABEL[STEP1[display]]}</BigText>
            <PositionMap pos={STEP1[display]} />
          </Result>
          <Panel title="Che parola c'è su quel pulsante?" step={2}>
            <SearchBox value={q2} onChange={setQ2} placeholder="Cerca parola…" />
            <WordGrid words={words2} onPick={(w) => setLabel(w)} />
          </Panel>
        </>
      ) : (
        <>
          <Result tone="go" label={`Pulsante letto: ${label}`}>
            <p className="mb-3 text-sm text-ink-300">
              Premi il <strong className="text-ink-100">primo</strong> pulsante del modulo che compare in questa lista:
            </p>
            <ol className="grid grid-cols-2 gap-1.5 text-left sm:grid-cols-3">
              {STEP2[label].map((w, i) => (
                <li
                  key={w}
                  className={cx(
                    'flex items-center gap-2 rounded-lg border px-2.5 py-2 font-mono text-sm font-bold',
                    w === label ? 'border-signal/60 bg-ink-900 text-signal' : 'border-ink-700 bg-ink-900 text-ink-100',
                  )}
                >
                  <span className="w-5 text-right text-[11px] text-ink-500">{i + 1}</span>
                  {w}
                </li>
              ))}
            </ol>
          </Result>
          <div className="grid grid-cols-2 gap-2">
            <GhostButton className="h-12" onClick={() => setLabel(null)}>
              ← Cambia parola
            </GhostButton>
            <button
              type="button"
              onClick={nextStage}
              className="h-12 rounded-lg bg-signal text-sm font-bold uppercase tracking-wide text-ink-950 active:scale-[0.98]"
            >
              {stage < 3 ? `Fase ${stage + 1} →` : 'Fatto ✓'}
            </button>
          </div>
          <Hint className="text-center text-xs">Se sbagli, il modulo ricomincia dalla fase 1.</Hint>
        </>
      )}
    </div>
  );
};
