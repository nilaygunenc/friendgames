export interface User {
  id: string;
  email: string;
  display_name: string;
  is_vip: boolean;
  vip_expires_at: Date | null;
  created_at: Date;
}

export interface Game {
  id: string;
  name: string;
  icon: string;
  category: string;
  category_label: string;
  min_players: number;
  max_players: number;
  min_time: number;
  max_time: number;
  description: string;
  is_vip: boolean;
  engine: string;
  rules: string[];
  badges: { label: string; color: string }[];
}

export interface JwtPayload {
  userId: string;
  email: string;
  isVip: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
