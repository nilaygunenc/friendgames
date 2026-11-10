# 🚀 FriendGames - Hızlı Başlangıç Rehberi

Bu rehber, projeyi Play Store'a yayınlamak için yapmanız gerekenleri **adım adım** ve **pratik** şekilde anlatır.

---

## ⏱️ Toplam Süre: 1-2 Hafta

- **Database + Backend:** 1 gün
- **Mobile Build:** 1 gün  
- **Store Hazırlığı:** 2-3 gün
- **Review Süreci:** 2-7 gün (Google'ın kontrolü)

---

## 📋 Gereksinimler

### Hesaplar (Ücretsiz)
- [ ] GitHub hesabı (kod için)
- [ ] Supabase hesabı (database)
- [ ] Render hesabı (backend hosting)
- [ ] Expo hesabı (mobile build)
- [ ] Google Play Developer ($25 tek seferlik)

### Yazılımlar
- [ ] Git
- [ ] Node.js 18+
- [ ] npm veya yarn
- [ ] PowerShell veya Terminal

---

## 🎯 Adım 1: Database Kurulumu (30 dakika)

### 1.1. Supabase'de Proje Oluştur
```
1. https://supabase.com > Sign Up
2. New Project
   - Name: friendgames
   - Database Password: [güçlü şifre - KAYDET!]
   - Region: Singapore
3. Create Project (2-3 dk bekle)
```

### 1.2. Database URL'i Al
```
1. Settings > Database
2. Connection string > URI
3. Kopyala:
   postgresql://postgres:[ŞİFRENİZ]@db.xxx.supabase.co:5432/postgres
```

### 1.3. Tabloları Oluştur
```
1. SQL Editor > New Query
2. DEPLOYMENT_GUIDE.md > "SQL Editor'de Tabloları Oluştur" kısmındaki SQL'i kopyala
3. RUN butonuna bas
4. Success! ✅
```

### 1.4. Test Et
```
1. Table Editor > users (boş olmalı)
2. Table Editor > games (boş olmalı)
✅ Tablolar hazır!
```

---

## 🖥️ Adım 2: Backend Deployment (30 dakika)

### 2.1. Render'da Hesap Aç
```
1. https://render.com > Get Started
2. GitHub ile giriş yap
```

### 2.2. Backend'i Deploy Et
```
1. Dashboard > New > Web Service
2. GitHub repo seç: friendgames-main
3. Ayarlar:
   Name: friendgames-api
   Region: Singapore
   Branch: main
   Root Directory: backend
   Build Command: npm install && npm run build
   Start Command: npm start
   Instance Type: FREE
```

### 2.3. Environment Variables Ekle
```
1. Environment sekmesi
2. Add Environment Variable:

PORT=3000
NODE_ENV=production
DATABASE_URL=[SUPABASE-URL-BURASı]
JWT_SECRET=[RASTGELE-64-KARAKTER]
JWT_EXPIRES_IN=7d
REVENUECAT_WEBHOOK_SECRET=placeholder
```

**JWT_SECRET Oluşturma:**
```powershell
# PowerShell'de çalıştır:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

### 2.4. Deploy Başlat
```
1. Create Web Service
2. Deploy başlayacak (5-10 dk)
3. ✅ Live olduğunda URL'i kopyala:
   https://friendgames-api.onrender.com
```

### 2.5. Test Et
```powershell
# PowerShell'de:
curl https://friendgames-api.onrender.com/health

# Sonuç:
# {"status":"ok","timestamp":"..."}
✅ Backend çalışıyor!
```

---

## 📱 Adım 3: Icon ve Splash Oluştur (15 dakika)

### 3.1. Generator'ı Aç
```
1. mobile/assets/icon-generator.html dosyasını aç
2. Her canvas'dan indir:
   - icon.png (1024x1024)
   - adaptive-icon.png (1024x1024)
   - splash.png (1284x2778)
3. İndirilen dosyaları mobile/assets/ klasörüne taşı
```

### 3.2. Favicon Oluştur (Opsiyonel)
```
1. icon.png'yi aç
2. 32x32 boyutuna küçült
3. favicon.png olarak kaydet
4. mobile/assets/'e taşı
```

✅ App görselleri hazır!

---

## 🔨 Adım 4: Mobile Build (1 saat)

### 4.1. EAS CLI Kur
```bash
npm install -g eas-cli
```

### 4.2. Expo'ya Giriş Yap
```bash
eas login
# Hesap yoksa: https://expo.dev/signup
```

### 4.3. Project Init
```bash
cd mobile
eas init
# Expo kullanıcı adını gir
# Project name: friendgames
```

### 4.4. Production API URL Güncelle
```bash
# mobile/.env.production oluştur
EXPO_PUBLIC_API_URL=https://friendgames-api.onrender.com/api
```

**eas.json güncelle:**
```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_API_URL": "https://friendgames-api.onrender.com/api"
      }
    }
  }
}
```

### 4.5. Production Build Başlat
```bash
cd mobile
eas build --platform android --profile production

# Sorular:
# "Generate a new Android Keystore?" > YES
# "Commit changes to git?" > YES

# Build başladı! ⏳ 15-20 dakika
```

### 4.6. Build'i İndir
```
1. Tarayıcıda otomatik açılan link
2. Veya: https://expo.dev/accounts/[username]/projects/friendgames/builds
3. AAB dosyasını indir
✅ friendgames-xxx.aab
```

---

## 🏪 Adım 5: Play Store Hazırlığı (2 saat)

### 5.1. Google Play Developer Hesabı
```
1. https://play.google.com/console
2. Create Developer Account
3. $25 öde (tek seferlik, kredi kartı gerekli)
4. Kimlik doğrulama (pasaport/ehliyet fotoğrafı)
5. Onay: 24-48 saat
```

### 5.2. Store Materyalleri Hazırla

#### Icon (Hazır ✅)
- `mobile/assets/icon.png` (1024x1024)

#### Screenshots (Yapılacak)
```
1. Android Studio Emulator aç
   - Device: Pixel 6
   - Resolution: 1080x2400
2. APK'yı emulator'e yükle
3. Ekran görüntüleri al:
   - Ana ekran (oyun listesi)
   - Oyun detayı (Vampir-Köylü)
   - Favoriler
   - VIP ekranı
   - Ayarlar
4. Minimum 2, maksimum 8 screenshot
```

#### Feature Graphic (Yapılacak)
```
Boyut: 1024x500
Araç: Canva (ücretsiz) veya Photoshop

İçerik:
- Arka plan: Gradient (mor-mavi-turuncu)
- Sol: 🎮 Icon
- Orta: "FriendGames" yazı
- Alt: "15+ Parti Oyunu"
- Sağ: Oyun kartları
```

**Canva Şablonu:**
https://www.canva.com/templates/search/feature-graphic/

### 5.3. Metinler (Hazır ✅)
`PLAY_STORE_LISTING.md` dosyasındaki tüm metinler kullanıma hazır:
- App name
- Short description
- Long description
- Release notes

---

## 📤 Adım 6: Play Store'a Yükleme (1 saat)

### 6.1. Uygulama Oluştur
```
1. Play Console > Create app
2. App details:
   - Name: FriendGames - Parti Oyunları
   - Language: Türkçe (Türkiye)
   - App/Game: App
   - Free/Paid: Free
3. Declarations: tüm boxları işaretle
4. Create app
```

### 6.2. Store Listing Doldur
```
1. Store presence > Main store listing

App details:
- App name: FriendGames - Parti Oyunları
- Short description: [PLAY_STORE_LISTING.md'den kopyala]
- Full description: [PLAY_STORE_LISTING.md'den kopyala]

Graphics:
- App icon: icon.png yükle
- Feature graphic: feature-graphic.png yükle
- Phone screenshots: minimum 2, maksimum 8

Categorization:
- App category: Games > Board
- Tags: party game, social, board game

Contact details:
- Email: support@friendgames.app
- Website: https://friendgames.app (veya GitHub pages)
- Privacy policy: [GitHub raw URL veya kendi siteniz]

2. Save
```

### 6.3. Content Rating
```
1. Policy > App content > Content rating
2. Start questionnaire
   - Email: [email]
   - App category: Games
   - Violence: None
   - Sexuality: None
   - Language: Infrequent/Mild
   - Interactive elements: Digital Purchases
   - Share location: No
   - Personal info access: Email addresses (for accounts)
3. Get rating
4. Apply rating
```

### 6.4. App Access
```
1. Policy > App content > App access
2. "All functionality is available without special access"
3. Save
```

### 6.5. Ads
```
1. Policy > App content > Ads
2. "No, my app does not contain ads"
3. Save
```

### 6.6. Data Safety
```
1. Policy > App content > Data safety
2. Start
   - Collects data: YES
   - Shares data: NO
   - Data types:
     * Email address (account)
     * Name (display name)
   - Data security:
     * Data encrypted in transit: YES
     * Users can request deletion: YES
     * Committed to Google Play Families Policy: NO
3. Save
```

### 6.7. Production Release
```
1. Release > Production
2. Create new release
3. Upload: friendgames-xxx.aab
4. Release name: 1 (1.0.0)
5. Release notes:
   - Türkçe: [PLAY_STORE_LISTING.md'den]
   - English: [PLAY_STORE_LISTING.md'den]
6. Review
7. Start rollout to Production
```

---

## ⏳ Adım 7: Review Bekle

```
⏱️ Ortalama Review Süresi: 2-7 gün

Durum kontrol:
Play Console > Release > Production > View release details

Durumlar:
- ⏳ In review: İnceleniyor
- ✅ Approved: Yayında! 🎉
- ❌ Rejected: Düzeltme gerekli
```

### Rejected Olursa Ne Yapmalı?
```
1. Red nedeni mailinizde
2. Sorunu düzelt
3. Yeni build al (version code arttır)
4. Tekrar yükle
5. Review'a gönder

Yaygın red nedenleri:
- Privacy policy eksik/hatalı
- Screenshots düşük kalite
- Content rating yanlış
- Data safety eksik
```

---

## 🎉 Adım 8: Yayında! (Post-Launch)

### 8.1. İlk Gün Yapılacaklar
```
✅ Store listing'i kontrol et
✅ Download et ve test et
✅ Arkadaşlarına paylaş
✅ İlk review'ları bekle
✅ Analytics'i kur (Firebase - opsiyonel)
```

### 8.2. İlk Hafta
```
✅ Crash report'ları izle
✅ User feedback'leri oku
✅ Rating/review'lara cevap ver
✅ Bug fix update hazırla
```

### 8.3. Update Yayınlama
```bash
# Version güncelle
# app.json: "version": "1.0.1", versionCode: 2

# Build al
cd mobile
eas build --platform android --profile production

# AAB'ı Play Console'a yükle
# Release notes ekle
# Rollout
```

---

## 🆘 Hızlı Problem Çözme

### Backend çalışmıyor
```bash
# Render logs kontrol et
# Dashboard > friendgames-api > Logs

# Environment variables doğru mu?
# DATABASE_URL doğru mu?
```

### Build hatası
```bash
# Cache temizle
cd mobile
rm -rf node_modules
npm install
eas build --clear-cache
```

### Test APK almak istiyorum
```bash
cd mobile
eas build --platform android --profile preview
# APK indir, cihaza yükle
```

---

## ✅ Checklist - Tüm Adımlar

### Hazırlık
- [ ] GitHub repo hazır
- [ ] Node.js kurulu
- [ ] Git kurulu

### Backend
- [ ] Supabase hesabı
- [ ] Database oluşturuldu
- [ ] Tablolar oluşturuldu
- [ ] Render hesabı
- [ ] Backend deploy edildi
- [ ] Environment variables eklendi
- [ ] Health check çalışıyor

### Mobile
- [ ] Icon oluşturuldu
- [ ] Splash oluşturuldu
- [ ] EAS CLI kuruldu
- [ ] Expo hesabı
- [ ] Production build alındı
- [ ] AAB indirildi

### Play Store
- [ ] Developer hesabı ($25)
- [ ] Screenshots çekildi
- [ ] Feature graphic oluşturuldu
- [ ] Store listing dolduruldu
- [ ] Content rating tamamlandı
- [ ] Data safety dolduruldu
- [ ] AAB yüklendi
- [ ] Review'a gönderildi

### Post-Launch
- [ ] Store kontrol edildi
- [ ] App test edildi
- [ ] Analytics kuruldu
- [ ] Monitoring aktif

---

## 🎯 Sonuç

**Tebrikler!** Tüm adımları tamamladıysanız, uygulamanız ya yayında ya da review'da!

**Sıradaki adımlar:**
1. İlk kullanıcılardan feedback al
2. Bug'ları düzelt
3. Yeni özellikler ekle
4. Marketing yap (sosyal medya, arkadaşlar)
5. 5⭐ review'lar topla!

**Başarılar! 🚀🎮**

---

**Sorular için:** support@friendgames.app
