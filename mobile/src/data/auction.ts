export type AuctionCategory =
  | 'animals'
  | 'mythic'
  | 'beauty'
  | 'food'
  | 'characters'
  | 'survival'
  | 'worklife';

export interface AuctionItem {
  id: string;
  tr: { name: string; trait: string };
  en: { name: string; trait: string };
  /** Strength used in the final roster score, from 1 to 5. */
  power: number;
  /** Informational estimate only; bids still start at 1 FG. */
  estimatedValue: number;
  tags: string[];
  series?: string;
}

export interface AuctionSetBonus {
  id: string;
  tr: { name: string; description: string };
  en: { name: string; description: string };
  requirements: Record<string, number>;
  points: number;
  /** Bonuses sharing a group are mutually exclusive; only the strongest applies. */
  group?: string;
}

export interface AuctionCategoryData {
  tr: string;
  en: string;
  trRule: string;
  enRule: string;
  items: AuctionItem[];
  /** Legacy creature decks also score repeated shared traits. */
  repeatTagBonus: number;
  setBonuses: AuctionSetBonus[];
  seriesNames?: Record<string, { tr: string; en: string }>;
}

export const auctionCategories: Record<AuctionCategory, AuctionCategoryData> = {
  animals: {
    tr: 'Hayvanlar', en: 'Animals',
    trRule: 'Aynı özellik etiketinin her tekrarı +2 uyum puanı kazandırır.',
    enRule: 'Each repeated trait tag adds 2 synergy points.',
    repeatTagBonus: 2, setBonuses: [],
    items: [
      { id: 'wolf', tr: { name: 'Kurt', trait: 'Sürü liderliği' }, en: { name: 'Wolf', trait: 'Pack leadership' }, power: 4, estimatedValue: 4, tags: ['kara', 'sürü'] },
      { id: 'eagle', tr: { name: 'Kartal', trait: 'Keskin görüş' }, en: { name: 'Eagle', trait: 'Keen vision' }, power: 4, estimatedValue: 4, tags: ['hava', 'avcı'] },
      { id: 'dolphin', tr: { name: 'Yunus', trait: 'Takım zekâsı' }, en: { name: 'Dolphin', trait: 'Team intelligence' }, power: 3, estimatedValue: 3, tags: ['su', 'sürü'] },
      { id: 'tiger', tr: { name: 'Kaplan', trait: 'Güçlü avcı' }, en: { name: 'Tiger', trait: 'Powerful hunter' }, power: 5, estimatedValue: 5, tags: ['kara', 'avcı'] },
      { id: 'octopus', tr: { name: 'Ahtapot', trait: 'Uyum sağlama' }, en: { name: 'Octopus', trait: 'Adaptability' }, power: 3, estimatedValue: 3, tags: ['su', 'zekâ'] },
      { id: 'elephant', tr: { name: 'Fil', trait: 'Dayanıklılık' }, en: { name: 'Elephant', trait: 'Endurance' }, power: 4, estimatedValue: 4, tags: ['kara', 'sürü'] },
    ],
  },
  mythic: {
    tr: 'Efsanevi Canlılar', en: 'Mythic Creatures',
    trRule: 'Aynı özellik etiketinin her tekrarı +2 uyum puanı kazandırır.',
    enRule: 'Each repeated trait tag adds 2 synergy points.',
    repeatTagBonus: 2, setBonuses: [],
    items: [
      { id: 'phoenix', tr: { name: 'Anka Kuşu', trait: 'Yeniden doğuş' }, en: { name: 'Phoenix', trait: 'Rebirth' }, power: 5, estimatedValue: 5, tags: ['hava', 'ateş'] },
      { id: 'griffin', tr: { name: 'Grifon', trait: 'Gökyüzü muhafızı' }, en: { name: 'Griffin', trait: 'Sky guardian' }, power: 4, estimatedValue: 4, tags: ['hava', 'avcı'] },
      { id: 'kraken', tr: { name: 'Kraken', trait: 'Derinlik gücü' }, en: { name: 'Kraken', trait: 'Deep-sea force' }, power: 5, estimatedValue: 5, tags: ['su', 'güç'] },
      { id: 'centaur', tr: { name: 'Sentor', trait: 'Hızlı stratejist' }, en: { name: 'Centaur', trait: 'Swift strategist' }, power: 3, estimatedValue: 3, tags: ['kara', 'zekâ'] },
      { id: 'dragon', tr: { name: 'Ejderha', trait: 'Alev nefesi' }, en: { name: 'Dragon', trait: 'Flame breath' }, power: 5, estimatedValue: 5, tags: ['ateş', 'güç'] },
      { id: 'mermaid', tr: { name: 'Denizkızı', trait: 'Deniz bilgeliği' }, en: { name: 'Mermaid', trait: 'Ocean wisdom' }, power: 3, estimatedValue: 3, tags: ['su', 'zekâ'] },
    ],
  },
  beauty: {
    tr: 'Lüks Kozmetik', en: 'Luxury Beauty',
    trRule: 'Aynı markadan en az 2 ürün +4; makyaj bazı + ruj + parfüm seti +7 uyum puanı verir.',
    enRule: 'Two or more products from one brand score +4; primer + lipstick + perfume scores +7 synergy.',
    repeatTagBonus: 0,
    setBonuses: [
      { id: 'fenty-set', tr: { name: 'Fenty ikilisi', description: '2 Fenty ürünü' }, en: { name: 'Fenty duo', description: '2 Fenty products' }, requirements: { fenty: 2 }, points: 4 },
      { id: 'ysl-set', tr: { name: 'YSL ikilisi', description: '2 YSL ürünü' }, en: { name: 'YSL duo', description: '2 YSL products' }, requirements: { ysl: 2 }, points: 4 },
      { id: 'makeup-trio', tr: { name: 'Tam makyaj seti', description: 'Baz + ruj + parfüm' }, en: { name: 'Complete beauty set', description: 'Primer + lipstick + perfume' }, requirements: { primer: 1, lipstick: 1, perfume: 1 }, points: 7 },
    ],
    items: [
      { id: 'fenty-gloss', tr: { name: 'Fenty Beauty Gloss Bomb', trait: 'Işıltılı dudak parlatıcısı' }, en: { name: 'Fenty Beauty Gloss Bomb', trait: 'Luminous lip gloss' }, power: 2, estimatedValue: 1, tags: ['fenty', 'lipstick'] },
      { id: 'ysl-rouge', tr: { name: 'YSL Rouge Volupté', trait: 'Bakım yapan ikonik ruj' }, en: { name: 'YSL Rouge Volupté', trait: 'Iconic nourishing lipstick' }, power: 3, estimatedValue: 3, tags: ['ysl', 'lipstick'] },
      { id: 'ct-filter', tr: { name: 'Charlotte Tilbury Flawless Filter', trait: 'Aydınlık ten bazı' }, en: { name: 'Charlotte Tilbury Flawless Filter', trait: 'Radiant complexion booster' }, power: 4, estimatedValue: 4, tags: ['charlotte', 'primer'] },
      { id: 'dyson-airwrap', tr: { name: 'Dyson Airwrap', trait: 'Isısız şekillendirme gücü' }, en: { name: 'Dyson Airwrap', trait: 'Multi-styler power' }, power: 5, estimatedValue: 8, tags: ['dyson', 'hair'] },
      { id: 'la-mer-cream', tr: { name: 'La Mer Nemlendirici', trait: 'Lüks cilt bakımı' }, en: { name: 'La Mer Moisturizer', trait: 'Luxury skincare' }, power: 4, estimatedValue: 6, tags: ['lamer', 'skincare'] },
      { id: 'fenty-blush', tr: { name: 'Fenty Cheeks Out Allık', trait: 'Canlı renk, kolay uygulama' }, en: { name: 'Fenty Cheeks Out Blush', trait: 'Buildable color, easy application' }, power: 3, estimatedValue: 3, tags: ['fenty', 'blush'] },
      { id: 'ysl-perfume', tr: { name: 'YSL Libre Parfüm', trait: 'Kalıcı imza koku' }, en: { name: 'YSL Libre Perfume', trait: 'Long-lasting signature scent' }, power: 4, estimatedValue: 5, tags: ['ysl', 'perfume'] },
      { id: 'milk-primer', tr: { name: 'Milk Hydro Grip Baz', trait: 'Makyajı sabitleyen baz' }, en: { name: 'Milk Hydro Grip Primer', trait: 'Gripping makeup primer' }, power: 3, estimatedValue: 2, tags: ['milk', 'primer'] },
    ],
  },
  food: {
    tr: 'Efsanevi Türk Lezzetleri', en: 'Iconic Turkish Food',
    trRule: 'Yemekle uyumlu içecek veya tatlıyı eşleştir; tamamlanan her menü seti +5 puan.',
    enRule: 'Pair a dish with its matching drink or dessert; each completed menu set scores +5.',
    repeatTagBonus: 0,
    setBonuses: [
      { id: 'iskender-menu', tr: { name: 'Bursa menüsü', description: 'İskender + şıra' }, en: { name: 'Bursa menu', description: 'Iskender + grape must' }, requirements: { iskender: 1, sira: 1 }, points: 5 },
      { id: 'adana-menu', tr: { name: 'Adana menüsü', description: 'Adana + ayran' }, en: { name: 'Adana menu', description: 'Adana + ayran' }, requirements: { adana: 1, ayran: 1 }, points: 5 },
      { id: 'lahmacun-menu', tr: { name: 'Lahmacun menüsü', description: 'Lahmacun + ayran' }, en: { name: 'Lahmacun menu', description: 'Lahmacun + ayran' }, requirements: { lahmacun: 1, ayran: 1 }, points: 5 },
      { id: 'manti-menu', tr: { name: 'Mantı ziyafeti', description: 'Mantı + sütlaç' }, en: { name: 'Manti feast', description: 'Manti + rice pudding' }, requirements: { manti: 1, sutlac: 1 }, points: 5 },
    ],
    items: [
      { id: 'iskender', tr: { name: 'İskender Kebap', trait: 'Yoğurt ve tereyağıyla efsane' }, en: { name: 'Iskender Kebab', trait: 'Legendary yogurt and butter sauce' }, power: 4, estimatedValue: 4, tags: ['iskender', 'main'] },
      { id: 'adana', tr: { name: 'Adana Dürüm', trait: 'Ateşli ve doyurucu' }, en: { name: 'Adana Wrap', trait: 'Smoky and satisfying' }, power: 3, estimatedValue: 2, tags: ['adana', 'main'] },
      { id: 'lahmacun', tr: { name: 'Lahmacun', trait: 'İncecik çıtır klasik' }, en: { name: 'Lahmacun', trait: 'Crisp, thin classic' }, power: 2, estimatedValue: 1, tags: ['lahmacun', 'main'] },
      { id: 'lahmacun-ayran-menu', tr: { name: 'Lahmacun + Ayran İkilisi', trait: 'Sokak lezzetlerinin uyumlu ikilisi' }, en: { name: 'Lahmacun + Ayran Combo', trait: 'A classic street-food pairing' }, power: 3, estimatedValue: 2, tags: ['lahmacun', 'ayran', 'bundle'] },
      { id: 'manti', tr: { name: 'Kayseri Mantısı', trait: 'Minik hamur, büyük emek' }, en: { name: 'Kayseri Manti', trait: 'Tiny dumplings, big effort' }, power: 3, estimatedValue: 3, tags: ['manti', 'main'] },
      { id: 'hunkar', tr: { name: 'Hünkâr Beğendi', trait: 'Saray usulü köz patlıcan' }, en: { name: 'Hunkar Begendi', trait: 'Royal smoked eggplant' }, power: 5, estimatedValue: 5, tags: ['hunkar', 'main'] },
      { id: 'midye', tr: { name: 'Midye Dolma', trait: 'Sokak klasiği, limon şart' }, en: { name: 'Stuffed Mussels', trait: 'Street-food classic, lemon essential' }, power: 3, estimatedValue: 1, tags: ['midye', 'street'] },
      { id: 'sira', tr: { name: 'Üzüm Şırası', trait: 'İskenderin geleneksel eşlikçisi' }, en: { name: 'Grape Must', trait: 'Traditional Iskender pairing' }, power: 2, estimatedValue: 1, tags: ['sira', 'drink'] },
      { id: 'ayran', tr: { name: 'Bol Köpüklü Ayran', trait: 'Acının ve hamur işinin dostu' }, en: { name: 'Foamy Ayran', trait: 'The perfect spicy-food companion' }, power: 2, estimatedValue: 1, tags: ['ayran', 'drink'] },
      { id: 'sutlac', tr: { name: 'Fırın Sütlaç', trait: 'Mantı sonrası tatlı final' }, en: { name: 'Baked Rice Pudding', trait: 'A sweet finish after manti' }, power: 2, estimatedValue: 2, tags: ['sutlac', 'dessert'] },
      { id: 'kunefe', tr: { name: 'Künefe', trait: 'Peynirli, şerbetli final' }, en: { name: 'Kunefe', trait: 'Cheese and syrup finale' }, power: 3, estimatedValue: 3, tags: ['kunefe', 'dessert'] },
    ],
  },
  characters: {
    tr: 'Efsane Türk Dizi Karakterleri', en: 'Iconic Turkish TV Characters',
    trRule: 'Her maçta 9 dizilik havuzdan 4 dizinin 3’er karakteri gelir. Aynı diziden 2 karakter +3, tam kadro +8 puan kazandırır.',
    enRule: 'Each match draws 3 characters from 4 of the 9 shows. Two from one show score +3; the complete trio scores +8.',
    repeatTagBonus: 0,
    seriesNames: {
      'kurtlar-vadisi': { tr: 'Kurtlar Vadisi', en: 'Valley of the Wolves' },
      'ask-memnu': { tr: 'Aşk-ı Memnu', en: 'Forbidden Love' },
      selena: { tr: 'Selena', en: 'Selena' },
      ezel: { tr: 'Ezel', en: 'Ezel' },
      'behzat-c': { tr: 'Behzat Ç.', en: 'Behzat Ç.' },
      'avrupa-yakasi': { tr: 'Avrupa Yakası', en: 'European Side' },
      'muhtesem-yuzyil': { tr: 'Muhteşem Yüzyıl', en: 'Magnificent Century' },
      cukur: { tr: 'Çukur', en: 'The Pit' },
      'leyla-mecnun': { tr: 'Leyla ile Mecnun', en: 'Leyla and Mecnun' },
    },
    setBonuses: [
      { id: 'kurtlar-duo', group: 'kurtlar', tr: { name: 'Kurtlar Vadisi ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Valley of the Wolves duo', description: '2 characters from the same show' }, requirements: { 'kurtlar-vadisi': 2 }, points: 3 },
      { id: 'kurtlar-trio', group: 'kurtlar', tr: { name: 'Kurtlar Vadisi kadrosu', description: 'Polat + Memati + Süleyman Çakır' }, en: { name: 'Valley of the Wolves cast', description: 'Polat + Memati + Suleyman Cakir' }, requirements: { 'kurtlar-vadisi': 3 }, points: 8 },
      { id: 'ask-duo', group: 'ask-memnu', tr: { name: 'Aşk-ı Memnu ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Forbidden Love duo', description: '2 characters from the same show' }, requirements: { 'ask-memnu': 2 }, points: 3 },
      { id: 'ask-trio', group: 'ask-memnu', tr: { name: 'Aşk-ı Memnu kadrosu', description: 'Bihter + Behlül + Firdevs' }, en: { name: 'Forbidden Love cast', description: 'Bihter + Behlul + Firdevs' }, requirements: { 'ask-memnu': 3 }, points: 8 },
      { id: 'selena-duo', group: 'selena', tr: { name: 'Selena ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Selena duo', description: '2 characters from the same show' }, requirements: { selena: 2 }, points: 3 },
      { id: 'selena-trio', group: 'selena', tr: { name: 'Selena kadrosu', description: 'Selena + Hades + Kıvılcım' }, en: { name: 'Selena cast', description: 'Selena + Hades + Kivilcim' }, requirements: { selena: 3 }, points: 8 },
      { id: 'ezel-duo', group: 'ezel', tr: { name: 'Ezel ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Ezel duo', description: '2 characters from the same show' }, requirements: { ezel: 2 }, points: 3 },
      { id: 'ezel-trio', group: 'ezel', tr: { name: 'Ezel kadrosu', description: 'Ezel + Ramiz Dayı + Eyşan' }, en: { name: 'Ezel cast', description: 'Ezel + Uncle Ramiz + Eysan' }, requirements: { ezel: 3 }, points: 8 },
      { id: 'behzat-duo', group: 'behzat-c', tr: { name: 'Behzat Ç. ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Behzat Ç. duo', description: '2 characters from the same show' }, requirements: { 'behzat-c': 2 }, points: 3 },
      { id: 'behzat-trio', group: 'behzat-c', tr: { name: 'Behzat Ç. ekibi', description: 'Behzat + Harun + Akbaba' }, en: { name: 'Behzat Ç. team', description: 'Behzat + Harun + Akbaba' }, requirements: { 'behzat-c': 3 }, points: 8 },
      { id: 'avrupa-duo', group: 'avrupa-yakasi', tr: { name: 'Avrupa Yakası ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'European Side duo', description: '2 characters from the same show' }, requirements: { 'avrupa-yakasi': 2 }, points: 3 },
      { id: 'avrupa-trio', group: 'avrupa-yakasi', tr: { name: 'Avrupa Yakası kadrosu', description: 'Burhan + Şahika + Volkan' }, en: { name: 'European Side cast', description: 'Burhan + Sahika + Volkan' }, requirements: { 'avrupa-yakasi': 3 }, points: 8 },
      { id: 'muhtesem-duo', group: 'muhtesem-yuzyil', tr: { name: 'Muhteşem Yüzyıl ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Magnificent Century duo', description: '2 characters from the same show' }, requirements: { 'muhtesem-yuzyil': 2 }, points: 3 },
      { id: 'muhtesem-trio', group: 'muhtesem-yuzyil', tr: { name: 'Muhteşem Yüzyıl kadrosu', description: 'Hürrem + Kanuni + İbrahim' }, en: { name: 'Magnificent Century cast', description: 'Hurrem + Suleiman + Ibrahim' }, requirements: { 'muhtesem-yuzyil': 3 }, points: 8 },
      { id: 'cukur-duo', group: 'cukur', tr: { name: 'Çukur ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'The Pit duo', description: '2 characters from the same show' }, requirements: { cukur: 2 }, points: 3 },
      { id: 'cukur-trio', group: 'cukur', tr: { name: 'Çukur ailesi', description: 'Yamaç + Vartolu + İdris Koçovalı' }, en: { name: 'The Pit family', description: 'Yamac + Vartolu + Idris Kocovali' }, requirements: { cukur: 3 }, points: 8 },
      { id: 'leyla-duo', group: 'leyla-mecnun', tr: { name: 'Leyla ile Mecnun ikilisi', description: 'Aynı diziden 2 karakter' }, en: { name: 'Leyla and Mecnun duo', description: '2 characters from the same show' }, requirements: { 'leyla-mecnun': 2 }, points: 3 },
      { id: 'leyla-trio', group: 'leyla-mecnun', tr: { name: 'Leyla ile Mecnun ekibi', description: 'Mecnun + İsmail Abi + Yavuz' }, en: { name: 'Leyla and Mecnun crew', description: 'Mecnun + Ismail Abi + Yavuz' }, requirements: { 'leyla-mecnun': 3 }, points: 8 },
    ],
    items: [
      { id: 'polat', series: 'kurtlar-vadisi', tr: { name: 'Polat Alemdar', trait: 'Soğukkanlı lider' }, en: { name: 'Polat Alemdar', trait: 'Unflappable leader' }, power: 5, estimatedValue: 5, tags: ['kurtlar-vadisi'] },
      { id: 'memati', series: 'kurtlar-vadisi', tr: { name: 'Memati Baş', trait: 'Sadık sağ kol' }, en: { name: 'Memati Bas', trait: 'Loyal right hand' }, power: 4, estimatedValue: 3, tags: ['kurtlar-vadisi'] },
      { id: 'cakir', series: 'kurtlar-vadisi', tr: { name: 'Süleyman Çakır', trait: 'Unutulmaz kabadayı' }, en: { name: 'Suleyman Cakir', trait: 'Unforgettable underworld boss' }, power: 4, estimatedValue: 4, tags: ['kurtlar-vadisi'] },
      { id: 'bihter', series: 'ask-memnu', tr: { name: 'Bihter Ziyagil', trait: 'Tutkulu ve trajik' }, en: { name: 'Bihter Ziyagil', trait: 'Passionate and tragic' }, power: 5, estimatedValue: 5, tags: ['ask-memnu'] },
      { id: 'behlul', series: 'ask-memnu', tr: { name: 'Behlül Haznedar', trait: 'Kaçışlarıyla meşhur' }, en: { name: 'Behlul Haznedar', trait: 'Famous for running away' }, power: 4, estimatedValue: 4, tags: ['ask-memnu'] },
      { id: 'firdevs', series: 'ask-memnu', tr: { name: 'Firdevs Yöreoğlu', trait: 'Planların kraliçesi' }, en: { name: 'Firdevs Yoreoglu', trait: 'Queen of schemes' }, power: 4, estimatedValue: 4, tags: ['ask-memnu'] },
      { id: 'selena', series: 'selena', tr: { name: 'Selena', trait: 'İyiliğin sihirli koruyucusu' }, en: { name: 'Selena', trait: 'Magical protector of good' }, power: 5, estimatedValue: 5, tags: ['selena'] },
      { id: 'hades', series: 'selena', tr: { name: 'Hades', trait: 'Yeraltı dünyasının oyun kurucusu' }, en: { name: 'Hades', trait: 'Mastermind of the underworld' }, power: 4, estimatedValue: 4, tags: ['selena'] },
      { id: 'kivilcim', series: 'selena', tr: { name: 'Kıvılcım', trait: 'Selena’nın dünyasından güçlü rakip' }, en: { name: 'Kivilcim', trait: 'A formidable rival from Selena’s world' }, power: 3, estimatedValue: 2, tags: ['selena'] },
      { id: 'ezel', series: 'ezel', tr: { name: 'Ezel Bayraktar', trait: 'Yıllara yayılan intikam planı' }, en: { name: 'Ezel Bayraktar', trait: 'A revenge plan years in the making' }, power: 5, estimatedValue: 5, tags: ['ezel'] },
      { id: 'ramiz', series: 'ezel', tr: { name: 'Ramiz Karaeski', trait: 'Sözleriyle yön veren usta' }, en: { name: 'Ramiz Karaeski', trait: 'A master who leads with words' }, power: 5, estimatedValue: 5, tags: ['ezel'] },
      { id: 'eysan', series: 'ezel', tr: { name: 'Eyşan Tezcan', trait: 'Sırlarla dolu stratejist' }, en: { name: 'Eysan Tezcan', trait: 'A strategist full of secrets' }, power: 4, estimatedValue: 4, tags: ['ezel'] },
      { id: 'behzat', series: 'behzat-c', tr: { name: 'Behzat Ç.', trait: 'Ankara’nın sert komiseri' }, en: { name: 'Behzat Ç.', trait: 'Ankara’s hard-boiled detective' }, power: 5, estimatedValue: 4, tags: ['behzat-c'] },
      { id: 'harun', series: 'behzat-c', tr: { name: 'Harun', trait: 'Sadık ekip arkadaşı' }, en: { name: 'Harun', trait: 'Loyal partner' }, power: 3, estimatedValue: 2, tags: ['behzat-c'] },
      { id: 'akbaba', series: 'behzat-c', tr: { name: 'Akbaba', trait: 'Olay yeri uzmanı' }, en: { name: 'Akbaba', trait: 'Crime-scene veteran' }, power: 3, estimatedValue: 2, tags: ['behzat-c'] },
      { id: 'burhan', series: 'avrupa-yakasi', tr: { name: 'Burhan Altıntop', trait: 'Her ortamın olay karakteri' }, en: { name: 'Burhan Altintop', trait: 'The scene-stealer in every room' }, power: 4, estimatedValue: 4, tags: ['avrupa-yakasi'] },
      { id: 'sahika', series: 'avrupa-yakasi', tr: { name: 'Şahika Koçarslanlı', trait: 'Avrupa Yakası’nın ikonik ismi' }, en: { name: 'Sahika Kocarslanli', trait: 'An icon of Avrupa Yakasi' }, power: 4, estimatedValue: 3, tags: ['avrupa-yakasi'] },
      { id: 'volkan', series: 'avrupa-yakasi', tr: { name: 'Volkan Sütçüoğlu', trait: 'Müzik ve komedi bir arada' }, en: { name: 'Volkan Sutcuoglu', trait: 'Music and comedy in one package' }, power: 3, estimatedValue: 3, tags: ['avrupa-yakasi'] },
      { id: 'hurrem', series: 'muhtesem-yuzyil', tr: { name: 'Hürrem Sultan', trait: 'Sarayın dengelerini değiştiren' }, en: { name: 'Hurrem Sultan', trait: 'A force that reshapes the palace' }, power: 5, estimatedValue: 5, tags: ['muhtesem-yuzyil'] },
      { id: 'kanuni', series: 'muhtesem-yuzyil', tr: { name: 'Kanuni Sultan Süleyman', trait: 'İmparatorluğun hükümdarı' }, en: { name: 'Suleiman the Magnificent', trait: 'Ruler of an empire' }, power: 5, estimatedValue: 5, tags: ['muhtesem-yuzyil'] },
      { id: 'ibrahim', series: 'muhtesem-yuzyil', tr: { name: 'Pargalı İbrahim Paşa', trait: 'Güçlü vezir, karmaşık kader' }, en: { name: 'Pargali Ibrahim Pasha', trait: 'Powerful vizier, complicated fate' }, power: 4, estimatedValue: 4, tags: ['muhtesem-yuzyil'] },
      { id: 'yamac', series: 'cukur', tr: { name: 'Yamaç Koçovalı', trait: 'Mahallesi için her şeyi göze alır' }, en: { name: 'Yamac Kocovali', trait: 'Would risk anything for his neighborhood' }, power: 5, estimatedValue: 5, tags: ['cukur'] },
      { id: 'vartolu', series: 'cukur', tr: { name: 'Vartolu Sadettin', trait: 'Sert kabuk, derin hikâye' }, en: { name: 'Vartolu Sadettin', trait: 'Tough exterior, deep story' }, power: 4, estimatedValue: 4, tags: ['cukur'] },
      { id: 'idris', series: 'cukur', tr: { name: 'İdris Koçovalı', trait: 'Koçovalı ailesinin reisi' }, en: { name: 'Idris Kocovali', trait: 'Head of the Kocovali family' }, power: 4, estimatedValue: 4, tags: ['cukur'] },
      { id: 'mecnun', series: 'leyla-mecnun', tr: { name: 'Mecnun Çınar', trait: 'Aşkı ve absürtlüğü birlikte yaşar' }, en: { name: 'Mecnun Cinar', trait: 'Lives love and absurdity together' }, power: 4, estimatedValue: 4, tags: ['leyla-mecnun'] },
      { id: 'ismail-abi', series: 'leyla-mecnun', tr: { name: 'İsmail Abi', trait: 'Bir gemi bekler, umudunu kesmez' }, en: { name: 'Ismail Abi', trait: 'Waits for a ship and never gives up hope' }, power: 4, estimatedValue: 3, tags: ['leyla-mecnun'] },
      { id: 'yavuz', series: 'leyla-mecnun', tr: { name: 'Yavuz', trait: 'Mahallenin kendi usulü kahramanı' }, en: { name: 'Yavuz', trait: 'The neighborhood’s own kind of hero' }, power: 3, estimatedValue: 3, tags: ['leyla-mecnun'] },
    ],
  },
  survival: {
    tr: 'Kıyamet Sonrası Hayatta Kalma', en: 'Apocalypse Survival Kit',
    trRule: 'Saldırı, barınma, tıbbi yardım ve erzak rollerinin dördünü de toplayan dengeli set +8 puan; her tamamlanan ikili uzmanlık seti +3 puan.',
    enRule: 'A balanced kit with attack, shelter, medical and supplies scores +8; each completed two-item specialty set scores +3.',
    repeatTagBonus: 0,
    setBonuses: [
      { id: 'balanced-kit', tr: { name: 'Dört dörtlük ekipman', description: 'Saldırı + barınma + tıbbi + erzak' }, en: { name: 'All-round kit', description: 'Attack + shelter + medical + supplies' }, requirements: { attack: 1, shelter: 1, medical: 1, supplies: 1 }, points: 8 },
      { id: 'defense-kit', tr: { name: 'Savunma ikilisi', description: 'Saldırı + barınma' }, en: { name: 'Defense duo', description: 'Attack + shelter' }, requirements: { attack: 1, shelter: 1 }, points: 3 },
      { id: 'care-kit', tr: { name: 'İlk yardım ikilisi', description: 'Tıbbi + erzak' }, en: { name: 'Care duo', description: 'Medical + supplies' }, requirements: { medical: 1, supplies: 1 }, points: 3 },
    ],
    items: [
      { id: 'bat', tr: { name: 'Beyzbol Sopası', trait: 'Yakın mesafe savunma' }, en: { name: 'Baseball Bat', trait: 'Close-range defense' }, power: 2, estimatedValue: 1, tags: ['attack'] },
      { id: 'canned-food', tr: { name: 'Teneke Kutu Konserve', trait: 'Uzun ömürlü erzak' }, en: { name: 'Canned Food', trait: 'Long-lasting supplies' }, power: 2, estimatedValue: 1, tags: ['supplies'] },
      { id: 'swiss-knife', tr: { name: 'İsviçre Çakısı', trait: 'Çok amaçlı alet' }, en: { name: 'Swiss Army Knife', trait: 'Multi-purpose tool' }, power: 3, estimatedValue: 2, tags: ['attack', 'supplies'] },
      { id: 'armored-car', tr: { name: 'Zırhlı Araç', trait: 'Güvenli ulaşım ve mobil sığınak' }, en: { name: 'Armored Vehicle', trait: 'Safe transport and mobile shelter' }, power: 5, estimatedValue: 8, tags: ['shelter', 'transport'] },
      { id: 'first-aid', tr: { name: 'İlk Yardım Çantası', trait: 'Acil müdahale' }, en: { name: 'First Aid Kit', trait: 'Emergency care' }, power: 4, estimatedValue: 4, tags: ['medical'] },
      { id: 'water-filter', tr: { name: 'Su Filtresi', trait: 'Temiz içme suyu' }, en: { name: 'Water Filter', trait: 'Clean drinking water' }, power: 3, estimatedValue: 3, tags: ['supplies'] },
      { id: 'tent', tr: { name: 'Dört Mevsim Çadır', trait: 'Hava koşullarına karşı barınak' }, en: { name: 'All-weather Tent', trait: 'Shelter from the elements' }, power: 3, estimatedValue: 4, tags: ['shelter'] },
      { id: 'radio', tr: { name: 'El Telsizi', trait: 'Ekip iletişimi' }, en: { name: 'Handheld Radio', trait: 'Team communication' }, power: 3, estimatedValue: 3, tags: ['supplies', 'shelter'] },
      { id: 'flashlight', tr: { name: 'El Feneri ve Pil Seti', trait: 'Karanlıkta görüş' }, en: { name: 'Flashlight and Batteries', trait: 'Visibility in the dark' }, power: 2, estimatedValue: 2, tags: ['supplies'] },
      { id: 'helmet', tr: { name: 'Koruyucu Kask', trait: 'Baş koruması' }, en: { name: 'Protective Helmet', trait: 'Head protection' }, power: 3, estimatedValue: 3, tags: ['attack', 'shelter'] },
    ],
  },
  worklife: {
    tr: 'Üniversite & Ofis Kaosu', en: 'Campus & Office Chaos',
    trRule: 'Tam donanımlı çalışma alanı (kahve + kulaklık + notlar) +7; tükenmişlik seti (kahve + enerji içeceği + son gece notları) +6 puan.',
    enRule: 'A fully equipped workspace (coffee + headphones + notes) scores +7; a burnout combo (coffee + energy drink + all-nighter notes) scores +6.',
    repeatTagBonus: 0,
    setBonuses: [
      { id: 'workstation', tr: { name: 'Tam donanımlı çalışma alanı', description: 'Kahve + kulaklık + çalışma notları' }, en: { name: 'Fully equipped workspace', description: 'Coffee + headphones + study notes' }, requirements: { coffee: 1, headphones: 1, notes: 1 }, points: 7 },
      { id: 'burnout', tr: { name: 'Tükenmişlik kombosu', description: 'Kahve + enerji içeceği + son gece notları' }, en: { name: 'Burnout combo', description: 'Coffee + energy drink + all-nighter notes' }, requirements: { coffee: 1, energy: 1, notes: 1 }, points: 6 },
      { id: 'deadline', tr: { name: 'Teslim günü kurtarıcısı', description: 'Kulaklık + enerji içeceği' }, en: { name: 'Deadline survival duo', description: 'Headphones + energy drink' }, requirements: { headphones: 1, energy: 1 }, points: 3 },
    ],
    items: [
      { id: 'filter-coffee', tr: { name: '3. Nesil Filtre Kahve', trait: 'Odak açan demleme' }, en: { name: 'Third-wave Filter Coffee', trait: 'Focus-boosting brew' }, power: 3, estimatedValue: 2, tags: ['coffee', 'focus'] },
      { id: 'energy-drink', tr: { name: 'Enerji İçeceği', trait: 'Son teslim öncesi turbo' }, en: { name: 'Energy Drink', trait: 'Deadline turbo boost' }, power: 2, estimatedValue: 1, tags: ['energy', 'focus'] },
      { id: 'headphones', tr: { name: 'Gürültü Önleyici Kulaklık', trait: 'Açık ofisi sessize al' }, en: { name: 'Noise-cancelling Headphones', trait: 'Mute the open office' }, power: 5, estimatedValue: 5, tags: ['headphones', 'focus'] },
      { id: 'all-nighter-notes', tr: { name: 'Son Gece Çalışma Notları', trait: 'Bir gecede dönem kurtar' }, en: { name: 'All-nighter Study Notes', trait: 'Save the semester overnight' }, power: 4, estimatedValue: 3, tags: ['notes', 'deadline'] },
      { id: 'planner', tr: { name: 'Renk Kodlu Ajanda', trait: 'Kaosu takvime sığdır' }, en: { name: 'Color-coded Planner', trait: 'Fit chaos into a calendar' }, power: 3, estimatedValue: 3, tags: ['notes', 'focus'] },
      { id: 'portable-charger', tr: { name: 'Taşınabilir Şarj Aleti', trait: 'Dersin ortasında pil bitmesin' }, en: { name: 'Portable Charger', trait: 'Never run out mid-lecture' }, power: 3, estimatedValue: 2, tags: ['supplies'] },
      { id: 'snack-stash', tr: { name: 'Acil Atıştırmalık Stoğu', trait: 'Kütüphane molası cebinde' }, en: { name: 'Emergency Snack Stash', trait: 'A study break in your pocket' }, power: 2, estimatedValue: 1, tags: ['supplies', 'energy'] },
      { id: 'desk-lamp', tr: { name: 'Masa Lambası', trait: 'Gece mesaisine ışık tutar' }, en: { name: 'Desk Lamp', trait: 'Light up the late shift' }, power: 2, estimatedValue: 2, tags: ['workspace'] },
      { id: 'coffee-card', tr: { name: 'Kahveci Sadakat Kartı', trait: 'Her altıncı kahve bedava' }, en: { name: 'Coffee Shop Loyalty Card', trait: 'Every sixth coffee is free' }, power: 2, estimatedValue: 2, tags: ['coffee', 'supplies'] },
      { id: 'whiteboard', tr: { name: 'Mini Beyaz Tahta', trait: 'Fikirleri görünür kıl' }, en: { name: 'Mini Whiteboard', trait: 'Make ideas visible' }, power: 3, estimatedValue: 3, tags: ['workspace', 'notes'] },
    ],
  },
};
