import React from 'react';

export const CapacitorDischarge: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-zinc-100 flex items-center gap-3">Scarica il Condensatore</h2>
          <p className="text-sm text-zinc-500 mt-1">Modulo esigente.</p>
        </div>
      </div>

      <div className="bg-[#09090b] border border-red-900/50 rounded-xl p-8 shadow-[0_0_30px_rgba(239,68,68,0.05)] text-center">
         <h3 className="text-red-500 text-2xl font-black uppercase tracking-widest mb-6">Attenzione: Modulo Esigente</h3>
         
         <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 max-w-md mx-auto relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-amber-500 to-red-500 animate-pulse"></div>
             
             <div className="w-16 h-32 border-4 border-zinc-700 rounded-t-xl mx-auto mb-6 relative bg-zinc-900">
                <div className="absolute bottom-0 left-0 w-full h-2/3 bg-amber-500 animate-pulse"></div>
             </div>
             
             <p className="font-mono text-zinc-300 text-lg mb-6 uppercase">
                "Scarica il condensatore prima che si sovraccarichi tenendo abbassata la leva."
             </p>
         </div>
      </div>
    </div>
  );
};
