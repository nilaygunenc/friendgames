import { View, Text, TouchableOpacity, ScrollView } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { GameCategoryFilter, GroupFilter } from '../types';
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
  value: GameCategoryFilter;
  onChange: (c: GameCategoryFilter) => void;
}

const CATEGORY_OPTIONS: { label: string; icon: string; value: GameCategoryFilter }[] = [
  { label: 'Tüm Oyunlar', icon: '🎲', value: 'all' },
  { label: 'Buz Kırıcılar', icon: '🧊', value: 'buz-kirici' },
  { label: 'Gizli Roller', icon: '🕵️', value: 'gizli-rol' },
  { label: 'Kelime & Anlatım', icon: '🎤', value: 'kelime' },
  { label: 'FriendGames Özel', icon: '🌟', value: 'friendgames' },
  { label: 'Parti Modu 18+', icon: '🍷', value: 'party-18' },
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
        <Text style={cp.pillIcon}>{opt.icon}</Text>
        <Text style={[cp.pillText, value === opt.value && cp.pillTextActive]}>{opt.label}</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
  },
  pillActive: {
    backgroundColor: 'rgba(143,168,184,0.20)',
    borderColor: Colors.primary,
  },
  pillIcon: { fontSize: 14 },
  pillText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textMuted },
  pillTextActive: { color: Colors.textPrimary },
});

