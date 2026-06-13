// src/utils/analyzers/sajuParser.ts

import { analyzeElements } from './elementAnalyzer';
import { analyzeTenGods } from './tenGodsAnalyzer';
import { analyzeSpecialStars } from './specialStarsAnalyzer';
import { analyzeFortune } from './fortuneAnalyzer';
import { generateDetailedReport } from '@/features/result/engines/tongbyeonEngine';

export function parseSajuData(
  pillars: [string, string, string, string],
  isMale: boolean = true, 
  targetYear: number = new Date().getFullYear()
): SajuAnalysis {
  const yearStem = pillars[0][0];      
  const monthPillar = pillars[1];      
  const dayMaster = pillars[2][0];     

  const elementsData = analyzeElements(pillars);
  const tenGodsData = analyzeTenGods(pillars);
  const specialStarsData = analyzeSpecialStars(pillars, dayMaster);
  const fortuneData = analyzeFortune(dayMaster, yearStem, monthPillar, isMale, targetYear);

  const analysisResult: SajuAnalysis = {
    pillars: pillars,
    analytics: {
      elements: elementsData,
      tenGods: tenGodsData as any, 
      specialStars: specialStarsData,
      fortune: fortuneData
    }
  };
  (analysisResult as any).report = generateDetailedReport(analysisResult);
  return analysisResult;
}