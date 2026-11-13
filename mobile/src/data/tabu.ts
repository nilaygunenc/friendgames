import { TabuCard } from '../types';

const card = (id: string, main: string, banned: string[], category: TabuCard['category'], difficulty: TabuCard['difficulty']): TabuCard => ({ id, main, banned, category, difficulty });

const starterCards: TabuCard[] = [
  card('elma', 'ELMA', ['Meyve', 'Ağaç', 'Kırmızı', 'Yemek', 'Bahçe'], 'yemek', 'kolay'),
  card('deniz', 'DENİZ', ['Su', 'Kumsal', 'Dalga', 'Balık', 'Yüzmek'], 'doğa', 'kolay'),
  card('ucak', 'UÇAK', ['Pilot', 'Hava', 'Kanat', 'Yolculuk', 'Havalimanı'], 'günlük-yaşam', 'kolay'),
  card('muzik', 'MÜZİK', ['Nota', 'Şarkı', 'Ses', 'Enstrüman', 'Konser'], 'kültür', 'kolay'),
  card('fotograf', 'FOTOĞRAF', ['Kamera', 'Çekmek', 'Resim', 'Lens', 'Albüm'], 'teknoloji', 'orta'),
  card('spor', 'SPOR', ['Top', 'Oyun', 'Yarışma', 'Antrenman', 'Futbol'], 'spor', 'kolay'),
  card('kitap', 'KİTAP', ['Okumak', 'Sayfa', 'Hikaye', 'Yazar', 'Kapak'], 'kültür', 'kolay'),
  card('sokak', 'SOKAK', ['Yol', 'Cadde', 'Yürümek', 'Kaldırım', 'Trafik'], 'günlük-yaşam', 'kolay'),
  card('gunes', 'GÜNEŞ', ['Işık', 'Sıcak', 'Sarı', 'Uzay', 'Sistem'], 'doğa', 'orta'),
  card('arkadas', 'ARKADAŞ', ['Dost', 'İnsan', 'Beraber', 'Grup', 'Yanında'], 'günlük-yaşam', 'kolay'),
  card('dugun', 'DÜĞÜN', ['Evlilik', 'Gelin', 'Damat', 'Nikah', 'Tören'], 'günlük-yaşam', 'kolay'),
  card('para', 'PARA', ['Nakit', 'Madeni', 'TL', 'Banknot', 'Maaş'], 'günlük-yaşam', 'orta'),
  card('tatil', 'TATİL', ['Deniz', 'Seyahat', 'Otel', 'Yaz', 'Dinlenmek'], 'günlük-yaşam', 'kolay'),
  card('telefon', 'TELEFON', ['Cep', 'Arayan', 'Ekran', 'Akıllı', 'Uygulama'], 'teknoloji', 'kolay'),
  card('pizza', 'PİZZA', ['İtalya', 'Hamur', 'Domates', 'Peynir', 'Fırın'], 'yemek', 'kolay'),
  card('kopek', 'KÖPEK', ['Hayvan', 'Patisi', 'Havlamak', 'Tasma', 'Tüy'], 'hayvanlar', 'kolay'),
  card('araba', 'ARABA', ['Direksiyon', 'Motor', 'Teker', 'Sürüş', 'Yolcu'], 'teknoloji', 'orta'),
  card('hastane', 'HASTANE', ['Doktor', 'İlaç', 'Hasta', 'Ameliyat', 'Hemşire'], 'günlük-yaşam', 'orta'),
  card('okul', 'OKUL', ['Öğretmen', 'Sınıf', 'Ders', 'Öğrenci', 'Sınav'], 'günlük-yaşam', 'kolay'),
  card('sinema', 'SİNEMA', ['Film', 'Ekran', 'Seyretmek', 'Bilet', 'Perde'], 'sinema', 'kolay'),
  card('walkman', 'WALKMAN', ['Kaset', 'Sony', 'Müzik', 'Kulaklık', 'Taşınabilir'], '90lar', 'orta'),
  card('vhs', 'VHS', ['Video', 'Kaset', 'Film', 'Kayıt', 'VCR'], '90lar', 'orta'),
  card('tamagotchi', 'TAMAGOTCHI', ['Sanal', 'Evcil', 'Japon', 'Beslemek', 'Oyuncak'], '90lar', 'zor'),
  card('kuantum-bilgisayar', 'KUANTUM BİLGİSAYAR', ['Qubit', 'Süperpozisyon', 'Dolanıklık', 'Algoritma', 'İşlemci'], 'teknoloji', 'ekstrem'),
];

const categoryWords: Record<TabuCard['category'], string[]> = {
  sinema: ['SİNEMA','Oscar','Yeşilçam','Hollywood','Cannes','Yönetmen','Oyuncu','Başrol','Figüran','Senaryo','Fragman','Gişe','Festival','Komedi','Dram','Korku filmi','Bilim kurgu','Animasyon','Belgesel','Aksiyon','Romantik komedi','Kurgu','Montaj','Set','Çekim','Perde','Sinema salonu','Kamera','Klaket','Prömiyer','Devam filmi','Kısa film','Uzun metraj','Dublaj','Altyazı','Replik','Sahne','Dekor','Kostüm','Makyaj','Film müziği','Görüntü yönetmeni','Yapımcı','Senarist','Jenerik','Vizyonda','İzleyici','Bilet gişesi','Yönetmen koltuğu','Başrol oyuncusu'],
  teknoloji: ['FOTOĞRAF','TELEFON','ARABA','KUANTUM BİLGİSAYAR','Ethernet','Bilgisayar','Tablet','Laptop','Klavye','Fare','Ekran','Yazılım','Donanım','İnternet','Wi-Fi','Bluetooth','Uygulama','Yapay zekâ','Robot','Şarj','Batarya','Kulaklık','Mikrofon','Yazıcı','Tarayıcı','USB','Bulut depolama','Şifre','QR kod','E-posta','Web sitesi','Sosyal medya','Akıllı saat','Oyun konsolu','İşlemci','Bellek','Anakart','Piksel','Dokunmatik ekran','Algoritma','Kodlama','Siber güvenlik','Bilgisayar virüsü','Güncelleme','Sunucu','Veri tabanı','Arama motoru','GPS','Drone','Sanal gerçeklik'],
  'günlük-yaşam': ['UÇAK','SOKAK','ARKADAŞ','DÜĞÜN','PARA','TATİL','HASTANE','OKUL','Kahvaltı','Komşu','Apartman','Asansör','Market','Alışveriş','Sepet','Fatura','Kira','Cüzdan','Anahtar','Toplu taşıma','Otobüs','Metro','Taksi','Trafik ışığı','Randevu','Takvim','Doğum günü','Hediye','Misafir','Telefon görüşmesi','Mesaj','Sohbet','Temizlik','Çamaşır','Bulaşık','Ütü','Mutfak','Buzdolabı','Koltuk','Yatak','Yastık','Battaniye','Terlik','Şemsiye','Yağmur','Hafta sonu','Öğle yemeği','Akşam','Alarm'],
  '90lar': ['WALKMAN','VHS','TAMAGOTCHI','Kasetçalar','Disket','Atari','Game Boy','Tetris','Nintendo','Sega','Çevirmeli telefon','Ankesörlü telefon','Mektup','Pul','Faks','Dial-up internet','Modem','İnternet kafe','MS-DOS','Windows 95','Windows 98','Diskman','CD çalar','CD-ROM','Video kaset','Video kulübü','Kirby','Pokémon','Power Rangers','Sailor Moon','Ninja Kaplumbağalar','Barbie','Furby','Yo-yo','Lavaş lambası','Neon renk','Kot ceket','Ekose gömlek','Scrunchie','Tokalı kemer','Rap kaseti','Pop müzik','Boyband','Klip kanalı','Müzik seti','Sanal bebek','Renkli televizyon','Teletext','Polaroid'],
  doğa: ['DENİZ','GÜNEŞ','Dağ','Orman','Nehir','Göl','Şelale','Okyanus','Ada','Vadi','Mağara','Volkan','Deprem','Yağmur','Kar','Rüzgâr','Fırtına','Gökkuşağı','Bulut','Şimşek','Gök gürültüsü','Çöl','Kutup','Buzul','Kanyon','Sahil','Kumsal','Dalga','Gelgit','Mercan resifi','Orman yangını','Yıldız','Ay','Gezegen','Samanyolu','Gün doğumu','Gün batımı','Mevsim','İlkbahar','Yaz','Sonbahar','Kış','Sis','Çiy','Kuraklık','Çığ','Yaprak','Tohum','Çiçek','Kök'],
  spor: ['SPOR','Futbol','Basketbol','Voleybol','Tenis','Yüzme','Atletizm','Maraton','Boks','Güreş','Judo','Karate','Tekvando','Bisiklet','Kayak','Snowboard','Buz pateni','Jimnastik','Hentbol','Ragbi','Golf','Masa tenisi','Badminton','Okçuluk','Eskrim','Kano','Kürek','Sörf','Dalış','Tırmanış','Satranç','Formula 1','Ralli','Olimpiyat','Dünya Kupası','Şampiyonluk','Hakem','Antrenör','Kaleci','Forvet','Savunma','Penaltı','Faul','Ofsayt','Serbest atış','Ribaund','Servis','Set sayısı','Podyum','Madalyon'],
  kültür: ['MÜZİK','KİTAP','Şarkı','Konser','Tiyatro','Opera','Bale','Müze','Heykel','Resim','Şiir','Roman','Öykü','Masal','Yazar','Şair','Ressam','Besteci','Orkestra','Koro','Nota','Gitar','Piyano','Keman','Davul','Sergi','Kütüphane','Kitapçı','Çeviri','Edebiyat','Mitoloji','Destan','Gelenek','Bayram','Halk dansı','Folklor','Kukla','Sahne','Perde','Dekor','Kostüm','El sanatı','Seramik','Hat sanatı','Minyatür','Fotoğrafçılık','Mimari','Tarihi eser','Festival','Kültür'],
  yemek: ['ELMA','PİZZA','Ekmek','Peynir','Zeytin','Yumurta','Çorba','Salata','Pilav','Makarna','Mantı','Lahmacun','Döner','Kebap','Baklava','Künefe','Dondurma','Çikolata','Pasta','Kurabiye','Kahvaltı','Bal','Reçel','Yoğurt','Ayran','Turşu','Dolma','Sarma','Börek','Gözleme','Tost','Hamburger','Patates kızartması','Sandviç','Simit','Poğaça','Menemen','Mercimek','Nohut','Kuru fasulye','Zeytinyağlı','Baharat','Tarçın','Nane','Limon','Domates','Salatalık','Patlıcan','Biber','Soğan'],
  hayvanlar: ['KÖPEK','Kedi','At','İnek','Koyun','Keçi','Tavuk','Horoz','Ördek','Kaz','Hindi','Aslan','Kaplan','Fil','Zürafa','Zebra','Maymun','Goril','Ayı','Kurt','Tilki','Tavşan','Sincap','Kirpi','Geyik','Deve','Kanguru','Koala','Panda','Penguen','Kartal','Baykuş','Papağan','Serçe','Flamingo','Timsah','Yılan','Kaplumbağa','Kurbağa','Kertenkele','Yunus','Balina','Köpek balığı','Ahtapot','Yengeç','Istakoz','Arı','Kelebek','Karınca','Örümcek'],
  diğer: ['DÜĞÜN','PARA','TATİL','Zaman','Şans','Rüya','Gölge','Sessizlik','Gürültü','Koku','Tat','Renk','Sayı','Harf','Kelime','Soru','Cevap','Sır','Şifre','Harita','Pusula','Saat','Takvim','Ayna','Mum','Balon','Uçurtma','Sabun','Diş fırçası','Gözlük','Şapka','Çanta','Valiz','Şişe','Kutu','Zarf','Makas','Yapıştırıcı','Merdiven','Köprü','Kule','Labirent','Hazine','Dedektif','Casus','Kahraman','Canavar','Robot','Uzaylı','Zaman makinesi'],
};

const relatedWords: Record<TabuCard['category'], string[]> = {
  sinema: ['Film','Oyuncu','Yönetmen','Sahne','Senaryo','Kamera','Ekran','Perde','Bilet','Salon','Fragman','Gişe','Oscar','Kurgu','Çekim','Set','Replik','Başrol','Festival','İzleyici','Makyaj','Kostüm','Ses','Işık','Gösterim'],
  teknoloji: ['Cihaz','Ekran','Veri','Uygulama','İnternet','Yazılım','Donanım','İşlemci','Şarj','Bağlantı','Dijital','Kod','Sistem','Bellek','Akıllı','Ağ','Dosya','Program','Elektronik','Güvenlik','Bulut','Sanal','Dokunmatik','Makine','Bilgi'],
  'günlük-yaşam': ['Ev','İnsan','Gün','İş','Aile','Zaman','Şehir','Günlük','Alışkanlık','Yapmak','Gitmek','Gelmek','Kullanmak','Yaşamak','Sabah','Akşam','Hafta','İhtiyaç','Eşya','Yer','Yemek','Taşımak','Düzen','Plan','Rutin'],
  '90lar': ['Kaset','Televizyon','Oyun','Müzik','Eski','Çocuk','Nostalji','Video','Dönem','Cihaz','Renkli','Masaüstü','Disk','Popüler','Elektronik','Çizgi film','Oyuncak','Bilgisayar','Şarkı','Koleksiyon','Moda','Eğlence','Ekran','Kayıt','Sanal'],
  doğa: ['Doğa','Su','Hava','Yeryüzü','Gökyüzü','Canlı','Bitki','Taş','Toprak','Mevsim','Sıcaklık','Soğuk','Yağış','Manzara','Açık hava','Dağ','Orman','Deniz','Hayvan','Rüzgâr','Yüksek','Derin','Yeşil','Mavi','Ekosistem'],
  spor: ['Oyun','Takım','Oyuncu','Top','Saha','Maç','Yarış','Antrenman','Kural','Hakem','Kazanmak','Kaybetmek','Sayı','Puan','Şampiyon','Turnuva','Müsabaka','Hareket','Ekipman','Salon','Sporcu','Madalya','Olimpiyat','Hız','Güç'],
  kültür: ['Sanat','Eser','Tarih','Gelenek','Yaratıcı','Sahne','İzleyici','Yazar','Okumak','Dinlemek','Görmek','Gösteri','Müze','Toplum','Miras','Yapıt','El işi','Anlatı','Müzik','Kitap','Klasik','Kültürel','Dünya','İfade','Üretmek'],
  yemek: ['Yemek','İçecek','Mutfak','Pişirmek','Malzeme','Tat','Koku','Tabak','Sofra','Tarif','Lezzet','Aşçı','Fırın','Tencere','Kaşık','Tuz','Şeker','Sıcak','Soğuk','Atıştırmalık','Öğün','Geleneksel','Sebze','Meyve','Hamur'],
  hayvanlar: ['Canlı','Doğa','Tür','Yavru','Yaşam','Vahşi','Evcil','Orman','Ses','Beslenmek','Av','Avcı','Kuyruk','Kanat','Pençe','Dört ayak','Tüy','Deri','Yuva','Sürü','Deniz','Karada','Uçmak','Yüzmek','Habitat'],
  diğer: ['Şey','Nesne','Kavram','Duygu','Fikir','İnsan','Zaman','Günlük','Özellik','Durum','Yapmak','Bulmak','Kullanmak','Söylemek','Düşünmek','Görmek','Bilmek','Küçük','Büyük','Yeni','Eski','Hayat','Dünya','Anlam','Olay'],
};

// Keep the requested 50 new cards per category in addition to the original starter cards.
const extraWords: Partial<Record<TabuCard['category'], string[]>> = {
  sinema: ['Sinema bileti'],
  teknoloji: ['İkili doğrulama', 'E-kitap okuyucu', 'Hologram', 'Ethernet kablosu'],
  'günlük-yaşam': ['Kargo paketi', 'Pazar arabası', 'Diş hekimi randevusu', 'Yemek siparişi', 'Spor salonu', 'Kütüphane kartı', 'Telefon şarjı'],
  '90lar': ['Jetonlu telefon', 'Disket kutusu'],
  doğa: ['Şafak', 'Yıldırım'],
  spor: ['Badminton raketi'],
  kültür: ['Arkeoloji', 'Kültür başkenti'],
  yemek: ['Sütlaç', 'İskender kebap'],
  hayvanlar: ['Leylek'],
};
for (const [category, words] of Object.entries(extraWords) as [TabuCard['category'], string[]][]) categoryWords[category].push(...words);

const normalize = (value: string) => value.toLocaleLowerCase('tr-TR').trim();
const slug = (value: string) => value.toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ı/g, 'i').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const generatedCards = (Object.entries(categoryWords) as [TabuCard['category'], string[]][]).flatMap(([category, words]) => {
  const existing = new Set(starterCards.filter(entry => entry.category === category).map(entry => normalize(entry.main)));
  return words.filter(word => !existing.has(normalize(word))).map((main, index): TabuCard => {
    const banned: string[] = [];
    const pool = relatedWords[category];
    for (let offset = 0; banned.length < 5 && offset < pool.length * 2; offset++) {
      const candidate = pool[(index * 7 + offset * 11) % pool.length];
      if (normalize(candidate) !== normalize(main) && !banned.some(value => normalize(value) === normalize(candidate))) banned.push(candidate);
    }
    return { id: `${category}-${slug(main)}`, main, banned, category, difficulty: (['kolay', 'orta', 'zor', 'ekstrem'] as const)[index % 4] };
  });
});

export const tabuKartlar: TabuCard[] = [...starterCards, ...generatedCards];
