import { View, Text, TouchableOpacity, ScrollView } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GameCategory, GroupFilter } from '../types';
import { Colors, Spacing, Radius, FontSize } from '../theme';

// ─── Group Size Filter ────────────────────────────────────────────────────────

interface GroupFilterProps {
  value: GroupFilter;
  onChange: (f: GroupFilter) => void;
}

const GROUP_OPTIONS: { label: string; value: GroupFilter; icon: string }[] = [
  { label: 'Tümü',   value: 'all', icon: '👥' },
  { label: '1-2 Kişi', value: '1-2', icon: '👤' },
  { label: '3-4 Kişi', value: '3-4', icon: '👥' },
  { label: '5+ Kişi',  value: '5+',  icon: '👨‍👩‍👧‍👦' },
];

export const GroupFilterBar: React.FC<GroupFilterProps> = ({ value, onChange }) => (
  <View style={gf.row}>
    {GROUP_OPTIONS.map(opt => (
      <TouchableOpacity
        key={opt.value}
        style={[gf.btn, value === opt.value && gf.btnActive]}
        onPress={() => onChange(opt.value)}
        activeOpacity={0.8}
      >
        <Text style={gf.icon}>{opt.icon}</Text>
        <Text style={[gf.label, value === opt.value && gf.labelActive]}>
          {opt.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const gf = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  btn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    alignItems: 'center',
    gap: 3,
  },
  btnActive: {
    backgroundColor: Colors.primaryDark,
    borderColor: 'transparent',
  },
  icon: { fontSize: 14 },
  label: { fontSize: 10, fontWeight: '600', color: Colors.textMuted },
  labelActive: { color: Colors.white },
});

// ─── Category Pills ───────────────────────────────────────────────────────────

interface CategoryProps {
  value: GameCategory | 'all';
  onChange: (c: GameCategory | 'all') => void;
}

const CATEGORY_OPTIONS: { label: string; value: GameCategory | 'all' }[] = [
  { label: '🎮 Tüm Oyunlar',       value: 'all' },
  { label: '🧊 Buz Kırıcılar',     value: 'buz-kirici' },
  { label: '🎭 Gizli Roller',       value: 'gizli-rol' },
  { label: '💬 Kelime & Anlatım',   value: 'kelime' },
  { label: '⭐ FriendGames Özel',   value: 'friendgames' },
];

export const CategoryPills: React.FC<CategoryProps> = ({ value, onChange }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={cp.container}
  >
    {CATEGORY_OPTIONS.map(opt => (
      <TouchableOpacity
        key={opt.value}
        style={[cp.pill, value === opt.value && cp.pillActive]}
        onPress={() => onChange(opt.value)}
        activeOpacity={0.8}
      >
        <Text style={[cp.pillText, value === opt.value && cp.pillTextActive]}>
          {opt.label}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const cp = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: 4,
    gap: Spacing.sm,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.pill,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  pillActive: {
    backgroundColor: 'rgba(99,102,241,0.2)',
    borderColor: Colors.primary,
  },
  pillText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textMuted },
  pillTextActive: { color: '#a5b4fc' },
});

