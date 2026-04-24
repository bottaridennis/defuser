import React from 'react';
import { ModuleId, MODULE_NAMES } from '../App';

interface ModuleHubProps {
  setActiveModule: (id: ModuleId) => void;
}

export const ModuleHub: React.FC<ModuleHubProps> = ({ setActiveModule }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full py-8">
      <div className="bg-[#111111] p-6 md:p-10 rounded-2xl border flex flex-col items-center border-[#27272a] shadow-2xl relative w-full max-w-4xl">
        {/* Screws */}
        <div className="absolute top-4 left-4 w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-900 shadow-inner"><div className="w-1 h-full bg-zinc-800 rotate-45" /></div>
        <div className="absolute top-4 right-4 w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-900 shadow-inner"><div className="w-1 h-full bg-zinc-800 rotate-[-20deg]" /></div>
        <div className="absolute bottom-4 left-4 w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-900 shadow-inner"><div className="w-1 h-full bg-zinc-800 rotate-12" /></div>
        <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full bg-zinc-950 flex items-center justify-center border border-zinc-900 shadow-inner"><div className="w-1 h-full bg-zinc-800 rotate-90" /></div>

        <h2 className="text-zinc-500 font-mono text-sm tracking-[0.3em] uppercase mb-8 border-b border-zinc-800 pb-2">Seleziona Modulo sulla Bomba</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full place-items-center">
          
          <ModuleWrapper id="wires" name={MODULE_NAMES.wires} onClick={() => setActiveModule('wires')}>
            <div className="flex flex-col gap-3 w-full px-5">
              <div className="h-2.5 w-full bg-red-600 rounded"></div>
              <div className="h-2.5 w-full bg-white rounded"></div>
              <div className="h-2.5 w-full bg-blue-600 rounded"></div>
              <div className="h-2.5 w-full bg-yellow-500 rounded"></div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="button" name={MODULE_NAMES.button} onClick={() => setActiveModule('button')}>
            <div className="w-24 h-24 rounded-full bg-red-600 border-[6px] border-zinc-800 shadow-[inset_0_-6px_15px_rgba(0,0,0,0.5)] flex items-center justify-center group-hover:scale-105 transition-transform relative">
              <div className="absolute inset-2 rounded-full border border-red-500/50"></div>
              <span className="text-[9px] uppercase font-bold text-white tracking-[0.2em] opacity-90">Detona</span>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="keypads" name={MODULE_NAMES.keypads} onClick={() => setActiveModule('keypads')}>
            <div className="grid grid-cols-2 gap-2">
              <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-amber-500 text-xl overflow-hidden shadow-inner font-black">©</div>
              <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-amber-500 text-xl overflow-hidden shadow-inner font-black">Ω</div>
              <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-amber-500 text-xl overflow-hidden shadow-inner font-black">Ψ</div>
              <div className="w-12 h-12 bg-zinc-800 rounded border border-zinc-700 flex items-center justify-center text-amber-500 text-xl overflow-hidden shadow-inner font-black">★</div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="simon" name={MODULE_NAMES.simon} onClick={() => setActiveModule('simon')}>
            <div className="w-28 h-28 rounded-full border-4 border-zinc-800 grid grid-cols-2 overflow-hidden gap-1 p-1 bg-zinc-800">
              <div className="bg-blue-500/80 rounded-tl-full hover:bg-blue-500 group-hover:bg-blue-500 transition-colors"></div>
              <div className="bg-yellow-400/80 rounded-tr-full hover:bg-yellow-400 group-hover:bg-yellow-400 transition-colors"></div>
              <div className="bg-red-500/80 rounded-bl-full hover:bg-red-500 group-hover:bg-red-500 transition-colors"></div>
              <div className="bg-green-500/80 rounded-br-full hover:bg-green-500 group-hover:bg-green-500 transition-colors"></div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="whosonfirst" name={MODULE_NAMES.whosonfirst} onClick={() => setActiveModule('whosonfirst')}>
            <div className="w-full px-5 flex flex-col gap-2">
              <div className="w-full h-8 bg-zinc-950 border border-zinc-800 flex items-center justify-center rounded-sm">
                <span className="text-[10px] font-mono text-zinc-100">DISPLAY</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="h-4 bg-zinc-800 border border-zinc-700 rounded-sm"></div>
                <div className="h-4 bg-zinc-800 border border-zinc-700 rounded-sm"></div>
                <div className="h-4 bg-zinc-800 border border-zinc-700 rounded-sm"></div>
                <div className="h-4 bg-zinc-800 border border-zinc-700 rounded-sm"></div>
                <div className="h-4 bg-zinc-800 border border-zinc-700 rounded-sm"></div>
                <div className="h-4 bg-zinc-800 border border-zinc-700 rounded-sm"></div>
              </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="memory" name={MODULE_NAMES.memory} onClick={() => setActiveModule('memory')}>
            <div className="w-full px-5 flex flex-col items-center gap-4">
              <div className="w-16 h-12 bg-zinc-950 flex items-center justify-center border border-zinc-800 rounded-sm text-2xl font-mono text-white">4</div>
              <div className="flex gap-2">
                <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-400 rounded-sm">1</div>
                <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-400 rounded-sm">2</div>
                <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-400 rounded-sm">3</div>
                <div className="w-7 h-7 bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-400 rounded-sm">4</div>
              </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="morse" name={MODULE_NAMES.morse} onClick={() => setActiveModule('morse')}>
            <div className="w-full px-5 flex flex-col gap-4 items-center">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border-2 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)] animate-pulse"></div>
              </div>
              <div className="w-full bg-zinc-950 h-6 border border-zinc-800 rounded-sm flex items-center px-2">
                <div className="w-full h-1 bg-zinc-800 relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-2 w-2 h-4 bg-amber-500 shadow"></div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-2 rounded-full">3.505</span>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="compwires" name={MODULE_NAMES.compwires} onClick={() => setActiveModule('compwires')}>
            <div className="w-full px-5 flex flex-col gap-3 relative">
              <div className="flex justify-between items-center relative h-3">
                <div className="w-2 h-2 rounded-full bg-white z-10"></div>
                <div className="h-1.5 w-full bg-[repeating-linear-gradient(45deg,red,red_4px,white_4px,white_8px)] border-y border-red-900 absolute top-1/2 -translate-y-1/2"></div>
                <div className="w-4 flex justify-end text-[10px] text-amber-500 z-10">★</div>
              </div>
              <div className="flex justify-between items-center relative h-3">
                <div className="w-2 h-2 rounded-full bg-zinc-900 border border-zinc-700 z-10"></div>
                <div className="h-1.5 w-full bg-blue-600 border-y border-blue-900 absolute top-1/2 -translate-y-1/2"></div>
                <div className="w-4 flex justify-end text-[10px] text-zinc-600 z-10">★</div>
              </div>
              <div className="flex justify-between items-center relative h-3">
                <div className="w-2 h-2 rounded-full bg-white z-10 border border-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                <div className="h-1.5 w-full bg-white border-y border-zinc-400 absolute top-1/2 -translate-y-1/2"></div>
                <div className="w-4 flex justify-end text-[10px] text-zinc-600 z-10"></div>
              </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="wireseq" name={MODULE_NAMES.wireseq} onClick={() => setActiveModule('wireseq')}>
            <div className="w-full px-5 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500">1</span>
                <div className="flex-1 h-1.5 bg-red-600 mx-3 rounded-full"></div>
                <span className="text-[10px] font-mono text-zinc-500">C</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500">2</span>
                <div className="flex-1 h-1.5 bg-blue-600 mx-3 rounded-full"></div>
                <span className="text-[10px] font-mono text-zinc-500">A</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-zinc-500">3</span>
                <div className="flex-1 h-1.5 bg-zinc-950 border border-zinc-800 mx-3 rounded-full"></div>
                <span className="text-[10px] font-mono text-zinc-500">B</span>
              </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="password" name={MODULE_NAMES.password} onClick={() => setActiveModule('password')}>
            <div className="flex gap-1.5 border-t-[6px] border-b-[6px] border-zinc-800 rounded-lg bg-zinc-950 p-1.5 px-3">
              <div className="flex flex-col items-center">
                <span className="text-[7px] text-zinc-600 mb-0.5">A</span>
                <span className="text-sm font-mono text-white bg-zinc-800 w-5 border border-zinc-700 text-center leading-tight rounded-sm">P</span>
                <span className="text-[7px] text-zinc-600 mt-0.5">E</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[7px] text-zinc-600 mb-0.5">L</span>
                <span className="text-sm font-mono text-white bg-zinc-800 w-5 border border-zinc-700 text-center leading-tight rounded-sm">Z</span>
                <span className="text-[7px] text-zinc-600 mt-0.5">O</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[7px] text-zinc-600 mb-0.5">T</span>
                <span className="text-sm font-mono text-white bg-zinc-800 w-5 border border-zinc-700 text-center leading-tight rounded-sm">A</span>
                <span className="text-[7px] text-zinc-600 mt-0.5">A</span>
              </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="mazes" name={MODULE_NAMES.mazes} onClick={() => setActiveModule('mazes')}>
            <div className="w-16 h-16 border-2 border-green-900 bg-zinc-950 flex flex-col gap-1 p-1">
              <div className="flex gap-1 h-1/3">
                 <div className="w-1/3 bg-green-500/10 border-r border-b border-green-500/50"></div>
                 <div className="w-1/3 bg-green-500/10 border-b border-green-500/50"></div>
                 <div className="w-1/3 bg-green-500/10"></div>
              </div>
              <div className="flex gap-1 h-1/3">
                 <div className="w-1/3 bg-green-500/10"></div>
                 <div className="w-1/3 bg-green-500/10 border-l border-r border-green-500/50 relative"><div className="absolute inset-1 rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"></div></div>
                 <div className="w-1/3 bg-green-500/10 border-b border-green-500/50"></div>
              </div>
              <div className="flex gap-1 h-1/3">
                 <div className="w-1/3 bg-green-500/10 border-t border-green-500/50"></div>
                 <div className="w-1/3 bg-green-500/10 relative"><div className="absolute inset-1.5 rounded-full bg-red-600 shadow-[0_0_5px_rgba(220,38,38,0.8)]"></div></div>
                 <div className="w-1/3 bg-green-500/10 border-t border-green-500/50"></div>
              </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="knobs" name={MODULE_NAMES.knobs} onClick={() => setActiveModule('knobs')}>
            <div className="flex flex-col items-center gap-3">
               <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-700"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]"></div>
               </div>
               <div className="w-16 h-16 rounded-full bg-zinc-900 border-[4px] border-zinc-800 shadow-[2px_2px_10px_rgba(0,0,0,0.5)] relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1.5 h-3 bg-zinc-200 rounded-sm"></div>
               </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="ventinggas" name={MODULE_NAMES.ventinggas} onClick={() => setActiveModule('ventinggas')}>
            <div className="flex flex-col gap-4 items-center">
               <div className="bg-zinc-950 border border-zinc-800 p-2 rounded w-full flex justify-center uppercase font-mono text-[8px] text-green-500 tracking-widest text-center shadow-inner">
                  VENT GAS?
               </div>
               <div className="flex gap-4">
                  <div className="w-12 h-6 bg-zinc-900 border-2 border-zinc-700 font-mono text-xs flex items-center justify-center text-white">Y</div>
                  <div className="w-12 h-6 bg-zinc-900 border-2 border-zinc-700 font-mono text-xs flex items-center justify-center text-white">N</div>
               </div>
            </div>
          </ModuleWrapper>

          <ModuleWrapper id="capacitor" name={MODULE_NAMES.capacitor} onClick={() => setActiveModule('capacitor')}>
            <div className="flex flex-col items-center gap-1.5">
               <div className="flex gap-4 w-full">
                  <div className="flex-1 h-3 bg-zinc-950 border border-zinc-800"></div>
                  <div className="flex-1 h-3 bg-zinc-950 border border-zinc-800"></div>
               </div>
               <div className="w-8 h-20 bg-zinc-950 border-4 border-zinc-800 relative shadow-inner">
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-10 bg-red-600 rounded-sm border-2 border-red-900 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] flex items-center justify-center">
                     <div className="w-full h-1 bg-red-800 absolute top-1/2 -translate-y-1/2"></div>
                  </div>
               </div>
            </div>
          </ModuleWrapper>

        </div>
      </div>
    </div>
  );
};

const ModuleWrapper: React.FC<{ id: string, name: string, onClick: () => void, children: React.ReactNode }> = ({ name, onClick, children }) => {
  return (
    <button 
      onClick={onClick}
      className="group w-full max-w-[180px] aspect-square bg-[#0a0a0c] border border-zinc-700/50 hover:border-amber-500 hover:bg-zinc-900 rounded-xl flex flex-col items-center justify-center relative transition-all shadow-[inset_0_4px_20px_rgba(0,0,0,0.6)] duration-300"
    >
      <div className="absolute top-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
      <div className="absolute bottom-2 right-2 w-1.5 h-1.5 rounded-full bg-zinc-800"></div>
      
      <div className="flex-1 flex items-center justify-center w-full">
        {children}
      </div>

      <div className="absolute h-8 bottom-0 left-0 w-full bg-black/60 backdrop-blur border-t border-zinc-800/50 rounded-b-xl flex items-center justify-center">
        <span className="text-[10px] font-semibold text-zinc-400 group-hover:text-amber-500 uppercase tracking-widest transition-colors">{name}</span>
      </div>
    </button>
  );
}
