import { motion } from 'framer-motion';
import { RotateCcw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  viewMode: 'similarity' | 'synergy';
  syncRate: number;
  synergyScore?: number;
  onReset: () => void;
}

export default function SynergyScoreBox({ viewMode, syncRate, synergyScore, onReset }: Props) {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      key="score-box" 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }}
      className="surface-glass p-5 sm:p-6 flex flex-col items-center text-center gap-4 shadow-sm relative overflow-hidden"
    >
      <span className="text-[11px] font-mono font-bold text-stone-400 tracking-wider uppercase select-none">
        {viewMode === 'similarity' ? '02. Sync Rate' : '02. Synergy Score'}
      </span>
      
      <div className="text-4xl sm:text-5xl font-black text-stone-800 font-mono tracking-tight my-1.5 flex items-baseline justify-center select-none">
        {viewMode === 'similarity' ? syncRate : synergyScore}
        <span className="text-xl sm:text-2xl font-extrabold text-amber-500 ml-1 font-sans">%</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 w-full mt-1">
         <button 
           onClick={onReset} 
           className="btn-primary flex items-center justify-center gap-1.5 h-11 text-xs"
         >
           <RotateCcw className="w-3.5 h-3.5" /> 
           다시 엮기
         </button>
         
         <button 
           onClick={() => navigate('/')} 
           className="btn-secondary flex items-center justify-center gap-1.5 h-11 text-xs"
         >
           <Home className="w-3.5 h-3.5 text-stone-500" /> 
           HOME
         </button>
      </div>
    </motion.div>
  );
}