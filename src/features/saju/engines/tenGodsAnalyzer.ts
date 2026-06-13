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

const TEN_GODS_META: Record<string, TenGod> = {
  "비견": { name: "비견 (比肩)", keyword: "#주체성 #독립 #친구", desc: "나와 어깨를 나란히 하는 에너지입니다. 자립심이 강하고 타인과 평등한 관계를 추구하며, 경쟁을 통해 성장합니다." },
  "겁재": { name: "겁재 (劫財)", keyword: "#승부욕 #투쟁 #탈취", desc: "강력한 경쟁심과 쟁취력을 상징합니다. 위기 상황에서 폭발적인 에너지를 발휘하며, 목표를 향한 집념이 대단히 강합니다." },
  "식신": { name: "식신 (食神)", keyword: "#창의성 #탐구 #의식주", desc: "나의 에너지를 자연스럽게 밖으로 표출하는 성분입니다. 한 분야를 깊게 파고드는 장인정신과 삶의 여유, 미식(의식주)을 의미합니다." },
  "상관": { name: "상관 (傷官)", keyword: "#표현력 #혁신 #언변", desc: "기존의 틀을 깨고 새로운 것을 창조해내는 혁신적인 기운입니다. 화려한 언변과 순발력, 뛰어난 임기응변을 자랑합니다." },
  "편재": { name: "편재 (偏財)", keyword: "#네트워킹 #사업 #확장", desc: "내가 통제하고 지배하려는 불특정 다수의 재물입니다. 스케일이 크고 공간 지각력이 뛰어나며, 사업가적 기질과 유흥을 상징합니다." },
  "정재": { name: "정재 (正財)", keyword: "#안정성 #저축 #치밀함", desc: "정당한 노동을 통해 얻는 예측 가능한 재물입니다. 대단히 꼼꼼하고 치밀하며, 안정적인 자산 관리와 책임감을 의미합니다." },
  "편관": { name: "편관 (偏官)", keyword: "#카리스마 #권력 #명예", desc: "나를 강하게 통제하는 규칙이자 카리스마입니다. 어려운 난관을 돌파하는 리더십과 권력욕을 상징하지만, 때론 스트레스가 될 수 있습니다." },
  "정관": { name: "정관 (正官)", keyword: "#원칙 #합리성 #행정", desc: "사회의 보편적인 합리성과 원칙을 의미합니다. 보수적이고 명예를 중시하며, 조직 내에서 신뢰받는 관리자로서의 자질이 뛰어납니다." },
  "편인": { name: "편인 (偏印)", keyword: "#직관 #전문기술 #철학", desc: "나를 수용하는 기운이되, 조건부로 받아들이는 까다로운 지혜입니다. 눈치가 대단히 빠르고 신비주의, 종교, 철학, 특수 기술에 능합니다." },
  "정인": { name: "정인 (正印)", keyword: "#수용 #학문 #도덕성", desc: "나를 무조건적으로 생해주는 어머니와 같은 따뜻한 기운입니다. 순수하게 지식을 스펀지처럼 흡수하며 도덕성과 인품이 바릅니다." },
  "일간": { name: "일간 (나)", keyword: "#본질 #코어", desc: "당신의 영혼을 상징하는 중심 핵입니다." }
};

const ELEMENT_IDX: Record<string, number> = { "wood": 0, "fire": 1, "earth": 2, "metal": 3, "water": 4 };

const getTenGodName = (myChar: string, targetChar: string): string => {
  if (myChar === targetChar) return "일간";

  const me = ELEMENT_MAP[myChar];
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


export function analyzeTenGods(pillars: string[]) {
  const dayMaster = pillars[2][0];

  const result: Record<string, TenGod> = {};
  
  const positions = [
    { key: "yearStem", char: pillars[0][0] },
    { key: "yearBranch", char: pillars[0][1] },
    { key: "monthStem", char: pillars[1][0] },
    { key: "monthBranch", char: pillars[1][1] },
    { key: "dayStem", char: pillars[2][0] }, // 일간
    { key: "dayBranch", char: pillars[2][1] },
    { key: "hourStem", char: pillars[3][0] },
    { key: "hourBranch", char: pillars[3][1] }
  ];

  const tenGodCounts: Record<string, number> = {};

  positions.forEach(pos => {
    const godName = getTenGodName(dayMaster, pos.char);
    result[pos.key] = TEN_GODS_META[godName];

    if (godName !== "일간") {
      tenGodCounts[godName] = (tenGodCounts[godName] || 0) + 1;
    }
  });

  const dominantGods = Object.keys(tenGodCounts)
    .filter(god => tenGodCounts[god] >= 3)
    .map(god => TEN_GODS_META[god]);

  return {
    matrix: result,       
    summary: tenGodCounts, 
    dominant: dominantGods   
  };
}