import React from 'react';
import { Wires } from './Wires';
import { ButtonModule } from './ButtonModule';
import { Keypads } from './Keypads';
import { SimonSays } from './SimonSays';
import { WhosOnFirst } from './WhosOnFirst';
import { Memory } from './Memory';
import { MorseCode } from './MorseCode';
import { CompWires } from './CompWires';
import { WireSequences } from './WireSequences';
import { Mazes } from './Mazes';
import { Password } from './Password';
import { Knobs } from './Knobs';
import { VentingGas } from './VentingGas';
import { CapacitorDischarge } from './CapacitorDischarge';

export type ModuleId =
  | 'wires'
  | 'button'
  | 'keypads'
  | 'simon'
  | 'whosonfirst'
  | 'memory'
  | 'morse'
  | 'compwires'
  | 'wireseq'
  | 'mazes'
  | 'password'
  | 'knobs'
  | 'ventinggas'
  | 'capacitor';

export interface ModuleDef {
  id: ModuleId;
  name: string;
  /** Breve descrizione mostrata nella home */
  blurb: string;
  needy?: boolean;
  Component: React.FC;
  Icon: React.FC;
}

/* ---------- Icone (illustrazioni dei moduli) ---------- */

const I = {
  wires: () => (
    <div className="flex w-full flex-col gap-2 px-1">
      {['bg-red-500', 'bg-white', 'bg-blue-500', 'bg-yellow-400'].map((c) => (
        <div key={c} className={`h-1.5 w-full rounded-full ${c}`} />
      ))}
    </div>
  ),
  button: () => (
    <div className="grid h-14 w-14 place-items-center rounded-full border-4 border-ink-700 bg-red-600 shadow-[inset_0_-5px_10px_rgba(0,0,0,0.4)]">
      <span className="text-[7px] font-bold uppercase tracking-widest text-white">Detona</span>
    </div>
  ),
  keypads: () => (
    <div className="grid grid-cols-2 gap-1 font-glyph text-base text-signal">
      {['Ϙ', 'Ω', 'Ψ', '★'].map((s) => (
        <span key={s} className="grid h-7 w-7 place-items-center rounded-md border border-ink-600 bg-ink-800">
          {s}
        </span>
      ))}
    </div>
  ),
  simon: () => (
    <div className="grid h-14 w-14 rotate-45 grid-cols-2 gap-1">
      <span className="rounded-tl-xl bg-blue-500" />
      <span className="rounded-tr-xl bg-yellow-400" />
      <span className="rounded-bl-xl bg-red-500" />
      <span className="rounded-br-xl bg-green-500" />
    </div>
  ),
  whosonfirst: () => (
    <div className="flex w-full flex-col gap-1.5 px-1">
      <div className="grid h-5 place-items-center rounded bg-ink-950 font-mono text-[8px] text-go">SCHERMO</div>
      <div className="grid grid-cols-2 gap-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="h-2.5 rounded-sm border border-ink-600 bg-ink-800" />
        ))}
      </div>
    </div>
  ),
  memory: () => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="grid h-7 w-10 place-items-center rounded bg-ink-950 font-mono text-base font-bold text-go">4</span>
      <div className="flex gap-1">
        {[2, 4, 1, 3].map((n) => (
          <span key={n} className="grid h-5 w-5 place-items-center rounded-sm border border-ink-600 bg-ink-800 font-mono text-[9px] text-ink-300">
            {n}
          </span>
        ))}
      </div>
    </div>
  ),
  morse: () => (
    <div className="flex flex-col items-center gap-2">
      <span className="h-4 w-4 rounded-full bg-signal shadow-[0_0_12px_var(--color-signal)]" />
      <span className="font-mono text-[11px] tracking-[0.3em] text-ink-300">·−·· —</span>
    </div>
  ),
  compwires: () => (
    <div className="flex w-full flex-col gap-2 px-1">
      <div className="h-1.5 rounded-full bg-[repeating-linear-gradient(90deg,#ef4444_0_6px,#fff_6px_12px)]" />
      <div className="h-1.5 rounded-full bg-blue-500" />
      <div className="h-1.5 rounded-full bg-[repeating-linear-gradient(90deg,#3b82f6_0_6px,#ef4444_6px_12px)]" />
    </div>
  ),
  wireseq: () => (
    <div className="flex w-full flex-col gap-1.5 px-1 font-mono text-[9px] text-ink-400">
      {[
        ['1', 'bg-red-500', 'C'],
        ['2', 'bg-blue-500', 'A'],
        ['3', 'bg-ink-950 border border-ink-600', 'B'],
      ].map(([n, c, l]) => (
        <div key={n} className="flex items-center gap-1.5">
          {n}
          <span className={`h-1.5 flex-1 rounded-full ${c}`} />
          {l}
        </div>
      ))}
    </div>
  ),
  mazes: () => (
    <div className="grid grid-cols-3 gap-1 rounded-md border border-go/40 bg-ink-950 p-1.5">
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={`grid h-3.5 w-3.5 place-items-center rounded-[3px] ${i === 0 ? 'ring-1 ring-go' : 'bg-go/10'}`}
        >
          {i === 4 && <span className="h-2 w-2 rounded-full bg-white" />}
          {i === 8 && <span className="h-0 w-0 border-x-[4px] border-b-[7px] border-x-transparent border-b-red-500" />}
        </span>
      ))}
    </div>
  ),
  password: () => (
    <div className="flex gap-0.5 rounded-md border border-ink-600 bg-ink-950 p-1 font-mono text-xs font-bold text-go">
      {'TEMPO'.split('').map((l, i) => (
        <span key={i} className="grid h-6 w-4 place-items-center rounded-sm bg-ink-800">
          {l}
        </span>
      ))}
    </div>
  ),
  knobs: () => (
    <div className="flex flex-col items-center gap-1.5">
      <div className="flex gap-1">
        {[0, 1, 1, 0, 1, 1].map((on, i) => (
          <span key={i} className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-signal' : 'bg-ink-600'}`} />
        ))}
      </div>
      <div className="relative h-9 w-9 rounded-full border-[3px] border-ink-600 bg-ink-800">
        <span className="absolute left-1/2 top-1 h-2.5 w-1 -translate-x-1/2 rounded-sm bg-ink-100" />
      </div>
    </div>
  ),
  ventinggas: () => (
    <div className="flex flex-col items-center gap-1.5">
      <span className="rounded bg-ink-950 px-2 py-1 font-mono text-[8px] tracking-widest text-go">VENT GAS?</span>
      <div className="flex gap-1.5 font-mono text-[10px] font-bold">
        <span className="rounded border border-ink-600 bg-ink-800 px-2">Y</span>
        <span className="rounded border border-ink-600 bg-ink-800 px-2">N</span>
      </div>
    </div>
  ),
  capacitor: () => (
    <div className="relative h-14 w-6 rounded-md border-[3px] border-ink-600 bg-ink-950">
      <span className="absolute inset-x-0.5 bottom-0.5 h-1/2 rounded-sm bg-red-600" />
    </div>
  ),
};

export const MODULES: ModuleDef[] = [
  { id: 'wires', name: 'Cavi', blurb: '3–6 cavi colorati', Component: Wires, Icon: I.wires },
  { id: 'button', name: 'Il Pulsante', blurb: 'Premi o tieni premuto', Component: ButtonModule, Icon: I.button },
  { id: 'keypads', name: 'Tastierini', blurb: '4 simboli strani', Component: Keypads, Icon: I.keypads },
  { id: 'simon', name: 'Simon Dice', blurb: 'Sequenza di luci', Component: SimonSays, Icon: I.simon },
  { id: 'whosonfirst', name: 'Chi per Primo', blurb: 'Display + 6 parole', Component: WhosOnFirst, Icon: I.whosonfirst },
  { id: 'memory', name: 'Memoria', blurb: '5 fasi, numeri 1–4', Component: Memory, Icon: I.memory },
  { id: 'morse', name: 'Codice Morse', blurb: 'Luce lampeggiante', Component: MorseCode, Icon: I.morse },
  { id: 'compwires', name: 'Cavi Complicati', blurb: 'LED, stelle, strisce', Component: CompWires, Icon: I.compwires },
  { id: 'wireseq', name: 'Sequenza di Cavi', blurb: 'Pannelli A/B/C', Component: WireSequences, Icon: I.wireseq },
  { id: 'mazes', name: 'Labirinti', blurb: 'Griglia 6×6', Component: Mazes, Icon: I.mazes },
  { id: 'password', name: 'Password', blurb: '5 lettere a rullo', Component: Password, Icon: I.password },
  { id: 'ventinggas', name: 'Gas di Scarico', blurb: 'Rispondi Y / N', needy: true, Component: VentingGas, Icon: I.ventinggas },
  { id: 'capacitor', name: 'Condensatore', blurb: 'Tieni giù la leva', needy: true, Component: CapacitorDischarge, Icon: I.capacitor },
  { id: 'knobs', name: 'Manopole', blurb: '12 LED, 4 posizioni', needy: true, Component: Knobs, Icon: I.knobs },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleDef>;
