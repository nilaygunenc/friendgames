import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { View, Text, TouchableOpacity } from '../ui';
import { useTabu } from '../hooks/useTabu';
import { Colors, Spacing, Radius, FontSize } from '../theme';
import { TabuCategory, TabuDeck, TabuDifficulty } from '../types';
import { tabuKartlar } from '../data/tabu';
import { filterTabuCards, tabuCategories, tabuDifficulties } from '../services/WordManager';
import { loadTabuDecks } from '../services/TabuDeckStore';
import { TabuDeckManager } from './TabuDeckManager';

const categoryLabels: Record<TabuCategory, string> = {
  sinema: 'Sinema', teknoloji: 'Teknoloji', 'günlük-yaşam': 'Günlük yaşam', '90lar': '90’lar',
  doğa: 'Doğa', spor: 'Spor', kültür: 'Kültür', yemek: 'Yemek', hayvanlar: 'Hayvanlar', diğer: 'Diğer',
};

export const TabuEngine: React.FC<{ onOpenVip: () => void }> = ({ onOpenVip }) => {
  const [categories, setCategories] = useState<TabuCategory[]>([]);
  const [difficulties, setDifficulties] = useState<TabuDifficulty[]>([]);
  const [decks, setDecks] = useState<TabuDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<TabuDeck | null>(null);
  const [showDeckManager, setShowDeckManager] = useState(false);
  const pool = useMemo(() => filterTabuCards(selectedDeck?.cards ?? tabuKartlar, categories, difficulties), [selectedDeck, categories, difficulties]);
  const { card, score, remaining, running, cycleNotice, error, start, handleCorrect, handlePass, resetScore } = useTabu(pool);

  useEffect(() => { void loadTabuDecks().then(setDecks); }, []);

  const toggleCategory = (value: TabuCategory) => setCategories(old => old.includes(value) ? old.filter(item => item !== value) : [...old, value]);
  const toggleDifficulty = (value: TabuDifficulty) => setDifficulties(old => old.includes(value) ? old.filter(item => item !== value) : [...old, value]);
  const chip = (label: string, active: boolean, onPress: () => void) => <TouchableOpacity key={label} onPress={onPress} style={[styles.filterChip, active && styles.filterChipActive]}><Text style={[styles.filterText, active && styles.filterTextActive]}>{label}</Text></TouchableOpacity>;

  if (showDeckManager) return <TabuDeckManager onClose={() => setShowDeckManager(false)} onUpgrade={onOpenVip} onDeckSaved={deck => { setSelectedDeck(deck); setCategories([]); setDifficulties([]); setShowDeckManager(false); void loadTabuDecks().then(setDecks); }} />;

  return <View style={styles.card}>
    <Text style={styles.engineTitle}>🃏 Tabu Kart Motoru</Text>
    <View style={styles.deckRow}>
      <TouchableOpacity disabled={running} onPress={() => setSelectedDeck(null)} style={[styles.deckChip, !selectedDeck && styles.deckChipActive, running && styles.disabled]}><Text style={styles.deckText}>Klasik deste</Text></TouchableOpacity>
      {decks.map(deck => <TouchableOpacity disabled={running} key={deck.id} onPress={() => setSelectedDeck(deck)} style={[styles.deckChip, selectedDeck?.id === deck.id && styles.deckChipActive, { borderLeftColor: deck.coverColor, borderLeftWidth: 4 }, running && styles.disabled]}><Text style={styles.deckText}>{deck.name}</Text></TouchableOpacity>)}
      <TouchableOpacity disabled={running} onPress={() => setShowDeckManager(true)} style={[styles.vipDeckButton, running && styles.disabled]}><Text style={styles.vipDeckText}>👑 VIP deste atölyesi</Text></TouchableOpacity>
    </View>
    {!running && <>
      <Text style={styles.filterLabel}>KATEGORİLER · Çoklu seçim</Text>
      <View style={styles.filterRow}>{chip('Tümü', categories.length === 0, () => setCategories([]))}{tabuCategories.map(value => chip(categoryLabels[value], categories.includes(value), () => toggleCategory(value)))}</View>
      <Text style={styles.filterLabel}>ZORLUK</Text>
      <View style={styles.filterRow}>{chip('Tümü', difficulties.length === 0, () => setDifficulties([]))}{tabuDifficulties.map(value => chip(value[0].toLocaleUpperCase('tr-TR') + value.slice(1), difficulties.includes(value), () => toggleDifficulty(value)))}</View>
    </>}

    <Text accessibilityLiveRegion="polite" style={styles.timer}>{remaining} sn</Text>
    {!running && <TouchableOpacity disabled={!pool.length} style={[styles.correctBtn, !pool.length && styles.disabled]} onPress={() => void start()}>
      <Text style={styles.correctBtnText}>{remaining === 0 ? 'Yeni tur başlat' : '60 saniyelik tur başlat'} · {pool.length} kart</Text>
    </TouchableOpacity>}

    <View key={card.id} style={styles.tabuCard}>
      <Text style={styles.mainWord}>{running ? card.main : remaining === 0 ? 'Tur tamamlandı' : 'Hazır mısınız?'}</Text>
      {(running || remaining === 0) && <><Text style={styles.meta}>{categoryLabels[card.category]} · {card.difficulty}</Text><Text style={styles.bannedLabel}>YASAK KELİMELER</Text>
        <View style={styles.bannedRow}>{card.banned.map((word, index) => <View key={`${card.id}-${index}`} style={styles.bannedChip}><Text style={styles.chipText}>{word}</Text></View>)}</View></>}
    </View>

    {!running && !pool.length && <Text style={styles.error}>Bu filtrelerle eşleşen kart yok. Filtreleri genişlet.</Text>}
    {cycleNotice && <Text accessibilityLiveRegion="polite" style={styles.notice}>Bu filtredeki tüm kelimeler oynandı; havuz yeniden karıştırıldı.</Text>}
    {!!error && <Text accessibilityLiveRegion="polite" style={styles.error}>{error}</Text>}
    <View style={styles.actionRow}>
      <TouchableOpacity disabled={!running} style={[styles.correctBtn, !running && styles.disabled]} onPress={handleCorrect} activeOpacity={0.8}><Text style={styles.correctBtnText}>✓ Doğru</Text></TouchableOpacity>
      <TouchableOpacity disabled={!running} style={[styles.passBtn, !running && styles.disabled]} onPress={handlePass} activeOpacity={0.8}><Text style={styles.passBtnText}>⏭ Pas</Text></TouchableOpacity>
    </View>
    <View accessibilityLiveRegion="polite" style={styles.scoreRow}>
      <View style={styles.scoreItem}><Text style={styles.scoreVal}>{score.correct}</Text><Text style={styles.scoreLabel}>Doğru</Text></View><View style={styles.scoreDivider} /><View style={styles.scoreItem}><Text style={[styles.scoreVal, { color: Colors.accentRed }]}>{score.pass}</Text><Text style={styles.scoreLabel}>Pas</Text></View>
    </View>
    <TouchableOpacity style={styles.resetBtn} onPress={resetScore}><Text style={styles.resetBtnText}>🔄 Skoru Sıfırla</Text></TouchableOpacity>
  </View>;
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.bgGlass, borderWidth: 1, borderColor: Colors.borderGlass, borderRadius: Radius.lg, padding: Spacing.lg, marginHorizontal: Spacing.xl, marginTop: Spacing.md, gap: 10 },
  engineTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: Spacing.sm },
  deckRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 }, deckChip: { backgroundColor: Colors.bgDeep, paddingHorizontal: 9, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: Colors.borderGlass }, deckChipActive: { borderColor: Colors.primaryGlow, backgroundColor: 'rgba(143,168,184,0.16)' }, deckText: { color: Colors.textPrimary, fontSize: 11, fontWeight: '700' }, vipDeckButton: { paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, backgroundColor: 'rgba(201,185,149,0.12)', borderWidth: 1, borderColor: Colors.accentGold }, vipDeckText: { color: Colors.accentGold, fontSize: 11, fontWeight: '800' },
  filterLabel: { color: Colors.textMuted, fontSize: 9, fontWeight: '900', letterSpacing: 1 }, filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 }, filterChip: { backgroundColor: Colors.bgDeep, borderColor: Colors.borderGlass, borderWidth: 1, borderRadius: 15, paddingHorizontal: 9, paddingVertical: 6 }, filterChipActive: { backgroundColor: 'rgba(143,168,184,0.18)', borderColor: Colors.primaryGlow }, filterText: { color: Colors.textMuted, fontSize: 10, fontWeight: '700' }, filterTextActive: { color: Colors.textPrimary },
  timer: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, textAlign: 'center', marginTop: 4 }, correctBtn: { flex: 1, paddingVertical: 13, borderRadius: Radius.md, backgroundColor: 'rgba(143,168,184,0.10)', borderWidth: 1, borderColor: 'rgba(143,168,184,0.18)', alignItems: 'center' }, correctBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.accentGreen }, disabled: { opacity: 0.4 },
  tabuCard: { backgroundColor: 'rgba(143,168,184,0.06)', borderWidth: 1, borderColor: 'rgba(143,168,184,0.18)', borderRadius: 12, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.sm, minHeight: 120 }, mainWord: { fontSize: 26, fontWeight: '900', color: Colors.textPrimary, marginBottom: Spacing.sm, letterSpacing: 1 }, meta: { color: Colors.textMuted, fontSize: 11, marginBottom: 6 }, bannedLabel: { fontSize: 9, fontWeight: '700', color: Colors.accentRed, letterSpacing: 1, marginBottom: 8 }, bannedRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }, bannedChip: { backgroundColor: 'rgba(143,168,184,0.06)', borderWidth: 1, borderColor: 'rgba(143,168,184,0.18)', borderRadius: 14, paddingHorizontal: 10, paddingVertical: 3 }, chipText: { fontSize: 11, fontWeight: '600', color: Colors.accentGold },
  actionRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm }, passBtn: { flex: 1, paddingVertical: 13, borderRadius: Radius.md, backgroundColor: 'rgba(143,168,184,0.06)', borderWidth: 1, borderColor: 'rgba(143,168,184,0.18)', alignItems: 'center' }, passBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.accentRed }, scoreRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm, gap: Spacing.xl }, scoreItem: { alignItems: 'center' }, scoreVal: { fontSize: 30, fontWeight: '900', color: Colors.textPrimary }, scoreLabel: { fontSize: FontSize.xs, color: Colors.textMuted }, scoreDivider: { width: 1, height: 40, backgroundColor: Colors.borderGlass }, resetBtn: { paddingVertical: 10, alignItems: 'center', backgroundColor: Colors.bgGlass, borderWidth: 1, borderColor: Colors.borderGlass, borderRadius: Radius.md }, resetBtnText: { fontSize: FontSize.md, color: Colors.textMuted, fontWeight: '600' }, notice: { textAlign: 'center', color: Colors.accentGold, fontSize: 11 }, error: { textAlign: 'center', color: Colors.accentRed, fontSize: 12 },
});
