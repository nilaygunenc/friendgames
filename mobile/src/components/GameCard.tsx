import { View, Text, TouchableOpacity } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Game } from '../types';
import { Colors, Spacing, FontSize } from '../theme';
import { GameIcon } from './GameIcon';

interface Props {
  game: Game;
  isVip: boolean;
  isFavorite: boolean;
  onPress: () => void;
  onPlayPress?: () => void;
  onFavPress?: () => void;
}

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  green:  { bg: '#E1ECE5', text: '#607D6D' },
  red:    { bg: '#F0E3E3', text: '#9B6B6B' },
  purple: { bg: '#EBE5F0', text: '#786986' },
  gold:   { bg: '#F0EBDD', text: '#8D7950' },
  pop:    { bg: '#E2EAF0', text: '#5D788B' },
};

const ICON_SURFACES: Record<string, string> = {
  'buz-kirici': '#DDEBE6',
  'gizli-rol': '#E8E2EF',
  kelime: '#E8E5D9',
  friendgames: '#DCE7ED',
};

export const GameCard: React.FC<Props> = ({
  game,
  isVip,
  isFavorite,
  onPress,
  onPlayPress,
  onFavPress,
}) => {
  const isLocked = game.vip && !isVip;
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top row: icon + badges */}
      <View style={styles.cardTop}>
        <View style={[styles.iconWrap, { backgroundColor: ICON_SURFACES[game.category] ?? '#DCE7ED' }]}>
          <GameIcon game={game} size={54} />
        </View>
        <View style={styles.topRight}>
          {isLocked && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipBadgeText}>👑 VIP</Text>
            </View>
          )}
          {onFavPress && (
            <TouchableOpacity
              onPress={e => {
                e.stopPropagation?.();
                onFavPress();
              }}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.favIcon}>{isFavorite ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Badges */}
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

      <Text style={styles.name}>{game.name}</Text>
      <Text style={styles.desc} numberOfLines={2}>
        {game.description}
      </Text>

      <View style={styles.meta}>
        <Text style={styles.metaItem}>👥 {game.minPlayers}-{game.maxPlayers}</Text>
        <Text style={styles.metaItem}>⏱ {game.minTime}-{game.maxTime} dk</Text>
      </View>

      <View style={styles.footer}>
        {isLocked ? (
          <TouchableOpacity onPress={e => { e.stopPropagation?.(); onPress(); }} style={[styles.startBtn, styles.vipStartBtn]}>
            <Text style={styles.startBtnText}>🔒 VIP Kilidi Aç</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={e => { e.stopPropagation?.(); (onPlayPress ?? onPress)(); }}>
            <LinearGradient colors={['#718B9A', '#587383']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.startBtn}>
              <Text style={styles.startBtnText}>▶  Hemen Oyna</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 20,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    margin: Spacing.xs,
    minHeight: 250,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 3,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: { width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', shadowColor: '#4D6472', shadowOpacity: 0.10, shadowRadius: 5, shadowOffset: { width: 0, height: 3 }, elevation: 2 },
  vipBadge: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: 'rgba(143,168,184,0.10)',
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  vipBadgeText: { fontSize: 9, fontWeight: '800', color: Colors.primaryGlow },
  favIcon: { fontSize: 14 },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },

  name: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: { fontSize: FontSize.xs, color: Colors.textMuted },

  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
    paddingTop: Spacing.sm,
  },
  startBtn: {
    borderRadius: 14,
    borderWidth: 0,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
    shadowColor: '#344B5A',
    shadowOpacity: 0.18,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  startBtnText: {
    color: Colors.white,
    fontSize: FontSize.sm,
    fontWeight: '700',
  },
  vipStartBtn: { backgroundColor: Colors.bgRaised, borderWidth: 1, borderColor: Colors.borderGlass },
});

