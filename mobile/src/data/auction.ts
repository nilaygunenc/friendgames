export type AuctionCategory = 'animals' | 'mythic';

export interface AuctionItem {
  id: string;
  tr: { name: string; trait: string };
  en: { name: string; trait: string };
  power: number;
  tags: string[];
}

export const auctionCategories: Record<AuctionCategory, { tr: string; en: string; items: AuctionItem[] }> = {
  animals: {
    tr: 'Hayvanlar', en: 'Animals',
    items: [
      { id: 'wolf', tr: { name: 'Kurt', trait: 'Sürü liderliği' }, en: { name: 'Wolf', trait: 'Pack leadership' }, power: 4, tags: ['kara', 'sürü'] },
      { id: 'eagle', tr: { name: 'Kartal', trait: 'Keskin görüş' }, en: { name: 'Eagle', trait: 'Keen vision' }, power: 4, tags: ['hava', 'avcı'] },
      { id: 'dolphin', tr: { name: 'Yunus', trait: 'Takım zekâsı' }, en: { name: 'Dolphin', trait: 'Team intelligence' }, power: 3, tags: ['su', 'sürü'] },
      { id: 'tiger', tr: { name: 'Kaplan', trait: 'Güçlü avcı' }, en: { name: 'Tiger', trait: 'Powerful hunter' }, power: 5, tags: ['kara', 'avcı'] },
      { id: 'octopus', tr: { name: 'Ahtapot', trait: 'Uyum sağlama' }, en: { name: 'Octopus', trait: 'Adaptability' }, power: 3, tags: ['su', 'zekâ'] },
      { id: 'elephant', tr: { name: 'Fil', trait: 'Dayanıklılık' }, en: { name: 'Elephant', trait: 'Endurance' }, power: 4, tags: ['kara', 'sürü'] },
    ],
  },
  mythic: {
    tr: 'Efsanevi Canlılar', en: 'Mythic Creatures',
    items: [
      { id: 'phoenix', tr: { name: 'Anka Kuşu', trait: 'Yeniden doğuş' }, en: { name: 'Phoenix', trait: 'Rebirth' }, power: 5, tags: ['hava', 'ateş'] },
      { id: 'griffin', tr: { name: 'Grifon', trait: 'Gökyüzü muhafızı' }, en: { name: 'Griffin', trait: 'Sky guardian' }, power: 4, tags: ['hava', 'avcı'] },
      { id: 'kraken', tr: { name: 'Kraken', trait: 'Derinlik gücü' }, en: { name: 'Kraken', trait: 'Deep-sea force' }, power: 5, tags: ['su', 'güç'] },
      { id: 'centaur', tr: { name: 'Sentor', trait: 'Hızlı stratejist' }, en: { name: 'Centaur', trait: 'Swift strategist' }, power: 3, tags: ['kara', 'zekâ'] },
      { id: 'dragon', tr: { name: 'Ejderha', trait: 'Alev nefesi' }, en: { name: 'Dragon', trait: 'Flame breath' }, power: 5, tags: ['ateş', 'güç'] },
      { id: 'mermaid', tr: { name: 'Denizkızı', trait: 'Deniz bilgeliği' }, en: { name: 'Mermaid', trait: 'Ocean wisdom' }, power: 3, tags: ['su', 'zekâ'] },
    ],
  },
};
