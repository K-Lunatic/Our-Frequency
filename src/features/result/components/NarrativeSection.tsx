import { motion } from "framer-motion";

interface Props {
  narratives: { id: string; subtitle: string; content: string }[];
}

export default function NarrativeSection({ narratives }: Props) {
  return (
    <div className="w-full max-w-[650px] mx-auto my-12 z-10 relative">
      <div className="text-center mb-8">
        <h2 className="text-hero mb-2">당신의 이야기</h2>
        <p className="text-[13px] font-medium text-stone-500">
          밤하늘에 쓰여진 내면의 기록
        </p>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        {narratives.map((chapter, index) => (
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            key={chapter.id}
            className="surface-card flex flex-col h-full"
          >
            <h3 className="text-subtitle mb-3">{chapter.subtitle}</h3>

            <h4 className="text-[1.05rem] font-bold text-stone-800 mb-2 leading-snug">
              {chapter.content.split("\n")[0]}
            </h4>
            <p className="text-[13px] text-stone-600 leading-relaxed whitespace-pre-line flex-1">
              {chapter.content.split("\n").slice(1).join("\n").trim()}
            </p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}