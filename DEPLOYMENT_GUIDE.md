# 🚀 FriendGames Deployment Rehberi

Bu rehber, FriendGames'i production'a deploy etmek için gereken tüm adımları içerir.

## 📋 İçindekiler

1. [Backend Deployment (Render + Supabase)](#backend-deployment)
2. [Mobile Build (Expo EAS)](#mobile-build)
3. [Play Store Yayınlama](#play-store)
4. [Post-Deployment](#post-deployment)

---

## 1. Backend Deployment

### A) Supabase Setup (Ücretsiz Database)

#### 1.1. Hesap Oluştur
```
1. https://supabase.com adresine git
2. "Start your project" tıkla
3. GitHub ile giriş yap
4. New Project oluştur
   - Name: friendgames
   - Database Password: Güçlü bir şifre (kaydet!)
   - Region: Singapore (en yakın)
5. Projenin hazır olmasını bekle (2-3 dakika)
```

#### 1.2. Database URL'i Al
```
1. Settings > Database > Connection string
2. "URI" sekmesini seç
3. Connection string'i kopyala:
   postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
4. [YOUR-PASSWORD] kısmını şifrenle değiştir
```

#### 1.3. SQL Editor'de Tabloları Oluştur
```sql
-- Supabase Dashboard > SQL Editor > New Query

-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  vip_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Games Table
CREATE TABLE games (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  icon VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  category_label VARCHAR(100) NOT NULL,
  min_players INTEGER NOT NULL,
  max_players INTEGER NOT NULL,
  min_time INTEGER NOT NULL,
  max_time INTEGER NOT NULL,
  description TEXT NOT NULL,
  is_vip BOOLEAN DEFAULT FALSE,
  engine VARCHAR(50) NOT NULL,
  rules TEXT[] NOT NULL,
  badges TEXT[] NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Questions Table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_pool VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabu Cards Table
CREATE TABLE tabu_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  main_word VARCHAR(100) NOT NULL,
  banned_words TEXT[] NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Favorites Table
CREATE TABLE user_favorites (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  game_id VARCHAR(50) REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, game_id)
);

-- VIP Purchases Table
CREATE TABLE vip_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  product_id VARCHAR(100) NOT NULL,
  purchased_at TIMESTAMP NOT NULL,
  expires_at TIMESTAMP,
  revenuecat_customer VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_questions_pool ON questions(game_pool);
CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_vip_purchases_user ON vip_purchases(user_id);

-- Run this query
```

#### 1.4. Seed Data Ekle
```sql
-- Games
INSERT INTO games (id, name, icon, category, category_label, min_players, max_players, min_time, max_time, description, is_vip, engine, rules, badges) VALUES
('1', 'Kim Daha Çok?', '🤔', 'buz-kirici', 'Buz Kırıcı', 2, 20, 10, 30, 'Grupta kim daha çok... sorularıyla birbirinizi tanıyın!', false, 'question', ARRAY['Soru okunur ve herkes aynı anda tahmin ettiği kişiye işaret eder', 'En çok işaret edilen kişi kazanır'], ARRAY['Popüler', 'Kolay', 'Hızlı']),
('2', 'Tabu', '🚫', 'kelime', 'Kelime Oyunu', 4, 20, 20, 60, 'Yasaklı kelimeleri kullanmadan kelimeyi anlat!', true, 'tabu', ARRAY['Kartı çeken kişi yasaklı kelimeler hariç kelimeyi anlatır', '60 saniye içinde doğru tahmin edilirse puan'], ARRAY['VIP', 'Zor', 'Takım']),
('3', 'Vampir Köy', '🧛', 'gizli-rol', 'Gizli Rol', 5, 15, 15, 45, 'Vampirleri bul, köyü kurtar!', true, 'vampir', ARRAY['Her oyuncuya gizli bir rol verilir', 'Gece vampirler bir köylüyü öldürür'], ARRAY['VIP', 'Strateji']);

-- Questions
INSERT INTO questions (game_pool, content) VALUES
('kim-daha-cok', 'Kim daha çok geç kalır?'),
('kim-daha-cok', 'Kim daha çok yemek yer?'),
('kim-daha-cok', 'Kim daha çok konuşur?');

-- Tabu Cards
INSERT INTO tabu_cards (main_word, banned_words) VALUES
('Telefon', ARRAY['Aramak', 'Cep', 'Mobil', 'iPhone', 'Samsung']),
('Futbol', ARRAY['Top', 'Gol', 'Oyun', 'Maç', 'Takım']),
('Kahve', ARRAY['İçecek', 'Starbucks', 'Kahvaltı', 'Türk', 'Sıcak']);
```

### B) Render Setup (Ücretsiz Backend Hosting)

#### 1.5. Hesap Oluştur
```
1. https://render.com adresine git
2. "Get Started for Free" tıkla
3. GitHub ile giriş yap
```

#### 1.6. Backend Repository'yi Render'a Bağla
```
1. Dashboard > New > Web Service
2. "Build and deploy from a Git repository"
3. GitHub repository seç (friendgames-main)
4. Ayarlar:
   - Name: friendgames-api
   - Region: Singapore (yakın)
   - Branch: main
   - Root Directory: backend
   - Runtime: Node
   - Build Command: npm install && npm run build
   - Start Command: npm start
   - Instance Type: Free
```

#### 1.7. Environment Variables Ekle
```
Render Dashboard > Environment > Environment Variables

PORT=3000
NODE_ENV=production
DATABASE_URL=[SUPABASE-DATABASE-URL]
JWT_SECRET=[RANDOM-STRONG-SECRET]
JWT_EXPIRES_IN=7d
REVENUECAT_WEBHOOK_SECRET=[YOUR-REVENUECAT-SECRET]
```

**JWT_SECRET Oluşturma:**
```bash
# PowerShell'de çalıştır:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

#### 1.8. Deploy Et
```
1. "Create Web Service" tıkla
2. Deployment başlayacak (5-10 dakika)
3. Deploy tamamlanınca URL'i al:
   https://friendgames-api.onrender.com
```

#### 1.9. Backend'i Test Et
```bash
# Health check
curl https://friendgames-api.onrender.com/health

# Games endpoint
curl https://friendgames-api.onrender.com/api/games
```

### C) Backend Kod Güncellemeleri

#### 1.10. Mock Mode'u Kapat
```bash
cd backend/src
```

**index.ts** güncellemesi:
```typescript
// ŞU SATIRI:
// await runMigrations();

// BUNA ÇEVİR:
await runMigrations();

// VE ŞU SATIRLARI SİL:
console.log('⚠️  Running in MOCK mode (database disabled)');
console.log(`   MODE: MOCK (database disabled)`);
```

**Controller'ları Güncelle:**
Her controller'da mock import'u yorum yap, pool import'u aç:
```typescript
// auth.controller.ts, games.controller.ts, user.controller.ts, vip.controller.ts

// ŞU SATIRI:
import { findUserByEmail, createUser } from '../data/mockData';

// BUNA ÇEVİR:
// import { findUserByEmail, createUser } from '../data/mockData';
import { pool } from '../db/pool';
```

#### 1.11. Git Push
```bash
cd backend
git add .
git commit -m "Production ready: Database enabled"
git push origin main
```

Render otomatik olarak yeni deploy başlatacak.

---

## 2. Mobile Build

### A) Expo EAS Setup

#### 2.1. EAS CLI Yükle
```bash
npm install -g eas-cli
```

#### 2.2. Expo Hesabı Oluştur ve Giriş Yap
```bash
eas login
# Email ve şifre ile giriş yap
# Yoksa: https://expo.dev/signup
```

#### 2.3. Project ID Al
```bash
cd mobile
eas init
# Project name: friendgames
# Organization: kendi hesabın
```

Bu komut `app.json` içindeki `projectId`yi otomatik dolduracak.

#### 2.4. Production Environment Variables
```bash
# mobile/.env.production dosyası oluştur
EXPO_PUBLIC_API_URL=https://friendgames-api.onrender.com/api
```

#### 2.5. EAS Build Yapılandırması Güncelle
`eas.json` dosyası zaten hazır. Sadece API URL'ini güncelle:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "aab"
      },
      "env": {
        "EXPO_PUBLIC_API_URL": "https://friendgames-api.onrender.com/api"
      }
    }
  }
}
```

### B) App Icon ve Splash Oluşturma

#### 2.6. Icon Generator'ı Aç
```bash
cd mobile/assets
start icon-generator.html
```

**Her bir canvas'tan indir:**
1. icon.png (1024x1024) -> `mobile/assets/icon.png`
2. adaptive-icon.png (1024x1024) -> `mobile/assets/adaptive-icon.png`
3. splash.png (1284x2778) -> `mobile/assets/splash.png`

**Favicon oluştur:**
```bash
# icon.png'yi 32x32 yap ve favicon.png olarak kaydet
```

### C) Production Build

#### 2.7. Android Build (AAB)
```bash
cd mobile

# İlk build (signing key oluşturur)
eas build --platform android --profile production

# Sorulacaklar:
# "Generate a new Android Keystore?" -> YES
# "Commit changes?" -> YES
```

Build 10-20 dakika sürer. Tamamlanınca:
```
✅ Build finished
📦 Download: https://expo.dev/accounts/.../builds/...
```

AAB dosyasını indir.

#### 2.8. Test APK (Opsiyonel)
```bash
# Preview build (APK - test için)
eas build --platform android --profile preview
```

APK'yı indir ve test cihazında yükle.

---

## 3. Play Store Yayınlama

### A) Google Play Console Hazırlığı

#### 3.1. Developer Hesabı Oluştur
```
1. https://play.google.com/console
2. Google hesabıyla giriş yap
3. Developer kaydı yap ($25 tek seferlik ücret)
4. Kimlik doğrulama (pasaport/ehliyet)
```

#### 3.2. Yeni Uygulama Oluştur
```
1. Play Console > Create app
2. App name: FriendGames
3. Default language: Türkçe (Türkiye)
4. App/Game: App
5. Free/Paid: Free
6. Declarations: Tüm checkboxları işaretle
7. Create app
```

### B) Store Listing

#### 3.3. App Details
```
Dashboard > Store presence > Main store listing

App name: FriendGames - Parti Oyunları
Short description: [PLAY_STORE_LISTING.md'den kopyala]
Full description: [PLAY_STORE_LISTING.md'den kopyala]

App icon: icon.png (512x512 yükle)
Feature graphic: [Photoshop/Canva ile oluştur - 1024x500]

Phone screenshots: [En az 2 tane, emulator'dan çek]
  - games-screen.png
  - game-detail.png
  
Video link: (opsiyonel, sonra eklenebilir)
```

#### 3.4. Store Settings
```
Dashboard > Store presence > Store settings

Category: Games > Board
Tags: party game, board game, social

Contact details:
- Email: support@friendgames.app
- Website: https://friendgames.app
- Privacy policy: https://friendgames.app/privacy
```

### C) Content Rating

#### 3.5. Rating Anketi
```
Dashboard > Policy > App content > Content rating

Start questionnaire:
- Email: [email]
- Category: Games
- Violence: None
- Sexuality: None
- Language: None
- Controlled Substances: None
- Interactive elements: Digital purchases
- Share location: No
- Personal info: Email addresses

Submit for rating
```

### D) Release

#### 3.6. Production Release
```
Dashboard > Release > Production

Create new release:
1. Upload: friendgames.aab (EAS'den indirilen)
2. Release name: 1.0.0 (10)
3. Release notes:
   - Türkçe: [PLAY_STORE_LISTING.md'den kopyala]
   - English: [PLAY_STORE_LISTING.md'den kopyala]
4. Review and roll out
```

#### 3.7. Review Süreci
```
⏳ In review: 1-3 gün
✅ Approved: Yayında!
❌ Rejected: Düzelt ve tekrar gönder
```

---

## 4. Post-Deployment

### A) Monitoring

#### 4.1. Backend Monitoring
```
Render Dashboard > friendgames-api > Logs
- HTTP requests log'larını izle
- Error log'larına dikkat et
- Response time'ları kontrol et
```

#### 4.2. Database Monitoring
```
Supabase Dashboard > Database > Query Performance
- Slow query'leri bul
- Index ekle gerekirse
```

### B) Analytics (Opsiyonel ama önerilir)

#### 4.3. Firebase Analytics
```bash
# Mobile'a ekle
npm install @react-native-firebase/app @react-native-firebase/analytics

# Firebase Console'da proje oluştur
# google-services.json indir
# Rebuild et
```

#### 4.4. Sentry Crash Reporting
```bash
# Backend
npm install @sentry/node

# Mobile
npm install @sentry/react-native
```

### C) Updates

#### 4.5. OTA Updates (Over-The-Air)
```bash
# Kod değişikliklerini hızlı deploy et (store approval gerekmez)
cd mobile
eas update --branch production --message "Bug fixes"
```

#### 4.6. New Build (Native kod değişti)
```bash
# Version güncelle: app.json > version: "1.0.1"
eas build --platform android --profile production
# Yeni AAB'ı Play Console'a yükle
```

---

## 📊 Deployment Checklist

### Backend
- [x] Supabase hesabı oluşturuldu
- [x] Database tabloları oluşturuldu
- [x] Seed data eklendi
- [x] Render hesabı oluşturuldu
- [x] Backend deploy edildi
- [x] Environment variables ayarlandı
- [x] Health check test edildi
- [ ] Production'da test et

### Mobile
- [x] EAS CLI kuruldu
- [x] Expo hesabı oluşturuldu
- [x] Project init edildi
- [x] Icon ve splash oluşturuldu
- [x] app.json güncellendi
- [x] eas.json yapılandırıldı
- [ ] Production build al
- [ ] Test cihazında test et

### Play Store
- [ ] Developer hesabı oluştur ($25)
- [ ] Uygulama oluştur
- [ ] Store listing doldur
- [ ] Screenshots ekle
- [ ] Content rating tamamla
- [ ] AAB yükle
- [ ] Review için gönder

### Post-Launch
- [ ] Analytics kur
- [ ] Crash reporting aktif et
- [ ] Monitoring kur
- [ ] Backup planı yap
- [ ] Update stratejisi belirle

---

## 🆘 Troubleshooting

### Build Hatası
```bash
# Cache temizle
cd mobile
rm -rf node_modules
npm install

# EAS cache temizle
eas build --clear-cache
```

### Backend Hatası
```bash
# Render logs'u kontrol et
# Supabase connection string'i doğru mu?
# Environment variables doğru mu?
```

### Play Store Reject
```
Genellikle:
- Privacy policy eksik
- Screenshot kalitesiz
- Content rating yanlış
- Permissions açıklaması eksik

Düzelt ve tekrar gönder.
```

---

## ✅ Production Ready!

**Tüm adımlar tamamlandığında:**
- ✅ Backend production'da çalışıyor
- ✅ Database hazır ve dolu
- ✅ Mobile app build alındı
- ✅ Play Store'da yayında

**Kullanıcılar:**
1. Play Store'dan indirecek
2. Kayıt olacak/Giriş yapacak
3. Oyunları oynayacak
4. VIP satın alacak
5. 5⭐ review bırakacak!

🎉 **Tebrikler, live'sın!**
