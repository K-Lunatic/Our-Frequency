import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, Zap } from "lucide-react";
import WaveCanvas from "@/shared/visual/WaveCanvas";
import SynergyEmptyState from "@/features/synergy/components/SynergyEmptyState";
import SynergyReport from "@/features/synergy/components/SynergyReport";
import { useSynergy } from "@/features/synergy/engines/useSynergy";
import SynergyDebugPanel from "@/features/synergy/components/SynergyDebugPanel";
import SynergyInputBox from "@/features/synergy/components/SynergyInputBox";
import SynergyScoreBox from "@/features/synergy/components/SynergyScoreBox";

export default function Synergy() {
  const navigate = useNavigate();
  const [stageSize, setStageSize] = useState({ w: 320, h: 140 });

  useEffect(() => {
    const calculateSize = () => {
      const isDesktop = window.innerWidth >= 1024;
      const maxWidth = isDesktop
        ? window.innerWidth * 0.28
        : window.innerWidth * 0.75;
      const finalW = Math.floor(Math.min(maxWidth, 400));
      setStageSize({ w: finalW, h: Math.floor(finalW / 2.2) });
    };
    calculateSize();
    window.addEventListener("resize", calculateSize);
    return () => window.removeEventListener("resize", calculateSize);
  }, []);

  const synergyState = useSynergy();
  const {
    myCode,
    myScores,
    typingCode,
    setTypingCode,
    viewMode,
    setViewMode,
    error,
    isMatched,
    activePartnerScores,
    developerMode,
    clickCount,
    comparisonData,
    syncRate,
    synergyData,
    advancedReadingText,
    myParsedSaju,
    partnerParsedSaju,
    masterDebugData,
    handleMatch,
    handleReset,
    toggleDevMode,
  } = synergyState;

  return (
    <main className="layout-page justify-start">
      <div className="decor-moon-bg" />
      <div className="decor-stone-bg" />

      <header className="absolute top-6 left-6 z-20 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="btn-icon"
          aria-label="뒤로가기"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </header>

      <section className="relative z-10 w-full h-full flex flex-col min-h-0 items-center overflow-y-auto scrollbar-hide px-6 pt-[12vh] pb-16">
        {!myCode ? (
          <SynergyEmptyState
            onNavigateTest={() => navigate("/test")}
            onNavigateHome={() => navigate("/")}
          />
        ) : (
          <div className="w-full max-w-[1050px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 w-full flex flex-col gap-5 max-w-[450px] mx-auto">
              <header className="text-center lg:text-left">
                <span className="text-subtitle">Moonlight Harmony</span>
                <h1 className="text-hero mt-1">달빛의 공명</h1>
              </header>

              <div className="w-full rounded-[2rem] border border-stone-200/60 bg-white/40 backdrop-blur-md overflow-hidden flex flex-col items-center justify-center p-5 shadow-sm group relative">
                <div
                  style={{ width: stageSize.w, height: stageSize.h }}
                  className="flex items-center justify-center relative z-10"
                >
                  {myScores && (
                    <WaveCanvas
                      myScores={myScores}
                      partnerScores={
                        activePartnerScores ?? {
                          wood: 0,
                          fire: 0,
                          earth: 0,
                          metal: 0,
                          water: 0,
                        }
                      }
                      width={stageSize.w}
                      height={stageSize.h}
                    />
                  )}
                </div>
                <div className="absolute bottom-3 inset-x-4 z-25 flex items-center justify-center gap-1.5 text-[10px] text-stone-400 font-medium bg-white/80 backdrop-blur-sm py-1 px-3 rounded-full border border-stone-100/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Info className="w-3.5 h-3.5 text-stone-400" />
                  <span>두 사람의 주파수가 교차하며 공명합니다</span>
                </div>
              </div>

              <AnimatePresence>
                {developerMode && isMatched && (
                  <SynergyDebugPanel masterDebugData={masterDebugData} />
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {!isMatched ? (
                  <SynergyInputBox
                    typingCode={typingCode}
                    setTypingCode={setTypingCode}
                    handleMatch={handleMatch}
                    error={error}
                    toggleDevMode={toggleDevMode}
                    developerMode={developerMode}
                    clickCount={clickCount}
                  />
                ) : (
                  <SynergyScoreBox
                    viewMode={viewMode}
                    syncRate={syncRate}
                    synergyScore={synergyData?.score}
                    onReset={handleReset}
                  />
                )}
              </AnimatePresence>
            </div>

            <div className="lg:col-span-7 w-full flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                {!isMatched ? (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="surface-glass border-dashed border-stone-200/80 bg-white/30 backdrop-blur-xl flex flex-col items-center justify-center p-16 min-h-[380px] text-center"
                  >
                    <p className="text-xs uppercase font-mono tracking-[0.3em] font-bold text-stone-300 animate-pulse">
                      Ready for Moonlight
                    </p>
                  </motion.div>
                ) : (
                  <div className="w-full flex flex-col min-h-0">
                    <SynergyReport
                      viewMode={viewMode}
                      setViewMode={setViewMode}
                      comparisonData={comparisonData}
                      myOriginData={myParsedSaju}
                      partnerOriginData={partnerParsedSaju}
                      synergyData={synergyData}
                      advancedReadingText={advancedReadingText}
                    />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
