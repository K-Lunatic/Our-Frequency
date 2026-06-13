import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface Props {
  typingCode: string;
  setTypingCode: (val: string) => void;
  handleMatch: () => void;
  error: string | null;
  toggleDevMode: () => void;
  developerMode: boolean;
  clickCount: number;
}

export default function SynergyInputBox({
  typingCode,
  setTypingCode,
  handleMatch,
  error,
  toggleDevMode,
  developerMode,
  clickCount,
}: Props) {
  return (
    <motion.div
      key="input-box"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="surface-glass p-5 sm:p-6 flex flex-col gap-4 shadow-sm relative overflow-hidden"
    >
      <div
        onClick={toggleDevMode}
        className="text-[11px] font-mono font-bold text-stone-400 tracking-wider uppercase select-none cursor-pointer flex items-center justify-between h-4"
      >
        <span>01. Connection Target</span>
        {developerMode ? (
          <span className="text-amber-500 font-extrabold text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/40 animate-pulse">
            DECODED
          </span>
        ) : (
          <span className="opacity-30 font-mono tracking-tighter text-[10px]">
            {clickCount > 0 ? "•".repeat(clickCount) : "READY"}
          </span>
        )}
      </div>
      <div className="relative flex flex-col">
        <input
          type="text"
          maxLength={6}
          value={typingCode}
          onChange={(e) =>
            setTypingCode(
              e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ""),
            )
          }
          placeholder="상대방 코드를 입력하세요"
          className="surface-input w-full font-mono text-center text-xl font-extrabold tracking-[0.25em] text-stone-800 uppercase h-13 placeholder:tracking-normal placeholder:font-sans placeholder:text-sm placeholder:font-medium placeholder:text-stone-300"
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold text-red-500 mt-1.5 pl-1 text-left"
          >
            {error}
          </motion.div>
        )}
      </div>

      <button
        onClick={handleMatch}
        className="btn-primary flex items-center justify-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-amber-100 fill-amber-100/20" />
        달빛 엮기
      </button>
    </motion.div>
  );
}
