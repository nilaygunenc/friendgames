import { View, Text, FlatList, TouchableOpacity } from '../ui';
import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { gamesData } from '../data/games';
import { useAppStore } from '../store/useAppStore';
import { Colors, Spacing, Radius, FontSize } from '../theme';
import { RootStackParamList, Game } from '../types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const { favorites, toggleFavorite } = useAppStore();

  const favGames = gamesData.filter(g => favorites.includes(g.id));

  if (favGames.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>❤️ Favorilerim</Text>
          <Text style={styles.subtitle}>Grubunuz için kaydedilen oyunlar</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🤍</Text>
          <Text style={styles.emptyText}>
            Henüz favori oyun eklemediniz.{'\n'}
            Bir oyun açıp ❤️ ikonuna basın.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>❤️ Favorilerim</Text>
        <Text style={styles.subtitle}>{favGames.length} oyun kaydedildi</Text>
      </View>
      <FlatList
        data={favGames}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}
            activeOpacity={0.8}
          >
            <Text style={styles.rowIcon}>{item.icon}</Text>
            <View style={styles.rowInfo}>
              <Text style={styles.rowName}>{item.name}</Text>
              <Text style={styles.rowMeta}>
                {item.minPlayers}-{item.maxPlayers} oyuncu · {item.minTime}-{item.maxTime} dk
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => toggleFavorite(item.id)}
              style={styles.unfavBtn}
            >
              <Text style={styles.unfavIcon}>❤️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: 56,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGlass,
  },
  title: { fontSize: FontSize.title, fontWeight: '800', color: Colors.textPrimary, marginBottom: 2 },
  subtitle: { fontSize: FontSize.md, color: Colors.textMuted },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.md, padding: 40 },
  emptyIcon: { fontSize: 48, opacity: 0.3 },
  emptyText: { fontSize: FontSize.md, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },

  list: { padding: Spacing.xl, paddingBottom: 90, gap: Spacing.sm },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderGlass,
    borderRadius: Radius.card,
    padding: Spacing.md,
  },
  rowIcon: { fontSize: 24 },
  rowInfo: { flex: 1 },
  rowName: { fontSize: FontSize.base, fontWeight: '700', color: Colors.textPrimary },
  rowMeta: { fontSize: 11, color: Colors.textMuted },
  unfavBtn: { padding: 4 },
  unfavIcon: { fontSize: 18 },
});

