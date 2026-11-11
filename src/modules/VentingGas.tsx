import React from 'react';
import { Hint, Panel } from '../components/ui';

const Row: React.FC<{ prompt: string; it: string; key_: string; tone: string; label: string }> = ({ prompt, it, key_, tone, label }) => (
  <div className="flex items-center gap-4 rounded-2xl border border-ink-700 bg-ink-950 p-4">
    <div className="min-w-0 flex-1">
      <p className="font-mono text-lg font-bold tracking-widest text-go">{prompt}</p>
      <p className="text-xs text-ink-500">{it}</p>
    </div>
    <div className="text-center">
      <span className={`grid h-16 w-16 place-items-center rounded-xl border-2 font-mono text-3xl font-bold ${tone}`}>{key_}</span>
      <span className="mt-1 block text-[11px] font-semibold uppercase tracking-wider text-ink-400">{label}</span>
    </div>
  </div>
);

export const VentingGas: React.FC = () => (
  <div className="space-y-4">
    <Panel title="Rispondi al computer">
      <div className="space-y-3">
        <Row prompt="VENT GAS?" it="Sfogare il gas?" key_="Y" label="Sì" tone="border-go text-go" />
        <Row prompt="DETONATE?" it="Detonare?" key_="N" label="No" tone="border-stop text-stop" />
      </div>
      <Hint className="mt-4 text-xs">
        Premi “Y” per Sì oppure “N” per No prima che il timer del modulo arrivi a zero. Ignorare il computer è una pessima idea.
      </Hint>
    </Panel>
  </div>
);
