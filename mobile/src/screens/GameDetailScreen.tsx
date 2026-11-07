import { View, Text, ScrollView, TouchableOpacity } from '../ui';
import React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { gamesData } from '../data/games';
import { useAppStore } from '../store/useAppStore';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';
import { Toast } from '../components/Toast';

import { Colors, Spacing, Radius, FontSize } from '../theme';
import { RootStackParamList } from '../types';
import { translate } from '../i18n';

type RouteP = RouteProp<RootStackParamList, 'GameDetail'>;

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  green:  { bg: 'rgba(16,185,129,0.15)', text: Colors.accentGreen },
  red:    { bg: 'rgba(239,68,68,0.15)',  text: Colors.accentRed },
  purple: { bg: 'rgba(99,102,241,0.15)', text: '#a5b4fc' },
  gold:   { bg: 'rgba(245,158,11,0.15)', text: Colors.accentGold },
  pop:    { bg: 'rgba(236,72,153,0.15)', text: '#f9a8d4' },
};

export const GameDetailScreen: React.FC = () => {
  const { params } = useRoute<RouteP>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isVip, language } = useAppStore();

  const { isFavorite, toggle: toggleFav } = useFavorites();
  const toast = useToast();

  const game = gamesData.find(g => g.id === params.gameId);
  if (!game) return null;

  const isLocked = game.vip && !isVip;
  const inFav = isFavorite(game.id);

  const handleFav = () => {
    const willFav = !inFav;
    toggleFav(game.id, false);
    toast.show(willFav ? '❤️ Favorilere eklendi' : '💔 Favorilerden çıkarıldı');
  };

  const goToVip = () => {
    navigation.navigate('Main', { screen: 'VIP' });
  };

  return (
    <View style={styles.container}>
      <Toast message={toast.message} visible={toast.visible} />

      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.backBtnText}>← Geri</Text>
      </TouchableOpacity>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ─── Hero ─────────────────────────────────────────────── */}
        <View style={styles.hero}>
          <Text style={styles.heroIcon}>{game.icon}</Text>

          <View style={styles.badges}>
            {game.badges.map((b, i) => {
              const bs = BADGE_STYLES[b.color] ?? BADGE_STYLES.purple;
              return (
                <View key={i} style={[styles.badge, { backgroundColor: bs.bg }]}>
                  <Text style={[styles.badgeText, { color: bs.text }]}>{b.label}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.title}>{translate(game.name, language)}</Text>
            <TouchableOpacity onPress={handleFav} style={styles.favBtn}>
              <Text style={styles.favIcon}>{inFav ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.desc}>{translate(game.description, language)}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>👥 {game.minPlayers}–{game.maxPlayers} oyuncu</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>⏱ {game.minTime}–{game.maxTime} dk</Text>
            </View>
            <View style={styles.metaChip}>
              <Text style={styles.metaText}>🏷 {translate(game.categoryLabel, language)}</Text>
            </View>
          </View>
        </View>

        {/* ─── VIP Gate ─────────────────────────────────────────── */}
        {isLocked ? (
          <View style={styles.vipGate}>
            <Text style={styles.vipGateIcon}>👑</Text>
            <Text style={styles.vipGateTitle}>Bu Oyun VIP Pass Gerektiriyor</Text>
            <Text style={styles.vipGateDesc}>
              FriendGames Plus'a abone olarak bu oyunun kilidini aç ve daha fazlasını keşfet.
            </Text>
            <LinearGradient
              colors={['#F59E0B', '#F97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.unlockBtn}
            >
              <TouchableOpacity onPress={goToVip} style={styles.unlockBtnInner}>
                <Text style={styles.unlockBtnText}>👑 VIP Pass Al</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        ) : (
          <>
            {/* ─── Rules ──────────────────────────────────────────── */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>📋 NASIL OYNANIR?</Text>
              {game.rules.map((rule, i) => (
                <View key={i} style={styles.ruleRow}>
                  <LinearGradient
                    colors={['#7928CA', '#6366F1']}
                    style={styles.ruleNum}
                  >
                    <Text style={styles.ruleNumText}>{i + 1}</Text>
                  </LinearGradient>
                  <Text style={styles.ruleText}>{translate(rule, language)}</Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />
            <LinearGradient colors={['#7928CA', '#6366F1']} style={styles.startButton}>
              <TouchableOpacity onPress={() => navigation.navigate('GamePlay', { gameId: game.id })} style={styles.startButtonInner}>
                <Text style={styles.startButtonText}>▶ Oyunu Başlat</Text>
              </TouchableOpacity>
            </LinearGradient>
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },

  backBtn: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 52,
    paddingBottom: Spacing.sm,
  },
  backBtnText: {
    fontSize: FontSize.base,
    color: Colors.primary,
    fontWeight: '600',
  },

  scroll: { paddingBottom: 40 },

  // Hero
  hero: {
    padding: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  heroIcon: { fontSize: 48, marginBottom: Spacing.sm },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginBottom: Spacing.sm,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  favBtn: { padding: 4 },
  favIcon: { fontSize: 24 },
  desc: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  metaChip: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  metaText: { fontSize: FontSize.sm, color: Colors.textMuted },

  // Rules
  section: { padding: Spacing.xl },
  sectionTitle: {
    fontSize: FontSize.sm,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  ruleRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'flex-start',
  },
  ruleNum: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  ruleNumText: { fontSize: 10, fontWeight: '800', color: Colors.white },
  ruleText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.borderGlass,
    marginHorizontal: Spacing.xl,
  },
  startButton: { margin: Spacing.xl, borderRadius: 16 },
  startButtonInner: { paddingVertical: 17, alignItems: 'center' },
  startButtonText: { color: Colors.white, fontSize: FontSize.lg, fontWeight: '800' },

  // VIP Gate
  vipGate: {
    padding: Spacing.xxl,
    alignItems: 'center',
  },
  vipGateIcon: { fontSize: 48, marginBottom: Spacing.sm },
  vipGateTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  vipGateDesc: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
    maxWidth: 280,
  },
  unlockBtn: { borderRadius: 14, width: '100%' },
  unlockBtnInner: { paddingVertical: 16, alignItems: 'center' },
  unlockBtnText: { fontSize: FontSize.base, fontWeight: '800', color: '#000' },
});

