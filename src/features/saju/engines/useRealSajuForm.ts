import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { calculateRealSaju } from '@/shared/utils/destinyEngine';
import { parseSajuData } from '@/features/saju/engines/sajuParser';
import { encodeSajuToDynamicHex } from '@/features/test/engines/reverseEngine';
import { useHexCompress } from '@/shared/hooks/useHexCompress';

export function useRealSajuForm() {
  const navigate = useNavigate();
  const { compress } = useHexCompress();

  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [birthTime, setBirthTime] = useState('12:00');
  const [isMale, setIsMale] = useState(true);
  
  // 💡 불필요한 isProcessing 상태 삭제

  const handleCalculate = () => {
    try {
      const [y, m, d] = birthDate.split('-').map(Number);
      const [h, min] = birthTime.split(':').map(Number);
      
      const baseResult = calculateRealSaju(new Date(y, m - 1, d, h, min));
      const guaranteedPillars = baseResult.pillars as [string, string, string, string];
      
      const parsedResult = parseSajuData(guaranteedPillars, isMale, 2026) as any;
      
      const scoreObj: any = { 
        wood: 0, fire: 0, earth: 0, metal: 0, water: 0,
        yin: 0, yang: 0, action: 0, receptivity: 0 
      };
      
      const elementMap: Record<string, string> = {
        '甲': 'wood', '乙': 'wood', '寅': 'wood', '卯': 'wood',
        '丙': 'fire', '丁': 'fire', '巳': 'fire', '午': 'fire',
        '戊': 'earth', '己': 'earth', '辰': 'earth', '戌': 'earth', '丑': 'earth', '未': 'earth',
        '庚': 'metal', '辛': 'metal', '申': 'metal', '酉': 'metal',
        '壬': 'water', '癸': 'water', '亥': 'water', '子': 'water'
      };
      
      baseResult.pillars.join('').split('').forEach((char: string) => {
        const mappedKey = elementMap[char];
        if (mappedKey) scoreObj[mappedKey] = (scoreObj[mappedKey] as number) + 1;
      });

      const yy = parsedResult.analytics.elements.yinYang || { "+": 0, "-": 0 };
      scoreObj.yang = yy["+"];
      scoreObj.yin = yy["-"];

      const ts = parsedResult.analytics.tenGods.summary || {}; 
      scoreObj.action = (ts['비견'] || 0) + (ts['겁재'] || 0) + (ts['식신'] || 0) + (ts['상관'] || 0) + (ts['편관'] || 0);
      scoreObj.receptivity = (ts['정인'] || 0) + (ts['편인'] || 0) + (ts['정관'] || 0) + (ts['정재'] || 0);

      // 💡 setTimeout 없이 즉시 인코딩 후 라우팅
      const hexCode = encodeSajuToDynamicHex(scoreObj, compress);
      localStorage.setItem('user_frequency_code', hexCode);
      navigate('/result', { state: { userCode: hexCode }, replace: true });

    } catch (error) {
      console.error("Decoding Error:", error);
    }
  };

  return {
    birthDate, setBirthDate,
    birthTime, setBirthTime,
    isMale, setIsMale,
    handleCalculate
  };
}