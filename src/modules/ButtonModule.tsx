import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';

const COLORS = [
  { id: 'red', label: 'Rosso', bg: 'bg-red-500' },
  { id: 'blue', label: 'Blu', bg: 'bg-blue-500' },
  { id: 'yellow', label: 'Giallo', bg: 'bg-yellow-400 text-gray-900' },
  { id: 'white', label: 'Bianco', bg: 'bg-white text-gray-900' },
  { id: 'other', label: 'Altro', bg: 'bg-gray-700 text-white' }
];

const TEXTS = ['Annulla', 'Detona', 'Tieni', 'Altro'];

export const ButtonModule: React.FC = () => {
  const { batteries, indicators } = useBombContext();
  const [color, setColor] = useState('red');
  const [text, setText] = useState('Detona');

  const calculateAction = (): 'HOLD' | 'PRESS' | 'MISSING_DATA' => {
    if (color === 'blue' && text === 'Annulla') return 'HOLD';
    if (batteries === undefined) return 'MISSING_DATA';
    if (batteries > 1 && text === 'Detona') return 'PRESS';
    if (color === 'white' && indicators.includes('CAR')) return 'HOLD';
    if (batteries > 2 && indicators.includes('FRK')) return 'PRESS';
    if (color === 'yellow') return 'HOLD';
    if (color === 'red' && text === 'Tieni') return 'PRESS';
    return 'HOLD';
  };

  const action = calculateAction();

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Colore del Pulsante</label>
          <div className="flex flex-col gap-2">
            {COLORS.map(c => (
              <button
                key={c.id}
                onClick={() => setColor(c.id)}
                className={`py-3 rounded font-bold transition-all ${
                  color === c.id 
                  ? `${c.bg} ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900 scale-105` 
                  : `${c.bg} opacity-50 hover:opacity-100`
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-3">Scritta sul Pulsante</label>
          <div className="flex flex-col gap-2">
            {TEXTS.map(t => (
              <button
                key={t}
                onClick={() => setText(t)}
                className={`py-3 rounded font-mono font-bold transition-all uppercase ${
                  text === t 
                  ? `bg-gray-700 text-amber-500 ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900 scale-105` 
                  : `bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white`
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-800 mt-8">
        {action === 'MISSING_DATA' ? (
          <div className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg">
            <p className="text-amber-400 font-bold mb-1">Dati Bomba Richiesti</p>
            <p className="text-amber-300/80 text-sm">Inserisci il numero di batterie nelle impostazioni bomba.</p>
          </div>
        ) : action === 'PRESS' ? (
          <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-lg text-center">
            <p className="text-green-500 uppercase tracking-widest text-sm font-bold mb-2">Azione Richiesta</p>
            <p className="text-3xl lg:text-4xl font-black text-white">Premi e rilascia subito</p>
          </div>
        ) : (
          <div className="bg-blue-900/20 border border-blue-500/30 p-6 rounded-lg">
            <div className="text-center mb-6">
              <p className="text-blue-500 uppercase tracking-widest text-sm font-bold mb-2">Azione Richiesta</p>
              <p className="text-3xl lg:text-4xl font-black text-white">TIENI PREMUTO</p>
              <p className="text-gray-400 mt-2">mentre tieni premuto, guarda la striscia illuminata a lato:</p>
            </div>
            
            <div className="grid gap-3 font-mono text-sm">
              <div className="flex items-center gap-4 bg-gray-800/80 p-3 rounded">
                <div className="w-8 h-8 rounded bg-blue-500 flex-shrink-0"></div>
                <div className="text-gray-300">Rilascia quando il timer ha un <strong className="text-amber-400 text-xl mx-1">4</strong> in qualsiasi posizione</div>
              </div>
              <div className="flex items-center gap-4 bg-gray-800/80 p-3 rounded">
                <div className="w-8 h-8 rounded bg-white flex-shrink-0"></div>
                <div className="text-gray-300">Rilascia quando il timer ha un <strong className="text-amber-400 text-xl mx-1">1</strong> in qualsiasi posizione</div>
              </div>
              <div className="flex items-center gap-4 bg-gray-800/80 p-3 rounded">
                <div className="w-8 h-8 rounded bg-yellow-400 flex-shrink-0"></div>
                <div className="text-gray-300">Rilascia quando il timer ha un <strong className="text-amber-400 text-xl mx-1">5</strong> in qualsiasi posizione</div>
              </div>
              <div className="flex items-center gap-4 bg-gray-800/80 p-3 rounded">
                <div className="w-8 h-8 rounded bg-gray-500 flex-shrink-0 flex items-center justify-center text-[10px] text-white">ALTRO</div>
                <div className="text-gray-300">Rilascia quando il timer ha un <strong className="text-amber-400 text-xl mx-1">1</strong> in qualsiasi posizione</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
