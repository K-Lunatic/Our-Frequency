import { motion } from "framer-motion";

interface Props {
  birthDate: string;
  setBirthDate: (val: string) => void;
  birthTime: string;
  setBirthTime: (val: string) => void;
  isMale: boolean;
  setIsMale: (val: boolean) => void;
  onCalculate: () => void;
}

export default function RealSajuInputForm({
  birthDate,
  setBirthDate,
  birthTime,
  setBirthTime,
  isMale,
  setIsMale,
  onCalculate,
}: Props) {
  return (
    <motion.div
      key="input"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full max-w-[360px] z-10"
    >
      <header className="text-center mb-6">
        <span className="text-subtitle mb-2">Master Orbit</span>
        <h1 className="text-hero">정확한 시공간의 기록</h1>
      </header>

      <div className="surface-card gap-5 shadow-md">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-400 tracking-wider uppercase">
            01. Gender
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsMale(true)}
              className={`h-11 rounded-xl text-sm font-semibold transition-all border ${
                isMale
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
              }`}
            >
              남성
            </button>
            <button
              type="button"
              onClick={() => setIsMale(false)}
              className={`h-11 rounded-xl text-sm font-semibold transition-all border ${
                !isMale
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
              }`}
            >
              여성
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-400 tracking-wider uppercase">
            02. Birth Date
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="surface-input w-full font-medium text-stone-700"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-stone-400 tracking-wider uppercase">
            03. Birth Time
          </label>
          <input
            type="time"
            value={birthTime}
            onChange={(e) => setBirthTime(e.target.value)}
            className="surface-input w-full font-medium text-stone-700"
          />
        </div>

        <button onClick={onCalculate} className="btn-primary mt-2">
          Decode
        </button>
      </div>
    </motion.div>
  );
}