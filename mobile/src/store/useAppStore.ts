import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameCategory, GroupFilter } from '../types';

export interface MatchRecord {
  id: string;
  gameId: string;
  gameName: string;
  participants: string[];
  winner: string;
  playedAt: string;
}

interface AppState {
  language: 'tr' | 'en';
  darkMode: boolean;
  setLanguage: (language: 'tr' | 'en') => void;
  toggleDarkMode: () => void;
  // Filters
  groupFilter: GroupFilter;
  categoryFilter: GameCategory | 'all';
  searchQuery: string;

  // VIP
  isVip: boolean;

  // Favorites
  favorites: string[];

  // Group
  groupSize: number;

  // Settings
  soundEnabled: boolean;
  keepScreenOn: boolean;
  playerNames: string[];
  matchHistory: MatchRecord[];

  // Actions
  setGroupFilter: (f: GroupFilter) => void;
  setCategoryFilter: (c: GameCategory | 'all') => void;
  setSearchQuery: (q: string) => void;
  toggleVip: () => void;
  toggleFavorite: (id: string) => void;
  setGroupSize: (n: number) => void;
  toggleSound: () => void;
  toggleKeepScreen: () => void;
  setPlayerNames: (names: string[]) => void;
  recordMatch: (match: Omit<MatchRecord, 'id' | 'playedAt'>) => void;
  clearMatchHistory: () => void;
}

export const useAppStore = create<AppState>()(persist((set, get) => ({
  language: 'tr',
  darkMode: true,
  setLanguage: language => set({ language }),
  toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
  groupFilter: 'all',
  categoryFilter: 'all',
  searchQuery: '',
  isVip: false,
  favorites: [],
  groupSize: 5,
  soundEnabled: true,
  keepScreenOn: true,
  playerNames: ['Oyuncu 1', 'Oyuncu 2', 'Oyuncu 3', 'Oyuncu 4', 'Oyuncu 5'],
  matchHistory: [],

  setGroupFilter: f => set({ groupFilter: f }),
  setCategoryFilter: c => set({ categoryFilter: c }),
  setSearchQuery: q => set({ searchQuery: q }),
  toggleVip: () => set(s => ({ isVip: !s.isVip })),

  toggleFavorite: id =>
    set(s => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter(f => f !== id)
        : [...s.favorites, id],
    })),

  setGroupSize: n => {
    const size = Math.max(1, Math.min(30, n));
    set({ groupSize: size, groupFilter: size <= 2 ? '1-2' : size <= 4 ? '3-4' : '5+' });
  },
  toggleSound: () => set(s => ({ soundEnabled: !s.soundEnabled })),
  toggleKeepScreen: () => set(s => ({ keepScreenOn: !s.keepScreenOn })),
  setPlayerNames: names => set({ playerNames: names.map((name, index) => name.trim() || `Oyuncu ${index + 1}`) }),
  recordMatch: match => set(s => ({ matchHistory: [{ ...match, id: `${Date.now()}-${Math.random()}`, playedAt: new Date().toISOString() }, ...s.matchHistory].slice(0, 50) })),
  clearMatchHistory: () => set({ matchHistory: [] }),
}), {
  name: 'friendgames-preferences-v1',
  storage: createJSONStorage(() => AsyncStorage),
  partialize: s => ({ favorites: s.favorites, groupSize: s.groupSize,
    soundEnabled: s.soundEnabled, keepScreenOn: s.keepScreenOn,
    language: s.language, darkMode: s.darkMode, playerNames: s.playerNames, matchHistory: s.matchHistory }),
}));
