import React, { useState, useMemo } from 'react';

type SymbolDef = { id: string; char: string; desc: string };

const SYMBOLS: Record<string, SymbolDef> = {
  'q': { id: 'q', char: 'Ϙ', desc: 'Palloncino / Q' },
  'a': { id: 'a', char: 'Ѧ', desc: 'A / Piramide' },
  'lam': { id: 'lam', char: 'ƛ', desc: 'Lambda tagliata' },
  'light': { id: 'light', char: 'Ϟ', desc: 'Fulmine' },
  'alien': { id: 'alien', char: 'Ѭ', desc: 'Alieno / Triangolo' },
  'h': { id: 'h', char: 'ϗ', desc: 'H / Xi corsiva' },
  'cdot': { id: 'cdot', char: 'Ͽ', desc: 'C rovesciata' },
  'e': { id: 'e', char: 'Ӭ', desc: 'E con punti' },
  'loop': { id: 'loop', char: 'Ҩ', desc: 'Spirale' },
  'star': { id: 'star', char: '☆', desc: 'Stella vuota' },
  'qdown': { id: 'qdown', char: '¿', desc: 'Punto interrog. giù' },
  'c': { id: 'c', char: '©', desc: 'Copyright' },
  'w': { id: 'w', char: 'Ѽ', desc: 'Sacco / Baffi' },
  'x': { id: 'x', char: 'Җ', desc: 'X con barra' },
  'r': { id: 'r', char: 'Ԇ', desc: 'R / Pistola' },
  'six': { id: 'six', char: 'б', desc: '6 / b sbavata' },
  'par': { id: 'par', char: '¶', desc: 'Paragrafo' },
  'bt': { id: 'bt', char: 'Ѣ', desc: 'b con linea alta' },
  'smile': { id: 'smile', char: 'ѿ', desc: 'Faccina Sorriso' },
  'tri': { id: 'tri', char: 'Ψ', desc: 'Tridente' },
  'horn': { id: 'horn', char: 'Ѱ', desc: 'Faccina Corna' },
  'starfull': { id: 'starfull', char: '★', desc: 'Stella Piena' },
  'ae': { id: 'ae', char: 'æ', desc: 'AE uniti' },
  'n': { id: 'n', char: 'Ҋ', desc: 'N rovesciata / x' },
  'omega': { id: 'omega', char: 'Ω', desc: 'Omega' },
  'puz': { id: 'puz', char: '҂', desc: 'E sbarrata / Puzzle' }
};

const COLS = [
  ['q', 'a', 'lam', 'light', 'alien', 'h', 'cdot'],
  ['e', 'q', 'cdot', 'loop', 'star', 'h', 'qdown'],
  ['c', 'w', 'loop', 'x', 'r', 'lam', 'star'],
  ['six', 'par', 'bt', 'alien', 'x', 'qdown', 'smile'],
  ['tri', 'horn', 'bt', 'cdot', 'r', 'e', 'starfull'],
  ['six', 'e', 'puz', 'ae', 'tri', 'n', 'omega']
];

export const Keypads: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSymbol = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(x => x !== id);
      }
      if (prev.length < 4) {
        return [...prev, id];
      }
      return prev;
    });
  };

  const reset = () => setSelectedIds([]);

  // Trova la colonna che contiene tutti e 4 i simboli
  const validColIndex = useMemo(() => {
    if (selectedIds.length < 4) return -1;
    return COLS.findIndex(col => selectedIds.every(id => col.includes(id)));
  }, [selectedIds]);

  // Se trova una colonna valida, restituisce i simboli ordinati dall'alto verso il basso
  const sortedSolution = useMemo(() => {
    if (validColIndex === -1) return [];
    const colSymbols = COLS[validColIndex];
    // Filtriamo i 4 simboli scelti nell'ordine in cui appaiono nella colonna
    return colSymbols.filter(id => selectedIds.includes(id)).map(id => SYMBOLS[id]);
  }, [selectedIds, validColIndex]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">
             Tastierini
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Seleziona i 4 simboli che vedi sulla bomba.</p>
        </div>
        <button 
          onClick={reset} 
          disabled={selectedIds.length === 0}
          className="text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/30 text-zinc-400 p-2 rounded transition-colors disabled:opacity-50"
        >
          Resetta
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Pannello Selezione */}
        <div className={`flex-1 bg-[#09090b] rounded p-6 shadow-xl border ${selectedIds.length === 4 ? 'border-zinc-800/50 opacity-50' : 'border-[#27272a]'}`}>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-mono text-amber-500 flex items-center gap-2 uppercase tracking-widest">
              Simboli
            </h3>
            <span className="font-mono text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-zinc-500">
              {selectedIds.length} / 4 Selezionati
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {Object.values(SYMBOLS).map(sym => {
              const isSelected = selectedIds.includes(sym.id);
              return (
                <button
                  key={sym.id}
                  onClick={() => toggleSymbol(sym.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded border transition-all active:scale-95 min-h-[90px] ${
                    isSelected 
                    ? 'bg-amber-900/30 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]' 
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600 hover:bg-zinc-800'
                  }`}
                >
                  <span className={`text-4xl leading-none mb-2 ${isSelected ? 'text-amber-500' : 'text-zinc-300'}`}>{sym.char}</span>
                  <span className={`text-[9px] font-mono uppercase text-center leading-tight ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`}>{sym.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pannello Risultato */}
        <div className="w-full lg:w-80 flex flex-col gap-4 shrink-0">
          <div className={`bg-[#0a0a0c] border rounded p-6 shadow-xl relative overflow-hidden transition-colors duration-500 ${selectedIds.length === 4 ? validColIndex !== -1 ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' : 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-[#27272a]'}`}>
            
            {selectedIds.length === 4 && validColIndex !== -1 && (
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
            )}
            {selectedIds.length === 4 && validColIndex === -1 && (
               <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
            )}

            <h3 className="text-sm font-mono text-zinc-500 mb-6 uppercase tracking-widest text-center border-b border-zinc-800 pb-4">
              Ordine Corretto
            </h3>

            {selectedIds.length < 4 ? (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-600">
                <p className="text-sm font-mono uppercase text-center">Seleziona ancora {4 - selectedIds.length} simboli</p>
              </div>
            ) : validColIndex === -1 ? (
              <div className="flex flex-col items-center justify-center py-12 text-red-500">
                <span className="text-4xl mb-4 font-bold">X</span>
                <p className="text-sm font-mono uppercase text-center">Combinazione non valida!</p>
                <p className="text-xs text-red-900/80 mt-2 text-center">I 4 simboli non appartengono alla stessa colonna.</p>
                <button onClick={reset} className="mt-6 border border-red-900/50 bg-red-950/20 px-4 py-2 rounded text-xs uppercase hover:bg-red-900/40">Ripristina</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 animate-in slide-in-from-bottom-4">
                <p className="text-green-500 text-[10px] font-mono text-center uppercase mb-2">Colonna identificata: {validColIndex + 1}</p>
                {sortedSolution.map((sym, idx) => (
                  <div key={sym.id} className="flex items-center bg-zinc-900 border border-green-900/30 p-4 rounded shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-8 bg-green-950/30 border-r border-green-900/30 flex items-center justify-center">
                      <span className="text-green-500 font-mono font-bold text-xs">{idx + 1}</span>
                    </div>
                    <div className="ml-10 flex items-center gap-4">
                      <span className="text-3xl text-zinc-100">{sym.char}</span>
                      <span className="text-xs font-mono text-zinc-400 uppercase">{sym.desc}</span>
                    </div>
                  </div>
                ))}
                
                <button onClick={reset} className="mt-4 w-full border border-zinc-700 bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded text-zinc-400 hover:text-zinc-200 text-xs uppercase font-mono transition-colors">
                  ← Nuova Sequenza
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
