import { motion } from "framer-motion";

export interface ComparisonItem {
  text: string;
  myChoice: string;
  partnerChoice: string;
  isMatch: boolean;
}

export interface SynergyReportProps {
  viewMode: "similarity" | "synergy";
  setViewMode: (mode: "similarity" | "synergy") => void;
  comparisonData: ComparisonItem[];
  myOriginData: any | null;
  partnerOriginData: any | null;
  synergyData: {
    score: number;
    synergyType: "상생" | "상극" | "균형";
    myDom: any;
    partnerDom: any;
  } | null;
  advancedReadingText: string;
}

const GRAPH_COLOR_MAP: Record<
  string,
  { text: string; bg: string; border: string }
> = {
  wood: { text: "#3A5A40", bg: "#F1F4F1", border: "border-emerald-200" },
  fire: { text: "#C1121F", bg: "#FDF4F4", border: "border-rose-200" },
  earth: { text: "#A67C00", bg: "#F9F6F2", border: "border-amber-200" },
  metal: { text: "#57534E", bg: "#F5F5F4", border: "border-stone-300" },
  water: { text: "#1D3557", bg: "#F0F4F8", border: "border-sky-200" },
};

export default function SynergyReport({
  viewMode,
  setViewMode,
  comparisonData,
  myOriginData,
  partnerOriginData,
  synergyData,
  advancedReadingText,
}: SynergyReportProps) {
  const labels = ["年", "月", "日", "時"];

  const myElementId = synergyData?.myDom?.id || "wood";
  const partnerElementId = synergyData?.partnerDom?.id || "wood";

  const myTheme = GRAPH_COLOR_MAP[myElementId] || GRAPH_COLOR_MAP["wood"];
  const partnerTheme =
    GRAPH_COLOR_MAP[partnerElementId] || GRAPH_COLOR_MAP["wood"];

  return (
    <motion.div
      key="report"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex-1 flex flex-col min-h-0 w-full h-full"
    >
      <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-stone-200/60 mb-6 lg:ml-auto w-full lg:w-[max(280px,22vw)] shadow-sm shrink-0">
        <button
          onClick={() => setViewMode("similarity")}
          className={`flex-1 py-[max(0.6rem,1vh)] text-[max(11px,0.8vw)] font-bold rounded-full transition-all ${viewMode === "similarity" ? "bg-white text-stone-800 shadow-sm border border-stone-200/50" : "text-stone-400 hover:text-stone-600"}`}
        >
          유사도
        </button>
        <button
          onClick={() => setViewMode("synergy")}
          className={`flex-1 py-[max(0.6rem,1vh)] text-[max(11px,0.8vw)] font-bold rounded-full transition-all ${viewMode === "synergy" ? "bg-amber-500 text-white shadow-md" : "text-stone-400 hover:text-stone-600"}`}
        >
          궁합
        </button>
      </div>

      <div className="flex-1 bg-white/60 backdrop-blur-3xl border border-stone-200/60 rounded-[max(2.2rem,3vh)] shadow-lg overflow-hidden flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar p-[max(1.5rem,3vw)]">
          {viewMode === "similarity" ? (
            <div className="space-y-8">
              {comparisonData.map((data, i) => (
                <div
                  key={i}
                  className="flex flex-col text-left space-y-4 pb-8 border-b border-stone-200/50 last:border-0"
                >
                  <p className="text-[max(14px,1.1vw)] text-stone-800 font-medium leading-relaxed break-keep">
                    <span
                      className={`text-[max(11px,0.8vw)] font-black mr-2 font-space ${data.isMatch ? "text-amber-500" : "text-stone-300"}`}
                    >
                      Q{String(i + 1).padStart(2, "0")}.
                    </span>
                    {data.text}
                  </p>

                  {data.isMatch ? (
                    <div className="p-5 rounded-2xl text-[max(13px,1vw)] bg-amber-50 border border-amber-100/50 flex items-center justify-between font-bold text-amber-700">
                      <span>{data.myChoice}</span>
                      <span className="opacity-60 text-[max(10px,0.7vw)] uppercase tracking-widest text-amber-600">
                        🔗 Spectrum Matches
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl text-[max(11px,0.9vw)] bg-stone-50 border border-stone-100 flex flex-col gap-1 text-stone-600">
                        <span className="text-[max(9px,0.6vw)] text-stone-400 font-space uppercase">
                          My Light
                        </span>
                        {data.myChoice}
                      </div>
                      <div className="p-5 rounded-2xl text-[max(11px,0.9vw)] bg-stone-50 border border-stone-100 flex flex-col gap-1 text-stone-600">
                        <span className="text-[max(9px,0.6vw)] text-stone-400 font-space uppercase">
                          Target
                        </span>
                        {data.partnerChoice}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[550px] p-[max(2rem,3vw)] rounded-[2.5rem] bg-white/50 border border-stone-200/60 shadow-sm mb-12 backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
                <h4 className="text-[max(11px,0.8vw)] font-black text-amber-600 mb-8 uppercase tracking-[0.5em] text-center border-b border-amber-100/50 pb-4">
                  Destiny Pillars
                </h4>

                <div className="flex justify-around items-center px-4">
                  <div className="flex flex-col gap-[max(56px,7.5vh)] font-space font-black text-[max(10px,0.7vw)] text-stone-300 pt-10">
                    <span className="flex items-center">ME</span>
                    <span className="flex items-center text-amber-400">
                      TARGET
                    </span>
                  </div>

                  <div className="flex gap-[max(0.6rem,1vw)]">
                    {labels.map((l, idx) => {
                      const isDayMaster = idx === 2;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center gap-3"
                        >
                          <span className="text-[max(11px,0.8vw)] font-serif font-bold text-stone-400">
                            {l}
                          </span>

                          <div
                            className={`w-[max(44px,4.5vw)] py-4 rounded-2xl border ${isDayMaster ? "border-amber-200 bg-amber-50 shadow-sm" : "border-stone-200 bg-stone-50"} flex flex-col items-center gap-1`}
                          >
                            <span
                              className={`text-[max(1.2rem,1.8vw)] font-serif font-bold ${isDayMaster ? "text-amber-900" : "text-stone-800"}`}
                            >
                              {myOriginData?.pillars?.[idx]?.[0]}
                            </span>
                            <span
                              className={`text-[max(1.2rem,1.8vw)] font-serif font-bold ${isDayMaster ? "text-amber-700" : "text-stone-500"}`}
                            >
                              {myOriginData?.pillars?.[idx]?.[1]}
                            </span>
                          </div>

                          <div
                            className={`w-[max(44px,4.5vw)] py-4 rounded-2xl border ${isDayMaster ? "border-amber-200 bg-amber-50 shadow-sm" : "border-stone-200 bg-stone-50"} flex flex-col items-center gap-1`}
                          >
                            <span
                              className={`text-[max(1.2rem,1.8vw)] font-serif font-bold ${isDayMaster ? "text-amber-900" : "text-stone-800"}`}
                            >
                              {partnerOriginData?.pillars?.[idx]?.[0]}
                            </span>
                            <span
                              className={`text-[max(1.2rem,1.8vw)] font-serif font-bold ${isDayMaster ? "text-amber-700" : "text-stone-500"}`}
                            >
                              {partnerOriginData?.pillars?.[idx]?.[1]}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10 mb-12">
                <div
                  style={{ color: myTheme.text, backgroundColor: myTheme.bg }}
                  className={`w-[max(70px,6vw)] h-[max(70px,6vw)] rounded-full border shadow-sm flex items-center justify-center text-[max(1.8rem,2.5vw)] font-serif font-bold backdrop-blur-md transition-colors ${myTheme.border}`}
                >
                  {synergyData?.myDom?.hanja}
                </div>

                <div className="text-[max(2rem,3vw)] scale-110 drop-shadow-sm animate-pulse text-amber-400">
                  ✨
                </div>

                <div
                  style={{
                    color: partnerTheme.text,
                    backgroundColor: partnerTheme.bg,
                  }}
                  className={`w-[max(70px,6vw)] h-[max(70px,6vw)] rounded-full border shadow-sm flex items-center justify-center text-[max(1.8rem,2.5vw)] font-serif font-bold backdrop-blur-md transition-colors ${partnerTheme.border}`}
                >
                  {synergyData?.partnerDom?.hanja}
                </div>
              </div>

              <div className="max-w-[600px] w-full px-6 pb-12">
                <p className="text-[max(14px,1.1vw)] text-stone-600 leading-[1.9] break-keep font-medium whitespace-pre-wrap text-center italic">
                  {advancedReadingText}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
