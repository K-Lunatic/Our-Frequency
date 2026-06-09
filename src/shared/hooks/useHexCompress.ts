import masterDB from '../data/moonlight_db.json';

export const useHexCompress = () => {
  const compress = (answers: number[]): string => {
    if (answers.length !== 24) return "000000"; 
    
    let hexResult = "";
    for (let i = 0; i < 24; i += 4) {
      const chunk = answers.slice(i, i + 4).join("");
      const hexDigit = parseInt(chunk, 2).toString(16).toUpperCase();
      hexResult += hexDigit;
    }
    return hexResult;
  };

  const decompress = (hex: string): number[] => {
    if (hex.length !== 6) return Array(24).fill(0); 
    
    const binaryArray: number[] = [];
    for (let i = 0; i < 6; i++) {
      const binaryString = parseInt(hex[i], 16).toString(2).padStart(4, "0");
      const bits = binaryString.split("").map((bit) => parseInt(bit));
      binaryArray.push(...bits);
    }
    return binaryArray;
  };

  const getElementScores = (answers: number[]): ElementScores => {
    
    const scores: ElementScores = { 
      wood: 10, fire: 10, earth: 10, metal: 10, water: 10,
      yin: 10, yang: 10, action: 10, receptivity: 10 
    };
    
    const questions = masterDB.questions;

    answers.forEach((ans, idx) => {
      const question = questions[idx];
      if (!question) return;

      const selectedOption = question.options.find((opt: Option) => opt.value === ans);
      
      if (selectedOption && selectedOption.impact) {
        Object.entries(selectedOption.impact).forEach(([key, value]) => {
          const k = key as keyof ElementScores;
          if (scores[k] !== undefined) {
            scores[k] += (value as number);
          }
        });
      }
    });
    
    (Object.keys(scores) as Array<keyof ElementScores>).forEach(key => {
      if (scores[key] < 0) scores[key] = 0;
    });

    return scores;
  };

  return { compress, decompress, getElementScores };
};