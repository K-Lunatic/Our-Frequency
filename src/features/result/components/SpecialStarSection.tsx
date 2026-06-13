import { motion } from 'framer-motion';
import { Moon, Wind, Mountain, Leaf, Sun, Sparkles, Star } from 'lucide-react';

const getStarIcon = (name: string) => {
  if (name.includes('도화')) return Moon;
  if (name.includes('역마')) return Wind;
  if (name.includes('화개')) return Mountain;
  if (name.includes('괴강') || name.includes('백호')) return Leaf;
  if (name.includes('천을')) return Sun;
  return Sparkles;
};

interface Props {
  specialStars: any[];
}

export default function SpecialStarSection({ specialStars }: Props) {
  return (
    <div className="w-full max-w-[650px] mx-auto my-12 z-10 relative">
      
      <div className="text-center mb-8">
        <h2 className="text-hero mb-2">달빛이 깃든 신호</h2>
        <p className="text-[13px] font-medium text-stone-500">삶을 이끄는 포근한 운명의 에너지</p>
      </div>

      <section className="w-full">
        {specialStars && specialStars.length > 0 ? (
          <div className={`grid gap-4 w-full ${specialStars.length === 1 ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {specialStars.map((star: any, idx: number) => {
              const Icon = getStarIcon(star.name);
              const isSingle = specialStars.length === 1;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: 0.9 + (idx * 0.1) }} 
                  key={idx} 
                  className={`bg-white border border-stone-200/60 rounded-2xl lg:rounded-[1.5rem] p-5 lg:p-6 shadow-sm flex ${
                    isSingle ? 'flex-row items-start gap-5' : 'flex-col items-center sm:items-start gap-4'
                  }`}
                >
                  <div className={`flex items-center justify-center shrink-0 rounded-full bg-amber-50 border border-amber-200/40 ${isSingle ? 'w-14 h-14 mt-1' : 'w-12 h-12'}`}>
                    <Icon className={`text-amber-500 fill-amber-500/10 ${isSingle ? 'w-6 h-6' : 'w-5 h-5'}`} />
                  </div>

                  <div className={`flex-1 flex flex-col ${isSingle ? 'justify-start' : 'items-center sm:items-start text-center sm:text-left'}`}>
                    <div className={`flex flex-wrap items-center gap-2 mb-2 ${isSingle ? '' : 'justify-center sm:justify-start'}`}>
                      <h4 className="text-[15px] font-extrabold text-stone-800">{star.name}</h4>
                      <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200/30 px-1.5 py-0.5 rounded-md tracking-wide uppercase">
                        {star.keywords}
                      </span>
                    </div>
                    <p className="text-[13px] text-stone-600 leading-relaxed">
                      {star.desc}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white border border-stone-200/60 rounded-2xl p-12 flex flex-col items-center justify-center text-center border-dashed bg-stone-50/40 shadow-none">
            <Star className="w-7 h-7 text-stone-300 mb-2 animate-pulse" />
            <p className="text-[13px] text-stone-400 font-medium leading-relaxed">
              특별한 살(殺)의 간섭 없이 맑고 고요한 궤도를 유지하고 있습니다.
            </p>
          </div>
        )}
      </section>
      
    </div>
  );
}