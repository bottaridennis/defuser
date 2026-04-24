import React from 'react';
import { useBombContext } from '../context/BombContext';

export const BombStatusBar: React.FC = () => {
  const { serial } = useBombContext();
  
  return (
    <div className="flex flex-col items-end">
      <span className="text-[10px] uppercase text-zinc-500 leading-none mb-1">Serial Number</span>
      <span className="font-mono text-sm font-bold text-zinc-200">
        {serial || '- -  - -'}
      </span>
    </div>
  );
};
