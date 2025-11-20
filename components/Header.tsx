import React from 'react';
import { LeafIcon } from './Icons';

interface HeaderProps {
  resetApp: () => void;
}

const Header: React.FC<HeaderProps> = ({ resetApp }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={resetApp} className="flex items-center gap-2 group">
          <div className="bg-emerald-100 p-2 rounded-lg group-hover:bg-emerald-200 transition-colors">
            <LeafIcon className="w-6 h-6 text-emerald-600" />
          </div>
          <span className="font-bold text-xl text-slate-800 tracking-tight">
            GreenThumb<span className="text-emerald-600">AI</span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;