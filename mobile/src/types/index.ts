export type GameCategory =
  | 'buz-kirici'
  | 'gizli-rol'
  | 'kelime'
  | 'friendgames';

export type GroupFilter = 'all' | '1-2' | '3-4' | '5+';

export interface Badge {
  label: string;
  color: 'green' | 'red' | 'purple' | 'gold' | 'pop';
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  category: GameCategory;
  categoryLabel: string;
  badges: Badge[];
  minPlayers: number;
  maxPlayers: number;
  minTime: number;
  maxTime: number;
  description: string;
  vip: boolean;
  rules: string[];
  engine: 'vampir' | 'mafia-lite' | 'agent' | 'mime' | 'tabu' | 'buz-kirici' | 'mystery' | 'everyone' | 'legal' | 'fingers' | 'auction';
}

export interface VampirRole {
  name: string;
  emoji: string;
  colorKey: 'vampir' | 'koylu' | 'doktor' | 'komiser';
  description: string;
}

export interface TabuCard {
  main: string;
  banned: string[];
}

export type RootStackParamList = {
  Main: { screen: keyof BottomTabParamList } | undefined;
  GameDetail: { gameId: string };
  GamePlay: { gameId: string };
};

export type BottomTabParamList = {
  Games: undefined;
  Favorites: undefined;
  VIP: undefined;
  Settings: undefined;
};
