import { motion } from "framer-motion";
import WaveCanvas from "@/shared/visual/WaveCanvas";
import RadarChart from "@/shared/visual/RadarChart";

interface Props {
  stageSize: { w: number; h: number };
  scores: any;
  assembledScores: number[];
  originData: any;
  yinRatio: number;
  yangRatio: number;
}

export default function CoreAnalyticsBento({
  stageSize,
  scores,
  assembledScores,
  originData,
  yinRatio,
  yangRatio,
}: Props) {
  const { elements, tenGods } = originData.analysis.analytics;

  const CORE_STATS = [
    {
      id: "dominant",
      label: "DOMINANT",
      value: (
        tenGods.matrix.monthBranch.name ||
        tenGods.dominant[0]?.name ||
        "비견"
      ).split(" ")[0],
      bg: "bg-amber-50 border-amber-200/60",
      labelClass:
        "text-[10px] font-bold text-amber-500 font-mono tracking-wider",
      valClass: "text-lg font-black text-amber-900 mt-1",
    },
    {
      id: "core",
      label: "CORE",
      value: (elements?.distribution?.[0] || { name: "Unknown" }).name.split(
        " ",
      )[0],
      bg: "bg-stone-50 border-stone-200/60",
      labelClass: "text-[10px] font-bold text-stone-400 tracking-widest",
      valClass: "text-lg font-extrabold text-stone-700",
    },
  ];

  return (
    <section className="w-full flex flex-col gap-5 z-10 relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="surface-card w-full flex flex-col items-center"
      >
        <div className="w-full flex items-center justify-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-subtitle !mb-0">Frequency Wave</span>
        </div>
        <div
          style={{ width: stageSize.w, height: stageSize.h }}
          className="flex items-center justify-center overflow-hidden relative"
        >
          <WaveCanvas
            myScores={scores}
            partnerScores={null}
            width={stageSize.w}
            height={stageSize.h}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="surface-card w-full flex flex-col items-center"
      >
        <span className="text-subtitle mb-2 text-center">Element Balance</span>
        <div className="w-full max-w-[320px] flex items-center justify-center pt-6 pb-2 relative">
          <RadarChart
            scores={assembledScores}
            colors={originData.chartData.colors}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="surface-card w-full flex flex-col justify-between"
      >
        <span className="text-subtitle mb-5 text-center">Core Analytics</span>

        <div className="w-full max-w-[420px] mx-auto flex flex-col gap-4">
          <div className="w-full p-4 rounded-xl bg-stone-50/50 border border-stone-200/40 flex flex-col items-center">
            <div className="text-[10px] font-bold text-stone-400 font-mono tracking-widest uppercase mb-3">
              HEX PILLARS
            </div>
            <div className="flex justify-center gap-3 sm:gap-5 w-full px-1">
              {(originData?.pillars || []).map((p: string, i: number) => (
                <div
                  key={i}
                  className="flex flex-col items-center w-11 sm:w-12 py-2 rounded-lg bg-white border border-stone-200/50 shadow-inner leading-snug"
                >
                  <span className="text-sm font-extrabold text-stone-800">
                    {p?.[0] ?? "?"}
                  </span>
                  <span className="text-sm font-extrabold text-stone-500 mt-0.5">
                    {p?.[1] ?? "?"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full">
            {CORE_STATS.map((stat) => (
              <div
                key={stat.id}
                className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${stat.bg}`}
              >
                <div className={stat.labelClass}>{stat.label}</div>
                <div className={stat.valClass}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="w-full flex flex-col gap-2 mt-2">
            <div className="flex justify-between text-[11px] font-mono font-bold px-0.5">
              <span className="text-stone-400 uppercase tracking-wider">
                YIN {yinRatio}%
              </span>
              <span className="text-amber-500 uppercase tracking-wider">
                YANG {yangRatio}%
              </span>
            </div>
            <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden flex relative border border-stone-200/20">
              <div
                style={{
                  width: `${(yinRatio / (yinRatio + yangRatio)) * 100}%`,
                }}
                className="h-full bg-stone-400 transition-all duration-500"
              />
              <div
                style={{
                  width: `${(yangRatio / (yinRatio + yangRatio)) * 100}%`,
                }}
                className="h-full bg-amber-400 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
