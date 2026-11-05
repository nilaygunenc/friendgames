import en from './en.json';
export type Language = 'tr' | 'en';
const dictionary: Record<string, string> = en;
const builtInTranslations: Record<string, string> = {
  'Son Teklif! (Açık Artırma)': 'Final Bid! (Auction)',
  'Strateji': 'Strategy',
  '20$ bütçeni akıllıca kullan: hayvan veya efsanevi canlıları açık artırmada kap, en güçlü ve en uyumlu kadroyu kur.': 'Use your $20 wisely: win animals or mythic creatures at auction and build the strongest, most compatible roster.',
  'İki oyuncu eşit 20$ bütçeyle başlar ve kategori seçer. Gelecek kartlar önceden gösterilmez.': 'Two players begin with equal $20 budgets and choose a category. Future cards are not revealed in advance.',
  'Sıradaki oyuncu 1$ ile teklif açabilir ya da pas geçebilir. Rakip teklifi artırır veya açık artırmadan çekilir.': 'The active player can open at $1 or pass. The opponent can raise or withdraw from the auction.',
  'Çekilen oyuncu o turda tekrar teklif veremez. En yüksek teklif sahibi kartı alır ve teklif bütçesinden düşer.': 'A player who withdraws cannot bid again that round. The highest bidder gets the card and pays the bid from their budget.',
  'Her kart yalnızca bir kadroya katılabilir. Oyuncular mevcut bütçelerini aşan teklif veremez.': 'Each card can join only one roster. Players cannot bid above their remaining budget.',
  'Tüm kartlar tamamlanınca kalite puanı ve aynı özellik etiketlerinden gelen uyum puanı hesaplanır.': 'When all cards are complete, quality score and synergy score from matching trait tags are calculated.',
  'En pahalı kadro değil, en yüksek toplam kalite ve uyuma sahip kadro kazanır.': 'The most expensive roster does not win; the roster with the highest combined quality and synergy does.',
  'Kaç Parmak? (1-2-3)': 'How Many Fingers? (1-2-3)',
  'Şans': 'Chance',
  'Sıradaki oyuncu kaç parmağın ekrana geleceğini tahmin eder. 1-2-3 deyin, aynı anda dokunun ve puanı kapın!': 'The active player predicts how many fingers will touch the screen. Say 1-2-3, touch together and claim the point!',
  'Oyuncu sayısını belirleyin. Sıradaki oyuncu tahminini 0 ile oyuncu sayısı arasında seçer.': 'Set the number of players. The active player chooses a guess from 0 through the player count.',
  'Tahmin açıklandıktan sonra herkes seçimini gizli tutar; parmağını ekrana koymak ya da koymamak serbesttir.': 'After the guess is announced, everyone keeps their choice secret; touching the screen is optional.',
  'Ekran 1-2-3 diye saydığında isteyen herkes oyun alanına aynı anda bir parmağını koyar.': 'When the screen counts 1-2-3, everyone who wants to places one finger on the play area at the same time.',
  'Uygulama ekrandaki eşzamanlı parmakları sayar. Tahmin tam eşleşirse sıradaki oyuncu 1 puan alır.': 'The app counts simultaneous fingers on screen. If the guess matches exactly, the active player earns one point.',
  'Tahmin yanlışsa puan yoktur. Her turdan sonra sıra bir sonraki oyuncuya geçer.': 'A wrong guess earns no point. The turn passes to the next player after every round.',
  'Ekran çok küçükse telefon veya tablet herkesin rahatça dokunabileceği düz bir zemine konmalıdır.': 'If the screen is small, place the phone or tablet on a flat surface where everyone can reach it.',
  'Gerçek Dosyalar – Adaletin İki Yüzü': 'Real Case Files – Two Faces of Justice',
  'Tartışma': 'Debate',
  'Resmî kararlardan anonimleştirilmiş dosyaları delil delil inceleyin; önce vicdanen, sonra hukuken tartışın.': 'Examine anonymised case files from official decisions, evidence by evidence; debate first morally, then legally.',
  'Telefonu herkesin görebileceği bir yere koyun. İlk aşamada yalnız olay ve tartışma sorusu açıklanır.': 'Place the phone where everyone can see it. The first stage reveals only the incident and the discussion question.',
  'Herkes ilk değerlendirmesini söyler; iki farklı yaklaşım üzerinden görüşleri savunun.': 'Everyone states an initial view, then defends a position through two possible approaches.',
  '“Yeni Delil Açılıyor” aşamasında ek ayrıntıyı okuyun ve ilk fikrinizi yeniden değerlendirin.': 'At the “New Evidence” stage, read the additional detail and reassess your first view.',
  'Son aşamada resmî kararın hukuki sonucunu, ilgili ilkeyi ve tartışmanın püf noktasını açın.': 'At the final stage, reveal the official legal outcome, the related principle and the key discussion point.',
  'Kartlardaki sonuçlar bilgilendirme ve oyun amaçlı özetlerdir; güncel hukuki tavsiye değildir.': 'The card outcomes are game and information summaries, not current legal advice.',
  'Her kartın resmî kaynağını açıp metni inceleyebilirsiniz. Kaynağı belirsiz kartlar desteğe eklenmez.': 'You can open each card’s official source and review the text. Cards with uncertain sources are not added to the deck.',
  'Herkesin Gözü Birbirinde!': 'All Eyes on Each Other!',
  'Yeni': 'New',
  'Sosyal': 'Social',
  'Soruyu görün, üç saniye düşünün ve aynı anda birbirinizi gösterin. Doğru cevap yok; sürprizler ve sohbet var!': 'See the question, think for three seconds, then point at the same time. There are no right answers; only surprises and conversation!',
  'Telefonu herkesin görebileceği bir yere koyun. İsterseniz bir kişi soruları sesli okusun.': 'Place the phone where everyone can see it. One player may read the questions aloud.',
  'Soru ekrana geldiğinde herkes seçimini sessizce düşünsün. Kimse diğerini etkilemesin.': 'When the question appears, everyone thinks of their choice quietly. Do not influence each other.',
  'Üç saniyelik geri sayım bittiğinde herkes aynı anda seçtiği kişiyi parmağıyla göstersin.': 'When the three-second countdown ends, everyone points to their chosen person at the same time.',
  'Seçimleri ve ortaya çıkan sürprizleri konuşun. Doğru ya da yanlış cevap yoktur.': 'Talk about the choices and surprises. There are no right or wrong answers.',
  'Yeni soruya geçin. Deste bitince karıştırıp yeniden oynayabilirsiniz.': 'Move to the next question. When the deck ends, shuffle and play again.',
  'Ortamı samimi ve saygılı tutun; rahatsız edici bir soru gelirse atlayın.': 'Keep things friendly and respectful; skip any question that makes the group uncomfortable.',
};
// Preserve spacing between separate JSX children and keep the brand name unchanged.
export function translate(text: string, language: Language): string {
  if (language === 'tr' || text.trim() === 'FriendGames') return text;
  const key = text.trim();
  const translation = dictionary[key] ?? builtInTranslations[key];
  if (translation) return text.replace(key, translation);
  const player = key.match(/^Oyuncu (\d+) \/ (\d+)$/);
  if (player) return 'Player ' + player[1] + ' / ' + player[2];
  return text;
}
