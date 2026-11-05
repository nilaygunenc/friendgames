export interface MysteryStory {
  id: string;
  tr: { title: string; opening: string; solution: string };
  en: { title: string; opening: string; solution: string };
}

export const mysteryStories: MysteryStory[] = [
  {
    id: 'water',
    tr: {
      title: 'Bir Bardak Su',
      opening: 'Bir adam restorana girip garsondan bir bardak su ister. Garson ona aniden silah doğrultur. Adam teşekkür ederek restorandan ayrılır.',
      solution: 'Adamın şiddetli bir hıçkırığı vardır; suyu bunu geçirmek için ister. Garson bunu fark eder ve onu korkutmak amacıyla silah doğrultur. Korkunca adamın hıçkırığı geçer. Artık suya ihtiyacı kalmadığı için teşekkür edip ayrılır. Garsonun amacı adama zarar vermek değildir.',
    },
    en: {
      title: 'A Glass of Water',
      opening: 'A man enters a restaurant and asks a waiter for a glass of water. The waiter suddenly points a gun at him. The man thanks the waiter and leaves.',
      solution: 'The man has severe hiccups and wants water to stop them. The waiter notices and points a gun at him to give him a fright. The scare stops the hiccups. The man no longer needs water, so he thanks the waiter and leaves. The waiter never intends to harm him.',
    },
  },
  {
    id: 'silent-concert',
    tr: {
      title: 'Sessiz Konser',
      opening: 'Bir müzisyen boş bir salonda tek nota bile çalmadan sahnede durur. Ertesi gün kaydı izleyen yüzlerce kişi onu alkışlar. Kimse kandırılmamıştır.',
      solution: 'Müzisyen, işaret diliyle söylenen bir şarkıya katılmaktadır. Boş salonda, kameralara şarkıyı işaret diliyle anlatır; enstrüman çalmaz ve ses çıkarmaz. Kayıt ertesi gün çevrimiçi yayımlanır. İzleyiciler onun işaret dili performansını beğenip alkışlar.',
    },
    en: {
      title: 'The Silent Concert',
      opening: 'A musician stands onstage in an empty hall without playing a single note. The next day, hundreds watch the recording and applaud. Nobody has been deceived.',
      solution: 'The musician is performing a song in sign language. In the empty hall, the musician signs the song for the cameras without playing an instrument or making a sound. The recording is published online the following day. Viewers appreciate the signed performance and applaud.',
    },
  },
  {
    id: 'dry-package',
    tr: {
      title: 'Kuru Paket',
      opening: 'Bir kurye yağmurda üstü açık bir kutu taşır. Kutunun içine yağmur girer ama içindeki kâğıtlar hiç ıslanmaz. Kâğıtlar su geçirmez değildir.',
      solution: 'Üstü açık taşıma kutusunun içinde ağzı kapatılmış şeffaf bir poşet vardır. Kâğıtlar bu poşetin içindedir. Yağmur kutuya girer ama sağlam, kapalı poşetten içeri geçemez. Su geçirmez olan kâğıtlar değil, onları koruyan poşettir.',
    },
    en: {
      title: 'The Dry Package',
      opening: 'A courier carries an open box through the rain. Rain enters the box, but the papers inside stay completely dry. The papers are not waterproof.',
      solution: 'Inside the open carrying box is a sealed, transparent plastic bag. The papers are inside that bag. Rain enters the box but cannot get through the intact, sealed bag. The protective bag is waterproof, not the papers.',
    },
  },
  {
    id: 'wrong-clock',
    tr: {
      title: 'Yanlış Saat',
      opening: 'Bir kadın, her gün yanlış saati gösteren duvar saatine bakarak tam vaktinde evden çıkar. Saat bozuk değildir ve kadın başka saate bakmaz.',
      solution: 'Duvar saati bilerek on dakika ileri ayarlanmıştır ve normal hızında çalışır. Kadın bunu bilir. Her gün gerçek çıkış saatinden on dakika ilerideki değeri gördüğünde çıkar. Saat yanlış zamanı gösterse de aradaki sabit farkı bildiği için tam vaktinde hareket eder.',
    },
    en: {
      title: 'The Wrong Clock',
      opening: 'A woman leaves home exactly on time every day by looking at a wall clock that always shows the wrong time. The clock is not broken, and she checks no other clock.',
      solution: 'The wall clock has deliberately been set ten minutes fast and runs normally. The woman knows this. Each day she leaves when the display is ten minutes ahead of her actual departure time. Although it shows the wrong time, the constant offset lets her leave exactly on time.',
    },
  },
];
