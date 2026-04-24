import React, { useState } from 'react';

type WireColor = 'red' | 'blue' | 'black';
type WireConn = 'A' | 'B' | 'C';

const RED_SEQ = ['C', 'B', 'A', 'AC', 'B', 'AC', 'ABC', 'AB', 'B'];
const BLUE_SEQ = ['B', 'AC', 'B', 'A', 'B', 'BC', 'C', 'AC', 'A'];
const BLACK_SEQ = ['ABC', 'AC', 'B', 'AC', 'B', 'BC', 'AB', 'C', 'C'];

export const WireSequences: React.FC = () => {
  const [redCount, setRedCount] = useState(0);
  const [blueCount, setBlueCount] = useState(0);
  const [blackCount, setBlackCount] = useState(0);

  const [currentColor, setCurrentColor] = useState<WireColor>('red');
  const [currentConn, setCurrentConn] = useState<WireConn>('A');

  const getCutNeeded = (color: WireColor, conn: WireConn) => {
    let count = 0;
    let seq: string[] = [];
    if (color === 'red') { count = redCount; seq = RED_SEQ; }
    if (color === 'blue') { count = blueCount; seq = BLUE_SEQ; }
    if (color === 'black') { count = blackCount; seq = BLACK_SEQ; }

    if (count >= 9) return { cut: false, text: "Oltre il limite!" };

    const target = seq[count];
    const shouldCut = target.includes(conn);
    return { cut: shouldCut };
  };

  const currentCut = getCutNeeded(currentColor, currentConn);

  const acceptWire = () => {
    if (currentColor === 'red') setRedCount(r => Math.min(r + 1, 9));
    if (currentColor === 'blue') setBlueCount(b => Math.min(b + 1, 9));
    if (currentColor === 'black') setBlackCount(bl => Math.min(bl + 1, 9));
  };

  const undo = () => {
    // We don't have full history, just naive undo if they messed up the last one
    // A proper implementation would keep an array of history.
    // Let's implement full history!
  };

  // We should just use history array.
  return <WireSequencesWithHistory />;
};

const WireSequencesWithHistory: React.FC = () => {
  const [history, setHistory] = useState<{color: WireColor, conn: WireConn, cut: boolean}[]>([]);
  
  const [color, setColor] = useState<WireColor>('red');
  const [conn, setConn] = useState<WireConn>('A');

  const redCount = history.filter(h => h.color === 'red').length;
  const blueCount = history.filter(h => h.color === 'blue').length;
  const blackCount = history.filter(h => h.color === 'black').length;

  const decide = (c: WireColor, l: WireConn) => {
    let count = 0;
    let seq: string[] = [];
    if (c === 'red') { count = redCount; seq = RED_SEQ; }
    if (c === 'blue') { count = blueCount; seq = BLUE_SEQ; }
    if (c === 'black') { count = blackCount; seq = BLACK_SEQ; }

    if (count >= 9) return false;
    return seq[count].includes(l);
  };

  const shouldCut = decide(color, conn);

  const addWire = () => {
    setHistory([...history, { color, conn, cut: shouldCut }]);
  };

  const undo = () => setHistory(history.slice(0, -1));
  const reset = () => setHistory([]);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Colore Cavo</label>
          <div className="flex gap-2">
            <button onClick={() => setColor('red')} className={`flex-1 py-3 border-2 rounded font-bold ${color === 'red' ? 'bg-red-500 border-red-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>ROSSO</button>
            <button onClick={() => setColor('blue')} className={`flex-1 py-3 border-2 rounded font-bold ${color === 'blue' ? 'bg-blue-500 border-blue-400 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>BLU</button>
            <button onClick={() => setColor('black')} className={`flex-1 py-3 border-2 rounded font-bold ${color === 'black' ? 'bg-gray-900 border-gray-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>NERO</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Connesso a</label>
          <div className="flex gap-2">
            <button onClick={() => setConn('A')} className={`flex-1 py-3 border-2 rounded font-bold ${conn === 'A' ? 'bg-amber-500 border-amber-400 text-gray-900' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>A</button>
            <button onClick={() => setConn('B')} className={`flex-1 py-3 border-2 rounded font-bold ${conn === 'B' ? 'bg-amber-500 border-amber-400 text-gray-900' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>B</button>
            <button onClick={() => setConn('C')} className={`flex-1 py-3 border-2 rounded font-bold ${conn === 'C' ? 'bg-amber-500 border-amber-400 text-gray-900' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>C</button>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 text-center relative overflow-hidden">
        <p className="text-gray-400 font-mono text-sm uppercase mb-2">Azione Immediata (Cavo Corrente)</p>
        <div className={`text-4xl lg:text-5xl font-black ${shouldCut ? 'text-green-500' : 'text-red-500'}`}>
          {shouldCut ? 'TAGLIA' : 'SALTA'}
        </div>
        
        <button 
          onClick={addWire}
          className="mt-6 bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 px-6 py-2 rounded-full font-bold transition-all transform active:scale-95"
        >
          Vai al prossimo cavo →
        </button>
      </div>

      <div className="border-t border-gray-800 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-mono text-gray-400">Storico ({history.length} cavi elaborati)</h3>
          <div className="space-x-2">
            <button onClick={undo} disabled={history.length===0} className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1 rounded disabled:opacity-50 border border-gray-700">Annulla Ultimo</button>
            <button onClick={reset} disabled={history.length===0} className="text-xs bg-gray-800 hover:bg-red-900 text-gray-300 px-3 py-1 rounded disabled:opacity-50 border border-gray-700">Reset Totale</button>
          </div>
        </div>
        <div className="flex gap-2 font-mono text-xs text-gray-500 mb-2">
          <span>Rosso: {redCount}/9</span>
          <span>Blu: {blueCount}/9</span>
          <span>Nero: {blackCount}/9</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {history.map((h, i) => (
            <div key={i} className={`px-2 py-1 rounded text-xs font-bold font-mono border ${
              h.color === 'red' ? 'border-red-500 text-red-500' :
              h.color === 'blue' ? 'border-blue-500 text-blue-500' :
              'border-gray-500 text-gray-300'
            }`}>
              {i+1}: {h.color.toUpperCase().charAt(0)} → {h.conn} ({h.cut ? 'V' : 'X'})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
