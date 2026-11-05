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
        setAllGames(res.data.games);
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
