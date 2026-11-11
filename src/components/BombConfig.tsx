import React, { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useBombContext, INDICATORS, PORTS } from '../context/BombContext';
import { Stepper, StrikePicker, cx } from './ui';

const Label: React.FC<{ children: React.ReactNode; hint?: React.ReactNode }> = ({ children, hint }) => (
  <div className="mb-2 flex items-baseline justify-between gap-2">
    <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{children}</span>
    {hint && <span className="font-mono text-[11px] text-ink-500">{hint}</span>}
  </div>
);

const ConfigForm: React.FC = () => {
  const {
    serial, setSerial, batteries, setBatteries, indicators, toggleIndicator, ports, togglePort,
    portsChecked, setPortsChecked, hasVowel, lastDigit, isEven, resetBomb,
  } = useBombContext();

  return (
    <div className="space-y-6">
      <div>
        <Label hint={serial ? `${serial.length}/6` : undefined}>Numero seriale</Label>
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value)}
          autoCapitalize="characters"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          placeholder="es. AL5QF2"
          className="h-12 w-full rounded-xl border border-ink-700 bg-ink-850 px-3 font-mono text-lg uppercase tracking-[0.3em] text-ink-100 outline-none placeholder:text-sm placeholder:tracking-normal placeholder:text-ink-500 focus:border-signal"
        />
        <div className="mt-2 flex flex-wrap gap-1.5 font-mono text-[11px]">
          <Tag on={hasVowel}>{hasVowel === undefined ? 'vocale ?' : hasVowel ? 'con vocale' : 'senza vocali'}</Tag>
          <Tag on={isEven}>
            {lastDigit === undefined ? 'ultima cifra ?' : `ultima cifra ${lastDigit} · ${isEven ? 'pari' : 'dispari'}`}
          </Tag>
        </div>
      </div>

      <div>
        <Label>Batterie</Label>
        <Stepper value={batteries} onChange={setBatteries} label="batterie" />
      </div>

      <div>
        <Label>Errori (strike)</Label>
        <StrikePicker />
      </div>

      <div>
        <Label hint="tocca quelli accesi">Indicatori accesi</Label>
        <div className="grid grid-cols-4 gap-1.5">
          {INDICATORS.map((ind) => (
            <button
              key={ind}
              type="button"
              aria-pressed={indicators.includes(ind)}
              onClick={() => toggleIndicator(ind)}
              className={cx(
                'h-10 rounded-lg border font-mono text-xs font-bold transition-colors',
                indicators.includes(ind)
                  ? 'border-signal bg-signal/15 text-signal'
                  : 'border-ink-700 bg-ink-850 text-ink-500 hover:text-ink-300',
              )}
            >
              {indicators.includes(ind) && <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-signal align-middle" />}
              {ind}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label>Porte presenti</Label>
        <div className="grid grid-cols-3 gap-1.5">
          {PORTS.map((p) => (
            <button
              key={p.id}
              type="button"
              aria-pressed={ports.includes(p.id)}
              onClick={() => togglePort(p.id)}
              className={cx(
                'h-10 rounded-lg border px-1 text-xs font-semibold transition-colors',
                ports.includes(p.id)
                  ? 'border-sky-400 bg-sky-400/15 text-sky-300'
                  : 'border-ink-700 bg-ink-850 text-ink-500 hover:text-ink-300',
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <label className="mt-2 flex items-center gap-2 text-xs text-ink-400">
          <input
            type="checkbox"
            checked={portsChecked}
            onChange={(e) => setPortsChecked(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-signal)]"
          />
          Porte controllate (nessuna porta = nessuna selezionata)
        </label>
      </div>

      <button
        type="button"
        onClick={() => {
          if (confirm('Cancellare tutti i dati della bomba?')) resetBomb();
        }}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-stop/30 text-sm font-semibold text-stop/90 hover:bg-stop/10"
      >
        <Trash2 size={16} /> Nuova bomba
      </button>
    </div>
  );
};

const Tag: React.FC<{ on: boolean | undefined; children: React.ReactNode }> = ({ on, children }) => (
  <span
    className={cx(
      'rounded-md border px-2 py-0.5',
      on === undefined ? 'border-ink-700 text-ink-500' : 'border-ink-600 bg-ink-800 text-ink-300',
    )}
  >
    {children}
  </span>
);

export const BombConfig: React.FC = () => {
  const { configOpen, setConfigOpen } = useBombContext();

  useEffect(() => {
    if (!configOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setConfigOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [configOpen, setConfigOpen]);

  return (
    <>
      {/* Desktop: barra laterale fissa */}
      <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-80 shrink-0 overflow-y-auto border-l border-ink-700/70 bg-ink-900/60 p-5 lg:block">
        <h2 className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">Dati bomba</h2>
        <ConfigForm />
      </aside>

      {/* Mobile: bottom sheet */}
      {configOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Dati bomba">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfigOpen(false)} />
          <div className="animate-rise safe-bottom absolute inset-x-0 bottom-0 max-h-[88dvh] overflow-y-auto rounded-t-3xl border-t border-ink-700 bg-ink-900 px-5 pt-3">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-ink-600" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-signal">Dati bomba</h2>
              <button
                type="button"
                onClick={() => setConfigOpen(false)}
                aria-label="Chiudi"
                className="grid h-10 w-10 place-items-center rounded-full bg-ink-800 text-ink-300"
              >
                <X size={20} />
              </button>
            </div>
            <ConfigForm />
            <button
              type="button"
              onClick={() => setConfigOpen(false)}
              className="sticky bottom-0 mt-6 h-12 w-full rounded-xl bg-signal font-semibold text-ink-950"
            >
              Fatto
            </button>
          </div>
        </div>
      )}
    </>
  );
};
