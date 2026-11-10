# ⚡ FriendGames - Hızlı Referans Kartı

## 🎯 TEK SAYFA ÖZETİ

### Proje Durumu
- ✅ **Backend**: Hazır (mock mode + database)
- ✅ **Mobile**: Hazır (12 oyun, 16 engine)
- ✅ **Admin Panel**: Hazır
- ⚠️ **Database**: Kurulmalı (production için)
- ⚠️ **Deploy**: Yapılmalı

---

## 🚀 HIZLI BAŞLATMA

### Şu An (Mock Mode - Test İçin)
```bash
# Backend
cd backend
npm install
npm run dev
# → http://localhost:3000

# Mobile
cd mobile
npm install
npm start
# → Expo Go ile test et
```

### Production İçin (3 Adım)
```bash
# 1. Veritabanı
# Supabase.com → Yeni proje → Connection string kopyala
# backend/.env → DATABASE_URL ekle

# 2. Migration + Seed
cd backend
npm run db:migrate
npm run db:seed

# 3. Admin Kullanıcısı
# .env → ADMIN_EMAILS=admin@friendgames.app
```

---

## 📁 ÖNEMLİ DOSYALAR

| Dosya | Ne İçin? |
|-------|----------|
| `backend/.env` | Database URL, JWT secret, Admin emails |
| `backend/src/index.ts` | Server entry point |
| `backend/public/admin.html` | Admin panel |
| `mobile/.env` | API URL |
| `mobile/App.tsx` | Mobile entry point |

---

## 🔗 ÖNEMLİ URL'LER

### Development
- Backend API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Admin panel: `http://localhost:3000/admin/admin.html`
- Mobile: Expo Go app

### API Endpoints
```
POST   /api/auth/register          # Kayıt ol
POST   /api/auth/login             # Giriş yap
GET    /api/games                  # Oyunlar
GET    /api/admin/stats            # Admin stats
GET    /api/admin/games            # Admin: oyunlar
POST   /api/admin/games            # Admin: oyun ekle
PUT    /api/admin/games/:id        # Admin: oyun güncelle
DELETE /api/admin/games/:id        # Admin: oyun sil
```

---

## 🛠️ NPM SCRIPTS

### Backend
```bash
npm run dev        # Development server (auto-reload)
npm run build      # Production build
npm start          # Production server
npm run db:migrate # Tabloları oluştur
npm run db:seed    # Test verisi yükle
```

### Mobile
```bash
npm start          # Expo dev server
npm run android    # Android emulator
npm run ios        # iOS simulator
eas build          # Production build
eas submit         # Play Store'a yükle
```

---

## 🔐 ADMIN PANELİ

### Erişim
1. `http://localhost:3000/admin/admin.html` aç
2. Admin email + şifre ile giriş yap
3. Oyunları yönet!

### Admin Kullanıcısı Oluştur
**Yöntem 1 (Kolay)**:
```env
# .env dosyasına ekle:
ADMIN_EMAILS=admin@friendgames.app,senin@emailin.com
```

**Yöntem 2 (SQL)**:
```sql
UPDATE users SET is_admin = true WHERE email = 'email@example.com';
```

### Özellikler
- 📊 İstatistikler
- 🎮 Oyun ekle/düzenle/sil
- 👑 VIP durumu değiştir
- 📁 Kategori yönetimi

---

## 🗄️ VERİTABANI

### Tablolar (6 adet)
1. `users` - Kullanıcılar (is_admin kolonu var)
2. `games` - Oyunlar
3. `questions` - Sorular
4. `tabu_cards` - Tabu kartları
5. `user_favorites` - Favoriler
6. `vip_purchases` - VIP alımları

### Kolay Setup (Supabase)
1. [supabase.com](https://supabase.com) → Sign up
2. New Project → Database → Connection String
3. `.env` → `DATABASE_URL=postgresql://...`
4. `npm run db:migrate && npm run db:seed`

### Mock Data
- 12 oyun
- 100+ soru (Truth or Dare, Kim Daha Çok, vb.)
- 50+ tabu kartı

---

## 📱 MOBILE APP

### Ekranlar
- Home (Ana sayfa)
- Games (Oyun listesi)
- GameDetail (Detay)
- Play (Oyun oyna)
- Profile (Profil)
- VIP (Satın alma)

### Oyunlar (12 adet)
1. Doğruluk mu Cesaret mi
2. Kim Daha Çok
3. Kim Yapmıştır
4. Hiç Yapmadım
5. Ajan
6. Mafya
7. Tabu
8. Kelime Avı
9. İsim Şehir Hayvan
10. Müzik Yarışması (VIP)
11. Hikaye Zinciri
12. Kim Ölür?

---

## 🚀 DEPLOY (5 Dakika)

### Backend (Render.com)
1. [render.com](https://render.com) → New Web Service
2. GitHub repo bağla
3. Root: `backend`
4. Build: `npm run build`
5. Start: `npm start`
6. Env vars ekle:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=super-secret-key
   ADMIN_EMAILS=admin@email.com
   ```

### Mobile (EAS Build)
```bash
cd mobile
eas build --platform android --profile preview
eas submit --platform android
```

---

## 📚 DOKÜMANTASYON

### Detaylı Rehberler
- 🗄️ `backend/DATABASE_SETUP.md` - Database kurulum
- 🖥️ `backend/ADMIN_PANEL_GUIDE.md` - Admin panel kullanımı
- 🚀 `DEPLOYMENT_GUIDE.md` - Deploy rehberi
- ⚡ `QUICK_START.md` - Hızlı başlangıç
- 📱 `PLAY_STORE_READY.md` - Play Store hazırlık
- ✅ `PRODUCTION_READY_CHECKLIST.md` - Production checklist
- 📋 `TAMAMLANAN_ÖZELLIKLER.md` - Tamamlanan özellikler

### Play Store
- `PLAY_STORE_LISTING.md` - Store metinleri
- `PRIVACY_POLICY.md` - Gizlilik politikası
- `TERMS_OF_SERVICE.md` - Kullanım koşulları

---

## 🐛 SORUN GİDERME

### Backend Başlamıyor
```bash
# Port zaten kullanımda mı?
# .env PORT değiştir veya:
kill -9 $(lsof -ti:3000)  # Mac/Linux
# Windows: Task Manager → Node.js sonlandır
```

### Database Bağlanamıyor
```bash
# .env DATABASE_URL doğru mu kontrol et
# PostgreSQL servisi çalışıyor mu?
# Network/firewall izni var mı?
```

### Admin Panel Açılmıyor
```bash
# Backend çalışıyor mu?
curl http://localhost:3000/health

# Yol doğru mu?
# → http://localhost:3000/admin/admin.html
```

### Mobile App Bağlanamıyor
```bash
# mobile/.env kontrol et:
EXPO_PUBLIC_API_URL=http://localhost:3000/api

# Aynı network'te misiniz?
# Backend çalışıyor mu?
```

---

## ⚡ YAKIN KISAYOLLAR

### Backend Yeniden Başlat
```bash
cd backend
npm run dev
```

### Database Sıfırla
```bash
# PostgreSQL'de:
DROP DATABASE friendgames;
CREATE DATABASE friendgames;

# Sonra:
npm run db:migrate
npm run db:seed
```

### Admin Ekle
```sql
-- PostgreSQL
UPDATE users SET is_admin = true WHERE email = 'email@example.com';
```

### Yeni Oyun Ekle
1. Admin panel aç
2. Oyunlar → + Yeni Oyun Ekle
3. Formu doldur → Kaydet

---

## 🎯 NEXT STEPS (Öncelikli)

### Yapılacaklar (Sırayla)
1. ⚠️ **Veritabanı kur** (30 dk) → `DATABASE_SETUP.md`
2. ⚠️ **Admin kullanıcısı oluştur** (5 dk)
3. ⚠️ **Backend deploy et** (20 dk) → `DEPLOYMENT_GUIDE.md`
4. 🟢 **Mobile build al** (10 dk)
5. 🟢 **Play Store'a yükle** (30 dk) → `PLAY_STORE_READY.md`

**Toplam**: ~2 saat 🚀

---

## 💡 İPUÇLARI

### Development
- Mock mode kullan (DATABASE_URL'i yorum yap)
- Backend logs'u takip et
- Browser console'u kontrol et
- Expo Go ile hızlı test

### Production
- Güçlü JWT_SECRET kullan
- HTTPS kullan (Render.com otomatik)
- Database backup al
- Rate limiting aktif (zaten var)
- Error monitoring ekle (Sentry)

### Admin Panel
- Oyun ID'leri benzersiz olmalı
- Emoji icon kullan (tek karakter)
- VIP oyunları dikkatli seç
- Test verilerini seed ile yükle

---

## 📊 PROJE İSTATİSTİKLERİ

- **Kod Satırı**: ~8000
- **API Endpoints**: 30+
- **Mobile Screens**: 6
- **Components**: 17
- **Game Engines**: 16
- **Oyun**: 12
- **Soru**: 100+
- **Tabu Kartı**: 50+
- **Dokümantasyon**: 3000+ satır

---

## ✅ HAZIR MI?

### Development ✅
- [x] Backend çalışıyor (mock mode)
- [x] Mobile çalışıyor
- [x] Admin panel açılıyor
- [x] Dokümantasyon hazır

### Production ⚠️
- [ ] Database kurulu
- [ ] Admin kullanıcısı var
- [ ] Backend deploy
- [ ] Mobile build
- [ ] Play Store yükleme

---

## 📞 YARDIM

**Sıkıştınız mı?**

1. İlgili `.md` dosyasını okuyun
2. Logs kontrol edin (backend console + browser console)
3. Database bağlantısını test edin
4. `.env` dosyasını kontrol edin

**Dosya Bulamıyor musunuz?**
- Backend dosyaları: `backend/src/`
- Mobile dosyaları: `mobile/src/`
- Dokümantasyon: Proje kök dizini
- Admin panel: `backend/public/admin.html`

---

## 🎉 BAŞARI!

Projeniz %85 tamamlandı! 

Sadece veritabanı kurulumu ve deploy kaldı. 

**Şimdi yapmanız gereken**:
1. `backend/DATABASE_SETUP.md` dosyasını açın
2. Adım adım takip edin
3. 30 dakika sonra production'a hazırsınız! 🚀

---

**Hazırladı**: Kiro AI 🤖  
**Proje**: FriendGames  
**Versiyon**: 1.0  
**Durum**: Ready to Rock! 🎸
