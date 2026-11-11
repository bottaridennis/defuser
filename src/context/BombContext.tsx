import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';

export const INDICATORS = ['SND', 'CLR', 'CAR', 'IND', 'FRQ', 'SIG', 'NSA', 'MSA', 'TRN', 'BOB', 'FRK'] as const;

export const PORTS = [
  { id: 'DVI-D', label: 'DVI-D' },
  { id: 'Parallel', label: 'Parallela' },
  { id: 'PS/2', label: 'PS/2' },
  { id: 'RJ-45', label: 'RJ-45' },
  { id: 'Serial', label: 'Seriale' },
  { id: 'Stereo RCA', label: 'Stereo RCA' },
] as const;

interface BombState {
  serial: string;
  batteries: number | undefined;
  strikes: number;
  indicators: string[]; // indicatori ACCESI
  ports: string[];
  portsChecked: boolean; // l'utente ha confermato di aver controllato le porte
}

interface BombContextType extends BombState {
  setSerial: (s: string) => void;
  setBatteries: (b: number | undefined) => void;
  setStrikes: (s: number) => void;
  toggleIndicator: (ind: string) => void;
  togglePort: (port: string) => void;
  setPortsChecked: (v: boolean) => void;
  resetBomb: () => void;
  /** Il seriale contiene una vocale (A, E, I, O, U) */
  hasVowel: boolean | undefined;
  /** Ultima cifra del seriale (non l'ultimo carattere!) */
  lastDigit: number | undefined;
  isEven: boolean | undefined;
  hasParallel: boolean | undefined;
  configOpen: boolean;
  setConfigOpen: (v: boolean) => void;
}

const STORAGE_KEY = 'defuser:bomb:v2';

const EMPTY: BombState = {
  serial: '',
  batteries: undefined,
  strikes: 0,
  indicators: [],
  ports: [],
  portsChecked: false,
};

function load(): BombState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    return { ...EMPTY, ...JSON.parse(raw) };
  } catch {
    return EMPTY;
  }
}

const BombContext = createContext<BombContextType | undefined>(undefined);

export const BombProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<BombState>(load);
  const [configOpen, setConfigOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage non disponibile: nessun problema */
    }
  }, [state]);

  const value = useMemo<BombContextType>(() => {
    const serial = state.serial;
    const digits = serial.match(/\d/g);
    const lastDigit = digits ? parseInt(digits[digits.length - 1], 10) : undefined;
    const hasVowel = serial.length > 0 ? /[AEIOU]/i.test(serial) : undefined;
    const hasParallel = state.ports.includes('Parallel') ? true : state.portsChecked ? false : undefined;

    return {
      ...state,
      setSerial: (s) => setState((p) => ({ ...p, serial: s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6) })),
      setBatteries: (b) => setState((p) => ({ ...p, batteries: b === undefined ? undefined : Math.max(0, Math.min(20, b)) })),
      setStrikes: (s) => setState((p) => ({ ...p, strikes: s })),
      toggleIndicator: (ind) =>
        setState((p) => ({
          ...p,
          indicators: p.indicators.includes(ind) ? p.indicators.filter((i) => i !== ind) : [...p.indicators, ind],
        })),
      togglePort: (port) =>
        setState((p) => ({
          ...p,
          portsChecked: true,
          ports: p.ports.includes(port) ? p.ports.filter((x) => x !== port) : [...p.ports, port],
        })),
      setPortsChecked: (v) => setState((p) => ({ ...p, portsChecked: v })),
      resetBomb: () => setState(EMPTY),
      hasVowel,
      lastDigit,
      isEven: lastDigit === undefined ? undefined : lastDigit % 2 === 0,
      hasParallel,
      configOpen,
      setConfigOpen,
    };
  }, [state, configOpen]);

  return <BombContext.Provider value={value}>{children}</BombContext.Provider>;
};

export const useBombContext = () => {
  const context = useContext(BombContext);
  if (context === undefined) {
    throw new Error('useBombContext must be used within a BombProvider');
  }
  return context;
};
