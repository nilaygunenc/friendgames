/**
 * useGames
 * Oyun listesini backend'den veya local data'dan çeker.
 * V1'de network yoksa local fallback devreye girer.
 */
import { useState, useEffect, useCallback } from 'react';
import { GamesAPI, apiEnabled } from '../utils/api';
import { gamesData as localGames } from '../data/games';
import { useAppStore } from '../store/useAppStore';
import { filterGames } from '../utils/gameEngine';
import { Game } from '../types';
import { translate } from '../i18n';

function normalizeRemoteGame(value: Record<string, any>): Game {
  const parseArray = <T,>(input: unknown, fallback: T[]): T[] => {
    if (Array.isArray(input)) return input as T[];
    if (typeof input === 'string') {
      try {
        const parsed: unknown = JSON.parse(input);
        return Array.isArray(parsed) ? parsed as T[] : fallback;
      } catch { return fallback; }
    }
    return fallback;
  };

  return {
    ...value,
    id: String(value.id ?? ''),
    name: String(value.name ?? ''),
    icon: String(value.icon ?? '🎮'),
    category: value.category,
    categoryLabel: String(value.categoryLabel ?? value.category_label ?? ''),
    minPlayers: Number(value.minPlayers ?? value.min_players),
    maxPlayers: Number(value.maxPlayers ?? value.max_players),
    minTime: Number(value.minTime ?? value.min_time),
    maxTime: Number(value.maxTime ?? value.max_time),
    description: String(value.description ?? ''),
    vip: Boolean(value.vip ?? value.is_vip),
    engine: value.engine,
    badges: parseArray(value.badges, []),
    rules: parseArray(value.rules, []),
  } as Game;
}

interface UseGamesResult {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useGames(): UseGamesResult {
  const { groupFilter, categoryFilter, searchQuery, language } = useAppStore();
  const [allGames, setAllGames] = useState<Game[]>(localGames);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    if (!apiEnabled) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await GamesAPI.list();
      if (res.data?.games?.length) {
        setAllGames(res.data.games.map((game: Record<string, any>) => normalizeRemoteGame(game)));
      }
    } catch {
      // Silently fall back to local data — no network needed for V1
      setAllGames(localGames);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const games = filterGames(allGames.map(g => ({ ...g,
    name: translate(g.name, language), description: translate(g.description, language),
    categoryLabel: translate(g.categoryLabel, language),
  })), { groupFilter, categoryFilter, searchQuery });

  return { games, isLoading, error, refetch: fetchGames };
}
