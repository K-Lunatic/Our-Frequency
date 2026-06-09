export {};

declare global {

  type ElementType = 'wood' | 'fire' | 'earth' | 'metal' | 'water';

  interface Question {
    id: number;
    target: 'year' | 'month' | 'day' | 'hour'; 
    text: string;
    options: Option[];
  }

  interface Option {
    label: string; 
    // 🚀 수정: value가 number 뿐만 아니라 string이나 배열도 가능하도록 확장
    value: number | string | number[]; 
    impact?: { 
      [key in ElementType | 'yin' | 'yang' | 'action' | 'receptivity']?: number; 
    };
  }

  interface ElementScores {
    wood: number; fire: number; earth: number; metal: number; water: number;
    yin: number; yang: number;
    action: number; receptivity: number;
  }

  interface ElementResult {
    id: 'wood' | 'fire' | 'earth' | 'metal' | 'water';
    hanja: string;
    name: string;
    label: string;
    color: string;
    keyword: string;
    desc: string;
    count?: number; 
    percentage?: number;
    bg: string;
  }

  interface TenGod {
    name: string;
    keyword: string;
    desc: string;
    hanja?: string;
  }

  interface SpecialStar {
    name: string;
    keywords: string;
    desc: string;
    matchedPillars?: string[];
    count?: number;
  }
  interface SajuAnalytics {
    elements: {
      distribution: ElementResult[];
      yinYang: { '+': number; '-': number };
      energyBalance: string;
    };
    tenGods: {
      matrix: {
        yearStem: TenGod; yearBranch: TenGod;
        monthStem: TenGod; monthBranch: TenGod;
        dayStem: TenGod; dayBranch: TenGod;
        hourStem: TenGod; hourBranch: TenGod;
      };
      summary: Record<string, number>;
      dominant: TenGod[];
    };
    specialStars: SpecialStar[];
    fortune: {
      yearly: { year: number; pillar: string; tenGods: string[]; desc: string; };
    };
    report?: TarotCard[];
  }

  interface SajuAnalysis {
    pillars: string[]; // ['甲子', '乙丑', ...]
    analytics: SajuAnalytics;
  }

  interface TarotCard {
    id: string;
    symbol: string;
    title: string;
    summary: string;
    detail: string;
  }

  // 6. [DB 규격] 통변 엔진용 마스터 데이터셋
  interface MatrixAdvanced {
    "0_ten_gods": Record<string, { keyword: string; desc: string }>;
    "0_special_stars": Record<string, { keyword: string; desc: string }>;
    "1_day_pillar_theory": Record<string, { title: string; core: string }>;
    "2_seasonal_environment": Record<string, { title: string; text: string }>;
    "3_positional_analysis": Record<string, Record<string, { title: string; text: string }>>;
    "4_elemental_syndrome": Record<string, { condition: string; symptom: string; prescription: string }>;
  }
}