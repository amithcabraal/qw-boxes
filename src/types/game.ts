export type Player = 1 | 2;
export type GameMode = 'vs-computer' | 'vs-human';
export type GameStatus = 'not-started' | 'playing' | 'finished';

export interface Line {
  row: number;
  col: number;
  isHorizontal: boolean;
  player?: Player;
}

export interface Box {
  row: number;
  col: number;
  owner?: Player;
}

export interface GameState {
  mode: GameMode;
  status: GameStatus;
  currentPlayer: Player;
  lines: Line[];
  boxes: Box[];
  scores: {
    player1: number;
    player2: number;
  };
}