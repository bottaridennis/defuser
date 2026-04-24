import React, { useState } from 'react';
import { useBombContext } from '../context/BombContext';
import { Settings, X, Plus, Minus } from 'lucide-react';

const COMMON_INDICATORS = ['CAR', 'FRK', 'SND', 'CLR', 'IND', 'FRQ', 'SIG', 'NSA', 'MSA', 'TRN', 'BOB'];
const COMMON_PORTS = ['DVI-D', 'Parallel', 'PS/2', 'RJ-45', 'Seriale', 'Stereo RCA'];

export const BombConfig: React.FC = () => {
  const { serial, setSerial, batteries, setBatteries, strikes, setStrikes, indicators, toggleIndicator, ports, togglePort } = useBombContext();
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Defining the form content as a variable, NOT a component, to prevent unmounting and keyboard dismissal.
  const formContentNodes = (
    <div className="space-y-6">
      {/* Serial Number */}
      <div>
        <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-mono">Numero Seriale</label>
        <input
          type="text"
          value={serial}
          onChange={(e) => setSerial(e.target.value.toUpperCase())}
          className="w-full bg-zinc-900 border border-zinc-800 rounded p-2 text-zinc-100 font-mono uppercase focus:border-amber-500 outline-none"
          placeholder="Es. AB12C3"
        />
      </div>

      {/* Batteries */}
      <div>
        <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-mono">Numero di Batterie</label>
        <div className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded overflow-hidden">
          <button
            onClick={() => setBatteries(Math.max(0, (batteries || 0) - 1))}
            className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 w-10 flex justify-center border-r border-zinc-800"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-mono text-zinc-100">
            {batteries !== undefined ? batteries : '-'}
          </span>
          <button
            onClick={() => setBatteries((batteries || 0) + 1)}
            className="p-2 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 w-10 flex justify-center border-l border-zinc-800"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Strikes */}
      <div>
        <h3 className="text-[10px] uppercase text-zinc-500 mb-2 font-mono">Strikes</h3>
        <div className="flex gap-2">
          {[0, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => setStrikes(s)}
              className={`flex-1 h-10 border rounded flex items-center justify-center font-mono text-xl transition-all ${
                strikes === s 
                ? 'border-red-900 bg-red-950/40 text-red-500 font-bold' 
                : 'border-zinc-800 bg-zinc-900 text-zinc-700 hover:text-zinc-400 hover:border-zinc-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div>
        <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-mono">Indicatori Accesi</label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_INDICATORS.map((ind) => (
            <button
              key={ind}
              onClick={() => toggleIndicator(ind)}
              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${
                indicators.includes(ind)
                  ? 'bg-amber-600/20 text-amber-500 border border-amber-900/50'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {ind}
            </button>
          ))}
        </div>
      </div>

      {/* Ports */}
      <div>
        <label className="block text-[10px] uppercase text-zinc-500 mb-2 font-mono">Porte Presenti</label>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_PORTS.map((port) => (
            <button
              key={port}
              onClick={() => togglePort(port)}
              className={`px-2 py-1 rounded text-[10px] font-mono transition-colors ${
                ports.includes(port)
                  ? 'bg-cyan-900/30 text-cyan-500 border border-cyan-900/50'
                  : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-zinc-700 hover:text-zinc-300'
              }`}
            >
              {port}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="w-80 border-l border-[#27272a] bg-[#09090b] flex-col p-4 shrink-0 overflow-y-auto hidden lg:flex">
        <h2 className="text-[10px] uppercase tracking-tighter text-zinc-500 mb-4 px-2">Environment Configuration</h2>
        {formContentNodes}
      </aside>

      {/* Mobile Configuration Modal */}
      <button
        onClick={() => setIsOpenMobile(true)}
        className="lg:hidden fixed bottom-4 right-4 bg-amber-500 hover:bg-amber-400 text-gray-900 p-4 rounded-full shadow-lg z-50 transition-transform active:scale-95"
      >
        <Settings size={28} />
      </button>

      {isOpenMobile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex justify-end backdrop-blur-sm lg:hidden">
          <div className="bg-[#09090b] w-full max-w-sm h-full shadow-2xl p-6 overflow-y-auto border-l border-[#27272a]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[10px] uppercase tracking-tighter text-zinc-500">Environment Configuration</h2>
              <button onClick={() => setIsOpenMobile(false)} className="text-zinc-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            {formContentNodes}
          </div>
        </div>
      )}
    </>
  );
};
