import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';
import { BigText, Fact, Panel, QuickFacts, Result, ResetButton, cx } from '../components/ui';

// Diagramma di Venn del manuale. Chiave: Rosso, Blu, Stella, LED (1 = presente)
//  C = taglia · D = non tagliare · S = taglia se ultima cifra seriale pari
//  P = taglia se c'è una porta parallela · B = taglia se 2 o più batterie
const VENN: Record<string, 'C' | 'D' | 'S' | 'P' | 'B'> = {
  '0000': 'C', '0001': 'D', '0010': 'C', '0011': 'B',
  '0100': 'S', '0101': 'P', '0110': 'D', '0111': 'P',
  '1000': 'S', '1001': 'B', '1010': 'C', '1011': 'B',
  '1100': 'S', '1101': 'S', '1110': 'P', '1111': 'D',
};

type Out = { cut: boolean; why: string } | { need: Fact; why: string };

const Toggle: React.FC<{ on: boolean; set: (v: boolean) => void; onCls: string; children: React.ReactNode }> = ({ on, set, onCls, children }) => (
  <button
    type="button"
    aria-pressed={on}
    onClick={() => set(!on)}
    className={cx(
      'flex h-20 flex-col items-center justify-center gap-1 rounded-2xl border-2 text-sm font-bold transition-[background,border-color,transform] active:scale-[0.97]',
      on ? onCls : 'border-ink-700 bg-ink-850 text-ink-400',
    )}
  >
    {children}
  </button>
);

export const CompWires: React.FC = () => {
  const { isEven, batteries, hasParallel } = useBombContext();
  const [red, setRed] = useState(false);
  const [blue, setBlue] = useState(false);
  const [star, setStar] = useState(false);
  const [led, setLed] = useState(false);

  const letter = VENN[`${+red}${+blue}${+star}${+led}`];
  const out: Out = (() => {
    switch (letter) {
      case 'C': return { cut: true, why: 'Taglia sempre' };
      case 'D': return { cut: false, why: 'Non tagliare mai' };
      case 'S':
        return isEven === undefined
          ? { need: 'serial', why: 'Dipende dall\'ultima cifra del seriale' }
          : { cut: isEven, why: `Ultima cifra del seriale ${isEven ? 'pari' : 'dispari'}` };
      case 'P':
        return hasParallel === undefined
          ? { need: 'parallel', why: 'Dipende dalla porta parallela' }
          : { cut: hasParallel, why: hasParallel ? 'C\'è una porta parallela' : 'Nessuna porta parallela' };
      case 'B':
        return batteries === undefined
          ? { need: 'batteries', why: 'Dipende dal numero di batterie' }
          : { cut: batteries >= 2, why: `${batteries} batteri${batteries === 1 ? 'a' : 'e'} (servono almeno 2)` };
    }
  })();

  const reset = () => { setRed(false); setBlue(false); setStar(false); setLed(false); };
  const facts: Fact[] = letter === 'S' ? ['serial'] : letter === 'P' ? ['parallel'] : letter === 'B' ? ['batteries'] : [];

  return (
    <div className="space-y-4">
      <Panel title="Descrivi un cavo alla volta" right={<ResetButton onClick={reset} label="Cavo nuovo" disabled={!red && !blue && !star && !led} />}>
        <div className="grid grid-cols-2 gap-2.5">
          <Toggle on={red} set={setRed} onCls="border-red-400 bg-red-500/90 text-white">
            <span className="h-1.5 w-12 rounded-full bg-red-500 ring-1 ring-white/40" />
            Ha del rosso
          </Toggle>
          <Toggle on={blue} set={setBlue} onCls="border-blue-400 bg-blue-500/90 text-white">
            <span className="h-1.5 w-12 rounded-full bg-blue-500 ring-1 ring-white/40" />
            Ha del blu
          </Toggle>
          <Toggle on={star} set={setStar} onCls="border-ink-100 bg-ink-100 text-ink-950">
            <span className="text-xl leading-none">★</span>
            Stella sotto
          </Toggle>
          <Toggle on={led} set={setLed} onCls="border-amber-300 bg-amber-400 text-ink-950">
            <span className={cx('h-3 w-3 rounded-full', led ? 'bg-white shadow-[0_0_10px_white]' : 'bg-ink-600')} />
            LED acceso
          </Toggle>
        </div>
        <p className="mt-3 text-xs text-ink-500">Un cavo bianco senza strisce colorate: lascia rosso e blu spenti. Le strisce contano come colore.</p>
      </Panel>

      {'need' in out ? (
        <>
          <Result tone="warn" label="Dato mancante">
            <p className="text-ink-300">{out.why}.</p>
          </Result>
          <QuickFacts facts={facts} highlight={facts} />
        </>
      ) : (
        <>
          <Result tone={out.cut ? 'go' : 'stop'} label={`Lettera ${letter}`}>
            <BigText>{out.cut ? 'Taglia' : 'Non tagliare'}</BigText>
            <p className="mt-1 text-xs text-ink-400">{out.why}</p>
          </Result>
          {facts.length > 0 && <QuickFacts facts={facts} />}
        </>
      )}
    </div>
  );
};
