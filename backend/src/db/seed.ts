import { pool } from './pool';

const games = [
  {
    id: 'vampir-koylu', name: 'Vampir-Köylü', icon: '🧛',
    category: 'gizli-rol', category_label: 'Gizli Rol',
    min_players: 5, max_players: 20, min_time: 20, max_time: 45,
    description: 'Kimsenin kimseye güvenemediği klasik dedektif oyunu.',
    is_vip: false, engine: 'vampir',
    rules: ['Herkes gözlerini kapatır.', 'Vampirler kurban seçer.', 'Gündüz tartışılır.', 'Vampirler yarıyı elerse kazanır.'],
    badges: [{ label: 'Popüler', color: 'pop' }, { label: 'Rol Oyunu', color: 'red' }],
  },
  {
    id: 'tabu', name: 'Tabu', icon: '🤐',
    category: 'kelime', category_label: 'Kelime & Anlatım',
    min_players: 4, max_players: 12, min_time: 15, max_time: 30,
    description: 'Yasak kelimeleri kullanmadan kelimeyi anlat.',
    is_vip: false, engine: 'tabu',
    rules: ['İki takıma ayrılın.', 'Kelimeyi anlat.', 'Tabu söylenirse puan gider.', 'En çok puan kazanır.'],
    badges: [{ label: 'Kelime', color: 'purple' }, { label: 'Hızlı', color: 'green' }],
  },
  {
    id: 'buz-kirici', name: 'Buz Kırıcı', icon: '🧊',
    category: 'buz-kirici', category_label: 'Buz Kırıcı',
    min_players: 2, max_players: 20, min_time: 10, max_time: 20,
    description: 'Sohbeti açan samimi soru kartları.',
    is_vip: false, engine: 'buz-kirici',
    rules: ['Kart çek, soruyu oku.', 'Önce soru sahibi cevaplar.', 'Pas denilebilir.'],
    badges: [{ label: 'Buz Kırıcı', color: 'green' }, { label: 'Kolay', color: 'purple' }],
  },
  {
    id: 'sirin-cani', name: 'Şirin mi Cani mi?', icon: '😇',
    category: 'friendgames', category_label: 'FriendGames Özel',
    min_players: 4, max_players: 15, min_time: 15, max_time: 30,
    description: 'İki seçenekli absürt sorular.',
    is_vip: true, engine: 'buz-kirici',
    rules: ['Kart çek, soruyu oku.', 'A veya B seç.', 'Azınlık açıklar.'],
    badges: [{ label: 'Özel', color: 'gold' }, { label: '18+', color: 'red' }],
  },
  {
    id: 'sinir-sorusu', name: 'Sınır Sorusu', icon: '🔥',
    category: 'friendgames', category_label: 'FriendGames Özel',
    min_players: 3, max_players: 12, min_time: 15, max_time: 30,
    description: 'Cesaret isteyen sorular.',
    is_vip: true, engine: 'buz-kirici',
    rules: ['Kart çek.', '"Cevaplarım" veya "Pas" de.', 'Dürüst cevap ver.'],
    badges: [{ label: 'Özel', color: 'gold' }, { label: 'Cesur', color: 'red' }],
  },
];

const questions = [
  { game_pool: 'buz-kirici', content: 'Çocukken olmak istediğin meslek neydi?' },
  { game_pool: 'buz-kirici', content: 'Süper gücün olsaydı ne olmasını isterdin?' },
  { game_pool: 'buz-kirici', content: 'Telefonsuz bir hafta geçirebilir misin?' },
  { game_pool: 'buz-kirici', content: 'En garip yemek kombinasyonu nedir?' },
  { game_pool: 'sinir-sorusu', content: 'En son kime yalan söyledin?' },
  { game_pool: 'sinir-sorusu', content: 'En utanç verici anın neydi?' },
  { game_pool: 'kim-daha-cok', content: 'Sabah en son uyanan?' },
  { game_pool: 'kim-daha-cok', content: 'En fazla emoji kullanan?' },
];

const tabuCards = [
  { main_word: 'ELMA',    banned_words: ['Meyve', 'Ağaç', 'Kırmızı', 'Yemek', 'Bahçe'] },
  { main_word: 'DENİZ',   banned_words: ['Su', 'Kumsal', 'Dalga', 'Balık', 'Yüzmek'] },
  { main_word: 'UÇAK',    banned_words: ['Pilot', 'Hava', 'Kanat', 'Yolculuk', 'Havalimanı'] },
  { main_word: 'TELEFON', banned_words: ['Cep', 'Arayan', 'Ekran', 'Akıllı', 'Uygulama'] },
];

export async function runSeed() {
  const client = await pool.connect();
  try {
    // Games
    for (const g of games) {
      await client.query(
        `INSERT INTO games
           (id, name, icon, category, category_label, min_players, max_players,
            min_time, max_time, description, is_vip, engine, rules, badges)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO NOTHING`,
        [g.id, g.name, g.icon, g.category, g.category_label,
         g.min_players, g.max_players, g.min_time, g.max_time,
         g.description, g.is_vip, g.engine,
         JSON.stringify(g.rules), JSON.stringify(g.badges)]
      );
    }

    // Questions
    for (const q of questions) {
      await client.query(
        `INSERT INTO questions (game_pool, content) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [q.game_pool, q.content]
      );
    }

    // Tabu cards
    for (const t of tabuCards) {
      await client.query(
        `INSERT INTO tabu_cards (main_word, banned_words) VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [t.main_word, JSON.stringify(t.banned_words)]
      );
    }

    console.log('✅ Seed completed');
  } finally {
    client.release();
  }
}
