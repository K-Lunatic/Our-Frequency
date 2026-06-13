import masterDB from '@/shared/data/synergy_db.json';

const synergyDB = masterDB.synergy;

export interface SynergyParams {
  syncRate: number;
  synergyType: '상생' | '상극' | '균형' | string;
  myDomName: string;
  partnerDomName: string;
}

const pickRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

const getJosa = (word: string) => {
  if (!word) return '와';
  const lastChar = word.charCodeAt(word.length - 1);
  if (lastChar < 0xAC00 || lastChar > 0xD7A3) return '와'; 
  const hasBatchim = (lastChar - 0xAC00) % 28 > 0;
  return hasBatchim ? '과' : '와';
};

export const generateAdvancedReading = ({
  syncRate,
  synergyType,
  myDomName,
  partnerDomName
}: SynergyParams): string => {
  
  const intro = pickRandom(synergyDB.intros);

  let syncKey: 'high' | 'mid' | 'low' = 'mid';
  if (syncRate >= 80) syncKey = 'high';
  else if (syncRate < 40) syncKey = 'low';
  
  const syncRaw = pickRandom(synergyDB.syncReadings[syncKey]);
  const syncDesc = syncRaw.replace(/{syncRate}/g, syncRate.toString());

  const synKey = (synergyType === '상생' || synergyType === '상극' || synergyType === '균형') ? synergyType : '균형';
  const synRaw = pickRandom(synergyDB.synergyReadings[synKey as keyof typeof synergyDB.synergyReadings]);
  
  const synDesc = synRaw
    .replace(/{myDom}/g, myDomName)
    .replace(/{partnerDom}/g, partnerDomName)
    .replace(/와\(과\)/g, getJosa(myDomName));

  const outro = pickRandom(synergyDB.outros);

  return `${intro}\n\n${syncDesc}\n\n${synDesc}\n\n${outro}`;
};