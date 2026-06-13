import { useEffect, useMemo, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { domToPng } from 'modern-screenshot';

import { useHexCompress } from '@/shared/hooks/useHexCompress';
import { calculatePerfectSajuOrigin } from '@/shared/utils/destinyEngine'; 
import { generateMoonlightNarrative } from '@/features/result/engines/tongbyeonEngine'; 

export function useResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { decompress, getElementScores } = useHexCompress();
  
  const captureRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [stageSize, setStageSize] = useState({ w: 300, h: 200 }); 
  
  useEffect(() => {
    const calculateSize = () => {
      const isDesktop = window.innerWidth >= 1024;
      const isTablet = window.innerWidth >= 768;
      const maxWidth = isDesktop ? 650 : isTablet ? 380 : window.innerWidth - 80;
      const maxHeight = isDesktop ? 240 : 180;
      setStageSize({ w: maxWidth, h: maxHeight });
    };
    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, []);

  const userCode = useMemo(() => location.state?.userCode || localStorage.getItem('user_frequency_code'), [location.state]);
  
  useEffect(() => { 
    if (!userCode) navigate('/', { replace: true }); 
  }, [userCode, navigate]);

  const scores: any = useMemo(() => {
    if (!userCode) return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0, yin: 0, yang: 0, action: 0, receptivity: 0 };
    return getElementScores(decompress(userCode));
  }, [userCode, decompress, getElementScores]);

  const originData = useMemo(() => userCode && scores ? calculatePerfectSajuOrigin(scores) : null, [userCode, scores]);
  const { persona, narratives } = useMemo(() => originData?.analysis ? generateMoonlightNarrative(originData.analysis) : { persona: null, narratives: null }, [originData]);

  const assembledScores = useMemo(() => {
    if (!originData?.analysis) return [];
    const { elements: { distribution, yinYang }, tenGods: { summary } } = originData.analysis.analytics;
    const getCount = (id: string) => distribution.find((e: any) => e.id === id)?.count || 0;
    return [
      getCount('wood'), getCount('fire'), getCount('earth'), getCount('metal'), getCount('water'),
      yinYang?.['-'] || 0, yinYang?.['+'] || 0,
      (summary['비견']||0) + (summary['식신']||0) + (summary['상관']||0) + (summary['편관']||0),
      (summary['정인']||0) + (summary['편인']||0) + (summary['정관']||0) + (summary['정재']||0)
    ];
  }, [originData]);

  const handleSaveImage = async () => {
    if (!captureRef.current) return;
    setIsExporting(true); 
    try {
      await document.fonts.ready;
      const dataUrl = await domToPng(captureRef.current, { scale: 3, backgroundColor: '#FCFBFA', style: { transform: 'scale(1)', margin: '0', padding: '0' } });
      const link = document.createElement('a'); link.href = dataUrl; link.download = `Moonlight-${userCode}.png`; link.click();
    } catch (err) { console.error('Image export failed:', err); } finally { setIsExporting(false); }
  };

  const handleShare = async () => {
    const shareData = { title: 'Moonlight Garden', text: `나의 달빛 파동은 [${userCode}]야! 너의 본질과 대조해봐 🌙`, url: `${window.location.origin}/synergy?target=${userCode}` };
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await navigator.clipboard.writeText(`${shareData.text} \n${shareData.url}`); alert('공유 링크 복사 완료.'); }
    } catch (err) { console.error(err); }
  };

  const yinRatio = originData?.analysis.analytics.elements?.yinYang?.['-'] ?? 0;
  const yangRatio = originData?.analysis.analytics.elements?.yinYang?.['+'] ?? 0;
  const specialStars = originData?.analysis.analytics.specialStars ?? [];

  return {
    navigate, captureRef, isExporting, stageSize,
    userCode, scores, originData, persona, narratives,
    assembledScores, yinRatio, yangRatio, specialStars,
    handleSaveImage, handleShare
  };
}