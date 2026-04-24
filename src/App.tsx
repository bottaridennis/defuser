import { useState } from 'react';
import { BombProvider } from './context/BombContext';
import { BombConfig } from './components/BombConfig';
import { BombStatusBar } from './components/BombStatusBar';
import { ModuleHub } from './components/ModuleHub';

// Placeholder for module imports
import { Wires } from './modules/Wires';
import { ButtonModule } from './modules/ButtonModule';
import { Keypads } from './modules/Keypads';
import { SimonSays } from './modules/SimonSays';
import { WhosOnFirst } from './modules/WhosOnFirst';
import { Memory } from './modules/Memory';
import { MorseCode } from './modules/MorseCode';
import { CompWires } from './modules/CompWires';
import { WireSequences } from './modules/WireSequences';
import { Mazes } from './modules/Mazes';
import { Password } from './modules/Password';
import { Knobs } from './modules/Knobs';
import { VentingGas } from './modules/VentingGas';
import { CapacitorDischarge } from './modules/CapacitorDischarge';

type ModuleIdExport = 'wires' | 'button' | 'keypads' | 'simon' | 'whosonfirst' | 'memory' | 'morse' | 'compwires' | 'wireseq' | 'mazes' | 'password' | 'knobs' | 'ventinggas' | 'capacitor' | null;
export type ModuleId = ModuleIdExport;

export const MODULE_NAMES: Record<string, string> = {
  wires: 'Cavi Semplici',
  button: 'Il Pulsante',
  keypads: 'Tastierini',
  simon: 'Simon Dice',
  whosonfirst: 'Incomprensioni',
  memory: 'Memory',
  morse: 'Codice Morse',
  compwires: 'Cavi Complessi',
  wireseq: 'Sequenze di Cavi',
  mazes: 'Labirinti',
  password: 'Password',
  knobs: 'Manopole',
  ventinggas: 'Sfogo Gas',
  capacitor: 'Condensatore',
};

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleId>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderModule = () => {
    switch (activeModule) {
      case 'wires': return <Wires />;
      case 'button': return <ButtonModule />;
      case 'keypads': return <Keypads />;
      case 'simon': return <SimonSays />;
      case 'whosonfirst': return <WhosOnFirst />;
      case 'memory': return <Memory />;
      case 'morse': return <MorseCode />;
      case 'compwires': return <CompWires />;
      case 'wireseq': return <WireSequences />;
      case 'mazes': return <Mazes />;
      case 'password': return <Password />;
      case 'knobs': return <Knobs />;
      case 'ventinggas': return <VentingGas />;
      case 'capacitor': return <CapacitorDischarge />;
      default: return null;
    }
  };

  return (
    <BombProvider>
      <div className="w-full min-h-screen bg-[#050505] text-[#d4d4d8] font-sans flex flex-col overflow-hidden">
        
        <header className="h-16 border-b border-[#27272a] bg-[#09090b] flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.8)] animate-pulse"></div>
            <span className="font-mono text-sm tracking-[0.2em] uppercase text-zinc-500 hidden sm:inline">DefuseKit IT</span>
          </div>
          <div className="text-center">
            <h1 className="text-lg lg:text-xl font-bold tracking-widest uppercase italic text-zinc-100">Expert Defusal Protocol v4.1</h1>
          </div>
          <div className="flex items-center gap-6">
            <BombStatusBar />
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden flex-col md:flex-row relative">
          
          <aside className={`w-full md:w-72 border-r border-[#27272a] bg-[#0a0a0c] flex flex-col p-4 shrink-0 overflow-y-auto ${!activeModule ? '' : 'hidden md:flex'}`}>
            <h2 className="text-[10px] uppercase tracking-tighter text-zinc-500 mb-4 px-2">Select Identified Module</h2>
            <div className="flex flex-col gap-2">
              {Object.entries(MODULE_NAMES).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => setActiveModule(id as ModuleId)}
                  className={`w-full flex items-center justify-between p-3 rounded transition-all border ${
                    activeModule === id
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-100 shadow-lg'
                    : 'hover:bg-zinc-900 border-transparent hover:border-zinc-800 text-zinc-400'
                  }`}
                >
                  <span className="font-semibold">{name}</span>
                </button>
              ))}
            </div>
            <div className="mt-auto pt-4 hidden md:block">
              <div className="p-4 bg-zinc-900/50 rounded border border-dashed border-zinc-800">
                <p className="text-[10px] uppercase text-zinc-500 mb-1">Quick Reference</p>
                <p className="text-xs text-zinc-400 leading-relaxed">Identify the serial number and indicators before proceeding to complex wire analysis.</p>
              </div>
            </div>
          </aside>

          <section className={`flex-1 flex flex-col p-6 lg:p-10 bg-[radial-gradient(circle_at_center,_#111111_0%,_#050505_100%)] overflow-y-auto ${!activeModule ? 'hidden md:flex' : ''}`}>
            {activeModule ? (
              <div className="animate-in fade-in flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2 mb-6">
                  <span className="h-[1px] w-8 bg-amber-500"></span>
                  <span className="text-xs uppercase font-bold tracking-widest text-amber-500">{MODULE_NAMES[activeModule]}</span>
                  <button 
                    onClick={() => setActiveModule(null)}
                    className="ml-auto md:hidden text-xs text-zinc-400 border border-zinc-700 px-3 py-1 rounded"
                  >
                    Torna ai Moduli
                  </button>
                </div>
                
                <div className="flex-1">
                  {renderModule()}
                </div>
              </div>
            ) : (
              <ModuleHub setActiveModule={setActiveModule} />
            )}
          </section>

          <BombConfig />
          
        </main>

        <footer className="h-8 bg-zinc-950 hidden sm:flex items-center px-6 border-t border-[#27272a] shrink-0">
          <div className="flex justify-between w-full font-mono text-[9px] uppercase tracking-widest text-zinc-600">
            <span>Data Feed: Stable</span>
            <span>Secure Protocol: Enabled</span>
            <span>Terminal: 0x8F22</span>
          </div>
        </footer>

      </div>
    </BombProvider>
  );
}
