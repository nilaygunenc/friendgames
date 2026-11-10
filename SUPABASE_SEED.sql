-- ========================================
-- FriendGames Seed Data for Supabase
-- ========================================
-- Bu SQL'i Supabase SQL Editor'de çalıştırın
-- 12 oyun + Admin kullanıcısı ekleyecek
-- ========================================

-- Insert Games (12 oyun)
INSERT INTO games (id, name, icon, category, category_label, min_players, max_players, min_time, max_time, description, is_vip, engine, rules, badges)
VALUES
('kim-daha-cok', 'Kim Daha Çok?', '🤔', 'buz-kirici', 'Buz Kırıcı', 2, 20, 10, 30, 'Grupta kim daha çok... sorularıyla birbirinizi tanıyın!', false, 'question', '["Soru okunur ve herkes aynı anda tahmin ettiği kişiye işaret eder", "En çok işaret edilen kişi kazanır"]', '["Popüler", "Kolay"]'),

('ne-zaman', 'Ne Zaman?', '📅', 'buz-kirici', 'Buz Kırıcı', 2, 20, 10, 30, 'Kişiler hakkında ne zaman sorularıyla tahmin yürütün!', false, 'question', '["Soru okunur ve tahmin edilen kişi seçilir", "Kişi gerçek cevabı söyler"]', '["Eğlenceli", "Orta"]'),

('tabu', 'Tabu', '🚫', 'kelime', 'Kelime Oyunu', 4, 20, 20, 60, 'Yasaklı kelimeleri kullanmadan kelimeyi anlat!', true, 'tabu', '["Ekip arkadaşlarına kelimeyi yasaklı kelimeleri kullanmadan anlatın", "Süre dolmadan en çok kelime bulmaya çalışın"]', '["VIP", "Klasik"]'),

('ajan', 'Ajan', '🕵️', 'gizli-rol', 'Gizli Rol', 6, 12, 15, 45, 'Gizli ajanı bulun veya saklanın!', true, 'spy', '["Herkes gizli lokasyonu öğrenir, sadece ajan bilmez", "Ajan lokasyonu bulmaya çalışır"]', '["VIP", "Strateji"]'),

('mafya', 'Mafya', '🎭', 'gizli-rol', 'Gizli Rol', 8, 16, 30, 90, 'Klasik mafya oyunu - kim masum kim mafya?', true, 'mafia', '["Gece mafya birini seçer", "Gündüz herkes tartışır ve oy verir"]', '["VIP", "Klasik", "Uzun"]'),

('truth-dare', 'Doğruluk mu Cesaret mi', '😳', 'buz-kirici', 'Buz Kırıcı', 2, 20, 15, 60, 'Klasik parti oyunu - doğruluk sorusu mu, cesaret görevi mi?', false, 'truth-dare', '["Sırayla dönerek Doğruluk veya Cesaret seç", "Soruyu yanıtla veya görevi yap"]', '["Popüler", "Eğlenceli"]'),

('kim-yapmistir', 'Kim Yapmıştır?', '🙈', 'buz-kirici', 'Buz Kırıcı', 3, 20, 15, 45, 'Gizli itiraflar ve tahminler oyunu!', false, 'question', '["Herkes gizlice bir itiraf yazar", "İtiraflar okunur ve kim yaptı tahmin edilir"]', '["Eğlenceli", "Gizli"]'),

('hic-yapmadim', 'Hiç Yapmadım', '✋', 'buz-kirici', 'Buz Kırıcı', 3, 20, 10, 30, '10 parmak oyunu - yapmadıklarınızı paylaşın!', false, 'never-have-i', '["Herkes 10 parmaklarını açar", "Sırayla Hiç yapmadım der", "Yapanlar parmak kapatır"]', '["Kolay", "Hızlı"]'),

('kelime-avi', 'Kelime Avı', '🔤', 'kelime', 'Kelime Oyunu', 2, 20, 15, 45, 'Kategoriye göre kelime bulma yarışması!', false, 'word-hunt', '["Kategori belirlenir", "Süre içinde en çok kelime bulan kazanır"]', '["Yarışma", "Hızlı"]'),

('isim-sehir', 'İsim Şehir Hayvan', '📝', 'kelime', 'Kelime Oyunu', 2, 20, 20, 60, 'Klasik kalem kağıt oyunu!', false, 'categories', '["Harf belirlenir", "Kategorilere göre kelime bulunur", "Özgün cevaplar daha çok puan kazandırır"]', '["Klasik", "Nostaljik"]'),

('muzik-yarismasi', 'Müzik Yarışması', '🎵', 'friendgames', 'FriendGames Özel', 4, 20, 20, 60, 'Şarkı tahmin yarışması!', true, 'music', '["Şarkı çalınır", "İlk tahmin eden puan kazanır"]', '["VIP", "Müzik"]'),

('kim-olur', 'Kim Ölür?', '💀', 'friendgames', 'FriendGames Özel', 3, 20, 15, 45, 'Şans ve strateji oyunu - kim hayatta kalacak?', false, 'survival', '["Herkes sırayla şans çeker", "Kaybeden elenir", "Son kalan kazanır"]', '["Şans", "Heyecan"]');

-- Insert Admin User (email: admin@friendgames.app, password: Admin123!)
INSERT INTO users (email, password_hash, display_name, is_admin, is_vip)
VALUES (
  'admin@friendgames.app',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'Admin User',
  true,
  true
)
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- Seed completed!
-- 12 oyun + 1 admin kullanıcısı eklendi
-- ========================================
-- Admin giriş bilgileri:
-- Email: admin@friendgames.app
-- Password: Admin123!
-- ========================================
