import { motion } from "framer-motion";
import Button from "@/shared/ui/Button";

interface Props {
  currentStep: number;
  totalSteps: number;
  isTransitioning: boolean;
  onBack: () => void;
}

export default function TestProgressBar({
  currentStep,
  totalSteps,
  isTransitioning,
  onBack,
}: Props) {
  return (
    <header className="w-full max-w-[440px] mx-auto flex items-center justify-between gap-4 py-4 px-2 z-20 relative">
      <Button
        variant="icon"
        onClick={onBack}
        disabled={isTransitioning}
        className="btn-icon"
      >
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </Button>

      <div className="flex-1 flex flex-col items-center gap-2">
        <span className="text-subtitle !mb-0 select-none">
          Moonlight Garden
        </span>

        <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full bg-amber-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>
      <div className="w-10 h-10 shrink-0 pointer-events-none" />
    </header>
  );
}
