import React, { useState } from 'react';

interface StageData {
  display: number;
  position: number;
  label: number;
}

export const Memory: React.FC = () => {
  const [stages, setStages] = useState<StageData[]>([]);
  const [currentDisplay, setCurrentDisplay] = useState<number | null>(null);

  const currentStageNum = stages.length + 1;

  const getAction = (display: number): { type: 'POSITION' | 'LABEL', value: number } => {
    if (currentStageNum === 1) {
      if (display === 1) return { type: 'POSITION', value: 2 };
      if (display === 2) return { type: 'POSITION', value: 2 };
      if (display === 3) return { type: 'POSITION', value: 3 };
      if (display === 4) return { type: 'POSITION', value: 4 };
    }
    if (currentStageNum === 2) {
      if (display === 1) return { type: 'LABEL', value: 4 };
      if (display === 2) return { type: 'POSITION', value: stages[0].position };
      if (display === 3) return { type: 'POSITION', value: 1 };
      if (display === 4) return { type: 'POSITION', value: stages[0].position };
    }
    if (currentStageNum === 3) {
      if (display === 1) return { type: 'LABEL', value: stages[1].label };
      if (display === 2) return { type: 'LABEL', value: stages[0].label };
      if (display === 3) return { type: 'POSITION', value: 3 };
      if (display === 4) return { type: 'LABEL', value: 4 };
    }
    if (currentStageNum === 4) {
      if (display === 1) return { type: 'POSITION', value: stages[0].position };
      if (display === 2) return { type: 'POSITION', value: 1 };
      if (display === 3) return { type: 'POSITION', value: stages[1].position };
      if (display === 4) return { type: 'POSITION', value: stages[1].position };
    }
    if (currentStageNum === 5) {
      if (display === 1) return { type: 'LABEL', value: stages[0].label };
      if (display === 2) return { type: 'LABEL', value: stages[1].label };
      if (display === 3) return { type: 'LABEL', value: stages[3].label };
      if (display === 4) return { type: 'LABEL', value: stages[2].label };
    }
    return { type: 'POSITION', value: 1 };
  };

  const currentAction = currentDisplay ? getAction(currentDisplay) : null;

  const recordAction = (label: number, position: number) => {
    if (!currentDisplay) return;
    setStages([...stages, { display: currentDisplay, position, label }]);
    setCurrentDisplay(null);
  };

  const reset = () => {
    setStages([]);
    setCurrentDisplay(null);
  };

  if (currentStageNum > 5) {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
        <h3 className="text-2xl font-bold text-white mb-2">Modulo Disarmato!</h3>
        <p className="text-gray-400 mb-8">Ottimo lavoro. Passa al prossimo modulo.</p>
        <button onClick={reset} className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors">
          Ricomincia (se hai sbagliato)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="flex justify-between items-center bg-gray-900 border border-gray-800 rounded p-4">
        <span className="text-amber-500 font-bold uppercase tracking-wider text-sm">Stage {currentStageNum} di 5</span>
        <button onClick={reset} className="text-gray-500 hover:text-white text-sm font-mono transition-colors">RESET</button>
      </div>

      {!currentDisplay ? (
        <div className="animate-in fade-in">
          <label className="block text-center text-lg font-medium text-gray-300 mb-6">Cosa mostra il display grande?</label>
          <div className="grid grid-cols-4 gap-4 max-w-sm mx-auto">
            {[1, 2, 3, 4].map(n => (
              <button
                key={n}
                onClick={() => setCurrentDisplay(n)}
                className="aspect-square text-3xl font-black bg-gray-800 border border-gray-700 hover:border-amber-500 rounded-xl hover:bg-gray-700 transition-all text-white flex items-center justify-center shadow-lg active:scale-95"
              >
                {n}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4">
          <div className="mx-auto max-w-md bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-amber-500" />
            
            <div className="mb-8">
              <p className="text-center text-gray-400 text-sm uppercase tracking-widest mb-2">Azione Richiesta</p>
              <div className="text-center font-black text-xl sm:text-3xl">
                Premi {currentAction?.type === 'POSITION' ? 'la Posizione' : 'l\'Etichetta'} <span className="text-amber-500 text-3xl sm:text-5xl ml-2">{currentAction?.value}</span>
              </div>
            </div>

            <div className="bg-gray-900 -mx-6 -mb-6 p-6 border-t border-gray-700">
              <p className="text-center text-gray-400 text-sm mb-4">Per proseguire, dimmi esattamente cosa hai premuto:</p>
              
              {currentAction?.type === 'POSITION' ? (
                <div className="space-y-4">
                  <p className="font-mono text-center text-amber-500">Hai premuto la posizione {currentAction.value}. Qual era il numero (etichetta)?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => recordAction(n, currentAction.value)}
                        className="py-3 bg-gray-800 rounded hover:bg-gray-700 border border-gray-700 hover:border-amber-500 font-bold text-xl transition-all"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="font-mono text-center text-amber-500">Hai premuto l'etichetta {currentAction?.value}. In che posizione era (1-4 da sx a dx)?</p>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => recordAction(currentAction!.value, n)}
                        className="py-3 bg-gray-800 rounded hover:bg-gray-700 border border-gray-700 hover:border-amber-500 font-bold text-xl transition-all"
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button 
                onClick={() => setCurrentDisplay(null)} 
                className="w-full mt-6 text-gray-500 hover:text-white text-sm font-bold uppercase transition-colors"
              >
                Annulla e reinserisci display
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Log */}
      {stages.length > 0 && (
        <div className="mt-8">
          <h4 className="text-gray-500 font-mono text-sm uppercase mb-3">Cronologia Stages</h4>
          <div className="space-y-2">
            {stages.map((st, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded text-sm font-mono border border-gray-800">
                <span className="text-white font-bold">St. {i+1}</span>
                <span className="text-gray-400">Display: <span className="text-white">{st.display}</span></span>
                <span className="text-gray-400">Posizione: <span className="text-amber-500 font-bold">{st.position}</span></span>
                <span className="text-gray-400">Etichetta: <span className="text-amber-500 font-bold">{st.label}</span></span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
