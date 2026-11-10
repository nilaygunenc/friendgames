import React, { useMemo, useState } from 'react';
import { Image, Linking, StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { auctionCategories, AuctionCategory, AuctionCategoryData, AuctionItem } from '../data/auction';
import { auctionArtwork, auctionArtworkFallback, auctionSeriesArtwork, auctionSeriesArtworkFallback } from '../data/auctionArtwork';
import { AuctionArtworkImage } from './AuctionArtworkImage';
import { shuffleArray } from '../utils/gameEngine';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'setup' | 'opening' | 'auction' | 'round-result' | 'final';

const foodArtwork: Record<string, number> = {
  iskender: require('../../assets/food-iskender.png'),
  adana: require('../../assets/food-adana.png'),
  lahmacun: require('../../assets/food-lahmacun.png'),
  'lahmacun-ayran-menu': require('../../assets/food-lahmacun.png'),
  manti: require('../../assets/food-manti.png'),
};

function rosterScore(roster: AuctionItem[], categoryData: AuctionCategoryData) {
  const quality = roster.reduce((sum, item) => sum + item.power, 0);
  const tagCounts = roster.flatMap(item => item.tags).reduce<Record<string, number>>((counts, tag) => ({ ...counts, [tag]: (counts[tag] ?? 0) + 1 }), {});
  const repeatedTags = Object.values(tagCounts).reduce((sum, count) => sum + Math.max(0, count - 1) * categoryData.repeatTagBonus, 0);
  const earnedBonuses = categoryData.setBonuses.filter(set => Object.entries(set.requirements).every(([tag, count]) => (tagCounts[tag] ?? 0) >= count));
  const groupedBonuses = new Map<string, typeof earnedBonuses>();
  earnedBonuses.forEach(set => {
    if (set.group) groupedBonuses.set(set.group, [...(groupedBonuses.get(set.group) ?? []), set]);
  });
  const completedSets = earnedBonuses.filter(set => !set.group).concat(
    [...groupedBonuses.values()].map(group => group.reduce((best, candidate) => candidate.points > best.points ? candidate : best)),
  );
  const setPoints = completedSets.reduce((sum, set) => sum + set.points, 0);
  const synergy = repeatedTags + setPoints;
  return { quality, repeatedTags, setPoints, completedSets, synergy, total: quality + synergy };
}

export function AuctionEngine() {
  const language = useAppStore(s => s.language);
  const playerNames = useAppStore(s => s.playerNames);
  const recordMatch = useAppStore(s => s.recordMatch);
  const [category, setCategory] = useState<AuctionCategory>('animals');
  const [deck, setDeck] = useState<AuctionItem[]>([]);
  const [index, setIndex] = useState(0);
  const [budgets, setBudgets] = useState([20, 20]);
  const [rosters, setRosters] = useState<AuctionItem[][]>([[], []]);
  const [turn, setTurn] = useState(0);
  const [opener, setOpener] = useState(0);
  const [openingPass, setOpeningPass] = useState(false);
  const [currentBid, setCurrentBid] = useState(0);
  const [leader, setLeader] = useState<number | null>(null);
  const [lastWinner, setLastWinner] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('setup');
  const l = (tr: string, en: string) => language === 'tr' ? tr : en;
  const player = (n: number) => playerNames[n] || l(`Oyuncu ${n + 1}`, `Player ${n + 1}`);
  const categoryData = auctionCategories[category];
  const item = deck[index];
  const [photoLoaded, setPhotoLoaded] = useState(false);
  const activeArtwork = category === 'characters' && item?.series
    ? auctionSeriesArtwork[item.series] ?? auctionArtwork[category]
    : auctionArtwork[category];
  const localFoodImage = category === 'food' && item ? foodArtwork[item.id] : undefined;
  const cardLabel = (card: AuctionItem) => {
    const seriesName = card.series ? categoryData.seriesNames?.[card.series]?.[language] : undefined;
    return seriesName ? `${card[language].name} · ${seriesName}` : card[language].name;
  };

  const buildDeck = () => {
    const items = auctionCategories[category].items;
    if (category !== 'characters') return shuffleArray(items);
    const series = shuffleArray([...new Set(items.map(card => card.series).filter((value): value is string => Boolean(value)))]).slice(0, 4);
    return shuffleArray(items.filter(card => card.series && series.includes(card.series)));
  };

  const begin = () => {
    setDeck(buildDeck());
    setIndex(0); setBudgets([20, 20]); setRosters([[], []]);
    setOpener(0); setTurn(0); setOpeningPass(false); setCurrentBid(0); setLeader(null); setPhase('opening');
  };
  const openBid = () => {
    setCurrentBid(1); setLeader(turn); setTurn(t => t === 0 ? 1 : 0); setPhase('auction');
  };
  const passOpening = () => {
    if (openingPass) {
      setLastWinner(null);
      setPhase('round-result');
    } else {
      setOpeningPass(true);
      setTurn(t => t === 0 ? 1 : 0);
    }
  };
  const raise = () => {
    if (budgets[turn] < currentBid + 1) return;
    setCurrentBid(bid => bid + 1);
    setLeader(turn);
    setTurn(turn === 0 ? 1 : 0);
  };
  const closeAuction = () => {
    if (leader === null || !item) return;
    setBudgets(old => old.map((budget, i) => i === leader ? budget - currentBid : budget));
    setRosters(old => old.map((roster, i) => i === leader ? [...roster, item] : roster));
    setLastWinner(leader); setPhase('round-result');
  };
  const nextRound = () => {
    if (index + 1 >= deck.length) { setPhase('final'); return; }
    const nextOpener = opener === 0 ? 1 : 0;
    setIndex(i => i + 1); setOpener(nextOpener); setTurn(nextOpener); setOpeningPass(false); setCurrentBid(0); setLeader(null); setPhase('opening');
  };
  const button = (label: string, onPress: () => void, secondary = false, disabled = false) => (
    <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={onPress} style={[styles.button, secondary && styles.secondary, disabled && styles.disabled]}>
      <Text style={styles.buttonText}>{label}</Text>
    </TouchableOpacity>
  );
  const scores = useMemo(() => rosters.map(roster => rosterScore(roster, categoryData)), [rosters, categoryData]);
  const canRaise = budgets[turn] >= currentBid + 1;
  const finish = () => {
    const winner = scores[0].total === scores[1].total ? '' : scores[0].total > scores[1].total ? player(0) : player(1);
    recordMatch({ gameId: 'son-teklif', gameName: 'Son Teklif! (Açık Artırma)', participants: [player(0), player(1)], winner });
    setPhase('setup'); setDeck([]);
  };

  return <View style={styles.card}>
    <Text style={styles.eyebrow}>{l('🔨 SON TEKLİF! AÇIK ARTIRMA', '🔨 FINAL BID! AUCTION')}</Text>
    {phase === 'setup' && <>
      <Text style={styles.title}>{l('Kategori seç', 'Choose a category')}</Text>
      {(Object.keys(auctionCategories) as AuctionCategory[]).map(key => <TouchableOpacity key={key} accessibilityRole="radio" accessibilityState={{ checked: category === key }} onPress={() => setCategory(key)} style={[styles.category, category === key && styles.categoryActive]}>
        <AuctionArtworkImage uri={auctionArtwork[key].uri} fallback={auctionArtworkFallback[key]} style={styles.categoryImage} accessibilityLabel={language === 'tr' ? auctionCategories[key].tr : auctionCategories[key].en} />
        <Text style={styles.categoryText}>{language === 'tr' ? auctionCategories[key].tr : auctionCategories[key].en}</Text>
        <Text style={styles.categoryCheck}>{category === key ? '✓' : '›'}</Text>
      </TouchableOpacity>)}
      <Text style={styles.note}>{l('İki oyuncu da 20 FG ile başlar. Seçtiğiniz kategorideki kartlar sırayla açık artırmaya çıkar; yalnızca sıradaki kart görünür. Her teklif 1 FG yükselir. Kartlardaki tahmini değer bilgi amaçlıdır; teklifin açılış fiyatı değildir.', 'Both players start with 20 FG. Cards in your category go to auction in order; only the current card is visible. Each raise adds 1 FG. Estimated values are informational, not opening prices.')}</Text>
      <Text style={styles.categoryRule}>{language === 'tr' ? categoryData.trRule : categoryData.enRule}</Text>
      {button(l('Açık artırmayı başlat', 'Start auction'), begin)}
    </>}
    {phase !== 'setup' && phase !== 'final' && item && <>
      <View style={styles.budgetRow}>{budgets.map((budget, i) => <View key={i} style={[styles.budget, (turn === i && phase !== 'round-result') && styles.currentBudget]}><Text style={styles.budgetName}>{player(i)}</Text><Text style={styles.budgetValue}>{budget} FG</Text></View>)}</View>
      <Text style={styles.progress}>{index + 1} / {deck.length} · {budgets[turn]} FG {l('teklif bütçesi', 'bid budget')}</Text>
      <View style={styles.rosterPreview}>{rosters.map((roster, i) => <View key={i} style={styles.rosterPreviewPlayer}>
        <Text style={styles.rosterPreviewName}>{player(i)} · {roster.length} {l('kart', 'cards')}</Text>
        <Text style={styles.rosterPreviewCards} numberOfLines={2}>{roster.length ? roster.map(cardLabel).join(' · ') : l('Henüz kart yok', 'No cards yet')}</Text>
      </View>)}</View>
      <View style={styles.itemCard}>
        {localFoodImage ? <Image source={localFoodImage} resizeMode="cover" style={styles.foodImage} accessibilityLabel={item[language].name} /> : <AuctionArtworkImage
          uri={activeArtwork.uri}
          fallback={category === 'characters' && item?.series
            ? auctionSeriesArtworkFallback[item.series] ?? auctionArtworkFallback.characters
            : auctionArtworkFallback[category]}
          style={styles.foodImage}
          accessibilityLabel={item[language].name}
          onPhotoStatus={setPhotoLoaded}
        />}
        {!localFoodImage && (photoLoaded ? <TouchableOpacity accessibilityRole="link" onPress={() => { void Linking.openURL(activeArtwork.source); }}>
          <Text style={styles.artCredit}>{l('Görsel', 'Image')}: {activeArtwork.credit} · {activeArtwork.license}</Text>
        </TouchableOpacity> : <Text style={styles.artCredit}>{l('Yerel illüstrasyon · FriendGames', 'Local illustration · FriendGames')}</Text>)}
        <Text style={styles.itemName}>{item[language].name}</Text>{item.series && categoryData.seriesNames?.[item.series] && <Text style={styles.seriesName}>{categoryData.seriesNames[item.series][language]}</Text>}<Text style={styles.trait}>{item[language].trait}</Text><Text style={styles.power}>{l('Kalite', 'Quality')}: {'★'.repeat(item.power)}{'☆'.repeat(5 - item.power)}</Text><Text style={styles.estimate}>{l('Tahmini değer', 'Estimated value')}: {item.estimatedValue} FG</Text>
      </View>
      {phase === 'opening' && <>
        <Text style={styles.turn}>{player(turn)} · {l('açılış teklifi senin', 'your opening offer')}</Text>
        <Text style={styles.note}>{openingPass ? l('Rakip pas geçti. Kartı 1 FG ile açabilir veya siz de pas geçebilirsiniz.', 'Your opponent passed. Open at 1 FG or pass as well.') : l('Kartı 1 FG ile açabilir ya da pas geçebilirsin.', 'Open at 1 FG or pass.')}</Text>
        {button(l('1 FG teklif ver', 'Bid 1 FG'), openBid, false, budgets[turn] < 1)}
        {button(l('Pas geç', 'Pass'), passOpening, true)}
      </>}
      {phase === 'auction' && <>
        <Text style={styles.currentBid}>{l('En yüksek teklif', 'Current bid')}: {currentBid} FG</Text>
        <Text style={styles.bidLeader}>{l('Teklif sahibi', 'High bidder')}: {leader === null ? '—' : player(leader)}</Text>
        <Text style={styles.turn}>{player(turn)} · {l('sıra sende', 'your turn')}</Text>
        <Text style={styles.nextBid}>{l('Sıradaki teklif', 'Next bid')}: {currentBid + 1} FG</Text>
        {canRaise ? button(l(`Teklifi ${currentBid + 1} FG’ye yükselt`, `Raise to ${currentBid + 1} FG`), raise) : <Text style={styles.note}>{l('Kalan bütçen sıradaki teklifi karşılamıyor. Çekildiğinde en yüksek teklifi veren oyuncu kartı kazanır.', 'Your remaining budget cannot cover the next bid. If you withdraw, the high bidder wins the card.')}</Text>}
        {button(l('Çekil · Rakip kartı alsın', 'Withdraw · Opponent wins card'), closeAuction, true)}
      </>}
      {phase === 'round-result' && <>
        <Text style={styles.resultEmoji}>{lastWinner === null ? '🫥' : '🏆'}</Text>
        <Text style={styles.turn}>{lastWinner === null ? l('İki oyuncu da pas geçti. Kart satılmadı.', 'Both players passed. The card was not sold.') : l(`${player(lastWinner)} ${currentBid} FG karşılığında ${item[language].name} kartını aldı.`, `${player(lastWinner)} won ${item[language].name} for ${currentBid} FG.`)}</Text>
        {button(index + 1 === deck.length ? l('Kadroları karşılaştır', 'Compare rosters') : l('Sonraki açık artırma', 'Next auction'), nextRound)}
      </>}
    </>}
    {phase === 'final' && <>
      <Text style={styles.title}>{l('Final kadroları', 'Final rosters')}</Text>
      {rosters.map((roster, i) => <View key={i} style={styles.roster}><Text style={styles.rosterName}>{player(i)} · {budgets[i]} FG {l('kaldı', 'left')}</Text><Text style={styles.rosterItems}>{roster.length ? roster.map(cardLabel).join(' · ') : l('Kart yok', 'No cards')}</Text><Text style={styles.scoreText}>{l('Kalite', 'Quality')}: {scores[i].quality} + {l('Tekrar bonusu', 'Trait bonus')}: {scores[i].repeatedTags} + {l('Set bonusu', 'Set bonus')}: {scores[i].setPoints} = {scores[i].total}</Text>{scores[i].completedSets.length > 0 && <Text style={styles.completedSets}>{l('Tamamlanan setler', 'Completed sets')}: {scores[i].completedSets.map(set => `${set[language].name} (+${set.points})`).join(' · ')}</Text>}</View>)}
      <Text style={styles.resultTitle}>{scores[0].total === scores[1].total ? l('Berabere! İki kadro da aynı toplam puanda.', 'Draw! Both rosters have the same total score.') : l(`${player(scores[0].total > scores[1].total ? 0 : 1)} kazandı!`, `${player(scores[0].total > scores[1].total ? 0 : 1)} wins!`)}</Text>
      <Text style={styles.note}>{language === 'tr' ? categoryData.trRule : categoryData.enRule} {l('Toplam puan eşitse maç berabere biter.', 'A tied total is a draw.')}</Text>
      {button(l('Sonucu kaydet ve yeni açık artırma', 'Save result and start a new auction'), finish)}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 16, borderRadius: 18, gap: 13, borderWidth: 1, borderColor: Colors.borderGlass },
  eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: .8 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  note: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  category: { backgroundColor: Colors.bgDeep, padding: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderColor: Colors.borderGlass, borderWidth: 1 },
  categoryActive: { borderColor: Colors.primary, backgroundColor: 'rgba(143,168,184,0.13)' },
  categoryText: { color: Colors.textPrimary, fontSize: 14, fontWeight: '700', flex: 1 },
  categoryRule: { color: Colors.accentGold, fontSize: 13, lineHeight: 20, textAlign: 'center', padding: 10, backgroundColor: Colors.bgDeep, borderRadius: 10, borderWidth: 1, borderColor: Colors.borderGlass },
  button: { backgroundColor: Colors.primaryDark, padding: 15, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.primary },
  secondary: { backgroundColor: Colors.bgRaised, borderColor: Colors.borderGlass }, disabled: { opacity: .38 }, buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  budgetRow: { flexDirection: 'row', gap: 9 }, budget: { flex: 1, padding: 10, backgroundColor: Colors.bgDeep, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: Colors.borderGlass }, currentBudget: { borderWidth: 2, borderColor: Colors.primary }, budgetName: { color: Colors.textMuted, fontSize: 11 }, budgetValue: { color: Colors.accentGold, fontSize: 22, fontWeight: '900' },
  rosterPreview: { flexDirection: 'row', gap: 8 }, rosterPreviewPlayer: { flex: 1, minWidth: 0, padding: 9, backgroundColor: Colors.bgDeep, borderRadius: 10, borderWidth: 1, borderColor: Colors.borderGlass, gap: 4 }, rosterPreviewName: { color: Colors.textPrimary, fontSize: 11, fontWeight: '800' }, rosterPreviewCards: { color: Colors.textMuted, fontSize: 10, lineHeight: 14 }, bidLeader: { color: Colors.textMuted, fontSize: 13, textAlign: 'center' },
  progress: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  itemCard: { padding: 16, backgroundColor: Colors.bgDeep, borderRadius: 14, borderWidth: 1, borderColor: Colors.borderGlass, alignItems: 'center', gap: 6 }, foodImage: { width: '100%', height: 170, borderRadius: 12, marginBottom: 6, backgroundColor: Colors.bgRaised }, artCredit: { color: Colors.textMuted, fontSize: 9, textAlign: 'center', textDecorationLine: 'underline' }, categoryImage: { width: 58, height: 58, borderRadius: 12, backgroundColor: Colors.bgRaised }, categoryCheck: { color: Colors.primaryGlow, fontSize: 22, fontWeight: '700' }, itemName: { color: Colors.textPrimary, fontSize: 25, fontWeight: '900' }, seriesName: { color: Colors.primaryGlow, fontSize: 13, fontWeight: '800' }, trait: { color: Colors.textMuted, fontSize: 15 }, power: { color: Colors.accentGold, fontSize: 17, letterSpacing: 1 }, estimate: { color: Colors.textMuted, fontSize: 12, fontWeight: '700' }, nextBid: { color: Colors.primaryGlow, fontSize: 17, fontWeight: '800', textAlign: 'center' },
  turn: { color: Colors.black, fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 23 }, currentBid: { color: Colors.primaryDark, fontSize: 21, fontWeight: '800', textAlign: 'center' }, resultEmoji: { fontSize: 48, textAlign: 'center' },
  roster: { backgroundColor: Colors.bgDeep, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: Colors.borderGlass, gap: 5 }, rosterName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' }, rosterItems: { color: Colors.textMuted, fontSize: 13, lineHeight: 20 }, scoreText: { color: Colors.accentGreen, fontSize: 14, fontWeight: '700' }, completedSets: { color: Colors.accentGold, fontSize: 12, lineHeight: 18 }, resultTitle: { color: Colors.accentGold, fontSize: 20, fontWeight: '900', textAlign: 'center' },
});
