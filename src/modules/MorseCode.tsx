import React, { useState, useRef, useEffect } from 'react';

const MORSE_WORDS = [
  { word: "bolle", freq: "3.505" },
  { word: "resto", freq: "3.515" },
  { word: "pollo", freq: "3.522" },
  { word: "morso", freq: "3.532" },
  { word: "verso", freq: "3.535" },
  { word: "terre", freq: "3.542" },
  { word: "anche", freq: "3.545" },
  { word: "paura", freq: "3.552" },
  { word: "pelle", freq: "3.555" },
  { word: "chela", freq: "3.565" },
  { word: "pasto", freq: "3.572" },
  { word: "bombe", freq: "3.575" },
  { word: "pausa", freq: "3.582" },
  { word: "sauna", freq: "3.592" },
  { word: "forse", freq: "3.595" },
  { word: "sorso", freq: "3.600" }
];

const MORSE_MAP: Record<string, string> = {
  'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.',
  'f': '..-.', 'g': '--.', 'h': '....', 'i': '..', 'j': '.---',
  'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---',
  'p': '.--.', 'q': '--.-', 'r': '.-.', 's': '...', 't': '-',
  'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-', 'y': '-.--', 'z': '--..'
};

export const MorseCode: React.FC = () => {
  const [input, setInput] = useState('');
  const [currentMorse, setCurrentMorse] = useState('');
  const [isPressed, setIsPressed] = useState(false);

  const pressTimer = useRef<number | null>(null);
  const pauseTimer = useRef<number | null>(null);

  const currentMorseRef = useRef(currentMorse);
  useEffect(() => { currentMorseRef.current = currentMorse; }, [currentMorse]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsPressed(true);
    if (pauseTimer.current) {
      clearTimeout(pauseTimer.current);
      pauseTimer.current = null;
    }
    pressTimer.current = Date.now();
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPressed) return;
    setIsPressed(false);

    if (!pressTimer.current) return;
    const duration = Date.now() - pressTimer.current;
    pressTimer.current = null;

    // Considera un tocco veloce un punto (< 250ms), lungo una linea
    const mappedSymbol = duration < 250 ? '.' : '-';

    setCurrentMorse(prev => prev + mappedSymbol);

    // Valuta la combinazione dopo 800ms di inattività
    pauseTimer.current = window.setTimeout(() => {
      const code = currentMorseRef.current;
      if (code) {
        const letter = Object.keys(MORSE_MAP).find(key => MORSE_MAP[key] === code);
        if (letter) {
          setInput(prev => prev + letter);
        }
        setCurrentMorse('');
      }
    }, 800);
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (isPressed) {
      handlePointerUp(e);
    }
  };

  // Allow filtering by substring
  const filtered = MORSE_WORDS.filter(w => w.word.includes(input.toLowerCase().trim()));

  return (
    <div className="max-w-xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center p-6 bg-[#0a0a0c] border border-[#27272a] rounded-xl shadow-lg">
        
        {/* Pulsante Trasmettitore Morse */}
        <div className="flex flex-col items-center flex-1">
          <label className="block text-zinc-500 mb-4 text-[10px] uppercase font-mono tracking-widest text-center">
            Trasmettitore Virtuale<br/>
            <span className="text-zinc-600 normal-case tracking-normal text-[9px]">Tieni premuto per la linea (-)</span>
          </label>
          
          <button
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            onContextMenu={(e) => e.preventDefault()}
            className="w-24 h-24 rounded-full bg-gradient-to-b from-zinc-800 to-zinc-950 border border-zinc-700 shadow-xl flex items-center justify-center touch-none select-none transition-transform"
            style={{ transform: isPressed ? 'scale(0.95)' : 'scale(1)' }}
          >
            <div className="w-16 h-16 rounded-full bg-red-950/40 border border-red-900 flex items-center justify-center">
               <div className={`w-12 h-12 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.2)] transition-colors duration-75 ${isPressed ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-gradient-to-b from-red-700 to-red-900'}`}></div>
            </div>
          </button>
          
          <div className="h-6 mt-4 font-mono text-amber-500 text-2xl tracking-[0.3em] font-black h-8 flex items-center justify-center">
            {currentMorse.replace(/\./g, '•').replace(/-/g, '—')}
          </div>
        </div>

        <div className="hidden md:block w-px h-32 bg-zinc-800"></div>

        {/* Input Testuale */}
        <div className="flex flex-col items-center flex-1 w-full max-w-xs">
          <label className="block text-zinc-500 mb-4 text-[10px] uppercase font-mono tracking-widest text-center">
            Testo Decodificato
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^a-zA-Z]/g, ''))}
            placeholder="ES: BO"
            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-center text-zinc-100 font-mono text-3xl uppercase tracking-widest focus:border-amber-500 outline-none shadow-inner"
          />
          <div className="flex gap-2 w-full mt-2">
            <button 
              onClick={() => setInput(prev => prev.slice(0, -1))}
              className="flex-1 text-[10px] font-mono text-zinc-500 border border-zinc-800 p-2 rounded hover:text-zinc-300 hover:bg-zinc-800 transition-colors uppercase"
            >
              Indietro
            </button>
            <button 
              onClick={() => setInput('')}
              className="flex-1 text-[10px] font-mono text-zinc-500 border border-zinc-800 p-2 rounded hover:text-red-400 hover:bg-red-950/30 hover:border-red-900/50 transition-colors uppercase"
            >
              Resetta
            </button>
          </div>
        </div>

      </div>

      <div className="bg-zinc-900 rounded-xl border border-[#27272a] overflow-hidden shadow-lg">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-red-500 border-t-2 border-red-900/50 font-mono text-sm uppercase">Nessuna parola trovata con "{input}"</div>
        ) : filtered.length === 1 ? (
          <div className="p-8 text-center animate-in zoom-in bg-amber-900/10 border-t-2 border-amber-500 border-dashed">
            <p className="text-amber-500 font-bold uppercase tracking-widest text-xs mb-2 font-mono">Parola Trovata</p>
            <h2 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-[0.3em] mb-4">{filtered[0].word}</h2>
            <p className="text-zinc-500 text-xs uppercase font-mono tracking-widest mb-1">Frequenza TX</p>
            <p className="text-3xl text-amber-500 font-mono font-bold bg-zinc-950 inline-block px-6 py-2 rounded border border-amber-900/30 shadow-inner">{filtered[0].freq} MHz</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800 max-h-96 overflow-y-auto">
            {filtered.map(w => (
              <div key={w.word} className="flex justify-between items-center p-4 hover:bg-zinc-800/50 transition-colors">
                <span className="text-lg font-bold uppercase tracking-[0.2em] text-zinc-300">{w.word}</span>
                <span className="text-amber-500 font-mono font-bold bg-zinc-950 px-3 py-1 rounded border border-zinc-800 shadow-inner">{w.freq} MHz</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
