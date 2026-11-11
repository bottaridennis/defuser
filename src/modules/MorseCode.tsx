import React, { useEffect, useRef, useState } from 'react';
import { Delete } from 'lucide-react';
import { BigText, GhostButton, Hint, Panel, Result, ResetButton, cx } from '../components/ui';

// Parole e frequenze del manuale ufficiale italiano (versione 1-it)
const WORDS = [
  { word: 'bolle', freq: '3.505' },
  { word: 'resto', freq: '3.515' },
  { word: 'pollo', freq: '3.522' },
  { word: 'morso', freq: '3.532' },
  { word: 'verso', freq: '3.535' },
  { word: 'terre', freq: '3.542' },
  { word: 'anche', freq: '3.545' },
  { word: 'paura', freq: '3.552' },
  { word: 'pelle', freq: '3.555' },
  { word: 'chela', freq: '3.565' },
  { word: 'pasto', freq: '3.572' },
  { word: 'bombe', freq: '3.575' },
  { word: 'pausa', freq: '3.582' },
  { word: 'sauna', freq: '3.592' },
  { word: 'forse', freq: '3.595' },
  { word: 'sorso', freq: '3.600' },
];

const MORSE: Record<string, string> = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---',
  k: '-.-', l: '.-..', m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-',
  u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
};
const DECODE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));
const pretty = (code: string) => code.replace(/\./g, '•').replace(/-/g, '—');

const AUTO_COMMIT_MS = 1100;

export const MorseCode: React.FC = () => {
  const [text, setText] = useState('');
  const [code, setCode] = useState('');
  const [pressed, setPressed] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const downAt = useRef<number | null>(null);
  const timer = useRef<number | null>(null);
  const codeRef = useRef('');
  codeRef.current = code;

  const commit = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    const c = codeRef.current;
    if (!c) return;
    const letter = DECODE[c];
    if (letter) setText((t) => t + letter);
    setCode('');
  };
  const push = (sym: '.' | '-') => {
    if (timer.current) window.clearTimeout(timer.current);
    setCode((c) => (c.length >= 5 ? c : c + sym));
    timer.current = window.setTimeout(commit, AUTO_COMMIT_MS);
  };
  useEffect(() => () => void (timer.current && window.clearTimeout(timer.current)), []);

  // Tasto telegrafo: tocco breve = punto, lungo = linea
  const onDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    if (timer.current) window.clearTimeout(timer.current);
    downAt.current = performance.now();
    setPressed(true);
  };
  const onUp = () => {
    if (downAt.current === null) return;
    const dt = performance.now() - downAt.current;
    downAt.current = null;
    setPressed(false);
    push(dt < 250 ? '.' : '-');
  };

  // La parola si ripete in loop: confronto "circolare" così si può iniziare a leggere a metà
  const q = text.toLowerCase();
  const matches = WORDS.filter((w) => (w.word + w.word).includes(q));
  const pendingLetter = code ? DECODE[code] : undefined;

  return (
    <div className="space-y-4">
      <Panel
        title="Lettere ricevute"
        right={
          <>
            <GhostButton onClick={() => (code ? setCode('') : setText((t) => t.slice(0, -1)))} disabled={!text && !code} aria-label="Cancella">
              <Delete size={14} />
            </GhostButton>
            <ResetButton onClick={() => { setText(''); setCode(''); }} disabled={!text && !code} />
          </>
        }
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value.toLowerCase().replace(/[^a-z]/g, ''))}
          placeholder="Scrivi o usa i tasti sotto"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          className="h-14 w-full rounded-xl border border-ink-700 bg-ink-850 px-4 text-center font-mono text-2xl font-bold uppercase tracking-[0.3em] text-ink-100 outline-none placeholder:text-sm placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-500 focus:border-signal"
        />

        <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <button
            type="button"
            onClick={() => push('.')}
            className="h-16 rounded-xl border border-ink-700 bg-ink-850 font-mono text-3xl font-bold text-ink-100 active:scale-95 active:border-signal"
            aria-label="Punto"
          >
            •
          </button>
          <button
            type="button"
            onPointerDown={onDown}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-label="Tasto telegrafo: tocco breve punto, lungo linea"
            className="grid h-20 w-20 touch-none select-none place-items-center rounded-full border border-ink-600 bg-gradient-to-b from-ink-700 to-ink-900"
          >
            <span
              className={cx(
                'h-12 w-12 rounded-full transition-[background,box-shadow] duration-75',
                pressed ? 'bg-signal shadow-[0_0_24px_var(--color-signal)]' : 'bg-gradient-to-b from-amber-600 to-amber-800',
              )}
            />
          </button>
          <button
            type="button"
            onClick={() => push('-')}
            className="h-16 rounded-xl border border-ink-700 bg-ink-850 font-mono text-3xl font-bold text-ink-100 active:scale-95 active:border-signal"
            aria-label="Linea"
          >
            —
          </button>
        </div>

        <div className="mt-3 flex h-10 items-center justify-center gap-3">
          <span className="font-mono text-2xl tracking-[0.3em] text-signal">{pretty(code) || <span className="text-sm tracking-normal text-ink-500">tocco breve = • · lungo = —</span>}</span>
          {code && (
            <button type="button" onClick={commit} className="rounded-lg bg-signal px-3 py-1 font-mono text-sm font-bold text-ink-950">
              {pendingLetter ? pendingLetter.toUpperCase() : '?'} ✓
            </button>
          )}
        </div>
        <Hint className="text-center text-xs">La lettera viene confermata da sola dopo un attimo di pausa.</Hint>
      </Panel>

      {matches.length === 1 ? (
        <Result tone="go" label="Parola trovata">
          <BigText className="uppercase tracking-[0.25em]">{matches[0].word}</BigText>
          <p className="mt-3 font-mono text-xs uppercase tracking-widest text-ink-400">Frequenza da trasmettere</p>
          <p className="font-mono text-4xl font-bold text-signal sm:text-5xl">
            {matches[0].freq}
            <span className="ml-1 text-lg text-ink-400">MHz</span>
          </p>
        </Result>
      ) : matches.length === 0 ? (
        <Result tone="stop" label="Nessuna parola">
          <p className="text-ink-300">Nessuna parola contiene “{text.toUpperCase()}”. Ricontrolla le lettere.</p>
        </Result>
      ) : null}

      <Panel
        title={matches.length === WORDS.length ? 'Tutte le parole' : `Parole possibili (${matches.length})`}
        right={
          <GhostButton onClick={() => setShowTable((v) => !v)}>{showTable ? 'Nascondi alfabeto' : 'Alfabeto Morse'}</GhostButton>
        }
      >
        {showTable && (
          <div className="mb-4 grid grid-cols-3 gap-x-3 gap-y-1 rounded-xl bg-ink-950/60 p-3 font-mono text-sm sm:grid-cols-5">
            {Object.entries(MORSE).map(([l, c]) => (
              <div key={l} className="flex items-center gap-2">
                <span className="w-4 font-bold uppercase text-ink-100">{l}</span>
                <span className="tracking-widest text-signal">{pretty(c)}</span>
              </div>
            ))}
          </div>
        )}
        <ul className="divide-y divide-ink-700/60">
          {(matches.length ? matches : WORDS).map((w) => (
            <li key={w.word} className="flex items-center gap-3 py-2.5">
              <span className="w-16 font-mono text-base font-bold uppercase tracking-widest text-ink-100">{w.word}</span>
              <span className="hidden flex-1 truncate font-mono text-xs tracking-wider text-ink-500 sm:block">
                {w.word.split('').map((l) => pretty(MORSE[l])).join('  ')}
              </span>
              <span className="ml-auto rounded-lg bg-ink-850 px-2.5 py-1 font-mono text-sm font-bold text-signal">{w.freq}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};
