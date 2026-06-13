import masterDB from '@/shared/data/tongbyeon_db.json';

const db = masterDB.advanced;

export function generateMoonlightNarrative(analysis: SajuAnalysis) {
  const { pillars, analytics } = analysis;
  const dayPillar = pillars[2];
  const dayMaster = pillars[2][0];

  const coreData = (db["1_day_pillar_theory"][dayPillar as keyof typeof db["1_day_pillar_theory"]] as { title: string; core: string }) || 
                   { title: "신비로운 궤적의 달빛", core: "당신의 내면에는 고요하지만 강력한 주파수가 흐르고 있습니다." };

  const dominantSipsung = getDominantSipsung(analytics.tenGods.summary);
  const monthPillarDB = db["3_positional_analysis"]["month_pillar"];
  const weaponData = (monthPillarDB[dominantSipsung as keyof typeof monthPillarDB] as { title: string; text: string }) || 
                     { title: "균형 잡힌 궤도", text: "상황을 객관적으로 바라보고 묵묵히 자신의 자리를 지켜냅니다." };

  let solutionText = "";
  const syndrome = checkElementalSyndrome(dayMaster, analytics.elements.distribution);
  
  if (syndrome && db["4_elemental_syndrome"][syndrome as keyof typeof db["4_elemental_syndrome"]]) {
    const syndromeData = db["4_elemental_syndrome"][syndrome as keyof typeof db["4_elemental_syndrome"]] as { condition: string; symptom: string; prescription: string };
    solutionText = `${syndromeData.symptom}\n\n${syndromeData.prescription}`;
  } else {
    const seasonKey = getSeasonalKey(dayMaster, pillars[1][1]);
    const seasonData = db["2_seasonal_environment"][seasonKey as keyof typeof db["2_seasonal_environment"]] as { title: string; text: string };
    solutionText = seasonData?.text || 
                   "지금 당신이 가진 고유한 파동을 믿고 그대로 나아가세요. 억지로 궤도를 바꿀 필요 없는 완벽한 균형 상태입니다.";
  }

  return {
    persona: {
      icon: "🌙",
      title: coreData.title,
      tags: [`#${coreData.title.split(' ')[0]}`, `#${dominantSipsung}`, `#나만의궤도`] 
    },
    narratives: [
      { id: 'chapter1', subtitle: "Chapter I. 나의 본질", content: coreData.core },
      { id: 'chapter2', subtitle: "Chapter II. 일과 관계", content: weaponData.text },
      { id: 'chapter3', subtitle: "Chapter III. 지금 필요한 궤적", content: solutionText }
    ]
  };
}

export function generateDetailedReport(analysis: SajuAnalysis): TarotCard[] {
  const cards: TarotCard[] = [];
  const { pillars, analytics } = analysis;
  const dayPillar = pillars[2]; 
  const dayMaster = pillars[2][0];

  const iljuData = db["1_day_pillar_theory"][dayPillar as keyof typeof db["1_day_pillar_theory"]] as { title: string; core: string };
  if (iljuData && iljuData.core) {
    cards.push({ id: 'core', title: '나의 고유한 달빛', symbol: '🌙', summary: iljuData.title, detail: iljuData.core });
  }

  const seasonalKey = getSeasonalKey(dayMaster, pillars[1][1]);
  const seasonalData = db["2_seasonal_environment"][seasonalKey as keyof typeof db["2_seasonal_environment"]] as { title: string; text: string };
  if (seasonalData && seasonalData.text) {
    cards.push({ id: 'environment', title: '기운이 피어난 계절', symbol: '🌬️', summary: seasonalData.title, detail: seasonalData.text });
  }

  const monthStemGod = analytics.tenGods.matrix.monthStem?.name.split(' ')[0] || "비견";
  const monthGung = db["3_positional_analysis"]["month_pillar"][monthStemGod as keyof typeof db["3_positional_analysis"]["month_pillar"]] as { title: string; text: string };
  if (monthGung && monthGung.text) {
    cards.push({ id: 'career', title: '세상과 만나는 방식', symbol: '✨', summary: monthGung.title, detail: monthGung.text });
  }

  const dayBranchGod = analytics.tenGods.matrix.dayBranch?.name.split(' ')[0] || "비견";
  const dayGung = db["3_positional_analysis"]["day_branch"][dayBranchGod as keyof typeof db["3_positional_analysis"]["day_branch"]] as { title: string; text: string };
  if (dayGung && dayGung.text) {
    cards.push({ id: 'inner', title: '내면의 고요한 정원', symbol: '🌷', summary: dayGung.title, detail: dayGung.text });
  }

  const hourStemGod = analytics.tenGods.matrix.hourStem?.name.split(' ')[0] || "비견";
  const hourGung = db["3_positional_analysis"]["hour_pillar"][hourStemGod as keyof typeof db["3_positional_analysis"]["hour_pillar"]] as { title: string; text: string };
  if (hourGung && hourGung.text) {
    cards.push({ id: 'future', title: '미래로 향하는 궤적', symbol: '🧭', summary: hourGung.title, detail: hourGung.text });
  }

  const lifeStageKey = getLifeStage(dayMaster, pillars[2][1]);
  const lifeStageData = db["5_twelve_life_stages"][lifeStageKey as keyof typeof db["5_twelve_life_stages"]] as { keyword: string; text: string };
  if (lifeStageData && lifeStageData.text) {
    cards.push({ id: 'energy', title: '현재 파동의 흐름', symbol: '🌊', summary: `${lifeStageKey}의 시기`, detail: lifeStageData.text });
  }

  return cards;
}

export function parseSynergyText(text: string, syncRate: number, myDom: string, partnerDom: string): string {
  if (!text) return "";
  return text
    .replace(/{syncRate}/g, syncRate.toString())
    .replace(/{myDom}/g, myDom)
    .replace(/{partnerDom}/g, partnerDom);
}

function getDominantSipsung(summary: Record<string, number>): string {
  if (!summary || Object.keys(summary).length === 0) return "비견";
  const sorted = Object.entries(summary).sort((a, b) => b[1] - a[1]);
  return sorted[0][0] || "비견";
}

function getSeasonalKey(dayMaster: string, monthBranch: string): string {
  const elementMap: Record<string, string> = { "甲": "wood", "乙": "wood", "丙": "fire", "丁": "fire", "戊": "earth", "己": "earth", "庚": "metal", "辛": "metal", "壬": "water", "癸": "water" };
  const seasonMap: Record<string, string> = { "寅": "spring", "卯": "spring", "辰": "spring", "巳": "summer", "午": "summer", "未": "summer", "申": "autumn", "酉": "autumn", "戌": "autumn", "亥": "winter", "子": "winter", "丑": "winter" };
  
  const element = elementMap[dayMaster] || "wood";
  const season = seasonMap[monthBranch] || "spring";
  
  return `${element}_in_${season}`; 
}

function checkElementalSyndrome(dayMaster: string, distribution: ElementResult[]): string {
  const counts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  distribution.forEach(d => { counts[d.id] = d.count ?? 0; });

  const elementMap: Record<string, string> = { "甲": "wood", "乙": "wood", "丙": "fire", "丁": "fire", "戊": "earth", "己": "earth", "庚": "metal", "辛": "metal", "壬": "water", "癸": "water" };
  const myElement = elementMap[dayMaster];

  for (const [excessElement, count] of Object.entries(counts)) {
    if (count >= 4 && excessElement !== myElement) {
      const syndromeKey = `too_much_${excessElement}_for_${myElement}`;
      if (db["4_elemental_syndrome"][syndromeKey as keyof typeof db["4_elemental_syndrome"]]) {
        return syndromeKey;
      }
    }
  }
  return ""; 
}

function getLifeStage(dayMaster: string, dayBranch: string): string {
  const stageMap: Record<string, Record<string, string>> = {
    "甲": { "亥":"장생", "子":"목욕", "丑":"관대", "寅":"건록", "卯":"제왕", "辰":"쇠", "巳":"병", "午":"사", "未":"묘", "申":"절", "酉":"태", "戌":"양" },
    "乙": { "午":"장생", "巳":"목욕", "辰":"관대", "卯":"건록", "寅":"제왕", "丑":"쇠", "子":"병", "亥":"사", "戌":"묘", "酉":"절", "申":"태", "未":"양" },
    "丙": { "寅":"장생", "卯":"목욕", "辰":"관대", "巳":"건록", "午":"제왕", "未":"쇠", "申":"병", "酉":"사", "戌":"묘", "亥":"절", "子":"태", "丑":"양" },
    "丁": { "酉":"장생", "申":"목욕", "未":"관대", "午":"건록", "巳":"제왕", "辰":"쇠", "卯":"병", "寅":"사", "丑":"묘", "子":"절", "亥":"태", "戌":"양" },
    "戊": { "寅":"장생", "卯":"목욕", "辰":"관대", "巳":"건록", "午":"제왕", "未":"쇠", "申":"병", "酉":"사", "戌":"묘", "亥":"절", "子":"태", "丑":"양" },
    "己": { "酉":"장생", "申":"목욕", "未":"관대", "午":"건록", "巳":"제왕", "辰":"쇠", "卯":"병", "寅":"사", "丑":"묘", "子":"절", "亥":"태", "戌":"양" },
    "庚": { "巳":"장생", "午":"목욕", "未":"관대", "申":"건록", "酉":"제왕", "戌":"쇠", "亥":"병", "子":"사", "丑":"묘", "寅":"절", "卯":"태", "辰":"양" },
    "辛": { "子":"장생", "亥":"목욕", "戌":"관대", "酉":"건록", "申":"제왕", "未":"쇠", "午":"병", "巳":"사", "辰":"묘", "卯":"절", "寅":"태", "丑":"양" },
    "壬": { "申":"장생", "酉":"목욕", "戌":"관대", "亥":"건록", "子":"제왕", "丑":"쇠", "寅":"병", "卯":"사", "辰":"묘", "巳":"절", "午":"태", "未":"양" },
    "癸": { "卯":"장생", "寅":"목욕", "丑":"관대", "子":"건록", "亥":"제왕", "戌":"쇠", "酉":"병", "申":"사", "未":"묘", "午":"절", "巳":"태", "辰":"양" }
  };
  return stageMap[dayMaster]?.[dayBranch] || "평지";
}