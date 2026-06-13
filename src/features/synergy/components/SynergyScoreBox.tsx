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
      // 🧩 1. SynergyInputBox와 부드럽게 스위칭되도록 외관 규격을 surface-glass 토큰으로 일치화
      // 💡 패딩(p-5 sm:p-6)과 그림자 설정을 입력창과 1:1로 일치시켜 컴포넌트 전환 시 화면이 들썩거리는 현상을 막아줍니다.
      className="surface-glass p-5 sm:p-6 flex flex-col items-center text-center gap-4 shadow-sm relative overflow-hidden"
    >
      {/* 🧩 2. 기존 .score-label ➔ 미니멀 모노 라벨 가이드 정돈 */}
      <span className="text-[11px] font-mono font-bold text-stone-400 tracking-wider uppercase select-none">
        {viewMode === 'similarity' ? '02. Sync Rate' : '02. Synergy Score'}
      </span>
      
      {/* 🧩 3. 기존 .score-value ➔ 대형 주파수 점수 디스플레이 개량 */}
      {/* 💡 숫자가 눈에 확 띄도록 font-mono와 굵은 자간을 입히고, 퍼센트 기호(%)는 앰버 컬러의 포인트 폰트로 밸런스를 맞췄습니다. */}
      <div className="text-4xl sm:text-5xl font-black text-stone-800 font-mono tracking-tight my-1.5 flex items-baseline justify-center select-none">
        {viewMode === 'similarity' ? syncRate : synergyScore}
        <span className="text-xl sm:text-2xl font-extrabold text-amber-500 ml-1 font-sans">%</span>
      </div>
      
      {/* 🧩 4. 기존 .action-row ➔ 반응형 2열 균등 그리드 배치 및 공통 디자인 버튼 토큰 이주 */}
      {/* 💡 정형화되지 않았던 아웃라인 버튼 대신, 디자인 시스템 표준 규격인 btn-primary와 btn-secondary를 바인딩했습니다. */}
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