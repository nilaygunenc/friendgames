# 🎮 FriendGames Admin Panel Kullanım Kılavuzu

## Admin Panel Nedir?

Admin panel, FriendGames uygulamasındaki oyunları, soruları ve tabu kartlarını kod yazmadan web arayüzü üzerinden yönetmenizi sağlar.

## 🚀 Admin Panel'e Erişim

### URL
```
http://localhost:3000/admin/admin.html
```

Production'da:
```
https://yourdomain.com/admin/admin.html
```

## 👤 Admin Kullanıcısı Oluşturma

Admin panele erişebilmek için admin yetkisine sahip bir kullanıcı gerekir. 3 yöntemle admin kullanıcısı oluşturabilirsiniz:

### Yöntem 1: .env Dosyası ile (Önerilen)

```env
# backend/.env
ADMIN_EMAILS=admin@friendgames.app,yonetici@firma.com
```

Bu email adreslerine sahip kullanıcılar otomatik olarak admin yetkisine sahip olur. Virgül ile ayırarak birden fazla admin ekleyebilirsiniz.

**Adımlar:**
1. `.env` dosyasına admin email'leri ekle
2. Mobil uygulamadan veya API ile normal kayıt ol
3. Admin email ile kayıt olunca otomatik admin yetkisi verilir

### Yöntem 2: Veritabanından Manuel

```sql
-- PostgreSQL'de çalıştır:
UPDATE users 
SET is_admin = true 
WHERE email = 'kullanici@email.com';
```

### Yöntem 3: Doğrudan SQL ile Kullanıcı Oluştur

```sql
-- Şifre: admin123 (bcrypt hash)
INSERT INTO users (email, password_hash, display_name, is_admin, is_vip)
VALUES (
  'admin@friendgames.app',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin User',
  true,
  true
);
```

## 🎯 Admin Panel Özellikleri

### 1. 📊 İstatistikler (Stats)

Dashboard'da toplam sayılar görüntülenir:
- **Toplam Oyun**: Sistemdeki oyun sayısı
- **Toplam Kullanıcı**: Kayıtlı kullanıcı sayısı
- **Toplam Soru**: Soru bankasındaki soru sayısı
- **Tabu Kartları**: Tabu oyunu için kart sayısı

### 2. 🎮 Oyun Yönetimi

#### Oyun Listesini Görüntüleme
- Tüm oyunlar tablo halinde listelenir
- Her oyun için icon, isim, kategori, oyuncu sayısı, VIP durumu görünür

#### Yeni Oyun Ekleme
1. **"+ Yeni Oyun Ekle"** butonuna tıkla
2. Formu doldur:
   - **Oyun ID**: Benzersiz, kısa ID (örn: `truth-or-dare`)
   - **İsim**: Oyunun görünen adı
   - **Icon**: Emoji (örn: 🎭, 🎲, ⚡)
   - **Kategori**: Dropdown'dan seç
     - Buz Kırıcı
     - Gizli Rol
     - Kelime
     - FriendGames Özel
   - **Açıklama**: Oyunun kısa açıklaması
   - **Min Oyuncu**: Minimum oyuncu sayısı
   - **Max Oyuncu**: Maximum oyuncu sayısı
   - **VIP Oyunu**: İşaretle/işaretleme

3. **"Kaydet"** butonuna tıkla

#### Oyun Düzenleme
1. Oyun satırındaki **✏️ Edit** butonuna tıkla
2. Açılan formda değişiklik yap
3. **"Kaydet"** butonuna tıkla

**Not**: Oyun ID düzenlenemez (primary key olduğu için)

#### Oyun Silme
1. Oyun satırındaki **🗑️ Delete** butonuna tıkla
2. Onay dialogunda **"Tamam"** seç
3. Oyun veritabanından silinir

⚠️ **Dikkat**: Silme işlemi geri alınamaz!

### 3. ❓ Soru Yönetimi (Yakında)

Soru yönetimi özellikleri yakında eklenecek:
- Kategorilere göre soru ekleme
- Soruları düzenleme/silme
- Aktif/pasif yapma

### 4. 🚫 Tabu Kartları (Yakında)

Tabu kartı yönetimi özellikleri yakında eklenecek:
- Ana kelime ve yasaklı kelimeler
- Kart düzenleme/silme
- Aktif/pasif yapma

## 🔐 Güvenlik

### Authentication
- Admin panel JWT token ile korunur
- Token localStorage'da saklanır
- Token süresi: 7 gün (JWT_EXPIRES_IN)

### Authorization
- Her request'te admin kontrolü yapılır
- Middleware: `adminAuth.ts`
- İki kontrol mekanizması:
  1. `is_admin = true` (veritabanında)
  2. `ADMIN_EMAILS` listesinde (env)

### API Endpoints
Tüm admin endpoints `/api/admin` prefix'i ile başlar ve `adminAuth` middleware'i ile korunur.

## 📱 Kullanım Senaryoları

### Senaryo 1: Yeni Oyun Ekleme

**Durum**: Yeni bir "Şapka Oyunu" eklemek istiyorsunuz.

**Adımlar:**
1. Admin panel'e giriş yap
2. "Oyunlar" sekmesine git
3. "+ Yeni Oyun Ekle" butonuna tıkla
4. Bilgileri doldur:
   ```
   Oyun ID: hat-game
   İsim: Şapka Oyunu
   Icon: 🎩
   Kategori: Kelime
   Açıklama: Kelime tahmin oyunu. Oyuncular kelimeleri tarif eder.
   Min Oyuncu: 4
   Max Oyuncu: 12
   VIP: ❌
   ```
5. "Kaydet" butonuna tıkla
6. Oyun anında mobil uygulamada görünür!

### Senaryo 2: VIP Oyun Yapma

**Durum**: "Müzik Yarışması"nı VIP yapmak istiyorsunuz.

**Adımlar:**
1. Oyunlar listesinde "Müzik Yarışması" satırını bul
2. ✏️ Edit butonuna tıkla
3. "VIP Oyunu" checkbox'ını işaretle
4. "Kaydet"e tıkla
5. Artık sadece VIP kullanıcılar oynayabilir

### Senaryo 3: Oyun Açıklaması Güncelleme

**Durum**: "Kim Ölür?" oyununun açıklamasını daha açık yazmak istiyorsunuz.

**Adımlar:**
1. "Kim Ölür?" satırında ✏️ Edit'e tıkla
2. Açıklama alanını düzenle:
   ```
   Eski: "Şans oyunu"
   Yeni: "Oyuncular sırayla şans çeker. Kaybeden elenirken, kazanan oyuna devam eder."
   ```
3. "Kaydet"e tıkla

### Senaryo 4: Popüler Olmayan Oyunu Kaldırma

**Durum**: Kimse oynamadığı için bir oyunu kaldırmak istiyorsunuz.

**Adımlar:**
1. Oyun satırında 🗑️ Delete butonuna tıkla
2. Onay dialogunda "Tamam" seç
3. Oyun hem veritabanından hem mobil uygulamadan kaybolur

## 🎨 Oyun Kategorileri

### Buz Kırıcı
Yeni tanışan gruplar için uygun, eğlenceli oyunlar.
- Doğruluk mu Cesaret mi
- Kim Daha Çok
- Kim Yapmıştır

### Gizli Rol
Dedektif ve rol yapma gerektiren oyunlar.
- Ajan
- Mafya

### Kelime
Kelime ve tahmin oyunları.
- Tabu
- Kelime Avı
- İsim Şehir Hayvan

### FriendGames Özel
Platforma özel, benzersiz oyunlar.
- Müzik Yarışması
- Hikaye Zinciri

## 💡 İpuçları

### Oyun ID Seçimi
- Kısa ve açıklayıcı olsun
- Türkçe karakter kullanma
- Tire (-) ile ayır
- Örnekler: `truth-dare`, `mafia`, `word-hunt`

### Icon Seçimi
- Tek emoji kullan
- Oyunu temsil eden emoji seç
- Test et (bazı cihazlarda bazı emojiler görünmez)
- Emoji listesi: https://emojipedia.org

### Açıklama Yazma
- 2-3 cümle yeterli
- Nasıl oynanacağını kısaca açıkla
- Gruba uygun olup olmadığını belirt

### Oyuncu Sayısı
- Minimum: Oyunun oynanabildiği en az sayı
- Maximum: İdeal üst sınır
- Örnekler:
  - Mafia: 6-12 (Az kişiyle eğlenceli olmaz)
  - Doğruluk Cesaret: 2-20 (Herhangi bir grup büyüklüğü)

### VIP Kullanımı
VIP yapılması gerekenler:
- Premium özellikler (ses, animasyon vb.)
- Uzun/karmaşık oyunlar
- Özel içerik
- Revenue gerektiren oyunlar

Ücretsiz kalması gerekenler:
- Temel oyunlar
- Popüler oyunlar (çekmece)
- Yeni kullanıcılar için demo oyunlar

## 🐛 Sorun Giderme

### "Giriş Başarısız" Hatası
**Sebep**: Email veya şifre yanlış.
**Çözüm**: 
- Email doğru mu kontrol et
- Şifreyi doğru girdiğinden emin ol
- Admin yetkisi var mı? (veritabanını kontrol et)

### "Unauthorized" Hatası
**Sebep**: Token süresi dolmuş veya admin yetkisi yok.
**Çözüm**:
- Tekrar giriş yap
- `is_admin` flag'i kontrol et:
  ```sql
  SELECT email, is_admin FROM users WHERE email = 'email@email.com';
  ```

### Oyun Kaydedilemedi
**Sebep**: 
- Oyun ID zaten var
- Zorunlu alan boş
- Database bağlantı problemi

**Çözüm**:
- Benzersiz ID kullan
- Tüm alanları doldur
- Browser console'a bak (F12)
- Backend logs'a bak

### Modal Kapanmıyor
**Sebep**: JavaScript hatası.
**Çözüm**:
- Sayfayı yenile (F5)
- Browser console'da hata var mı kontrol et

### Değişiklikler Görünmüyor
**Sebep**: Cache veya API yanıt vermiyor.
**Çözüm**:
- Sayfayı yenile (Ctrl+F5)
- Backend loglarını kontrol et
- Database'de değişiklik var mı kontrol et

## 📊 Admin API Kullanımı

Admin panel REST API'ye istekler gönderir. API'yi doğrudan da kullanabilirsiniz:

### Authentication
```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@friendgames.app","password":"admin123"}'

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { ... }
}
```

### Oyun İşlemleri
```bash
# List all games
curl http://localhost:3000/api/admin/games \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get single game
curl http://localhost:3000/api/admin/games/truth-dare \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create game
curl -X POST http://localhost:3000/api/admin/games \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "new-game",
    "name": "Yeni Oyun",
    "icon": "🎮",
    "category": "buz-kirici",
    "category_label": "Buz Kırıcı",
    "min_players": 3,
    "max_players": 10,
    "min_time": 5,
    "max_time": 20,
    "description": "Eğlenceli oyun",
    "is_vip": false,
    "engine": null,
    "rules": [],
    "badges": []
  }'

# Update game
curl -X PUT http://localhost:3000/api/admin/games/new-game \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Updated Name", ...}'

# Delete game
curl -X DELETE http://localhost:3000/api/admin/games/new-game \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🚀 Production Checklist

Admin panel'i production'a almadan önce:

- [ ] `.env` dosyasında `JWT_SECRET` güçlü bir değere ayarla
- [ ] `ADMIN_EMAILS` listesini gerçek admin email'leri ile güncelle
- [ ] PostgreSQL bağlantısı çalışıyor
- [ ] HTTPS kullanıyorsun (admin panel SSL olmadan risk!)
- [ ] CORS ayarları production domain'ine göre yapılandırıldı
- [ ] Rate limiting aktif
- [ ] Database backup stratejisi var
- [ ] Error logging/monitoring kurulu (Sentry, LogRocket vb.)

---

**Hazırladı**: Kiro AI 🎮
**Proje**: FriendGames Admin Panel
**Versiyon**: 1.0
