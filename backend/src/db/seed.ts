import { pool } from './pool';
import { mockGames, mockQuestions, mockTabuCards } from '../data/mockData';

export async function runSeed() {
  const client = await pool.connect();
  try {
    console.log('🌱 Starting seed...');

    // Games - Mock data'daki tüm oyunları ekle
    for (const g of mockGames) {
      await client.query(
        `INSERT INTO games
           (id, name, icon, category, category_label, min_players, max_players,
            min_time, max_time, description, is_vip, engine, rules, badges)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
         ON CONFLICT (id) DO UPDATE SET
           name = EXCLUDED.name,
           icon = EXCLUDED.icon,
           category = EXCLUDED.category,
           category_label = EXCLUDED.category_label,
           min_players = EXCLUDED.min_players,
           max_players = EXCLUDED.max_players,
           min_time = EXCLUDED.min_time,
           max_time = EXCLUDED.max_time,
           description = EXCLUDED.description,
           is_vip = EXCLUDED.is_vip,
           engine = EXCLUDED.engine,
           rules = EXCLUDED.rules,
           badges = EXCLUDED.badges`,
        [g.id, g.name, g.icon, g.category, g.category_label,
        g.min_players, g.max_players, g.min_time, g.max_time,
        g.description, g.is_vip, g.engine,
        JSON.stringify(g.rules), JSON.stringify(g.badges)]
      );
    }
    console.log(`✅ Seeded ${mockGames.length} games`);

    // Questions
    for (const q of mockQuestions) {
      await client.query(
        `INSERT INTO questions (game_pool, content, is_active) 
         VALUES ($1, $2, $3)`,
        [q.game_pool, q.content, q.is_active]
      );
    }
    console.log(`✅ Seeded ${mockQuestions.length} questions`);

    // Tabu cards
    for (const t of mockTabuCards) {
      await client.query(
        `INSERT INTO tabu_cards (main_word, banned_words, is_active) 
         VALUES ($1, $2, $3)`,
        [t.main_word, JSON.stringify(t.banned_words), t.is_active]
      );
    }
    console.log(`✅ Seeded ${mockTabuCards.length} tabu cards`);

    console.log('🎉 Seed completed successfully!');
  } catch (err) {
    console.error('❌ Seed error:', err);
    throw err;
  } finally {
    client.release();
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('Done!');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Seed failed:', err);
      process.exit(1);
    });
}
