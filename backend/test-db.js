// Test Supabase Connection
const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function test() {
    try {
        console.log('🔌 Connecting to Supabase...');
        await client.connect();
        console.log('✅ Connected!');

        // Test query
        const result = await client.query('SELECT COUNT(*) FROM games');
        console.log(`✅ Found ${result.rows[0].count} games in database!`);

        // List games
        const games = await client.query('SELECT id, name, icon FROM games LIMIT 5');
        console.log('\n🎮 Sample games:');
        games.rows.forEach(g => console.log(`  - ${g.icon} ${g.name}`));

        await client.end();
        console.log('\n✅ Database is working perfectly!');
        console.log('🚀 Now you can start the backend: npm run dev');
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

test();
