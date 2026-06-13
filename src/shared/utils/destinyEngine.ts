import { parseSajuData } from '@/features/saju/engines/sajuParser';

export interface RealSajuResult {
  normalizedTime: string;
  pillars: string[];
}

export const BRANCH_TIME_MAP: Record<string, string> = { /* ... */ };
const ELEMENT_METADATA: ElementResult[] = [
  { id: 'wood', label: 'WOOD', hanja: '木', name: '새벽의 민트빛', color: '#AEECEF', bg: 'transparent', keyword: '성장하고 뻗어나가는 달빛', desc: '어둠을 뚫고 피어나는 싱그러운 생명력의 빛깔입니다.' },
  { id: 'fire', label: 'FIRE', hanja: '火', name: '해질녘의 핑크빛', color: '#FFB8D0', bg: 'transparent', keyword: '열정적으로 확산하는 달빛', desc: '주변을 따스하게 물들이며 확산하는 온기의 빛깔입니다.' },
  { id: 'earth', label: 'EARTH', hanja: '土', name: '포근한 보름달빛', color: '#FDE08B', bg: 'transparent', keyword: '모든 것을 품는 단단한 달빛', desc: '어떤 감정이든 묵묵히 안아주는 포용과 안정의 빛깔입니다.' },
  { id: 'metal', label: 'METAL', hanja: '金', name: '맑고 투명한 은빛', color: '#FFFFFF', bg: 'transparent', keyword: '단호하고 선명한 달빛', desc: '흔들림 없이 투명하게 본질을 꿰뚫어보는 직관의 빛깔입니다.' },
  { id: 'water', label: 'WATER', hanja: '水', name: '심연의 라벤더빛', color: '#B5B9FF', bg: 'transparent', keyword: '지혜롭게 스며드는 달빛', desc: '고요하고 깊은 심연에서 조용히 일렁이는 지혜의 빛깔입니다.' }
];

const stems = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const branches = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

const DST_PERIODS = [
  { start: "1948-06-01T00:00:00Z", end: "1948-09-13T00:00:00Z" },
  { start: "1949-04-03T00:00:00Z", end: "1949-09-11T00:00:00Z" },
  { start: "1950-04-01T00:00:00Z", end: "1950-09-10T00:00:00Z" },
  { start: "1951-05-06T00:00:00Z", end: "1951-09-09T00:00:00Z" },
  { start: "1955-05-05T00:00:00Z", end: "1955-09-09T00:00:00Z" },
  { start: "1956-05-20T00:00:00Z", end: "1956-09-30T00:00:00Z" },
  { start: "1957-05-05T00:00:00Z", end: "1957-09-22T00:00:00Z" },
  { start: "1958-05-04T00:00:00Z", end: "1958-09-21T00:00:00Z" },
  { start: "1959-05-03T00:00:00Z", end: "1959-09-20T00:00:00Z" },
  { start: "1960-05-01T00:00:00Z", end: "1960-09-18T00:00:00Z" },
  { start: "1987-05-10T00:00:00Z", end: "1987-10-11T00:00:00Z" },
  { start: "1988-05-08T00:00:00Z", end: "1988-10-09T00:00:00Z" }
];

const deg2rad = (deg: number): number => (deg * Math.PI) / 180.0;

function getSunLongitude(date: Date): number {
  const jd = (date.getTime() / 86400000.0) + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;

  let l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  l0 = l0 % 360.0;
  if (l0 < 0) l0 += 360.0;

  let m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  m = m % 360.0;
  if (m < 0) m += 360.0;

  const mRad = deg2rad(m);
  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mRad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * mRad) +
    0.000289 * Math.sin(3 * mRad);

  const trueLon = l0 + c;
  const omega = 125.04 - 1934.136 * t;
  const omegaRad = deg2rad(omega);
  let apparentLon = trueLon - 0.00569 - 0.00478 * Math.sin(omegaRad);

  apparentLon = apparentLon % 360.0;
  if (apparentLon < 0) apparentLon += 360.0;

  return apparentLon;
}

export function normalizeTime(inputDate: Date, userLongitude: number = 127.5): Date {
  let correctedTime = new Date(inputDate.getTime());

  for (const period of DST_PERIODS) {
    const start = new Date(period.start);
    const end = new Date(period.end);
    if (correctedTime >= start && correctedTime <= end) {
      correctedTime = new Date(correctedTime.getTime() - 60 * 60 * 1000);
      break;
    }
  }

  const isHistorical1275 = correctedTime >= new Date('1954-03-21T00:00:00Z') &&
                           correctedTime <= new Date('1961-08-09T23:59:59Z');

  if (!isHistorical1275) {
    const KST_LON = 135.0;
    const lonDiffMinutes = (KST_LON - userLongitude) * 4;
    correctedTime = new Date(correctedTime.getTime() - lonDiffMinutes * 60 * 1000);
  }

  return correctedTime;
}

const getDayGanjiIdx = (d: Date): number => {
  const diff = Math.floor((d.getTime() - new Date(1900, 0, 1).getTime()) / 86400000);
  return (diff + 10) % 60;
};

export function calculateRealSaju(birthDate: Date, longitude: number = 127.5): RealSajuResult {
  const trueTime = normalizeTime(birthDate, longitude);
  const h = trueTime.getHours();
  const adjustedDate = new Date(trueTime.getTime());
  
  if (h >= 23) adjustedDate.setDate(adjustedDate.getDate() + 1);

  const dIdx = getDayGanjiIdx(adjustedDate);
  const dayStemIdx = dIdx % 10;
  const currentSolarLon = getSunLongitude(adjustedDate); 
  
  let sYear = adjustedDate.getFullYear();
  if (adjustedDate.getMonth() <= 2 && currentSolarLon < 315 && currentSolarLon >= 270) {
    sYear -= 1;
  }
  const yearStemIdx = (sYear - 4 + 1000) % 10;
  const yearBranchIdx = (sYear - 4 + 1200) % 12;

  const shiftedLon = (currentSolarLon + 45) % 360; 
  const monthBranchIdx = (Math.floor(shiftedLon / 30) + 2) % 12;
  const monthStemIdx = ((yearStemIdx % 5) * 2 + monthBranchIdx) % 10;

  const hourBranchIdx = Math.floor((trueTime.getHours() + 1) / 2) % 12;
  const hourStemIdx = ((dayStemIdx % 5) * 2 + hourBranchIdx) % 10;

  return {
    normalizedTime: trueTime.toISOString(),
    pillars: [
      `${stems[yearStemIdx]}${branches[yearBranchIdx]}`,
      `${stems[monthStemIdx]}${branches[monthBranchIdx]}`,
      `${stems[dayStemIdx]}${branches[dIdx % 12]}`,
      `${stems[hourStemIdx]}${branches[hourBranchIdx]}`
    ]
  };
}

export interface PerfectSajuOutput {
  date: string;
  pillars: string[];
  analysis: SajuAnalysis;
  element: ElementResult & { value: number; fullLabel: string };
  allElements: Array<ElementResult & { value: number; fullLabel: string }>;
  chartData: { values: number[]; colors: string[] };
}

interface MoonlightSajuData {
  mainElement: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
  date: string;
  pillars: string[];
}

const MOONLIGHT_DATA: MoonlightSajuData[] = [
  { mainElement: 'wood', date: '푸르른 생명의 태동', pillars: ["甲子", "丙寅", "戊辰", "庚午"] },
  { mainElement: 'fire', date: '타오르는 열정의 궤적', pillars: ["丙午", "丁巳", "己未", "辛酉"] },
  { mainElement: 'earth', date: '만물을 품는 고요한 대지', pillars: ["戊辰", "己丑", "庚辰", "壬辰"] },
  { mainElement: 'metal', date: '차갑고 선명한 달빛의 칼날', pillars: ["庚申", "辛酉", "癸亥", "乙丑"] },
  { mainElement: 'water', date: '심연을 흐르는 고요한 지혜', pillars: ["壬子", "癸亥", "甲寅", "丙辰"] }
];

export const calculatePerfectSajuOrigin = (elementScores: ElementScores): PerfectSajuOutput => {
  const scoresArray = [
    elementScores.wood,
    elementScores.fire,
    elementScores.earth,
    elementScores.metal,
    elementScores.water
  ];

  const dominant = scoresArray.reduce(
    (max, val, idx) => (val > max.val ? { val, idx } : max),
    { val: -1, idx: 0 }
  );

  let foundSaju = MOONLIGHT_DATA.find(data => {
    const targetElement = ELEMENT_METADATA[dominant.idx].id;
    return data.mainElement === targetElement; 
  });

  if (!foundSaju) {
    foundSaju = { 
      mainElement: 'wood',
      date: "알 수 없는 시간의 틈", 
      pillars: ["甲子", "丙寅", "戊辰", "庚午"] 
    };
  }

  const analysisObj = parseSajuData(
    foundSaju.pillars as [string, string, string, string], true, 2026);

  const allElements = ELEMENT_METADATA.map((meta, idx) => ({
    ...meta,
    value: scoresArray[idx],
    fullLabel: `${meta.name}`
  }));

  return {
    date: foundSaju.date,
    pillars: foundSaju.pillars,
    analysis: analysisObj,
    element: allElements[dominant.idx],
    allElements,
    chartData: {
      values: scoresArray,
      colors: ELEMENT_METADATA.map(m => m.color)
    }
  };
};

export interface SynergyResult {
  score: number;
  synergyType: '상생' | '상극' | '균형';
  myDom: ElementResult;
  partnerDom: ElementResult;
}

export const calculateElementalSynergy = (myScores: ElementScores, partnerScores: ElementScores): SynergyResult => {
  const elements: (keyof ElementScores)[] = ['wood', 'fire', 'earth', 'metal', 'water'];
  
  const getDominantIdx = (s: ElementScores): number => {
    let max = -1; let maxIdx = 0;
    elements.forEach((el, i) => { if (s[el] > max) { max = s[el]; maxIdx = i; } });
    return maxIdx;
  };

  const myDomIdx = getDominantIdx(myScores);
  const pDomIdx = getDominantIdx(partnerScores);

  const isGeneration = (pDomIdx === (myDomIdx + 1) % 5) || (myDomIdx === (pDomIdx + 1) % 5);
  const isOvercoming = (pDomIdx === (myDomIdx + 2) % 5) || (myDomIdx === (pDomIdx + 2) % 5);

  let score = 75;
  let type: '상생' | '상극' | '균형' = '균형';

  if (isGeneration) {
    score = 95; type = '상생';
  } else if (isOvercoming) {
    score = 68; type = '상극';
  } else if (myDomIdx === pDomIdx) {
    score = 88; type = '균형';
  }

  elements.forEach((el) => { if (myScores[el] <= 1 && partnerScores[el] >= 3) score += 4; });

  return {
    score: Math.min(score, 100),
    synergyType: type,
    myDom: ELEMENT_METADATA[myDomIdx],
    partnerDom: ELEMENT_METADATA[pDomIdx]
  };
};