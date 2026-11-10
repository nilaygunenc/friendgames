import type { AuctionCategory } from './auction';

export interface AuctionArtwork {
  uri: string;
  source: string;
  credit: string;
  license: string;
}

const thumb = (hash: string, file: string) =>
  `https://upload.wikimedia.org/wikipedia/commons/thumb/${hash}/${encodeURIComponent(file)}/720px-${encodeURIComponent(file)}`;

export const auctionArtwork: Record<AuctionCategory, AuctionArtwork> = {
  animals: {
    uri: thumb('0/0d', 'Red_fox_on_Kodiak_Refuge_(45636120321).jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:Red_fox_on_Kodiak_Refuge_(45636120321).jpg',
    credit: 'Lisa Hupp / U.S. Fish & Wildlife Service',
    license: 'Public domain (U.S. federal work)',
  },
  mythic: {
    uri: thumb('3/33', 'Altes_Museum_-_Antikensammlung_058.JPG'),
    source: 'https://commons.wikimedia.org/wiki/File:Altes_Museum_-_Antikensammlung_058.JPG',
    credit: 'Marcus Cyron',
    license: 'CC BY-SA 3.0',
  },
  beauty: {
    uri: thumb('0/08', 'Makeup_cosmetics.jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:Makeup_cosmetics.jpg',
    credit: 'Bairavi Arjunan3',
    license: 'CC BY-SA 4.0',
  },
  food: {
    uri: thumb('8/83', 'Kilis_Kebabı.jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:Kilis_Kebab%C4%B1.jpg',
    credit: 'Sabri76',
    license: 'CC BY-SA 3.0',
  },
  characters: {
    uri: 'https://i.gazeteduvar.com.tr/2/1280/720/2020/06/EZG%C4%B07.jpg',
    source: 'https://www.gazeteduvar.com.tr/yazarlar/2020/06/30/yerli-dizilerde-guvenlik-meselesi',
    credit: 'Gazete Duvar · Türk dizileri kolajı',
    license: 'Editorial image; rights belong to the original holder',
  },
  survival: {
    uri: thumb('6/66', 'Camping_Equipment_(542927498).jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:Camping_Equipment_(542927498).jpg',
    credit: 'wetwebwork',
    license: 'CC BY-SA 2.0',
  },
  worklife: {
    uri: thumb('b/b6', 'Coffee_and_workspace_setup_on_a_desk_during_a_productive_morning_session.jpg'),
    source: 'https://commons.wikimedia.org/wiki/File:Coffee_and_workspace_setup_on_a_desk_during_a_productive_morning_session.jpg',
    credit: 'Shixart1985',
    license: 'CC BY 2.0',
  },
};

/** Match each character card to imagery from its own Turkish series. */
export const auctionSeriesArtwork: Record<string, AuctionArtwork> = {
  'kurtlar-vadisi': {
    uri: 'https://pbs.twimg.com/media/EnMPM2aXUAE-eRK.jpg',
    source: 'https://x.com/K_V_PUSU/status/1329423078544302084',
    credit: 'Kurtlar Vadisi Pusu official account',
    license: 'Promotional still; rights belong to the original holder',
  },
  'ask-memnu': {
    uri: 'https://image.posta.com.tr/i/posta/75/750x0/66f1576b4b741637164c766a.jpg',
    source: 'https://www.posta.com.tr/galeri/ask-i-memnunun-bihteri-behlulu-boyle-iyilestirmisti-soguk-havalara-kalkan-olan-sifali-cay-ihlamurun-icine-avuc-avuc-ekleyin-2753341',
    credit: 'Posta · Aşk-ı Memnu cast',
    license: 'Editorial image; rights belong to the original holder',
  },
  selena: {
    uri: 'https://img-s2.onedio.com/id-6331b941bb4ec5213c951a74/rev-0/w-1200/h-945/f-jpg/s-8df2ebe79cf00c048776610634edf3c3ee552482.jpg',
    source: 'https://onedio.com/haber/basina-neler-geldi-sinan-caliskanoglu-yillar-sonra-selena-dizisinde-canlandirdigi-hades-karakterini-anlatti-1096681',
    credit: 'Onedio · Selena and Hades',
    license: 'Editorial image; rights belong to the original holder',
  },
  ezel: {
    uri: 'https://iatv.tmgrup.com.tr/album/2025/07/30/ramiz-dayinin-efsane-100-repligi-1753883427621.jpg',
    source: 'https://www.atv.com.tr/ezel/galeri/ramiz-dayinin-efsane-100-repligi',
    credit: 'atv · Ezel gallery',
    license: 'Promotional still; rights belong to the original holder',
  },
  'behzat-c': {
    uri: 'https://media.startv.com.tr/star-tv/images/cb924b604dd0b4ffd3c78d9a.jpg?format=webp&height=596&width=1000',
    source: 'https://www.startv.com.tr/dizi/behzat-c/foto-galeriler/96-bolum-fotograflari',
    credit: 'Star TV · Behzat Ç. episode gallery',
    license: 'Promotional still; rights belong to the original holder',
  },
  'avrupa-yakasi': {
    uri: 'https://img-s2.onedio.com/id-57fbc03ab5b0925020662101/rev-0/w-635/f-jpg/s-f0b54fe45583b56a64bd02ddafe8c7f88942d904.jpg',
    source: 'https://onedio.com/haber/unutulmaz-13-ozelligiyle-hafizalara-kazinan-karakter-burhan-altintop-734261',
    credit: 'Onedio · Burhan Altıntop',
    license: 'Editorial image; rights belong to the original holder',
  },
  'muhtesem-yuzyil': {
    uri: 'https://image.milimaj.com/i/milliyet/75/869x477/5c8d294a45d2a04bdc36c6df.jpg',
    source: 'https://www.milliyet.com.tr/cadde/hurrem-sultan-olmak-icin-7-kilo-verdi-1337724',
    credit: 'Milliyet · Hürrem Sultan and Süleyman',
    license: 'Editorial image; rights belong to the original holder',
  },
  cukur: {
    uri: 'https://mo.ciner.com.tr/video/2018/05/07/ver1726038663/D93647335304D1FBC81C8AF8C2516FDC_1200x630.jpg',
    source: 'https://www.showtv.com.tr/dizi/sahne/cukur-idris-vartoluya-tokat-atiyor/57573',
    credit: 'Show TV · Çukur scene',
    license: 'Promotional still; rights belong to the original holder',
  },
  'leyla-mecnun': {
    uri: 'https://img.odatv.com/rcman/Cw1280h720q95gc/storage/old/images/2021_08/2021_08_19/odatv_image_65__1538d04621a444.jpg',
    source: 'https://www.odatv.com/kultur-sanat/leyla-ile-mecnun-dizisinin-yayin-tarihi-belli-oldu-208097',
    credit: 'OdaTV · Leyla ile Mecnun cast',
    license: 'Editorial image; rights belong to the original holder',
  },
};

/** Bundled illustrations shown immediately and kept as a fallback if a photo host is offline. */
export const auctionArtworkFallback: Record<AuctionCategory, number> = {
  animals: require('../../assets/auction-animals.png'),
  mythic: require('../../assets/auction-mythic.png'),
  beauty: require('../../assets/auction-beauty.png'),
  food: require('../../assets/auction-food.png'),
  characters: require('../../assets/auction-characters.png'),
  survival: require('../../assets/auction-survival.png'),
  worklife: require('../../assets/auction-worklife.png'),
};

export const auctionSeriesArtworkFallback: Record<string, number> = {
  'kurtlar-vadisi': require('../../assets/auction-series-kurtlar-vadisi.png'),
  'ask-memnu': require('../../assets/auction-series-ask-memnu.png'),
  selena: require('../../assets/auction-series-selena.png'),
  ezel: require('../../assets/auction-series-ezel.png'),
  'behzat-c': require('../../assets/auction-series-behzat-c.png'),
  'avrupa-yakasi': require('../../assets/auction-series-avrupa-yakasi.png'),
  'muhtesem-yuzyil': require('../../assets/auction-series-muhtesem-yuzyil.png'),
  cukur: require('../../assets/auction-series-cukur.png'),
  'leyla-mecnun': require('../../assets/auction-series-leyla-mecnun.png'),
};
