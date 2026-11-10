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

function supportsPlayerGroup(game: import('../types').Game, group: import('../types').GroupFilter) {
  if (group === 'all') return true;
  const min = Number(game.minPlayers);
  const max = Number(game.maxPlayers);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min < 1 || max < min) return false;

  const [groupMin, groupMax] = group === '1-2'
    ? [1, 2]
    : group === '3-4'
      ? [3, 4]
      : [5, Number.POSITIVE_INFINITY];

  // Keep games that support at least one player count inside the selected group.
  return min <= groupMax && max >= groupMin;
}

export function filterGames(
  games: import('../types').Game[],
  opts: {
    groupFilter: import('../types').GroupFilter;
    categoryFilter: import('../types').GameCategoryFilter;
    searchQuery: string;
  }
) {
  return games.filter(g => {
    // Group ranges overlap: e.g. a 2–12 player game is also playable by a group of 3–4.
    if (!supportsPlayerGroup(g, opts.groupFilter)) return false;

    // Category filter
    if (opts.categoryFilter === 'party-18' && !g.badges.some(badge => badge.label === '18+')) return false;
    if (opts.categoryFilter !== 'all' && opts.categoryFilter !== 'party-18' && g.category !== opts.categoryFilter) return false;

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
