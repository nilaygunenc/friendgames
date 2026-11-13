import AsyncStorage from '@react-native-async-storage/async-storage';
import { TabuCard, TabuCategory, TabuDifficulty } from '../types';
import { shuffleArray } from '../utils/gameEngine';

const STORAGE_KEY = '@friendgames_tabu_word_manager_v1';
const ALL_CATEGORIES: TabuCategory[] = ['sinema', 'teknoloji', 'günlük-yaşam', '90lar', 'doğa', 'spor', 'kültür', 'yemek', 'hayvanlar', 'diğer'];

interface WordState {
  drawnIds: string[];
  bags: Record<string, string[]>;
}

export function filterTabuCards(cards: TabuCard[], categories: TabuCategory[], difficulties: TabuDifficulty[]) {
  return cards.filter(card =>
    (!categories.length || categories.includes(card.category)) &&
    (!difficulties.length || difficulties.includes(card.difficulty)),
  );
}

/** Persistent Fisher–Yates shuffle bag. A card ID is consumed once per pool cycle. */
export class WordManager {
  private queue: Promise<void> = Promise.resolve();

  draw(cards: TabuCard[]): Promise<{ card: TabuCard; recycled: boolean }> {
    const result = this.queue.then(() => this.drawFromPool(cards));
    this.queue = result.then(() => undefined, () => undefined);
    return result;
  }

  private async drawFromPool(cards: TabuCard[]): Promise<{ card: TabuCard; recycled: boolean }> {
    if (!cards.length) throw new Error('Bu filtrelerle eşleşen kart bulunamadı.');
    const state = await this.readState();
    const ids = new Set(cards.map(card => card.id));
    const poolKey = [...ids].sort().join('|');
    const drawn = new Set(state.drawnIds);
    let bag = (state.bags[poolKey] ?? []).filter(id => ids.has(id) && !drawn.has(id));
    let recycled = false;

    if (!bag.length) {
      const unseen = cards.filter(card => !drawn.has(card.id));
      const candidates = unseen.length ? unseen : cards;
      if (!unseen.length) {
        ids.forEach(id => drawn.delete(id));
        recycled = true;
      }
      bag = shuffleArray(candidates).map(card => card.id);
    }

    const nextId = bag.shift()!;
    drawn.add(nextId);
    state.drawnIds = [...drawn];
    state.bags[poolKey] = bag;
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { card: cards.find(card => card.id === nextId)!, recycled };
  }

  private async readState(): Promise<WordState> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<WordState>;
        return { drawnIds: Array.isArray(parsed.drawnIds) ? parsed.drawnIds : [], bags: parsed.bags ?? {} };
      }
    } catch { /* Start with a fresh bag if local data is unreadable. */ }
    return { drawnIds: [], bags: {} };
  }
}

export const tabuCategories = ALL_CATEGORIES;
export const tabuDifficulties: TabuDifficulty[] = ['kolay', 'orta', 'zor', 'ekstrem'];
