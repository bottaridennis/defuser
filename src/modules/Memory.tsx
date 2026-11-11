import React, { useState } from 'react';
import { Delete } from 'lucide-react';
import { BigText, GhostButton, Panel, Result, ResetButton, cx } from '../components/ui';

interface Stage {
  display: number;
  position: number;
  label: number;
}
type Action = { type: 'POSITION' | 'LABEL'; value: number; why: string };

/** Regole del manuale (Sezione "Memoria"). `s` = fasi già completate. */
function getAction(stageNum: number, d: number, s: Stage[]): Action {
  const pos = (v: number, why: string): Action => ({ type: 'POSITION', value: v, why });
  const lab = (v: number, why: string): Action => ({ type: 'LABEL', value: v, why });
  switch (stageNum) {
    case 1:
      return [pos(2, ''), pos(2, ''), pos(3, ''), pos(4, '')][d - 1];
    case 2:
      return [
        lab(4, ''),
        pos(s[0].position, 'stessa posizione della fase 1'),
        pos(1, ''),
        pos(s[0].position, 'stessa posizione della fase 1'),
      ][d - 1];
    case 3:
      return [
        lab(s[1].label, 'stessa etichetta della fase 2'),
        lab(s[0].label, 'stessa etichetta della fase 1'),
        pos(3, ''),
        lab(4, ''),
      ][d - 1];
    case 4:
      return [
        pos(s[0].position, 'stessa posizione della fase 1'),
        pos(1, ''),
        pos(s[1].position, 'stessa posizione della fase 2'),
        pos(s[1].position, 'stessa posizione della fase 2'),
      ][d - 1];
    default:
      return [
        lab(s[0].label, 'stessa etichetta della fase 1'),
        lab(s[1].label, 'stessa etichetta della fase 2'),
        lab(s[3].label, 'stessa etichetta della fase 4'),
        lab(s[2].label, 'stessa etichetta della fase 3'),
      ][d - 1];
  }
}

const NumPad: React.FC<{ onPick: (n: number) => void; big?: boolean }> = ({ onPick, big }) => (
  <div className="grid grid-cols-4 gap-2">
    {[1, 2, 3, 4].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onPick(n)}
        className={cx(
          'rounded-xl border border-ink-700 bg-ink-850 font-mono font-bold text-ink-100 transition-[border-color,transform] hover:border-signal active:scale-95',
          big ? 'h-20 text-4xl' : 'h-14 text-2xl',
        )}
      >
        {n}
      </button>
    ))}
  </div>
);

export const Memory: React.FC = () => {
  const [stages, setStages] = useState<Stage[]>([]);
  const [display, setDisplay] = useState<number | null>(null);

  const stageNum = stages.length + 1;
  const done = stageNum > 5;
  const action = display !== null && !done ? getAction(stageNum, display, stages) : null;

  const record = (label: number, position: number) => {
    if (display === null) return;
    setStages((s) => [...s, { display, position, label }]);
    setDisplay(null);
  };
  const reset = () => {
    setStages([]);
    setDisplay(null);
  };
  const undo = () => {
    if (display !== null) setDisplay(null);
    else setStages((s) => s.slice(0, -1));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={cx(
                'h-2 flex-1 rounded-full',
                i < stageNum ? 'bg-go' : i === stageNum ? 'bg-signal' : 'bg-ink-700',
              )}
            />
          ))}
        </div>
        <GhostButton onClick={undo} disabled={!stages.length && display === null} aria-label="Annulla ultimo passo">
          <Delete size={14} />
        </GhostButton>
        <ResetButton onClick={reset} disabled={!stages.length && display === null} />
      </div>

      {done ? (
        <Result tone="go" label="Modulo disarmato">
          <BigText>Ottimo lavoro ✓</BigText>
          <button type="button" onClick={reset} className="mt-4 text-sm font-semibold text-signal underline-offset-2 hover:underline">
            Nuovo modulo Memoria
          </button>
        </Result>
      ) : display === null ? (
        <Panel title={`Fase ${stageNum} di 5 · Che numero c'è sul display grande?`} step={stageNum}>
          <NumPad onPick={setDisplay} big />
        </Panel>
      ) : (
        <>
          <Result tone="go" label={`Fase ${stageNum} · display ${display}`}>
            <p className="text-sm text-ink-300">
              {action!.type === 'POSITION' ? 'Premi il pulsante in' : 'Premi il pulsante con scritto'}
            </p>
            <BigText className="mt-1">
              {action!.type === 'POSITION' ? (
                <>
                  <span className="text-signal">{action!.value}ª</span> posizione
                </>
              ) : (
                <>
                  il numero <span className="text-signal">“{action!.value}”</span>
                </>
              )}
            </BigText>
            {action!.why && <p className="mt-1 text-xs text-ink-400">({action!.why})</p>}
            {action!.type === 'POSITION' && (
              <div className="mx-auto mt-3 flex w-44 gap-1.5">
                {[1, 2, 3, 4].map((p) => (
                  <span key={p} className={cx('h-8 flex-1 rounded-md', p === action!.value ? 'bg-signal' : 'bg-ink-700')} />
                ))}
              </div>
            )}
          </Result>

          {stageNum < 5 ? (
            <Panel title={action!.type === 'POSITION' ? `Che numero c'era sul pulsante premuto?` : `In che posizione era (1–4 da sinistra)?`}>
              <NumPad
                onPick={(n) => (action!.type === 'POSITION' ? record(n, action!.value) : record(action!.value, n))}
              />
            </Panel>
          ) : (
            <button
              type="button"
              onClick={() => record(0, 0)}
              className="h-12 w-full rounded-xl bg-signal font-bold text-ink-950 active:scale-[0.98]"
            >
              Fatto ✓
            </button>
          )}
        </>
      )}

      {stages.length > 0 && !done && (
        <Panel title="Cronologia">
          <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-x-3 gap-y-1.5 font-mono text-sm">
            <span className="text-[11px] uppercase text-ink-500">Fase</span>
            <span className="text-[11px] uppercase text-ink-500">Display</span>
            <span className="text-[11px] uppercase text-ink-500">Posizione</span>
            <span className="text-[11px] uppercase text-ink-500">Etichetta</span>
            {stages.map((s, i) => (
              <React.Fragment key={i}>
                <span className="text-ink-400">{i + 1}</span>
                <span>{s.display}</span>
                <span className="font-bold text-signal">{s.position}</span>
                <span className="font-bold text-signal">{s.label}</span>
              </React.Fragment>
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-500">Un errore riporta il modulo alla fase 1: in quel caso premi Reset.</p>
        </Panel>
      )}
    </div>
  );
};
