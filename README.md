# 🎮 FriendGames - Arkadaşlar İçin Parti Oyunları

Modern, çok oyunculu parti oyunları platformu. React Native (Expo) ile geliştirilmiş mobil uygulama ve Node.js/Express backend API.

## 📋 İçindekiler

- [Özellikler](#özellikler)
- [Teknoloji Stack](#teknoloji-stack)
- [Kurulum](#kurulum)
- [Database Setup](#database-setup)
- [Çalıştırma](#çalıştırma)
- [Admin Panel](#admin-panel)
- [Deployment](#deployment)
- [Yapı](#yapı)
- [Katkıda Bulunma](#katkıda-bulunma)

---

## ✨ Özellikler

### 🎮 Oyunlar (12 Adet)
- **Buz Kırıcı**: Kim Daha Çok, Ne Zaman, Doğruluk mu Cesaret mi, Kim Yapmıştır, Hiç Yapmadım
- **Gizli Rol**: Ajan (VIP), Mafya (VIP)
- **Kelime**: Tabu (VIP), Kelime Avı, İsim Şehir Hayvan
- **FriendGames Özel**: Müzik Yarışması (VIP), Kim Ölür

### 🔐 Kullanıcı Sistemi
- JWT Authentication
- Kullanıcı kaydı ve girişi
- Profil yönetimi
- Favori oyunlar

### 👑 VIP Sistemi
- RevenueCat entegrasyonu
- VIP abonelik yönetimi
- Premium oyunlara erişim

### 🖥️ Admin Panel
- Modern web arayüzü
- Oyun CRUD işlemleri (Ekleme, Düzenleme, Silme)
- İstatistik dashboard
- VIP oyun yönetimi
- Gerçek zamanlı güncelleme

### 📱 Mobile App
- React Native + Expo
- iOS ve Android desteği
- Dark/Light theme
- Çoklu dil desteği (TR/EN/ES)
- Offline destek
- Ses efektleri

---

## 🛠️ Teknoloji Stack

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT + bcrypt
- **Security**: Helmet, CORS, Rate Limiting
- **ORM**: pg (native PostgreSQL driver)

### Mobile
- **Framework**: React Native 0.74
- **Platform**: Expo SDK 51
- **Language**: TypeScript
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Audio**: Expo AV
- **Payments**: RevenueCat

### DevOps
- **Build**: EAS Build
- **Deploy**: Render.com (Backend), Expo (Mobile)
- **Database**: Supabase
- **Version Control**: Git

---

## 🚀 Kurulum

### Gereksinimler

- Node.js 20+
- npm veya yarn
- PostgreSQL (veya Supabase hesabı)
- Expo CLI (mobile için)
- Git

### 1. Repository'yi Klonlayın

```bash
git clone https://github.com/yourusername/friendgames.git
cd friendgames
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

`.env` dosyası oluşturun:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Supabase)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.xneicfokzijveibkglux.supabase.co:5432/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Admin
ADMIN_EMAILS=admin@friendgames.app

# RevenueCat
REVENUECAT_WEBHOOK_SECRET=your_revenuecat_webhook_secret
```

### 3. Mobile Kurulumu

```bash
cd mobile
npm install
```

`.env` dosyası oluşturun:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api
```

---

## 🗄️ Database Setup

### Supabase ile Kurulum (Önerilen)

#### 1. Supabase Hesabı Oluşturun

1. [Supabase](https://supabase.com) → Sign up
2. New Project oluşturun
3. Database şifrenizi belirleyin ve kaydedin

#### 2. Tabloları Oluşturun

`SUPABASE_SETUP.sql` dosyasını Supabase SQL Editor'de çalıştırın:

```sql
-- 6 tablo oluşturur: users, games, questions, tabu_cards, user_favorites, vip_purchases
-- Dosya: SUPABASE_SETUP.sql
```

#### 3. Seed Data Yükleyin

`SUPABASE_SEED.sql` dosyasını Supabase SQL Editor'de çalıştırın:

```sql
-- 12 oyun + Admin kullanıcısı ekler
-- Dosya: SUPABASE_SEED.sql
```

#### 4. Connection String Alın

Supabase Dashboard → Settings → Database → Connection String (URI)

```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
```

#### 5. .env Dosyasını Güncelleyin

```env
DATABASE_URL=postgresql://...
```

### Manuel PostgreSQL Kurulumu

```bash
# PostgreSQL yükleyin
# Database oluşturun
createdb friendgames

# Migration çalıştırın
npm run db:migrate

# Seed data yükleyin
npm run db:seed
```

---

## ▶️ Çalıştırma

### Backend

```bash
cd backend
npm run dev
```

Server: `http://localhost:3000`
Admin Panel: `http://localhost:3000/admin/admin.html`

### Mobile

```bash
cd mobile
npm start
```

- iOS: `i` tuşuna basın
- Android: `a` tuşuna basın
- Expo Go ile test edin

---

## 🖥️ Admin Panel

### Erişim

URL: `http://localhost:3000/admin/admin.html`

### Giriş Bilgileri

**Default Admin:**
- Email: `admin@friendgames.app`
- Password: `Admin123!`

### Özellikler

#### Dashboard
- Toplam oyun sayısı
- Toplam kullanıcı sayısı
- Toplam soru sayısı
- Toplam tabu kartı sayısı

#### Oyun Yönetimi
- ✅ Tüm oyunları listeleme
- ✅ Yeni oyun ekleme
- ✅ Oyun düzenleme
- ✅ Oyun silme
- ✅ VIP durumu değiştirme
- ✅ Kategori yönetimi

#### Gelecek Özellikler
- ⏳ Soru yönetimi
- ⏳ Tabu kartı yönetimi
- ⏳ Kullanıcı yönetimi

---

## 🚢 Deployment

### Backend (Render.com)

1. **Render.com** hesabı oluşturun
2. **New Web Service** → GitHub repo bağlayın
3. Ayarlar:
   ```
   Name: friendgames-api
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   ```
4. Environment Variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=super-secret-production-key
   NODE_ENV=production
   ADMIN_EMAILS=admin@yourdomain.com
   ```

### Mobile (EAS Build)

```bash
cd mobile

# EAS CLI yükleyin
npm install -g eas-cli

# Login
eas login

# Android build
eas build --platform android --profile production

# iOS build
eas build --platform ios --profile production

# Play Store'a submit
eas submit --platform android
```

### Database (Supabase)

Supabase otomatik olarak:
- ✅ SSL/TLS encryption
- ✅ Automatic backups
- ✅ Point-in-time recovery
- ✅ Connection pooling
- ✅ Auto-scaling

---

## 📁 Proje Yapısı

```
friendgames/
├── backend/                 # Node.js API
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth, validation, error handling
│   │   ├── db/             # Database (pool, migrations, seed)
│   │   ├── data/           # Mock data
│   │   └── types/          # TypeScript types
│   ├── public/             # Static files (admin panel)
│   ├── .env                # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                  # React Native App
│   ├── src/
│   │   ├── screens/        # App screens (6)
│   │   ├── components/     # Reusable components (17)
│   │   ├── engines/        # Game engines (16)
│   │   ├── utils/          # Helpers
│   │   ├── types/          # TypeScript types
│   │   └── theme/          # Theme configuration
│   ├── assets/             # Images, sounds, icons
│   ├── App.tsx
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── SUPABASE_SETUP.sql      # Database schema
├── SUPABASE_SEED.sql       # Seed data (12 games + admin)
├── DEPLOYMENT_GUIDE.md     # Detaylı deployment rehberi
├── DATABASE_SETUP.md       # Database kurulum rehberi
├── ADMIN_PANEL_GUIDE.md    # Admin panel kullanımı
├── PLAY_STORE_READY.md     # Play Store hazırlık
├── PRIVACY_POLICY.md       # Gizlilik politikası
├── TERMS_OF_SERVICE.md     # Kullanım koşulları
└── README.md               # Bu dosya
```

---

## 🔧 Geliştirme

### NPM Scripts

#### Backend
```bash
npm run dev          # Development server (hot reload)
npm run build        # TypeScript build
npm start            # Production server
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

#### Mobile
```bash
npm start            # Expo dev server
npm run android      # Android emulator
npm run ios          # iOS simulator
eas build            # Production build
eas submit           # Submit to stores
```

### Yeni Oyun Ekleme

#### 1. Admin Panel ile (Kolay)
1. Admin panel'e giriş yap
2. "Oyunlar" → "+ Yeni Oyun Ekle"
3. Formu doldur
4. Kaydet

#### 2. SQL ile
```sql
INSERT INTO games (id, name, icon, category, category_label, min_players, max_players, min_time, max_time, description, is_vip, engine, rules, badges)
VALUES ('new-game', 'Yeni Oyun', '🎮', 'buz-kirici', 'Buz Kırıcı', 2, 10, 10, 30, 'Açıklama', false, 'question', '[]', '[]');
```

#### 3. Code ile (Geliştirme)
Mobile app için oyun engine'i oluşturun:
```typescript
// mobile/src/engines/NewGameEngine.tsx
export function NewGameEngine() {
  // Game logic
}
```

---

## 🐛 Sorun Giderme

### Backend başlamıyor
```bash
# Port kullanımda mı?
netstat -ano | findstr :3000

# Database bağlantısı var mı?
node backend/test-db.js
```

### Database bağlanamıyor
```bash
# .env dosyası doğru mu?
cat backend/.env

# Supabase erişilebilir mi?
ping db.xneicfokzijveibkglux.supabase.co
```

### Mobile app backend'e bağlanamıyor
```bash
# API URL doğru mu?
cat mobile/.env

# Backend çalışıyor mu?
curl http://localhost:3000/health
```

### Admin panel açılmıyor
```bash
# Static files serve ediliyor mu?
# URL doğru mu: http://localhost:3000/admin/admin.html
```

---

## 📊 API Endpoints

### Auth
```
POST   /api/auth/register    # Yeni kullanıcı kaydı
POST   /api/auth/login       # Giriş yap
```

### Games
```
GET    /api/games            # Tüm oyunları listele
GET    /api/games/:id        # Oyun detayı
GET    /api/games/:id/questions  # Oyun soruları
GET    /api/games/tabu/cards     # Tabu kartları
```

### Users
```
GET    /api/users/profile    # Kullanıcı profili
PUT    /api/users/profile    # Profil güncelle
GET    /api/users/favorites  # Favori oyunlar
POST   /api/users/favorites  # Favori ekle/çıkar
```

### VIP
```
POST   /api/vip/purchase     # VIP satın alma
POST   /api/vip/webhook      # RevenueCat webhook
```

### Admin (🔒 Requires Admin Auth)
```
GET    /api/admin/stats      # İstatistikler
GET    /api/admin/games      # Oyunları listele
GET    /api/admin/games/:id  # Oyun detayı
POST   /api/admin/games      # Yeni oyun
PUT    /api/admin/games/:id  # Oyun güncelle
DELETE /api/admin/games/:id  # Oyun sil
```

---

## 🔒 Güvenlik

- ✅ JWT token authentication
- ✅ bcrypt password hashing
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ SQL injection protection (parameterized queries)
- ✅ XSS protection
- ✅ Admin authorization middleware

---

## 📈 Performance

- Connection pooling (max 10 connections)
- Indexed database queries
- Efficient React Native rendering
- Optimized bundle size
- Lazy loading
- Image optimization

---

## 🌍 Çoklu Dil Desteği

Desteklenen diller:
- 🇹🇷 Türkçe (varsayılan)
- 🇬🇧 İngilizce
- 🇪🇸 İspanyolca

Yeni dil eklemek için:
```typescript
// mobile/src/i18n/translations.ts
export const translations = {
  tr: { ... },
  en: { ... },
  es: { ... }
};
```

---

## 🎨 Tema

Dark ve Light tema desteği:
```typescript
// mobile/src/theme/theme.ts
export const darkTheme = { ... };
export const lightTheme = { ... };
```

---

## 📱 Ekran Görüntüleri

*(Play Store için ekran görüntüleri burada olacak)*

---

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje özel lisans altındadır. Ticari kullanım için iletişime geçin.

---

## 👥 Ekip

- **Backend & API**: Kiro AI
- **Mobile App**: Kiro AI
- **Admin Panel**: Kiro AI
- **Database Design**: Kiro AI
- **Documentation**: Kiro AI

---

## 📞 İletişim

- Website: https://friendgames.app (yakında)
- Email: info@friendgames.app
- GitHub: https://github.com/yourusername/friendgames

---

## 🙏 Teşekkürler

- [Supabase](https://supabase.com) - PostgreSQL database hosting
- [Expo](https://expo.dev) - React Native framework
- [RevenueCat](https://revenuecat.com) - In-app purchase management
- [Render](https://render.com) - Backend hosting

---

## 📝 Changelog

### v1.0.0 (2024-11-09)
- ✅ Initial release
- ✅ 12 oyun
- ✅ Backend API
- ✅ Mobile app (iOS + Android)
- ✅ Admin panel
- ✅ Database integration (Supabase)
- ✅ VIP sistem
- ✅ Çoklu dil desteği

---

## 🚀 Roadmap

### v1.1.0 (Planlanan)
- [ ] Admin panel'de soru yönetimi
- [ ] Admin panel'de tabu kartı yönetimi
- [ ] Kullanıcı profil fotoğrafı
- [ ] Oyun geçmişi
- [ ] Başarımlar (achievements)
- [ ] Liderlik tablosu

### v1.2.0 (Planlanan)
- [ ] Real-time multiplayer
- [ ] Video chat entegrasyonu
- [ ] Özel oyun odaları
- [ ] Arkadaş sistemi

### v2.0.0 (Planlanan)
- [ ] Web versiyonu
- [ ] Oyun oluşturucu (game builder)
- [ ] Community oyunlar
- [ ] Moderasyon sistemi

---

**Made with ❤️ by Kiro AI**
