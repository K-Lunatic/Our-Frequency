const ELEMENT_META: Record<ElementType, Omit<ElementResult, 'count' | 'percentage'>> = {
  "wood": { id: "wood", name: "푸른 나무", label: "목(Wood)", hanja: "木", color: "#3A5A40", bg: "#F1F4F1", keyword: "성장과 뻗어나감", desc: "위로 솟구치며 자라나는 강한 생명력과 진취적인 호기심" },
  "fire": { id: "fire", name: "붉은 불꽃", label: "화(Fire)", hanja: "火", color: "#C1121F", bg: "#FDF4F4", keyword: "열정과 발산", desc: "어둠을 밝히고 사방으로 뻗어가는 화려한 에너지와 예의" },
  "earth": { id: "earth", name: "황금빛 흙", label: "토(Earth)", hanja: "土", color: "#A67C00", bg: "#F9F6F2", keyword: "포용과 신뢰", desc: "만물을 길러내고 중심을 묵묵히 지키는 흔들림 없는 안정감" },
  "metal": { id: "metal", name: "하얀 쇠", label: "금(Metal)", hanja: "金", color: "#6B7280", bg: "#F5F5F5", keyword: "결단과 원칙", desc: "불순물을 걸러낸 차갑고 예리한 결단력과 변치 않는 의리" },
  "water": { id: "water", name: "검은 물", label: "수(Water)", hanja: "水", color: "#1D3557", bg: "#F0F4F8", keyword: "유연과 지혜", desc: "어디든 스며드는 유연함과 보이지 않는 심연의 철학적 통찰" }
};

const CHAR_MAP: Record<string, { element: string, yinYang: string }> = {
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

export function analyzeElements(pillars: string[]) {
  const counts: Record<string, number> = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
  const yinYang = { "+": 0, "-": 0 };
  
  const chars = pillars.join('').split('');

  chars.forEach(char => {
    const data = CHAR_MAP[char];
    if (data) {
      counts[data.element]++;
      yinYang[data.yinYang as "+" | "-"]++;
    }
  });

  const distribution: ElementResult[] = (Object.keys(counts) as ElementType[]).map(key => {
    const count = counts[key];
    const percentage = Math.round((count / 8) * 100);
    return {
      ...ELEMENT_META[key],
      count,
      percentage
    };
  });

  const lackingElements = distribution.filter(el => (el.count ?? 0) === 0);
  const dominantElements = distribution.filter(el => (el.count ?? 0) >= 3);

  let energyBalance = "조화로움";
  if (yinYang["+"] >= 6) energyBalance = "양(陽) 기운 과다 - 외향적이고 추진력이 강하나 성급할 수 있음";
  if (yinYang["-"] >= 6) energyBalance = "음(陰) 기운 과다 - 내향적이고 수용력이 강하나 우울감에 빠지기 쉬움";

  return {
    rawCounts: counts, 
    yinYang,  
    energyBalance, 
    distribution,           
    insights: {
      dominant: dominantElements, 
      lacking: lackingElements
    }
  };
}