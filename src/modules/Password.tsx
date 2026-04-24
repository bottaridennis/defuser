import React, { useState } from 'react';

const WORDS = [
  "abaco", "aceto", "adoro", "balzo", "capra",
  "dacci", "danno", "danza", "detto", "dieci",
  "dieta", "entro", "festa", "fiera", "gnomo",
  "hotel", "largo", "latte", "nuoto", "opera",
  "pizza", "posto", "pozzo", "radio", "salve",
  "salvi", "scudo", "secco", "sigla", "tanto",
  "tempo", "tetro", "tetto", "tosse", "tozzo"
];

export const Password: React.FC = () => {
  const [cols, setCols] = useState<string[]>(['', '', '', '', '']);

  const handleChange = (index: number, val: string) => {
    const newCols = [...cols];
    newCols[index] = val.toLowerCase().replace(/[^a-z]/g, '');
    setCols(newCols);
  };

  const getFilteredWords = () => {
    return WORDS.filter(word => {
      for (let i = 0; i < 5; i++) {
        if (cols[i].length > 0 && !cols[i].includes(word[i])) {
          return false;
        }
      }
      return true;
    });
  };

  const filtered = getFilteredWords();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <p className="text-gray-400 text-center text-sm">
        Inserisci le lettere disponibili per ogni colonna (basta scriverle una di seguito all'altra, es: "abcde"). 
        La password si restringerà automaticamente.
      </p>

      <div className="grid grid-cols-5 gap-2 md:gap-4">
        {[1, 2, 3, 4, 5].map((num, idx) => (
          <div key={num} className="space-y-2">
            <label className="block text-center text-xs font-mono text-gray-500 uppercase">Col {num}</label>
            <input
              type="text"
              value={cols[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full bg-gray-800 border-2 border-gray-700 rounded-lg p-2 text-center text-white font-mono uppercase text-lg xl:text-xl focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              maxLength={6}
            />
          </div>
        ))}
      </div>

      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 min-h-[12rem]">
        <div className="flex justify-between items-end mb-4 border-b border-gray-700 pb-2">
          <h3 className="text-lg font-bold text-white">Password Possibili</h3>
          <span className="text-sm font-mono text-gray-500">{filtered.length} trovate</span>
        </div>
        
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-red-500 font-mono">
            Nessuna password trovata. Controlla le lettere inserite.
          </div>
        ) : filtered.length === 1 ? (
          <div className="text-center py-6 animate-in zoom-in fade-in">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-green-500 mb-2 block">LA PASSWORD È:</span>
            <span className="text-3xl sm:text-5xl font-black text-white uppercase tracking-widest sm:tracking-[0.5em]">{filtered[0]}</span>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {filtered.map(w => (
              <span key={w} className="bg-gray-900 border border-gray-700 px-4 py-2 rounded-lg text-amber-500 font-mono font-bold text-lg uppercase shadow-sm">
                {w}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={() => setCols(['', '', '', '', ''])}
          className="text-gray-500 hover:text-white font-mono text-sm underline transition-colors"
        >
          Svuota Colonne
        </button>
      </div>
    </div>
  );
};
