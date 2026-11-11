import React from 'react';
import { RotateCcw, Settings2 } from 'lucide-react';
import { useBombContext, INDICATORS } from '../context/BombContext';

const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');
export { cx };

/* ------------------------------------------------------------------ */
/* Layout                                                              */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  title?: React.ReactNode;
  step?: number | string;
  right?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}> = ({ title, step, right, className, children }) => (
  <section className={cx('rounded-2xl border border-ink-700/70 bg-ink-900/80 p-4 sm:p-5', className)}>
    {(title || right) && (
      <header className="mb-3 flex items-center gap-2.5">
        {step !== undefined && (
          <span className="grid h-6 min-w-6 place-items-center rounded-md bg-signal px-1.5 font-mono text-xs font-bold text-ink-950">
            {step}
          </span>
        )}
        {title && <h3 className="text-[13px] font-semibold uppercase tracking-wider text-ink-300">{title}</h3>}
        {right && <div className="ml-auto flex items-center gap-2">{right}</div>}
      </header>
    )}
    {children}
  </section>
);

export const Hint: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={cx('text-sm leading-relaxed text-ink-400', className)}>{children}</p>
);

/* ------------------------------------------------------------------ */
/* Bottoni                                                             */
/* ------------------------------------------------------------------ */

export const Choice: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean; tone?: 'signal' | 'neutral' }
> = ({ active, tone = 'signal', className, children, ...rest }) => (
  <button
    type="button"
    aria-pressed={active}
    {...rest}
    className={cx(
      'min-h-11 rounded-xl border px-3 py-2 text-sm font-semibold transition-[background,border-color,color,transform] active:scale-[0.97] disabled:opacity-35',
      active
        ? tone === 'signal'
          ? 'border-signal bg-signal text-ink-950'
          : 'border-ink-300 bg-ink-100 text-ink-950'
        : 'border-ink-700 bg-ink-850 text-ink-300 hover:border-ink-500 hover:text-ink-100',
      className,
    )}
  >
    {children}
  </button>
);

export const GhostButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...rest }) => (
  <button
    type="button"
    {...rest}
    className={cx(
      'inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 text-xs font-semibold uppercase tracking-wide text-ink-300 transition-colors hover:border-ink-500 hover:text-ink-100 active:scale-[0.97] disabled:opacity-35',
      className,
    )}
  >
    {children}
  </button>
);

export const ResetButton: React.FC<{ onClick: () => void; disabled?: boolean; label?: string }> = ({
  onClick,
  disabled,
  label = 'Reset',
}) => (
  <GhostButton onClick={onClick} disabled={disabled}>
    <RotateCcw size={14} /> {label}
  </GhostButton>
);

/* ------------------------------------------------------------------ */
/* Risultati                                                           */
/* ------------------------------------------------------------------ */

type Tone = 'go' | 'stop' | 'warn' | 'info' | 'idle';

const TONES: Record<Tone, string> = {
  go: 'border-go/40 bg-go/10 text-go',
  stop: 'border-stop/40 bg-stop/10 text-stop',
  warn: 'border-signal/40 bg-signal/10 text-signal',
  info: 'border-sky-400/40 bg-sky-400/10 text-sky-300',
  idle: 'border-ink-700 border-dashed bg-ink-900/60 text-ink-500',
};

export const Result: React.FC<{
  tone: Tone;
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}> = ({ tone, label, children, className }) => (
  <div
    role="status"
    aria-live="polite"
    className={cx('animate-rise rounded-2xl border p-4 text-center sm:p-6', TONES[tone], className)}
  >
    {label && <p className="mb-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.2em] opacity-90">{label}</p>}
    <div className="text-ink-100">{children}</div>
  </div>
);

export const BigText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <p className={cx('font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl', className)}>{children}</p>
);

/* ------------------------------------------------------------------ */
/* Dati bomba inline (evita di aprire il pannello impostazioni)       */
/* ------------------------------------------------------------------ */

export type Fact = 'serial' | 'batteries' | 'strikes' | 'parallel' | 'CAR' | 'FRK';

export const Stepper: React.FC<{ value: number | undefined; onChange: (v: number) => void; label: string }> = ({
  value,
  onChange,
  label,
}) => (
  <div className="flex h-11 items-stretch overflow-hidden rounded-xl border border-ink-700 bg-ink-850">
    <button
      type="button"
      aria-label={`Diminuisci ${label}`}
      onClick={() => onChange(Math.max(0, (value ?? 0) - 1))}
      className="w-11 text-lg text-ink-300 hover:bg-ink-800"
    >
      −
    </button>
    <span className="grid min-w-10 flex-1 place-items-center border-x border-ink-700 font-mono text-base font-bold">
      {value ?? '–'}
    </span>
    <button
      type="button"
      aria-label={`Aumenta ${label}`}
      onClick={() => onChange((value ?? -1) + 1)}
      className="w-11 text-lg text-ink-300 hover:bg-ink-800"
    >
      +
    </button>
  </div>
);

export const StrikePicker: React.FC = () => {
  const { strikes, setStrikes } = useBombContext();
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {[0, 1, 2].map((s) => (
        <button
          key={s}
          type="button"
          aria-pressed={strikes === s}
          onClick={() => setStrikes(s)}
          className={cx(
            'h-11 rounded-xl border font-mono text-base font-bold transition-colors',
            strikes === s ? 'border-stop bg-stop/15 text-stop' : 'border-ink-700 bg-ink-850 text-ink-500 hover:text-ink-300',
          )}
        >
          {s === 0 ? '0' : '✕'.repeat(s)}
        </button>
      ))}
    </div>
  );
};

const YesNo: React.FC<{ value: boolean | undefined; onChange: (v: boolean) => void }> = ({ value, onChange }) => (
  <div className="grid grid-cols-2 gap-1.5">
    <Choice active={value === true} onClick={() => onChange(true)}>
      Sì
    </Choice>
    <Choice active={value === false} onClick={() => onChange(false)}>
      No
    </Choice>
  </div>
);

/**
 * Mostra, dentro il modulo, solo i dati della bomba necessari al calcolo,
 * modificabili al volo. Comodo soprattutto su mobile.
 */
export const QuickFacts: React.FC<{ facts: Fact[]; highlight?: Fact[] }> = ({ facts, highlight = [] }) => {
  const ctx = useBombContext();
  const { serial, setSerial, batteries, setBatteries, indicators, toggleIndicator, ports, togglePort, setPortsChecked, hasParallel } = ctx;

  const box = (f: Fact) =>
    cx(
      'flex flex-col gap-1.5 rounded-xl p-2 -m-2 transition-colors',
      highlight.includes(f) && 'bg-signal/10 ring-1 ring-signal/60',
    );
  const lab = 'text-[11px] font-semibold uppercase tracking-wider text-ink-400';

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-4 rounded-2xl border border-ink-700/70 bg-ink-900/60 p-4">
      {facts.includes('serial') && (
        <label className={cx(box('serial'), 'col-span-2 sm:col-span-1')}>
          <span className={lab}>Numero seriale</span>
          <input
            value={serial}
            onChange={(e) => setSerial(e.target.value)}
            placeholder="es. AB3DE4"
            autoCapitalize="characters"
            autoCorrect="off"
            autoComplete="off"
            spellCheck={false}
            className="h-11 w-full rounded-xl border border-ink-700 bg-ink-850 px-3 font-mono uppercase tracking-[0.2em] text-ink-100 outline-none placeholder:tracking-normal placeholder:text-ink-500 focus:border-signal"
          />
        </label>
      )}
      {facts.includes('batteries') && (
        <div className={box('batteries')}>
          <span className={lab}>Batterie</span>
          <Stepper value={batteries} onChange={setBatteries} label="batterie" />
        </div>
      )}
      {facts.includes('strikes') && (
        <div className={cx(box('strikes'), 'col-span-2 sm:col-span-1')}>
          <span className={lab}>Errori (strike)</span>
          <StrikePicker />
        </div>
      )}
      {facts.includes('parallel') && (
        <div className={box('parallel')}>
          <span className={lab}>Porta parallela</span>
          <YesNo
            value={hasParallel}
            onChange={(v) => {
              if (v !== ports.includes('Parallel')) togglePort('Parallel');
              else setPortsChecked(true);
            }}
          />
        </div>
      )}
      {(['CAR', 'FRK'] as const).map(
        (ind) =>
          facts.includes(ind) && (
            <div key={ind} className={box(ind)}>
              <span className={lab}>Indicatore {ind} acceso</span>
              <YesNo
                value={indicators.includes(ind)}
                onChange={(v) => v !== indicators.includes(ind) && toggleIndicator(ind)}
              />
            </div>
          ),
      )}
    </div>
  );
};

export const OpenConfigLink: React.FC<{ children?: React.ReactNode }> = ({ children = 'Apri dati bomba' }) => {
  const { setConfigOpen } = useBombContext();
  return (
    <button
      type="button"
      onClick={() => setConfigOpen(true)}
      className="inline-flex items-center gap-1 font-semibold text-signal underline-offset-2 hover:underline lg:hidden"
    >
      <Settings2 size={14} /> {children}
    </button>
  );
};

export { INDICATORS };
