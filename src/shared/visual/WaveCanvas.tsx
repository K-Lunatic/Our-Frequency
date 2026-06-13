// src/components/wave/WaveCanvas.tsx
import { useEffect, useRef, memo } from 'react';

interface WaveProps {
  myScores: ElementScores;
  partnerScores: ElementScores | null; 
  width: number;
  height: number;
}

const getDominantColor = (scores: ElementScores): string => {
  const elements = [
    { name: 'wood', value: scores.wood, color: '#5C7C59' }, 
    { name: 'fire', value: scores.fire, color: '#E07A5F' },
    { name: 'earth', value: scores.earth, color: '#D97706' },
    { name: 'metal', value: scores.metal, color: '#78716C' },
    { name: 'water', value: scores.water, color: '#4F6D7A' }
  ];
  elements.sort((a, b) => b.value - a.value);
  return elements[0].color;
};

const WaveCanvas = memo(({ myScores, partnerScores, width, height }: WaveProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const timeRef = useRef(0);
  const partnerAlphaRef = useRef(0);
  const prevPartnerRef = useRef<ElementScores | null>(null);

  useEffect(() => {
    if (partnerScores) prevPartnerRef.current = partnerScores;
  }, [partnerScores]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const drawMoonlight = (scores: ElementScores, color: string, alphaMult: number, w: number, h: number, cy: number, phaseOffset: number = 0) => {
      
      const weight = (s: number) => {
        const normalized = s / 15;
        return 0.6 + Math.min(normalized, 1.2); 
      };
      
      const baseAmp = (h * 0.22) * weight(scores.fire);     
      const baseFreq = 0.008 * weight(scores.wood);          
      const baseSpeed = 0.01 * weight(scores.metal);       
      const swirl = 1.2 * weight(scores.water);
      const thickness = 1 + Math.min(scores.earth * 0.1, 1.5);

      ctx.save();
      
      const layers = [
        { a: baseAmp, f: baseFreq, p: timeRef.current + phaseOffset, lw: 14 * thickness, alpha: 0.08 * alphaMult, stroke: color },
        { a: baseAmp * 0.95, f: baseFreq * 1.05, p: timeRef.current * 0.9 + phaseOffset, lw: 6 * thickness, alpha: 0.25 * alphaMult, stroke: color },
        { a: baseAmp * 1.05, f: baseFreq * 0.95, p: timeRef.current * 1.1 + phaseOffset, lw: 1.5 * thickness, alpha: 0.8 * alphaMult, stroke: color }
      ];

      ctx.globalCompositeOperation = 'multiply';

      layers.forEach((layer) => {
        ctx.beginPath();
        ctx.lineWidth = layer.lw;
        ctx.strokeStyle = layer.stroke;
        ctx.globalAlpha = layer.alpha;
        
        ctx.shadowBlur = 2;
        ctx.shadowColor = layer.stroke;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(0, cy);

        for (let x = 0; x <= w; x += 2) {
          const damping = Math.sin((x / w) * Math.PI); 
          let y = Math.sin(x * layer.f + layer.p) * layer.a;
          y += Math.sin(x * 0.02 + timeRef.current * 1.2) * (swirl * damping * 3); 
          
          ctx.lineTo(x, cy + (y * damping));
        }
        ctx.stroke();
      });
      ctx.restore();
      
      return baseSpeed;
    };

    const render = () => {
      const centerY = height / 2;
      ctx.clearRect(0, 0, width, height);
      
      const myColor = getDominantColor(myScores);
      const mySpeed = drawMoonlight(myScores, myColor, 1, width, height, centerY, 0);

      if (partnerScores) {
        partnerAlphaRef.current = Math.min(partnerAlphaRef.current + 0.01, 1);
      } else {
        partnerAlphaRef.current = Math.max(partnerAlphaRef.current - 0.02, 0);
      }

      if (partnerAlphaRef.current > 0) {
        const targetScores = partnerScores || prevPartnerRef.current;
        if (targetScores) {
          const partnerColor = getDominantColor(targetScores);
          drawMoonlight(targetScores, partnerColor, partnerAlphaRef.current, width, height, centerY, Math.PI);
        }
      }

      timeRef.current += mySpeed;
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  }, [myScores, partnerScores, width, height]);

  return (
    <canvas 
      ref={canvasRef} 
      className="block pointer-events-none touch-none" 
      style={{ backfaceVisibility: 'hidden' }} 
    />
  );
});

WaveCanvas.displayName = 'WaveCanvas';
export default WaveCanvas;