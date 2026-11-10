# 🗄️ FriendGames Database Setup

## Genel Bakış

FriendGames projesi PostgreSQL veritabanı kullanır. Veritabanı bağlantısı yoksa sistem otomatik olarak **mock data** modunda çalışır.

## 📋 Özellikler

- ✅ **6 Tablo**: users, games, questions, tabu_cards, user_favorites, vip_purchases
- ✅ **Admin Panel**: Oyunları web arayüzünden yönetme
- ✅ **Otomatik Migration**: Sunucu başlatıldığında tablolar otomatik oluşturulur
- ✅ **Seed Data**: 12 oyun, 100+ soru, 50+ tabu kartı
- ✅ **Mock Mode**: Veritabanı olmadan test ve geliştirme

## 🚀 Hızlı Başlangıç

### Adım 1: PostgreSQL Veritabanı Hazırlama

**Seçenek A - Online Veritabanı (Önerilen)**
```bash
# Ücretsiz PostgreSQL hizmeti al:
# - Supabase: https://supabase.com (500MB ücretsiz)
# - Neon: https://neon.tech (3GB ücretsiz)
# - ElephantSQL: https://www.elephantsql.com (20MB ücretsiz)
```

**Seçenek B - Yerel PostgreSQL**
```bash
# PostgreSQL indir ve yükle: https://www.postgresql.org/download/
# Veya Docker ile:
docker run --name friendgames-db -e POSTGRES_PASSWORD=mypassword -p 5432:5432 -d postgres
```

### Adım 2: .env Dosyasını Güncelle

```env
# backend/.env dosyasını düzenle:
DATABASE_URL=postgresql://kullanici:sifre@host:5432/veritabani

# Örnek - Supabase:
DATABASE_URL=postgresql://postgres.xxxxxxxxxxx:[email protected]:5432/postgres

# Örnek - Yerel:
DATABASE_URL=postgresql://postgres:mypassword@localhost:5432/friendgames
```

### Adım 3: Veritabanı Tablolarını Oluştur

```bash
cd backend

# Tabloları oluştur (migration)
npm run db:migrate

# Oyun verilerini ekle (seed)
npm run db:seed
```

### Adım 4: Sunucuyu Başlat

```bash
npm run dev
```

Çıktıda şunu görmelisiniz:
```
✅ Database migrations completed
🚀 FriendGames API running on http://localhost:3000
   ENV: development
   Database: Connected
```

## 🎮 Admin Panel Kullanımı

### Admin Kullanıcısı Oluşturma

**Yöntem 1 - Kayıt olup veritabanında güncelle:**
```sql
-- Önce normal kayıt ol (POST /api/auth/register)
-- Sonra PostgreSQL'de:
UPDATE users 
SET is_admin = true 
WHERE email = 'admin@friendgames.app';
```

**Yöntem 2 - Doğrudan veritabanına ekle:**
```sql
-- Şifre: admin123
INSERT INTO users (email, password_hash, display_name, is_admin)
VALUES (
  'admin@friendgames.app',
  '$2a$10$YourBcryptHashHere',
  'Admin',
  true
);
```

**Yöntem 3 - ADMIN_EMAILS listesi:**
```env
# .env dosyasına ekle:
ADMIN_EMAILS=admin@friendgames.app,yonetici@firma.com
```

### Admin Panel'e Giriş

1. Tarayıcıda aç: **http://localhost:3000/admin/admin.html**
2. Admin email ve şifren ile giriş yap
3. Artık oyunları yönetebilirsin!

### Admin Panel Özellikleri

- 📊 **İstatistikler**: Toplam oyun, kullanıcı, soru, tabu kartı sayıları
- 🎮 **Oyun Yönetimi**: 
  - Yeni oyun ekle
  - Oyunları düzenle
  - Oyunları sil
  - VIP durumunu değiştir
- ❓ **Soru Yönetimi**: (Yakında eklenecek)
- 🚫 **Tabu Kartları**: (Yakında eklenecek)

## 📦 Veritabanı Yapısı

### Users Tablosu
```sql
- id (UUID)
- email (TEXT, UNIQUE)
- password_hash (TEXT)
- display_name (TEXT)
- is_vip (BOOLEAN)
- is_admin (BOOLEAN)  ← Yeni eklendi!
- vip_expires_at (TIMESTAMPTZ)
- created_at (TIMESTAMPTZ)
```

### Games Tablosu
```sql
- id (TEXT, PRIMARY KEY)
- name (TEXT)
- icon (TEXT)
- category (TEXT)
- category_label (TEXT)
- min_players, max_players (INT)
- min_time, max_time (INT)
- description (TEXT)
- is_vip (BOOLEAN)
- engine (TEXT)
- rules (JSONB)
- badges (JSONB)
```

### Questions Tablosu
```sql
- id (UUID)
- game_pool (TEXT)
- content (TEXT)
- is_active (BOOLEAN)
```

### Tabu Cards Tablosu
```sql
- id (UUID)
- main_word (TEXT)
- banned_words (JSONB)
- is_active (BOOLEAN)
```

## 🔧 NPM Scripts

```bash
# Geliştirme modu (auto-reload)
npm run dev

# Tabloları oluştur
npm run db:migrate

# Verileri ekle (12 oyun + sorular + tabu)
npm run db:seed

# Production build
npm run build
npm start
```

## ⚠️ Sorun Giderme

### Veritabanı bağlantı hatası
```bash
Error: connect ECONNREFUSED
```
**Çözüm**: 
- `.env` dosyasında `DATABASE_URL` doğru mu?
- PostgreSQL servisi çalışıyor mu?
- Network/firewall izni var mı?

### "Too many connections" hatası
**Çözüm**:
```typescript
// src/db/pool.ts dosyasında:
max: 10  // Pool size'ı düşür
```

### Seed çalışmıyor
**Çözüm**:
```bash
# Önce migration çalıştır
npm run db:migrate

# Sonra seed
npm run db:seed
```

### Admin panel açılmıyor
**Çözüm**:
- Sunucu çalışıyor mu? `http://localhost:3000/health`
- Admin panel yolu: `http://localhost:3000/admin/admin.html`
- Browser console'da hata var mı?

## 🚀 Production Deployment

### Supabase ile Deploy

1. [Supabase](https://supabase.com) hesabı oluştur
2. Yeni proje oluştur
3. Settings → Database → Connection String'i kopyala
4. `.env` dosyasına ekle:
```env
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.xxxxxxxxxxxxx.supabase.co:5432/postgres
```
5. Migration ve seed çalıştır:
```bash
npm run db:migrate
npm run db:seed
```

### Neon ile Deploy

1. [Neon](https://neon.tech) hesabı oluştur
2. Yeni proje oluştur
3. Connection string'i kopyala
4. Aynı adımları takip et

### Render.com Deployment

1. PostgreSQL database ekle
2. Web service oluştur
3. Environment variables ekle:
```
DATABASE_URL=<internal-connection-string>
JWT_SECRET=<güçlü-random-key>
ADMIN_EMAILS=<admin-emails>
```
4. Build command: `npm run build`
5. Start command: `npm start`

## 📚 API Endpoints

### Admin Endpoints (🔒 Require Admin Auth)

```
GET    /api/admin/stats          - İstatistikler
GET    /api/admin/games          - Tüm oyunları listele
GET    /api/admin/games/:id      - Tek oyun detayı
POST   /api/admin/games          - Yeni oyun ekle
PUT    /api/admin/games/:id      - Oyun güncelle
DELETE /api/admin/games/:id      - Oyun sil

GET    /api/admin/questions      - Tüm soruları listele
POST   /api/admin/questions      - Yeni soru ekle
PUT    /api/admin/questions/:id  - Soru güncelle
DELETE /api/admin/questions/:id  - Soru sil

GET    /api/admin/tabu           - Tüm tabu kartlarını listele
POST   /api/admin/tabu           - Yeni tabu kartı ekle
PUT    /api/admin/tabu/:id       - Tabu kartı güncelle
DELETE /api/admin/tabu/:id       - Tabu kartı sil
```

### Public Endpoints

```
POST   /api/auth/register        - Yeni kullanıcı kaydı
POST   /api/auth/login           - Giriş yap
GET    /api/games                - Oyunları listele
GET    /api/games/:id            - Oyun detayı
GET    /api/users/profile        - Profil bilgisi
POST   /api/users/favorites      - Favori ekle/çıkar
```

## 🎯 Sonraki Adımlar

- ✅ Veritabanı entegrasyonu tamamlandı
- ✅ Admin panel oluşturuldu
- ✅ CRUD operasyonları hazır
- ⏳ Soru yönetimi admin panele eklenecek
- ⏳ Tabu kartı yönetimi admin panele eklenecek
- ⏳ Production'a deploy

## 💡 İpuçları

1. **Geliştirme**: Mock mode kullan (DATABASE_URL'i yorum satırı yap)
2. **Test**: Yerel PostgreSQL kullan
3. **Production**: Supabase veya Neon kullan
4. **Güvenlik**: JWT_SECRET'i production'da değiştir
5. **Yedekleme**: Supabase otomatik yedekleme yapar
6. **Monitoring**: Supabase dashboard ile query'leri izle

---

**Hazırladı**: Kiro AI 🎮
**Tarih**: 2024
**Proje**: FriendGames
