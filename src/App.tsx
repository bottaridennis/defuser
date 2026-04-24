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
          
          <section className="flex-1 flex flex-col p-6 lg:p-10 bg-[radial-gradient(circle_at_center,_#111111_0%,_#050505_100%)] overflow-y-auto">
            {activeModule ? (
              <div className="animate-in fade-in flex-1 flex flex-col max-w-4xl mx-auto w-full">
                <div className="flex items-center gap-2 mb-6">
                   <span className="h-[1px] w-8 bg-amber-500"></span>
                   <span className="text-xs uppercase font-bold tracking-widest text-amber-500">{MODULE_NAMES[activeModule]}</span>
                   <button 
                     onClick={() => setActiveModule(null)}
                     className="ml-auto text-xs text-zinc-400 border border-zinc-700 hover:bg-zinc-800 hover:text-white transition-colors px-3 py-1 rounded font-mono uppercase"
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
