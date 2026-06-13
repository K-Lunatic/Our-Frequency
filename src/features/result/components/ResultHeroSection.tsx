import { motion } from 'framer-motion';
import { MoonStar } from 'lucide-react';

const TAG_STYLES = [
  "bg-amber-50 text-amber-700 border-amber-200/60 shadow-sm",
  "bg-stone-50 text-stone-600 border-stone-200/60 shadow-sm",
  "bg-orange-50 text-orange-700 border-orange-200/60 shadow-sm"
];

interface Props {
  persona: { title: string; tags: string[] };
}

export default function ResultHeroSection({ persona }: Props) {
  return (
    <section className="w-full text-center flex flex-col items-center mb-8 relative">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ duration: 0.6 }} 
        className="relative w-16 h-16 flex items-center justify-center mb-5"
      >
        <div className="absolute inset-0 bg-amber-200/30 rounded-full blur-xl scale-125 animate-pulse" />
        <div className="w-full h-full rounded-full bg-amber-50 border border-amber-200/50 flex items-center justify-center shadow-inner relative z-10">
          <MoonStar className="w-7 h-7 text-amber-500 fill-amber-500/10" strokeWidth={1.5} />
        </div>
      </motion.div>
      
      <motion.h2 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.2 }} 
        className="text-hero px-2"
      >
        {persona.title.split('\n').map((line, i) => (
          <span key={i} className="block">{line}</span>
        ))}
      </motion.h2>
      
      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.3 }} 
        className="flex flex-wrap gap-2 justify-center mt-5"
      >
        {persona.tags.map((tag, i) => (
          <span 
            key={i} 
            className={`text-[11px] font-bold px-3 py-1 rounded-full border tracking-wide transition-all duration-300 ${TAG_STYLES[i % 3]}`}
          >
            {tag}
          </span>
        ))}
      </motion.div>
    </section>
  );
}