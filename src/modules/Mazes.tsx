import React, { useState } from 'react';

const MAZES = [
  { id: 1, circles: [[0, 1], [5, 2]] },
  { id: 2, circles: [[1, 3], [4, 1]] },
  { id: 3, circles: [[3, 3], [3, 5]] },
  { id: 4, circles: [[0, 0], [0, 3]] },
  { id: 5, circles: [[4, 2], [3, 5]] },
  { id: 6, circles: [[4, 0], [2, 4]] },
  { id: 7, circles: [[1, 0], [1, 5]] },
  { id: 8, circles: [[3, 0], [2, 3]] },
  { id: 9, circles: [[2, 1], [0, 4]] }
];

export const Mazes: React.FC = () => {
  const [selectedCircles, setSelectedCircles] = useState<number[][]>([]);

  const toggleCircle = (r: number, c: number) => {
    const exists = selectedCircles.find(arr => arr[0] === c && arr[1] === r);
    if (exists) {
        setSelectedCircles(prev => prev.filter(arr => !(arr[0] === c && arr[1] === r)));
    } else {
        if (selectedCircles.length < 2) {
            setSelectedCircles(prev => [...prev, [c, r]]);
        }
    }
  };

  const identifiedMaze = MAZES.find(maze => {
      if (selectedCircles.length !== 2) return false;
      const match1 = maze.circles.some(mc => mc[0] === selectedCircles[0][0] && mc[1] === selectedCircles[0][1]);
      const match2 = maze.circles.some(mc => mc[0] === selectedCircles[1][0] && mc[1] === selectedCircles[1][1]);
      return match1 && match2;
  });

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">Labirinti</h2>
          <p className="text-sm text-zinc-500 mt-1">Seleziona i due cerchi per identificare il labirinto.</p>
        </div>
        <button 
          onClick={() => setSelectedCircles([])}
          className="text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 p-2 rounded hover:bg-zinc-800"
        >
          Resetta
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1 bg-[#09090b] border border-[#27272a] rounded-xl p-8 shadow-xl flex items-center justify-center">
            <div className="grid grid-cols-6 gap-2 bg-zinc-950 p-4 border-2 border-zinc-800 rounded">
                {[...Array(6)].map((_, r) => 
                     [...Array(6)].map((_, c) => {
                        const isSelected = selectedCircles.some(arr => arr[0] === c && arr[1] === r);
                        return (
                            <button
                                key={`${r}-${c}`}
                                onClick={() => toggleCircle(r, c)}
                                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-green-500 bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'border-zinc-700 hover:border-zinc-500'}`}
                            >
                                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                            </button>
                        );
                     })
                )}
            </div>
        </div>

        <div className="flex-1 flex flex-col justify-center">
           {identifiedMaze ? (
               <div className="bg-zinc-900 border border-green-500/50 rounded-xl p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] text-center">
                   <h3 className="text-green-500 font-mono text-sm uppercase tracking-widest mb-4">Labirinto Identificato</h3>
                   <div className="text-6xl font-black text-white mb-4">#{identifiedMaze.id}</div>
                   <p className="text-zinc-400 text-sm">
                       Consulta il labirinto {identifiedMaze.id} nel manuale per trovare il percorso dalla luce bianca al triangolo rosso. 
                       <em>(Rappresentazione dei muri in arrivo)</em>
                   </p>
               </div>
           ) : (
               <div className="bg-[#0a0a0c] border border-zinc-800 rounded-xl p-6 text-center text-zinc-500 h-full flex flex-col justify-center">
                   <p className="font-mono text-xs uppercase tracking-widest">In attesa di {2 - selectedCircles.length} cerchi...</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};
