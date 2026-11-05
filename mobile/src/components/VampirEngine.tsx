import { View, Text, TouchableOpacity } from '../ui';
import React, { useState, useCallback } from 'react';
import { StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { buildRoleDeck } from '../utils/gameEngine';
import { VampirRole } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Colors, Spacing, Radius, FontSize } from '../theme';

const ROLE_COLORS: Record<string, string> = {
  vampir:  Colors.accentRed,
  koylu:   Colors.accentGreen,
  doktor:  '#60a5fa',
  komiser: Colors.accentGold,
};

export const VampirEngine: React.FC = () => {
  const groupSize = useAppStore(s => s.groupSize);
  const [playerCount, setPlayerCount] = useState(() => Math.max(5, Math.min(20, groupSize)));
  const [deck, setDeck] = useState<VampirRole[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [showingRole, setShowingRole] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'dealing' | 'done'>('setup');

  const startDealing = useCallback(() => {
    setDeck(buildRoleDeck(playerCount));
    setCurrentIdx(0);
    setShowingRole(false);
    setPhase('dealing');
  }, [playerCount]);

  const handleMainBtn = () => {
    if (phase === 'done') return;

    if (!showingRole) {
      setShowingRole(true);
    } else {
      const next = currentIdx + 1;
      setShowingRole(false);
      if (next >= playerCount) {
        setPhase('done');
        setCurrentIdx(next);
      } else {
        setCurrentIdx(next);
      }
    }
  };

  const reset = () => {
    setPhase('setup');
    setCurrentIdx(0);
    setShowingRole(false);
  };

  const currentRole = deck[currentIdx];

  if (phase === 'setup') {
    return (
      <View style={styles.card}>
        <Text style={styles.engineTitle}>🎲 Rol Dağıtım Motoru</Text>
        <Text style={styles.subLabel}>Kaç kişi oynuyor?</Text>
        <View style={styles.pickerRow}>
          <TouchableOpacity
            style={styles.pickerBtn}
            onPress={() => setPlayerCount(p => Math.max(5, p - 1))}
          >
            <Text style={styles.pickerBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.pickerVal}>{playerCount}</Text>
          <TouchableOpacity
            style={styles.pickerBtn}
            onPress={() => setPlayerCount(p => Math.min(20, p + 1))}
          >
            <Text style={styles.pickerBtnText}>+</Text>
          </TouchableOpacity>
          <Text style={styles.subLabel}> oyuncu</Text>
        </View>
        <LinearGradient
          colors={['#7928CA', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.mainBtn}
        >
          <TouchableOpacity onPress={startDealing} style={styles.mainBtnInner}>
            <Text style={styles.mainBtnText}>▶ Dağıtmaya Başla</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.engineTitle}>🎲 Rol Dağıtım Motoru</Text>

      {/* Progress dots */}
      <View style={styles.progressRow}>
        {Array.from({ length: playerCount }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < currentIdx && styles.dotDone,
              i === currentIdx && phase !== 'done' && styles.dotCurrent,
            ]}
          />
        ))}
      </View>
      <Text style={styles.progressLabel}>
        {phase === 'done'
          ? '✅ Dağıtım tamamlandı!'
          : `Oyuncu ${currentIdx + 1} / ${playerCount}`}
      </Text>

      {/* Role card */}
      <View style={styles.roleCard}>
        {phase === 'done' ? <Text style={styles.coverText}>🌙 Herkes rolünü aldı. Moderatör geceyi başlatabilir.</Text> : !showingRole ? (
          <Text style={styles.coverText}>
            👇 Telefonu bir sonraki kişiye uzat ve butona bas
          </Text>
        ) : currentRole ? (
          <>
            <Text style={styles.roleEmoji}>{currentRole.emoji}</Text>
            <Text
              style={[
                styles.roleName,
                { color: ROLE_COLORS[currentRole.colorKey] },
              ]}
            >
              {currentRole.name}
            </Text>
            <Text style={styles.roleDesc}>{currentRole.description}</Text>
          </>
        ) : null}
      </View>

      {phase !== 'done' && (
        <LinearGradient
          colors={showingRole ? ['#F59E0B', '#F97316'] : ['#7928CA', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.mainBtn}
        >
          <TouchableOpacity onPress={handleMainBtn} style={styles.mainBtnInner}>
            <Text style={[styles.mainBtnText, showingRole && { color: '#000' }]}>
              {showingRole ? '🙈 Gizle & Sonraki' : '👁 Rolümü Gör'}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )}

      <TouchableOpacity style={styles.secondaryBtn} onPress={reset}>
        <Text style={styles.secondaryBtnText}>🔄 Oyunu Sıfırla</Text>
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
  subLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 6 },
  pickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  pickerBtn: {
    width: 32, height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerBtnText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  pickerVal: { fontSize: 20, fontWeight: '900', color: Colors.textPrimary, minWidth: 28, textAlign: 'center' },
  progressRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  dot: {
    width: 10, height: 10,
    borderRadius: 5,
    backgroundColor: Colors.borderGlass,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  dotDone: { backgroundColor: Colors.accentGreen },
  dotCurrent: { backgroundColor: Colors.primary },
  progressLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: Spacing.md },
  roleCard: {
    backgroundColor: Colors.bgDeep,
    borderRadius: 14,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  coverText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center' },
  roleEmoji: { fontSize: 44, marginBottom: 8 },
  roleName: { fontSize: FontSize.xxl, fontWeight: '800', marginBottom: 6 },
  roleDesc: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', maxWidth: 220, lineHeight: 18 },
  mainBtn: {
    borderRadius: Radius.md,
    marginBottom: Spacing.sm,
  },
  mainBtnInner: { paddingVertical: 12, alignItems: 'center' },
  mainBtnText: { fontSize: FontSize.md, fontWeight: '700', color: Colors.white },
  secondaryBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.md,
  },
  secondaryBtnText: { fontSize: FontSize.md, color: Colors.textMuted, fontWeight: '600' },
});

