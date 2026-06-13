import { motion } from 'framer-motion';

interface Props {
  onNavigateTest: () => void;
  onNavigateHome: () => void;
}

export default function SynergyEmptyState({ onNavigateTest, onNavigateHome }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
      className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-[6vh] lg:gap-20"
    >
      <div className="flex-1 flex flex-col items-center lg:items-end text-center lg:text-right">
        <header className="mb-[4vh] shrink-0">
          <span className="font-space text-amber-500 font-black tracking-[0.5em] text-[max(10px,0.8vw)] uppercase mb-2 block opacity-90 drop-shadow-sm">Moonlight Garden</span>
          <h1 className="text-[max(1.8rem,3.2vw)] font-light tracking-tighter text-stone-800 leading-tight break-keep">
            아직 당신의 달빛이 <br />
            <span className="font-serif italic font-medium text-amber-500">기록되지 않았습니다</span>
          </h1>
        </header>
        
        <div className="w-[max(180px,14vw)] h-[max(180px,14vw)] rounded-full border-[1px] border-amber-200/50 flex items-center justify-center relative mb-[2vh]">
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.5, 0.1] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="absolute inset-4 rounded-full border-[1px] border-amber-100/50"
          />
          <span className="text-[max(2.2rem,3.5vw)] filter opacity-40 drop-shadow-md">🌙</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center lg:items-start">
        <div className="bg-white/80 backdrop-blur-3xl border border-stone-200/60 p-[max(2rem,3.5vw)] rounded-[max(2.5rem,4vh)] shadow-[0_10px_30px_rgba(0,0,0,0.05)] w-full max-w-[480px]">
          <h2 className="text-[max(1.2rem,1.8vw)] font-bold text-stone-800 mb-5 break-keep leading-snug">
            달빛의 시작점은 바로 당신입니다.
          </h2>
          <p className="text-stone-500 text-[max(13px,1vw)] leading-[1.8] break-keep font-medium mb-10">
            타인과 마음을 대조하기 위해서는 먼저 당신이라는 고유한 빛깔이 필요합니다. 
            당신이 타고난 시공간의 기운을 먼저 확인하고 오시겠어요?
          </p>
          <div className="flex flex-row gap-3 w-full">
            <button 
              onClick={onNavigateTest} 
              className="flex-[2] h-[max(58px,7vh)] rounded-full bg-amber-500 text-white font-bold text-[max(14px,1.1vw)] tracking-[0.2em] shadow-[0_0_15px_rgba(245,158,11,0.2)] active:scale-[0.97] transition-all uppercase hover:bg-amber-600"
            >
              나의 달빛 기록하기
            </button>
            <button 
              onClick={onNavigateHome} 
              className="flex-1 h-[max(58px,7vh)] rounded-full bg-white border border-stone-200 text-stone-600 font-bold text-[max(13px,1vw)] tracking-widest uppercase active:scale-[0.97] transition-all hover:bg-stone-50 shadow-sm"
            >
              HOME
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}