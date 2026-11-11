import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { BigText, GhostButton, Hint, Panel, Result, ResetButton, cx } from '../components/ui';

type WColor = 'red' | 'blue' | 'black';
type Conn = 'A' | 'B' | 'C';

// Tabella del manuale: n-esima ricorrenza di ogni colore -> lettere per cui tagliare
const SEQ: Record<WColor, string[]> = {
  red: ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'],
  blue: ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'],
  black: ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C'],
};

const META: Record<WColor, { label: string; cls: string; text: string }> = {
  red: { label: 'Rosso', cls: 'bg-red-500 border-red-400', text: 'text-red-400' },
  blue: { label: 'Blu', cls: 'bg-blue-500 border-blue-400', text: 'text-blue-400' },
  black: { label: 'Nero', cls: 'bg-zinc-950 border-zinc-500', text: 'text-ink-300' },
};

interface Entry { color: WColor; conn: Conn; n: number; cut: boolean }

export const WireSequences: React.FC = () => {
  const [history, setHistory] = useState<Entry[]>([]);
  const [color, setColor] = useState<WColor | null>(null);

  const count = (c: WColor) => history.filter((h) => h.color === c).length;

  const add = (conn: Conn) => {
    if (!color) return;
    const n = count(color);
    const cut = n < 9 && SEQ[color][n].includes(conn);
    setHistory((h) => [...h, { color, conn, n: n + 1, cut }]);
    setColor(null);
  };

  const last = history[history.length - 1];

  return (
    <div className="space-y-4">
      <Hint>Per ogni cavo del pannello: tocca il colore, poi la lettera a cui è collegato. I conteggi valgono per tutti i pannelli.</Hint>

      <Panel title="Colore del cavo" step={1}>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(META) as WColor[]).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={color === c}
              onClick={() => setColor(c)}
              className={cx(
                'flex h-16 flex-col items-center justify-center rounded-xl border-2 text-sm font-bold text-white transition-[opacity,transform] active:scale-[0.97]',
                META[c].cls,
                color === c ? 'ring-2 ring-signal ring-offset-2 ring-offset-ink-900' : color ? 'opacity-35' : '',
              )}
            >
              {META[c].label}
              <span className="font-mono text-[10px] font-normal opacity-80">{count(c)}/9</span>
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Collegato alla lettera" step={2}>
        <div className="grid grid-cols-3 gap-2">
          {(['A', 'B', 'C'] as Conn[]).map((l) => (
            <button
              key={l}
              type="button"
              disabled={!color}
              onClick={() => add(l)}
              className="h-16 rounded-xl border border-ink-700 bg-ink-850 font-mono text-3xl font-bold text-ink-100 transition-[border-color,transform] enabled:hover:border-signal active:scale-95 disabled:opacity-30"
            >
              {l}
            </button>
          ))}
        </div>
      </Panel>

      {last ? (
        <Result tone={last.cut ? 'go' : 'stop'} label={`${last.n}° cavo ${META[last.color].label.toLowerCase()} → ${last.conn}`}>
          <BigText>{last.cut ? 'Taglia' : 'Non tagliare'}</BigText>
          {last.n > 9 && <p className="mt-1 text-xs text-ink-300">Oltre la 9ª ricorrenza: controlla di non aver contato due volte.</p>}
        </Result>
      ) : (
        <Result tone="idle">
          <p className="text-sm text-ink-400">Inserisci il primo cavo.</p>
        </Result>
      )}

      {history.length > 0 && (
        <Panel
          title={`Storico (${history.length})`}
          right={
            <>
              <GhostButton onClick={() => setHistory((h) => h.slice(0, -1))} aria-label="Annulla ultimo">
                <Delete size={14} />
              </GhostButton>
              <ResetButton onClick={() => { setHistory([]); setColor(null); }} />
            </>
          }
        >
          <ol className="flex flex-wrap gap-1.5">
            {history.map((h, i) => (
              <li
                key={i}
                className={cx(
                  'flex items-center gap-1.5 rounded-lg border px-2 py-1 font-mono text-xs font-bold',
                  h.cut ? 'border-go/40 bg-go/10' : 'border-ink-700 bg-ink-850',
                )}
              >
                <span className={cx('h-2.5 w-2.5 rounded-full border', META[h.color].cls)} />
                <span className={META[h.color].text}>{h.n}°</span>→{h.conn}
                <span className={h.cut ? 'text-go' : 'text-stop'}>{h.cut ? '✂' : '✕'}</span>
              </li>
            ))}
          </ol>
        </Panel>
      )}
    </div>
  );
};
