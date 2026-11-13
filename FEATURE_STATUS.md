# Özellikler ve tamamlanması gerekenler

## Bu gönderide tamamlananlar

- **Son Teklif:** Dizi, Efsanevi Canlılar, Fast-food, Türk Yemekleri, Tatlılar ve Hayvanlar kategorileri; kartlar sağlanan görsellerle eşleştirildi.
- **Tabu:** 10 kategorinin her birine 50 yeni kart eklendi (500 yeni kart). Kategori ve zorluk filtreleri, beş yasaklı kelime, kalıcı karıştırma torbası, tekrar etmeyen kart çekimi, doğru/pas sayacı ve 60 saniyelik tur akışı eklendi.
- **VIP Tabu desteleri:** Manuel deste/kart oluşturma, yerel deste kütüphanesi, kategori/kapak rengi seçimi ve VIP erişim kapısı eklendi.
- **Bulut ve AI altyapısı:** VIP doğrulamalı deste kaydetme/listeleme/paylaşım koduyla indirme endpoint’leri ve 24 kart üreten AI endpoint’i eklendi.
- **Dokunma geri bildirimi:** Ses efekti hata verse bile buton eylemlerinin çalışması sağlandı.

## Çalıştırma için gerekenler / henüz canlı olmayanlar

- VIP satın alma gerçek ödeme sistemiyle bağlı değil; uygulamadaki VIP anahtarı demo amaçlıdır. Üretime çıkmadan önce mağaza satın alma doğrulaması bağlanmalıdır.
- AI deste üretimi için backend’de `OPENAI_API_KEY` (isteğe bağlı `OPENAI_MODEL`) tanımlanmalıdır. Anahtar repoya eklenmemelidir.
- Bulut deste ve paylaşım için backend çalışmalı, PostgreSQL `DATABASE_URL` ile yapılandırılmalı ve `mobile/.env` içinde `EXPO_PUBLIC_API_URL` tanımlanmalıdır. Kullanıcının backend tarafından VIP olarak doğrulanmış hesabı gerekir.
- Backend/API yapılandırılmadığında manuel VIP desteleri yalnızca o cihazda saklanır; yerel paylaşım kodları diğer cihazlara senkronize olmaz.
- Bu gönderide otomatik test paketi çalıştırılmadı. Mobil ve backend TypeScript kontrolleri başarılıdır.
