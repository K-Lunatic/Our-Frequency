import masterDB from '@/shared/data/questions_db.json';

interface BeamPath extends ElementScores {
  bits: number[];
  error: number;
}

export function encodeSajuToDynamicHex(targetSaju: ElementScores, compressFn: (bits: number[]) => string): string {
  const questions = masterDB.questions as unknown as Question[];
  
  const totalSajuScore = targetSaju.wood + targetSaju.fire + targetSaju.earth + targetSaju.metal + targetSaju.water;
  if (totalSajuScore === 0) return compressFn(Array(24).fill(0));

  const targetRatio = {
    wood: targetSaju.wood / totalSajuScore,
    fire: targetSaju.fire / totalSajuScore,
    earth: targetSaju.earth / totalSajuScore,
    metal: targetSaju.metal / totalSajuScore,
    water: targetSaju.water / totalSajuScore,
  };

  const targetIsYang = (targetSaju.wood + targetSaju.fire) >= (targetSaju.metal + targetSaju.water);
  const elementsList = ['wood', 'fire', 'earth', 'metal', 'water'] as const;
  const targetDominant = elementsList.reduce((a, b) => (targetSaju[a] as number) > (targetSaju[b] as number) ? a : b);

  const BEAM_WIDTH = 3000; 
  let paths: BeamPath[] = [{ 
    wood: 0, fire: 0, earth: 0, metal: 0, water: 0, 
    yin: 0, yang: 0, action: 0, receptivity: 0, 
    bits: [], error: 0 
  }];
  let currentMaxTotal = 0;

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const newPaths: BeamPath[] = [];
    const progress = (i + 1) / questions.length;

    const maxPointsInQ = Math.max(...q.options.map((o: Option) => 
      Math.abs(o.impact?.wood || 0) + Math.abs(o.impact?.fire || 0) + 
      Math.abs(o.impact?.earth || 0) + Math.abs(o.impact?.metal || 0) + Math.abs(o.impact?.water || 0)
    ));
    currentMaxTotal += (maxPointsInQ > 0 ? maxPointsInQ : 1);

    for (const path of paths) {
      for (const opt of q.options) {
        const imp = opt.impact || {};
        
        const newScores = {
          wood: path.wood + (imp.wood || 0),
          fire: path.fire + (imp.fire || 0),
          earth: path.earth + (imp.earth || 0),
          metal: path.metal + (imp.metal || 0),
          water: path.water + (imp.water || 0),
          yin: path.yin + (imp.yin || 0),
          yang: path.yang + (imp.yang || 0),
          action: path.action + (imp.action || 0),
          receptivity: path.receptivity + (imp.receptivity || 0)
        };

        const expectedWood = targetRatio.wood * currentMaxTotal;
        const expectedFire = targetRatio.fire * currentMaxTotal;
        const expectedEarth = targetRatio.earth * currentMaxTotal;
        const expectedMetal = targetRatio.metal * currentMaxTotal;
        const expectedWater = targetRatio.water * currentMaxTotal;

        let error = 
          Math.pow(newScores.wood - expectedWood, 2) + Math.pow(newScores.fire - expectedFire, 2) +
          Math.pow(newScores.earth - expectedEarth, 2) + Math.pow(newScores.metal - expectedMetal, 2) +
          Math.pow(newScores.water - expectedWater, 2);

        const currentIsYang = newScores.yang >= newScores.yin;
        if (currentIsYang !== targetIsYang) {
          error += 800 * progress; 
        }

        const currentDominant = elementsList.reduce((a, b) => (newScores[a] as number) > (newScores[b] as number) ? a : b);
        if (currentDominant !== targetDominant) {
          error += 1500 * progress;
        }

        let bits: number[] = [];
        if (typeof opt.value === 'number') bits = [opt.value];
        else if (typeof opt.value === 'string') bits = opt.value.split('').map(Number);
        else if (Array.isArray(opt.value)) bits = opt.value.map(Number);
        else bits = [0];

        newPaths.push({ ...newScores, bits: [...path.bits, ...bits], error });
      }
    }

    newPaths.sort((a, b) => a.error - b.error);
    paths = newPaths.slice(0, BEAM_WIDTH);
  }

  const bestPath = paths[0];
  
  return compressFn(bestPath.bits);
}