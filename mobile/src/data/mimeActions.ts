export interface MimeAction {
  answer: string;
  steps: string[];
}

export const mimeActions: MimeAction[] = [
  { answer: 'Su içiyorsun', steps: ['Sol elinle masadan bir bardak al.', 'Bardağı karnının hizasına getir.', 'Sağ elinle bardağı çeviriyormuş gibi yap.', 'Bardağı ağzına götür ve içiyormuş gibi yap.'] },
  { answer: 'Telefonla konuşuyorsun', steps: ['Sağ elini kulağına götür.', 'Başını hafifçe yana eğ.', 'Diğer elinle boşlukta yürüyüş işareti yap.', 'Arada başınla onaylar gibi yap.'] },
  { answer: 'Dişlerini fırçalıyorsun', steps: ['Bir elinle hayali macun tüpünü tut.', 'Diğer elinle fırçaya macun sık.', 'Fırçayı ağzına götür.', 'Küçük hızlı hareketlerle dişlerini fırçala.'] },
  { answer: 'Saçını tarıyorsun', steps: ['Bir elinle hayali tarak al.', 'Tarağı başının üstüne koy.', 'Saçını yukarıdan aşağı tara.', 'Aynaya bakıyormuş gibi başını iki yana çevir.'] },
  { answer: 'Fotoğraf çekiyorsun', steps: ['İki elinle önünde telefon tut.', 'Kollarını biraz ileri uzat.', 'Bir an durup kadraj ayarla.', 'Başparmağınla ekrana bas.'] },
  { answer: 'Kitap okuyorsun', steps: ['İki elinle önünde açık bir kitap tut.', 'Gözlerinle satırları takip et.', 'Sağ elinle bir sayfayı çevir.', 'Şaşırmış gibi kaşlarını kaldır.'] },
  { answer: 'Kahve yapıyorsun', steps: ['Bir elinle kupa tut.', 'Diğer elinle kupaya bir şey dök.', 'Kaşık tutuyormuş gibi yap.', 'Kupayı karıştır ve kokla.'] },
  { answer: 'Kapı çalıyorsun', steps: ['Bir elinle kapı kolu arar gibi yap.', 'Elini yumruk yap.', 'Önündeki hayali kapıya üç kez vur.', 'Kapının açılmasını bekliyormuş gibi geri çekil.'] },
  { answer: 'Balon şişiriyorsun', steps: ['İki parmağınla küçük bir balon tut.', 'Balonu ağzına götür.', 'Yanıkların şişiyormuş gibi nefes ver.', 'Gittikçe büyüyen balonu iki elinle göster.'] },
  { answer: 'Kedi seviyorsun', steps: ['Eğilip yerde küçük bir şey görmüş gibi yap.', 'Bir elinle nazikçe başını okşa.', 'Diğer elinle sırtını sev.', 'Gülümseyip kediyi kucağına alır gibi yap.'] },
  { answer: 'Yemek pişiriyorsun', steps: ['Bir elinle tava sapı tut.', 'Diğer elinle kaşık tut.', 'Tavayı karıştır.', 'Koklayıp tadına bakıyormuş gibi yap.'] },
  { answer: 'Araba kullanıyorsun', steps: ['İki elinle direksiyon tut.', 'Önüne dikkatlice bak.', 'Bir elinle sinyal veriyormuş gibi yap.', 'Direksiyonu yavaşça çevir.'] },
  { answer: 'Hediye paketi açıyorsun', steps: ['Önünde büyük bir kutu tut.', 'Üzerindeki kurdeleyi çöz.', 'Kutunun kapağını aç.', 'İçine bakıp çok sevin.'] },
  { answer: 'Makyaj yapıyorsun', steps: ['Bir elinle küçük ayna tut.', 'Diğer elinle yüzüne hafif dokun.', 'Gözünün çevresine dikkatle çalış.', 'Aynaya bakıp sonucu kontrol et.'] },
  { answer: 'Yağmurdan korunuyorsun', steps: ['Bir elini başının üstüne kaldır.', 'Hayali şemsiyeyi aç.', 'Omuzlarını hafifçe büz.', 'Islak zeminde dikkatli yürür gibi yap.'] },
];
