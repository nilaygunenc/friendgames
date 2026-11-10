export const Colors = {
  bgDeep: '#111820',
  bgCard: '#1B252F',
  bgRaised: '#26333F',
  bgGlass: 'rgba(255,255,255,0.035)',
  borderGlass: 'rgba(210,222,232,0.11)',

  primary: '#8FA8B8',
  primaryDark: '#526B7C',
  primaryGlow: '#B5C7D2',

  accentGreen: '#8FB5A3',
  accentGold: '#C9B995',
  accentRed: '#C98989',
  accentOrange: '#C49A78',

  textPrimary: '#E8EDF1',
  textMuted: '#9BA8B3',

  white: '#F5F7F9',
  black: '#111820',
} as const;

export const Gradients = {
  primary: ['#526B7C', '#718A9A'] as [string, string],
  logo: ['#718A9A', '#526B7C', '#415765'] as [string, string, string],
  vip: ['#C9B995', '#A79775'] as [string, string],
  green: ['#8FB5A3', '#688A7A'] as [string, string],
  card: ['rgba(210,222,232,0.045)', 'transparent'] as [string, string],
} as const;
