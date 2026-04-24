import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';

const COLORS = [
  { id: 'red', label: 'Rosso', bg: 'bg-red-500 text-white' },
  { id: 'white', label: 'Bianco', bg: 'bg-white text-gray-900 border-gray-300' },
  { id: 'blue', label: 'Blu', bg: 'bg-blue-500 text-white' },
  { id: 'yellow', label: 'Giallo', bg: 'bg-yellow-400 text-gray-900' },
  { id: 'black', label: 'Nero', bg: 'bg-gray-800 text-white border-gray-600' },
];

export const Wires: React.FC = () => {
  const { isEven } = useBombContext();
  const [wireCount, setWireCount] = useState<number>(3);
  const [wires, setWires] = useState<string[]>(Array(3).fill('red'));

  const handleWireChange = (index: number, colorId: string) => {
    const newWires = [...wires];
    newWires[index] = colorId;
    setWires(newWires);
  };

  const handleCountChange = (count: number) => {
    setWireCount(count);
    setWires((prev) => {
      if (prev.length < count) {
        return [...prev, ...Array(count - prev.length).fill('red')];
      }
      return prev.slice(0, count);
    });
  };

  const calculateCut = (): number => {
    const c = wires.length;
    const count = (color: string) => wires.filter(w => w === color).length;
    const lastColor = wires[c - 1];

    if (c === 3) {
      if (count('red') === 0) return 2;
      if (lastColor === 'white') return c;
      if (count('blue') > 1) return wires.lastIndexOf('blue') + 1;
      return c;
    }
    if (c === 4) {
      if (count('red') > 1 && isEven === false) return wires.lastIndexOf('red') + 1;
      if (lastColor === 'yellow' && count('red') === 0) return 1;
      if (count('blue') === 1) return 1;
      if (count('yellow') > 1) return c;
      return 2;
    }
    if (c === 5) {
      if (lastColor === 'black' && isEven === false) return 4;
      if (count('red') === 1 && count('yellow') > 1) return 1;
      if (count('black') === 0) return 2;
      return 1;
    }
    if (c === 6) {
      if (count('yellow') === 0 && isEven === false) return 3;
      if (count('yellow') === 1 && count('white') > 1) return 4;
      if (count('red') === 0) return c;
      return 4;
    }
    return -1;
  };

  const isDataMissing = (wireCount === 4 || wireCount === 5 || wireCount === 6) && isEven === undefined;

  const resultIndex = calculateCut();

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Numero di Cavi</label>
        <div className="flex gap-2">
          {[3, 4, 5, 6].map(n => (
            <button
              key={n}
              onClick={() => handleCountChange(n)}
              className={`flex-1 py-3 font-mono font-bold rounded ${wireCount === n ? 'bg-amber-500 text-gray-900' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-400">Colori dei Cavi (dall'alto al basso)</label>
        {wires.map((wireColor, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="w-8 h-10 flex items-center justify-center bg-gray-800 rounded font-mono text-gray-400">{idx + 1}</span>
            <div className="flex-1 flex gap-1">
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleWireChange(idx, c.id)}
                  className={`flex-1 rounded border-2 transition-transform active:scale-95 ${c.bg} ${wireColor === c.id ? `border-amber-500 ring-2 ring-amber-500 ring-offset-2 ring-offset-gray-900` : 'border-transparent opacity-50 hover:opacity-100'}`}
                >
                  <span className="sr-only">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-800">
        {isDataMissing ? (
          <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
            <p className="text-red-400 font-bold mb-1">Dati Mancanti</p>
            <p className="text-red-300/80 text-sm">Inserisci il Numero Seriale nelle impostazioni (bottone in basso a destra).</p>
          </div>
        ) : (
          <div className="bg-green-900/20 border border-green-500/30 p-6 rounded-lg text-center">
            <p className="text-green-500 uppercase tracking-widest text-sm font-bold mb-2">Azione Richiesta</p>
            <p className="text-3xl lg:text-4xl font-black text-white">
              Taglia il cavo <span className="text-amber-500">{resultIndex}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
