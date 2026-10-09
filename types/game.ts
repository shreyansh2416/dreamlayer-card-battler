export type GameState = 'START' | 'PLAYER_TURN' | 'ENEMY_TURN' | 'GAME_OVER';

export interface Card {
  id: string;
  name: string;
  cost: number;
  damage: number;
  healing: number;
  imageUrl: string | null;
}

export interface Player {
  health: number;
  maxHealth: number;
  energy: number;
  maxEnergy: number;
  hand: Card[];
  deck: Card[];
}

export interface Enemy {
  name: string;
  health: number;
  maxHealth: number;
  intent: 'ATTACK' | 'HEAL' | 'WAIT';
  nextMoveValue: number;
  imageUrl: string | null;
}