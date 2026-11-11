import React, { useMemo, useState } from 'react';
import { BigText, Hint, Panel, Result, ResetButton, cx } from '../components/ui';

/**
 * 9 labirinti del manuale. walls: 36 celle (riga per riga), bitmask
 * 1 = sopra, 2 = destra, 4 = sotto, 8 = sinistra. circles: [colonna, riga] (0-based).
 * I muri sono stati verificati pixel per pixel sul manuale ufficiale.
 */
const MAZES = [
  { id: 1, circles: [[0, 1], [5, 2]], walls: [9,5,3,9,5,7,10,9,6,12,5,3,10,12,3,9,5,2,10,13,4,6,13,2,8,5,3,9,7,10,12,7,12,6,13,6] },
  { id: 2, circles: [[1, 3], [4, 1]], walls: [13,1,7,9,1,7,9,6,9,6,12,3,10,9,6,9,5,2,8,6,9,6,11,10,10,11,10,9,6,10,14,12,6,12,5,6] },
  { id: 3, circles: [[3, 3], [5, 3]], walls: [9,5,3,11,9,3,14,11,10,12,6,10,9,2,10,9,3,10,10,10,10,10,10,10,10,12,6,10,10,10,12,5,5,6,12,6] },
  { id: 4, circles: [[0, 0], [0, 3]], walls: [9,3,13,5,5,3,10,10,9,5,5,2,10,12,6,9,7,10,10,13,5,4,5,2,8,5,5,5,3,10,12,5,7,13,6,14] },
  { id: 5, circles: [[4, 2], [3, 5]], walls: [13,5,5,5,1,3,9,5,5,1,6,14,8,3,13,6,9,3,10,12,5,3,14,10,10,9,5,4,7,10,14,12,5,5,5,6] },
  { id: 6, circles: [[4, 0], [2, 4]], walls: [11,9,3,13,1,3,10,10,10,9,6,10,8,6,14,10,9,6,12,3,9,2,10,11,9,6,14,10,12,2,12,5,5,6,13,6] },
  { id: 7, circles: [[1, 0], [1, 5]], walls: [9,5,5,3,9,3,10,9,7,12,6,10,12,6,9,7,9,6,9,3,8,5,6,11,10,14,12,5,3,10,12,5,5,5,4,6] },
  { id: 8, circles: [[3, 0], [2, 3]], walls: [11,9,5,3,9,3,8,4,7,12,6,10,10,9,5,5,3,10,10,12,3,13,4,6,10,11,12,5,5,7,12,4,5,5,5,7] },
  { id: 9, circles: [[0, 4], [2, 1]], walls: [11,9,5,5,1,3,10,10,9,7,10,10,8,4,6,9,6,10,10,11,9,6,13,2,10,10,10,9,3,14,12,6,12,6,12,7] },
];

type Coord = [number, number]; // [colonna, riga]
const same = (a: Coord | null, c: number, r: number) => !!a && a[0] === c && a[1] === r;

const DIRS = [
  { dc: 0, dr: -1, bit: 1, name: 'SU', arrow: '↑' },
  { dc: 1, dr: 0, bit: 2, name: 'DESTRA', arrow: '→' },
  { dc: 0, dr: 1, bit: 4, name: 'GIÙ', arrow: '↓' },
  { dc: -1, dr: 0, bit: 8, name: 'SINISTRA', arrow: '←' },
];

function bfs(walls: number[], start: Coord, end: Coord): Coord[] | null {
  const prev = new Map<string, Coord | null>([[start.join(), null]]);
  const queue: Coord[] = [start];
  while (queue.length) {
    const cur = queue.shift()!;
    if (cur[0] === end[0] && cur[1] === end[1]) {
      const path: Coord[] = [];
      for (let p: Coord | null = cur; p; p = prev.get(p.join())!) path.unshift(p);
      return path;
    }
    const w = walls[cur[1] * 6 + cur[0]];
    for (const d of DIRS) {
      const n: Coord = [cur[0] + d.dc, cur[1] + d.dr];
      if (w & d.bit || n[0] < 0 || n[0] > 5 || n[1] < 0 || n[1] > 5 || prev.has(n.join())) continue;
      prev.set(n.join(), cur);
      queue.push(n);
    }
  }
  return null;
}

/** Raggruppa le mosse consecutive uguali: DESTRA ×2, GIÙ ×1… */
function toMoves(path: Coord[]) {
  const steps = path.slice(1).map((p, i) => DIRS.find((d) => d.dc === p[0] - path[i][0] && d.dr === p[1] - path[i][1])!);
  const out: { d: (typeof DIRS)[number]; n: number }[] = [];
  for (const s of steps) {
    if (out.length && out[out.length - 1].d === s) out[out.length - 1].n++;
    else out.push({ d: s, n: 1 });
  }
  return out;
}

const WALL = '3px solid var(--color-ink-100)';
const OPEN = '1px dashed var(--color-ink-700)';

export const Mazes: React.FC = () => {
  const [mazeId, setMazeId] = useState<number | null>(null);
  const [start, setStart] = useState<Coord | null>(null);
  const [end, setEnd] = useState<Coord | null>(null);
  const [miss, setMiss] = useState(false);

  const maze = MAZES.find((m) => m.id === mazeId) ?? null;
  const path = useMemo(() => (maze && start && end ? bfs(maze.walls, start, end) : null), [maze, start, end]);
  const moves = path ? toMoves(path) : [];

  // Ogni cerchio del manuale appartiene a un solo labirinto: basta indicarne uno.
  const pickCircle = (c: number, r: number) => {
    const m = MAZES.find((mz) => mz.circles.some(([cc, rr]) => cc === c && rr === r));
    setMiss(!m);
    if (m) setMazeId(m.id);
  };

  const tapCell = (c: number, r: number) => {
    if (!start || (start && end)) {
      setStart([c, r]);
      setEnd(null);
    } else if (!same(start, c, r)) setEnd([c, r]);
  };

  const reset = () => {
    setMazeId(null);
    setStart(null);
    setEnd(null);
    setMiss(false);
  };

  const cells = Array.from({ length: 36 }, (_, i) => [i % 6, Math.floor(i / 6)] as Coord);

  if (!maze) {
    return (
      <div className="space-y-4">
        <Panel title="Dov'è uno dei cerchi verdi?" step={1}>
          <Hint className="mb-3 text-xs">Basta un cerchio: ogni posizione appartiene a un solo labirinto.</Hint>
          <div className="mx-auto grid max-w-sm grid-cols-6 gap-1.5 rounded-2xl border border-ink-700 bg-ink-950 p-2.5">
            {cells.map(([c, r]) => (
              <button
                key={`${c}-${r}`}
                type="button"
                aria-label={`Colonna ${c + 1}, riga ${r + 1}`}
                onClick={() => pickCircle(c, r)}
                className="grid aspect-square place-items-center rounded-lg bg-ink-850 transition-colors hover:bg-go/20 active:scale-95"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-ink-500" />
              </button>
            ))}
          </div>
          {miss && <p className="mt-3 text-center text-sm text-stop">Nessun labirinto ha un cerchio lì: ricontrolla.</p>}
        </Panel>
        <Panel title="Oppure scegli il labirinto">
          <div className="grid grid-cols-9 gap-1">
            {MAZES.map((m) => (
              <button key={m.id} type="button" onClick={() => setMazeId(m.id)} className="h-10 rounded-lg border border-ink-700 bg-ink-850 font-mono text-sm font-bold hover:border-signal">
                {m.id}
              </button>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Panel
        title={`Labirinto ${maze.id}`}
        step={2}
        right={<ResetButton onClick={reset} label="Cambia" />}
      >
        <p className="mb-3 text-sm text-ink-300">
          {!start ? (
            <>Tocca la <strong className="text-ink-100">luce bianca</strong> (partenza).</>
          ) : !end ? (
            <>Ora tocca il <strong className="text-stop">triangolo rosso</strong> (arrivo).</>
          ) : (
            <>Tocca una cella per ripartire da lì.</>
          )}
        </p>
        <div className="mx-auto grid aspect-square w-full max-w-sm grid-cols-6 rounded-xl bg-ink-950 p-1" style={{ border: WALL }}>
          {cells.map(([c, r]) => {
            const w = maze.walls[r * 6 + c];
            const isStart = same(start, c, r);
            const isEnd = same(end, c, r);
            const step = path?.findIndex((p) => p[0] === c && p[1] === r) ?? -1;
            const circle = maze.circles.some(([cc, rr]) => cc === c && rr === r);
            return (
              <button
                key={`${c}-${r}`}
                type="button"
                aria-label={`Colonna ${c + 1}, riga ${r + 1}`}
                onClick={() => tapCell(c, r)}
                className="relative grid place-items-center hover:bg-white/5"
                style={{
                  borderTop: r > 0 ? (w & 1 ? WALL : OPEN) : undefined,
                  borderLeft: c > 0 ? (w & 8 ? WALL : OPEN) : undefined,
                }}
              >
                {circle && <span className="absolute inset-[18%] rounded-full border-2 border-go/70" />}
                {step > 0 && !isEnd && <span className="h-2.5 w-2.5 rounded-full bg-signal shadow-[0_0_8px_var(--color-signal)]" />}
                {isStart && <span className="z-10 h-4 w-4 rounded-full bg-white shadow-[0_0_10px_white]" />}
                {isEnd && <span className="z-10 h-0 w-0 border-x-[9px] border-b-[15px] border-x-transparent border-b-red-500" />}
              </button>
            );
          })}
        </div>
      </Panel>

      {start && end ? (
        path ? (
          <Result tone="go" label={`Percorso · ${path.length - 1} mosse`}>
            <ol className="flex flex-wrap justify-center gap-2">
              {moves.map((m, i) => (
                <li key={i} className="flex items-center gap-1.5 rounded-xl border border-go/30 bg-ink-900 px-3 py-2">
                  <span className="text-2xl leading-none text-signal">{m.d.arrow}</span>
                  <span className="font-mono text-sm font-bold">{m.d.name}</span>
                  {m.n > 1 && <span className="font-mono text-sm font-bold text-signal">×{m.n}</span>}
                </li>
              ))}
            </ol>
            <p className="mt-3 font-mono text-xs tracking-wider text-ink-400">
              {moves.map((m) => `${m.d.arrow}${m.n > 1 ? m.n : ''}`).join('  ')}
            </p>
          </Result>
        ) : (
          <Result tone="stop" label="Nessun percorso">
            <BigText className="text-xl">Ricontrolla partenza e arrivo</BigText>
          </Result>
        )
      ) : (
        <Result tone="idle">
          <p className="text-sm text-ink-400">Indica partenza e arrivo sul labirinto.</p>
        </Result>
      )}
    </div>
  );
};
