import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabuDeck } from '../types';

const KEY = '@friendgames_tabu_custom_decks_v1';

export async function loadTabuDecks(): Promise<TabuDeck[]> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    const decks = raw ? JSON.parse(raw) : [];
    return Array.isArray(decks) ? decks : [];
  } catch {
    return [];
  }
}

export async function saveTabuDeck(deck: TabuDeck): Promise<TabuDeck[]> {
  const decks = await loadTabuDecks();
  const next = [deck, ...decks.filter(existing => existing.id !== deck.id)];
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export async function removeTabuDeck(id: string): Promise<TabuDeck[]> {
  const next = (await loadTabuDecks()).filter(deck => deck.id !== id);
  await AsyncStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
