import { View, Text, TouchableOpacity } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useTabu } from '../hooks/useTabu';
import { Colors, Spacing, Radius, FontSize } from '../theme';

export const TabuEngine: React.FC = () => {
  const { card, score, remaining, running, start, handleCorrect, handlePass, resetScore } = useTabu();

  return (
    <View style={styles.card}>
      <Text style={styles.engineTitle}>🃏 Tabu Kart Motoru</Text>
      <Text accessibilityLiveRegion="polite" style={styles.mainWord}>{remaining} sn</Text>
      {!running && <TouchableOpacity style={styles.correctBtn} onPress={start}>
        <Text style={styles.correctBtnText}>{remaining === 0 ? 'Yeni tur başlat' : '60 saniyelik tur başlat'}</Text>
      </TouchableOpacity>}

      {/* Kart */}
      <View style={styles.tabuCard}>
        <Text style={styles.mainWord}>{running ? card.main : 'Hazır mısınız?'}</Text>
        <Text style={styles.bannedLabel}>YASAK KELİMELER</Text>
        <View style={styles.bannedRow}>
          {(running ? card.banned : []).map((w, i) => (
            <View key={i} style={styles.chip}>
              <Text style={styles.chipText}>{w}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Aksiyonlar */}
      <View style={styles.actionRow}>
        <TouchableOpacity disabled={!running} style={[styles.correctBtn, !running && { opacity: 0.4 }]} onPress={handleCorrect} activeOpacity={0.8}>
          <Text style={styles.correctBtnText}>✓ Doğru</Text>
        </TouchableOpacity>
        <TouchableOpacity disabled={!running} style={[styles.passBtn, !running && { opacity: 0.4 }]} onPress={handlePass} activeOpacity={0.8}>
          <Text style={styles.passBtnText}>⏭ Pas</Text>
        </TouchableOpacity>
      </View>

      {/* Skor */}
      <View style={styles.scoreRow}>
        <View style={styles.scoreItem}>
          <Text style={styles.scoreVal}>{score.correct}</Text>
          <Text style={styles.scoreLabel}>Doğru</Text>
        </View>
        <View style={styles.scoreDivider} />
        <View style={styles.scoreItem}>
          <Text style={[styles.scoreVal, { color: Colors.accentRed }]}>{score.pass}</Text>
          <Text style={styles.scoreLabel}>Pas</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.resetBtn} onPress={resetScore}>
        <Text style={styles.resetBtnText}>🔄 Skoru Sıfırla</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.md,
  },
  engineTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  tabuCard: {
    backgroundColor: 'rgba(99,102,241,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.3)',
    borderRadius: 14,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  mainWord: {
    fontSize: 26,
    fontWeight: '900',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    letterSpacing: 1,
  },
  bannedLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.accentRed,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  bannedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
  },
  chip: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  chipText: { fontSize: 11, fontWeight: '600', color: '#fca5a5' },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  correctBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(16,185,129,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.3)',
    alignItems: 'center',
  },
  correctBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.accentGreen },
  passBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: Radius.md,
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    alignItems: 'center',
  },
  passBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.accentRed },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.xl,
  },
  scoreItem: { alignItems: 'center' },
  scoreVal: { fontSize: 30, fontWeight: '900', color: Colors.textPrimary },
  scoreLabel: { fontSize: FontSize.xs, color: Colors.textMuted },
  scoreDivider: { width: 1, height: 40, backgroundColor: Colors.borderGlass },
  resetBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.md,
  },
  resetBtnText: { fontSize: FontSize.md, color: Colors.textMuted, fontWeight: '600' },
});

