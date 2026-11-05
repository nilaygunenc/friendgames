/**
 * useFavorites
 * Favori toggle işlemini önce local store'a yazar,
 * kullanıcı giriş yaptıysa arka planda API'ya da senkronize eder.
 */
import { useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { UserAPI } from '../utils/api';

interface UseFavoritesResult {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string, isLoggedIn: boolean) => Promise<void>;
}

export function useFavorites(): UseFavoritesResult {
  const { favorites, toggleFavorite } = useAppStore();

  const isFavorite = useCallback(
    (id: string) => favorites.includes(id),
    [favorites]
  );

  const toggle = useCallback(
    async (id: string, isLoggedIn: boolean) => {
      toggleFavorite(id); // optimistic update
      if (isLoggedIn) {
        try {
          await UserAPI.toggleFavorite(id);
        } catch {
          // Revert on network error
          toggleFavorite(id);
        }
      }
    },
    [toggleFavorite]
  );

  return { favorites, isFavorite, toggle };
}
