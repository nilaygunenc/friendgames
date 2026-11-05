import { View, Text, TouchableOpacity } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Game } from '../types';
import { Colors, Spacing, Radius, FontSize } from '../theme';

interface Props {
  game: Game;
  isVip: boolean;
  isFavorite: boolean;
  onPress: () => void;
  onFavPress?: () => void;
}

const BADGE_STYLES: Record<string, { bg: string; text: string }> = {
  green:  { bg: 'rgba(16,185,129,0.15)', text: Colors.accentGreen },
  red:    { bg: 'rgba(239,68,68,0.15)',  text: Colors.accentRed },
  purple: { bg: 'rgba(99,102,241,0.15)', text: '#a5b4fc' },
  gold:   { bg: 'rgba(245,158,11,0.15)', text: Colors.accentGold },
  pop:    { bg: 'rgba(236,72,153,0.15)', text: '#f9a8d4' },
};

const CATEGORY_BORDER: Record<string, string> = {
  'buz-kirici':  Colors.accentGreen,
  'gizli-rol':   Colors.accentRed,
  'kelime':      Colors.primary,
  'friendgames': Colors.accentGold,
};

export const GameCard: React.FC<Props> = ({
  game,
  isVip,
  isFavorite,
  onPress,
  onFavPress,
}) => {
  const isLocked = game.vip && !isVip;
  const borderColor = CATEGORY_BORDER[game.category] ?? Colors.primary;

  return (
    <TouchableOpacity
      style={[styles.card, { borderTopColor: borderColor, borderTopWidth: 2 }]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Top row: icon + badges */}
      <View style={styles.cardTop}>
        <Text style={styles.icon}>{game.icon}</Text>
        <View style={styles.topRight}>
          {isLocked && (
            <LinearGradient
              colors={['#F59E0B', '#F97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.vipBadge}
            >
              <Text style={styles.vipBadgeText}>👑 VIP</Text>
            </LinearGradient>
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
        <LinearGradient
          colors={isLocked ? ['#F59E0B', '#F97316'] : ['#7928CA', '#6366F1']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.startBtn}
        >
          <Text style={[styles.startBtnText, isLocked && { color: '#000' }]}>
            {isLocked ? '🔒 VIP Kilidi Aç' : '▶ Nasıl Oynanır'}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.card,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    margin: Spacing.xs,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  topRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: { fontSize: 26 },
  vipBadge: {
    borderRadius: Radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  vipBadgeText: { fontSize: 9, fontWeight: '800', color: '#000' },
  favIcon: { fontSize: 14 },

  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: Spacing.xs,
  },
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 9, fontWeight: '700' },

  name: {
    fontSize: FontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  desc: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
    marginBottom: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
    flexWrap: 'wrap',
  },
  metaItem: { fontSize: 10, color: Colors.textMuted },

  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderGlass,
    paddingTop: Spacing.sm,
  },
  startBtn: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  startBtnText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },
});

