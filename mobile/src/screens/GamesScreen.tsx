import { View, Text, FlatList, TextInput, TouchableOpacity } from '../ui';
import React, { useCallback } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

import { GameCard } from '../components/GameCard';
import { GroupFilterBar, CategoryPills } from '../components/FilterBar';
import { Toast } from '../components/Toast';
import { LoadingSpinner } from '../components/LoadingSpinner';

import { useGames } from '../hooks/useGames';
import { useFavorites } from '../hooks/useFavorites';
import { useToast } from '../hooks/useToast';

import { useAppStore } from '../store/useAppStore';
import { Colors, Spacing, Radius, FontSize } from '../theme';
import { RootStackParamList, Game } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const GamesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const {
    groupFilter, setGroupFilter,
    categoryFilter, setCategoryFilter,
    searchQuery, setSearchQuery,
    isVip,
  } = useAppStore();

  const { games, isLoading } = useGames();
  const { favorites, toggle: toggleFav } = useFavorites();
  const toast = useToast();

  const handleGamePress = useCallback(
    (id: string) => navigation.navigate('GameDetail', { gameId: id }),
    [navigation]
  );

  const handleFavToggle = useCallback(
    (id: string) => {
      const willFav = !favorites.includes(id);
      toggleFav(id, false); // local only on games screen
      toast.show(willFav ? '❤️ Favorilere eklendi' : '💔 Favorilerden çıkarıldı');
    },
    [favorites, toggleFav, toast]
  );

  // ─── Sub-components ───────────────────────────────────────────────────────

  const renderHeader = () => (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          {/* Logo */}
          <LinearGradient
            colors={['#a78bfa', '#ec4899', '#f59e0b']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoBg}
          >
            <Text style={styles.logoText}>FriendGames</Text>
          </LinearGradient>

          <View style={styles.headerRight}>
            <LinearGradient
              colors={isVip ? ['#10B981', '#059669'] : ['#F59E0B', '#F97316']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.vipTag}
            >
              <Text style={styles.vipTagText}>{isVip ? '👑 VIP' : 'FREE'}</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Search bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Oyun ara..."
            placeholderTextColor={Colors.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <Text style={styles.filterLabel}>👥 KAÇ KİŞİSİNİZ?</Text>
      <GroupFilterBar value={groupFilter} onChange={setGroupFilter} />
      <CategoryPills value={categoryFilter} onChange={setCategoryFilter} />

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Oyunlar</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{games.length} oyun</Text>
        </View>
      </View>
    </>
  );

  const renderItem = useCallback(
    ({ item }: { item: Game }) => (
      <View style={styles.cardWrapper}>
        <GameCard
          game={item}
          isVip={isVip}
          isFavorite={favorites.includes(item.id)}
          onPress={() => handleGamePress(item.id)}
          onFavPress={() => handleFavToggle(item.id)}
        />
      </View>
    ),
    [isVip, favorites, handleGamePress, handleFavToggle]
  );

  const renderEmpty = () =>
    isLoading ? (
      <LoadingSpinner label="Oyunlar yükleniyor..." />
    ) : (
      <View style={styles.empty}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text style={styles.emptyText}>
          Bu kriterlere uygun oyun bulunamadı.{'\n'}Filtreleri değiştirmeyi deneyin.
        </Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <Toast message={toast.message} visible={toast.visible} />
      <FlatList
        data={games}
        keyExtractor={item => item.id}
        numColumns={2}
        ListHeaderComponent={renderHeader()}
        ListEmptyComponent={renderEmpty}
        renderItem={renderItem}
        contentContainerStyle={styles.gridContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },

  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: 4,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logoBg: { borderRadius: 4, paddingHorizontal: 2 },
  logoText: {
    fontSize: FontSize.title,
    fontWeight: '800',
    color: Colors.white,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  vipTag: {
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  vipTagText: { fontSize: FontSize.xs, fontWeight: '800', color: '#000' },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: Spacing.lg,
  },
  searchIcon: { fontSize: 14 },
  searchInput: { flex: 1, color: Colors.textPrimary, fontSize: 14 },
  clearBtn: { color: Colors.textMuted, fontSize: 13 },

  filterLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 1,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.sm,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  countBadge: {
    backgroundColor: Colors.bgGlass,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  countText: { fontSize: FontSize.sm, color: Colors.textMuted },

  gridContent: { paddingBottom: 100 },
  cardWrapper: { flex: 1, padding: Spacing.xs, paddingHorizontal: Spacing.sm },

  empty: { padding: 40, alignItems: 'center', gap: Spacing.md },
  emptyIcon: { fontSize: 36, opacity: 0.4 },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});


