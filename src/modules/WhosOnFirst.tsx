import React, { useState } from 'react';

const STEP1_MAP: Record<string, string> = {
  "SI": "Centro Sinistra",
  "PRIMO": "In Alto a Destra",
  "DISPLAY": "In Basso a Destra",
  "SCHERMO": "In Basso a Destra",
  "SCHERNO": "In Basso a Destra",
  "NULLA": "Centro Sinistra",
  "[VUOTO]": "In Basso a Sinistra", // Lo schermo letteralmente vuoto
  "VUOTO": "Centro Destra",         // La parola VUOTO
  "NO": "In Basso a Destra",
  "SCHERZO": "Centro Sinistra",
  "FERMO": "In Basso a Destra",
  "STOP": "In Basso a Destra",
  "SPINGI": "Centro Destra",
  "AH AH": "In Basso a Destra",
  "TERZO": "In Basso a Sinistra",
  "ASPETTA": "In Basso a Destra",
  "OK": "In Alto a Destra",
  "NO NO": "In Basso a Destra",
  "SII": "Centro Destra",
  "SI SI": "In Basso a Destra",
  "COME?": "In Alto a Sinistra",
  "SOPRA": "In Basso a Destra",
  "IN ALTO": "In Basso a Sinistra",
  "SOTTO": "In Basso a Destra",
  "IN BASSO": "Centro Sinistra",
  "AH": "In Basso a Destra",
  "A": "In Alto a Destra",
  "HA": "In Basso a Destra"
};

const STEP2_MAP: Record<string, string[]> = {
  "PRONTO": ["SI", "OKAY", "COSA", "IN MEZZO", "SINISTRA", "OK", "DESTRA", "VUOTO", "PRONTO", "NO", "PRIMO", "EH", "NULLA", "FERMO"],
  "PRIMO": ["SINISTRA", "OKAY", "SI", "IN MEZZO", "NO", "DESTRA", "NULLA", "EH", "FERMO", "PRONTO", "VUOTO", "COSA", "OK", "PRIMO"],
  "NO": ["VUOTO", "EH", "FERMO", "PRIMO", "COSA", "PRONTO", "DESTRA", "SI", "NULLA", "SINISTRA", "OK", "OKAY", "NO", "IN MEZZO"],
  "VUOTO": ["FERMO", "DESTRA", "OKAY", "IN MEZZO", "VUOTO", "OK", "PRONTO", "NULLA", "NO", "COSA", "SINISTRA", "EH", "SI", "PRIMO"],
  "NULLA": ["EH", "DESTRA", "OKAY", "IN MEZZO", "SI", "VUOTO", "NO", "OK", "SINISTRA", "COSA", "FERMO", "PRIMO", "NULLA", "PRONTO"],
  "SI": ["OKAY", "DESTRA", "EH", "IN MEZZO", "PRIMO", "COSA", "OK", "PRONTO", "NULLA", "SI", "SINISTRA", "VUOTO", "NO", "FERMO"],
  "COSA": ["EH", "COSA", "SINISTRA", "NULLA", "PRONTO", "VUOTO", "IN MEZZO", "NO", "OKAY", "PRIMO", "FERMO", "SI", "OK", "DESTRA"],
  "EH": ["PRONTO", "NULLA", "SINISTRA", "COSA", "OKAY", "SI", "DESTRA", "NO", "OK", "VUOTO", "EH", "IN MEZZO", "FERMO", "PRIMO"],
  "SINISTRA": ["DESTRA", "SINISTRA", "PRIMO", "NO", "IN MEZZO", "SI", "VUOTO", "COSA", "EH", "FERMO", "OK", "PRONTO", "OKAY", "NULLA"],
  "DESTRA": ["SI", "NULLA", "PRONTO", "OK", "NO", "FERMO", "COSA", "DESTRA", "IN MEZZO", "SINISTRA", "EH", "VUOTO", "OKAY", "PRIMO"],
  "IN MEZZO": ["VUOTO", "PRONTO", "OKAY", "COSA", "NULLA", "OK", "NO", "FERMO", "SINISTRA", "IN MEZZO", "DESTRA", "PRIMO", "EH", "SI"],
  "OKAY": ["IN MEZZO", "NO", "PRIMO", "SI", "EH", "NULLA", "FERMO", "OKAY", "SINISTRA", "PRONTO", "VUOTO", "OK", "COSA", "DESTRA"],
  "FERMO": ["EH", "NO", "VUOTO", "OKAY", "SI", "SINISTRA", "PRIMO", "OK", "COSA", "FERMO", "NULLA", "PRONTO", "DESTRA", "IN MEZZO"],
  "OK": ["DESTRA", "IN MEZZO", "SI", "PRONTO", "OK", "OKAY", "NULLA", "EH", "VUOTO", "SINISTRA", "PRIMO", "COSA", "NO", "FERMO"],
  "PREMI": ["CERTO", "NO NO", "SII", "SI SI", "DOPO", "EH?", "COME?", "ALT", "COSA?", "PREMI", "E?", "COME", "FATTO", "NOO"],
  "NO NO": ["SII", "DOPO", "COME", "EH?", "COSA?", "FATTO", "E?", "ALT", "PREMI", "NOO", "SI SI", "CERTO", "COME?", "NO NO"],
  "NOO": ["VUOTO", "COSA?", "OK", "CERA", "FATTO", "NO NO", "EH?", "CERTO", "SI SI", "ALT", "EH", "DOPO", "E?", "NOO"],
  "FATTO": ["CERTO", "NO NO", "EH?", "COSA?", "E?", "NOO", "ALT", "COME", "COME?", "SII", "DOPO", "SI SI", "PREMI", "FATTO"],
  "EH?": ["EH?", "CERTO", "NO NO", "DOPO", "E?", "FATTO", "NOO", "COSA?", "COME?", "SII", "SI SI", "ALT", "COME", "PREMI"],
  "COSA?": ["SII", "FATTO", "CERTO", "SI SI", "NOO", "ALT", "COME?", "EH?", "DOPO", "E?", "COME", "PREMI", "NO NO", "COSA?"],
  "E?": ["CERTO", "COSA?", "EH?", "DOPO", "FATTO", "COME", "NO NO", "SI SI", "COME?", "NOO", "ALT", "SII", "PREMI", "E?"],
  "CERTO": ["SI SI", "NOO", "FATTO", "SII", "COME", "EH?", "NO NO", "COME?", "E?", "COSA?", "DOPO", "ALT", "PREMI", "CERTO"],
  "ALT": ["EH?", "NOO", "DOPO", "COME?", "CERTO", "COME", "FATTO", "COSA?", "PREMI", "SI SI", "E?", "NO NO", "SII", "ALT"],
  "SI SI": ["OKAY", "CERTO", "PREMI", "VUOTO", "FATTO", "EH?", "NOO", "COSA?", "COME", "DOPO", "ALT", "SII", "COME?", "SI SI"],
  "SII": ["CERTO", "E?", "FATTO", "EH?", "DOPO", "COME?", "NO NO", "PREMI", "NOO", "COSA?", "SI SI", "COME", "ALT", "SII"],
  "COME?": ["NOO", "EH?", "NO NO", "COME", "FATTO", "CERTO", "DOPO", "SI SI", "PREMI", "COME?", "ALT", "COSA?", "E?", "SII"],
  "DOPO": ["NOO", "EH?", "NO NO", "COME", "FATTO", "CERTO", "DOPO", "SI SI", "PREMI", "COME?", "ALT", "COSA?", "E?", "SII"],
  "COME": ["SI SI", "DOPO", "NOO", "COME?", "ALT", "FATTO", "E?", "COSA?", "EH?", "PREMI", "COME", "CERTO", "NO NO", "SII"]
};

// Ordina le chiavi alfabeticamente per facilitare la ricerca visiva
const sortedStep1Keys = Object.keys(STEP1_MAP).sort((a,b) => a.localeCompare(b));
const sortedStep2Keys = Object.keys(STEP2_MAP).sort((a,b) => a.localeCompare(b));

export const WhosOnFirst: React.FC = () => {
  const [step1Word, setStep1Word] = useState<string | null>(null);
  const [step2Word, setStep2Word] = useState<string | null>(null);
  const [stage, setStage] = useState(1);

  const reset = () => {
    setStep1Word(null);
    setStep2Word(null);
  };
  
  const resetAll = () => {
    reset();
    setStage(1);
  };

  const nextStage = () => {
    reset();
    setStage(prev => prev + 1);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">
             Incomprensioni
             <span className="flex gap-1 items-center">
               {[1, 2, 3].map(i => (
                 <span key={i} className={`w-3 h-3 rounded-full border border-zinc-700 transition-all ${stage === i ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)] scale-125' : stage > i ? 'bg-green-500' : 'bg-transparent'}`} />
               ))}
             </span>
          </h2>
          <p className="text-sm text-zinc-500 mt-1">Stadio {stage} di 3. Segui i due passaggi per disinnescare la fase.</p>
        </div>
        <button onClick={resetAll} className="text-xs font-mono uppercase bg-zinc-900 border border-zinc-800 hover:border-red-500/50 hover:bg-red-950/30 text-zinc-400 p-2 rounded transition-colors">
          Ricomincia Tutto
        </button>
      </div>

      {!step1Word ? (
        <div className="bg-[#09090b] rounded p-6 shadow-xl border border-[#27272a]">
          <h3 className="text-sm font-mono text-amber-500 mb-6 flex items-center gap-2">
            <span className="bg-amber-500 text-zinc-950 w-6 h-6 inline-flex items-center justify-center font-bold">1</span>
            Seleziona la parola che appare nel DISPLAY in alto
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2">
            {sortedStep1Keys.map(word => (
              <button
                key={word}
                onClick={() => setStep1Word(word)}
                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[10px] sm:text-xs py-2 px-1 sm:py-3 sm:px-2 rounded border border-zinc-800 hover:border-zinc-500 transition-colors uppercase tracking-widest leading-tight min-h-[48px] sm:min-h-[60px] flex items-center justify-center text-center active:scale-95 break-words"
              >
                {word === "[VUOTO]" ? <span className="opacity-50 italic whitespace-nowrap">{"[Nessun Testo]"}</span> : <span className="break-words px-1">{word}</span>}
              </button>
            ))}
          </div>
        </div>
      ) : !step2Word ? (
        <div className="bg-[#09090b] border border-zinc-700 rounded p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
          <h3 className="text-sm font-mono text-amber-500 mb-6 flex items-center gap-2">
            <span className="bg-amber-500 text-zinc-950 w-6 h-6 inline-flex items-center justify-center font-bold">2</span>
            Leggi la parola del pulsante...
          </h3>
          <div className="text-center p-4 sm:p-8 bg-zinc-950 rounded border border-zinc-800 mb-6 shadow-inner">
            <p className="text-zinc-500 text-[10px] sm:text-xs font-mono mb-2 uppercase tracking-widest">Guarda il pulsante situato in:</p>
            <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-500 uppercase tracking-tighter break-words px-2">{STEP1_MAP[step1Word]}</p>
          </div>
          
          <p className="text-zinc-400 text-xs sm:text-sm mb-4">Quale parola c'è scritta su <strong className="text-white">QUEL</strong> pulsante?</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5 sm:gap-2 max-h-[40vh] overflow-y-auto pr-1">
            {sortedStep2Keys.map(word => (
              <button
                key={word}
                onClick={() => setStep2Word(word)}
                className="bg-zinc-900 border border-zinc-800 hover:bg-amber-950/30 hover:border-amber-900/50 text-zinc-300 hover:text-amber-500 font-mono text-[10px] sm:text-xs py-2 px-1 sm:py-3 sm:px-2 min-h-[48px] sm:min-h-[60px] rounded transition-colors active:scale-95 text-center flex items-center justify-center leading-tight uppercase break-words"
              >
                <span className="break-words px-1">{word}</span>
              </button>
            ))}
          </div>
          
          <button 
            onClick={reset}
            className="mt-6 w-full py-3 bg-zinc-900 border border-zinc-800 text-zinc-500 font-mono text-xs hover:text-zinc-300 hover:bg-zinc-800 transition-colors uppercase"
          >
            ← Ho sbagliato Display
          </button>
        </div>
      ) : (
        <div className="bg-zinc-950 border border-green-900/50 rounded p-6 shadow-[0_0_30px_rgba(34,197,94,0.1)] relative overflow-hidden animate-in zoom-in-95">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>
          <h3 className="text-green-500 font-mono text-sm mb-6 flex items-center gap-2 uppercase tracking-widest">
            <span className="bg-green-500 text-zinc-950 w-5 h-5 flex items-center justify-center font-bold">!</span>
            Soluzione Trovata
          </h3>
          
          <p className="text-zinc-400 mb-4 text-center">Premi il <strong className="text-zinc-100">PRIMO</strong> pulsante della tua bomba che compare in questa lista:</p>
          
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {STEP2_MAP[step2Word].map((word, idx) => (
              <div key={idx} className="bg-zinc-900 border border-zinc-800 px-4 py-3 rounded text-amber-500 font-mono font-bold shadow-sm flex items-center">
                <span className="text-zinc-600 text-[10px] mr-2 text-right w-4">{idx + 1}.</span>
                {word}
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4 border-t border-zinc-900 pt-6">
            <button 
              onClick={reset}
              className="flex-1 py-3 bg-zinc-900 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300 border border-zinc-800 rounded font-mono text-xs uppercase transition-colors"
            >
              ← Indietro
            </button>
            {stage < 3 ? (
              <button 
                onClick={nextStage}
                className="flex-1 py-3 bg-green-950/30 text-green-500 hover:bg-green-900/50 border border-green-900/50 rounded font-mono font-bold text-xs uppercase shadow-[0_0_15px_rgba(34,197,94,0.1)] transition-all active:scale-95"
              >
                Passa allo Stadio {stage + 1} → 
              </button>
            ) : (
                <button 
                onClick={resetAll}
                className="flex-1 py-3 bg-amber-950/30 text-amber-500 hover:bg-amber-900/50 border border-amber-900/50 rounded font-mono font-bold text-xs uppercase shadow-[0_0_15px_rgba(245,158,11,0.1)] transition-all active:scale-95"
              >
                Disinnescato! Nuova Bomba
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
