import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';

// R B S L
// 0 0 0 0: T (Taglia)
// 0 0 0 1: N (Non tagliare)
// 0 0 1 0: T
// 0 0 1 1: B (Batterie >= 2)
// 0 1 0 0: S (Seriale pari)
// 0 1 0 1: P (Porta parallela)
// 0 1 1 0: N
// 0 1 1 1: P
// 1 0 0 0: S
// 1 0 0 1: B
// 1 0 1 0: T
// 1 0 1 1: B
// 1 1 0 0: S
// 1 1 0 1: S
// 1 1 1 0: P
// 1 1 1 1: N

const LOOKUP_TABLE: Record<string, string> = {
  '0000': 'T', '0001': 'N', '0010': 'T', '0011': 'B',
  '0100': 'S', '0101': 'P', '0110': 'N', '0111': 'P',
  '1000': 'S', '1001': 'B', '1010': 'T', '1011': 'B',
  '1100': 'S', '1101': 'S', '1110': 'P', '1111': 'N'
};

export const CompWires: React.FC = () => {
  const { isEven, batteries, hasParallel } = useBombContext();
  
  const [hasRed, setHasRed] = useState(false);
  const [hasBlue, setHasBlue] = useState(false);
  const [hasStar, setHasStar] = useState(false);
  const [hasLed, setHasLed] = useState(false);

  const calculateAction = () => {
    const key = `${hasRed ? 1 : 0}${hasBlue ? 1 : 0}${hasStar ? 1 : 0}${hasLed ? 1 : 0}`;
    const code = LOOKUP_TABLE[key];

    if (code === 'T') return { action: 'TAGLIA', complete: true, color: 'text-green-500' };
    if (code === 'N') return { action: 'NON TAGLIARE', complete: true, color: 'text-red-500' };
    
    if (code === 'S') {
      if (isEven === undefined) return { action: 'Servono dati...', complete: false, missing: 'Seriale', color: 'text-amber-500' };
      return { action: isEven ? 'TAGLIA' : 'NON TAGLIARE', complete: true, color: isEven ? 'text-green-500' : 'text-red-500' };
    }
    
    if (code === 'B') {
      if (batteries === undefined) return { action: 'Servono dati...', complete: false, missing: 'Numero Batterie', color: 'text-amber-500' };
      return { action: batteries >= 2 ? 'TAGLIA' : 'NON TAGLIARE', complete: true, color: batteries >= 2 ? 'text-green-500' : 'text-red-500' };
    }
    
    if (code === 'P') {
      // In the game, if you didn't check the config but we track it, if there's no parallel it's false.
      // But if user hasn't set ports, how do we know it's missing vs just not there?
      // For ports, if it's not marked we assume it's not there, but it's safer to prompt if they never set anything.
      // But we don't track "isPortsConfigured". Let's assume hasParallel is the source of truth.
      return { action: hasParallel ? 'TAGLIA' : 'NON TAGLIARE', complete: true, color: hasParallel ? 'text-green-500' : 'text-red-500' };
    }

    return { action: 'ERRORE', complete: true, color: 'text-gray-500' };
  };

  const res = calculateAction();

  const handleReset = () => {
    setHasRed(false);
    setHasBlue(false);
    setHasStar(false);
    setHasLed(false);
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => setHasRed(!hasRed)}
          className={`p-6 border-2 rounded-xl text-center font-bold tracking-wider transition-all ${hasRed ? 'bg-red-500 border-red-400 text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
        >
          ROSSO
        </button>
        <button
          onClick={() => setHasBlue(!hasBlue)}
          className={`p-6 border-2 rounded-xl text-center font-bold tracking-wider transition-all ${hasBlue ? 'bg-blue-500 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
        >
          BLU
        </button>
        <button
          onClick={() => setHasStar(!hasStar)}
          className={`p-6 border-2 rounded-xl text-center font-bold tracking-wider transition-all flex justify-center items-center gap-2 ${hasStar ? 'bg-gray-700 border-white text-white' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
        >
          ★ STELLA
        </button>
        <button
          onClick={() => setHasLed(!hasLed)}
          className={`p-6 border-2 rounded-xl text-center font-bold tracking-wider transition-all flex justify-center items-center gap-2 ${hasLed ? 'bg-amber-400 border-yellow-200 text-gray-900 shadow-[0_0_15px_rgba(251,191,36,0.5)]' : 'bg-gray-800 border-gray-700 text-gray-500'}`}
        >
          ⚲ LED
        </button>
      </div>

      <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 text-center relative overflow-hidden">
        <p className="text-gray-400 font-mono text-sm uppercase mb-2">Risultato per questo cavo</p>
        <div className={`text-4xl md:text-5xl font-black ${res.color}`}>
          {res.action}
        </div>
        {!res.complete && (
          <p className="mt-4 text-amber-500/80 text-sm">
            Manca: <strong>{res.missing}</strong>. Clicca sull'icona impostazioni in basso a destra per inserire questo dato.
          </p>
        )}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleReset}
          className="text-gray-400 hover:text-white font-mono text-sm uppercase underline decoration-gray-600 hover:decoration-white transition-all tracking-wider"
        >
          Resetta Cavo
        </button>
      </div>
    </div>
  );
};
