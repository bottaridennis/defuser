import React from 'react';

export const VentingGas: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">Sfogo Gas (Venting Gas)</h2>
          <p className="text-sm text-zinc-500 mt-1">Modulo esigente.</p>
        </div>
      </div>

      <div className="bg-[#09090b] border border-amber-900/50 rounded-xl p-8 shadow-[0_0_30px_rgba(245,158,11,0.05)] text-center">
         <h3 className="text-amber-500 text-2xl font-black uppercase tracking-widest mb-6">Attenzione: Modulo Esigente</h3>
         
         <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-md mx-auto relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50"></div>
             <p className="font-mono text-zinc-300 text-lg mb-6 uppercase">
                "Rispondi alle domande del computer premendo 'S' per 'Sì' o 'N' per 'No'."
             </p>
             
             <div className="flex justify-center gap-4">
                 <button className="w-16 h-16 bg-zinc-900 border-2 border-zinc-700 rounded text-3xl font-bold text-white hover:border-amber-500 transition-colors">S</button>
                 <button className="w-16 h-16 bg-zinc-900 border-2 border-zinc-700 rounded text-3xl font-bold text-white hover:border-amber-500 transition-colors">N</button>
             </div>
         </div>
      </div>
    </div>
  );
};
