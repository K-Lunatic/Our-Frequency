// src/utils/analyzers/fortuneAnalyzer.ts

const STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const ELEMENT_MAP: Record<string, { element: string, yinYang: string }> = {
  "甲": { element: "wood", yinYang: "+" }, "乙": { element: "wood", yinYang: "-" },
  "丙": { element: "fire", yinYang: "+" }, "丁": { element: "fire", yinYang: "-" },
  "戊": { element: "earth", yinYang: "+" }, "己": { element: "earth", yinYang: "-" },
  "庚": { element: "metal", yinYang: "+" }, "辛": { element: "metal", yinYang: "-" },
  "壬": { element: "water", yinYang: "+" }, "癸": { element: "water", yinYang: "-" },
  "寅": { element: "wood", yinYang: "+" }, "卯": { element: "wood", yinYang: "-" },
  "巳": { element: "fire", yinYang: "+" }, "午": { element: "fire", yinYang: "-" },
  "辰": { element: "earth", yinYang: "+" }, "戌": { element: "earth", yinYang: "+" },
  "丑": { element: "earth", yinYang: "-" }, "未": { element: "earth", yinYang: "-" },
  "申": { element: "metal", yinYang: "+" }, "酉": { element: "metal", yinYang: "-" },
  "亥": { element: "water", yinYang: "+" }, "子": { element: "water", yinYang: "-" }
};

const ELEMENT_IDX: Record<string, number> = { "wood": 0, "fire": 1, "earth": 2, "metal": 3, "water": 4 };

const getTenGod = (myStem: string, targetChar: string) => {
  const me = ELEMENT_MAP[myStem];
  const target = ELEMENT_MAP[targetChar];
  if (!me || !target) return "";

  const myIdx = ELEMENT_IDX[me.element];
  const targetIdx = ELEMENT_IDX[target.element];
  const isSameYinYang = me.yinYang === target.yinYang;
  const relation = (targetIdx - myIdx + 5) % 5;

  switch (relation) {
    case 0: return isSameYinYang ? "비견" : "겁재";
    case 1: return isSameYinYang ? "식신" : "상관";
    case 2: return isSameYinYang ? "편재" : "정재";
    case 3: return isSameYinYang ? "편관" : "정관";
    case 4: return isSameYinYang ? "편인" : "정인";
    default: return "";
  }
};

export const getYearlyPillar = (year: number) => {
  const sIdx = (year - 4 + 1000) % 10;
  const bIdx = (year - 4 + 1200) % 12;
  return `${STEMS[sIdx]}${BRANCHES[bIdx]}`;
};

export function analyzeFortune(
  dayStem: string, 
  yearStem: string,
  monthPillar: string,
  isMale: boolean = true,
  targetYear: number = new Date().getFullYear()
) {
  const yearlyPillar = getYearlyPillar(targetYear);
  const yearlyTenGodStem = getTenGod(dayStem, yearlyPillar[0]);
  const yearlyTenGodBranch = getTenGod(dayStem, yearlyPillar[1]);
  const isYearStemYang = ELEMENT_MAP[yearStem].yinYang === "+";
  const isForward = (isMale && isYearStemYang) || (!isMale && !isYearStemYang);
  const daeunPath: Array<{ pillar: string, tenGod: string }> = [];
  let currentStemIdx = STEMS.indexOf(monthPillar[0]);
  let currentBranchIdx = BRANCHES.indexOf(monthPillar[1]);

  for (let i = 1; i <= 8; i++) {
    if (isForward) {
      currentStemIdx = (currentStemIdx + 1) % 10;
      currentBranchIdx = (currentBranchIdx + 1) % 12;
    } else {
      currentStemIdx = (currentStemIdx - 1 + 10) % 10;
      currentBranchIdx = (currentBranchIdx - 1 + 12) % 12;
    }
    const pillar = `${STEMS[currentStemIdx]}${BRANCHES[currentBranchIdx]}`;
    daeunPath.push({
      pillar,
      tenGod: `${getTenGod(dayStem, pillar[0])}/${getTenGod(dayStem, pillar[1])}`
    });
  }

  return {
    yearly: {
      year: targetYear,
      pillar: yearlyPillar,
      tenGods: [yearlyTenGodStem, yearlyTenGodBranch],
      desc: `${targetYear}년은 ${yearlyPillar}년으로, 당신에게 ${yearlyTenGodStem}와 ${yearlyTenGodBranch}의 기운이 들어오는 시기입니다.`
    },
    daeun: {
      direction: isForward ? "순행" : "역행",
      path: daeunPath
    }
  };
}