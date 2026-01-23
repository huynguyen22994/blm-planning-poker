export type PlayerRole = 'host' | 'player' | 'spectator';

export type CardValue =
  | '0'
  | '1'
  | '2'
  | '3'
  | '5'
  | '8'
  | '13'
  | '21'
  | '34'
  | '55'
  | '89'
  | '?'
  | '☕';

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  vote: CardValue | null;
  hasVoted: boolean;
}

export interface Room {
  id: string;
  name: string;
  hostId: string;
  players: Player[];
  isRevealed: boolean;
  currentRound: number;
}
