import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useHexCompress } from "@/shared/hooks/useHexCompress";
import masterDB from "@/shared/data/questions_db.json";
import { useTestProgress } from "@/features/test/engines/useTestProgress";
import TestProgressBar from "@/features/test/components/TestProgressBar";
import QuestionCard from "@/features/test/components/QuestionCard";

const questions = masterDB.questions as unknown as Question[];

export default function Test() {
  const navigate = useNavigate();
  const { compress } = useHexCompress();

  const handleComplete = (finalAnswers: number[]) => {
    const code = compress(finalAnswers);
    localStorage.setItem("user_frequency_code", code);
    navigate("/result", { state: { userCode: code }, replace: true });
  };

  const handleExit = () => navigate("/");

  const {
    currentStep,
    answers,
    isTransitioning,
    handleAnswer,
    handleBack,
    releaseLock,
  } = useTestProgress(questions.length, handleComplete, handleExit);

  const currentQuestion = questions[currentStep];

  return (
    <main
      className={`layout-page justify-start px-6 ${isTransitioning ? "pointer-events-none" : ""}`}
    >
      <div className="decor-moon-bg" />
      <div className="decor-stone-bg" />

      <TestProgressBar
        currentStep={currentStep}
        totalSteps={questions.length}
        isTransitioning={isTransitioning}
        onBack={handleBack}
      />

      <section className="w-full flex-1 flex items-start justify-center pt-[6vh]">
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentStep}
            currentStep={currentStep}
            totalSteps={questions.length}
            question={currentQuestion}
            currentAnswer={answers[currentStep]}
            isTransitioning={isTransitioning}
            onAnswer={handleAnswer}
            onAnimationComplete={releaseLock}
          />
        </AnimatePresence>
      </section>
    </main>
  );
}
