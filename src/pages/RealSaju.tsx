import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import { useRealSajuForm } from "@/features/saju/engines/useRealSajuForm";
import RealSajuInputForm from "@/features/saju/components/RealSajuInputForm";

export default function RealSaju() {
  const navigate = useNavigate();

  const {
    birthDate,
    setBirthDate,
    birthTime,
    setBirthTime,
    isMale,
    setIsMale,
    handleCalculate,
  } = useRealSajuForm();

  return (
    <main className="layout-page justify-center px-6">
      <div className="decor-moon-bg" />
      <div className="decor-stone-bg" />

      <header className="absolute top-6 left-6 z-20">
        <button
          onClick={() => navigate(-1)}
          className="btn-icon"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </header>

      <AnimatePresence mode="wait">
        <RealSajuInputForm
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          birthTime={birthTime}
          setBirthTime={setBirthTime}
          isMale={isMale}
          setIsMale={setIsMale}
          onCalculate={handleCalculate}
        />
      </AnimatePresence>
    </main>
  );
}
