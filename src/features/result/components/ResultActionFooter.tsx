import { Download, Share2, Heart } from "lucide-react";

interface Props {
  isExporting: boolean;
  onSave: () => void;
  onShare: () => void;
  onSynergy: () => void;
}

export default function ResultActionFooter({
  isExporting,
  onSave,
  onShare,
  onSynergy,
}: Props) {
  const ACTION_BUTTONS = [
    {
      id: "save",
      label: isExporting ? "저장 중..." : "결과 저장하기",
      icon: Download,
      onClick: onSave,
      disabled: isExporting,
      btnClass: "btn-primary",
      iconClass: "w-4 h-4 mr-2",
    },
    {
      id: "share",
      label: "공유하기",
      icon: Share2,
      onClick: onShare,
      btnClass: "btn-secondary",
      iconClass: "w-4 h-4 mr-2 text-stone-500",
    },
    {
      id: "synergy",
      label: "궁합 보기",
      icon: Heart,
      onClick: onSynergy,
      btnClass: "btn-secondary",
      iconClass: "w-4 h-4 mr-2 text-rose-400",
    },
  ];

  return (
    <footer className="fixed bottom-0 inset-x-0 bg-white/70 backdrop-blur-lg border-t border-stone-200/60 p-4 z-30 flex justify-center">
      <div className="w-full max-w-[650px]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
          {ACTION_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              onClick={btn.onClick}
              disabled={btn.disabled}
              className={btn.btnClass}
            >
              <btn.icon className={btn.iconClass} />
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
