export type AuctionCategory = 'characters' | 'mythic' | 'fast-food' | 'food' | 'desserts' | 'animals';

export interface AuctionItem {
  id: string;
  tr: { name: string; trait: string };
  en: { name: string; trait: string };
  /** Strength used in the final roster score, from 1 to 5. */
  power: number;
  /** Informational estimate only; bids still start at 1 FG. */
  estimatedValue: number;
  tags: string[];
  image?: number;
}

export interface AuctionSetBonus {
  id: string;
  tr: { name: string; description: string };
  en: { name: string; description: string };
  requirements: Record<string, number>;
  points: number;
  group?: string;
}

export interface AuctionCategoryData {
  tr: string;
  en: string;
  trRule: string;
  enRule: string;
  items: AuctionItem[];
  repeatTagBonus: number;
  setBonuses: AuctionSetBonus[];
}

const noSets: AuctionSetBonus[] = [];
const item = (id: string, tr: string, en: string, image?: number, power = 3): AuctionItem => ({
  id, tr: { name: tr, trait: '' }, en: { name: en, trait: '' }, image,
  power, estimatedValue: power, tags: [id],
});

export const auctionCategories: Record<AuctionCategory, AuctionCategoryData> = {
  characters: {
    tr: 'Dizi', en: 'TV Series', trRule: 'Dizi arşivinden favori dizini kadrona kat.', enRule: 'Win your favorite TV series for your roster.',
    repeatTagBonus: 0, setBonuses: noSets,
    items: [
      item('adanali', 'Adanalı', 'Adanali', require('../../assets/görseller/dizi/adanalı.jpg'), 4),
      item('aski-memnu', 'Aşk-ı Memnu', 'Forbidden Love', require('../../assets/görseller/dizi/aşkı memnu.jpg'), 5),
      item('avrupa-yakasi', 'Avrupa Yakası', 'European Side', require('../../assets/görseller/dizi/avrupa-yakasi.jpg'), 4),
      item('behzat-c', 'Behzat Ç.', 'Behzat Ç.', require('../../assets/görseller/dizi/behzat ç.jpg'), 4),
      item('cukur', 'Çukur', 'The Pit', require('../../assets/görseller/dizi/Çukur.jpg'), 5),
      item('ezel', 'Ezel', 'Ezel', require('../../assets/görseller/dizi/ezel.jpg'), 5),
      item('kurtlar-vadisi', 'Kurtlar Vadisi', 'Valley of the Wolves', require('../../assets/görseller/dizi/kurtlar vadisi.jpg'), 5),
      item('kuzey-guney', 'Kuzey Güney', 'North South', require('../../assets/görseller/dizi/kuzey-güney.jpg'), 4),
      item('muhtesem-yuzyil', 'Muhteşem Yüzyıl', 'Magnificent Century', require('../../assets/görseller/dizi/muhteşemyüzyılş.jpg'), 4),
      item('selena', 'Selena', 'Selena', require('../../assets/görseller/dizi/selena.webp'), 3),
    ],
  },
  mythic: {
    tr: 'Efsanevi Canlılar', en: 'Mythical Creatures', trRule: 'Efsanevi canlılardan güçlü bir kadro kur.', enRule: 'Build a powerful roster of mythical creatures.',
    repeatTagBonus: 0, setBonuses: noSets,
    items: [
      item('mermaid', 'Denizkızı', 'Mermaid', require('../../assets/görseller/efsanevi-canlılar/denizkızı.jpg'), 3),
      item('dragon', 'Ejderha', 'Dragon', require('../../assets/görseller/efsanevi-canlılar/ejderha.jpg'), 5),
      item('griffin', 'Grifon', 'Griffin', require('../../assets/görseller/efsanevi-canlılar/grifon.jpg'), 4),
      item('kraken', 'Kraken', 'Kraken', require('../../assets/görseller/efsanevi-canlılar/kraken.jpg'), 5),
      item('centaur', 'Sentor', 'Centaur', require('../../assets/görseller/efsanevi-canlılar/sentor.jpg'), 3),
      item('phoenix', 'Anka Kuşu', 'Phoenix', require('../../assets/görseller/efsanevi-canlılar/anka kuşu.jpg'), 5),
    ],
  },
  'fast-food': {
    tr: 'Fast-food', en: 'Fast Food', trRule: 'Sevilen hızlı yemekleri açık artırmada topla.', enRule: 'Collect popular fast-food favorites at auction.',
    repeatTagBonus: 0, setBonuses: noSets,
    items: [
      item('lahmacun', 'Lahmacun', 'Lahmacun', require('../../assets/görseller/fast-food/lahmacun.jpg'), 3),
      item('pizza', 'Pizza', 'Pizza', require('../../assets/görseller/fast-food/pizza.jpg'), 4),
      item('tantuni', 'Tantuni', 'Tantuni', require('../../assets/görseller/fast-food/tantuni.jpg'), 4),
      item('tavuk-doner', 'Tavuk Döner', 'Chicken Doner', require('../../assets/görseller/fast-food/tavuk döner.jpg'), 4),
      item('citir-tavuk', 'Çıtır Tavuk', 'Crispy Chicken', require('../../assets/görseller/fast-food/çıtır tavukü.webp'), 4),
      item('hamburger', 'Hamburger', 'Hamburger', require('../../assets/görseller/fast-food/hamburger.jpg'), 4),
      item('islak-hamburger', 'Islak Hamburger', 'Wet Burger', require('../../assets/görseller/fast-food/ıslak hamburger.jpg'), 4),
      item('kumpir', 'Kumpir', 'Baked Potato', require('../../assets/görseller/fast-food/kumpir.jpg'), 4),
      item('kumru', 'Kumru', 'Kumru Sandwich', require('../../assets/görseller/fast-food/kumru.jpg'), 3),
    ],
  },
  food: {
    tr: 'Türk Yemekleri', en: 'Turkish Dishes', trRule: 'Fotoğraflardaki Türk yemeklerini kadrona kat.', enRule: 'Add the pictured Turkish dishes to your roster.',
    repeatTagBonus: 0, setBonuses: noSets,
    items: [
      item('adana-durum', 'Adana Dürüm', 'Adana Wrap', require('../../assets/görseller/yemek/adana-dürüm.jpg'), 4),
      item('hunkar-begendi', 'Hünkâr Beğendi', 'Hunkar Begendi', require('../../assets/görseller/yemek/hünkar beğendi.webp'), 5),
      item('iskender-kebap', 'İskender Kebap', 'Iskender Kebab', require('../../assets/görseller/yemek/iskender-kebap.avif'), 5),
      item('karniyarik', 'Karnıyarık', 'Stuffed Eggplant', require('../../assets/görseller/yemek/karnıyarık.webp'), 4),
      item('kayseri-mantisi', 'Kayseri Mantısı', 'Kayseri Manti', require('../../assets/görseller/yemek/kayseri mantısı.jpg'), 4),
      item('lahmacun', 'Lahmacun', 'Lahmacun', require('../../assets/görseller/yemek/lahmacun.jpg'), 3),
      item('midye-dolma', 'Midye Dolma', 'Stuffed Mussels', require('../../assets/görseller/yemek/midye dolma.jpg'), 3),
      item('pilav-kuru-fasulye', 'Pilav + Kuru Fasulye', 'Rice + Beans', require('../../assets/görseller/yemek/pilav+kurufasulye.webp'), 4),
      item('yaprak-sarma', 'Yaprak Sarma', 'Stuffed Vine Leaves', require('../../assets/görseller/yemek/yaprak sarma.webp'), 4),
    ],
  },
  desserts: {
    tr: 'Tatlılar', en: 'Desserts', trRule: 'Tatlı masasının en iyilerini toplamaya çalış.', enRule: 'Try to collect the best of the dessert table.',
    repeatTagBonus: 0, setBonuses: noSets,
    items: [
      item('baklava', 'Baklava', 'Baklava', require('../../assets/görseller/tatlı/baklava.jpg'), 5),
      item('firin-sutlac', 'Fırın Sütlaç', 'Baked Rice Pudding', require('../../assets/görseller/tatlı/fırın sütlaç.gif'), 3),
      item('kazandibi', 'Kazandibi', 'Caramelized Milk Pudding', require('../../assets/görseller/tatlı/kazandibi.jpg'), 3),
      item('kunefe', 'Künefe', 'Kunefe', require('../../assets/görseller/tatlı/künefe.jpg'), 4),
      item('profiterol', 'Profiterol', 'Profiterole', require('../../assets/görseller/tatlı/profiterol.avif'), 4),
      item('san-sebastian', 'San Sebastian', 'San Sebastian Cheesecake', require('../../assets/görseller/tatlı/sansebatsian.jpg'), 4),
      item('soguk-baklava', 'Soğuk Baklava', 'Cold Baklava', require('../../assets/görseller/tatlı/soğukbaklava.webp'), 5),
      item('tiramisu', 'Tiramisu', 'Tiramisu', require('../../assets/görseller/tatlı/tiramisu.jpg'), 4),
      item('waffle', 'Waffle', 'Waffle', require('../../assets/görseller/tatlı/waffle.png'), 4),
    ],
  },
  animals: {
    tr: 'Hayvanlar', en: 'Animals', trRule: 'Hayvan kartlarını açık artırmada topla.', enRule: 'Collect animal cards at auction.',
    repeatTagBonus: 0, setBonuses: noSets,
    items: [
      item('octopus', 'Ahtapot', 'Octopus', require('../../assets/görseller/hayvanlar/ahtapot.jpg'), 3),
      item('elephant', 'Fil', 'Elephant', require('../../assets/görseller/hayvanlar/fil.avif'), 4),
      item('tiger', 'Kaplan', 'Tiger', require('../../assets/görseller/hayvanlar/kaplan.jpg'), 5),
      item('eagle', 'Kartal', 'Eagle', require('../../assets/görseller/hayvanlar/kartal.jpg'), 4),
      item('wolf', 'Kurt', 'Wolf', require('../../assets/görseller/hayvanlar/kurt.jpg'), 4),
      item('dolphin', 'Yunus', 'Dolphin', require('../../assets/görseller/hayvanlar/yunus.jpg'), 4),
    ],
  },
};
