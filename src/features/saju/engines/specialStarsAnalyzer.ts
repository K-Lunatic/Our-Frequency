const NACHE_DOHWA_PILLARS: readonly string[] = ["甲子", "乙巳", "丁亥", "庚午", "辛亥", "癸酉"];
const BAEKHO_PILLARS: readonly string[] = ["甲辰", "乙未", "丙戌", "丁丑", "戊辰", "壬戌", "癸丑"];
const GOEGANG_PILLARS: readonly string[] = ["戊戌", "庚戌", "庚辰", "壬辰"];
const CHEONEUL_MAP: Record<string, readonly string[]> = {
  "甲": ["丑", "未"], "戊": ["丑", "未"], "庚": ["丑", "未"],
  "乙": ["子", "申"], "己": ["子", "申"],
  "丙": ["亥", "酉"], "丁": ["亥", "酉"],
  "辛": ["寅", "午"],
  "壬": ["卯", "巳"], "癸": ["卯", "巳"]
};
const RELATION_STAR_MAP: Record<string, { dohwa: string; yeokma: string; hwagae: string }> = {
  '亥': { dohwa: '子', yeokma: '巳', hwagae: '未' }, '卯': { dohwa: '子', yeokma: '巳', hwagae: '未' }, '未': { dohwa: '子', yeokma: '巳', hwagae: '未' },
  '寅': { dohwa: '卯', yeokma: '申', hwagae: '戌' }, '午': { dohwa: '卯', yeokma: '申', hwagae: '戌' }, '戌': { dohwa: '卯', yeokma: '申', hwagae: '戌' },
  '巳': { dohwa: '午', yeokma: '亥', hwagae: '丑' }, '酉': { dohwa: '午', yeokma: '亥', hwagae: '丑' }, '丑': { dohwa: '午', yeokma: '亥', hwagae: '丑' },
  '申': { dohwa: '酉', yeokma: '寅', hwagae: '辰' }, '子': { dohwa: '酉', yeokma: '寅', hwagae: '辰' }, '辰': { dohwa: '酉', yeokma: '寅', hwagae: '辰' }
};

export function analyzeSpecialStars(pillars: string[], dayStem: string): SpecialStar[] {
  const stars: SpecialStar[] = [];
  const branches = pillars.map(p => p[1]); 
  const [yB, mB, dB, hB] = branches;
  const dayPillar = pillars[2]; 

  if (NACHE_DOHWA_PILLARS.includes(dayPillar)) {
    stars.push({
      name: "나체도화 (Naked Bloom)",
      keywords: "#원초적매력 #무장해제 #순수함",
      desc: "꾸미지 않아도 뿜어져 나오는 원초적인 매력을 타고나셨군요. 마치 갓 씻고 나온 달빛처럼 깨끗하면서도 타인의 마음을 무장해제 시키는 묘한 파동을 지녔습니다. 작위적인 연출보다 당신 본연의 모습이 드러날 때 가장 강력한 유혹의 기운이 발산됩니다. 타인의 시선을 의식하지 않는 당당함이 곧 당신의 가장 치명적인 무기가 됩니다.",
      matchedPillars: [dayPillar]
    });
  }

  const pivotY = RELATION_STAR_MAP[yB];
  const pivotD = RELATION_STAR_MAP[dB];
  const isWoljang = (pivotY?.dohwa === mB) || (pivotD?.dohwa === mB);
  if (isWoljang) {
    stars.push({
      name: "월장도화 (Over-the-Wall)",
      keywords: "#숨길수없는빛 #셀러브리티 #압도적매력",
      desc: "당신의 매력은 좁은 울타리에 갇혀있을 수 없습니다. 도화의 기운이 담장을 넘어 멀리까지 퍼져나가는 형국이니, 당신이 어디에 있든 세상은 당신을 찾아낼 것입니다. 이는 물리적 거리를 초월하여 타인의 무의식에 당신의 잔상을 남기는 힘입니다. 숨기려 할수록 더욱 선명해지는 아우라를 가졌기에, 대중의 사랑을 받는 아이콘으로서 최적의 조건을 갖추셨습니다.",
      matchedPillars: [pillars[1]]
    });
  }

  const isTrueDohwa = [yB, dB, hB].some(b => b === pivotY?.dohwa || b === pivotD?.dohwa);
  if (isTrueDohwa && !isWoljang) {
    stars.push({
      name: "진도화 (True Bloom)",
      keywords: "#정석매력 #인기 #주인공의파동",
      desc: "명리학에서 인정하는 가장 정통적인 도화의 기운을 품고 계십니다. 사람들 사이에서 자연스럽게 시선을 모으는 주인공의 주파수를 타고나셨군요. 당신의 말 한마디와 손짓 하나가 타인에게 긍정적인 자극과 영감을 줍니다. 시대의 흐름을 읽는 본능적인 감각이 탁월하여, 현대 사회에서 자신을 브랜딩하고 타인을 이끄는 데 있어 타의 추종을 불허하는 재능을 발휘합니다."
    });
  }

  if (branches.includes(pivotY?.yeokma) || branches.includes(pivotD?.yeokma)) {
    stars.push({
      name: "역마살 (Cosmic Traveler)",
      keywords: "#글로벌에너지 #개척자 #변화무쌍",
      desc: "당신의 운명은 정체된 고요함보다 역동적인 흐름 속에서 찬란하게 빛납니다. 한 곳에 고여 있기보다 끊임없이 새로운 궤도를 생성하고 탐험할 때 당신의 주파수는 가장 선명하게 공명합니다. 이는 단순한 이동을 넘어, 고정관념을 깨부수고 새로운 가치를 창조하는 혁신가의 기운입니다. 넓은 세상을 무대로 삼아 경계를 허무는 삶이 당신에게 가장 잘 어울립니다."
    });
  }

  if (branches.includes(pivotY?.hwagae) || branches.includes(pivotD?.hwagae)) {
    stars.push({
      name: "화개살 (Arcane Garden)",
      keywords: "#예술적천재성 #깊은통찰 #정신적풍요",
      desc: "화려한 무대의 커튼이 내려온 뒤, 홀로 남은 고요한 시간마저 찬란하게 채우는 깊은 내면의 소유자입니다. 인생의 굴곡과 고독을 예술적 영감이나 깊은 철학적 사유로 승화시키는 비범한 능력을 지녔습니다. 겉으로 드러나는 성공보다 정신적 가치를 지탱하는 힘이 강하며, 시간이 흐를수록 그 깊이가 깊어져 주변 사람들에게 등불과 같은 위안을 주는 존재가 될 것입니다."
    });
  }

  const matchedBaekho = pillars.filter(p => BAEKHO_PILLARS.includes(p));
  if (matchedBaekho.length > 0) {
    stars.push({
      name: "백호대살 (White Tiger)",
      keywords: "#폭발적추진력 #프로의식 #카리스마",
      desc: "평소에는 온화해 보이지만, 결정적인 위기 상황에서 백호와 같은 폭발적인 카리스마를 뿜어냅니다. 남들이 포기하는 난관도 정면으로 돌파해버리는 무서운 집중력과 결단력의 근원입니다. 전문 분야에서 독보적인 실력을 쌓는 데 유리하며, 한번 마음먹은 일은 반드시 완수해내는 강인한 정신적 궤도를 상징합니다.",
      matchedPillars: matchedBaekho
    });
  }

  const matchedGoegang = pillars.filter(p => GOEGANG_PILLARS.includes(p));
  if (matchedGoegang.length > 0) {
    stars.push({
      name: "괴강살 (Polaris Leadership)",
      keywords: "#우두머리 #비상한총명함 #독립심",
      desc: "하늘의 우두머리 별자리와 같은 강한 기운을 타고났습니다. 무리를 이끄는 리더의 기질과 남들이 생각지 못한 비범한 통찰력이 본질에 새겨져 있군요. 타인의 지시를 받기보다 스스로 길을 만들고 통제할 때 그 잠재력이 극대화됩니다. 위엄 있는 카리스마로 주변을 압도하며, 당신만의 왕국을 건설하는 우직한 에너지를 의미합니다.",
      matchedPillars: matchedGoegang
    });
  }

  const cheoneulBranches = CHEONEUL_MAP[dayStem] || [];
  const matchedCheoneul = branches.filter(b => cheoneulBranches.includes(b));
  if (matchedCheoneul.length > 0) {
    stars.push({
      name: "천을귀인 (Celestial Guardian)",
      keywords: "#수호신 #인덕 #위기모면",
      desc: "명리학에서 가장 존귀하고 강력한 길신인 천을귀인의 가호가 함께합니다. 인생의 벼랑 끝에서도 당신을 돕는 귀인이 나타나 흉한 기운을 길하게 바꿔버리는 경이로운 에너지를 지녔습니다. 이는 단순히 운이 좋은 것을 넘어, 당신의 인품과 주파수가 주변의 선한 인연들을 자연스럽게 끌어당기는 '복의 근원'임을 상징합니다. 어떠한 풍파에도 무너지지 않는 든든한 보호막을 품고 계시네요.",
      matchedPillars: matchedCheoneul
    });
  }

  return stars;
}