import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useHexCompress } from '@/shared/hooks/useHexCompress';
import { calculateElementalSynergy, calculatePerfectSajuOrigin } from '@/shared/utils/destinyEngine';
import { generateAdvancedReading } from '@/features/synergy/engines/synergyAnalyzer'; 
import { parseSajuData } from '@/features/saju/engines/sajuParser';
import masterDB from '@/shared/data/questions_db.json';

export function useSynergy() {
  const [searchParams] = useSearchParams();
  const { decompress, getElementScores } = useHexCompress();
  const questions = masterDB.questions as unknown as Question[];

  const urlTargetCode = useMemo(() => searchParams.get('target')?.toUpperCase().replace(/[^0-9A-F]/g, '') || "", [searchParams]);

  const [typingCode, setTypingCode] = useState(urlTargetCode);
  const [viewMode, setViewMode] = useState<'similarity' | 'synergy'>('similarity');
  const [error, setError] = useState<string | null>(null);
  const [isMatched, setIsMatched] = useState(urlTargetCode.length === 6);
  
  const [activePartnerScores, setActivePartnerScores] = useState<any | null>(() => {
    if (urlTargetCode.length === 6) return getElementScores(decompress(urlTargetCode));
    return null;
  });

  const [developerMode, setDeveloperMode] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  const myCode = useMemo(() => localStorage.getItem('user_frequency_code'), []);
  const myScores = useMemo(() => myCode ? getElementScores(decompress(myCode)) : null, [myCode, decompress, getElementScores]);
  const isMyYangPolarity = useMemo(() => myScores ? (myScores.wood + myScores.fire) >= (myScores.metal + myScores.water) : true, [myScores]);
  const myOriginData = useMemo(() => myScores ? calculatePerfectSajuOrigin(myScores) : null, [myScores]);
  const myParsedSaju = useMemo(() => myOriginData ? parseSajuData(myOriginData.pillars as [string, string, string, string], isMyYangPolarity, 2026) : null, [myOriginData, isMyYangPolarity]);

  const isPartnerYangPolarity = useMemo(() => activePartnerScores ? (activePartnerScores.wood + activePartnerScores.fire) >= (activePartnerScores.metal + activePartnerScores.water) : true, [activePartnerScores]);
  const partnerOriginData = useMemo(() => isMatched && activePartnerScores ? calculatePerfectSajuOrigin(activePartnerScores) : null, [isMatched, activePartnerScores]);
  const partnerParsedSaju = useMemo(() => partnerOriginData ? parseSajuData(partnerOriginData.pillars as [string, string, string, string], isPartnerYangPolarity, 2026) : null, [partnerOriginData, isPartnerYangPolarity]);

  const comparisonData = useMemo(() => {
    if (!isMatched || !myCode || !typingCode) return [];
    const myBits = decompress(myCode);
    const partnerBits = decompress(typingCode);
    return questions.map((q, idx) => ({
      text: q.text,
      myChoice: q.options.find(opt => opt.value === myBits[idx])?.label || "",
      partnerChoice: q.options.find(opt => opt.value === partnerBits[idx])?.label || "",
      isMatch: myBits[idx] === partnerBits[idx]
    }));
  }, [isMatched, myCode, typingCode, decompress, questions]);

  const syncRate = useMemo(() => isMatched ? Math.round((comparisonData.filter(d => d.isMatch).length / 24) * 100) : 0, [isMatched, comparisonData]);

  const synergyData = useMemo(() => {
    if (!isMatched || !myScores || !activePartnerScores) return null;
    return calculateElementalSynergy(myScores, activePartnerScores);
  }, [isMatched, myScores, activePartnerScores]);

  const advancedReadingText = useMemo(() => {
    if (!synergyData || syncRate === undefined) return "";
    return generateAdvancedReading({ syncRate, synergyType: synergyData.synergyType, myDomName: synergyData.myDom.name, partnerDomName: synergyData.partnerDom.name });
  }, [synergyData, syncRate]);

  const masterDebugData = useMemo(() => {
    if (!isMatched || !typingCode || !activePartnerScores || !partnerParsedSaju || !myParsedSaju || !synergyData) return null;
    const formatScores = (s: any) => `木${s.wood} 火${s.fire} 土${s.earth} 金${s.metal} 水${s.water}`;
    const getSafeYinYang = (saju: any) => `${saju?.analytics.elements.yinYang?.['+'] ?? 0} : ${saju?.analytics.elements.yinYang?.['-'] ?? 0}`;
    return {
      me: { 
        gender: isMyYangPolarity ? "남성(+)" : "여성(-)", 
        dayMaster: myOriginData?.pillars[2]?.[0] || '?', pillars: myOriginData?.pillars?.join(''), 
        yinYang: getSafeYinYang(myParsedSaju), elements: formatScores(myScores!),
        dominant: myParsedSaju.analytics.tenGods.dominant?.map(g => g.name.split(' ')[0]).join(', ') || 'NONE',
        specialStars: myParsedSaju.analytics.specialStars?.map(s => s.name.split(' ')[0]).join(', ') || 'NONE',
        orbit2026: myParsedSaju.analytics.fortune?.yearly?.pillar || '?'
      },
      target: { 
        gender: isPartnerYangPolarity ? "남성(+)" : "여성(-)", 
        dayMaster: partnerOriginData?.pillars[2]?.[0] || '?', pillars: partnerOriginData?.pillars?.join(''), 
        yinYang: getSafeYinYang(partnerParsedSaju), elements: formatScores(activePartnerScores),
        dominant: partnerParsedSaju.analytics.tenGods.dominant?.map(g => g.name.split(' ')[0]).join(', ') || 'NONE',
        specialStars: partnerParsedSaju.analytics.specialStars?.map(s => s.name.split(' ')[0]).join(', ') || 'NONE',
        orbit2026: partnerParsedSaju.analytics.fortune?.yearly?.pillar || '?'
      },
      algo: { type: synergyData.synergyType, baseScore: synergyData.score }
    };
  }, [isMatched, typingCode, activePartnerScores, partnerParsedSaju, myParsedSaju, isMyYangPolarity, isPartnerYangPolarity, myOriginData, partnerOriginData, myScores, synergyData]);

  const handleMatch = () => {
    if (typingCode.length === 6) { 
      setError(null); setActivePartnerScores(getElementScores(decompress(typingCode))); setIsMatched(true); 
    } else { 
      setError("6자리 코드를 확인해주세요."); setTimeout(() => setError(null), 2000); 
    }
  };
  const handleReset = () => { setIsMatched(false); setTypingCode(""); setActivePartnerScores(null); };
  const toggleDevMode = () => setClickCount(p => (p + 1 >= 5 ? (setDeveloperMode(!developerMode), 0) : p + 1));

  return {
    myCode, myScores, typingCode, setTypingCode, viewMode, setViewMode, error, isMatched, activePartnerScores,
    developerMode, clickCount, comparisonData, syncRate, synergyData, advancedReadingText, 
    myParsedSaju, partnerParsedSaju, masterDebugData, handleMatch, handleReset, toggleDevMode
  };
}