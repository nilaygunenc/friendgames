import React, { useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, TouchableOpacity, View } from '../ui';
import { auctionCategories, AuctionCategory, AuctionItem } from '../data/auction';
import { shuffleArray } from '../utils/gameEngine';
import { useAppStore } from '../store/useAppStore';
import { Colors } from '../theme';

type Phase = 'setup' | 'opening' | 'auction' | 'round-result' | 'final';

function rosterScore(roster: AuctionItem[]) {
  const quality = roster.reduce((sum, item) => sum + item.power, 0);
  const tagCounts = roster.flatMap(item => item.tags).reduce<Record<string, number>>((counts, tag) => ({ ...counts, [tag]: (counts[tag] ?? 0) + 1 }), {});
  const synergy = Object.values(tagCounts).reduce((sum, count) => sum + Math.max(0, count - 1) * 2, 0);
  return { quality, synergy, total: quality + synergy };
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
  const item = deck[index];

  const begin = () => {
    setDeck(shuffleArray(auctionCategories[category].items));
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
    const newBid = currentBid + 1;
    setCurrentBid(newBid); setLeader(turn); setTurn(t => t === 0 ? 1 : 0);
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
  const scores = useMemo(() => rosters.map(rosterScore), [rosters]);
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
        <Text style={styles.categoryText}>{language === 'tr' ? auctionCategories[key].tr : auctionCategories[key].en} {category === key ? '✓' : ''}</Text>
      </TouchableOpacity>)}
      <Text style={styles.note}>{l('Her oyuncu 20$ ile başlar. Sıradaki kartlar gizli kalır; bütçeni dikkatli kullan.', 'Each player begins with $20. Future cards stay hidden, so spend your budget carefully.')}</Text>
      {button(l('Açık artırmayı başlat', 'Start auction'), begin)}
    </>}
    {phase !== 'setup' && item && <>
      <View style={styles.budgetRow}>{budgets.map((budget, i) => <View key={i} style={[styles.budget, (turn === i && phase !== 'round-result' && phase !== 'final') && styles.currentBudget]}><Text style={styles.budgetName}>{player(i)}</Text><Text style={styles.budgetValue}>${budget}</Text></View>)}</View>
      <Text style={styles.progress}>{index + 1} / {deck.length}</Text>
      <View style={styles.itemCard}><Text style={styles.itemName}>{item[language].name}</Text><Text style={styles.trait}>{item[language].trait}</Text><Text style={styles.power}>{l('Kalite', 'Quality')}: {'★'.repeat(item.power)}{'☆'.repeat(5 - item.power)}</Text></View>
      {phase === 'opening' && <>
        <Text style={styles.turn}>{player(turn)} · {l('açılış teklifi senin', 'your opening offer')}</Text>
        <Text style={styles.note}>{openingPass ? l('Rakip pas geçti. Kartı 1$ ile açabilir veya kartı beraber pas geçebilirsiniz.', 'Your opponent passed. Open at $1 or both players can skip this card.') : l('Kartı 1$ ile açabilir ya da pas geçebilirsin.', 'Open the card at $1 or pass.')}</Text>
        {button(l('1$ teklif ver', 'Bid $1'), openBid, false, budgets[turn] < 1)}
        {button(l('Pas geç', 'Pass'), passOpening, true)}
      </>}
      {phase === 'auction' && <>
        <Text style={styles.currentBid}>{l('En yüksek teklif', 'Current bid')}: ${currentBid}</Text>
        <Text style={styles.turn}>{player(turn)} · {l('sıra sende', 'your turn')}</Text>
        {canRaise ? button(l(`Teklifi ${currentBid + 1}$ yap`, `Raise to $${currentBid + 1}`), raise) : <Text style={styles.note}>{l('Bütçen bu teklifi artırmaya yetmiyor.', 'Your budget cannot cover a higher bid.')}</Text>}
        {button(l('Çekil · Rakip kartı alsın', 'Withdraw · Opponent wins card'), closeAuction, true)}
      </>}
      {phase === 'round-result' && <>
        <Text style={styles.resultEmoji}>{lastWinner === null ? '🫥' : '🏆'}</Text>
        <Text style={styles.turn}>{lastWinner === null ? l('İki oyuncu da pas geçti. Kart satılmadı.', 'Both players passed. The card was not sold.') : l(`${player(lastWinner)} ${currentBid}$ karşılığında ${item[language].name} kartını aldı.`, `${player(lastWinner)} won ${item[language].name} for $${currentBid}.`)}</Text>
        {button(index + 1 === deck.length ? l('Kadroları karşılaştır', 'Compare rosters') : l('Sonraki açık artırma', 'Next auction'), nextRound)}
      </>}
    </>}
    {phase === 'final' && <>
      <Text style={styles.title}>{l('Final kadroları', 'Final rosters')}</Text>
      {rosters.map((roster, i) => <View key={i} style={styles.roster}><Text style={styles.rosterName}>{player(i)} · ${budgets[i]} {l('kaldı', 'left')}</Text><Text style={styles.rosterItems}>{roster.length ? roster.map(item => item[language].name).join(' · ') : l('Kart yok', 'No cards')}</Text><Text style={styles.scoreText}>{l('Kalite', 'Quality')}: {scores[i].quality} + {l('Uyum', 'Synergy')}: {scores[i].synergy} = {scores[i].total}</Text></View>)}
      <Text style={styles.resultTitle}>{scores[0].total === scores[1].total ? l('Berabere! İki kadro da aynı toplam puanda.', 'Draw! Both rosters have the same total score.') : scores[0].total > scores[1].total ? l('Oyuncu 1 kazandı!', 'Player 1 wins!') : l('Oyuncu 2 kazandı!', 'Player 2 wins!')}</Text>
      <Text style={styles.note}>{l('Uyum: Kadrodaki aynı özellik etiketinin her ek tekrarı +2 puandır. Bu nedenle yalnız pahalı kartlara yüklenmek en iyi strateji olmayabilir.', 'Synergy: each extra matching trait tag in a roster is worth +2. Spending everything on expensive cards may not be the best strategy.')}</Text>
      {button(l('Sonucu kaydet ve yeni açık artırma', 'Save result and start a new auction'), finish)}
    </>}
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgCard, padding: 20, margin: 20, borderRadius: 20, gap: 13, borderWidth: 1, borderColor: Colors.borderGlass },
  eyebrow: { color: Colors.textMuted, fontSize: 11, fontWeight: '700', letterSpacing: .8 },
  title: { color: Colors.textPrimary, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  note: { color: Colors.textMuted, fontSize: 13, lineHeight: 20, textAlign: 'center' },
  category: { backgroundColor: Colors.bgDeep, padding: 15, borderRadius: 13, alignItems: 'center', borderColor: Colors.borderGlass, borderWidth: 1 },
  categoryActive: { borderColor: Colors.primary, backgroundColor: 'rgba(99,102,241,0.18)' },
  categoryText: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700' },
  button: { backgroundColor: Colors.primary, padding: 15, borderRadius: 13, alignItems: 'center' },
  secondary: { backgroundColor: '#484288' }, disabled: { opacity: .38 }, buttonText: { color: Colors.white, fontWeight: '700', fontSize: 14, textAlign: 'center' },
  budgetRow: { flexDirection: 'row', gap: 9 }, budget: { flex: 1, padding: 10, backgroundColor: Colors.bgDeep, borderRadius: 12, alignItems: 'center' }, currentBudget: { borderWidth: 1, borderColor: Colors.primary }, budgetName: { color: Colors.textMuted, fontSize: 11 }, budgetValue: { color: Colors.accentGold, fontSize: 24, fontWeight: '900' },
  progress: { color: Colors.textMuted, fontSize: 12, fontWeight: '700', textAlign: 'center' },
  itemCard: { padding: 24, backgroundColor: 'rgba(245,158,11,0.11)', borderRadius: 16, alignItems: 'center', gap: 6 }, itemName: { color: Colors.textPrimary, fontSize: 29, fontWeight: '900' }, trait: { color: Colors.textMuted, fontSize: 15 }, power: { color: Colors.accentGold, fontSize: 17, letterSpacing: 1 },
  turn: { color: Colors.textPrimary, fontSize: 16, fontWeight: '700', textAlign: 'center', lineHeight: 23 }, currentBid: { color: Colors.accentGold, fontSize: 21, fontWeight: '800', textAlign: 'center' }, resultEmoji: { fontSize: 48, textAlign: 'center' },
  roster: { backgroundColor: Colors.bgDeep, padding: 14, borderRadius: 13, gap: 5 }, rosterName: { color: Colors.textPrimary, fontSize: 16, fontWeight: '800' }, rosterItems: { color: Colors.textMuted, fontSize: 13, lineHeight: 20 }, scoreText: { color: Colors.accentGreen, fontSize: 14, fontWeight: '700' }, resultTitle: { color: Colors.accentGold, fontSize: 20, fontWeight: '900', textAlign: 'center' },
});
