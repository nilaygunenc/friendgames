#!/usr/bin/env node

/**
 * FriendGames Database Setup Script
 * 
 * Bu script veritabanını otomatik kurar ve test verileri ile doldurur.
 * 
 * Kullanım:
 *   node setup-database.js
 */

const { execSync } = require('child_process');
const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

function exec(command, options = {}) {
    try {
        console.log(`\n🔄 Running: ${command}\n`);
        execSync(command, { stdio: 'inherit', ...options });
        return true;
    } catch (err) {
        console.error(`\n❌ Error running: ${command}`);
        return false;
    }
}

function updateEnvFile(databaseUrl) {
    const envPath = path.join(__dirname, '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Find and replace DATABASE_URL line
    const regex = /^# DATABASE_URL=.*$/m;
    if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `DATABASE_URL=${databaseUrl}`);
    } else {
        // Add DATABASE_URL if not exists
        envContent += `\nDATABASE_URL=${databaseUrl}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env dosyası güncellendi!');
}

async function main() {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║     🎮 FriendGames Database Setup                           ║
║                                                              ║
║     Bu script veritabanını kuracak ve test verisi           ║
║     yükleyecek (12 oyun + 100+ soru + 50+ tabu)             ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
`);

    // Check if .env exists
    const envPath = path.join(__dirname, '.env');
    if (!fs.existsSync(envPath)) {
        console.log('❌ .env dosyası bulunamadı!');
        console.log('📝 Lütfen .env.example dosyasını .env olarak kopyalayın.');
        process.exit(1);
    }

    console.log('\n📋 Seçenekler:\n');
    console.log('1. Supabase (Önerilen - Ücretsiz, kolay)');
    console.log('2. Neon.tech (Alternatif - Ücretsiz)');
    console.log('3. Local PostgreSQL');
    console.log('4. Zaten var, sadece migrate + seed çalıştır');
    console.log('5. Çıkış\n');

    const choice = await question('Seçiminiz (1-5): ');

    switch (choice) {
        case '1':
            console.log('\n🚀 Supabase Kurulum:\n');
            console.log('1. https://supabase.com adresine git');
            console.log('2. GitHub ile giriş yap');
            console.log('3. "New Project" oluştur');
            console.log('4. Project Settings → Database → Connection String (URI) kopyala\n');

            const supabaseUrl = await question('Supabase connection string\'i yapıştır: ');
            if (supabaseUrl.trim()) {
                updateEnvFile(supabaseUrl.trim());
                console.log('\n✅ Database URL kaydedildi!');
            }
            break;

        case '2':
            console.log('\n🚀 Neon Kurulum:\n');
            console.log('1. https://neon.tech adresine git');
            console.log('2. GitHub ile giriş yap');
            console.log('3. "Create a project"');
            console.log('4. Connection string kopyala\n');

            const neonUrl = await question('Neon connection string\'i yapıştır: ');
            if (neonUrl.trim()) {
                updateEnvFile(neonUrl.trim());
                console.log('\n✅ Database URL kaydedildi!');
            }
            break;

        case '3':
            console.log('\n🚀 Local PostgreSQL:\n');
            console.log('Örnek: postgresql://postgres:password@localhost:5432/friendgames\n');

            const localUrl = await question('Local connection string: ');
            if (localUrl.trim()) {
                updateEnvFile(localUrl.trim());
                console.log('\n✅ Database URL kaydedildi!');
            }
            break;

        case '4':
            console.log('\n✅ Mevcut database kullanılacak.');
            break;

        case '5':
            console.log('\n👋 Çıkılıyor...');
            rl.close();
            process.exit(0);

        default:
            console.log('\n❌ Geçersiz seçim!');
            rl.close();
            process.exit(1);
    }

    console.log('\n─────────────────────────────────────────────────────────\n');
    console.log('📦 Dependencies kontrol ediliyor...\n');

    // Check if node_modules exists
    if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
        console.log('📦 node_modules bulunamadı, yükleniyor...');
        if (!exec('npm install')) {
            console.log('\n❌ npm install başarısız!');
            rl.close();
            process.exit(1);
        }
    } else {
        console.log('✅ Dependencies mevcut.');
    }

    console.log('\n─────────────────────────────────────────────────────────\n');
    console.log('🗄️  Database migration başlatılıyor...\n');

    if (!exec('npm run db:migrate')) {
        console.log('\n❌ Migration başarısız!');
        console.log('💡 .env dosyasındaki DATABASE_URL\'i kontrol edin.');
        rl.close();
        process.exit(1);
    }

    console.log('\n✅ Migration tamamlandı!\n');
    console.log('─────────────────────────────────────────────────────────\n');
    console.log('🌱 Test verisi yükleniyor...\n');

    if (!exec('npm run db:seed')) {
        console.log('\n❌ Seed başarısız!');
        rl.close();
        process.exit(1);
    }

    console.log('\n─────────────────────────────────────────────────────────\n');
    console.log('🎉 BAŞARILI! Database hazır!\n');
    console.log('✅ 12 oyun yüklendi');
    console.log('✅ 100+ soru eklendi');
    console.log('✅ 50+ tabu kartı eklendi\n');
    console.log('─────────────────────────────────────────────────────────\n');
    console.log('📝 Sonraki adımlar:\n');
    console.log('1. Admin kullanıcısı oluştur:');
    console.log('   .env dosyasına: ADMIN_EMAILS=senin@emailin.com\n');
    console.log('2. Backend\'i başlat:');
    console.log('   npm run dev\n');
    console.log('3. Admin panel\'e giriş yap:');
    console.log('   http://localhost:3000/admin/admin.html\n');
    console.log('─────────────────────────────────────────────────────────\n');

    rl.close();
}

main().catch(err => {
    console.error('\n❌ Hata:', err.message);
    rl.close();
    process.exit(1);
});
