# FriendGames

Türkçe, tek telefonla oynanan parti oyunları uygulaması. Mevcut React Native ekranları Expo projesine dönüştürüldü. Orijinal referans index.html dosyasında korunur.

## Mobil uygulamayı çalıştırma

Node.js ve pnpm ile:

    cd mobile
    pnpm install
    pnpm exec expo install --fix
    pnpm start

Terminaldeki QR kodunu uyumlu Expo Go ile okutun. Telefon ve bilgisayar aynı Wi-Fi ağında olmalı. Android emülatör için a, tarayıcı önizlemesi için w tuşuna basın. iOS simülatörü macOS gerektirir.

    pnpm run type-check
    pnpm exec expo export --platform web

## İlk sürümde

- Karanlık tema, oyun kataloğu, kişi/kategori filtreleri ve Türkçe arama.
- Cihazda saklanan favoriler ve grup/ekran tercihleri.
- Vampir-Köylü için 5–20 kişilik gizli rol dağıtımı.
- Tabu için 60 saniyelik tur, doğru/pas sayacı ve karıştırılmış kart destesi.
- Tekrarsız deste bitene kadar soru kartı çekme.
- VIP demo kilit açma; gerçek ödeme veya abonelik satın alma yapılmaz.
- Ekranı uyanık tutma tercihi Expo KeepAwake ile uygulanır.

MVP oyunları sunucu gerektirmez. İsteğe bağlı API için mobile/.env dosyasına EXPO_PUBLIC_API_URL=http://BILGISAYARIN_YEREL_IP_ADRESI:3000/api yazın. Telefonda localhost bilgisayarı göstermez.

## Devam eden işler

Diğer katalog oyunlarının kendilerine özel motorları, ses efektleri, gerçek hesap ekranları, RevenueCat satın alma/geri yükleme, gizlilik metni ve mağaza paketleri henüz tamamlanmadı. VIP fiyatları ve avantajları taslak/demo niteliğinde. Mevcut backend ayrı bir Express/PostgreSQL taslağıdır; üretim güvenlik incelemesi ve entegrasyon testi yapılmadı.

## Backend (isteğe bağlı)

    cd backend
    pnpm install
    pnpm run build

DATABASE_URL ve JWT_SECRET ortam değişkenleri gereklidir. Derlemeden sonra pnpm run db:migrate ve pnpm run db:seed komutları çalıştırılabilir. Canlı çok oyunculu odalar V2 kapsamındadır.

Gizemli Hikâye (Evet / Hayır): ücretsiz katalog oyunu; dört Türkçe/İngilizce hikâye, yönetici için gizli çözüm, gruba geçmeden gizleme ve onayla çözümü açma akışı. Telefon arka plana geçerse yöneticinin gizli çözümü kapanır.
