import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface RadarChartProps {
  scores: number[];
  colors?: string[];
}

const LIGHT_COLORS = [
  '#5C7C59', // 木
  '#E07A5F', // 火
  '#D97706', // 土
  '#78716C', // 金
  '#4F6D7A'  // 水
];

export default function RadarChart({ scores }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const elementsData = scores.slice(0, 5);
  
  const yin = scores[5] || 0;
  const yang = scores[6] || 0;
  const action = scores[7] || 0;
  const receptivity = scores[8] || 0;

  const yinYangTotal = yin + yang || 1;
  const actionReceptTotal = action + receptivity || 1;
  
  const yangPercent = (yang / yinYangTotal) * 100;
  const actionPercent = (action / actionReceptTotal) * 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = window.devicePixelRatio || 1;
    const SIZE = 800; 
    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;
    ctx.scale(DPR, DPR);

    const cx = SIZE / 2; 
    const cy = SIZE / 2; 
    const maxR = SIZE * 0.32; 
    const angleStep = (Math.PI * 2) / 5; 

    ctx.clearRect(0, 0, SIZE, SIZE);
    
    const maxScore = Math.max(...elementsData, 4);

    ctx.strokeStyle = 'rgba(120, 113, 108, 0.15)'; 
    ctx.lineWidth = 1.5; 

    for (let r = 1; r <= 4; r++) {
      ctx.beginPath();
      const currentR = maxR * (r / 4);
      for (let i = 0; i < 5; i++) {
        const angle = i * angleStep - Math.PI / 2; 
        const x = cx + Math.cos(angle) * currentR;
        const y = cy + Math.sin(angle) * currentR;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    }

    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = i * angleStep - Math.PI / 2;
      const x = cx + Math.cos(angle) * maxR;
      const y = cy + Math.sin(angle) * maxR;
      ctx.moveTo(cx, cy);
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = 'rgba(120, 113, 108, 0.1)';
    ctx.stroke();

    ctx.beginPath();
    ctx.lineWidth = 3; 
    ctx.lineJoin = 'round';
    
    elementsData.forEach((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const currentR = maxR * (score / maxScore);
      const x = cx + Math.cos(angle) * currentR;
      const y = cy + Math.sin(angle) * currentR;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();

    ctx.fillStyle = 'rgba(217, 119, 6, 0.08)'; 
    ctx.fill();
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.6)'; 
    ctx.stroke();

    const hanjaArr = ['木', '火', '土', '金', '水'];
    const labelArr = ['WOOD', 'FIRE', 'EARTH', 'METAL', 'WATER'];

    elementsData.forEach((score, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const currentR = maxR * (score / maxScore);
      const labelR = maxR + 85; 
      
      const px = cx + Math.cos(angle) * currentR;
      const py = cy + Math.sin(angle) * currentR;
      const lx = cx + Math.cos(angle) * labelR;
      const ly = cy + Math.sin(angle) * labelR;

      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2); 
      ctx.fillStyle = LIGHT_COLORS[i];
      ctx.fill();
      
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.shadowBlur = 0; 

      ctx.font = 'bold 48px "Noto Serif KR", serif';
      ctx.fillStyle = LIGHT_COLORS[i];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle'; 
      ctx.fillText(hanjaArr[i], lx, ly - 16);
      
      ctx.font = 'bold 22px "Space Mono", monospace';
      ctx.fillStyle = 'rgba(120, 113, 108, 0.5)';
      ctx.fillText(labelArr[i], lx, ly + 24);
    });

  }, [elementsData]);

  return (
    <div className="w-full bg-white border border-stone-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col gap-8">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.85, filter: 'blur(4px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full aspect-square max-w-[320px] mx-auto flex items-center justify-center"
      >
        <canvas 
          ref={canvasRef} 
          style={{ width: '100%', height: '100%' }}
          className="block drop-shadow-[0_4px_12px_rgba(0,0,0,0.03)] object-contain"
        />
      </motion.div>

      <div className="flex flex-col gap-5 pt-6 border-t border-stone-100">
        <h3 className="text-center text-[11px] font-black text-stone-400 uppercase tracking-[0.4em] mb-2">
          Core Tendency
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-stone-500">음 (Yin) <span className="font-normal text-stone-400 ml-1">{yin}</span></span>
            <span className="text-amber-600"><span className="font-normal text-amber-400/80 mr-1">{yang}</span> 양 (Yang)</span>
          </div>
          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${100 - yangPercent}%` }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-stone-300"
            />
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${yangPercent}%` }} 
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-amber-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-[12px] font-bold">
            <span className="text-stone-500">수용성 <span className="font-normal text-stone-400 ml-1">{receptivity}</span></span>
            <span className="text-amber-600"><span className="font-normal text-amber-400/80 mr-1">{action}</span> 행동력</span>
          </div>
          <div className="h-3 w-full bg-stone-100 rounded-full overflow-hidden flex shadow-inner">
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${100 - actionPercent}%` }} 
              transition={{ duration: 1, delay: 0.4 }}
              className="h-full bg-stone-300"
            />
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${actionPercent}%` }} 
              transition={{ duration: 1, delay: 0.4 }}
              className="h-full bg-amber-400"
            />
          </div>
        </div>

      </div>
    </div>
  );
}