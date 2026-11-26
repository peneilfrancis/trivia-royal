export type Card = {
  question: string;
  answer: string;
  image?: string;
};

export type Game = {
  id: string;
  name: string;
  theme: string;
  categories: [string, string, string, string];
  cards: Card[]; // 20 items. index = row * 4 + column. points = (row + 1) * 100
  updatedAt: number;
};

export type Team = {
  id: string;
  name: string;
  color: string;
  score: number;
};

export type Session = {
  gameId: string;
  teams: Team[];
  used: boolean[]; // 20 items
  step: number;
  undo: { teamId: string; delta: number }[];
};

export const TEAM_COLORS = [
  { name: 'Blue', hex: '#00A3F5' },
  { name: 'Red', hex: '#E81A08' },
  { name: 'Green', hex: '#7DBA00' },
  { name: 'Gold', hex: '#FFB900' },
  { name: 'Purple', hex: '#7B3FE4' },
  { name: 'Teal', hex: '#0FA3A3' },
] as const;
