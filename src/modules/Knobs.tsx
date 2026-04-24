import React, { useState } from 'react';

const CONFIGS = [
  { pos: 'SU / UP', grid: [[false, true, false, true, true, false], [true, true, true, true, false, true]] },
  { pos: 'SU / UP', grid: [[false, false, false, true, false, true], [false, true, true, false, true, true]] },
  { pos: 'GIÙ / DOWN', grid: [[false, true, true, false, true, false], [true, true, true, true, false, true]] },
  { pos: 'GIÙ / DOWN', grid: [[true, false, true, false, true, false], [false, true, false, false, false, true]] },
  { pos: 'SINISTRA / LEFT', grid: [[false, false, true, false, false, false], [true, false, false, true, true, true]] },
  { pos: 'SINISTRA / LEFT', grid: [[false, false, false, false, false, true], [false, false, false, false, true, true]] },
  { pos: 'DESTRA / RIGHT', grid: [[true, false, true, true, true, true], [true, true, true, false, true, false]] },
  { pos: 'DESTRA / RIGHT', grid: [[true, false, true, true, false, false], [true, true, true, false, true, false]] }
];

export const Knobs: React.FC = () => {
  const [leds, setLeds] = useState<boolean[][]>([
    [false, false, false, false, false, false],
    [false, false, false, false, false, false]
  ]);

  const toggleLed = (r: number, c: number) => {
    setLeds(prev => {
      const next = [...prev];
      next[r] = [...next[r]];
      next[r][c] = !next[r][c];
      return next;
    });
  };

  const getMatch = () => {
    return CONFIGS.find(cfg => {
      return cfg.grid.every((row, r) => row.every((val, c) => val === leds[r][c]));
    });
  };

  const match = getMatch();

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">Manopole</h2>
          <p className="text-sm text-zinc-500 mt-1">Accendi i LED in modo che corrispondano a quelli visibili sulla bomba.</p>
        </div>
        <button 
          onClick={() => setLeds([[false,false,false,false,false,false],[false,false,false,false,false,false]])}
          className="text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/30 text-zinc-400 p-2 rounded transition-colors"
        >
          Resetta
        </button>
      </div>

      <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-8 shadow-xl">
        <div className="flex flex-col gap-4 mb-8 items-center bg-zinc-950 p-6 rounded-lg border border-zinc-800">
          <div className="flex gap-4">
            {leds[0].map((isOn, c) => (
              <React.Fragment key={`top-${c}`}>
                <button
                  onClick={() => toggleLed(0, c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all shadow-inner ${isOn ? 'bg-amber-400 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}
                />
                {c === 2 && <div className="w-4" />}
              </React.Fragment>
            ))}
          </div>
          <div className="flex gap-4">
            {leds[1].map((isOn, c) => (
              <React.Fragment key={`bottom-${c}`}>
                <button
                  onClick={() => toggleLed(1, c)}
                  className={`w-10 h-10 rounded-full border-2 transition-all shadow-inner ${isOn ? 'bg-amber-400 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'bg-zinc-900 border-zinc-700 hover:border-zinc-500'}`}
                />
                {c === 2 && <div className="w-4" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {match ? (
          <div className="text-center p-6 bg-green-950/20 border border-green-900/50 rounded-xl animate-in slide-in-from-bottom-4 shadow-[0_0_30px_rgba(34,197,94,0.1)]">
            <p className="text-green-500 font-mono text-sm uppercase mb-2 tracking-widest">Posizione Corretta</p>
            <h3 className="text-5xl font-black text-white">{match.pos}</h3>
            <p className="text-zinc-500 text-xs mt-4 uppercase">Le posizioni sono relative alla scritta "SU", che potrebbe essere ruotata.</p>
          </div>
        ) : (
          <div className="text-center p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
             <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Nessuna Corrispondenza</p>
             <p className="text-zinc-600 text-xs mt-2">Configura i LED esattamente come appaiono.</p>
          </div>
        )}
      </div>
    </div>
  );
};
