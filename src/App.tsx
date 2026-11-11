import { useEffect, useRef, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { BombProvider } from './context/BombContext';
import { BombConfig } from './components/BombConfig';
import { BombStatusBar } from './components/BombStatusBar';
import { ModuleHub } from './components/ModuleHub';
import { MODULE_BY_ID, ModuleId } from './modules/registry';

/** Legge il modulo attivo dall'hash (#/cavi) così il tasto "indietro" del telefono funziona. */
function readHash(): ModuleId | null {
  const id = window.location.hash.replace(/^#\/?/, '') as ModuleId;
  return id && id in MODULE_BY_ID ? id : null;
}

export default function App() {
  const [active, setActive] = useState<ModuleId | null>(readHash);

  useEffect(() => {
    const onHash = () => {
      setActive(readHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // true se siamo arrivati al modulo dalla home: in quel caso "indietro" usa la cronologia
  const fromHub = useRef(false);
  const open = (id: ModuleId) => {
    fromHub.current = true;
    window.location.hash = `/${id}`;
  };
  const back = () => {
    if (fromHub.current) {
      fromHub.current = false;
      window.history.back();
    } else {
      window.location.hash = '';
    }
  };

  const mod = active ? MODULE_BY_ID[active] : null;

  useEffect(() => {
    document.title = mod ? `${mod.name} · Defuser` : 'Defuser';
  }, [mod]);

  return (
    <BombProvider>
      <div className="flex min-h-dvh flex-col bg-ink-950 bg-grid">
        <header className="safe-top sticky top-0 z-40 border-b border-ink-700/70 bg-ink-950/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
            {mod ? (
              <button
                type="button"
                onClick={back}
                aria-label="Torna ai moduli"
                className="-ml-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink-700 bg-ink-850 text-ink-300 hover:text-ink-100"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-850 ring-1 ring-ink-700">
                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-stop shadow-[0_0_10px_var(--color-stop)]" />
              </span>
            )}

            <div className="min-w-0 flex-1">
              {mod ? (
                <>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-signal">
                    {mod.needy ? 'Modulo bisognoso' : 'Modulo'}
                  </p>
                  <h1 className="truncate font-display text-lg font-bold leading-tight">{mod.name}</h1>
                </>
              ) : (
                <>
                  <p className="font-display text-lg font-bold leading-none tracking-tight">
                    DEFUSER<span className="text-signal">.</span>
                  </p>
                  <p className="mt-1 hidden truncate font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 sm:block">
                    Manuale dell'esperto · Keep Talking and Nobody Explodes
                  </p>
                </>
              )}
            </div>

            <BombStatusBar />
          </div>
        </header>

        <div className="flex flex-1">
          <main className="min-w-0 flex-1 px-4 pb-16 pt-5 sm:px-6 lg:px-10 lg:pt-8">
            <div className="mx-auto w-full max-w-3xl">
              {mod ? (
                <div key={mod.id} className="animate-rise">
                  <mod.Component />
                </div>
              ) : (
                <ModuleHub onOpen={open} />
              )}
            </div>
          </main>
          <BombConfig />
        </div>
      </div>
    </BombProvider>
  );
}
