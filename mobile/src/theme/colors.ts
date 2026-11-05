export const Colors = {
  bgDeep: '#0B0D17',
  bgCard: '#141829',
  bgGlass: 'rgba(255,255,255,0.05)',
  borderGlass: 'rgba(255,255,255,0.08)',

  primary: '#6366F1',
  primaryDark: '#7928CA',
  primaryGlow: '#FF0080',

  accentGreen: '#10B981',
  accentGold: '#F59E0B',
  accentRed: '#EF4444',
  accentOrange: '#F97316',

  textPrimary: '#F1F5F9',
  textMuted: '#94A3B8',

  white: '#FFFFFF',
  black: '#000000',
} as const;

export const Gradients = {
  primary: ['#7928CA', '#6366F1'] as [string, string],
  logo: ['#a78bfa', '#ec4899', '#f59e0b'] as [string, string, string],
  vip: ['#F59E0B', '#F97316'] as [string, string],
  green: ['#10B981', '#059669'] as [string, string],
  card: ['rgba(255,255,255,0.03)', 'transparent'] as [string, string],
} as const;
