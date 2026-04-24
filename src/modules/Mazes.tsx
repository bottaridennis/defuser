import React, { useState, useMemo } from 'react';

// Format for walls config: an array of 36 numbers (6x6 grid, row-major).
// Each number is a bitmask: 1 = Top, 2 = Right, 4 = Bottom, 8 = Left.
// Let's create an empty 36-array template for each, and I will fill them in.
const MAZES = [
  {"id":1,"circles":[[0,1],[5,2]],"walls":[9,5,3,9,5,7,10,9,6,12,5,3,10,12,3,9,5,2,10,13,4,6,13,2,8,5,3,9,7,10,12,7,12,6,13,6]},
  {"id":2,"circles":[[1,3],[4,1]],"walls":[13,1,7,9,1,7,9,6,9,6,12,3,10,9,6,9,5,2,8,6,9,6,11,10,10,11,10,9,6,10,14,12,6,12,5,6]},
  {"id":3,"circles":[[3,3],[3,5]],"walls":[9,5,3,11,9,3,14,11,10,12,6,10,9,2,10,9,3,10,10,10,10,10,10,10,10,12,6,10,10,10,12,5,5,6,12,6]},
  {"id":4,"circles":[[0,0],[0,3]],"walls":[9,3,13,5,5,3,10,10,9,5,5,2,10,12,6,9,7,10,10,13,5,4,5,2,8,5,5,5,3,10,12,5,7,13,6,14]},
  {"id":5,"circles":[[4,2],[3,5]],"walls":[13,5,5,5,1,3,9,5,5,1,6,14,8,3,13,6,9,3,10,12,5,3,14,10,10,9,5,4,7,10,14,12,5,5,5,6]},
  {"id":6,"circles":[[4,0],[2,4]],"walls":[11,9,3,13,1,3,10,10,10,9,6,10,8,6,14,10,9,6,12,3,9,2,10,11,9,6,14,10,12,2,12,5,5,6,13,6]},
  {"id":7,"circles":[[1,0],[1,5]],"walls":[9,5,5,3,9,3,10,9,7,12,6,10,12,6,9,7,9,6,9,3,8,5,6,11,10,14,12,5,3,10,12,5,5,5,4,6]},
  {"id":8,"circles":[[3,0],[2,3]],"walls":[11,9,5,3,9,3,8,4,7,12,6,10,10,9,5,5,3,10,10,12,3,13,4,6,10,11,12,5,5,7,12,4,5,5,5,7]},
  {"id":9,"circles":[[0,4],[2,1]],"walls":[11,9,5,5,1,3,10,10,9,7,10,10,8,4,6,9,6,10,10,11,9,6,13,2,10,10,10,9,3,14,12,6,12,6,12,7]}
];

// Coordinate [col, row].
type Coord = [number, number];

export const Mazes: React.FC = () => {
  const [selectedCircles, setSelectedCircles] = useState<Coord[]>([]);
  const [start, setStart] = useState<Coord | null>(null);
  const [end, setEnd] = useState<Coord | null>(null);

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

  const identifiedMaze = useMemo(() => {
    return MAZES.find(maze => {
      if (selectedCircles.length !== 2) return false;
      const match1 = maze.circles.some(mc => mc[0] === selectedCircles[0][0] && mc[1] === selectedCircles[0][1]);
      const match2 = maze.circles.some(mc => mc[0] === selectedCircles[1][0] && mc[1] === selectedCircles[1][1]);
      return match1 && match2;
    });
  }, [selectedCircles]);

  const handleCellClick = (r: number, c: number) => {
      if (!start) setStart([c, r]);
      else if (!end) setEnd([c, r]);
      else {
          setStart([c, r]);
          setEnd(null);
      }
  };

  // Perform BFS
  const path = useMemo(() => {
      if (!identifiedMaze || !start || !end) return null;
      
      const walls = identifiedMaze.walls;
      const queue: {pos: Coord, path: Coord[]}[] = [{ pos: start, path: [start] }];
      const visited = new Set<string>();
      visited.add(`${start[0]},${start[1]}`);

      while (queue.length > 0) {
          const { pos: [c, r], path: currPath } = queue.shift()!;
          if (c === end[0] && r === end[1]) return currPath;

          const cellWalls = walls[r * 6 + c];
          
          const neighbors: {nc: number, nr: number, wallBit: number}[] = [
              { nc: c, nr: r - 1, wallBit: 1 }, // up
              { nc: c + 1, nr: r, wallBit: 2 }, // right
              { nc: c, nr: r + 1, wallBit: 4 }, // down
              { nc: c - 1, nr: r, wallBit: 8 }  // left
          ];

          for (const n of neighbors) {
              if (n.nr >= 0 && n.nr < 6 && n.nc >= 0 && n.nc < 6) {
                  // check if there's a wall blocking
                  if ((cellWalls & n.wallBit) === 0) {
                      const key = `${n.nc},${n.nr}`;
                      if (!visited.has(key)) {
                          visited.add(key);
                          queue.push({ pos: [n.nc, n.nr], path: [...currPath, [n.nc, n.nr]] });
                      }
                  }
              }
          }
      }
      return null;
  }, [identifiedMaze, start, end]);

  const resetAll = () => {
      setSelectedCircles([]);
      setStart(null);
      setEnd(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">Labirinti</h2>
          <p className="text-sm text-zinc-500 mt-1">Seleziona i due cerchi verdi per identificare il labirinto.</p>
        </div>
        <button 
          onClick={resetAll}
          className="text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-400 p-2 rounded hover:bg-zinc-800 transition-colors"
        >
          Resetta Tutto
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Cerchi Selection */}
        <div className="flex-1 flex flex-col gap-4">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 text-center">Fase 1: Trova Labirinto</h3>
            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 sm:p-6 shadow-xl flex items-center justify-center">
                <div className="grid grid-cols-6 gap-1 sm:gap-2 bg-zinc-950 p-2 sm:p-4 border-2 border-zinc-800 rounded mx-auto">
                    {[...Array(6)].map((_, r) => 
                        [...Array(6)].map((_, c) => {
                            const isSelected = selectedCircles.some(arr => arr[0] === c && arr[1] === r);
                            const isCircleTarget = identifiedMaze?.circles.some(arr => arr[0] === c && arr[1] === r);
                            
                            return (
                                <button
                                    key={`sel-${r}-${c}`}
                                    onClick={() => toggleCircle(r, c)}
                                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-zinc-700 sm:border-2 flex flex-col items-center justify-center transition-all focus:outline-none focus:ring-1 focus:ring-zinc-500
                                        ${isSelected ? 'border-green-500 bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                                        : isCircleTarget ? 'border-green-900 bg-green-900/10' 
                                        : 'hover:border-zinc-500'}
                                    `}
                                    disabled={identifiedMaze !== undefined && !isSelected}
                                >
                                    <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isSelected ? 'bg-green-500' : 'bg-zinc-600'}`}></div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
            
            {!identifiedMaze && selectedCircles.length > 0 && (
                <p className="text-amber-500 text-xs font-mono text-center animate-pulse">
                    Manca {2 - selectedCircles.length} cerchio
                </p>
            )}
        </div>

        {/* Interactive Maze */}
        <div className="flex-1 flex flex-col gap-4">
           <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 text-center">
               Fase 2: Calcola Percorso
           </h3>
           {identifiedMaze ? (
               <div className="bg-zinc-900 border border-green-500/50 rounded-xl p-4 sm:p-6 shadow-[0_0_20px_rgba(34,197,94,0.1)] flex flex-col items-center">
                   <div className="mb-4 text-center">
                       <span className="text-green-500 font-mono text-lg sm:text-xl uppercase tracking-widest font-black">
                           Labirinto #{identifiedMaze.id}
                       </span>
                       <p className="text-[10px] sm:text-xs text-zinc-400 mt-1 max-w-xs mx-auto">
                           Clicca prima il PUNTINO BIANCO (Inizio), poi il TRIANGOLO ROSSO (Fine).
                       </p>
                   </div>
                   
                   {/* Interactive Grid Representation */}
                   <div className="w-full max-w-[240px] sm:max-w-[300px] aspect-square relative border-2 sm:border-4 border-zinc-800 bg-zinc-950 p-1 sm:p-2 rounded shadow-inner mx-auto mb-4">
                        <div className="grid grid-cols-6 gap-0 w-full h-full">
                            {[...Array(6)].map((_, r) => 
                                [...Array(6)].map((_, c) => {
                                    const walls = identifiedMaze.walls[r * 6 + c];
                                    const hasTop = walls & 1;
                                    const hasRight = walls & 2;
                                    const hasBottom = walls & 4;
                                    const hasLeft = walls & 8;
                                    
                                    const isStart = start?.[0] === c && start?.[1] === r;
                                    const isEnd = end?.[0] === c && end?.[1] === r;
                                    
                                    const pathIndex = path?.findIndex(p => p[0] === c && p[1] === r);
                                    const inPath = pathIndex !== -1 && pathIndex !== undefined;

                                    return (
                                        <div 
                                            key={`maze-${r}-${c}`}
                                            onClick={() => handleCellClick(r, c)}
                                            className="w-full h-full relative flex items-center justify-center cursor-pointer hover:bg-zinc-800/50 transition-colors group"
                                            style={{
                                                borderTop: hasTop ? '2px solid rgb(113 113 122)' : '1px dashed rgb(39 39 42)',
                                                borderRight: hasRight ? '2px solid rgb(113 113 122)' : '1px dashed rgb(39 39 42)',
                                                borderBottom: hasBottom ? '2px solid rgb(113 113 122)' : '1px dashed rgb(39 39 42)',
                                                borderLeft: hasLeft ? '2px solid rgb(113 113 122)' : '1px dashed rgb(39 39 42)'
                                            }}
                                        >
                                            {/* Highlight on hover if can be clicked */}
                                            <div className="absolute inset-1 rounded bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            
                                            {/* Path rendering layer */}
                                            {inPath && !isStart && !isEnd && (
                                                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                                            )}

                                            {isStart && (
                                                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"></div>
                                            )}
                                            
                                            {isEnd && (
                                                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] sm:border-l-[8px] sm:border-r-[8px] sm:border-b-[14px] border-l-transparent border-r-transparent border-b-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)] z-10"></div>
                                            )}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                   </div>

                   {/* Path Output */}
                   <div className="border-t border-zinc-800 pt-4 w-full text-center">
                       {path ? (
                           <div className="space-y-2">
                               <p className="text-xs text-zinc-500 uppercase font-mono tracking-widest">Mosse ({path.length - 1})</p>
                               <div className="flex flex-wrap justify-center gap-1.5">
                                   {path.slice(1).map((p, i) => {
                                       const prev = path[i];
                                       let dir = '';
                                       if (p[0] === prev[0] && p[1] < prev[1]) dir = 'SU';
                                       if (p[0] === prev[0] && p[1] > prev[1]) dir = 'GIÙ';
                                       if (p[1] === prev[1] && p[0] < prev[0]) dir = 'SINISTRA';
                                       if (p[1] === prev[1] && p[0] > prev[0]) dir = 'DESTRA';
                                       
                                       return (
                                           <span key={i} className="text-xs font-bold font-mono bg-zinc-950 border border-zinc-800 text-amber-500 px-2 py-1 rounded">
                                               {dir}
                                           </span>
                                       )
                                   })}
                               </div>
                           </div>
                       ) : (start && end) ? (
                           <div className="text-red-500 text-xs font-mono uppercase">Nessun percorso trovato (Muri Mancanti?)</div>
                       ) : (
                           <p className="text-zinc-600 text-xs font-mono uppercase">Seleziona inizio e fine nel labirinto.</p>
                       )}
                   </div>
               </div>
           ) : (
               <div className="bg-[#0a0a0c] border border-zinc-800 rounded-xl p-6 text-center text-zinc-500 h-full flex flex-col items-center justify-center">
                   <div className="w-16 h-16 border-2 border-zinc-800 rounded-xl mb-4 flex items-center justify-center">
                       <span className="text-2xl opacity-20">?</span>
                   </div>
                   <p className="font-mono text-xs uppercase tracking-widest">In attesa dell'identificazione...</p>
               </div>
           )}
        </div>
      </div>
    </div>
  );
};

