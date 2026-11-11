import React from 'react';
import { MODULES, ModuleId } from '../modules/registry';

export const ModuleHub: React.FC<{ onOpen: (id: ModuleId) => void }> = ({ onOpen }) => {
  const base = MODULES.filter((m) => !m.needy);
  const needy = MODULES.filter((m) => m.needy);

  return (
    <div className="animate-rise space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">Quale modulo hai davanti?</h1>
        <p className="mt-1 text-sm text-ink-400">
          Scegli il modulo descritto da chi ha la bomba. Le regole seguono il manuale ufficiale v1.
        </p>
      </div>

      <Group title="Moduli" items={base} onOpen={onOpen} />
      <Group title="Moduli bisognosi" subtitle="Non si disarmano: vanno gestiti finché la bomba è attiva" items={needy} onOpen={onOpen} />
    </div>
  );
};

const Group: React.FC<{
  title: string;
  subtitle?: string;
  items: typeof MODULES;
  onOpen: (id: ModuleId) => void;
}> = ({ title, subtitle, items, onOpen }) => (
  <section>
    <div className="mb-3 flex items-baseline gap-3">
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">{title}</h2>
      {subtitle && <span className="hidden text-xs text-ink-500 sm:inline">{subtitle}</span>}
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
      {items.map(({ id, name, blurb, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onOpen(id)}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900 text-left transition-[border-color,transform,background] hover:border-signal/70 hover:bg-ink-850 active:scale-[0.98]"
        >
          <div className="grid h-24 place-items-center border-b border-ink-700/60 bg-ink-850/60 px-6 sm:h-28">
            <div className="flex w-full max-w-[96px] items-center justify-center transition-transform group-hover:scale-105">
              <Icon />
            </div>
          </div>
          <div className="px-3 py-2.5">
            <p className="font-display text-[15px] font-semibold leading-tight text-ink-100 group-hover:text-signal">{name}</p>
            <p className="mt-0.5 truncate text-xs text-ink-500">{blurb}</p>
          </div>
        </button>
      ))}
    </div>
  </section>
);
