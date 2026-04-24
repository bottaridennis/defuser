import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';

const SIMON_COLORS = [
  { id: 'red', label: 'ROSSO', bg: 'bg-red-500' },
  { id: 'blue', label: 'BLU', bg: 'bg-blue-500' },
  { id: 'green', label: 'VERDE', bg: 'bg-green-500' },
  { id: 'yellow', label: 'GIALLO', bg: 'bg-yellow-400 text-gray-900' }
];

export const SimonSays: React.FC = () => {
  const { hasVowel, serial, strikes } = useBombContext();
  const [sequence, setSequence] = useState<string[]>([]);

  // Mapping based on the manual
  const getMappedColor = (color: string) => {
    if (hasVowel === undefined && !serial) return '?'; // Missing data
    
    // With Vowel
    if (hasVowel || serial) { 
      const realHasVowel = /[AEIOUaeiou]/.test(serial);
      if (realHasVowel) {
        if (strikes === 0) {
          if (color === 'red') return 'blue';
          if (color === 'blue') return 'red';
          if (color === 'green') return 'yellow';
          if (color === 'yellow') return 'green';
        } else if (strikes === 1) {
          if (color === 'red') return 'yellow';
          if (color === 'blue') return 'green';
          if (color === 'green') return 'blue';
          if (color === 'yellow') return 'red';
        } else {
          if (color === 'red') return 'green';
          if (color === 'blue') return 'red';
          if (color === 'green') return 'yellow';
          if (color === 'yellow') return 'blue';
        }
      } else { // No Vowel
        if (strikes === 0) {
          if (color === 'red') return 'blue';
          if (color === 'blue') return 'yellow';
          if (color === 'green') return 'green';
          if (color === 'yellow') return 'red';
        } else if (strikes === 1) {
          if (color === 'red') return 'red';
          if (color === 'blue') return 'blue';
          if (color === 'green') return 'yellow';
          if (color === 'yellow') return 'green';
        } else {
          if (color === 'red') return 'yellow';
          if (color === 'blue') return 'green';
          if (color === 'green') return 'blue';
          if (color === 'yellow') return 'red';
        }
      }
    }
    return '?';
  };

  const handleColorClick = (colorId: string) => {
    setSequence([...sequence, colorId]);
  };

  const undo = () => {
    setSequence(sequence.slice(0, -1));
  };

  const clear = () => setSequence([]);

  const isDataMissing = serial.length === 0;

  return (
    <div className="space-y-8">
      {isDataMissing && (
        <div className="bg-amber-900/30 border border-amber-500/50 p-4 rounded-lg mb-6">
          <p className="text-amber-400 font-bold mb-1">Dati Bomba Richiesti</p>
          <p className="text-amber-300/80 text-sm">Inserisci il numero seriale per sapere se contiene vocali.</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-400 mb-4 text-center">Cosa ha lampeggiato?</label>
        <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
          {SIMON_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => handleColorClick(c.id)}
              disabled={isDataMissing}
              className={`aspect-square rounded-full font-bold flex items-center justify-center transition-transform active:scale-90 ${c.bg} ${isDataMissing ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:brightness-110 shadow-lg shadow-black/50'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {!isDataMissing && (
        <div className="pt-8 border-t border-gray-800">
          <div className="flex justify-between items-end mb-4">
            <label className="block text-sm font-medium text-gray-400">Sequenza da premere:</label>
            <div className="space-x-2">
              <button onClick={undo} disabled={sequence.length === 0} className="px-3 py-1 bg-gray-800 rounded font-mono text-xs hover:bg-gray-700 disabled:opacity-50">ANNULLA UTLIMO</button>
              <button onClick={clear} disabled={sequence.length === 0} className="px-3 py-1 bg-gray-800 rounded font-mono text-xs hover:bg-red-900 disabled:opacity-50">RESET</button>
            </div>
          </div>
          
          <div className="min-h-[5rem] bg-gray-800 rounded-lg p-4 flex flex-wrap gap-2 items-center">
            {sequence.length === 0 ? (
              <span className="text-gray-500 font-mono text-sm italic">Nessun colore selezionato...</span>
            ) : (
              sequence.map((color, idx) => {
                const stepMapped = getMappedColor(color);
                const colorDef = SIMON_COLORS.find(c => c.id === stepMapped);
                
                return (
                  <div key={idx} className="flex items-center gap-2">
                    {idx > 0 && <span className="text-gray-600 font-bold">→</span>}
                    <div className={`px-4 py-2 rounded-full font-bold text-sm shadow animate-in zoom-in ${colorDef?.bg}`}>
                      {colorDef?.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
