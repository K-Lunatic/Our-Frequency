import { motion } from "framer-motion";

const DEBUG_CONFIG = [
  { label: "POLARITY", key: "gender", textColor: "text-stone-600" },
  {
    label: "DAY MASTER",
    key: "dayMaster",
    textColor: "text-emerald-600 font-bold",
  },
  {
    label: "HEX PILLARS",
    key: "pillars",
    textColor: "text-stone-700 font-bold tracking-widest",
  },
  { label: "YIN / YANG", key: "yinYang", textColor: "text-stone-400" },
  { label: "ELEMENTS", key: "elements", textColor: "text-cyan-600 font-bold" },
  { label: "DOMINANT", key: "dominant", textColor: "text-amber-600 font-bold" },
  {
    label: "SP. STARS",
    key: "specialStars",
    textColor: "text-purple-600 font-bold",
  },
  { label: "2026 ORBIT", key: "orbit2026", textColor: "text-stone-400/70" },
] as const;

export default function SynergyDebugPanel({
  masterDebugData,
}: {
  masterDebugData: any;
}) {
  if (!masterDebugData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="surface-glass overflow-hidden shadow-md my-4 w-full max-w-[340px] mx-auto"
    >
      <div className="flex items-center justify-between px-4 py-3 bg-stone-50/60 border-b border-stone-200/40 text-[10px] font-mono tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="font-bold text-stone-700">MASTER DECODER v3.1</span>
        </div>
        <span className="text-stone-400 opacity-80">ENCRYPTION: AES-256</span>
      </div>

      <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-stone-100/30 border-b border-stone-200/20 font-mono text-[10px] font-bold text-stone-400 tracking-tight">
        <span>SYSTEM_PARAM</span>
        <span className="text-right text-amber-600/80">LOCAL_ME</span>
        <span className="text-right text-stone-500">REMOTE_TARGET</span>
      </div>

      <div className="flex flex-col divide-y divide-stone-100/60 bg-white/30 font-mono text-[11px]">
        {DEBUG_CONFIG.map(({ label, key, textColor }) => (
          <div
            key={key}
            className="grid grid-cols-3 gap-2 px-4 py-2.5 items-center"
          >
            <span className="text-stone-400 font-medium tracking-tight">
              {label}
            </span>
            <span className={`text-right ${textColor}`}>
              {masterDebugData.me[key as keyof typeof masterDebugData.me]}
            </span>
            <span className={`text-right ${textColor}`}>
              {
                masterDebugData.target[
                  key as keyof typeof masterDebugData.target
                ]
              }
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-stone-50/60 border-t border-stone-200/40 flex flex-col gap-1.5 font-mono text-[11px] text-stone-500">
        <div className="flex justify-between items-center">
          <span className="text-stone-400">Algorithm_Type</span>
          <span className="text-amber-600 font-bold">
            [{masterDebugData.algo.type}]
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-stone-400">Raw_Synergy_Score</span>
          <span className="text-stone-800 font-extrabold text-sm tracking-tight">
            {masterDebugData.algo.baseScore}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
