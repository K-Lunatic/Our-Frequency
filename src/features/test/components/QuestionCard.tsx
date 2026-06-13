import { motion } from 'framer-motion';

const TARGET_LABELS: Record<string, string> = {
  month: "Chapter I. 세상과 교감하는 달빛",
  hour: "Chapter II. 미래로 향하는 궤적",
  day: "Chapter III. 내면의 고요한 정원",
  year: "Chapter IV. 과거와 뿌리의 달빛",
};

interface Props {
  currentStep: number;
  totalSteps: number;
  question: any;
  currentAnswer?: number;
  isTransitioning: boolean;
  onAnswer: (value: number) => void;
  onAnimationComplete: () => void;
}

export default function QuestionCard({
  currentStep,
  totalSteps,
  question,
  currentAnswer,
  isTransitioning,
  onAnswer,
  onAnimationComplete,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "linear" }}
      onAnimationComplete={onAnimationComplete}
      className="w-full max-w-[440px] mx-auto flex flex-col z-10"
    >
      <article className="text-center mb-8 flex flex-col items-center">
        <span className="text-subtitle mb-2">
          {TARGET_LABELS[question.target] || "Chapter Unknown"}
        </span>

        <span className="text-[10px] font-mono font-bold tracking-widest text-stone-400 uppercase bg-stone-100 px-2 py-0.5 rounded-md">
          Question {String(currentStep + 1).padStart(2, "0")} / {totalSteps}
        </span>

        <h2 className="text-hero mt-5 text-[1.35rem] md:text-2xl leading-relaxed font-extrabold text-stone-800 break-keep px-2">
          {question.text}
        </h2>
      </article>

      <nav className="w-full flex flex-col gap-2.5">
        {question.options.map((opt: any, idx: number) => {
          const isSelected = currentAnswer === opt.value;
          return (
            <motion.button
              key={idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03, duration: 0.2 }}
              onClick={() => onAnswer(opt.value)}
              disabled={isTransitioning}
              className={`w-full min-h-[56px] px-5 py-3.5 rounded-xl border text-left flex items-center justify-between transition-all font-medium text-sm text-stone-700 active:scale-[0.99] disabled:opacity-50 select-none cursor-pointer ${
                isSelected
                  ? "bg-amber-50/40 border-amber-500 text-stone-900 shadow-sm font-bold ring-1 ring-amber-500/20"
                  : "bg-white border-stone-200/80 hover:bg-stone-50 hover:border-stone-300"
              }`}
            >
              <span className="flex-1 pr-4 leading-normal">{opt.label}</span>

              <div
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 bg-white transition-all ${
                  isSelected ? "border-amber-500" : "border-stone-300"
                }`}
              >
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full bg-amber-500"
                  />
                )}
              </div>
            </motion.button>
          );
        })}
      </nav>
    </motion.div>
  );
}