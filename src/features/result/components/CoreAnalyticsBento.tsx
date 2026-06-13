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
      labelClass: "text-[10px] font-bold text-amber-500 tracking-widest",
      valClass: "text-lg font-extrabold text-amber-700",
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
    <section className="grid grid-cols-4 gap-4 w-full max-w-[650px] mx-auto my-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="surface-card col-span-4 min-h-[220px]"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-subtitle">Frequency Wave</span>
        </div>
        <div className="flex-1 w-full flex items-center justify-center overflow-hidden rounded-xl">
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
        className="surface-card col-span-2 min-h-[280px]"
      >
        <span className="text-subtitle text-center w-full mb-4">
          Element Balance
        </span>
        <div className="flex-1 w-full flex items-center justify-center">
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
        className="surface-card col-span-2 justify-between min-h-[280px]"
      >
        <span className="text-subtitle text-center w-full mb-3">
          Core Analytics
        </span>

        <div className="flex flex-col gap-2 flex-1">
          <div className="bg-stone-50 border border-stone-100 rounded-xl p-3 flex flex-col items-center">
            <div className="text-[10px] font-bold text-stone-400 tracking-widest">
              HEX PILLARS
            </div>
            <div className="w-8 h-[1px] bg-stone-200 my-2" />
            <div className="flex gap-4 justify-center w-full">
              {(originData?.pillars || []).map((p: string, i: number) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-sm font-extrabold text-stone-700">
                    {p?.[0] ?? "?"}
                  </span>
                  <span className="text-[11px] font-medium text-stone-500 mt-0.5">
                    {p?.[1] ?? "?"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {CORE_STATS.map((stat) => (
              <div
                key={stat.id}
                className={`rounded-xl p-3 border flex flex-col items-center justify-center ${stat.bg}`}
              >
                <div className={stat.labelClass}>{stat.label}</div>
                <div className={stat.valClass}>{stat.value}</div>
              </div>
            ))}
          </div>

          <div className="mt-2 px-1">
            <div className="flex justify-between text-[10px] font-bold mb-1.5 uppercase tracking-widest">
              <span className="text-amber-600">YIN {yinRatio}</span>
              <span className="text-stone-500">YANG {yangRatio}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-stone-100 flex overflow-hidden">
              <div
                style={{
                  width: `${(yinRatio / (yinRatio + yangRatio)) * 100}%`,
                }}
                className="bg-amber-400 h-full transition-all duration-700"
              />
              <div
                style={{
                  width: `${(yangRatio / (yinRatio + yangRatio)) * 100}%`,
                }}
                className="bg-stone-300 h-full transition-all duration-700"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
