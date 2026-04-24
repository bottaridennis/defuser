import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BombState {
  serial: string;
  batteries: number | undefined;
  strikes: number;
  indicators: string[]; // Lit indicators
  ports: string[]; // Present ports
}

interface BombContextType extends BombState {
  setSerial: (s: string) => void;
  setBatteries: (b: number | undefined) => void;
  setStrikes: (s: number) => void;
  toggleIndicator: (ind: string) => void;
  togglePort: (port: string) => void;
  hasVowel: boolean;
  isEven: boolean | undefined;
  hasParallel: boolean;
}

const BombContext = createContext<BombContextType | undefined>(undefined);

export const BombProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [serial, setSerial] = useState('');
  const [batteries, setBatteries] = useState<number | undefined>(undefined);
  const [strikes, setStrikes] = useState(0);
  const [indicators, setIndicators] = useState<string[]>([]);
  const [ports, setPorts] = useState<string[]>([]);

  const toggleIndicator = (ind: string) => {
    setIndicators((prev) =>
      prev.includes(ind) ? prev.filter((i) => i !== ind) : [...prev, ind]
    );
  };

  const togglePort = (port: string) => {
    setPorts((prev) =>
      prev.includes(port) ? prev.filter((p) => p !== port) : [...prev, port]
    );
  };

  const hasVowel = /[AEIOUaeiou]/.test(serial);
  
  const lastChar = serial.trim().slice(-1);
  const isEven = lastChar && !isNaN(parseInt(lastChar, 10)) ? parseInt(lastChar, 10) % 2 === 0 : undefined;
  
  const hasParallel = ports.includes('Parallel');

  return (
    <BombContext.Provider
      value={{
        serial,
        batteries,
        strikes,
        indicators,
        ports,
        setSerial,
        setBatteries,
        setStrikes,
        toggleIndicator,
        togglePort,
        hasVowel,
        isEven,
        hasParallel,
      }}
    >
      {children}
    </BombContext.Provider>
  );
};

export const useBombContext = () => {
  const context = useContext(BombContext);
  if (context === undefined) {
    throw new Error('useBombContext must be used within a BombProvider');
  }
  return context;
};
