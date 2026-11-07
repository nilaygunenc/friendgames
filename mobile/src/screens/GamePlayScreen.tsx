import React from 'react';
import { StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View, Text, ScrollView, TouchableOpacity } from '../ui';
import { gamesData } from '../data/games';
import { RootStackParamList } from '../types';
import { GameEngine } from '../components/GameEngine';
import { Colors, Spacing, FontSize } from '../theme';

type RouteP = RouteProp<RootStackParamList, 'GamePlay'>;

export function GamePlayScreen() {
  const { params } = useRoute<RouteP>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const game = gamesData.find(item => item.id === params.gameId);
  if (!game) return null;
  return <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Text style={styles.backText}>← Oyun detayları</Text></TouchableOpacity>
      <View style={styles.titleRow}><Text style={styles.icon}>{game.icon}</Text><Text style={styles.title}>{game.name}</Text></View>
    </View>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <GameEngine game={game} />
      <View style={{ height: 50 }} />
    </ScrollView>
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bgDeep },
  header: { paddingTop: 52, paddingHorizontal: Spacing.xl, paddingBottom: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.borderGlass },
  back: { alignSelf: 'flex-start', paddingVertical: 5 }, backText: { color: Colors.primary, fontSize: FontSize.base, fontWeight: '700' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 9, marginTop: 9 }, icon: { fontSize: 25 }, title: { color: Colors.textPrimary, fontSize: FontSize.lg, fontWeight: '800', flex: 1 },
  content: { paddingBottom: 30 },
});
