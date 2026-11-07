import { VampirRole } from '../types';

// ─── Vampir Role Engine ───────────────────────────────────────────────────────

const vampirRoles: VampirRole[] = [
  {
    name: 'Vampir',
    emoji: '🧛',
    colorKey: 'vampir',
    description: 'Her gece bir kurban seçersin. Kimliğini saklaman gerekiyor.',
  },
  {
    name: 'Köylü',
    emoji: '🧑‍🌾',
    colorKey: 'koylu',
    description: 'Gündüz tartışarak vampirleri bulmalısın.',
  },
  {
    name: 'Doktor',
    emoji: '👨‍⚕️',
    colorKey: 'doktor',
    description: 'Her gece birini koruyabilirsin. Kendini de seçebilirsin.',
  },
  {
    name: 'Komiser',
    emoji: '🕵️',
    colorKey: 'komiser',
    description:
      'Her gece bir kişinin vampir olup olmadığını öğrenebilirsin.',
  },
];

export function buildRoleDeck(playerCount: number, options: { includeDoctor?: boolean } = {}): VampirRole[] {
  if (!Number.isInteger(playerCount) || playerCount < 5 || playerCount > 20) {
    throw new RangeError('Oyuncu sayısı 5–20 arasında olmalı.');
  }
  const roles: VampirRole[] = [];
  const vampCount = Math.max(1, Math.floor(playerCount / 4));

  for (let i = 0; i < vampCount; i++) roles.push({ ...vampirRoles[0] }); // Vampir
  if (options.includeDoctor !== false) roles.push({ ...vampirRoles[2] }); // Doktor
  if (playerCount >= 7) roles.push({ ...vampirRoles[3] });              // Komiser
  while (roles.length < playerCount) roles.push({ ...vampirRoles[1] }); // Köylü

  return shuffleArray(roles);
}

// ─── Generic utils ────────────────────────────────────────────────────────────

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function filterGames(
  games: import('../types').Game[],
  opts: {
    groupFilter: import('../types').GroupFilter;
    categoryFilter: import('../types').GameCategory | 'all';
    searchQuery: string;
  }
) {
  return games.filter(g => {
    // Group filter
    if (opts.groupFilter !== 'all') {
      if (opts.groupFilter === '1-2' && g.minPlayers > 2) return false;
      if (
        opts.groupFilter === '3-4' &&
        (g.minPlayers > 4 || g.maxPlayers < 3)
      )
        return false;
      if (opts.groupFilter === '5+' && g.maxPlayers < 5) return false;
    }

    // Category filter
    if (opts.categoryFilter !== 'all' && g.category !== opts.categoryFilter)
      return false;

    // Search
    if (opts.searchQuery) {
      const q = opts.searchQuery.trim().toLocaleLowerCase('tr-TR');
      if (
        !g.name.toLocaleLowerCase('tr-TR').includes(q) &&
        !g.description.toLocaleLowerCase('tr-TR').includes(q) &&
        !g.categoryLabel.toLocaleLowerCase('tr-TR').includes(q)
      )
        return false;
    }

    return true;
  });
}
