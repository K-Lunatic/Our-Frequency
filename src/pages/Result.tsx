import { ChevronLeft } from "lucide-react";
import { useResult } from "@/features/result/engines/useResult";
import ResultHeroSection from "@/features/result/components/ResultHeroSection";
import CoreAnalyticsBento from "@/features/result/components/CoreAnalyticsBento";
import NarrativeSection from "@/features/result/components/NarrativeSection";
import SpecialStarSection from "@/features/result/components/SpecialStarSection";
import ResultActionFooter from "@/features/result/components/ResultActionFooter";

export default function Result() {
  const {
    navigate,
    captureRef,
    isExporting,
    stageSize,
    userCode,
    scores,
    originData,
    persona,
    narratives,
    assembledScores,
    yinRatio,
    yangRatio,
    specialStars,
    handleSaveImage,
    handleShare,
  } = useResult();

  if (!userCode || !originData || !persona || !narratives) return null;

  return (
    <main className="layout-page justify-start overflow-y-auto scrollbar-hide pb-24">
      <header className="absolute top-6 left-6 z-20">
        <button onClick={() => navigate("/")} className="btn-icon">
          <ChevronLeft className="w-5 h-5" />
        </button>
      </header>

      <div className="decor-moon-bg" />
      <div className="decor-stone-bg" />

      <div
        ref={captureRef}
        className="w-full flex flex-col items-center pt-[10vh] px-6 z-10 relative max-w-[650px] mx-auto"
      >
        <ResultHeroSection persona={persona} />

        <CoreAnalyticsBento
          stageSize={stageSize}
          scores={scores}
          assembledScores={assembledScores}
          originData={originData}
          yinRatio={yinRatio}
          yangRatio={yangRatio}
        />

        <NarrativeSection narratives={narratives} />
        <SpecialStarSection specialStars={specialStars} />
      </div>

      <ResultActionFooter
        isExporting={isExporting}
        onSave={handleSaveImage}
        onShare={handleShare}
        onSynergy={() => navigate("/synergy")}
      />
    </main>
  );
}
