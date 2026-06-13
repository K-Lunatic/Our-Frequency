import { useState, useRef, useCallback } from "react";

export function useTestProgress(totalSteps: number, onComplete: (answers: number[]) => void, onExit: () => void) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isLocked = useRef(false);

  const handleAnswer = useCallback((value: number) => {
    if (isLocked.current) return;
    
    isLocked.current = true;
    setIsTransitioning(true);

    const newAnswers = [...answers];
    newAnswers[currentStep] = value;
    setAnswers(newAnswers);

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  }, [currentStep, totalSteps, answers, onComplete]);

  const handleBack = useCallback(() => {
    if (isLocked.current) return;
    if (currentStep > 0) {
      isLocked.current = true;
      setIsTransitioning(true);
      setCurrentStep((prev) => prev - 1);
    } else {
      onExit();
    }
  }, [currentStep, onExit]);

  const releaseLock = useCallback(() => {
    isLocked.current = false;
    setIsTransitioning(false);
  }, []);

  return {
    currentStep,
    answers,
    isTransitioning,
    handleAnswer,
    handleBack,
    releaseLock
  };
}